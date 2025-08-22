import { clerkClient } from '@clerk/nextjs/server';
import db from './db';

export interface UserProfileData {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  imageUrl?: string;
}

/**
 * Gets user data from Clerk and ensures a profile exists in the database
 * @param userId - The Clerk user ID
 * @returns Promise<UserProfileData> - The user profile data
 */
export async function ensureUserProfile(userId: string): Promise<UserProfileData> {
  // Check if profile already exists in database
  const existingProfile = await db.execute({
    sql: `SELECT id, username, display_name, avatar_url FROM profiles WHERE id = ?`,
    args: [userId]
  });

  if (existingProfile.rows.length > 0) {
    const profile = existingProfile.rows[0];
    return {
      id: profile.id as string,
      username: profile.username as string,
      displayName: profile.display_name as string,
      imageUrl: profile.avatar_url as string | undefined,
    };
  }

  // Profile doesn't exist, get user data from Clerk and create it
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Extract user information from Clerk
    const username = user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || `user_${userId.slice(0, 8)}`;
    const displayName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.firstName || user.lastName || username;
    const email = user.emailAddresses[0]?.emailAddress;
    const imageUrl = user.imageUrl;

    // Create profile in database (without email column for now)
    await db.execute({
      sql: `INSERT INTO profiles (id, username, display_name, avatar_url, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [userId, username, displayName, imageUrl || null]
    });

    console.log('Created user profile for:', userId, { username, displayName, email });

    return {
      id: userId,
      username,
      displayName,
      email,
      imageUrl,
    };
  } catch (error) {
    console.error('Error fetching user from Clerk:', error);
    
    // Fallback: create profile with generic data if Clerk API fails
    const fallbackUsername = `user_${userId.slice(0, 8)}`;
    const fallbackDisplayName = `User ${userId.slice(0, 8)}`;
    
    await db.execute({
      sql: `INSERT INTO profiles (id, username, display_name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [userId, fallbackUsername, fallbackDisplayName]
    });

    console.log('Created fallback user profile for:', userId);

    return {
      id: userId,
      username: fallbackUsername,
      displayName: fallbackDisplayName,
    };
  }
}

