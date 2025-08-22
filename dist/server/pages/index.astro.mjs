import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../chunks/Page_QJQJODbQ.mjs";
import { renderers } from "../renderers.mjs";
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="auth-container"> <div class="auth-card"> <div class="auth-logo">PeerPen</div> <p class="text-center mb-4">Write, review, and improve college essays with peers and AI.</p> <div id="sign-in"></div> <div class="auth-divider"> <span>Don't have an account?</span> </div> <a href="/signup" class="btn btn-ghost w-full">Sign Up</a> </div> </div> ` })} `;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/index.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/index.astro";
const $$url = "";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
