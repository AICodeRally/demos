# Demo Platform Standardization Audit

Date: 2026-03-14  
Scope: `../demos` repo + scaffold inputs in `services/demo-svc`, `services/research-svc`, and `/.claude/plugins/local/demo-pipeline/skills/demo.md`

## Executive Summary

The demos platform is productive but has drift across shell patterns, route conventions, and scaffold automation.

The most important issue is not visual inconsistency, it is contract inconsistency between:
- the live demos repo conventions (`DemoShell` / `SpmShell` / special-case route demo), and
- `demo-svc` generated scaffold output.

This mismatch will slow generation quality and increase manual cleanup when creating new demos.

## Current State Snapshot

- Demo apps under `app/(demos)`:
  - 12 demo roots detected
  - 11 include `demo.config.ts`
  - 1 (`routeiq-route`) is intentionally standalone and does not use shell config
- Shell systems currently in use:
  - `DemoShell`: most demos
  - `SpmShell`: `quota`
  - standalone custom layout: `routeiq-route`
- Page volume varies significantly by demo (1 to 35 pages).

## Findings

## 1) Scaffold Contract Drift Between `demo-svc` and Real Demo Patterns (High)

Evidence:
- `services/demo-svc/internal/engine/engine.go`
  - `generateDemoConfig()` hardcodes `theme: 'clean-light'` and places `proposal.ThemeName` into `product.badge`.
  - generated config does not include several real-world knobs used in demos (`darkMode`, `region`, section colors, logo usage).
- Existing demos show richer config and varied patterns:
  - `app/(demos)/routeiq/demo.config.ts`
  - `app/(demos)/register/demo.config.ts`
  - `app/(demos)/meridian/demo.config.ts`

Impact:
- Generated demos will compile, but require manual rework to match production-quality conventions.
- The automation appears “successful” while producing non-standard outputs.

## 2) Mixed Shell Architecture Without Explicit Contract Versioning (Medium)

Evidence:
- `components/demo-shell/*`
- `components/spm-shell/*`
- `app/(demos)/quota/layout.tsx` (`SpmShell`)
- `app/(demos)/routeiq-route/layout.tsx` (custom, no shell)

Impact:
- New scaffold generation has no authoritative rule for selecting shell type.
- Teams can accidentally introduce a 4th pattern.

## 3) `demo-svc` Server Uses `analysis_id` as Industry Placeholder (High)

Evidence:
- `services/demo-svc/internal/server/server.go` in `ProposeDemoStructure()`:
  - constructs `analysis := &engine.PackAnalysis{Industry: req.GetAnalysisId()}`

Impact:
- Proposal generation is decoupled from actual `AnalyzePack` output.
- `analysis_id` is effectively treated as industry text, reducing proposal quality and making traceability weak.

## 4) Tenant Context Not Persisted on Generated Demo Save (High)

Evidence:
- `services/demo-svc/internal/engine/engine.go` in `GenerateScaffold()`:
  - `SaveGeneratedDemo(... tenantID="" ...)`
- DB schema requires tenant:
  - `services/demo-svc/internal/migration/001_initial.up.sql` (`tenant_id TEXT NOT NULL`)

Impact:
- Multi-tenant auditability and retrieval quality are compromised.
- Generated demo records are not reliably attributable.

## 5) Streaming API vs Client Contract Mismatch (Medium)

Evidence:
- Proto declares streaming response:
  - `services/proto/aicr/demo/v1/demo.proto` (`GenerateScaffold` returns stream)
- Service client uses `post` expecting single JSON payload:
  - `packages/service-client/src/services/demo.ts`

Impact:
- Client behavior does not match API surface intent.
- Limits robust progressive scaffold generation UX.

## 6) Pipeline Skill Is Stale Relative to Current Demo State (Medium)

Evidence:
- `/.claude/plugins/local/demo-pipeline/skills/demo.md`
  - still assumes old manual wiring and outdated execution details (for example build command style and historical references).
- `../demos` recently removed source API explorer while stale build artifacts still exist in `out/api-explorer/*`.

Impact:
- Team guidance diverges from current reality.
- Higher chance of “it worked in docs, not in repo” issues.

## 7) Build Artifact Hygiene Drift (Low)

Evidence:
- `../demos/out/api-explorer/*` artifacts still present while source route/components were removed.

Impact:
- Potential confusion during review and demos QA.
- Increased chance of shipping stale static pages if publish flow does not always cleanly rebuild.

## 8) Validation Gates Are Minimal for a High-variance UI Surface (Low)

Evidence:
- `../demos/package.json` only includes `dev`, `build`, `start`, `typecheck`.

Impact:
- Standardization regressions are not systematically detected.
- Conventions depend on manual discipline rather than guardrails.

## What Is Already Strong

- Most demos follow a shared `defineDemo` + shell layout pattern.
- Theme preset system is centralized in `lib/theme`.
- `demo-svc` and `research-svc` provide a good foundation (analysis -> proposal -> scaffold).

## Recommended Priority Order

1. Fix scaffold contract drift and tenant persistence in `demo-svc`.
2. Add explicit shell contract (`demo-shell`, `spm-shell`, `standalone`) and generation rules.
3. Align service-client with streaming scaffold behavior.
4. Update `/demo` skill and add executable validation gates in `../demos`.
5. Clean stale build artifacts and lock build hygiene.

