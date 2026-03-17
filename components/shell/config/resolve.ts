import type { DemoConfig, ResolvedDemoConfig } from './types';
import { applyDefaults } from './defaults';

export function resolveConfig(config: DemoConfig): ResolvedDemoConfig {
  const resolved = applyDefaults(config);
  // FS nav discovery (fs-nav-discovery.ts) is available for build-time scripts
  // but cannot run in client components. All demos provide explicit nav arrays.
  return resolved;
}
