import { a as createComponent, c as createAstro, d as renderComponent, e as renderSlot, r as renderTemplate } from "./astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import "clsx";
const $$Astro$5 = createAstro("https://cannonball.littlesticks.dev");
const $$SignedInCSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SignedInCSR;
  const { class: className } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "clerk-signed-in", "clerk-signed-in", { "class": className, "hidden": true }, { "default": () => renderTemplate` ${renderSlot($$result, $$slots["default"])} ` })} `;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/@clerk/astro/components/control/SignedInCSR.astro", void 0);
const $$Astro$4 = createAstro("https://cannonball.littlesticks.dev");
const $$SignedInSSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SignedInSSR;
  const { userId } = Astro2.locals.auth();
  return renderTemplate`${userId ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : null}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/@clerk/astro/components/control/SignedInSSR.astro", void 0);
const configOutput = "server";
function isStaticOutput(forceStatic) {
  if (forceStatic !== void 0) {
    return forceStatic;
  }
  return configOutput === "static";
}
const $$Astro$3 = createAstro("https://cannonball.littlesticks.dev");
const $$SignedIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SignedIn;
  const { isStatic, class: className } = Astro2.props;
  const SignedInComponent = isStaticOutput(isStatic) ? $$SignedInCSR : $$SignedInSSR;
  return renderTemplate`${renderComponent($$result, "SignedInComponent", SignedInComponent, { "class": className }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/@clerk/astro/components/control/SignedIn.astro", void 0);
const $$Astro$2 = createAstro("https://cannonball.littlesticks.dev");
const $$SignedOutCSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SignedOutCSR;
  const { class: className } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "clerk-signed-out", "clerk-signed-out", { "class": className, "hidden": true }, { "default": () => renderTemplate` ${renderSlot($$result, $$slots["default"])} ` })} `;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/@clerk/astro/components/control/SignedOutCSR.astro", void 0);
const $$Astro$1 = createAstro("https://cannonball.littlesticks.dev");
const $$SignedOutSSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SignedOutSSR;
  const { userId } = Astro2.locals.auth();
  return renderTemplate`${!userId ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : null}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/@clerk/astro/components/control/SignedOutSSR.astro", void 0);
const $$Astro = createAstro("https://cannonball.littlesticks.dev");
const $$SignedOut = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignedOut;
  const { isStatic, class: className } = Astro2.props;
  const SignedOutComponent = isStaticOutput(isStatic) ? $$SignedOutCSR : $$SignedOutSSR;
  return renderTemplate`${renderComponent($$result, "SignedOutComponent", SignedOutComponent, { "class": className }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/@clerk/astro/components/control/SignedOut.astro", void 0);
export {
  $$SignedIn as $,
  $$SignedOut as a
};
