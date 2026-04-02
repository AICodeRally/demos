# AICR Demo Platform

Unified demo platform for AI Code Rally product demos. Static Next.js app deployed to Cloudflare Pages.

## Quick Commands

```bash
pnpm scaffold:demo <slug> --layout focus --acts 1  # Generate a new layout-aware demo starter
pnpm generate:registry                      # Build demo metadata registry from demo configs
pnpm dev                                    # Dev server on port 3100
pnpm typecheck                              # TypeScript check
pnpm verify                                 # Registry + typecheck + production build
pnpm build                                  # Production build
pnpm start                                  # Serve built output
```

## Structure

- `app/page.tsx` — Portfolio landing page (auto-driven from generated registry)
- `app/(demos)/<slug>/` — Demo routes + `layout.tsx` + `demo.config.ts`
- `components/shell/` — Unified `DemoShell` + plugins (`sidebar`, `topnav`, `wizard`, `focus`)
- `components/demos/<slug>/` — Demo-specific components
- `data/<slug>/` — Demo-specific mock data
- `docs/standards/DEMO_STANDARD.md` — Canonical new-demo and quality standard

## Adding Or Updating a Demo

1. Follow `docs/standards/DEMO_STANDARD.md` (canonical policy).
2. Create/update `app/(demos)/<slug>/demo.config.ts` with complete metadata.
3. Implement `layout.tsx` with `DemoShell` using the best-fit shell type (`sidebar`, `topnav`, `wizard`, `focus`).
4. Add/update routes under `app/(demos)/<slug>/...`.
5. Run `pnpm generate:registry` (never hand-edit `data/demo-registry.ts`).
6. Run `pnpm typecheck` (and `pnpm verify` before merge).

## Deploy

Push to `main` triggers GitHub Actions → Cloudflare Pages deploy.

Manual:

```bash
pnpm build && npx wrangler pages deploy out --project-name=aicr-demos
```
