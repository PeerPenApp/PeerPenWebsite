import { d as db } from "../../../chunks/db_CQD2SMMC.mjs";
import { renderers } from "../../../renderers.mjs";
const GET = async ({ request, url }) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    let sql;
    let args;
    if (search) {
      sql = "SELECT * FROM colleges WHERE name LIKE ? ORDER BY name LIMIT ?";
      args = [`%${search}%`, limit];
    } else {
      sql = "SELECT * FROM colleges ORDER BY name LIMIT ?";
      args = [limit];
    }
    const result = await db.execute({ sql, args });
    return new Response(JSON.stringify({
      colleges: result.rows,
      count: result.rows.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get colleges error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch colleges" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
