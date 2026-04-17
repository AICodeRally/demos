import type { ICMAdapter } from './types';
import type { ClientConfig, PeriodContext } from '@/lib/swic/engine/types';
import { CLIENT_REGISTRY, CLIENT_LIST } from '@/lib/swic/data/registry';

/**
 * Mock ICM Adapter — returns data from the client registry.
 * No external dependencies. Works offline.
 */
export class MockAdapter implements ICMAdapter {
  name = 'mock';

  async fetchClientConfig(clientId: string): Promise<ClientConfig> {
    const bundle = CLIENT_REGISTRY[clientId];
    if (!bundle) throw new Error(`Unknown client: ${clientId}`);
    return bundle.config;
  }

  async fetchPeriodContext(clientId: string, repId: string): Promise<PeriodContext> {
    const bundle = CLIENT_REGISTRY[clientId];
    if (!bundle) throw new Error(`Unknown client: ${clientId}`);
    return bundle.periods[repId] ?? {
      revenue: 30000, cost: 18000, margin: 12000,
      units: 50, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 40000,
    };
  }

  async listReps(clientId: string) {
    const bundle = CLIENT_REGISTRY[clientId];
    if (!bundle) throw new Error(`Unknown client: ${clientId}`);
    return bundle.reps;
  }

  async listClients() {
    return CLIENT_LIST;
  }
}
