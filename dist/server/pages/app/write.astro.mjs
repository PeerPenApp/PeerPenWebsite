import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../../chunks/Page_QJQJODbQ.mjs";
import { $ as $$SignedIn, a as $$SignedOut } from "../../chunks/SignedOut_DwZF8REY.mjs";
import { renderers } from "../../renderers.mjs";
const $$Write = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SignedIn", $$SignedIn, {}, { "default": ($$result3) => renderTemplate`  ${maybeRenderHead()}<nav class="nav"> <div class="nav-container"> <a href="/app" class="nav-brand">PeerPen</a> <div class="nav-menu"> <a href="/app" class="nav-link">Home</a> <a href="/app/write" class="nav-link">Write</a> <a href="/app/feed" class="nav-link">Feed</a> <a href="/app/profile" class="nav-link">Profile</a> <a href="/app/moderation" class="nav-link">Moderation</a> </div> </div> </nav>  <main class="container"> <div class="card"> <div class="card-header"> <h1 class="card-title">Write Your College Essay</h1> <p class="text-sm text-gray-600">Create a compelling personal statement or college-specific essay</p> </div> <div class="p-6"> ${renderComponent($$result3, "CollegeEssayEditor", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/react/RichEditor", "client:component-export": "default" })} </div> </div> </main>  <button class="fab" onclick="window.location.href='/app/write'" title="Create New Essay">
✍️
</button> ` })} ${renderComponent($$result2, "SignedOut", $$SignedOut, {}, { "default": ($$result3) => renderTemplate` <div class="container text-center py-20"> <div class="mb-8"> <span class="text-8xl">🔒</span> </div> <h1 class="text-3xl font-bold mb-4">Authentication Required</h1> <p class="text-gray-600 mb-8">Please sign in to write essays.</p> <div class="flex gap-4 justify-center"> <a href="/" class="btn btn-primary">Sign In</a> <a href="/signup" class="btn btn-secondary">Sign Up</a> </div> </div> ` })} ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/app/write.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/app/write.astro";
const $$url = "/app/write";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Write,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
