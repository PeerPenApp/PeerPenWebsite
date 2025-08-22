import type { APIContext } from 'astro';
import { db } from '../../../../lib/db';
import { getSessionUser, requireUser } from '../../../../lib/auth';

export async function POST(ctx: APIContext) {
  const user = await getSessionUser(ctx);
  requireUser(user);
  const id = ctx.params.id!;
  
  await db.execute({
    sql: 'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
    args: [id, user!.id]
  });
  
  return new Response(JSON.stringify({ success: true }));
}



