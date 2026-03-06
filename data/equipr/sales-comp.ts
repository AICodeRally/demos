// ── Sales Compensation & Rate Impact Data ─────────────────────────────────────
// Ties comp structure to rate governance — the key insight for ARA Show 2026.
// Traditional plans reward volume (flat % of revenue), incentivizing discounting.
// AI-optimized plans reward rate compliance, reducing leakage.

// ── Types ─────────────────────────────────────────────────────────────────────

export type CompPlanType = 'traditional' | 'ai-optimized';

export interface MonthlyMetric {
  month: string;
  revenue: number;
  commission: number;
  leakage: number;
  compliance: number;
}

export interface SalesRep {
  id: string;
  name: string;
  location: string;
  title: string;
  base: number;
  commissionRate: number;
  ytdRevenue: number;
  ytdCommission: number;
  ytdLeakage: number;
  rateComplianceScore: number;
  compPlanType: CompPlanType;
  monthlyMetrics: MonthlyMetric[];
}

export interface CompKpis {
  totalTeamRevenue: number;
  totalCommissionPaid: number;
  totalLeakage: number;
  avgRateCompliance: number;
  aiPlanReps: number;
  totalReps: number;
  leakageReductionAiPlan: number;
}

export interface CompVsLeakage {
  name: string;
  commission: number;
  leakage: number;
  planType: CompPlanType;
}

export interface PlanDetails {
  label: string;
  baseCommission: string;
  rateBonus: string;
  leakagePenalty: string;
  avgLeakagePerRep: number;
  avgComplianceScore: number;
}

export interface PlanComparison {
  traditional: PlanDetails;
  aiOptimized: PlanDetails;
}

export interface ComplianceTrendMonth {
  month: string;
  traditional: number;
  aiOptimized: number;
}

export interface LeakageImpactProjection {
  currentAnnualLeakage: number;
  projectedAnnualLeakage: number;
  annualSavings: number;
  netRevenueLift: number;
}

// ── Sales Reps ────────────────────────────────────────────────────────────────

export const SALES_REPS: SalesRep[] = [
  {
    id: 'rep-001',
    name: 'Mike Torres',
    location: 'Orlando',
    title: 'Senior Sales Rep',
    base: 52000,
    commissionRate: 3,
    ytdRevenue: 142000,
    ytdCommission: 4260,
    ytdLeakage: 12000,
    rateComplianceScore: 62,
    compPlanType: 'traditional',
    monthlyMetrics: [
      { month: 'Sep', revenue: 68000, commission: 2040, leakage: 8200, compliance: 58 },
      { month: 'Oct', revenue: 71000, commission: 2130, leakage: 9100, compliance: 56 },
      { month: 'Nov', revenue: 69000, commission: 2070, leakage: 9800, compliance: 60 },
      { month: 'Dec', revenue: 74000, commission: 2220, leakage: 10400, compliance: 61 },
      { month: 'Jan', revenue: 72000, commission: 2160, leakage: 11200, compliance: 59 },
      { month: 'Feb', revenue: 71000, commission: 2130, leakage: 12000, compliance: 62 },
    ],
  },
  {
    id: 'rep-002',
    name: 'Sarah Chen',
    location: 'Tampa',
    title: 'Sales Rep',
    base: 48000,
    commissionRate: 3,
    ytdRevenue: 118000,
    ytdCommission: 3540,
    ytdLeakage: 9000,
    rateComplianceScore: 74,
    compPlanType: 'traditional',
    monthlyMetrics: [
      { month: 'Sep', revenue: 56000, commission: 1680, leakage: 5800, compliance: 71 },
      { month: 'Oct', revenue: 58000, commission: 1740, leakage: 6200, compliance: 70 },
      { month: 'Nov', revenue: 61000, commission: 1830, leakage: 7100, compliance: 72 },
      { month: 'Dec', revenue: 59000, commission: 1770, leakage: 7800, compliance: 73 },
      { month: 'Jan', revenue: 60000, commission: 1800, leakage: 8400, compliance: 74 },
      { month: 'Feb', revenue: 59000, commission: 1770, leakage: 9000, compliance: 74 },
    ],
  },
  {
    id: 'rep-003',
    name: 'Jake Williams',
    location: 'Jacksonville',
    title: 'Sales Rep',
    base: 46000,
    commissionRate: 2,
    ytdRevenue: 96000,
    ytdCommission: 2640,
    ytdLeakage: 6000,
    rateComplianceScore: 81,
    compPlanType: 'ai-optimized',
    monthlyMetrics: [
      { month: 'Sep', revenue: 44000, commission: 1100, leakage: 5200, compliance: 68 },
      { month: 'Oct', revenue: 46000, commission: 1200, leakage: 4800, compliance: 71 },
      { month: 'Nov', revenue: 48000, commission: 1350, leakage: 4100, compliance: 74 },
      { month: 'Dec', revenue: 49000, commission: 1420, leakage: 3400, compliance: 77 },
      { month: 'Jan', revenue: 48000, commission: 1480, leakage: 2800, compliance: 79 },
      { month: 'Feb', revenue: 48000, commission: 1560, leakage: 2200, compliance: 81 },
    ],
  },
  {
    id: 'rep-004',
    name: 'Lisa Park',
    location: 'Orlando',
    title: 'Sales Rep',
    base: 46000,
    commissionRate: 2,
    ytdRevenue: 82000,
    ytdCommission: 2680,
    ytdLeakage: 1200,
    rateComplianceScore: 93,
    compPlanType: 'ai-optimized',
    monthlyMetrics: [
      { month: 'Sep', revenue: 38000, commission: 1240, leakage: 1600, compliance: 89 },
      { month: 'Oct', revenue: 39000, commission: 1280, leakage: 1500, compliance: 90 },
      { month: 'Nov', revenue: 40000, commission: 1310, leakage: 1400, compliance: 91 },
      { month: 'Dec', revenue: 41000, commission: 1360, leakage: 1300, compliance: 92 },
      { month: 'Jan', revenue: 41000, commission: 1370, leakage: 1200, compliance: 93 },
      { month: 'Feb', revenue: 41000, commission: 1380, leakage: 1200, compliance: 93 },
    ],
  },
  {
    id: 'rep-005',
    name: 'Carlos Mendez',
    location: 'Tampa',
    title: 'Sales Rep',
    base: 46000,
    commissionRate: 2,
    ytdRevenue: 89000,
    ytdCommission: 2760,
    ytdLeakage: 2100,
    rateComplianceScore: 89,
    compPlanType: 'ai-optimized',
    monthlyMetrics: [
      { month: 'Sep', revenue: 42000, commission: 1280, leakage: 2800, compliance: 84 },
      { month: 'Oct', revenue: 43000, commission: 1320, leakage: 2600, compliance: 85 },
      { month: 'Nov', revenue: 44000, commission: 1370, leakage: 2400, compliance: 87 },
      { month: 'Dec', revenue: 44000, commission: 1390, leakage: 2300, compliance: 88 },
      { month: 'Jan', revenue: 45000, commission: 1420, leakage: 2200, compliance: 89 },
      { month: 'Feb', revenue: 44500, commission: 1400, leakage: 2100, compliance: 89 },
    ],
  },
];

// ── KPIs ──────────────────────────────────────────────────────────────────────

export const COMP_KPIS: CompKpis = {
  totalTeamRevenue: 487000,
  totalCommissionPaid: 19480,
  totalLeakage: 47200,
  avgRateCompliance: 79.8,
  aiPlanReps: 3,
  totalReps: 5,
  leakageReductionAiPlan: 67,
};

// ── Commission vs Leakage by Rep ──────────────────────────────────────────────
// Shows inverse correlation: AI-plan reps have better commission efficiency
// (lower leakage) despite similar revenue levels.

export const COMP_VS_LEAKAGE: CompVsLeakage[] = [
  { name: 'Mike T.', commission: 4260, leakage: 12000, planType: 'traditional' },
  { name: 'Sarah C.', commission: 3540, leakage: 9000, planType: 'traditional' },
  { name: 'Jake W.', commission: 2640, leakage: 2200, planType: 'ai-optimized' },
  { name: 'Lisa P.', commission: 2680, leakage: 1200, planType: 'ai-optimized' },
  { name: 'Carlos M.', commission: 2760, leakage: 2100, planType: 'ai-optimized' },
];

// ── Plan Comparison ───────────────────────────────────────────────────────────

export const PLAN_COMPARISON: PlanComparison = {
  traditional: {
    label: 'Traditional Plan',
    baseCommission: '3% flat',
    rateBonus: 'None',
    leakagePenalty: 'None',
    avgLeakagePerRep: 10500,
    avgComplianceScore: 68,
  },
  aiOptimized: {
    label: 'AI-Optimized Plan',
    baseCommission: '2% base',
    rateBonus: '+1.5% on compliant deals',
    leakagePenalty: '-0.5% on below-floor',
    avgLeakagePerRep: 1650,
    avgComplianceScore: 87.7,
  },
};

// ── Compliance Trend (6 months) ───────────────────────────────────────────────
// AI-optimized reps show steady compliance improvement; traditional stays flat.

export const COMPLIANCE_TREND: ComplianceTrendMonth[] = [
  { month: 'Sep', traditional: 65, aiOptimized: 80 },
  { month: 'Oct', traditional: 63, aiOptimized: 82 },
  { month: 'Nov', traditional: 66, aiOptimized: 84 },
  { month: 'Dec', traditional: 67, aiOptimized: 86 },
  { month: 'Jan', traditional: 67, aiOptimized: 87 },
  { month: 'Feb', traditional: 68, aiOptimized: 88 },
];

// ── Leakage Impact Projection ─────────────────────────────────────────────────
// What if all 5 reps were on the AI-optimized comp plan?

export const LEAKAGE_IMPACT_PROJECTION: LeakageImpactProjection = {
  currentAnnualLeakage: 566400,   // $47.2K * 12
  projectedAnnualLeakage: 178800, // 67% reduction
  annualSavings: 387600,          // difference
  netRevenueLift: 324000,         // savings minus extra comp cost
};
