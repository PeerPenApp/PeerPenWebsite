import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

// Get all essays (public ones for feed, user's own for profile)
export const GET: APIRoute = async ({ request, url }) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const publicOnly = searchParams.get('public') === 'true';

    let sql: string;
    let args: any[];

    if (userId) {
      // Get user's own essays
      sql = 'SELECT e.*, u.handle as author_handle, u.display_name as author_name FROM essays e JOIN users u ON e.author_id = u.id WHERE e.author_id = ? ORDER BY e.updated_at DESC';
      args = [userId];
    } else if (publicOnly) {
      // Get only public essays for feed
      sql = 'SELECT e.*, u.handle as author_handle, u.display_name as author_name FROM essays e JOIN users u ON e.author_id = u.id WHERE e.is_public = 1 ORDER BY e.updated_at DESC LIMIT 50';
      args = [];
    } else {
      // Get all essays (admin view)
      sql = 'SELECT e.*, u.handle as author_handle, u.display_name as author_name FROM essays e JOIN users u ON e.author_id = u.id ORDER BY e.updated_at DESC LIMIT 100';
      args = [];
    }

    const result = await db.execute({ sql, args });
    
    return new Response(JSON.stringify({ 
      essays: result.rows,
      count: result.rows.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get essays error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch essays' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Create new essay
export const POST: APIRoute = async ({ request }) => {
  try {
    const { 
      title, 
      content, 
      prompt, 
      applicationType, 
      targetMajor, 
      targetProgram, 
      isPublic 
    } = await request.json();

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the first user from the database (in production, get from session)
    const userResult = await db.execute({
      sql: 'SELECT id FROM users LIMIT 1',
      args: []
    });

    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'No users found in database' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = userResult.rows[0].id;
    
    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length;
    
    const essayId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Create essay with college-specific fields
    const essayResult = await db.execute({
      sql: `INSERT INTO essays (
        id, author_id, title, content, prompt, application_type, 
        target_major, target_program, word_count, is_public, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        essayId, userId, title, content, prompt || null, 
        applicationType || 'commonapp', targetMajor || null, targetProgram || null, 
        wordCount, isPublic || false, now, now
      ]
    });

    if (essayResult.rowsAffected !== 1) {
      throw new Error('Failed to create essay');
    }

    return new Response(JSON.stringify({ 
      success: true,
      essay: { 
        id: essayId, 
        title, 
        content,
        prompt,
        applicationType: applicationType || 'commonapp',
        targetMajor,
        targetProgram,
        wordCount,
        isPublic: isPublic || false,
        authorId: userId 
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create essay error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create essay' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


