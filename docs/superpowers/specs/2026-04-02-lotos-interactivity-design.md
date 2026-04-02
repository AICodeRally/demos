# LotOS — Interactivity & Detail Enhancement

> Design spec for enriching all 24 LotOS pages with cross-linking, interactive controls, and unused data integration
> Date: 2026-04-02

---

## 1. Overview

LotOS has 24 content pages across 6 acts. Currently 7 pages have `useState` interactivity, 13 are rich but static, and 4 are thin. Two data files (`inventory-sources.ts`, `payments.ts`) are unused.

**Goal:** Make every page feel like a real application — clickable rows open detail panels, editable fields recalculate live, tables sort by column, and entities cross-link across pages. No new pages — enhance what exists.

**Approach:** Build a shared component library (`components/demos/lotos/`), then sweep all 24 pages to add interactivity. Wire in the 2 unused data files. Add 2 more AI market briefs.

## 2. Shared Component Library

Create `components/demos/lotos/` with these components:

### StatCard
- KPI card with label, value, optional trend arrow, optional sparkline (inline SVG)
- Props: `label`, `value`, `trend?`, `trendValue?`, `color`, `sparkline?: number[]`
- Extracted from 8+ pages that duplicate this pattern

### StatusBadge
- Colored pill: `rounded-full px-2.5 py-0.5 text-xs font-bold`
- Props: `label`, `color` (background at 10% opacity, text at full)
- Replaces dozens of inline badge implementations

### DataTable
- Sortable table component. Click column header to sort asc/desc.
- Props: `columns: Column[]`, `data: T[]`, `onRowClick?: (row: T) => void`, `sortable?: boolean`
- Column def: `{ key, label, render?, sortFn?, align? }`
- Row click handler enables cross-linking to detail panels

### DetailPanel
- Slide-in panel from right edge, 420px wide, white background, backdrop overlay
- Props: `open: boolean`, `onClose: () => void`, `title: string`, `children`
- Closes on X button or backdrop click
- Animated slide-in (transform translateX)

### VehicleDetail
- Shows within DetailPanel. Given a `vehicleId`, looks up and displays:
  - Vehicle info (year/make/model, VIN, color, mileage, status badge)
  - Acquisition info (cost, source, date, recon cost)
  - Pricing info (asking price, spread, days on lot)
  - Related recon orders (from RECON_ORDERS)
  - Active listings (from LISTINGS with marketplace badges)
  - Deals involving this vehicle (from DEALS)

### CustomerDetail
- Given `customerId`, displays:
  - Contact info (name, phone, email)
  - Credit tier badge
  - Lead source, created date
  - Notes
  - Related deals (from DEALS, with vehicle lookups)
  - Test drives (from inline TEST_DRIVES data if available)

### DealDetail
- Given `dealId`, displays:
  - Deal summary (type, status, dates)
  - Vehicle info (linked, clickable)
  - Customer info (linked, clickable)
  - Financial breakdown (sale price, trade, down, front gross, F&I gross, total gross)
  - Lender and funding status
  - Document checklist status

### MarkdownRenderer
- Simple markdown-to-JSX: `**bold**` → `<strong>`, `\n\n` → paragraphs, `- ` → `<ul>/<li>`, `1. ` → `<ol>/<li>`, `## ` → styled headers
- Extracted from 4 intelligence pages that each have their own renderer

### Toast
- Simple notification toast for "action" feedback (price applied, brief copied, etc.)
- Auto-dismisses after 3 seconds
- Props: `message`, `type: 'success' | 'info'`

### index.ts
- Barrel export for all components

## 3. Per-Page Enhancements

### Act 1 — The Lot

**Dashboard (`lot/dashboard`)**
- Add time range toggle: 7d / 30d / 60d / 90d (useState). Filters deals by closedDate and recalculates KPI values.
- Click any vehicle stock # → VehicleDetail panel
- Click any deal # → DealDetail panel
- Alert cards become clickable (navigate to relevant page via Next.js Link)

**Inventory (`lot/inventory`)**
- Replace inline table with DataTable component — column sort on all columns
- Row click → VehicleDetail panel
- Add bulk action: checkbox column, "Mark for Wholesale" and "Price Reduction" buttons. Click shows Toast confirmation.

**Recon (`lot/recon`)**
- HTML5 drag-and-drop between kanban columns. `onDragStart`/`onDragOver`/`onDrop` handlers update local state array.
- Click card → VehicleDetail panel
- Add "Assign Tech" dropdown per card (Mike Torres / Carlos Ruiz / Unassigned) — updates local state

**Marketplace (`lot/marketplace`)**
- Wire in `INVENTORY_SOURCES` data — add "Source ROI" section showing avg acquisition cost, avg spread, units this month, avg days to sell per source
- Click listing card → VehicleDetail panel
- Add sync status toggle per listing (Active ↔ Paused) — visual toggle updates local state

### Act 2 — Sales Floor

**CRM (`sales/crm`)**
- Row click → CustomerDetail panel
- Add lead source filter (dropdown or button group) alongside existing tier filter
- Add "Add Note" inline: click button on row → textarea expands inline, save updates local state

**Pipeline (`sales/pipeline`)**
- Funnel stage bars become clickable — click a stage to expand a list of leads at that stage below the funnel
- Add conversion sparklines per lead source in the ROI table (simple inline SVGs showing last 6 months trend)

**Appointments (`sales/appointments`)**
- Click appointment block → popup card showing customer name, vehicle, type, time, notes
- Add "New Appointment" button → opens simple form modal (customer dropdown, type, day, time). Saves to local state, new block appears on calendar.

**Test Drives (`sales/test-drives`)**
- Replace table with DataTable — sortable columns
- Row click → CustomerDetail panel
- Add outcome filter tabs (All, Purchased, Interested, Follow-up, Not Interested) with counts
- Add salesperson filter dropdown

### Act 3 — Deal Desk

**Desking (`deals/desking`)**
- Add deal selector dropdown (all deals, not just the pending one). Switching deal reloads the entire view.
- Make sale price, trade allowance, and down payment editable (number inputs). Amount financed recalculates. All 3 lender payment scenarios recalculate live using the annuity formula.
- Click vehicle/customer references → detail panels

**F&I (`deals/fni`)**
- Add deal selector dropdown — penetration and gross calculations contextualize to selected deal
- Click product card → expand section showing full description, terms, and "recommended for" note
- Add "penetration vs target" mini-bar per product (target = 70% across the board)

**Lenders (`deals/lenders`)**
- Replace table with DataTable — sortable columns
- Add customer selector dropdown — match indicators recalculate based on selected customer's credit tier
- Row click → expands lender detail showing recent deals funded through that lender (from DEALS)

**Contracting (`deals/contracting`)**
- Add deal selector dropdown — entire view contextualizes to selected deal
- Document checklist items become toggleable (click to cycle Complete → Pending → Missing). Updates local state, progress bar animates.
- Add "Days Since Close" computed from deal's closedDate to today

### Act 4 — Back Office

**Accounting (`office/accounting`)**
- Add month selector dropdown (from MONTHLY_KPIS months). P&L and revenue cards recalculate for selected month.
- Replace deal posting table with DataTable — sortable, row click → DealDetail panel

**Floorplan (`office/floorplan`)**
- Wire in `PAYMENTS` data — add "BHPH Collections" section showing payment schedule, status badges, and collection rate
- Replace table with DataTable — sortable by days-to-curtailment
- Row click → VehicleDetail panel
- Rows with <15d to curtailment get a subtle pulse animation (CSS keyframe on the urgency badge)

**Title & DMV (`office/title-dmv`)**
- Row click → DealDetail panel
- Stage icons become clickable — click advances that deal to the next stage (local state). Shows Toast "Stage advanced".
- Add "Days in Current Stage" computed column

**Compliance (`office/compliance`)**
- "Run OFAC Screen" button per customer — simulated 0.5s delay, then shows "Clear" badge. Uses useState for loading state per customer.
- Audit trail gets date range filter (Last 7d / 30d / All)
- Click customer name → CustomerDetail panel

### Act 5 — Command Center

**KPIs (`command/kpis`)**
- Click any KPI card → card expands inline to show a larger sparkline SVG (200px tall) with data points labeled. Click again to collapse.
- Add benchmark toggle — shows/hides an "Industry Avg" reference line on sparklines and a comparison column in the trend table
- Month row click highlights that month across all sparklines

**Pricing (`command/pricing`)**
- Already the most interactive page. Add:
- "Apply Price" button — updates the vehicle's asking price in local state, shows Toast "Price updated to $X"
- Click comp rows to expand showing more detail (source link, listing date, condition notes)

**Cashflow (`command/cashflow`)**
- Add scenario toggle: Conservative (0.8x inflows) / Expected (1.0x) / Optimistic (1.2x). All projections recalculate.
- Wire in `PAYMENTS` data — add BHPH collection row showing upcoming payments with status
- Click period row → expand showing itemized inflows/outflows

**Aging (`command/aging`)**
- Age bucket cards become clickable filters — click "61-90d" to filter table to that bucket only. Click again to clear.
- Action badge "Wholesale" becomes a button → shows simulated wholesale offer card (vehicle value at 85% of market, buyer: "Manheim Phoenix")
- Row click → VehicleDetail panel

### Act 6 — AskLotOS Intelligence

**Chat (`intelligence/chat`)**
- Make send button functional: on submit, fuzzy-match input against AI_RESPONSES questions. If match found (simple includes/keyword check), append that Q&A to the conversation. Otherwise append "I'll research that and get back to you."
- Quick action buttons scroll to AND highlight the relevant Q&A with a brief background flash
- Add typing indicator animation (3 bouncing dots) with 1s delay before showing AI response

**Deal Optimizer (`intelligence/deal-optimizer`)**
- Add "Apply Recommendations" button — updates deal gross values in local state, shows animated counter from old → new gross with green highlight
- Add expandable recommendation sections (click header to expand/collapse each recommendation)

**Acquisition (`intelligence/acquisition`)**
- Make input fields editable (year, make, model, miles, price). On "Re-Score", factor weights adjust based on inputs (higher miles → lower score, lower price → higher margin safety).
- Add "Save Score" button — saves to a comparison sidebar (max 3 saved scores, showing vehicle + score + date)

**Market Intel (`intelligence/market-intel`)**
- Add 2 more market-intel briefs to `ai-responses.ts` (Week of Mar 25 and Mar 18). "Generate New Brief" cycles through all 3.
- "Share Brief" copies brief text to clipboard, shows Toast "Brief copied to clipboard"
- Action items get checkbox toggles (checked/unchecked, local state)

## 4. Data Layer Changes

### Modified: `data/lotos/ai-responses.ts`
Add 2 more `market-intel` category responses:

**ai-007** (Mar 25 brief): Focus on spring buying season ramp, auction price increases, F&I penetration milestone, 2 action items.

**ai-008** (Mar 18 brief): Focus on tax refund season impact, subprime lending tightening, trade-in volume spike, 3 action items.

### No other data file changes
- `inventory-sources.ts` and `payments.ts` are wired into pages as-is
- All interactive state (edits, toggles, drag positions) lives in `useState` — no persistence

## 5. Cross-Link Entity Resolution

Pages resolve entities using simple array lookups — no shared context or state store:

```typescript
const vehicle = VEHICLES.find(v => v.id === vehicleId);
const customer = CUSTOMERS.find(c => c.id === customerId);
const deal = DEALS.find(d => d.id === dealId);
const vehicleRecon = RECON_ORDERS.filter(r => r.vehicleId === vehicleId);
const vehicleListings = LISTINGS.filter(l => l.vehicleId === vehicleId);
const vehicleDeals = DEALS.filter(d => d.vehicleId === vehicleId);
const customerDeals = DEALS.filter(d => d.customerId === customerId);
```

DetailPanel components receive an entity ID and perform their own lookups. This avoids a global state management system while keeping cross-linking functional.

## 6. Styling Rules (Unchanged)

All enhancements follow the existing LotOS palette:
- Light backgrounds (#FFFFFF, #F8FAFC)
- Dark text (headings #1C1917, body #57534E)
- Cards: `rounded-xl bg-white border p-6` with `borderColor: '#E7E5E4'`
- Status badges: `rounded-full px-2.5 py-0.5 text-xs font-bold`
- Min font size: 14px
- DetailPanel: white background, subtle shadow, slide-in from right

## 7. Implementation Approach

1. **Build shared component library first** — StatCard, StatusBadge, DataTable, DetailPanel, entity detail views, MarkdownRenderer, Toast
2. **Add AI response data** — 2 new market briefs
3. **Sweep pages act by act** — replace inline patterns with shared components, add interactivity per the spec above
4. **Each act is one task** — pages within an act can be done in parallel since they don't share state
