import { d as db } from "../../../chunks/db_CQD2SMMC.mjs";
import { renderers } from "../../../renderers.mjs";
const GET = async ({ request, url }) => {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const year = searchParams.get("year");
    let sql;
    let args;
    if (source) {
      sql = "SELECT * FROM essay_prompts WHERE source = ? AND is_active = 1 ORDER BY year DESC, prompt_text";
      args = [source];
    } else if (year) {
      sql = "SELECT * FROM essay_prompts WHERE year = ? AND is_active = 1 ORDER BY source, prompt_text";
      args = [year];
    } else {
      sql = "SELECT * FROM essay_prompts WHERE is_active = 1 ORDER BY source, year DESC, prompt_text";
      args = [];
    }
    const result = await db.execute({ sql, args });
    return new Response(JSON.stringify({
      prompts: result.rows,
      count: result.rows.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Get prompts error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), {
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
