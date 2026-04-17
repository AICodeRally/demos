import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';

export const SUMMIT_SHIELD_CONFIG: ClientConfig = {
  id: 'summit-shield',
  name: 'Summit Shield Insurance',
  logo: 'summit-shield',

  theme: {
    primary: '#047857',
    secondary: '#334155',
    background: '#022c22',
    text: '#ffffff',
    accent: '#10b981',
  },

  components: [
    {
      id: 'first-year',
      label: 'First-Year Commission',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.12,
        basis: 'revenue',
      },
    },
    {
      id: 'renewal-trail',
      label: 'Renewal Trail',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.02,
        basis: 'revenue',
      },
    },
    {
      id: 'volume-bonus',
      label: 'Volume Bonus',
      group: 'bonus',
      rule: {
        type: 'tiered',
        basis: 'units',
        marginal: false,
        tiers: [
          { min: 0, rate: 0 },
          { min: 20, rate: 500 },
          { min: 40, rate: 1200 },
          { min: 60, rate: 2500 },
        ],
      },
    },
    {
      id: 'cross-sell-spiff',
      label: 'Cross-Sell Spiff',
      group: 'spiff',
      rule: {
        type: 'fixed_per_match',
        amount: 75,
        match: { field: 'tag', value: 'bundle' },
      },
    },
  ],

  summaryMetrics: [
    { id: 'total-premium', label: 'Total Premium', basis: 'total_revenue', format: 'currency' },
    { id: 'total-costs', label: 'Carrier Cost', basis: 'total_cost', format: 'currency' },
    { id: 'agency-margin', label: 'Agency Revenue', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'margin-pct', label: 'Margin %', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'Policies to Next Bonus Tier',
    basisComponentId: 'volume-bonus',
    showPotentialAtNextTier: true,
    potentialLabel: 'Bonus at Next Tier',
  },

  notes: [
    'First-year commission paid on new business. Renewal trail paid on policy anniversary.',
  ],

  splitConfig: { enabled: false, defaultFactor: 1, label: 'Split' },
};

export const SUMMIT_CATALOG: SaleItem[] = [
  { id: 'ss-001', name: 'Auto Policy (Full Coverage)', category: 'Auto', tags: [], price: 2400, cost: 1800, quantity: 1 },
  { id: 'ss-002', name: 'Homeowners Policy', category: 'Home', tags: [], price: 3200, cost: 2400, quantity: 1 },
  { id: 'ss-003', name: 'Home + Auto Bundle', category: 'Bundle', tags: ['bundle'], price: 4800, cost: 3500, quantity: 1 },
  { id: 'ss-004', name: 'Term Life (20yr, $500K)', category: 'Life', tags: [], price: 1800, cost: 1200, quantity: 1 },
  { id: 'ss-005', name: 'Umbrella Policy ($1M)', category: 'Umbrella', tags: [], price: 950, cost: 650, quantity: 1 },
  { id: 'ss-006', name: 'Renters Insurance', category: 'Renters', tags: [], price: 420, cost: 300, quantity: 1 },
];

export const SUMMIT_REPS = [
  { id: 'ss-rep-001', name: 'Rachel Kim' },
  { id: 'ss-rep-002', name: 'Tom Brennan' },
  { id: 'ss-rep-003', name: 'Patricia Nguyen' },
];

export const SUMMIT_PERIODS: Record<string, PeriodContext> = {
  'ss-rep-001': { revenue: 145000, cost: 105000, margin: 40000, units: 38, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 50 },
  'ss-rep-002': { revenue: 82000, cost: 60000, margin: 22000, units: 22, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 50 },
  'ss-rep-003': { revenue: 210000, cost: 152000, margin: 58000, units: 55, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 50 },
};
