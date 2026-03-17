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
