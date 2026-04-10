# Prizym SGM — Gold Standard Demo Design

**Date:** 2026-04-09
**Status:** Draft — awaiting user review
**Author:** Todd LeBaron + Claude

## Goal

Build the definitive, permanent showcase demo for the Prizym Sales Governance Manager (SGM) methodology inside `aicr-demos-cf`. Single Cloudflare-deployed Next.js app that pulls the best surfaces from every prior SGM build into one coherent "Gold Standard" experience prospects can explore for 10+ minutes and feel "this is a real product."

Success criterion: a governance-expert prospect (BHG today, Henry Schein next) can land on the home page, take the 88-checkpoint assessment, read their maturity archetype, click through every quadrant of the governance library, use the ASC 606 calculator, chat with the AI, and believe what they're seeing — all without backend state.

## Non-goals

- Not a rewrite of `aicr-sgm-cf` (which stays live at `sgm.aicoderally.com` until this demo supersedes it).
- Not multi-tenant, not auth-protected, not SOC 2 ready — that's phase 2 in `aicr-rallies`.
- Not a real backend — no D1, no Prisma, no API routes except the Forge AI proxy the demos-cf shell already uses.
- Not ported wholesale from the Summit original — we take surfaces that look credible static, skip workflow pages that look thin without real state.
- Not a "consolidation of repos" — this is a **new build** in `aicr-demos-cf`, with the other repos serving as content donors only.

## Context — prior SGM builds (donors)

| # | Build | Location | Role for this spec |
|---|---|---|---|
| 1 | **Original Summit SGM** | `aicr-bhg-edge-ver/forge/prizym/governance/` | Primary donor: theme, ASC 606 library + calculator, 22 SCP policies JSON, OpsChief Orb + AskDock AI UX, Henry Schein deliverable patterns |
| 2 | **Current `aicr-sgm-cf`** | this repo's neighbor | Donor: 88-checkpoint framework engine (`engine/framework.ts` + `engine/scoring.ts`), scoping wizard, AskSGM Forge integration, archetype logic |
| 3 | **Restored 9-page static demo** | `aicr-demos-cf` branch `restore-old-sgm-demo` @ commit `62fa3ca` | Donor: layout, card patterns, CSS base (`styles/ext/prizym-governance.css`), DemoShell config shape — this is the CURRENT restored state that we will rebuild in place |
| 4 | `aicr-govern-cf` | separate Hono+D1 governance engine | Not used — different product |
| 5 | `aicr-bhg-edge-ver/forge/prizym/scoping/` | Next.js scoping engine | Reference only — scoping content ideas |
| 6 | `aicr-bhg-edge-ver/packages/packs/domains/sgm/` | Pack domain | Reference for SCP-001-clawback policy content |

## Architecture

### Stack & deploy

- **Framework:** Next.js 16 with Turbopack (matches every other demo in `aicr-demos-cf`)
- **Shell:** `components/shell/DemoShell` with sidebar layout and theme provider
- **State:** Zustand store + `localStorage` persistence; zero network except the Forge AI widget
- **Data:** Inline TypeScript modules under `data/prizym-governance/*.ts` — pure imports, no fetching
- **Deploy:** Cloudflare via the existing `aicr-demos-cf` wrangler config — no new infra

### Directory layout

```
aicr-demos-cf/
├── app/(demos)/prizym-governance/
│   ├── layout.tsx                        # DemoShell + theme provider (exists, restored)
│   ├── page.tsx                          # NEW: landing hero (replaces /dashboard redirect)
│   ├── dashboard/page.tsx                # existing, re-themed
│   ├── assess/
│   │   ├── wizard/page.tsx               # NEW: 88-checkpoint wizard
│   │   ├── scoping/page.tsx              # NEW: scoping wizard
│   │   └── results/page.tsx              # NEW: archetype + maturity results
│   ├── design/
│   │   ├── page.tsx                      # NEW: Design quadrant landing
│   │   ├── plans/page.tsx                # existing (relocated from root)
│   │   ├── templates/page.tsx            # existing (relocated)
│   │   ├── asc606-calculator/page.tsx    # NEW: ported from Summit
│   │   └── asc606-library/page.tsx       # NEW: ported from Summit
│   ├── operate/
│   │   ├── page.tsx                      # NEW: Operate quadrant landing
│   │   ├── committees/page.tsx           # existing (relocated)
│   │   ├── approvals/page.tsx            # NEW: ported from Summit
│   │   ├── decisions/page.tsx            # NEW
│   │   ├── calendar/page.tsx             # NEW
│   │   ├── tasks/page.tsx                # NEW
│   │   └── notifications/page.tsx        # NEW
│   ├── dispute/
│   │   ├── page.tsx                      # NEW: Dispute quadrant landing
│   │   └── cases/page.tsx                # NEW
│   ├── oversee/
│   │   ├── page.tsx                      # NEW: Oversee quadrant landing
│   │   ├── policies/page.tsx             # existing (relocated)
│   │   ├── compliance/page.tsx           # NEW
│   │   ├── audit/page.tsx                # existing (relocated)
│   │   ├── reports/page.tsx              # NEW
│   │   └── pulse/page.tsx                # NEW
│   ├── library/
│   │   ├── framework/page.tsx            # NEW: 88-checkpoint browser
│   │   ├── governance-frameworks/page.tsx # existing (was /frameworks)
│   │   ├── documents/page.tsx            # existing (relocated)
│   │   ├── links/page.tsx                # NEW
│   │   └── search/page.tsx               # NEW
│   ├── asksgm/page.tsx                   # NEW: AI workspace full-page
│   └── analytics/page.tsx                # existing
├── components/demos/prizym-governance/
│   ├── PrizymPage.tsx                    # existing
│   ├── StatusBadge.tsx                   # existing
│   ├── ThemeProvider.tsx                 # existing — rewire to SPARCC palette
│   ├── ai/
│   │   ├── OpsChiefOrb.tsx               # NEW: floating orb (from Summit)
│   │   ├── AskDock.tsx                   # NEW: slide-out chat (from Summit)
│   │   └── AskSGMChat.tsx                # NEW: Forge integration (from aicr-sgm-cf)
│   ├── assessment/
│   │   ├── AssessmentWizard.tsx          # NEW: ported component
│   │   ├── CheckpointCard.tsx            # NEW
│   │   └── ResultsChart.tsx              # NEW
│   ├── scoping/
│   │   └── ScopingWizard.tsx             # NEW
│   └── asc606/
│       ├── AllocationTable.tsx           # NEW: from Summit
│       └── CalculatorShell.tsx           # NEW
├── data/prizym-governance/
│   ├── engine/
│   │   ├── framework.ts                  # NEW: ported pure functions from aicr-sgm-cf
│   │   └── scoring.ts                    # NEW: ported pure functions
│   ├── henry-schein/                     # synthetic tenant seed data
│   │   ├── assessment-state.ts           # ~60% complete baseline
│   │   ├── org-profile.ts
│   │   └── brand.ts
│   ├── analytics.ts                      # existing
│   ├── audit.ts                          # existing
│   ├── committees.ts                     # existing
│   ├── documents.ts                      # existing
│   ├── frameworks.ts                     # existing
│   ├── plans.ts                          # existing
│   ├── policies.ts                       # existing — expand from 5 to 22 SCPs using Summit data
│   ├── asc606.ts                         # NEW: from Summit lib/data/asc606/
│   ├── decisions.ts                      # NEW
│   ├── cases.ts                          # NEW
│   ├── compliance.ts                     # NEW
│   ├── reports.ts                        # NEW
│   ├── pulse.ts                          # NEW
│   ├── calendar.ts                       # NEW
│   ├── tasks.ts                          # NEW
│   └── notifications.ts                  # NEW
├── lib/prizym-governance/
│   ├── persistence.ts                    # localStorage adapter — single swap point for rallies fork
│   └── store.ts                          # Zustand store
└── styles/ext/prizym-governance.css      # existing — gradient stops swapped to SPARCC palette
```

## Module inventory (all 32 routes)

Organized by sidebar group, mapped to donor source and status:

### Home (2 routes)
| Route | Status | Source |
|---|---|---|
| `/` | new | New landing hero with CTAs: "Take the Assessment", "Explore Governance", "Henry Schein Preview" |
| `/dashboard` | existing, re-themed | Restored demo dashboard re-skinned with SPARCC gradient |

### Assess (3 routes)
| Route | Status | Source |
|---|---|---|
| `/assess/wizard` | new | Port `aicr-sgm-cf/src/client/components/AssessmentWizard.tsx` |
| `/assess/scoping` | new | Port `aicr-sgm-cf/src/client/components/ScopingWizard.tsx` |
| `/assess/results` | new | Port `aicr-sgm-cf/src/client/components/Results.tsx` |

### Design quadrant (5 routes)
| Route | Status | Source |
|---|---|---|
| `/design` | new | Quadrant landing, summary of subsections |
| `/design/plans` | existing | Restored, relocated |
| `/design/templates` | existing | Restored, relocated |
| `/design/asc606-calculator` | new | Port `aicr-bhg-edge-ver/.../app/(app)/design/asc606-calculator/page.tsx` |
| `/design/asc606-library` | new | Port `lib/data/asc606/` + list view UI |

### Operate quadrant (7 routes)
| Route | Status | Source |
|---|---|---|
| `/operate` | new | Quadrant landing |
| `/operate/committees` | existing | Restored, relocated |
| `/operate/approvals` | new | Summit `app/(app)/approvals/` |
| `/operate/decisions` | new | Summit `app/(app)/decisions/` |
| `/operate/calendar` | new | Summit synthetic calendar.data.ts |
| `/operate/tasks` | new | Summit tasks |
| `/operate/notifications` | new | Summit notifications.data.ts |

### Dispute quadrant (2 routes)
| Route | Status | Source |
|---|---|---|
| `/dispute` | new | Quadrant landing |
| `/dispute/cases` | new | Summit cases |

### Oversee quadrant (6 routes)
| Route | Status | Source |
|---|---|---|
| `/oversee` | new | Quadrant landing |
| `/oversee/policies` | existing | Restored, relocated; **policy data expanded from 5 to 22 SCPs using Summit `lib/data/policies/SCP-*.json`** |
| `/oversee/compliance` | new | Summit compliance |
| `/oversee/audit` | existing | Restored, relocated |
| `/oversee/reports` | new | Summit reports |
| `/oversee/pulse` | new | Summit pulse |

### Library (5 routes)
| Route | Status | Source |
|---|---|---|
| `/library/framework` | new | 88-checkpoint browser using ported `engine/framework.ts` |
| `/library/governance-frameworks` | existing | was `/frameworks`, relocated |
| `/library/documents` | existing | Restored, relocated |
| `/library/links` | new | Summit document-links.data.ts |
| `/library/search` | new | Unified search across all data modules |

### AI (1 route)
| Route | Status | Source |
|---|---|---|
| `/asksgm` | new | Full-page AskSGM workspace — Forge API via AskSGMChat + Summit AskDock UX shell |

### Analytics (1 route)
| Route | Status | Source |
|---|---|---|
| `/analytics` | existing | Restored, re-themed |

## Data strategy

### Principles

- All data is **static TypeScript imports** — no API calls, no server state, no filesystem reads at runtime
- One synthetic tenant: **"Henry Schein Industries"** — plausible mid-assessment state, 22 published SCP (Sales Compensation Policy) entries, active committees, realistic plan/template library
- **88-checkpoint framework engine is pure functions** ported from `aicr-sgm-cf/apps/workers/src/engine/` — no modifications, just relocated
- **Assessment state lives in Zustand + localStorage** under key `sgm-assessment-v1`
- **First-visit seed:** the store hydrates from `data/prizym-governance/henry-schein/assessment-state.ts` which encodes a ~60%-complete state (Done / Partial / Not Started values across all 88 checkpoints). User can mutate freely after first visit, or reset via a button in Settings.

### Persistence isolation boundary

All persistence lives in **one file**: `lib/prizym-governance/persistence.ts`. It exposes:

```ts
export interface AssessmentPersistence {
  load(): AssessmentState | null;
  save(state: AssessmentState): void;
  reset(): void;
}
```

In the demo, the implementation is a localStorage adapter. In the `aicr-rallies` fork, that single file gets swapped for an HTTP adapter pointing at the pre-prod API. **No component imports localStorage directly.** This is the single most important architectural constraint in the spec.

### Data module ownership

Each data module (`data/prizym-governance/*.ts`) is imported directly by the pages that need it. No data fetching hooks, no caching layer, no SWR. Pure module scope.

## Theme & visual system

### Palette (SPARCC SPM, from Summit `lib/config/themes.ts`)

```ts
{
  id: 'sparcc-spm',
  name: 'SPARCC SPM',
  gradient: {
    start: '#0ea5e9',  // sky
    mid1:  '#3b82f6',  // blue
    mid2:  '#6366f1',  // indigo
    end:   '#8b5cf6',  // violet
  },
  primary:   '#0ea5e9',
  secondary: '#6366f1',
  accent:    '#8b5cf6',
}
```

### How it gets applied

1. `components/demos/prizym-governance/ThemeProvider.tsx` sets CSS custom properties on `:root`:
   - `--prizym-gradient-start`, `--prizym-gradient-mid1`, `--prizym-gradient-mid2`, `--prizym-gradient-end`
   - `--prizym-primary`, `--prizym-secondary`, `--prizym-accent`
2. `styles/ext/prizym-governance.css` is rewritten to consume those custom properties instead of the hardcoded navy/cyan from the restored demo
3. Dashboard hero gets `background: linear-gradient(135deg, var(--prizym-gradient-start) 0%, var(--prizym-gradient-mid1) 33%, var(--prizym-gradient-mid2) 66%, var(--prizym-gradient-end) 100%)`
4. Card accent borders and hover glows use `var(--prizym-accent)` (violet)
5. Active nav items use `var(--prizym-primary)` (sky)
6. Layout, card patterns, spacing, and typography are unchanged from the restored demo

### Readability (global CLAUDE.md enforcement)

- Minimum body font 18px, 16px for small text, 14px absolute floor for captions
- Hero titles 56px+, section titles 36px+
- On dark gradient hero: `#FFFFFF` headings, `#E2E8F0` body
- On light backgrounds: `#0F172A` primary, `#334155` secondary
- Zero banned dim grays (`#94A3B8`, `#64748B`, `#475569`, `#B0BEC5`, `#9CA3AF`, `#6B7280`) anywhere on dark backgrounds
- No `opacity-60`, `text-white/70`, or similar dimming

## AI surfaces

### Backend (unchanged from `aicr-sgm-cf`)

- **Forge API:** `forge.aicoderally.com/api/widget`
- **Session start:** `POST /session/start` with `{ packId: 'spm', mode: 'ask' }`
- **Message:** `POST /session/message` with SSE streaming
- **Dual format parser:** `data: {json}` (Forge) and `0: {json}` (legacy) — ported verbatim from `AskSGMChat.tsx`

### Surfaces

In the Summit original, **OpsChief Orb** (insights panel with alerts/warnings) and **AskDock** (chat dock with Radix icons, markdown, knowledge base context) are **two different floating components**, not a chained "orb opens dock" pattern. The Gold Standard demo carries this forward with a staged rollout across waves:

**Wave 1** (foundation) ships the simpler pair ported straight from `aicr-sgm-cf`:
1. **AskSGMPanel** — floating button (bottom-right) that expands to a 420×600 chat panel. Hits Forge API via `AskSGMChat` internally. 100 lines, zero external deps. Ported from `aicr-sgm-cf/apps/workers/src/client/components/AskSGMPanel.tsx` + `AskSGMChat.tsx`.

**Wave 4** (AI polish) adds the richer Summit UX on top:
2. **OpsChief Orb** — separate floating widget reading synthetic insights from a local `data/prizym-governance/opschief-insights.ts` file (the original's `/api/ai/opschief` endpoint does not exist in demos-cf and is not being ported). Shows "3 committees due for review", "2 SOX controls at risk", etc.
3. **AskDock** — upgraded chat component with Radix icons, react-markdown rendering, page-context knowledge cards. Replaces AskSGMPanel across all pages.
4. **`/asksgm` workspace** — full-page "SGM Copilot" with:
   - Left rail: conversation history (localStorage-backed)
   - Center: the same chat UI as AskDock, larger
   - Right rail: suggested prompts grouped by quadrant (Design / Operate / Dispute / Oversee)

All chat surfaces share a single `useSgmChat()` hook (introduced in Wave 4) that wraps the Forge session lifecycle. In Wave 1 that logic lives inline in `AskSGMChat.tsx`.

## Navigation & IA

Sidebar groups, top to bottom:

```
HOME
  • Home
  • Dashboard

ASSESS
  • Take Assessment
  • Scoping
  • Results

DESIGN ← quadrant
  • Overview
  • Plans
  • Templates
  • ASC 606 Calculator
  • ASC 606 Library

OPERATE ← quadrant
  • Overview
  • Committees
  • Approvals
  • Decisions
  • Calendar
  • Tasks
  • Notifications

DISPUTE ← quadrant
  • Overview
  • Cases

OVERSEE ← quadrant
  • Overview
  • Policies
  • Compliance
  • Audit Trail
  • Reports
  • Pulse

LIBRARY
  • 88-Checkpoint Framework
  • Governance Frameworks
  • Documents
  • Links
  • Search

AI
  • AskSGM Workspace

ANALYTICS
  • Analytics
```

DemoShell sidebar with collapsible groups. Active route highlighted with SPARCC primary `#0ea5e9` accent border.

## Build sequencing (4 waves)

Each wave produces a runnable state and is a natural commit boundary.

### Wave 1 — Foundation (no new routes, existing pages re-themed)

- Add `zustand` dependency to `aicr-demos-cf`
- Rewrite `ThemeProvider.tsx` token values to SPARCC palette (structure unchanged — it already uses CSS custom properties)
- Rewrite `styles/ext/prizym-governance.css` gradient and accent color values to consume SPARCC custom properties (layout/cards/typography unchanged)
- Port `aicr-sgm-cf/apps/workers/src/engine/{framework,scoring}.ts` to `data/prizym-governance/engine/` (plus a shared `types.ts`)
- Create `lib/prizym-governance/persistence.ts` (persistence interface + localStorage adapter) and `store.ts` (Zustand assessment store)
- Create `data/prizym-governance/henry-schein/assessment-state.ts` with a ~60%-complete seed state and `org-profile.ts` with synthetic Henry Schein tenant data
- Port `AskSGMPanel.tsx` + `AskSGMChat.tsx` from `aicr-sgm-cf` to `components/demos/prizym-governance/ai/`, adapt imports (swap `useTheme` hook for `usePrizymTheme`, remove SPA-router hash check)
- Wire `AskSGMPanel` into `app/(demos)/prizym-governance/layout.tsx` so it appears on every page
- **Exit criterion:** the 9 existing pages render in SPARCC purple-blue, floating AskSGM button is visible bottom-right on every page, clicking it expands a working chat panel against Forge API, `pnpm typecheck` passes, `pnpm verify:demo-standard` passes

### Wave 2 — Assess flow (3 routes)

- `/assess/wizard` — full 88-checkpoint wizard reading from `engine/framework.ts`, writing to the Zustand store
- `/assess/scoping` — 20-question scoping flow
- `/assess/results` — maturity score + archetype using `engine/scoring.ts`
- Home landing `/` page with CTAs pointing at `/assess/wizard`
- **Exit criterion:** a prospect can land on `/`, click "Take Assessment", answer all 88 checkpoints, see archetype on `/assess/results`. The dashboard `/dashboard` reads its "maturity" metric from the same store.

### Wave 3 — Design, Operate, Oversee depth (~14 routes)

- Relocate existing `policies`, `plans`, `templates`, `committees`, `audit` pages under their new quadrant groups
- Expand `data/prizym-governance/policies.ts` from 5 to 22 SCPs using Summit's `SCP-*.json`
- Build all new Design routes (ASC 606 calculator + library)
- Build all new Operate routes (approvals, decisions, calendar, tasks, notifications)
- Build all new Oversee routes (compliance, reports, pulse)
- Create `.../quadrant-landing/page.tsx` for each of the 4 quadrants
- **Exit criterion:** every route under Design, Operate, Oversee is reachable from the sidebar and renders with plausible synthetic data

### Wave 4 — Dispute, Library, AI workspace (~6 routes)

- `/dispute` landing + `/dispute/cases`
- `/library/framework` (88-checkpoint browser)
- `/library/links`, `/library/search`, relocate `/library/documents` and `/library/governance-frameworks`
- `/asksgm` full-page workspace
- **Exit criterion:** Tier 3 parity reached — every route in the module inventory is live and themed

### Pause point

If the Henry Schein sale accelerates mid-build, we pause between Wave 2 and Wave 3 and fork to `aicr-rallies` for pre-prod. The Assess flow is the highest-value demo content and enough to anchor a sales conversation.

## Fork path to `aicr-rallies` (phase 2, not in scope)

The spec is designed so the fork is mechanical:

1. Copy `app/(demos)/prizym-governance/` → new route group in `aicr-rallies`
2. Copy `components/demos/prizym-governance/` → matching path
3. Copy `data/prizym-governance/` → same
4. **Replace `lib/prizym-governance/persistence.ts`** with an HTTP adapter pointing at the pre-prod API
5. Add auth layer around the route group
6. Connect Forge API to real per-tenant pack IDs instead of the shared `spm` pack

No component changes. No theme changes. No route renames. The persistence file is the single swap point.

## Open questions / risks

- **Branding-system overlap:** `aicr-sgm-cf` has a branding API for BHG vs default presets. Do we want the Gold Standard demo to support brand switching between Henry Schein synthetic and a Prizym-default look? Recommend deferring to phase 2 — one brand (Henry Schein) is enough for Tier 3.
- **Forge API rate limits:** if the demo goes public on `demos.aicoderally.com`, the Forge widget will field requests from every browser that lands. Confirm Forge can handle it or add a client-side rate guard.
- **Policy data sanitization:** the Summit `SCP-*.json` files may contain Henry Schein-specific language. Need to scrub before merging into synthetic demo data. Low risk (they're already called synthetic in Summit), but worth a diff-review pass.
- **Wave 3 scale:** ~14 routes with real-feeling synthetic data is the single largest wave. Consider splitting into 3a (Design), 3b (Operate), 3c (Oversee) at plan-writing time.
- **Performance:** 27 routes + 22 SCPs + 88 checkpoints + synthetic data for each quadrant is still tiny compared to bundle budgets, but Turbopack HMR perf during development is worth keeping an eye on.

## Out of scope (explicitly)

- Multi-tenancy, auth, audit logging, real user identities
- Server-rendered data, API routes beyond Forge proxy
- Real policy publishing workflow (policies are read-only in the demo)
- Real approvals, decisions, dispute workflows (these pages show state snapshots)
- Export to PDF / PowerPoint (the Summit Henry Schein .pptx/.xlsx artifacts stay where they are; future phase)
- Any attempt to consolidate `aicr-govern-cf` (different product)
- Any changes to `aicr-sgm-cf` — it stays live at `sgm.aicoderally.com` untouched until this demo supersedes it
