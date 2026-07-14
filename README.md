# Agency Demo

A neo-brutalist agency landing page built with Next.js 16 (App Router) and React 19. Showcases a GSAP hero animation, a Framer Motion staggered project grid, and data fetched from a GraphQL API via TanStack Query.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** with **shadcn/ui** components
- **TanStack Query** + **graphql-request** for data
- **GSAP** and **Framer Motion** for animation
- **next-themes** (dark by default) and **Sonner** toasts

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run start      # Serve production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run format     # Prettier
```

## Adding components

Add shadcn/ui components (they land in `components/ui`):

```bash
npx shadcn@latest add button
```

Import them via the `@/` alias:

```tsx
import { Button } from "@/components/ui/button";
```
