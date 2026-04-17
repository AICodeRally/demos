# DemoShell v2 — Unified Shell with Plugin Architecture

**Date:** 2026-03-17
**Scope:** `aicr-demos` repo — `components/shell/`, `lib/theme/`, `scripts/`, `app/page.tsx`, all existing demos
**Status:** Design approved, pending implementation plan
**Spec:** 1 of 2 (Shell v2 infrastructure). Rally Cockpit overlay is a separate spec.

## Goal

Replace the dual-shell system (`DemoShell` + `SpmShell`) with a single unified shell built on a plugin architecture. This shell is the core prototyping tool for Rally engagements — it must support rapid demo creation with minimal config while being extensible enough for diverse product types.

### Success criteria

- A new demo can be created with a 4-line config file
- All existing demos work identically after migration (no visual regressions)
- Three layout variants (sidebar, topnav, wizard) share common building blocks
- Theme tokens support runtime override via JS API
- Home page auto-generates from demo registry (no manual card edits)
- Build-time validation catches missing metadata

## Demo Inventory

The repo contains 13 demo directories. The codemod must handle each:

| Demo | Shell Type | Config? | Codemod Action |
|------|-----------|---------|----------------|
| aegis | DemoShell | Yes | Migrate to sidebar |
| charter | DemoShell | Yes | Migrate to sidebar |
| crestline | DemoShell | Yes | Migrate to sidebar |
| equipr | DemoShell | Yes | Migrate to sidebar |
| meridian | DemoShell | Yes | Migrate to sidebar |
| phoenix-intel | DemoShell | Yes | Migrate to sidebar |
| routeiq | DemoShell | Yes | Migrate to sidebar |
| routeiq-royal | DemoShell | Yes | Migrate to sidebar (fork of routeiq with different nav hrefs) |
| route | None (standalone) | No | Skip — standalone page, no shell wrapper. Add `meta` export for registry. |
| quota | SpmShell | Yes | Migrate to topnav |
| register | DemoShell | Yes | Migrate to sidebar |
| steeple | DemoShell | Yes | Migrate to sidebar |
| wellspring | DemoShell | Yes | Migrate to sidebar |

`route` is a standalone single-page demo with no shell. The codemod skips it but the registry script includes it (needs a `meta` export added manually or via the codemod creating a minimal `demo.config.ts`).

## Architecture

### Plugin System

`DemoShell` is a thin orchestrator. It resolves config, injects theme tokens as CSS vars, and delegates frame rendering to a registered layout plugin.

```
defineDemo({ slug, client, product, layout?, theme? })
          ▼ resolves config via conventions
  ┌───────────────────┬───────────────────┐
  │  Config Resolver   │   Token Engine    │
  │  FS nav discovery  │  palette→semantic │
  │  Smart defaults    │  →component vars  │
  │  Plugin lookup     │  Runtime JS API   │
  └───────────────────┴───────────────────┘
          ▼ delegates to registered plugin
  ┌─────────────────────────────────────────┐
  │         <DemoShell> Orchestrator         │
  │  Shared: theme injection, mobile overlay │
  │  footer, dark mode, "All Demos" link     │
  ├────────────┬────────────┬───────────────┤
  │  Sidebar   │  Topnav    │   Wizard      │
  │  Plugin    │  Plugin    │   Plugin      │
  └────────────┴────────────┴───────────────┘
          ▼ shared building blocks
  ┌─────┬────────┬─────────┬───────┬──────┐
  │ Nav │ Footer │ Mobile  │Theme  │ Icon │
  │Sect.│        │ Drawer  │Toggle │Resolv│
  └─────┴────────┴─────────┴───────┴──────┘
```

### Plugin Interface

```ts
interface ShellLayout {
  /** Unique layout identifier */
  id: string;

  /** Human-readable label */
  label: string;

  /** Render the shell frame around children */
  render(props: {
    config: ResolvedDemoConfig;
    children: React.ReactNode;
    parts: SharedParts;
  }): React.ReactElement;

  /** Required for layouts with extra config (wizard, topnav). Validated at resolve time. */
  configSchema?: ZodSchema;
}
```

`configSchema` is **required** for any layout that expects extra fields (wizard needs `wizard.steps`, topnav needs `suite`/`module`/`gradient`). The config resolver validates layout-specific fields at resolve time and throws if required fields are missing.

### Plugin Registry

```ts
// components/shell/registry.ts
const LAYOUTS = new Map<string, ShellLayout>();

export function registerLayout(layout: ShellLayout) {
  LAYOUTS.set(layout.id, layout);
}

export function getLayout(id: string): ShellLayout {
  return LAYOUTS.get(id) ?? LAYOUTS.get('sidebar')!;
}
```

Three built-in plugins register at import time: `sidebar`, `topnav`, `wizard`. Custom plugins can be added by calling `registerLayout()` before rendering.

### SharedParts

Pre-built components that plugins compose freely:

| Part | Purpose |
|------|---------|
| `NavSection` | Renders a collapsible or flat nav section with Lucide icons |
| `Footer` | Section nav row (auto from config.nav) + attribution line |
| `MobileDrawer` | Overlay + slide-in drawer for mobile viewports |
| `ThemeToggle` | Dark/light mode switch button |
| `IconResolver` | Lucide icon lookup by string name, fallback to `Circle` |

### "All Demos" Back Link

The current `app/(demos)/layout.tsx` renders a fixed-position "← All Demos" pill button. This behavior moves into the `DemoShell` orchestrator (rendered for all layout plugins). The `(demos)/layout.tsx` file becomes a pass-through that only wraps `{children}`.

### File Structure

```
components/shell/
├── DemoShell.tsx              # Orchestrator
├── registry.ts                # Plugin registry
├── plugins/
│   ├── sidebar.tsx            # Sidebar layout plugin
│   ├── topnav.tsx             # Topnav layout plugin
│   └── wizard.tsx             # Wizard layout plugin
├── parts/
│   ├── NavSection.tsx
│   ├── Footer.tsx
│   ├── MobileDrawer.tsx
│   ├── ThemeToggle.tsx
│   └── IconResolver.tsx
├── config/
│   ├── defineDemo.ts          # Convention-heavy config factory
│   ├── types.ts               # Unified types
│   ├── defaults.ts            # Smart defaults
│   └── resolve.ts             # Config resolution
├── theme/
│   ├── tokens.ts              # 3-layer token definitions
│   ├── presets/               # Named presets
│   ├── runtime.ts             # JS runtime override API
│   └── css-vars.ts            # Token → CSS var generation
└── index.ts                   # Public API exports
```

## Layout Plugins

### Sidebar Plugin (`layout: 'sidebar'`)

Default layout. Features:
- Fixed sidebar (264px) with collapsible nav sections
- Section headers with chevron expand/collapse
- Section-colored nav items with active rail indicator
- Compact top header: hamburger (mobile) + client logo/name + product badge + theme toggle
- Content area fills remaining width, scrolls independently
- Footer with section nav row

### Topnav Plugin (`layout: 'topnav'`)

SPM module layout. Features:
- Top gradient bar (1px)
- Horizontal header with suite name (gradient text) + module code circle + module info
- "Demo Data" badge in header right
- Sidebar below header (240px) with flat (non-collapsible) nav sections
- Footer with section nav row + bottom gradient bar

Topnav **requires** these config fields (validated by Zod schema):
```ts
{
  suite: { name: string; tagline: string };
  module: { code: string; name: string; description: string };
  gradient: { start: string; mid: string; end: string };
}
```

### Wizard Plugin (`layout: 'wizard'`)

Consultative flow layout. New addition for products like SGM. Two modes:

**Guided Mode (linear):**
- Step progress bar at top showing completed/current/upcoming
- Step counter (e.g., "Step 3 of 6")
- "Free Explore" toggle in top-right
- Page content renders in center
- Back/Next navigation buttons at bottom

**Free Explore Mode (hub-and-spoke):**
- Hub page shows all steps as cards in a grid
- Each card shows completion state (checkmark or open circle)
- Clicking any card navigates full-screen, "Back to Hub" returns
- "Guided Mode" toggle returns to linear flow at next incomplete step
- Completion state persists in `sessionStorage` (resets on tab close)

Wizard **requires** `wizard` config (validated by Zod schema):
```ts
{
  wizard: {
    steps: Array<{
      id: string;           // Maps to route: app/(demos)/{slug}/{id}/page.tsx
      label: string;
      icon: string;         // Lucide icon name
      skippable?: boolean;  // Default: true
    }>;
    startInGuided?: boolean;   // Default: true
    showStepNumbers?: boolean; // Default: true
  };
}
```

Wizard state model:
```ts
interface WizardState {
  currentStep: number;
  completedSteps: Set<string>;
  mode: 'guided' | 'explore';
}
```

State lives in React context. Pages call `useWizard()` to read/update completion.

## Config API

### Convention Over Configuration

Minimal config (4 lines):
```ts
export default defineDemo({
  slug: 'register',
  client: { name: 'Summit Sleep Co.' },
  product: { name: 'REGISTER' },
});
```

Full config (everything explicit):
```ts
export default defineDemo({
  slug: 'register',
  layout: 'wizard',
  client: { name: 'Summit Sleep Co.', tagline: 'Retail Revenue OS', region: 'National', logo: Bed },
  product: { name: 'REGISTER', badge: 'Interactive Demo' },
  theme: 'register-slate',
  colors: { primary: '#1E3A5F', accent: '#06B6D4' },
  darkMode: true,
  nav: [
    { section: 'Act 1', color: '#5B9BD5', items: [...] },
  ],
  footer: { copyright: '© 2026 Summit Sleep Co.', poweredBy: 'AICodeRally' },
  meta: {
    industry: 'Retail Operations',
    tagline: 'Retail revenue intelligence from floor to boardroom',
    color: '#64748B',
  },
  wizard: { steps: [...], startInGuided: true },
});
```

### Slug Derivation

The `slug` field must match the directory name under `app/(demos)/`. For example, `app/(demos)/register/demo.config.ts` must have `slug: 'register'`. The build-time registry script validates this match and errors on mismatch.

### Convention Defaults

| Field | Default when omitted |
|-------|---------------------|
| `layout` | `'sidebar'` |
| `theme` | `'barrel-brass'` |
| `darkMode` | `true` |
| `nav` | Auto-discovered from filesystem (see FS Nav Discovery section below) |
| `footer.copyright` | `© {year} {client.name}` |
| `footer.poweredBy` | `'AICodeRally'` |
| `meta.color` | Derived from `colors.primary` or preset's primary |
| `meta.industry` | **Required** — build errors if missing |
| `meta.tagline` | **Required** — build errors if missing |

### Unified Type (Discriminated Union)

```ts
// Base config shared by all layouts
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
  theme?: ThemePreset;
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
  /** Per-demo extension CSS vars (see Demo Extension Tokens) */
  extensionVars?: string;
}

// Layout-specific discriminated unions
interface SidebarDemoConfig extends DemoConfigBase {
  layout?: 'sidebar';
}

interface TopnavDemoConfig extends DemoConfigBase {
  layout: 'topnav';
  suite: { name: string; tagline: string };
  module: { code: string; name: string; description: string };
  gradient: { start: string; mid: string; end: string };
}

interface WizardDemoConfig extends DemoConfigBase {
  layout: 'wizard';
  wizard: {
    steps: Array<{
      id: string;
      label: string;
      icon: string;
      skippable?: boolean;
    }>;
    startInGuided?: boolean;
    showStepNumbers?: boolean;
  };
}

type DemoConfig = SidebarDemoConfig | TopnavDemoConfig | WizardDemoConfig;
```

This ensures TypeScript catches misconfiguration (e.g., `layout: 'wizard'` without `wizard.steps` is a type error).

### Palette Shorthand

The `colors` field accepts simple strings (e.g., `{ primary: '#1E3A5F' }`). The token engine auto-generates the full shade scale (50-950) from each base color using a lightness ramp algorithm (similar to Tailwind's color generator). This means:

- Existing configs (`colors: { primary: '#C6A052', accent: '#B87333' }`) work unchanged
- The generated shade scale feeds into the 3-layer token system
- Presets provide pre-built palettes; `colors` overrides replace specific palette channels

## Design Token System

### Three-Layer Architecture

**Layer 1 — Palette** (raw color values, auto-generated from shorthand):
```ts
interface Palette {
  primary:   { 50: string, 100: string, ..., 900: string, 950: string };
  accent:    { 50: string, ..., 950: string };
  neutral:   { 50: string, ..., 950: string };
  success:   string;
  danger:    string;
  warning:   string;
}
```

Shade scales are auto-generated from the single color via a lightness ramp. Presets define pre-computed palettes. The `colors` shorthand regenerates shades at resolve time.

**Layer 2 — Semantic** (meaning-aware, mode-dependent):
```ts
interface SemanticTokens {
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
```

Each preset defines two semantic mappings (dark and light) referencing the same palette. `darkMode` flag selects active mapping.

**Layer 3 — Component** (shell-specific):
```ts
interface ComponentTokens {
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
```

Component tokens → semantic tokens → palette. Changing a palette value cascades.

### Demo Extension Tokens

Per-demo CSS var files (`routeiq-vars.css`, `route-vars.css`, `meridian-vars.css`, `phoenix-intel-vars.css`) define demo-specific tokens used by page components (chart colors, map backgrounds, animation values, etc.). These are **outside** the shell's token system scope.

**Strategy:** Keep per-demo CSS var files as "extension tokens." They are:
- Imported in the demo's `layout.tsx` (not in the shell)
- Not managed by the token engine
- Not affected by the codemod (no renaming/deletion)
- Namespaced per-demo (e.g., `--pl-*` for routeiq, `--mr-*` for meridian)

The token engine handles the shell chrome (sidebar, header, footer, nav). Demo page components use their own extension tokens for domain-specific visuals. This separation means the shell migration doesn't break any page component styling.

The `extensionVars` config field is an optional path to a CSS file that the shell's layout.tsx auto-imports, so demos don't need a custom layout wrapper just for CSS vars.

### CSS Variable Output

All three layers flatten to CSS custom properties:
```css
--palette-primary-500: #1E3A5F;
--sem-bg-primary: var(--palette-neutral-950);
--comp-sidebar-bg: var(--sem-bg-secondary);
```

### Runtime Override API

```ts
import { setTokens, resetTokens } from '@/components/shell/theme/runtime';

setTokens({ 'palette-primary-500': '#FF6B00' });
setTokens({ 'comp-sidebar-bg': '#000000' });
resetTokens();
```

Foundation for the Rally Cockpit live theme editor.

### Preset Migration

Each existing preset becomes: Palette (shade scales generated from existing flat colors) + two SemanticTokens mappings (dark/light) + auto-derived ComponentTokens. No visual change for existing demos.

## Filesystem Nav Auto-Discovery

When `nav` is omitted from config, the build-time resolver generates nav from the filesystem.

### Algorithm

1. Scan `app/(demos)/{slug}/` for directories containing `page.tsx` files
2. **Depth handling:** First-level directories become **sections**. Second-level directories become **items** within those sections. Deeper nesting is flattened (e.g., `comp/mgmt/data/page.tsx` becomes item "Data" in section "Comp").
3. **Sort order:** Sections and items are sorted **alphabetically** by directory name. To control order, prefix directories with numbers (e.g., `01-corporate/`, `02-strategy/`) — the number prefix is stripped from the display label.
4. **Label generation:** Directory names are title-cased with hyphens/underscores replaced by spaces (e.g., `store-portfolio` → "Store Portfolio").
5. **Icon assignment:** Icons are assigned by keyword matching against a built-in map:

| Keyword in path | Icon |
|----------------|------|
| dashboard | `LayoutDashboard` |
| overview | `Building2` |
| settings | `Settings` |
| team, users | `Users` |
| chart, analytics | `BarChart3` |
| calendar | `Calendar` |
| map | `Map` |
| target | `Target` |
| *(default)* | `Circle` |

6. **Override behavior:** When `nav` is explicitly provided in the config, it **fully replaces** auto-discovery. There is no merging.

## Auto-Discovery & Home Page

### Build-Time Registry

Script: `scripts/generate-registry.ts`

1. Scans `app/(demos)/*/demo.config.ts`
2. Imports each, extracts `meta` + `product.name` + `slug` + primary color + layout
3. Validates: errors if `meta.industry` or `meta.tagline` missing, errors if `slug` doesn't match directory name
4. Writes `data/demo-registry.ts` (generated, gitignored)

### Home Page

Imports from generated registry. No manual `productDemos[]` array.

Home page footer: `© 2026 AICodeRally · Powered by AICR`. No social icons, no external links.

### Package Scripts

```json
{
  "generate:registry": "tsx scripts/generate-registry.ts",
  "prebuild": "pnpm generate:registry",
  "dev": "pnpm generate:registry && next dev",
  "verify": "pnpm generate:registry && pnpm typecheck && next build"
}
```

## Per-Demo Shell Footer

Auto-generated from config. All layout plugins render the shared Footer part. Two rows:

1. **Section nav row** — horizontal list of nav section names from `config.nav`, styled with primary color. These are clickable anchors that scroll to/navigate to the first item in each section.
2. **Attribution** — `© {client.name} · Powered by AICodeRally`

This is a new addition for sidebar demos (previously had no section nav in footer). The section nav row provides consistent wayfinding across all layouts.

Footer config is fully optional with smart defaults.

## Migration

### Codemod Script (`scripts/migrate-to-v2.ts`)

One-shot script for all existing demos. Run once, verify, delete old code.

**Per-demo (12 shell-wrapped demos):**
1. Read `demo.config.ts`, detect shell type (`defineDemo` → sidebar, `defineSpmDemo` → topnav)
2. Transform to new API shape:
   - Add `slug` (derived from directory name)
   - Add `layout: 'sidebar'` or `layout: 'topnav'`
   - Add `meta: { industry, tagline, color }` (extracted from home page `productDemos[]` for existing demos)
   - For topnav: restructure `suite`/`module`/`gradient` into the discriminated union shape
3. Rewrite `demo.config.ts`
4. Rewrite `layout.tsx` — replace old shell/provider imports with unified `<DemoShell>`
5. **Keep** per-demo CSS var imports (`routeiq-vars.css`, `meridian-vars.css`, etc.) — these are extension tokens, not shell tokens

**Special cases:**
- `route`: No shell, no config. Create a minimal `demo.config.ts` with `meta` fields for registry inclusion. No layout change.
- `routeiq-royal`: Treat as a standard sidebar demo (it's a fork of routeiq with different nav hrefs).

**Global:**
6. Rename localStorage key: `routeiq-theme` → `demo-theme` via grep+replace
7. Add runtime migration in DemoShell: on mount, if `localStorage.getItem('routeiq-theme')` exists, copy value to `demo-theme` key and delete old key. This preserves existing user preferences.
8. Remove `--pl-*` references **only from shell components** (not from demo page components or extension CSS files)
9. Custom event `demoshell-theme-change` renamed to `shell-theme-change` for consistency
10. Run `pnpm generate:registry` + `pnpm typecheck`

**Post-migration cleanup:**
- Delete `components/demo-shell/`
- Delete `components/spm-shell/`
- `styles/routeiq-vars.css` is **kept** (renamed to `styles/ext/routeiq.css` for clarity) — it's used by demo page components
- `styles/route-vars.css` is **kept** (renamed to `styles/ext/route.css`) — standalone page extension tokens

## Legacy Cleanup

| Legacy Item | Action |
|-------------|--------|
| `--pl-*` vars in shell | Eliminated — replaced by token system |
| `--pl-*` vars in demo pages | **Kept** as extension tokens (renamed file location) |
| `routeiq-theme` localStorage | Runtime migration to `demo-theme` on first load |
| `DemoShell` (old) | Deleted after migration |
| `SpmShell` | Deleted after migration |
| Home page `productDemos[]` | Replaced by registry |
| Footer Studio/Edge/Summit links | Removed |
| Footer social icons | Removed |
| `demoshell-theme-change` event | Renamed to `shell-theme-change` |

## Out of Scope

- **Rally Cockpit** — PM page, collaboration panel, session recording, transcript-driven coding. Separate spec after Shell v2 ships.

## Risks

| Risk | Mitigation |
|------|-----------|
| Codemod misses edge cases | Demo inventory table above catalogues every case. Manual review per demo + `pnpm verify`. |
| Demo extension CSS vars break | Extension vars are explicitly preserved. Codemod only touches shell-level `--pl-*` refs. |
| Token shade generation doesn't match existing visuals | Generate shades, then visual-diff each demo. Tweak ramp algorithm to match. |
| Wizard scope creep | Wizard manages navigation only. Pages handle business logic. |
| Plugin registry indirection | Only 3 plugins. Simple Map lookup. |
| FS nav discovery wrong ordering | Explicit `nav` override fully replaces discovery. Number-prefix convention for ordering. |
| Footer section nav is new for sidebar demos | Intentional — adds consistent wayfinding. Low-risk visual addition. |
