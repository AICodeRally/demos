// Lone Star Distribution — Demand Forecasting Data
// 13-week forecast by brand family + seasonal overlays + confidence bands
// Used by: /ops/ai/forecasting, /strategy/mix

import type { SupplierGroup } from './brands';

// ─── Forecast Types ─────────────────────────────

export interface WeeklyForecast {
  week: number;           // 1-13
  date: string;           // "2026-03-02" (Monday of that week)
  actual: number | null;  // actual cases (null for future weeks)
  forecast: number;       // predicted cases
  lower: number;          // 80% confidence band lower
  upper: number;          // 80% confidence band upper
}

export interface BrandForecast {
  brandId: string;
  brandName: string;
  supplier: SupplierGroup;
  weeklyForecasts: WeeklyForecast[];
  quarterTarget: number;        // quarterly case target
  currentPace: number;          // annualized run rate
  forecastAccuracy: number;     // MAPE over last 4 weeks (lower = better)
  trend: 'up' | 'flat' | 'down';
  aiRecommendation: string;
}

export interface SeasonalOverlay {
  eventName: string;
  startWeek: number;
  endWeek: number;
  impactPct: number;       // volume impact (e.g., 0.15 = +15%)
  affectedBrands: string[];
  description: string;
}

export interface WeatherImpact {
  week: number;
  type: 'heat-wave' | 'cold-snap' | 'storm' | 'normal';
  tempDelta: number;        // degrees F above/below normal
  volumeImpact: number;     // estimated % impact on total volume
  description: string;
}

// ─── Brand-Level Forecasts ──────────────────────
// Current quarter: Q1 2026, weeks 1-13 (Jan 5 – Mar 29)
// We are at week 9 (data through week 8, forecasting weeks 9-13)

export const BRAND_FORECASTS: BrandForecast[] = [
  // ── Top 5 brands (80% of volume) ──
  {
    brandId: 'miller-lite',
    brandName: 'Miller Lite',
    supplier: 'molson-coors',
    quarterTarget: 425000,
    currentPace: 418000,
    forecastAccuracy: 0.034,    // 3.4% MAPE
    trend: 'flat',
    aiRecommendation: 'Volume tracking 1.6% below target. Q1 seasonal drag typical for Miller Lite. Forecast shows recovery in weeks 11-13 with March Madness. No action needed.',
    weeklyForecasts: [
      { week: 1, date: '2026-01-05', actual: 30200, forecast: 31000, lower: 29500, upper: 32500 },
      { week: 2, date: '2026-01-12', actual: 29800, forecast: 30500, lower: 29000, upper: 32000 },
      { week: 3, date: '2026-01-19', actual: 31400, forecast: 31200, lower: 29700, upper: 32700 },
      { week: 4, date: '2026-01-26', actual: 30900, forecast: 31000, lower: 29500, upper: 32500 },
      { week: 5, date: '2026-02-02', actual: 32100, forecast: 31800, lower: 30300, upper: 33300 },
      { week: 6, date: '2026-02-09', actual: 31600, forecast: 32000, lower: 30500, upper: 33500 },
      { week: 7, date: '2026-02-16', actual: 33200, forecast: 32500, lower: 31000, upper: 34000 },
      { week: 8, date: '2026-02-23', actual: 32800, forecast: 33000, lower: 31500, upper: 34500 },
      { week: 9, date: '2026-03-02', actual: null, forecast: 33500, lower: 31800, upper: 35200 },
      { week: 10, date: '2026-03-09', actual: null, forecast: 34000, lower: 32100, upper: 35900 },
      { week: 11, date: '2026-03-16', actual: null, forecast: 35200, lower: 33100, upper: 37300 },
      { week: 12, date: '2026-03-23', actual: null, forecast: 35500, lower: 33200, upper: 37800 },
      { week: 13, date: '2026-03-30', actual: null, forecast: 34200, lower: 31900, upper: 36500 },
    ],
  },
  {
    brandId: 'corona-extra',
    brandName: 'Corona Extra',
    supplier: 'constellation',
    quarterTarget: 385000,
    currentPace: 372000,
    forecastAccuracy: 0.028,    // 2.8% MAPE
    trend: 'up',
    aiRecommendation: 'Corona trending +4% week-over-week. Pre-Cinco de Mayo buildup expected to accelerate from week 10. Recommend increasing safety stock by 8% for weeks 11-13. Laredo routes showing 12% above forecast — border market outperforming.',
    weeklyForecasts: [
      { week: 1, date: '2026-01-05', actual: 26500, forecast: 27000, lower: 25500, upper: 28500 },
      { week: 2, date: '2026-01-12', actual: 26800, forecast: 27200, lower: 25700, upper: 28700 },
      { week: 3, date: '2026-01-19', actual: 27200, forecast: 27500, lower: 26000, upper: 29000 },
      { week: 4, date: '2026-01-26', actual: 27900, forecast: 27800, lower: 26300, upper: 29300 },
      { week: 5, date: '2026-02-02', actual: 28400, forecast: 28200, lower: 26700, upper: 29700 },
      { week: 6, date: '2026-02-09', actual: 28900, forecast: 28500, lower: 27000, upper: 30000 },
      { week: 7, date: '2026-02-16', actual: 29600, forecast: 29000, lower: 27400, upper: 30600 },
      { week: 8, date: '2026-02-23', actual: 30100, forecast: 29500, lower: 27900, upper: 31100 },
      { week: 9, date: '2026-03-02', actual: null, forecast: 30200, lower: 28400, upper: 32000 },
      { week: 10, date: '2026-03-09', actual: null, forecast: 31000, lower: 29000, upper: 33000 },
      { week: 11, date: '2026-03-16', actual: null, forecast: 32500, lower: 30200, upper: 34800 },
      { week: 12, date: '2026-03-23', actual: null, forecast: 33800, lower: 31200, upper: 36400 },
      { week: 13, date: '2026-03-30', actual: null, forecast: 32000, lower: 29500, upper: 34500 },
    ],
  },
  {
    brandId: 'coors-light',
    brandName: 'Coors Light',
    supplier: 'molson-coors',
    quarterTarget: 380000,
    currentPace: 365000,
    forecastAccuracy: 0.031,
    trend: 'flat',
    aiRecommendation: 'Coors Light pacing 3.9% below target. Q1 is historically weakest quarter (0.85x seasonal). March Madness promotions in weeks 11-12 should drive 8-10% uplift. Monitor Fort Worth routes — 3 reps running cold.',
    weeklyForecasts: [
      { week: 1, date: '2026-01-05', actual: 26100, forecast: 26800, lower: 25300, upper: 28300 },
      { week: 2, date: '2026-01-12', actual: 25800, forecast: 26500, lower: 25000, upper: 28000 },
      { week: 3, date: '2026-01-19', actual: 27000, forecast: 27000, lower: 25500, upper: 28500 },
      { week: 4, date: '2026-01-26', actual: 27200, forecast: 27200, lower: 25700, upper: 28700 },
      { week: 5, date: '2026-02-02', actual: 28100, forecast: 27800, lower: 26300, upper: 29300 },
      { week: 6, date: '2026-02-09', actual: 27500, forecast: 28000, lower: 26500, upper: 29500 },
      { week: 7, date: '2026-02-16', actual: 28800, forecast: 28500, lower: 27000, upper: 30000 },
      { week: 8, date: '2026-02-23', actual: 28200, forecast: 28800, lower: 27300, upper: 30300 },
      { week: 9, date: '2026-03-02', actual: null, forecast: 29200, lower: 27500, upper: 30900 },
      { week: 10, date: '2026-03-09', actual: null, forecast: 29800, lower: 27900, upper: 31700 },
      { week: 11, date: '2026-03-16', actual: null, forecast: 31500, lower: 29300, upper: 33700 },
      { week: 12, date: '2026-03-23', actual: null, forecast: 31200, lower: 28900, upper: 33500 },
      { week: 13, date: '2026-03-30', actual: null, forecast: 29500, lower: 27400, upper: 31600 },
    ],
  },
  {
    brandId: 'modelo-especial',
    brandName: 'Modelo Especial',
    supplier: 'constellation',
    quarterTarget: 310000,
    currentPace: 318000,
    forecastAccuracy: 0.025,    // best accuracy — consistent brand
    trend: 'up',
    aiRecommendation: 'Modelo exceeding forecast by 2.6%. Fastest-growing brand in portfolio. AI detects increased velocity in Allen and Dallas suburban routes. Consider increasing endcap allocation in Kroger and Tom Thumb by 2 facings.',
    weeklyForecasts: [
      { week: 1, date: '2026-01-05', actual: 23200, forecast: 23000, lower: 21800, upper: 24200 },
      { week: 2, date: '2026-01-12', actual: 23000, forecast: 23200, lower: 22000, upper: 24400 },
      { week: 3, date: '2026-01-19', actual: 23600, forecast: 23400, lower: 22200, upper: 24600 },
      { week: 4, date: '2026-01-26', actual: 23800, forecast: 23600, lower: 22400, upper: 24800 },
      { week: 5, date: '2026-02-02', actual: 24200, forecast: 23800, lower: 22600, upper: 25000 },
      { week: 6, date: '2026-02-09', actual: 24500, forecast: 24000, lower: 22800, upper: 25200 },
      { week: 7, date: '2026-02-16', actual: 24800, forecast: 24200, lower: 23000, upper: 25400 },
      { week: 8, date: '2026-02-23', actual: 25100, forecast: 24500, lower: 23200, upper: 25800 },
      { week: 9, date: '2026-03-02', actual: null, forecast: 24800, lower: 23400, upper: 26200 },
      { week: 10, date: '2026-03-09', actual: null, forecast: 25200, lower: 23600, upper: 26800 },
      { week: 11, date: '2026-03-16', actual: null, forecast: 25500, lower: 23800, upper: 27200 },
      { week: 12, date: '2026-03-23', actual: null, forecast: 25800, lower: 24000, upper: 27600 },
      { week: 13, date: '2026-03-30', actual: null, forecast: 25000, lower: 23200, upper: 26800 },
    ],
  },
  {
    brandId: 'buffalo-trace',
    brandName: 'Buffalo Trace',
    supplier: 'sazerac',
    quarterTarget: 38000,
    currentPace: 41000,
    forecastAccuracy: 0.062,    // higher variance — new category
    trend: 'up',
    aiRecommendation: 'Buffalo Trace outperforming forecast by 7.9%. Spirits category showing strong pull-through in Dallas and Fort Worth on-premise accounts. Inventory risk: current safety stock at 4 days, recommend increasing to 7 days. 12 new W-permit accounts opened this quarter.',
    weeklyForecasts: [
      { week: 1, date: '2026-01-05', actual: 2600, forecast: 2700, lower: 2300, upper: 3100 },
      { week: 2, date: '2026-01-12', actual: 2700, forecast: 2750, lower: 2350, upper: 3150 },
      { week: 3, date: '2026-01-19', actual: 2900, forecast: 2800, lower: 2400, upper: 3200 },
      { week: 4, date: '2026-01-26', actual: 3000, forecast: 2850, lower: 2450, upper: 3250 },
      { week: 5, date: '2026-02-02', actual: 3100, forecast: 2900, lower: 2500, upper: 3300 },
      { week: 6, date: '2026-02-09', actual: 3200, forecast: 2950, lower: 2550, upper: 3350 },
      { week: 7, date: '2026-02-16', actual: 3300, forecast: 3000, lower: 2600, upper: 3400 },
      { week: 8, date: '2026-02-23', actual: 3400, forecast: 3100, lower: 2650, upper: 3550 },
      { week: 9, date: '2026-03-02', actual: null, forecast: 3200, lower: 2700, upper: 3700 },
      { week: 10, date: '2026-03-09', actual: null, forecast: 3300, lower: 2750, upper: 3850 },
      { week: 11, date: '2026-03-16', actual: null, forecast: 3400, lower: 2800, upper: 4000 },
      { week: 12, date: '2026-03-23', actual: null, forecast: 3500, lower: 2850, upper: 4150 },
      { week: 13, date: '2026-03-30', actual: null, forecast: 3300, lower: 2700, upper: 3900 },
    ],
  },
];

// ─── Seasonal Overlays ──────────────────────────

export const SEASONAL_OVERLAYS: SeasonalOverlay[] = [
  {
    eventName: 'Super Bowl',
    startWeek: 5,
    endWeek: 6,
    impactPct: 0.12,
    affectedBrands: ['miller-lite', 'coors-light', 'corona-extra', 'dos-equis'],
    description: 'Super Bowl LX drives 12% volume spike across domestic and import beer. Dallas bars and restaurants place incremental orders. Coors Light is official sponsor — 2x endcap placement.',
  },
  {
    eventName: 'March Madness',
    startWeek: 11,
    endWeek: 13,
    impactPct: 0.08,
    affectedBrands: ['miller-lite', 'coors-light', 'blue-moon', 'heineken'],
    description: 'NCAA tournament drives 8% uplift in on-premise consumption. Blue Moon and craft brands see higher pull-through in sports bars. Peak display period for bars and restaurants.',
  },
  {
    eventName: 'Valentine\'s Day',
    startWeek: 6,
    endWeek: 7,
    impactPct: 0.05,
    affectedBrands: ['peroni', 'heineken', 'buffalo-trace', 'wheatley-vodka'],
    description: 'Premium imports and spirits see 5% lift from restaurant and bar occasions. Buffalo Trace cocktail programs and Peroni premium pairings.',
  },
  {
    eventName: 'Spring Break',
    startWeek: 9,
    endWeek: 11,
    impactPct: 0.10,
    affectedBrands: ['corona-extra', 'modelo-especial', 'truly', 'dos-equis', 'tecate'],
    description: 'South Texas spring break drives 10% import and seltzer surge. Corpus Christi and Laredo routes see peak seasonal demand. Corona Extra is #1 spring break brand.',
  },
  {
    eventName: 'St. Patrick\'s Day',
    startWeek: 11,
    endWeek: 11,
    impactPct: 0.06,
    affectedBrands: ['blue-moon', 'shiner-bock', 'fireball', 'heineken'],
    description: '6% single-week spike in craft and import beer. Fireball shots drive spirits volume. Dallas Deep Ellum and Fort Worth Stockyards are peak consumption zones.',
  },
];

// ─── Weather Impact Projections ─────────────────

export const WEATHER_IMPACTS: WeatherImpact[] = [
  { week: 3, type: 'cold-snap', tempDelta: -12, volumeImpact: -0.04, description: 'Arctic blast drops DFW to 22°F. Off-premise volume dips 4% but spirits rise 8% as consumers shift to brown goods.' },
  { week: 6, type: 'normal', tempDelta: 2, volumeImpact: 0.01, description: 'Mild February. Slight positive volume trend from patio openings.' },
  { week: 9, type: 'heat-wave', tempDelta: 8, volumeImpact: 0.06, description: 'Early spring heat wave (88°F in DFW). Beer and seltzer demand up 6%. Convenience store velocity jumps. Corona and Truly outperform.' },
  { week: 12, type: 'storm', tempDelta: -3, volumeImpact: -0.02, description: 'Thunderstorms across North Texas. Minor delivery delays. 2% negative impact from reduced foot traffic.' },
];

// ─── Inventory Planning Recommendations ─────────

export interface InventoryRecommendation {
  brandId: string;
  currentDaysOnHand: number;
  recommendedDaysOnHand: number;
  action: 'increase' | 'maintain' | 'reduce';
  reason: string;
  urgency: 'high' | 'medium' | 'low';
}

export const INVENTORY_RECOMMENDATIONS: InventoryRecommendation[] = [
  { brandId: 'corona-extra', currentDaysOnHand: 5, recommendedDaysOnHand: 8, action: 'increase', reason: 'Pre-Cinco buildup starting. Spring break demand in South TX. Laredo routes showing 12% above forecast.', urgency: 'high' },
  { brandId: 'buffalo-trace', currentDaysOnHand: 4, recommendedDaysOnHand: 7, action: 'increase', reason: 'Spirits category exceeding forecast by 8%. Limited allocation from Sazerac — lock in Q2 POs now.', urgency: 'high' },
  { brandId: 'miller-lite', currentDaysOnHand: 7, recommendedDaysOnHand: 7, action: 'maintain', reason: 'Tracking to forecast. March Madness safety stock already positioned.', urgency: 'low' },
  { brandId: 'truly', currentDaysOnHand: 9, recommendedDaysOnHand: 6, action: 'reduce', reason: 'Seltzer category declining 8% YoY. Overstock in Ennis and Corpus Christi warehouses. Risk of code date issues.', urgency: 'medium' },
  { brandId: 'modelo-especial', currentDaysOnHand: 6, recommendedDaysOnHand: 8, action: 'increase', reason: 'Fastest-growing brand. Allen and suburban routes accelerating. Pre-position for spring.', urgency: 'medium' },
  { brandId: 'fireball', currentDaysOnHand: 8, recommendedDaysOnHand: 6, action: 'reduce', reason: 'Post-holiday overhang. Q1 spirits velocity normalizing. Reduce and rebalance toward Buffalo Trace.', urgency: 'low' },
];

// ─── New Product Projections ────────────────────

export interface NewProductForecast {
  brandId: string;
  brandName: string;
  supplier: SupplierGroup;
  launchWeek: number;
  projectedQ1Cases: number;
  targetAccounts: number;
  distributionTargetPct: number;    // % of accounts by quarter end
  cannibalRisk: string | null;
  aiInsight: string;
}

export const NEW_PRODUCT_FORECASTS: NewProductForecast[] = [
  {
    brandId: 'wheatley-vodka',
    brandName: 'Wheatley Vodka',
    supplier: 'sazerac',
    launchWeek: 1,
    projectedQ1Cases: 18000,
    targetAccounts: 200,
    distributionTargetPct: 0.12,
    cannibalRisk: null,
    aiInsight: 'First Sazerac vodka in portfolio. No cannibalization risk — incremental spirits category. Target upscale on-premise and craft-forward off-premise. Dallas and Fort Worth are primary markets.',
  },
  {
    brandId: 'peroni',
    brandName: 'Peroni Nastro Azzurro',
    supplier: 'molson-coors',
    launchWeek: 1,
    projectedQ1Cases: 42000,
    targetAccounts: 350,
    distributionTargetPct: 0.18,
    cannibalRisk: 'Minor risk to Heineken in upscale accounts — monitor cross-elasticity',
    aiInsight: 'Peroni growing 15% nationally. Texas late to adopt — significant white space. Position as Italian dining and premium social occasions. Allen suburban growth corridor is ideal launch territory.',
  },
];

// ─── Helpers ────────────────────────────────────

export const getForecastByBrand = (brandId: string): BrandForecast | undefined =>
  BRAND_FORECASTS.find(f => f.brandId === brandId);

export const getOverlaysForWeek = (week: number): SeasonalOverlay[] =>
  SEASONAL_OVERLAYS.filter(o => week >= o.startWeek && week <= o.endWeek);

export const getWeatherForWeek = (week: number): WeatherImpact | undefined =>
  WEATHER_IMPACTS.find(w => w.week === week);

// Compute aggregate forecast for a given week
export const getAggregateForecast = (week: number): {
  totalForecast: number;
  totalActual: number | null;
  totalLower: number;
  totalUpper: number;
} => {
  let totalForecast = 0;
  let totalActual: number | null = 0;
  let totalLower = 0;
  let totalUpper = 0;

  for (const brand of BRAND_FORECASTS) {
    const wf = brand.weeklyForecasts.find(w => w.week === week);
    if (wf) {
      totalForecast += wf.forecast;
      if (wf.actual !== null && totalActual !== null) {
        totalActual += wf.actual;
      } else {
        totalActual = null;
      }
      totalLower += wf.lower;
      totalUpper += wf.upper;
    }
  }

  return { totalForecast, totalActual, totalLower, totalUpper };
};
