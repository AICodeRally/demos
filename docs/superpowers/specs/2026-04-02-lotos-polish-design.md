# LotOS Polish — Surface + Interactive Upgrades

**Date:** 2026-04-02  
**Status:** Approved  
**Scope:** Visual polish, token system, light/dark fix, interactive animations across all 24 LotOS pages

## Goals

1. Bring LotOS visual quality to Phoenix Edge Rally level
2. Fix light/dark mode so it works reliably across all pages
3. Replace inline style hardcodes with a CSS variable token system
4. Add interactive polish: count-up animations, fade-ins, collapsible sections, hover states

## 1. Token System — `lotos.css`

New CSS file loaded by LotOS layout. Mirrors Phoenix's `--pi-*` pattern with `--lot-*` prefix.

### Light Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--lot-bg` | `#f8fafc` | Page background |
| `--lot-card` | `#ffffff` | Card backgrounds |
| `--lot-card-alt` | `#f9fafb` | Alternate card bg |
| `--lot-border` | `#e5e7eb` | Standard borders |
| `--lot-border-faint` | `#f1f5f9` | Subtle borders, stripes |
| `--lot-text` | `#0f172a` | Primary text |
| `--lot-text-secondary` | `#1e293b` | Secondary text |
| `--lot-text-muted` | `#475569` | Muted text, metadata |
| `--lot-shadow` | `0 1px 3px rgba(0,0,0,0.06)` | Card shadows |
| `--lot-hover` | `rgba(0,0,0,0.04)` | Hover overlay |
| `--lot-stripe` | `#f1f5f9` | Row striping |

### Dark Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--lot-bg` | `#0f172a` | Page background |
| `--lot-card` | `#1e293b` | Card backgrounds |
| `--lot-card-alt` | `#162032` | Alternate card bg |
| `--lot-border` | `#334155` | Standard borders |
| `--lot-border-faint` | `#1e293b` | Subtle borders |
| `--lot-text` | `#f1f5f9` | Primary text |
| `--lot-text-secondary` | `#cbd5e0` | Secondary text |
| `--lot-text-muted` | `#94a3b8` | Muted text |
| `--lot-shadow` | `0 1px 3px rgba(0,0,0,0.3)` | Card shadows |
| `--lot-hover` | `rgba(255,255,255,0.04)` | Hover overlay |
| `--lot-stripe` | `rgba(255,255,255,0.03)` | Row striping |

### Act Accent Colors (unchanged across modes)

| Act | Color | Hex |
|-----|-------|-----|
| 1 — The Lot | Navy | `#1E3A5F` |
| 2 — Sales Floor | Blue | `#2563EB` |
| 3 — Deal Desk | Orange | `#E85D2C` |
| 4 — Back Office | Purple | `#7C3AED` |
| 5 — Command Center | Green | `#059669` |
| 6 — AskLotOS | Red | `#DC2626` |

## 2. Typography

- **Font:** DM Sans via `next/font/google` in layout.tsx
- **Variable:** `--font-dm-sans` on body

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Page headings | `1.75rem` (28px) | 800 | 1.2 |
| Section titles | `1.15rem` (18.4px) | 700 | 1.3 |
| Body text | `1rem` (16px) | 400 | 1.6 |
| Captions/labels | `0.875rem` (14px) | 700 | 1.4 |
| Minimum | 14px | — | — |

Text colors use `--lot-text`, `--lot-text-secondary`, `--lot-text-muted` tokens — no hardcoded hex in page files.

## 3. Component Styling

### Cards
- `border-radius: 12px`
- `border: 1px solid var(--lot-border)`
- `background: var(--lot-card)`
- `box-shadow: var(--lot-shadow)`
- `padding: 20px`
- Hover: shadow lifts to `0 4px 12px rgba(0,0,0,0.12)`, border highlights with act accent

### Buttons
- `border-radius: 8px`
- `font-weight: 700`
- `padding: 10px 20px`
- Hover: `translateY(-1px)` + shadow
- Active: `translateY(0)`

### Tables
- Header: uppercase, `0.875rem`, `700` weight, `0.05em` letter-spacing
- Rows: `1px solid var(--lot-border-faint)` bottom border
- Row hover: `var(--lot-hover)` background
- Cell padding: `10px`

### StatCard, StatusBadge, DetailPanel
- Replace inline colors with `var(--lot-*)` tokens
- StatCard gains count-up animation (see below)

## 4. Interactive Upgrades

### Count-Up Animation (`useCountUp` hook)
- New file: `components/demos/lotos/useCountUp.ts`
- Parameters: `endValue`, `duration` (default 800ms), `decimals`
- Easing: ease-out cubic
- Triggers on mount
- Applied to all StatCard numeric values

### Fade-In on Mount (`lot-fade-in` keyframe)
- `opacity: 0, translateY(8px)` → `opacity: 1, translateY(0)`
- Duration: 0.3s ease-out
- CSS class: `.lot-animate-in`
- Stagger: each card delayed by `index * 0.06s`
- Applied to: stat cards, data tables, detail sections

### Collapsible Sections (`CollapsibleSection.tsx`)
- New file: `components/demos/lotos/CollapsibleSection.tsx`
- Props: `title`, `defaultOpen`, `accentColor`, `children`
- Chevron icon rotates 90° on collapse (200ms ease)
- Content height transition
- Used on long tables/lists where page scrolling gets excessive

### Hover & Focus States
- Cards: shadow lift + accent border on hover
- Table rows: background highlight on hover
- Buttons: translateY lift
- Focus ring: `2px solid` act accent, `2px` offset
- All interactive elements: `cursor: pointer`

### Progress Bar Animation
- Width transition: `0.8s ease-out`
- Triggers on mount (start at 0%, animate to target)
- Applied to KPI bars, aging distribution bars

## 5. Files Changed

### New Files (3)
- `components/demos/lotos/lotos.css` — token system + animations + component classes
- `components/demos/lotos/useCountUp.ts` — count-up hook
- `components/demos/lotos/CollapsibleSection.tsx` — collapsible wrapper

### Modified Files (26)
- `app/(demos)/lotos/layout.tsx` — DM Sans import, load lotos.css
- All 24 page files — replace inline hex with `var(--lot-*)`, add animation classes, use DM Sans sizing
- `components/demos/lotos/StatCard.tsx` — integrate useCountUp, fade-in, token colors

### Not Changed
- `demo.config.ts` — act colors and nav structure stay the same
- `data/lotos/*` — mock data untouched
- Other demos — no cross-contamination

## 6. Light/Dark Mode Fix

Current state: `clean-light` preset defines dark tokens, DemoShell toggles `.dark` class. Problem: pages hardcode light-only hex values in inline styles, so dark mode shows dark backgrounds with dark text.

Fix: All inline color references (`#1C1917`, `#57534E`, `#F8FAFC`, `#E7E5E4`, etc.) replaced with `var(--lot-*)` tokens. The CSS file defines both `:root` and `.dark` variants. No per-page dark mode logic needed — it just works.

## 7. Out of Scope

- No new pages or navigation changes
- No new data or mock content
- No AI insight cards, font size controls, or loading skeletons (those are Option C)
- No changes to DemoShell or shared shell components
- No changes to other demos
