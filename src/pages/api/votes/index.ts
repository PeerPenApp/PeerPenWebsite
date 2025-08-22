import type { APIContext } from 'astro';
import { db } from '../../../lib/db';
import { getSessionUser, requireUser } from '../../../lib/auth';
import { initObservability } from '../../../lib/observability';
initObservability();

export async function POST(ctx: APIContext) {
  const user = await getSessionUser(ctx);
  requireUser(user);
  const body = await ctx.request.json();
  const reviewId = (body?.reviewId || '').trim();
  const value = typeof body?.value === 'number' ? Math.sign(body.value) || 1 : 1;
  
  if (!reviewId) {
    return new Response(JSON.stringify({ error: 'reviewId required' }), { status: 400 });
  }
  
  // Check if vote exists
  const existingVote = await db.execute({
    sql: 'SELECT * FROM votes WHERE review_id = ? AND user_id = ?',
    args: [reviewId, user!.id]
  });
  
  if (existingVote.rows[0]) {
    // Update existing vote
    await db.execute({
      sql: 'UPDATE votes SET value = ? WHERE review_id = ? AND user_id = ?',
      args: [value, reviewId, user!.id]
    });
  } else {
    // Create new vote
    await db.execute({
      sql: 'INSERT INTO votes (id, review_id, user_id, value) VALUES (?, ?, ?, ?)',
      args: [crypto.randomUUID(), reviewId, user!.id, value]
    });
  }
  
  // update karma for review author
  const reviewResult = await db.execute({
    sql: 'SELECT author_id FROM reviews WHERE id = ?',
    args: [reviewId]
  });
  
  if (reviewResult.rows[0]) {
    const delta = value; // simplistic karma model
    await db.execute({
      sql: 'UPDATE users SET karma = karma + ? WHERE id = ?',
      args: [delta, reviewResult.rows[0].author_id]
    });
  }
  
  const vote = { reviewId, userId: user!.id, value };
  return new Response(JSON.stringify({ vote }));
}


