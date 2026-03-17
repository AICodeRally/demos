import type { ResolvedTokens } from './resolve';

/**
 * Converts ResolvedTokens to a flat map of CSS custom properties.
 * Includes:
 * - --palette-{primary|accent|neutral}-{50-950}  (shade scales)
 * - --palette-{success|danger|warning}           (flat semantic colors)
 * - --sem-*                                      (semantic layer)
 * - --comp-*                                     (component layer)
 * - --prizym-*                                   (17 backward compat aliases)
 */
export function tokensToCssVars(tokens: ResolvedTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  // Layer 1 — shade scales
  const scales = ['primary', 'accent', 'neutral'] as const;
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  for (const scale of scales) {
    for (const step of steps) {
      vars[`--palette-${scale}-${step}`] = tokens.palette[scale][step];
    }
  }

  // Layer 1 — flat colors
  vars['--palette-success'] = tokens.palette.success;
  vars['--palette-danger'] = tokens.palette.danger;
  vars['--palette-warning'] = tokens.palette.warning;

  // Layer 2 — semantic tokens
  const sem = tokens.semantic;
  vars['--sem-bg-primary'] = sem.bgPrimary;
  vars['--sem-bg-secondary'] = sem.bgSecondary;
  vars['--sem-bg-content'] = sem.bgContent;
  vars['--sem-card-bg'] = sem.cardBg;
  vars['--sem-text-primary'] = sem.textPrimary;
  vars['--sem-text-secondary'] = sem.textSecondary;
  vars['--sem-text-muted'] = sem.textMuted;
  vars['--sem-text-inverse'] = sem.textInverse;
  vars['--sem-border-default'] = sem.borderDefault;
  vars['--sem-border-subtle'] = sem.borderSubtle;
  vars['--sem-shadow-card'] = sem.shadowCard;
  vars['--sem-shadow-elevated'] = sem.shadowElevated;

  // Layer 3 — component tokens
  const comp = tokens.component;
  vars['--comp-sidebar-bg'] = comp.sidebarBg;
  vars['--comp-sidebar-text'] = comp.sidebarText;
  vars['--comp-sidebar-text-muted'] = comp.sidebarTextMuted;
  vars['--comp-sidebar-border'] = comp.sidebarBorder;
  vars['--comp-sidebar-active-accent'] = comp.sidebarActiveAccent;
  vars['--comp-header-bg'] = comp.headerBg;
  vars['--comp-header-border'] = comp.headerBorder;
  vars['--comp-footer-bg'] = comp.footerBg;
  vars['--comp-nav-section-label'] = comp.navSectionLabel;
  vars['--comp-progress-bar-fill'] = comp.progressBarFill;

  // Backward compat aliases — 17 vars matching old lib/theme/tokens.ts output
  vars['--prizym-color-primary'] = tokens.palette.primary[500];
  vars['--prizym-color-accent'] = tokens.palette.accent[500];
  vars['--prizym-color-success'] = tokens.palette.success;
  vars['--prizym-color-danger'] = tokens.palette.danger;
  vars['--prizym-color-neutral'] = tokens.palette.neutral[500];
  vars['--prizym-bg-primary'] = sem.bgPrimary;
  vars['--prizym-bg-secondary'] = sem.bgSecondary;
  vars['--prizym-bg-content'] = sem.bgContent;
  vars['--prizym-card-bg'] = sem.cardBg;
  vars['--prizym-border-default'] = sem.borderDefault;
  vars['--prizym-border-subtle'] = sem.borderSubtle;
  vars['--prizym-text-primary'] = sem.textPrimary;
  vars['--prizym-text-secondary'] = sem.textSecondary;
  vars['--prizym-text-muted'] = sem.textMuted;
  vars['--prizym-text-inverse'] = sem.textInverse;
  vars['--prizym-shadow-card'] = sem.shadowCard;
  vars['--prizym-shadow-elevated'] = sem.shadowElevated;

  return vars;
}

/**
 * Applies CSS vars to a DOM element (defaults to :root).
 */
export function applyCssVars(
  vars: Record<string, string>,
  element: HTMLElement = document.documentElement,
): void {
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value);
  }
}
