/* ═══════════════════════════════════════════════════════
   MERIDIAN — Tax, Accounting & LPA Governance
   Section 1061, ASC 718/606, waterfall structures,
   governance triggers, and advisory landscape
   ═══════════════════════════════════════════════════════ */

// ── Section 1061 Tax Treatment ──────────────────────────

export interface Section1061Item {
  category: string;
  holding: string;
  gains: number;
  treatment: 'LTCG' | 'STCG' | 'Recharacterized' | 'Exempt';
  rate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  color: string;
  notes: string;
}

export const SECTION_1061_ITEMS: Section1061Item[] = [
  {
    category: 'Heritage Benefits Group',
    holding: '3.2 years',
    gains: 42_500_000,
    treatment: 'LTCG',
    rate: 0.238,
    riskLevel: 'Low',
    color: '#10B981',
    notes: 'Held >3 years. Qualifies for LTCG under API rules.',
  },
  {
    category: 'NorthStar Physician Partners',
    holding: '2.8 years',
    gains: 38_200_000,
    treatment: 'Recharacterized',
    rate: 0.37,
    riskLevel: 'High',
    color: '#EF4444',
    notes: 'Held <3 years. Recharacterized as STCG per Section 1061(a).',
  },
  {
    category: 'Sentinel Security',
    holding: '3.5 years',
    gains: 31_800_000,
    treatment: 'LTCG',
    rate: 0.238,
    riskLevel: 'Low',
    color: '#10B981',
    notes: 'Held >3 years. Clean LTCG treatment.',
  },
  {
    category: 'Atlas Manufacturing',
    holding: '2.1 years',
    gains: 18_400_000,
    treatment: 'Recharacterized',
    rate: 0.37,
    riskLevel: 'High',
    color: '#EF4444',
    notes: 'Held <3 years. API recharacterization applies.',
  },
  {
    category: 'Cascade Data Systems',
    holding: '1.8 years',
    gains: 12_600_000,
    treatment: 'Recharacterized',
    rate: 0.37,
    riskLevel: 'High',
    color: '#EF4444',
    notes: 'Recently acquired. Will recharacterize until 2027-Q2.',
  },
  {
    category: 'GP Capital Interest',
    holding: 'N/A',
    gains: 57_750_000,
    treatment: 'Exempt',
    rate: 0.238,
    riskLevel: 'Low',
    color: '#3B82F6',
    notes: 'Capital interest exception — invested capital commensurate with contribution.',
  },
];

export const SECTION_1061_SUMMARY = {
  totalAPIGains: 143_500_000,
  ltcgQualified: 74_300_000,
  recharacterized: 69_200_000,
  exempt: 57_750_000,
  blendedEffectiveRate: 0.298,
  potentialTaxSavings: 9_130_000,
  holdingPeriodThreshold: '3 years',
  finalRegsDate: 'January 2021',
  technicalCorrections: 'Issued 2022-2024',
};

// ── ASC 718 & ASC 606 Accounting ────────────────────────

export interface AccountingItem {
  standard: string;
  scope: string;
  treatment: string;
  status: string;
  impact: string;
  color: string;
}

export const ACCOUNTING_ITEMS: AccountingItem[] = [
  {
    standard: 'ASC 718',
    scope: 'Profits Interest Awards',
    treatment: 'Equity-classified, fair value at grant. ASU 2024-01 Example 10 Cases A-D clarify scope.',
    status: 'Compliant',
    impact: 'Non-cash comp expense of $4.2M recognized over vesting period.',
    color: '#10B981',
  },
  {
    standard: 'ASC 718',
    scope: 'Synthetic Carry Programs',
    treatment: 'Cash-settled liability, mark-to-market each period.',
    status: 'Under Review',
    impact: 'Potential $1.8M quarterly P&L volatility from MTM adjustments.',
    color: '#F59E0B',
  },
  {
    standard: 'ASC 606',
    scope: 'Carry as Performance Fee',
    treatment: 'Variable consideration, constrained until reversal risk resolved.',
    status: 'Compliant',
    impact: 'Revenue recognition deferred; $18.4M constrained carry not yet recognized.',
    color: '#10B981',
  },
  {
    standard: 'ASC 606',
    scope: 'Management Fee Revenue',
    treatment: 'Fixed consideration recognized over service period.',
    status: 'Compliant',
    impact: '$55M annual management fee recognized ratably.',
    color: '#10B981',
  },
  {
    standard: 'ASC 820',
    scope: 'Portfolio Fair Value',
    treatment: 'Level 3 inputs for unrealized positions. Quarterly valuation committee review.',
    status: 'Compliant',
    impact: '$2.4B unrealized NAV dependent on Level 3 fair value hierarchy.',
    color: '#10B981',
  },
];

// ── Waterfall Structure Comparison ──────────────────────

export interface WaterfallStructure {
  name: string;
  description: string;
  gpLiquidityTiming: string;
  clawbackRisk: 'Low' | 'Medium' | 'High';
  lpProtection: 'High' | 'Medium' | 'Low';
  operationalComplexity: 'Low' | 'Medium' | 'High';
  bestFor: string;
  color: string;
}

export const WATERFALL_STRUCTURES: WaterfallStructure[] = [
  {
    name: 'Whole-Fund (European)',
    description: 'Carry only after full fund clears return of capital + preferred return. GP receives carry last.',
    gpLiquidityTiming: 'Late (Year 5-8+)',
    clawbackRisk: 'Low',
    lpProtection: 'High',
    operationalComplexity: 'Low',
    bestFor: 'Large institutional LP bases with low clawback tolerance',
    color: '#10B981',
  },
  {
    name: 'Deal-by-Deal (American)',
    description: 'Carry calculated per realized deal. GP receives carry as each investment exits.',
    gpLiquidityTiming: 'Early (Year 2-3)',
    clawbackRisk: 'High',
    lpProtection: 'Low',
    operationalComplexity: 'High',
    bestFor: 'Sponsors needing early carry; LPs accept escrow protections',
    color: '#EF4444',
  },
  {
    name: 'Hybrid (European + Deal Gates)',
    description: 'Whole-fund economics with interim distribution gates triggered by investment-level returns.',
    gpLiquidityTiming: 'Middle (Year 3-5)',
    clawbackRisk: 'Medium',
    lpProtection: 'Medium',
    operationalComplexity: 'Medium',
    bestFor: 'Mixed LP bases requiring balance of GP incentive and LP protection',
    color: '#F59E0B',
  },
];

export interface WaterfallComparison {
  metric: string;
  wholeFund: string;
  dealByDeal: string;
  hybrid: string;
}

export const WATERFALL_COMPARISON: WaterfallComparison[] = [
  { metric: 'GP Carry Timing', wholeFund: 'After full fund return + pref', dealByDeal: 'After each deal return + pref', hybrid: 'Gated interim distributions' },
  { metric: 'Clawback Exposure', wholeFund: 'Minimal — natural self-correction', dealByDeal: 'High — requires escrow/holdback', hybrid: 'Moderate — gate mechanisms reduce' },
  { metric: 'Escrow Requirement', wholeFund: '0-10% typical', dealByDeal: '25-35% (ILPA recommends 30%)', hybrid: '15-25% typical' },
  { metric: 'LP IRR Impact', wholeFund: 'Maximized (capital returned first)', dealByDeal: 'Reduced (carry paid earlier)', hybrid: 'Moderate' },
  { metric: 'GP Retention Tool', wholeFund: 'Weak (long wait)', dealByDeal: 'Strong (early payout)', hybrid: 'Moderate' },
  { metric: 'Accounting Complexity', wholeFund: 'Straightforward', dealByDeal: 'Complex netting and true-ups', hybrid: 'Moderate' },
  { metric: 'Reporting Burden', wholeFund: 'Standard', dealByDeal: 'Per-deal waterfall + aggregate reconciliation', hybrid: 'Gate tracking + aggregate' },
  { metric: 'Section 1061 Impact', wholeFund: 'Favorable (longer hold periods)', dealByDeal: 'Mixed (early exits may recharacterize)', hybrid: 'Mixed' },
];

// GP IV uses whole-fund — show what deal-by-deal would look like
export interface DealByDealScenario {
  deal: string;
  invested: number;
  exitProceeds: number;
  profit: number;
  gpCarryIfDBD: number;
  lpDistribution: number;
  overDistributionRisk: number; // at aggregate level
}

export const DEAL_BY_DEAL_SCENARIO: DealByDealScenario[] = [
  { deal: 'Heritage Benefits', invested: 275_000_000, exitProceeds: 550_000_000, profit: 275_000_000, gpCarryIfDBD: 43_200_000, lpDistribution: 231_800_000, overDistributionRisk: 0 },
  { deal: 'NorthStar Physician', invested: 320_000_000, exitProceeds: 576_000_000, profit: 256_000_000, gpCarryIfDBD: 39_800_000, lpDistribution: 216_200_000, overDistributionRisk: 0 },
  { deal: 'Sentinel Security', invested: 180_000_000, exitProceeds: 378_000_000, profit: 198_000_000, gpCarryIfDBD: 29_400_000, lpDistribution: 168_600_000, overDistributionRisk: 0 },
  { deal: 'Atlas Manufacturing', invested: 230_000_000, exitProceeds: 299_000_000, profit: 69_000_000, gpCarryIfDBD: 6_200_000, lpDistribution: 62_800_000, overDistributionRisk: 12_400_000 },
  { deal: 'TerraData Analytics', invested: 150_000_000, exitProceeds: 120_000_000, profit: -30_000_000, gpCarryIfDBD: 0, lpDistribution: 120_000_000, overDistributionRisk: 38_000_000 },
  { deal: 'Pacific Coast Logistics', invested: 195_000_000, exitProceeds: 273_000_000, profit: 78_000_000, gpCarryIfDBD: 8_600_000, lpDistribution: 69_400_000, overDistributionRisk: 38_000_000 },
];

// ── LPA Governance ──────────────────────────────────────

export interface GovernanceClause {
  clause: string;
  category: 'Waterfall' | 'Governance' | 'Transfer' | 'Tax' | 'Reporting';
  status: 'Active' | 'Triggered' | 'Monitoring' | 'Not Triggered';
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  lpProtection: string;
  color: string;
}

export const GOVERNANCE_CLAUSES: GovernanceClause[] = [
  {
    clause: 'Preferred Return & Catch-Up',
    category: 'Waterfall',
    status: 'Active',
    risk: 'Low',
    description: '8% IRR hurdle with 100% GP catch-up to 20% of total profits. Compounded annually.',
    lpProtection: 'LPs receive full 8% return before any carry distribution to GP.',
    color: '#10B981',
  },
  {
    clause: 'Clawback Obligation',
    category: 'Waterfall',
    status: 'Active',
    risk: 'Medium',
    description: 'GP obligated to return excess carry at fund liquidation. Net of taxes already paid (tax giveback).',
    lpProtection: 'Several liability for individual GP participants; 30% escrow holdback.',
    color: '#F59E0B',
  },
  {
    clause: 'Escrow / Holdback',
    category: 'Waterfall',
    status: 'Active',
    risk: 'Low',
    description: '30% of all carry distributions held in escrow. Released on 3-year rolling basis after fund liquidation.',
    lpProtection: 'Secures clawback performance. Escrow funds invested in investment-grade securities.',
    color: '#10B981',
  },
  {
    clause: 'Key Person Provision',
    category: 'Governance',
    status: 'Monitoring',
    risk: 'Medium',
    description: 'Hartwell + Chen designated key persons. If either departs, investment period suspended pending LPAC vote.',
    lpProtection: 'Majority LPAC vote to resume. Cure period: 180 days to designate successor.',
    color: '#F59E0B',
  },
  {
    clause: 'GP Removal (For Cause)',
    category: 'Governance',
    status: 'Not Triggered',
    risk: 'Low',
    description: 'Supermajority LP vote (75%+) can remove GP for fraud, felony, or gross negligence. Carry forfeiture on cause.',
    lpProtection: 'Successor GP provisions with LP consent. Transition period: 12 months.',
    color: '#10B981',
  },
  {
    clause: 'GP Removal (Without Cause)',
    category: 'Governance',
    status: 'Not Triggered',
    risk: 'Low',
    description: '80%+ LP vote. GP retains carry on existing investments. New GP for uninvested capital.',
    lpProtection: 'No-fault offramp. Existing economics preserved but growth stopped.',
    color: '#10B981',
  },
  {
    clause: 'Transfer Restrictions',
    category: 'Transfer',
    status: 'Active',
    risk: 'Low',
    description: 'LP interests transferable with GP consent (not to be unreasonably withheld). GP interests non-transferable.',
    lpProtection: 'Prevents GP dilution or assignment without LP awareness.',
    color: '#10B981',
  },
  {
    clause: 'Change of Control',
    category: 'Governance',
    status: 'Not Triggered',
    risk: 'Medium',
    description: 'Sale of >50% GP platform stake requires LPAC notification. Key person provisions apply if principals change.',
    lpProtection: 'GP stake sale triggers disclosure and potential key person suspension.',
    color: '#F59E0B',
  },
  {
    clause: 'Side Letter Disclosure',
    category: 'Reporting',
    status: 'Active',
    risk: 'Low',
    description: 'All side letters cataloged. MFN provision: material economic terms extended to qualifying LPs on request.',
    lpProtection: 'No hidden economics. 14 active side letters disclosed in annual report.',
    color: '#10B981',
  },
  {
    clause: 'Section 1061 Reporting',
    category: 'Tax',
    status: 'Active',
    risk: 'Medium',
    description: 'Standardized API worksheet provided with K-1s. Holding period tracking per investment for all carry recipients.',
    lpProtection: 'Consistent disclosure. Audit-ready supporting workpapers.',
    color: '#F59E0B',
  },
  {
    clause: 'LPAC Composition',
    category: 'Governance',
    status: 'Active',
    risk: 'Low',
    description: '5-member LPAC: CalPERS (chair), Yale, ADIA, Hamilton Lane, Ontario Teachers. Quarterly meetings.',
    lpProtection: 'Conflict review, valuation oversight, related-party approvals.',
    color: '#10B981',
  },
  {
    clause: 'Valuation Committee',
    category: 'Reporting',
    status: 'Active',
    risk: 'Low',
    description: 'Independent valuation by Duff & Phelps annually. Internal marks quarterly reviewed by valuation committee.',
    lpProtection: 'ASC 820 Level 3 compliance. Prevents GP self-dealing on NAV marks.',
    color: '#10B981',
  },
];

// ── KPI Risk Dashboard ──────────────────────────────────

export interface CarryKPI {
  name: string;
  value: string;
  target: string;
  status: 'On Track' | 'Watch' | 'Alert';
  description: string;
  color: string;
}

export const CARRY_KPIS: CarryKPI[] = [
  { name: 'Carry IRR', value: '18.6%', target: '>15%', status: 'On Track', description: 'IRR on carry stream (cash + accrued)', color: '#10B981' },
  { name: 'Time-to-Carry', value: '2.3 yrs', target: '<3 yrs', status: 'On Track', description: 'Time from first close to first carry distribution', color: '#10B981' },
  { name: 'Payout Accuracy', value: '100%', target: '100%', status: 'On Track', description: 'Payouts reconciled without restatement', color: '#10B981' },
  { name: 'Clawback Exposure', value: '$0', target: '$0', status: 'On Track', description: 'Expected clawback under base case scenario', color: '#10B981' },
  { name: 'Escrow Sufficiency', value: '142%', target: '>100%', status: 'On Track', description: 'Escrow balance vs modeled clawback need', color: '#10B981' },
  { name: 'Section 1061 Risk', value: '48.2%', target: '<30%', status: 'Alert', description: 'Portion of API gains in <3 year holding window', color: '#EF4444' },
  { name: 'ASC 718 Burn Rate', value: '2.1%', target: '<3%', status: 'On Track', description: 'Annual non-cash comp expense as % of carry pool', color: '#10B981' },
  { name: 'Constrained Revenue', value: '$18.4M', target: 'Monitor', status: 'Watch', description: 'ASC 606 carry not yet recognized (reversal risk)', color: '#F59E0B' },
];

// ── Advisory Landscape ──────────────────────────────────

export interface AdvisoryFirm {
  name: string;
  strengths: string;
  carryFocus: string;
  color: string;
}

export const ADVISORY_LANDSCAPE: AdvisoryFirm[] = [
  { name: 'Deloitte', strengths: 'Technical accounting + ASC 718 guidance', carryFocus: 'Profits interest scope assessment (ASU 2024-01)', color: '#86BC25' },
  { name: 'PwC', strengths: 'Tax structuring + GP stakes diligence', carryFocus: 'Section 1061 + capital interest exception analysis', color: '#D93954' },
  { name: 'KPMG', strengths: 'Tax updates + regulatory monitoring', carryFocus: 'Final regs and technical corrections tracking', color: '#00338D' },
  { name: 'EY', strengths: 'Revenue recognition for asset managers', carryFocus: 'ASC 606 carry-as-variable-consideration framework', color: '#FFD700' },
  { name: 'Simpson Thacher', strengths: 'Private funds governance + regulatory', carryFocus: 'LPA negotiation, clawback/escrow mechanics', color: '#8B5CF6' },
  { name: 'Proskauer', strengths: 'Funds tax counseling + formation', carryFocus: 'Section 1061 holding period and exceptions', color: '#0EA5E9' },
];
