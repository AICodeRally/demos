import type { ThemeTokens } from './types';

export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  return {
    '--prizym-color-primary': tokens.colors.primary,
    '--prizym-color-accent': tokens.colors.accent,
    '--prizym-color-success': tokens.colors.success,
    '--prizym-color-danger': tokens.colors.danger,
    '--prizym-color-neutral': tokens.colors.neutral,
    '--prizym-bg-primary': tokens.surfaces.bgPrimary,
    '--prizym-bg-secondary': tokens.surfaces.bgSecondary,
    '--prizym-bg-content': tokens.surfaces.bgContent,
    '--prizym-card-bg': tokens.surfaces.cardBg,
    '--prizym-border-default': tokens.surfaces.borderDefault,
    '--prizym-border-subtle': tokens.surfaces.borderSubtle,
    '--prizym-text-primary': tokens.text.primary,
    '--prizym-text-secondary': tokens.text.secondary,
    '--prizym-text-muted': tokens.text.muted,
    '--prizym-text-inverse': tokens.text.inverse,
    '--prizym-shadow-card': tokens.shadows.card,
    '--prizym-shadow-elevated': tokens.shadows.elevated,
  };
}
