// Ridgeline Supply Co. — Compensation Plans & SPIFFs
// Synthetic demo data: ICM with tiered incentives

import type { EmployeeRole } from './employees';

export interface CompPlan {
  role: EmployeeRole;
  planName: string;
  baseSalaryRange: { min: number; max: number; median: number };
  incentiveTarget: number; // % of base
  oteRange: { min: number; max: number; median: number };
  payFrequency: string;
  trueUpFrequency: string;
  components: { name: string; weight: number; description: string }[];
}

export interface CompTier {
  level: number;
  label: string;
  floor: number; // attainment floor
  ceiling: number; // attainment ceiling
  rate: number; // payout multiplier
  color: string;
}

export interface SpiffProgram {
  id: string;
  name: string;
  vendor: string;
  productCategory: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'expired';
  payoutPerUnit: number;
  unitType: string;
  totalBudget: number;
  utilized: number;
  eligibleRoles: EmployeeRole[];
}

export const COMP_PLANS: CompPlan[] = [
  {
    role: 'SVP',
    planName: 'Executive Incentive Plan',
    baseSalaryRange: { min: 250000, max: 320000, median: 285000 },
    incentiveTarget: 0.60,
    oteRange: { min: 400000, max: 512000, median: 456000 },
    payFrequency: 'Quarterly',
    trueUpFrequency: 'Annual',
    components: [
      { name: 'Division EBITDA', weight: 40, description: 'EBITDA vs plan for entire division' },
      { name: 'Revenue Growth', weight: 30, description: 'YoY revenue growth rate' },
      { name: 'Branch Profitability', weight: 20, description: 'Avg branch margin improvement' },
      { name: 'Safety & Compliance', weight: 10, description: 'OSHA incident rate + audit score' },
    ],
  },
  {
    role: 'RVP',
    planName: 'Regional VP Incentive Plan',
    baseSalaryRange: { min: 190000, max: 240000, median: 215000 },
    incentiveTarget: 0.50,
    oteRange: { min: 285000, max: 360000, median: 322500 },
    payFrequency: 'Quarterly',
    trueUpFrequency: 'Annual',
    components: [
      { name: 'Region EBITDA', weight: 35, description: 'EBITDA vs plan for region' },
      { name: 'Revenue Growth', weight: 30, description: 'YoY region revenue growth' },
      { name: 'New Branch Integration', weight: 20, description: 'Acquired branch performance' },
      { name: 'Talent Retention', weight: 15, description: 'Key personnel retention rate' },
    ],
  },
  {
    role: 'RSM',
    planName: 'Regional Sales Manager Plan',
    baseSalaryRange: { min: 145000, max: 180000, median: 165000 },
    incentiveTarget: 0.40,
    oteRange: { min: 203000, max: 252000, median: 231000 },
    payFrequency: 'Monthly',
    trueUpFrequency: 'Quarterly',
    components: [
      { name: 'Sales vs Plan', weight: 40, description: 'Revenue vs quota' },
      { name: 'Margin Mix', weight: 25, description: 'Product margin improvement' },
      { name: 'Branch Performance', weight: 20, description: 'Bottom-quartile branch lift' },
      { name: 'Customer Retention', weight: 15, description: 'Key account retention rate' },
    ],
  },
  {
    role: 'BM',
    planName: 'Branch Manager Bonus Plan',
    baseSalaryRange: { min: 72000, max: 95000, median: 82000 },
    incentiveTarget: 0.20,
    oteRange: { min: 86400, max: 114000, median: 98400 },
    payFrequency: 'Monthly',
    trueUpFrequency: 'Quarterly',
    components: [
      { name: 'Branch EBITDA', weight: 35, description: 'Branch profitability vs plan' },
      { name: 'Sales Volume', weight: 30, description: 'Revenue delivered vs target' },
      { name: 'Inventory Turns', weight: 20, description: 'Inventory efficiency' },
      { name: 'Safety Score', weight: 15, description: 'Branch safety & compliance' },
    ],
  },
];

export const COMP_TIERS: CompTier[] = [
  { level: 1, label: 'Threshold', floor: 0, ceiling: 0.80, rate: 0.50, color: '#94A3B8' },
  { level: 2, label: 'Target', floor: 0.80, ceiling: 1.00, rate: 1.00, color: '#F59E0B' },
  { level: 3, label: 'Excellence', floor: 1.00, ceiling: 1.15, rate: 1.25, color: '#2563EB' },
  { level: 4, label: 'Outstanding', floor: 1.15, ceiling: 999, rate: 1.50, color: '#22C55E' },
];

export const SPIFF_PROGRAMS: SpiffProgram[] = [
  {
    id: 'spiff-001',
    name: 'GAF Storm Season Push',
    vendor: 'GAF',
    productCategory: 'Roofing Shingles',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    status: 'active',
    payoutPerUnit: 2.50,
    unitType: 'square (100 sq ft)',
    totalBudget: 450000,
    utilized: 187500,
    eligibleRoles: ['BM', 'ABM', 'BD'],
  },
  {
    id: 'spiff-002',
    name: 'Owens Corning Q2 Accelerator',
    vendor: 'Owens Corning',
    productCategory: 'Insulation & Composites',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    status: 'active',
    payoutPerUnit: 1.75,
    unitType: 'bundle',
    totalBudget: 280000,
    utilized: 98000,
    eligibleRoles: ['BM', 'ABM', 'BD', 'DM'],
  },
  {
    id: 'spiff-003',
    name: 'CertainTeed Solar Integration',
    vendor: 'CertainTeed',
    productCategory: 'Solar Roofing',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    status: 'upcoming',
    payoutPerUnit: 15.00,
    unitType: 'system sold',
    totalBudget: 200000,
    utilized: 0,
    eligibleRoles: ['BM', 'ABM', 'BD', 'DM', 'RM'],
  },
  {
    id: 'spiff-004',
    name: 'TAMKO Summit Promo',
    vendor: 'TAMKO',
    productCategory: 'Premium Shingles',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    status: 'expired',
    payoutPerUnit: 1.25,
    unitType: 'square',
    totalBudget: 180000,
    utilized: 162000,
    eligibleRoles: ['BM', 'ABM'],
  },
];

export function getCompPlanByRole(role: EmployeeRole): CompPlan | undefined {
  return COMP_PLANS.find((p) => p.role === role);
}

export function getTierByAttainment(attainment: number): CompTier {
  for (let i = COMP_TIERS.length - 1; i >= 0; i--) {
    if (attainment >= COMP_TIERS[i].floor) return COMP_TIERS[i];
  }
  return COMP_TIERS[0];
}

export function getActiveSpiffs(): SpiffProgram[] {
  return SPIFF_PROGRAMS.filter((s) => s.status === 'active');
}
