import { renderers } from "./renderers.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_DMGCh5kc.mjs";
import { manifest } from "./manifest_CayT8quu.mjs";
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/api/ai/analyze.astro.mjs");
const _page2 = () => import("./pages/api/comments.astro.mjs");
const _page3 = () => import("./pages/api/essays/colleges.astro.mjs");
const _page4 = () => import("./pages/api/essays/prompts.astro.mjs");
const _page5 = () => import("./pages/api/essays/_id_.astro.mjs");
const _page6 = () => import("./pages/api/essays.astro.mjs");
const _page7 = () => import("./pages/api/init-db.astro.mjs");
const _page8 = () => import("./pages/api/moderation/reports/_id_.astro.mjs");
const _page9 = () => import("./pages/api/moderation/reports.astro.mjs");
const _page10 = () => import("./pages/api/notifications/_id_/read.astro.mjs");
const _page11 = () => import("./pages/api/notifications.astro.mjs");
const _page12 = () => import("./pages/api/reviews.astro.mjs");
const _page13 = () => import("./pages/api/votes.astro.mjs");
const _page14 = () => import("./pages/app/feed.astro.mjs");
const _page15 = () => import("./pages/app/moderation.astro.mjs");
const _page16 = () => import("./pages/app/profile.astro.mjs");
const _page17 = () => import("./pages/app/write.astro.mjs");
const _page18 = () => import("./pages/app.astro.mjs");
const _page19 = () => import("./pages/login.astro.mjs");
const _page20 = () => import("./pages/signup.astro.mjs");
const _page21 = () => import("./pages/test-clerk.astro.mjs");
const _page22 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
  ["src/pages/api/ai/analyze.ts", _page1],
  ["src/pages/api/comments/index.ts", _page2],
  ["src/pages/api/essays/colleges.ts", _page3],
  ["src/pages/api/essays/prompts.ts", _page4],
  ["src/pages/api/essays/[id].ts", _page5],
  ["src/pages/api/essays/index.ts", _page6],
  ["src/pages/api/init-db.ts", _page7],
  ["src/pages/api/moderation/reports/[id].ts", _page8],
  ["src/pages/api/moderation/reports/index.ts", _page9],
  ["src/pages/api/notifications/[id]/read.ts", _page10],
  ["src/pages/api/notifications/index.ts", _page11],
  ["src/pages/api/reviews/index.ts", _page12],
  ["src/pages/api/votes/index.ts", _page13],
  ["src/pages/app/feed.astro", _page14],
  ["src/pages/app/moderation.astro", _page15],
  ["src/pages/app/profile.astro", _page16],
  ["src/pages/app/write.astro", _page17],
  ["src/pages/app.astro", _page18],
  ["src/pages/login.astro", _page19],
  ["src/pages/signup.astro", _page20],
  ["src/pages/test-clerk.astro", _page21],
  ["src/pages/index.astro", _page22]
]);
const serverIslandMap = /* @__PURE__ */ new Map();
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  middleware: () => import("./_noop-middleware.mjs")
});
const _args = {
  "mode": "standalone",
  "client": "file:///Users/krithikalluri/Documents/GitHub/PeerPenWebsite/dist/client/",
  "server": "file:///Users/krithikalluri/Documents/GitHub/PeerPenWebsite/dist/server/",
  "host": false,
  "port": 4321,
  "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports["handler"];
const startServer = _exports["startServer"];
const options = _exports["options"];
const _start = "start";
{
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  handler,
  options,
  pageMap,
  startServer
};
