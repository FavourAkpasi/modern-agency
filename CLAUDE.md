# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This uses **Next.js 16.2.6** with React 19. Per `AGENTS.md`, this version has breaking changes from what may be in training data — APIs, conventions, and file structure may differ. Before writing framework code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Commands

```bash
npm run dev                       # Start dev server
npm run build                     # Production build
npm run start                     # Serve production build
npm run lint                      # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
npm run typecheck                 # tsc --noEmit
npm run format                    # Prettier write on all ts/tsx
npm run test:integration          # Vitest run (once)
npm run test:integration:watch    # Vitest watch
npm run test:integration:coverage # Vitest + coverage → test/integration/coverage
```

Add shadcn/ui components with `npx shadcn@latest add <name>` — they land in `components/ui`.

## Code style

- **Arrow functions over `function` declarations** — `const Foo = () => {}`, including page/layout default exports (`const Page = () => {}` + `export default Page`).
- **Declare the prop type/interface above the component and destructure inside**:
  ```ts
  type StepTextProps = { step: Step; align: "left" | "right"; active: boolean }
  const StepText = ({ step, align, active }: StepTextProps) => { … }
  ```
- **Exception: the shadcn-generated primitives** (`components/ui/{button,drawer,skeleton,sonner}.tsx`) keep their upstream `function` style so re-running `npx shadcn add …` doesn't fight local edits. Everything we author — including `components/ui/project-drawer.tsx` — follows the rules above.

## Architecture

Next.js App Router. Path alias `@/*` maps to the repo root.

**Providers** — `app/layout.tsx` wraps children in a single `<Providers>` (`app/providers.tsx`), which is the app's one client boundary and sets up:
- TanStack Query (`QueryClient` held in `useState` so it's stable across renders)
- `next-themes` — class-based, `defaultTheme="dark"`, `enableSystem={false}` (dark by default, user-toggleable, no system following)
- Sonner `<Toaster>` (reads `useTheme()`, so it must live inside the theme provider)

Theme is toggled via `components/layout/theme-toggle.tsx` (in both navs), which flips `next-themes` between `dark`/`light`. It gates the icon behind a mounted flag to avoid a hydration mismatch (there's no resolved theme during SSR).

**Data** — the UI runs on **static dummy data** in `lib/constants/projects.ts` (`projects[]` — 10 — for the grids, `featuredProject` for the Case Study), each a rich `Project` (title, category, year, accent, tags, image, excerpt, `sections[]`, `results[]`). All demo projects carry a Lorem Picsum `image` (hosts allowed in `next.config.ts` `images.remotePatterns`); `image` is optional, and components fall back to the type/gradient treatment when it's absent (`onImage` branch renders a `next/image` + dark overlay + light text).

The **GraphQL/service layer is intentionally retained but unused** — `lib/graphql/*` (client + query docs), `services/project.service.ts`, `types/project.ts`, and `hooks/use-projects.ts` (`useQuery` wrapper) are kept as a working reference for wiring a real API later. Swap `lib/constants/projects.ts` for that when a real (image-bearing) API is chosen. Note `lib/graphql/client.ts` throws when `NEXT_PUBLIC_API_URL` is unset — harmless today because nothing imports it (it's tree-shaken, so CI builds without env vars), but re-wiring `use-projects` into a component means CI must supply that var.

**Loading states** — every skeleton lives in one barrel, `components/skeletons.tsx` (`ProjectsBentoSkeleton`, `ProjectsListSkeleton`, `ProjectDrawerSkeleton`), built on shadcn's `components/ui/skeleton.tsx` and mirroring each layout so nothing shifts on swap. The Projects skeletons take a `count` so placeholders stay in step with `projects.length`. Because the app is on static data, `hooks/use-simulated-loading.ts` fakes a ~1s fetch to keep those skeletons exercised — it restarts whenever its `key` changes (that's how the drawer re-fires on open *and* on switching project). Delete it once a real API lands.

**Two Projects variants are live for comparison** (`sections/projects1.tsx` = bento grid at `#projects`, `sections/projects2.tsx` = sticky hover preview at `#projects-2`), both in the nav. Once one is chosen it becomes the canonical `#projects` and the other is removed.

**Project drawer** — state is a **Zustand store** (`stores/project-drawer.ts`): `useProjectDrawer` exposes `project`, `isOpen`, `open(project)`, `close()`. Sections call `open(project)` (a `Project` from `lib/constants/projects.ts`); `<ProjectDrawer>` (`components/ui/project-drawer.tsx`, rendered once in `app/providers.tsx`) subscribes and renders. It **simulates a ~1s load** on each open/project-change (skeleton → content). The drawer is Base UI's drawer (`components/ui/drawer.tsx`, shadcn "base-maia" style — **not** Vaul), swipe-down to dismiss, capped at `100dvh-6rem` so the nav stays visible above it (nav is `z-60`, above the drawer's `z-50` overlay). The "scale back" effect is CSS: the drawer toggles `document.body[data-drawer-open]` (effect on `isOpen`), and `globals.css` scales `[data-scale-container]` on `<main>` (which excludes the fixed navs). In-drawer content staggers in on open and reveals on scroll via Framer `whileInView` with `viewport.root` set to the drawer's scroll container.

**Page composition** — `app/page.tsx` assembles the UI from feature components: the two fixed navs sit outside `<main>`, and `<main>` (which carries `id="top"` and top padding to clear the fixed nav) stacks the section components in order. Concerns are split into two folders:
- `components/layout/` — navigation. `web-nav.tsx` (desktop, `md:flex`) and `mobile-nav.tsx` (mobile, `md:hidden`, hamburger + Framer Motion overlay) are both `"use client"`, `fixed` to the top, and morph into a floating blurred pill once `window.scrollY > 40`. They share links from `nav-items.ts`, the `theme-toggle.tsx`, and the `useActiveSection` scroll-spy. The desktop active-link indicator is a Framer Motion `layoutId="nav-active"` pill that slides between links.
- `components/sections/` — one component per page section: `hero.tsx`, `services.tsx`, `projects1.tsx`/`projects2.tsx` (the two variants), `case-study.tsx`, `about.tsx`, `footer.tsx`, plus the shared `section-heading.tsx`. Each owns its own animation/data logic and is `"use client"` where it needs hooks.

Nav links are anchor scroll targets: sections expose `id`s (`#top`, `#services`, `#projects`, `#case-study`, `#about`, `#contact`) that `nav-items.ts` points at. `nav-items.ts` also exports `sectionIds` (a stable module-level array) for the scroll-spy. In-page nav uses the `scrollToSection` helper (`components/layout/scroll-to-section.ts`) on click rather than relying on Next `<Link>` hash scrolling (which is flaky); it respects reduced-motion and syncs the URL hash. A `scroll-margin-top` on `[id]` (in `globals.css`) makes jumps land below the fixed nav.

**Scroll-spy** — `hooks/use-active-section.ts` returns the id of the section whose top has passed a reference line (~30% down the viewport), or **null when above the first section** (so the hero highlights nothing); it's reactive in both scroll directions. `ids` must be in document order and a stable reference.

**Animation** — two libraries coexist by role: **GSAP** for imperative timeline/scroll animations, **Framer Motion** for declarative work — variant/stagger grids (`sections/projects1.tsx`), `whileInView` scroll reveals (services steps, case-study, about), and shared-layout indicators (`layoutId` in `web-nav.tsx`).

`sections/about.tsx` is a scroll-scrubbed manifesto: words are split into `.reveal-word` spans that GSAP brightens (opacity) one-by-one via a `scrub` ScrollTrigger (accent keywords stay `primary`); stats count up on enter (Framer `useInView` + a GSAP number tween); values are a simple bordered grid.

`sections/services.tsx` is the scroll-driven "journey" (the most involved section):
- Desktop draws a **rectilinear rounded-elbow path** built in real pixels (`buildPath`) from a `ResizeObserver`-measured container, so corners stay circular (no `preserveAspectRatio` distortion). Nodes are absolutely positioned at the same percentage coords the path bends to.
- A **scroll-reactive active state** (a rAF-throttled scroll handler comparing each `[data-step]`'s center to the viewport middle) grays/colors each step's whole cluster — icon, rings, number, tick, title, desc — and is reactive **both** directions.
- The line **fills up to the furthest active node** via `strokeDashoffset` (exact, using per-node `cumLen` from `buildPath` + `pathLength`), stroked with a vertical gradient that blends each node's color; mobile mirrors it with a `scaleY` gradient rail.
- Ring rotation is driven manually from the same rAF scroll handler (accumulating `delta * SPIN_SPEED`) and advances **only while a node is active** — scroll-linked but gated on the colored state (no ScrollTrigger in this file). The hand-authored `StepMotif` (inline SVG rings/dots) provides the visual richness.

GSAP work (see `sections/hero.tsx` for the canonical pattern) always: runs in a `gsap.context(..., ref)` and `ctx.revert()`s on cleanup (kills tweens, ScrollTriggers, and listeners); registers plugins inside the effect (`gsap.registerPlugin(ScrollTrigger)`); and gates motion behind `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` so it degrades to static content. Masked text reveals use an `overflow-hidden` wrapper with an inner element animated via `yPercent`; cursor-follow effects (hero parallax, the footer's magnetic email button) use `gsap.quickTo` under a `(pointer: fine)` matchMedia.

**ScrollTrigger + async content:** a trigger placed below content that grows after load (e.g. the async Projects sections) caches stale positions. `sections/about.tsx` guards against this with a `ResizeObserver` on `document.body` that calls `ScrollTrigger.refresh()` — replicate that for any scrubbed section below fetched content.

**Styling** — Tailwind CSS v4 (config via `app/globals.css`, PostCSS). shadcn/ui is configured in `components.json` (style `base-maia`, base color `olive`, lucide icons). Fonts wired through CSS variables in `layout.tsx`: Geist (sans), Geist Mono (mono), Oxanium (`--font-heading`).

Components style with **the stock shadcn semantic tokens, not raw hex** — `border-border`, `text-foreground`/`bg-background`, `text-muted-foreground`, `text-destructive`, and `text-primary`/`border-primary` for the accent/hover color (the olive base from the initialized theme). No custom brand token — keep to the shadcn palette so both themes stay consistent. (Per-project/step **accent hexes** in `lib/constants/projects.ts` and `sections/services.tsx` are the deliberate exception — they're data, applied via inline `style`.)

## Testing

- **Vitest + Testing Library** (jsdom). Config in `vitest.config.ts`; global setup and shared helpers live in `test/integration/` (setup mocks `matchMedia`/`IntersectionObserver`/`ResizeObserver`/`scrollIntoView`, which jsdom lacks).
- Tests live in `__tests__/` folders next to the code — `components/layout/__tests__/`, `components/sections/__tests__/`, `components/ui/__tests__/` — one file per component. They are shallow render/presence checks only.
- **Always render via `renderWithProviders` from `@/test/integration`**, not RTL's raw `render` — it wraps the component in the app's real provider stack (TanStack Query with a fresh no-retry client, next-themes) so hooks resolve. That barrel also re-exports `describe`/`it`/`expect`/`vi` plus `screen`/`fireEvent`/`userEvent`, so import everything from it.
- `vitest.config.ts` disables PostCSS (`css.postcss.plugins: []`) so CSS imports don't try to run the app's Tailwind v4 pipeline, which fails under Vite's test CSS transform.
- **No `@vitejs/plugin-react`** — it peers on `@babel/core@8` while `shadcn` pins v7, so installing it `ERESOLVE`s. It only adds Fast Refresh; Vitest transforms JSX with esbuild via the `jsx: "react-jsx"` tsconfig. Don't re-add it.
- Setup **globally stubs `useSimulatedLoading` → `false`**, otherwise every Projects/drawer test would assert against a skeleton instead of real content.
- `matchMedia` is mocked to `matches: false`, so GSAP's `no-preference` gate never fires and components render their static, assertable state.
- **Duplicated text is normal** — `Services` renders a desktop (snake) *and* mobile (rail) copy of every step, and `Projects2` renders each title in both the index row and its preview panel. Use `getAllByText`, not `getByText`.
- The drawer is driven by its Zustand store, so its test calls `useProjectDrawer.setState(...)` directly and resets in `afterEach`.

## CI

`.github/workflows/test.yml` runs on **pull requests to `main`**, gating the merge (and the Vercel production deploy that follows it). Two jobs: `build` (runs `npm run build`) then `test` (`needs: build`, so tests only run if the production build passes). The `test` job runs `npm run test:integration:coverage` and posts a coverage summary as a PR comment via `davelosert/vitest-coverage-report-action` — this needs the `json-summary`/`json` coverage reporters (set in `vitest.config.ts`) and `pull-requests: write` permission. Coverage is written to `test/integration/coverage`, so the action is given explicit `json-summary-path`/`json-final-path` (its default is `./coverage`).

Both `Build` and `Test` must be required in branch protection: a failing build *skips* `test` rather than failing it, so requiring only `Test` wouldn't block a broken build. Don't enable "require deployments to succeed" for the `Production` environment — Vercel only creates that deployment *after* a merge to `main`, which deadlocks the PR.

## Observability

- **Sentry** (`@sentry/nextjs`) — `instrumentation.ts` (server/edge), `instrumentation-client.ts`, `sentry.{server,edge}.config.ts`, and `app/global-error.tsx`. Tracing/replay are sampled very low (`0.01`); error capture is the point. `next.config.ts` is wrapped in `withSentryConfig` for source-map upload, reading `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN` — upload silently skips when the token is absent (local, forks).
- **Vercel** `<Analytics />` + `<SpeedInsights />` are mounted in `app/layout.tsx`; they only report once deployed.
- **Metadata** — `app/layout.tsx` sets `metadataBase` from `VERCEL_PROJECT_PRODUCTION_URL` (falling back to localhost), plus `openGraph`/`twitter`. `app/opengraph-image.png` is file-based, so Next wires `og:image`/`twitter:image` automatically — don't add an `images` key.
- Env keys are documented in `.env.example`.
