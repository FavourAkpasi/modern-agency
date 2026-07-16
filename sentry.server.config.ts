import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Very low tracing sample rate; error capture is the priority.
  tracesSampleRate: 0.01,
})
