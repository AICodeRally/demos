import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';

export const PREMIER_MOTORS_CONFIG: ClientConfig = {
  id: 'premier-motors',
  name: 'Premier Motors',
  logo: 'premier-motors',

  theme: {
    primary: '#1e3a5f',
    secondary: '#d4a017',
    background: '#0f1f33',
    text: '#ffffff',
    accent: '#d4a017',
  },

  components: [
    {
      id: 'base-comm',
      label: 'Base Commission',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.25,
        basis: 'margin',
      },
    },
    {
      id: 'holdback',
      label: 'Holdback',
      group: 'bonus',
      rule: {
        type: 'fixed_per_match',
        amount: 150,
        match: { field: 'category', value: 'Vehicle' },
      },
    },
    {
      id: 'fi-spiff',
      label: 'F&I Spiff',
      group: 'spiff',
      rule: {
        type: 'fixed_per_match',
        amount: 50,
        match: { field: 'category', value: 'F&I' },
      },
    },
    {
      id: 'volume-accel',
      label: 'Volume Accelerator',
      group: 'bonus',
      rule: {
        type: 'tiered',
        basis: 'units',
        marginal: false,
        tiers: [
          { min: 0, rate: 0 },
          { min: 8, rate: 100 },
          { min: 12, rate: 200 },
          { min: 18, rate: 350 },
        ],
      },
    },
  ],

  summaryMetrics: [
    { id: 'total-revenue', label: 'Total Revenue', basis: 'total_revenue', format: 'currency' },
    { id: 'total-costs', label: 'Total Costs', basis: 'total_cost', format: 'currency' },
    { id: 'gross-margin-dollar', label: 'Gross Profit', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'gross-margin-pct', label: 'Gross Margin %', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'Units to Next Volume Tier',
    basisComponentId: 'volume-accel',
    showPotentialAtNextTier: true,
    potentialLabel: 'Bonus at Next Tier',
  },

  notes: [
    'Holdback is paid per unit delivered. Volume bonus based on monthly units sold.',
  ],

  splitConfig: { enabled: false, defaultFactor: 1, label: 'Split' },
};

export const PREMIER_CATALOG: SaleItem[] = [
  { id: 'pm-001', name: '2026 Honda Civic LX', category: 'Vehicle', tags: [], price: 26500, cost: 23800, quantity: 1 },
  { id: 'pm-002', name: '2026 Toyota RAV4 XLE', category: 'Vehicle', tags: [], price: 34200, cost: 30100, quantity: 1 },
  { id: 'pm-003', name: '2026 Ford F-150 XLT', category: 'Vehicle', tags: [], price: 48900, cost: 42500, quantity: 1 },
  { id: 'pm-004', name: '2026 BMW X3 xDrive30i', category: 'Vehicle', tags: ['luxury'], price: 52800, cost: 47200, quantity: 1 },
  { id: 'pm-005', name: '2026 Tesla Model Y LR', category: 'Vehicle', tags: ['ev'], price: 47990, cost: 44500, quantity: 1 },
  { id: 'pm-006', name: 'Extended Warranty (5yr)', category: 'F&I', tags: ['warranty'], price: 2400, cost: 800, quantity: 1 },
  { id: 'pm-007', name: 'GAP Insurance', category: 'F&I', tags: ['insurance'], price: 895, cost: 250, quantity: 1 },
  { id: 'pm-008', name: 'Paint Protection Package', category: 'Accessories', tags: [], price: 1200, cost: 350, quantity: 1 },
];

export const PREMIER_REPS = [
  { id: 'pm-rep-001', name: 'Jake Morrison', storeId: 'lot-north' },
  { id: 'pm-rep-002', name: 'Diana Reeves', storeId: 'lot-north' },
  { id: 'pm-rep-003', name: 'Carlos Vega', storeId: 'lot-south' },
];

export const PREMIER_PERIODS: Record<string, PeriodContext> = {
  'pm-rep-001': { revenue: 320000, cost: 278000, margin: 42000, units: 11, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 15 },
  'pm-rep-002': { revenue: 195000, cost: 170000, margin: 25000, units: 7, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 15 },
  'pm-rep-003': { revenue: 480000, cost: 415000, margin: 65000, units: 16, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 15 },
};
