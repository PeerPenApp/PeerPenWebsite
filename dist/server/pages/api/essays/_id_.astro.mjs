import { d as db } from "../../../chunks/db_CQD2SMMC.mjs";
import { g as getSessionUser, r as requireUser } from "../../../chunks/auth_e0h_D5ri.mjs";
import { renderers } from "../../../renderers.mjs";
async function GET(ctx) {
  const id = ctx.params.id;
  const result = await db.execute({
    sql: `
      SELECT e.*, u.handle as author_handle,
             ev.id as version_id, ev.content, ev.created_at as version_created_at
      FROM essays e 
      JOIN users u ON e.author_id = u.id
      LEFT JOIN essay_versions ev ON e.id = ev.essay_id
      WHERE e.id = ?
      ORDER BY ev.created_at DESC
    `,
    args: [id]
  });
  if (result.rows.length === 0) {
    return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  }
  const essay = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    author: { handle: result.rows[0].author_handle },
    versions: result.rows.map((row) => ({
      id: row.version_id,
      content: row.content,
      createdAt: row.version_created_at
    }))
  };
  return new Response(JSON.stringify({ essay }));
}
async function PATCH(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const id = ctx.params.id;
  const body = await ctx.request.json();
  const content = (body?.content || "").trim();
  const isPublic = body?.isPublic;
  if (!content && typeof isPublic !== "boolean") {
    return new Response(JSON.stringify({ error: "nothing to update" }), { status: 400 });
  }
  if (typeof isPublic === "boolean") {
    await db.execute({
      sql: "UPDATE essays SET is_public = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [isPublic ? 1 : 0, id]
    });
  }
  if (content) {
    await db.execute({
      sql: "INSERT INTO essay_versions (id, essay_id, content) VALUES (?, ?, ?)",
      args: [crypto.randomUUID(), id, content]
    });
  }
  const result = await db.execute({
    sql: "SELECT * FROM essays WHERE id = ?",
    args: [id]
  });
  const essay = result.rows[0];
  return new Response(JSON.stringify({ essay }));
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  PATCH
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
