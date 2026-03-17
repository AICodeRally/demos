# DemoShell v2 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dual-shell system (DemoShell + SpmShell) with a unified plugin-based shell supporting sidebar, topnav, and wizard layouts.

**Architecture:** Plugin-based shell orchestrator with 3 layout plugins, 3-layer token system (palette → semantic → component), convention-over-configuration API, build-time auto-discovery registry, and one-shot codemod migration for all 13 demos.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript, Tailwind CSS v4, Lucide React, Zod (add dependency)

**Spec:** `docs/superpowers/specs/2026-03-17-demoshell-v2-design.md`

---

## File Structure

All new files live under `components/shell/`. Old `components/demo-shell/` and `components/spm-shell/` remain untouched until the codemod runs in Task 12.

```
components/shell/
├── DemoShell.tsx              # Orchestrator (resolves config, injects tokens, delegates to plugin)
├── registry.ts                # Plugin registry (Map<string, ShellLayout>)
├── index.ts                   # Public API: { DemoShell, defineDemo, useWizard }
├── plugins/
│   ├── sidebar.tsx            # Sidebar layout plugin (264px sidebar, collapsible sections)
│   ├── topnav.tsx             # Topnav layout plugin (gradient header, flat nav)
│   └── wizard.tsx             # Wizard layout plugin (guided + free explore modes)
├── parts/
│   ├── NavSection.tsx         # Collapsible or flat nav section with icons
│   ├── Footer.tsx             # Section nav row + attribution
│   ├── MobileDrawer.tsx       # Mobile overlay + slide-in sidebar
│   ├── ThemeToggle.tsx        # Dark/light mode toggle button
│   └── IconResolver.tsx       # Lucide icon lookup by string name
├── config/
│   ├── types.ts               # DemoConfig discriminated union, NavSection, SharedParts
│   ├── defineDemo.ts          # Convention-heavy config factory
│   ├── defaults.ts            # Smart defaults (footer, darkMode, layout)
│   ├── resolve.ts             # Config resolution (merge defaults, validate)
│   └── fs-nav-discovery.ts    # Filesystem nav auto-discovery algorithm
├── theme/
│   ├── types.ts               # Palette, SemanticTokens, ComponentTokens interfaces
│   ├── shade.ts               # Auto-generate shade scale (50-950) from single hex
│   ├── presets/               # 8 presets migrated to 3-layer format
│   │   ├── barrel-brass.ts
│   │   ├── midnight.ts
│   │   ├── clean-light.ts
│   │   ├── aegis-ivory.ts
│   │   ├── register-slate.ts
│   │   ├── charter-stone.ts
│   │   ├── prizym-navy.ts
│   │   ├── phoenix-sapphire.ts
│   │   └── index.ts
│   ├── resolve.ts             # Palette → Semantic → Component resolution
│   ├── css-vars.ts            # Token → CSS custom property generation
│   └── runtime.ts             # setTokens(), resetTokens() JS API
└── wizard/
    └── context.tsx            # WizardContext + useWizard hook

scripts/
├── generate-registry.ts       # Build-time demo registry generator
└── migrate-to-v2.ts           # One-shot codemod for all 13 demos

data/
└── demo-registry.ts           # Generated file (gitignored)

styles/ext/                    # Renamed extension token files (post-codemod)
├── proofline.css
├── proofline-route.css
├── meridian.css
└── phoenix-intel.css
```

---

## Task 1: Add Zod dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install zod**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm add zod
```

- [ ] **Step 2: Verify install**

```bash
cd /Users/toddlebaron/Development/aicr-demos && node -e "require('zod')"
```
Expected: No error

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add zod dependency for shell config validation"
```

---

## Task 2: Token System — Shade Generator

**Files:**
- Create: `components/shell/theme/shade.ts`
- Create: `components/shell/theme/types.ts`

- [ ] **Step 1: Create theme types**

```ts
// components/shell/theme/types.ts

/** Shade scale from lightest (50) to darkest (950) */
export interface ShadeScale {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
}

/** Layer 1 — raw color values */
export interface Palette {
  primary: ShadeScale;
  accent: ShadeScale;
  neutral: ShadeScale;
  success: string;
  danger: string;
  warning: string;
}

/** Layer 2 — meaning-aware, mode-dependent */
export interface SemanticTokens {
  bgPrimary: string;
  bgSecondary: string;
  bgContent: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  borderDefault: string;
  borderSubtle: string;
  shadowCard: string;
  shadowElevated: string;
}

/** Layer 3 — shell-specific component tokens */
export interface ComponentTokens {
  sidebarBg: string;
  sidebarText: string;
  sidebarTextMuted: string;
  sidebarBorder: string;
  sidebarActiveAccent: string;
  headerBg: string;
  headerBorder: string;
  footerBg: string;
  navSectionLabel: string;
  progressBarFill: string;
}

/** Full resolved preset */
export interface ThemePresetDef {
  palette: Palette;
  semantic: { dark: SemanticTokens; light: SemanticTokens };
  component: { dark: ComponentTokens; light: ComponentTokens };
}

/** Preset names (matching old system + same names) */
export type ThemePresetName =
  | 'barrel-brass' | 'midnight' | 'clean-light' | 'aegis-ivory'
  | 'register-slate' | 'charter-stone' | 'prizym-navy' | 'phoenix-sapphire';
```

- [ ] **Step 2: Create shade generator**

The shade generator takes a single hex color and produces a full 11-step shade scale by adjusting lightness in HSL space. The algorithm mirrors Tailwind's color generation approach.

```ts
// components/shell/theme/shade.ts
import type { ShadeScale } from './types';

/** Parse hex (#RGB or #RRGGBB) to [r, g, b] 0-255 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Convert RGB to HSL (h: 0-360, s: 0-100, l: 0-100) */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

/** Convert HSL back to hex */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Lightness targets for each shade step.
 * 50 is lightest, 950 is darkest. 500 is the base color.
 */
const LIGHTNESS_MAP: Record<keyof ShadeScale, number> = {
  50: 97, 100: 94, 200: 86, 300: 77, 400: 66,
  500: 50, 600: 41, 700: 33, 800: 24, 900: 17, 950: 10,
};

/**
 * Generate a full shade scale from a single hex color.
 * Preserves the hue and saturation, varies lightness.
 */
export function generateShades(hex: string): ShadeScale {
  const [h, s] = rgbToHsl(...hexToRgb(hex));
  const shades = {} as ShadeScale;
  for (const [step, lightness] of Object.entries(LIGHTNESS_MAP)) {
    (shades as Record<string, string>)[step] = hslToHex(h, s, lightness);
  }
  return shades;
}
```

- [ ] **Step 3: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/shell/theme/types.ts components/shell/theme/shade.ts
git commit -m "feat(shell): token system types and shade scale generator"
```

---

## Task 3: Token System — Presets + Resolution

**Files:**
- Create: `components/shell/theme/presets/barrel-brass.ts` (and 7 more)
- Create: `components/shell/theme/presets/index.ts`
- Create: `components/shell/theme/resolve.ts`
- Create: `components/shell/theme/css-vars.ts`
- Create: `components/shell/theme/runtime.ts`

**Context:** Each old preset (in `lib/theme/presets/`) is a flat `ThemeTokens` with 5 colors + 6 surfaces + 4 text + 2 shadows = 17 values. The new format expands to Palette (shade scales) + Semantic (dark/light) + Component (dark/light). We derive the new format from the old values so visuals don't change.

- [ ] **Step 1: Create preset template**

Each preset follows the same pattern. Here's barrel-brass as the reference. The other 7 follow the same structure. Read the old preset values from `lib/theme/presets/barrel-brass.ts` (primary: `#E879F9`, accent: `#F59E0B`, etc.) and map them into the new 3-layer structure.

```ts
// components/shell/theme/presets/barrel-brass.ts
import { generateShades } from '../shade';
import type { ThemePresetDef } from '../types';

export const barrelBrass: ThemePresetDef = {
  palette: {
    primary: generateShades('#E879F9'),
    accent: generateShades('#F59E0B'),
    neutral: generateShades('#6B7280'),
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
  semantic: {
    dark: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#141414',
      bgContent: '#1a1a1a',
      cardBg: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      textInverse: '#0a0a0a',
      borderDefault: '#374151',
      borderSubtle: '#1f2937',
      shadowCard: '0 1px 3px rgba(0,0,0,0.3)',
      shadowElevated: '0 10px 25px rgba(0,0,0,0.5)',
    },
    light: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f9fafb',
      bgContent: '#f3f4f6',
      cardBg: '#ffffff',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      textMuted: '#9ca3af',
      textInverse: '#ffffff',
      borderDefault: '#e5e7eb',
      borderSubtle: '#f3f4f6',
      shadowCard: '0 1px 3px rgba(0,0,0,0.1)',
      shadowElevated: '0 10px 25px rgba(0,0,0,0.15)',
    },
  },
  component: {
    dark: {
      sidebarBg: '#0a0a0a',
      sidebarText: '#ffffff',
      sidebarTextMuted: '#9ca3af',
      sidebarBorder: '#1f2937',
      sidebarActiveAccent: '#E879F9',
      headerBg: '#0a0a0a',
      headerBorder: '#1f2937',
      footerBg: '#0a0a0a',
      navSectionLabel: '#9ca3af',
      progressBarFill: '#E879F9',
    },
    light: {
      sidebarBg: '#111827',
      sidebarText: '#ffffff',
      sidebarTextMuted: '#9ca3af',
      sidebarBorder: '#1f2937',
      sidebarActiveAccent: '#E879F9',
      headerBg: '#ffffff',
      headerBorder: '#e5e7eb',
      footerBg: '#ffffff',
      navSectionLabel: '#6b7280',
      progressBarFill: '#E879F9',
    },
  },
};
```

Repeat this pattern for all 8 presets, using values from the corresponding old preset file in `lib/theme/presets/`. Key mappings:

| Old field | New location |
|-----------|-------------|
| `colors.primary` | `palette.primary` (via `generateShades()`) |
| `colors.accent` | `palette.accent` (via `generateShades()`) |
| `surfaces.bgPrimary` | `semantic.dark.bgPrimary` |
| `surfaces.cardBg` | `semantic.dark.cardBg` |
| `text.primary` | `semantic.dark.textPrimary` |
| `shadows.card` | `semantic.dark.shadowCard` |

- [ ] **Step 2: Create presets index**

```ts
// components/shell/theme/presets/index.ts
export { barrelBrass } from './barrel-brass';
export { midnight } from './midnight';
export { cleanLight } from './clean-light';
export { aegisIvory } from './aegis-ivory';
export { registerSlate } from './register-slate';
export { charterStone } from './charter-stone';
export { prizymNavy } from './prizym-navy';
export { phoenixSapphire } from './phoenix-sapphire';

import type { ThemePresetDef, ThemePresetName } from '../types';
import { barrelBrass } from './barrel-brass';
import { midnight } from './midnight';
import { cleanLight } from './clean-light';
import { aegisIvory } from './aegis-ivory';
import { registerSlate } from './register-slate';
import { charterStone } from './charter-stone';
import { prizymNavy } from './prizym-navy';
import { phoenixSapphire } from './phoenix-sapphire';

export const PRESETS: Record<ThemePresetName, ThemePresetDef> = {
  'barrel-brass': barrelBrass,
  midnight,
  'clean-light': cleanLight,
  'aegis-ivory': aegisIvory,
  'register-slate': registerSlate,
  'charter-stone': charterStone,
  'prizym-navy': prizymNavy,
  'phoenix-sapphire': phoenixSapphire,
};
```

- [ ] **Step 3: Create token resolver**

This is the core engine: takes a preset name + optional color overrides + darkMode flag → produces flat CSS var record.

```ts
// components/shell/theme/resolve.ts
import type { Palette, SemanticTokens, ComponentTokens, ThemePresetName, ShadeScale } from './types';
import { PRESETS } from './presets';
import { generateShades } from './shade';

interface ResolveInput {
  preset?: ThemePresetName;
  colors?: { primary?: string; accent?: string };
  darkMode?: boolean;
}

export interface ResolvedTokens {
  palette: Palette;
  semantic: SemanticTokens;
  component: ComponentTokens;
}

export function resolveTokens(input: ResolveInput): ResolvedTokens {
  const presetDef = PRESETS[input.preset ?? 'barrel-brass'] ?? PRESETS['barrel-brass'];
  const mode = input.darkMode !== false ? 'dark' : 'light';

  // Merge palette with color overrides
  const palette: Palette = {
    ...presetDef.palette,
    primary: input.colors?.primary
      ? generateShades(input.colors.primary)
      : presetDef.palette.primary,
    accent: input.colors?.accent
      ? generateShades(input.colors.accent)
      : presetDef.palette.accent,
  };

  return {
    palette,
    semantic: presetDef.semantic[mode],
    component: {
      ...presetDef.component[mode],
      // Override accent-derived component tokens when primary color changes
      ...(input.colors?.primary ? {
        sidebarActiveAccent: input.colors.primary,
        progressBarFill: input.colors.primary,
      } : {}),
    },
  };
}
```

- [ ] **Step 4: Create CSS var generator**

```ts
// components/shell/theme/css-vars.ts
import type { ResolvedTokens, } from './resolve';
import type { ShadeScale } from './types';

function shadeToVars(prefix: string, scale: ShadeScale): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [step, value] of Object.entries(scale)) {
    vars[`--palette-${prefix}-${step}`] = value;
  }
  return vars;
}

export function tokensToCssVars(tokens: ResolvedTokens): Record<string, string> {
  return {
    // Layer 1: Palette
    ...shadeToVars('primary', tokens.palette.primary),
    ...shadeToVars('accent', tokens.palette.accent),
    ...shadeToVars('neutral', tokens.palette.neutral),
    '--palette-success': tokens.palette.success,
    '--palette-danger': tokens.palette.danger,
    '--palette-warning': tokens.palette.warning,

    // Layer 2: Semantic
    '--sem-bg-primary': tokens.semantic.bgPrimary,
    '--sem-bg-secondary': tokens.semantic.bgSecondary,
    '--sem-bg-content': tokens.semantic.bgContent,
    '--sem-card-bg': tokens.semantic.cardBg,
    '--sem-text-primary': tokens.semantic.textPrimary,
    '--sem-text-secondary': tokens.semantic.textSecondary,
    '--sem-text-muted': tokens.semantic.textMuted,
    '--sem-text-inverse': tokens.semantic.textInverse,
    '--sem-border-default': tokens.semantic.borderDefault,
    '--sem-border-subtle': tokens.semantic.borderSubtle,
    '--sem-shadow-card': tokens.semantic.shadowCard,
    '--sem-shadow-elevated': tokens.semantic.shadowElevated,

    // Layer 3: Component
    '--comp-sidebar-bg': tokens.component.sidebarBg,
    '--comp-sidebar-text': tokens.component.sidebarText,
    '--comp-sidebar-text-muted': tokens.component.sidebarTextMuted,
    '--comp-sidebar-border': tokens.component.sidebarBorder,
    '--comp-sidebar-active-accent': tokens.component.sidebarActiveAccent,
    '--comp-header-bg': tokens.component.headerBg,
    '--comp-header-border': tokens.component.headerBorder,
    '--comp-footer-bg': tokens.component.footerBg,
    '--comp-nav-section-label': tokens.component.navSectionLabel,
    '--comp-progress-bar-fill': tokens.component.progressBarFill,

    // Backward compat aliases (so existing demo page components
    // that reference --prizym-* vars still work during transition)
    '--prizym-color-primary': tokens.palette.primary[500],
    '--prizym-color-accent': tokens.palette.accent[500],
    '--prizym-color-success': tokens.palette.success,
    '--prizym-color-danger': tokens.palette.danger,
    '--prizym-color-neutral': tokens.palette.neutral[500],
    '--prizym-bg-primary': tokens.semantic.bgPrimary,
    '--prizym-bg-secondary': tokens.semantic.bgSecondary,
    '--prizym-bg-content': tokens.semantic.bgContent,
    '--prizym-card-bg': tokens.semantic.cardBg,
    '--prizym-border-default': tokens.semantic.borderDefault,
    '--prizym-border-subtle': tokens.semantic.borderSubtle,
    '--prizym-text-primary': tokens.semantic.textPrimary,
    '--prizym-text-secondary': tokens.semantic.textSecondary,
    '--prizym-text-muted': tokens.semantic.textMuted,
    '--prizym-text-inverse': tokens.semantic.textInverse,
    '--prizym-shadow-card': tokens.semantic.shadowCard,
    '--prizym-shadow-elevated': tokens.semantic.shadowElevated,
  };
}
```

- [ ] **Step 5: Create runtime override API**

```ts
// components/shell/theme/runtime.ts

/**
 * Override CSS custom properties at runtime.
 * Keys are token names without the '--' prefix.
 * e.g., setTokens({ 'palette-primary-500': '#FF6B00' })
 */
export function setTokens(overrides: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(overrides)) {
    root.style.setProperty(`--${key}`, value);
  }
}

/** Remove all runtime token overrides */
export function resetTokens(): void {
  const root = document.documentElement;
  const style = root.style;
  for (let i = style.length - 1; i >= 0; i--) {
    const prop = style[i];
    if (prop.startsWith('--palette-') || prop.startsWith('--sem-') || prop.startsWith('--comp-')) {
      root.style.removeProperty(prop);
    }
  }
}
```

- [ ] **Step 6: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/shell/theme/
git commit -m "feat(shell): 3-layer token system with presets, resolver, CSS vars, and runtime API"
```

---

## Task 4: Config Types + defineDemo Factory

**Files:**
- Create: `components/shell/config/types.ts`
- Create: `components/shell/config/defaults.ts`
- Create: `components/shell/config/defineDemo.ts`
- Create: `components/shell/config/resolve.ts`

- [ ] **Step 1: Create config types**

```ts
// components/shell/config/types.ts
import type { LucideIcon } from 'lucide-react';
import type { ThemePresetName } from '../theme/types';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface NavSection {
  section: string;
  color?: string;
  items: NavItem[];
}

interface DemoConfigBase {
  slug: string;
  client: {
    name: string;
    tagline?: string;
    region?: string;
    logo?: LucideIcon;
  };
  product: {
    name: string;
    badge?: string;
  };
  theme?: ThemePresetName;
  colors?: { primary?: string; accent?: string };
  darkMode?: boolean;
  nav?: NavSection[];
  footer?: {
    copyright?: string;
    poweredBy?: string;
  };
  meta: {
    industry: string;
    tagline: string;
    color?: string;
  };
  extensionVars?: string;
}

export interface SidebarDemoConfig extends DemoConfigBase {
  layout?: 'sidebar';
}

export interface TopnavDemoConfig extends DemoConfigBase {
  layout: 'topnav';
  suite: { name: string; tagline: string };
  module: { code: string; name: string; description: string };
  gradient: { start: string; mid: string; end: string };
}

export interface WizardStep {
  id: string;
  label: string;
  icon: string;
  skippable?: boolean;
}

export interface WizardDemoConfig extends DemoConfigBase {
  layout: 'wizard';
  wizard: {
    steps: WizardStep[];
    startInGuided?: boolean;
    showStepNumbers?: boolean;
  };
}

export type DemoConfig = SidebarDemoConfig | TopnavDemoConfig | WizardDemoConfig;

/** Config after defaults applied and theme resolved */
export interface ResolvedDemoConfig extends Omit<DemoConfigBase, 'theme' | 'footer'> {
  layout: 'sidebar' | 'topnav' | 'wizard';
  nav: NavSection[];
  footer: { copyright: string; poweredBy: string };
  // Layout-specific (only present for their type)
  suite?: TopnavDemoConfig['suite'];
  module?: TopnavDemoConfig['module'];
  gradient?: TopnavDemoConfig['gradient'];
  wizard?: WizardDemoConfig['wizard'];
}
```

- [ ] **Step 2: Create smart defaults**

```ts
// components/shell/config/defaults.ts
import type { DemoConfig, ResolvedDemoConfig, NavSection } from './types';

export function applyDefaults(config: DemoConfig): ResolvedDemoConfig {
  const year = new Date().getFullYear();
  const layout = config.layout ?? 'sidebar';

  return {
    slug: config.slug,
    layout,
    client: config.client,
    product: config.product,
    colors: config.colors,
    darkMode: config.darkMode ?? true,
    nav: config.nav ?? [],
    footer: {
      copyright: config.footer?.copyright ?? `© ${year} ${config.client.name}`,
      poweredBy: config.footer?.poweredBy ?? 'AICodeRally',
    },
    meta: {
      ...config.meta,
      color: config.meta.color ?? config.colors?.primary,
    },
    extensionVars: config.extensionVars,
    // Pass through layout-specific fields
    ...('suite' in config ? { suite: config.suite } : {}),
    ...('module' in config ? { module: config.module } : {}),
    ...('gradient' in config ? { gradient: config.gradient } : {}),
    ...('wizard' in config ? { wizard: config.wizard } : {}),
  };
}
```

- [ ] **Step 3: Create config resolver**

```ts
// components/shell/config/resolve.ts
import type { DemoConfig, ResolvedDemoConfig } from './types';
import { applyDefaults } from './defaults';
import { discoverNav } from './fs-nav-discovery';

/**
 * Resolve a raw DemoConfig into a fully-populated ResolvedDemoConfig.
 * Applies defaults, validates layout-specific fields, discovers nav from filesystem if omitted.
 */
export function resolveConfig(config: DemoConfig): ResolvedDemoConfig {
  const resolved = applyDefaults(config);
  // If nav is empty (no explicit nav provided), try filesystem discovery
  if (resolved.nav.length === 0) {
    resolved.nav = discoverNav(resolved.slug);
  }
  return resolved;
}
```

- [ ] **Step 4: Create defineDemo factory**

```ts
// components/shell/config/defineDemo.ts
import type { DemoConfig } from './types';

/**
 * Convention-heavy config factory. 4-line minimum:
 *
 * ```ts
 * export default defineDemo({
 *   slug: 'register',
 *   client: { name: 'Summit Sleep Co.' },
 *   product: { name: 'REGISTER' },
 *   meta: { industry: 'Retail', tagline: 'Revenue intelligence' },
 * });
 * ```
 */
export function defineDemo<T extends DemoConfig>(config: T): T {
  return config;
}
```

- [ ] **Step 5: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/shell/config/
git commit -m "feat(shell): config types (discriminated union), defaults, resolver, defineDemo factory"
```

---

## Task 4b: Filesystem Nav Auto-Discovery

**Files:**
- Create: `components/shell/config/fs-nav-discovery.ts`

**Context:** When `nav` is omitted from config, the shell discovers navigation from the filesystem. This is a build-time operation that scans the demo's page directories.

- [ ] **Step 1: Create FS nav discovery module**

```ts
// components/shell/config/fs-nav-discovery.ts
import * as fs from 'fs';
import * as path from 'path';
import type { NavSection } from './types';

/**
 * Keyword-to-icon mapping for auto-discovered nav items.
 * If a directory name contains a keyword, that icon is assigned.
 */
const ICON_MAP: Record<string, string> = {
  dashboard: 'LayoutDashboard',
  overview: 'Building2',
  settings: 'Settings',
  team: 'Users',
  users: 'Users',
  chart: 'BarChart3',
  analytics: 'BarChart3',
  calendar: 'Calendar',
  map: 'Map',
  target: 'Target',
};

function resolveIcon(dirName: string): string {
  const lower = dirName.toLowerCase();
  for (const [keyword, icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(keyword)) return icon;
  }
  return 'Circle';
}

/** Strip numeric prefix (e.g., "01-corporate" → "corporate") */
function stripNumericPrefix(name: string): string {
  return name.replace(/^\d+-/, '');
}

/** Title-case a directory name: "store-portfolio" → "Store Portfolio" */
function toLabel(dirName: string): string {
  return stripNumericPrefix(dirName)
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Discover navigation from the filesystem for a given demo slug.
 * Scans app/(demos)/{slug}/ for directories containing page.tsx.
 * First-level dirs = sections, second-level dirs = items.
 */
export function discoverNav(slug: string): NavSection[] {
  const demosDir = path.resolve(process.cwd(), 'app/(demos)', slug);
  if (!fs.existsSync(demosDir)) return [];

  const sections: NavSection[] = [];
  const topDirs = fs.readdirSync(demosDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  for (const sectionDir of topDirs) {
    const sectionPath = path.join(demosDir, sectionDir);
    const items: NavSection['items'] = [];

    // Check if section itself has a page
    if (fs.existsSync(path.join(sectionPath, 'page.tsx'))) {
      items.push({
        label: toLabel(sectionDir),
        href: \`/\${slug}/\${sectionDir}\`,
        icon: resolveIcon(sectionDir),
      });
    }

    // Scan sub-directories for item pages
    const subDirs = fs.readdirSync(sectionPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();

    for (const itemDir of subDirs) {
      if (fs.existsSync(path.join(sectionPath, itemDir, 'page.tsx'))) {
        items.push({
          label: toLabel(itemDir),
          href: \`/\${slug}/\${sectionDir}/\${itemDir}\`,
          icon: resolveIcon(itemDir),
        });
      }
    }

    if (items.length > 0) {
      sections.push({ section: toLabel(sectionDir), items });
    }
  }

  return sections;
}
```

Note: This runs at build/dev time since demos use `'use client'` layouts that import config at module scope. The `fs` import is fine because it's consumed during config resolution before React rendering. If this causes issues with client bundling, the discovery can be moved to the build-time registry script instead (Task 10).

- [ ] **Step 2: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/shell/config/fs-nav-discovery.ts
git commit -m "feat(shell): filesystem nav auto-discovery algorithm"
```

---

## Task 5: SharedParts Components

**Files:**
- Create: `components/shell/parts/IconResolver.tsx`
- Create: `components/shell/parts/ThemeToggle.tsx`
- Create: `components/shell/parts/NavSection.tsx`
- Create: `components/shell/parts/Footer.tsx`
- Create: `components/shell/parts/MobileDrawer.tsx`

**Context:** Extract and generalize the shared building blocks from the existing `DemoShell.tsx` (343 lines) and `SpmShell.tsx` (243 lines). These components are composed by layout plugins, not rendered directly by consumers.

- [ ] **Step 1: Create IconResolver**

Port the `getIcon()` function from `DemoShell.tsx` into a reusable component. It looks up Lucide icons by string name with a Circle fallback.

```ts
// components/shell/parts/IconResolver.tsx
'use client';

import * as LucideIcons from 'lucide-react';

const iconCache = new Map<string, LucideIcons.LucideIcon>();

export function resolveIcon(name: string): LucideIcons.LucideIcon {
  if (iconCache.has(name)) return iconCache.get(name)!;
  const icon = (LucideIcons as Record<string, unknown>)[name] as LucideIcons.LucideIcon | undefined;
  const resolved = icon ?? LucideIcons.Circle;
  iconCache.set(name, resolved);
  return resolved;
}

export function Icon({ name, ...props }: { name: string } & LucideIcons.LucideProps) {
  const Comp = resolveIcon(name);
  return <Comp {...props} />;
}
```

- [ ] **Step 2: Create ThemeToggle**

Port the dark/light toggle from `DemoShell.tsx`. Uses `demo-theme` localStorage key (not `proofline-theme`). Dispatches `shell-theme-change` custom event.

```tsx
// components/shell/parts/ThemeToggle.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'demo-theme';
const EVENT_NAME = 'shell-theme-change';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Migrate legacy key
    const legacy = localStorage.getItem('proofline-theme');
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem('proofline-theme');
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const dark = stored ? stored === 'dark' : true;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { dark: next } }));
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 transition-colors hover:bg-white/10"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4 text-[var(--sem-text-muted)]" /> : <Moon className="h-4 w-4 text-[var(--sem-text-muted)]" />}
    </button>
  );
}
```

- [ ] **Step 3: Create NavSection**

Supports both collapsible (sidebar) and flat (topnav) modes via a `collapsible` prop.

```tsx
// components/shell/parts/NavSection.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Icon } from './IconResolver';
import type { NavSection as NavSectionType } from '../config/types';

interface Props {
  section: NavSectionType;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  slug: string;
}

export function NavSection({ section, collapsible = true, defaultExpanded = true, slug }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const pathname = usePathname();

  return (
    <div className="mb-1">
      {/* Section header */}
      <button
        onClick={() => collapsible && setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--comp-nav-section-label)]"
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <span style={section.color ? { color: section.color } : undefined}>
          {section.section}
        </span>
        {collapsible && (
          <ChevronDown
            className={`h-3 w-3 transition-transform ${expanded ? '' : '-rotate-90'}`}
          />
        )}
      </button>

      {/* Items */}
      {(expanded || !collapsible) && (
        <div className="space-y-0.5">
          {section.items.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 font-medium text-[var(--comp-sidebar-text)]'
                    : 'text-[var(--comp-sidebar-text-muted)] hover:bg-white/5 hover:text-[var(--comp-sidebar-text)]'
                }`}
              >
                {/* Active indicator rail */}
                {isActive && (
                  <div
                    className="absolute left-0 h-6 w-1 rounded-r"
                    style={{ backgroundColor: section.color ?? 'var(--comp-sidebar-active-accent)' }}
                  />
                )}
                {item.icon && <Icon name={item.icon} className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create Footer**

Two rows: section nav row + attribution line.

```tsx
// components/shell/parts/Footer.tsx
import type { NavSection, ResolvedDemoConfig } from '../config/types';

interface Props {
  config: ResolvedDemoConfig;
}

export function Footer({ config }: Props) {
  return (
    <footer className="border-t border-[var(--sem-border-subtle)] bg-[var(--comp-footer-bg)] px-6 py-4">
      {/* Section nav row */}
      {config.nav.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-wider">
          {config.nav.map(section => (
            <a
              key={section.section}
              href={section.items[0]?.href ?? '#'}
              className="transition-colors hover:text-[var(--sem-text-primary)]"
              style={{ color: section.color ?? 'var(--sem-text-muted)' }}
            >
              {section.section}
            </a>
          ))}
        </div>
      )}
      {/* Attribution */}
      <div className="text-center text-xs text-[var(--sem-text-muted)]">
        {config.footer.copyright} · Powered by{' '}
        <span className="font-semibold text-[var(--palette-accent-500)]">
          {config.footer.poweredBy}
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Create MobileDrawer**

Overlay + slide-in for mobile viewports. Used by sidebar and topnav plugins.

```tsx
// components/shell/parts/MobileDrawer.tsx
'use client';

import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export function MobileDrawer({ open, onClose, children, width = 264 }: Props) {
  // Close on escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Drawer */}
      <div
        className="absolute left-0 top-0 h-full overflow-y-auto bg-[var(--comp-sidebar-bg)]"
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/shell/parts/
git commit -m "feat(shell): shared parts — IconResolver, ThemeToggle, NavSection, Footer, MobileDrawer"
```

---

## Task 6: Plugin Registry + DemoShell Orchestrator

**Files:**
- Create: `components/shell/registry.ts`
- Create: `components/shell/DemoShell.tsx`
- Create: `components/shell/index.ts`

- [ ] **Step 1: Create plugin registry**

```ts
// components/shell/registry.ts
import type { ResolvedDemoConfig } from './config/types';
import type { ReactElement, ReactNode } from 'react';

export interface SharedParts {
  NavSection: typeof import('./parts/NavSection').NavSection;
  Footer: typeof import('./parts/Footer').Footer;
  MobileDrawer: typeof import('./parts/MobileDrawer').MobileDrawer;
  ThemeToggle: typeof import('./parts/ThemeToggle').ThemeToggle;
  Icon: typeof import('./parts/IconResolver').Icon;
}

export interface ShellLayout {
  id: string;
  label: string;
  render(props: {
    config: ResolvedDemoConfig;
    children: ReactNode;
    parts: SharedParts;
  }): ReactElement;
  /** Optional Zod schema for layout-specific config validation at resolve time */
  configSchema?: import('zod').ZodSchema;
}

const LAYOUTS = new Map<string, ShellLayout>();

export function registerLayout(layout: ShellLayout) {
  LAYOUTS.set(layout.id, layout);
}

export function getLayout(id: string): ShellLayout {
  const layout = LAYOUTS.get(id);
  if (!layout) return LAYOUTS.get('sidebar')!;
  return layout;
}
```

- [ ] **Step 2: Create DemoShell orchestrator**

```tsx
// components/shell/DemoShell.tsx
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { DemoConfig } from './config/types';
import { resolveConfig } from './config/resolve';
import { resolveTokens } from './theme/resolve';
import { tokensToCssVars } from './theme/css-vars';
import { getLayout, type SharedParts } from './registry';
import { NavSection } from './parts/NavSection';
import { Footer } from './parts/Footer';
import { MobileDrawer } from './parts/MobileDrawer';
import { ThemeToggle } from './parts/ThemeToggle';
import { Icon } from './parts/IconResolver';

// Import plugins to trigger self-registration
import './plugins/sidebar';
import './plugins/topnav';
import './plugins/wizard';

const parts: SharedParts = { NavSection, Footer, MobileDrawer, ThemeToggle, Icon };

interface Props {
  config: DemoConfig;
  children: React.ReactNode;
}

export function DemoShell({ config, children }: Props) {
  const resolved = useMemo(() => resolveConfig(config), [config]);
  const cssVars = useMemo(() => {
    return tokensToCssVars(resolveTokens({
      preset: config.theme,
      colors: config.colors,
      darkMode: resolved.darkMode,
    }));
  }, [config.theme, config.colors, resolved.darkMode]);

  const layout = getLayout(resolved.layout);

  return (
    <div style={cssVars as React.CSSProperties}>
      {layout.render({ config: resolved, children, parts })}

      {/* "All Demos" back link — shown for all layouts */}
      <Link
        href="/"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        All Demos
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create public API**

```ts
// components/shell/index.ts
export { DemoShell } from './DemoShell';
export { defineDemo } from './config/defineDemo';
export type { DemoConfig, SidebarDemoConfig, TopnavDemoConfig, WizardDemoConfig, NavSection, NavItem, ResolvedDemoConfig } from './config/types';
export type { ThemePresetName } from './theme/types';
export { setTokens, resetTokens } from './theme/runtime';
// Note: useWizard export is added in Task 9 after wizard context is created
```

After Task 9 completes, add this line to `index.ts`:
```ts
export { useWizard } from './wizard/context';
```

- [ ] **Step 4: Commit** (don't typecheck yet — plugins not created)

```bash
git add components/shell/registry.ts components/shell/DemoShell.tsx components/shell/index.ts
git commit -m "feat(shell): plugin registry and DemoShell orchestrator"
```

---

## Task 7: Sidebar Layout Plugin

**Files:**
- Create: `components/shell/plugins/sidebar.tsx`

**Context:** Port the layout structure from `components/demo-shell/DemoShell.tsx` (343 lines). Sidebar (264px), fixed header (56px), collapsible nav sections, theme toggle, mobile hamburger. Reference the old file directly for visual fidelity.

- [ ] **Step 1: Create sidebar plugin**

The sidebar plugin registers itself on import. It renders the classic DemoShell layout using SharedParts. Read `components/demo-shell/DemoShell.tsx` for the exact layout structure, class names, and responsive behavior, then port to the plugin pattern.

Key structure:
- Fixed sidebar (264px, `lg:` breakpoint shows/hides)
- Header: hamburger (mobile) → client logo/name → product badge → theme toggle
- Main content area: remaining width, scrolls independently
- Footer via `parts.Footer`
- Mobile: `parts.MobileDrawer` for sidebar overlay

```tsx
// components/shell/plugins/sidebar.tsx
'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { registerLayout } from '../registry';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';

function SidebarLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const Logo = config.client.logo;

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-2 pt-4">
      {config.nav.map(section => (
        <parts.NavSection
          key={section.section}
          section={section}
          collapsible
          defaultExpanded
          slug={config.slug}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[264px] shrink-0 flex-col border-r border-[var(--comp-sidebar-border)] bg-[var(--comp-sidebar-bg)] overflow-y-auto">
        {/* Sidebar header */}
        <div className="flex items-center gap-3 border-b border-[var(--comp-sidebar-border)] px-4 py-3">
          {Logo && <Logo className="h-6 w-6 text-[var(--comp-sidebar-active-accent)]" />}
          <div>
            <div className="text-sm font-bold text-[var(--comp-sidebar-text)]">{config.client.name}</div>
            {config.client.tagline && (
              <div className="text-xs text-[var(--comp-sidebar-text-muted)]">{config.client.tagline}</div>
            )}
          </div>
        </div>
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5 text-[var(--sem-text-primary)]" />
            </button>
            <span className="text-lg font-bold text-[var(--sem-text-primary)]">{config.product.name}</span>
            {config.product.badge && (
              <span className="rounded-full bg-[var(--comp-sidebar-active-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--comp-sidebar-active-accent)]">
                {config.product.badge}
              </span>
            )}
          </div>
          <parts.ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
          {children}
        </main>

        <parts.Footer config={config} />
      </div>

      {/* Mobile drawer */}
      <parts.MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {sidebarContent}
      </parts.MobileDrawer>
    </div>
  );
}

registerLayout({
  id: 'sidebar',
  label: 'Sidebar',
  render: (props) => <SidebarLayout {...props} />,
});
```

- [ ] **Step 2: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/shell/plugins/sidebar.tsx
git commit -m "feat(shell): sidebar layout plugin"
```

---

## Task 8: Topnav Layout Plugin

**Files:**
- Create: `components/shell/plugins/topnav.tsx`

**Context:** Port the layout structure from `components/spm-shell/SpmShell.tsx` (243 lines). Top gradient bar, horizontal header with suite/module branding circle, sidebar below header, footer with gradient bars and section nav.

- [ ] **Step 1: Create topnav plugin**

Read `components/spm-shell/SpmShell.tsx` for the exact layout structure. Key elements:
- Top gradient bar (h-1)
- Navbar: suite name (gradient text) + module code circle + module info + "Demo Data" badge
- Sidebar (240px) with flat (non-collapsible) nav
- Footer: gradient bar top, section nav row, attribution, gradient bar bottom

```tsx
// components/shell/plugins/topnav.tsx
'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { registerLayout } from '../registry';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';

function TopnavLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const gradient = config.gradient;
  const gradientStyle = gradient
    ? { background: `linear-gradient(135deg, ${gradient.start}, ${gradient.mid}, ${gradient.end})` }
    : {};

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-2 pt-4">
      {config.nav.map(section => (
        <parts.NavSection
          key={section.section}
          section={section}
          collapsible={false}
          slug={config.slug}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Top gradient bar */}
      <div className="h-1 shrink-0" style={gradientStyle} />

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-6">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-[var(--sem-text-primary)]" />
          </button>
          {/* Suite name */}
          <span
            className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent"
            style={{ backgroundImage: gradient ? `linear-gradient(135deg, ${gradient.start}, ${gradient.end})` : undefined }}
          >
            {config.suite?.name}
          </span>
          {/* Module circle */}
          {config.module && (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={gradientStyle}
            >
              {config.module.code}
            </div>
          )}
          {/* Module info */}
          {config.module && (
            <div>
              <div className="text-sm font-bold text-[var(--sem-text-primary)]">{config.module.name}</div>
              <div className="text-xs text-[var(--sem-text-muted)]">{config.module.description}</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--palette-accent-500)]/10 px-2 py-0.5 text-xs font-medium text-[var(--palette-accent-500)]">
            Demo Data
          </span>
          <parts.ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-[var(--comp-sidebar-border)] bg-[var(--comp-sidebar-bg)] overflow-y-auto">
          {sidebarContent}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
          {children}
        </main>
      </div>

      {/* Footer with gradient bars */}
      <div className="h-0.5 shrink-0" style={gradientStyle} />
      <parts.Footer config={config} />
      <div className="h-0.5 shrink-0" style={gradientStyle} />

      {/* Mobile drawer */}
      <parts.MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} width={240}>
        {sidebarContent}
      </parts.MobileDrawer>
    </div>
  );
}

registerLayout({
  id: 'topnav',
  label: 'Topnav',
  render: (props) => <TopnavLayout {...props} />,
});
```

- [ ] **Step 2: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/shell/plugins/topnav.tsx
git commit -m "feat(shell): topnav layout plugin"
```

---

## Task 9: Wizard Layout Plugin + Context

**Files:**
- Create: `components/shell/wizard/context.tsx`
- Create: `components/shell/plugins/wizard.tsx`

- [ ] **Step 1: Create wizard context**

```tsx
// components/shell/wizard/context.tsx
'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { WizardStep } from '../config/types';

interface WizardState {
  currentStep: number;
  completedSteps: Set<string>;
  mode: 'guided' | 'explore';
  steps: WizardStep[];
}

interface WizardContextValue extends WizardState {
  goNext: () => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  markComplete: (stepId: string) => void;
  toggleMode: () => void;
}

const WizardCtx = createContext<WizardContextValue | null>(null);

const STORAGE_KEY = 'wizard-state';

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error('useWizard must be used within a WizardProvider');
  return ctx;
}

interface ProviderProps {
  steps: WizardStep[];
  startInGuided?: boolean;
  slug: string;
  children: ReactNode;
}

export function WizardProvider({ steps, startInGuided = true, slug, children }: ProviderProps) {
  const storageKey = `${STORAGE_KEY}-${slug}`;

  const [state, setState] = useState<WizardState>(() => {
    // Restore from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...parsed,
            completedSteps: new Set(parsed.completedSteps),
            steps,
          };
        }
      } catch { /* ignore */ }
    }
    return {
      currentStep: 0,
      completedSteps: new Set<string>(),
      mode: startInGuided ? 'guided' : 'explore',
      steps,
    };
  });

  const persist = useCallback((next: WizardState) => {
    setState(next);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        ...next,
        completedSteps: [...next.completedSteps],
      }));
    } catch { /* sessionStorage unavailable */ }
  }, [storageKey]);

  const goNext = useCallback(() => {
    persist({
      ...state,
      currentStep: Math.min(state.currentStep + 1, steps.length - 1),
    });
  }, [state, steps.length, persist]);

  const goBack = useCallback(() => {
    persist({ ...state, currentStep: Math.max(state.currentStep - 1, 0) });
  }, [state, persist]);

  const goToStep = useCallback((index: number) => {
    persist({ ...state, currentStep: index });
  }, [state, persist]);

  const markComplete = useCallback((stepId: string) => {
    const next = new Set(state.completedSteps);
    next.add(stepId);
    persist({ ...state, completedSteps: next });
  }, [state, persist]);

  const toggleMode = useCallback(() => {
    const nextMode = state.mode === 'guided' ? 'explore' : 'guided';
    // When switching back to guided, jump to first incomplete step
    let nextStep = state.currentStep;
    if (nextMode === 'guided') {
      const firstIncomplete = steps.findIndex(s => !state.completedSteps.has(s.id));
      if (firstIncomplete !== -1) nextStep = firstIncomplete;
    }
    persist({ ...state, mode: nextMode, currentStep: nextStep });
  }, [state, steps, persist]);

  return (
    <WizardCtx.Provider value={{ ...state, goNext, goBack, goToStep, markComplete, toggleMode }}>
      {children}
    </WizardCtx.Provider>
  );
}
```

- [ ] **Step 2: Create wizard plugin**

```tsx
// components/shell/plugins/wizard.tsx
'use client';

import { registerLayout } from '../registry';
import { WizardProvider, useWizard } from '../wizard/context';
import { Icon } from '../parts/IconResolver';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';
import { ChevronLeft, ChevronRight, Grid3X3, ListOrdered, Check } from 'lucide-react';

function WizardInner({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  const wiz = useWizard();
  const currentStepDef = wiz.steps[wiz.currentStep];

  if (wiz.mode === 'explore') {
    // Hub-and-spoke card grid
    return (
      <div className="flex h-screen flex-col bg-[var(--sem-bg-primary)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-6">
          <span className="text-lg font-bold text-[var(--sem-text-primary)]">{config.product.name}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={wiz.toggleMode}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--sem-text-muted)] hover:bg-white/10"
            >
              <ListOrdered className="h-3.5 w-3.5" /> Guided Mode
            </button>
            <parts.ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-[var(--sem-text-primary)]">
              {config.product.name} — All Steps
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wiz.steps.map((step, i) => {
                const completed = wiz.completedSteps.has(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => wiz.goToStep(i)}
                    className="group flex flex-col items-start gap-3 rounded-xl border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-5 text-left transition-all hover:border-[var(--comp-sidebar-active-accent)]"
                  >
                    <div className="flex w-full items-center justify-between">
                      <Icon name={step.icon} className="h-5 w-5 text-[var(--comp-sidebar-active-accent)]" />
                      {completed ? (
                        <Check className="h-4 w-4 text-[var(--palette-success)]" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border-2 border-[var(--sem-border-default)]" />
                      )}
                    </div>
                    <span className="font-medium text-[var(--sem-text-primary)]">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
        <parts.Footer config={config} />
      </div>
    );
  }

  // Guided (linear) mode
  return (
    <div className="flex h-screen flex-col bg-[var(--sem-bg-primary)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[var(--sem-text-primary)]">{config.product.name}</span>
          <span className="text-sm text-[var(--sem-text-muted)]">
            Step {wiz.currentStep + 1} of {wiz.steps.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={wiz.toggleMode}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--sem-text-muted)] hover:bg-white/10"
          >
            <Grid3X3 className="h-3.5 w-3.5" /> Free Explore
          </button>
          <parts.ThemeToggle />
        </div>
      </header>

      {/* Progress bar */}
      <div className="flex shrink-0 gap-1 px-6 py-2 bg-[var(--sem-bg-secondary)]">
        {wiz.steps.map((step, i) => (
          <div
            key={step.id}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i <= wiz.currentStep
                ? 'var(--comp-progress-bar-fill)'
                : 'var(--sem-border-default)',
            }}
          />
        ))}
      </div>

      {/* Step label */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--sem-border-subtle)]">
        {currentStepDef && <Icon name={currentStepDef.icon} className="h-4 w-4 text-[var(--comp-sidebar-active-accent)]" />}
        <span className="text-sm font-medium text-[var(--sem-text-primary)]">
          {currentStepDef?.label}
        </span>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
        {children}
      </main>

      {/* Navigation buttons */}
      <div className="flex shrink-0 items-center justify-between border-t border-[var(--sem-border-subtle)] bg-[var(--comp-footer-bg)] px-6 py-3">
        <button
          onClick={wiz.goBack}
          disabled={wiz.currentStep === 0}
          className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-[var(--sem-text-muted)] transition-colors hover:text-[var(--sem-text-primary)] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={() => {
            if (currentStepDef) wiz.markComplete(currentStepDef.id);
            wiz.goNext();
          }}
          className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--comp-progress-bar-fill)' }}
        >
          {wiz.currentStep === wiz.steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function WizardLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  if (!config.wizard) {
    throw new Error(`DemoShell: layout 'wizard' requires a 'wizard' config with steps`);
  }

  return (
    <WizardProvider
      steps={config.wizard.steps}
      startInGuided={config.wizard.startInGuided}
      slug={config.slug}
    >
      <WizardInner config={config} children={children} parts={parts} />
    </WizardProvider>
  );
}

registerLayout({
  id: 'wizard',
  label: 'Wizard',
  render: (props) => <WizardLayout {...props} />,
});
```

- [ ] **Step 3: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/shell/wizard/ components/shell/plugins/wizard.tsx
git commit -m "feat(shell): wizard layout plugin with guided + free explore modes"
```

---

## Task 10: Build-Time Registry Generator

**Files:**
- Create: `scripts/generate-registry.ts`
- Modify: `package.json` (add scripts)
- Create: `.gitignore` entry for `data/demo-registry.ts`

- [ ] **Step 1: Install tsx for script execution**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm add -D tsx
```

- [ ] **Step 2: Create registry generator script**

```ts
// scripts/generate-registry.ts
/**
 * Build-time script: scans all demo.config.ts files, extracts meta,
 * and generates data/demo-registry.ts for the home page.
 *
 * Usage: pnpm generate:registry
 * Flags: --help, --json
 */
import * as fs from 'fs';
import * as path from 'path';

const DEMOS_DIR = path.resolve(__dirname, '../app/(demos)');
const OUTPUT_FILE = path.resolve(__dirname, '../data/demo-registry.ts');

interface RegistryEntry {
  name: string;
  slug: string;
  industry: string;
  tagline: string;
  color: string;
  layout: string;
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log(`generate-registry: Scans demo.config.ts files and generates data/demo-registry.ts

Usage: tsx scripts/generate-registry.ts [--json] [--help]

Options:
  --json   Output as JSON instead of writing the registry file
  --help   Show this help message

Examples:
  tsx scripts/generate-registry.ts
  tsx scripts/generate-registry.ts --json`);
    process.exit(0);
  }

  const dirs = fs.readdirSync(DEMOS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  const entries: RegistryEntry[] = [];
  const errors: string[] = [];

  for (const dir of dirs) {
    const configPath = path.join(DEMOS_DIR, dir, 'demo.config.ts');
    if (!fs.existsSync(configPath)) continue;

    // Dynamic import the config
    try {
      const mod = await import(configPath);
      const config = mod.default;

      if (!config) {
        errors.push(`${dir}: no default export in demo.config.ts`);
        continue;
      }

      // Validate slug matches directory
      if (config.slug && config.slug !== dir) {
        errors.push(`${dir}: slug '${config.slug}' does not match directory name '${dir}'`);
        continue;
      }

      // Validate required meta fields
      if (!config.meta?.industry) {
        errors.push(`${dir}: missing meta.industry (required for registry)`);
        continue;
      }
      if (!config.meta?.tagline) {
        errors.push(`${dir}: missing meta.tagline (required for registry)`);
        continue;
      }

      entries.push({
        name: config.product?.name ?? dir.toUpperCase(),
        slug: config.slug ?? dir,
        industry: config.meta.industry,
        tagline: config.meta.tagline,
        color: config.meta.color ?? config.colors?.primary ?? '#6B7280',
        layout: config.layout ?? 'sidebar',
      });
    } catch (err) {
      errors.push(`${dir}: failed to import — ${err}`);
    }
  }

  if (errors.length > 0) {
    console.error('Registry generation errors:');
    errors.forEach(e => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(entries, null, 2));
    process.exit(0);
  }

  // Write the registry file
  const output = `// AUTO-GENERATED by scripts/generate-registry.ts — DO NOT EDIT
export interface DemoRegistryEntry {
  name: string;
  slug: string;
  industry: string;
  tagline: string;
  color: string;
  layout: string;
}

export const demoRegistry: DemoRegistryEntry[] = ${JSON.stringify(entries, null, 2)};
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`✓ Generated registry with ${entries.length} demos → ${path.relative(process.cwd(), OUTPUT_FILE)}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
```

- [ ] **Step 3: Add gitignore entry**

Append to `.gitignore`:
```
data/demo-registry.ts
```

- [ ] **Step 4: Add package.json scripts**

Add these scripts to `package.json`:
```json
"generate:registry": "tsx scripts/generate-registry.ts",
"prebuild": "pnpm generate:registry",
"dev": "pnpm generate:registry && next dev -p 3100",
"verify": "pnpm generate:registry && pnpm typecheck && next build"
```

Note: The existing `dev` script is `"next dev -p 3100"`. Prepend the registry generation.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-registry.ts package.json .gitignore
git commit -m "feat(shell): build-time demo registry generator"
```

---

## Task 11: Home Page Rewrite

**Files:**
- Modify: `app/page.tsx`

**Context:** Replace the manual `productDemos[]` array with an import from the generated registry. Keep the `DemoCard` visual design. Clean up footer: remove Studio/Edge/Summit links, remove social icons, simplify to `© 2026 AICodeRally · Powered by AICR`.

- [ ] **Step 1: Rewrite home page**

Read the current `app/page.tsx` (255 lines) and rewrite:

1. Replace the manual `productDemos` array with `import { demoRegistry } from '@/data/demo-registry'`
2. Update `DemoCard` to use `DemoRegistryEntry` type instead of `typeof productDemos[0]`
3. Strip footer to minimal: copyright + "Powered by AICR"
4. Remove all social icon links (LinkedIn, Twitter, Email)
5. Remove Product/Company link columns (Studio, Edge Platform, Summit Modules, Partners, etc.)
6. Keep the hero section and card grid visual design

- [ ] **Step 2: Verify build**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm generate:registry && pnpm typecheck
```

Note: The registry generator may fail at this point if demo configs don't have `meta` fields yet. That's expected — the codemod (Task 12) adds them. For now, create a temporary `data/demo-registry.ts` with the current `productDemos` data so the home page typechecks.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx data/demo-registry.ts
git commit -m "feat(shell): home page uses auto-generated demo registry"
```

---

## Task 12: Codemod Migration Script

**Files:**
- Create: `scripts/migrate-to-v2.ts`

**Context:** This is the big one. The codemod transforms all 13 demos from the old config format to the new one. It must handle both `defineDemo` (sidebar) and `defineSpmDemo` (topnav) configs, add `meta` fields, rewrite `layout.tsx` files, and clean up legacy references.

- [ ] **Step 1: Create codemod script**

The codemod script reads each demo's `demo.config.ts`, detects the shell type, transforms the config to the new API, and rewrites both `demo.config.ts` and `layout.tsx`.

Key transformations per demo type:

**DemoShell → sidebar:**
- `import { defineDemo } from '@/components/demo-shell'` → `import { defineDemo } from '@/components/shell'`
- Add `slug: '{dir-name}'`
- Add `layout: 'sidebar'` (or omit since it's default)
- Add `meta: { industry: '...', tagline: '...', color: '...' }` (extracted from current `app/page.tsx` `productDemos` array)
- Keep all other fields (client, product, theme, colors, nav, footer, darkMode)

**SpmShell → topnav:**
- `import { defineSpmDemo } from '@/components/spm-shell'` → `import { defineDemo } from '@/components/shell'`
- `defineSpmDemo({...})` → `defineDemo({...})`
- Add `slug: '{dir-name}'`, `layout: 'topnav'`
- Add `meta: { industry: '...', tagline: '...', color: '...' }`
- Keep `suite`, `module`, `gradient` fields (now part of TopnavDemoConfig)

**Layout.tsx rewrite (all demos):**
- Old: `import { DemoShell } from '@/components/demo-shell'` or `import { SpmShell } from '@/components/spm-shell'`
- New: `import { DemoShell } from '@/components/shell'`
- Keep CSS var imports (extension tokens)

**proofline-route special case:**
- No shell → create a minimal `demo.config.ts` with just `meta` for registry inclusion
- No layout change

**Global cleanup:**
- `localStorage` key: `proofline-theme` → `demo-theme` (ThemeToggle handles this with runtime migration)
- Custom event: `demoshell-theme-change` → `shell-theme-change` — grep all demo page components for this event name and replace:
  ```bash
  grep -r "demoshell-theme-change" app/ components/ --include="*.tsx" --include="*.ts" -l
  ```
  Then sed-replace in each matching file.

The meta data for existing demos is extracted from the `productDemos` array in `app/page.tsx`:

| slug | industry | tagline | color |
|------|----------|---------|-------|
| aegis | Crisis Management | Privilege-first crisis defense for law firms and corporate counsel | #D4A574 |
| charter | Credit Unions | Member-owned financial intelligence for community institutions | #8B7355 |
| crestline | Department Store Retail | Premium retail compensation for multi-format department stores | #c9a84c |
| equipr | Equipment Rental | AI-powered fleet intelligence and utilization analytics for rental operations | #F59E0B |
| meridian | Private Equity | Carried interest compensation and fund waterfall for M&A-focused PE firms | #D4A847 | (sidebar, not topnav — uses DemoShell despite spec listing SpmShell) |
| phoenix-intel | Nonprofit Consultancy | Advancement intelligence platform for nonprofit fundraising consultants | #3b6bf5 |
| proofline | Beverage Distribution | Revenue operating system for beverage distributors — territory, comp, route ops | #C6A052 |
| proofline-andrews | Beverage Distribution | Revenue operating system for beverage distributors | #C6A052 |
| proofline-route | Beverage Distribution | Route operations standalone | #C6A052 |
| quota | Prizym RevOps | Quota planning and attainment for the modern CRO | #f59e0b |
| register | Retail Operations | Retail revenue intelligence from floor to boardroom — comp, scheduling, analytics | #64748B |
| steeple | Church Management | Full-spectrum church management and ministry platform | #8b5cf6 |
| wellspring | Oil & Gas | Field operations intelligence for upstream oil and gas producers | #B45309 |

The script should:
1. Read each `demo.config.ts` as text
2. Detect whether it uses `defineDemo` or `defineSpmDemo`
3. Apply the appropriate AST-level text transformation
4. Write the new config and layout files

```
Usage: tsx scripts/migrate-to-v2.ts [--dry-run] [--json] [--help]

Options:
  --dry-run   Show what would change without writing files
  --json      Output plan as JSON
  --help      Show this help message
```

- [ ] **Step 2: Run codemod in dry-run mode**

```bash
cd /Users/toddlebaron/Development/aicr-demos && tsx scripts/migrate-to-v2.ts --dry-run
```

Review output. Verify each demo's transformation looks correct.

- [ ] **Step 3: Run codemod**

```bash
cd /Users/toddlebaron/Development/aicr-demos && tsx scripts/migrate-to-v2.ts
```

- [ ] **Step 4: Verify typecheck**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-to-v2.ts app/\(demos\)/ 
git commit -m "feat(shell): migrate all 13 demos to DemoShell v2 config format"
```

---

## Task 13: Rename Extension Token Files + Legacy Cleanup

**Files:**
- Move: `styles/proofline-vars.css` → `styles/ext/proofline.css`
- Move: `styles/proofline-route-vars.css` → `styles/ext/proofline-route.css`
- Move: `styles/meridian-vars.css` → `styles/ext/meridian.css`
- Move: `styles/phoenix-intel-vars.css` → `styles/ext/phoenix-intel.css`
- Update: all layout.tsx files that import these CSS files
- Delete: `components/demo-shell/` (entire directory)
- Delete: `components/spm-shell/` (entire directory)

- [ ] **Step 1: Create styles/ext/ directory and move files**

```bash
cd /Users/toddlebaron/Development/aicr-demos
mkdir -p styles/ext
mv styles/proofline-vars.css styles/ext/proofline.css
mv styles/proofline-route-vars.css styles/ext/proofline-route.css
mv styles/meridian-vars.css styles/ext/meridian.css
mv styles/phoenix-intel-vars.css styles/ext/phoenix-intel.css
```

- [ ] **Step 2: Update CSS import paths in layout.tsx files**

For each demo that imports a CSS vars file, update the import path:
- `@/styles/proofline-vars.css` → `@/styles/ext/proofline.css`
- `@/styles/meridian-vars.css` → `@/styles/ext/meridian.css`
- `@/styles/phoenix-intel-vars.css` → `@/styles/ext/phoenix-intel.css`
- `@/styles/proofline-route-vars.css` → `@/styles/ext/proofline-route.css`

Search all layout.tsx files for these imports and update them.

- [ ] **Step 3: Delete old shell directories**

```bash
cd /Users/toddlebaron/Development/aicr-demos
rm -rf components/demo-shell/
rm -rf components/spm-shell/
```

- [ ] **Step 4: Update (demos) parent layout**

Simplify `app/(demos)/layout.tsx` to a pass-through (the "All Demos" link moved into DemoShell orchestrator):

```tsx
export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 5: Verify typecheck + build**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm typecheck && pnpm build
```
Expected: Both PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(shell): rename extension tokens to styles/ext/, delete old shells, clean up parent layout"
```

---

## Task 14: Full Verification + Registry Integration

**Files:**
- Possibly modify: various files based on issues found

- [ ] **Step 1: Generate registry**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm generate:registry
```
Expected: `✓ Generated registry with 13 demos`

- [ ] **Step 2: Full build**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm build
```
Expected: Static export succeeds with no errors

- [ ] **Step 3: Visual smoke test**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm dev
```

Open `http://localhost:3100` and verify:
1. Home page shows all 13 demos from registry
2. Click into at least one sidebar demo (proofline) — sidebar renders, nav works, theme toggle works, footer has section nav row
3. Click into a topnav demo (quota or meridian) — gradient bar, module circle, flat nav, footer gradient bars
4. Dark/light mode toggle persists across page reloads
5. "← All Demos" pill button visible on all demos
6. No visual regressions (compare screenshots of before/after if available)

- [ ] **Step 4: Fix any issues found**

Address any typecheck, build, or visual issues.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(shell): DemoShell v2 complete — unified plugin shell with 3 layouts"
```

---

## Dependency Graph

```
Task 1 (zod)
    ↓
Task 2 (shade + types) → Task 3 (presets + resolve + CSS vars + runtime)
                              ↓
                         Task 4 (config types + defineDemo)
                              ↓
                         Task 5 (SharedParts)
                              ↓
                         Task 6 (registry + orchestrator)
                              ↓
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
               Task 7    Task 8    Task 9
              (sidebar) (topnav)  (wizard)
                    └─────────┼─────────┘
                              ↓
                         Task 10 (registry generator)
                              ↓
                         Task 11 (home page rewrite)
                              ↓
                         Task 12 (codemod)
                              ↓
                         Task 13 (rename + cleanup)
                              ↓
                         Task 14 (verification)
```

Tasks 7, 8, 9 can be done in parallel after Task 6.
