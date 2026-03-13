/* ═══════════════════════════════════════════════════════
   MERIDIAN — Portfolio Companies
   ═══════════════════════════════════════════════════════ */

export type ExitStrategy = 'Strategic Sale' | 'Sponsor-to-Sponsor' | 'IPO' | 'Recapitalization' | 'Hold';

export interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  acquired: string;
  entryEV: number;
  entryEbitda: number;
  entryMultiple: number;
  currentEbitda: number;
  currentEV: number;
  currentMultiple: number;
  equityInvested: number;
  currentNAV: number;
  moic: number;
  grossIRR: number;
  revenueAtEntry: number;
  currentRevenue: number;
  employees: number;
  boltOns: number;
  exitStrategy: ExitStrategy;
  exitTimeline: string;
  ceo: string;
  boardSeat: string;
  status: 'Performing' | 'Watch' | 'Underperforming' | 'Exit Ready';
}

export const PORTFOLIO: PortfolioCompany[] = [
  {
    id: 'PC-01',
    name: 'NorthStar Physician Partners',
    sector: 'Healthcare Services',
    acquired: '2022-06-15',
    entryEV: 380_000_000,
    entryEbitda: 32_000_000,
    entryMultiple: 11.9,
    currentEbitda: 58_000_000,
    currentEV: 812_000_000,
    currentMultiple: 14.0,
    equityInvested: 225_000_000,
    currentNAV: 445_000_000,
    moic: 1.98,
    grossIRR: 0.28,
    revenueAtEntry: 260_000_000,
    currentRevenue: 480_000_000,
    employees: 2800,
    boltOns: 5,
    exitStrategy: 'Strategic Sale',
    exitTimeline: 'H2 2026',
    ceo: 'Dr. Rachel Torres',
    boardSeat: 'Victoria Chen',
    status: 'Exit Ready',
  },
  {
    id: 'PC-02',
    name: 'Sentinel Security Technologies',
    sector: 'Industrial Tech',
    acquired: '2022-09-01',
    entryEV: 245_000_000,
    entryEbitda: 22_000_000,
    entryMultiple: 11.1,
    currentEbitda: 38_000_000,
    currentEV: 494_000_000,
    currentMultiple: 13.0,
    equityInvested: 155_000_000,
    currentNAV: 310_000_000,
    moic: 2.00,
    grossIRR: 0.30,
    revenueAtEntry: 165_000_000,
    currentRevenue: 285_000_000,
    employees: 1200,
    boltOns: 3,
    exitStrategy: 'Sponsor-to-Sponsor',
    exitTimeline: 'Q1 2027',
    ceo: 'David Park',
    boardSeat: 'Marcus Webb',
    status: 'Exit Ready',
  },
  {
    id: 'PC-03',
    name: 'Heritage Benefits Group',
    sector: 'Financial Services',
    acquired: '2023-02-10',
    entryEV: 310_000_000,
    entryEbitda: 28_000_000,
    entryMultiple: 11.1,
    currentEbitda: 42_000_000,
    currentEV: 546_000_000,
    currentMultiple: 13.0,
    equityInvested: 185_000_000,
    currentNAV: 335_000_000,
    moic: 1.81,
    grossIRR: 0.26,
    revenueAtEntry: 180_000_000,
    currentRevenue: 270_000_000,
    employees: 850,
    boltOns: 4,
    exitStrategy: 'Strategic Sale',
    exitTimeline: 'H1 2027',
    ceo: 'Michael Foster',
    boardSeat: 'James Hartwell',
    status: 'Performing',
  },
  {
    id: 'PC-04',
    name: 'Atlas Manufacturing Solutions',
    sector: 'Industrials',
    acquired: '2023-08-20',
    entryEV: 195_000_000,
    entryEbitda: 24_000_000,
    entryMultiple: 8.1,
    currentEbitda: 30_000_000,
    currentEV: 270_000_000,
    currentMultiple: 9.0,
    equityInvested: 130_000_000,
    currentNAV: 175_000_000,
    moic: 1.35,
    grossIRR: 0.14,
    revenueAtEntry: 340_000_000,
    currentRevenue: 395_000_000,
    employees: 1600,
    boltOns: 1,
    exitStrategy: 'Hold',
    exitTimeline: '2028+',
    ceo: 'Greg Lawson',
    boardSeat: 'Marcus Webb',
    status: 'Watch',
  },
  {
    id: 'PC-05',
    name: 'Cascade Data Systems',
    sector: 'Technology',
    acquired: '2024-01-15',
    entryEV: 210_000_000,
    entryEbitda: 14_000_000,
    entryMultiple: 15.0,
    currentEbitda: 22_000_000,
    currentEV: 374_000_000,
    currentMultiple: 17.0,
    equityInvested: 140_000_000,
    currentNAV: 248_000_000,
    moic: 1.77,
    grossIRR: 0.42,
    revenueAtEntry: 72_000_000,
    currentRevenue: 112_000_000,
    employees: 420,
    boltOns: 2,
    exitStrategy: 'IPO',
    exitTimeline: 'H2 2027',
    ceo: 'Amanda Liu',
    boardSeat: 'Sarah Kim',
    status: 'Performing',
  },
  {
    id: 'PC-06',
    name: 'Pacific Coast Logistics',
    sector: 'Industrials',
    acquired: '2024-06-01',
    entryEV: 155_000_000,
    entryEbitda: 18_000_000,
    entryMultiple: 8.6,
    currentEbitda: 21_000_000,
    currentEV: 189_000_000,
    currentMultiple: 9.0,
    equityInvested: 105_000_000,
    currentNAV: 125_000_000,
    moic: 1.19,
    grossIRR: 0.12,
    revenueAtEntry: 380_000_000,
    currentRevenue: 415_000_000,
    employees: 2100,
    boltOns: 0,
    exitStrategy: 'Recapitalization',
    exitTimeline: '2027',
    ceo: 'Thomas Brennan',
    boardSeat: 'Victoria Chen',
    status: 'Performing',
  },
  {
    id: 'PC-07',
    name: 'Summit Behavioral Health',
    sector: 'Healthcare Services',
    acquired: '2024-11-01',
    entryEV: 280_000_000,
    entryEbitda: 25_000_000,
    entryMultiple: 11.2,
    currentEbitda: 28_000_000,
    currentEV: 336_000_000,
    currentMultiple: 12.0,
    equityInvested: 170_000_000,
    currentNAV: 200_000_000,
    moic: 1.18,
    grossIRR: 0.38,
    revenueAtEntry: 195_000_000,
    currentRevenue: 220_000_000,
    employees: 1450,
    boltOns: 1,
    exitStrategy: 'Hold',
    exitTimeline: '2028+',
    ceo: 'Dr. Karen Mitchell',
    boardSeat: 'James Hartwell',
    status: 'Performing',
  },
];

export const VALUE_CREATION_LEVERS = [
  { lever: 'Revenue Growth', contribution: 0.35, color: '#10B981', examples: ['Cross-sell expansion', 'New market entry', 'Pricing optimization'] },
  { lever: 'Margin Expansion', contribution: 0.25, color: '#3B82F6', examples: ['Procurement savings', 'Automation', 'Shared services'] },
  { lever: 'Multiple Expansion', contribution: 0.22, color: '#8B5CF6', examples: ['Platform premium', 'Scale re-rating', 'Sector rotation'] },
  { lever: 'Add-on Acquisitions', contribution: 0.18, color: '#F59E0B', examples: ['Bolt-on M&A', 'Tuck-in synergies', 'Geographic expansion'] },
];

export const EXIT_PIPELINE = [
  { company: 'NorthStar Physician Partners', nav: 445, timeline: 'H2 2026', strategy: 'Strategic Sale', readiness: 0.90 },
  { company: 'Sentinel Security Technologies', nav: 310, timeline: 'Q1 2027', strategy: 'Sponsor-to-Sponsor', readiness: 0.75 },
  { company: 'Cascade Data Systems', nav: 248, timeline: 'H2 2027', strategy: 'IPO', readiness: 0.45 },
];
