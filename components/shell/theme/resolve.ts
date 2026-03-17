import type { Palette, SemanticTokens, ComponentTokens, ThemePresetName } from './types';
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
      ...(input.colors?.primary
        ? {
            sidebarActiveAccent: input.colors.primary,
            progressBarFill: input.colors.primary,
          }
        : {}),
    },
  };
}
