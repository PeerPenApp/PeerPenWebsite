import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../chunks/Page_QJQJODbQ.mjs";
import { renderers } from "../renderers.mjs";
const $$TestClerk = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto p-8"> <h1 class="text-2xl font-bold mb-4">Clerk Test Page</h1> <div class="bg-white p-6 rounded-lg shadow"> <h2 class="text-xl mb-4">Basic SignUp Component</h2> ${renderComponent($$result2, "SignUp", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@clerk/astro/react", "client:component-export": "SignUp" })} </div> <div class="mt-8 bg-white p-6 rounded-lg shadow"> <h2 class="text-xl mb-4">SignUp with Custom Props</h2> ${renderComponent($$result2, "SignUp", null, { "routing": "path", "path": "/test-clerk", "signInUrl": "/", "redirectUrl": "/app", "client:only": "react", "client:component-hydration": "only", "client:component-path": "@clerk/astro/react", "client:component-export": "SignUp" })} </div> </div> ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/test-clerk.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/test-clerk.astro";
const $$url = "/test-clerk";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$TestClerk,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
