import { d as db } from "../../chunks/db_CQD2SMMC.mjs";
import { g as getSessionUser, r as requireUser } from "../../chunks/auth_e0h_D5ri.mjs";
import { i as initObservability } from "../../chunks/observability_C440o4wk.mjs";
import { renderers } from "../../renderers.mjs";
initObservability();
async function POST(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const body = await ctx.request.json();
  const reviewId = (body?.reviewId || "").trim();
  const value = typeof body?.value === "number" ? Math.sign(body.value) || 1 : 1;
  if (!reviewId) {
    return new Response(JSON.stringify({ error: "reviewId required" }), { status: 400 });
  }
  const existingVote = await db.execute({
    sql: "SELECT * FROM votes WHERE review_id = ? AND user_id = ?",
    args: [reviewId, user.id]
  });
  if (existingVote.rows[0]) {
    await db.execute({
      sql: "UPDATE votes SET value = ? WHERE review_id = ? AND user_id = ?",
      args: [value, reviewId, user.id]
    });
  } else {
    await db.execute({
      sql: "INSERT INTO votes (id, review_id, user_id, value) VALUES (?, ?, ?, ?)",
      args: [crypto.randomUUID(), reviewId, user.id, value]
    });
  }
  const reviewResult = await db.execute({
    sql: "SELECT author_id FROM reviews WHERE id = ?",
    args: [reviewId]
  });
  if (reviewResult.rows[0]) {
    const delta = value;
    await db.execute({
      sql: "UPDATE users SET karma = karma + ? WHERE id = ?",
      args: [delta, reviewResult.rows[0].author_id]
    });
  }
  const vote = { reviewId, userId: user.id, value };
  return new Response(JSON.stringify({ vote }));
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
