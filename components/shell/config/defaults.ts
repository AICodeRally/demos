import type { DemoConfig, ResolvedDemoConfig } from './types';

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
      copyright: config.footer?.copyright ?? `\u00A9 ${year} ${config.client.name}`,
      poweredBy: config.footer?.poweredBy ?? 'AICodeRally',
    },
    meta: {
      ...config.meta,
      color: config.meta.color ?? config.colors?.primary,
    },
    extensionVars: config.extensionVars,
    ...('suite' in config ? { suite: config.suite } : {}),
    ...('module' in config ? { module: config.module } : {}),
    ...('gradient' in config ? { gradient: config.gradient } : {}),
    ...('wizard' in config ? { wizard: config.wizard } : {}),
  };
}
