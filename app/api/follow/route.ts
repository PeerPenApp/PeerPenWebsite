import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { followeeId } = body;

    if (!followeeId) {
      return NextResponse.json({ error: 'Followee ID is required' }, { status: 400 });
    }

    if (userId === followeeId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Check if followee exists
    const followeeResult = await db.execute({
      sql: `SELECT id FROM profiles WHERE id = ?`,
      args: [followeeId]
    });

    if (followeeResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Ensure both user profiles exist
    await ensureUserProfile(userId);
    await ensureUserProfile(followeeId);

    // Check if follow relationship already exists
    const existingFollow = await db.execute({
      sql: `SELECT follower_id FROM follows WHERE follower_id = ? AND followee_id = ?`,
      args: [userId, followeeId]
    });

    if (existingFollow.rows.length > 0) {
      return NextResponse.json({ error: 'Already following this user' }, { status: 400 });
    }

    // Create follow relationship
    await db.execute({
      sql: `INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)`,
      args: [userId, followeeId]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully followed user' 
    });

  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json({ 
      error: 'Failed to follow user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const followeeId = searchParams.get('followeeId');

    if (!followeeId) {
      return NextResponse.json({ error: 'Followee ID is required' }, { status: 400 });
    }

    if (userId === followeeId) {
      return NextResponse.json({ error: 'Cannot unfollow yourself' }, { status: 400 });
    }

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Remove follow relationship
    const result = await db.execute({
      sql: `DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`,
      args: [userId, followeeId]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Not following this user' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unfollowed user' 
    });

  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ 
      error: 'Failed to unfollow user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const followeeId = searchParams.get('followeeId');

    if (!followeeId) {
      return NextResponse.json({ error: 'Followee ID is required' }, { status: 400 });
    }

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Check if following
    const followResult = await db.execute({
      sql: `SELECT follower_id FROM follows WHERE follower_id = ? AND followee_id = ?`,
      args: [userId, followeeId]
    });

    const isFollowing = followResult.rows.length > 0;

    return NextResponse.json({ 
      isFollowing,
      followerId: userId,
      followeeId
    });

  } catch (error) {
    console.error('Follow status error:', error);
    return NextResponse.json({ 
      error: 'Failed to check follow status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
