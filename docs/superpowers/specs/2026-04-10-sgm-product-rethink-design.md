# SGM Product Rethink — Design Spec

**Date:** 2026-04-10
**Branch:** `restore-old-sgm-demo`
**Author:** Claude Opus 4.6 (with Todd)

## Motivation

The current demo IA (Overview / Assess / Design / Operate / Dispute / Oversee / Library / AI) is organized around a **governance consulting journey** — the quadrants come from the SGM consulting methodology (Design plans → Operate the program → handle Disputes → Oversee compliance). That's a consultant's mental model.

The buyer is a **client Compliance Officer or Comp Manager** who uses the product daily to manage their sales-compensation policy program. Their mental model is:
- "What do I need to do today?" (pending attestations, approvals, reviews)
- "Where is that document?" (policies, procedures, comp plans, templates, controls)
- "Am I compliant?" (SOX 404, ASC 606, state wage law, audit readiness)
- "Which calculator/tool do I need for this problem?" (ASC 606 allocation, 88-checkpoint framework lookup)

Real GRC policy-management products (v-comply, MetricStream, NAVEX, Workiva) all organize around those four questions with a unified document library, a dedicated compliance-monitoring surface, an active-work inbox, and a small set of interactive tools.

**Also:** during the current build we removed the Assessment module (per prior decision — the consulting-assessment framing doesn't fit a product). This rethink finishes that pivot: from "consulting showcase" to "the client's product for managing sales-comp governance."

## Goals

1. Reframe the demo as a client-facing policy-management product, not a consulting methodology tour.
2. Organize content around the four client questions above (My Work, Documents, Tools, Compliance).
3. Collapse the current 8 sidebar groups into 6 with clearer domain boundaries.
4. Preserve the Henry Schein hero surfaces (ASC 606 Calculator, ASC 606 policies, Compliance dashboard with gauge, Approvals queue with the $14.5M windfall).
5. Keep the gradient-glass `sgm-glass` theme, AskSGM chat, and projector-grade readability.
6. Collapse to a **single theme** (gradient glass) — drop dark/light toggle entirely.
7. **Re-theme with a compliance-trust palette** — new blue → teal → emerald gradient replacing the current SPARCC cyan/blue/indigo/purple. Compliance buyers (CCOs, auditors) read navy-teal as "serious and professional" and the emerald hint as "healthy/compliant."
8. **Show enforcement state** — every lifecycle item (policies, attestations, approvals, controls, reviews) gets visible SLA/overdue/exception state. Add a new `/workflows/exceptions` page for active exception requests.

## Non-goals

- No new donor ports from Summit (we already have the data we need).
- No backend. Still pure static synthetic data.
- No attempt to implement editable authoring (it's a demo, not a working CMS — we *display* lifecycle state, we don't let users draft a new policy from scratch).
- **No dark/light mode toggle.** Single theme only — the SPARCC gradient-glass look. The theme toggle in the header gets removed along with all dark-mode token sets, `.dark` class handling in CSS, and the `html:not(.dark)` selectors. Simpler to maintain, zero theme-related bugs, one visual identity for the Henry Schein demo.

## New information architecture (6 groups)

```
Home
  • My Workspace               /prizym-governance

Documents
  • Comp Plans                 /documents/comp-plans
  • Policies                   /documents/policies
  • Procedures                 /documents/procedures
  • Controls                   /documents/controls
  • Templates                  /documents/templates

Tools
  • ASC 606 Calculator         /tools/asc606-calculator
  • 88-Checkpoint Framework    /tools/framework
  • Governance Frameworks      /tools/frameworks

Compliance
  • Obligations                /compliance/obligations
  • Control Status             /compliance/controls
  • Reports                    /compliance/reports
  • Audit Readiness            /compliance/audit

Workflows
  • Approvals                  /workflows/approvals
  • Attestations               /workflows/attestations
  • Reviews                    /workflows/reviews
  • Exceptions                 /workflows/exceptions    ← NEW (enforcement)
  • Cases                      /workflows/cases
  • Committees                 /workflows/committees
  • Calendar                   /workflows/calendar
  • Audit Trail                /workflows/audit-trail

AI
  • AskSGM Workspace           /asksgm
```

Plus a **universal search** button in the top header bar (not a sidebar entry).

### Design notes

- **Home = My Workspace**. The current `/dashboard` becomes the home page. It's an inbox-style view: "3 policies need your attestation", "2 approvals waiting for you", "Compliance score 83% (2 controls at risk)", "Next review in 5 days". This is the single most important new surface — it answers "what do I need to do today."
- **Documents is ONE page with tabs**, not five pages. The tab bar switches between Comp Plans / Policies / Procedures / Controls / Templates. The underlying table/card grid uses the same columns (name, type, status, version, owner, effective date, attestation %, next review). Tabs just change the type filter.
- **Tools gets the ASC 606 Calculator front-and-center** — it's the most interactive/impressive surface and was buried under `/design/` before.
- **Compliance is pure monitoring**. No documents live here, only status/scores/mappings/reports.
- **Workflows is the action queue**. Everything with a "do this" affordance lives here.

## New pages to build

### 1. Home / My Workspace (`/prizym-governance`)

Replaces the current `/dashboard` and the existing home page. Inbox-style layout:

**Top row — 4 KPI tiles:**
- Pending Attestations (for me)
- Pending Approvals (for me)
- Policies Up for Review This Quarter
- Compliance Score (with at-risk count)

**Middle — My inbox (2 columns):**
- Left: "For Your Attention" — mix of attestation reminders, approval requests, review-due policies, sorted by priority/due date
- Right: "Program Pulse" — 3-4 high-signal items (active dispute escalated, SOX control at risk, most-attested policy this week, next CRB meeting)

**Bottom — Recent Activity stream:**
- Last 8 events from the audit trail (policy published, approval decided, attestation completed)

### 2. Documents unified library (`/documents/*`)

Five routes, one shared component. Each route sets a `type` filter:
- `/documents/comp-plans` — type=comp_plan
- `/documents/policies` — type=policy
- `/documents/procedures` — type=procedure
- `/documents/controls` — type=control
- `/documents/templates` — type=template

Shared page layout:
- Tab bar (Comp Plans / Policies / Procedures / Controls / Templates) — always visible, highlights current
- Sub-filter chips (for policies: Sales / SOX / ASC 606 / Wage Law / Tax / Data Security)
- Status filter (All / Draft / In Review / Published / Superseded)
- Sortable columns: Name, Status, Version, Owner, Effective Date, Next Review, Attestation %
- Clicking a row opens a drawer with the full document content + lifecycle history + linked obligations

### 3. Obligations register (`/compliance/obligations`)

New data file + page. An obligation is a regulatory requirement the organization must satisfy.

**Sample obligations:**
- SOX Section 302 (officer certification)
- SOX Section 404 (ICFR management assessment)
- ASC 606 (revenue recognition)
- IRS Section 409A (deferred compensation)
- California AB-2288 (commission statements)
- NY Labor Law 191 (payment timing)
- SOC 2 Type II (data security)

**Page layout:**
- Obligations table: Code, Name, Jurisdiction, Status (Compliant / At Risk / Non-Compliant / Not Assessed), Policies mapped, Controls mapped, Next review
- Click row → drawer with full description, policies satisfying it, controls testing it, evidence artifacts
- A heatmap visualization at the top: obligations (rows) × quarters (columns) showing compliance status over time

### 4. Pages that get promoted / moved (no new logic, just re-homed)

These are existing pages that stay functionally the same but get new URLs + sidebar placement:

| Old URL | New URL | Notes |
|---|---|---|
| `/dashboard` | `/` (home page) | Dashboard content merges into home |
| `/policies` | `/documents/policies` | With new type filter |
| `/plans` | `/documents/comp-plans` | |
| `/templates` | `/documents/templates` | |
| `/design/asc606-calculator` | `/tools/asc606-calculator` | |
| `/design/asc606-library` | `/documents/policies?filter=asc606` | Merged into Policies (filtered view) |
| `/library/framework` | `/tools/framework` | |
| `/oversee/compliance` | `/compliance/controls` | Renamed for clarity |
| `/oversee/reports` | `/compliance/reports` | |
| `/oversee/pulse` | Home widget | Folded into home page |
| `/audit` | `/workflows/audit-trail` | |
| `/operate/approvals` | `/workflows/approvals` | |
| `/operate/decisions` | `/workflows/reviews` | Decisions log renamed Reviews |
| `/operate/calendar` | `/workflows/calendar` | |
| `/operate/tasks` | Home inbox widget | Absorbed into My Workspace |
| `/operate/notifications` | Home inbox widget | Absorbed into My Workspace |
| `/committees` | `/workflows/committees` | Kept as first-class workflow destination (CRB, SGCC, standing committee rosters/charters) |
| `/dispute/cases` | `/workflows/cases` | |
| `/library/links` | `/compliance/reports` (external links section) | Merged |
| `/library/search` | Header bar search | Universal search button |
| `/asksgm` | `/asksgm` | Unchanged |
| `/analytics` | `/compliance/reports` | Absorbed |

### 5. Pages to delete

These are the quadrant landing pages — they were consulting-journey navigation that no longer fits the client product framing:

- `/design` (Design quadrant landing)
- `/operate` (Operate quadrant landing)
- `/dispute` (Dispute quadrant landing)
- `/oversee` (Oversee quadrant landing)

Also delete:
- `/analytics` (absorbed into Compliance → Reports)
- Current `/dashboard` page content (moved to home)

## Theme — `sgm-compliance` gradient

Replace the existing `sgm-glass` preset (and its SPARCC cyan/purple palette) with a new **compliance-trust** palette:

```
Gradient:    linear-gradient(135deg, #1e40af 0%, #0891b2 45%, #10b981 100%)
Primary:     #0891b2  (confident teal)
Accent:      #10b981  (compliant emerald)
Trust:       #1e40af  (deep trust blue — used in hero banners and section accents)
Neutral:     #64748b  (slate)
```

**Rationale**: the current SPARCC purple-to-cyan was designed for a "Sales Performance Management" product identity. The new palette reframes as "compliance that works" — deep trust blue signals auditor/CCO reliability, teal signals modern tooling, emerald signals healthy/compliant status. This makes the first impression "professional GRC product" rather than "flashy sales demo."

Surfaces:
- **Body**: unconditional `linear-gradient(135deg, #1e40af 0%, #0891b2 45%, #10b981 100%)` fixed attachment
- **Cards**: `rgba(255,255,255,0.12)` glass with 20px backdrop-blur, 20px rounded corners
- **Sidebar + header**: `rgba(15,23,42,0.55)` dark navy glass with blur
- **Text**: white primary, `#e2e8f0` secondary, `#cbd5e1` muted (safe floor, never dimmer)
- **Status colors** (independent of brand palette): green `#10b981`, amber `#f59e0b`, red `#ef4444`, purple `#8b5cf6` (for exceptions/escalations)

A new preset file `components/shell/theme/presets/sgm-compliance.ts` replaces `sgm-glass.ts`. Single-mode (light only — no dark token set).

## Enforcement state

Enforcement is visible on every lifecycle page, and a new `/workflows/exceptions` page tracks active exception requests.

### State signals (shown on existing pages)

- **Attestations page**: items past SLA show red `OVERDUE` badge. Items approaching SLA show amber `DUE SOON`. SLA is 14 days from publish by default.
- **Approvals page**: items in queue past committee cadence show amber `SLA BREACH`. CRB cadence = 10 business days, SGCC = 5.
- **Documents → Policies**: policies where `nextReview < today` show red `REVIEW OVERDUE` badge.
- **Compliance → Controls**: failed control tests show red `FAILED` + remediation owner + remediation due date.
- **Documents → Comp Plans**: plans with unacknowledged participants after publish show a compliance % with amber/red thresholds.

### New page: `/workflows/exceptions`

Displays active exception requests. An exception is a formal "I need to deviate from a published policy for this specific situation" request.

**Data shape** (`data/prizym-governance/workflows/exceptions.ts`):

```ts
export type ExceptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type ExceptionType =
  | 'territory_waiver'
  | 'quota_appeal'
  | 'clawback_waiver'
  | 'asc606_treatment'
  | 'windfall_deviation'
  | 'plan_interpretation';

export interface PolicyException {
  id: string;
  caseNumber: string;        // EXC-2026-001
  type: ExceptionType;
  title: string;
  policyRef: string;         // SCP-007, SCP-001, etc.
  requestedBy: string;
  requestedAt: string;
  status: ExceptionStatus;
  approver: string;
  approvedAt?: string;
  expiresAt?: string;
  amountImpact?: number;
  justification: string;
  dealContext?: string;
}
```

Seed with 6 exceptions covering the types above. Mix of pending/approved/expired for visual variety.

**Page layout**: filterable table with status tabs, clicking a row opens a drawer with the full justification + approval chain + expiry countdown.

## Data model

### New: Document type union

`data/prizym-governance/documents/types.ts`:

```ts
export type DocumentType = 'comp_plan' | 'policy' | 'procedure' | 'control' | 'template';

export type LifecycleStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'superseded' | 'retired';

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  code: string;            // SCP-001, TPL-ASC-001, CTL-SOX-003, etc.
  title: string;
  category: string;        // Sales, SOX, ASC 606, Tax, Wage Law, etc.
  status: LifecycleStatus;
  version: string;
  effectiveDate: string;
  nextReview: string;
  owner: string;
  description: string;
  content?: string;        // Markdown body
  attestationPct?: number; // 0-100
  linkedObligations: string[]; // obligation IDs
}
```

### New: Obligations data

`data/prizym-governance/compliance/obligations.ts`:

```ts
export type ObligationStatus = 'compliant' | 'at_risk' | 'non_compliant' | 'not_assessed';

export interface Obligation {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;   // "US Federal", "California", "Internal"
  category: string;       // "SOX / ICFR", "Tax", "Wage & Hour", "Revenue Recognition", "Data Security"
  status: ObligationStatus;
  nextReview: string;
  owner: string;
  description: string;
  policiesMapped: string[];  // policy codes
  controlsMapped: string[];  // control codes
}
```

Seed with 8 obligations: SOX-302, SOX-404, ASC-606, IRS-409A, CA-AB-2288, NY-LL-191, SOC-2, Internal-SCP-charter.

### Migrations from existing data

- `data/prizym-governance/policies.ts` (17 SCPs) + `data/prizym-governance/asc606/policies.ts` (4 ASC 606 policies) → merged into a single `DocumentRecord[]` with `type: 'policy'`, plus a `category` tag (Sales / SOX / ASC 606 / etc.)
- `data/prizym-governance/plans.ts` (6 comp plans) → `DocumentRecord[]` with `type: 'comp_plan'`
- `data/prizym-governance/asc606/templates.ts` (3 templates) + any plan templates → `DocumentRecord[]` with `type: 'template'`
- `data/prizym-governance/oversee.ts` `COMPLIANCE_CONTROLS` (12 controls) → `DocumentRecord[]` with `type: 'control'`
- New seed: 6 Procedures (commission processing, dispute resolution, windfall review, month-end close, SPIF approval, LOA handling)

## Routing notes

**URL redirects (soft)**: For the hero surfaces (ASC 606 Calculator, Policy Library), the old URLs (`/design/asc606-calculator`, `/policies`) will be removed. If demo scripts or docs reference the old URLs, they'll 404. That's acceptable — this is a pre-launch demo, no live users.

**Next.js route structure**: Use flat route groups. No route groups needed for the new layout since every page renders inside `PrizymPage` with the same shell.

## Build sequence (4 waves)

### Wave A — Data + nav (foundational)
1. Create `data/prizym-governance/documents/types.ts` with DocumentType + DocumentRecord + LifecycleStatus
2. Create `data/prizym-governance/documents/catalog.ts` — single source of truth, consolidates policies + plans + templates + controls + new procedures into one `DOCUMENTS: DocumentRecord[]` export. Export helpers `getDocumentsByType(type)` and `getDocumentById(id)`.
3. Create `data/prizym-governance/compliance/obligations.ts` with 8 seed obligations
4. Rewrite `app/(demos)/prizym-governance/demo.config.ts` nav to the 6-group structure
5. Verify `pnpm generate:registry && pnpm typecheck` pass

### Wave B — Delete old structure
6. Delete `app/(demos)/prizym-governance/{design,operate,dispute,oversee,library,committees,policies,plans,templates,dashboard,analytics,audit}/` (except files that will be moved in Wave C)
7. Run `pnpm typecheck` and fix any dangling imports

### Wave C — New pages
8. `app/(demos)/prizym-governance/page.tsx` — new Home / My Workspace (4 KPIs + inbox + activity stream)
9. `app/(demos)/prizym-governance/documents/[type]/page.tsx` — unified documents library (tabs + filters + table + drawer). Use dynamic segment with `generateStaticParams`.
10. `app/(demos)/prizym-governance/tools/asc606-calculator/page.tsx` — move existing calculator here (unchanged internals, new URL)
11. `app/(demos)/prizym-governance/tools/framework/page.tsx` — move existing 88-checkpoint browser
12. `app/(demos)/prizym-governance/tools/frameworks/page.tsx` — new reference page listing governance frameworks
13. `app/(demos)/prizym-governance/compliance/obligations/page.tsx` — new obligations register with heatmap
14. `app/(demos)/prizym-governance/compliance/controls/page.tsx` — move existing compliance dashboard here
15. `app/(demos)/prizym-governance/compliance/reports/page.tsx` — move reports
16. `app/(demos)/prizym-governance/compliance/audit/page.tsx` — new audit readiness page (simple status summary)
17. `app/(demos)/prizym-governance/workflows/approvals/page.tsx` — move
18. `app/(demos)/prizym-governance/workflows/attestations/page.tsx` — new (aggregates attestation % from all documents)
19. `app/(demos)/prizym-governance/workflows/reviews/page.tsx` — move decisions log + scheduled reviews
20. `app/(demos)/prizym-governance/workflows/cases/page.tsx` — move dispute cases
21. `app/(demos)/prizym-governance/workflows/exceptions/page.tsx` — NEW — exceptions register (6 synthetic exceptions, filterable table, drawer detail). Data file: `data/prizym-governance/workflows/exceptions.ts`.
22. `app/(demos)/prizym-governance/workflows/committees/page.tsx` — move existing committees page (CRB, SGCC, standing committees with rosters and charters)
23. `app/(demos)/prizym-governance/workflows/calendar/page.tsx` — move
24. `app/(demos)/prizym-governance/workflows/audit-trail/page.tsx` — move audit log

**Enforcement badges** — added inline during Wave C while moving the pages:
- Attestations page: red `OVERDUE`, amber `DUE SOON` chips using status-color helpers
- Approvals page: amber `SLA BREACH` badge on items past cadence
- Documents → Policies: red `REVIEW OVERDUE` on rows where nextReview < today
- Compliance → Controls: red `FAILED` + remediation owner inline

### Wave D — Single-theme collapse + polish
25. **Replace `sgm-glass` preset with `sgm-compliance`**:
    - Create `components/shell/theme/presets/sgm-compliance.ts` — single-mode (no dark set), blue→teal→emerald palette
    - Register `'sgm-compliance'` in `ThemePresetName` type + `presets/index.ts`
    - Switch `demo.config.ts` theme to `'sgm-compliance'`
    - Update `demo.config.ts` colors to `{ primary: '#0891b2', accent: '#10b981' }`
    - (Optional: delete `sgm-glass.ts` if no other demo references it)
26. **Remove dark/light toggle entirely**:
    - Delete the ThemeToggle button from the shell header rendering
    - Rewrite `sgm-glass.ts` preset: keep only the light (gradient-glass) palette, delete the `dark` semantic/component token sets, export single-mode values
    - Update `theme/resolve.ts` to ignore the `darkMode` flag for sgm-glass (or delete the flag handling if no other preset needs it — check first)
    - Rewrite `styles/ext/prizym-governance.css`: delete the `.dark` ruleset, delete all `html:not(.dark)` selectors, inline the gradient-glass values into `:root`. Body gradient becomes unconditional.
    - Set `darkMode: false` in `demo.config.ts` (or remove the field)
    - Delete `PrizymThemeProvider`'s MutationObserver + toggleTheme — provider becomes a pure font-size controller
27. Add universal search to the header bar (top of shell, not sidebar)
28. Update `LandingHero.tsx` (home) to reflect new routes, messaging, and sgm-compliance gradient
29. Update AskSGM canned responses to reference the new IA (still say "policies", "obligations", "compliance" — these are still correct)
30. Regen registry + typecheck + verify:demo-standard + test + manual walkthrough

## Risks & mitigations

- **Risk**: Dynamic route `/documents/[type]/page.tsx` may need `generateStaticParams` to work with static export (Cloudflare Pages). Mitigation: Use generateStaticParams returning the 5 known types.
- **Risk**: Moving routes breaks any external links. Mitigation: Nothing external links in yet — PR hasn't been merged, no prod deployment.
- **Risk**: The unified documents page may feel cramped with 5 doc types × multiple filters. Mitigation: Start simple (tabs + one filter chip row); add complexity only if needed.
- **Risk**: Scope creep. Mitigation: **Only build the 6 routes listed in Wave C**. Do not add new features mid-build.

## Success criteria

- Sidebar collapses from 8 groups to 6
- Home page answers "what do I need to do today" in under 3 seconds
- Documents library shows all 5 content types in one place with working type/status/category filters
- ASC 606 Calculator and 88-Checkpoint Framework are both under Tools and feel equally prominent
- Obligations register shows 8 obligations mapped to policies/controls
- `pnpm typecheck && pnpm verify:demo-standard && pnpm test` all green
- Both dark and light (gradient-glass) themes render correctly throughout
- No dead routes, no dangling imports, no console errors

## Open questions (for Todd to confirm before writing plan)

None — all design decisions made in brainstorming above. Waiting on Todd's approval of the written spec before proceeding to the implementation plan.
