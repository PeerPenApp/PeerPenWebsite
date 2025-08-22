import { d as db } from "../../../../chunks/db_CQD2SMMC.mjs";
import { g as getSessionUser, r as requireUser } from "../../../../chunks/auth_e0h_D5ri.mjs";
import { renderers } from "../../../../renderers.mjs";
async function POST(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const id = ctx.params.id;
  await db.execute({
    sql: "UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?",
    args: [id, user.id]
  });
  return new Response(JSON.stringify({ success: true }));
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
