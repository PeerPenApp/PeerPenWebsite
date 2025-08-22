import { d as db } from "../../chunks/db_CQD2SMMC.mjs";
import { renderers } from "../../renderers.mjs";
const GET = async ({ request, url }) => {
  try {
    const { searchParams } = new URL(request.url);
    const essayId = searchParams.get("essayId");
    if (!essayId) {
      return new Response(JSON.stringify({ error: "Essay ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await db.execute({
      sql: `
        SELECT r.*, u.handle as reviewer_handle, u.display_name as reviewer_name, rs.*
        FROM reviews r 
        JOIN users u ON r.author_id = u.id 
        LEFT JOIN review_scores rs ON r.id = rs.review_id
        WHERE r.essay_id = ? 
        ORDER BY r.created_at DESC
      `,
      args: [essayId]
    });
    return new Response(JSON.stringify({
      reviews: result.rows,
      count: result.rows.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const { essayId, summary, scores } = await request.json();
    if (!essayId || !summary) {
      return new Response(JSON.stringify({ error: "Essay ID and summary are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userResult = await db.execute({
      sql: "SELECT id FROM users LIMIT 1",
      args: []
    });
    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "No users found in database" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userId = userResult.rows[0].id;
    const reviewId = crypto.randomUUID();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const reviewResult = await db.execute({
      sql: "INSERT INTO reviews (id, essay_id, author_id, summary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [reviewId, essayId, userId, summary, now, now]
    });
    if (reviewResult.rowsAffected !== 1) {
      throw new Error("Failed to create review");
    }
    if (scores) {
      const scoresResult = await db.execute({
        sql: "INSERT INTO review_scores (id, review_id, flow, hook, voice, uniqueness, conciseness, authenticity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          crypto.randomUUID(),
          reviewId,
          scores.flow || 0,
          scores.hook || 0,
          scores.voice || 0,
          scores.uniqueness || 0,
          scores.conciseness || 0,
          scores.authenticity || 0
        ]
      });
      if (scoresResult.rowsAffected !== 1) {
        console.warn("Failed to create review scores");
      }
    }
    return new Response(JSON.stringify({
      success: true,
      review: { id: reviewId, essayId, summary, authorId: userId }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Create review error:", error);
    return new Response(JSON.stringify({ error: "Failed to create review" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
