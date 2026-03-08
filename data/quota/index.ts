// Mock data for QUOTA (Sales Quota Management) demo

export const REPS = [
  { id: 'r1', name: 'Sarah Chen', territory: 'West', quota: 1_200_000, actual: 1_080_000, team: 'Enterprise' },
  { id: 'r2', name: 'Marcus Johnson', territory: 'East', quota: 950_000, actual: 1_020_000, team: 'Enterprise' },
  { id: 'r3', name: 'Priya Patel', territory: 'Central', quota: 800_000, actual: 720_000, team: 'Mid-Market' },
  { id: 'r4', name: 'James Wilson', territory: 'Southeast', quota: 750_000, actual: 810_000, team: 'Mid-Market' },
  { id: 'r5', name: 'Emily Rodriguez', territory: 'Northeast', quota: 1_100_000, actual: 990_000, team: 'Enterprise' },
  { id: 'r6', name: 'David Kim', territory: 'Pacific NW', quota: 680_000, actual: 748_000, team: 'SMB' },
  { id: 'r7', name: 'Rachel Torres', territory: 'Southwest', quota: 720_000, actual: 612_000, team: 'SMB' },
  { id: 'r8', name: 'Alex Nguyen', territory: 'Mountain', quota: 850_000, actual: 935_000, team: 'Mid-Market' },
];

export const QUARTERLY_REVENUE = [
  { quarter: 'Q1 2025', target: 6_200_000, actual: 5_890_000 },
  { quarter: 'Q2 2025', target: 6_500_000, actual: 6_750_000 },
  { quarter: 'Q3 2025', target: 7_000_000, actual: 6_820_000 },
  { quarter: 'Q4 2025', target: 7_500_000, actual: 7_915_000 },
  { quarter: 'Q1 2026', target: 7_800_000, actual: 6_915_000 },
];

export const TERRITORIES = [
  { name: 'West', accounts: 142, revenue: 2_480_000, quota: 2_800_000, reps: 3 },
  { name: 'East', accounts: 168, revenue: 2_910_000, quota: 2_600_000, reps: 3 },
  { name: 'Central', accounts: 95, revenue: 1_440_000, quota: 1_600_000, reps: 2 },
  { name: 'Southeast', accounts: 112, revenue: 1_620_000, quota: 1_500_000, reps: 2 },
  { name: 'Northeast', accounts: 134, revenue: 1_980_000, quota: 2_200_000, reps: 2 },
  { name: 'Pacific NW', accounts: 78, revenue: 1_496_000, quota: 1_360_000, reps: 2 },
  { name: 'Southwest', accounts: 88, revenue: 1_224_000, quota: 1_440_000, reps: 2 },
  { name: 'Mountain', accounts: 64, revenue: 1_870_000, quota: 1_700_000, reps: 2 },
];

export const PIPELINE = [
  { stage: 'Prospecting', deals: 45, value: 3_200_000, avgDays: 12 },
  { stage: 'Qualification', deals: 32, value: 2_800_000, avgDays: 18 },
  { stage: 'Proposal', deals: 18, value: 2_100_000, avgDays: 14 },
  { stage: 'Negotiation', deals: 12, value: 1_650_000, avgDays: 21 },
  { stage: 'Closed Won', deals: 8, value: 1_200_000, avgDays: 0 },
];

export const COMMISSION_TIERS = [
  { tier: 'Base', range: '0-80%', rate: 0.06, label: '6%' },
  { tier: 'Standard', range: '80-100%', rate: 0.08, label: '8%' },
  { tier: 'Accelerator', range: '100-120%', rate: 0.12, label: '12%' },
  { tier: 'Super Accelerator', range: '120%+', rate: 0.18, label: '18%' },
];

export const ALERTS = [
  { id: 'a1', type: 'risk' as const, title: 'Q1 quota at risk — Central region', desc: 'Priya Patel tracking 10% below pace', time: '2h ago' },
  { id: 'a2', type: 'success' as const, title: 'Marcus Johnson hit 107% attainment', desc: 'First rep to exceed Q1 quota', time: '4h ago' },
  { id: 'a3', type: 'warning' as const, title: 'Pipeline coverage dropped below 3x', desc: 'Southwest territory needs prospecting push', time: '1d ago' },
  { id: 'a4', type: 'risk' as const, title: '3 deals stuck in Negotiation > 30 days', desc: 'Combined value: $890K', time: '1d ago' },
  { id: 'a5', type: 'info' as const, title: 'FY2026 quota plans ready for review', desc: '8 plans pending manager approval', time: '2d ago' },
];

export const MONTHLY_TREND = [
  { month: 'Jul', revenue: 2_100_000 },
  { month: 'Aug', revenue: 2_250_000 },
  { month: 'Sep', revenue: 2_180_000 },
  { month: 'Oct', revenue: 2_400_000 },
  { month: 'Nov', revenue: 2_350_000 },
  { month: 'Dec', revenue: 2_815_000 },
  { month: 'Jan', revenue: 2_150_000 },
  { month: 'Feb', revenue: 2_480_000 },
];
