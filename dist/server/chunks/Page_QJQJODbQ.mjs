import { c as createAstro, a as createComponent, b as addAttribute, r as renderTemplate, d as renderComponent, e as renderSlot, f as renderHead, m as maybeRenderHead, s as spreadAttributes, u as unescapeHTML, F as Fragment } from "./astro/server_C7-H4fWn.mjs";
import "kleur/colors";
import "clsx";
/* empty css                       */
import { optimize } from "svgo";
const settings = {
  title: "Cannonball by Little Sticks | A splash page template",
  description: "This is a simple splash page template built with Astro by Little Sticks"
};
const $$Astro$6 = createAstro("https://cannonball.littlesticks.dev");
const $$BaseHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const title = Astro2.props.title || settings.title;
  const description = Astro2.props.description || settings.description;
  const canonicalURL = Astro2.props.canonicalURL || new URL(Astro2.url.pathname, Astro2.site);
  const image = new URL(Astro2.props.image || "./social.png", Astro2.site);
  return renderTemplate`<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="preload" href="/assets/images/bg.svg" as="image"><!-- settingsmap --><link rel="sitemap" href="/sitemap.xml"><!-- Canonical --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(image, "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(image, "content")}><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/components/BaseHead.astro", void 0);
const $$Astro$5 = createAstro("https://cannonball.littlesticks.dev");
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Base;
  const { seo } = Astro2.props;
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "BaseHead", $$BaseHead, { ...seo })}${renderSlot($$result, $$slots["head-bottom"])}${renderHead()}</head> <body> ${renderSlot($$result, $$slots["header"])} <main> ${renderSlot($$result, $$slots["default"])} </main> ${renderSlot($$result, $$slots["footer"])} </body></html>`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/layouts/Base.astro", void 0);
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- <img src="/logo_light.png" alt="PeerPen" height="200px" class="float" /> -->`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/components/Logo.astro", void 0);
const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <div class="header-left" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-3ef6ksr2": true })} <nav class="nav-links" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "HeaderAuth", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-3ef6ksr2": true, "client:component-path": "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/react/HeaderAuth", "client:component-export": "default" })} </nav> </div> <div class="header-right" data-astro-cid-3ef6ksr2> ${renderComponent($$result, "HeaderAuth", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-3ef6ksr2": true, "client:component-path": "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/react/HeaderAuth", "client:component-export": "default" })} </div> </header>`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/components/Header.astro", void 0);
const SPRITESHEET_NAMESPACE = `astroicon`;
const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}
const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize: optimize2 }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize2) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize2) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = import.meta.globEager(
        "/src/icons/**/*.{js,ts,cjs,mjc,cts,mts}"
      );
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = import.meta.globEager("/src/icons/**/*.svg", { as: "raw" });
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize: optimize2 });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}
const $$Astro$4 = createAstro("https://cannonball.littlesticks.dev");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize: optimize2 = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize2);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/astro-icon/lib/Icon.astro", void 0);
const AstroIcon = Symbol("AstroIcon");
function trackSprite(result, name) {
  if (typeof result[AstroIcon] !== "undefined") {
    result[AstroIcon]["sprites"].add(name);
  } else {
    result[AstroIcon] = {
      sprites: /* @__PURE__ */ new Set([name])
    };
  }
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(result) {
  if (typeof result[AstroIcon] !== "undefined") {
    return Array.from(result[AstroIcon]["sprites"]);
  }
  const pathname = result._metadata.pathname;
  if (!warned.has(pathname)) {
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(pathname);
  }
  return [];
}
const $$Astro$3 = createAstro("https://cannonball.littlesticks.dev");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize: optimize2 = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites($$result);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize2).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`display: none; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet> ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)} </svg>`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/astro-icon/lib/Spritesheet.astro", void 0);
const $$Astro$2 = createAstro("https://cannonball.littlesticks.dev");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(content)}` })}${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/astro-icon/lib/SpriteProvider.astro", void 0);
const $$Astro$1 = createAstro("https://cannonball.littlesticks.dev");
const $$Sprite = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite($$result, name);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}> ${title ? renderTemplate`<title>${title}</title>` : ""} <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use> </svg>`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/node_modules/astro-icon/lib/Sprite.astro", void 0);
Object.assign($$Sprite, { Provider: $$SpriteProvider });
const socials = [
  {
    title: "Instagram",
    icon: "mdi:instagram",
    url: "https://www.instagram.com/jaydanurwin/"
  },
  {
    title: "Twitter",
    icon: "mdi:twitter",
    url: "https://twitter.com/littlesticksdev"
  },
  {
    title: "YouTube",
    icon: "mdi:youtube",
    url: "https://youtube.com/c/LittleSticks"
  },
  {
    title: "GitHub",
    icon: "mdi:github",
    url: "https://github.com/littlesticksdev"
  },
  {
    title: "Dribbble",
    icon: "mdi:dribbble",
    url: "https://dribbble.com/littlesticksdev"
  }
];
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte> <ul class="footer__socials" data-astro-cid-sz7xmlte> ${socials.map((social) => renderTemplate`<li class="socal__link" data-astro-cid-sz7xmlte> <a${addAttribute(social.url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-sz7xmlte> ${renderComponent($$result, "Icon", $$Icon, { "name": social.icon, "width": "36px", "height": "36px", "data-astro-cid-sz7xmlte": true })} </a> </li>`)} </ul> </footer>`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/components/Footer.astro", void 0);
const $$FadeIn = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/components/FadeIn.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Analytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate` ${renderTemplate(_a || (_a = __template(["<script>\n    (function(c,u,s,t,o,m){c.SENTRY_DSN=t;o=u.createElement(s);o.async=1;o.src=\"https://browser.sentry-cdn.com/8.27.0/bundle.tracing.min.js\";m=u.getElementsByTagName(s)[0];m.parentNode.insertBefore(o,m)})(window,document,'script',String.raw`${sentryDsn}`);\n  <\/script>"], ["<script>\n    (function(c,u,s,t,o,m){c.SENTRY_DSN=t;o=u.createElement(s);o.async=1;o.src=\"https://browser.sentry-cdn.com/8.27.0/bundle.tracing.min.js\";m=u.getElementsByTagName(s)[0];m.parentNode.insertBefore(o,m)})(window,document,'script',String.raw\\`\\${sentryDsn}\\`);\n  <\/script>"])))}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/components/Analytics.astro", void 0);
const $$Astro = createAstro("https://cannonball.littlesticks.dev");
const $$Page = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Page;
  const { seo } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Base, { "seo": seo }, { "default": ($$result2) => renderTemplate`   ${renderSlot($$result2, $$slots["default"])}  `, "footer": ($$result2) => renderTemplate`${renderComponent($$result2, "Footer", $$Footer, { "slot": "footer" })}`, "head-bottom": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head-bottom" }, { "default": ($$result3) => renderTemplate`  ${renderComponent($$result3, "FadeIn", $$FadeIn, {})} ${renderComponent($$result3, "Analytics", $$Analytics, {})} ` })}`, "header": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header" })}` })}`;
}, "/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/src/layouts/Page.astro", void 0);
export {
  $$Page as $
};
