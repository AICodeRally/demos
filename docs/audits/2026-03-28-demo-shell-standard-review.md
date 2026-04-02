# Demo Shell Standard Review

Date: 2026-03-28  
Scope: `../aicr-demos` (`app/(demos)`, `components/shell`, `scripts`, `docs`)

## Executive Summary

Shell standardization now supports **multiple first-class shell types** rather than forcing a single pattern.  
`on-the-clock`, `prizym-governance`, and `swic` have been moved onto `DemoShell` via the new `focus` layout.

Build baseline remains healthy (`pnpm generate:registry --json` and `pnpm typecheck` pass).

## Validation Performed

- `pnpm generate:registry --json` (pass)
- `pnpm typecheck` (pass)
- Nav-to-route coverage scan across all demos (`demo.config.ts` hrefs vs discovered `page.tsx` routes)
- Stub/placeholder scan (`TODO|FIXME|TBD|placeholder|WIP`)

## Inventory Snapshot

Total demo roots with config: **14**

- `sidebar`: **10**
- `topnav`: **1** (`quota`)
- `focus`: **3** (`on-the-clock`, `prizym-governance`, `swic`)
- `wizard`: **0** (available but currently unused)

## Current Findings

## 1) Multi-shell support is in place (Resolved)

- Added `focus` shell plugin for immersive demo surfaces.
- Migrated:
  - `app/(demos)/on-the-clock/layout.tsx`
  - `app/(demos)/prizym-governance/layout.tsx`
  - `app/(demos)/swic/layout.tsx`
- Added `layout: 'focus'` in corresponding `demo.config.ts` files.

## 2) Nav/route parity is strong, with intentional deep-links (Medium)

No missing nav href targets were found.  
A set of hidden/deep-link routes exists and should remain explicitly allowlisted.

## 3) Placeholder/stub policy still needs enforcement (Medium)

Known examples remain in route/data content (`register`, `proofline`, `wellspring`).

## 4) Runtime layout-schema validation still pending (Medium)

The shell resolver still applies defaults without plugin-level runtime schema validation.

## 5) Contributor docs are now aligned (Resolved)

`CLAUDE.md` now reflects current shell architecture and points to canonical `docs/standards/DEMO_STANDARD.md`.

## Remaining Backlog

1. Add CI gate for nav/route integrity with deep-link allowlist.
2. Add CI gate for placeholder/stub tokens with allowlist.
3. Add runtime plugin schema validation in shell config resolver.

## Proposed Enforcement Date

Enable strict demo-standard CI gates for all new/modified demos starting **2026-04-01**.
