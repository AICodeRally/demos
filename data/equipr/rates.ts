// ── Rate Categories ─────────────────────────────────────────────────────────

export interface RateCategory {
  category: string;
  targetMargin: number;
  actualMargin: number;
  gap: number;
  trend: 'up' | 'down' | 'flat';
  floorDaily: number;
  avgDaily: number;
  totalRevenue: number;
}

export const RATE_CATEGORIES: RateCategory[] = [
  {
    category: 'Heavy Equipment',
    targetMargin: 42,
    actualMargin: 38,
    gap: -4,
    trend: 'down',
    floorDaily: 450,
    avgDaily: 712,
    totalRevenue: 184200,
  },
  {
    category: 'Aerial / Lifts',
    targetMargin: 45,
    actualMargin: 43,
    gap: -2,
    trend: 'flat',
    floorDaily: 175,
    avgDaily: 386,
    totalRevenue: 87400,
  },
  {
    category: 'Compaction & Concrete',
    targetMargin: 48,
    actualMargin: 44,
    gap: -4,
    trend: 'down',
    floorDaily: 85,
    avgDaily: 156,
    totalRevenue: 42100,
  },
  {
    category: 'Power & HVAC',
    targetMargin: 50,
    actualMargin: 47,
    gap: -3,
    trend: 'up',
    floorDaily: 75,
    avgDaily: 203,
    totalRevenue: 58300,
  },
  {
    category: 'Tools & Small',
    targetMargin: 55,
    actualMargin: 49,
    gap: -6,
    trend: 'down',
    floorDaily: 35,
    avgDaily: 92,
    totalRevenue: 31800,
  },
];

// ── Leakage Summary ─────────────────────────────────────────────────────────

export interface LeakageSummary {
  total: number;
  unauthorizedDiscounts: { amount: number; orders: number };
  missedFees: { amount: number; jobs: number };
  belowFloor: { amount: number; transactions: number };
  momChange: number;
}

export const LEAKAGE_SUMMARY: LeakageSummary = {
  total: 47200,
  unauthorizedDiscounts: { amount: 22100, orders: 34 },
  missedFees: { amount: 14300, jobs: 67 },
  belowFloor: { amount: 10800, transactions: 28 },
  momChange: 12,
};

// ── Leakage Detail Items ────────────────────────────────────────────────────

export type LeakageBadge = 'REPEAT' | 'PATTERN' | 'NEW' | 'WATCH';
export type LeakageType = 'discount' | 'missed_fee' | 'below_floor';

export interface LeakageItem {
  id: string;
  accountName: string;
  issue: string;
  type: LeakageType;
  rep: string;
  location: string;
  amountLost: number;
  occurrences: number;
  rateCharged?: number;
  rateFloor?: number;
  badge: LeakageBadge;
}

export const LEAKAGE_ITEMS: LeakageItem[] = [
  {
    id: 'LK-001',
    accountName: 'Gulf Coast Construction',
    issue: '20% discount on D6 Dozer — no manager approval',
    type: 'discount',
    rep: 'Mike Torres',
    location: 'Orlando',
    amountLost: 3840,
    occurrences: 4,
    rateCharged: 960,
    rateFloor: 1200,
    badge: 'REPEAT',
  },
  {
    id: 'LK-002',
    accountName: 'Gulf Coast Construction',
    issue: '15% discount on excavators — "volume deal" not in CRM',
    type: 'discount',
    rep: 'Mike Torres',
    location: 'Tampa',
    amountLost: 4200,
    occurrences: 6,
    rateCharged: 744,
    rateFloor: 875,
    badge: 'REPEAT',
  },
  {
    id: 'LK-003',
    accountName: 'Coastal Builders Inc.',
    issue: 'Fuel surcharge waived on 3 deliveries',
    type: 'missed_fee',
    rep: 'Sarah Chen',
    location: 'Orlando',
    amountLost: 2100,
    occurrences: 3,
    badge: 'PATTERN',
  },
  {
    id: 'LK-004',
    accountName: 'Coastal Builders Inc.',
    issue: 'Late return fee waived — "good customer" override',
    type: 'missed_fee',
    rep: 'Sarah Chen',
    location: 'Orlando',
    amountLost: 1850,
    occurrences: 5,
    badge: 'PATTERN',
  },
  {
    id: 'LK-005',
    accountName: 'Jake Williams',
    issue: 'Backhoe rented at $480/day vs $600 floor',
    type: 'below_floor',
    rep: 'Mike Torres',
    location: 'Tampa',
    amountLost: 2400,
    occurrences: 4,
    rateCharged: 480,
    rateFloor: 600,
    badge: 'REPEAT',
  },
  {
    id: 'LK-006',
    accountName: 'Jake Williams',
    issue: 'Generator at $55/day vs $75 floor — "buddy rate"',
    type: 'below_floor',
    rep: 'Mike Torres',
    location: 'Orlando',
    amountLost: 1400,
    occurrences: 7,
    rateCharged: 55,
    rateFloor: 75,
    badge: 'REPEAT',
  },
  {
    id: 'LK-007',
    accountName: 'Premier Landscaping',
    issue: 'Damage waiver fee skipped on 8 rentals',
    type: 'missed_fee',
    rep: 'Sarah Chen',
    location: 'Orlando',
    amountLost: 3200,
    occurrences: 8,
    badge: 'PATTERN',
  },
  {
    id: 'LK-008',
    accountName: 'Metro Mechanical Services',
    issue: '10% discount — no promo code or approval',
    type: 'discount',
    rep: 'Mike Torres',
    location: 'Tampa',
    amountLost: 1980,
    occurrences: 3,
    rateCharged: 293,
    rateFloor: 325,
    badge: 'NEW',
  },
  {
    id: 'LK-009',
    accountName: 'Suncoast Events LLC',
    issue: 'Weekend surcharge not applied on 12 jobs',
    type: 'missed_fee',
    rep: 'Sarah Chen',
    location: 'Tampa',
    amountLost: 4800,
    occurrences: 12,
    badge: 'PATTERN',
  },
  {
    id: 'LK-010',
    accountName: 'Chris Delgado',
    issue: 'Scissor lift at $180/day vs $225 floor',
    type: 'below_floor',
    rep: 'Jake Martinez',
    location: 'Tampa',
    amountLost: 1350,
    occurrences: 3,
    rateCharged: 180,
    rateFloor: 225,
    badge: 'WATCH',
  },
  {
    id: 'LK-011',
    accountName: 'Derek Hawkins',
    issue: 'Environmental fee waived — standard charge $45/rental',
    type: 'missed_fee',
    rep: 'Sarah Chen',
    location: 'Jacksonville',
    amountLost: 2350,
    occurrences: 14,
    badge: 'PATTERN',
  },
  {
    id: 'LK-012',
    accountName: 'Gulf Coast Construction',
    issue: 'Plate compactor at $60/day vs $85 floor',
    type: 'below_floor',
    rep: 'Mike Torres',
    location: 'Orlando',
    amountLost: 1750,
    occurrences: 7,
    rateCharged: 60,
    rateFloor: 85,
    badge: 'REPEAT',
  },
];

// ── Rep Leakage Totals ──────────────────────────────────────────────────────

export interface RepLeakage {
  rep: string;
  amount: number;
  incidents: number;
  primaryIssue: string;
}

export const REP_LEAKAGE: RepLeakage[] = [
  { rep: 'Mike Torres', amount: 15570, incidents: 31, primaryIssue: 'Unauthorized discounts & below-floor pricing' },
  { rep: 'Sarah Chen', amount: 14300, incidents: 42, primaryIssue: 'Waived fees (fuel, damage, weekend, environmental)' },
  { rep: 'Jake Martinez', amount: 6200, incidents: 12, primaryIssue: 'Below-floor pricing on aerial equipment' },
  { rep: 'Amy Duval', amount: 3100, incidents: 8, primaryIssue: 'Missed delivery surcharges' },
  { rep: 'Tony Briggs', amount: 2400, incidents: 5, primaryIssue: 'Unauthorized multi-unit discounts' },
];

// ── Leakage by Category ─────────────────────────────────────────────────────

export interface CategoryLeakage {
  category: string;
  amount: number;
  pctOfTotal: number;
}

export const LEAKAGE_BY_CATEGORY: CategoryLeakage[] = [
  { category: 'Heavy Equipment', amount: 18200, pctOfTotal: 38.6 },
  { category: 'Aerial / Lifts', amount: 9800, pctOfTotal: 20.8 },
  { category: 'Power & HVAC', amount: 7400, pctOfTotal: 15.7 },
  { category: 'Tools & Small', amount: 6900, pctOfTotal: 14.6 },
  { category: 'Compaction & Concrete', amount: 4900, pctOfTotal: 10.4 },
];

// ── Leakage Trend (6 months) ────────────────────────────────────────────────

export interface LeakageTrendMonth {
  month: string;
  total: number;
  discounts: number;
  fees: number;
  belowFloor: number;
}

export const LEAKAGE_TREND: LeakageTrendMonth[] = [
  { month: 'Sep', total: 28400, discounts: 13200, fees: 9100, belowFloor: 6100 },
  { month: 'Oct', total: 31200, discounts: 14800, fees: 9800, belowFloor: 6600 },
  { month: 'Nov', total: 34900, discounts: 16500, fees: 11200, belowFloor: 7200 },
  { month: 'Dec', total: 38100, discounts: 17900, fees: 12400, belowFloor: 7800 },
  { month: 'Jan', total: 42100, discounts: 19700, fees: 13200, belowFloor: 9200 },
  { month: 'Feb', total: 47200, discounts: 22100, fees: 14300, belowFloor: 10800 },
];

// ── Top Offending Accounts ──────────────────────────────────────────────────

export interface OffendingAccount {
  accountName: string;
  amount: number;
  incidents: number;
  primaryType: LeakageType;
}

export const TOP_OFFENDING_ACCOUNTS: OffendingAccount[] = [
  { accountName: 'Gulf Coast Construction', amount: 9790, incidents: 17, primaryType: 'discount' },
  { accountName: 'Coastal Builders Inc.', amount: 7150, incidents: 16, primaryType: 'missed_fee' },
  { accountName: 'Suncoast Events LLC', amount: 4800, incidents: 12, primaryType: 'missed_fee' },
  { accountName: 'Jake Williams', amount: 5150, incidents: 14, primaryType: 'below_floor' },
  { accountName: 'Derek Hawkins', amount: 2350, incidents: 14, primaryType: 'missed_fee' },
];
