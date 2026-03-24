// Ridgeline Supply Co. — Vendor Rebate Data
// Manufacturer rebate programs, attribution, and performance tracking

export interface VendorRebate {
  id: string;
  vendor: string;
  programName: string;
  category: string;
  rebateType: 'volume' | 'growth' | 'mix' | 'loyalty' | 'co-op';
  tierStructure: { threshold: number; rate: number; label: string }[];
  annualTarget: number;
  ytdPurchases: number;
  currentTier: string;
  earnedRebate: number;
  projectedRebate: number;
  effectiveStart: string;
  effectiveEnd: string;
  status: 'active' | 'pending_renewal' | 'expired';
}

export interface RebatePerformance {
  vendorId: string;
  period: string;
  purchases: number;
  rebateEarned: number;
  rebateRate: number;
  nextTierGap: number;
  nextTierRate: number;
  daysRemaining: number;
}

export const VENDOR_REBATES: VendorRebate[] = [
  {
    id: 'reb-001',
    vendor: 'GAF',
    programName: 'GAF Master Elite Volume Rebate',
    category: 'Roofing Shingles',
    rebateType: 'volume',
    tierStructure: [
      { threshold: 0, rate: 0.02, label: 'Base' },
      { threshold: 5000000, rate: 0.035, label: 'Silver' },
      { threshold: 15000000, rate: 0.05, label: 'Gold' },
      { threshold: 30000000, rate: 0.065, label: 'Platinum' },
    ],
    annualTarget: 30000000,
    ytdPurchases: 8200000,
    currentTier: 'Silver',
    earnedRebate: 287000,
    projectedRebate: 1625000,
    effectiveStart: '2026-01-01',
    effectiveEnd: '2026-12-31',
    status: 'active',
  },
  {
    id: 'reb-002',
    vendor: 'Owens Corning',
    programName: 'OC Preferred Partner Growth Incentive',
    category: 'Insulation & Composites',
    rebateType: 'growth',
    tierStructure: [
      { threshold: 0, rate: 0.015, label: 'Participating' },
      { threshold: 3000000, rate: 0.03, label: 'Growth' },
      { threshold: 8000000, rate: 0.045, label: 'Strategic' },
    ],
    annualTarget: 8000000,
    ytdPurchases: 2400000,
    currentTier: 'Participating',
    earnedRebate: 36000,
    projectedRebate: 324000,
    effectiveStart: '2026-01-01',
    effectiveEnd: '2026-12-31',
    status: 'active',
  },
  {
    id: 'reb-003',
    vendor: 'CertainTeed',
    programName: 'CertainTeed SELECT Loyalty Rebate',
    category: 'Siding & Trim',
    rebateType: 'loyalty',
    tierStructure: [
      { threshold: 0, rate: 0.02, label: 'Member' },
      { threshold: 2000000, rate: 0.035, label: 'Select' },
      { threshold: 5000000, rate: 0.05, label: 'Premier' },
    ],
    annualTarget: 5000000,
    ytdPurchases: 1350000,
    currentTier: 'Member',
    earnedRebate: 27000,
    projectedRebate: 175000,
    effectiveStart: '2026-01-01',
    effectiveEnd: '2026-12-31',
    status: 'active',
  },
  {
    id: 'reb-004',
    vendor: 'TAMKO',
    programName: 'TAMKO Premium Mix Incentive',
    category: 'Premium Shingles',
    rebateType: 'mix',
    tierStructure: [
      { threshold: 0, rate: 0.02, label: 'Standard' },
      { threshold: 40, rate: 0.04, label: 'Preferred Mix' },
      { threshold: 60, rate: 0.055, label: 'Premium Mix' },
    ],
    annualTarget: 4000000,
    ytdPurchases: 980000,
    currentTier: 'Standard',
    earnedRebate: 19600,
    projectedRebate: 160000,
    effectiveStart: '2026-01-01',
    effectiveEnd: '2026-12-31',
    status: 'active',
  },
  {
    id: 'reb-005',
    vendor: 'Atlas Roofing',
    programName: 'Atlas Co-Op Marketing Fund',
    category: 'Commercial Roofing',
    rebateType: 'co-op',
    tierStructure: [
      { threshold: 0, rate: 0.015, label: 'Participant' },
      { threshold: 1500000, rate: 0.025, label: 'Partner' },
    ],
    annualTarget: 3000000,
    ytdPurchases: 720000,
    currentTier: 'Participant',
    earnedRebate: 10800,
    projectedRebate: 60000,
    effectiveStart: '2025-07-01',
    effectiveEnd: '2026-06-30',
    status: 'pending_renewal',
  },
];

export const REBATE_PERFORMANCE: RebatePerformance[] = [
  { vendorId: 'reb-001', period: 'Q1-2026', purchases: 8200000, rebateEarned: 287000, rebateRate: 3.5, nextTierGap: 6800000, nextTierRate: 5.0, daysRemaining: 282 },
  { vendorId: 'reb-002', period: 'Q1-2026', purchases: 2400000, rebateEarned: 36000, rebateRate: 1.5, nextTierGap: 600000, nextTierRate: 3.0, daysRemaining: 282 },
  { vendorId: 'reb-003', period: 'Q1-2026', purchases: 1350000, rebateEarned: 27000, rebateRate: 2.0, nextTierGap: 650000, nextTierRate: 3.5, daysRemaining: 282 },
  { vendorId: 'reb-004', period: 'Q1-2026', purchases: 980000, rebateEarned: 19600, rebateRate: 2.0, nextTierGap: 1020000, nextTierRate: 4.0, daysRemaining: 282 },
  { vendorId: 'reb-005', period: 'Q1-2026', purchases: 720000, rebateEarned: 10800, rebateRate: 1.5, nextTierGap: 780000, nextTierRate: 2.5, daysRemaining: 99 },
];

export function getRebatesByVendor(vendor: string): VendorRebate[] {
  return VENDOR_REBATES.filter((r) => r.vendor === vendor);
}

export function getRebatePerformance(vendorId: string): RebatePerformance | undefined {
  return REBATE_PERFORMANCE.find((r) => r.vendorId === vendorId);
}
