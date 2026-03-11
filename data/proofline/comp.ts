// Lone Star Distribution — Sales Compensation Model
// 4-gate BBI (Brand Balance Index) system: Core (Molson Coors), Import (Constellation+Heineken),
// Emerging (Craft+Spirits+FMB), Combined (blended)
// Replaces old 3-gate bbi.ts

import type { SupplierGroup } from './brands';

// ─── BBI Gate System ────────────────────────────

export type GateName = 'core' | 'import' | 'emerging' | 'combined';
export type GateStatus = 'locked' | 'unlocked' | 'at-risk';

export interface BBIGate {
  name: GateName;
  label: string;
  threshold: number;            // % required to unlock (e.g., 0.85 = 85%)
  multiplier: number;           // earnings multiplier when unlocked
  supplierGroups: SupplierGroup[];  // which suppliers count toward this gate
  description: string;
  color: string;                // gate badge color
}

export const BBI_GATES: BBIGate[] = [
  {
    name: 'core',
    label: 'BBI-Core ≥ 85%',
    threshold: 0.85,
    multiplier: 1.00,
    supplierGroups: ['molson-coors'],
    description: 'Molson Coors domestic portfolio must represent ≥85% of target volume. This is the foundation gate — without it, no BBI bonus applies.',
    color: '#60A5FA',
  },
  {
    name: 'import',
    label: 'BBI-Import ≥ 80%',
    threshold: 0.80,
    multiplier: 1.15,
    supplierGroups: ['constellation', 'heineken'],
    description: 'Constellation + Heineken import portfolio must hit ≥80% of target. Corona, Modelo, Heineken, and Dos Equis are the volume drivers.',
    color: '#F59E0B',
  },
  {
    name: 'emerging',
    label: 'BBI-Emerging ≥ 70%',
    threshold: 0.70,
    multiplier: 1.25,
    supplierGroups: ['craft', 'sazerac', 'fmb-rtd'],
    description: 'Craft + spirits + FMB/RTD must reach ≥70% of target. Sazerac spirits integration is a 2024 strategic priority — strong emerging performance signals portfolio diversification.',
    color: '#A78BFA',
  },
  {
    name: 'combined',
    label: 'BBI-Combined ≥ 90%',
    threshold: 0.90,
    multiplier: 1.50,
    supplierGroups: ['molson-coors', 'constellation', 'heineken', 'craft', 'sazerac', 'fmb-rtd'],
    description: 'All categories blended must exceed 90%. This is the "full portfolio" gate and the highest multiplier — it rewards sellers who execute across all supplier groups.',
    color: '#10B981',
  },
];

// ─── Commission Tiers ───────────────────────────

export interface CompTier {
  level: 1 | 2 | 3 | 4;
  label: string;
  floor: number;      // attainment floor (e.g., 0.85 = 85%)
  ceiling: number;     // attainment ceiling
  rate: number;        // commission rate (e.g., 0.025 = 2.5%)
  description: string;
  color: string;
}

export const COMP_TIERS: CompTier[] = [
  {
    level: 1,
    label: 'Tier 1 — Elite',
    floor: 1.05,
    ceiling: 999,    // uncapped
    rate: 0.025,     // 2.5%
    description: 'Top performers exceeding 105% attainment. Lowest commission rate because base earnings are already high from volume.',
    color: '#059669',
  },
  {
    level: 2,
    label: 'Tier 2 — Strong',
    floor: 0.90,
    ceiling: 1.05,
    rate: 0.035,     // 3.5%
    description: 'Solid performers between 90-105% attainment. The sweet spot where most seasoned reps operate.',
    color: '#2563eb',
  },
  {
    level: 3,
    label: 'Tier 3 — Developing',
    floor: 0.75,
    ceiling: 0.90,
    rate: 0.050,     // 5.0%
    description: 'Developing reps or those in transition. Higher rate incentivizes catch-up behavior.',
    color: '#c9a84c',
  },
  {
    level: 4,
    label: 'Tier 4 — Ramp',
    floor: 0.00,
    ceiling: 0.75,
    rate: 0.065,     // 6.5%
    description: 'New hires or struggling reps below 75% attainment. Highest rate to ensure minimum viable earnings.',
    color: '#EF4444',
  },
];

// ─── Spirits Adder ──────────────────────────────

export interface SpiritsAdder {
  rate: number;            // additional % on Sazerac revenue
  minAccounts: number;     // minimum spirits accounts to qualify
  description: string;
  qualifyingBrands: string[];  // brand IDs from brands.ts
}

export const SPIRITS_ADDER: SpiritsAdder = {
  rate: 0.015,             // 1.5% adder on all Sazerac revenue
  minAccounts: 5,          // must have at least 5 spirits-carrying accounts
  description: '1.5% commission adder on all Sazerac portfolio revenue. Requires minimum 5 spirits-carrying accounts on route. Stacks with BBI multiplier and tier rate.',
  qualifyingBrands: ['buffalo-trace', 'fireball', 'southern-comfort', 'wheatley-vodka'],
};

// ─── Quarterly Kickers ──────────────────────────

export interface Kicker {
  id: string;
  name: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  description: string;
  target: string;
  reward: number;          // bonus amount ($)
  eligibleReps: number;    // how many reps typically qualify
  brandFocus: string[];    // brand IDs this kicker focuses on
  startDate: string;
  endDate: string;
}

export const KICKERS: Kicker[] = [
  {
    id: 'kick-cinco',
    name: 'Cinco de Mayo Corona Blitz',
    quarter: 'Q2',
    description: 'Maximize Corona/Modelo display placements and volume in the two weeks around Cinco de Mayo. Displays must be photo-verified. Minimum 15 incremental cases per qualifying account.',
    target: 'Corona + Modelo volume ≥ 120% of Q2 weekly average for weeks 18-19',
    reward: 2800,
    eligibleReps: 28,      // ~78% of 36 reps
    brandFocus: ['corona-extra', 'modelo-especial', 'modelo-negra', 'pacifico'],
    startDate: '2026-04-27',
    endDate: '2026-05-10',
  },
  {
    id: 'kick-football',
    name: 'Football Season Coors Push',
    quarter: 'Q3',
    description: 'Drive Coors Light and Miller Lite placements in sports bars and on-premise accounts during NFL kickoff. Tap handle placements count double.',
    target: 'Coors Light + Miller Lite on-premise volume ≥ 110% of Q2 average for weeks 36-39',
    reward: 2200,
    eligibleReps: 24,      // ~67% of 36 reps
    brandFocus: ['coors-light', 'miller-lite'],
    startDate: '2026-09-07',
    endDate: '2026-10-04',
  },
  {
    id: 'kick-holiday-spirits',
    name: 'Holiday Spirits Showcase',
    quarter: 'Q4',
    description: 'Drive Sazerac portfolio holiday placement — gift packs, endcaps, and on-premise cocktail programs. Buffalo Trace Old Fashioned kits and Fireball holiday SKUs are the focus.',
    target: 'Sazerac portfolio revenue ≥ 130% of Q3 quarterly average',
    reward: 1500,
    eligibleReps: 18,      // 50% of 36 reps
    brandFocus: ['buffalo-trace', 'fireball', 'southern-comfort', 'wheatley-vodka'],
    startDate: '2026-11-01',
    endDate: '2026-12-31',
  },
];

// ─── Comp Plan Summary ──────────────────────────

export interface CompPlan {
  planYear: number;
  planName: string;
  baseSalary: { min: number; max: number; median: number };
  variableTarget: number;     // target variable % of base
  ote: { min: number; max: number; median: number }; // on-target earnings
  tiers: CompTier[];
  bbiGates: BBIGate[];
  spiritsAdder: SpiritsAdder;
  kickers: Kicker[];
  payFrequency: 'biweekly';
  trueUpFrequency: 'quarterly';
}

export const COMP_PLAN: CompPlan = {
  planYear: 2026,
  planName: 'Lone Star Distribution — Route Sales Representative Incentive Plan FY2026',
  baseSalary: { min: 42000, max: 58000, median: 48000 },
  variableTarget: 0.35,       // 35% of base as target variable
  ote: { min: 56700, max: 78300, median: 64800 },
  tiers: COMP_TIERS,
  bbiGates: BBI_GATES,
  spiritsAdder: SPIRITS_ADDER,
  kickers: KICKERS,
  payFrequency: 'biweekly',
  trueUpFrequency: 'quarterly',
};

// ─── Gate Status Helper ─────────────────────────

export function getGateStatus(
  gateThreshold: number,
  sellerPct: number
): GateStatus {
  if (sellerPct >= gateThreshold) return 'unlocked';
  if (sellerPct >= gateThreshold * 0.95) return 'at-risk';
  return 'locked';
}

// Count unlocked gates for a seller's BBI values
export function countUnlockedGates(bbiValues: {
  core: number;
  import: number;
  emerging: number;
  combined: number;
}): number {
  let count = 0;
  for (const gate of BBI_GATES) {
    if (bbiValues[gate.name] >= gate.threshold) count++;
  }
  return count;
}

// Calculate effective multiplier (highest unlocked gate)
export function getEffectiveMultiplier(bbiValues: {
  core: number;
  import: number;
  emerging: number;
  combined: number;
}): number {
  let maxMultiplier = 1.0;
  for (const gate of BBI_GATES) {
    if (bbiValues[gate.name] >= gate.threshold && gate.multiplier > maxMultiplier) {
      maxMultiplier = gate.multiplier;
    }
  }
  return maxMultiplier;
}

// Calculate estimated quarterly earnings for a seller
export function estimateQuarterlyEarnings(
  quarterlyRevenue: number,
  attainment: number,
  bbiValues: { core: number; import: number; emerging: number; combined: number },
  spiritsRevenue: number,
  spiritsAccountCount: number,
): {
  baseEarnings: number;
  variableEarnings: number;
  bbiMultiplier: number;
  spiritsBonus: number;
  totalEstimate: number;
  tier: CompTier;
  unlockedGates: number;
} {
  // Determine tier
  const tier = COMP_TIERS.find(
    t => attainment >= t.floor && attainment < t.ceiling
  ) ?? COMP_TIERS[COMP_TIERS.length - 1];

  const quarterlyBase = COMP_PLAN.baseSalary.median / 4;
  const variableEarnings = quarterlyRevenue * tier.rate;
  const bbiMultiplier = getEffectiveMultiplier(bbiValues);
  const adjustedVariable = variableEarnings * bbiMultiplier;

  // Spirits adder
  const spiritsBonus =
    spiritsAccountCount >= SPIRITS_ADDER.minAccounts
      ? spiritsRevenue * SPIRITS_ADDER.rate
      : 0;

  return {
    baseEarnings: quarterlyBase,
    variableEarnings: adjustedVariable,
    bbiMultiplier,
    spiritsBonus,
    totalEstimate: quarterlyBase + adjustedVariable + spiritsBonus,
    tier,
    unlockedGates: countUnlockedGates(bbiValues),
  };
}

// Get gate by name
export const getGateByName = (name: GateName): BBIGate | undefined =>
  BBI_GATES.find(g => g.name === name);

// Get tier by level
export const getTierByLevel = (level: 1 | 2 | 3 | 4): CompTier | undefined =>
  COMP_TIERS.find(t => t.level === level);
