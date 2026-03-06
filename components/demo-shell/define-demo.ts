import type { DemoConfig } from './types';
import type { ThemePreset } from '@aicr/prizym-theme';

interface DefineDemoInput {
  client: DemoConfig['client'];
  product: DemoConfig['product'];
  theme?: ThemePreset;
  colors?: DemoConfig['theme']['colors'];
  nav: DemoConfig['nav'];
  footer: DemoConfig['footer'];
}

export function defineDemo(input: DefineDemoInput): DemoConfig {
  return {
    client: input.client,
    product: input.product,
    theme: {
      preset: input.theme ?? 'barrel-brass',
      colors: input.colors,
    },
    nav: input.nav,
    footer: input.footer,
  };
}
