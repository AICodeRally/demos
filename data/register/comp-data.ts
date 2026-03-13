// data/register/comp-data.ts
import type { FormatId } from './store-data';

export const COMP_TIERS = [
  { tier: 'Bronze', minRevenue: 0, maxRevenue: 24999, rate: 0.04, color: '#CD7F32' },
  { tier: 'Silver', minRevenue: 25000, maxRevenue: 49999, rate: 0.045, color: '#C0C0C0' },
  { tier: 'Gold', minRevenue: 50000, maxRevenue: 74999, rate: 0.05, color: '#FFD700' },
  { tier: 'Platinum', minRevenue: 75000, maxRevenue: Infinity, rate: 0.055, color: '#E5E4E2' },
];

export const SPIFF_CALENDAR = [
  { month: 'January', name: 'New Year Mattress Push', product: 'All Mattresses', bonus: '$15/unit', startDate: '2026-01-01', endDate: '2026-01-31', active: false },
  { month: 'February', name: 'Presidents Day Sale SPIFF', product: 'Adjustable Bases', bonus: '$25/unit', startDate: '2026-02-14', endDate: '2026-02-24', active: false },
  { month: 'March', name: 'Adjustable Base SPIFF', product: 'ErgoMotion Adj. Bases', bonus: '$25/unit', startDate: '2026-03-01', endDate: '2026-03-31', active: true },
  { month: 'April', name: 'Spring Clearance Bonus', product: 'Outlet Inventory', bonus: '2x commission', startDate: '2026-04-01', endDate: '2026-04-30', active: false },
  { month: 'May', name: 'Memorial Day Weekend', product: 'All Products', bonus: '$10/unit + team pool', startDate: '2026-05-22', endDate: '2026-05-26', active: false },
  { month: 'June', name: 'Summer Sleep Challenge', product: 'Cooling Products', bonus: '$20/unit', startDate: '2026-06-01', endDate: '2026-06-30', active: false },
];

export interface CommissionLogEntry {
  date: string;
  transactionId: string;
  items: string;
  saleTotal: number;
  tierApplied: string;
  rate: number;
  commission: number;
}

export const COMMISSION_LOG: CommissionLogEntry[] = [
  { date: '2026-03-11', transactionId: 'S-1041', items: 'Queen Hybrid + Protector', saleTotal: 1968, tierApplied: 'Silver', rate: 0.045, commission: 88.56 },
  { date: '2026-03-11', transactionId: 'S-1042', items: 'Full Firm', saleTotal: 849, tierApplied: 'Silver', rate: 0.045, commission: 38.21 },
  { date: '2026-03-11', transactionId: 'S-1043', items: 'King Pillow-Top + Base + Protector + Pillows', saleTotal: 3636, tierApplied: 'Silver', rate: 0.045, commission: 163.62 },
  { date: '2026-03-10', transactionId: 'S-1038', items: 'Queen Medium + Sheets', saleTotal: 1428, tierApplied: 'Silver', rate: 0.045, commission: 64.26 },
  { date: '2026-03-10', transactionId: 'S-1037', items: 'King Hybrid + Adj Base', saleTotal: 3198, tierApplied: 'Silver', rate: 0.045, commission: 143.91 },
  { date: '2026-03-10', transactionId: 'S-1036', items: 'Twin Firm', saleTotal: 699, tierApplied: 'Silver', rate: 0.045, commission: 31.46 },
  { date: '2026-03-09', transactionId: 'S-1033', items: 'Queen Hybrid + Protector + Pillows', saleTotal: 2237, tierApplied: 'Bronze', rate: 0.04, commission: 89.48 },
  { date: '2026-03-09', transactionId: 'S-1032', items: 'Full Firm + Basic Protector', saleTotal: 918, tierApplied: 'Bronze', rate: 0.04, commission: 36.72 },
];

export interface DisputeRecord {
  id: string;
  saleDate: string;
  transactionId: string;
  expectedAmount: number;
  calculatedAmount: number;
  discrepancy: string;
  status: 'submitted' | 'under_review' | 'resolved';
  filedDate: string;
  resolvedDate?: string;
  resolution?: string;
}

export const DISPUTES: DisputeRecord[] = [
  { id: 'D-101', saleDate: '2026-03-08', transactionId: 'S-1028', expectedAmount: 142.50, calculatedAmount: 127.80, discrepancy: 'Tier not applied — sale crossed Silver threshold mid-day', status: 'under_review', filedDate: '2026-03-09' },
  { id: 'D-102', saleDate: '2026-03-05', transactionId: 'S-1019', expectedAmount: 89.00, calculatedAmount: 71.20, discrepancy: 'SPIFF bonus missing — Adj Base sold during active SPIFF', status: 'submitted', filedDate: '2026-03-10' },
  { id: 'D-103', saleDate: '2026-02-22', transactionId: 'S-0987', expectedAmount: 55.00, calculatedAmount: 48.00, discrepancy: 'Return reversed but commission not reinstated', status: 'resolved', filedDate: '2026-02-23', resolvedDate: '2026-02-25', resolution: 'Commission reinstated — return was cancelled, sale stands' },
  { id: 'D-104', saleDate: '2026-02-18', transactionId: 'S-0962', expectedAmount: 210.00, calculatedAmount: 180.00, discrepancy: 'Bundle discount commission calculated on net, should be gross', status: 'resolved', filedDate: '2026-02-19', resolvedDate: '2026-02-21', resolution: 'Adjusted — policy confirms commission on gross sale price' },
  { id: 'D-105', saleDate: '2026-03-10', transactionId: 'S-1039', expectedAmount: 175.00, calculatedAmount: 175.00, discrepancy: 'Split sale credit not assigned — co-sold with Raj', status: 'submitted', filedDate: '2026-03-11' },
];

export interface StatementLineItem {
  category: string;
  description: string;
  amount: number;
}

export interface MonthlyStatement {
  period: string;
  periodLabel: string;
  repName: string;
  repId: string;
  store: string;
  planName: string;
  lineItems: StatementLineItem[];
  adjustments: StatementLineItem[];
  netPayout: number;
}

export const STATEMENTS: MonthlyStatement[] = [
  {
    period: '2026-03',
    periodLabel: 'March 1–15, 2026',
    repName: 'Casey Miller',
    repId: 'casey',
    store: 'Flagship #12 — Galleria',
    planName: 'Summit Sleep FY26 Floor Sales Plan',
    lineItems: [
      { category: 'Base Salary', description: 'Bi-weekly base (annualized $36,000)', amount: 1384.62 },
      { category: 'Mattress Commission', description: '14 units × avg $62.40', amount: 873.60 },
      { category: 'Accessory Commission', description: '6 units × avg $18.50', amount: 111.00 },
      { category: 'Attach Rate Accelerator', description: '12% attach — below 25% threshold, no bonus', amount: 0 },
      { category: 'Volume Tier Bonus', description: 'Silver tier (4.5%) on $21,400 incremental', amount: 963.00 },
      { category: 'SPIFF', description: 'Adj Base SPIFF — 2 units × $25', amount: 50.00 },
    ],
    adjustments: [
      { category: 'Prior Period Adj.', description: 'Feb dispute D-103 resolved — credit', amount: 7.00 },
    ],
    netPayout: 3389.22,
  },
  {
    period: '2026-02',
    periodLabel: 'February 16–28, 2026',
    repName: 'Casey Miller',
    repId: 'casey',
    store: 'Flagship #12 — Galleria',
    planName: 'Summit Sleep FY26 Floor Sales Plan',
    lineItems: [
      { category: 'Base Salary', description: 'Bi-weekly base', amount: 1384.62 },
      { category: 'Mattress Commission', description: '11 units', amount: 687.50 },
      { category: 'Accessory Commission', description: '3 units', amount: 55.50 },
      { category: 'Attach Rate Accelerator', description: '15% attach — below threshold', amount: 0 },
      { category: 'Volume Tier Bonus', description: 'Bronze tier (4%)', amount: 720.00 },
      { category: 'SPIFF', description: 'Presidents Day SPIFF — 1 unit × $25', amount: 25.00 },
    ],
    adjustments: [],
    netPayout: 2872.62,
  },
];

// Measurements data for the KPI dashboard
export interface KPIMeasurement {
  label: string;
  value: number;
  goal: number;
  unit: string;
  sparkline: number[];
}

export const KPI_MEASUREMENTS: Record<FormatId, KPIMeasurement[]> = {
  flagship: [
    { label: 'Units Sold', value: 142, goal: 150, unit: '', sparkline: [120, 135, 128, 145, 142] },
    { label: 'Revenue', value: 268000, goal: 280000, unit: '$', sparkline: [240000, 255000, 248000, 272000, 268000] },
    { label: 'Attach Rate', value: 31, goal: 35, unit: '%', sparkline: [28, 30, 27, 33, 31] },
    { label: 'Avg Sale Price', value: 1890, goal: 2000, unit: '$', sparkline: [1780, 1850, 1820, 1920, 1890] },
    { label: 'Financing Penetration', value: 64, goal: 70, unit: '%', sparkline: [58, 62, 60, 66, 64] },
    { label: 'Customer Satisfaction', value: 4.6, goal: 4.5, unit: '/5', sparkline: [4.4, 4.5, 4.3, 4.7, 4.6] },
  ],
  standard: [
    { label: 'Units Sold', value: 85, goal: 90, unit: '', sparkline: [72, 80, 78, 88, 85] },
    { label: 'Revenue', value: 148000, goal: 160000, unit: '$', sparkline: [130000, 142000, 138000, 155000, 148000] },
    { label: 'Attach Rate', value: 26, goal: 30, unit: '%', sparkline: [22, 24, 23, 28, 26] },
    { label: 'Avg Sale Price', value: 1740, goal: 1800, unit: '$', sparkline: [1680, 1720, 1700, 1760, 1740] },
    { label: 'Financing Penetration', value: 55, goal: 60, unit: '%', sparkline: [48, 52, 50, 57, 55] },
    { label: 'Customer Satisfaction', value: 4.3, goal: 4.5, unit: '/5', sparkline: [4.1, 4.2, 4.0, 4.4, 4.3] },
  ],
  outlet: [
    { label: 'Units Sold', value: 110, goal: 100, unit: '', sparkline: [90, 95, 100, 108, 110] },
    { label: 'Revenue', value: 98000, goal: 95000, unit: '$', sparkline: [82000, 88000, 92000, 96000, 98000] },
    { label: 'Attach Rate', value: 18, goal: 20, unit: '%', sparkline: [14, 16, 15, 19, 18] },
    { label: 'Avg Sale Price', value: 890, goal: 950, unit: '$', sparkline: [840, 860, 850, 880, 890] },
    { label: 'Financing Penetration', value: 42, goal: 50, unit: '%', sparkline: [35, 38, 36, 44, 42] },
    { label: 'Customer Satisfaction', value: 4.1, goal: 4.3, unit: '/5', sparkline: [3.9, 4.0, 3.9, 4.2, 4.1] },
  ],
  'shop-in-shop': [
    { label: 'Units Sold', value: 28, goal: 30, unit: '', sparkline: [22, 25, 24, 27, 28] },
    { label: 'Revenue', value: 52000, goal: 55000, unit: '$', sparkline: [44000, 48000, 46000, 51000, 52000] },
    { label: 'Attach Rate', value: 35, goal: 35, unit: '%', sparkline: [30, 33, 32, 36, 35] },
    { label: 'Avg Sale Price', value: 1860, goal: 1850, unit: '$', sparkline: [1780, 1820, 1800, 1850, 1860] },
    { label: 'Financing Penetration', value: 68, goal: 65, unit: '%', sparkline: [60, 64, 62, 67, 68] },
    { label: 'Customer Satisfaction', value: 4.7, goal: 4.5, unit: '/5', sparkline: [4.5, 4.6, 4.5, 4.8, 4.7] },
  ],
};

// Reports data
export const TEAM_EARNINGS = [
  { name: 'Sarah L.', role: 'Lead', earnings: 8420, color: '#10B981' },
  { name: 'Raj P.', role: 'Senior', earnings: 7890, color: '#06B6D4' },
  { name: 'Mike T.', role: 'Floor', earnings: 6540, color: '#8B5CF6' },
  { name: 'Casey M.', role: 'Floor', earnings: 5280, color: '#F59E0B' },
  { name: 'James W.', role: 'Floor', earnings: 4950, color: '#EF4444' },
  { name: 'Anna K.', role: 'Floor', earnings: 4720, color: '#64748B' },
];

export const COMP_AS_PCT_REVENUE = [
  { month: 'Jan', pct: 8.2 },
  { month: 'Feb', pct: 8.5 },
  { month: 'Mar', pct: 7.9 },
  { month: 'Apr', pct: 8.1 },
  { month: 'May', pct: 7.6 },
  { month: 'Jun', pct: 7.4 },
];

/* ── Comp Admin Plan Data ──────────────────────────────── */

export type PlanStatus = 'active' | 'draft' | 'pending' | 'archived';

export interface CompTier {
  name: string;
  minRevenue: number;
  maxRevenue: number;
  rate: number;
  color: string;
}

export interface SpiffRule {
  id: string;
  name: string;
  product: string;
  bonus: number;
  active: boolean;
}

export interface AcceleratorRule {
  metric: string;
  threshold: number;
  multiplier: number;
  label: string;
}

export interface CompPlan {
  id: string;
  name: string;
  format: string;
  status: PlanStatus;
  enrolled: number;
  monthlyBudget: number;
  effectiveFrom: string;
  effectiveTo: string;
  version: string;
  tiers: CompTier[];
  spiffs: SpiffRule[];
  accelerators: AcceleratorRule[];
}

export const ADMIN_PLANS: CompPlan[] = [
  {
    id: 'plan-flagship',
    name: 'Flagship Floor Sales Plan',
    format: 'Flagship',
    status: 'active',
    enrolled: 48,
    monthlyBudget: 142000,
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    version: '3.2',
    tiers: [
      { name: 'Bronze', minRevenue: 0, maxRevenue: 24999, rate: 0.04, color: '#CD7F32' },
      { name: 'Silver', minRevenue: 25000, maxRevenue: 49999, rate: 0.045, color: '#C0C0C0' },
      { name: 'Gold', minRevenue: 50000, maxRevenue: 74999, rate: 0.05, color: '#FFD700' },
      { name: 'Platinum', minRevenue: 75000, maxRevenue: Infinity, rate: 0.055, color: '#E5E4E2' },
    ],
    spiffs: [
      { id: 'sp-1', name: 'Adj Base SPIFF', product: 'ErgoMotion Bases', bonus: 25, active: true },
      { id: 'sp-2', name: 'Protector Attach', product: 'All Protectors', bonus: 10, active: true },
      { id: 'sp-3', name: 'Premium Pillow Push', product: 'Premium Pillows', bonus: 5, active: false },
    ],
    accelerators: [
      { metric: 'Attach Rate', threshold: 35, multiplier: 1.15, label: '15% bonus when attach rate > 35%' },
      { metric: 'Financing Penetration', threshold: 70, multiplier: 1.10, label: '10% bonus when financing > 70%' },
    ],
  },
  {
    id: 'plan-standard',
    name: 'Standard Store Plan',
    format: 'Standard',
    status: 'active',
    enrolled: 72,
    monthlyBudget: 198000,
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    version: '3.1',
    tiers: [
      { name: 'Bronze', minRevenue: 0, maxRevenue: 19999, rate: 0.035, color: '#CD7F32' },
      { name: 'Silver', minRevenue: 20000, maxRevenue: 39999, rate: 0.04, color: '#C0C0C0' },
      { name: 'Gold', minRevenue: 40000, maxRevenue: 59999, rate: 0.045, color: '#FFD700' },
      { name: 'Platinum', minRevenue: 60000, maxRevenue: Infinity, rate: 0.05, color: '#E5E4E2' },
    ],
    spiffs: [
      { id: 'sp-4', name: 'Adj Base SPIFF', product: 'ErgoMotion Bases', bonus: 20, active: true },
      { id: 'sp-5', name: 'Clearance Push', product: 'Clearance Items', bonus: 15, active: false },
    ],
    accelerators: [
      { metric: 'Attach Rate', threshold: 30, multiplier: 1.10, label: '10% bonus when attach rate > 30%' },
    ],
  },
  {
    id: 'plan-outlet',
    name: 'Outlet Volume Plan',
    format: 'Outlet',
    status: 'draft',
    enrolled: 34,
    monthlyBudget: 68000,
    effectiveFrom: '2026-04-01',
    effectiveTo: '2026-12-31',
    version: '2.0-draft',
    tiers: [
      { name: 'Base', minRevenue: 0, maxRevenue: 14999, rate: 0.03, color: '#94A3B8' },
      { name: 'Volume', minRevenue: 15000, maxRevenue: 29999, rate: 0.035, color: '#C0C0C0' },
      { name: 'Power', minRevenue: 30000, maxRevenue: Infinity, rate: 0.04, color: '#FFD700' },
    ],
    spiffs: [
      { id: 'sp-6', name: 'Unit Volume Bonus', product: 'All Items', bonus: 5, active: true },
    ],
    accelerators: [
      { metric: 'Units Sold', threshold: 25, multiplier: 1.20, label: '20% bonus when 25+ units/month' },
    ],
  },
  {
    id: 'plan-sis',
    name: 'Shop-in-Shop Partner Plan',
    format: 'Shop-in-Shop',
    status: 'pending',
    enrolled: 16,
    monthlyBudget: 42000,
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    version: '1.4-pending',
    tiers: [
      { name: 'Partner Base', minRevenue: 0, maxRevenue: 19999, rate: 0.045, color: '#CD7F32' },
      { name: 'Partner Plus', minRevenue: 20000, maxRevenue: 39999, rate: 0.05, color: '#C0C0C0' },
      { name: 'Partner Elite', minRevenue: 40000, maxRevenue: Infinity, rate: 0.055, color: '#FFD700' },
    ],
    spiffs: [
      { id: 'sp-7', name: 'Host Store Referral', product: 'Referral Sales', bonus: 15, active: true },
      { id: 'sp-8', name: 'Adj Base SPIFF', product: 'ErgoMotion Bases', bonus: 25, active: true },
    ],
    accelerators: [
      { metric: 'Attach Rate', threshold: 35, multiplier: 1.15, label: '15% bonus when attach rate > 35%' },
      { metric: 'Customer Satisfaction', threshold: 4.5, multiplier: 1.05, label: '5% bonus when CSAT > 4.5' },
    ],
  },
];

export interface PushLogEntry {
  id: string;
  timestamp: string;
  pushedBy: string;
  planId: string;
  changeType: string;
  summary: string;
}

export const PUSH_HISTORY: PushLogEntry[] = [
  { id: 'push-5', timestamp: '2026-03-11 2:30 PM', pushedBy: 'Dana K.', planId: 'plan-flagship', changeType: 'spiff_toggle', summary: 'Activated Protector Attach SPIFF ($10/unit)' },
  { id: 'push-4', timestamp: '2026-03-10 9:15 AM', pushedBy: 'Dana K.', planId: 'plan-standard', changeType: 'tier_rate', summary: 'Adjusted Silver tier rate from 3.8% to 4.0%' },
  { id: 'push-3', timestamp: '2026-03-08 4:00 PM', pushedBy: 'Mark R.', planId: 'plan-flagship', changeType: 'accelerator', summary: 'Added Financing Penetration accelerator (10% at 70%)' },
  { id: 'push-2', timestamp: '2026-03-05 11:00 AM', pushedBy: 'Dana K.', planId: 'plan-sis', changeType: 'full_plan', summary: 'Published Shop-in-Shop v1.4 for partner review' },
  { id: 'push-1', timestamp: '2026-03-01 8:00 AM', pushedBy: 'Mark R.', planId: 'plan-flagship', changeType: 'full_plan', summary: 'Activated FY26 Q1 Flagship plan v3.2' },
];
