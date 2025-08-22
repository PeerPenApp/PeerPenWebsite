import type { APIContext } from 'astro';
import { db } from '../../../lib/db';
import { getSessionUser, requireUser } from '../../../lib/auth';
import { initObservability } from '../../../lib/observability';
initObservability();

export async function POST(ctx: APIContext) {
  const user = await getSessionUser(ctx);
  requireUser(user);
  const body = await ctx.request.json();
  const content = (body?.content || '').trim();
  const essayId = (body?.essayId || '').trim() || undefined;
  const reviewId = (body?.reviewId || '').trim() || undefined;
  const startPos = typeof body?.startPos === 'number' ? body.startPos : undefined;
  const endPos = typeof body?.endPos === 'number' ? body.endPos : undefined;
  
  if (!content) {
    return new Response(JSON.stringify({ error: 'content required' }), { status: 400 });
  }
  
  const commentId = crypto.randomUUID();
  await db.execute({
    sql: 'INSERT INTO comments (id, content, author_id, essay_id, review_id, start_pos, end_pos) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [commentId, content, user!.id, essayId, reviewId, startPos, endPos]
  });
  
  // notify owner
  if (essayId) {
    const essayResult = await db.execute({
      sql: 'SELECT author_id FROM essays WHERE id = ?',
      args: [essayId]
    });
    
    if (essayResult.rows[0]) {
      await db.execute({
        sql: 'INSERT INTO notifications (id, user_id, type, data) VALUES (?, ?, ?, ?)',
        args: [crypto.randomUUID(), essayResult.rows[0].author_id, 'comment', JSON.stringify({ essayId, commentId })]
      });
    }
  }
  
  if (reviewId) {
    const reviewResult = await db.execute({
      sql: 'SELECT author_id FROM reviews WHERE id = ?',
      args: [reviewId]
    });
    
    if (reviewResult.rows[0]) {
      await db.execute({
        sql: 'INSERT INTO notifications (id, user_id, type, data) VALUES (?, ?, ?, ?)',
        args: [crypto.randomUUID(), reviewResult.rows[0].author_id, 'comment', JSON.stringify({ reviewId, commentId })]
      });
    }
  }
  
  const comment = { id: commentId, content, authorId: user!.id, essayId, reviewId, startPos, endPos };
  return new Response(JSON.stringify({ comment }));
}


