// ── Pricing Recommendation ──────────────────────────────────────────────────

export type DemandSignal = 'surge' | 'high' | 'normal' | 'low';
export type AssetCategory = 'heavy' | 'aerial' | 'compaction' | 'power' | 'tools';

export interface PricingRecommendation {
  id: string;
  assetCategory: AssetCategory;
  assetName: string;
  currentRate: number;
  recommendedRate: number;
  changePercent: number;
  reason: string;
  confidence: number;
  demandSignal: DemandSignal;
  projectedRevenueImpact: number;
}

export const PRICING_RECOMMENDATIONS: PricingRecommendation[] = [
  {
    id: 'PR-001',
    assetCategory: 'heavy',
    assetName: 'CAT 320 Excavator',
    currentRate: 850,
    recommendedRate: 1020,
    changePercent: 20.0,
    reason: 'Construction permits up 23% in Orlando metro — excavator availability at 8% across 4 competitor yards.',
    confidence: 0.94,
    demandSignal: 'surge',
    projectedRevenueImpact: 5100,
  },
  {
    id: 'PR-002',
    assetCategory: 'power',
    assetName: '200kW Generator',
    currentRate: 275,
    recommendedRate: 345,
    changePercent: 25.5,
    reason: 'Heat wave forecast next 10 days — generator demand spike expected. Last summer event saw 3x bookings.',
    confidence: 0.91,
    demandSignal: 'surge',
    projectedRevenueImpact: 4200,
  },
  {
    id: 'PR-003',
    assetCategory: 'aerial',
    assetName: '60ft Scissor Lift',
    currentRate: 385,
    recommendedRate: 440,
    changePercent: 14.3,
    reason: 'Weekend premium — 3 competitor yards sold out on aerial. Marina district hotel project pulling inventory.',
    confidence: 0.89,
    demandSignal: 'high',
    projectedRevenueImpact: 3300,
  },
  {
    id: 'PR-004',
    assetCategory: 'heavy',
    assetName: 'D6 Dozer',
    currentRate: 1200,
    recommendedRate: 1380,
    changePercent: 15.0,
    reason: 'I-4 highway expansion project Phase 3 starting — heavy equipment demand surge in Polk County.',
    confidence: 0.92,
    demandSignal: 'surge',
    projectedRevenueImpact: 3600,
  },
  {
    id: 'PR-005',
    assetCategory: 'compaction',
    assetName: 'Vibratory Roller',
    currentRate: 165,
    recommendedRate: 190,
    changePercent: 15.2,
    reason: 'Paving season peak — 6 active road projects within 30mi radius. Compaction fleet utilization at 91%.',
    confidence: 0.87,
    demandSignal: 'high',
    projectedRevenueImpact: 1500,
  },
  {
    id: 'PR-006',
    assetCategory: 'aerial',
    assetName: '45ft Boom Lift',
    currentRate: 425,
    recommendedRate: 460,
    changePercent: 8.2,
    reason: 'Steady commercial roofing demand. Two new retail centers in pre-construction phase.',
    confidence: 0.85,
    demandSignal: 'normal',
    projectedRevenueImpact: 1400,
  },
  {
    id: 'PR-007',
    assetCategory: 'tools',
    assetName: 'Concrete Saw Package',
    currentRate: 95,
    recommendedRate: 110,
    changePercent: 15.8,
    reason: 'Sidewalk replacement contracts awarded to 3 local firms — small tool demand rising 18% WoW.',
    confidence: 0.83,
    demandSignal: 'high',
    projectedRevenueImpact: 900,
  },
  {
    id: 'PR-008',
    assetCategory: 'power',
    assetName: '50kW Portable Generator',
    currentRate: 125,
    recommendedRate: 118,
    changePercent: -5.6,
    reason: 'Event season winding down. Portable generator inventory at 72% — price to move idle units.',
    confidence: 0.80,
    demandSignal: 'low',
    projectedRevenueImpact: -420,
  },
  {
    id: 'PR-009',
    assetCategory: 'compaction',
    assetName: 'Plate Compactor',
    currentRate: 85,
    recommendedRate: 85,
    changePercent: 0,
    reason: 'Demand stable, competitive pricing aligned. Hold current rate.',
    confidence: 0.88,
    demandSignal: 'normal',
    projectedRevenueImpact: 0,
  },
  {
    id: 'PR-010',
    assetCategory: 'tools',
    assetName: 'Demolition Hammer',
    currentRate: 75,
    recommendedRate: 70,
    changePercent: -6.7,
    reason: 'Low utilization last 3 weeks (34%). Two competitors dropped rates — match to maintain share.',
    confidence: 0.82,
    demandSignal: 'low',
    projectedRevenueImpact: -300,
  },
];

// ── Pricing KPIs ────────────────────────────────────────────────────────────

export interface PricingKpis {
  revenueUplift: number;
  revenueGain: number;
  ratesOptimized: number;
  manualOverrides: number;
  avgConfidence: number;
}

export const PRICING_KPIS: PricingKpis = {
  revenueUplift: 18.4,
  revenueGain: 26100,
  ratesOptimized: 847,
  manualOverrides: 12,
  avgConfidence: 91.3,
};

// ── Pricing by Category ─────────────────────────────────────────────────────

export interface CategoryPricing {
  category: string;
  currentAvg: number;
  aiRecommended: number;
  uplift: number;
}

export const PRICING_BY_CATEGORY: CategoryPricing[] = [
  { category: 'Heavy Equipment', currentAvg: 712, aiRecommended: 835, uplift: 17.3 },
  { category: 'Aerial / Lifts', currentAvg: 386, aiRecommended: 442, uplift: 14.5 },
  { category: 'Compaction & Concrete', currentAvg: 156, aiRecommended: 178, uplift: 14.1 },
  { category: 'Power & HVAC', currentAvg: 203, aiRecommended: 248, uplift: 22.2 },
  { category: 'Tools & Small', currentAvg: 92, aiRecommended: 104, uplift: 13.0 },
];

// ── Demand Heatmap ──────────────────────────────────────────────────────────

export interface DemandHeatmapRow {
  day: string;
  morning: number;
  afternoon: number;
  evening: number;
}

export const DEMAND_HEATMAP: DemandHeatmapRow[] = [
  { day: 'Mon', morning: 92, afternoon: 88, evening: 45 },
  { day: 'Tue', morning: 95, afternoon: 91, evening: 42 },
  { day: 'Wed', morning: 82, afternoon: 78, evening: 38 },
  { day: 'Thu', morning: 76, afternoon: 74, evening: 35 },
  { day: 'Fri', morning: 70, afternoon: 65, evening: 30 },
  { day: 'Sat', morning: 55, afternoon: 48, evening: 18 },
  { day: 'Sun', morning: 22, afternoon: 15, evening: 8 },
];

// ── Pricing Trend (6 months) ────────────────────────────────────────────────

export interface PricingTrendMonth {
  month: string;
  manualRevenue: number;
  aiRevenue: number;
}

export const PRICING_TREND: PricingTrendMonth[] = [
  { month: 'Sep', manualRevenue: 142000, aiRevenue: 168000 },
  { month: 'Oct', manualRevenue: 148000, aiRevenue: 178000 },
  { month: 'Nov', manualRevenue: 138000, aiRevenue: 170000 },
  { month: 'Dec', manualRevenue: 125000, aiRevenue: 156000 },
  { month: 'Jan', manualRevenue: 152000, aiRevenue: 184000 },
  { month: 'Feb', manualRevenue: 158000, aiRevenue: 192000 },
];

// ── Competitor Rate Comparison ──────────────────────────────────────────────

export interface CompetitorRate {
  competitor: string;
  excavator: number;
  scissorLift: number;
  generator: number;
}

export const COMPETITOR_RATES: CompetitorRate[] = [
  { competitor: 'Sunbelt Rentals', excavator: 895, scissorLift: 395, generator: 285 },
  { competitor: 'United Rentals', excavator: 920, scissorLift: 410, generator: 295 },
  { competitor: 'H&E Equipment', excavator: 860, scissorLift: 375, generator: 265 },
  { competitor: 'Neff Rentals', excavator: 840, scissorLift: 365, generator: 255 },
];
