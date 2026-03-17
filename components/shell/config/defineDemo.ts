import type { DemoConfig } from './types';

/**
 * Convention-heavy config factory. 4-line minimum:
 * ```ts
 * export default defineDemo({
 *   slug: 'register',
 *   client: { name: 'Summit Sleep Co.' },
 *   product: { name: 'REGISTER' },
 *   meta: { industry: 'Retail', tagline: 'Revenue intelligence' },
 * });
 * ```
 */
export function defineDemo<T extends DemoConfig>(config: T): T {
  return config;
}
