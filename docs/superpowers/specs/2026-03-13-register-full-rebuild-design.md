# REGISTER Demo — Full Rebuild Design Spec

> **Date:** 2026-03-13
> **Purpose:** Rebuild the REGISTER demo (Summit Sleep Co.) as a pitch-ready experience to land Mattress Firm as a client.
> **Status:** Design approved, pending implementation

---

## 1. Overview

The REGISTER demo is a 200-store retail mattress chain SPM (Sales Performance Management) showcase. It demonstrates corporate planning → sales strategy → store operations → compensation management → platform integration. The primary pitch narrative centers on the **Manager ↔ POS rep interaction** and the **compensation team managing comp rules that flow to the POS Rewards system** in real-time.

**Target client:** Mattress Firm (presenting as "Summit Sleep Co." — a thinly-veiled analog).

**Key differentiator:** AI-powered advisory cards throughout every act (purple-branded, visually distinct from system information), real-time BroadcastChannel communication between Manager Console and POS tablet, and live SWIC engine commission calculations on the POS Rewards panel.

---

## 2. Design System

### 2.1 Typography

- **Font family:** Space Grotesk (via `next/font/google`)
- **Monospace:** System monospace for financial data, SKUs, timestamps
- **Base scale:** 1.3x default (accessibility — presenter is 60+, demos shown on projectors)
- **Font size control:** Aa +/- toggle in header, persisted to localStorage

### 2.2 Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--register-bg` | `#F8FAFC` | `#0F0E1A` | Page background |
| `--register-bg-elevated` | `#FFFFFF` | `#1A1830` | Card backgrounds |
| `--register-bg-surface` | `#F1F5F9` | `#1E1B4B` | Table headers, inputs |
| `--register-border` | `#E2E8F0` | `#312E5C` | Card/table borders |
| `--register-text` | `#0F172A` | `#E2E8F0` | Primary text |
| `--register-text-muted` | `#64748B` | `#94A3B8` | Secondary text |
| `--register-text-dim` | `#94A3B8` | `#64748B` | Tertiary text |
| `--register-primary` | `#1E3A5F` | `#1E3A5F` | Summit navy |
| `--register-accent` | `#06B6D4` | `#06B6D4` | Cyan accent |
| `--register-ai` | `#8B5CF6` | `#8B5CF6` | AI insight cards |
| `--register-ai-gradient` | `#8B5CF6 → #6366F1` | same | AI gradient |
| `--register-success` | `#10B981` | `#10B981` | Positive/commission |
| `--register-warning` | `#F59E0B` | `#F59E0B` | Caution/SPIFF |
| `--register-danger` | `#EF4444` | `#EF4444` | Negative/alert |

### 2.3 Dark/Light Mode

- **Scope:** All pages across all 5 acts
- **Default:** Dark
- **Persistence:** localStorage key `'register-theme'`
- **Implementation:** CSS custom properties set on `:root` by `RegisterThemeProvider`
- **Toggle:** Sun/Moon icon in page header

### 2.4 AI Visual Language

All AI-generated content uses a consistent visual pattern to distinguish it from system information:

- Purple gradient left border (`3px solid` with `#8B5CF6 → #6366F1`)
- Purple-tinted background (`rgba(139, 92, 246, 0.08)` light / `rgba(139, 92, 246, 0.12)` dark)
- `Sparkles` icon (lucide-react) + "AI Insight" or "AI Recommendation" label
- Purple text for AI-specific labels (`#8B5CF6` / `#A78BFA`)
- Optional action button (e.g., "Apply", "+ Add", "Push to Rep")

---

## 3. Demo Structure

### 3.1 Act Overview (5 acts, 22 pages)

| Act | Theme | Color | Pages | Story Beat |
|-----|-------|-------|-------|------------|
| 1 — Corporate Strategy | "Here's the business" | `#1E3A5F` | 5 | 200 stores, 4 formats, $340M revenue |
| 2 — Sales Strategy | "Here's the plan" | `#06B6D4` | 5 | Corporate goals → store targets |
| 3 — Store Operations | "Here's the floor" | `#8B5CF6` | 4 | Manager coaches reps, POS with Rewards |
| 4 — Sales Compensation | "Here's the money" | `#10B981` | 6 | Comp design, admin, push to POS |
| 5 — Platform & Integration | "Here's the tech" | `#F59E0B` | 2 | D365 Commerce, architecture |

### 3.2 Page Inventory

#### Act 1 — Corporate Strategy

| # | Page | Route | AI Insight |
|---|------|-------|------------|
| 1 | Company Overview | `/register/corp/overview` | "3 underperforming stores — recommend format conversion" |
| 2 | Store Portfolio | `/register/corp/portfolio` | "Outlet stores within 5mi of Flagship cannibalize 12% revenue" |
| 3 | Market Position | `/register/corp/market` | — |
| 4 | Seasonal Strategy | `/register/corp/seasonal` | "Presidents' Day weekend likely +22% — recommend early SPIFF activation" |
| 5 | Brand Partners | `/register/corp/brands` | — |

#### Act 2 — Sales Strategy

| # | Page | Route | AI Insight |
|---|------|-------|------------|
| 6 | District Planning | `/register/strategy/districts` | "Recommend realigning District 7 — 2 stores better fit District 4" |
| 7 | Store Targets | `/register/strategy/targets` | — |
| 8 | Product Mix | `/register/strategy/mix` | "Adjustable base attach rate drops 40% when not demoed" |
| 9 | Workforce Model | `/register/strategy/workforce` | — |
| 10 | Promotion Calendar | `/register/strategy/promotions` | "Last 3 March SPIFFs underperformed — shift $50K to bundle accelerator" |

#### Act 3 — Store Operations (THE STAR)

| # | Page | Route | AI Insight |
|---|------|-------|------------|
| 11 | Floor Dashboard | `/register/ops/floor` | "Traffic spike predicted 2-4pm — pull Marcus to floor" |
| 12 | POS Terminal | `/register/ops/pos-terminal` | AI upsell cards on sale lines |
| 13 | Manager Console | `/register/ops/manager` | AI coaching cards for each rep |
| 14 | Contest Board | `/register/ops/contests` | "Marcus is $2,400 from Tier 2 — one more bundle unlocks accelerator" |

#### Act 4 — Sales Compensation

| # | Page | Route | AI Insight |
|---|------|-------|------------|
| 15 | Comp Plan | `/register/comp/plan` | — |
| 16 | Calculator | `/register/comp/calculator` | "At current pace, rep reaches Tier 3 by March 22" |
| 17 | Statements | `/register/comp/statements` | — |
| 18 | Team Performance | `/register/comp/team` | "23% of reps in dead zone — lower Tier 2 threshold to $42K" |
| 19 | Executive View | `/register/comp/executive` | "Comp spend 2.1% above budget — raise Flagship targets" |
| 20 | Comp Admin | `/register/comp/admin` | "Proposed tier change affects 47 reps, +$12K monthly payout" |

#### Act 5 — Platform & Integration

| # | Page | Route | AI Insight |
|---|------|-------|------------|
| 21 | D365 Integration | `/register/platform/d365` | — |
| 22 | Product Overview | `/register/platform/product` | — |

### 3.3 Additional Pages

| Page | Route | Disposition |
|------|-------|-------------|
| Root Landing | `/register` | **KEEP** — redirect to `/register/corp/overview` (first page of Act 1) |
| Coaching Detail | `/register/ops/manager/coaching/[id]` | **KEEP** — deep-link from Manager Console rep cards, rebuild with new theme |

### 3.4 Pages Cut (17 removed)

- `/register/ops/pos` (POS Analytics — merged into Manager Console)
- `/register/ops/customer` (Customer Journey)
- `/register/ops/inventory` (Inventory)
- `/register/ops/rep-assessment` (Rep Self-Assessment)
- `/register/ops/mattress-firm` (MF POS — merged into main POS Terminal)
- `/register/ops/mattress-firm/manager` (MF Manager — merged into main Manager)
- `/register/ops/mattress-firm/integration` (MF Integration — moved to Act 5 as D365 Integration)
- `/register/comp/measurements` (Measurements)
- `/register/comp/payouts` (Payouts)
- `/register/comp/disputes` (Disputes)
- `/register/comp/reports` (Reports)
- `/register/planning/forecasting` (Forecasting)
- `/register/planning/headcount` (Headcount)
- `/register/planning/scheduling` (Scheduling)
- `/register/planning/targets` (Targets — overlap with strategy/targets)
- `/register/platform/architecture` (merged into D365 Integration)
- `/register/platform/varicent` (Varicent — cut, not relevant to MF pitch)

**Note:** Act 4 "Sales Planning" (4 pages: Forecasting, Headcount, Scheduling, Targets) is entirely eliminated. The remaining acts renumber: old Act 5 (Compensation) → new Act 4, old Act 6 (Platform) → new Act 5.

---

## 4. POS Terminal Design

### 4.1 Launch Pattern

- **Approach:** Dedicated route wrapped in PROOFLINE's `TabletFrame` component
- **URL:** `/register/ops/pos-terminal`
- **Trigger:** "Open on iPad" button in Manager Console opens new tab
- **Frame:** iPad Pro landscape, CSS bezel with camera notch, status bar, home indicator
- **Theme:** Dark default, has own dark/light toggle within the frame

### 4.2 Layout: Split-Panel

```
┌─────────────────────────────────────────────────────────┐
│ Top Bar: Summit Sleep | Store: Galleria #247 | D365 ✓   │
├──────────────────┬──────────────────────────────────────┤
│ SHOWROOM CATALOG │ Tabs: Lines | Payments | ✨ Rewards  │
│                  │                                      │
│ [Category tabs]  │ Sale line items                      │
│ Product cards    │ - Discount callouts                  │
│ - SPIFF badges   │ - AI upsell suggestions (purple)     │
│ - Price + cost   │                                      │
│ - "Add" tap      │                                      │
│                  ├──────────────────────┬───────────────┤
│                  │ Order Summary        │ Commission    │
│                  │ Subtotal / Tax       │ Mini-preview  │
│                  │ TOTAL                │ $258.94       │
├──────────────────┴──────────────────────┴───────────────┤
│ [New Sale]              [Hold]           [Close Sale ▶] │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Features

1. **Showroom Catalog** (left panel, 40%)
   - 20 items across 5 categories: Mattress, Adjustable Base, Accessory, Protection Plan, Delivery
   - Category filter tabs
   - Each item shows: name, size/variant, price, cost, SPIFF badge (if applicable)
   - Tap to add to sale

2. **Sale Ticket** (right panel, 60%)
   - Line items with quantity controls, discount callouts
   - Bundle detection (Mattress + Base = Sleep System Bundle bonus)
   - AI upsell cards (purple) appear contextually as items are added

3. **Rewards Panel** (tab in right panel)
   - Tier staircase visualization (4 tiers with current position highlighted)
   - Live commission calculation via SWIC engine
   - Component breakdown (Base Comm, SPIFFs, Bundle Bonus)
   - Active SPIFFs list
   - Today's earnings summary
   - Threshold progress (amount to next tier)

4. **Commission Mini-Preview** (bottom-right, always visible)
   - Total commission for current ticket
   - Component summary (one line)
   - "Rewards tab for full breakdown" hint

5. **Close Sale Flow**
   - Payment method selection (Cash, Card, Finance, Check)
   - Generates D365 `RetailTransactionPostedBusinessEvent`
   - Broadcasts `sale:closed` via BroadcastChannel to Manager Console
   - Shows D365 event in log

6. **BroadcastChannel Listener**
   - Receives coaching pushes from Manager → shows toast notification
   - Receives comp updates from Comp Admin → shows toast + refreshes Rewards panel

### 4.4 Manager ↔ POS Interaction Flow

1. Manager sees Sarah's attach rate is low (red traffic light on rep card)
2. Clicks her card → sees AI coaching suggestion (purple card)
3. Clicks "Push to iPad" → BroadcastChannel sends coaching to POS
4. POS Terminal shows toast: "Coaching from Manager: Focus on bundle pitch"
5. Rep adds items → AI upsell card suggests Adjustable Base
6. Rep clicks Rewards tab → sees live commission with bundle bonus
7. Rep closes sale → D365 event fires → Manager feed updates in real-time

---

## 5. Component Architecture

### 5.1 New Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| `RegisterThemeProvider` | `components/demos/register/ThemeProvider.tsx` | Dark/light context, CSS variables, Space Grotesk, localStorage |
| `RegisterPage` | `components/demos/register/RegisterPage.tsx` | Page wrapper: theme, header (Aa +/-, toggle), title bar |
| `AIInsightCard` | `components/demos/register/AIInsightCard.tsx` | Purple advisory card: Sparkles icon, label, text, optional action |

### 5.2 POS Components (rebuilt from MF + current)

| Component | File | Source |
|-----------|------|--------|
| `ShowroomCatalog` | `components/demos/register/pos/ShowroomCatalog.tsx` | Rebuilt from MF, Summit Sleep branded |
| `SaleTicket` | `components/demos/register/pos/SaleTicket.tsx` | Rebuilt from MF, AI upsell slot |
| `CommissionMini` | `components/demos/register/pos/CommissionMini.tsx` | New — always-visible mini commission preview |
| `RewardsPanel` | `components/demos/register/pos/RewardsPanel.tsx` | From current POS, enhanced |
| `CloseSaleFlow` | `components/demos/register/pos/CloseSaleFlow.tsx` | Rebuilt from MF, Summit Sleep D365 events |
| `D365EventLog` | `components/demos/register/pos/D365EventLog.tsx` | From MF, kept as-is |
| `BundleBuilder` | `components/demos/register/pos/BundleBuilder.tsx` | From MF, kept as-is |

### 5.3 Reused Components

| Component | File | Notes |
|-----------|------|-------|
| `TabletFrame` | `components/demos/proofline-route/TabletFrame.tsx` | Shared from PROOFLINE, no changes |
| `StatCard` | `components/demos/register/index.tsx` | Existing, no changes |

### 5.4 Data Files

| File | Action |
|------|--------|
| `data/register/summit-sleep.ts` | **NEW** — Unified ClientConfig, catalog (20 items), reps, periods, store context. Replaces `mattress-firm.ts`. |
| `data/register/d365-schemas.ts` | **KEEP** — Pure TypeScript interfaces, no branding |
| `data/register/coaching-data.ts` | **KEEP + EXTEND** — Add more AI coaching scenarios |
| `data/register/comp-data.ts` | **KEEP + EXTEND** — Add tier visualization data |
| `data/register/ai-insights.ts` | **NEW** — Centralized AI insight text for all 22 pages |
| `data/register/store-data.ts` | **KEEP** — Used by Act 1-2 corporate/strategy pages |
| `data/register/planning-data.ts` | **DELETE** — Act 4 (Sales Planning) eliminated |
| `data/register/platform-data.ts` | **KEEP** — Used by Act 5 platform pages |

### 5.5 Lib Files

| File | Action |
|------|--------|
| `lib/register-broadcast.ts` | **KEEP** — Manager ↔ POS communication |
| `lib/register-d365-adapter.ts` | **RENAME** from `mattress-firm-d365-adapter.ts`, rebrand |
| `lib/swic-engine/` | **KEEP** — calculator.ts, types.ts, rules.ts unchanged |

### 5.6 Files to Delete

| Category | Files |
|----------|-------|
| MF pages (3) | `app/(demos)/register/ops/mattress-firm/` (entire directory) |
| MF components (17) | `components/demos/register/mattress-firm/` (entire directory) |
| MF data | `data/register/mattress-firm.ts` |
| MF libs | `lib/mattress-firm-broadcast.ts`, `lib/mattress-firm-d365-adapter.ts` |
| MF CSS | `app/(demos)/register/ops/mattress-firm/mattress-firm.css` |
| Cut pages (~19) | See Section 3.3 |

---

## 6. Nav Configuration

Updated `demo.config.ts`:

```typescript
nav: [
  {
    section: 'Act 1 — Corporate Strategy',
    color: '#1E3A5F',
    items: [
      { label: 'Company Overview', href: '/register/corp/overview', icon: 'Building2' },
      { label: 'Store Portfolio', href: '/register/corp/portfolio', icon: 'Map' },
      { label: 'Market Position', href: '/register/corp/market', icon: 'Globe' },
      { label: 'Seasonal Strategy', href: '/register/corp/seasonal', icon: 'Calendar' },
      { label: 'Brand Partners', href: '/register/corp/brands', icon: 'Handshake' },
    ],
  },
  {
    section: 'Act 2 — Sales Strategy',
    color: '#06B6D4',
    items: [
      { label: 'District Planning', href: '/register/strategy/districts', icon: 'MapPin' },
      { label: 'Store Targets', href: '/register/strategy/targets', icon: 'Target' },
      { label: 'Product Mix', href: '/register/strategy/mix', icon: 'Sliders' },
      { label: 'Workforce Model', href: '/register/strategy/workforce', icon: 'Users' },
      { label: 'Promotion Calendar', href: '/register/strategy/promotions', icon: 'Megaphone' },
    ],
  },
  {
    section: 'Act 3 — Store Operations',
    color: '#8B5CF6',
    items: [
      { label: 'Floor Dashboard', href: '/register/ops/floor', icon: 'LayoutGrid' },
      { label: 'POS Terminal', href: '/register/ops/pos-terminal', icon: 'Tablet' },
      { label: 'Manager Console', href: '/register/ops/manager', icon: 'Monitor' },
      { label: 'Contest Board', href: '/register/ops/contests', icon: 'Trophy' },
    ],
  },
  {
    section: 'Act 4 — Sales Compensation',
    color: '#10B981',
    items: [
      { label: 'Comp Plan', href: '/register/comp/plan', icon: 'FileText' },
      { label: 'Calculator', href: '/register/comp/calculator', icon: 'Calculator' },
      { label: 'Statements', href: '/register/comp/statements', icon: 'Receipt' },
      { label: 'Team Performance', href: '/register/comp/team', icon: 'BarChart3' },
      { label: 'Executive View', href: '/register/comp/executive', icon: 'TrendingUp' },
      { label: 'Comp Admin', href: '/register/comp/admin', icon: 'Settings' },
    ],
  },
  {
    section: 'Act 5 — Platform & Integration',
    color: '#F59E0B',
    items: [
      { label: 'D365 Integration', href: '/register/platform/d365', icon: 'Link' },
      { label: 'Product Overview', href: '/register/platform/product', icon: 'Package' },
    ],
  },
],
```

---

## 7. Implementation Strategy

This is a full rebuild of 22 pages. The approach:

1. **Foundation first:** Theme system, shared components (ThemeProvider, RegisterPage, AIInsightCard)
2. **Act 3 first:** POS Terminal + Manager Console (the star of the pitch)
3. **Act 4 next:** Comp Admin + Calculator (the comp management story)
4. **Acts 1-2:** Corporate/Strategy pages (context setting)
5. **Act 5 last:** Platform/Integration (technical proof)
6. **Cleanup:** Delete all cut pages, MF files, update nav config
7. **Polish:** Verify dark/light mode on all pages, AI cards, font sizing, build test

Each act can be built in parallel by separate agents since pages don't share state, with two cross-act dependencies:
- **Act 3 POS ↔ Manager** share BroadcastChannel (coaching push, sale closed)
- **Act 4 Comp Admin → Act 3 POS** shares BroadcastChannel (comp-update, pos-sync)

**BroadcastChannel contract:** Use existing `lib/register-broadcast.ts` message types as-is. Channel name: `'register-pos'`. Message types: `coaching`, `comp-update`, `alert`, `pos-sync`, `ack`. No changes to the message schema.

---

## 8. Verification Criteria

1. `pnpm build` passes with all 22 pages compiling
2. All pages render in dark mode (default) and light mode (toggle)
3. Space Grotesk font loads on all pages
4. AI Insight cards (purple) appear on every page that has one specified
5. POS Terminal opens in TabletFrame from Manager Console "Open on iPad" button
6. Manager "Push to iPad" → toast appears on POS Terminal (BroadcastChannel)
7. POS Rewards panel shows live commission via SWIC engine
8. Close Sale generates D365 event visible in event log
9. Comp Admin "Push to All POS" → toast appears on POS Terminal
10. Font size Aa +/- control works across all pages
11. No "Mattress Firm" branding appears anywhere in the UI
12. Cut pages return 404 (files deleted, not just hidden from nav)
