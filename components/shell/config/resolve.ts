import type { DemoConfig, ResolvedDemoConfig } from './types';
import { applyDefaults } from './defaults';

export function resolveConfig(config: DemoConfig): ResolvedDemoConfig {
  const resolved = applyDefaults(config);
  // FS nav discovery will be added in Task 4b
  return resolved;
}
