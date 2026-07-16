import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Error tracking is the focus of this setup. Tracing and session replay are
  // enabled but sampled very low to keep client overhead and quota usage down.
  tracesSampleRate: 0.01,
  replaysSessionSampleRate: 0.01,
  // Still capture a replay on the rare occasion an error actually happens —
  // that's the one replay worth having for debugging.
  replaysOnErrorSampleRate: 1.0,

  integrations: [Sentry.replayIntegration()],
})

// Instruments App Router client-side navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
