import type { DemoConfig, ResolvedDemoConfig } from './types';
import { applyDefaults } from './defaults';
import { discoverNav } from './fs-nav-discovery';

export function resolveConfig(config: DemoConfig): ResolvedDemoConfig {
  const resolved = applyDefaults(config);
  if (resolved.nav.length === 0) {
    resolved.nav = discoverNav(resolved.slug);
  }
  return resolved;
}
