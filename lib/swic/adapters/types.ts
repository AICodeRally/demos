import type { ClientConfig, PeriodContext } from '@/lib/swic/engine/types';

/**
 * ICM Adapter Interface
 *
 * Each ICM system (Varicent, Xactly, CaptivateIQ, etc.) implements
 * this interface to provide client configurations and period data.
 */
export interface ICMAdapter {
  name: string;

  /** Get a client's commission configuration */
  fetchClientConfig(clientId: string): Promise<ClientConfig>;

  /** Pull a rep's period context (YTD/MTD data) */
  fetchPeriodContext(clientId: string, repId: string): Promise<PeriodContext>;

  /** List available reps for a client */
  listReps(clientId: string): Promise<{ id: string; name: string; storeId?: string }[]>;

  /** List available client configs */
  listClients(): Promise<{ id: string; name: string }[]>;
}
