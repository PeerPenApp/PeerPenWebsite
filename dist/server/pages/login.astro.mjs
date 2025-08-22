import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import { $ as $$Page } from "../chunks/Page_QJQJODbQ.mjs";
import { renderers } from "../renderers.mjs";
const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Page, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="auth-container"> <div class="auth-card"> <div class="auth-logo">PeerPen</div> <p class="text-center mb-4">Sign in to continue to PeerPen</p> ${renderComponent($$result2, "SignIn", null, { "appearance": {
    elements: {
      formButtonPrimary: "btn btn-primary w-full",
      card: "hidden",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      socialButtonsBlockButton: "btn btn-secondary w-full mb-4",
      dividerLine: "hidden",
      dividerText: "hidden",
      formFieldInput: "form-input",
      formFieldLabel: "form-label",
      footerAction: "hidden",
      footerActionLink: "hidden"
    }
  }, "routing": "path", "path": "/login", "signUpUrl": "/signup", "redirectUrl": "/app", "client:only": "react", "client:component-hydration": "only", "client:component-path": "@clerk/astro/react", "client:component-export": "SignIn" })} <div class="auth-divider"> <span>Don't have an account?</span> </div> <a href="/signup" class="btn btn-ghost w-full">Sign Up</a> </div> </div> ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/login.astro", void 0);
const $$file = "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/pages/login.astro";
const $$url = "/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
