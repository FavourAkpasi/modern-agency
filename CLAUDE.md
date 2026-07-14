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

**Page composition** — `app/page.tsx` is a thin server component that assembles the UI from feature components. Concerns are split into two folders:
- `components/layout/` — navigation. `web-nav.tsx` (desktop, `hidden md:flex`) and `mobile-nav.tsx` (mobile, `md:hidden`, hamburger + Framer Motion overlay) both render links from the shared `nav-items.ts` array (so nav targets stay in sync across breakpoints) plus the shared `theme-toggle.tsx`.
- `components/sections/` — one component per page section (`hero.tsx`, `projects.tsx`, `footer.tsx`). Each owns its own animation/data logic and is a `"use client"` component where it needs hooks.

Nav links are anchor scroll targets: the sections expose `id`s (`#top` on `<main>`, `#work` on Projects, `#contact` on Footer) that `nav-items.ts` points at.

**Animation** — two libraries coexist by role: **GSAP** for imperative timeline animations (wrap in `gsap.context(..., ref)` and `ctx.revert()` on cleanup — see `app/page.tsx`), **Framer Motion** for declarative variant-based/stagger animations.

**Styling** — Tailwind CSS v4 (config via `app/globals.css`, PostCSS). shadcn/ui is configured in `components.json` (style `base-maia`, base color `olive`, lucide icons). Fonts wired through CSS variables in `layout.tsx`: Geist (sans), Geist Mono (mono), Oxanium (`--font-heading`).

Components style with **the stock shadcn semantic tokens, not raw hex** — `border-border`, `text-foreground`/`bg-background`, `text-muted-foreground`, `text-destructive`, and `text-primary`/`border-primary` for the accent/hover color (the olive base from the initialized theme). No custom brand token — keep to the shadcn palette so both themes stay consistent.
