/* ═══════════════════════════════════════════════════════
   MERIDIAN — Waterfall & Distribution Mechanics
   European-style (whole-fund) waterfall
   ═══════════════════════════════════════════════════════ */

export interface WaterfallTier {
  name: string;
  description: string;
  recipient: 'LP' | 'GP' | 'Both';
  split: [number, number]; // [GP%, LP%]
  amount: number;
  cumulative: number;
  color: string;
}

export const WATERFALL_TIERS: WaterfallTier[] = [
  {
    name: 'Return of Capital',
    description: 'LPs receive 100% of distributions until all called capital is returned',
    recipient: 'LP',
    split: [0, 100],
    amount: 1_925_000_000,
    cumulative: 1_925_000_000,
    color: '#6B7280',
  },
  {
    name: 'Preferred Return (8%)',
    description: 'LPs receive 100% until 8% IRR hurdle is achieved on called capital',
    recipient: 'LP',
    split: [0, 100],
    amount: 462_000_000,
    cumulative: 2_387_000_000,
    color: '#3B82F6',
  },
  {
    name: 'GP Catch-Up (100/0)',
    description: 'GP receives 100% of distributions until GP has received 20% of total profits',
    recipient: 'GP',
    split: [100, 0],
    amount: 115_500_000,
    cumulative: 2_502_500_000,
    color: '#D4A847',
  },
  {
    name: 'Carried Interest (80/20)',
    description: 'Remaining distributions split 80% LP / 20% GP',
    recipient: 'Both',
    split: [20, 80],
    amount: 1_097_500_000,
    cumulative: 3_600_000_000,
    color: '#10B981',
  },
];

export const WATERFALL_SUMMARY = {
  totalDistributions: 3_600_000_000,
  lpDistributions: 2_882_000_000,
  gpCarry: 334_700_000,
  gpReturnOfCapital: 57_750_000,
  gpCoinvest: 69_300_000,
  managementFees: 275_000_000,
  netToLPs: 2_882_000_000,
  netToGP: 461_750_000,
  lpMoIC: 1.62,
  gpMoIC: 5.60,
};

export interface DistributionEvent {
  date: string;
  type: 'Capital Return' | 'Preferred Return' | 'Carry' | 'Recapitalization';
  source: string;
  amount: number;
  lpShare: number;
  gpShare: number;
  cumDistributed: number;
}

export const DISTRIBUTION_HISTORY: DistributionEvent[] = [
  { date: '2023-Q4', type: 'Recapitalization', source: 'Heritage Benefits Group', amount: 85_000_000, lpShare: 85_000_000, gpShare: 0, cumDistributed: 85_000_000 },
  { date: '2024-Q1', type: 'Capital Return', source: 'NorthStar (partial)', amount: 120_000_000, lpShare: 120_000_000, gpShare: 0, cumDistributed: 205_000_000 },
  { date: '2024-Q2', type: 'Capital Return', source: 'Sentinel (dividend recap)', amount: 95_000_000, lpShare: 95_000_000, gpShare: 0, cumDistributed: 300_000_000 },
  { date: '2024-Q4', type: 'Capital Return', source: 'Atlas (partial exit)', amount: 65_000_000, lpShare: 65_000_000, gpShare: 0, cumDistributed: 365_000_000 },
  { date: '2025-Q1', type: 'Capital Return', source: 'NorthStar (secondary)', amount: 180_000_000, lpShare: 180_000_000, gpShare: 0, cumDistributed: 545_000_000 },
  { date: '2025-Q2', type: 'Capital Return', source: 'Pacific Coast (recap)', amount: 45_000_000, lpShare: 45_000_000, gpShare: 0, cumDistributed: 590_000_000 },
  { date: '2025-Q3', type: 'Capital Return', source: 'Heritage (secondary)', amount: 75_000_000, lpShare: 75_000_000, gpShare: 0, cumDistributed: 665_000_000 },
  { date: '2025-Q4', type: 'Capital Return', source: 'Cascade (secondary)', amount: 50_000_000, lpShare: 50_000_000, gpShare: 0, cumDistributed: 715_000_000 },
];

export const CAPITAL_ACCOUNTS = [
  { lp: 'CalPERS', commitment: 400, called: 280, distributed: 108, nav: 336, unfunded: 120, tvpi: 1.59 },
  { lp: 'Yale Endowment', commitment: 300, called: 210, distributed: 81, nav: 252, unfunded: 90, tvpi: 1.59 },
  { lp: 'ADIA', commitment: 350, called: 245, distributed: 94.5, nav: 294, unfunded: 105, tvpi: 1.59 },
  { lp: 'Hamilton Lane FoF III', commitment: 250, called: 175, distributed: 67.5, nav: 210, unfunded: 75, tvpi: 1.59 },
  { lp: 'Pritzker Family Office', commitment: 200, called: 140, distributed: 54, nav: 168, unfunded: 60, tvpi: 1.59 },
  { lp: 'MetLife Insurance', commitment: 300, called: 210, distributed: 81, nav: 252, unfunded: 90, tvpi: 1.59 },
  { lp: 'Ford Foundation', commitment: 150, called: 105, distributed: 40.5, nav: 126, unfunded: 45, tvpi: 1.59 },
  { lp: 'Ontario Teachers', commitment: 250, called: 175, distributed: 67.5, nav: 210, unfunded: 75, tvpi: 1.59 },
];

export const CLAWBACK_SCENARIOS = [
  { scenario: 'Base Case', description: 'All portfolio companies exit at current NAV', totalDistributions: 3_600, gpCarry: 335, clawbackRisk: 0, probability: 0.60 },
  { scenario: 'Downside (-20% NAV)', description: 'Market correction reduces exit multiples', totalDistributions: 2_880, gpCarry: 192, clawbackRisk: 0, probability: 0.25 },
  { scenario: 'Severe (-40% NAV)', description: 'Deep recession, 2 portfolio write-downs', totalDistributions: 2_160, gpCarry: 47, clawbackRisk: 85, probability: 0.10 },
  { scenario: 'Catastrophic (-60% NAV)', description: 'Multiple bankruptcies, total portfolio impairment', totalDistributions: 1_440, gpCarry: 0, clawbackRisk: 290, probability: 0.05 },
];
