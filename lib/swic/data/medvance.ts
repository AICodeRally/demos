import type { ClientConfig, SaleItem, PeriodContext } from '@/lib/swic/engine/types';

export const MEDVANCE_CONFIG: ClientConfig = {
  id: 'medvance',
  name: 'MedVance Therapeutics',
  logo: 'medvance',

  theme: {
    primary: '#0d9488',
    secondary: '#be123c',
    background: '#042f2e',
    text: '#ffffff',
    accent: '#14b8a6',
  },

  components: [
    {
      id: 'territory-base',
      label: 'Territory Base',
      group: 'commission',
      rule: {
        type: 'percent_of',
        rate: 0.03,
        basis: 'revenue',
      },
    },
    {
      id: 'quota-attainment',
      label: 'Quota Attainment',
      group: 'bonus',
      rule: {
        type: 'tiered',
        basis: 'revenue',
        marginal: true,
        tiers: [
          { min: 0, rate: 0.02 },
          { min: 500000, rate: 0.035 },
          { min: 800000, rate: 0.05 },
          { min: 1200000, rate: 0.07 },
        ],
      },
    },
    {
      id: 'mbo-bonus',
      label: 'MBO Bonus',
      group: 'bonus',
      rule: {
        type: 'fixed_per_match',
        amount: 2500,
        match: { field: 'tag', value: 'mbo-qualified' },
      },
    },
    {
      id: 'split-credit',
      label: 'Split Credit',
      group: 'other',
      rule: {
        type: 'multiplier',
        factor: 0.6,
        appliesTo: ['territory-base', 'quota-attainment'],
      },
    },
  ],

  summaryMetrics: [
    { id: 'territory-rev', label: 'Territory Revenue', basis: 'total_revenue', format: 'currency' },
    { id: 'cogs', label: 'COGS', basis: 'total_cost', format: 'currency' },
    { id: 'gross-margin', label: 'Gross Margin', basis: 'gross_margin_dollar', format: 'currency' },
    { id: 'margin-pct', label: 'GM %', basis: 'gross_margin_percent', format: 'percent' },
  ],

  thresholds: {
    enabled: true,
    label: 'Revenue to Next Quota Tier',
    basisComponentId: 'quota-attainment',
    showPotentialAtNextTier: true,
    potentialLabel: 'Rate at Next Tier',
  },

  notes: [
    'Territory base on all sales. Quota attainment tiers reset quarterly.',
    'Split credit applies at 60% for shared territory deals.',
  ],

  splitConfig: {
    enabled: true,
    defaultFactor: 0.6,
    label: 'Territory Split (60/40)',
  },
};

export const MEDVANCE_CATALOG: SaleItem[] = [
  { id: 'mv-001', name: 'CardioVex (90-day supply)', category: 'Branded Drug', tags: [], price: 8500, cost: 2550, quantity: 1 },
  { id: 'mv-002', name: 'NeuroCalm XR (30-day)', category: 'Branded Drug', tags: [], price: 4200, cost: 1260, quantity: 1 },
  { id: 'mv-003', name: 'Metformin Generic (90-day)', category: 'Generic', tags: [], price: 450, cost: 180, quantity: 1 },
  { id: 'mv-004', name: 'OrthoFlex Joint Implant', category: 'Medical Device', tags: ['mbo-qualified'], price: 28000, cost: 12000, quantity: 1 },
  { id: 'mv-005', name: 'VascuStent Pro', category: 'Medical Device', tags: ['mbo-qualified'], price: 15000, cost: 6000, quantity: 1 },
  { id: 'mv-006', name: 'DermaHeal Patch (Box/50)', category: 'Supplies', tags: [], price: 1200, cost: 480, quantity: 1 },
];

export const MEDVANCE_REPS = [
  { id: 'mv-rep-001', name: 'Dr. Priya Sharma' },
  { id: 'mv-rep-002', name: 'Marcus Webb' },
  { id: 'mv-rep-003', name: 'Elena Torres' },
];

export const MEDVANCE_PERIODS: Record<string, PeriodContext> = {
  'mv-rep-001': { revenue: 720000, cost: 260000, margin: 460000, units: 85, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 1000000 },
  'mv-rep-002': { revenue: 450000, cost: 165000, margin: 285000, units: 52, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 1000000 },
  'mv-rep-003': { revenue: 980000, cost: 350000, margin: 630000, units: 110, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 1000000 },
};
