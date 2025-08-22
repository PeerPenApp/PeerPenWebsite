import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; feedbackId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, feedbackId } = await params;

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

    // Fetch evaluation scores for this feedback
    const scoresSql = `
      SELECT 
        es.feedback_id, es.flow, es.hook, es.voice, es.uniqueness, 
        es.conciseness, es.authenticity, es.overall
      FROM evaluation_scores es
      WHERE es.feedback_id = ?
    `;
    
    const scoresResult = await db.execute({ sql: scoresSql, args: [feedbackId] });
    
    if (scoresResult.rows.length === 0) {
      return NextResponse.json({ scores: null });
    }

    const scores = scoresResult.rows[0];
    
    const evaluationScores = {
      feedback_id: scores.feedback_id,
      flow: Number(scores.flow),
      hook: Number(scores.hook),
      voice: Number(scores.voice),
      uniqueness: Number(scores.uniqueness),
      conciseness: Number(scores.conciseness),
      authenticity: Number(scores.authenticity),
      overall: scores.overall ? Number(scores.overall) : null
    };

    return NextResponse.json({ scores: evaluationScores });
  } catch (error) {
    console.error("Evaluation scores fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch evaluation scores" }, { status: 500 });
  }
}
