/* ═══════════════════════════════════════════════════════
   MERIDIAN — Fund Structure & Terms
   Granite Peak Capital Fund IV — M&A / Growth Equity
   ═══════════════════════════════════════════════════════ */

export interface FundTerms {
  name: string;
  vintage: number;
  targetSize: number;
  committedCapital: number;
  calledCapital: number;
  uncalledCapital: number;
  managementFee: number;
  carriedInterest: number;
  hurdleRate: number;
  catchUpSplit: [number, number]; // [GP%, LP%]
  postCatchUpSplit: [number, number];
  gpCommitment: number;
  gpCommitmentPct: number;
  investmentPeriod: number; // years
  fundLife: number; // years
  clawbackProvision: boolean;
  keyPersonClause: string[];
}

export const FUND: FundTerms = {
  name: 'Granite Peak Capital Fund IV',
  vintage: 2022,
  targetSize: 2_500_000_000,
  committedCapital: 2_750_000_000,
  calledCapital: 1_925_000_000,
  uncalledCapital: 825_000_000,
  managementFee: 0.02,
  carriedInterest: 0.20,
  hurdleRate: 0.08,
  catchUpSplit: [100, 0],
  postCatchUpSplit: [20, 80],
  gpCommitment: 82_500_000,
  gpCommitmentPct: 0.03,
  investmentPeriod: 5,
  fundLife: 10,
  clawbackProvision: true,
  keyPersonClause: ['James Hartwell', 'Victoria Chen'],
};

export interface LP {
  name: string;
  type: 'Pension' | 'Endowment' | 'SWF' | 'FoF' | 'Family Office' | 'Insurance' | 'Foundation';
  commitment: number;
  called: number;
  distributions: number;
  nav: number;
  tvpi: number;
  dpi: number;
}

export const LPS: LP[] = [
  { name: 'CalPERS', type: 'Pension', commitment: 400_000_000, called: 280_000_000, distributions: 168_000_000, nav: 336_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'Yale Endowment', type: 'Endowment', commitment: 300_000_000, called: 210_000_000, distributions: 126_000_000, nav: 252_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'ADIA', type: 'SWF', commitment: 350_000_000, called: 245_000_000, distributions: 147_000_000, nav: 294_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'Hamilton Lane FoF III', type: 'FoF', commitment: 250_000_000, called: 175_000_000, distributions: 105_000_000, nav: 210_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'Pritzker Family Office', type: 'Family Office', commitment: 200_000_000, called: 140_000_000, distributions: 84_000_000, nav: 168_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'MetLife Insurance', type: 'Insurance', commitment: 300_000_000, called: 210_000_000, distributions: 126_000_000, nav: 252_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'Ford Foundation', type: 'Foundation', commitment: 150_000_000, called: 105_000_000, distributions: 63_000_000, nav: 126_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'Ontario Teachers', type: 'Pension', commitment: 250_000_000, called: 175_000_000, distributions: 105_000_000, nav: 210_000_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'GP Commitment', type: 'Family Office', commitment: 82_500_000, called: 57_750_000, distributions: 34_650_000, nav: 69_300_000, tvpi: 1.80, dpi: 0.60 },
  { name: 'Other LPs (12)', type: 'Pension', commitment: 467_500_000, called: 327_250_000, distributions: 196_350_000, nav: 393_400_000, tvpi: 1.80, dpi: 0.60 },
];

export const FUND_PERFORMANCE = {
  grossIRR: 0.242,
  netIRR: 0.186,
  grossTVPI: 1.87,
  netTVPI: 1.62,
  grossDPI: 0.64,
  netDPI: 0.55,
  grossMoC: 1.87,
  pmeAlpha: 0.034, // vs S&P 500
  vintageQuartile: 1 as const,
};

export const DEPLOYMENT_TIMELINE = [
  { quarter: 'Q1 2022', called: 200, deployed: 180, cumDeployed: 180 },
  { quarter: 'Q2 2022', called: 150, deployed: 140, cumDeployed: 320 },
  { quarter: 'Q3 2022', called: 175, deployed: 220, cumDeployed: 540 },
  { quarter: 'Q4 2022', called: 200, deployed: 185, cumDeployed: 725 },
  { quarter: 'Q1 2023', called: 225, deployed: 210, cumDeployed: 935 },
  { quarter: 'Q2 2023', called: 150, deployed: 195, cumDeployed: 1130 },
  { quarter: 'Q3 2023', called: 175, deployed: 160, cumDeployed: 1290 },
  { quarter: 'Q4 2023', called: 125, deployed: 175, cumDeployed: 1465 },
  { quarter: 'Q1 2024', called: 100, deployed: 130, cumDeployed: 1595 },
  { quarter: 'Q2 2024', called: 75, deployed: 85, cumDeployed: 1680 },
  { quarter: 'Q3 2024', called: 50, deployed: 45, cumDeployed: 1725 },
  { quarter: 'Q4 2024', called: 100, deployed: 95, cumDeployed: 1820 },
  { quarter: 'Q1 2025', called: 50, deployed: 55, cumDeployed: 1875 },
  { quarter: 'Q2 2025', called: 50, deployed: 50, cumDeployed: 1925 },
];

export const STRATEGIC_PRIORITIES = [
  { title: 'Healthcare Services Roll-Up', desc: 'Acquire 3-5 specialty physician practice management platforms. $200M+ combined EBITDA target.', stat: '$1.2B', icon: '🏥' },
  { title: 'Industrial Tech Carve-Outs', desc: 'Source corporate divestitures in automation, sensors, and industrial IoT. Complexity discount arbitrage.', stat: '4 Active', icon: '🏭' },
  { title: 'Financial Services Consolidation', desc: 'Insurance brokerage and wealth management platform builds. Recurring revenue focus.', stat: '35% IRR', icon: '🏦' },
  { title: 'Exit Pipeline Acceleration', desc: 'Position 3 portfolio companies for 2026 exits. Combined NAV $890M. Strategic + sponsor-to-sponsor tracks.', stat: '$890M NAV', icon: '🚀' },
];
