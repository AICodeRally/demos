import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';

/* ══════════════════════════════════════════════════════════
   Acme Electronics — Demo Client Configuration

   A fictional electronics retailer with LIVE commission rules.
   Used to demonstrate the engine actually computing commissions
   while Summit Sleep Co.'s rules are still placeholders.
   ══════════════════════════════════════════════════════════ */

export const ACME_CONFIG: ClientConfig = {
  id: 'acme-electronics',
  name: 'Acme Electronics',
  logo: 'acme',

  theme: {
    primary: '#0f2b46',
    secondary: '#d1e8ff',
    background: '#091a2a',
    text: '#ffffff',
    accent: '#0ea5e9',
  },

  components: [
    {
      id: 'base-comm',
      label: 'Base Commission',
      group: 'commission',
      rule: {
        type: 'tiered',
        basis: 'revenue',
        marginal: true,
        tiers: [
          { min: 0, rate: 0.03 },
          { min: 25000, rate: 0.04 },
          { min: 50000, rate: 0.055 },
        ],
      },
    },
    {
      id: 'margin-bonus',
      label: 'Margin Bonus',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.08,
        basis: 'margin',
      },
    },
    {
      id: 'warranty-spiff',
      label: 'Warranty SPIFF',
      group: 'spiff',
      rule: {
        type: 'fixed_per_match',
        amount: 15,
        match: { field: 'tag', value: 'warranty' },
      },
    },
    {
      id: 'premium-spiff',
      label: 'Premium Product SPIFF',
      group: 'spiff',
      rule: {
        type: 'fixed_per_match',
        amount: 30,
        match: { field: 'tag', value: 'premium' },
      },
    },
  ],

  summaryMetrics: [
    { id: 'total-revenue', label: 'Total Revenue', basis: 'total_revenue', format: 'currency' },
    { id: 'total-costs', label: 'Total Costs', basis: 'total_cost', format: 'currency' },
    { id: 'gross-margin', label: 'Gross Margin', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'margin-pct', label: 'Margin %', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'Amount Needed for Next Tier',
    basisComponentId: 'base-comm',
    showPotentialAtNextTier: true,
    potentialLabel: 'Base Comm. at Next Tier',
  },

  notes: [
    'Warranty SPIFFs pay $15 per extended warranty sold.',
  ],

  splitConfig: {
    enabled: false,
    defaultFactor: 1,
    label: 'Split Credit',
  },
};

/* ── Catalog ────────────────────────────────────────────── */

export const ACME_CATALOG: SaleItem[] = [
  {
    id: 'ae-001', name: '65" OLED 4K Smart TV', category: 'TVs',
    tags: ['premium'], price: 1799, cost: 1150, quantity: 1,
  },
  {
    id: 'ae-002', name: '55" LED 4K TV', category: 'TVs',
    tags: [], price: 649, cost: 420, quantity: 1,
  },
  {
    id: 'ae-003', name: 'MacBook Pro 16"', category: 'Computers',
    tags: ['premium'], price: 2499, cost: 2100, quantity: 1,
  },
  {
    id: 'ae-004', name: 'Gaming Laptop 15.6"', category: 'Computers',
    tags: [], price: 1299, cost: 950, quantity: 1,
  },
  {
    id: 'ae-005', name: 'Wireless Noise-Canceling Headphones', category: 'Audio',
    tags: ['premium'], price: 349, cost: 180, quantity: 1,
  },
  {
    id: 'ae-006', name: 'Soundbar with Sub', category: 'Audio',
    tags: [], price: 299, cost: 160, quantity: 1,
  },
  {
    id: 'ae-007', name: 'Smart Home Bundle', category: 'Smart Home',
    tags: [], price: 499, cost: 280, quantity: 1,
  },
  {
    id: 'ae-008', name: '2-Year Extended Warranty (TV)', category: 'Warranty',
    tags: ['warranty'], price: 149, cost: 20, quantity: 1,
  },
  {
    id: 'ae-009', name: '3-Year Extended Warranty (Computer)', category: 'Warranty',
    tags: ['warranty'], price: 249, cost: 30, quantity: 1,
  },
  {
    id: 'ae-010', name: 'HDMI Cable Pack (3-pack)', category: 'Accessories',
    tags: [], price: 29, cost: 8, quantity: 1,
  },
];

/* ── Reps ────────────────────────────────────────────────── */

export const ACME_REPS = [
  { id: 'ae-rep-001', name: 'Alex Rivera', storeId: 'store-100' },
  { id: 'ae-rep-002', name: 'Jordan Kim', storeId: 'store-100' },
];

/* ── Period Context ──────────────────────────────────────── */

export const ACME_PERIODS: Record<string, PeriodContext> = {
  'ae-rep-001': {
    revenue: 38000, cost: 24000, margin: 14000,
    units: 62, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 40000,
  },
  'ae-rep-002': {
    revenue: 22000, cost: 14500, margin: 7500,
    units: 35, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 40000,
  },
};
