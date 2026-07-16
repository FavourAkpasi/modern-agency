import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  images: {
    // Demo placeholder photos (Lorem Picsum). Swap/extend for real project image
    // hosts when you have them.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
}

// Wraps the build to upload source maps so Sentry stack traces are readable.
// Skips upload automatically when SENTRY_AUTH_TOKEN isn't set (e.g. locally).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Keep local builds quiet; log in CI.
  silent: !process.env.CI,
  // Upload a wider set of client bundles so traces resolve through them.
  widenClientFileUpload: true,
  // Strip Sentry's debug logger from the client bundle.
  disableLogger: true,
})
