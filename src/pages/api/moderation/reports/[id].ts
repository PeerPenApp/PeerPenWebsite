import type { APIContext } from 'astro';
import { db } from '../../../../lib/db';
import { getSessionUser, requireUser } from '../../../../lib/auth';

export async function PATCH(ctx: APIContext) {
  const user = await getSessionUser(ctx);
  requireUser(user);
  const id = ctx.params.id!;
  const body = await ctx.request.json();
  const status = body?.status;
  
  if (!status || !['open', 'resolved', 'dismissed'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
  }
  
  await db.execute({
    sql: 'UPDATE reports SET status = ? WHERE id = ?',
    args: [status, id]
  });
  
  return new Response(JSON.stringify({ success: true }));
}



