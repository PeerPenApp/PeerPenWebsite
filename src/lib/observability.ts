import * as Sentry from '@sentry/node';

let initialized = false;

export function initObservability() {
  if (initialized) return;
  const dsn = import.meta.env.SENTRY_DSN;
  if (dsn) {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
  }
  initialized = true;
}


