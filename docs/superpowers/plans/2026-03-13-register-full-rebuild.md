# REGISTER Demo — Full Rebuild Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the REGISTER demo (Summit Sleep Co.) from 41 pages across 6 acts to a tight 22-page, 5-act pitch-ready experience targeting Mattress Firm as a client.

**Architecture:** All pages share a unified design system via `RegisterThemeProvider` (CSS custom properties, Space Grotesk, dark/light mode). Three shared components — `RegisterPage` (wrapper), `AIInsightCard` (purple advisory), `ThemeProvider` — are composed into every page. The POS Terminal opens in a `TabletFrame` iPad simulator (shared from PROOFLINE). Manager ↔ POS communication uses the existing `lib/register-broadcast.ts` BroadcastChannel.

**Tech Stack:** Next.js 16 (App Router, static export), TypeScript, Tailwind CSS, lucide-react icons, SWIC engine (lib/swic-engine/), BroadcastChannel API, CSS custom properties for theming.

**Spec:** `docs/superpowers/specs/2026-03-13-register-full-rebuild-design.md`

---

## File Structure

### New Files to Create

| File | Responsibility |
|------|----------------|
| `components/demos/register/ThemeProvider.tsx` | Dark/light CSS vars, Space Grotesk, localStorage, font size |
| `components/demos/register/RegisterPage.tsx` | Page wrapper: theme toggle, Aa +/-, title bar, children slot |
| `components/demos/register/AIInsightCard.tsx` | Purple advisory card: Sparkles icon, label, text, action button |
| `components/demos/register/pos/ShowroomCatalog.tsx` | Product catalog with category filters, SPIFF badges |
| `components/demos/register/pos/SaleTicket.tsx` | Sale line items, quantity, discounts, AI upsell slot |
| `components/demos/register/pos/CommissionMini.tsx` | Always-visible mini commission preview |
| `components/demos/register/pos/RewardsPanel.tsx` | Tier staircase, SWIC engine calc, SPIFFs, earnings |
| `components/demos/register/pos/CloseSaleFlow.tsx` | Payment selection, D365 event generation |
| `components/demos/register/pos/D365EventLog.tsx` | Scrollable D365 event log |
| `components/demos/register/pos/BundleBuilder.tsx` | Bundle detection (mattress + base) |
| `data/register/summit-sleep.ts` | Unified ClientConfig, 20-item catalog, reps, store context |
| `data/register/ai-insights.ts` | Centralized AI insight text for all 22 pages |
| `lib/register-d365-adapter.ts` | D365 mock adapter (rebranded from mattress-firm) |
| 22 page files | See tasks below |

### Files to Modify

| File | Change |
|------|--------|
| `app/(demos)/register/demo.config.ts` | Replace 6-act/41-page nav with 5-act/22-page nav |
| `app/(demos)/register/page.tsx` | Redirect to `/register/corp/overview` |
| `app/(demos)/register/layout.tsx` | Wrap with `RegisterThemeProvider` |

### Files to Delete

| Category | Path |
|----------|------|
| MF pages | `app/(demos)/register/ops/mattress-firm/` (entire dir) |
| MF components | `components/demos/register/mattress-firm/` (entire dir) |
| MF data | `data/register/mattress-firm.ts` |
| MF libs | `lib/mattress-firm-broadcast.ts`, `lib/mattress-firm-d365-adapter.ts` |
| Planning data | `data/register/planning-data.ts` |
| Cut pages | `register/ops/pos/`, `register/ops/customer/`, `register/ops/inventory/`, `register/ops/rep-assessment/`, `register/comp/measurements/`, `register/comp/payouts/`, `register/comp/disputes/`, `register/comp/reports/`, `register/planning/` (entire dir), `register/platform/architecture/`, `register/platform/varicent/` |

---

## Chunk 1: Foundation

### Task 1: Create RegisterThemeProvider

**Files:**
- Create: `components/demos/register/ThemeProvider.tsx`

This is the design system foundation. Every page depends on it.

- [ ] **Step 1: Create ThemeProvider component**

```tsx
// components/demos/register/ThemeProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  fontSize: 16,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function useRegisterTheme() {
  return useContext(ThemeContext);
}

const LIGHT_TOKENS: Record<string, string> = {
  '--register-bg': '#F8FAFC',
  '--register-bg-elevated': '#FFFFFF',
  '--register-bg-surface': '#F1F5F9',
  '--register-border': '#E2E8F0',
  '--register-text': '#0F172A',
  '--register-text-muted': '#64748B',
  '--register-text-dim': '#94A3B8',
};

const DARK_TOKENS: Record<string, string> = {
  '--register-bg': '#0F0E1A',
  '--register-bg-elevated': '#1A1830',
  '--register-bg-surface': '#1E1B4B',
  '--register-border': '#312E5C',
  '--register-text': '#E2E8F0',
  '--register-text-muted': '#94A3B8',
  '--register-text-dim': '#64748B',
};

const SHARED_TOKENS: Record<string, string> = {
  '--register-primary': '#1E3A5F',
  '--register-accent': '#06B6D4',
  '--register-ai': '#8B5CF6',
  '--register-success': '#10B981',
  '--register-warning': '#F59E0B',
  '--register-danger': '#EF4444',
};

export function RegisterThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('register-theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') setTheme(saved);
    const savedSize = localStorage.getItem('register-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
    const root = document.documentElement;
    for (const [key, value] of Object.entries({ ...tokens, ...SHARED_TOKENS })) {
      root.style.setProperty(key, value);
    }
    localStorage.setItem('register-theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('register-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((s) => Math.min(s + 2, 24));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((s) => Math.max(s - 2, 12));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}>
      <div className={`${spaceGrotesk.variable} font-sans`} style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors related to ThemeProvider

- [ ] **Step 3: Commit**

```bash
git add components/demos/register/ThemeProvider.tsx
git commit -m "feat(register): add RegisterThemeProvider with dark/light mode + font controls"
```

---

### Task 2: Create RegisterPage wrapper

**Files:**
- Create: `components/demos/register/RegisterPage.tsx`
- Depends on: Task 1 (ThemeProvider)

- [ ] **Step 1: Create RegisterPage component**

```tsx
// components/demos/register/RegisterPage.tsx
'use client';

import { Sun, Moon, Type } from 'lucide-react';
import { useRegisterTheme } from './ThemeProvider';

interface RegisterPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function RegisterPage({ children, title, subtitle, accentColor }: RegisterPageProps) {
  const { theme, toggleTheme, increaseFontSize, decreaseFontSize } = useRegisterTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--register-bg)',
        color: 'var(--register-text)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--register-border)',
          background: 'var(--register-bg-elevated)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: 0,
              borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
              paddingLeft: accentColor ? '12px' : undefined,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Font size controls */}
          <button
            onClick={decreaseFontSize}
            style={{
              background: 'var(--register-bg-surface)',
              border: '1px solid var(--register-border)',
              borderRadius: 6,
              padding: '4px 8px',
              color: 'var(--register-text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
            title="Decrease font size"
          >
            Aa-
          </button>
          <button
            onClick={increaseFontSize}
            style={{
              background: 'var(--register-bg-surface)',
              border: '1px solid var(--register-border)',
              borderRadius: 6,
              padding: '4px 8px',
              color: 'var(--register-text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
            title="Increase font size"
          >
            Aa+
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--register-bg-surface)',
              border: '1px solid var(--register-border)',
              borderRadius: 6,
              padding: '6px',
              color: 'var(--register-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/demos/register/RegisterPage.tsx
git commit -m "feat(register): add RegisterPage wrapper with header controls"
```

---

### Task 3: Create AIInsightCard

**Files:**
- Create: `components/demos/register/AIInsightCard.tsx`

- [ ] **Step 1: Create AIInsightCard component**

```tsx
// components/demos/register/AIInsightCard.tsx
'use client';

import { Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  children: React.ReactNode;
  label?: string;
  action?: { label: string; onClick: () => void };
  compact?: boolean;
}

export function AIInsightCard({ children, label = 'AI Insight', action, compact }: AIInsightCardProps) {
  return (
    <div
      style={{
        padding: compact ? '10px 14px' : '16px 20px',
        borderRadius: 12,
        background: 'rgba(139, 92, 246, 0.08)',
        borderLeft: '3px solid',
        borderImage: 'linear-gradient(to bottom, #8B5CF6, #6366F1) 1',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Sparkles size={compact ? 16 : 20} color="#8B5CF6" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#A78BFA',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: compact ? '0.8rem' : '0.875rem', color: 'var(--register-text)' }}>
          {children}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: '#8B5CF6',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -10
git add components/demos/register/AIInsightCard.tsx
git commit -m "feat(register): add AIInsightCard purple advisory component"
```

---

### Task 4: Create data files (summit-sleep.ts + ai-insights.ts)

**Files:**
- Create: `data/register/summit-sleep.ts`
- Create: `data/register/ai-insights.ts`

- [ ] **Step 1: Create summit-sleep.ts (ClientConfig + catalog)**

Create `data/register/summit-sleep.ts` with:
- `SUMMIT_SLEEP_CONFIG: ClientConfig` — copy structure from `mattress-firm.ts` but rebrand to Summit Sleep, keep component IDs, adjust theme colors to match spec tokens
- `CATALOG` — 20 items across 5 categories (Mattress, Adjustable Base, Accessory, Protection Plan, Delivery)
- `STORE_CONTEXT` — Summit Sleep D365 store context
- `REP_PROFILES` — 5 reps for floor display (reuse 3 from coaching-data, add 2 more)
- `PERIOD` — current commission period

Key: The ClientConfig reuses the same SWIC engine component IDs (`base-comm`, `spiff`, `bundle-accel`, etc.) so the existing SWIC calculator works without changes.

- [ ] **Step 2: Create ai-insights.ts**

Create `data/register/ai-insights.ts` with a `Record<string, { text: string; label?: string }>` keyed by route slug:

```tsx
// data/register/ai-insights.ts

export interface AIInsight {
  text: string;
  label?: string; // defaults to "AI Insight"
  actionLabel?: string;
}

export const AI_INSIGHTS: Record<string, AIInsight> = {
  'corp/overview': {
    text: '3 underperforming stores identified — recommend format conversion to Outlet for Store #47, #112, #189. Projected +$2.1M annual revenue.',
  },
  'corp/portfolio': {
    text: 'Outlet stores within 5mi of Flagship locations cannibalize 12% revenue. Consider territory-based pricing differentiation.',
  },
  'corp/seasonal': {
    text: "Presidents' Day weekend projected +22% traffic. Recommend activating Adjustable Base SPIFF 48 hours early to maximize attach rate.",
  },
  'strategy/districts': {
    text: 'Recommend realigning District 7 — Stores #88 and #91 are geographically closer to District 4 and share the same customer demographic.',
  },
  'strategy/mix': {
    text: 'Adjustable base attach rate drops 40% when floor model is not powered on. 3 stores have unplugged demo units.',
  },
  'strategy/promotions': {
    text: 'Last 3 March SPIFFs underperformed vs. February. Recommend shifting $50K from flat SPIFF to bundle accelerator for higher ROI.',
  },
  'ops/floor': {
    text: 'Traffic spike predicted 2-4pm based on mall foot traffic data. Recommend pulling Marcus from break room to floor coverage.',
  },
  'ops/contests': {
    text: "Marcus is $2,400 from Tier 2 — one more Sleep System Bundle unlocks the accelerator bonus. He's your best conversion opportunity today.",
  },
  'comp/calculator': {
    text: 'At current pace, this rep reaches Tier 3 (Gold) by March 22. One additional $3K+ sale this week would accelerate by 4 days.',
  },
  'comp/team': {
    text: '23% of reps are in the "dead zone" between Bronze and Silver. Lower Tier 2 threshold from $25K to $22K — estimated +$8K monthly payout, +$340K revenue.',
  },
  'comp/executive': {
    text: 'Comp spend tracking 2.1% above Q1 budget. Primary driver: Flagship overpayment on Platinum tier. Recommend raising Flagship targets by 8%.',
  },
  'comp/admin': {
    text: 'Proposed tier change affects 47 reps across 12 stores. Net impact: +$12K monthly payout, projected +$89K incremental revenue from improved motivation.',
    label: 'AI Impact Analysis',
  },
};

export function getInsight(routeSlug: string): AIInsight | undefined {
  return AI_INSIGHTS[routeSlug];
}
```

- [ ] **Step 3: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -10
git add data/register/summit-sleep.ts data/register/ai-insights.ts
git commit -m "feat(register): add Summit Sleep config + centralized AI insights data"
```

---

### Task 5: Create register-d365-adapter.ts + wire layout

**Files:**
- Create: `lib/register-d365-adapter.ts` (rebranded copy of `lib/mattress-firm-d365-adapter.ts`)
- Modify: `app/(demos)/register/layout.tsx`
- Modify: `app/(demos)/register/page.tsx`

- [ ] **Step 1: Create register-d365-adapter.ts**

Read `lib/mattress-firm-d365-adapter.ts`, copy to `lib/register-d365-adapter.ts`, replace all "Mattress Firm" / "mattress-firm" references with "Summit Sleep" / "summit-sleep". Keep the same D365 event generation logic.

- [ ] **Step 2: Update layout.tsx to wrap with ThemeProvider**

Read current `layout.tsx`, then wrap children with `<RegisterThemeProvider>`:

```tsx
import { RegisterThemeProvider } from '@/components/demos/register/ThemeProvider';

// Inside the layout component, wrap {children} with:
<RegisterThemeProvider>
  {children}
</RegisterThemeProvider>
```

- [ ] **Step 3: Update page.tsx to redirect**

Replace the root `/register` page content with a redirect to `/register/corp/overview`:

```tsx
import { redirect } from 'next/navigation';

export default function RegisterRoot() {
  redirect('/register/corp/overview');
}
```

- [ ] **Step 4: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add lib/register-d365-adapter.ts app/(demos)/register/layout.tsx app/(demos)/register/page.tsx
git commit -m "feat(register): add D365 adapter + wire ThemeProvider into layout + root redirect"
```

---

### Task 6: Update demo.config.ts nav

**Files:**
- Modify: `app/(demos)/register/demo.config.ts`

- [ ] **Step 1: Replace nav config**

Replace the entire `nav` array with the 5-act, 22-page structure from spec Section 6. Remove all MF entries, planning entries, and cut pages.

- [ ] **Step 2: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -10
git add app/(demos)/register/demo.config.ts
git commit -m "feat(register): update nav to 5-act 22-page structure"
```

---

## Chunk 2: Act 3 — Store Operations (THE STAR)

> **IMPORTANT for Tasks 7-12:** The existing pages (`pos-terminal/page.tsx`, `manager/page.tsx`, `comp/admin/page.tsx`, `coaching/[id]/client.tsx`) were partially implemented in an earlier session. They do NOT use `RegisterThemeProvider`, `RegisterPage`, or `AIInsightCard`. They also reference `NEXT_PUBLIC_SWIC_URL` / `swicBase` for external SWIC navigation — this must be removed and replaced with `/register/ops/pos-terminal` (internal route). Every "rewrite" task below means **full overwrite** of the existing file, not incremental edits.

### Task 7: Build POS components (ShowroomCatalog + SaleTicket + CommissionMini)

**Files:**
- Create: `components/demos/register/pos/ShowroomCatalog.tsx`
- Create: `components/demos/register/pos/SaleTicket.tsx`
- Create: `components/demos/register/pos/CommissionMini.tsx`

- [ ] **Step 1: Create ShowroomCatalog**

Left panel (40%) of POS. Shows product catalog from `summit-sleep.ts` CATALOG data. Features:
- Category filter tabs (All, Mattress, Adjustable Base, Accessory, Protection, Delivery)
- Product cards: name, size/variant, price, SPIFF badge if applicable
- "Add" button calls `onAddItem(item)` callback
- Styled with CSS vars for dark/light mode
- ~120 lines

```tsx
// components/demos/register/pos/ShowroomCatalog.tsx
'use client';

import { useState } from 'react';

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  variant: string;
  price: number;
  cost: number;
  tags: string[];
  spiffAmount?: number;
}

interface ShowroomCatalogProps {
  items: CatalogItem[];
  onAddItem: (item: CatalogItem) => void;
}

const CATEGORIES = ['All', 'Mattress', 'Adjustable Base', 'Accessory', 'Protection Plan', 'Delivery'];

export function ShowroomCatalog({ items, onAddItem }: ShowroomCatalogProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '8px 12px',
          background: 'var(--register-bg-surface)',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Showroom Catalog</span>
        <span style={{ color: 'var(--register-text-muted)' }}>{filtered.length} items</span>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '6px 8px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'var(--register-ai)' : 'var(--register-bg-surface)',
              color: activeCategory === cat ? 'white' : 'var(--register-text-muted)',
              border: 'none',
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product cards */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 8px' }}>
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onAddItem(item)}
            style={{
              width: '100%',
              background: 'var(--register-bg-surface)',
              borderRadius: 8,
              padding: '8px 10px',
              marginBottom: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--register-text)',
              textAlign: 'left',
              borderLeft: item.spiffAmount ? '3px solid var(--register-accent)' : '3px solid transparent',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)' }}>{item.variant}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
                ${item.price.toLocaleString()}
              </div>
              {item.spiffAmount && (
                <div style={{ fontSize: '0.55rem', color: 'var(--register-warning)' }}>
                  +${item.spiffAmount} SPIFF
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SaleTicket**

Right panel sale lines. Shows added items, quantity controls, discount callouts, AI upsell insertion slot. ~100 lines.

- [ ] **Step 3: Create CommissionMini**

Bottom-right always-visible mini commission preview. Shows total commission, component one-liner, "Rewards tab for full breakdown" hint. ~50 lines.

- [ ] **Step 4: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add components/demos/register/pos/
git commit -m "feat(register): add POS components — ShowroomCatalog, SaleTicket, CommissionMini"
```

---

### Task 8: Build POS components (RewardsPanel + CloseSaleFlow + D365EventLog + BundleBuilder)

**Files:**
- Create: `components/demos/register/pos/RewardsPanel.tsx`
- Create: `components/demos/register/pos/CloseSaleFlow.tsx`
- Create: `components/demos/register/pos/D365EventLog.tsx`
- Create: `components/demos/register/pos/BundleBuilder.tsx`

- [ ] **Step 1: Create RewardsPanel**

Tier staircase visualization (4 tiers, current position highlighted), SWIC engine calculation, component breakdown, active SPIFFs, today's earnings, threshold progress. Uses `calculate()` from `lib/swic-engine/calculator.ts` with the Summit Sleep ClientConfig. ~180 lines.

Reference: Existing POS terminal page already has a RewardsPanel integration pattern. Port and enhance.

- [ ] **Step 2: Create CloseSaleFlow**

Payment method selection modal (Cash, Card, Finance, Check). On close:
1. Generates D365 `RetailTransactionPostedBusinessEvent` via `register-d365-adapter.ts`
2. Broadcasts `sale:closed` via `broadcastAlert()` from `lib/register-broadcast.ts`
3. Shows success confirmation
~100 lines.

- [ ] **Step 3: Create D365EventLog**

Scrollable event log showing generated D365 events with timestamps, event types, schema preview. Reference: Port from `components/demos/register/mattress-firm/D365EventLog.tsx` and rebrand. ~80 lines.

- [ ] **Step 4: Create BundleBuilder**

Bundle detection — when Mattress + Adjustable Base both in cart, show "Sleep System Bundle" badge with bonus amount. Reference: Port from `mattress-firm/BundleBuilder.tsx`. ~60 lines.

- [ ] **Step 5: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add components/demos/register/pos/
git commit -m "feat(register): add RewardsPanel, CloseSaleFlow, D365EventLog, BundleBuilder"
```

---

### Task 9: Build POS Terminal page

**Files:**
- Rewrite: `app/(demos)/register/ops/pos-terminal/page.tsx`

This is the centerpiece page. It wraps the POS UI in `TabletFrame` and wires all POS components together.

- [ ] **Step 1: Rewrite POS Terminal page**

The page is `'use client'` and:
1. Imports `TabletFrame` from `@/components/demos/proofline-route/TabletFrame` — **MUST be wrapped in TabletFrame**
2. Uses `useRegisterTheme()` for dark/light
3. Manages state: `cartItems`, `activeTab` (Lines/Payments/Rewards), `showRewards`, `d365Events`, `closeSaleOpen`
4. Layout: Top bar (Summit Sleep | Store | Terminal | D365 Connected) → Split panel (ShowroomCatalog 40% | SaleTicket+tabs 60%) → Bottom bar (New Sale / Hold / Close Sale)
5. BroadcastChannel listener: `onRegisterBroadcast()` for coaching toasts, comp-update toasts
6. AI upsell cards appear in SaleTicket when items are added (purple-bordered)
7. Commission mini-preview always visible in bottom-right
8. **REMOVE** any `NEXT_PUBLIC_SWIC_URL` / `swicBase` references — this page IS the POS terminal now
9. ~350 lines

Key interactions:
- Tap product in ShowroomCatalog → adds to cart → SaleTicket updates → CommissionMini recalculates
- Click "Rewards" tab → shows RewardsPanel with full SWIC calculation
- Click "Close Sale" → CloseSaleFlow modal → D365 event → broadcast
- Receive coaching push → toast notification at top

- [ ] **Step 2: Verify build**

Run: `cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -30`
Expected: No errors

- [ ] **Step 3: Verify TabletFrame wrapper is present**

Run: `grep -n "TabletFrame" ~/Development/demos/app/\(demos\)/register/ops/pos-terminal/page.tsx`
Expected: At least 2 matches (import line + JSX usage)

- [ ] **Step 4: Commit**

```bash
git add app/(demos)/register/ops/pos-terminal/page.tsx
git commit -m "feat(register): rebuild POS Terminal in TabletFrame with full SWIC integration"
```

---

### Task 10: Build Manager Console page

**Files:**
- Rewrite: `app/(demos)/register/ops/manager/page.tsx`

- [ ] **Step 1: Rewrite Manager Console**

Uses `RegisterPage` wrapper. Layout:
1. **Store status bar**: Store name, today's revenue, traffic count, open sales
2. **Rep cards** (3 cards, one per rep): Traffic light (green/amber/red), name, role, shift metrics, "Push to iPad" button, "View Coaching" link
3. **AI coaching feed**: Expandable coaching cards from `COACHING_CARDS` data, each with priority badge, data points, suggested action, commission impact, "Push to Rep Tablet" CTA
4. **"Open Rep Tablet" link**: `window.open('/register/ops/pos-terminal', '_blank')` (opens in new tab for side-by-side)
5. **"Broadcast All" button** in header: sends floor-wide alert via `broadcastAlert()`
6. **Live feed**: When POS broadcasts `sale:closed`, a new entry appears in the feed
7. AI Insight card at top: traffic spike prediction

BroadcastChannel integration:
- "Push to iPad" → `broadcastCoaching()` with rep-specific coaching data
- Listens for `ack` messages from POS

~400 lines.

- [ ] **Step 2: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/ops/manager/page.tsx
git commit -m "feat(register): rebuild Manager Console with traffic lights + BroadcastChannel push"
```

---

### Task 11: Update coaching drill-down

**Files:**
- Modify: `app/(demos)/register/ops/manager/coaching/[id]/page.tsx`
- Modify: `app/(demos)/register/ops/manager/coaching/[id]/client.tsx`

- [ ] **Step 1: Update coaching detail pages**

Wrap with `RegisterPage`, add:
- "Push Coaching to POS" button that broadcasts coaching scenario via `broadcastCoaching()` from `lib/register-broadcast.ts`
- **REMOVE** all `NEXT_PUBLIC_SWIC_URL` / `swicBase` references — replace "Open on iPad" link with `window.open('/register/ops/pos-terminal', '_blank')`
- More prominent commission impact callout
- Link to Comp Admin page
- AI Insight card if applicable

- [ ] **Step 2: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -10
git add app/(demos)/register/ops/manager/coaching/
git commit -m "feat(register): update coaching drill-down with theme + push button"
```

---

### Task 12: Build Floor Dashboard + Contest Board

**Files:**
- Rewrite: `app/(demos)/register/ops/floor/page.tsx`
- Rewrite: `app/(demos)/register/ops/contests/page.tsx`

- [ ] **Step 1: Rebuild Floor Dashboard**

`RegisterPage` wrapper with `accentColor="#8B5CF6"`. Shows:
- Real-time store metrics: traffic, active shoppers, average wait, conversion
- Floor layout grid (reuse `FloorLayoutMap` component if compatible, otherwise simplified version)
- Rep location indicators
- AI Insight: "Traffic spike predicted 2-4pm — pull Marcus to floor"
~200 lines.

- [ ] **Step 2: Rebuild Contest Board**

`RegisterPage` wrapper. Shows:
- Active contests / monthly leaderboard
- Rep rankings with progress bars toward tier thresholds
- AI Insight: "Marcus is $2,400 from Tier 2"
- SPIFF spotlight section
~180 lines.

- [ ] **Step 3: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/ops/floor/page.tsx app/(demos)/register/ops/contests/page.tsx
git commit -m "feat(register): rebuild Floor Dashboard + Contest Board with theme + AI insights"
```

---

## Chunk 3: Act 4 — Sales Compensation

### Task 13: Build Comp Plan + Calculator + Statements

**Files:**
- Rewrite: `app/(demos)/register/comp/plan/page.tsx`
- Rewrite: `app/(demos)/register/comp/calculator/page.tsx`
- Rewrite: `app/(demos)/register/comp/statements/page.tsx`

- [ ] **Step 1: Rebuild Comp Plan page**

`RegisterPage` wrapper with `accentColor="#10B981"`. Shows:
- Current comp plan overview (Flagship Floor Sales Plan FY26)
- Tier table visualization (Bronze → Platinum)
- Active SPIFFs list
- Accelerator rules
- No AI Insight on this page per spec
~180 lines.

- [ ] **Step 2: Rebuild Calculator page**

`RegisterPage` wrapper. Shows:
- Interactive "what-if" calculator — input sale amount, see commission breakdown
- Uses SWIC `calculate()` function with Summit Sleep config
- Tier staircase showing where the sale amount lands
- AI Insight: "At current pace, rep reaches Tier 3 by March 22"
~200 lines.

- [ ] **Step 3: Rebuild Statements page**

`RegisterPage` wrapper. Shows:
- Statement periods (selectable)
- Line item breakdown from `STATEMENTS` data in `comp-data.ts`
- Net payout summary
- No AI Insight per spec
~150 lines.

- [ ] **Step 4: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/comp/plan/ app/(demos)/register/comp/calculator/ app/(demos)/register/comp/statements/
git commit -m "feat(register): rebuild Comp Plan + Calculator + Statements with theme"
```

---

### Task 14: Build Team Performance + Executive View

**Files:**
- Rewrite: `app/(demos)/register/comp/team/page.tsx`
- Rewrite: `app/(demos)/register/comp/executive/page.tsx`

- [ ] **Step 1: Rebuild Team Performance**

`RegisterPage` wrapper. Shows:
- Team earnings leaderboard (from `TEAM_EARNINGS` data)
- Tier distribution across reps
- Attach rate / financing comparisons
- AI Insight: "23% of reps in dead zone — lower Tier 2 threshold to $42K"
~200 lines.

- [ ] **Step 2: Rebuild Executive View**

`RegisterPage` wrapper. Shows:
- Comp spend vs. budget (comp as % of revenue over time)
- Format-level performance comparison (Flagship vs. Standard vs. Outlet vs. Shop-in-Shop)
- Budget variance analysis
- AI Insight: "Comp spend 2.1% above budget — raise Flagship targets"
~200 lines.

- [ ] **Step 3: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/comp/team/ app/(demos)/register/comp/executive/
git commit -m "feat(register): rebuild Team Performance + Executive View with AI insights"
```

---

### Task 15: Build Comp Admin page

**Files:**
- Rewrite: `app/(demos)/register/comp/admin/page.tsx`

This is the second-most important page after POS Terminal.

- [ ] **Step 1: Rebuild Comp Admin**

`RegisterPage` wrapper with `accentColor="#10B981"`. Two-panel layout:

**Left panel — Plan List & Editor:**
- 4 plan cards from `ADMIN_PLANS` data (Flagship, Standard, Outlet, Shop-in-Shop)
- Each card: status badge (Active/Draft/Pending), enrolled count, budget, dates
- Click to expand → inline tier editor (editable threshold/rate inputs, SPIFF toggles, accelerator rules)
- "Save Draft" / "Activate" / "Revert" buttons

**Right panel — Live Preview + Push:**
- Commission simulator — mini SWIC calculator showing sample sale earnings under current vs. draft
- Impact analysis callout
- **"Push to All POS" button** → `broadcastCompUpdate()` + `broadcastPosSync()`
- Push history log from `PUSH_HISTORY` data
- AI Insight: "Proposed tier change affects 47 reps, +$12K monthly payout"

~400 lines.

- [ ] **Step 2: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/comp/admin/
git commit -m "feat(register): rebuild Comp Admin with tier editor + push-to-POS"
```

---

## Chunk 4: Acts 1-2 — Corporate Strategy + Sales Strategy

### Task 16: Build Act 1 pages (5 pages)

**Files:**
- Rewrite: `app/(demos)/register/corp/overview/page.tsx`
- Rewrite: `app/(demos)/register/corp/portfolio/page.tsx`
- Rewrite: `app/(demos)/register/corp/market/page.tsx`
- Rewrite: `app/(demos)/register/corp/seasonal/page.tsx`
- Rewrite: `app/(demos)/register/corp/brands/page.tsx`

All pages use `RegisterPage` wrapper with `accentColor="#1E3A5F"`. Data from `data/register/store-data.ts`. AI insights from `ai-insights.ts` where specified.

- [ ] **Step 1: Rebuild Company Overview**

Summit Sleep Co. at a glance: 200 stores, 4 formats, $340M revenue, 850 reps. Key metrics as stat cards. Store format breakdown (Flagship/Standard/Outlet/Shop-in-Shop). AI Insight: "3 underperforming stores — recommend format conversion". ~180 lines.

- [ ] **Step 2: Rebuild Store Portfolio**

Interactive map/grid of stores by format. Performance heatmap by region. AI Insight: "Outlet within 5mi of Flagship cannibalizes 12%". ~180 lines.

- [ ] **Step 3: Rebuild Market Position**

Industry benchmarks, market share, competitive landscape. No AI Insight per spec. ~150 lines.

- [ ] **Step 4: Rebuild Seasonal Strategy**

Monthly revenue seasonality chart, SPIFF calendar overlay, holiday impact analysis. AI Insight: "Presidents' Day +22%". ~170 lines.

- [ ] **Step 5: Rebuild Brand Partners**

Partner brands (mattress manufacturers), partnership tiers, co-marketing programs. No AI Insight per spec. ~150 lines.

- [ ] **Step 6: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/corp/
git commit -m "feat(register): rebuild Act 1 Corporate Strategy pages (5 pages)"
```

---

### Task 17: Build Act 2 pages (5 pages)

**Files:**
- Rewrite: `app/(demos)/register/strategy/districts/page.tsx`
- Rewrite: `app/(demos)/register/strategy/targets/page.tsx`
- Rewrite: `app/(demos)/register/strategy/mix/page.tsx`
- Rewrite: `app/(demos)/register/strategy/workforce/page.tsx`
- Rewrite: `app/(demos)/register/strategy/promotions/page.tsx`

All use `RegisterPage` wrapper with `accentColor="#06B6D4"`.

- [ ] **Step 1: Rebuild District Planning**

District map, store assignments, performance by district. AI Insight: "Realign District 7". ~180 lines.

- [ ] **Step 2: Rebuild Store Targets**

Target allocation by store format, current vs. target, variance analysis. No AI Insight per spec. ~170 lines.

- [ ] **Step 3: Rebuild Product Mix**

Category sales breakdown, attach rates by category, product performance grid. AI Insight: "Adjustable base attach drops 40% when not demoed". ~180 lines.

- [ ] **Step 4: Rebuild Workforce Model**

Headcount by store, rep-to-traffic ratio, scheduling efficiency. No AI Insight per spec. ~160 lines.

- [ ] **Step 5: Rebuild Promotion Calendar**

SPIFF calendar with past/active/future promotions, ROI metrics per promotion. AI Insight: "Shift $50K to bundle accelerator". ~180 lines.

- [ ] **Step 6: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/strategy/
git commit -m "feat(register): rebuild Act 2 Sales Strategy pages (5 pages)"
```

---

## Chunk 5: Act 5 + Cleanup + Polish

### Task 18: Build Act 5 pages (2 pages)

**Files:**
- Rewrite: `app/(demos)/register/platform/product/page.tsx`
- Create: `app/(demos)/register/platform/d365/page.tsx`

- [ ] **Step 1: Build D365 Integration page**

`RegisterPage` wrapper with `accentColor="#F59E0B"`. Shows:
- D365 Commerce integration architecture diagram
- Transaction event schema (from `d365-schemas.ts`)
- BroadcastChannel data flow
- Event log sample
- No AI Insight per spec
~200 lines.

- [ ] **Step 2: Rebuild Product Overview**

`RegisterPage` wrapper. Shows:
- REGISTER product overview (what it does, who it's for)
- Module breakdown (Acts 1-4 as capabilities)
- Technology stack
- No AI Insight per spec
~160 lines.

- [ ] **Step 3: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -20
git add app/(demos)/register/platform/
git commit -m "feat(register): rebuild Act 5 Platform & Integration pages"
```

---

### Task 19: Delete all cut pages + MF files

**Files:** (see File Structure section for full list)

- [ ] **Step 1: Delete Mattress Firm files**

```bash
cd ~/Development/demos
rm -rf app/\(demos\)/register/ops/mattress-firm/
rm -rf components/demos/register/mattress-firm/
rm data/register/mattress-firm.ts
rm lib/mattress-firm-broadcast.ts
rm lib/mattress-firm-d365-adapter.ts
```

- [ ] **Step 2: Delete cut pages**

```bash
cd ~/Development/demos
rm -rf app/\(demos\)/register/ops/pos/
rm -rf app/\(demos\)/register/ops/customer/
rm -rf app/\(demos\)/register/ops/inventory/
rm -rf app/\(demos\)/register/ops/rep-assessment/
rm -rf app/\(demos\)/register/comp/measurements/
rm -rf app/\(demos\)/register/comp/payouts/
rm -rf app/\(demos\)/register/comp/disputes/
rm -rf app/\(demos\)/register/comp/reports/
rm -rf app/\(demos\)/register/planning/
rm -rf app/\(demos\)/register/platform/architecture/
rm -rf app/\(demos\)/register/platform/varicent/
```

- [ ] **Step 3: Delete planning data**

```bash
rm data/register/planning-data.ts
```

- [ ] **Step 4: Verify no import references to deleted files**

Run: `cd ~/Development/demos && grep -r "mattress-firm\|planning-data\|/ops/pos'\|/ops/customer\|/ops/inventory\|/ops/rep-assessment\|/comp/measurements\|/comp/payouts\|/comp/disputes\|/comp/reports\|/planning/\|/platform/architecture\|/platform/varicent" --include="*.ts" --include="*.tsx" -l`
Expected: No results (all references should have been removed in earlier tasks via demo.config.ts update)

- [ ] **Step 5: Verify build + commit**

```bash
cd ~/Development/demos && npx tsc --noEmit --pretty 2>&1 | head -30
git add -A
git commit -m "chore(register): delete 17 cut pages + all Mattress Firm files"
```

---

### Task 20: Full build + polish pass

- [ ] **Step 1: Full production build**

```bash
cd ~/Development/demos && pnpm build 2>&1 | tail -30
```

Fix any build errors. Common issues:
- Missing imports in new page files
- CSS variable typos
- Type mismatches with SWIC engine

- [ ] **Step 2: Verify no "Mattress Firm" client branding**

```bash
cd ~/Development/demos && grep -ri "mattress.firm" --include="*.tsx" --include="*.ts" -l | grep -v "corp/market"
```

Expected: No results. The `corp/market/page.tsx` file legitimately uses "Mattress Firm" as a **competitor** name in the market positioning chart — this is intentional demo content, not client branding. All other files must use "Summit Sleep Co." only.

- [ ] **Step 3: Verify all 22 pages exist**

```bash
for route in corp/overview corp/portfolio corp/market corp/seasonal corp/brands \
  strategy/districts strategy/targets strategy/mix strategy/workforce strategy/promotions \
  ops/floor ops/pos-terminal ops/manager ops/contests \
  comp/plan comp/calculator comp/statements comp/team comp/executive comp/admin \
  platform/d365 platform/product; do
  if [ -f "app/(demos)/register/${route}/page.tsx" ]; then
    echo "OK: ${route}"
  else
    echo "MISSING: ${route}"
  fi
done
```

Expected: All 22 show "OK"

- [ ] **Step 4: Verify cut pages are gone**

```bash
for route in ops/pos ops/customer ops/inventory ops/rep-assessment ops/mattress-firm \
  comp/measurements comp/payouts comp/disputes comp/reports \
  planning/forecasting planning/headcount planning/scheduling planning/targets \
  platform/architecture platform/varicent; do
  if [ -d "app/(demos)/register/${route}" ]; then
    echo "STILL EXISTS: ${route}"
  else
    echo "DELETED: ${route}"
  fi
done
```

Expected: All show "DELETED"

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(register): full rebuild complete — 22 pages, 5 acts, Summit Sleep Co."
```

---

## Verification Checklist (from spec Section 8)

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
