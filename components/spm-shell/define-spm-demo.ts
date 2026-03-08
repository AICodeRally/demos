import type { SpmDemoConfig, SpmSuiteBranding, SpmModuleBranding, SpmGradient, SpmNavSection, SpmFooterConfig } from './types';
import type { ThemePreset } from '@aicr/prizym-theme';

interface DefineSpmDemoInput {
  suite: SpmSuiteBranding;
  module: SpmModuleBranding;
  gradient: SpmGradient;
  theme?: ThemePreset;
  colors?: SpmDemoConfig['theme']['colors'];
  nav: SpmNavSection[];
  footer: SpmFooterConfig;
}

export function defineSpmDemo(input: DefineSpmDemoInput): SpmDemoConfig {
  return {
    suite: input.suite,
    module: input.module,
    gradient: input.gradient,
    theme: {
      preset: input.theme ?? 'prizym-navy',
      colors: input.colors,
    },
    nav: input.nav,
    footer: input.footer,
  };
}
