import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';

export const CLOUDSTACK_CONFIG: ClientConfig = {
  id: 'cloudstack-ai',
  name: 'CloudStack AI',
  logo: 'cloudstack',

  theme: {
    primary: '#4338ca',
    secondary: '#0891b2',
    background: '#1e1b4b',
    text: '#ffffff',
    accent: '#06b6d4',
  },

  components: [
    {
      id: 'acv-comm',
      label: 'ACV Commission',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.08,
        basis: 'revenue',
      },
    },
    {
      id: 'accelerator',
      label: 'Accelerator',
      group: 'bonus',
      rule: {
        type: 'tiered',
        basis: 'revenue',
        marginal: true,
        tiers: [
          { min: 0, rate: 0.08 },
          { min: 500000, rate: 0.10 },
          { min: 800000, rate: 0.14 },
        ],
      },
    },
    {
      id: 'multiyear-spiff',
      label: 'Multi-Year Spiff',
      group: 'spiff',
      rule: {
        type: 'fixed_per_match',
        amount: 500,
        match: { field: 'tag', value: 'multiyear' },
      },
    },
    {
      id: 'expansion-bonus',
      label: 'Expansion Bonus',
      group: 'bonus',
      rule: {
        type: 'percent_of',
        rate: 0.05,
        basis: 'revenue',
      },
    },
  ],

  summaryMetrics: [
    { id: 'total-acv', label: 'Total ACV', basis: 'total_revenue', format: 'currency' },
    { id: 'total-costs', label: 'COGS', basis: 'total_cost', format: 'currency' },
    { id: 'gross-margin', label: 'Gross Margin', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'margin-pct', label: 'GM %', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'ARR to Next Accelerator Tier',
    basisComponentId: 'accelerator',
    showPotentialAtNextTier: true,
    potentialLabel: 'Rate at Next Tier',
  },

  notes: [
    'ACV Commission on new logos. Expansion Bonus on upsell/cross-sell only.',
    'Multi-year spiff paid on 3yr+ contract commits.',
  ],

  splitConfig: { enabled: false, defaultFactor: 1, label: 'Split' },
};

export const CLOUDSTACK_CATALOG: SaleItem[] = [
  { id: 'cs-001', name: 'Starter Plan (Annual)', category: 'Subscription', tags: [], price: 12000, cost: 3600, quantity: 1 },
  { id: 'cs-002', name: 'Pro Plan (Annual)', category: 'Subscription', tags: [], price: 48000, cost: 14400, quantity: 1 },
  { id: 'cs-003', name: 'Enterprise Plan (Annual)', category: 'Subscription', tags: [], price: 120000, cost: 36000, quantity: 1 },
  { id: 'cs-004', name: 'Enterprise 3-Year Commit', category: 'Subscription', tags: ['multiyear'], price: 324000, cost: 97200, quantity: 1 },
  { id: 'cs-005', name: 'Premium Support Add-on', category: 'Add-on', tags: [], price: 18000, cost: 5400, quantity: 1 },
  { id: 'cs-006', name: 'Onboarding & Training', category: 'Services', tags: [], price: 15000, cost: 9000, quantity: 1 },
];

export const CLOUDSTACK_REPS = [
  { id: 'cs-rep-001', name: 'Aisha Patel' },
  { id: 'cs-rep-002', name: 'Jordan Lee' },
  { id: 'cs-rep-003', name: 'Nina Vasquez' },
];

export const CLOUDSTACK_PERIODS: Record<string, PeriodContext> = {
  'cs-rep-001': { revenue: 620000, cost: 186000, margin: 434000, units: 18, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 750000 },
  'cs-rep-002': { revenue: 380000, cost: 114000, margin: 266000, units: 12, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 750000 },
  'cs-rep-003': { revenue: 890000, cost: 267000, margin: 623000, units: 24, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 750000 },
};
