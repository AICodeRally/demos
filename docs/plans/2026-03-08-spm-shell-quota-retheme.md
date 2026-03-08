# SpmShell + QUOTA Retheme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a new SpmShell layout component (matching SGM's navbar/footer/left-nav pattern) and retheme the QUOTA demo to use Prizym RevOps branding with proper theme CSS variables.

**Architecture:** New SpmShell component in `components/spm-shell/` with its own types, config helper, and `defineSpmDemo()` factory. Uses the existing Prizym theme system (`--prizym-*` CSS vars) with a new `prizym-navy` preset. QUOTA pages rewritten to use CSS vars instead of hardcoded dark colors.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Recharts, Lucide React, Prizym theme system

---

## Context

### What exists today
- `components/demo-shell/` — DemoShell (sidebar layout) used by EQUIPR, AEGIS, CHARTER, etc.
- `lib/theme/` — Prizym theme system with presets and `--prizym-*` CSS variables
- `app/(demos)/quota/` — 22 pages with hardcoded `text-white`, `bg-white/5` dark colors
- QUOTA uses `defineDemo()` + `DemoShell` — needs to switch to `defineSpmDemo()` + `SpmShell`

### What SGM looks like (the reference)
- **Top navbar**: gradient bar (4px) + SPARCC logo + SGM circle + module title + Demo Data badge
- **Content area**: full width below navbar, no sidebar in SGM (tile-based nav)
- **Footer**: section quick links + copyright + "Part of SPARCC suite • Powered by AICR" + gradient bar

### What QUOTA SpmShell will look like
- **Top navbar**: amber→gold gradient bar + "PRIZYM" (left) + QTA circle + "QUOTA / Quota Planning and Attainment" (center) + Demo Data badge
- **Left sidebar**: section-grouped nav links (like DemoShell but matching SGM's color scheme)
- **Content area**: scrollable main content with `--prizym-bg-content`
- **Footer**: section quick links + "© 2026 Prizym • Part of the PRIZYM RevOps suite • Powered by AICR" + gradient bar

### Theme: `prizym-navy`
- Dark navy sidebar/chrome (`#0F172A`, `#1E293B`)
- Light content area (`#F8FAFC`)
- White cards
- Amber primary (`#F59E0B`), red accent (`#EF4444`)

### CSS variable pattern (from EQUIPR pages)
All page content uses `style={{ color: 'var(--prizym-text-primary)' }}` etc. — never `text-white` or `bg-white/5`.

---

## Task 1: Create `prizym-navy` theme preset

**Files:**
- Create: `lib/theme/presets/prizym-navy.ts`
- Modify: `lib/theme/presets/index.ts`
- Modify: `lib/theme/create-theme.ts`
- Modify: `lib/theme/types.ts`

**Step 1: Create the preset file**

```typescript
// lib/theme/presets/prizym-navy.ts
import type { ThemeTokens } from '../types';

export const prizymNavy: ThemeTokens = {
  colors: {
    primary: '#F59E0B',
    accent: '#EF4444',
    success: '#10B981',
    danger: '#EF4444',
    neutral: '#64748B',
  },
  surfaces: {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    bgContent: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderDefault: '#E2E8F0',
    borderSubtle: '#334155',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    elevated: '0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
  },
};
```

**Step 2: Register the preset**

Add to `lib/theme/presets/index.ts`:
```typescript
export { prizymNavy } from './prizym-navy';
```

Add to `lib/theme/create-theme.ts` PRESETS map:
```typescript
'prizym-navy': prizymNavy,
```

Add `'prizym-navy'` to the `ThemePreset` union type in `lib/theme/types.ts`.

**Step 3: Build and verify**

Run: `cd /Users/toddlebaron/Development/demos && npm run build`
Expected: Clean build

**Step 4: Commit**

```bash
git add lib/theme/
git commit -m "feat: add prizym-navy theme preset for SPM demos"
```

---

## Task 2: Create SpmShell component

**Files:**
- Create: `components/spm-shell/types.ts`
- Create: `components/spm-shell/define-spm-demo.ts`
- Create: `components/spm-shell/SpmShell.tsx`
- Create: `components/spm-shell/index.ts`

**Step 1: Create types**

```typescript
// components/spm-shell/types.ts
import type { ThemeConfig } from '@aicr/prizym-theme';

export interface SpmNavItem {
  label: string;
  href: string;
  icon: string;
}

export interface SpmNavSection {
  section: string;
  items: SpmNavItem[];
}

export interface SpmSuiteBranding {
  name: string;      // "PRIZYM"
  tagline: string;   // "RevOps Suite"
}

export interface SpmModuleBranding {
  code: string;        // "QTA" — 3-letter code for circle
  name: string;        // "QUOTA"
  description: string; // "Quota Planning and Attainment"
}

export interface SpmGradient {
  start: string;  // "#F59E0B"
  mid: string;    // "#F97316"
  end: string;    // "#EF4444"
}

export interface SpmFooterConfig {
  copyright: string;
  poweredBy: string;
}

export interface SpmDemoConfig {
  suite: SpmSuiteBranding;
  module: SpmModuleBranding;
  gradient: SpmGradient;
  theme: ThemeConfig;
  nav: SpmNavSection[];
  footer: SpmFooterConfig;
}
```

**Step 2: Create defineSpmDemo helper**

```typescript
// components/spm-shell/define-spm-demo.ts
import type { SpmDemoConfig, SpmSuiteBranding, SpmModuleBranding, SpmGradient, SpmNavSection, SpmFooterConfig } from './types';
import type { ThemePreset } from '@aicr/prizym-theme';

interface DefineSpmDemoInput {
  suite: SpmSuiteBranding;
  module: SpmModuleBranding;
  gradient: SpmGradient;
  theme?: ThemePreset;
  colors?: SpmDemoConfig['theme']['colors'];
  nav: SpmNavSection[];
  footer: SpmFooterConfig;
}

export function defineSpmDemo(input: DefineSpmDemoInput): SpmDemoConfig {
  return {
    suite: input.suite,
    module: input.module,
    gradient: input.gradient,
    theme: {
      preset: input.theme ?? 'prizym-navy',
      colors: input.colors,
    },
    nav: input.nav,
    footer: input.footer,
  };
}
```

**Step 3: Create SpmShell component**

Create `components/spm-shell/SpmShell.tsx`. This is the main layout component. It must:

1. **Top gradient bar** (4px): `linear-gradient(to right, gradient.start, gradient.mid, gradient.end)`
2. **Top navbar** (h-16):
   - Left: Suite name (`PRIZYM`) in gradient text + tagline below ("RevOps Suite" in muted)
   - Left-center: Module circle (gradient bg, white text `QTA`)
   - Center: Module name (`QUOTA`) in gradient text + description ("Quota Planning and Attainment") in muted
   - Right: "Demo Data" pill badge (gradient bg) + user avatar placeholder
3. **Body** (flex row, fills remaining height):
   - Left sidebar (w-[240px]): nav sections with section headers and items, dark bg (`--prizym-bg-primary`)
   - Main content (flex-1): scrollable, `--prizym-bg-content` background, padded, max-w-[1200px] centered
4. **Footer** (fixed bottom):
   - Section quick-links (gradient colored)
   - Copyright + "Part of the PRIZYM RevOps suite • Powered by AICR"
   - Bottom gradient bar (4px)

Reference the SGM Navbar.tsx (lines 39-183) and Footer.tsx (lines 7-81) for exact styling patterns. Adapt to use `--prizym-*` CSS variables for the content area. Sidebar uses same dark pattern as DemoShell.

Key differences from DemoShell:
- Top navbar instead of logo in sidebar
- Gradient bars top and bottom
- Suite/module branding instead of client/product
- Footer has section links and suite attribution
- Sidebar is narrower (240px vs 264px) and has no logo section

```typescript
// components/spm-shell/SpmShell.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createThemeVars, resolveTheme } from '@/lib/theme';
import type { SpmDemoConfig } from './types';

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return twMerge(clsx(inputs));
}

function getIcon(name: string): LucideIcons.LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;
  return icons[name] ?? LucideIcons.Circle;
}

interface SpmShellProps {
  config: SpmDemoConfig;
  children: React.ReactNode;
}

export function SpmShell({ config, children }: SpmShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const themeVars = createThemeVars(config.theme);
  const resolved = resolveTheme(config.theme);
  const { gradient } = config;
  const gradientCss = `linear-gradient(90deg, ${gradient.start}, ${gradient.mid}, ${gradient.end})`;

  // Flatten nav for active detection
  const allItems = config.nav.flatMap((s) => s.items);
  const currentNav = allItems.find((n) =>
    n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href)
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={themeVars as React.CSSProperties}>
      {/* ── Top gradient bar ── */}
      <div className="h-1 shrink-0" style={{ background: gradientCss }} />

      {/* ── Navbar ── */}
      <nav
        className="shrink-0 flex items-center h-16 px-6"
        style={{
          background: 'var(--prizym-bg-primary)',
          borderBottom: '1px solid var(--prizym-border-subtle)',
        }}
      >
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 rounded-lg p-1.5 hover:bg-white/[0.06] lg:hidden"
        >
          {sidebarOpen ? (
            <LucideIcons.X className="h-5 w-5 text-white/70" />
          ) : (
            <LucideIcons.Menu className="h-5 w-5 text-white/70" />
          )}
        </button>

        {/* Suite branding */}
        <Link href="/" className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span
              className="text-2xl font-bold bg-clip-text text-transparent tracking-tight"
              style={{ backgroundImage: gradientCss, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {config.suite.name}
            </span>
            <span className="text-[8px] text-white/40 uppercase tracking-widest -mt-0.5">
              {config.suite.tagline}
            </span>
          </div>

          {/* Module circle */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundImage: `linear-gradient(135deg, ${gradient.start}, ${gradient.mid}, ${gradient.end})` }}
          >
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {config.module.code}
            </span>
          </div>

          {/* Module info */}
          <div className="border-l border-white/10 pl-4">
            <h1
              className="text-lg font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: gradientCss, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {config.module.name}
            </h1>
            <p className="text-xs text-white/50">{config.module.description}</p>
          </div>
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          <span
            className="px-3 py-1 text-sm font-bold uppercase tracking-wide rounded text-white"
            style={{
              background: gradientCss,
              boxShadow: `0 2px 4px ${gradient.start}40`,
            }}
          >
            Demo Data
          </span>
        </div>
      </nav>

      {/* ── Body (sidebar + content) ── */}
      <div className="flex flex-1 min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col pt-[68px] shrink-0 transition-transform duration-300 lg:relative lg:pt-0 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{
            background: 'var(--prizym-bg-primary)',
            borderRight: '1px solid var(--prizym-border-subtle)',
          }}
        >
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {config.nav.map((section, idx) => (
              <div key={`${idx}-${section.section}`}>
                <div
                  className="mb-2 mt-4 first:mt-0 px-3 text-[10px] font-semibold tracking-[0.15em] uppercase"
                  style={{ color: `${gradient.start}CC` }}
                >
                  {section.section}
                </div>
                {section.items.map((item) => {
                  const Icon = getIcon(item.icon);
                  const isActive = item.href === '/' ? pathname === '/' : pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                        isActive
                          ? 'bg-white/[0.10] text-white shadow-sm'
                          : 'text-white/60 hover:bg-white/[0.04] hover:text-white/80'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={cn('h-4 w-4 shrink-0', isActive ? '' : 'text-white/40 group-hover:text-white/60')}
                        style={isActive ? { color: gradient.start } : undefined}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8"
          style={{ background: 'var(--prizym-bg-content)' }}
        >
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer
        className="shrink-0"
        style={{ background: 'var(--prizym-bg-primary)' }}
      >
        <div className="px-6 py-3">
          {/* Section links */}
          <div className="flex items-center justify-center gap-5">
            {config.nav.map((section, idx) => (
              <span
                key={`${idx}-${section.section}`}
                className="text-[11px] font-semibold font-mono"
                style={{ color: gradient.start }}
              >
                {section.section}
              </span>
            ))}
          </div>
          {/* Attribution */}
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px] tracking-[0.1em] uppercase text-white/30">
            <span>{config.footer.copyright}</span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>
              Part of the{' '}
              <span className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: gradientCss }}>
                {config.suite.name}
              </span>
              {' '}{config.suite.tagline}
            </span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>
              Powered by{' '}
              <span className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: gradientCss }}>
                {config.footer.poweredBy}
              </span>
            </span>
          </div>
        </div>
        {/* Bottom gradient bar */}
        <div className="h-1" style={{ background: gradientCss }} />
      </footer>
    </div>
  );
}
```

**Step 4: Create index.ts**

```typescript
// components/spm-shell/index.ts
export { SpmShell } from './SpmShell';
export { defineSpmDemo } from './define-spm-demo';
export type {
  SpmDemoConfig,
  SpmNavItem,
  SpmNavSection,
  SpmSuiteBranding,
  SpmModuleBranding,
  SpmGradient,
  SpmFooterConfig,
} from './types';
```

**Step 5: Build and verify**

Run: `cd /Users/toddlebaron/Development/demos && npm run build`
Expected: Clean build (SpmShell not yet imported by any page)

**Step 6: Commit**

```bash
git add components/spm-shell/
git commit -m "feat: add SpmShell layout component for Prizym RevOps demos"
```

---

## Task 3: Wire QUOTA to SpmShell

**Files:**
- Rewrite: `app/(demos)/quota/demo.config.ts`
- Rewrite: `app/(demos)/quota/layout.tsx`

**Step 1: Rewrite demo.config.ts**

```typescript
// app/(demos)/quota/demo.config.ts
import { defineSpmDemo } from '@/components/spm-shell';

export default defineSpmDemo({
  suite: { name: 'PRIZYM', tagline: 'RevOps Suite' },
  module: { code: 'QTA', name: 'QUOTA', description: 'Quota Planning and Attainment' },
  gradient: { start: '#F59E0B', mid: '#F97316', end: '#EF4444' },
  theme: 'prizym-navy',
  nav: [
    {
      section: 'Executive Command Center',
      items: [
        { label: 'Performance Dashboard', href: '/quota/executive-command-center/performance-dashboard', icon: 'LayoutDashboard' },
        { label: 'Revenue Overview', href: '/quota/executive-command-center/revenue-overview', icon: 'DollarSign' },
        { label: 'Territory Heatmap', href: '/quota/executive-command-center/territory-heatmap', icon: 'Map' },
        { label: 'Team Scorecards', href: '/quota/executive-command-center/team-scorecards', icon: 'Users' },
        { label: 'Executive Alerts', href: '/quota/executive-command-center/executive-alerts', icon: 'Bell' },
      ],
    },
    {
      section: 'Sales Operations',
      items: [
        { label: 'Quota Assignment', href: '/quota/sales-operations/quota-assignment', icon: 'Target' },
        { label: 'Performance Tracking', href: '/quota/sales-operations/performance-tracking', icon: 'TrendingUp' },
        { label: 'Commission Calculations', href: '/quota/sales-operations/commission-calculations', icon: 'Calculator' },
        { label: 'Pipeline Management', href: '/quota/sales-operations/pipeline-management', icon: 'GitBranch' },
        { label: 'Territory Planning', href: '/quota/sales-operations/territory-planning', icon: 'MapPin' },
        { label: 'Goal Setting', href: '/quota/sales-operations/goal-setting', icon: 'Flag' },
      ],
    },
    {
      section: 'Intelligence & Analytics',
      items: [
        { label: 'Predictive Forecasting', href: '/quota/intelligence-analytics/predictive-forecasting', icon: 'TrendingUp' },
        { label: 'Performance Analytics', href: '/quota/intelligence-analytics/performance-analytics', icon: 'BarChart3' },
        { label: 'Quota Attainment', href: '/quota/intelligence-analytics/quota-attainment-insights', icon: 'Target' },
        { label: 'AI Recommendations', href: '/quota/intelligence-analytics/ai-recommendations', icon: 'Sparkles' },
        { label: 'Custom Reports', href: '/quota/intelligence-analytics/custom-reports', icon: 'FileText' },
        { label: 'Competitive Intel', href: '/quota/intelligence-analytics/competitive-intelligence', icon: 'Shield' },
      ],
    },
    {
      section: 'Administration',
      items: [
        { label: 'System Config', href: '/quota/administration-control/system-configuration', icon: 'Settings' },
        { label: 'User Management', href: '/quota/administration-control/user-management', icon: 'Users' },
        { label: 'Compensation Plans', href: '/quota/administration-control/compensation-plans', icon: 'Coins' },
        { label: 'Audit & Compliance', href: '/quota/administration-control/audit-compliance', icon: 'ShieldCheck' },
        { label: 'Integration Hub', href: '/quota/administration-control/integration-hub', icon: 'Plug' },
      ],
    },
  ],
  footer: {
    copyright: '\u00A9 2026 Prizym',
    poweredBy: 'AICR',
  },
});
```

**Step 2: Rewrite layout.tsx**

```typescript
// app/(demos)/quota/layout.tsx
'use client';

import { SpmShell } from '@/components/spm-shell';
import demoConfig from './demo.config';

export default function QuotaLayout({ children }: { children: React.ReactNode }) {
  return <SpmShell config={demoConfig}>{children}</SpmShell>;
}
```

**Step 3: Build (will fail — pages still use hardcoded dark colors, but layout should render)**

Run: `cd /Users/toddlebaron/Development/demos && npm run build`
Expected: Build succeeds (pages render but look wrong visually due to dark-on-light colors)

**Step 4: Commit**

```bash
git add app/\(demos\)/quota/demo.config.ts app/\(demos\)/quota/layout.tsx
git commit -m "feat(quota): wire QUOTA demo to SpmShell with Prizym branding"
```

---

## Task 4: Retheme all 22 QUOTA pages

**Files:**
- Modify: All 22 page.tsx files under `app/(demos)/quota/`

**Pattern to follow (from EQUIPR):**

Replace hardcoded dark colors with CSS variables:

| Old (dark) | New (theme-aware) |
|------------|-------------------|
| `className="text-white"` | `style={{ color: 'var(--prizym-text-primary)' }}` |
| `className="text-white/50"` | `style={{ color: 'var(--prizym-text-muted)' }}` |
| `className="text-white/70"` | `style={{ color: 'var(--prizym-text-secondary)' }}` |
| `className="text-white/40"` | `style={{ color: 'var(--prizym-text-muted)' }}` |
| `className="bg-white/5"` or `bg-white/[0.03]` | `style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}` |
| `className="border-white/10"` | `style={{ borderColor: 'var(--prizym-border-default)' }}` |
| `className="border-white/5"` | `style={{ borderColor: 'var(--prizym-border-default)' }}` |
| `bg-card` (undefined) | `style={{ background: 'var(--prizym-card-bg)' }}` |
| `text-muted-foreground` (undefined) | `style={{ color: 'var(--prizym-text-muted)' }}` |
| `border-border` (undefined) | `style={{ borderColor: 'var(--prizym-border-default)' }}` |
| Recharts tooltip `background: '#1e1e2e'` | `background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827'` |
| Recharts grid `stroke="rgba(255,255,255,0.06)"` | `stroke="#E5E7EB"` |
| `text-amber-400` (icon accents) | Keep — amber is the brand color, works on light bg |
| `bg-amber-500/10` (icon bg) | Keep — amber tints work on light bg |
| `text-emerald-400` (success) | `text-emerald-600` (darker for light bg) |

**Additional patterns:**
- KPI cards: Use accent bar pattern from EQUIPR (`absolute left-0 w-[3px] h-8 rounded-r`)
- Section headers: Use `var(--prizym-text-primary)` for titles, `var(--prizym-text-muted)` for descriptions
- Tables: Use `var(--prizym-border-default)` for row borders, `var(--prizym-text-primary)` for text
- Status badges: Keep colored backgrounds (`bg-emerald-500/20 text-emerald-600` etc.) — they work on light

**Process:** Dispatch parallel subagents, one per section (4 sections × ~5-6 pages each). Each subagent rewrites all pages in its section following the pattern above.

**Section 1 — Executive Command Center (5 pages):**
- `executive-command-center/performance-dashboard/page.tsx`
- `executive-command-center/revenue-overview/page.tsx`
- `executive-command-center/territory-heatmap/page.tsx`
- `executive-command-center/team-scorecards/page.tsx`
- `executive-command-center/executive-alerts/page.tsx`

**Section 2 — Sales Operations (6 pages):**
- `sales-operations/quota-assignment/page.tsx`
- `sales-operations/performance-tracking/page.tsx`
- `sales-operations/commission-calculations/page.tsx`
- `sales-operations/pipeline-management/page.tsx`
- `sales-operations/territory-planning/page.tsx`
- `sales-operations/goal-setting/page.tsx`

**Section 3 — Intelligence & Analytics (6 pages):**
- `intelligence-analytics/predictive-forecasting/page.tsx`
- `intelligence-analytics/performance-analytics/page.tsx`
- `intelligence-analytics/quota-attainment-insights/page.tsx`
- `intelligence-analytics/ai-recommendations/page.tsx`
- `intelligence-analytics/custom-reports/page.tsx`
- `intelligence-analytics/competitive-intelligence/page.tsx`

**Section 4 — Administration (5 pages):**
- `administration-control/system-configuration/page.tsx`
- `administration-control/user-management/page.tsx`
- `administration-control/compensation-plans/page.tsx`
- `administration-control/audit-compliance/page.tsx`
- `administration-control/integration-hub/page.tsx`

**After all sections are done:**

Run: `cd /Users/toddlebaron/Development/demos && npm run build`
Expected: Clean build, zero errors

**Commit:**

```bash
git add app/\(demos\)/quota/
git commit -m "feat(quota): retheme all 22 pages with Prizym CSS variables"
```

---

## Task 5: Update portfolio card

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update the QUOTA entry in the demos array**

Change from:
```typescript
{
  name: 'QUOTA',
  slug: 'quota',
  industry: 'Sales Quota Management',
  tagline: 'Intelligent quota planning, attainment tracking, and commission management',
  color: '#f59e0b',
  pages: 22,
},
```

To:
```typescript
{
  name: 'QUOTA',
  slug: 'quota',
  industry: 'Prizym RevOps',
  tagline: 'Quota planning and attainment for the modern CRO',
  color: '#f59e0b',
  pages: 22,
},
```

**Step 2: Build and verify**

Run: `cd /Users/toddlebaron/Development/demos && npm run build`
Expected: Clean build

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "chore(quota): update portfolio card with Prizym branding"
```

---

## Task 6: Deploy to Cloudflare Pages

**Step 1: Deploy**

```bash
cd /Users/toddlebaron/Development/demos && npx wrangler pages deploy out --project-name=aicr-demos
```

**Step 2: Verify**

Open `https://demos.aicoderally.com/quota/executive-command-center/performance-dashboard` and verify:
- Navbar shows PRIZYM + QTA circle + QUOTA title
- Left sidebar has 4 sections with nav links
- Content area has light background with themed cards
- Footer shows section links + Prizym attribution + gradient bar
- No 404s on any page

**Step 3: Commit (if any fixes needed)**

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | prizym-navy theme preset | 4 files in `lib/theme/` |
| 2 | SpmShell component | 4 files in `components/spm-shell/` |
| 3 | Wire QUOTA to SpmShell | 2 files (config + layout) |
| 4 | Retheme 22 pages | 22 page files |
| 5 | Update portfolio card | 1 file |
| 6 | Deploy | 0 files |
