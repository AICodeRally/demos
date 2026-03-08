import type { ThemeConfig, ThemeTokens } from './types';
import { tokensToCssVars } from './tokens';
import { barrelBrass } from './presets/barrel-brass';
import { midnight } from './presets/midnight';
import { cleanLight } from './presets/clean-light';
import { aegisIvory } from './presets/aegis-ivory';
import { registerSlate } from './presets/register-slate';
import { charterStone } from './presets/charter-stone';
import { prizymNavy } from './presets/prizym-navy';

const PRESETS: Record<string, ThemeTokens> = {
  'barrel-brass': barrelBrass,
  midnight,
  'clean-light': cleanLight,
  'aegis-ivory': aegisIvory,
  'register-slate': registerSlate,
  'charter-stone': charterStone,
  'prizym-navy': prizymNavy,
};

export function resolveTheme(config: ThemeConfig): ThemeTokens {
  const base = PRESETS[config.preset ?? 'barrel-brass'] ?? barrelBrass;
  return {
    colors: { ...base.colors, ...config.colors },
    surfaces: { ...base.surfaces, ...config.surfaces },
    text: { ...base.text, ...config.text },
    shadows: { ...base.shadows, ...config.shadows },
  };
}

export function createThemeVars(config: ThemeConfig): Record<string, string> {
  return tokensToCssVars(resolveTheme(config));
}

export function createThemeStyle(config: ThemeConfig): string {
  const vars = createThemeVars(config);
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}
