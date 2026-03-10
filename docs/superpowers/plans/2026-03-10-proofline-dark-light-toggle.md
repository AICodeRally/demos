# PROOFLINE Dark/Light Toggle Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full light/dark mode toggle to the PROOFLINE Andrews demo (~30 pages + 14 shared components + DemoShell).

**Architecture:** Create a `proofline-vars.css` file defining `--pl-*` CSS custom properties with light defaults and `.dark` overrides. Add a Sun/Moon toggle button to DemoShell header that toggles a `.dark` class on the shell root and persists to `localStorage`. Migrate all hardcoded hex colors in pages and shared components to `var(--pl-*)` references.

**Tech Stack:** Next.js, TypeScript, CSS custom properties, localStorage, Lucide React icons

**Spec:** `docs/superpowers/specs/2026-03-10-proofline-dark-light-toggle-design.md`

**Repo:** `~/Development/demos` (port 3100)

**Dev server:** `pnpm dev` from repo root, or `npx turbo dev`

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `styles/proofline-vars.css` | CSS custom property definitions (light defaults + `.dark` overrides) |

### Modified Files
| File | Change |
|------|--------|
| `app/(demos)/proofline-andrews/layout.tsx` | Import `proofline-vars.css` |
| `components/demo-shell/types.ts` | Add optional `darkMode` field (spec deviation: spec says "no changes" but opt-in gating requires it) |
| `components/demo-shell/define-demo.ts` | Pass `darkMode` through to config |
| `components/demo-shell/DemoShell.tsx` | Add toggle button, `.dark` class management, localStorage, sidebar CSS var wiring |
| `components/demos/proofline/LightSectionCard.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/LightKpiCard.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/ActNavigation.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/ProofDonutChart.tsx` | `labelColor` default → CSS var |
| `components/demos/proofline/LightBarChart.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/LightAreaChart.tsx` | Hardcoded → CSS vars (grid, tooltip, axis) |
| `components/demos/proofline/BarChart.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/Sparkline.tsx` | No changes needed (color is prop-driven) |
| `components/demos/proofline/CoachingCard.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/DataSourceBadge.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/MobilePreview.tsx` | No changes needed (dark phone frame is intentional) |
| `components/demos/proofline/RepSelector.tsx` | Hardcoded → CSS vars |
| `components/demos/proofline/RouteMap.tsx` | SVG fills → CSS vars |
| `components/demos/proofline/StopCard.tsx` | Hardcoded → CSS vars |
| ~30 page files in `app/(demos)/proofline-andrews/` | Inline styles → CSS vars |

---

## Chunk 1: Foundation (CSS vars + DemoShell toggle + layout)

### Task 1: Create CSS custom properties file

**Files:**
- Create: `styles/proofline-vars.css`

This file defines all `--pl-*` tokens with light-mode defaults at the root scope and dark-mode overrides under `.dark`.

- [ ] **Step 1: Create `styles/proofline-vars.css`**

```css
/* PROOFLINE — Light/Dark CSS Custom Properties
   Light values are defaults. Dark values activate under .dark class.
   Spec: docs/superpowers/specs/2026-03-10-proofline-dark-light-toggle-design.md
*/

/* ── Light mode (default) ─────────────────────── */
:root {
  /* Text */
  --pl-text: #1A1A2E;
  --pl-text-secondary: #4A5568;
  --pl-text-muted: #718096;
  --pl-text-faint: #A0AEC0;

  /* Surfaces */
  --pl-bg: #F8FAFC;
  --pl-card: #FFFFFF;
  --pl-card-alt: #F7FAFC;
  --pl-border: #E2E8F0;
  --pl-shadow: 0 1px 3px rgba(0,0,0,0.06);
  --pl-hover: rgba(0,0,0,0.04);
  --pl-stripe: #F8FAFC;

  /* Sidebar */
  --pl-sidebar-bg-start: #F1F5F9;
  --pl-sidebar-bg-end: #FFFFFF;
  --pl-sidebar-text: #1A1A2E;
  --pl-sidebar-text-muted: #64748B;
  --pl-sidebar-active-bg: rgba(0,0,0,0.06);
  --pl-sidebar-border: #E2E8F0;

  /* Header / Footer */
  --pl-header-bg: rgba(255,255,255,0.95);
  --pl-footer-bg: #FFFFFF;

  /* Chart-specific */
  --pl-chart-grid: #E2E8F0;
  --pl-chart-tooltip-bg: #FFFFFF;
  --pl-chart-tooltip-border: #E2E8F0;
  --pl-chart-bar-track: #F1F5F9;

  /* Map-specific */
  --pl-map-bg: #EDF2F7;
  --pl-map-road: #94A3B8;
  --pl-map-road-minor: #CBD5E1;
  --pl-map-label: #CBD5E1;
  --pl-map-stop-label: #475569;
}

/* ── Dark mode ────────────────────────────────── */
.dark {
  --pl-text: #F1F5F9;
  --pl-text-secondary: #CBD5E0;
  --pl-text-muted: #94A3B8;
  --pl-text-faint: #64748B;

  --pl-bg: #111827;
  --pl-card: #1E293B;
  --pl-card-alt: #162032;
  --pl-border: #334155;
  --pl-shadow: 0 1px 3px rgba(0,0,0,0.3);
  --pl-hover: rgba(255,255,255,0.04);
  --pl-stripe: rgba(255,255,255,0.03);

  --pl-sidebar-bg-start: #1E293B;
  --pl-sidebar-bg-end: #0F172A;
  --pl-sidebar-text: #FFFFFF;
  --pl-sidebar-text-muted: rgba(255,255,255,0.65);
  --pl-sidebar-active-bg: rgba(255,255,255,0.10);
  --pl-sidebar-border: rgba(232,121,249,0.12);

  --pl-header-bg: rgba(15,23,42,0.95);
  --pl-footer-bg: #0F172A;

  --pl-chart-grid: #334155;
  --pl-chart-tooltip-bg: #1E293B;
  --pl-chart-tooltip-border: #334155;
  --pl-chart-bar-track: rgba(255,255,255,0.06);

  --pl-map-bg: #1E293B;
  --pl-map-road: #475569;
  --pl-map-road-minor: #334155;
  --pl-map-label: #475569;
  --pl-map-stop-label: #CBD5E0;
}
```

- [ ] **Step 2: Verify file created**

Run: `cat styles/proofline-vars.css | head -5`
Expected: Shows the comment header and `:root {`

- [ ] **Step 3: Commit**

```bash
git add styles/proofline-vars.css
git commit -m "feat(proofline): add light/dark CSS custom properties"
```

---

### Task 2: Add theme toggle to DemoShell

**Files:**
- Modify: `components/demo-shell/DemoShell.tsx`

Add a Sun/Moon toggle button in the header bar (right side, before the "Interactive Demo" badge). The toggle manages a `.dark` class on the shell root `<div>` and persists to `localStorage` under key `proofline-theme`. Default mode is dark.

**Important:** The DemoShell is shared across ALL demos (not just PROOFLINE). The toggle should only render when the demo config opts in. We'll add an optional `darkMode?: boolean` field to the config — when truthy, the toggle appears.

**Spec deviation:** The spec says `types.ts` needs no changes. We override this — opt-in gating via `darkMode` flag prevents the toggle from leaking into other demos. This is a minimal, backward-compatible addition.

- [ ] **Step 1: Add `darkMode` to DemoConfig type**

Modify `components/demo-shell/types.ts` — add to the `DemoConfig` interface:

```typescript
export interface DemoConfig {
  client: ClientBranding;
  product: ProductBranding;
  theme: ThemeConfig;
  nav: NavSection[];
  footer: FooterConfig;
  darkMode?: boolean; // Enable light/dark toggle in header
}
```

- [ ] **Step 2: Add `darkMode` to defineDemo input type**

Modify `components/demo-shell/define-demo.ts` — add `darkMode` passthrough:

```typescript
interface DefineDemoInput {
  // ... existing fields ...
  darkMode?: boolean;
}

export function defineDemo(input: DefineDemoInput): DemoConfig {
  return {
    // ... existing fields ...
    darkMode: input.darkMode,
  };
}
```

- [ ] **Step 3: Add toggle logic and button to DemoShell**

Modify `components/demo-shell/DemoShell.tsx`:

**3a. Add imports:**
```typescript
import { useState, useEffect } from 'react';
```
(useState is already imported; add useEffect)

**3b. Add dark mode state after `const [sidebarOpen, setSidebarOpen] = useState(false);`:**
```typescript
// Dark mode toggle (only active when config.darkMode is true)
const [isDark, setIsDark] = useState(true); // default: dark

useEffect(() => {
  if (!config.darkMode) return;
  const saved = localStorage.getItem('proofline-theme');
  if (saved === 'light') setIsDark(false);
  if (saved === 'dark') setIsDark(true);
}, [config.darkMode]);

const toggleTheme = () => {
  setIsDark((prev) => {
    const next = !prev;
    localStorage.setItem('proofline-theme', next ? 'dark' : 'light');
    return next;
  });
};
```

**3c. Add `.dark` class to root div:**

Change the root `<div>`:
```tsx
<div
  className={`h-screen flex overflow-hidden${config.darkMode && isDark ? ' dark' : ''}`}
  style={themeVars as React.CSSProperties}
>
```

**3d. Add sidebar CSS var overrides:**

Change the sidebar `<aside>` style:
```tsx
style={{
  background: config.darkMode
    ? `linear-gradient(180deg, var(--pl-sidebar-bg-start) 0%, var(--pl-sidebar-bg-end) 100%)`
    : `linear-gradient(180deg, var(--prizym-bg-secondary) 0%, var(--prizym-bg-primary) 100%)`,
}}
```

**3e. Wire ALL 6 sidebar tokens into DemoShell sidebar elements:**

The sidebar uses hardcoded `text-white`, `text-white/65`, `bg-white/[0.10]`, `hover:bg-white/[0.04]` Tailwind classes. When `config.darkMode` is true, override these with CSS var inline styles:

- Logo text (`text-white`) → add `style={{ color: 'var(--pl-sidebar-text)' }}` when darkMode
- Tagline (`color: ${primaryColor}AA`) → keep as-is (accent color)
- Section headers (`color: ${sectionClr}CC`) → keep as-is (accent color)
- Nav items active: `bg-white/[0.10]` → add `background: 'var(--pl-sidebar-active-bg)'`
- Nav items inactive text: `text-white/65` → add `color: 'var(--pl-sidebar-text-muted)'`
- Nav items hover: `hover:bg-white/[0.04]` → handled by `--pl-hover`
- Sidebar border (`var(--prizym-border-subtle)`) → change to `var(--pl-sidebar-border)` when darkMode
- Client info card: `text-white/90` → add `color: 'var(--pl-sidebar-text)'`

This ensures all 6 sidebar tokens (`--pl-sidebar-bg-start`, `--pl-sidebar-bg-end`, `--pl-sidebar-text`, `--pl-sidebar-text-muted`, `--pl-sidebar-active-bg`, `--pl-sidebar-border`) are consumed.

**3f. Add toggle button in header, before the "Interactive Demo" badge:**

Inside the header, replace the `ml-auto` badge div with:
```tsx
<div className="ml-auto flex items-center gap-3">
  {config.darkMode && (
    <button
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
      style={{
        background: 'var(--pl-hover, rgba(0,0,0,0.04))',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <LucideIcons.Sun className="h-4 w-4" style={{ color: '#F59E0B' }} />
      ) : (
        <LucideIcons.Moon className="h-4 w-4" style={{ color: 'var(--pl-text-muted)' }} />
      )}
    </button>
  )}
  <div
    className="flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[13px] font-medium shadow-sm shimmer"
    style={{
      border: `1px solid ${primaryColor}40`,
      background: `${primaryColor}0F`,
      color: primaryColor,
    }}
  >
    <div
      className="h-2 w-2 animate-pulse rounded-full"
      style={{ background: primaryColor, boxShadow: `0 0 6px ${primaryColor}66` }}
    />
    {config.product.badge ?? 'Interactive Demo'}
  </div>
</div>
```

**3g. Update header background to use CSS vars when darkMode:**
```tsx
style={{
  background: config.darkMode
    ? 'var(--pl-header-bg)'
    : `color-mix(in srgb, var(--prizym-bg-content) 95%, transparent)`,
  borderBottom: `1px solid var(--prizym-border-default)`,
}}
```

**3h. Update main content area background:**
```tsx
<main
  className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8"
  style={{ background: config.darkMode ? 'var(--pl-bg)' : 'var(--prizym-bg-content)' }}
>
```

**3i. Update footer background:**
```tsx
<footer
  className="shrink-0"
  style={{
    background: config.darkMode ? 'var(--pl-footer-bg)' : 'var(--prizym-bg-content)',
    borderTop: `1px solid var(--prizym-border-default)`,
  }}
>
```

- [ ] **Step 4: Verify the toggle renders**

Run: `pnpm dev` and visit `http://localhost:3100/proofline-andrews/strategy/mandate`
Expected: No toggle visible yet (darkMode not set in config)

- [ ] **Step 5: Commit**

```bash
git add components/demo-shell/DemoShell.tsx components/demo-shell/types.ts components/demo-shell/define-demo.ts
git commit -m "feat(proofline): add dark/light toggle to DemoShell header"
```

---

### Task 3: Wire up proofline-andrews layout

**Files:**
- Modify: `app/(demos)/proofline-andrews/layout.tsx`
- Modify: `app/(demos)/proofline-andrews/demo.config.ts`

- [ ] **Step 1: Import CSS vars in layout**

```tsx
'use client';

import '@/styles/proofline-vars.css';
import { DemoShell } from '@/components/demo-shell';
import demoConfig from './demo.config';

export default function ProoflineLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
```

- [ ] **Step 2: Enable darkMode in demo config**

In `app/(demos)/proofline-andrews/demo.config.ts`, add `darkMode: true`:

```typescript
export default defineDemo({
  client: { /* unchanged */ },
  product: { /* unchanged */ },
  theme: 'barrel-brass',
  colors: { primary: '#C6A052', accent: '#B87333' },
  darkMode: true,
  nav: [ /* unchanged */ ],
  footer: { /* unchanged */ },
});
```

- [ ] **Step 3: Verify toggle works**

Visit `http://localhost:3100/proofline-andrews/strategy/mandate`
Expected: Sun/Moon toggle visible in header. Clicking it toggles the `.dark` class. Background should change between light (`#F8FAFC`) and dark (`#111827`). Content won't fully respond yet — that comes in chunks 2-4.

- [ ] **Step 4: Verify localStorage persistence**

Click the toggle to light mode, refresh the page.
Expected: Page loads in light mode (persisted).

- [ ] **Step 5: Commit**

```bash
git add app/(demos)/proofline-andrews/layout.tsx app/(demos)/proofline-andrews/demo.config.ts
git commit -m "feat(proofline): wire toggle to Andrews demo layout"
```

---

## Chunk 2: Shared Component Migration (14 files)

All shared components live in `components/demos/proofline/`. The migration pattern is the same: replace hardcoded hex values with `var(--pl-*)` references.

**Replacement rules** (from spec):

| Find | Replace |
|------|---------|
| `color: '#1A1A2E'` | `color: 'var(--pl-text)'` |
| `color: '#4A5568'` | `color: 'var(--pl-text-secondary)'` |
| `color: '#718096'` | `color: 'var(--pl-text-muted)'` |
| `color: '#A0AEC0'` | `color: 'var(--pl-text-faint)'` |
| Tailwind `bg-white` (on cards) | add `style={{ background: 'var(--pl-card)' }}` |
| `borderColor: '#E2E8F0'` | `borderColor: 'var(--pl-border)'` |
| `border: '1px solid #E2E8F0'` | `border: '1px solid var(--pl-border)'` |
| `boxShadow: '0 1px 3px rgba(0,0,0,0.06)'` | `boxShadow: 'var(--pl-shadow)'` |
| `background: '#F1F5F9'` | `background: 'var(--pl-chart-bar-track)'` |
| `background: '#F7FAFC'` | `background: 'var(--pl-card-alt)'` |
| `fill="#1A1A2E"` / `fill: '#1A1A2E'` | `fill="var(--pl-text)"` / `fill: 'var(--pl-text)'` |
| `fill="#718096"` / `fill: '#718096'` | `fill="var(--pl-text-muted)"` / etc. |
| `fill="#A0AEC0"` | `fill="var(--pl-text-faint)"` |
| `fill="#F1F5F9"` | `fill="var(--pl-chart-bar-track)"` |
| Tailwind `bg-[#F8FAFC]` | replace with `style={{ background: 'var(--pl-stripe)' }}` |
| Tailwind `text-slate-*` classes used for text colors | replace with appropriate `var(--pl-text-*)` inline style |
| Tailwind `border-slate-100` | add inline `borderColor: 'var(--pl-border)'` |

**Note on Tailwind classes:** Many components use Tailwind `text-slate-*` and `bg-slate-*` classes. These don't respond to our `.dark` class system. Replace them with inline `style` using `var(--pl-*)` tokens.

### Task 4: Migrate LightSectionCard

**Files:**
- Modify: `components/demos/proofline/LightSectionCard.tsx`

- [ ] **Step 1: Replace hardcoded colors**

```tsx
interface LightSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LightSectionCard({ title, children, className }: LightSectionCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${className ?? ''}`}
      style={{
        background: 'var(--pl-card)',
        borderColor: 'var(--pl-border)',
        boxShadow: 'var(--pl-shadow)',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-[1.5px] font-mono mb-4"
        style={{ color: 'var(--pl-text-muted)' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
```

Note: Remove `bg-white` from className — it's now handled by the inline `background` style.

- [ ] **Step 2: Verify visually**

Visit any PROOFLINE page that uses `LightSectionCard` (e.g., `/proofline-andrews/strategy/mandate`).
Toggle dark mode — card background should change from white to `#1E293B`, title should change from `#718096` to `#94A3B8`.

- [ ] **Step 3: Commit**

```bash
git add components/demos/proofline/LightSectionCard.tsx
git commit -m "feat(proofline): migrate LightSectionCard to CSS vars"
```

---

### Task 5: Migrate LightKpiCard

**Files:**
- Modify: `components/demos/proofline/LightKpiCard.tsx`

- [ ] **Step 1: Replace hardcoded colors**

Replace these specific values:
- `bg-white` → remove from className, add `background: 'var(--pl-card)'` to existing style
- `borderColor: '#E2E8F0'` → `borderColor: 'var(--pl-border)'`
- `boxShadow: '0 1px 3px rgba(0,0,0,0.06)'` → `boxShadow: 'var(--pl-shadow)'`
- `color: '#718096'` (label) → `color: 'var(--pl-text-muted)'`
- `color: '#1A1A2E'` (value) → `color: 'var(--pl-text)'`
- `color: '#718096'` (sub) → `color: 'var(--pl-text-muted)'`

Keep accent colors (`#10B981`, `#F87171`) unchanged — those are status colors.

- [ ] **Step 2: Verify visually**

Check a page using KPI cards. Toggle dark/light.

- [ ] **Step 3: Commit**

```bash
git add components/demos/proofline/LightKpiCard.tsx
git commit -m "feat(proofline): migrate LightKpiCard to CSS vars"
```

---

### Task 6: Migrate ActNavigation

**Files:**
- Modify: `components/demos/proofline/ActNavigation.tsx`

- [ ] **Step 1: Replace hardcoded colors**

Replace:
- `background: 'rgba(0,0,0,0.03)'` → `background: 'var(--pl-hover)'`
- `background: 'rgba(0,0,0,0.06)'` (inactive number bg) → `background: 'var(--pl-hover)'`
- `color: 'rgba(0,0,0,0.3)'` (inactive number) → `color: 'var(--pl-text-faint)'`
- `color: 'rgba(0,0,0,0.4)'` (inactive label) → `color: 'var(--pl-text-faint)'`
- `color: 'rgba(0,0,0,0.3)'` (inactive page count) → `color: 'var(--pl-text-faint)'`

Keep per-act accent colors unchanged (they're brand colors).

- [ ] **Step 2: Verify visually** — toggle dark/light, check act nav bar responds.

- [ ] **Step 3: Commit**

```bash
git add components/demos/proofline/ActNavigation.tsx
git commit -m "feat(proofline): migrate ActNavigation to CSS vars"
```

---

### Task 7: Migrate chart components (BarChart, LightBarChart, LightAreaChart, ProofDonutChart)

**Files:**
- Modify: `components/demos/proofline/BarChart.tsx`
- Modify: `components/demos/proofline/LightBarChart.tsx`
- Modify: `components/demos/proofline/LightAreaChart.tsx`
- Modify: `components/demos/proofline/ProofDonutChart.tsx`

- [ ] **Step 1: Migrate BarChart.tsx**

Replace:
- `color: '#718096'` (labels) → `color: 'var(--pl-text-muted)'`
- `background: '#F1F5F9'` (track) → `background: 'var(--pl-chart-bar-track)'`

- [ ] **Step 2: Migrate LightBarChart.tsx**

Replace:
- `color: '#4A5568'` (labels) → `color: 'var(--pl-text-secondary)'`
- `background: '#F1F5F9'` (track) → `background: 'var(--pl-chart-bar-track)'`

- [ ] **Step 3: Migrate LightAreaChart.tsx**

Replace:
- `stroke="#E2E8F0"` → `stroke="var(--pl-chart-grid)"`  (CartesianGrid)
- `fill: '#718096'` → `fill: 'var(--pl-text-muted)'` (XAxis/YAxis tick)
- Tooltip `contentStyle`:
  - `background: '#FFFFFF'` → `background: 'var(--pl-chart-tooltip-bg)'`
  - `border: '1px solid #E2E8F0'` → `border: '1px solid var(--pl-chart-tooltip-border)'`
  - `color: '#1A1A2E'` → `color: 'var(--pl-text)'`
- Legend `color: '#4A5568'` → `color: 'var(--pl-text-secondary)'`

**Note on recharts:** Recharts `tick` prop doesn't support CSS vars in all render modes. Pass `tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }}` — this works because recharts sets fill as an SVG attribute and CSS vars resolve at paint time.

- [ ] **Step 4: Migrate ProofDonutChart.tsx**

Replace default `labelColor` fallback:
- `labelColor ?? 'rgba(255,255,255,0.7)'` → `labelColor ?? 'var(--pl-text-muted)'`

**Note:** Callers that pass explicit `labelColor="#1A1A2E"` will be updated in the page migration (chunk 3/4). The component itself just needs the default to be theme-aware.

- [ ] **Step 5: Verify charts in dark mode**

Visit `/proofline-andrews/strategy/mandate` and `/proofline-andrews/strategy/portfolio` — check donut chart and bar charts respond to toggle.

- [ ] **Step 6: Commit**

```bash
git add components/demos/proofline/BarChart.tsx components/demos/proofline/LightBarChart.tsx components/demos/proofline/LightAreaChart.tsx components/demos/proofline/ProofDonutChart.tsx
git commit -m "feat(proofline): migrate chart components to CSS vars"
```

---

### Task 8: Migrate CoachingCard + DataSourceBadge + RepSelector

**Files:**
- Modify: `components/demos/proofline/CoachingCard.tsx`
- Modify: `components/demos/proofline/DataSourceBadge.tsx`
- Modify: `components/demos/proofline/RepSelector.tsx`

- [ ] **Step 1: Migrate CoachingCard.tsx**

Replace:
- `background: 'white'` → `background: 'var(--pl-card)'`
- `border: '1px solid #E2E8F0'` → `border: '1px solid var(--pl-border)'`
- `color: '#1A1A2E'` (rep name) → `color: 'var(--pl-text)'`
- `border-slate-100` (header border-b, footer border-t) → add inline `borderColor: 'var(--pl-border)'`
- `text-slate-400` classes → replace with `style={{ color: 'var(--pl-text-faint)' }}`
- `text-slate-600` classes → replace with `style={{ color: 'var(--pl-text-secondary)' }}`

- [ ] **Step 2: Migrate DataSourceBadge.tsx**

Replace:
- `text-slate-500` → `style={{ color: 'var(--pl-text-muted)' }}`
- `text-slate-400` → `style={{ color: 'var(--pl-text-faint)' }}`

- [ ] **Step 3: Migrate RepSelector.tsx**

Replace:
- `background: 'white'` → `background: 'var(--pl-card)'`
- `border: '1px solid #E2E8F0'` → `border: '1px solid var(--pl-border)'`
- `color: '#1A1A2E'` → `color: 'var(--pl-text)'`
- `text-slate-400` → `style={{ color: 'var(--pl-text-faint)' }}`

- [ ] **Step 4: Verify visually** — check day-planner page which uses all three.

- [ ] **Step 5: Commit**

```bash
git add components/demos/proofline/CoachingCard.tsx components/demos/proofline/DataSourceBadge.tsx components/demos/proofline/RepSelector.tsx
git commit -m "feat(proofline): migrate CoachingCard, DataSourceBadge, RepSelector to CSS vars"
```

---

### Task 9: Migrate RouteMap + StopCard

**Files:**
- Modify: `components/demos/proofline/RouteMap.tsx`
- Modify: `components/demos/proofline/StopCard.tsx`

- [ ] **Step 1: Migrate RouteMap.tsx**

Replace SVG fills:
- `fill="#EDF2F7"` (background rect) → `fill="var(--pl-map-bg)"`
- `stroke="#94A3B8"` / `strokeColor = '#94A3B8'` (highway) → use `var(--pl-map-road)`
- `stroke="#CBD5E1"` / `strokeColor = '#CBD5E1'` (minor road) → use `var(--pl-map-road-minor)`
- `fill="#94A3B8"` (road labels) → `fill="var(--pl-map-road)"`
- `fill="#CBD5E1"` (area labels) → `fill="var(--pl-map-label)"`
- `fill="#475569"` (stop name labels) → `fill="var(--pl-map-stop-label)"`
- `fill="#94A3B8"` (legend text) → `fill="var(--pl-map-road)"`

Keep stop marker colors unchanged (they're type-based accents).

- [ ] **Step 2: Migrate StopCard.tsx**

Replace:
- `background: 'white'` / `isActive ? '#F8FAFC' : 'white'` → `isActive ? 'var(--pl-stripe)' : 'var(--pl-card)'`
- `borderColor: '#E2E8F0'` → `borderColor: 'var(--pl-border)'` (when not active)
- `color: '#1A1A2E'` (account name) → `color: 'var(--pl-text)'`
- `text-slate-400` → use `style={{ color: 'var(--pl-text-faint)' }}`
- `text-slate-500` → use `style={{ color: 'var(--pl-text-muted)' }}`
- `text-slate-600` → use `style={{ color: 'var(--pl-text-secondary)' }}`
- `text-slate-700` → use `style={{ color: 'var(--pl-text-secondary)' }}`
- `text-slate-800` → use `style={{ color: 'var(--pl-text)' }}`
- `border-slate-100` → add inline `borderColor: 'var(--pl-border)'`
- `bg-slate-100` (manifest pills) → add inline `background: 'var(--pl-stripe)', color: 'var(--pl-text-secondary)'`

- [ ] **Step 3: Verify visually** — check day-planner page with map and stop cards.

- [ ] **Step 4: Commit**

```bash
git add components/demos/proofline/RouteMap.tsx components/demos/proofline/StopCard.tsx
git commit -m "feat(proofline): migrate RouteMap and StopCard to CSS vars"
```

---

## Chunk 3: Page Migration — Acts 1 & 2

All page files live under `app/(demos)/proofline-andrews/`. The migration pattern is identical: replace hardcoded inline styles with CSS var references.

**Common patterns across ALL pages:**

| Pattern | Replacement |
|---------|-------------|
| `style={{ color: '#1A1A2E' }}` | `style={{ color: 'var(--pl-text)' }}` |
| `style={{ color: '#4A5568' }}` | `style={{ color: 'var(--pl-text-secondary)' }}` |
| `style={{ color: '#718096' }}` | `style={{ color: 'var(--pl-text-muted)' }}` |
| `style={{ color: '#A0AEC0' }}` | `style={{ color: 'var(--pl-text-faint)' }}` |
| `bg-white` (on cards/containers) | Remove class, add `style={{ background: 'var(--pl-card)' }}` |
| `bg-[#F8FAFC]` | Remove class, add `style={{ background: 'var(--pl-stripe)' }}` |
| `borderColor: '#E2E8F0'` | `borderColor: 'var(--pl-border)'` |
| `boxShadow: '0 1px 3px rgba(0,0,0,0.06)'` | `boxShadow: 'var(--pl-shadow)'` |
| `background: '#F7FAFC'` | `background: 'var(--pl-card-alt)'` |
| `background: '#F1F5F9'` | `background: 'var(--pl-chart-bar-track)'` |
| `fill="#1A1A2E"` | `fill="var(--pl-text)"` |
| `fill="#718096"` | `fill="var(--pl-text-muted)"` |
| `fill="#A0AEC0"` | `fill="var(--pl-text-faint)"` |
| `fill="#F1F5F9"` | `fill="var(--pl-chart-bar-track)"` (spec says `--pl-border` — plan overrides: semantically correct for fills) |
| `stroke="#E2E8F0"` (CartesianGrid) | `stroke="var(--pl-chart-grid)"` |
| Tooltip `background: '#FFFFFF'` | `background: 'var(--pl-chart-tooltip-bg)'` |
| Tooltip `border: '1px solid #E2E8F0'` | `border: '1px solid var(--pl-chart-tooltip-border)'` |
| `labelColor="#1A1A2E"` (ProofDonutChart prop) | `labelColor="var(--pl-text)"` |
| Tailwind `text-slate-*` used for content text | Replace with inline `style={{ color: 'var(--pl-text-*)' }}` |
| `className="... bg-white ..."` with existing style | Merge: remove `bg-white`, add `background: 'var(--pl-card)'` to style |

**Leave unchanged:**
- Accent/brand colors: `#C6A052`, `#10B981`, `#2563EB`, `#7C3AED`, `#F59E0B`, `#F87171`, `#22C55E`, `#B87333`
- Status colors (success green, danger red, warning amber)
- `rgba(198,160,82,*)` gold accent backgrounds
- Font families, font sizes, spacing, layout

### Task 10: Migrate Act 1 pages (3 files)

**Files:**
- Modify: `app/(demos)/proofline-andrews/strategy/mandate/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/portfolio/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/market/page.tsx`

- [ ] **Step 1: Migrate mandate/page.tsx**

Apply replacement rules. Key spots in this file:
- Hero section: `color: '#1A1A2E'` (h1), `color: '#718096'` (subtitle)
- KPI hero cards: `bg-white`, `borderColor: '#E2E8F0'`, `boxShadow: '0 1px 3px rgba(0,0,0,0.06)'`, `color: '#718096'` (labels)
- Donut legend: `color: '#1A1A2E'` (names), `color: '#718096'` (shares)
- YoY table: `color: '#718096'` (header, values), `color: '#1A1A2E'` (metrics, targets), `bg-[#F8FAFC]` (striped rows)
- Priority cards: `bg-white`, `borderColor: '#E2E8F0'`, `color: '#1A1A2E'` (titles), `color: '#718096'` (descs)
- Quote block: `color: '#4A5568'` (text)
- `labelColor="#1A1A2E"` on ProofDonutChart → `labelColor="var(--pl-text)"`

- [ ] **Step 2: Migrate portfolio/page.tsx**

Apply same replacement rules. Read file first, identify all hardcoded colors, replace per table.

- [ ] **Step 3: Migrate market/page.tsx**

Apply same replacement rules.

- [ ] **Step 4: Verify Act 1 visually**

Navigate through all 3 Act 1 pages. Toggle dark/light. All text, cards, borders, tables should respond.

- [ ] **Step 5: Commit**

```bash
git add app/(demos)/proofline-andrews/strategy/mandate/page.tsx app/(demos)/proofline-andrews/strategy/portfolio/page.tsx app/(demos)/proofline-andrews/strategy/market/page.tsx
git commit -m "feat(proofline): migrate Act 1 pages to CSS vars"
```

---

### Task 11: Migrate Act 2 pages (7 files)

**Files:**
- Modify: `app/(demos)/proofline-andrews/strategy/territories/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/territories/[hometown]/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/territories/[hometown]/client.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/quotas/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/accounts/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/mix/page.tsx`
- Modify: `app/(demos)/proofline-andrews/strategy/scenarios/page.tsx`

- [ ] **Step 1: Read and migrate territories/page.tsx**

Apply replacement rules.

- [ ] **Step 2: Read and migrate territories/[hometown]/page.tsx + client.tsx**

Apply replacement rules to both files. The `client.tsx` file is the interactive component.

- [ ] **Step 3: Read and migrate quotas/page.tsx**

Apply replacement rules.

- [ ] **Step 4: Read and migrate accounts/page.tsx**

Apply replacement rules.

- [ ] **Step 5: Read and migrate mix/page.tsx**

Apply replacement rules.

- [ ] **Step 6: Read and migrate scenarios/page.tsx**

Apply replacement rules.

- [ ] **Step 7: Verify Act 2 visually**

Navigate through all Act 2 pages. Toggle dark/light.

- [ ] **Step 8: Commit**

```bash
git add app/(demos)/proofline-andrews/strategy/
git commit -m "feat(proofline): migrate Act 2 pages to CSS vars"
```

---

## Chunk 4: Page Migration — Acts 3 & 4

### Task 12: Migrate Act 3 pages (12 files)

**Files:**
- Modify: `app/(demos)/proofline-andrews/ops/day-planner/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/day-planner/stop/[id]/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/day-planner/stop/[id]/client.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/dispatch/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/field-intel/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/compliance/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/inventory/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/manager/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/manager/rep/[id]/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/manager/rep/[id]/client.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/ai/page.tsx`
- Modify: `app/(demos)/proofline-andrews/ops/ai/forecasting/page.tsx`

- [ ] **Step 1: Read and migrate day-planner/page.tsx**

This is a large file with the 3-pane layout (stop list, map, detail panel). Apply all replacement rules. Pay special attention to:
- Tab buttons: `background: '#F1F5F9'` → `background: 'var(--pl-chart-bar-track)'`, `color: '#718096'` → `color: 'var(--pl-text-muted)'`
- Stop detail panel text colors
- Slate Tailwind classes throughout

- [ ] **Step 2: Read and migrate day-planner/stop/[id]/page.tsx + client.tsx**

Apply replacement rules.

- [ ] **Step 3: Read and migrate dispatch/page.tsx**

Apply replacement rules.

- [ ] **Step 4: Read and migrate field-intel/page.tsx**

Apply replacement rules.

- [ ] **Step 5: Read and migrate compliance/page.tsx**

Apply replacement rules.

- [ ] **Step 6: Read and migrate inventory/page.tsx**

Apply replacement rules.

- [ ] **Step 7: Read and migrate manager/page.tsx**

Apply replacement rules.

- [ ] **Step 8: Read and migrate manager/rep/[id]/page.tsx + client.tsx**

Apply replacement rules.

- [ ] **Step 9: Read and migrate ai/page.tsx**

Apply replacement rules.

- [ ] **Step 10: Read and migrate ai/forecasting/page.tsx**

Apply replacement rules.

- [ ] **Step 11: Verify Act 3 visually**

Navigate through all Act 3 pages. Toggle dark/light. Special attention to day-planner map, stop cards, and detail panels.

- [ ] **Step 12: Commit**

```bash
git add app/(demos)/proofline-andrews/ops/
git commit -m "feat(proofline): migrate Act 3 pages to CSS vars"
```

---

### Task 13: Migrate Act 4 pages (8 files)

**Files:**
- Modify: `app/(demos)/proofline-andrews/comp/plan/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/emco/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/kickers/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/calculator/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/visibility/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/story/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/inquiries/page.tsx`
- Modify: `app/(demos)/proofline-andrews/comp/impact/page.tsx`

- [ ] **Step 1: Read and migrate plan/page.tsx**

This file contains the TierTrack SVG component inline. Apply replacement rules to both the page and the SVG:
- SVG `fill="#1A1A2E"` → `fill="var(--pl-text)"`
- SVG `fill="#F1F5F9"` → `fill="var(--pl-chart-bar-track)"`
- SVG `fill="#A0AEC0"` → `fill="var(--pl-text-faint)"`
- All inline `color:` and `background:` styles per table

- [ ] **Step 2: Read and migrate emco/page.tsx**

Apply replacement rules.

- [ ] **Step 3: Read and migrate kickers/page.tsx**

Apply replacement rules.

- [ ] **Step 4: Read and migrate calculator/page.tsx**

Apply replacement rules. This has a 3-pane interactive layout — be careful with slider/input backgrounds.

- [ ] **Step 5: Read and migrate visibility/page.tsx**

Apply replacement rules.

- [ ] **Step 6: Read and migrate story/page.tsx**

Apply replacement rules.

- [ ] **Step 7: Read and migrate inquiries/page.tsx**

Apply replacement rules.

- [ ] **Step 8: Read and migrate impact/page.tsx**

Apply replacement rules.

- [ ] **Step 9: Verify Act 4 visually**

Navigate through all 8 Act 4 pages. Toggle dark/light. Special attention to tier track SVG, EMCO gate rings, calculator sliders.

- [ ] **Step 10: Commit**

```bash
git add app/(demos)/proofline-andrews/comp/
git commit -m "feat(proofline): migrate Act 4 pages to CSS vars"
```

---

### Task 14: Migrate homepage + final verification

**Files:**
- Modify: `app/(demos)/proofline-andrews/page.tsx` (landing/overview page)

- [ ] **Step 1: Read and migrate page.tsx**

Apply replacement rules to the PROOFLINE Andrews homepage.

- [ ] **Step 2: Full smoke test**

Navigate through ALL pages in all 4 acts, toggling dark/light on each:
1. Homepage
2. Act 1: mandate, portfolio, market
3. Act 2: territories, territories/[hometown], quotas, accounts, mix, scenarios
4. Act 3: day-planner, day-planner/stop/[id], dispatch, field-intel, compliance, inventory, manager, manager/rep/[id], ai, ai/forecasting
5. Act 4: plan, emco, kickers, calculator, visibility, story, inquiries, impact

Check for:
- Any remaining hardcoded `#1A1A2E`, `#718096`, `#E2E8F0` that didn't get migrated
- Text readability in both modes
- Chart tooltips and axis labels
- SVG fills and strokes
- Table striping
- Card borders and shadows

- [ ] **Step 3: Commit**

```bash
git add app/(demos)/proofline-andrews/page.tsx
git commit -m "feat(proofline): migrate homepage + complete dark/light toggle"
```

- [ ] **Step 4: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No type errors (we only changed string values, not types).

- [ ] **Step 5: Grep for stragglers**

```bash
grep -rn "'#1A1A2E'\|'#718096'\|'#E2E8F0'\|'#4A5568'\|'#A0AEC0'" app/(demos)/proofline-andrews/ components/demos/proofline/
```

Expected: No matches (all migrated). If any remain, fix them.

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add app/(demos)/proofline-andrews/ components/demos/proofline/
git commit -m "fix(proofline): dark/light toggle polish"
```
