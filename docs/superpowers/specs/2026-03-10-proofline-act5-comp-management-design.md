# PROOFLINE Act 5: Sales Comp Management — Design Spec

**Date:** 2026-03-10
**Status:** Approved
**Repo:** demos (~/Development/demos)
**Scope:** Restructure Act 4 + add Act 5 with 6 ICM modules (~11 new/moved pages + DemoShell enhancement)

## Problem

Act 4 (Sales Compensation) mixes comp plan *design* pages with operational *management* pages. The demo needs to showcase a best-of-breed ICM (Incentive Compensation Management) system with proper module separation: data ingestion, measurements, rewards, payments, inquiries, and reporting.

## Solution

Split current Act 4 into two acts:

- **Act 4: Sales Comp Planning** — Plan design, kickers, calculator, story, CEO impact (5 pages, keep as-is)
- **Act 5: Sales Comp Management** — Operational ICM with 6 modules using tabbed sub-views (6 sidebar items, ~15 tab views)

Add collapsible sidebar sections to DemoShell to manage the expanded nav.

## Navigation Structure

### Act 4: "Sales Comp Planning" (accent: `#10B981` green)

| Sidebar Label | Route | Status |
|---------------|-------|--------|
| Comp Plan | `/comp/plan` | Keep |
| Kickers | `/comp/kickers` | Keep |
| Calculator | `/comp/calculator` | Keep |
| 13-Week Story | `/comp/story` | Keep |
| CEO Impact | `/comp/impact` | Keep |

### Act 5: "Sales Comp Management" (accent: `#0EA5E9` sky blue)

| Sidebar Label | Route | Status |
|---------------|-------|--------|
| Data | `/comp/mgmt/data` | New |
| Measurements | `/comp/mgmt/measurements` | New shell, absorbs existing pages |
| Rewards | `/comp/mgmt/rewards` | New |
| Payments | `/comp/mgmt/payments` | New |
| Inquiries | `/comp/mgmt/inquiries` | Moved from `/comp/inquiries` |
| Reports | `/comp/mgmt/reports` | New |

### Page Moves

| Current Location | New Location | Changes |
|-----------------|-------------|---------|
| `comp/emco/page.tsx` | `comp/mgmt/measurements` (Category Attainment tab) | Rename "EMCO" → "Category Attainment" throughout |
| `comp/visibility/page.tsx` | `comp/mgmt/measurements` (Visibility tab) | No content changes |
| `comp/inquiries/page.tsx` | `comp/mgmt/inquiries/page.tsx` | Add status filter tabs, category filter |

## Config & Component Updates

### demo.config.ts

Update `app/(demos)/proofline-andrews/demo.config.ts`:

1. **Rename** Act 4 section label from `"Act 4 — Sales Compensation"` to `"Act 4 — Sales Comp Planning"`
2. **Remove** 3 items from Act 4: EMCO Gates, Visibility, Inquiries
3. **Add** new Act 5 section `"Act 5 — Sales Comp Management"` with color `#0EA5E9` and 6 nav items:
   - Data → `/comp/mgmt/data` (icon: `Database`)
   - Measurements → `/comp/mgmt/measurements` (icon: `BarChart3`)
   - Rewards → `/comp/mgmt/rewards` (icon: `Award`)
   - Payments → `/comp/mgmt/payments` (icon: `Wallet`)
   - Inquiries → `/comp/mgmt/inquiries` (icon: `MessageSquare`)
   - Reports → `/comp/mgmt/reports` (icon: `FileBarChart`)

### ActNavigation.tsx

Update `components/demos/proofline/ActNavigation.tsx`:

1. **Extend** `currentAct` type from `1 | 2 | 3 | 4` to `1 | 2 | 3 | 4 | 5`
2. **Add** Act 5 entry to the `ACTS` array: `{ act: 5, label: 'Sales Comp Management', color: '#0EA5E9', href: '/comp/mgmt/data', pages: 6 }`
3. **Update** Act 4 entry: label to `'Sales Comp Planning'`, pages from `8` to `5`

### Old Route Disposition

Delete the old page files after content is moved to new locations:

| Old File | Action |
|----------|--------|
| `comp/emco/page.tsx` | Delete — content absorbed into `comp/mgmt/measurements` |
| `comp/visibility/page.tsx` | Delete — content absorbed into `comp/mgmt/measurements` |
| `comp/inquiries/page.tsx` | Delete — content moved to `comp/mgmt/inquiries/page.tsx` |

No redirects needed — this is a demo, not a production app with external links.

### Inquiries Accent Color

When moving `inquiries/page.tsx` to `comp/mgmt/inquiries/`, update all hardcoded Act 4 green (`#10B981`) references in the header/accent areas to Act 5 sky blue (`#0EA5E9`). The `ActNavigation` component handles this automatically via `currentAct={5}`, but any inline accent colors need manual update.

## DemoShell: Collapsible Sidebar Sections

### Behavior
- Each nav section header is a clickable toggle (expand/collapse)
- Small chevron indicator: ▸ collapsed, ▾ expanded
- Section containing the active route auto-expands
- Other sections collapsed by default on page load
- Persisted to `localStorage` key `demoshell-nav-state-${config.product.name}` (scoped per demo to avoid cross-demo collisions)
- Backward compatible — existing demos with fewer sections unaffected

### Implementation
- Add `expandedSections` state (Set of section indices)
- On route change, ensure active section is expanded
- Click handler on section header toggles inclusion in set
- Animate with CSS `max-height` transition or similar

## Module 1: Data (`/comp/mgmt/data`)

**Purpose:** Show how transaction data flows into the ICM system.

**3 tabs: Ingestion | Classification | Crediting**

### Ingestion Tab
Pipeline visualization: Source → Validate → Stage → Load

Data feed status cards (4 feeds):
| Feed | Source | Records | Last Sync | Health |
|------|--------|---------|-----------|--------|
| Orders | SAP ERP | 48,200 | 2h ago | Healthy |
| Accounts | Salesforce CRM | 4,847 | 6h ago | Healthy |
| Roster | ADP HR | 36 | 24h ago | Healthy |
| Territories | Internal | 6 | Weekly | Healthy |

KPIs: total records ingested (MTD), validation pass rate, avg processing time, error count.

### Classification Tab
How transactions get tagged:

- **Product Hierarchy:** Brand → Category → Supplier Group (tree or table view)
  - Example: Corona Extra → Import Beer → Constellation Brands → "Import" gate
- **Account Classification:** On-premise vs. Off-premise, Chain vs. Independent
  - Distribution table: 4,847 accounts across types
- **Territory Assignment Rules:** Hometown → Route → Rep mapping
  - 6 hometowns, 36 routes, assignment logic summary

### Crediting Tab
Credit allocation for transactions:

- **Crediting Rules:** Primary rep gets 100%, split credit for shared accounts, territory overlap resolution
- **Recent Transactions Table:** Date, account, product, cases, revenue, credited rep, rule applied, confidence score
  - 15-20 sample rows with mix of simple (single rep) and complex (split credit) scenarios
- **KPIs:** Total credits processed, split credit %, disputed credits, avg resolution time

## Module 2: Measurements (`/comp/mgmt/measurements`)

**Purpose:** Track attainment and performance metrics.

**2 tabs: Category Attainment | Visibility**

### Category Attainment Tab
Existing EMCO Gates page content, renamed:
- All "EMCO" text references → "Category" or "Category Attainment"
- Component name `EmcoGateRings` can stay internal, just UI text changes
- 36 reps, 4 gates (Core, Import, Emerging, Combined), sparklines, hometown filter
- No structural changes

### Visibility Tab
Existing Visibility page content, moved:
- Seller/Manager dual views
- AttainmentRing, AttainmentCurve, Gate Progress cards
- Rep selector, hometown selector
- No structural changes

## Module 3: Rewards (`/comp/mgmt/rewards`)

**Purpose:** Show earned compensation by type.

**3 tabs: Variable Pay | Commission | Bonus**

### Variable Pay Tab
Quarterly variable earnings overview:

- **KPIs:** Total variable paid this quarter, avg payout ratio, # above target, # below target
- **Rep Table:** Rep name, route, base salary, variable target, actual variable earned, % of target, status badge (above/below/at-risk)
  - 36 rows, sortable by attainment
  - Hometown filter (reuse pattern from Category Attainment)
- **Distribution Chart:** Histogram or bar chart showing payout ratio distribution across reps

### Commission Tab
Tier-based commission detail:

- **Rate Schedule Card:** T1–T4 tiers with attainment range, rate per case, volume range
- **Rep Commission Table:** Rep, tier, volume (cases), rate, commission earned, QTD total
  - 36 rows with tier badge color-coding
- **Hometown Rollup:** 6 hometown summary cards with total commission, avg rate, top earner

### Bonus Tab
Kicker payouts and special incentives:

- **Active Bonuses:** 3 quarterly kickers + spirits adder (status: earned/in-progress/not-started per rep)
- **Payout Table:** Rep, bonus type, qualification status, payout amount, pay date
  - Filter by bonus type
- **KPIs:** Total bonus paid, qualification rate, avg bonus per rep, spirits adder total

## Module 4: Payments (`/comp/mgmt/payments`)

**Purpose:** Payment processing and deposit tracking.

**2 tabs: Deposits | Exceptions**

No tab bar shown — Payments uses section headers instead of tabs since it has fewer sub-views than other modules. Content is presented as a single scrollable page with clear section breaks.

- **Pay Cycle Timeline:** Visual timeline of bi-weekly pay cycles, current cycle highlighted, next pay date callout
- **KPIs:** Total payroll this cycle, pending approvals count, exceptions count, next deposit date
- **Pending Approvals Card:** Items requiring manager sign-off before payment (e.g., large bonus, split credit exception)
  - 3-5 sample items with approve/flag actions (demo only — not functional)
- **Payment Ledger Table:** Date, rep, type (Base/Variable/Commission/Bonus), amount, status (Pending/Approved/Deposited)
  - 20-30 sample rows across multiple pay periods
  - Status badge color-coding
- **Exceptions Card:** Payments held for review (overpayment flag, negative clawback, new hire proration)

## Module 5: Inquiries (`/comp/mgmt/inquiries`)

**Purpose:** Compensation dispute management.

Existing Inquiries page enhanced with:

- **Status Filter Tabs:** All | Open | Under Review | Resolved | Escalated (with counts)
- **Category Filter:** Dropdown for Data Error / Gate Dispute / Territory Credit / Kicker Eligibility
- **Existing Content:** 6 inquiry cards with timeline, resolution callout (keep all)
- **Click-to-expand:** Clicking an inquiry card expands inline detail (description, full timeline, resolution notes)

## Module 6: Reports (`/comp/mgmt/reports`)

**Purpose:** Dashboards and role-based reports.

**5 tabs: Executive | Presidents Club | Sales Rep | Sales Manager | District Manager**

### Executive Dashboard Tab
Territory-level KPIs and comp overview for leadership:

- **Hero KPIs (5 cards):** Total revenue vs. quota, overall attainment %, total comp expense, comp-to-revenue ratio, headcount
- **Hometown Performance Chart:** Horizontal bar chart — 6 hometowns showing revenue attainment %, color-coded (green >100%, orange 90-100%, red <90%)
- **Top/Bottom Performers:** Two side-by-side lists (Top 5, Bottom 5 reps by attainment)
- **Comp Expense Breakdown:** Donut or stacked bar: Base vs. Variable vs. Commission vs. Bonus proportions
- **Payout Ratio Distribution:** How many reps are above/at/below target (histogram or tier bar)

### Presidents Club Tab
Annual club qualification tracking:

- **Club Tiers:** Gold (≥120% annual), Silver (≥110%), Bronze (≥105%)
- **KPIs:** Days remaining, current qualifiers count, projected qualifiers, club threshold
- **Leaderboard Table:** Rank, rep, hometown, YTD attainment %, projected annual, club tier badge, trend sparkline
  - 36 reps, sorted by attainment
  - Projected qualifiers highlighted
- **Pace Tracker:** "On pace" vs. "needs X% in remaining weeks" per rep
- **Historical Context Card:** Last year's club stats (# qualifiers, avg attainment, top earner)

### Sales Rep Report Tab
Individual rep deep-dive:

- **Rep Selector:** Dropdown or button row (36 reps)
- **Earnings Summary Card:** YTD breakdown — base, variable, commission, bonus, total. With prior year comparison.
- **Attainment Trend:** 13-week line chart (reuse AttainmentCurve pattern)
- **Gate Status:** 4 gates with progress bars (reuse from Visibility)
- **Payment History:** Last 6 pay periods with amounts and types
- **Open Inquiries:** Count + links to inquiry detail (if any)

### Sales Manager Report Tab
Team roll-up for manager oversight:

- **Manager/Hometown Selector:** Choose a hometown (6 options)
- **Team KPIs (4 cards):** Avg attainment, total comp expense, at-risk count, full gate %
- **Rep Grid:** All reps in selected hometown — attainment %, tier, gates unlocked, earned vs. target, status badge
  - Sortable columns
- **Coaching Recommendations:** 2-3 AI-generated action items (e.g., "Focus on Marcus — 4pp from T3 threshold" or "Corona push in convenience accounts")
- **Comp Budget Tracker:** Budget allocated vs. spent for this hometown, projected EOQ

### District Manager Report Tab
Hometown-level executive view:

- **6 Hometown Cards:** Each showing:
  - Hometown name + manager name
  - Revenue vs. quota (bar)
  - Headcount (reps)
  - Avg attainment %
  - Total comp expense
  - Top performer name + attainment
  - Status indicator (on-track / watch / behind)
- **Comparison Table:** All 6 hometowns side-by-side with key metrics
- **Click any hometown:** Expands to show rep breakdown (mini version of Manager Report)

## Accent Colors

| Act | Label | Color | Hex |
|-----|-------|-------|-----|
| Act 1 | Corporate Strategy | Gold | `#C6A052` |
| Act 2 | Sales Strategy | Purple | `#7C3AED` |
| Act 3 | Sales Operations | Blue | `#2563EB` |
| Act 4 | Sales Comp Planning | Green | `#10B981` |
| Act 5 | Sales Comp Management | Sky Blue | `#0EA5E9` |

## Shared Data Constants

All Act 5 modules pull from the same data sources already used in Act 4:

- `SELLERS` (36 reps with 13-week attainment, hometown, route, gates)
- `COMP_PLAN`, `COMP_TIERS`, `EMCO_GATES`, `KICKERS`
- New constants needed: `TRANSACTIONS` (crediting samples), `PAYMENTS` (ledger), `CLUB_TIERS`

Add new constants to `data/proofline/mgmt.ts` and export through `data/proofline/index.ts`, following the existing `@/data/proofline` barrel pattern used by all comp pages.

## Tab Component Pattern

All multi-tab module pages use a consistent pattern:

```tsx
const [activeTab, setActiveTab] = useState('tab1');
// Tab bar at top of page content
// Tab content renders conditionally
// Each tab's content can be extracted to its own component file for maintainability
```

Tabs styled with the Act 5 accent color (`#0EA5E9`) for active state, `--pl-text-muted` for inactive, `--pl-border` for underline. Dark/light mode compatible via existing `--pl-*` CSS vars.

## Non-Goals

- No functional actions (approve payments, resolve inquiries) — demo is read-only
- No real data integrations — all mock data
- No changes to Acts 1-3
- No changes to Act 4 page content (except ActNavigation label/count updates and removing moved pages)
- No new shared components beyond what's needed for tabs
