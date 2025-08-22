import { type NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { ensureUserProfile } from '@/lib/profile-utils';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
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

    // Get or create user profile
    const userProfile = await ensureUserProfile(userId);

    // Get user stats
    const statsResult = await db.execute({
      sql: `
        SELECT 
          COUNT(DISTINCT e.id) as essays_count,
          COALESCE(COUNT(DISTINCT f.follower_id), 0) as followers_count,
          COALESCE(COUNT(DISTINCT f2.followee_id), 0) as following_count,
          COALESCE(AVG(r.score), 0) as avg_rating
        FROM profiles p
        LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0
        LEFT JOIN follows f ON p.id = f.followee_id
        LEFT JOIN follows f2 ON p.id = f2.follower_id
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE p.id = ?
      `,
      args: [userId]
    });

    const stats = statsResult.rows[0];

    return NextResponse.json({
      profile: {
        id: userProfile.id,
        username: userProfile.username,
        displayName: userProfile.displayName,
        bio: userProfile.bio,
        avatarUrl: userProfile.imageUrl,
        email: userProfile.email,
        createdAt: userProfile.createdAt || new Date().toISOString(),
        isVerified: userProfile.isVerified || false
      },
      stats: {
        essaysCount: Number(stats.essays_count),
        totalViews: 0, // TODO: Implement view tracking
        avgRating: Number(stats.avg_rating),
        followersCount: Number(stats.followers_count),
        followingCount: Number(stats.following_count)
      }
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch profile",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
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

    const { displayName, username, bio, email } = await request.json();

    // Validate input
    if (displayName && displayName.length > 100) {
      return NextResponse.json({ error: 'Display name too long' }, { status: 400 });
    }

    if (username && username.length > 50) {
      return NextResponse.json({ error: 'Username too long' }, { status: 400 });
    }

    if (bio && bio.length > 500) {
      return NextResponse.json({ error: 'Bio too long' }, { status: 400 });
    }

    // Check if username is already taken (if changing username)
    if (username) {
      const existingUser = await db.execute({
        sql: `SELECT id FROM profiles WHERE username = ? AND id != ?`,
        args: [username, userId]
      });

      if (existingUser.rows.length > 0) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Update profile
    const updateFields = [];
    const args = [];

    if (displayName !== undefined) {
      updateFields.push('display_name = ?');
      args.push(displayName);
    }

    if (username !== undefined) {
      updateFields.push('username = ?');
      args.push(username);
    }

    if (bio !== undefined) {
      updateFields.push('bio = ?');
      args.push(bio);
    }

    if (email !== undefined) {
      updateFields.push('email = ?');
      args.push(email);
    }

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      args.push(userId);

      await db.execute({
        sql: `UPDATE profiles SET ${updateFields.join(', ')} WHERE id = ?`,
        args
      });
    }

    // Get updated profile
    const updatedProfile = await db.execute({
      sql: `SELECT id, username, display_name, bio, avatar_url, created_at, is_verified FROM profiles WHERE id = ?`,
      args: [userId]
    });

    if (updatedProfile.rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = updatedProfile.rows[0];

    return NextResponse.json({
      profile: {
        id: profile.id,
        username: profile.username,
        displayName: profile.display_name,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        email: profile.email,
        createdAt: profile.created_at,
        isVerified: Boolean(profile.is_verified)
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
