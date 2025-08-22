import type { APIContext } from 'astro';
import { db } from '../../../../lib/db';
import { getSessionUser, requireUser } from '../../../../lib/auth';

export async function GET(ctx: APIContext) {
  const user = await getSessionUser(ctx);
  requireUser(user);
  
  // TODO: Check if user is admin/moderator
  // For now, allow all authenticated users to see reports
  
  const result = await db.execute({
    sql: 'SELECT * FROM reports ORDER BY created_at DESC',
    args: []
  });
  
  const reports = result.rows;
  return new Response(JSON.stringify({ reports }));
}



