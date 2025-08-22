import type { APIContext } from 'astro';
import { db } from '../../../lib/db';
import { getSessionUser, requireUser } from '../../../lib/auth';

export async function GET(ctx: APIContext) {
  const user = await getSessionUser(ctx);
  requireUser(user);
  
  const result = await db.execute({
    sql: 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    args: [user!.id]
  });
  
  const notifications = result.rows;
  return new Response(JSON.stringify({ notifications }));
}



