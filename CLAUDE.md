# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This uses **Next.js 16.2.6** with React 19. Per `AGENTS.md`, this version has breaking changes from what may be in training data — APIs, conventions, and file structure may differ. Before writing framework code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit
npm run format     # Prettier write on all ts/tsx
```

There is no test framework configured.

Add shadcn/ui components with `npx shadcn@latest add <name>` — they land in `components/ui`.

## Architecture

Next.js App Router. Path alias `@/*` maps to the repo root.

**Providers** — `app/layout.tsx` wraps children in a single `<Providers>` (`app/providers.tsx`), which is the app's one client boundary and sets up:
- TanStack Query (`QueryClient` held in `useState` so it's stable across renders)
- `next-themes` — class-based, `defaultTheme="dark"`, `enableSystem={false}` (dark by default, user-toggleable, no system following)
- Sonner `<Toaster>` (reads `useTheme()`, so it must live inside the theme provider)

Theme is toggled via `components/layout/theme-toggle.tsx` (in both navs), which flips `next-themes` between `dark`/`light`. It gates the icon behind a mounted flag to avoid a hydration mismatch (there's no resolved theme during SSR).

**Data layer** — GraphQL via `graphql-request`, split by concern:
- `lib/graphql/client.ts` — the single configured `GraphQLClient`; reads the endpoint from `NEXT_PUBLIC_API_URL` (see `.env.example`) and throws if it's missing.
- `lib/graphql/queries/<domain>.ts` — the `gql` query documents (what to fetch), grouped by domain.
- `services/<domain>.service.ts` — the callable API (e.g. `getAllProjects`, `getProject`): picks a query, passes variables, returns typed data.
- `types/<domain>.ts` — shared data shapes.

Components import **only the service** (never the client or query docs) and consume it through TanStack Query `useQuery`. The demo API is `graphqlzero.almansi.me` (a mock GraphQL endpoint). The endpoint is `NEXT_PUBLIC_`-prefixed because the Projects section fetches in the browser.

**Page composition** — `app/page.tsx` assembles the UI from feature components: the two fixed navs sit outside `<main>`, and `<main>` (which carries `id="top"` and top padding to clear the fixed nav) stacks the section components in order. Concerns are split into two folders:
- `components/layout/` — navigation. `web-nav.tsx` (desktop, `md:flex`) and `mobile-nav.tsx` (mobile, `md:hidden`, hamburger + Framer Motion overlay) are both `"use client"`, `fixed` to the top, and morph into a floating blurred pill once `window.scrollY > 40`. They share links from `nav-items.ts`, the `theme-toggle.tsx`, and the `useActiveSection` scroll-spy. The desktop active-link indicator is a Framer Motion `layoutId="nav-active"` pill that slides between links.
- `components/sections/` — one component per page section: `hero.tsx`, `services.tsx`, `projects.tsx`, `case-study.tsx`, `about.tsx`, `footer.tsx`, plus the shared `section-heading.tsx`. Each owns its own animation/data logic and is `"use client"` where it needs hooks.

Nav links are anchor scroll targets: sections expose `id`s (`#top`, `#services`, `#work`, `#case-study`, `#about`, `#contact`) that `nav-items.ts` points at. `nav-items.ts` also exports `sectionIds` (a stable module-level array) for the scroll-spy. Smooth scrolling + a `scroll-margin-top` on `[id]` (in `globals.css`) make anchor jumps land below the fixed nav.

**Scroll-spy** — `hooks/use-active-section.ts` uses an `IntersectionObserver` (with a thin `rootMargin` band near the top) to return the id of the section currently in view; pass it a stable `ids` array to avoid re-subscribing each render.

**Animation** — two libraries coexist by role: **GSAP** for imperative timeline/scroll animations, **Framer Motion** for declarative work — variant/stagger grids (`sections/projects.tsx`), `whileInView` scroll reveals (services steps, case-study, about), and shared-layout indicators (`layoutId` in `web-nav.tsx`).

`sections/services.tsx` is the scroll-driven "journey" (the most involved section):
- Desktop draws a **rectilinear rounded-elbow path** built in real pixels (`buildPath`) from a `ResizeObserver`-measured container, so corners stay circular (no `preserveAspectRatio` distortion). Nodes are absolutely positioned at the same percentage coords the path bends to.
- A **scroll-reactive active state** (a rAF-throttled scroll handler comparing each `[data-step]`'s center to the viewport middle) grays/colors each step's whole cluster — icon, rings, number, tick, title, desc — and is reactive **both** directions.
- The line **fills up to the furthest active node** via `strokeDashoffset` (exact, using per-node `cumLen` from `buildPath` + `pathLength`), stroked with a vertical gradient that blends each node's color; mobile mirrors it with a `scaleY` gradient rail.
- Ring rotation is driven manually from the same rAF scroll handler (accumulating `delta * SPIN_SPEED`) and advances **only while a node is active** — scroll-linked but gated on the colored state (no ScrollTrigger in this file). The hand-authored `StepMotif` (inline SVG rings/dots) provides the visual richness.

GSAP work (see `sections/hero.tsx` for the canonical pattern) always: runs in a `gsap.context(..., ref)` and `ctx.revert()`s on cleanup (kills tweens, ScrollTriggers, and listeners); registers plugins inside the effect (`gsap.registerPlugin(ScrollTrigger)`); and gates motion behind `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` so it degrades to static content. Masked text reveals use an `overflow-hidden` wrapper with an inner element animated via `yPercent`; mouse parallax uses `gsap.quickTo` under a `(pointer: fine)` matchMedia.

**Styling** — Tailwind CSS v4 (config via `app/globals.css`, PostCSS). shadcn/ui is configured in `components.json` (style `base-maia`, base color `olive`, lucide icons). Fonts wired through CSS variables in `layout.tsx`: Geist (sans), Geist Mono (mono), Oxanium (`--font-heading`).

Components style with **the stock shadcn semantic tokens, not raw hex** — `border-border`, `text-foreground`/`bg-background`, `text-muted-foreground`, `text-destructive`, and `text-primary`/`border-primary` for the accent/hover color (the olive base from the initialized theme). No custom brand token — keep to the shadcn palette so both themes stay consistent.
