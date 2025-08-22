import { d as db } from "../../chunks/db_CQD2SMMC.mjs";
import { g as getSessionUser, r as requireUser } from "../../chunks/auth_e0h_D5ri.mjs";
import { i as initObservability } from "../../chunks/observability_C440o4wk.mjs";
import { renderers } from "../../renderers.mjs";
initObservability();
async function POST(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const body = await ctx.request.json();
  const content = (body?.content || "").trim();
  const essayId = (body?.essayId || "").trim() || void 0;
  const reviewId = (body?.reviewId || "").trim() || void 0;
  const startPos = typeof body?.startPos === "number" ? body.startPos : void 0;
  const endPos = typeof body?.endPos === "number" ? body.endPos : void 0;
  if (!content) {
    return new Response(JSON.stringify({ error: "content required" }), { status: 400 });
  }
  const commentId = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO comments (id, content, author_id, essay_id, review_id, start_pos, end_pos) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [commentId, content, user.id, essayId, reviewId, startPos, endPos]
  });
  if (essayId) {
    const essayResult = await db.execute({
      sql: "SELECT author_id FROM essays WHERE id = ?",
      args: [essayId]
    });
    if (essayResult.rows[0]) {
      await db.execute({
        sql: "INSERT INTO notifications (id, user_id, type, data) VALUES (?, ?, ?, ?)",
        args: [crypto.randomUUID(), essayResult.rows[0].author_id, "comment", JSON.stringify({ essayId, commentId })]
      });
    }
  }
  if (reviewId) {
    const reviewResult = await db.execute({
      sql: "SELECT author_id FROM reviews WHERE id = ?",
      args: [reviewId]
    });
    if (reviewResult.rows[0]) {
      await db.execute({
        sql: "INSERT INTO notifications (id, user_id, type, data) VALUES (?, ?, ?, ?)",
        args: [crypto.randomUUID(), reviewResult.rows[0].author_id, "comment", JSON.stringify({ reviewId, commentId })]
      });
    }
  }
  const comment = { id: commentId, content, authorId: user.id, essayId, reviewId, startPos, endPos };
  return new Response(JSON.stringify({ comment }));
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
