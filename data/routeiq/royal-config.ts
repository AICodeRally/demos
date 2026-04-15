import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic-engine/types';

/* ══════════════════════════════════════════════════════════
   Lone Star Spirits — Client Configuration

   Beverage distribution (liquor/beer/mixers) for PROOFLINE
   Route Commission demo. Dallas / Fort Worth territory.

   Commission structure:
   - Base Volume Commission (tiered by cases/mo)
   - Spirits Placement SPIFF ($25 per placement)
   - Display Bonus ($50 per display set)
   - Margin Commission (6% on premium brands)
   - New Account Bonus ($100 per new account)
   ══════════════════════════════════════════════════════════ */

export const LONE_STAR_CONFIG: ClientConfig = {
  id: 'royal-config',
  name: 'Lone Star Spirits',
  logo: 'royal-config',

  theme: {
    primary: '#0f1729',
    secondary: '#1e293b',
    background: '#0a0f1e',
    text: '#f1f5f9',
    accent: '#C6A052',
  },

  components: [
    {
      id: 'base-volume',
      label: 'Base Volume Comm.',
      group: 'commission',
      rule: {
        type: 'tiered',
        basis: 'units',
        marginal: true,
        tiers: [
          { min: 0, rate: 0.03 },
          { min: 500, rate: 0.04 },
          { min: 1000, rate: 0.05 },
        ],
      },
    },
    {
      id: 'spirits-spiff',
      label: 'Spirits Placement',
      group: 'spiff',
      rule: {
        type: 'fixed_per_match',
        amount: 25,
        match: { field: 'tag', value: 'spirits' },
      },
    },
    {
      id: 'display-bonus',
      label: 'Display Bonus',
      group: 'bonus',
      rule: {
        type: 'fixed_per_match',
        amount: 50,
        match: { field: 'tag', value: 'display' },
      },
    },
    {
      id: 'margin-comm',
      label: 'Margin Comm. (Premium)',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.06,
        basis: 'margin',
      },
    },
    {
      id: 'new-account',
      label: 'New Account Bonus',
      group: 'bonus',
      rule: {
        type: 'fixed_per_match',
        amount: 100,
        match: { field: 'tag', value: 'new-account' },
      },
    },
  ],

  summaryMetrics: [
    { id: 'total-revenue', label: 'Total Revenue', basis: 'total_revenue', format: 'currency' },
    { id: 'total-cases', label: 'Total Cases', basis: 'unit_count', format: 'number' },
    { id: 'gross-margin-dollar', label: 'Gross Margin', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'gross-margin-pct', label: 'Margin %', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'Cases to Next Tier',
    basisComponentId: 'base-volume',
    showPotentialAtNextTier: true,
    potentialLabel: 'Potential Volume Comm. at Next Tier',
  },

  notes: [
    'Volume tiers are based on monthly case count (marginal rates).',
    'Premium margin commission applies to all items; spirits placement SPIFF applies to spirits-tagged products only.',
  ],

  splitConfig: {
    enabled: false,
    defaultFactor: 1,
    label: 'Split Credit',
  },
};

/* ── Catalog (~20 items) ─────────────────────────────────── */

export const LONE_STAR_CATALOG: SaleItem[] = [
  // ── Spirits (6)
  { id: 'ls-001', name: 'Buffalo Trace Bourbon 750ml', category: 'Spirits', tags: ['spirits', 'premium'], price: 28, cost: 18, quantity: 1 },
  { id: 'ls-002', name: 'Fireball Cinnamon Whisky 750ml', category: 'Spirits', tags: ['spirits'], price: 16, cost: 10, quantity: 1 },
  { id: 'ls-003', name: "Tito's Handmade Vodka 1.75L", category: 'Spirits', tags: ['spirits'], price: 34, cost: 22, quantity: 1 },
  { id: 'ls-004', name: 'Crown Royal Canadian 750ml', category: 'Spirits', tags: ['spirits', 'premium'], price: 32, cost: 20, quantity: 1 },
  { id: 'ls-005', name: 'Patron Silver Tequila 750ml', category: 'Spirits', tags: ['spirits', 'premium'], price: 48, cost: 30, quantity: 1 },
  { id: 'ls-006', name: 'Hennessy VS Cognac 750ml', category: 'Spirits', tags: ['spirits', 'premium'], price: 42, cost: 26, quantity: 1 },

  // ── Beer (5)
  { id: 'ls-007', name: 'Corona Extra 24pk', category: 'Beer', tags: [], price: 32, cost: 22, quantity: 1 },
  { id: 'ls-008', name: 'Modelo Especial 24pk', category: 'Beer', tags: [], price: 30, cost: 20, quantity: 1 },
  { id: 'ls-009', name: 'Miller Lite 24pk', category: 'Beer', tags: [], price: 24, cost: 16, quantity: 1 },
  { id: 'ls-010', name: 'Coors Light 24pk', category: 'Beer', tags: [], price: 24, cost: 16, quantity: 1 },
  { id: 'ls-011', name: 'Blue Moon Belgian White 12pk', category: 'Beer', tags: ['premium'], price: 18, cost: 12, quantity: 1 },

  // ── Craft / Regional (4)
  { id: 'ls-012', name: 'Shiner Bock 12pk', category: 'Craft', tags: ['regional'], price: 16, cost: 10, quantity: 1 },
  { id: 'ls-013', name: 'Deep Ellum IPA 6pk', category: 'Craft', tags: ['regional', 'premium'], price: 12, cost: 8, quantity: 1 },
  { id: 'ls-014', name: 'Karbach Love Street 12pk', category: 'Craft', tags: ['regional'], price: 17, cost: 11, quantity: 1 },
  { id: 'ls-015', name: 'Revolver Blood & Honey 6pk', category: 'Craft', tags: ['regional', 'premium'], price: 13, cost: 9, quantity: 1 },

  // ── Mixers (4)
  { id: 'ls-016', name: 'Topo Chico Mineral Water 12pk', category: 'Mixer', tags: [], price: 8, cost: 5, quantity: 1 },
  { id: 'ls-017', name: 'Club Soda 12pk', category: 'Mixer', tags: [], price: 6, cost: 3, quantity: 1 },
  { id: 'ls-018', name: 'Fever-Tree Tonic Water 8pk', category: 'Mixer', tags: ['premium'], price: 10, cost: 6, quantity: 1 },
  { id: 'ls-019', name: 'Tres Agaves Margarita Mix 1L', category: 'Mixer', tags: [], price: 9, cost: 5, quantity: 1 },
];

/* ── Reps ─────────────────────────────────────────────────── */

export const LONE_STAR_REPS = [
  { id: 'kc-rep-001', name: 'Marcus Reyes', storeId: 'KC-01' },
  { id: 'kc-rep-002', name: 'Jake Thompson', storeId: 'KC-02' },
  { id: 'kc-rep-003', name: 'Christina Morales', storeId: 'IND-01' },
];

/* ── Sample Periods ──────────────────────────────────────── */

export const LONE_STAR_PERIODS: Record<string, PeriodContext> = {
  'kc-rep-001': {
    revenue: 42000,
    cost: 27000,
    margin: 15000,
    units: 680,
    periodStart: '2026-03-01',
    periodEnd: '2026-03-31',
    target: 60000,
  },
  'kc-rep-002': {
    revenue: 38000,
    cost: 24500,
    margin: 13500,
    units: 610,
    periodStart: '2026-03-01',
    periodEnd: '2026-03-31',
    target: 60000,
  },
  'kc-rep-003': {
    revenue: 51000,
    cost: 33000,
    margin: 18000,
    units: 820,
    periodStart: '2026-03-01',
    periodEnd: '2026-03-31',
    target: 60000,
  },
};
