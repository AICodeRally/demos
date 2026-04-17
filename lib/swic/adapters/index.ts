import type { ICMAdapter } from './types';
import { MockAdapter } from './mock';

const adapters: Record<string, (envId?: string) => ICMAdapter> = {
  mock: () => new MockAdapter(),
};

export function getAdapter(name: string = 'mock', envId?: string): ICMAdapter {
  const factory = adapters[name];
  if (!factory) {
    throw new Error(`Unknown ICM adapter: ${name}. Available: ${Object.keys(adapters).join(', ')}`);
  }
  return factory(envId);
}

export type { ICMAdapter } from './types';
