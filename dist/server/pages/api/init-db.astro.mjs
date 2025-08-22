import { i as initDB } from "../../chunks/db_CQD2SMMC.mjs";
import { renderers } from "../../renderers.mjs";
async function POST() {
  try {
    await initDB();
    return new Response(JSON.stringify({ success: true, message: "Database initialized" }));
  } catch (error) {
    console.error("DB init error:", error);
    return new Response(JSON.stringify({ error: "Failed to initialize database" }), { status: 500 });
  }
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
