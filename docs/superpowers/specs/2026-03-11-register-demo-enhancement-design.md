# REGISTER Demo Enhancement — Design Spec

**Date:** 2026-03-11
**Product:** REGISTER (Summit Sleep Co. — Mattress Retail)
**Goal:** Expand the REGISTER demo from 4 acts / 21 pages to 6 acts / ~34 pages, adding manager-to-rep coaching flow with iPad SWIC POS callout and Varicent integration showcase.
**Prospect context:** Has Varicent. Needs to see PRIZYM as complementary, not replacement.

---

## 1. Act Structure (6 Acts, ~34 Pages)

### Existing Baseline (4 acts, 21 pages)

| Act | Section | Existing Pages |
|-----|---------|----------------|
| 1 | Corporate Strategy | overview, portfolio, market, seasonal, brands (5) |
| 2 | Sales Strategy | districts, targets, mix, workforce, promotions (5) |
| 3 | Store Operations | floor, pos, customer, inventory, manager, contests (6) |
| 4 | Sales Compensation | plan, calculator, payouts, team, executive (5) |

### Changes

**Acts 1-2: No changes** (10 pages unchanged)

**Act 3: Store Operations — enhanced** (6 existing + 2 new = 8 pages)
- Existing 6 pages unchanged: floor, pos, customer, inventory, manager, contests
- New: `/register/ops/manager/coaching/[id]` — Rep Coaching page (Mode B, accessible from Manager Console coaching cards)
- New: `/register/ops/rep-assessment` — Rep Self-Assessment page (Mode C, accessible from Manager Console)
- Note: coaching/[id] is a drill-down page, not a top-level nav item. Rep Assessment gets a nav entry.

**Act 4: Sales Planning** (4 new pages — entirely new act)
- `/register/planning/forecasting` — AI-assisted demand forecasting
- `/register/planning/headcount` — Staffing model by store format
- `/register/planning/scheduling` — Shift optimization
- `/register/planning/targets` — Store-level target setting

**Act 5: Sales Compensation — expanded** (5 existing enhanced + 4 new = 9 pages)
- Existing pages **rewritten with richer content**: plan (enhanced), payouts (enhanced)
- Existing pages **kept as-is**: calculator, team, executive
- New: `/register/comp/measurements` — KPI dashboard
- New: `/register/comp/disputes` — Dispute filing and resolution
- New: `/register/comp/statements` — Monthly commission statements
- New: `/register/comp/reports` — Manager comp analytics

**Act 6: Platform & Integrations** (3 new pages — entirely new act)
- `/register/platform/architecture` — System integration diagram
- `/register/platform/varicent` — Varicent side-by-side integration
- `/register/platform/product` — Product overview + ROI + CTA

### Final Page Count

| Act | Name | Pages |
|-----|------|-------|
| 1 | Corporate Strategy | 5 (unchanged) |
| 2 | Sales Strategy | 5 (unchanged) |
| 3 | Store Operations | 8 (was 6, +2 new) |
| 4 | Sales Planning | 4 (new) |
| 5 | Sales Compensation | 9 (was 5, +4 new, 2 enhanced) |
| 6 | Platform & Integrations | 3 (new) |
| **Total** | | **34** |

---

## 2. Manager to Rep Coaching Flow

Two modes, both accessible from the existing Manager Console page.

### Mode B: Proactive Manager Coaching

**Entry:** Manager clicks a coaching card on the Manager Console (Casey, Raj, or James).

**Page: Rep Coaching (`/register/ops/manager/coaching/[id]`)**
- Rep header: photo, name, role, store, shift, trailing metrics
- Split view:
  - **Left: "What they did"** — last sale summary showing the missed opportunity (low attach, no financing pitch, budget-line sale)
  - **Right: "What they should do"** — AI-recommended approach with specific product suggestions and projected commission delta
- Coaching script: bullet points the manager can use in a 1:1
- "Open on iPad" CTA button — opens SWIC `/register-pos` route with the scenario pre-loaded via PostMessage

**Pre-loaded scenarios:**

| Rep | Weakness | Pre-loaded Cart | AI Suggestion |
|-----|----------|-----------------|---------------|
| Casey | Attach rate 12% (floor avg 31%) | Queen Hybrid $1,899 | Add adj base + protector = +$89 commission |
| Raj | Financing pitch 28% (floor avg 64%) | King Luxury $2,499 | Show 36-mo at $69/mo — 72% close rate |
| James | ASP $1,420 (floor avg $1,890) | Twin Firm $699 | Upgrade to queen medium = +$340 revenue, +$51 commission |

### Mode C: Reactive Rep Self-Assessment

**Page: Rep Self-Assessment (`/register/ops/rep-assessment`)**
- Shift summary: last 5 sales with items, total, attach rate, financing used
- Performance snapshot: today vs weekly avg vs floor avg (3 comparison bars per metric)
- AI insight panel: "Your attach rate dropped 8% this week. Customers who bought [X] were 3x more likely to add [Y]."
- "Practice Sale" button — opens SWIC `/register-pos` in training mode (clean cart, AI suggestions active)

---

## 3. iPad POS Experience — SWIC `/register-pos`

New route in the SWIC module at `summit/sparcc/modules/swic/src/app/register-pos/`.

### Layout

Single-screen horizontal split (modeled on `/routeiq-route` tablet pattern):

| Left Panel (55%) | Right Panel (45%) |
|---|---|
| Sale Builder | Commission Live Panel |

### Sale Builder Components

1. **Customer Profile Bar** — walk-in vs returning, sleep preferences (side/back/hot sleeper), budget range. Pre-populated in coaching mode (Mode B).

2. **Product Catalog** — mattress grid (firm/medium/plush x size matrix), adjustable bases, pillows, protectors, sheets. Each item shows retail price + commission impact. Category tabs: Mattresses, Bases, Sleep Accessories, Protection Plans.

3. **AI Bundle Suggestions** — contextual upsell bar based on cart contents. "Customers who bought [X] also added [Y] — adds $32 to your commission." In Mode B, the AI suggestion matches exactly what the rep missed.

4. **Financing What-If** — 0/6/12/24/36/48 month options with monthly payment preview. Shows close rate data ("72% of $3,000+ sales use 36-mo financing") and confirms commission is same regardless of term.

### Commission Live Panel

- Current sale total + itemized commission breakdown
- Tier progress bar (Bronze to Silver to Gold to Platinum)
- "What if you close 2 more like this today?" projection
- Shift earnings so far + this-sale delta
- Attach rate comparison: "Your rate: 12% -> With this bundle: 34%"

### Data Flow

- PostMessage protocol (same as ROUTEIQ tablet pattern)
- Demo data hardcoded — no live API calls
- SWIC engine calculates commission client-side using existing `summit-sleep` dataset (`src/data/summit-sleep.ts`)

---

## 4. Act 5 — Sales Compensation (Expanded from 5 to 9 Pages)

Existing Act 4 becomes Act 5, keeping all 5 existing pages (plan, calculator, payouts, team, executive) and adding 4 new pages. Two existing pages (plan, payouts) get enhanced content. Pages under `app/(demos)/register/comp/`.

### Enhanced existing pages

**Comp Plan (`/register/comp/plan`)** — enhance existing page with:
- Component table: base salary, per-unit commission by category, attach rate accelerator, monthly volume tier bonus, SPIFF calendar
- Tier visualization: Bronze/Silver/Gold/Platinum with monthly revenue targets
- Effective dates, plan version, acknowledgment status

**Payouts (`/register/comp/payouts`)** — enhance existing page with:
- Pay period timeline (bi-weekly)
- Current period breakdown: base + commission + accelerators + SPIFFs = total
- Itemized commission log (each sale to commission amount with tier)
- YTD earnings, projected next-period

### Existing pages (no changes)
- **Calculator** (`/register/comp/calculator`) — keep as-is
- **Team Performance** (`/register/comp/team`) — keep as-is
- **Executive View** (`/register/comp/executive`) — keep as-is

### New pages (4)

**Measurements (`/register/comp/measurements`)**
- KPI dashboard: units sold, revenue, attach rate, ASP, financing penetration, customer satisfaction
- Period selector (daily/weekly/monthly/quarterly)
- Sparkline trends per metric
- Goal vs actual bars (red <80%, yellow 80-100%, green >100%)
- Rep filter dropdown (manager view)

**Disputes (`/register/comp/disputes`)**
- Open disputes table: sale date, transaction ID, expected vs calculated, status
- "File Dispute" form (select transaction, describe discrepancy)
- Resolution history with audit trail
- SLA indicator (72-hour target)

**Statements (`/register/comp/statements`)**
- Monthly statement view (pay-stub style)
- Header: rep info, period, plan name then line items then adjustments then net payout
- Historical statement selector
- "Download PDF" button (mock)

**Reports (`/register/comp/reports`)**
- Team commission distribution chart
- Cost-of-comp as % of revenue trend
- Top earners leaderboard
- Comp plan effectiveness (comp changes vs behavior changes)
- Export button (mock CSV)

---

## 5. Act 6 — Platform & Integrations (3 Pages)

Pages under `app/(demos)/register/platform/`.

### Page 1: Architecture (`/register/platform/architecture`)
- Hub-and-spoke diagram: PRIZYM center, spokes to POS, HRIS, Varicent, Payroll, BI
- Data direction arrows + sync frequency per spoke
- "Summit Sleep Co. Integration Map" header
- Click spoke node to see detail card (connector status, last sync, record count)

### Page 2: Varicent Integration (`/register/platform/varicent`)
- Split layout:
  - **Left: PRIZYM View** — comp plan components, tiers, measurements
  - **Right: Varicent View** — same plan in Varicent model (Plan Components, Credits, Measurements, Incentives)
- Field mapping table: PRIZYM field to Varicent field to sync status
- Sync log: last 10 events with timestamps
- "Varicent Environment: POC1" badge
- Key message: "Your team keeps using Varicent. PRIZYM enriches it with floor-level intelligence Varicent can't see."

### Page 3: Product Overview (`/register/platform/product`)
- PRIZYM product card
- 6-act story in miniature (one card per act)
- ROI projection for Summit Sleep's 847 stores, 4,200 reps:
  - Time savings: comp admin hours reduced
  - Revenue lift: attach rate improvement from coaching
  - Dispute reduction: automated calculation accuracy
- CTA: "Ready for your POC?" + next-steps timeline
- Powered by PRIZYM + AICR branding

---

## 6. Data Architecture

### New Data Files (demos repo)

| File | Contents |
|------|----------|
| `data/register/comp-data.ts` | Comp plan definition, measurements, payouts, disputes, statements for Act 5 |
| `data/register/coaching-data.ts` | Coaching scenarios, rep profiles, AI suggestions for Mode B/C |
| `data/register/planning-data.ts` | Forecasting, headcount, scheduling, targets for Act 4 |
| `data/register/platform-data.ts` | Integration map, Varicent field mappings, sync log for Act 6 |

### Existing Data (no changes)
- `data/register/store-data.ts` — store layouts, zones, transactions (Acts 1-3)
- `summit/sparcc/modules/swic/src/data/summit-sleep.ts` — SWIC commission config (iPad POS)

### SWIC Data (new, in AICR repo)
- `summit/sparcc/modules/swic/src/data/summit-sleep-pos.ts` — product catalog, bundle suggestions, financing terms for `/register-pos`

---

## 7. Navigation Config Update

`demo.config.ts` expands from 4 nav sections to 6. Existing act names gain "Act N" prefixes for consistency:

```typescript
nav: [
  { section: 'Act 1 — Corporate Strategy', color: '#1E3A5F', items: [...] },  // unchanged (5 items)
  { section: 'Act 2 — Sales Strategy', color: '#06B6D4', items: [...] },      // unchanged (5 items)
  { section: 'Act 3 — Store Operations', color: '#8B5CF6', items: [
    // existing 6 items unchanged (floor, pos, customer, inventory, manager, contests)
    // ADD:
    { label: 'Rep Self-Assessment', href: '/register/ops/rep-assessment', icon: 'UserCheck' },
    // Note: coaching/[id] is a drill-down from Manager Console, not a nav item
  ]},
  { section: 'Act 4 — Sales Planning', color: '#6366F1', items: [             // NEW
    { label: 'Forecasting', href: '/register/planning/forecasting', icon: 'TrendingUp' },
    { label: 'Headcount', href: '/register/planning/headcount', icon: 'Users' },
    { label: 'Scheduling', href: '/register/planning/scheduling', icon: 'Calendar' },
    { label: 'Targets', href: '/register/planning/targets', icon: 'Target' },
  ]},
  { section: 'Act 5 — Sales Compensation', color: '#10B981', items: [         // EXPANDED (was Act 4)
    // existing 5 items: plan, calculator, payouts, team, executive
    // ADD:
    { label: 'Measurements', href: '/register/comp/measurements', icon: 'BarChart3' },
    { label: 'Disputes', href: '/register/comp/disputes', icon: 'AlertTriangle' },
    { label: 'Statements', href: '/register/comp/statements', icon: 'Receipt' },
    { label: 'Reports', href: '/register/comp/reports', icon: 'PieChart' },
  ]},
  { section: 'Act 6 — Platform & Integrations', color: '#F59E0B', items: [    // NEW
    { label: 'Architecture', href: '/register/platform/architecture', icon: 'Network' },
    { label: 'Varicent', href: '/register/platform/varicent', icon: 'Link' },
    { label: 'Product Overview', href: '/register/platform/product', icon: 'Package' },
  ]},
]
```

---

## 8. Implementation Scope

### Demos Repo (~/Development/demos/)
- 11 new page files: 2 (Act 3 coaching) + 4 (Act 4 planning) + 4 (Act 5 new comp pages) + 3 (Act 6 platform) - Note: coaching/[id] is technically a single dynamic route file
- 2 enhanced page files: comp/plan and comp/payouts (rewritten with richer content)
- 4 new data files (coaching-data, planning-data, comp-data enhancement, platform-data)
- 1 config update (`demo.config.ts` — renumber acts, add nav sections)
- New shared components in `components/demos/register/` as needed

### AICR Repo (~/Development/AICR/)
- 1 new SWIC route (`/register-pos`) with ~4 components
- 1 new data file (`summit-sleep-pos.ts`)

### iPad POS Integration Mechanism
- The "Open on iPad" button opens a new browser tab pointing to the SWIC app URL (`/register-pos?scenario=casey` etc.)
- In a live demo, the SWIC app runs on an iPad browser at a known URL
- PostMessage protocol is used if embedded as iframe; for new-tab mode, query params pass the scenario ID
- The SWIC route reads the scenario param and pre-loads the appropriate cart/customer profile

### Not In Scope
- No backend API calls (all demo data is static)
- No authentication or tenant isolation
- No database operations
- No Varicent live API calls (mock data showing the integration concept)
- No changes to DemoShell component
- No changes to existing Acts 1-2 pages
- Existing Act 3 pages (floor, pos, customer, inventory, contests) unchanged
- Existing Act 5 pages (calculator, team, executive) unchanged
