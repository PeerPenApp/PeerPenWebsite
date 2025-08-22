import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../chunks/Page_QJQJODbQ.mjs";
import { renderers } from "../renderers.mjs";
const $$Signup = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="auth-container"> <div class="auth-card"> <div class="auth-logo">PeerPen</div> <p class="text-center mb-4">Create your account to start writing and reviewing essays.</p> <div id="sign-up"></div> <div class="auth-divider"> <span>Already have an account?</span> </div> <a href="/" class="btn btn-ghost w-full">Sign In</a> </div> </div> ` })} `;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/signup.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/signup.astro";
const $$url = "/signup";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Signup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
