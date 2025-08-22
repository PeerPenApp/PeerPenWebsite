import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { nanoid } from 'nanoid';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Ensure user profile exists with correct Clerk data
    await ensureUserProfile(userId);

    const body = await request.json();
    const { title, college, prompt, content, visibility = 'public' } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const essayId = nanoid();

    const result = await db.execute({
      sql: `INSERT INTO essays (id, author_id, title, content, word_count, college, prompt, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [essayId, userId, title, content, wordCount, college || null, prompt || null, visibility]
    });

    return NextResponse.json({ 
      success: true, 
      essay: { id: essayId, title, college, prompt, content, wordCount, status: 'draft', visibility }
    });
  } catch (error) {
    console.error('Error creating essay:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const includePublic = searchParams.get('includePublic') === 'true';
    const { userId } = await auth();

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    let userEssays: any[] = [];
    
    // Only fetch user essays if authenticated
    if (userId) {
      let sql = `SELECT * FROM essays WHERE author_id = ?`;
      let args = [userId];

      if (status !== 'all') {
        sql += ` AND status = ?`;
        args.push(status);
      }

      sql += ` ORDER BY updated_at DESC`;

      const result = await db.execute({ sql, args });
      userEssays = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        wordCount: row.word_count,
        college: row.college,
        prompt: row.prompt,
        status: row.status,
        visibility: row.visibility,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }

    // If including public essays, fetch them (no auth required)
    if (includePublic) {
      const publicSql = `
        SELECT e.*, 
               COUNT(DISTINCT r.id) as rating_count,
               AVG(r.score) as avg_rating,
               COUNT(DISTINCT c.id) as comment_count
        FROM essays e
        LEFT JOIN ratings r ON e.id = r.essay_id
        LEFT JOIN comments c ON e.id = c.essay_id
        WHERE e.visibility = 'public' AND e.status = 'published'
        GROUP BY e.id
        ORDER BY e.updated_at DESC
      `;
      
      const publicResult = await db.execute({ sql: publicSql, args: [] });
      const publicEssays = publicResult.rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        wordCount: row.word_count,
        college: row.college,
        prompt: row.prompt,
        status: row.status,
        visibility: row.visibility,
        ratingCount: Number(row.rating_count),
        avgRating: row.avg_rating ? Number(row.avg_rating) : 0,
        commentCount: Number(row.comment_count),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return NextResponse.json({ 
        essays: [...userEssays, ...publicEssays],
        userEssays: userEssays,
        publicEssays: publicEssays
      });
    }

    // If not authenticated and not requesting public essays, return empty array
    if (!userId) {
      return NextResponse.json({ essays: [] });
    }

    return NextResponse.json({ essays: userEssays });
  } catch (error) {
    console.error('Error fetching essays:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
