# REGISTER Demo Enhancement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the REGISTER demo from 4 acts / 21 pages to 6 acts / 34 pages, adding manager-to-rep coaching flow with iPad SWIC POS callout and Varicent integration showcase.

**Architecture:** Static demo pages in the `demos` repo (Next.js, Tailwind, DemoShell) with a new SWIC tablet route in the `AICR` repo. All data is mock/hardcoded. Pages follow the existing REGISTER pattern: `'use client'` components importing from `@/components/demos/register` and `@/data/register/*`. The iPad POS route follows the PROOFLINE tablet pattern with `TabletFrame` wrapper.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide icons, SWIC engine (client-side commission calc)

**Repos:**
- Demos: `~/Development/demos/` (Cloudflare Pages)
- AICR: `~/Development/AICR/` (SWIC module at `summit/sparcc/modules/swic/`)

**Spec:** `docs/superpowers/specs/2026-03-11-register-demo-enhancement-design.md`

---

## File Structure

### Demos Repo — New Files

| File | Responsibility |
|------|---------------|
| `data/register/coaching-data.ts` | Rep profiles, coaching scenarios, AI suggestions for Mode B/C |
| `data/register/planning-data.ts` | Forecasting, headcount, scheduling, target-setting data |
| `data/register/comp-data.ts` | Tier definitions, SPIFF calendar, commission log, dispute records, statements |
| `data/register/platform-data.ts` | Integration map nodes, Varicent field mappings, sync log |
| `app/(demos)/register/ops/manager/coaching/[id]/page.tsx` | Mode B: manager coaching drill-down for specific rep |
| `app/(demos)/register/ops/rep-assessment/page.tsx` | Mode C: rep self-assessment with shift summary |
| `app/(demos)/register/planning/forecasting/page.tsx` | AI demand forecasting dashboard |
| `app/(demos)/register/planning/headcount/page.tsx` | Staffing model by store format |
| `app/(demos)/register/planning/scheduling/page.tsx` | Shift optimization view |
| `app/(demos)/register/planning/targets/page.tsx` | Store-level target setting |
| `app/(demos)/register/comp/measurements/page.tsx` | KPI dashboard with goal vs actual |
| `app/(demos)/register/comp/disputes/page.tsx` | Dispute filing and resolution tracker |
| `app/(demos)/register/comp/statements/page.tsx` | Monthly commission statements |
| `app/(demos)/register/comp/reports/page.tsx` | Manager comp analytics |
| `app/(demos)/register/platform/architecture/page.tsx` | Hub-and-spoke integration diagram |
| `app/(demos)/register/platform/varicent/page.tsx` | PRIZYM ↔ Varicent side-by-side |
| `app/(demos)/register/platform/product/page.tsx` | Product overview + ROI + CTA |

### Demos Repo — Modified Files

| File | Change |
|------|--------|
| `app/(demos)/register/demo.config.ts` | Add Acts 4, 6; expand Acts 3, 5; renumber |
| `app/(demos)/register/ops/manager/page.tsx` | Add clickable coaching cards linking to coaching/[id] |
| `app/(demos)/register/comp/plan/page.tsx` | Enhance with tier visualization, SPIFF calendar |
| `app/(demos)/register/comp/payouts/page.tsx` | Enhance with itemized commission log, YTD |

### AICR Repo — New Files

| File | Responsibility |
|------|---------------|
| `summit/sparcc/modules/swic/src/data/summit-sleep-pos.ts` | Product catalog, bundles, financing for register POS |
| `summit/sparcc/modules/swic/src/app/register-pos/page.tsx` | iPad POS experience (sale builder + commission panel) |
| `summit/sparcc/modules/swic/src/components/register-pos/SaleBuilder.tsx` | Product catalog, cart, customer profile |
| `summit/sparcc/modules/swic/src/components/register-pos/CommissionPanel.tsx` | Live commission calc, tier progress, projections |
| `summit/sparcc/modules/swic/src/components/register-pos/BundleSuggestions.tsx` | AI upsell recommendations |
| `summit/sparcc/modules/swic/src/components/register-pos/FinancingWhatsIf.tsx` | Payment term calculator |

---

## Chunk 1: Data Foundation + Config

### Task 1: Create coaching data file

**Files:**
- Create: `data/register/coaching-data.ts`

- [ ] **Step 1: Create the coaching data file with rep profiles and scenarios**

```typescript
// data/register/coaching-data.ts

export interface RepProfile {
  id: string;
  name: string;
  role: string;
  store: string;
  shift: string;
  avatar: string; // initials
  metrics: {
    attachRate: number;
    floorAvgAttach: number;
    financingPitch: number;
    floorAvgFinancing: number;
    asp: number;
    floorAvgAsp: number;
    unitsSold: number;
    shiftRevenue: number;
  };
}

export interface CoachingScenario {
  repId: string;
  weakness: string;
  weaknessLabel: string;
  lastSale: {
    items: { name: string; price: number; category: string }[];
    total: number;
    attachRate: number;
    financingUsed: boolean;
  };
  recommendation: {
    action: string;
    products: { name: string; price: number }[];
    commissionDelta: number;
    script: string[];
  };
  preloadedCart: {
    customer: { type: 'walk-in' | 'returning'; sleepPref: string; budget: string };
    items: { name: string; price: number; category: string }[];
  };
  aiSuggestion: string;
}

export interface ShiftSale {
  id: string;
  time: string;
  items: { name: string; price: number }[];
  total: number;
  attachRate: number;
  financingUsed: boolean;
}

export const REPS: RepProfile[] = [
  {
    id: 'casey',
    name: 'Casey Miller',
    role: 'Floor Associate',
    store: 'Flagship #12 — Galleria',
    shift: 'Morning (8am–4pm)',
    avatar: 'CM',
    metrics: {
      attachRate: 12,
      floorAvgAttach: 31,
      financingPitch: 55,
      floorAvgFinancing: 64,
      asp: 1780,
      floorAvgAsp: 1890,
      unitsSold: 4,
      shiftRevenue: 7120,
    },
  },
  {
    id: 'raj',
    name: 'Raj Patel',
    role: 'Senior Floor Associate',
    store: 'Flagship #12 — Galleria',
    shift: 'Morning (8am–4pm)',
    avatar: 'RP',
    metrics: {
      attachRate: 29,
      floorAvgAttach: 31,
      financingPitch: 28,
      floorAvgFinancing: 64,
      asp: 2100,
      floorAvgAsp: 1890,
      unitsSold: 3,
      shiftRevenue: 6300,
    },
  },
  {
    id: 'james',
    name: 'James Wu',
    role: 'Floor Associate',
    store: 'Flagship #12 — Galleria',
    shift: 'Morning (8am–4pm)',
    avatar: 'JW',
    metrics: {
      attachRate: 34,
      floorAvgAttach: 31,
      financingPitch: 71,
      floorAvgFinancing: 64,
      asp: 1420,
      floorAvgAsp: 1890,
      unitsSold: 5,
      shiftRevenue: 7100,
    },
  },
];

export const COACHING_SCENARIOS: CoachingScenario[] = [
  {
    repId: 'casey',
    weakness: 'attach_rate',
    weaknessLabel: 'Low Attach Rate',
    lastSale: {
      items: [{ name: 'Harmony Queen Hybrid', price: 1899, category: 'Mattresses' }],
      total: 1899,
      attachRate: 0,
      financingUsed: false,
    },
    recommendation: {
      action: 'Bundle adjustable base + mattress protector with every mattress sale',
      products: [
        { name: 'ErgoMotion Adjustable Base', price: 799 },
        { name: 'CoolGuard Mattress Protector', price: 149 },
      ],
      commissionDelta: 89,
      script: [
        'Casey, your mattress knowledge is strong — customers love your product demos.',
        'The opportunity is in what happens after they choose the mattress.',
        'Try this: "Now that you\'ve found your perfect mattress, let me show you how to get the most out of it."',
        'Lead with the adjustable base demo — let them feel the zero-gravity position.',
        'The protector is a natural add: "This keeps your warranty fully protected."',
      ],
    },
    preloadedCart: {
      customer: { type: 'walk-in', sleepPref: 'Side sleeper, runs hot', budget: '$1,500–$2,500' },
      items: [{ name: 'Harmony Queen Hybrid', price: 1899, category: 'Mattresses' }],
    },
    aiSuggestion: 'Add adjustable base + protector = +$89 commission',
  },
  {
    repId: 'raj',
    weakness: 'financing_pitch',
    weaknessLabel: 'Low Financing Pitch Rate',
    lastSale: {
      items: [
        { name: 'Luxe King Pillow-Top', price: 2499, category: 'Mattresses' },
        { name: 'Premium Pillow Set', price: 189, category: 'Sleep Accessories' },
      ],
      total: 2688,
      attachRate: 100,
      financingUsed: false,
    },
    recommendation: {
      action: 'Introduce financing early — reframe price as monthly investment',
      products: [],
      commissionDelta: 0,
      script: [
        'Raj, your product knowledge and attach rates are excellent.',
        'The gap is in how you present pricing — you\'re losing customers who love the product but hesitate at the total.',
        'Try leading with monthly cost: "This mattress is $69/month — less than your streaming subscriptions combined."',
        '72% of customers spending $2,500+ choose 36-month financing when it\'s presented upfront.',
        'Your commission stays the same regardless of how they pay — financing just helps them say yes.',
      ],
    },
    preloadedCart: {
      customer: { type: 'returning', sleepPref: 'Back sleeper, firm preference', budget: '$2,000–$3,000' },
      items: [{ name: 'Luxe King Pillow-Top', price: 2499, category: 'Mattresses' }],
    },
    aiSuggestion: 'Show 36-mo at $69/mo — 72% close rate for $2,500+ sales',
  },
  {
    repId: 'james',
    weakness: 'low_asp',
    weaknessLabel: 'Below-Average ASP',
    lastSale: {
      items: [
        { name: 'Essential Twin Firm', price: 699, category: 'Mattresses' },
        { name: 'Basic Pillow', price: 39, category: 'Sleep Accessories' },
        { name: 'Standard Protector', price: 69, category: 'Protection Plans' },
      ],
      total: 807,
      attachRate: 67,
      financingUsed: false,
    },
    recommendation: {
      action: 'Guide customers to mid-tier — demonstrate value gap between budget and mid-range',
      products: [{ name: 'Comfort Queen Medium', price: 1299 }],
      commissionDelta: 51,
      script: [
        'James, your attach rates and financing are the best on the floor — really strong fundamentals.',
        'The opportunity is in the initial mattress selection. You\'re letting customers anchor on budget options.',
        'Try the "step-up" demo: Let them try the budget, then immediately try the mid-tier.',
        '"Feel the difference? That\'s the upgraded foam core. Most customers tell me this is where the value is."',
        'Moving from Twin Firm ($699) to Queen Medium ($1,299) adds $51 to your commission on this one sale.',
      ],
    },
    preloadedCart: {
      customer: { type: 'walk-in', sleepPref: 'Not sure yet', budget: 'Budget-conscious' },
      items: [{ name: 'Essential Twin Firm', price: 699, category: 'Mattresses' }],
    },
    aiSuggestion: 'Upgrade to Queen Medium = +$340 revenue, +$51 commission',
  },
];

export const SHIFT_SALES: ShiftSale[] = [
  {
    id: 'S-1041',
    time: '9:15 AM',
    items: [
      { name: 'Harmony Queen Hybrid', price: 1899 },
      { name: 'Standard Protector', price: 69 },
    ],
    total: 1968,
    attachRate: 50,
    financingUsed: true,
  },
  {
    id: 'S-1042',
    time: '10:30 AM',
    items: [{ name: 'Essential Full Firm', price: 849 }],
    total: 849,
    attachRate: 0,
    financingUsed: false,
  },
  {
    id: 'S-1043',
    time: '11:45 AM',
    items: [
      { name: 'Luxe King Pillow-Top', price: 2499 },
      { name: 'ErgoMotion Adjustable Base', price: 799 },
      { name: 'CoolGuard Protector', price: 149 },
      { name: 'Premium Pillow Set', price: 189 },
    ],
    total: 3636,
    attachRate: 100,
    financingUsed: true,
  },
  {
    id: 'S-1044',
    time: '1:20 PM',
    items: [
      { name: 'Comfort Queen Medium', price: 1299 },
      { name: 'Basic Protector', price: 69 },
    ],
    total: 1368,
    attachRate: 50,
    financingUsed: false,
  },
  {
    id: 'S-1045',
    time: '2:45 PM',
    items: [{ name: 'Essential Twin Firm', price: 699 }],
    total: 699,
    attachRate: 0,
    financingUsed: false,
  },
];

export function getRepById(id: string): RepProfile | undefined {
  return REPS.find((r) => r.id === id);
}

export function getScenarioByRepId(repId: string): CoachingScenario | undefined {
  return COACHING_SCENARIOS.find((s) => s.repId === repId);
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd ~/Development/demos && pnpm tsc --noEmit --pretty 2>&1 | tail -5`
Expected: No errors related to coaching-data.ts

- [ ] **Step 3: Commit**

```bash
cd ~/Development/demos
git add data/register/coaching-data.ts
git commit -m "feat(register): add coaching data — rep profiles, scenarios, shift sales"
```

---

### Task 2: Create planning data file

**Files:**
- Create: `data/register/planning-data.ts`

- [ ] **Step 1: Create the planning data file**

```typescript
// data/register/planning-data.ts
import type { FormatId } from './store-data';

export interface ForecastPoint {
  month: string;
  actual: number;
  forecast: number;
  lower: number;
  upper: number;
}

export interface HeadcountRow {
  store: string;
  format: FormatId;
  current: number;
  optimal: number;
  gap: number;
  weekdayNeed: number;
  weekendNeed: number;
}

export interface ShiftBlock {
  id: string;
  rep: string;
  day: string;
  start: number; // hour 0-23
  end: number;
  role: 'floor' | 'lead' | 'closer';
}

export interface StoreTarget {
  store: string;
  format: FormatId;
  monthlyTarget: number;
  ytdActual: number;
  attainment: number;
  trend: 'up' | 'down' | 'flat';
  topCategory: string;
}

export const FORECAST_DATA: Record<FormatId, ForecastPoint[]> = {
  flagship: [
    { month: 'Jan', actual: 4200, forecast: 4100, lower: 3800, upper: 4400 },
    { month: 'Feb', actual: 3800, forecast: 3900, lower: 3600, upper: 4200 },
    { month: 'Mar', actual: 4500, forecast: 4300, lower: 4000, upper: 4600 },
    { month: 'Apr', actual: 4100, forecast: 4200, lower: 3900, upper: 4500 },
    { month: 'May', actual: 5200, forecast: 5000, lower: 4700, upper: 5300 },
    { month: 'Jun', actual: 5800, forecast: 5500, lower: 5200, upper: 5800 },
    { month: 'Jul', actual: 0, forecast: 5200, lower: 4800, upper: 5600 },
    { month: 'Aug', actual: 0, forecast: 4800, lower: 4400, upper: 5200 },
    { month: 'Sep', actual: 0, forecast: 5600, lower: 5200, upper: 6000 },
    { month: 'Oct', actual: 0, forecast: 5100, lower: 4700, upper: 5500 },
    { month: 'Nov', actual: 0, forecast: 6800, lower: 6400, upper: 7200 },
    { month: 'Dec', actual: 0, forecast: 7200, lower: 6800, upper: 7600 },
  ],
  standard: [
    { month: 'Jan', actual: 2800, forecast: 2700, lower: 2400, upper: 3000 },
    { month: 'Feb', actual: 2500, forecast: 2600, lower: 2300, upper: 2900 },
    { month: 'Mar', actual: 3000, forecast: 2900, lower: 2600, upper: 3200 },
    { month: 'Apr', actual: 2700, forecast: 2800, lower: 2500, upper: 3100 },
    { month: 'May', actual: 3500, forecast: 3300, lower: 3000, upper: 3600 },
    { month: 'Jun', actual: 3900, forecast: 3700, lower: 3400, upper: 4000 },
    { month: 'Jul', actual: 0, forecast: 3500, lower: 3100, upper: 3900 },
    { month: 'Aug', actual: 0, forecast: 3200, lower: 2800, upper: 3600 },
    { month: 'Sep', actual: 0, forecast: 3700, lower: 3300, upper: 4100 },
    { month: 'Oct', actual: 0, forecast: 3400, lower: 3000, upper: 3800 },
    { month: 'Nov', actual: 0, forecast: 4500, lower: 4100, upper: 4900 },
    { month: 'Dec', actual: 0, forecast: 4800, lower: 4400, upper: 5200 },
  ],
  outlet: [
    { month: 'Jan', actual: 1800, forecast: 1700, lower: 1500, upper: 1900 },
    { month: 'Feb', actual: 1600, forecast: 1650, lower: 1450, upper: 1850 },
    { month: 'Mar', actual: 1900, forecast: 1800, lower: 1600, upper: 2000 },
    { month: 'Apr', actual: 1750, forecast: 1780, lower: 1580, upper: 1980 },
    { month: 'May', actual: 2200, forecast: 2100, lower: 1900, upper: 2300 },
    { month: 'Jun', actual: 2500, forecast: 2400, lower: 2200, upper: 2600 },
    { month: 'Jul', actual: 0, forecast: 2200, lower: 2000, upper: 2400 },
    { month: 'Aug', actual: 0, forecast: 2000, lower: 1800, upper: 2200 },
    { month: 'Sep', actual: 0, forecast: 2300, lower: 2100, upper: 2500 },
    { month: 'Oct', actual: 0, forecast: 2100, lower: 1900, upper: 2300 },
    { month: 'Nov', actual: 0, forecast: 2800, lower: 2600, upper: 3000 },
    { month: 'Dec', actual: 0, forecast: 3000, lower: 2800, upper: 3200 },
  ],
  'shop-in-shop': [
    { month: 'Jan', actual: 900, forecast: 880, lower: 750, upper: 1010 },
    { month: 'Feb', actual: 820, forecast: 850, lower: 720, upper: 980 },
    { month: 'Mar', actual: 950, forecast: 920, lower: 790, upper: 1050 },
    { month: 'Apr', actual: 880, forecast: 900, lower: 770, upper: 1030 },
    { month: 'May', actual: 1100, forecast: 1050, lower: 920, upper: 1180 },
    { month: 'Jun', actual: 1250, forecast: 1200, lower: 1070, upper: 1330 },
    { month: 'Jul', actual: 0, forecast: 1100, lower: 970, upper: 1230 },
    { month: 'Aug', actual: 0, forecast: 1000, lower: 870, upper: 1130 },
    { month: 'Sep', actual: 0, forecast: 1150, lower: 1020, upper: 1280 },
    { month: 'Oct', actual: 0, forecast: 1050, lower: 920, upper: 1180 },
    { month: 'Nov', actual: 0, forecast: 1400, lower: 1270, upper: 1530 },
    { month: 'Dec', actual: 0, forecast: 1500, lower: 1370, upper: 1630 },
  ],
};

export const HEADCOUNT_DATA: HeadcountRow[] = [
  { store: 'Flagship #12 — Galleria', format: 'flagship', current: 18, optimal: 22, gap: 4, weekdayNeed: 6, weekendNeed: 10 },
  { store: 'Flagship #8 — Midtown', format: 'flagship', current: 16, optimal: 20, gap: 4, weekdayNeed: 5, weekendNeed: 9 },
  { store: 'Standard #45 — Westside', format: 'standard', current: 10, optimal: 12, gap: 2, weekdayNeed: 3, weekendNeed: 6 },
  { store: 'Standard #67 — Lakewood', format: 'standard', current: 11, optimal: 12, gap: 1, weekdayNeed: 3, weekendNeed: 6 },
  { store: 'Outlet #3 — Premium', format: 'outlet', current: 6, optimal: 8, gap: 2, weekdayNeed: 2, weekendNeed: 4 },
  { store: 'Outlet #7 — Clearance', format: 'outlet', current: 5, optimal: 6, gap: 1, weekdayNeed: 2, weekendNeed: 3 },
  { store: 'SiS #14 — Nordstrom', format: 'shop-in-shop', current: 3, optimal: 4, gap: 1, weekdayNeed: 1, weekendNeed: 2 },
  { store: 'SiS #22 — Macy\'s', format: 'shop-in-shop', current: 2, optimal: 3, gap: 1, weekdayNeed: 1, weekendNeed: 2 },
];

export const SHIFT_SCHEDULE: ShiftBlock[] = [
  { id: 's1', rep: 'Casey M.', day: 'Mon', start: 8, end: 16, role: 'floor' },
  { id: 's2', rep: 'Raj P.', day: 'Mon', start: 10, end: 18, role: 'floor' },
  { id: 's3', rep: 'James W.', day: 'Mon', start: 12, end: 20, role: 'closer' },
  { id: 's4', rep: 'Sarah L.', day: 'Mon', start: 8, end: 16, role: 'lead' },
  { id: 's5', rep: 'Casey M.', day: 'Tue', start: 8, end: 16, role: 'floor' },
  { id: 's6', rep: 'Raj P.', day: 'Tue', start: 10, end: 18, role: 'floor' },
  { id: 's7', rep: 'James W.', day: 'Tue', start: 12, end: 20, role: 'closer' },
  { id: 's8', rep: 'Sarah L.', day: 'Tue', start: 8, end: 16, role: 'lead' },
  { id: 's9', rep: 'Casey M.', day: 'Wed', start: 10, end: 18, role: 'floor' },
  { id: 's10', rep: 'Raj P.', day: 'Wed', start: 8, end: 16, role: 'floor' },
  { id: 's11', rep: 'Mike T.', day: 'Wed', start: 12, end: 20, role: 'closer' },
  { id: 's12', rep: 'Sarah L.', day: 'Wed', start: 8, end: 16, role: 'lead' },
  { id: 's13', rep: 'Casey M.', day: 'Thu', start: 8, end: 16, role: 'floor' },
  { id: 's14', rep: 'Raj P.', day: 'Thu', start: 10, end: 18, role: 'floor' },
  { id: 's15', rep: 'James W.', day: 'Thu', start: 8, end: 16, role: 'floor' },
  { id: 's16', rep: 'Sarah L.', day: 'Thu', start: 12, end: 20, role: 'lead' },
  { id: 's17', rep: 'Casey M.', day: 'Fri', start: 10, end: 18, role: 'floor' },
  { id: 's18', rep: 'Raj P.', day: 'Fri', start: 10, end: 18, role: 'floor' },
  { id: 's19', rep: 'James W.', day: 'Fri', start: 12, end: 20, role: 'closer' },
  { id: 's20', rep: 'Sarah L.', day: 'Fri', start: 8, end: 16, role: 'lead' },
  { id: 's21', rep: 'Casey M.', day: 'Sat', start: 9, end: 17, role: 'floor' },
  { id: 's22', rep: 'Raj P.', day: 'Sat', start: 9, end: 17, role: 'floor' },
  { id: 's23', rep: 'James W.', day: 'Sat', start: 9, end: 17, role: 'closer' },
  { id: 's24', rep: 'Mike T.', day: 'Sat', start: 9, end: 17, role: 'floor' },
  { id: 's25', rep: 'Sarah L.', day: 'Sat', start: 9, end: 17, role: 'lead' },
  { id: 's26', rep: 'Anna K.', day: 'Sat', start: 11, end: 19, role: 'floor' },
  { id: 's27', rep: 'Casey M.', day: 'Sun', start: 10, end: 18, role: 'floor' },
  { id: 's28', rep: 'James W.', day: 'Sun', start: 10, end: 18, role: 'closer' },
  { id: 's29', rep: 'Mike T.', day: 'Sun', start: 10, end: 18, role: 'floor' },
  { id: 's30', rep: 'Sarah L.', day: 'Sun', start: 10, end: 18, role: 'lead' },
];

export const STORE_TARGETS: Record<FormatId, StoreTarget[]> = {
  flagship: [
    { store: 'Flagship #12 — Galleria', format: 'flagship', monthlyTarget: 420000, ytdActual: 2380000, attainment: 94, trend: 'up', topCategory: 'Mattresses' },
    { store: 'Flagship #8 — Midtown', format: 'flagship', monthlyTarget: 380000, ytdActual: 2150000, attainment: 94, trend: 'flat', topCategory: 'Adj. Bases' },
    { store: 'Flagship #3 — Downtown', format: 'flagship', monthlyTarget: 350000, ytdActual: 1920000, attainment: 91, trend: 'down', topCategory: 'Mattresses' },
    { store: 'Flagship #15 — Riverside', format: 'flagship', monthlyTarget: 400000, ytdActual: 2500000, attainment: 104, trend: 'up', topCategory: 'Bundles' },
  ],
  standard: [
    { store: 'Standard #45 — Westside', format: 'standard', monthlyTarget: 180000, ytdActual: 1020000, attainment: 94, trend: 'up', topCategory: 'Mattresses' },
    { store: 'Standard #67 — Lakewood', format: 'standard', monthlyTarget: 165000, ytdActual: 880000, attainment: 89, trend: 'down', topCategory: 'Mattresses' },
    { store: 'Standard #23 — Oakdale', format: 'standard', monthlyTarget: 175000, ytdActual: 1050000, attainment: 100, trend: 'up', topCategory: 'Adj. Bases' },
  ],
  outlet: [
    { store: 'Outlet #3 — Premium', format: 'outlet', monthlyTarget: 120000, ytdActual: 680000, attainment: 94, trend: 'flat', topCategory: 'Clearance' },
    { store: 'Outlet #7 — Clearance', format: 'outlet', monthlyTarget: 95000, ytdActual: 510000, attainment: 89, trend: 'down', topCategory: 'Clearance' },
  ],
  'shop-in-shop': [
    { store: 'SiS #14 — Nordstrom', format: 'shop-in-shop', monthlyTarget: 65000, ytdActual: 390000, attainment: 100, trend: 'up', topCategory: 'Premium' },
    { store: 'SiS #22 — Macy\'s', format: 'shop-in-shop', monthlyTarget: 55000, ytdActual: 295000, attainment: 89, trend: 'flat', topCategory: 'Mattresses' },
  ],
};
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd ~/Development/demos && pnpm tsc --noEmit --pretty 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
cd ~/Development/demos
git add data/register/planning-data.ts
git commit -m "feat(register): add planning data — forecasts, headcount, scheduling, targets"
```

---

### Task 3: Create platform data file

**Files:**
- Create: `data/register/platform-data.ts`

- [ ] **Step 1: Create the platform data file**

```typescript
// data/register/platform-data.ts

export interface IntegrationNode {
  id: string;
  name: string;
  type: 'core' | 'spoke';
  description: string;
  icon: string; // Lucide icon name
  color: string;
  syncFrequency: string;
  dataDirection: 'inbound' | 'outbound' | 'bidirectional';
  status: 'connected' | 'configured' | 'available';
  lastSync?: string;
  recordCount?: number;
}

export interface VaricentFieldMapping {
  prizymField: string;
  prizymSection: string;
  varicentField: string;
  varicentSection: string;
  syncStatus: 'synced' | 'pending' | 'not_mapped';
  lastUpdated: string;
}

export interface SyncEvent {
  id: string;
  timestamp: string;
  direction: 'push' | 'pull';
  recordCount: number;
  status: 'success' | 'warning' | 'error';
  detail: string;
}

export interface RoiMetric {
  label: string;
  before: string;
  after: string;
  improvement: string;
  icon: string;
}

export const INTEGRATION_NODES: IntegrationNode[] = [
  {
    id: 'prizym',
    name: 'PRIZYM',
    type: 'core',
    description: 'Revenue Operating System',
    icon: 'Hexagon',
    color: '#1E3A5F',
    syncFrequency: 'Core Hub',
    dataDirection: 'bidirectional',
    status: 'connected',
  },
  {
    id: 'pos',
    name: 'POS System',
    type: 'spoke',
    description: 'Transaction data, sale details, returns',
    icon: 'CreditCard',
    color: '#8B5CF6',
    syncFrequency: 'Real-time',
    dataDirection: 'inbound',
    status: 'connected',
    lastSync: '2 min ago',
    recordCount: 847342,
  },
  {
    id: 'hris',
    name: 'HRIS',
    type: 'spoke',
    description: 'Headcount, roles, territories, org structure',
    icon: 'Users',
    color: '#06B6D4',
    syncFrequency: 'Daily',
    dataDirection: 'inbound',
    status: 'connected',
    lastSync: '6 hours ago',
    recordCount: 4238,
  },
  {
    id: 'varicent',
    name: 'Varicent',
    type: 'spoke',
    description: 'Plan sync, calculation validation, comp admin',
    icon: 'Link',
    color: '#10B981',
    syncFrequency: 'Hourly',
    dataDirection: 'bidirectional',
    status: 'connected',
    lastSync: '34 min ago',
    recordCount: 12450,
  },
  {
    id: 'payroll',
    name: 'Payroll',
    type: 'spoke',
    description: 'Payout export, tax calculations, deductions',
    icon: 'DollarSign',
    color: '#F59E0B',
    syncFrequency: 'Bi-weekly',
    dataDirection: 'outbound',
    status: 'configured',
    lastSync: 'Mar 1, 2026',
    recordCount: 4200,
  },
  {
    id: 'bi',
    name: 'BI / Data Warehouse',
    type: 'spoke',
    description: 'Analytics feed, historical reporting, executive dashboards',
    icon: 'BarChart3',
    color: '#EF4444',
    syncFrequency: 'Daily',
    dataDirection: 'outbound',
    status: 'available',
  },
];

export const VARICENT_FIELD_MAPPINGS: VaricentFieldMapping[] = [
  { prizymField: 'Base Salary', prizymSection: 'Comp Plan', varicentField: 'Fixed Pay', varicentSection: 'Plan Components', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Per-Unit Commission', prizymSection: 'Comp Plan', varicentField: 'Credit Rule', varicentSection: 'Credits', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Volume Tier Rates', prizymSection: 'Comp Plan', varicentField: 'Rate Table', varicentSection: 'Incentives', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Attach Rate Accel.', prizymSection: 'Comp Plan', varicentField: 'Qualifier', varicentSection: 'Measurements', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Monthly Revenue', prizymSection: 'Measurements', varicentField: 'Period Measure', varicentSection: 'Measurements', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'Units Sold', prizymSection: 'Measurements', varicentField: 'Credit Amount', varicentSection: 'Credits', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'Attach Rate %', prizymSection: 'Measurements', varicentField: 'Qualifier Value', varicentSection: 'Measurements', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'ASP', prizymSection: 'Measurements', varicentField: 'Derived Measure', varicentSection: 'Measurements', syncStatus: 'pending', lastUpdated: '2026-03-09' },
  { prizymField: 'SPIFF Awards', prizymSection: 'Payouts', varicentField: 'Bonus Payment', varicentSection: 'Incentives', syncStatus: 'synced', lastUpdated: '2026-03-10' },
  { prizymField: 'Dispute Status', prizymSection: 'Disputes', varicentField: 'Adjustment', varicentSection: 'Credits', syncStatus: 'not_mapped', lastUpdated: 'N/A' },
  { prizymField: 'Financing Flag', prizymSection: 'Measurements', varicentField: 'Custom Attribute', varicentSection: 'Credits', syncStatus: 'synced', lastUpdated: '2026-03-11' },
  { prizymField: 'Store Format', prizymSection: 'Territory', varicentField: 'Position Attribute', varicentSection: 'Plan Components', syncStatus: 'synced', lastUpdated: '2026-03-10' },
];

export const SYNC_LOG: SyncEvent[] = [
  { id: 'ev-1', timestamp: '2026-03-11 10:34:12', direction: 'push', recordCount: 847, status: 'success', detail: 'Daily measurement sync — revenue, units, attach rates' },
  { id: 'ev-2', timestamp: '2026-03-11 09:00:05', direction: 'pull', recordCount: 12, status: 'success', detail: 'Plan component update — Q2 tier adjustments' },
  { id: 'ev-3', timestamp: '2026-03-10 22:00:03', direction: 'push', recordCount: 4200, status: 'success', detail: 'End-of-day full sync — all rep measurements' },
  { id: 'ev-4', timestamp: '2026-03-10 18:30:00', direction: 'push', recordCount: 3, status: 'warning', detail: 'Dispute sync — 3 pending adjustments (ASP mapping incomplete)' },
  { id: 'ev-5', timestamp: '2026-03-10 14:00:08', direction: 'push', recordCount: 423, status: 'success', detail: 'Midday measurement sync — morning shift data' },
  { id: 'ev-6', timestamp: '2026-03-10 09:00:04', direction: 'pull', recordCount: 0, status: 'success', detail: 'Plan component check — no changes detected' },
  { id: 'ev-7', timestamp: '2026-03-09 22:00:02', direction: 'push', recordCount: 4200, status: 'success', detail: 'End-of-day full sync — all rep measurements' },
  { id: 'ev-8', timestamp: '2026-03-09 16:45:00', direction: 'push', recordCount: 1, status: 'error', detail: 'ASP derived measure sync failed — mapping incomplete' },
  { id: 'ev-9', timestamp: '2026-03-09 14:00:06', direction: 'push', recordCount: 398, status: 'success', detail: 'Midday measurement sync — morning shift data' },
  { id: 'ev-10', timestamp: '2026-03-09 09:00:03', direction: 'pull', recordCount: 8, status: 'success', detail: 'Plan component update — SPIFF calendar March entries' },
];

export const ROI_METRICS: RoiMetric[] = [
  { label: 'Comp Admin Hours / Month', before: '320 hrs', after: '45 hrs', improvement: '86% reduction', icon: 'Clock' },
  { label: 'Average Attach Rate', before: '24%', after: '38%', improvement: '+14 points', icon: 'TrendingUp' },
  { label: 'Dispute Resolution Time', before: '12 days', after: '2.4 days', improvement: '80% faster', icon: 'AlertTriangle' },
  { label: 'Rep Comp Visibility', before: 'Monthly statement', after: 'Real-time', improvement: 'Always current', icon: 'Eye' },
  { label: 'Coaching Effectiveness', before: 'Quarterly review', after: 'Daily AI insights', improvement: 'Continuous', icon: 'Brain' },
];

export const ACT_SUMMARY = [
  { act: 1, name: 'Corporate Strategy', icon: 'Building2', description: 'Portfolio management, market positioning, seasonal planning' },
  { act: 2, name: 'Sales Strategy', icon: 'Target', description: 'District planning, store targets, product mix optimization' },
  { act: 3, name: 'Store Operations', icon: 'Monitor', description: 'Floor management, POS analytics, manager coaching tools' },
  { act: 4, name: 'Sales Planning', icon: 'TrendingUp', description: 'AI forecasting, headcount, scheduling, target setting' },
  { act: 5, name: 'Sales Compensation', icon: 'DollarSign', description: 'Plan design, measurements, payouts, disputes, reporting' },
  { act: 6, name: 'Platform & Integrations', icon: 'Network', description: 'Architecture, Varicent sync, product overview' },
];
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd ~/Development/demos && pnpm tsc --noEmit --pretty 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
cd ~/Development/demos
git add data/register/platform-data.ts
git commit -m "feat(register): add platform data — integrations, Varicent mappings, sync log, ROI"
```

---

### Task 4: Update demo.config.ts — expand to 6 acts

**Files:**
- Modify: `app/(demos)/register/demo.config.ts`

- [ ] **Step 1: Read current config**

Run: `cat ~/Development/demos/app/\(demos\)/register/demo.config.ts`

- [ ] **Step 2: Update config to 6 acts**

Replace the entire `nav` array. The key changes:
- Acts 1-2: unchanged (just add "Act N —" prefix if not already there — they already have it)
- Act 3: add Rep Self-Assessment nav item after Contest Board
- Insert new Act 4 — Sales Planning section
- Rename old Act 4 to Act 5, keep existing items, add 4 new items (measurements, disputes, statements, reports)
- Add new Act 6 — Platform & Integrations section

```typescript
// Updated demo.config.ts
import { defineDemo } from '@/components/demo-shell';
import { Bed } from 'lucide-react';

export default defineDemo({
  client: {
    name: 'Summit Sleep Co.',
    tagline: 'Retail Revenue Operating System',
    region: 'National — 200 Stores',
    logo: Bed,
  },
  product: {
    name: 'REGISTER',
    badge: 'Interactive Demo',
  },
  theme: 'register-slate',
  colors: {
    primary: '#1E3A5F',
    accent: '#06B6D4',
  },
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
        { label: 'POS Analytics', href: '/register/ops/pos', icon: 'CreditCard' },
        { label: 'Customer Journey', href: '/register/ops/customer', icon: 'Footprints' },
        { label: 'Inventory', href: '/register/ops/inventory', icon: 'Warehouse' },
        { label: 'Manager Console', href: '/register/ops/manager', icon: 'Monitor' },
        { label: 'Contest Board', href: '/register/ops/contests', icon: 'Trophy' },
        { label: 'Rep Self-Assessment', href: '/register/ops/rep-assessment', icon: 'UserCheck' },
      ],
    },
    {
      section: 'Act 4 — Sales Planning',
      color: '#6366F1',
      items: [
        { label: 'Forecasting', href: '/register/planning/forecasting', icon: 'TrendingUp' },
        { label: 'Headcount', href: '/register/planning/headcount', icon: 'Users' },
        { label: 'Scheduling', href: '/register/planning/scheduling', icon: 'Calendar' },
        { label: 'Targets', href: '/register/planning/targets', icon: 'Target' },
      ],
    },
    {
      section: 'Act 5 — Sales Compensation',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/register/comp/plan', icon: 'FileText' },
        { label: 'Measurements', href: '/register/comp/measurements', icon: 'BarChart3' },
        { label: 'Calculator', href: '/register/comp/calculator', icon: 'Calculator' },
        { label: 'Payouts', href: '/register/comp/payouts', icon: 'DollarSign' },
        { label: 'Disputes', href: '/register/comp/disputes', icon: 'AlertTriangle' },
        { label: 'Statements', href: '/register/comp/statements', icon: 'Receipt' },
        { label: 'Team Performance', href: '/register/comp/team', icon: 'BarChart3' },
        { label: 'Executive View', href: '/register/comp/executive', icon: 'TrendingUp' },
        { label: 'Reports', href: '/register/comp/reports', icon: 'PieChart' },
      ],
    },
    {
      section: 'Act 6 — Platform & Integrations',
      color: '#F59E0B',
      items: [
        { label: 'Architecture', href: '/register/platform/architecture', icon: 'Network' },
        { label: 'Varicent', href: '/register/platform/varicent', icon: 'Link' },
        { label: 'Product Overview', href: '/register/platform/product', icon: 'Package' },
      ],
    },
  ],
  footer: {
    copyright: '© 2026 Summit Sleep Co.',
    poweredBy: 'AICR',
  },
});
```

- [ ] **Step 3: Verify typecheck passes**

Run: `cd ~/Development/demos && pnpm tsc --noEmit --pretty 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
cd ~/Development/demos
git add app/\(demos\)/register/demo.config.ts
git commit -m "feat(register): expand nav to 6 acts — add planning, expand comp, add integrations"
```

---

### Task 5: Update Manager Console — add clickable coaching cards

**Files:**
- Modify: `app/(demos)/register/ops/manager/page.tsx`

- [ ] **Step 1: Read current Manager Console page**

Run: `cat ~/Development/demos/app/\(demos\)/register/ops/manager/page.tsx`

- [ ] **Step 2: Add coaching card click-through**

Find the existing COACHING array and coaching card rendering section. Modify coaching cards to be `<Link>` elements that navigate to `/register/ops/manager/coaching/${rep.id}`. Add an "Open on iPad" button next to each card that opens a new tab to the SWIC register-pos route.

Key changes:
- Import `Link` from `next/link`
- Import coaching data: `import { REPS } from '@/data/register/coaching-data'`
- Wrap each coaching card in a `<Link href={/register/ops/manager/coaching/${rep.id}}>`
- Add a small "View on iPad" icon button that opens `window.open()` to the SWIC URL
- Add visual affordance (hover state, chevron) to indicate clickability

The exact code depends on the current page structure — the implementer should read the file, find the coaching section, and wrap the cards with Link while preserving the existing visual design.

- [ ] **Step 3: Verify the page renders**

Run: `cd ~/Development/demos && pnpm dev` then navigate to `/register/ops/manager`
Expected: Coaching cards are now clickable, showing hover state and link behavior

- [ ] **Step 4: Commit**

```bash
cd ~/Development/demos
git add app/\(demos\)/register/ops/manager/page.tsx
git commit -m "feat(register): make coaching cards clickable — link to coaching drill-down"
```

---

## Chunk 2: Act 3 — Coaching Pages

### Task 6: Create Rep Coaching page (Mode B)

**Files:**
- Create: `app/(demos)/register/ops/manager/coaching/[id]/page.tsx`

- [ ] **Step 1: Create the coaching drill-down page**

This page shows a split view for a specific rep's coaching scenario. Follow the REGISTER page pattern exactly.

```typescript
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tablet, TrendingDown, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import { StatCard } from '@/components/demos/register';
import { getRepById, getScenarioByRepId } from '@/data/register/coaching-data';

export default function RepCoachingPage() {
  const params = useParams();
  const repId = params.id as string;
  const rep = getRepById(repId);
  const scenario = getScenarioByRepId(repId);

  if (!rep || !scenario) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#94A3B8' }}>Rep not found</p>
      </div>
    );
  }

  const swicBase = process.env.NEXT_PUBLIC_SWIC_URL || 'http://localhost:3010';
  const swicUrl = `${swicBase}/register-pos?scenario=${repId}`;

  return (
    <>
      {/* Back nav */}
      <Link
        href="/register/ops/manager"
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: '#8B5CF6' }}
      >
        <ArrowLeft size={16} />
        Back to Manager Console
      </Link>

      {/* Rep header */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
          >
            {rep.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0F172A' }}>{rep.name}</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>{rep.role} — {rep.store}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{rep.shift}</p>
          </div>
          <div className="ml-auto">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            >
              <TrendingDown size={12} />
              {scenario.weaknessLabel}
            </span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Attach Rate" value={`${rep.metrics.attachRate}%`} trend="down" trendValue={`Floor avg: ${rep.metrics.floorAvgAttach}%`} color="#EF4444" />
          <StatCard label="Financing Pitch" value={`${rep.metrics.financingPitch}%`} trend={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? 'down' : 'up'} trendValue={`Floor avg: ${rep.metrics.floorAvgFinancing}%`} color={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? '#EF4444' : '#10B981'} />
          <StatCard label="Avg Sale Price" value={`$${rep.metrics.asp.toLocaleString()}`} trend={rep.metrics.asp < rep.metrics.floorAvgAsp ? 'down' : 'up'} trendValue={`Floor avg: $${rep.metrics.floorAvgAsp.toLocaleString()}`} color={rep.metrics.asp < rep.metrics.floorAvgAsp ? '#F59E0B' : '#10B981'} />
          <StatCard label="Shift Revenue" value={`$${rep.metrics.shiftRevenue.toLocaleString()}`} color="#1E3A5F" />
        </div>
      </div>

      {/* Split view: What they did vs What they should do */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left: What they did */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={18} className="text-red-500" />
            <h2 className="text-base font-bold" style={{ color: '#0F172A' }}>What They Did</h2>
          </div>
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>Last sale — missed opportunity</p>

          <div className="space-y-2 mb-4">
            {scenario.lastSale.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span style={{ color: '#0F172A' }}>{item.name}</span>
                <span className="font-mono font-medium" style={{ color: '#0F172A' }}>${item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between text-sm font-bold" style={{ borderColor: '#FECDD3' }}>
              <span style={{ color: '#0F172A' }}>Total</span>
              <span style={{ color: '#0F172A' }}>${scenario.lastSale.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-4 text-xs" style={{ color: '#64748B' }}>
            <span>Attach Rate: {scenario.lastSale.attachRate}%</span>
            <span>Financing: {scenario.lastSale.financingUsed ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Right: What they should do */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-500" />
            <h2 className="text-base font-bold" style={{ color: '#0F172A' }}>What They Should Do</h2>
          </div>
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>{scenario.recommendation.action}</p>

          {scenario.recommendation.products.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#10B981' }}>Recommended Add-ons</p>
              {scenario.recommendation.products.map((product, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span style={{ color: '#0F172A' }}>{product.name}</span>
                  <span className="font-mono font-medium" style={{ color: '#10B981' }}>+${product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div
            className="rounded-lg p-3 flex items-center gap-2"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <Sparkles size={16} className="text-green-600" />
            <span className="text-sm font-semibold" style={{ color: '#166534' }}>
              +${scenario.recommendation.commissionDelta} commission per sale
            </span>
          </div>
        </div>
      </div>

      {/* Coaching Script */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} style={{ color: '#8B5CF6' }} />
          <h2 className="text-base font-bold" style={{ color: '#0F172A' }}>Coaching Script</h2>
        </div>
        <ol className="space-y-3">
          {scenario.recommendation.script.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm" style={{ color: '#334155' }}>
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#8B5CF6' }}>
                {i + 1}
              </span>
              <span className="pt-0.5">{point}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Open on iPad CTA */}
      <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <Tablet size={32} className="mx-auto mb-3" style={{ color: '#1E3A5F' }} />
        <h3 className="text-base font-bold mb-1" style={{ color: '#0F172A' }}>Practice This Scenario on iPad</h3>
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>
          Open the POS simulator pre-loaded with {rep.name.split(' ')[0]}&apos;s scenario
        </p>
        <button
          onClick={() => window.open(swicUrl, '_blank')}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #1E3A5F, #06B6D4)' }}
        >
          <Tablet size={16} />
          Open on iPad
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd ~/Development/demos && pnpm tsc --noEmit --pretty 2>&1 | tail -5`

- [ ] **Step 3: Verify page renders**

Navigate to `/register/ops/manager/coaching/casey` in dev server.
Expected: Rep header, split coaching view, coaching script, iPad CTA button.

- [ ] **Step 4: Commit**

```bash
cd ~/Development/demos
git add app/\(demos\)/register/ops/manager/coaching/\[id\]/page.tsx
git commit -m "feat(register): add rep coaching drill-down page (Mode B)"
```

---

### Task 7: Create Rep Self-Assessment page (Mode C)

**Files:**
- Create: `app/(demos)/register/ops/rep-assessment/page.tsx`

- [ ] **Step 1: Create the self-assessment page**

This page shows a rep's shift summary with last 5 sales, performance snapshot, AI insight, and "Practice Sale" button. Follow REGISTER page pattern.

```typescript
'use client';

import { useState } from 'react';
import { Sparkles, Tablet, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard, BarChart } from '@/components/demos/register';
import { REPS, SHIFT_SALES } from '@/data/register/coaching-data';

export default function RepAssessmentPage() {
  const [selectedRep] = useState(REPS[0]); // Default to first rep for demo
  const rep = selectedRep;

  const swicBase = process.env.NEXT_PUBLIC_SWIC_URL || 'http://localhost:3010';
  const swicUrl = `${swicBase}/register-pos?mode=training`;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>My Shift Summary</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Real-time performance snapshot and AI coaching for your current shift
        </p>
      </div>

      {/* Rep card */}
      <div className="rounded-xl border p-5 mb-6 flex items-center gap-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
        >
          {rep.avatar}
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: '#0F172A' }}>{rep.name}</p>
          <p className="text-xs" style={{ color: '#94A3B8' }}>{rep.shift} — {rep.store}</p>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="My Attach Rate"
          value={`${rep.metrics.attachRate}%`}
          trend={rep.metrics.attachRate < rep.metrics.floorAvgAttach ? 'down' : 'up'}
          trendValue={`Floor: ${rep.metrics.floorAvgAttach}%`}
          color={rep.metrics.attachRate < rep.metrics.floorAvgAttach ? '#EF4444' : '#10B981'}
        />
        <StatCard
          label="My ASP"
          value={`$${rep.metrics.asp.toLocaleString()}`}
          trend={rep.metrics.asp < rep.metrics.floorAvgAsp ? 'down' : 'up'}
          trendValue={`Floor: $${rep.metrics.floorAvgAsp.toLocaleString()}`}
          color={rep.metrics.asp < rep.metrics.floorAvgAsp ? '#F59E0B' : '#10B981'}
        />
        <StatCard
          label="Financing Pitch"
          value={`${rep.metrics.financingPitch}%`}
          trend={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? 'down' : 'up'}
          trendValue={`Floor: ${rep.metrics.floorAvgFinancing}%`}
          color={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? '#EF4444' : '#10B981'}
        />
        <StatCard label="Shift Revenue" value={`$${rep.metrics.shiftRevenue.toLocaleString()}`} color="#1E3A5F" />
      </div>

      {/* Performance comparison */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <h2 className="text-base font-bold mb-4" style={{ color: '#0F172A' }}>Performance Snapshot</h2>
        <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>Today vs Weekly Avg vs Floor Avg</p>
        <BarChart
          data={[
            { label: 'Attach Rate', value: rep.metrics.attachRate, color: '#8B5CF6' },
            { label: 'Attach (Weekly)', value: Math.round(rep.metrics.attachRate * 1.1), color: '#C4B5FD' },
            { label: 'Attach (Floor)', value: rep.metrics.floorAvgAttach, color: '#E2E8F0' },
            { label: 'Financing', value: rep.metrics.financingPitch, color: '#8B5CF6' },
            { label: 'Financing (Weekly)', value: Math.round(rep.metrics.financingPitch * 0.95), color: '#C4B5FD' },
            { label: 'Financing (Floor)', value: rep.metrics.floorAvgFinancing, color: '#E2E8F0' },
          ]}
          unit="%"
          maxVal={100}
        />
      </div>

      {/* Last 5 sales */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <h2 className="text-base font-bold mb-4" style={{ color: '#0F172A' }}>
          <ShoppingCart size={16} className="inline mr-2" style={{ color: '#8B5CF6' }} />
          Today&apos;s Sales
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: '#94A3B8' }}>
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Time</th>
                <th className="text-left py-2 font-medium">Items</th>
                <th className="text-right py-2 font-medium">Total</th>
                <th className="text-right py-2 font-medium">Attach</th>
                <th className="text-center py-2 font-medium">Financing</th>
              </tr>
            </thead>
            <tbody>
              {SHIFT_SALES.map((sale) => (
                <tr key={sale.id} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                  <td className="py-3 font-mono text-xs" style={{ color: '#64748B' }}>{sale.id}</td>
                  <td className="py-3" style={{ color: '#0F172A' }}>{sale.time}</td>
                  <td className="py-3" style={{ color: '#0F172A' }}>
                    {sale.items.map((item) => item.name).join(', ')}
                  </td>
                  <td className="py-3 text-right font-mono font-medium" style={{ color: '#0F172A' }}>
                    ${sale.total.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: sale.attachRate >= 50 ? '#10B981' : '#EF4444' }}
                    >
                      {sale.attachRate >= 50 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {sale.attachRate}%
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: sale.financingUsed ? '#10B981' : '#E2E8F0' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
            <Sparkles size={20} style={{ color: '#2563EB' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>AI Coaching Insight</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
              Your attach rate dropped 8% this week compared to last week. Customers who bought a mattress
              were 3x more likely to add an adjustable base when you demonstrated the zero-gravity position.
              Try leading with the base demo right after mattress selection — it takes 90 seconds and adds
              an average of $72 to your commission per sale.
            </p>
          </div>
        </div>
      </div>

      {/* Practice Sale CTA */}
      <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
        <Tablet size={32} className="mx-auto mb-3" style={{ color: '#8B5CF6' }} />
        <h3 className="text-base font-bold mb-1" style={{ color: '#0F172A' }}>Practice a Sale</h3>
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>
          Open the POS simulator to practice bundling and upselling techniques
        </p>
        <button
          onClick={() => window.open(swicUrl, '_blank')}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
        >
          <Tablet size={16} />
          Practice Sale
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck passes and page renders**

- [ ] **Step 3: Commit**

```bash
cd ~/Development/demos
git add app/\(demos\)/register/ops/rep-assessment/page.tsx
git commit -m "feat(register): add rep self-assessment page (Mode C) with AI insight + practice CTA"
```

---

## Chunk 3: Act 4 — Sales Planning (4 Pages)

### Task 8: Create Forecasting page

**Files:**
- Create: `app/(demos)/register/planning/forecasting/page.tsx`

- [ ] **Step 1: Create the forecasting page**

Page shows AI-assisted demand forecasting with actual vs forecast lines, confidence bands, and format selector. Uses `AreaChart`, `ConfidenceBand` (if available), `StatCard`, and `FormatSelector` from shared components. Data from `planning-data.ts`.

Pattern: Same as other REGISTER pages — `'use client'`, useState for format, import FormatSelector, render grid of StatCards + AreaChart showing forecast data with actual (solid) vs forecast (dashed) vs confidence band (shaded area).

Key sections:
- Header: "AI Demand Forecasting"
- FormatSelector
- 4 StatCards: Current Month Actual, Next Month Forecast, YTD Revenue, Forecast Accuracy %
- Main chart: AreaChart showing FORECAST_DATA for selected format — plot actual values (solid line) for months with data, forecast (dashed) for future months, shaded band between lower/upper
- Seasonal callout card: "Holiday surge expected Nov-Dec: +38% over baseline"

The implementer should follow the exact pattern from `comp/plan/page.tsx` — same imports, same styling approach, same FormatSelector integration.

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add forecasting page — AI demand prediction with confidence bands"
```

### Task 9: Create Headcount page

**Files:**
- Create: `app/(demos)/register/planning/headcount/page.tsx`

- [ ] **Step 1: Create the headcount page**

Table-driven page showing staffing levels by store with gap analysis. Uses `StatCard`, `BarChart`, `FormatSelector`.

Key sections:
- Header: "Workforce Planning"
- FormatSelector (filter table by format)
- 3 StatCards: Total Headcount, Optimal Headcount, Total Gap
- Table: store name, current, optimal, gap (colored red if gap > 0), weekday need, weekend need
- BarChart: current vs optimal by store

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add headcount page — staffing model by store format"
```

### Task 10: Create Scheduling page

**Files:**
- Create: `app/(demos)/register/planning/scheduling/page.tsx`

- [ ] **Step 1: Create the scheduling page**

Visual schedule grid showing shifts by day and rep. Uses `HeatMap`-style grid.

Key sections:
- Header: "Shift Optimization"
- 3 StatCards: Total Shifts This Week, Coverage Score, Peak Coverage
- Schedule grid: days (Mon-Sun) as columns, hours (8am-8pm) as rows, colored blocks showing rep assignments. Each block shows rep name and role badge (floor/lead/closer in different colors).
- Use SHIFT_SCHEDULE data grouped by day, then rendered as a time grid.

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add scheduling page — shift optimization grid"
```

### Task 11: Create Targets page

**Files:**
- Create: `app/(demos)/register/planning/targets/page.tsx`

- [ ] **Step 1: Create the targets page**

Store-level target setting with attainment tracking. Uses `StatCard`, `BarChart`, `FormatSelector`.

Key sections:
- Header: "Store Targets"
- FormatSelector
- 3 StatCards: Avg Attainment, Stores Above Target, Total YTD Revenue
- Table: store, monthly target, YTD actual, attainment % (colored: red <90%, yellow 90-100%, green >100%), trend arrow, top category
- BarChart: attainment by store

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add targets page — store-level target setting and attainment"
```

---

## Chunk 4: Act 5 — Sales Compensation Expansion

### Task 11.5: Create comp-data.ts shared data file

**Files:**
- Create: `data/register/comp-data.ts`

- [ ] **Step 1: Create shared compensation data**

This file provides data for Tasks 12-17 (all Act 5 pages). Import types from `store-data.ts`.

```typescript
// data/register/comp-data.ts
import type { FormatId } from './store-data';

export const COMP_TIERS = [
  { tier: 'Bronze', minRevenue: 0, maxRevenue: 24999, rate: 0.04, color: '#CD7F32' },
  { tier: 'Silver', minRevenue: 25000, maxRevenue: 49999, rate: 0.045, color: '#C0C0C0' },
  { tier: 'Gold', minRevenue: 50000, maxRevenue: 74999, rate: 0.05, color: '#FFD700' },
  { tier: 'Platinum', minRevenue: 75000, maxRevenue: Infinity, rate: 0.055, color: '#E5E4E2' },
];

export const SPIFF_CALENDAR = [
  { month: 'January', name: 'New Year Mattress Push', product: 'All Mattresses', bonus: '$15/unit', startDate: '2026-01-01', endDate: '2026-01-31', active: false },
  { month: 'February', name: 'Presidents Day Sale SPIFF', product: 'Adjustable Bases', bonus: '$25/unit', startDate: '2026-02-14', endDate: '2026-02-24', active: false },
  { month: 'March', name: 'Adjustable Base SPIFF', product: 'ErgoMotion Adj. Bases', bonus: '$25/unit', startDate: '2026-03-01', endDate: '2026-03-31', active: true },
  { month: 'April', name: 'Spring Clearance Bonus', product: 'Outlet Inventory', bonus: '2x commission', startDate: '2026-04-01', endDate: '2026-04-30', active: false },
  { month: 'May', name: 'Memorial Day Weekend', product: 'All Products', bonus: '$10/unit + team pool', startDate: '2026-05-22', endDate: '2026-05-26', active: false },
  { month: 'June', name: 'Summer Sleep Challenge', product: 'Cooling Products', bonus: '$20/unit', startDate: '2026-06-01', endDate: '2026-06-30', active: false },
];

export interface CommissionLogEntry {
  date: string;
  transactionId: string;
  items: string;
  saleTotal: number;
  tierApplied: string;
  rate: number;
  commission: number;
}

export const COMMISSION_LOG: CommissionLogEntry[] = [
  { date: '2026-03-11', transactionId: 'S-1041', items: 'Queen Hybrid + Protector', saleTotal: 1968, tierApplied: 'Silver', rate: 0.045, commission: 88.56 },
  { date: '2026-03-11', transactionId: 'S-1042', items: 'Full Firm', saleTotal: 849, tierApplied: 'Silver', rate: 0.045, commission: 38.21 },
  { date: '2026-03-11', transactionId: 'S-1043', items: 'King Pillow-Top + Base + Protector + Pillows', saleTotal: 3636, tierApplied: 'Silver', rate: 0.045, commission: 163.62 },
  { date: '2026-03-10', transactionId: 'S-1038', items: 'Queen Medium + Sheets', saleTotal: 1428, tierApplied: 'Silver', rate: 0.045, commission: 64.26 },
  { date: '2026-03-10', transactionId: 'S-1037', items: 'King Hybrid + Adj Base', saleTotal: 3198, tierApplied: 'Silver', rate: 0.045, commission: 143.91 },
  { date: '2026-03-10', transactionId: 'S-1036', items: 'Twin Firm', saleTotal: 699, tierApplied: 'Silver', rate: 0.045, commission: 31.46 },
  { date: '2026-03-09', transactionId: 'S-1033', items: 'Queen Hybrid + Protector + Pillows', saleTotal: 2237, tierApplied: 'Bronze', rate: 0.04, commission: 89.48 },
  { date: '2026-03-09', transactionId: 'S-1032', items: 'Full Firm + Basic Protector', saleTotal: 918, tierApplied: 'Bronze', rate: 0.04, commission: 36.72 },
];

export interface DisputeRecord {
  id: string;
  saleDate: string;
  transactionId: string;
  expectedAmount: number;
  calculatedAmount: number;
  discrepancy: string;
  status: 'submitted' | 'under_review' | 'resolved';
  filedDate: string;
  resolvedDate?: string;
  resolution?: string;
}

export const DISPUTES: DisputeRecord[] = [
  { id: 'D-101', saleDate: '2026-03-08', transactionId: 'S-1028', expectedAmount: 142.50, calculatedAmount: 127.80, discrepancy: 'Tier not applied — sale crossed Silver threshold mid-day', status: 'under_review', filedDate: '2026-03-09' },
  { id: 'D-102', saleDate: '2026-03-05', transactionId: 'S-1019', expectedAmount: 89.00, calculatedAmount: 71.20, discrepancy: 'SPIFF bonus missing — Adj Base sold during active SPIFF', status: 'submitted', filedDate: '2026-03-10' },
  { id: 'D-103', saleDate: '2026-02-22', transactionId: 'S-0987', expectedAmount: 55.00, calculatedAmount: 48.00, discrepancy: 'Return reversed but commission not reinstated', status: 'resolved', filedDate: '2026-02-23', resolvedDate: '2026-02-25', resolution: 'Commission reinstated — return was cancelled, sale stands' },
  { id: 'D-104', saleDate: '2026-02-18', transactionId: 'S-0962', expectedAmount: 210.00, calculatedAmount: 180.00, discrepancy: 'Bundle discount commission calculated on net, should be gross', status: 'resolved', filedDate: '2026-02-19', resolvedDate: '2026-02-21', resolution: 'Adjusted — policy confirms commission on gross sale price' },
  { id: 'D-105', saleDate: '2026-03-10', transactionId: 'S-1039', expectedAmount: 175.00, calculatedAmount: 175.00, discrepancy: 'Split sale credit not assigned — co-sold with Raj', status: 'submitted', filedDate: '2026-03-11' },
];

export interface StatementLineItem {
  category: string;
  description: string;
  amount: number;
}

export interface MonthlyStatement {
  period: string;
  periodLabel: string;
  repName: string;
  repId: string;
  store: string;
  planName: string;
  lineItems: StatementLineItem[];
  adjustments: StatementLineItem[];
  netPayout: number;
}

export const STATEMENTS: MonthlyStatement[] = [
  {
    period: '2026-03',
    periodLabel: 'March 1–15, 2026',
    repName: 'Casey Miller',
    repId: 'casey',
    store: 'Flagship #12 — Galleria',
    planName: 'Summit Sleep FY26 Floor Sales Plan',
    lineItems: [
      { category: 'Base Salary', description: 'Bi-weekly base (annualized $36,000)', amount: 1384.62 },
      { category: 'Mattress Commission', description: '14 units × avg $62.40', amount: 873.60 },
      { category: 'Accessory Commission', description: '6 units × avg $18.50', amount: 111.00 },
      { category: 'Attach Rate Accelerator', description: '12% attach — below 25% threshold, no bonus', amount: 0 },
      { category: 'Volume Tier Bonus', description: 'Silver tier (4.5%) on $21,400 incremental', amount: 963.00 },
      { category: 'SPIFF', description: 'Adj Base SPIFF — 2 units × $25', amount: 50.00 },
    ],
    adjustments: [
      { category: 'Prior Period Adj.', description: 'Feb dispute D-103 resolved — credit', amount: 7.00 },
    ],
    netPayout: 3389.22,
  },
  {
    period: '2026-02',
    periodLabel: 'February 16–28, 2026',
    repName: 'Casey Miller',
    repId: 'casey',
    store: 'Flagship #12 — Galleria',
    planName: 'Summit Sleep FY26 Floor Sales Plan',
    lineItems: [
      { category: 'Base Salary', description: 'Bi-weekly base', amount: 1384.62 },
      { category: 'Mattress Commission', description: '11 units', amount: 687.50 },
      { category: 'Accessory Commission', description: '3 units', amount: 55.50 },
      { category: 'Attach Rate Accelerator', description: '15% attach — below threshold', amount: 0 },
      { category: 'Volume Tier Bonus', description: 'Bronze tier (4%)', amount: 720.00 },
      { category: 'SPIFF', description: 'Presidents Day SPIFF — 1 unit × $25', amount: 25.00 },
    ],
    adjustments: [],
    netPayout: 2872.62,
  },
];

// Measurements data for the KPI dashboard
export interface KPIMeasurement {
  label: string;
  value: number;
  goal: number;
  unit: string;
  sparkline: number[];
}

export const KPI_MEASUREMENTS: Record<FormatId, KPIMeasurement[]> = {
  flagship: [
    { label: 'Units Sold', value: 142, goal: 150, unit: '', sparkline: [120, 135, 128, 145, 142] },
    { label: 'Revenue', value: 268000, goal: 280000, unit: '$', sparkline: [240000, 255000, 248000, 272000, 268000] },
    { label: 'Attach Rate', value: 31, goal: 35, unit: '%', sparkline: [28, 30, 27, 33, 31] },
    { label: 'Avg Sale Price', value: 1890, goal: 2000, unit: '$', sparkline: [1780, 1850, 1820, 1920, 1890] },
    { label: 'Financing Penetration', value: 64, goal: 70, unit: '%', sparkline: [58, 62, 60, 66, 64] },
    { label: 'Customer Satisfaction', value: 4.6, goal: 4.5, unit: '/5', sparkline: [4.4, 4.5, 4.3, 4.7, 4.6] },
  ],
  standard: [
    { label: 'Units Sold', value: 85, goal: 90, unit: '', sparkline: [72, 80, 78, 88, 85] },
    { label: 'Revenue', value: 148000, goal: 160000, unit: '$', sparkline: [130000, 142000, 138000, 155000, 148000] },
    { label: 'Attach Rate', value: 26, goal: 30, unit: '%', sparkline: [22, 24, 23, 28, 26] },
    { label: 'Avg Sale Price', value: 1740, goal: 1800, unit: '$', sparkline: [1680, 1720, 1700, 1760, 1740] },
    { label: 'Financing Penetration', value: 55, goal: 60, unit: '%', sparkline: [48, 52, 50, 57, 55] },
    { label: 'Customer Satisfaction', value: 4.3, goal: 4.5, unit: '/5', sparkline: [4.1, 4.2, 4.0, 4.4, 4.3] },
  ],
  outlet: [
    { label: 'Units Sold', value: 110, goal: 100, unit: '', sparkline: [90, 95, 100, 108, 110] },
    { label: 'Revenue', value: 98000, goal: 95000, unit: '$', sparkline: [82000, 88000, 92000, 96000, 98000] },
    { label: 'Attach Rate', value: 18, goal: 20, unit: '%', sparkline: [14, 16, 15, 19, 18] },
    { label: 'Avg Sale Price', value: 890, goal: 950, unit: '$', sparkline: [840, 860, 850, 880, 890] },
    { label: 'Financing Penetration', value: 42, goal: 50, unit: '%', sparkline: [35, 38, 36, 44, 42] },
    { label: 'Customer Satisfaction', value: 4.1, goal: 4.3, unit: '/5', sparkline: [3.9, 4.0, 3.9, 4.2, 4.1] },
  ],
  'shop-in-shop': [
    { label: 'Units Sold', value: 28, goal: 30, unit: '', sparkline: [22, 25, 24, 27, 28] },
    { label: 'Revenue', value: 52000, goal: 55000, unit: '$', sparkline: [44000, 48000, 46000, 51000, 52000] },
    { label: 'Attach Rate', value: 35, goal: 35, unit: '%', sparkline: [30, 33, 32, 36, 35] },
    { label: 'Avg Sale Price', value: 1860, goal: 1850, unit: '$', sparkline: [1780, 1820, 1800, 1850, 1860] },
    { label: 'Financing Penetration', value: 68, goal: 65, unit: '%', sparkline: [60, 64, 62, 67, 68] },
    { label: 'Customer Satisfaction', value: 4.7, goal: 4.5, unit: '/5', sparkline: [4.5, 4.6, 4.5, 4.8, 4.7] },
  ],
};

// Reports data
export const TEAM_EARNINGS = [
  { name: 'Sarah L.', role: 'Lead', earnings: 8420, color: '#10B981' },
  { name: 'Raj P.', role: 'Senior', earnings: 7890, color: '#06B6D4' },
  { name: 'Mike T.', role: 'Floor', earnings: 6540, color: '#8B5CF6' },
  { name: 'Casey M.', role: 'Floor', earnings: 5280, color: '#F59E0B' },
  { name: 'James W.', role: 'Floor', earnings: 4950, color: '#EF4444' },
  { name: 'Anna K.', role: 'Floor', earnings: 4720, color: '#64748B' },
];

export const COMP_AS_PCT_REVENUE = [
  { month: 'Jan', pct: 8.2 },
  { month: 'Feb', pct: 8.5 },
  { month: 'Mar', pct: 7.9 },
  { month: 'Apr', pct: 8.1 },
  { month: 'May', pct: 7.6 },
  { month: 'Jun', pct: 7.4 },
];
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd ~/Development/demos && pnpm tsc --noEmit --pretty 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
cd ~/Development/demos
git add data/register/comp-data.ts
git commit -m "feat(register): add comp data — tiers, SPIFFs, commission log, disputes, statements, KPIs"
```

---

### Task 12: Create Measurements page

**Files:**
- Create: `app/(demos)/register/comp/measurements/page.tsx`

- [ ] **Step 1: Create the measurements page**

KPI dashboard with goal vs actual visualization. Uses `StatCard`, `BarChart`, `FormatSelector`.

Key sections:
- Header: "Performance Measurements"
- FormatSelector
- Period selector: buttons for Daily, Weekly, Monthly, Quarterly
- 6 StatCards: Units Sold, Revenue, Attach Rate, ASP, Financing Penetration, Customer Satisfaction — each with sparkline data and goal vs actual coloring (red <80%, yellow 80-100%, green >100%)
- Goal vs Actual bar chart: side-by-side bars for each KPI
- Rep filter dropdown (for manager view)

Import `KPI_MEASUREMENTS` from `@/data/register/comp-data`. Use `FormatSelector` to filter by format.

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add measurements page — KPI dashboard with goal vs actual"
```

### Task 13: Create Disputes page

**Files:**
- Create: `app/(demos)/register/comp/disputes/page.tsx`

- [ ] **Step 1: Create the disputes page**

Dispute tracking table with file form and resolution history. Uses `StatCard`.

Import `DISPUTES` from `@/data/register/comp-data`.

Key sections:
- Header: "Dispute Management"
- 3 StatCards: Open Disputes (count from DISPUTES where status !== 'resolved'), Avg Resolution Time (2.4 days), Resolution Rate (94%)
- Table: iterate DISPUTES — sale date, transaction ID, expected $ vs calculated $, discrepancy, status badge (submitted/under review/resolved), filed date
- "File Dispute" button (opens a mock form with disabled submit)
- Resolution History section: filter DISPUTES for status === 'resolved', show timeline with audit trail

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add disputes page — filing, tracking, resolution history"
```

### Task 14: Create Statements page

**Files:**
- Create: `app/(demos)/register/comp/statements/page.tsx`

- [ ] **Step 1: Create the statements page**

Monthly commission statement in pay-stub format. Uses `StatCard`.

Import `STATEMENTS` from `@/data/register/comp-data`. Use `useState` to track selected period.

Key sections:
- Header: "Commission Statements"
- Month selector dropdown — iterate STATEMENTS, show `periodLabel` as options
- Statement card (styled like a formal document):
  - Header: "Summit Sleep Co. — Commission Statement" + selected statement's `periodLabel` + `repName` + `store`
  - Line items: iterate `lineItems` array — category, description, amount
  - Adjustments section: iterate `adjustments` array
  - Net payout: `netPayout` in bold
- "Download PDF" button (mock — shows `alert('PDF download coming soon')`)
- Previous statements list: clickable month entries

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add statements page — monthly commission pay-stub view"
```

### Task 15: Create Reports page

**Files:**
- Create: `app/(demos)/register/comp/reports/page.tsx`

- [ ] **Step 1: Create the reports page**

Manager-level comp analytics dashboard. Uses `StatCard`, `BarChart`, `AreaChart`.

Import `TEAM_EARNINGS` and `COMP_AS_PCT_REVENUE` from `@/data/register/comp-data`.

Key sections:
- Header: "Compensation Reports"
- 4 StatCards: Total Comp Paid YTD (`TEAM_EARNINGS.reduce` sum), Cost of Comp % (latest from `COMP_AS_PCT_REVENUE`), Avg Commission/Rep (total / count), Top Earner (first in `TEAM_EARNINGS`)
- Team commission distribution: `BarChart` with `TEAM_EARNINGS` mapped to `{ label: name, value: earnings, color }`
- Cost-of-comp trend: `AreaChart` with `COMP_AS_PCT_REVENUE` mapped to `{ label: month, value: pct }`
- "Export CSV" button (mock — `alert('CSV export coming soon')`)

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add reports page — manager comp analytics dashboard"
```

### Task 16: Enhance Comp Plan page

**Files:**
- Modify: `app/(demos)/register/comp/plan/page.tsx`

- [ ] **Step 1: Read current comp plan page**
- [ ] **Step 2: Enhance with tier visualization and SPIFF calendar**

Import `COMP_TIERS` and `SPIFF_CALENDAR` from `@/data/register/comp-data`.

Add to the existing page (below existing comp plan cards):

**Tier visualization section:**
- Iterate `COMP_TIERS` — render 4 horizontal bands showing: tier name, min/max revenue range, commission rate %, colored by `tier.color`
- Add a progress indicator arrow/marker showing "Current: $42,000 (Silver)" — hardcode the current position for demo

**SPIFF calendar section:**
- Iterate `SPIFF_CALENDAR` — render monthly grid cards showing: month, SPIFF name, product, bonus amount
- Highlight `active: true` entries with green border/background
- Show date range for each SPIFF

**Plan metadata:**
- Add "Plan Version: v2.1 — Effective Jan 1, 2026" badge
- Add "Acknowledged: Mar 1, 2026 ✓" status

Keep existing content, add these sections below the existing comp plan cards.

- [ ] **Step 3: Verify typecheck + page renders**
- [ ] **Step 4: Commit**

```bash
git commit -m "feat(register): enhance comp plan page — tier visualization + SPIFF calendar"
```

### Task 17: Enhance Payouts page

**Files:**
- Modify: `app/(demos)/register/comp/payouts/page.tsx`

- [ ] **Step 1: Read current payouts page**
- [ ] **Step 2: Enhance with itemized commission log and YTD summary**

Import `COMMISSION_LOG` and `STATEMENTS` from `@/data/register/comp-data`.

Add to the existing page (below existing payout content):

**Pay period timeline:**
- Horizontal strip showing bi-weekly periods (Jan 1-15, Jan 16-31, ..., Mar 1-15 highlighted as current)
- Current period has accent border + "Current" badge

**Itemized commission log:**
- Table iterating `COMMISSION_LOG`: date, transaction ID, items, sale total, tier applied (with tier color dot), rate %, commission amount
- Running total row at bottom

**YTD earnings card:**
- Calculate sum of all `STATEMENTS[*].netPayout` + current period so far
- Show: "YTD Earnings: $9,651.06" (sum of statement net payouts)

**Projection:**
- "At current pace: $4,120 projected for this period" — calculate from commission log entries in current period

- [ ] **Step 3: Verify typecheck + page renders**
- [ ] **Step 4: Commit**

```bash
git commit -m "feat(register): enhance payouts page — itemized log + YTD + projections"
```

---

## Chunk 5: Act 6 — Platform & Integrations (3 Pages)

### Task 18: Create Architecture page

**Files:**
- Create: `app/(demos)/register/platform/architecture/page.tsx`

- [ ] **Step 1: Create the architecture page**

Hub-and-spoke integration diagram. Uses `StatCard` and custom SVG/CSS layout.

Pattern: Build a visual hub-and-spoke layout using CSS grid or flexbox. PRIZYM in the center, 5 spokes radiating out (POS, HRIS, Varicent, Payroll, BI). Each spoke node is a clickable card that expands to show detail (connector status, last sync, record count).

```typescript
'use client';

import { useState } from 'react';
import * as Icons from 'lucide-react';
import { StatCard } from '@/components/demos/register';
import { INTEGRATION_NODES, type IntegrationNode } from '@/data/register/platform-data';

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<IntegrationNode | null>(null);
  const coreNode = INTEGRATION_NODES.find((n) => n.type === 'core')!;
  const spokeNodes = INTEGRATION_NODES.filter((n) => n.type === 'spoke');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>
          Summit Sleep Co. Integration Map
        </h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          System architecture and data flow across your technology stack
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Connected Systems" value="4" color="#10B981" />
        <StatCard label="Daily Sync Events" value="12,400" color="#1E3A5F" />
        <StatCard label="Data Freshness" value="< 2 min" color="#06B6D4" />
        <StatCard label="Sync Success Rate" value="99.7%" color="#10B981" />
      </div>

      {/* Hub and spoke diagram */}
      <div className="rounded-xl border p-8 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="relative mx-auto" style={{ maxWidth: 700, height: 400 }}>
          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => setSelectedNode(coreNode)}
              className="flex flex-col items-center justify-center h-28 w-28 rounded-full border-2 transition-all hover:scale-105"
              style={{
                borderColor: coreNode.color,
                background: `linear-gradient(135deg, ${coreNode.color}15, ${coreNode.color}05)`,
              }}
            >
              <Icons.Hexagon size={28} style={{ color: coreNode.color }} />
              <span className="text-xs font-bold mt-1" style={{ color: coreNode.color }}>PRIZYM</span>
            </button>
          </div>

          {/* Spoke nodes positioned in a circle */}
          {spokeNodes.map((node, i) => {
            const angle = (i * 360) / spokeNodes.length - 90;
            const radius = 160;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180) / 3.5;
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180) / 2;
            const Icon = (Icons as Record<string, Icons.LucideIcon>)[node.icon] ?? Icons.Circle;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="absolute flex flex-col items-center justify-center h-20 w-20 rounded-xl border transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: node.color,
                  backgroundColor: selectedNode?.id === node.id ? `${node.color}15` : '#FFFFFF',
                }}
              >
                <Icon size={20} style={{ color: node.color }} />
                <span className="text-[10px] font-semibold mt-1" style={{ color: '#0F172A' }}>{node.name}</span>
                <span className="text-[8px]" style={{ color: '#94A3B8' }}>{node.syncFrequency}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected node detail */}
      {selectedNode && selectedNode.type === 'spoke' && (
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = (Icons as Record<string, Icons.LucideIcon>)[selectedNode.icon] ?? Icons.Circle;
              return <Icon size={24} style={{ color: selectedNode.color }} />;
            })()}
            <div>
              <h3 className="text-base font-bold" style={{ color: '#0F172A' }}>{selectedNode.name}</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>{selectedNode.description}</p>
            </div>
            <span
              className="ml-auto rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: selectedNode.status === 'connected' ? '#DCFCE7' : selectedNode.status === 'configured' ? '#FEF3C7' : '#F1F5F9',
                color: selectedNode.status === 'connected' ? '#166534' : selectedNode.status === 'configured' ? '#92400E' : '#64748B',
              }}
            >
              {selectedNode.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Sync Frequency</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{selectedNode.syncFrequency}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Last Sync</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{selectedNode.lastSync ?? 'N/A'}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Records</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                {selectedNode.recordCount?.toLocaleString() ?? 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add architecture page — hub-and-spoke integration diagram"
```

---

### Task 19: Create Varicent Integration page

**Files:**
- Create: `app/(demos)/register/platform/varicent/page.tsx`

- [ ] **Step 1: Create the Varicent integration page**

Split-layout page showing PRIZYM view on left, Varicent view on right, with field mapping table and sync log below.

Key sections:
- Header: "Varicent Integration" with "POC1" environment badge
- Key message banner: "Your team keeps using Varicent. PRIZYM enriches it with floor-level intelligence Varicent can't see."
- Split view (2 columns):
  - Left: "PRIZYM View" — comp plan components grouped by section (Comp Plan, Measurements, Payouts)
  - Right: "Varicent View" — same data mapped to Varicent model (Plan Components, Credits, Measurements, Incentives)
- Field mapping table: PRIZYM field → Varicent field → sync status (green check / yellow pending / red not mapped)
- Sync log: last 10 events from SYNC_LOG data with timestamp, direction arrow, record count, status badge, detail

Use VARICENT_FIELD_MAPPINGS and SYNC_LOG from platform-data.ts.

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add Varicent integration page — side-by-side sync view"
```

---

### Task 20: Create Product Overview page

**Files:**
- Create: `app/(demos)/register/platform/product/page.tsx`

- [ ] **Step 1: Create the product overview page**

Product card, 6-act story miniature, ROI projection, and CTA. This is the "closer" page.

Key sections:
- Header: "Product Overview"
- PRIZYM product hero card: large branded card with product name, description, key capabilities
- 6-act story in miniature: grid of 6 cards, each with act icon + one-liner from ACT_SUMMARY data
- ROI projection section: "Based on Summit Sleep's 847 stores, 4,200 floor reps..."
  - 5 ROI metric cards from ROI_METRICS data, each showing before/after/improvement
- CTA section: "Ready for your POC?" with next-steps timeline (Week 1: Data access, Week 2-3: Configuration, Week 4: Pilot store, Week 5-6: Rollout plan)
- Powered by PRIZYM + AICR branding footer

Use ACT_SUMMARY and ROI_METRICS from platform-data.ts.

- [ ] **Step 2: Verify typecheck + page renders**
- [ ] **Step 3: Commit**

```bash
git commit -m "feat(register): add product overview page — ROI projection + POC CTA"
```

---

## Chunk 6: SWIC iPad POS Route (AICR Repo)

### Task 21: Create summit-sleep-pos data file

**Files:**
- Create: `summit/sparcc/modules/swic/src/data/summit-sleep-pos.ts` (in AICR repo)

- [ ] **Step 1: Create the POS product catalog and bundle data**

```typescript
// summit/sparcc/modules/swic/src/data/summit-sleep-pos.ts

export interface POSProduct {
  id: string;
  name: string;
  category: 'mattress' | 'base' | 'accessory' | 'protection';
  comfort?: 'firm' | 'medium' | 'plush';
  size?: 'twin' | 'full' | 'queen' | 'king' | 'cal-king';
  price: number;
  commission: number; // per-unit commission at base tier
  image?: string;
}

export interface BundleSuggestion {
  triggerCategory: string;
  triggerMinPrice: number;
  suggestion: POSProduct;
  reason: string;
  commissionLift: number;
  attachRateLift: number;
}

export interface FinancingTerm {
  months: number;
  label: string;
  apr: number;
  closeRateData: string; // descriptive stat
}

export interface CustomerProfile {
  type: 'walk-in' | 'returning';
  sleepPref: string;
  budget: string;
}

export const MATTRESSES: POSProduct[] = [
  { id: 'mt-twin-firm', name: 'Essential Twin Firm', category: 'mattress', comfort: 'firm', size: 'twin', price: 699, commission: 28 },
  { id: 'mt-full-firm', name: 'Essential Full Firm', category: 'mattress', comfort: 'firm', size: 'full', price: 849, commission: 34 },
  { id: 'mt-queen-firm', name: 'Essential Queen Firm', category: 'mattress', comfort: 'firm', size: 'queen', price: 999, commission: 40 },
  { id: 'mt-king-firm', name: 'Essential King Firm', category: 'mattress', comfort: 'firm', size: 'king', price: 1199, commission: 48 },
  { id: 'mt-queen-med', name: 'Comfort Queen Medium', category: 'mattress', comfort: 'medium', size: 'queen', price: 1299, commission: 52 },
  { id: 'mt-king-med', name: 'Comfort King Medium', category: 'mattress', comfort: 'medium', size: 'king', price: 1499, commission: 60 },
  { id: 'mt-queen-hybrid', name: 'Harmony Queen Hybrid', category: 'mattress', comfort: 'medium', size: 'queen', price: 1899, commission: 76 },
  { id: 'mt-king-hybrid', name: 'Harmony King Hybrid', category: 'mattress', comfort: 'medium', size: 'king', price: 2199, commission: 88 },
  { id: 'mt-queen-plush', name: 'Luxe Queen Pillow-Top', category: 'mattress', comfort: 'plush', size: 'queen', price: 2299, commission: 92 },
  { id: 'mt-king-plush', name: 'Luxe King Pillow-Top', category: 'mattress', comfort: 'plush', size: 'king', price: 2499, commission: 100 },
  { id: 'mt-calking-plush', name: 'Luxe Cal-King Pillow-Top', category: 'mattress', comfort: 'plush', size: 'cal-king', price: 2599, commission: 104 },
];

export const BASES: POSProduct[] = [
  { id: 'base-queen', name: 'ErgoMotion Queen Adj. Base', category: 'base', size: 'queen', price: 799, commission: 40 },
  { id: 'base-king', name: 'ErgoMotion King Adj. Base', category: 'base', size: 'king', price: 999, commission: 50 },
  { id: 'base-split-king', name: 'ErgoMotion Split King Base', category: 'base', size: 'king', price: 1399, commission: 70 },
];

export const ACCESSORIES: POSProduct[] = [
  { id: 'acc-pillow-basic', name: 'Basic Pillow', category: 'accessory', price: 39, commission: 4 },
  { id: 'acc-pillow-premium', name: 'Premium Pillow Set', category: 'accessory', price: 189, commission: 19 },
  { id: 'acc-sheets-queen', name: 'Cooling Sheets (Queen)', category: 'accessory', price: 129, commission: 13 },
  { id: 'acc-sheets-king', name: 'Cooling Sheets (King)', category: 'accessory', price: 149, commission: 15 },
  { id: 'acc-topper', name: 'Memory Foam Topper', category: 'accessory', price: 249, commission: 25 },
];

export const PROTECTION: POSProduct[] = [
  { id: 'prot-basic', name: 'Standard Protector', category: 'protection', price: 69, commission: 14 },
  { id: 'prot-cool', name: 'CoolGuard Protector', category: 'protection', price: 149, commission: 30 },
  { id: 'prot-plan-5', name: '5-Year Protection Plan', category: 'protection', price: 199, commission: 40 },
  { id: 'prot-plan-10', name: '10-Year Protection Plan', category: 'protection', price: 349, commission: 70 },
];

export const ALL_PRODUCTS = [...MATTRESSES, ...BASES, ...ACCESSORIES, ...PROTECTION];

export const BUNDLE_SUGGESTIONS: BundleSuggestion[] = [
  {
    triggerCategory: 'mattress',
    triggerMinPrice: 1000,
    suggestion: BASES[0], // ErgoMotion Queen
    reason: 'Customers who bought a mattress over $1,000 added an adjustable base 43% of the time',
    commissionLift: 40,
    attachRateLift: 43,
  },
  {
    triggerCategory: 'mattress',
    triggerMinPrice: 0,
    suggestion: PROTECTION[1], // CoolGuard Protector
    reason: 'Protects the warranty and adds $30 to your commission — 68% of customers say yes when asked',
    commissionLift: 30,
    attachRateLift: 68,
  },
  {
    triggerCategory: 'base',
    triggerMinPrice: 0,
    suggestion: ACCESSORIES[1], // Premium Pillow Set
    reason: 'Adjustable base buyers add premium pillows 55% of the time — complete the sleep system',
    commissionLift: 19,
    attachRateLift: 55,
  },
  {
    triggerCategory: 'mattress',
    triggerMinPrice: 2000,
    suggestion: ACCESSORIES[4], // Memory Foam Topper
    reason: 'Premium buyers love the topper upgrade — adds $25 commission with 38% attach rate',
    commissionLift: 25,
    attachRateLift: 38,
  },
];

export const FINANCING_TERMS: FinancingTerm[] = [
  { months: 0, label: 'Pay in Full', apr: 0, closeRateData: 'Baseline' },
  { months: 6, label: '6 Months', apr: 0, closeRateData: '+12% close rate' },
  { months: 12, label: '12 Months', apr: 0, closeRateData: '+24% close rate' },
  { months: 24, label: '24 Months', apr: 5.99, closeRateData: '+41% close rate' },
  { months: 36, label: '36 Months', apr: 7.99, closeRateData: '+72% close rate for $2,500+' },
  { months: 48, label: '48 Months', apr: 9.99, closeRateData: '+65% close rate for $3,000+' },
];

export const TIER_THRESHOLDS = [
  { tier: 'Bronze', minRevenue: 0, rate: 0.04, color: '#CD7F32' },
  { tier: 'Silver', minRevenue: 25000, rate: 0.045, color: '#C0C0C0' },
  { tier: 'Gold', minRevenue: 50000, rate: 0.05, color: '#FFD700' },
  { tier: 'Platinum', minRevenue: 75000, rate: 0.055, color: '#E5E4E2' },
];

export const COACHING_PRELOADS: Record<string, { customer: CustomerProfile; cartItemIds: string[] }> = {
  casey: {
    customer: { type: 'walk-in', sleepPref: 'Side sleeper, runs hot', budget: '$1,500–$2,500' },
    cartItemIds: ['mt-queen-hybrid'],
  },
  raj: {
    customer: { type: 'returning', sleepPref: 'Back sleeper, firm preference', budget: '$2,000–$3,000' },
    cartItemIds: ['mt-king-plush'],
  },
  james: {
    customer: { type: 'walk-in', sleepPref: 'Not sure yet', budget: 'Budget-conscious' },
    cartItemIds: ['mt-twin-firm'],
  },
};
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd ~/Development/AICR && pnpm tsc --noEmit -p summit/sparcc/modules/swic/tsconfig.json 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
cd ~/Development/AICR
git add summit/sparcc/modules/swic/src/data/summit-sleep-pos.ts
git commit -m "feat(swic): add summit-sleep POS data — product catalog, bundles, financing"
```

---

### Task 22: Create SWIC register-pos page and components

**Files:**
- Create: `summit/sparcc/modules/swic/src/app/register-pos/page.tsx`
- Create: `summit/sparcc/modules/swic/src/components/register-pos/SaleBuilder.tsx`
- Create: `summit/sparcc/modules/swic/src/components/register-pos/CommissionPanel.tsx`
- Create: `summit/sparcc/modules/swic/src/components/register-pos/BundleSuggestions.tsx`
- Create: `summit/sparcc/modules/swic/src/components/register-pos/FinancingWhatsIf.tsx`

- [ ] **Step 1: Create the main register-pos page**

Follow the proofline-route pattern: `TabletFrame` wrapper for desktop, full-screen for PWA/iPad. Horizontal split layout (55% sale builder, 45% commission panel).

The page should:
1. Read `?scenario=casey` (or raj/james) query param to pre-load coaching scenario
2. Read `?mode=training` for clean-cart mode
3. Manage cart state (items array)
4. Calculate commission using TIER_THRESHOLDS from summit-sleep-pos data
5. Pass cart + commission to child components

```typescript
// page.tsx skeleton — implementer fills in full component wiring
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TabletFrame } from '@/components/TabletFrame';
import { SaleBuilder } from '@/components/register-pos/SaleBuilder';
import { CommissionPanel } from '@/components/register-pos/CommissionPanel';
import {
  ALL_PRODUCTS,
  COACHING_PRELOADS,
  TIER_THRESHOLDS,
  type POSProduct,
  type CustomerProfile,
} from '@/data/summit-sleep-pos';

interface CartItem {
  product: POSProduct;
  quantity: number;
}

function RegisterPOSContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario');
  const mode = searchParams.get('mode');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerProfile>({
    type: 'walk-in',
    sleepPref: '',
    budget: '',
  });
  const [isPWA, setIsPWA] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Pre-load scenario
  useEffect(() => {
    if (scenario && COACHING_PRELOADS[scenario]) {
      const preload = COACHING_PRELOADS[scenario];
      setCustomer(preload.customer);
      const preloadedItems = preload.cartItemIds
        .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
        .filter(Boolean)
        .map((p) => ({ product: p!, quantity: 1 }));
      setCart(preloadedItems);
    }
  }, [scenario]);

  // PWA detection
  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsPWA(mq.matches);
  }, []);

  const addToCart = (product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Calculate commission
  const saleTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const baseCommission = cart.reduce((sum, item) => sum + item.product.commission * item.quantity, 0);

  // Determine tier (mock: based on monthly revenue so far + this sale)
  const monthlyRevenueSoFar = 42000; // mock
  const projectedMonthly = monthlyRevenueSoFar + saleTotal;
  const currentTier = [...TIER_THRESHOLDS].reverse().find((t) => projectedMonthly >= t.minRevenue) ?? TIER_THRESHOLDS[0];

  const content = (
    <div className="flex h-full overflow-hidden" style={{ background: isDark ? '#0F172A' : '#F8FAFC' }}>
      {/* Left: Sale Builder */}
      <div className="flex-[55] overflow-y-auto border-r" style={{ borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
        <SaleBuilder
          cart={cart}
          customer={customer}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onCustomerChange={setCustomer}
          isDark={isDark}
          scenario={scenario}
        />
      </div>
      {/* Right: Commission Panel */}
      <div className="flex-[45] overflow-y-auto">
        <CommissionPanel
          cart={cart}
          saleTotal={saleTotal}
          baseCommission={baseCommission}
          currentTier={currentTier}
          monthlyRevenue={projectedMonthly}
          isDark={isDark}
        />
      </div>
    </div>
  );

  if (isPWA) {
    return <div style={{ height: '100dvh' }}>{content}</div>;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen p-8"
      style={{ background: isDark ? '#0a0a0a' : '#f1f5f9' }}
    >
      <div className="w-full max-w-[1280px]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Summit Sleep — POS Simulator
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-xs px-3 py-1 rounded"
            style={{
              backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#94A3B8' : '#64748B',
            }}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
        <TabletFrame isDark={isDark}>{content}</TabletFrame>
      </div>
    </div>
  );
}

export default function RegisterPOSPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>}>
      <RegisterPOSContent />
    </Suspense>
  );
}
```

- [ ] **Step 2: Create SaleBuilder component**

Product catalog with category tabs, customer profile bar, and cart. See spec Section 3 for detailed requirements. Uses a tabbed interface (Mattresses, Bases, Sleep Accessories, Protection Plans) with product cards showing name, price, and commission impact. Cart section at the bottom with running total.

- [ ] **Step 3: Create CommissionPanel component**

Live commission display with tier progress bar, shift projection, and attach rate comparison. Shows: current sale total, itemized commission breakdown, tier progress bar (Bronze→Platinum), "What if you close 2 more?" projection, shift earnings + delta.

- [ ] **Step 4: Create BundleSuggestions component**

Contextual upsell bar that reads cart contents and shows relevant bundle suggestions from BUNDLE_SUGGESTIONS. Shows suggestion reason, commission lift, and one-click "Add" button.

- [ ] **Step 5: Create FinancingWhatsIf component**

Payment term calculator with radio buttons for 0/6/12/24/36/48 months. Shows monthly payment, APR, and close rate data. Message: "Same commission regardless of payment term."

- [ ] **Step 6: Verify typecheck passes**

Run: `cd ~/Development/AICR && pnpm tsc --noEmit -p summit/sparcc/modules/swic/tsconfig.json 2>&1 | tail -10`

- [ ] **Step 7: Test page renders**

Run: `cd ~/Development/AICR && npx turbo dev --filter=@aicr/demo-sparcc-swic`
Navigate to: `http://localhost:3010/register-pos`
Test: `http://localhost:3010/register-pos?scenario=casey`

- [ ] **Step 8: Commit**

```bash
cd ~/Development/AICR
git add summit/sparcc/modules/swic/src/app/register-pos/ summit/sparcc/modules/swic/src/components/register-pos/
git commit -m "feat(swic): add register-pos iPad POS route — sale builder + commission panel"
```

---

## Chunk 7: Final Verification

### Task 23: Full build verification

- [ ] **Step 1: Verify demos repo builds**

```bash
cd ~/Development/demos && pnpm build 2>&1 | tail -20
```

Expected: All pages build successfully, no type errors.

- [ ] **Step 2: Verify SWIC module builds**

```bash
cd ~/Development/AICR && npx turbo build --filter=@aicr/demo-sparcc-swic 2>&1 | tail -20
```

Expected: Clean build.

- [ ] **Step 3: Smoke test — navigate through all new pages**

Run demos dev server and click through:
1. `/register/ops/manager` → click Casey coaching card → coaching page loads
2. `/register/ops/rep-assessment` → self-assessment loads with sales table
3. `/register/planning/forecasting` → chart renders
4. `/register/planning/headcount` → table renders
5. `/register/planning/scheduling` → grid renders
6. `/register/planning/targets` → target table renders
7. `/register/comp/measurements` → KPI dashboard renders
8. `/register/comp/disputes` → dispute table renders
9. `/register/comp/statements` → statement view renders
10. `/register/comp/reports` → analytics charts render
11. `/register/platform/architecture` → hub-spoke diagram renders
12. `/register/platform/varicent` → split view renders
13. `/register/platform/product` → ROI + CTA renders

Run SWIC dev server:
14. `/register-pos` → POS loads with product catalog
15. `/register-pos?scenario=casey` → pre-loads Casey's scenario

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git commit -m "fix(register): address build/render issues from smoke testing"
```
