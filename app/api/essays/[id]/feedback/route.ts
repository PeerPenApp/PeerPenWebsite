import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { ensureUserProfile } from '@/lib/profile-utils';

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

    // Ensure user profile exists with correct Clerk data
    await ensureUserProfile(userId);

    // Check if essay exists and user has access
    const essayResult = await db.execute({
      sql: `SELECT author_id, visibility FROM essays WHERE id = ? AND is_deleted = 0`,
      args: [id]
    });

    if (essayResult.rows.length === 0) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const essay = essayResult.rows[0];
    
    // Only allow access if user owns the essay or it's public
    if (essay.author_id !== userId && essay.visibility !== 'public') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch feedback for this essay
    const feedbackSql = `
      SELECT 
        f.id, f.essay_id, f.author_id, f.provider, f.model_name, 
        f.general_comment, f.created_at
      FROM feedback f
      WHERE f.essay_id = ?
      ORDER BY f.created_at DESC
    `;
    
    const feedbackResult = await db.execute({ sql: feedbackSql, args: [id] });
    
    const feedback = feedbackResult.rows.map(row => ({
      id: row.id,
      essay_id: row.essay_id,
      author_id: row.author_id,
      provider: row.provider,
      model_name: row.model_name,
      general_comment: row.general_comment,
      created_at: row.created_at
    }));

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Feedback fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
