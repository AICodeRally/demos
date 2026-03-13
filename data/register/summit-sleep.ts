import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic-engine/types';
import type { D365StoreContext } from './d365-schemas';

/* ══════════════════════════════════════════════════════════
   Summit Sleep Co. — Client Configuration

   Rebranded from Mattress Firm for demo purposes.
   Component IDs match the SWIC engine integration.
   ══════════════════════════════════════════════════════════ */

export const SUMMIT_SLEEP_CONFIG: ClientConfig = {
  id: 'summit-sleep',
  name: 'Summit Sleep Co.',
  logo: 'summit-sleep',

  theme: {
    primary: '#1E3A5F',
    secondary: '#c8cad8',
    background: '#0F0E1A',
    text: '#E2E8F0',
    accent: '#06B6D4',
  },

  components: [
    {
      id: 'base-comm',
      label: 'Base Comm.',
      group: 'commission',
      rule: {
        type: 'tiered',
        basis: 'revenue',
        marginal: true,
        tiers: [
          { min: 0, rate: 0.04 },
          { min: 50000, rate: 0.05 },
          { min: 75000, rate: 0.06 },
        ],
      },
    },
    {
      id: 'outlet-comm',
      label: 'Outlet Comm.',
      group: 'commission',
      rule: { type: 'percent_of', rate: 0.01, basis: 'revenue' },
    },
    {
      id: 'product-prem',
      label: 'Product Prem.',
      group: 'commission',
      rule: { type: 'fixed_per_match', amount: 50, match: { field: 'tag', value: 'premium-tier' } },
    },
    {
      id: 'spiff',
      label: 'SPIFF',
      group: 'spiff',
      rule: { type: 'fixed_per_match', amount: 25, match: { field: 'tag', value: 'adjustable-base' } },
    },
    {
      id: 'bundle-accel',
      label: 'Bundle Accel.',
      group: 'bonus',
      rule: {
        type: 'bundle_bonus',
        amount: 75,
        requiredCategories: ['Mattress', 'Adjustable Base'],
        label: 'Sleep System Bundle',
      },
    },
  ],

  summaryMetrics: [
    { id: 'total-revenue', label: 'Total Revenue', basis: 'total_revenue', format: 'currency' },
    { id: 'total-costs', label: 'Total Costs', basis: 'total_cost', format: 'currency' },
    { id: 'gross-margin-dollar', label: 'Gross Margin Dollar', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'gross-margin-pct', label: 'Gross Margin Percentage', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'Amount Needed for Next Tier',
    basisComponentId: 'base-comm',
    showPotentialAtNextTier: true,
    potentialLabel: 'Potential Base Comm. at Next Tier',
  },

  notes: [
    'Projected commissions — actual commissions calculated at time of ticket invoice.',
  ],

  splitConfig: {
    enabled: false,
    defaultFactor: 1,
    label: 'Split Credit',
  },
};

/* ── Sample Catalog Items (20 items) ──────────────────────
   Categories: Mattress, Adjustable Base, Accessory,
               Protection Plan, Delivery
   ─────────────────────────────────────────────────────── */

export const CATALOG_ITEMS: SaleItem[] = [
  // ── Mattresses (8)
  { id: 'ss-001', name: 'CloudRest Hybrid 13.5" Plush (King)', category: 'Mattress', tags: ['premium-tier'], price: 2999, cost: 1799, quantity: 1 },
  { id: 'ss-002', name: 'CloudRest Hybrid 13.5" Plush (Queen)', category: 'Mattress', tags: ['premium-tier'], price: 2499, cost: 1499, quantity: 1 },
  { id: 'ss-003', name: 'Harmony 11" Memory Foam (King)', category: 'Mattress', tags: ['premium-tier'], price: 2799, cost: 1699, quantity: 1 },
  { id: 'ss-004', name: 'Harmony 11" Memory Foam (Queen)', category: 'Mattress', tags: ['premium-tier'], price: 2299, cost: 1379, quantity: 1 },
  { id: 'ss-005', name: 'DreamLift 9.5" Firm (King)', category: 'Mattress', tags: [], price: 1699, cost: 1019, quantity: 1 },
  { id: 'ss-006', name: 'DreamLift 9.5" Firm (Queen)', category: 'Mattress', tags: [], price: 1499, cost: 899, quantity: 1 },
  { id: 'ss-007', name: 'Essential Comfort 8" (King)', category: 'Mattress', tags: [], price: 1299, cost: 779, quantity: 1 },
  { id: 'ss-008', name: 'Essential Comfort 8" (Queen)', category: 'Mattress', tags: [], price: 999, cost: 599, quantity: 1 },

  // ── Adjustable Bases (4)
  { id: 'ss-009', name: 'ErgoMotion Adjustable Base Pro', category: 'Adjustable Base', tags: ['adjustable-base', 'bundle-eligible'], price: 1999, cost: 1199, quantity: 1 },
  { id: 'ss-010', name: 'ErgoMotion Adjustable Base Standard', category: 'Adjustable Base', tags: ['adjustable-base', 'bundle-eligible'], price: 1299, cost: 779, quantity: 1 },
  { id: 'ss-011', name: 'ErgoMotion Split King Pro', category: 'Adjustable Base', tags: ['adjustable-base', 'bundle-eligible'], price: 1599, cost: 959, quantity: 1 },
  { id: 'ss-012', name: 'ErgoMotion Split King Standard', category: 'Adjustable Base', tags: ['adjustable-base', 'bundle-eligible'], price: 799, cost: 479, quantity: 1 },

  // ── Accessories (4)
  { id: 'ss-013', name: 'CoolCloud Memory Foam Pillow', category: 'Accessory', tags: ['accessory'], price: 99, cost: 49, quantity: 1 },
  { id: 'ss-014', name: 'SilkTouch Sheet Set (King)', category: 'Accessory', tags: ['accessory'], price: 199, cost: 99, quantity: 1 },
  { id: 'ss-015', name: 'CoolGuard Mattress Protector', category: 'Accessory', tags: ['accessory'], price: 149, cost: 69, quantity: 1 },
  { id: 'ss-016', name: 'Summit Platform Bed Frame', category: 'Accessory', tags: ['accessory'], price: 299, cost: 149, quantity: 1 },

  // ── Protection Plans (3)
  { id: 'ss-017', name: '5-Year Sleep Assurance', category: 'Protection Plan', tags: ['protection'], price: 149, cost: 45, quantity: 1 },
  { id: 'ss-018', name: '10-Year Sleep Assurance', category: 'Protection Plan', tags: ['protection'], price: 249, cost: 75, quantity: 1 },
  { id: 'ss-019', name: 'Platinum Protection', category: 'Protection Plan', tags: ['protection'], price: 399, cost: 120, quantity: 1 },

  // ── Delivery (1)
  { id: 'ss-020', name: 'White Glove Delivery & Setup', category: 'Delivery', tags: [], price: 199, cost: 150, quantity: 1 },
];

/* ── Store Context (D365 Commerce) ────────────────────── */

export const STORE_CONTEXT: D365StoreContext = {
  storeId: 'GALLERIA-247',
  storeName: 'Summit Sleep Flagship #12 — Galleria',
  address: '5085 Westheimer Rd, Houston, TX 77056',
  taxGroup: 'TX-HOUSTON',
  taxRate: 0.0825,
  commissionBudget: 14200,
  shiftStart: '09:00',
};

/* ── Bundle Definitions ───────────────────────────────── */

export const BUNDLE_DEFINITIONS = [
  {
    id: 'sleep-system',
    label: 'Sleep System Bundle',
    requiredCategories: ['Mattress', 'Adjustable Base'],
    bonusAmount: 75,
  },
];

/* ── Sample Reps ────────────────────────────────────────── */

export const POS_REPS = [
  { id: 'rep-sarah', name: 'Sarah Johnson', storeId: 'GALLERIA-247' },
  { id: 'rep-marcus', name: 'Marcus Chen', storeId: 'GALLERIA-247' },
  { id: 'rep-casey', name: 'Casey Miller', storeId: 'GALLERIA-247' },
  { id: 'rep-lisa', name: 'Lisa Kim', storeId: 'GALLERIA-247' },
  { id: 'rep-david', name: 'David Rodriguez', storeId: 'GALLERIA-247' },
];

/* ── Sample Period Context ──────────────────────────────── */

export const SAMPLE_PERIODS: Record<string, PeriodContext> = {
  'rep-sarah': {
    revenue: 72000, cost: 42000, margin: 30000, units: 145,
    periodStart: '2026-03-01', periodEnd: '2026-03-31', target: 75000,
  },
  'rep-marcus': {
    revenue: 48000, cost: 28000, margin: 20000, units: 98,
    periodStart: '2026-03-01', periodEnd: '2026-03-31', target: 75000,
  },
  'rep-casey': {
    revenue: 21400, cost: 12800, margin: 8600, units: 42,
    periodStart: '2026-03-01', periodEnd: '2026-03-31', target: 75000,
  },
  'rep-lisa': {
    revenue: 45000, cost: 27000, margin: 18000, units: 95,
    periodStart: '2026-03-01', periodEnd: '2026-03-31', target: 75000,
  },
  'rep-david': {
    revenue: 62000, cost: 36000, margin: 26000, units: 130,
    periodStart: '2026-03-01', periodEnd: '2026-03-31', target: 75000,
  },
};
