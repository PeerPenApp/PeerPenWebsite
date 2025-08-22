import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { nanoid } from 'nanoid';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Ensure user profile exists with correct Clerk data
    await ensureUserProfile(userId);

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Check if essay exists and is public
    const essayResult = await db.execute({
      sql: `SELECT id, visibility FROM essays WHERE id = ?`,
      args: [id]
    });

    if (essayResult.rows.length === 0) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const essay = essayResult.rows[0];
    if (essay.visibility !== 'public') {
      return NextResponse.json({ error: 'Cannot comment on private essays' }, { status: 403 });
    }

    // If this is a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await db.execute({
        sql: `SELECT id FROM comments WHERE id = ? AND essay_id = ?`,
        args: [parentId, id]
      });

      if (parentComment.rows.length === 0) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
    }

    const commentId = nanoid();
    await db.execute({
      sql: `INSERT INTO comments (id, essay_id, author_id, body, parent_id) VALUES (?, ?, ?, ?, ?)`,
      args: [commentId, id, userId, content.trim(), parentId || null]
    });

    return NextResponse.json({ 
      success: true,
      comment: { id: commentId, content: content.trim(), parentId }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Check if essay exists and is public
    const essayResult = await db.execute({
      sql: `SELECT id, visibility FROM essays WHERE id = ?`,
      args: [id]
    });

    if (essayResult.rows.length === 0) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const essay = essayResult.rows[0];
    if (essay.visibility !== 'public') {
      return NextResponse.json({ error: 'Cannot view comments on private essays' }, { status: 403 });
    }

    // Get all comments for this essay
    const commentsResult = await db.execute({
      sql: `
        SELECT 
          c.id, c.body, c.parent_id, c.created_at, c.edited_at,
          p.display_name, p.username
        FROM comments c
        LEFT JOIN profiles p ON c.author_id = p.id
        WHERE c.essay_id = ? AND c.is_deleted = 0
        ORDER BY c.created_at ASC
      `,
      args: [id]
    });

    const comments = commentsResult.rows.map(row => ({
      id: row.id,
      content: row.body,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.edited_at,
      author: row.display_name || row.username || 'Anonymous'
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
