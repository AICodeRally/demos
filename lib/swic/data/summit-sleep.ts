import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';
import type { D365StoreContext } from './d365-schemas';

/* ══════════════════════════════════════════════════════════
   Summit Sleep Co. — Client Configuration

   Based on the "Rewards Button (V3)" — Estimated Ticket Summary
   in SPM. Component names match the existing system.

   Rules are PLACEHOLDERS until we receive actual formulas.
   The engine will show "$0.00 / TBD" for placeholder rules.
   When formulas arrive, update the rule objects — no engine
   changes needed.
   ══════════════════════════════════════════════════════════ */

export const SUMMIT_SLEEP_CONFIG: ClientConfig = {
  id: 'summit-sleep',
  name: 'Summit Sleep Co.',
  logo: 'summit-sleep', // component key — rendered by LogoRenderer

  theme: {
    primary: '#1a1b4b',     // dark navy from their UI
    secondary: '#c8cad8',   // light lavender note boxes
    background: '#12133a',  // deep navy bg
    text: '#ffffff',
    accent: '#d42b2b',      // Summit Sleep Co. red
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
    basisComponentId: 'base-comm', // will be tiered rule once we have formulas
    showPotentialAtNextTier: true,
    potentialLabel: 'Potential Base Comm. at Next Tier',
  },

  notes: [
    'Note: You must be logged into the device with your ADID, and the primary salesperson on the order to view Rewards.',
    'Note: These are projected commissions, Actual Commissions will be calculated at the time of ticket invoice.',
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
  // ── Mattresses (8) ────────────────────────────────────
  {
    id: 'mf-001',
    name: 'Beautyrest Black K-Class Firm (King)',
    category: 'Mattress',
    tags: ['premium-tier'],
    price: 2999,
    cost: 1799,
    quantity: 1,
  },
  {
    id: 'mf-002',
    name: 'Beautyrest Black K-Class Firm (Queen)',
    category: 'Mattress',
    tags: ['premium-tier'],
    price: 2499,
    cost: 1499,
    quantity: 1,
  },
  {
    id: 'mf-003',
    name: 'Tempur-Pedic TEMPUR-Adapt (King)',
    category: 'Mattress',
    tags: ['premium-tier'],
    price: 2799,
    cost: 1699,
    quantity: 1,
  },
  {
    id: 'mf-004',
    name: 'Tempur-Pedic TEMPUR-Adapt (Queen)',
    category: 'Mattress',
    tags: ['premium-tier'],
    price: 2299,
    cost: 1379,
    quantity: 1,
  },
  {
    id: 'mf-005',
    name: 'Sealy Posturepedic Plus (King)',
    category: 'Mattress',
    tags: [],
    price: 1699,
    cost: 1019,
    quantity: 1,
  },
  {
    id: 'mf-006',
    name: 'Sealy Posturepedic Plus (Queen)',
    category: 'Mattress',
    tags: [],
    price: 1499,
    cost: 899,
    quantity: 1,
  },
  {
    id: 'mf-007',
    name: 'Serta iComfort EcoComfort (King)',
    category: 'Mattress',
    tags: [],
    price: 1299,
    cost: 779,
    quantity: 1,
  },
  {
    id: 'mf-008',
    name: 'Serta iComfort EcoComfort (Queen)',
    category: 'Mattress',
    tags: [],
    price: 999,
    cost: 599,
    quantity: 1,
  },

  // ── Adjustable Bases (4) ──────────────────────────────
  {
    id: 'mf-009',
    name: 'Adjustable Base Pro',
    category: 'Adjustable Base',
    tags: ['adjustable-base', 'bundle-eligible'],
    price: 1999,
    cost: 1199,
    quantity: 1,
  },
  {
    id: 'mf-010',
    name: 'Adjustable Base Standard',
    category: 'Adjustable Base',
    tags: ['adjustable-base', 'bundle-eligible'],
    price: 1299,
    cost: 779,
    quantity: 1,
  },
  {
    id: 'mf-011',
    name: 'Split King Base Pro',
    category: 'Adjustable Base',
    tags: ['adjustable-base', 'bundle-eligible'],
    price: 1599,
    cost: 959,
    quantity: 1,
  },
  {
    id: 'mf-012',
    name: 'Split King Base Standard',
    category: 'Adjustable Base',
    tags: ['adjustable-base', 'bundle-eligible'],
    price: 799,
    cost: 479,
    quantity: 1,
  },

  // ── Accessories (4) ───────────────────────────────────
  {
    id: 'mf-013',
    name: 'Memory Foam Pillow',
    category: 'Accessory',
    tags: ['accessory'],
    price: 99,
    cost: 49,
    quantity: 1,
  },
  {
    id: 'mf-014',
    name: 'Sheet Set (King)',
    category: 'Accessory',
    tags: ['accessory'],
    price: 199,
    cost: 99,
    quantity: 1,
  },
  {
    id: 'mf-015',
    name: 'Mattress Protector',
    category: 'Accessory',
    tags: ['accessory'],
    price: 149,
    cost: 69,
    quantity: 1,
  },
  {
    id: 'mf-016',
    name: 'Bed Frame',
    category: 'Accessory',
    tags: ['accessory'],
    price: 299,
    cost: 149,
    quantity: 1,
  },

  // ── Protection Plans (3) ──────────────────────────────
  {
    id: 'mf-017',
    name: '5-Year Warranty',
    category: 'Protection Plan',
    tags: ['protection'],
    price: 149,
    cost: 45,
    quantity: 1,
  },
  {
    id: 'mf-018',
    name: '10-Year Warranty',
    category: 'Protection Plan',
    tags: ['protection'],
    price: 249,
    cost: 75,
    quantity: 1,
  },
  {
    id: 'mf-019',
    name: 'Platinum Protection',
    category: 'Protection Plan',
    tags: ['protection'],
    price: 399,
    cost: 120,
    quantity: 1,
  },

  // ── Delivery (1) ──────────────────────────────────────
  {
    id: 'mf-020',
    name: 'White Glove Delivery',
    category: 'Delivery',
    tags: [],
    price: 199,
    cost: 150,
    quantity: 1,
  },
];

/* ── Store Context (D365 Commerce) ────────────────────── */

export const STORE_CONTEXT: D365StoreContext = {
  storeId: 'HOUSTON-001',
  storeName: 'Summit Sleep Co. Houston Galleria',
  address: '5085 Westheimer Rd, Houston, TX 77056',
  taxGroup: 'TX-HOUSTON',
  taxRate: 0.0825,
  commissionBudget: 12400,
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

export const REPS = [
  { id: 'rep-001', name: 'Sarah Johnson', storeId: 'store-2847' },
  { id: 'rep-002', name: 'Marcus Chen', storeId: 'store-2847' },
  { id: 'rep-003', name: 'Lior Shechter', storeId: 'store-1234' }, // from the screenshot!
  { id: 'rep-004', name: 'Lisa Kim', storeId: 'store-2847' },
  { id: 'rep-005', name: 'David Rodriguez', storeId: 'store-1234' },
];

/* ── Sample Period Context ──────────────────────────────── */

export const SAMPLE_PERIODS: Record<string, PeriodContext> = {
  'rep-001': {
    revenue: 72000,
    cost: 42000,
    margin: 30000,
    units: 145,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    target: 50000,
  },
  'rep-002': {
    revenue: 48000,
    cost: 28000,
    margin: 20000,
    units: 98,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    target: 50000,
  },
  'rep-003': {
    revenue: 55000,
    cost: 32000,
    margin: 23000,
    units: 112,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    target: 50000,
  },
  'rep-004': {
    revenue: 45000,
    cost: 27000,
    margin: 18000,
    units: 95,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    target: 50000,
  },
  'rep-005': {
    revenue: 62000,
    cost: 36000,
    margin: 26000,
    units: 130,
    periodStart: '2026-02-01',
    periodEnd: '2026-02-28',
    target: 50000,
  },
};

/* ── Example: What a CONFIGURED Summit Sleep Co. config might look like ──
   (Once we receive actual formulas, update the rules above to match)

   components: [
     {
       id: 'base-comm',
       label: 'Base Comm.',
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
       rule: {
         type: 'percent_of',
         rate: 0.01,
         basis: 'revenue',
       },
     },
     {
       id: 'product-prem',
       label: 'Product Prem.',
       rule: {
         type: 'lookup',
         tableId: 'product-premium-rates',
         inputBasis: 'margin_percent',
       },
     },
     {
       id: 'spiff',
       label: 'SPIFF',
       rule: {
         type: 'fixed_per_match',
         amount: 25,
         match: { field: 'tag', value: 'adjustable-base' },
       },
     },
   ],
   ────────────────────────────────────────────────────────── */
