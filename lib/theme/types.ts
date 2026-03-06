export interface ThemeColors {
  primary: string;
  accent: string;
  success: string;
  danger: string;
  neutral: string;
}

export interface ThemeSurfaces {
  bgPrimary: string;
  bgSecondary: string;
  bgContent: string;
  cardBg: string;
  borderDefault: string;
  borderSubtle: string;
}

export interface ThemeText {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
}

export interface ThemeShadows {
  card: string;
  elevated: string;
}

export interface ThemeTokens {
  colors: ThemeColors;
  surfaces: ThemeSurfaces;
  text: ThemeText;
  shadows: ThemeShadows;
}

export type ThemePreset = 'barrel-brass' | 'midnight' | 'clean-light' | 'aegis-ivory' | 'register-slate' | 'charter-stone';

export interface ThemeConfig {
  preset?: ThemePreset;
  colors?: Partial<ThemeColors>;
  surfaces?: Partial<ThemeSurfaces>;
  text?: Partial<ThemeText>;
  shadows?: Partial<ThemeShadows>;
}
