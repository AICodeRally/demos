import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';

import { TABLET_CONFIG, CATALOG_ITEMS as TABLET_CATALOG, REPS as TABLET_REPS, SAMPLE_PERIODS as TABLET_PERIODS } from './tablet';
import { ACME_CONFIG, ACME_CATALOG, ACME_REPS, ACME_PERIODS } from './acme-electronics';
import { PREMIER_MOTORS_CONFIG, PREMIER_CATALOG, PREMIER_REPS, PREMIER_PERIODS } from './premier-motors';
import { SUMMIT_SHIELD_CONFIG, SUMMIT_CATALOG, SUMMIT_REPS, SUMMIT_PERIODS } from './summit-shield';
import { CLOUDSTACK_CONFIG, CLOUDSTACK_CATALOG, CLOUDSTACK_REPS, CLOUDSTACK_PERIODS } from './cloudstack-ai';
import { MEDVANCE_CONFIG, MEDVANCE_CATALOG, MEDVANCE_REPS, MEDVANCE_PERIODS } from './medvance';

/* ── Client Bundle ──────────────────────────────────────── */

export interface ClientBundle {
  config: ClientConfig;
  catalog: SaleItem[];
  reps: { id: string; name: string; storeId?: string }[];
  periods: Record<string, PeriodContext>;
}

/* ── Registry ───────────────────────────────────────────── */

export const CLIENT_REGISTRY: Record<string, ClientBundle> = {
  'tablet': {
    config: TABLET_CONFIG,
    catalog: TABLET_CATALOG,
    reps: TABLET_REPS,
    periods: TABLET_PERIODS,
  },
  'acme-electronics': {
    config: ACME_CONFIG,
    catalog: ACME_CATALOG,
    reps: ACME_REPS,
    periods: ACME_PERIODS,
  },
  'premier-motors': {
    config: PREMIER_MOTORS_CONFIG,
    catalog: PREMIER_CATALOG,
    reps: PREMIER_REPS,
    periods: PREMIER_PERIODS,
  },
  'summit-shield': {
    config: SUMMIT_SHIELD_CONFIG,
    catalog: SUMMIT_CATALOG,
    reps: SUMMIT_REPS,
    periods: SUMMIT_PERIODS,
  },
  'cloudstack-ai': {
    config: CLOUDSTACK_CONFIG,
    catalog: CLOUDSTACK_CATALOG,
    reps: CLOUDSTACK_REPS,
    periods: CLOUDSTACK_PERIODS,
  },
  'medvance': {
    config: MEDVANCE_CONFIG,
    catalog: MEDVANCE_CATALOG,
    reps: MEDVANCE_REPS,
    periods: MEDVANCE_PERIODS,
  },
};

export const CLIENT_LIST = Object.values(CLIENT_REGISTRY).map((b) => ({
  id: b.config.id,
  name: b.config.name,
}));
