# SGM Gold Standard — Next Steps

**After session:** 2026-04-10 (6 commits shipped, 20+ items completed)
**Branch:** `main` · all work deployed via Cloudflare Pages
**Latest commit:** `7ddf36c` feat(sgm): polish pass — 10 audit items

---

## What was shipped today

1. `f3bc188..5efe65b` **Northwind rebrand** — Henry Schein → Northwind Distribution (generic demo tenant)
2. `69463a7` **PrizymShell + site-wide UI standardization** — custom bottom-nav shell, dark-glass cards, bright tokens, icon bubbles, 17 pages standardized
3. `9b294a1` **Nav consolidation** — Documents 5 routes → 1, Actions Queue merge (Approvals+Exceptions+Attestations+Decisions), Committees → Tools
4. `4f742fe` **Month-grid calendar + Audit Trail decompression + single-module direct nav + bright section colors**
5. `8cad5c0` **Purple→cyan gradient + warm section palette + Governance Frameworks removal**
6. `c04cc66` **Green → Fuchsia success highlights**
7. `7ddf36c` **Polish pass** — StatusBadge rebuilt, stale tokens updated, ⌘K command palette, notifications bell, user avatar, toast system, empty state helper, home hero SGM framing

## Current nav shape

**5 sections, 13 modules total**

| Section | Modules |
|---|---|
| Documents | Documents Library (direct nav, 1 module) |
| Tools | ASC 606 Calculator, 88-Checkpoint Framework, Committees |
| Compliance | Obligations, Control Status, Reports, Audit Readiness |
| Workflows | Actions Queue, Cases, Calendar, Audit Trail |
| AI | AskSGM Workspace (direct nav, 1 module) |

## What's still open

### 🔴 Priority 1 — Fork to `aicr-rallies` for Henry Schein pre-prod
This is the whole reason the Gold Standard exists. Scope:
- New repo scaffold (copy this repo's structure)
- Swap Northwind tenant for real Henry Schein data
- Replace `data/prizym-governance/tenant/org-profile.ts` + `assessment-state.ts`
- Replace Northwind in `data/prizym-governance/operate.ts` comment
- Seed real HS obligations, controls, cases, policies
- Brand the topbar (logo, badge) for HS
- Probably wants its own PrizymShell variant
- Swap `lib/prizym-governance/persistence.ts` (the single file meant to be the isolation boundary per the architecture notes in session memory)

Real donor root for any additional component ports: `~/Development/aicr-platform-ver/forge/prizym/governance/`

### 🟡 Priority 2 — Spot-fixes from live walkthrough
Walk the deployed site with fresh eyes and catalog:
- Any page that still feels visually off
- Any dim text I missed
- Any buttons that need the toast treatment (currently only Reports Run/Download are wired)
- Empty states anywhere a filter returns zero (currently only Reports)
- Sticky header overlap issues on specific breakpoints

### 🟡 Priority 3 — Content depth
Some pages have thin seed data (3–4 rows) making them feel sparse during the demo. Worth extending:
- `data/prizym-governance/compliance/obligations.ts` — ~8 obligations, could use 12–15 for a meaty register view
- `data/prizym-governance/oversee.ts` COMPLIANCE_CONTROLS — 12 controls, fine
- `data/prizym-governance/dispute.ts` DISPUTE_CASES — 6 cases, could add 4–6 more
- `data/prizym-governance/workflows/exceptions.ts` EXCEPTIONS — ~10, OK
- `data/prizym-governance/audit.ts` AUDIT_EVENTS — could use more variety in impact levels

### 🟢 Priority 4 — Nice-to-haves (from the audit)
- **Deep-link filter state** — the in-page Documents tab state doesn't survive refresh or share. Convert to `?type=policies` query param if demoing sharing.
- **Executive summary view** — BHG / HS buyers want C-level rollups. Currently Home is Jordan Pace's desk, not Avery Caldwell's. Could add a "CFO view" toggle that simplifies the home dashboard.
- **More fake button wiring** — Escalate, Download, Export, Attest buttons on individual pages should fire `showDemoToast()` so walking the demo feels interactive.
- **Empty states everywhere** — wire `<EmptyState />` into Cases filters, Actions tabs, Exceptions filters, Audit Trail filters, Documents Library filter combo.

## Picking up tomorrow

1. Read this doc + `docs/superpowers/specs/2026-04-10-sgm-dropdown-nav-design.md` + the project memory (`project_sgm_gold_standard.md`)
2. Check the deployed Cloudflare site for any visual regressions
3. Pick a priority and go

## Architecture notes worth remembering

- **PrizymShell** is the custom shell for this demo only — other demos still use DemoShell
- **Persistence isolation boundary** is `lib/prizym-governance/persistence.ts` — the single file to swap for the HS fork
- **Zustand gotcha:** never use selector function invocations inside `useAssessmentStore(s => s.score())` — creates infinite loop in React 19. Always use raw state + useMemo
- **.pg-icon-bubble** is the site standard for icon containers: dark recess + bright border + bright icon stroke-width 2.4
- **Bright variant tokens** (`--pg-*-bright`) are for TEXT on the gradient; base tokens are for fills/borders
- **Typecheck with `pnpm typecheck`**; full verify (including static export + route check) with `pnpm verify` — prefer verify before committing
