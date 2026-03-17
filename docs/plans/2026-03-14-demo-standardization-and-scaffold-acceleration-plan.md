# Demo Standardization + Scaffold Acceleration Plan

Date: 2026-03-14  
Scope: `../demos` + `services/demo-svc` + `services/research-svc` + `/demo` skill

## Goal

Create a reliable, low-friction pipeline where a new demo can be scaffolded with minimal manual cleanup and predictable quality.

Definition of success:
- A new demo scaffold lands in `../demos` and passes checks in one run.
- Shell/theme/navigation contracts are explicit and enforced.
- `demo-svc` output matches real repo conventions.
- `/demo` skill is up to date and executable end-to-end.

## Guiding Principle

Standardize the contract first, then automate against that contract.

## Phase 0 — Contract Freeze (Day 0-1)

## Deliverables

1. `Demo Contract v1` doc in `../demos/docs/specs/` (new):
- required files
- config schema
- allowed shell types
- route pattern rules
- naming conventions for slugs/icons/sections

2. `Scaffold Output Contract v1` doc in `services/demo-svc/docs/` (new):
- exact generated file matrix
- required proposal fields
- deterministic defaults

## Key decisions to lock

- Allowed shell types:
  - `demo-shell`
  - `spm-shell`
  - `standalone`
- Section taxonomy options:
  - default 4-act business model
  - optional domain-specific taxonomy map
- Required proposal identity fields:
  - `product_name`, `client_name`, `client_tagline`, `client_region`, `theme_name`, `primary_color`, `accent_color`, `shell_type`

## Phase 1 — Demos Repo Standardization (Day 1-3)

## 1.1 Add executable convention audit

Add script in `../demos/scripts/audit-conventions.ts` to verify:
- every shell-based demo has `demo.config.ts` and layout wrapper
- config exports `defineDemo` or `defineSpmDemo` as expected
- nav items point to existing routes
- no orphan `page.tsx` without nav coverage (except allowed standalone demos)

Add `package.json` scripts:
- `audit:conventions`
- `verify` (typecheck + build + audit)

## 1.2 Normalize shell boundary

- Keep both shells (`DemoShell`, `SpmShell`) but formalize them as first-class variants.
- Add a small shared shell adapter interface for scaffold compatibility.

## 1.3 Remove stale build artifacts from source control policy

- Ensure `out/` is treated as generated deploy output and rebuilt cleanly on deploy.
- Add cleanup step in deploy flow (`rm -rf out && pnpm build`).

## Phase 2 — `demo-svc` Contract Alignment (Day 2-5)

## 2.1 Fix proposal-to-analysis flow

In `services/demo-svc/internal/server/server.go`:
- stop treating `analysis_id` as `industry`
- persist/retrieve full analysis state (or pass structured analysis directly)

## 2.2 Fix scaffold generation fidelity

In `services/demo-svc/internal/engine/engine.go`:
- map `theme_name` to `theme` preset properly
- keep `badge` independent from theme name
- include `darkMode`, `region`, section `color` support
- support explicit shell type selection

## 2.3 Fix generated demo persistence

In `GenerateScaffold()`:
- pass tenant ID from request context to `SaveGeneratedDemo`
- add guardrails when tenant context is missing

## 2.4 Expand template system from static snippets to reusable blocks

- Keep `demo_templates` table but add a composition strategy:
  - page archetype -> component set -> starter layout
- version template records (`template_version`) for deterministic regeneration.

## 2.5 Strengthen tests

Add tests for:
- shell type output (`demo-shell` vs `spm-shell` vs `standalone`)
- tenant persistence
- nav-route consistency
- config semantic correctness (theme/badge separation)

## Phase 3 — Client + Skill Orchestration (Day 4-6)

## 3.1 Align service client with streaming contract

In `packages/service-client/src/services/demo.ts`:
- implement proper stream handling for `GenerateScaffold`
- add fallback non-stream utility if needed, but make behavior explicit

## 3.2 Update `/demo` skill workflow

In `.claude/plugins/local/demo-pipeline/skills/demo.md`:
- update commands to current repo practices
- formalize output write + verification + summary steps
- enforce `verify` command in `../demos` before deployment

## 3.3 Add one-command scaffold apply tool

Add script in this repo (or `../demos/scripts/`):
- consumes scaffold JSON/stream
- writes files
- updates `app/page.tsx` demo card
- runs `pnpm verify`
- prints next actions

## Phase 4 — Rollout and Quality Gates (Day 6-7)

## 4.1 Pilot

- Generate one new demo from a fresh pack using the new flow.
- Measure manual edits required after scaffold.

## 4.2 Exit criteria

- New demo scaffold requires <= 10% manual edits for structure/theming.
- `pnpm verify` passes immediately after scaffold apply.
- `/demo` skill runbook matches actual command outputs.

## Work Breakdown (Execution Order)

1. Contract docs (Phase 0)
2. `demo-svc` fixes (Phase 2)
3. `../demos` audit script + verify pipeline (Phase 1)
4. service-client + `/demo` skill refresh (Phase 3)
5. pilot + measurement (Phase 4)

## Risks

- Over-standardization may block high-creativity demos.
- Streaming integration may require client/runtime refactor.
- Legacy demos may fail strict audits initially.

Mitigations:
- allow controlled exceptions via explicit `standalone` mode
- phase in checks as warnings first, then hard-fail
- maintain migration checklist for existing demos

## Immediate Next Actions (This Week)

1. Implement `demo-svc` tenant + analysis flow fixes.
2. Add `../demos` convention audit script and `verify` command.
3. Refresh `/demo` skill to match current repos and build/deploy behavior.
4. Run one end-to-end scaffold pilot and document delta.

