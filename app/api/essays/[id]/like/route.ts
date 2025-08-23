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
      return NextResponse.json({ error: 'Cannot rate private essays' }, { status: 403 });
    }

    const body = await request.json();
    const { score } = body;

    // Allow score to be 0 (remove rating) or between 1-5
    if (score !== 0 && (score < 1 || score > 5)) {
      return NextResponse.json({ error: 'Score must be 0 (remove rating) or between 1 and 5' }, { status: 400 });
    }

    // Check if user already rated this essay
    const existingRating = await db.execute({
      sql: `SELECT id FROM ratings WHERE essay_id = ? AND rater_id = ?`,
      args: [id, userId]
    });

    if (existingRating.rows.length > 0) {
      if (score === 0) {
        // Remove existing rating
        await db.execute({
          sql: `DELETE FROM ratings WHERE essay_id = ? AND rater_id = ?`,
          args: [id, userId]
        });

        return NextResponse.json({ 
          success: true, 
          rated: false,
          score: 0,
          message: 'Rating removed successfully'
        });
      } else {
        // Update existing rating
        await db.execute({
          sql: `UPDATE ratings SET score = ? WHERE essay_id = ? AND rater_id = ?`,
          args: [score, id, userId]
        });

        return NextResponse.json({ 
          success: true, 
          rated: true,
          score: score,
          message: 'Rating updated successfully'
        });
      }
    } else {
      if (score === 0) {
        return NextResponse.json({ 
          success: true, 
          rated: false,
          score: 0,
          message: 'No rating to remove'
        });
      } else {
        // Create new rating
        const ratingId = nanoid();
        await db.execute({
          sql: `INSERT INTO ratings (id, essay_id, rater_id, score) VALUES (?, ?, ?, ?)`,
          args: [ratingId, id, userId, score]
        });

        return NextResponse.json({ 
          success: true, 
          rated: true,
          score: score,
          message: 'Essay rated successfully'
        });
      }
    }
  } catch (error) {
    console.error('Error rating essay:', error);
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

    // Get rating count and whether current user rated it
    const ratingCountResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM ratings WHERE essay_id = ?`,
      args: [id]
    });

    const userRatingResult = await db.execute({
      sql: `SELECT score FROM ratings WHERE essay_id = ? AND rater_id = ?`,
      args: [id, userId]
    });

    const avgRatingResult = await db.execute({
      sql: `SELECT AVG(score) as avg_score FROM ratings WHERE essay_id = ?`,
      args: [id]
    });

    const ratingCount = ratingCountResult.rows[0]?.count || 0;
    const userRating = userRatingResult.rows.length > 0 ? userRatingResult.rows[0].score : null;
    const avgRating = avgRatingResult.rows[0]?.avg_score || 0;

    return NextResponse.json({ 
      ratingCount: Number(ratingCount),
      userRating: userRating ? Number(userRating) : null,
      avgRating: Number(avgRating)
    });
  } catch (error) {
    console.error('Error getting rating status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
