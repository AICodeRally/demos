# PROOFLINE Dark/Light Toggle — Design Spec

**Date:** 2026-03-10
**Status:** Approved
**Repo:** demos (~/Development/demos)
**Scope:** proofline-andrews demo (~30 pages + DemoShell + shared components)

## Problem

The PROOFLINE Andrews demo has a dark sidebar but light content area with hardcoded hex colors across ~30 pages and ~15 shared components. There is no way to toggle between light and dark modes. The demo needs a full light/dark toggle for presentation flexibility.

## Solution

Two-mode toggle: **Full Light** and **Full Dark**. The toggle flips the entire UI — sidebar, header, content, cards, footer, charts — between modes. No mixed state.

## Toggle Location

Sun/Moon icon button in the DemoShell header bar, right side, next to the "Interactive Demo" badge. Persists preference in `localStorage`.

## Color Tokens

All pages and components migrate from hardcoded hex colors to CSS custom properties. Properties flip via a `.dark` class on the root element.

### Token Map

| Token | Light | Dark |
|-------|-------|------|
| `--pl-text` | `#1A1A2E` | `#F1F5F9` |
| `--pl-text-secondary` | `#4A5568` | `#CBD5E0` |
| `--pl-text-muted` | `#718096` | `#94A3B8` |
| `--pl-text-faint` | `#A0AEC0` | `#64748B` |
| `--pl-bg` | `#F8FAFC` | `#111827` |
| `--pl-card` | `#FFFFFF` | `#1E293B` |
| `--pl-card-alt` | `#F7FAFC` | `#162032` |
| `--pl-border` | `#E2E8F0` | `#334155` |
| `--pl-shadow` | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.3)` |
| `--pl-hover` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` |
| `--pl-stripe` | `#F8FAFC` | `rgba(255,255,255,0.03)` |

### Sidebar Tokens

| Token | Light | Dark |
|-------|-------|------|
| `--pl-sidebar-bg-start` | `#F1F5F9` | `#1E293B` |
| `--pl-sidebar-bg-end` | `#FFFFFF` | `#0F172A` |
| `--pl-sidebar-text` | `#1A1A2E` | `#FFFFFF` |
| `--pl-sidebar-text-muted` | `#64748B` | `rgba(255,255,255,0.65)` |
| `--pl-sidebar-active-bg` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.10)` |
| `--pl-sidebar-border` | `#E2E8F0` | `rgba(232,121,249,0.12)` |

### Header/Footer Tokens

| Token | Light | Dark |
|-------|-------|------|
| `--pl-header-bg` | `rgba(255,255,255,0.95)` | `rgba(15,23,42,0.95)` |
| `--pl-footer-bg` | `#FFFFFF` | `#0F172A` |

### Accent Colors (unchanged in both modes)

- `#C6A052` — PROOFLINE gold / primary
- `#10B981` — Act 4 green / success
- `#2563EB` — Act 3 blue
- `#7C3AED` — Act 2 purple
- `#F59E0B` — Warning / tier
- `#F87171` — Danger / alert
- `#22C55E` — Success

## Default Mode

Dark. Toggle switches to light. `localStorage` key: `proofline-theme`.

## Files Changed

### DemoShell (2 files)
- `components/demo-shell/DemoShell.tsx` — Add toggle button, dark class management, localStorage persistence. Sidebar styles use CSS vars instead of hardcoded gradients.
- `components/demo-shell/types.ts` — No changes needed (config shape unchanged).

### CSS Variables (1 file)
- New or extend existing: CSS var definitions with `.dark` variants. Could be in a `proofline-vars.css` imported by the demo layout, or injected via the theme system.

### Shared PROOFLINE Components (~15 files)
- `components/demos/proofline/LightSectionCard.tsx`
- `components/demos/proofline/LightKpiCard.tsx`
- `components/demos/proofline/ActNavigation.tsx`
- `components/demos/proofline/ProofDonutChart.tsx`
- `components/demos/proofline/LightBarChart.tsx`
- `components/demos/proofline/LightAreaChart.tsx`
- `components/demos/proofline/BarChart.tsx`
- `components/demos/proofline/Sparkline.tsx`
- `components/demos/proofline/CoachingCard.tsx`
- `components/demos/proofline/DataSourceBadge.tsx`
- `components/demos/proofline/MobilePreview.tsx`
- `components/demos/proofline/RepSelector.tsx`
- `components/demos/proofline/RouteMap.tsx`
- `components/demos/proofline/StopCard.tsx`

Replace `bg-white`, `#1A1A2E`, `#718096`, `#E2E8F0`, etc. with `var(--pl-*)` references.

### Page Files (~30 files)

**Act 1 — Corporate Strategy (3 pages)**
- `strategy/mandate/page.tsx`
- `strategy/portfolio/page.tsx`
- `strategy/market/page.tsx`

**Act 2 — Sales Strategy (7 pages)**
- `strategy/territories/page.tsx`
- `strategy/territories/[hometown]/page.tsx` + `client.tsx`
- `strategy/quotas/page.tsx`
- `strategy/accounts/page.tsx`
- `strategy/mix/page.tsx`
- `strategy/scenarios/page.tsx`

**Act 3 — Sales Operations (9 pages)**
- `ops/day-planner/page.tsx`
- `ops/day-planner/stop/[id]/page.tsx` + `client.tsx`
- `ops/dispatch/page.tsx`
- `ops/field-intel/page.tsx`
- `ops/compliance/page.tsx`
- `ops/inventory/page.tsx`
- `ops/manager/page.tsx`
- `ops/manager/rep/[id]/page.tsx` + `client.tsx`
- `ops/ai/page.tsx`
- `ops/ai/forecasting/page.tsx`

**Act 4 — Sales Compensation (8 pages)**
- `comp/plan/page.tsx`
- `comp/emco/page.tsx`
- `comp/kickers/page.tsx`
- `comp/calculator/page.tsx`
- `comp/visibility/page.tsx`
- `comp/story/page.tsx`
- `comp/inquiries/page.tsx`
- `comp/impact/page.tsx`

Each page: replace hardcoded inline `style={{ color: '#1A1A2E' }}` with `style={{ color: 'var(--pl-text)' }}`, `bg-white` with `style={{ background: 'var(--pl-card)' }}`, etc. SVG fills/strokes get the same treatment.

## Replacement Rules

| Find | Replace With |
|------|-------------|
| `color: '#1A1A2E'` | `color: 'var(--pl-text)'` |
| `color: '#4A5568'` | `color: 'var(--pl-text-secondary)'` |
| `color: '#718096'` | `color: 'var(--pl-text-muted)'` |
| `color: '#A0AEC0'` | `color: 'var(--pl-text-faint)'` |
| `bg-white` | `style={{ background: 'var(--pl-card)' }}` |
| `bg-[#F8FAFC]` | `style={{ background: 'var(--pl-stripe)' }}` |
| `borderColor: '#E2E8F0'` | `borderColor: 'var(--pl-border)'` |
| `fill="#1A1A2E"` | `fill="var(--pl-text)"` |
| `fill="#718096"` | `fill="var(--pl-text-muted)"` |
| `fill="#A0AEC0"` | `fill="var(--pl-text-faint)"` |
| `fill="#F1F5F9"` | `fill="var(--pl-border)"` |
| `background: '#F7FAFC'` | `background: 'var(--pl-card-alt)'` |
| `boxShadow: '0 1px 3px rgba(0,0,0,0.06)'` | `boxShadow: 'var(--pl-shadow)'` |

## Non-Goals

- No changes to page content, data, or logic
- No changes to the theme preset system architecture
- No changes to other demos (register, equipr, etc.)
- The sidebar in the DemoShell already has CSS var support via the theme system — we extend it, not replace it
