import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function PUT(
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
    const { title, college, prompt, content, status, visibility } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const wordCount = content.trim().split(/\s+/).length;

    // Check if user owns this essay
    const checkResult = await db.execute({
      sql: `SELECT author_id FROM essays WHERE id = ?`,
      args: [id]
    });

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    if (checkResult.rows[0].author_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fix broken FTS triggers if they exist
    try {
      await db.execute({ sql: 'DROP TRIGGER IF EXISTS essays_au', args: [] });
      await db.execute({ 
        sql: `CREATE TRIGGER essays_au AFTER UPDATE ON essays BEGIN 
          INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id) VALUES('delete', old.rowid, old.title, old.content, old.id); 
          INSERT INTO essay_fts(rowid, title, content, essay_id) VALUES (new.rowid, new.title, new.content, new.id); 
        END;`, 
        args: [] 
      });
    } catch (error) {
      console.log('Could not fix triggers, continuing with update...');
    }

    // Update the essay
    const updateResult = await db.execute({
      sql: `UPDATE essays SET title = ?, college = ?, prompt = ?, content = ?, word_count = ?, status = ?, visibility = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [title, college || null, prompt || null, content, wordCount, status || 'draft', visibility || 'public', id]
    });

    console.log('Update successful, rows affected:', updateResult.rowsAffected);

    return NextResponse.json({ 
      success: true, 
      essay: { 
        id, 
        title, 
        college, 
        prompt, 
        content, 
        wordCount, 
        status: status || 'draft', 
        visibility: visibility || 'public' 
      }
    });
  } catch (error) {
    console.error('Error updating essay:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    // Check if user owns this essay
    const checkResult = await db.execute({
      sql: `SELECT author_id FROM essays WHERE id = ?`,
      args: [id]
    });

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    if (checkResult.rows[0].author_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete by setting is_deleted flag
    const result = await db.execute({
      sql: `UPDATE essays SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [id]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Essay deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting essay:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
