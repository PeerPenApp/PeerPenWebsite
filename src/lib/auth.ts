import type { APIContext } from 'astro';
import { db } from './db';

export interface User {
  id: string;
  handle: string;
  email?: string;
  display_name: string;
  karma: number;
  created_at: string;
  updated_at: string;
}

export async function getSessionUser(ctx: APIContext): Promise<User | null> {
  // TODO: Implement your own session management
  return null;
}

export async function getOrCreateUser(userId: string, email?: string): Promise<User | null> {
  try {
    // Try to find existing user
    const userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId]
    });

    if (userResult.rows.length > 0) {
      return userResult.rows[0] as unknown as User;
    }
    
    // Create new user if not found and email is provided
    if (email) {
      const handle = `user_${Date.now()}`;
      const displayName = email.split('@')[0] || 'User';
      
      const newUserResult = await db.execute({
        sql: `
          INSERT INTO users 
            (id, email, handle, display_name, karma, created_at, updated_at) 
          VALUES 
            (?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
          RETURNING *
        `,
        args: [userId, email, handle, displayName]
      });
      
      if (newUserResult.rows.length > 0) {
        return newUserResult.rows[0] as unknown as User;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

// Helper function to get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId]
    });

    return (result.rows[0] as unknown as User) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Helper function to require an authenticated user
export function requireUser(user: User | null): asserts user is User {
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper to get user ID from session
export function getUserId(ctx: APIContext): string | null {
  const authHeader = ctx.request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  // For now, return null as we need to verify the token
  // This can be enhanced later if needed
  return null;
}

export async function getCurrentUser(ctx: APIContext): Promise<User | null> {
  return getSessionUser(ctx);
}

