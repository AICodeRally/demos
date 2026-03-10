# PROOFLINE Act 5: Sales Comp Management — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Act 5 (Sales Comp Management) with 6 ICM modules to the PROOFLINE Andrews demo, restructure Act 4 nav, and add collapsible sidebar sections to DemoShell.

**Architecture:** Module-group approach — 6 sidebar items in Act 5, each rendering a tabbed page with sub-views. Existing pages (EMCO→Category Attainment, Visibility, Inquiries) absorbed into new module structure. DemoShell gets collapsible nav sections with localStorage persistence.

**Tech Stack:** Next.js, TypeScript, React useState, Lucide React icons, CSS custom properties (`--pl-*`)

**Spec:** `docs/superpowers/specs/2026-03-10-proofline-act5-comp-management-design.md`

---

## Chunk 1: Foundation (Tasks 1–3)

### Task 1: DemoShell — Collapsible Sidebar Sections

**Files:**
- `components/demo-shell/DemoShell.tsx` — modify Navigation section (lines 120–179)

**Behavior to implement:**
- Each nav section header is a clickable toggle
- Chevron rotates: `ChevronRight` (collapsed) → `ChevronDown` (expanded)
- Section containing the active route auto-expands on load and on route change
- Other sections collapsed by default
- State persisted to `localStorage` key `demoshell-nav-state-${config.product.name}` as a JSON array of expanded section indices

**Steps:**

- [ ] 1. Add `expandedSections` state and initialization logic after the existing `isDark` state:

```tsx
// After: const [isDark, setIsDark] = useState(true);

const [expandedSections, setExpandedSections] = useState<Set<number>>(() => new Set());
```

- [ ] 2. Add a `useEffect` to initialize `expandedSections` from localStorage and auto-expand the active section. Insert after the existing dark-mode `useEffect`:

```tsx
useEffect(() => {
  const storageKey = `demoshell-nav-state-${config.product.name}`;
  const saved = localStorage.getItem(storageKey);
  let initial: Set<number>;

  if (saved) {
    try {
      initial = new Set(JSON.parse(saved) as number[]);
    } catch {
      initial = new Set();
    }
  } else {
    initial = new Set();
  }

  // Always expand the section containing the active route
  const activeIdx = config.nav.findIndex((section) =>
    section.items.some((item) =>
      item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
    )
  );
  if (activeIdx !== -1) initial.add(activeIdx);

  setExpandedSections(initial);
}, [pathname, config.product.name, config.nav]);
```

- [ ] 3. Add a `toggleSection` handler and a `persistSections` helper. Insert after the `toggleTheme` function:

```tsx
const toggleSection = (idx: number) => {
  setExpandedSections((prev) => {
    const next = new Set(prev);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    const storageKey = `demoshell-nav-state-${config.product.name}`;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
    return next;
  });
};
```

- [ ] 4. Replace the entire `{/* Navigation */}` block (lines 121–179 of the original file) with the collapsible version below. The section header becomes a `<button>` that toggles visibility; nav items are conditionally rendered:

```tsx
{/* Navigation */}
<nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
  {config.nav.map((section, idx) => {
    const sectionClr = section.color ?? primaryColor;
    const isExpanded = expandedSections.has(idx);

    return (
      <div key={`${idx}-${section.section}`}>
        {/* Collapsible section header */}
        <button
          onClick={() => toggleSection(idx)}
          className="w-full flex items-center justify-between mb-2 mt-4 first:mt-0 px-3 py-0.5 rounded transition-colors hover:bg-white/[0.03] group"
        >
          <span
            className="text-[10px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: `${sectionClr}CC` }}
          >
            {section.section}
          </span>
          {isExpanded ? (
            <LucideIcons.ChevronDown
              className="h-3 w-3 transition-transform duration-200"
              style={{ color: `${sectionClr}66` }}
            />
          ) : (
            <LucideIcons.ChevronRight
              className="h-3 w-3 transition-transform duration-200"
              style={{ color: `${sectionClr}44` }}
            />
          )}
        </button>

        {/* Section items — only rendered when expanded */}
        {isExpanded && section.items.map((item) => {
          const Icon = getIcon(item.icon);
          const isActive =
            item.href === '/' ? pathname === '/' : pathname === item.href;
          const itemColor = sectionClr;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                config.darkMode
                  ? isActive
                    ? 'shadow-sm'
                    : ''
                  : isActive
                  ? 'bg-white/[0.10] text-white shadow-sm'
                  : 'text-white/65 hover:bg-white/[0.04] hover:text-white/80'
              )}
              style={config.darkMode ? {
                background: isActive ? 'var(--pl-sidebar-active-bg)' : undefined,
                color: isActive ? 'var(--pl-sidebar-text)' : 'var(--pl-sidebar-text-muted)',
              } : undefined}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-colors',
                  !config.darkMode && !isActive ? 'text-white/50 group-hover:text-white/60' : ''
                )}
                style={isActive ? { color: itemColor } : config.darkMode ? { color: 'var(--pl-sidebar-text-muted)' } : undefined}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && (
                <LucideIcons.ChevronRight
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: `${itemColor}66` }}
                />
              )}
            </Link>
          );
        })}
      </div>
    );
  })}
</nav>
```

- [ ] 5. Commit:

```bash
git add components/demo-shell/DemoShell.tsx
git commit -m "feat(proofline): collapsible sidebar sections with localStorage persistence"
```

---

### Task 2: ActNavigation — Add Act 5, Update Act 4

**Files:**
- `components/demos/proofline/ActNavigation.tsx` — full rewrite

**Steps:**

- [ ] 1. Replace the entire file content with the following. Changes: `currentAct` type extended to include `5`; Act 4 label changed to `'Sales Comp Planning'` and pages reduced from `8` to `5`; Act 5 entry added:

```tsx
'use client';

import Link from 'next/link';

interface ActNavigationProps {
  currentAct: 1 | 2 | 3 | 4 | 5;
}

const ACTS = [
  { act: 1, label: 'Corporate Strategy', pages: 3, color: '#C6A052', href: '/strategy/mandate' },
  { act: 2, label: 'Sales Strategy', pages: 5, color: '#7C3AED', href: '/strategy/territories' },
  { act: 3, label: 'Sales Operations', pages: 7, color: '#2563EB', href: '/ops/day-planner' },
  { act: 4, label: 'Sales Comp Planning', pages: 5, color: '#10B981', href: '/comp/plan' },
  { act: 5, label: 'Sales Comp Management', pages: 6, color: '#0EA5E9', href: '/comp/mgmt/data' },
] as const;

export function ActNavigation({ currentAct }: ActNavigationProps) {
  return (
    <div className="flex w-full gap-1 rounded-lg overflow-hidden" style={{ background: 'var(--pl-hover)' }}>
      {ACTS.map(({ act, label, pages, color, href }) => {
        const isActive = act === currentAct;
        return (
          <Link
            key={act}
            href={href}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 transition-all duration-200 group relative"
            style={{
              background: isActive ? `${color}15` : 'transparent',
              borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
            }}
          >
            {/* Act number */}
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: isActive ? `${color}25` : 'var(--pl-hover)',
                color: isActive ? color : 'var(--pl-text-faint)',
              }}
            >
              {act}
            </span>

            {/* Label + page count */}
            <div className="min-w-0">
              <div
                className="text-[11px] font-semibold truncate"
                style={{ color: isActive ? color : 'var(--pl-text-faint)' }}
              >
                {label}
              </div>
              <div
                className="text-[9px] font-mono"
                style={{ color: isActive ? `${color}80` : 'var(--pl-text-faint)' }}
              >
                {pages} pages
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] 2. Commit:

```bash
git add components/demos/proofline/ActNavigation.tsx
git commit -m "feat(proofline): add Act 5 to ActNavigation, rename Act 4 to Sales Comp Planning"
```

---

### Task 3: demo.config.ts — Restructure Act 4 + Add Act 5 Section

**Files:**
- `app/(demos)/proofline-andrews/demo.config.ts` — replace Act 4 section, add Act 5 section

**Steps:**

- [ ] 1. Replace the existing `Act 4` section (remove EMCO Gates, Visibility, Inquiries; rename section label) and add the new `Act 5` section. The full updated `demo.config.ts`:

```ts
import { defineDemo } from '@/components/demo-shell';
import { Beer } from 'lucide-react';

export default defineDemo({
  darkMode: true,
  client: {
    name: 'Andrews Distributing',
    tagline: 'Revenue Operating System',
    region: 'North & South Texas',
    logo: Beer,
  },
  product: {
    name: 'PROOFLINE',
    badge: 'Interactive Demo',
  },
  theme: 'barrel-brass',
  colors: {
    primary: '#C6A052',
    accent: '#B87333',
  },
  nav: [
    {
      section: 'Act 1 \u2014 Corporate Strategy',
      color: '#C6A052',
      items: [
        { label: 'FY2026 Strategy', href: '/proofline-andrews/strategy/mandate', icon: 'Target' },
        { label: 'Brand Portfolio', href: '/proofline-andrews/strategy/portfolio', icon: 'Package' },
        { label: 'Market Position', href: '/proofline-andrews/strategy/market', icon: 'Globe' },
      ],
    },
    {
      section: 'Act 2 \u2014 Sales Strategy',
      color: '#7C3AED',
      items: [
        { label: 'Territory Design', href: '/proofline-andrews/strategy/territories', icon: 'Map' },
        { label: 'Quota Waterfall', href: '/proofline-andrews/strategy/quotas', icon: 'GitBranch' },
        { label: 'Accounts', href: '/proofline-andrews/strategy/accounts', icon: 'Building2' },
        { label: 'Brand Mix', href: '/proofline-andrews/strategy/mix', icon: 'Sliders' },
        { label: 'Scenarios', href: '/proofline-andrews/strategy/scenarios', icon: 'Shuffle' },
      ],
    },
    {
      section: 'Act 3 \u2014 Sales Operations',
      color: '#2563EB',
      items: [
        { label: 'Day Planner', href: '/proofline-andrews/ops/day-planner', icon: 'MapPin' },
        { label: 'Dispatch', href: '/proofline-andrews/ops/dispatch', icon: 'Truck' },
        { label: 'Field Intel', href: '/proofline-andrews/ops/field-intel', icon: 'Radar' },
        { label: 'Compliance', href: '/proofline-andrews/ops/compliance', icon: 'ShieldCheck' },
        { label: 'Inventory', href: '/proofline-andrews/ops/inventory', icon: 'Warehouse' },
        { label: 'Manager', href: '/proofline-andrews/ops/manager', icon: 'Users' },
        { label: 'AI Intelligence', href: '/proofline-andrews/ops/ai', icon: 'Brain' },
      ],
    },
    {
      section: 'Act 4 \u2014 Sales Comp Planning',
      color: '#10B981',
      items: [
        { label: 'Comp Plan', href: '/proofline-andrews/comp/plan', icon: 'Trophy' },
        { label: 'Kickers', href: '/proofline-andrews/comp/kickers', icon: 'Zap' },
        { label: 'Calculator', href: '/proofline-andrews/comp/calculator', icon: 'Calculator' },
        { label: '13-Week Story', href: '/proofline-andrews/comp/story', icon: 'LineChart' },
        { label: 'CEO Impact', href: '/proofline-andrews/comp/impact', icon: 'BarChart3' },
      ],
    },
    {
      section: 'Act 5 \u2014 Sales Comp Management',
      color: '#0EA5E9',
      items: [
        { label: 'Data', href: '/proofline-andrews/comp/mgmt/data', icon: 'Database' },
        { label: 'Measurements', href: '/proofline-andrews/comp/mgmt/measurements', icon: 'BarChart3' },
        { label: 'Rewards', href: '/proofline-andrews/comp/mgmt/rewards', icon: 'Award' },
        { label: 'Payments', href: '/proofline-andrews/comp/mgmt/payments', icon: 'Wallet' },
        { label: 'Inquiries', href: '/proofline-andrews/comp/mgmt/inquiries', icon: 'MessageSquare' },
        { label: 'Reports', href: '/proofline-andrews/comp/mgmt/reports', icon: 'FileBarChart' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Andrews Distributing',
    poweredBy: 'AICR',
  },
});
```

- [ ] 2. Commit:

```bash
git add app/(demos)/proofline-andrews/demo.config.ts
git commit -m "feat(proofline): restructure Act 4 nav, add Act 5 comp management section"
```

---

## Chunk 2: Page Moves + Data (Tasks 4–6)

### Task 4: Create `data/proofline/mgmt.ts` + Export Through Barrel

**Files:**
- `data/proofline/mgmt.ts` — create new file
- `data/proofline/index.ts` — add export block

**Steps:**

- [ ] 1. Create `data/proofline/mgmt.ts` with the complete content below. This provides mock data for the Crediting, Payments, Club, and enhanced Inquiries modules:

```ts
// Andrews Distributing — Sales Comp Management Data
// Act 5 module data: transactions (crediting), payments, club tiers, inquiries (enhanced)

// ─── Types ───────────────────────────────────────

export type CreditRule = 'primary' | 'split-50-50' | 'split-70-30' | 'territory-override';
export type PaymentType = 'Base' | 'Variable' | 'Commission' | 'Bonus';
export type PaymentStatus = 'Pending' | 'Approved' | 'Deposited' | 'Held';
export type ClubTier = 'Gold' | 'Silver' | 'Bronze' | 'Tracking';
export type InquiryStatus = 'open' | 'under-review' | 'resolved' | 'escalated';
export type InquiryCategory =
  | 'data-error'
  | 'gate-dispute'
  | 'territory-credit'
  | 'kicker-eligibility'
  | 'other';

// ─── Transactions (Crediting Tab) ───────────────

export interface Transaction {
  id: string;
  date: string;
  accountName: string;
  product: string;         // brand name
  category: string;        // Core / Import / Emerging
  cases: number;
  revenue: number;
  creditedRep: string;
  routeId: string;
  rule: CreditRule;
  confidence: number;      // 0–1 confidence score on crediting rule
  splitWith?: string;      // other rep name if split
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-2026-0301', date: '2026-03-01',
    accountName: 'Cedar Springs Tap House', product: 'Coors Light', category: 'Core',
    cases: 24, revenue: 684, creditedRep: 'Marcus Reyes', routeId: 'DAL-03',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0302', date: '2026-03-01',
    accountName: 'El Mercado #3', product: 'Corona Extra', category: 'Import',
    cases: 28, revenue: 924, creditedRep: 'Rosa Gutierrez', routeId: 'LAR-01',
    rule: 'territory-override', confidence: 0.84,
  },
  {
    id: 'TXN-2026-0303', date: '2026-03-02',
    accountName: 'Total Wine Allen', product: 'Blue Moon', category: 'Core',
    cases: 48, revenue: 1536, creditedRep: 'Tommy Nguyen', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.97,
  },
  {
    id: 'TXN-2026-0304', date: '2026-03-02',
    accountName: 'Henderson Sports Bar', product: 'Modelo Especial', category: 'Import',
    cases: 36, revenue: 1188, creditedRep: 'Derek Thompson', routeId: 'DAL-01',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0305', date: '2026-03-03',
    accountName: 'Spec\'s Fort Worth Central', product: 'Firestone Walker 805', category: 'Emerging',
    cases: 18, revenue: 720, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'primary', confidence: 0.91,
  },
  {
    id: 'TXN-2026-0306', date: '2026-03-03',
    accountName: 'Alamo Drafthouse', product: 'Topo Chico Hard Seltzer', category: 'Emerging',
    cases: 22, revenue: 770, creditedRep: 'Kim Tran', routeId: 'DAL-02',
    rule: 'primary', confidence: 0.98,
  },
  {
    id: 'TXN-2026-0307', date: '2026-03-04',
    accountName: 'HEB Laredo #12', product: 'Heineken Original', category: 'Import',
    cases: 60, revenue: 2100, creditedRep: 'Rosa Gutierrez', routeId: 'LAR-01',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0308', date: '2026-03-04',
    accountName: 'Whataburger North Dallas (Chain)', product: 'Miller Lite', category: 'Core',
    cases: 96, revenue: 2688, creditedRep: 'Marcus Reyes', routeId: 'DAL-03',
    rule: 'split-70-30', confidence: 0.88, splitWith: 'Derek Thompson',
  },
  {
    id: 'TXN-2026-0309', date: '2026-03-05',
    accountName: 'HEB Allen', product: 'Dos Equis Lager', category: 'Import',
    cases: 42, revenue: 1386, creditedRep: 'Tommy Nguyen', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.96,
  },
  {
    id: 'TXN-2026-0310', date: '2026-03-05',
    accountName: 'Ranger Creek Taproom', product: 'Lone Star', category: 'Core',
    cases: 30, revenue: 720, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0311', date: '2026-03-06',
    accountName: 'Kroger Laredo', product: 'Pacifico Clara', category: 'Import',
    cases: 54, revenue: 1782, creditedRep: 'Rosa Gutierrez', routeId: 'LAR-01',
    rule: 'primary', confidence: 0.97,
  },
  {
    id: 'TXN-2026-0312', date: '2026-03-06',
    accountName: 'Bar Louie Allen', product: 'Woodford Reserve', category: 'Emerging',
    cases: 6, revenue: 1140, creditedRep: 'Tommy Nguyen', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.95,
  },
  {
    id: 'TXN-2026-0313', date: '2026-03-07',
    accountName: 'Chili\'s Hurst (Chain)', product: 'Coors Banquet', category: 'Core',
    cases: 84, revenue: 2352, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'split-50-50', confidence: 0.79, splitWith: 'Maria Santos',
  },
  {
    id: 'TXN-2026-0314', date: '2026-03-07',
    accountName: 'The Rustic Dallas', product: 'Corona Light', category: 'Import',
    cases: 32, revenue: 1024, creditedRep: 'Derek Thompson', routeId: 'DAL-01',
    rule: 'primary', confidence: 0.98,
  },
  {
    id: 'TXN-2026-0315', date: '2026-03-08',
    accountName: 'Academy Sports Fort Worth', product: 'Vizzy Hard Seltzer', category: 'Emerging',
    cases: 48, revenue: 1728, creditedRep: 'Jake Williams', routeId: 'FTW-05',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0316', date: '2026-03-08',
    accountName: 'Mi Tierra San Antonio', product: 'Modelo Negra', category: 'Import',
    cases: 20, revenue: 680, creditedRep: 'Carlos Rivera', routeId: 'SAT-02',
    rule: 'primary', confidence: 0.97,
  },
  {
    id: 'TXN-2026-0317', date: '2026-03-09',
    accountName: 'Costco Allen', product: 'Miller High Life', category: 'Core',
    cases: 120, revenue: 3000, creditedRep: 'Tommy Nguyen', routeId: 'ALN-01',
    rule: 'primary', confidence: 0.99,
  },
  {
    id: 'TXN-2026-0318', date: '2026-03-09',
    accountName: 'Target Dallas Park Cities', product: 'Saint Arnold Brewing', category: 'Emerging',
    cases: 24, revenue: 984, creditedRep: 'Kim Tran', routeId: 'DAL-02',
    rule: 'primary', confidence: 0.93,
  },
];

// ─── Payment Ledger ──────────────────────────────

export interface Payment {
  id: string;
  date: string;
  repName: string;
  routeId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  payCycle: string;       // e.g., "2026-02-01 – 2026-02-14"
  note?: string;
}

export const PAYMENTS: Payment[] = [
  // Pay cycle 1: Feb 1–14
  { id: 'PAY-001', date: '2026-02-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Base', amount: 3461.54, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-002', date: '2026-02-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Commission', amount: 1284.00, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-003', date: '2026-02-14', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-004', date: '2026-02-14', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Commission', amount: 940.00, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-005', date: '2026-02-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-006', date: '2026-02-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Commission', amount: 812.00, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-007', date: '2026-02-14', repName: 'Rosa Gutierrez', routeId: 'LAR-01', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-008', date: '2026-02-14', repName: 'Tommy Nguyen', routeId: 'ALN-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  { id: 'PAY-009', date: '2026-02-14', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Base', amount: 2692.31, status: 'Deposited', payCycle: '2026-02-01 – 2026-02-14' },
  // Pay cycle 2: Feb 15–28
  { id: 'PAY-010', date: '2026-02-28', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Base', amount: 3461.54, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-011', date: '2026-02-28', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Variable', amount: 2100.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-012', date: '2026-02-28', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Bonus', amount: 1500.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28', note: 'Q1 Kicker — Emerging Push' },
  { id: 'PAY-013', date: '2026-02-28', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-014', date: '2026-02-28', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Variable', amount: 1620.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-015', date: '2026-02-28', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-016', date: '2026-02-28', repName: 'Rosa Gutierrez', routeId: 'LAR-01', type: 'Base', amount: 2884.62, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-017', date: '2026-02-28', repName: 'Rosa Gutierrez', routeId: 'LAR-01', type: 'Commission', amount: 760.00, status: 'Held', payCycle: '2026-02-15 – 2026-02-28', note: 'Territory dispute pending (INQ-002)' },
  { id: 'PAY-018', date: '2026-02-28', repName: 'Tommy Nguyen', routeId: 'ALN-01', type: 'Base', amount: 3076.92, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-019', date: '2026-02-28', repName: 'Tommy Nguyen', routeId: 'ALN-01', type: 'Variable', amount: 1840.00, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  { id: 'PAY-020', date: '2026-02-28', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Base', amount: 2692.31, status: 'Deposited', payCycle: '2026-02-15 – 2026-02-28' },
  // Pay cycle 3: Mar 1–14 (current — pending/approved)
  { id: 'PAY-021', date: '2026-03-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Base', amount: 3461.54, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-022', date: '2026-03-14', repName: 'Marcus Reyes', routeId: 'DAL-03', type: 'Commission', amount: 1560.00, status: 'Pending', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-023', date: '2026-03-14', repName: 'Derek Thompson', routeId: 'DAL-01', type: 'Base', amount: 3076.92, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-024', date: '2026-03-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Base', amount: 2884.62, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-025', date: '2026-03-14', repName: 'Kim Tran', routeId: 'DAL-02', type: 'Bonus', amount: 2800.00, status: 'Pending', payCycle: '2026-03-01 – 2026-03-14', note: 'Kicker eligibility escalated (INQ-004) — awaiting VP review' },
  { id: 'PAY-026', date: '2026-03-14', repName: 'Rosa Gutierrez', routeId: 'LAR-01', type: 'Base', amount: 2884.62, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-027', date: '2026-03-14', repName: 'Tommy Nguyen', routeId: 'ALN-01', type: 'Base', amount: 3076.92, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-028', date: '2026-03-14', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Base', amount: 2692.31, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-029', date: '2026-03-14', repName: 'Jake Williams', routeId: 'FTW-05', type: 'Commission', amount: 980.00, status: 'Pending', payCycle: '2026-03-01 – 2026-03-14' },
  { id: 'PAY-030', date: '2026-03-14', repName: 'Carlos Rivera', routeId: 'SAT-02', type: 'Base', amount: 2692.31, status: 'Approved', payCycle: '2026-03-01 – 2026-03-14' },
];

// ─── Presidents Club Tiers ────────────────────────

export interface ClubTierDef {
  tier: ClubTier;
  label: string;
  threshold: number;   // annual attainment % floor
  color: string;
  payout: string;      // description of reward
}

export const CLUB_TIERS: ClubTierDef[] = [
  {
    tier: 'Gold',
    label: 'Gold Club',
    threshold: 1.20,
    color: '#F59E0B',
    payout: 'Cancun trip for 2 + $2,500 cash + Gold ring',
  },
  {
    tier: 'Silver',
    label: 'Silver Club',
    threshold: 1.10,
    color: '#94A3B8',
    payout: 'Las Vegas trip for 2 + $1,500 cash',
  },
  {
    tier: 'Bronze',
    label: 'Bronze Club',
    threshold: 1.05,
    color: '#CD7F32',
    payout: '$750 cash + recognition dinner',
  },
  {
    tier: 'Tracking',
    label: 'On Pace',
    threshold: 0.90,
    color: '#0EA5E9',
    payout: 'Pace qualification — final Q4 push required',
  },
];

// ─── Enhanced Inquiries ───────────────────────────
// Same data as existing comp/inquiries/page.tsx inline data,
// moved here for shared access across Act 5 modules.

export interface Inquiry {
  id: string;
  repName: string;
  routeId: string;
  category: InquiryCategory;
  subject: string;
  description: string;
  submittedDate: string;
  status: InquiryStatus;
  reviewerName: string | null;
  resolution: string | null;
  resolvedDate: string | null;
  impactAmount: number | null;
}

export const MGMT_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-001', repName: 'Marcus Reyes', routeId: 'DAL-03', category: 'data-error',
    subject: 'Missing cases from Cedar Springs Tap House delivery',
    description: 'Feb 18 delivery of 12 cases Corona Extra not credited to my route. POD attached. Store confirmed receipt. Affects my Import gate by 2pp.',
    submittedDate: '2026-02-20', status: 'resolved', reviewerName: 'Sarah Chen',
    resolution: '12 cases Corona Extra credited. Import gate recalculated from 82% to 84%. No tier impact.',
    resolvedDate: '2026-02-22', impactAmount: 340,
  },
  {
    id: 'INQ-002', repName: 'Rosa Gutierrez', routeId: 'LAR-01', category: 'territory-credit',
    subject: 'El Mercado delivery credited to LAR-02 instead of LAR-01',
    description: 'El Mercado #3 is on my route (LAR-01) but Feb 23 delivery of 28 cases was credited to Eduardo on LAR-02. This account has been mine since Laredo integration.',
    submittedDate: '2026-02-25', status: 'under-review', reviewerName: 'Roberto Garza',
    resolution: null, resolvedDate: null, impactAmount: 820,
  },
  {
    id: 'INQ-003', repName: 'Jake Williams', routeId: 'FTW-05', category: 'gate-dispute',
    subject: 'Emerging gate calculation missing Firestone Walker cases',
    description: 'My emerging gate shows 68% but Firestone Walker 805 cases from 3 accounts are not counting toward craft. These are craft brands and should be in my emerging category.',
    submittedDate: '2026-02-26', status: 'open', reviewerName: null,
    resolution: null, resolvedDate: null, impactAmount: 1200,
  },
  {
    id: 'INQ-004', repName: 'Kim Tran', routeId: 'DAL-02', category: 'kicker-eligibility',
    subject: 'Cinco de Mayo kicker should include Pacifico',
    description: 'Kicker definition says "Corona + Modelo volume" but I have 40 incremental cases of Pacifico which is also a Constellation import. Should Pacifico count toward the Cinco de Mayo kicker?',
    submittedDate: '2026-02-27', status: 'escalated', reviewerName: 'Sarah Chen',
    resolution: null, resolvedDate: null, impactAmount: 2800,
  },
  {
    id: 'INQ-005', repName: 'Derek Thompson', routeId: 'DAL-01', category: 'data-error',
    subject: 'Duplicate credit for Henderson Ave delivery',
    description: 'I was credited twice for a Feb 15 delivery to Henderson Ave. Overstated my revenue by $450. Flagging proactively — want my numbers accurate.',
    submittedDate: '2026-02-18', status: 'resolved', reviewerName: 'Sarah Chen',
    resolution: 'Duplicate removed. Revenue adjusted. No tier or gate impact. Noted for proactive integrity — positive coaching note added.',
    resolvedDate: '2026-02-19', impactAmount: -450,
  },
  {
    id: 'INQ-006', repName: 'Tommy Nguyen', routeId: 'ALN-01', category: 'territory-credit',
    subject: 'New Total Wine account should be on ALN-01 not ALN-03',
    description: 'Total Wine at Allen Premium Outlets was assigned to ALN-03 but it is in my territory ZIP code. I had initial meeting with store manager and submitted new account request.',
    submittedDate: '2026-02-28', status: 'open', reviewerName: null,
    resolution: null, resolvedDate: null, impactAmount: 3600,
  },
];

export const STATUS_CONFIG: Record<InquiryStatus, { bg: string; color: string; label: string }> = {
  'open': { bg: 'rgba(37,99,235,0.1)', color: '#2563EB', label: 'OPEN' },
  'under-review': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'REVIEWING' },
  'resolved': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'RESOLVED' },
  'escalated': { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'ESCALATED' },
};

export const CATEGORY_LABELS: Record<InquiryCategory, string> = {
  'data-error': 'Data Error',
  'gate-dispute': 'Gate Dispute',
  'territory-credit': 'Territory Credit',
  'kicker-eligibility': 'Kicker Eligibility',
  'other': 'Other',
};
```

- [ ] 2. Add the following export block to `data/proofline/index.ts` at the end of the `// ── Compensation ───────────────────────────────` section (after the existing `comp` export block, before `// ── Scenarios ──────────────────────────────────`):

```ts
// ── Comp Management (Act 5) ─────────────────────
export {
  TRANSACTIONS,
  PAYMENTS,
  CLUB_TIERS,
  MGMT_INQUIRIES,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  type Transaction,
  type CreditRule,
  type Payment,
  type PaymentType,
  type PaymentStatus,
  type ClubTierDef,
  type ClubTier,
  type Inquiry,
  type InquiryStatus,
  type InquiryCategory,
} from './mgmt';
```

- [ ] 3. Commit:

```bash
git add data/proofline/mgmt.ts data/proofline/index.ts
git commit -m "feat(proofline): add mgmt.ts data module for Act 5 (transactions, payments, club, inquiries)"
```

---

### Task 5: Create Measurements Module — `comp/mgmt/measurements/page.tsx`

**Files:**
- `app/(demos)/proofline-andrews/comp/mgmt/measurements/page.tsx` — create new file (directory will need creation)

**Note on content reuse:** The existing `comp/emco/page.tsx` and `comp/visibility/page.tsx` files contain all their JSX inline with no named component exports. Rather than refactoring those files mid-task, this new Measurements page duplicates the essential rendering logic from each into tab-conditional sections. Once the old pages are deleted (Task 7 in Chunks 3-4), the Measurements page will be the sole home for that content.

**Steps:**

- [ ] 1. Create the directory `app/(demos)/proofline-andrews/comp/mgmt/` (Next.js will create it implicitly when the file is created).

- [ ] 2. Create `app/(demos)/proofline-andrews/comp/mgmt/measurements/page.tsx` with the complete content below. This wraps both existing pages' content behind a two-tab bar styled with the Act 5 accent color (`#0EA5E9`):

```tsx
'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  EMCO_GATES,
  SELLERS,
  HOMETOWNS,
  COMP_TIERS,
  getGateStatus,
  countUnlockedGates,
  getEffectiveMultiplier,
  type Seller,
} from '@/data/proofline';
import { pct } from '@/lib/utils';

const ACT5_ACCENT = '#0EA5E9';

// ── Tab definitions ──────────────────────────────
type MeasurementsTab = 'attainment' | 'visibility';
const TABS: { id: MeasurementsTab; label: string }[] = [
  { id: 'attainment', label: 'Category Attainment' },
  { id: 'visibility', label: 'Visibility' },
];

// ── Gate Status Badge (shared) ───────────────────
function GateStatusBadge({ status }: { status: 'locked' | 'unlocked' | 'at-risk' }) {
  const cfg = {
    locked: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', icon: '\u2717' },
    unlocked: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', icon: '\u2713' },
    'at-risk': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: '\u26A0' },
  }[status];
  return (
    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {status.toUpperCase()}
    </span>
  );
}

// ── Mini Sparkline (13-week attainment) ──────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 20;
  const max = Math.max(...data, 1);
  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={80} height={20}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={w} cy={h - (data[data.length - 1] / max) * h} r={2} fill={color} />
    </svg>
  );
}

// ── Attainment Ring (Visibility tab) ────────────
function AttainmentRing({ seller }: { seller: Seller }) {
  const size = 160;
  const r = 58;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pctVal = Math.min(seller.attainment, 1.3);
  const fillPct = pctVal / 1.3;
  const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
  const tier = COMP_TIERS.find(t => seller.attainment >= t.floor && seller.attainment < t.ceiling) ?? COMP_TIERS[3];
  const gates = countUnlockedGates(seller.emcoGates);
  const mult = getEffectiveMultiplier(seller.emcoGates);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="flex-shrink-0">
        <defs>
          <linearGradient id="att-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#att-ring-grad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${fillPct * circ} ${circ}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="32" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
          {(seller.attainment * 100).toFixed(0)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--pl-text-muted)" fontFamily="monospace">
          attainment
        </text>
      </svg>
      <div className="space-y-2">
        <div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>TIER</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: tier.color }}>{tier.label}</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{pct(tier.floor)} – {pct(tier.ceiling)} attainment</div>
        </div>
        <div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>GATES UNLOCKED</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: ACT5_ACCENT }}>{gates}/4</div>
        </div>
        <div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>EFFECTIVE MULTIPLIER</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: '#F59E0B' }}>{mult.toFixed(2)}x</div>
        </div>
      </div>
    </div>
  );
}

// ── Category Attainment Tab ───────────────────────
function CategoryAttainmentTab({ hometownFilter }: { hometownFilter: string }) {
  const filteredSellers = hometownFilter === 'all'
    ? SELLERS
    : SELLERS.filter(s => s.hometown === hometownFilter);

  const avgAttainment = filteredSellers.reduce((s, r) => s + r.attainment, 0) / filteredSellers.length;
  const unlocked4 = filteredSellers.filter(s => countUnlockedGates(s.emcoGates) === 4).length;
  const atRisk = filteredSellers.filter(s => s.attainment >= 0.80 && s.attainment < 0.85).length;

  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Reps Shown" value={String(filteredSellers.length)} accent={ACT5_ACCENT} sub="Filtered view" />
        <LightKpiCard label="Avg Attainment" value={pct(avgAttainment)} accent={ACT5_ACCENT} sub="This quarter" />
        <LightKpiCard label="All 4 Gates Unlocked" value={String(unlocked4)} accent="#22C55E" sub="Full EMCO bonus" />
        <LightKpiCard label="At-Risk Reps" value={String(atRisk)} accent="#F59E0B" sub="80–85% attainment" />
      </div>

      {/* Gate Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {EMCO_GATES.map(gate => {
          const unlocked = filteredSellers.filter(s => getGateStatus(s.emcoGates, gate.name) === 'unlocked').length;
          const atRiskCount = filteredSellers.filter(s => getGateStatus(s.emcoGates, gate.name) === 'at-risk').length;
          return (
            <LightSectionCard key={gate.name} title={gate.label}>
              <div className="text-[22px] font-bold font-mono mb-1" style={{ color: gate.color }}>
                {unlocked}/{filteredSellers.length}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>unlocked</div>
              <div className="mt-2 text-[10px] font-mono" style={{ color: '#F59E0B' }}>
                {atRiskCount} at-risk
              </div>
              <div className="mt-1 text-[9px]" style={{ color: 'var(--pl-text-faint)' }}>
                {gate.multiplier}x multiplier
              </div>
            </LightSectionCard>
          );
        })}
      </div>

      {/* Rep Table */}
      <LightSectionCard title="Rep Category Attainment Detail">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Rep</th>
                <th className="text-left py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Route</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Attainment</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Core</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Import</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Emerging</th>
                <th className="text-center py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Combined</th>
                <th className="text-right py-2 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>13-Week</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map(seller => {
                const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                return (
                  <tr key={seller.id} style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    <td className="py-2 font-medium" style={{ color: 'var(--pl-text)' }}>{seller.name}</td>
                    <td className="py-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{seller.routeId}</td>
                    <td className="py-2 text-right font-bold font-mono" style={{ color }}>{pct(seller.attainment)}</td>
                    {(['core', 'import', 'emerging', 'combined'] as const).map(gate => (
                      <td key={gate} className="py-2 text-center">
                        <GateStatusBadge status={getGateStatus(seller.emcoGates, gate)} />
                      </td>
                    ))}
                    <td className="py-2 text-right">
                      <Sparkline data={seller.weeklyAttainment} color={color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>
    </>
  );
}

// ── Visibility Tab ────────────────────────────────
function VisibilityTab() {
  const [view, setView] = useState<'seller' | 'manager'>('seller');
  const [selectedSeller, setSelectedSeller] = useState(SELLERS[0]);
  const [selectedHometown, setSelectedHometown] = useState(HOMETOWNS[0].id);

  const hometownSellers = SELLERS.filter(s => s.hometown === selectedHometown);
  const avgAtt = hometownSellers.reduce((s, r) => s + r.attainment, 0) / hometownSellers.length;

  return (
    <div className="space-y-6">
      {/* View toggle */}
      <div className="flex gap-2">
        {(['seller', 'manager'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all"
            style={{
              background: view === v ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
              color: view === v ? ACT5_ACCENT : 'var(--pl-text-muted)',
              border: `1px solid ${view === v ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
            }}
          >
            {v === 'seller' ? 'Seller View' : 'Manager View'}
          </button>
        ))}
      </div>

      {view === 'seller' ? (
        <>
          {/* Seller selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SELLERS.slice(0, 12).map(s => (
              <button key={s.id} onClick={() => setSelectedSeller(s)}
                className="px-2.5 py-1 rounded text-[10px] font-mono transition-all"
                style={{
                  background: selectedSeller.id === s.id ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
                  color: selectedSeller.id === s.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                  border: `1px solid ${selectedSeller.id === s.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
                }}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <LightSectionCard title={`${selectedSeller.name} — Attainment Snapshot`}>
            <AttainmentRing seller={selectedSeller} />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {EMCO_GATES.map(gate => {
                const status = getGateStatus(selectedSeller.emcoGates, gate.name);
                return (
                  <div key={gate.name} className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--pl-border)' }}>
                    <div className="text-[10px] font-bold mb-1" style={{ color: gate.color }}>{gate.label}</div>
                    <GateStatusBadge status={status} />
                    <div className="mt-1 text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{gate.multiplier}x</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      ) : (
        <>
          {/* Hometown selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {HOMETOWNS.map(ht => (
              <button key={ht.id} onClick={() => setSelectedHometown(ht.id)}
                className="px-2.5 py-1 rounded text-[10px] font-mono transition-all"
                style={{
                  background: selectedHometown === ht.id ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
                  color: selectedHometown === ht.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                  border: `1px solid ${selectedHometown === ht.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
                }}
              >
                {ht.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <LightKpiCard label="Avg Attainment" value={pct(avgAtt)} accent={ACT5_ACCENT} sub={`${hometownSellers.length} reps`} />
            <LightKpiCard label="All Gates Unlocked"
              value={String(hometownSellers.filter(s => countUnlockedGates(s.emcoGates) === 4).length)}
              accent="#22C55E" sub="Full bonus eligible" />
            <LightKpiCard label="At-Risk"
              value={String(hometownSellers.filter(s => s.attainment < 0.85 && s.attainment >= 0.75).length)}
              accent="#F59E0B" sub="Needs coaching" />
          </div>
          <LightSectionCard title={`${HOMETOWNS.find(h => h.id === selectedHometown)?.name ?? ''} — Team Summary`}>
            <div className="space-y-2">
              {hometownSellers.map(seller => {
                const color = seller.attainment >= 1.0 ? '#22C55E' : seller.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                const gates = countUnlockedGates(seller.emcoGates);
                return (
                  <div key={seller.id} className="flex items-center gap-4 py-2 rounded-lg px-3" style={{ background: 'var(--pl-chart-bar-track)' }}>
                    <div className="w-32 font-medium text-[12px]" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                    <div className="font-mono text-[11px] w-16 text-right font-bold" style={{ color }}>{pct(seller.attainment)}</div>
                    <div className="flex gap-1">
                      {(['core', 'import', 'emerging', 'combined'] as const).map(gate => {
                        const s = getGateStatus(seller.emcoGates, gate);
                        return (
                          <div key={gate} className="w-4 h-4 rounded-full text-[7px] flex items-center justify-center font-bold"
                            style={{
                              background: s === 'unlocked' ? 'rgba(34,197,94,0.15)' : s === 'at-risk' ? 'rgba(245,158,11,0.15)' : 'rgba(248,113,113,0.1)',
                              color: s === 'unlocked' ? '#22C55E' : s === 'at-risk' ? '#F59E0B' : '#F87171',
                            }}>
                            {s === 'unlocked' ? '✓' : s === 'at-risk' ? '!' : '✗'}
                          </div>
                        );
                      })}
                    </div>
                    <Sparkline data={seller.weeklyAttainment} color={color} />
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────
export default function MeasurementsPage() {
  const [activeTab, setActiveTab] = useState<MeasurementsTab>('attainment');
  const [hometownFilter, setHometownFilter] = useState('all');

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Header */}
      <div className="mt-6 mb-4">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: ACT5_ACCENT }}>
          Sales Comp Management &middot; Measurements
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Measurements
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          Category attainment gates and seller performance visibility
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0 mb-6 rounded-lg overflow-hidden" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-4 py-2.5 text-[12px] font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? `${ACT5_ACCENT}15` : 'transparent',
              borderBottom: activeTab === tab.id ? `2px solid ${ACT5_ACCENT}` : '2px solid transparent',
              color: activeTab === tab.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hometown filter (shown only on attainment tab) */}
      {activeTab === 'attainment' && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setHometownFilter('all')}
            className="px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
            style={{
              background: hometownFilter === 'all' ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
              color: hometownFilter === 'all' ? ACT5_ACCENT : 'var(--pl-text-muted)',
              border: `1px solid ${hometownFilter === 'all' ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
            }}
          >
            All Hometowns
          </button>
          {HOMETOWNS.map(ht => (
            <button
              key={ht.id}
              onClick={() => setHometownFilter(ht.id)}
              className="px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={{
                background: hometownFilter === ht.id ? `${ACT5_ACCENT}18` : 'var(--pl-chart-bar-track)',
                color: hometownFilter === ht.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
                border: `1px solid ${hometownFilter === ht.id ? `${ACT5_ACCENT}40` : 'var(--pl-border)'}`,
              }}
            >
              {ht.name}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'attainment' && <CategoryAttainmentTab hometownFilter={hometownFilter} />}
      {activeTab === 'visibility' && <VisibilityTab />}
    </>
  );
}
```

- [ ] 3. Commit:

```bash
git add app/(demos)/proofline-andrews/comp/mgmt/measurements/page.tsx
git commit -m "feat(proofline): add Measurements module — Category Attainment + Visibility tabs (Act 5)"
```

---

### Task 6: Move + Enhance Inquiries — `comp/mgmt/inquiries/page.tsx`

**Files:**
- `app/(demos)/proofline-andrews/comp/mgmt/inquiries/page.tsx` — create new file

**Note:** The existing `comp/inquiries/page.tsx` is NOT deleted in this task. Deletion happens in Task 7 (Chunks 3-4) after this file is confirmed working. The new file imports `MGMT_INQUIRIES` and other types from `@/data/proofline` (the barrel), keeping data centralized in `mgmt.ts`.

**Steps:**

- [ ] 1. Create `app/(demos)/proofline-andrews/comp/mgmt/inquiries/page.tsx` with the complete content below. Changes from the original:
  - `currentAct={5}` instead of `currentAct={4}`
  - Accent color `#0EA5E9` instead of `#10B981` throughout header/KPI
  - Status filter tabs (All / Open / Under Review / Resolved / Escalated) with counts
  - Category dropdown filter
  - Data sourced from `MGMT_INQUIRIES` (imported from `@/data/proofline`)
  - Click-to-expand inline detail

```tsx
'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  MGMT_INQUIRIES,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  type Inquiry,
  type InquiryStatus,
  type InquiryCategory,
} from '@/data/proofline';
import { fmt } from '@/lib/utils';

const ACT5_ACCENT = '#0EA5E9';

// ── 3-Step Timeline ───────────────────────────────
function InquiryTimeline({ inquiry }: { inquiry: Inquiry }) {
  const steps = [
    { label: 'Submitted', date: inquiry.submittedDate, done: true },
    { label: 'Under Review', date: inquiry.reviewerName ? 'Assigned' : 'Pending', done: !!inquiry.reviewerName },
    { label: 'Resolved', date: inquiry.resolvedDate ?? 'Pending', done: inquiry.status === 'resolved' },
  ];

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{
              background: step.done ? '#22C55E' : 'var(--pl-chart-bar-track)',
              color: step.done ? 'white' : 'var(--pl-text-faint)',
            }}>
              {step.done ? '\u2713' : i + 1}
            </div>
            <div className="text-[8px] font-mono mt-0.5" style={{ color: step.done ? '#22C55E' : 'var(--pl-text-faint)' }}>{step.label}</div>
            <div className="text-[7px] font-mono" style={{ color: '#CBD5E0' }}>{step.date}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 h-0.5 mx-1" style={{ background: step.done ? '#22C55E' : 'var(--pl-border)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────
export default function MgmtInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InquiryCategory | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCount = MGMT_INQUIRIES.filter(i => i.status === 'open').length;
  const reviewCount = MGMT_INQUIRIES.filter(i => i.status === 'under-review').length;
  const resolvedCount = MGMT_INQUIRIES.filter(i => i.status === 'resolved').length;
  const escalatedCount = MGMT_INQUIRIES.filter(i => i.status === 'escalated').length;
  const avgResolutionDays = 2.1;
  const totalImpact = MGMT_INQUIRIES
    .filter(i => i.impactAmount && i.impactAmount > 0)
    .reduce((s, i) => s + (i.impactAmount ?? 0), 0);

  // Status filter tabs config
  const STATUS_TABS: { id: InquiryStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: MGMT_INQUIRIES.length },
    { id: 'open', label: 'Open', count: openCount },
    { id: 'under-review', label: 'Under Review', count: reviewCount },
    { id: 'resolved', label: 'Resolved', count: resolvedCount },
    { id: 'escalated', label: 'Escalated', count: escalatedCount },
  ];

  // Apply filters
  const filteredInquiries = MGMT_INQUIRIES.filter(i => {
    const statusMatch = statusFilter === 'all' || i.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || i.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: ACT5_ACCENT }}>
          Sales Comp Management &middot; Inquiries
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Compensation Inquiries
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {MGMT_INQUIRIES.length} total inquiries &middot; {avgResolutionDays}-day avg resolution &middot; Transparent 3-step process
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Open" value={String(openCount)} accent="#2563EB" sub="Awaiting review" />
        <LightKpiCard label="Under Review" value={String(reviewCount)} accent="#F59E0B" sub="Manager assigned" />
        <LightKpiCard label="Resolved" value={String(resolvedCount)} accent="#22C55E" sub="This quarter" />
        <LightKpiCard label="Escalated" value={String(escalatedCount)} accent="#F87171" sub="Needs VP review" />
        <LightKpiCard label="Avg Resolution" value={`${avgResolutionDays}d`} accent={ACT5_ACCENT} sub="Target: <3 days" />
      </div>

      {/* Resolution Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-[9px] font-bold font-mono mb-1" style={{ color: '#2563EB' }}>BY CATEGORY</div>
          {Object.entries(CATEGORY_LABELS).slice(0, 4).map(([key, label]) => {
            const count = MGMT_INQUIRIES.filter(i => i.category === key).length;
            return (
              <div key={key} className="flex justify-between text-[10px] py-0.5">
                <span style={{ color: 'var(--pl-text-muted)' }}>{label}</span>
                <span className="font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{count}</span>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-[9px] font-bold font-mono mb-1" style={{ color: '#22C55E' }}>RESOLUTION RATE</div>
          <div className="text-[28px] font-bold font-mono" style={{ color: '#22C55E' }}>{((resolvedCount / MGMT_INQUIRIES.length) * 100).toFixed(0)}%</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{resolvedCount} of {MGMT_INQUIRIES.length} resolved</div>
        </div>
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-[9px] font-bold font-mono mb-1" style={{ color: ACT5_ACCENT }}>TOTAL $ IMPACT</div>
          <div className="text-[28px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>${fmt(totalImpact)}</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>pending + resolved adjustments</div>
        </div>
      </div>

      {/* Status Filter Tabs + Category Dropdown */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        {/* Status Tabs */}
        <div className="flex gap-0 rounded-lg overflow-hidden" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className="px-3 py-2 text-[11px] font-semibold transition-all flex items-center gap-1.5"
              style={{
                background: statusFilter === tab.id ? `${ACT5_ACCENT}15` : 'transparent',
                borderBottom: statusFilter === tab.id ? `2px solid ${ACT5_ACCENT}` : '2px solid transparent',
                color: statusFilter === tab.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
              }}
            >
              {tab.label}
              <span
                className="text-[9px] font-mono px-1 py-0.5 rounded"
                style={{
                  background: statusFilter === tab.id ? `${ACT5_ACCENT}20` : 'var(--pl-chart-bar-track)',
                  color: statusFilter === tab.id ? ACT5_ACCENT : 'var(--pl-text-faint)',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as InquiryCategory | 'all')}
          className="text-[11px] rounded-lg px-3 py-2 font-medium"
          style={{
            background: 'var(--pl-chart-bar-track)',
            color: 'var(--pl-text)',
            border: '1px solid var(--pl-border)',
          }}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Filtered Inquiry Cards */}
      <LightSectionCard title={`Inquiries (${filteredInquiries.length})`} className="mb-6">
        {filteredInquiries.length === 0 ? (
          <div className="py-8 text-center text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            No inquiries match the current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map(inquiry => {
              const statusCfg = STATUS_CONFIG[inquiry.status];
              const isExpanded = expandedIds.has(inquiry.id);
              return (
                <div
                  key={inquiry.id}
                  className="rounded-lg border transition-all cursor-pointer"
                  style={{
                    borderColor: inquiry.status === 'escalated' ? 'rgba(248,113,113,0.3)' : 'var(--pl-border)',
                  }}
                  onClick={() => toggleExpand(inquiry.id)}
                >
                  {/* Card Header — always visible */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{ background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
                            {CATEGORY_LABELS[inquiry.category]}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{inquiry.id}</span>
                        </div>
                        <h4 className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{inquiry.subject}</h4>
                        <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>
                          {inquiry.repName} ({inquiry.routeId}) &middot; {inquiry.submittedDate}
                          {inquiry.reviewerName && <> &middot; Reviewer: {inquiry.reviewerName}</>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {inquiry.impactAmount !== null && (
                          <div className="text-right">
                            <div className="text-[14px] font-bold font-mono"
                              style={{ color: inquiry.impactAmount > 0 ? '#F59E0B' : '#22C55E' }}>
                              {inquiry.impactAmount > 0 ? `+$${fmt(inquiry.impactAmount)}` : `-$${fmt(Math.abs(inquiry.impactAmount))}`}
                            </div>
                            <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>$ impact</div>
                          </div>
                        )}
                        <div className="text-[10px]" style={{ color: 'var(--pl-text-faint)' }}>
                          {isExpanded ? '\u25B4' : '\u25BE'}
                        </div>
                      </div>
                    </div>

                    {/* Timeline — always visible */}
                    <InquiryTimeline inquiry={inquiry} />
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--pl-border)' }}>
                      <p className="text-[11px] mt-3 mb-3" style={{ color: 'var(--pl-text-secondary)' }}>
                        {inquiry.description}
                      </p>
                      {inquiry.resolution && (
                        <div className="rounded-md px-3 py-2" style={{ background: 'rgba(34,197,94,0.04)', borderLeft: '3px solid #22C55E' }}>
                          <div className="text-[9px] font-bold font-mono mb-0.5" style={{ color: '#22C55E' }}>RESOLUTION</div>
                          <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>{inquiry.resolution}</p>
                        </div>
                      )}
                      {!inquiry.resolution && (
                        <div className="rounded-md px-3 py-2" style={{ background: `${ACT5_ACCENT}08`, borderLeft: `3px solid ${ACT5_ACCENT}` }}>
                          <div className="text-[9px] font-bold font-mono mb-0.5" style={{ color: ACT5_ACCENT }}>PENDING</div>
                          <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>
                            This inquiry is {inquiry.status === 'escalated' ? 'escalated for VP review' : inquiry.status === 'under-review' ? 'currently under manager review' : 'awaiting assignment'}. Resolution notes will appear here when complete.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        PROOFLINE inquiry management follows a 3-step process: Submit &rarr; Review &rarr; Resolve. Target SLA is &lt;3 business days.
        All inquiries are tracked with full audit trail. Escalations go to VP Sales Ops. Impact amounts are calculated based
        on the comp plan and applied retroactively when resolved in the rep&apos;s favor.
      </div>
    </>
  );
}
```

- [ ] 2. Commit:

```bash
git add app/(demos)/proofline-andrews/comp/mgmt/inquiries/page.tsx
git commit -m "feat(proofline): add Inquiries module with status filter tabs + category filter (Act 5)"
```

---

## Chunk 3: New Module Pages (Tasks 7–10)

### Task 7: Data Module (`comp/mgmt/data/page.tsx`)

**Files:**
- `app/(demos)/proofline-andrews/comp/mgmt/data/page.tsx` — create new

**Steps:**

- [ ] 1. Create the file with complete page code:

```tsx
'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ACCENT = '#0EA5E9';

const FEEDS = [
  { name: 'Orders', source: 'SAP ERP', records: 48200, lastSync: '2h ago', health: 'Healthy' },
  { name: 'Accounts', source: 'Salesforce CRM', records: 4847, lastSync: '6h ago', health: 'Healthy' },
  { name: 'Roster', source: 'ADP HR', records: 36, lastSync: '24h ago', health: 'Healthy' },
  { name: 'Territories', source: 'Internal', records: 6, lastSync: 'Weekly', health: 'Healthy' },
];

const PIPELINE_STEPS = ['Source', 'Validate', 'Stage', 'Load'];

const PRODUCT_HIERARCHY = [
  { brand: 'Coors Light', category: 'Domestic Beer', supplierGroup: 'Molson Coors', gate: 'Core' },
  { brand: 'Miller Lite', category: 'Domestic Beer', supplierGroup: 'Molson Coors', gate: 'Core' },
  { brand: 'Blue Moon', category: 'Craft Beer', supplierGroup: 'Molson Coors', gate: 'Emerging' },
  { brand: 'Corona Extra', category: 'Import Beer', supplierGroup: 'Constellation', gate: 'Import' },
  { brand: 'Modelo Especial', category: 'Import Beer', supplierGroup: 'Constellation', gate: 'Import' },
  { brand: 'Heineken', category: 'Import Beer', supplierGroup: 'Heineken', gate: 'Import' },
  { brand: 'Dos Equis', category: 'Import Beer', supplierGroup: 'Heineken', gate: 'Import' },
  { brand: 'Tito\'s Vodka', category: 'Spirits', supplierGroup: 'Fifth Generation', gate: 'Emerging' },
  { brand: 'High Noon', category: 'FMB/Seltzer', supplierGroup: 'E&J Gallo', gate: 'Emerging' },
  { brand: 'White Claw', category: 'FMB/Seltzer', supplierGroup: 'Mark Anthony', gate: 'Emerging' },
];

const ACCOUNT_DIST = [
  { type: 'On-Premise Chain', count: 812, pct: 16.8 },
  { type: 'On-Premise Independent', count: 1204, pct: 24.8 },
  { type: 'Off-Premise Chain', count: 1621, pct: 33.4 },
  { type: 'Off-Premise Independent', count: 1210, pct: 25.0 },
];

const CREDIT_RULES = [
  { rule: 'Primary Rep', description: 'Single rep owns account — 100% credit', frequency: 'Most common' },
  { rule: 'Split Credit', description: 'Two reps share account — 50/50 default, adjustable', frequency: 'Multi-route accounts' },
  { rule: 'Territory Overlap', description: 'Route boundary conflict — resolved by seniority + volume', frequency: 'Rare, ~2% of txns' },
  { rule: 'New Rep Proration', description: 'Mid-period hire — credit prorated to start date', frequency: 'Hire events' },
];

const TRANSACTIONS = [
  { date: 'Mar 8', account: 'HEB Kirby', product: 'Coors Light 24pk', cases: 48, revenue: 1296, rep: 'Marcus Webb', rule: 'Primary', confidence: 99 },
  { date: 'Mar 8', account: 'Total Wine 183', product: 'Corona Extra 12pk', cases: 72, revenue: 2160, rep: 'Sofia Reyes', rule: 'Primary', confidence: 99 },
  { date: 'Mar 7', account: 'Whataburger Loop 410', product: 'Bud Light Lime 6pk', cases: 24, revenue: 576, rep: 'James Park / Kenji Morales', rule: 'Split', confidence: 94 },
  { date: 'Mar 7', account: 'Central Market Bev', product: 'High Noon Variety', cases: 36, revenue: 1188, rep: 'Elena Vargas', rule: 'Primary', confidence: 99 },
  { date: 'Mar 7', account: 'Q Sports Bar Downtown', product: 'Modelo Especial Draft', cases: 18, revenue: 594, rep: 'Diego Santos', rule: 'Primary', confidence: 98 },
  { date: 'Mar 6', account: 'Costco 290', product: 'Heineken 24pk', cases: 120, revenue: 3960, rep: 'Priya Nair', rule: 'Primary', confidence: 99 },
  { date: 'Mar 6', account: 'Spec\'s Bandera', product: 'Tito\'s Vodka 1.75L', cases: 30, revenue: 2250, rep: 'Raj Patel', rule: 'Primary', confidence: 99 },
  { date: 'Mar 6', account: 'Twin Peaks Bitters', product: 'White Claw 12pk', cases: 24, revenue: 696, rep: 'Ana Lima / Carlos Reyes', rule: 'Split', confidence: 91 },
  { date: 'Mar 5', account: 'Fiesta Mart Austin', product: 'Coors Banquet 18pk', cases: 60, revenue: 1560, rep: 'Marcus Webb', rule: 'Primary', confidence: 99 },
  { date: 'Mar 5', account: 'Aloft Hotel SAT', product: 'Blue Moon 6pk', cases: 12, revenue: 384, rep: 'Kenji Morales', rule: 'Primary', confidence: 97 },
  { date: 'Mar 5', account: 'Kroger IH-35', product: 'Dos Equis Lager 24pk', cases: 84, revenue: 2352, rep: 'Sofia Reyes', rule: 'Primary', confidence: 99 },
  { date: 'Mar 4', account: 'Chili\'s Nacogdoches', product: 'Dos Equis Amber Draft', cases: 8, revenue: 280, rep: 'Diego Santos / Ana Lima', rule: 'Split', confidence: 88 },
  { date: 'Mar 4', account: 'H-E-B Plus Laredo', product: 'Miller Lite 30pk', cases: 96, revenue: 2688, rep: 'Carlos Reyes', rule: 'Primary', confidence: 99 },
  { date: 'Mar 3', account: 'Walmart Supercenter 78', product: 'Corona Light 12pk', cases: 108, revenue: 3024, rep: 'Priya Nair', rule: 'Primary', confidence: 99 },
  { date: 'Mar 3', account: 'Rudy\'s BBQ Leon Springs', product: 'Shiner Bock Draft', cases: 20, revenue: 620, rep: 'Elena Vargas', rule: 'Primary', confidence: 98 },
];

const GATE_COLORS: Record<string, string> = {
  Core: '#2563EB',
  Import: '#7C3AED',
  Emerging: '#F59E0B',
};

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<'ingestion' | 'classification' | 'crediting'>('ingestion');

  const tabs = [
    { key: 'ingestion', label: 'Ingestion' },
    { key: 'classification', label: 'Classification' },
    { key: 'crediting', label: 'Crediting' },
  ] as const;

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === t.key ? ACCENT : 'var(--pl-text-muted)',
              borderBottom: activeTab === t.key ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Ingestion Tab ── */}
      {activeTab === 'ingestion' && (
        <>
          {/* Pipeline Diagram */}
          <LightSectionCard title="DATA PIPELINE" accent={ACCENT}>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 min-w-[100px]">
                  <div className="flex-1 flex flex-col items-center gap-2 px-3 py-4 rounded-lg"
                    style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                      STEP {i + 1}
                    </div>
                    <div className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>{step}</div>
                    <div className="text-[10px] font-mono text-center" style={{ color: 'var(--pl-text-muted)' }}>
                      {step === 'Source' && 'Pull from ERP/CRM/HR/Territories'}
                      {step === 'Validate' && 'Schema check, null guard, dedup'}
                      {step === 'Stage' && 'Normalize, enrich, classify'}
                      {step === 'Load' && 'Write to ICM ledger, trigger credits'}
                    </div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="flex-shrink-0 px-1 text-lg font-bold" style={{ color: ACCENT }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Feed Status Cards */}
          <LightSectionCard title="DATA FEEDS" accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FEEDS.map(feed => (
                <div key={feed.name} className="p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono uppercase" style={{ color: 'var(--pl-text)' }}>{feed.name}</span>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                      {feed.health}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>{feed.source}</div>
                  <div className="text-lg font-bold font-mono" style={{ color: ACCENT }}>
                    {feed.records.toLocaleString()}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>records · synced {feed.lastSync}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LightKpiCard label="Records Ingested (MTD)" value="2.4M" accent={ACCENT} />
            <LightKpiCard label="Validation Pass Rate" value="99.3%" accent={ACCENT} />
            <LightKpiCard label="Avg Processing Time" value="4.2 min" accent={ACCENT} />
            <LightKpiCard label="Error Count (MTD)" value="18" accent={ACCENT} delta="-12% vs last month" />
          </div>
        </>
      )}

      {/* ── Classification Tab ── */}
      {activeTab === 'classification' && (
        <>
          {/* Product Hierarchy */}
          <LightSectionCard title="PRODUCT HIERARCHY" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Brand', 'Category', 'Supplier Group', 'Gate'].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCT_HIERARCHY.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{row.brand}</td>
                      <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{row.category}</td>
                      <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{row.supplierGroup}</td>
                      <td className="py-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: `${GATE_COLORS[row.gate]}18`, color: GATE_COLORS[row.gate] }}>
                          {row.gate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Account Classification */}
          <LightSectionCard title="ACCOUNT TYPE DISTRIBUTION — 4,847 ACCOUNTS" accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ACCOUNT_DIST.map(a => (
                <div key={a.type} className="p-3 rounded-lg text-center" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>{a.count.toLocaleString()}</div>
                  <div className="text-xs font-bold font-mono mb-1" style={{ color: 'var(--pl-text)' }}>{a.type}</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{a.pct}% of accounts</div>
                  <div className="mt-2 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--pl-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Territory Assignment */}
          <LightSectionCard title="TERRITORY ASSIGNMENT SUMMARY" accent={ACCENT}>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>6</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Hometowns</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>SA / Austin / Laredo / Victoria / Corpus Christi / New Braunfels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>36</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Routes</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>6 routes per hometown average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>36</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Sales Reps</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>1 rep per route, no overlap</div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg text-[10px] font-mono" style={{ background: `${ACCENT}0A`, border: `1px solid ${ACCENT}20`, color: 'var(--pl-text-muted)' }}>
              Assignment logic: Account ZIP → Route boundary lookup → Primary rep assignment. Multi-route accounts resolved by highest historical volume rep. Territory changes take effect on the first of the following month.
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── Crediting Tab ── */}
      {activeTab === 'crediting' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Credits Processed (MTD)" value="48,218" accent={ACCENT} />
            <LightKpiCard label="Split Credit %" value="3.1%" accent={ACCENT} />
            <LightKpiCard label="Disputed Credits" value="7" accent={ACCENT} delta="-3 vs last month" />
            <LightKpiCard label="Avg Resolution Time" value="1.4 days" accent={ACCENT} />
          </div>

          {/* Credit Rules */}
          <LightSectionCard title="CREDITING RULES" accent={ACCENT}>
            <div className="grid gap-3">
              {CREDIT_RULES.map(rule => (
                <div key={rule.rule} className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold font-mono"
                    style={{ background: `${ACCENT}18`, color: ACCENT, whiteSpace: 'nowrap' }}>
                    {rule.rule}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text)' }}>{rule.description}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>Applied: {rule.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Recent Transactions */}
          <LightSectionCard title="RECENT CREDIT TRANSACTIONS" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Date', 'Account', 'Product', 'Cases', 'Revenue', 'Credited Rep', 'Rule', 'Conf.'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((tx, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{tx.date}</td>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{tx.account}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{tx.product}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text)' }}>{tx.cases}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: ACCENT }}>${tx.revenue.toLocaleString()}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text)' }}>{tx.rep}</td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{
                            background: tx.rule === 'Split' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                            color: tx.rule === 'Split' ? '#F59E0B' : '#22C55E',
                          }}>
                          {tx.rule}
                        </span>
                      </td>
                      <td className="py-1.5 text-right" style={{ color: tx.confidence >= 95 ? '#22C55E' : '#F59E0B' }}>{tx.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
```

- [ ] 2. Commit:

```bash
git add "app/(demos)/proofline-andrews/comp/mgmt/data/page.tsx"
git commit -m "feat(proofline): add Data module — Ingestion/Classification/Crediting tabs (Act 5)"
```

---

### Task 8: Rewards Module (`comp/mgmt/rewards/page.tsx`)

**Files:**
- `app/(demos)/proofline-andrews/comp/mgmt/rewards/page.tsx` — create new

**Steps:**

- [ ] 1. Create the file with complete page code:

```tsx
'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS, HOMETOWNS } from '@/data/proofline';

const ACCENT = '#0EA5E9';

const TIER_COLORS: Record<number, string> = {
  1: '#22C55E',
  2: '#2563EB',
  3: '#F59E0B',
  4: '#94A3B8',
};

const RATE_SCHEDULE = [
  { tier: 1, label: 'Elite', floor: 110, ceiling: '∞', ratePerCase: 3.80, range: '110%+' },
  { tier: 2, label: 'Achiever', floor: 90, ceiling: 110, ratePerCase: 3.20, range: '90–110%' },
  { tier: 3, label: 'Contributor', floor: 75, ceiling: 90, ratePerCase: 2.60, range: '75–90%' },
  { tier: 4, label: 'Developing', floor: 0, ceiling: 75, ratePerCase: 2.00, range: '<75%' },
];

const HOMETOWNS_LIST = [
  { id: 'sa', name: 'San Antonio' },
  { id: 'austin', name: 'Austin' },
  { id: 'laredo', name: 'Laredo' },
  { id: 'victoria', name: 'Victoria' },
  { id: 'corpus', name: 'Corpus Christi' },
  { id: 'nb', name: 'New Braunfels' },
];

const ACTIVE_BONUSES = [
  { name: 'Q1 Volume Kicker', description: 'Extra $0.40/case for ≥100% attainment', threshold: 1.00 },
  { name: 'Import Push Bonus', description: '$500 for unlocking Import gate + 5% over', threshold: 0.80 },
  { name: 'Spirits Adder', description: '$25/new spirits account in quarter', threshold: null },
];

// Build rep rewards data from SELLERS
const REP_REWARDS = SELLERS.map(seller => {
  const baseSalary = 52000;
  const variableTarget = 18000;
  const attPct = seller.attainment;
  const tierLevel = seller.tier;
  const casesQTD = Math.round(800 + attPct * 400 + Math.sin(seller.id.charCodeAt(0)) * 120);
  const ratePerCase = RATE_SCHEDULE.find(r => tierLevel === r.tier)?.ratePerCase ?? 2.00;
  const commissionEarned = Math.round(casesQTD * ratePerCase);
  const variableEarned = Math.round(variableTarget * Math.min(attPct / 1.0, 1.3));
  const bonusEarned = seller.spiritsAccounts >= 3 ? seller.spiritsAccounts * 25 : 0;
  const status = attPct >= 1.0 ? 'above' : attPct >= 0.85 ? 'at-risk' : 'below';

  return {
    ...seller,
    baseSalary,
    variableTarget,
    variableEarned,
    commissionEarned,
    bonusEarned,
    casesQTD,
    ratePerCase,
    status,
    attPct,
  };
});

const HOMETOWN_ROLLUP = HOMETOWNS_LIST.map(ht => {
  const reps = REP_REWARDS.filter(r => r.hometown === ht.id);
  const totalComm = reps.reduce((s, r) => s + r.commissionEarned, 0);
  const avgRate = reps.length > 0 ? reps.reduce((s, r) => s + r.ratePerCase, 0) / reps.length : 0;
  const top = reps.sort((a, b) => b.commissionEarned - a.commissionEarned)[0];
  return { ...ht, reps: reps.length, totalComm, avgRate, topEarner: top?.name ?? '—', topAmount: top?.commissionEarned ?? 0 };
});

const STATUS_CFG = {
  above: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'ABOVE' },
  'at-risk': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'AT RISK' },
  below: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'BELOW' },
};

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'variable' | 'commission' | 'bonus'>('variable');
  const [hometownFilter, setHometownFilter] = useState<string | null>(null);
  const [bonusFilter, setBonusFilter] = useState<string | null>(null);

  const tabs = [
    { key: 'variable', label: 'Variable Pay' },
    { key: 'commission', label: 'Commission' },
    { key: 'bonus', label: 'Bonus' },
  ] as const;

  const filteredReps = hometownFilter
    ? REP_REWARDS.filter(r => r.hometown === hometownFilter)
    : REP_REWARDS;

  const sorted = [...filteredReps].sort((a, b) => b.attPct - a.attPct);

  const aboveCount = REP_REWARDS.filter(r => r.status === 'above').length;
  const belowCount = REP_REWARDS.filter(r => r.status === 'below').length;
  const totalVariable = REP_REWARDS.reduce((s, r) => s + r.variableEarned, 0);
  const avgRatio = REP_REWARDS.reduce((s, r) => s + r.variableEarned / r.variableTarget, 0) / REP_REWARDS.length;

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === t.key ? ACCENT : 'var(--pl-text-muted)',
              borderBottom: activeTab === t.key ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Variable Pay Tab ── */}
      {activeTab === 'variable' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Total Variable Paid (QTD)" value={`$${(totalVariable / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="Avg Payout Ratio" value={`${(avgRatio * 100).toFixed(0)}%`} accent={ACCENT} />
            <LightKpiCard label="Above Target" value={String(aboveCount)} accent={ACCENT} delta="of 36 reps" />
            <LightKpiCard label="Below Target" value={String(belowCount)} accent={ACCENT} />
          </div>

          {/* Hometown Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setHometownFilter(null)}
              className="px-3 py-1 rounded text-[10px] font-bold font-mono uppercase transition-colors"
              style={{
                background: hometownFilter === null ? ACCENT : 'var(--pl-card-alt)',
                color: hometownFilter === null ? 'white' : 'var(--pl-text-muted)',
                border: `1px solid ${hometownFilter === null ? ACCENT : 'var(--pl-border)'}`,
              }}
            >
              All
            </button>
            {HOMETOWNS_LIST.map(ht => (
              <button
                key={ht.id}
                onClick={() => setHometownFilter(ht.id)}
                className="px-3 py-1 rounded text-[10px] font-bold font-mono uppercase transition-colors"
                style={{
                  background: hometownFilter === ht.id ? ACCENT : 'var(--pl-card-alt)',
                  color: hometownFilter === ht.id ? 'white' : 'var(--pl-text-muted)',
                  border: `1px solid ${hometownFilter === ht.id ? ACCENT : 'var(--pl-border)'}`,
                }}
              >
                {ht.name}
              </button>
            ))}
          </div>

          <LightSectionCard title={`VARIABLE PAY — ${sorted.length} REPS`} accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Route', 'Base Salary', 'Variable Target', 'Earned', '% of Target', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(rep => {
                    const ratio = rep.variableEarned / rep.variableTarget;
                    const cfg = STATUS_CFG[rep.status as keyof typeof STATUS_CFG];
                    return (
                      <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{rep.routeId}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>$52,000</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>$18,000</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>${rep.variableEarned.toLocaleString()}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text)' }}>{(ratio * 100).toFixed(0)}%</td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Distribution */}
          <LightSectionCard title="PAYOUT RATIO DISTRIBUTION" accent={ACCENT}>
            <div className="flex gap-3 items-end h-24">
              {[
                { label: '<60%', count: REP_REWARDS.filter(r => r.attPct < 0.60).length, color: '#F87171' },
                { label: '60–75%', count: REP_REWARDS.filter(r => r.attPct >= 0.60 && r.attPct < 0.75).length, color: '#F87171' },
                { label: '75–90%', count: REP_REWARDS.filter(r => r.attPct >= 0.75 && r.attPct < 0.90).length, color: '#F59E0B' },
                { label: '90–100%', count: REP_REWARDS.filter(r => r.attPct >= 0.90 && r.attPct < 1.00).length, color: '#2563EB' },
                { label: '100–110%', count: REP_REWARDS.filter(r => r.attPct >= 1.00 && r.attPct < 1.10).length, color: '#22C55E' },
                { label: '110%+', count: REP_REWARDS.filter(r => r.attPct >= 1.10).length, color: '#22C55E' },
              ].map(b => {
                const maxCount = 12;
                const pctH = (b.count / maxCount) * 100;
                return (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-mono font-bold" style={{ color: b.color }}>{b.count}</div>
                    <div className="w-full rounded-t" style={{ height: `${pctH}%`, background: `${b.color}60`, minHeight: 4 }} />
                    <div className="text-[8px] font-mono text-center" style={{ color: 'var(--pl-text-faint)' }}>{b.label}</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── Commission Tab ── */}
      {activeTab === 'commission' && (
        <>
          {/* Rate Schedule */}
          <LightSectionCard title="COMMISSION RATE SCHEDULE" accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RATE_SCHEDULE.map(tier => (
                <div key={tier.tier} className="p-4 rounded-lg text-center"
                  style={{ background: `${TIER_COLORS[tier.tier]}12`, border: `1px solid ${TIER_COLORS[tier.tier]}30` }}>
                  <div className="text-[10px] font-bold font-mono uppercase mb-1" style={{ color: TIER_COLORS[tier.tier] }}>
                    T{tier.tier} — {tier.label}
                  </div>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: TIER_COLORS[tier.tier] }}>
                    ${tier.ratePerCase.toFixed(2)}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>per case</div>
                  <div className="text-[10px] font-mono mt-2" style={{ color: 'var(--pl-text-muted)' }}>
                    Attainment: {tier.range}
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Rep Commission Table */}
          <LightSectionCard title="REP COMMISSION — QTD" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Tier', 'Volume (Cases)', 'Rate/Case', 'Commission', 'QTD Total'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...REP_REWARDS].sort((a, b) => b.commissionEarned - a.commissionEarned).map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: `${TIER_COLORS[rep.tier]}18`, color: TIER_COLORS[rep.tier] }}>
                          T{rep.tier} {RATE_SCHEDULE.find(r => r.tier === rep.tier)?.label}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text)' }}>{rep.casesQTD.toLocaleString()}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text-muted)' }}>${rep.ratePerCase.toFixed(2)}</td>
                      <td className="py-1.5 pr-3 font-bold text-right" style={{ color: ACCENT }}>${rep.commissionEarned.toLocaleString()}</td>
                      <td className="py-1.5 font-bold text-right" style={{ color: ACCENT }}>${(rep.commissionEarned + rep.variableEarned).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Hometown Rollup */}
          <LightSectionCard title="HOMETOWN COMMISSION ROLLUP" accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {HOMETOWN_ROLLUP.map(ht => (
                <div key={ht.id} className="p-4 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-xs font-bold font-mono uppercase mb-2" style={{ color: 'var(--pl-text)' }}>{ht.name}</div>
                  <div className="text-xl font-bold font-mono" style={{ color: ACCENT }}>${ht.totalComm.toLocaleString()}</div>
                  <div className="text-[9px] font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>total commission · {ht.reps} reps</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Avg rate: ${ht.avgRate.toFixed(2)}/case</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Top: {ht.topEarner}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── Bonus Tab ── */}
      {activeTab === 'bonus' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Total Bonus Paid (QTD)" value={`$${(REP_REWARDS.reduce((s, r) => s + r.bonusEarned, 0)).toLocaleString()}`} accent={ACCENT} />
            <LightKpiCard label="Q1 Kicker Qualifiers" value={String(REP_REWARDS.filter(r => r.attPct >= 1.0).length)} accent={ACCENT} delta="of 36 reps" />
            <LightKpiCard label="Spirits Adder Total" value={`$${REP_REWARDS.reduce((s, r) => s + (r.spiritsAccounts >= 3 ? r.spiritsAccounts * 25 : 0), 0).toLocaleString()}`} accent={ACCENT} />
            <LightKpiCard label="Avg Bonus / Rep" value={`$${Math.round(REP_REWARDS.reduce((s, r) => s + r.bonusEarned, 0) / REP_REWARDS.length).toLocaleString()}`} accent={ACCENT} />
          </div>

          {/* Active Bonuses */}
          <LightSectionCard title="ACTIVE BONUS PROGRAMS" accent={ACCENT}>
            <div className="grid gap-3">
              {ACTIVE_BONUSES.map(bonus => {
                const qualifiers = bonus.threshold
                  ? REP_REWARDS.filter(r => r.attPct >= bonus.threshold!).length
                  : REP_REWARDS.filter(r => r.spiritsAccounts >= 3).length;
                return (
                  <div key={bonus.name} className="flex items-center gap-4 p-3 rounded-lg"
                    style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{bonus.name}</div>
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{bonus.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono" style={{ color: ACCENT }}>{qualifiers}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>qualifiers</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Payout Table */}
          <LightSectionCard title="BONUS PAYOUT TABLE" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Bonus Type', 'Qualification', 'Payout', 'Pay Date'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REP_REWARDS.filter(r => r.attPct >= 1.0 || r.spiritsAccounts >= 3).map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>
                        {rep.attPct >= 1.0 ? 'Q1 Volume Kicker' : 'Spirits Adder'}
                      </td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>EARNED</span>
                      </td>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>
                        ${rep.bonusEarned > 0 ? rep.bonusEarned.toLocaleString() : Math.round(rep.casesQTD * 0.40).toLocaleString()}
                      </td>
                      <td className="py-1.5" style={{ color: 'var(--pl-text-muted)' }}>Mar 28</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
```

- [ ] 2. Commit:

```bash
git add "app/(demos)/proofline-andrews/comp/mgmt/rewards/page.tsx"
git commit -m "feat(proofline): add Rewards module — Variable Pay/Commission/Bonus tabs (Act 5)"
```

---

### Task 9: Payments Module (`comp/mgmt/payments/page.tsx`)

**Files:**
- `app/(demos)/proofline-andrews/comp/mgmt/payments/page.tsx` — create new

**Steps:**

- [ ] 1. Create the file with complete page code:

```tsx
'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ACCENT = '#0EA5E9';

const PAY_CYCLES = [
  { label: 'Jan 1–15', date: 'Jan 17', status: 'deposited' },
  { label: 'Jan 16–31', date: 'Feb 3', status: 'deposited' },
  { label: 'Feb 1–15', date: 'Feb 17', status: 'deposited' },
  { label: 'Feb 16–28', date: 'Mar 3', status: 'deposited' },
  { label: 'Mar 1–15', date: 'Mar 17', status: 'current', current: true },
  { label: 'Mar 16–31', date: 'Mar 31', status: 'upcoming' },
  { label: 'Apr 1–15', date: 'Apr 17', status: 'upcoming' },
];

const PENDING_APPROVALS = [
  { id: 'PA-001', rep: 'Marcus Webb', type: 'Q1 Kicker Overage', amount: 2840, reason: 'Variable > $2,500 threshold — manager sign-off required', urgency: 'high' },
  { id: 'PA-002', rep: 'Priya Nair / Sofia Reyes', type: 'Split Credit Resolution', amount: 1260, reason: 'Split credit dispute resolved in both reps favor — retroactive credit', urgency: 'medium' },
  { id: 'PA-003', rep: 'James Park', type: 'New Hire Proration', amount: 980, reason: 'Feb 10 start date — proration applied. Controller review needed.', urgency: 'low' },
  { id: 'PA-004', rep: 'Elena Vargas', type: 'Spirits Adder Audit', amount: 375, reason: '15 new spirits accounts — 3 flagged for account age verification', urgency: 'medium' },
];

const PAYMENTS = [
  { date: 'Mar 3', rep: 'Marcus Webb', type: 'Variable', amount: 2210, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Marcus Webb', type: 'Base', amount: 4333, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Sofia Reyes', type: 'Variable', amount: 1840, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Sofia Reyes', type: 'Commission', amount: 3760, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Diego Santos', type: 'Variable', amount: 1620, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Priya Nair', type: 'Variable', amount: 2080, status: 'Deposited' },
  { date: 'Mar 3', rep: 'Priya Nair', type: 'Bonus', amount: 500, status: 'Deposited' },
  { date: 'Mar 17', rep: 'Marcus Webb', type: 'Variable', amount: 2840, status: 'Pending' },
  { date: 'Mar 17', rep: 'Marcus Webb', type: 'Base', amount: 4333, status: 'Pending' },
  { date: 'Mar 17', rep: 'Sofia Reyes', type: 'Commission', amount: 3920, status: 'Pending' },
  { date: 'Mar 17', rep: 'Elena Vargas', type: 'Variable', amount: 1780, status: 'Pending' },
  { date: 'Mar 17', rep: 'Elena Vargas', type: 'Bonus', amount: 375, status: 'Approved' },
  { date: 'Mar 17', rep: 'Raj Patel', type: 'Variable', amount: 1950, status: 'Pending' },
  { date: 'Mar 17', rep: 'Kenji Morales', type: 'Commission', amount: 2840, status: 'Approved' },
  { date: 'Mar 17', rep: 'Ana Lima', type: 'Variable', amount: 1640, status: 'Pending' },
  { date: 'Mar 17', rep: 'Carlos Reyes', type: 'Variable', amount: 1720, status: 'Pending' },
  { date: 'Mar 17', rep: 'James Park', type: 'Variable', amount: 980, status: 'Pending' },
  { date: 'Mar 28', rep: 'All Eligible Reps', type: 'Bonus', amount: 18400, status: 'Pending' },
  { date: 'Mar 31', rep: 'Marcus Webb', type: 'Commission', amount: 4280, status: 'Pending' },
  { date: 'Mar 31', rep: 'Sofia Reyes', type: 'Base', amount: 4333, status: 'Pending' },
];

const EXCEPTIONS = [
  { id: 'EX-017', rep: 'Tyler Brooks', issue: 'Negative clawback — account closed mid-quarter', amount: -340, resolution: 'Offset against next cycle' },
  { id: 'EX-018', rep: 'James Park', issue: 'New hire proration — start date Feb 10', amount: 980, resolution: 'Pending controller sign-off' },
  { id: 'EX-019', rep: 'Marcus Webb', issue: 'Overpayment flag — variable exceeded $2,500', amount: 2840, resolution: 'Pending manager approval' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Deposited: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' },
  Approved: { bg: 'rgba(37,99,235,0.1)', color: '#2563EB' },
  Pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  Held: { bg: 'rgba(248,113,113,0.1)', color: '#F87171' },
};

const URGENCY_STYLES: Record<string, { bg: string; color: string }> = {
  high: { bg: 'rgba(248,113,113,0.1)', color: '#F87171' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  low: { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8' },
};

export default function PaymentsPage() {
  const totalThisCycle = PAYMENTS.filter(p => p.date.startsWith('Mar 17')).reduce((s, p) => s + p.amount, 0);
  const pendingCount = PAYMENTS.filter(p => p.status === 'Pending').length;

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <LightKpiCard label="Current Cycle Payroll" value={`$${(totalThisCycle / 1000).toFixed(0)}K`} accent={ACCENT} />
        <LightKpiCard label="Pending Approvals" value={String(PENDING_APPROVALS.length)} accent={ACCENT} />
        <LightKpiCard label="Exceptions" value={String(EXCEPTIONS.length)} accent={ACCENT} />
        <LightKpiCard label="Next Deposit Date" value="Mar 17" accent={ACCENT} />
      </div>

      {/* Pay Cycle Timeline */}
      <LightSectionCard title="PAY CYCLE TIMELINE" accent={ACCENT}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PAY_CYCLES.map((cycle, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[90px] text-center"
              style={{
                background: cycle.current ? `${ACCENT}18` : 'var(--pl-card-alt)',
                border: `1px solid ${cycle.current ? ACCENT : 'var(--pl-border)'}`,
              }}>
              <div className="text-[9px] font-mono font-bold uppercase"
                style={{ color: cycle.current ? ACCENT : 'var(--pl-text-faint)' }}>
                {cycle.status === 'current' ? '▶ CURRENT' : cycle.status === 'deposited' ? '✓ PAID' : 'UPCOMING'}
              </div>
              <div className="text-[10px] font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{cycle.label}</div>
              <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Dep. {cycle.date}</div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Pending Approvals */}
      <LightSectionCard title="PENDING APPROVALS" accent={ACCENT}>
        <div className="grid gap-3">
          {PENDING_APPROVALS.map(item => {
            const urg = URGENCY_STYLES[item.urgency];
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                <div className="flex-shrink-0 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ background: urg.bg, color: urg.color }}>
                  {item.urgency.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{item.rep}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: ACCENT }}>${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] font-mono font-bold mb-0.5" style={{ color: 'var(--pl-text-muted)' }}>{item.type}</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{item.reason}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-2 py-1 rounded text-[9px] font-bold font-mono"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>
                    APPROVE
                  </button>
                  <button className="px-2 py-1 rounded text-[9px] font-bold font-mono"
                    style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>
                    FLAG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Payment Ledger */}
      <LightSectionCard title="PAYMENT LEDGER" accent={ACCENT}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Date', 'Rep', 'Type', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-[10px] uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((payment, i) => {
                const s = STATUS_STYLES[payment.status] ?? STATUS_STYLES['Pending'];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                    <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{payment.date}</td>
                    <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{payment.rep}</td>
                    <td className="py-1.5 pr-4" style={{ color: 'var(--pl-text-muted)' }}>{payment.type}</td>
                    <td className="py-1.5 pr-4 text-right font-bold" style={{ color: ACCENT }}>${payment.amount.toLocaleString()}</td>
                    <td className="py-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ background: s.bg, color: s.color }}>{payment.status.toUpperCase()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Exceptions */}
      <LightSectionCard title="PAYMENT EXCEPTIONS" accent={ACCENT}>
        <div className="grid gap-3">
          {EXCEPTIONS.map(ex => (
            <div key={ex.id} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <div className="flex-shrink-0 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>
                {ex.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{ex.rep}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: ex.amount < 0 ? '#F87171' : ACCENT }}>
                    {ex.amount < 0 ? '-' : ''}${Math.abs(ex.amount).toLocaleString()}
                  </span>
                </div>
                <div className="text-[10px] font-mono mb-0.5" style={{ color: 'var(--pl-text-muted)' }}>{ex.issue}</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Resolution: {ex.resolution}</div>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>
    </>
  );
}
```

- [ ] 2. Commit:

```bash
git add "app/(demos)/proofline-andrews/comp/mgmt/payments/page.tsx"
git commit -m "feat(proofline): add Payments module — cycle timeline, ledger, approvals, exceptions (Act 5)"
```

---

### Task 10: Reports Module (`comp/mgmt/reports/page.tsx`)

**Files:**
- `app/(demos)/proofline-andrews/comp/mgmt/reports/page.tsx` — create new

**Steps:**

- [ ] 1. Create the file with complete page code:

```tsx
'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS } from '@/data/proofline';

const ACCENT = '#0EA5E9';

const HOMETOWNS_LIST = [
  { id: 'sa', name: 'San Antonio', manager: 'Laura Mendez', quota: 2200000, revenue: 2354000, headcount: 6, status: 'on-track' },
  { id: 'austin', name: 'Austin', manager: 'Derek Walsh', quota: 1900000, revenue: 1862000, headcount: 6, status: 'watch' },
  { id: 'laredo', name: 'Laredo', manager: 'Carmen Torres', quota: 1600000, revenue: 1584000, headcount: 6, status: 'watch' },
  { id: 'victoria', name: 'Victoria', manager: 'Sam Patel', quota: 1400000, revenue: 1498000, headcount: 6, status: 'on-track' },
  { id: 'corpus', name: 'Corpus Christi', manager: 'Tanya Nguyen', quota: 1700000, revenue: 1564000, headcount: 6, status: 'behind' },
  { id: 'nb', name: 'New Braunfels', manager: 'Joe Castillo', quota: 1500000, revenue: 1545000, headcount: 6, status: 'on-track' },
];

const CLUB_TIERS = [
  { tier: 'Gold', label: 'Gold Club', threshold: 1.20, color: '#C6A052' },
  { tier: 'Silver', label: 'Silver Club', threshold: 1.10, color: '#94A3B8' },
  { tier: 'Bronze', label: 'Bronze Club', threshold: 1.05, color: '#92400E' },
];

const COACHING_RECS: Record<string, string[]> = {
  sa: [
    'Marcus is 4pp from T3 threshold — focus next 2 weeks on Corona display compliance in convenience accounts.',
    'SA Route 3 showing declining spirits penetration — push Tito\'s and High Noon bundle in on-premise chain accounts.',
  ],
  austin: [
    'Austin-2 rep at 87% — Modelo push in 3 remaining Whataburger accounts could close the gap.',
    'Import gate at 78% territory-wide — schedule joint sales call with Constellation rep for HEB chain accounts.',
  ],
  laredo: [
    'Territory is 1pp below gate threshold — 4 accounts close to ordering Heineken. Coordinate with brand rep.',
    'Spirits adder opportunity: 6 on-premise independents not yet carrying Tito\'s.',
  ],
  victoria: [
    'Victoria-4 is top T1 rep — consider nominating for Presidents Club pace board.',
    'Combined gate at 94% — strong momentum, maintain Corona + spirits mix.',
  ],
  corpus: [
    'Territory 8pp below quota — identify 5 chain accounts for immediate outreach.',
    'Core gate at 71% — below threshold. Priority: Miller Lite and Coors Light in convenience channel.',
  ],
  nb: [
    'New Braunfels on track — maintain current mix and focus on Presidents Club positioning.',
    'Spirits adder opportunity in 4 tourist corridor accounts near River Walk.',
  ],
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  'on-track': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'ON TRACK' },
  watch: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'WATCH' },
  behind: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'BEHIND' },
};

// Build leaderboard from SELLERS
const LEADERBOARD = [...SELLERS]
  .map(s => ({
    ...s,
    ytdAttainment: s.attainment * 0.85 + (Math.sin(s.id.charCodeAt(0) * 7) * 0.08),
    projectedAnnual: s.attainment * (1 + Math.sin(s.id.charCodeAt(0)) * 0.05),
  }))
  .sort((a, b) => b.ytdAttainment - a.ytdAttainment)
  .map((s, i) => ({
    ...s,
    rank: i + 1,
    clubTier: s.ytdAttainment >= 1.20 ? 'Gold' : s.ytdAttainment >= 1.10 ? 'Silver' : s.ytdAttainment >= 1.05 ? 'Bronze' : null,
  }));

const PAYMENT_HISTORY = [
  { period: 'Jan 1–15', base: 4333, variable: 1680, commission: 3240, bonus: 0 },
  { period: 'Jan 16–31', base: 4333, variable: 1820, commission: 3440, bonus: 0 },
  { period: 'Feb 1–15', base: 4333, variable: 2040, commission: 3600, bonus: 500 },
  { period: 'Feb 16–28', base: 4333, variable: 2100, commission: 3720, bonus: 0 },
  { period: 'Mar 1–15', base: 4333, variable: 2210, commission: 3840, bonus: 0 },
  { period: 'Mar 16–31', base: 4333, variable: 2840, commission: 4280, bonus: 0 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'executive' | 'club' | 'rep' | 'manager' | 'district'>('executive');
  const [selectedRep, setSelectedRep] = useState(SELLERS[0].id);
  const [selectedHometown, setSelectedHometown] = useState(HOMETOWNS_LIST[0].id);
  const [expandedHometown, setExpandedHometown] = useState<string | null>(null);

  const tabs = [
    { key: 'executive', label: 'Executive' },
    { key: 'club', label: 'Presidents Club' },
    { key: 'rep', label: 'Sales Rep' },
    { key: 'manager', label: 'Sales Manager' },
    { key: 'district', label: 'District Manager' },
  ] as const;

  const rep = SELLERS.find(s => s.id === selectedRep) ?? SELLERS[0];
  const ht = HOMETOWNS_LIST.find(h => h.id === selectedHometown) ?? HOMETOWNS_LIST[0];
  const htReps = SELLERS.filter(s => s.hometown === selectedHometown);

  const totalRevenue = HOMETOWNS_LIST.reduce((s, h) => s + h.revenue, 0);
  const totalQuota = HOMETOWNS_LIST.reduce((s, h) => s + h.quota, 0);
  const overallAttainment = totalRevenue / totalQuota;
  const totalCompExpense = SELLERS.length * (52000 / 4 + 4200 + 2800);

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6 overflow-x-auto" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex-shrink-0 px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === t.key ? ACCENT : 'var(--pl-text-muted)',
              borderBottom: activeTab === t.key ? `2px solid ${ACCENT}` : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Executive Tab ── */}
      {activeTab === 'executive' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <LightKpiCard label="Total Revenue" value={`$${(totalRevenue / 1000000).toFixed(2)}M`} accent={ACCENT} />
            <LightKpiCard label="Overall Attainment" value={`${(overallAttainment * 100).toFixed(1)}%`} accent={ACCENT} />
            <LightKpiCard label="Total Comp Expense (QTD)" value={`$${(totalCompExpense / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="Comp-to-Revenue Ratio" value={`${((totalCompExpense / totalRevenue) * 100).toFixed(1)}%`} accent={ACCENT} />
            <LightKpiCard label="Headcount" value="36 reps" accent={ACCENT} delta="6 managers" />
          </div>

          {/* Hometown Performance */}
          <LightSectionCard title="HOMETOWN PERFORMANCE" accent={ACCENT}>
            <div className="grid gap-3">
              {HOMETOWNS_LIST.map(hometown => {
                const att = hometown.revenue / hometown.quota;
                const s = STATUS_STYLES[hometown.status];
                const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                return (
                  <div key={hometown.id} className="flex items-center gap-4">
                    <div className="w-28 text-[10px] font-bold font-mono flex-shrink-0" style={{ color: 'var(--pl-text)' }}>
                      {hometown.name}
                    </div>
                    <div className="flex-1 relative h-6 rounded overflow-hidden"
                      style={{ background: 'var(--pl-chart-bar-track)' }}>
                      <div className="absolute top-0 left-0 h-full rounded"
                        style={{ width: `${Math.min(att * 100, 100)}%`, background: `${barColor}80` }} />
                      <div className="absolute inset-0 flex items-center px-2 text-[10px] font-bold font-mono"
                        style={{ color: 'var(--pl-text)' }}>
                        {(att * 100).toFixed(1)}% · ${(hometown.revenue / 1000000).toFixed(2)}M
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{ background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Top / Bottom Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LightSectionCard title="TOP 5 PERFORMERS" accent={ACCENT}>
              <div className="grid gap-2">
                {LEADERBOARD.slice(0, 5).map((seller, i) => (
                  <div key={seller.id} className="flex items-center gap-3">
                    <div className="text-sm font-bold font-mono w-5 text-center flex-shrink-0" style={{ color: ACCENT }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{seller.hometown}</div>
                    </div>
                    <div className="text-xs font-bold font-mono" style={{ color: '#22C55E' }}>
                      {(seller.ytdAttainment * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </LightSectionCard>

            <LightSectionCard title="BOTTOM 5 PERFORMERS" accent={ACCENT}>
              <div className="grid gap-2">
                {LEADERBOARD.slice(-5).reverse().map((seller, i) => (
                  <div key={seller.id} className="flex items-center gap-3">
                    <div className="text-sm font-bold font-mono w-5 text-center flex-shrink-0" style={{ color: '#F87171' }}>
                      {LEADERBOARD.length - i}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{seller.name}</div>
                      <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{seller.hometown}</div>
                    </div>
                    <div className="text-xs font-bold font-mono" style={{ color: '#F87171' }}>
                      {(seller.ytdAttainment * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </LightSectionCard>
          </div>

          {/* Comp Expense Breakdown */}
          <LightSectionCard title="COMP EXPENSE BREAKDOWN (QTD)" accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Base Salary', amount: 36 * (52000 / 4), color: '#94A3B8', pct: 45 },
                { label: 'Variable Pay', amount: 36 * 4200, color: ACCENT, pct: 28 },
                { label: 'Commission', amount: 36 * 3600, color: '#2563EB', pct: 19 },
                { label: 'Bonus', amount: 36 * 820, color: '#22C55E', pct: 8 },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg text-center"
                  style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-[10px] font-bold font-mono uppercase mb-1" style={{ color: item.color }}>
                    {item.label}
                  </div>
                  <div className="text-lg font-bold font-mono" style={{ color: item.color }}>
                    {item.pct}%
                  </div>
                  <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
                    ${(item.amount / 1000).toFixed(0)}K
                  </div>
                  <div className="mt-2 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--pl-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── Presidents Club Tab ── */}
      {activeTab === 'club' && (
        <>
          {/* Tiers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {CLUB_TIERS.map(tier => {
              const qualifiers = LEADERBOARD.filter(s => s.ytdAttainment >= tier.threshold).length;
              return (
                <div key={tier.tier} className="p-4 rounded-lg text-center"
                  style={{ background: `${tier.color}10`, border: `1px solid ${tier.color}30` }}>
                  <div className="text-xs font-bold font-mono uppercase mb-2" style={{ color: tier.color }}>
                    {tier.label}
                  </div>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: tier.color }}>
                    {qualifiers}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                    current qualifiers · ≥{(tier.threshold * 100).toFixed(0)}% YTD
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Days Remaining" value="296" accent={ACCENT} delta="in 2026 selling year" />
            <LightKpiCard label="Current Qualifiers" value={String(LEADERBOARD.filter(s => s.ytdAttainment >= 1.05).length)} accent={ACCENT} />
            <LightKpiCard label="Projected Qualifiers" value={String(LEADERBOARD.filter(s => s.projectedAnnual >= 1.05).length)} accent={ACCENT} />
            <LightKpiCard label="Club Threshold" value="105% YTD" accent={ACCENT} />
          </div>

          {/* Leaderboard */}
          <LightSectionCard title="PRESIDENTS CLUB LEADERBOARD" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rank', 'Rep', 'Hometown', 'YTD Att.', 'Proj. Annual', 'Club Tier', 'Trend'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map(seller => {
                    const clubTierData = CLUB_TIERS.find(t => t.tier === seller.clubTier);
                    const onPace = seller.projectedAnnual >= 1.05;
                    return (
                      <tr key={seller.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 text-center font-bold" style={{ color: ACCENT }}>{seller.rank}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{seller.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{seller.hometown}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: seller.ytdAttainment >= 1.05 ? '#22C55E' : seller.ytdAttainment >= 0.90 ? '#F59E0B' : '#F87171' }}>
                          {(seller.ytdAttainment * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>
                          {(seller.projectedAnnual * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 pr-3">
                          {clubTierData ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                              style={{ background: `${clubTierData.color}18`, color: clubTierData.color }}>
                              {clubTierData.label}
                            </span>
                          ) : (
                            <span className="text-[9px]" style={{ color: 'var(--pl-text-faint)' }}>—</span>
                          )}
                        </td>
                        <td className="py-1.5">
                          <span className="text-[9px] font-mono" style={{ color: onPace ? '#22C55E' : '#F59E0B' }}>
                            {onPace ? '▲ On Pace' : '▼ Needs push'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Historical */}
          <LightSectionCard title="HISTORICAL CONTEXT — 2025" accent={ACCENT}>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>11</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Qualifiers</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>108.4%</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Avg Attainment (qualifiers)</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono mb-1" style={{ color: ACCENT }}>Marcus Webb</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>2025 Top Earner · 127.3%</div>
              </div>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── Sales Rep Tab ── */}
      {activeTab === 'rep' && (
        <>
          {/* Rep Selector */}
          <div className="mb-6">
            <label className="text-[10px] font-bold font-mono uppercase mb-2 block" style={{ color: 'var(--pl-text-muted)' }}>
              Select Rep
            </label>
            <select
              value={selectedRep}
              onChange={e => setSelectedRep(e.target.value)}
              className="px-3 py-2 rounded text-xs font-mono"
              style={{
                background: 'var(--pl-card-alt)',
                border: '1px solid var(--pl-border)',
                color: 'var(--pl-text)',
              }}
            >
              {SELLERS.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.hometown}</option>
              ))}
            </select>
          </div>

          {/* Earnings Summary */}
          <LightSectionCard title={`EARNINGS SUMMARY — ${rep.name.toUpperCase()}`} accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Base (QTD)', value: '$13,000' },
                { label: 'Variable', value: `$${(rep.attainment * 4200).toFixed(0)}` },
                { label: 'Commission', value: `$${(rep.attainment * 3600).toFixed(0)}` },
                { label: 'Bonus', value: rep.spiritsAccounts >= 3 ? `$${rep.spiritsAccounts * 25}` : '$0' },
                { label: 'Total QTD', value: `$${(13000 + rep.attainment * 4200 + rep.attainment * 3600 + (rep.spiritsAccounts >= 3 ? rep.spiritsAccounts * 25 : 0)).toFixed(0)}` },
              ].map(item => (
                <LightKpiCard key={item.label} label={item.label} value={item.value} accent={ACCENT} />
              ))}
            </div>
          </LightSectionCard>

          {/* Attainment Trend (13-week) */}
          <LightSectionCard title="13-WEEK ATTAINMENT TREND" accent={ACCENT}>
            <div className="h-24 flex items-end gap-1">
              {rep.weeklyAttainment.map((val, i) => {
                const pctH = Math.min(val * 100, 130);
                const color = val >= 1.0 ? '#22C55E' : val >= 0.85 ? '#F59E0B' : '#F87171';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t transition-all"
                      style={{ height: `${pctH * 0.7}%`, background: `${color}80`, minHeight: 4 }} />
                    <div className="text-[7px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>W{i + 1}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>
              <span>Week 1</span>
              <span>Current attainment: {(rep.attainment * 100).toFixed(1)}%</span>
              <span>Week 13</span>
            </div>
          </LightSectionCard>

          {/* Gate Status */}
          <LightSectionCard title="GATE STATUS" accent={ACCENT}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Core', value: rep.emcoGates.core, threshold: 0.75, color: '#2563EB' },
                { name: 'Import', value: rep.emcoGates.import, threshold: 0.80, color: '#7C3AED' },
                { name: 'Emerging', value: rep.emcoGates.emerging, threshold: 0.70, color: '#F59E0B' },
                { name: 'Combined', value: rep.emcoGates.combined, threshold: 0.85, color: ACCENT },
              ].map(gate => {
                const pctVal = Math.min(gate.value * 100, 100);
                const unlocked = gate.value >= gate.threshold;
                const gateColor = unlocked ? '#22C55E' : gate.value >= gate.threshold * 0.9 ? '#F59E0B' : gate.color;
                return (
                  <div key={gate.name} className="p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{gate.name}</span>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: unlocked ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', color: unlocked ? '#22C55E' : '#F87171' }}>
                        {unlocked ? '✓ UNLOCKED' : '✗ LOCKED'}
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden mb-1" style={{ height: 8, background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pctVal}%`, background: gateColor }} />
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                      {(gate.value * 100).toFixed(0)}% / {(gate.threshold * 100).toFixed(0)}% threshold
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* Payment History */}
          <LightSectionCard title="PAYMENT HISTORY — LAST 6 PAY PERIODS" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Period', 'Base', 'Variable', 'Commission', 'Bonus', 'Total'].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((row, i) => {
                    const total = row.base + row.variable + row.commission + row.bonus;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-4 font-bold" style={{ color: 'var(--pl-text)' }}>{row.period}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text-muted)' }}>${row.base.toLocaleString()}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text-muted)' }}>${row.variable.toLocaleString()}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: 'var(--pl-text-muted)' }}>${row.commission.toLocaleString()}</td>
                        <td className="py-1.5 pr-4 text-right" style={{ color: row.bonus > 0 ? '#22C55E' : 'var(--pl-text-faint)' }}>
                          {row.bonus > 0 ? `$${row.bonus.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-1.5 text-right font-bold" style={{ color: ACCENT }}>${total.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── Sales Manager Tab ── */}
      {activeTab === 'manager' && (
        <>
          {/* Hometown Selector */}
          <div className="flex gap-2 flex-wrap mb-6">
            {HOMETOWNS_LIST.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedHometown(h.id)}
                className="px-3 py-1.5 rounded text-[10px] font-bold font-mono uppercase transition-colors"
                style={{
                  background: selectedHometown === h.id ? ACCENT : 'var(--pl-card-alt)',
                  color: selectedHometown === h.id ? 'white' : 'var(--pl-text-muted)',
                  border: `1px solid ${selectedHometown === h.id ? ACCENT : 'var(--pl-border)'}`,
                }}
              >
                {h.name}
              </button>
            ))}
          </div>

          {/* Team KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Avg Attainment" value={`${(htReps.reduce((s, r) => s + r.attainment, 0) / (htReps.length || 1) * 100).toFixed(1)}%`} accent={ACCENT} />
            <LightKpiCard label="Total Comp Expense" value={`$${(htReps.length * 7020 / 1000).toFixed(0)}K`} accent={ACCENT} />
            <LightKpiCard label="At-Risk Reps" value={String(htReps.filter(r => r.atRisk).length)} accent={ACCENT} />
            <LightKpiCard label="Full Gate %" value={`${Math.round(htReps.filter(r => r.emcoGates.combined >= 0.85).length / (htReps.length || 1) * 100)}%`} accent={ACCENT} />
          </div>

          {/* Rep Grid */}
          <LightSectionCard title={`${ht.name.toUpperCase()} TEAM — MANAGER: ${ht.manager.toUpperCase()}`} accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Attainment', 'Tier', 'Gates Unlocked', 'Earned vs Target', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {htReps.map(r => {
                    const gatesUnlocked = [r.emcoGates.core >= 0.75, r.emcoGates.import >= 0.80, r.emcoGates.emerging >= 0.70, r.emcoGates.combined >= 0.85].filter(Boolean).length;
                    const statusColor = r.attainment >= 1.0 ? '#22C55E' : r.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                    const statusLabel = r.attainment >= 1.0 ? 'ON TARGET' : r.attainment >= 0.85 ? 'AT RISK' : 'BELOW';
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{r.name}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: statusColor }}>
                          {(r.attainment * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 pr-3">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: `rgba(14,165,233,0.1)`, color: ACCENT }}>T{r.tier}</span>
                        </td>
                        <td className="py-1.5 pr-3 text-center">
                          <span className="font-bold" style={{ color: gatesUnlocked === 4 ? '#22C55E' : gatesUnlocked >= 2 ? '#F59E0B' : '#F87171' }}>
                            {gatesUnlocked}/4
                          </span>
                        </td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>
                          ${Math.round(r.attainment * 4200).toLocaleString()} / $4,200
                        </td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: `${statusColor}18`, color: statusColor }}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Coaching Recs */}
          <LightSectionCard title="COACHING RECOMMENDATIONS" accent={ACCENT}>
            <div className="grid gap-3">
              {(COACHING_RECS[selectedHometown] ?? COACHING_RECS['sa']).map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg"
                  style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}>
                  <div className="flex-shrink-0 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${ACCENT}20`, color: ACCENT }}>AI</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text)' }}>{rec}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* Budget Tracker */}
          <LightSectionCard title="COMP BUDGET TRACKER" accent={ACCENT}>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: 'var(--pl-text-muted)' }}>
                  ${(htReps.length * 9800).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Budget Allocated (Q1)</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: ACCENT }}>
                  ${(htReps.length * 7020).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Spent to Date</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: '#22C55E' }}>
                  ${(htReps.length * 9800 - htReps.length * 7020).toLocaleString()}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Remaining</div>
              </div>
            </div>
            <div className="mt-3 rounded-full overflow-hidden" style={{ height: 8, background: 'var(--pl-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: `${(7020 / 9800) * 100}%`, background: ACCENT }} />
            </div>
            <div className="text-[10px] font-mono mt-1 text-right" style={{ color: 'var(--pl-text-faint)' }}>
              71.6% of budget used · Projected EOQ: ${(htReps.length * 9800 * 1.02).toLocaleString()}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* ── District Manager Tab ── */}
      {activeTab === 'district' && (
        <>
          {/* 6 Hometown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {HOMETOWNS_LIST.map(hometown => {
              const htRepsLocal = SELLERS.filter(s => s.hometown === hometown.id);
              const avgAtt = htRepsLocal.reduce((s, r) => s + r.attainment, 0) / (htRepsLocal.length || 1);
              const topRep = [...htRepsLocal].sort((a, b) => b.attainment - a.attainment)[0];
              const att = hometown.revenue / hometown.quota;
              const barColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
              const s = STATUS_STYLES[hometown.status];
              const isExpanded = expandedHometown === hometown.id;

              return (
                <div key={hometown.id} className="rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${isExpanded ? ACCENT : 'var(--pl-border)'}` }}>
                  <button
                    className="w-full p-4 text-left"
                    style={{ background: isExpanded ? `${ACCENT}08` : 'var(--pl-card-alt)' }}
                    onClick={() => setExpandedHometown(isExpanded ? null : hometown.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.name}</div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Mgr: {hometown.manager}</div>
                      </div>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>

                    <div className="rounded-full overflow-hidden mb-1" style={{ height: 6, background: 'var(--pl-chart-bar-track)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(att * 100, 100)}%`, background: barColor }} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Revenue vs Quota</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: barColor }}>
                          ${(hometown.revenue / 1000000).toFixed(2)}M / ${(hometown.quota / 1000000).toFixed(2)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Avg Attainment</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: barColor }}>{(avgAtt * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Headcount</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{hometown.headcount} reps</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>Top Performer</div>
                        <div className="text-[10px] font-bold font-mono" style={{ color: '#22C55E' }}>
                          {topRep ? `${topRep.name.split(' ')[0]} ${(topRep.attainment * 100).toFixed(0)}%` : '—'}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded rep breakdown */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${ACCENT}20` }}>
                      <div className="text-[9px] font-bold font-mono uppercase mb-2" style={{ color: ACCENT }}>Rep Breakdown</div>
                      <div className="grid gap-1.5">
                        {[...htRepsLocal].sort((a, b) => b.attainment - a.attainment).map(r => {
                          const rColor = r.attainment >= 1.0 ? '#22C55E' : r.attainment >= 0.85 ? '#F59E0B' : '#F87171';
                          return (
                            <div key={r.id} className="flex items-center gap-2">
                              <div className="flex-1 text-[10px] font-mono" style={{ color: 'var(--pl-text)' }}>{r.name}</div>
                              <div className="text-[10px] font-bold font-mono" style={{ color: rColor }}>
                                {(r.attainment * 100).toFixed(0)}%
                              </div>
                              <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>T{r.tier}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <LightSectionCard title="DISTRICT COMPARISON TABLE" accent={ACCENT}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Hometown', 'Manager', 'Headcount', 'Revenue', 'Quota', 'Attainment', 'Avg Att. %', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOMETOWNS_LIST.map(hometown => {
                    const htRepsLocal = SELLERS.filter(s => s.hometown === hometown.id);
                    const avgAtt = htRepsLocal.reduce((s, r) => s + r.attainment, 0) / (htRepsLocal.length || 1);
                    const att = hometown.revenue / hometown.quota;
                    const attColor = att >= 1.0 ? '#22C55E' : att >= 0.90 ? '#F59E0B' : '#F87171';
                    const s = STATUS_STYLES[hometown.status];
                    return (
                      <tr key={hometown.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{hometown.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{hometown.manager}</td>
                        <td className="py-1.5 pr-3 text-center" style={{ color: 'var(--pl-text)' }}>{hometown.headcount}</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>${(hometown.revenue / 1000000).toFixed(2)}M</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>${(hometown.quota / 1000000).toFixed(2)}M</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: attColor }}>{(att * 100).toFixed(1)}%</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{(avgAtt * 100).toFixed(1)}%</td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                            style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
```

- [ ] 2. Commit:

```bash
git add "app/(demos)/proofline-andrews/comp/mgmt/reports/page.tsx"
git commit -m "feat(proofline): add Reports module — Executive/Club/Rep/Manager/District tabs (Act 5)"
```

---

## Chunk 4: Cleanup (Task 11)

### Task 11: Delete Old Files + Verification

**Files to delete:**
- `app/(demos)/proofline-andrews/comp/emco/page.tsx`
- `app/(demos)/proofline-andrews/comp/visibility/page.tsx`
- `app/(demos)/proofline-andrews/comp/inquiries/page.tsx`

**Steps:**

- [ ] 1. Verify new module pages exist and typecheck passes before deleting:

```bash
npx tsc --noEmit
```

- [ ] 2. Grep for any remaining references to old routes in config or components:

```bash
grep -r "comp/emco\|comp/visibility\|comp/inquiries" app/ components/ data/ --include="*.tsx" --include="*.ts" -l
```

- [ ] 3. If typecheck is green and no stray references to old files are found in active code (only in deleted files themselves), delete:

```bash
git rm "app/(demos)/proofline-andrews/comp/emco/page.tsx"
git rm "app/(demos)/proofline-andrews/comp/visibility/page.tsx"
git rm "app/(demos)/proofline-andrews/comp/inquiries/page.tsx"
```

- [ ] 4. Verify the demo.config.ts and ActNavigation.tsx no longer reference old routes (these should have been updated in Task 3 / Task 4 from Chunks 1-2):

```bash
grep -r "comp/emco\|comp/visibility\|/comp/inquiries" app/(demos)/proofline-andrews/demo.config.ts components/demos/proofline/ActNavigation.tsx
```

  Expected: no matches (old routes removed in Chunk 1 Task 3).

- [ ] 5. Final typecheck + commit:

```bash
npx tsc --noEmit
git commit -m "chore(proofline): delete old comp/emco, comp/visibility, comp/inquiries pages — content absorbed into Act 5 modules"
```

- [ ] 6. Push and open PR:

```bash
git push -u origin <branch-name>
gh pr create --title "feat(proofline): Act 5 Sales Comp Management — 6 ICM modules + collapsible sidebar" \
  --body "$(cat <<'EOF'
## Summary

- Adds Act 5 (Sales Comp Management) with 6 ICM modules: Data, Measurements, Rewards, Payments, Inquiries, Reports
- Restructures Act 4 nav from 8 items to 5 (removes EMCO/Visibility/Inquiries, absorbed into Act 5)
- DemoShell gets collapsible nav sections with localStorage persistence and active-route auto-expand
- All pages use \`--pl-*\` CSS vars, Act 5 accent \`#0EA5E9\`, \`ActNavigation currentAct={5}\`
- Mock data only — no real APIs

## Test plan
- [ ] Visit each Act 5 module and verify all tabs render without errors
- [ ] Confirm collapsible sidebar toggles and persists to localStorage
- [ ] Run \`npx tsc --noEmit\` — zero errors
- [ ] Confirm old routes (\`/comp/emco\`, \`/comp/visibility\`, \`/comp/inquiries\`) 404 (pages deleted)
- [ ] Confirm Act 4 still shows 5 nav items with green accent
- [ ] Confirm Act 5 shows 6 nav items with sky blue accent
EOF
)"
```
