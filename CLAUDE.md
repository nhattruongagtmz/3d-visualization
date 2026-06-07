# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run test         # Run Vitest test suite
npm run generate-routes  # Regenerate TanStack Router route tree (rarely needed manually)
```

Add Shadcn components:
```bash
pnpm dlx shadcn@latest add <component>
```

## Architecture

This is a **TanStack Start** (SSR React) app — a 3D-print product storefront. Key stack: React 19, TanStack Router (file-based), TailwindCSS v4, Shadcn/Radix UI.

**Routing** — File-based via `src/routes/`. The route tree is auto-generated into `src/routeTree.gen.ts` by the TanStack Router Vite plugin; do not edit that file. Root layout lives in `src/routes/__root.tsx` and wraps every page with `<Header>`, `<Footer>`, and `<CartProvider>`.

**Data layer** — All product data is static in `src/lib/data.ts` (`PRODUCTS` array + `CATEGORIES`). Types are in `src/lib/types.ts`. There is no backend/API; server functions from TanStack Start are available but unused currently.

**Cart state** — Managed via React Context in `src/contexts/CartContext.tsx`. Cart is in-memory only (no persistence). The `<CartDrawer>` is rendered inside the Header.

**Path aliases** — Both `#/*` and `@/*` resolve to `src/*` (configured in `tsconfig.json` and `vite.config.ts`).

**Theme** — Dark/light/auto mode. The theme init script in `__root.tsx` runs before React hydrates to avoid flash. Theme class is applied to `<html>`.

**Shadcn components** live in `src/components/ui/`. Business components (ProductCard, CartDrawer, etc.) live in `src/components/`.
