// SRS Distribution — Compensation Plans & Scorecard Data
// Models the multi-tier comp structure: SVP → RVP → RM → BM

export type PlanTier = 'SVP' | 'RVP' | 'RM' | 'BM';

export interface CompPlan {
  id: string;
  name: string;
  tier: PlanTier;
  division: 'SRS' | 'Heritage' | 'Both';
  baseSalaryRange: [number, number];
  targetIncentive: number;
  maxPayout: number;
  components: CompComponent[];
  effectiveDate: string;
  status: 'active' | 'draft' | 'expired';
}

export interface CompComponent {
  name: string;
  weight: number;
  metric: string;
  threshold: number;
  target: number;
  stretch: number;
  payoutCurve: 'linear' | 'accelerated' | 'tiered';
}

export interface ScorecardResult {
  employeeId: string;
  planId: string;
  period: string;
  components: ComponentResult[];
  totalAttainment: number;
  projectedPayout: number;
  ytdPaid: number;
}

export interface ComponentResult {
  componentName: string;
  actual: number;
  target: number;
  attainmentPct: number;
  weightedScore: number;
}

export const COMP_PLANS: CompPlan[] = [
  {
    id: 'plan-svp', name: 'SVP Incentive Plan FY26', tier: 'SVP', division: 'Both',
    baseSalaryRange: [280000, 350000], targetIncentive: 450000, maxPayout: 675000,
    effectiveDate: '2026-01-01', status: 'active',
    components: [
      { name: 'Division EBITDA', weight: 0.40, metric: 'ebitda', threshold: 0.90, target: 1.00, stretch: 1.15, payoutCurve: 'accelerated' },
      { name: 'Division Revenue', weight: 0.30, metric: 'revenue', threshold: 0.92, target: 1.00, stretch: 1.10, payoutCurve: 'linear' },
      { name: 'Branch Growth', weight: 0.15, metric: 'branch_growth', threshold: 0.85, target: 1.00, stretch: 1.20, payoutCurve: 'tiered' },
      { name: 'Strategic Initiatives', weight: 0.15, metric: 'strategic', threshold: 0.80, target: 1.00, stretch: 1.00, payoutCurve: 'linear' },
    ],
  },
  {
    id: 'plan-rvp', name: 'RVP Incentive Plan FY26', tier: 'RVP', division: 'Both',
    baseSalaryRange: [180000, 240000], targetIncentive: 280000, maxPayout: 420000,
    effectiveDate: '2026-01-01', status: 'active',
    components: [
      { name: 'Region EBITDA', weight: 0.35, metric: 'ebitda', threshold: 0.90, target: 1.00, stretch: 1.15, payoutCurve: 'accelerated' },
      { name: 'Region Revenue', weight: 0.30, metric: 'revenue', threshold: 0.92, target: 1.00, stretch: 1.10, payoutCurve: 'linear' },
      { name: 'New Branch Performance', weight: 0.20, metric: 'new_branch', threshold: 0.80, target: 1.00, stretch: 1.25, payoutCurve: 'tiered' },
      { name: 'Team Retention', weight: 0.15, metric: 'retention', threshold: 0.85, target: 1.00, stretch: 1.00, payoutCurve: 'linear' },
    ],
  },
  {
    id: 'plan-rm', name: 'RM Scorecard FY26', tier: 'RM', division: 'Both',
    baseSalaryRange: [95000, 130000], targetIncentive: 120000, maxPayout: 180000,
    effectiveDate: '2026-01-01', status: 'active',
    components: [
      { name: 'Branch Cluster EBITDA', weight: 0.30, metric: 'ebitda', threshold: 0.90, target: 1.00, stretch: 1.15, payoutCurve: 'accelerated' },
      { name: 'Cluster Revenue', weight: 0.25, metric: 'revenue', threshold: 0.92, target: 1.00, stretch: 1.10, payoutCurve: 'linear' },
      { name: 'Gross Margin %', weight: 0.20, metric: 'margin', threshold: 0.95, target: 1.00, stretch: 1.05, payoutCurve: 'linear' },
      { name: 'Safety & Compliance', weight: 0.10, metric: 'safety', threshold: 0.90, target: 1.00, stretch: 1.00, payoutCurve: 'linear' },
      { name: 'Customer Retention', weight: 0.15, metric: 'customer_retention', threshold: 0.88, target: 1.00, stretch: 1.10, payoutCurve: 'tiered' },
    ],
  },
  {
    id: 'plan-bm', name: 'BM Scorecard FY26 v2', tier: 'BM', division: 'Both',
    baseSalaryRange: [65000, 90000], targetIncentive: 45000, maxPayout: 67500,
    effectiveDate: '2026-03-01', status: 'active',
    components: [
      { name: 'Branch EBITDA', weight: 0.30, metric: 'ebitda', threshold: 0.90, target: 1.00, stretch: 1.15, payoutCurve: 'accelerated' },
      { name: 'Branch Revenue', weight: 0.25, metric: 'revenue', threshold: 0.92, target: 1.00, stretch: 1.10, payoutCurve: 'linear' },
      { name: 'Inventory Turns', weight: 0.15, metric: 'inventory', threshold: 0.85, target: 1.00, stretch: 1.10, payoutCurve: 'linear' },
      { name: 'Safety Score', weight: 0.10, metric: 'safety', threshold: 0.90, target: 1.00, stretch: 1.00, payoutCurve: 'linear' },
      { name: 'Customer NPS', weight: 0.10, metric: 'nps', threshold: 0.80, target: 1.00, stretch: 1.15, payoutCurve: 'tiered' },
      { name: 'Margin Mix', weight: 0.10, metric: 'margin_mix', threshold: 0.90, target: 1.00, stretch: 1.05, payoutCurve: 'linear' },
    ],
  },
];

// Sample scorecard results for Susan Boyer (RM)
export const SAMPLE_SCORECARDS: ScorecardResult[] = [
  {
    employeeId: 'e-030', planId: 'plan-rm', period: 'Q1 2026',
    totalAttainment: 106, projectedPayout: 127200, ytdPaid: 30000,
    components: [
      { componentName: 'Branch Cluster EBITDA', actual: 3800000, target: 3600000, attainmentPct: 106, weightedScore: 31.7 },
      { componentName: 'Cluster Revenue', actual: 25000000, target: 24000000, attainmentPct: 104, weightedScore: 26.0 },
      { componentName: 'Gross Margin %', actual: 22.1, target: 21.5, attainmentPct: 103, weightedScore: 20.5 },
      { componentName: 'Safety & Compliance', actual: 98, target: 95, attainmentPct: 103, weightedScore: 10.3 },
      { componentName: 'Customer Retention', actual: 94, target: 91, attainmentPct: 103, weightedScore: 15.5 },
    ],
  },
];

export const TIER_COLORS: Record<PlanTier, string> = {
  SVP: '#7C3AED',
  RVP: '#2563EB',
  RM: '#10B981',
  BM: '#06B6D4',
};

export function getPlanByTier(tier: PlanTier): CompPlan | undefined {
  return COMP_PLANS.find((p) => p.tier === tier && p.status === 'active');
}

export function getPayoutAtAttainment(plan: CompPlan, attainmentPct: number): number {
  if (attainmentPct < plan.components[0].threshold * 100) return 0;
  const ratio = attainmentPct / 100;
  if (ratio >= 1.15) return plan.maxPayout;
  if (ratio >= 1.0) {
    const overPerf = (ratio - 1.0) / 0.15;
    return plan.targetIncentive + overPerf * (plan.maxPayout - plan.targetIncentive);
  }
  const underPerf = (ratio - plan.components[0].threshold) / (1.0 - plan.components[0].threshold);
  return underPerf * plan.targetIncentive;
}
