import { Geist, Geist_Mono, Oxanium } from "next/font/google"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "./providers"

import "./globals.css"
import { cn } from "@/lib/utils"

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
})

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

// Vercel exposes the production domain at build time; fall back to localhost so
// absolute URLs (and the OG image) resolve in development too.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

const title = "Modern Agency — Digital Product Studio"
const description =
  "We partner with ambitious brands to design and build websites, products, and experiences that move people — and move numbers."

export const metadata: Metadata = {
  // Required for `app/opengraph-image.png` (and twitter:image) to resolve to
  // absolute URLs. Next picks the file up automatically — no `images` key needed.
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Modern Agency",
  },
  description,
  keywords: [
    "digital agency",
    "product design",
    "web development",
    "branding",
    "motion design",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Modern Agency",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        geistMono.variable,
        oxaniumHeading.variable
      )}
    >
      <body>
        {/* globals.css pre-hides the hero so it can't flash before GSAP boots.
            If JS never runs, nothing would reveal it — so undo that here.
            Must be dangerouslySetInnerHTML: children of <noscript> are inert
            text to the parser, but React would reconcile a real <style> node on
            hydration — and a <style> applies even inside a display:none parent,
            so these !important rules would fight GSAP with JS enabled. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>
              .hero-top, .hero-sub, .hero-scroll, .hero-stat, .hero-marquee, .hero-mask, .hero-line { opacity: 1 !important; }
            </style>`,
          }}
        />
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export default RootLayout
