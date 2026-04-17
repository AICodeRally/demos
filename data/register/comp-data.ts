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

/* ── Publish Fan-Out Targets ───────────────────────────────
   REGISTER Plan Designer pushes approved rules to three
   downstream systems simultaneously. Each target has its own
   ETA, protocol, and health state. */

export type PublishTargetId = 'varicent' | 'tablets' | 'register';

export interface PublishTarget {
  id: PublishTargetId;
  name: string;
  role: string;
  protocol: string;
  endpoint: string;
  avgLatencyMs: number;
  health: 'healthy' | 'degraded' | 'down';
  lastSync: string;
  recipients: number;
  recipientLabel: string;
}

export const PUBLISH_TARGETS: PublishTarget[] = [
  {
    id: 'varicent',
    name: 'Varicent',
    role: 'System of record — payroll & audit',
    protocol: 'REST + Signed Webhook',
    endpoint: 'https://api.varicent.com/v2/plans/{planId}/rules',
    avgLatencyMs: 1200,
    health: 'healthy',
    lastSync: '2026-03-11 2:30 PM',
    recipients: 1,
    recipientLabel: 'Production tenant',
  },
  {
    id: 'tablets',
    name: 'Floor Tablets',
    role: 'Live what-if for reps on the floor',
    protocol: 'WebSocket broadcast',
    endpoint: 'wss://edge.summitsleep.com/register/rules',
    avgLatencyMs: 340,
    health: 'healthy',
    lastSync: '2026-03-11 2:30 PM',
    recipients: 214,
    recipientLabel: 'Active tablets across 200 stores',
  },
  {
    id: 'register',
    name: 'REGISTER Consoles',
    role: 'Manager & exec dashboards',
    protocol: 'In-process cache invalidation',
    endpoint: 'register.summitsleep.com',
    avgLatencyMs: 120,
    health: 'healthy',
    lastSync: '2026-03-11 2:30 PM',
    recipients: 38,
    recipientLabel: 'Manager/district/exec users',
  },
];

/* ── Varicent Sync Status ──────────────────────────────────
   Shows whether REGISTER draft is in sync with Varicent source of truth. */

export interface SyncStatus {
  lastPullFromVaricent: string;
  lastPushToVaricent: string;
  varicentRuleCount: number;
  registerRuleCount: number;
  inSync: boolean;
  driftReason: string | null;
}

export const VARICENT_SYNC: SyncStatus = {
  lastPullFromVaricent: '2026-03-11 8:00 AM',
  lastPushToVaricent: '2026-03-11 2:30 PM',
  varicentRuleCount: 24,
  registerRuleCount: 27,
  inSync: false,
  driftReason: '3 draft rules pending approval in REGISTER',
};

/* ── Draft vs Live Plan Diff ───────────────────────────────
   Summary shown on Plan Designer when a draft diverges from
   the currently-published ruleset. */

export interface RuleDelta {
  id: string;
  kind: 'added' | 'modified' | 'removed';
  component: string;
  group: 'commission' | 'spiff' | 'bonus' | 'accelerator' | 'tier';
  before: string | null;
  after: string | null;
  authoredBy: string;
  authoredAt: string;
}

export const DRAFT_DIFF: RuleDelta[] = [
  {
    id: 'd-1', kind: 'modified', component: 'Silver Tier Rate', group: 'tier',
    before: '4.5%', after: '4.75%', authoredBy: 'Dana K.', authoredAt: '2026-03-11 10:14 AM',
  },
  {
    id: 'd-2', kind: 'added', component: 'Memorial Day Weekend SPIFF', group: 'spiff',
    before: null, after: '$10/unit + 2x team pool', authoredBy: 'Mark R.', authoredAt: '2026-03-10 3:40 PM',
  },
  {
    id: 'd-3', kind: 'added', component: 'Financing Attach Accelerator', group: 'accelerator',
    before: null, after: '+10% when financing penetration > 65%', authoredBy: 'Dana K.', authoredAt: '2026-03-10 1:05 PM',
  },
  {
    id: 'd-4', kind: 'modified', component: 'Protector Attach SPIFF', group: 'spiff',
    before: '$8/unit', after: '$10/unit', authoredBy: 'Dana K.', authoredAt: '2026-03-09 4:22 PM',
  },
  {
    id: 'd-5', kind: 'removed', component: 'Q1 Clearance Double-Comm', group: 'bonus',
    before: '2x commission on outlet inventory', after: null, authoredBy: 'Mark R.', authoredAt: '2026-03-09 11:00 AM',
  },
];

/* ── Approval Trail ────────────────────────────────────────
   Each draft rule requires stakeholder sign-off before publish. */

export type ApprovalState = 'pending' | 'approved' | 'rejected';

export interface ApprovalEntry {
  id: string;
  ruleId: string;
  approver: string;
  role: string;
  state: ApprovalState;
  note: string | null;
  decidedAt: string | null;
}

export const APPROVAL_TRAIL: ApprovalEntry[] = [
  { id: 'a-1', ruleId: 'd-1', approver: 'Linda Park', role: 'VP Sales',     state: 'approved', note: 'Budget impact within envelope (+$18K MTD).', decidedAt: '2026-03-11 11:02 AM' },
  { id: 'a-2', ruleId: 'd-1', approver: 'Raj Menon',  role: 'CFO',          state: 'approved', note: 'Finance OK — comp ratio stays under 8.5%.', decidedAt: '2026-03-11 12:18 PM' },
  { id: 'a-3', ruleId: 'd-2', approver: 'Linda Park', role: 'VP Sales',     state: 'approved', note: 'Aligns with Memorial Day campaign.', decidedAt: '2026-03-10 4:05 PM' },
  { id: 'a-4', ruleId: 'd-2', approver: 'Raj Menon',  role: 'CFO',          state: 'pending',  note: null, decidedAt: null },
  { id: 'a-5', ruleId: 'd-3', approver: 'Linda Park', role: 'VP Sales',     state: 'pending',  note: null, decidedAt: null },
  { id: 'a-6', ruleId: 'd-3', approver: 'Raj Menon',  role: 'CFO',          state: 'pending',  note: null, decidedAt: null },
  { id: 'a-7', ruleId: 'd-4', approver: 'Linda Park', role: 'VP Sales',     state: 'approved', note: 'Pilot showed +3% attach in Flagship test stores.', decidedAt: '2026-03-10 9:40 AM' },
  { id: 'a-8', ruleId: 'd-4', approver: 'Raj Menon',  role: 'CFO',          state: 'approved', note: null, decidedAt: '2026-03-10 10:15 AM' },
  { id: 'a-9', ruleId: 'd-5', approver: 'Linda Park', role: 'VP Sales',     state: 'approved', note: 'Q1 promotion ended — removing per plan.', decidedAt: '2026-03-09 12:00 PM' },
];

/* ── Rep → Manager → District → Region → Exec Hierarchy ──── */

export interface OrgNode {
  id: string;
  name: string;
  role: 'rep' | 'manager' | 'district' | 'region' | 'exec';
  store?: string;
  parentId: string | null;
  revenueMTD: number;
  quotaMTD: number;
  commissionMTD: number;
  headcount: number;
}

export const ORG_HIERARCHY: OrgNode[] = [
  // Exec
  { id: 'exec-1', name: 'Linda Park', role: 'exec', parentId: null, revenueMTD: 8_420_000, quotaMTD: 8_750_000, commissionMTD: 682_000, headcount: 850 },
  // Regions
  { id: 'region-west',    name: 'West Region',    role: 'region', parentId: 'exec-1', revenueMTD: 2_940_000, quotaMTD: 3_050_000, commissionMTD: 238_000, headcount: 284 },
  { id: 'region-central', name: 'Central Region', role: 'region', parentId: 'exec-1', revenueMTD: 2_510_000, quotaMTD: 2_620_000, commissionMTD: 203_000, headcount: 248 },
  { id: 'region-east',    name: 'East Region',    role: 'region', parentId: 'exec-1', revenueMTD: 2_970_000, quotaMTD: 3_080_000, commissionMTD: 241_000, headcount: 318 },
  // Districts (West)
  { id: 'district-pac',   name: 'Pacific District', role: 'district', parentId: 'region-west',    revenueMTD: 1_480_000, quotaMTD: 1_520_000, commissionMTD: 120_000, headcount: 142 },
  { id: 'district-mw',    name: 'Mountain West',    role: 'district', parentId: 'region-west',    revenueMTD: 1_460_000, quotaMTD: 1_530_000, commissionMTD: 118_000, headcount: 142 },
  { id: 'district-tx',    name: 'Texas District',   role: 'district', parentId: 'region-central', revenueMTD: 1_320_000, quotaMTD: 1_360_000, commissionMTD: 107_000, headcount: 128 },
  { id: 'district-mw-c',  name: 'Midwest Central',  role: 'district', parentId: 'region-central', revenueMTD: 1_190_000, quotaMTD: 1_260_000, commissionMTD:  96_000, headcount: 120 },
  { id: 'district-se',    name: 'Southeast',        role: 'district', parentId: 'region-east',    revenueMTD: 1_540_000, quotaMTD: 1_580_000, commissionMTD: 125_000, headcount: 162 },
  { id: 'district-ne',    name: 'Northeast',        role: 'district', parentId: 'region-east',    revenueMTD: 1_430_000, quotaMTD: 1_500_000, commissionMTD: 116_000, headcount: 156 },
  // Managers (Pacific District sample)
  { id: 'mgr-galleria',   name: 'Alex Rivera',     role: 'manager', store: 'Flagship #12 — Galleria',       parentId: 'district-pac', revenueMTD: 268_000, quotaMTD: 280_000, commissionMTD: 21_500, headcount: 18 },
  { id: 'mgr-soma',       name: 'Priya Shah',      role: 'manager', store: 'Flagship #08 — SoMa',           parentId: 'district-pac', revenueMTD: 252_000, quotaMTD: 265_000, commissionMTD: 20_400, headcount: 16 },
  { id: 'mgr-bayshore',   name: 'Jordan Cole',     role: 'manager', store: 'Standard #47 — Bay Shore',      parentId: 'district-pac', revenueMTD: 148_000, quotaMTD: 160_000, commissionMTD: 11_800, headcount: 9 },
  { id: 'mgr-outlet-liv', name: 'Devon Reyes',     role: 'manager', store: 'Outlet #22 — Livermore',        parentId: 'district-pac', revenueMTD:  98_000, quotaMTD:  95_000, commissionMTD:  7_500, headcount: 8 },
  // Reps (Galleria — Alex Rivera's team)
  { id: 'rep-sarah',   name: 'Sarah Lin',     role: 'rep', store: 'Galleria', parentId: 'mgr-galleria', revenueMTD: 42_100, quotaMTD: 38_000, commissionMTD: 1_900, headcount: 1 },
  { id: 'rep-raj',     name: 'Raj Patel',     role: 'rep', store: 'Galleria', parentId: 'mgr-galleria', revenueMTD: 39_450, quotaMTD: 38_000, commissionMTD: 1_775, headcount: 1 },
  { id: 'rep-mike',    name: 'Mike Tran',     role: 'rep', store: 'Galleria', parentId: 'mgr-galleria', revenueMTD: 32_700, quotaMTD: 38_000, commissionMTD: 1_308, headcount: 1 },
  { id: 'rep-casey',   name: 'Casey Miller',  role: 'rep', store: 'Galleria', parentId: 'mgr-galleria', revenueMTD: 26_400, quotaMTD: 38_000, commissionMTD: 1_188, headcount: 1 },
  { id: 'rep-james',   name: 'James Wu',      role: 'rep', store: 'Galleria', parentId: 'mgr-galleria', revenueMTD: 24_750, quotaMTD: 38_000, commissionMTD:   990, headcount: 1 },
  { id: 'rep-anna',    name: 'Anna Kim',      role: 'rep', store: 'Galleria', parentId: 'mgr-galleria', revenueMTD: 23_600, quotaMTD: 38_000, commissionMTD:   944, headcount: 1 },
];

/* ── Rep Deal Stream — used by statement drill-down ──────── */

export interface RepDeal {
  id: string;
  dateISO: string;
  time: string;
  customer: string;
  items: string[];
  basis: number;
  tier: string;
  tierRate: number;
  baseCommission: number;
  spiffBonus: number;
  bundleBonus: number;
  attachAccelerator: number;
  totalCommission: number;
  protectorAttached: boolean;
  financingUsed: boolean;
}

export const REP_DEALS_CASEY: RepDeal[] = [
  { id: 'D-5041', dateISO: '2026-03-11', time: '2:47 PM', customer: 'Kim Family', items: ['CloudRest Hybrid Queen', 'Allergen Protector'], basis: 2648, tier: 'Silver', tierRate: 0.045, baseCommission: 119.16, spiffBonus: 10, bundleBonus: 0, attachAccelerator: 0, totalCommission: 129.16, protectorAttached: true, financingUsed: false },
  { id: 'D-5042', dateISO: '2026-03-11', time: '1:22 PM', customer: 'Reynolds', items: ['ErgoMotion Adj Base Pro'], basis: 1999, tier: 'Silver', tierRate: 0.045, baseCommission: 89.96, spiffBonus: 25, bundleBonus: 0, attachAccelerator: 0, totalCommission: 114.96, protectorAttached: false, financingUsed: true },
  { id: 'D-5043', dateISO: '2026-03-11', time: '12:05 PM', customer: 'Okafor', items: ['Harmony Memory Foam King', 'Cotton Sheets', 'Premium Pillows'], basis: 3097, tier: 'Silver', tierRate: 0.045, baseCommission: 139.37, spiffBonus: 0, bundleBonus: 50, attachAccelerator: 0, totalCommission: 189.37, protectorAttached: false, financingUsed: true },
  { id: 'D-5044', dateISO: '2026-03-10', time: '11:38 AM', customer: 'Patel',    items: ['DreamLift Firm Queen'], basis: 1499, tier: 'Silver', tierRate: 0.045, baseCommission: 67.46, spiffBonus: 0, bundleBonus: 0, attachAccelerator: 0, totalCommission: 67.46, protectorAttached: false, financingUsed: false },
  { id: 'D-5045', dateISO: '2026-03-10', time: '10:15 AM', customer: 'Nguyen',   items: ['Essential Comfort Queen', 'Standard Protector'], basis: 1148, tier: 'Silver', tierRate: 0.045, baseCommission: 51.66, spiffBonus: 10, bundleBonus: 0, attachAccelerator: 0, totalCommission: 61.66, protectorAttached: true, financingUsed: false },
  { id: 'D-5046', dateISO: '2026-03-09', time: '9:52 AM',  customer: 'Harper',   items: ['Sleep System Bundle — King Hybrid', 'Adjustable Base'], basis: 4998, tier: 'Silver', tierRate: 0.045, baseCommission: 224.91, spiffBonus: 25, bundleBonus: 75, attachAccelerator: 0, totalCommission: 324.91, protectorAttached: false, financingUsed: true },
  { id: 'D-5047', dateISO: '2026-03-09', time: '3:15 PM',  customer: 'Choi',     items: ['CloudRest Hybrid King', 'Adj Base', 'Protector'], basis: 5147, tier: 'Silver', tierRate: 0.045, baseCommission: 231.62, spiffBonus: 35, bundleBonus: 50, attachAccelerator: 17.50, totalCommission: 334.12, protectorAttached: true, financingUsed: true },
  { id: 'D-5048', dateISO: '2026-03-08', time: '1:40 PM',  customer: 'Torres',   items: ['Platform Bed Frame', 'Sheet Set'], basis: 498, tier: 'Bronze', tierRate: 0.04, baseCommission: 19.92, spiffBonus: 0, bundleBonus: 0, attachAccelerator: 0, totalCommission: 19.92, protectorAttached: false, financingUsed: false },
  { id: 'D-5049', dateISO: '2026-03-08', time: '11:20 AM', customer: 'Williams', items: ['Harmony Memory Foam Queen'], basis: 2299, tier: 'Silver', tierRate: 0.045, baseCommission: 103.46, spiffBonus: 0, bundleBonus: 0, attachAccelerator: 0, totalCommission: 103.46, protectorAttached: false, financingUsed: false },
];
