# AICR Demo Platform

Unified demo platform for AI Code Rally product demos. Static Next.js 16 app deployed to Cloudflare Pages.

## Quick Commands

```bash
pnpm dev          # Dev server on port 3100
pnpm build        # Static export to out/
pnpm start        # Serve built output
pnpm typecheck    # TypeScript check
```

## Structure

- `app/page.tsx` — Portfolio landing page (grid of demo cards)
- `app/(demos)/<name>/` — Each demo's routes + layout + config
- `components/demo-shell/` — Shared DemoShell sidebar/header
- `components/demos/<name>/` — Demo-specific components
- `data/<name>/` — Demo mock data
- `lib/theme/` — Vendored prizym-theme (theming tokens)

## Adding a Demo

1. Create `app/(demos)/<name>/` with layout.tsx, page.tsx, demo.config.ts
2. Copy demo-specific components to `components/demos/<name>/`
3. Copy mock data to `data/<name>/`
4. Update imports: `@/components/demos/<name>/`, `@/data/<name>/`
5. Add card to portfolio in `app/page.tsx`

## Deploy

Push to `main` triggers GitHub Actions → Cloudflare Pages deploy.
Manual: `pnpm build && npx wrangler pages deploy out --project-name=aicr-demos`
