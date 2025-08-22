import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../../chunks/Page_QJQJODbQ.mjs";
import { $ as $$SignedIn, a as $$SignedOut } from "../../chunks/SignedOut_DwZF8REY.mjs";
import { renderers } from "../../renderers.mjs";
const $$Moderation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SignedIn", $$SignedIn, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<section class="container mx-auto px-4 py-8"> <h1 class="text-2xl font-semibold mb-6">Moderation</h1> <div class="rounded-xl border p-6 bg-white"> ${renderComponent($$result3, "ModerationDashboard", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/react/ModerationDashboard", "client:component-export": "default" })} </div> </section> ` })} ${renderComponent($$result2, "SignedOut", $$SignedOut, {}, { "default": ($$result3) => renderTemplate` <div class="container text-center py-20"> <div class="mb-8"> <span class="text-8xl">🔒</span> </div> <h1 class="text-3xl font-bold mb-4">Authentication Required</h1> <p class="text-gray-600 mb-8">Please sign in to access moderation tools.</p> <div class="flex gap-4 justify-center"> <a href="/" class="btn btn-primary">Sign In</a> <a href="/signup" class="btn btn-secondary">Sign Up</a> </div> </div> ` })} ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/app/moderation.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/app/moderation.astro";
const $$url = "/app/moderation";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Moderation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
