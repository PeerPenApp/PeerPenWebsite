import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../chunks/Page_QJQJODbQ.mjs";
import { $ as $$SignedIn, a as $$SignedOut } from "../chunks/SignedOut_DwZF8REY.mjs";
import { renderers } from "../renderers.mjs";
const $$App = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SignedIn", $$SignedIn, {}, { "default": ($$result3) => renderTemplate`  ${maybeRenderHead()}<nav class="nav"> <div class="nav-container"> <a href="/app" class="nav-brand">PeerPen</a> <div class="nav-menu"> <a href="/app" class="nav-link">Home</a> <a href="/app/write" class="nav-link">Write</a> <a href="/app/feed" class="nav-link">Feed</a> <a href="/app/profile" class="nav-link">Profile</a> <a href="/app/moderation" class="nav-link">Moderation</a> </div> </div> </nav>  <main class="container"> <!-- Create New Essay Section --> <div class="card mb-6"> <div class="card-header"> <h2 class="card-title">Create New College Essay</h2> <p class="text-sm text-gray-600">Start writing your personal statement or college-specific essay</p> </div> <div class="p-6 text-center"> <div class="mb-4"> <span class="text-6xl">🎓</span> </div> <h3 class="text-xl font-semibold mb-3">Ready to write your college essay?</h3> <p class="text-gray-600 mb-6">Use our specialized editor with Common App prompts, school selection, and AI analysis</p> <a href="/app/write" class="btn btn-primary text-lg px-8 py-3">
🚀 Start Writing
</a> </div> </div> <!-- Welcome Section --> <div class="card"> <div class="card-header"> <h1 class="card-title">Welcome to PeerPen</h1> </div> <div class="grid md:grid-cols-3 gap-6"> <div class="text-center p-4"> <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"> <span class="text-2xl">✍️</span> </div> <h3 class="text-lg font-semibold mb-2">Write College Essays</h3> <p class="text-sm text-gray-600">Create compelling personal statements with our specialized editor</p> <a href="/app/write" class="btn btn-primary mt-3">Start Writing</a> </div> <div class="text-center p-4"> <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"> <span class="text-2xl">👥</span> </div> <h3 class="text-lg font-semibold mb-2">Peer Reviews</h3> <p class="text-sm text-gray-600">Get feedback from other students using our rubric system</p> <a href="/app/feed" class="btn btn-secondary mt-3">Browse Essays</a> </div> <div class="text-center p-4"> <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"> <span class="text-2xl">🤖</span> </div> <h3 class="text-lg font-semibold mb-2">AI Analysis</h3> <p class="text-sm text-gray-600">Get instant feedback and improvement suggestions</p> <a href="/app/write" class="btn btn-ghost mt-3">Try AI</a> </div> </div> <div class="mt-8 p-4 bg-gray-50 rounded-lg"> <h3 class="text-lg font-semibold mb-3">Recent Activity</h3> <p class="text-sm text-gray-600">No recent activity yet. Start writing your first college essay!</p> </div> </div> </main>  <button class="fab" onclick="window.location.href='/app/write'" title="Create New Essay">
✍️
</button> ` })} ${renderComponent($$result2, "SignedOut", $$SignedOut, {}, { "default": ($$result3) => renderTemplate` <div class="container text-center py-20"> <div class="mb-8"> <span class="text-8xl">🔒</span> </div> <h1 class="text-3xl font-bold mb-4">Authentication Required</h1> <p class="text-gray-600 mb-8">Please sign in to access your dashboard.</p> <div class="flex gap-4 justify-center"> <a href="/" class="btn btn-primary">Sign In</a> <a href="/signup" class="btn btn-secondary">Sign Up</a> </div> </div> ` })} ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/app.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/app.astro";
const $$url = "/app";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$App,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
