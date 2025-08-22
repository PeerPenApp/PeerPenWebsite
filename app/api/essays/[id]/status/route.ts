import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function PATCH(
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
    const { status } = body;

    if (!status || !['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be draft, published, or archived' }, { status: 400 });
    }

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

    // Completely disable all FTS triggers to avoid SQLite errors
    try {
      await db.execute({ sql: 'DROP TRIGGER IF EXISTS essays_ai', args: [] });
      await db.execute({ sql: 'DROP TRIGGER IF EXISTS essays_au', args: [] });
      await db.execute({ sql: 'DROP TRIGGER IF EXISTS essays_ad', args: [] });
      console.log('Dropped all FTS triggers to avoid SQLite errors');
    } catch (error) {
      console.log('Could not drop triggers:', error);
    }

    // Simple status update - now should work without trigger interference
    await db.execute({
      sql: `UPDATE essays SET status = ? WHERE id = ?`,
      args: [status, id]
    });

    console.log(`Essay ${id} status updated to: ${status} (FTS triggers disabled)`);

    console.log(`Essay ${id} status updated to: ${status}`);

    return NextResponse.json({ 
      success: true, 
      status: status,
      message: `Essay status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating essay status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
