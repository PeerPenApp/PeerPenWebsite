import * as Sentry from "@sentry/node";
let initialized = false;
function initObservability() {
  if (initialized) return;
  const dsn = "https://b4ab635af79443702660e09e0e7de657@o4509866404151296.ingest.us.sentry.io/4509866405265408";
  {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
  }
  initialized = true;
}
export {
  initObservability as i
};
