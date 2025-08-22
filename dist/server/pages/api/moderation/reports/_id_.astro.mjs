import { d as db } from "../../../../chunks/db_CQD2SMMC.mjs";
import { g as getSessionUser, r as requireUser } from "../../../../chunks/auth_e0h_D5ri.mjs";
import { renderers } from "../../../../renderers.mjs";
async function PATCH(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const id = ctx.params.id;
  const body = await ctx.request.json();
  const status = body?.status;
  if (!status || !["open", "resolved", "dismissed"].includes(status)) {
    return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
  }
  await db.execute({
    sql: "UPDATE reports SET status = ? WHERE id = ?",
    args: [status, id]
  });
  return new Response(JSON.stringify({ success: true }));
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PATCH
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
