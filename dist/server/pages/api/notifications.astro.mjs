import { d as db } from "../../chunks/db_CQD2SMMC.mjs";
import { g as getSessionUser, r as requireUser } from "../../chunks/auth_e0h_D5ri.mjs";
import { renderers } from "../../renderers.mjs";
async function GET(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const result = await db.execute({
    sql: "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    args: [user.id]
  });
  const notifications = result.rows;
  return new Response(JSON.stringify({ notifications }));
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
