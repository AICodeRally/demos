import type { ClientConfig, PeriodContext, SaleItem } from '../types';

/* ── Scenario Inputs ───────────────────────────── */

/** A single hypothetical deal in a scenario */
export interface ScenarioDeal {
  revenue: number;
  cost: number;
  items: SaleItem[];
  probability: number;          // 0-1, used in Monte Carlo
}

/** What-if: "What changes if I add these deals?" */
export interface WhatIfInput {
  baseline: PeriodContext;
  config: ClientConfig;
  additionalDeals: ScenarioDeal[];
}

/** Monte Carlo: run N iterations with probabilistic deals */
export interface MonteCarloInput {
  config: ClientConfig;
  baseline: PeriodContext;
  pipeline: ScenarioDeal[];
  iterations: number;           // 1K-100K
  seed?: number;                // Reproducible randomness
}

/** Forecast: project attainment based on run rate + pipeline */
export interface ForecastInput {
  config: ClientConfig;
  baseline: PeriodContext;
  pipeline: ScenarioDeal[];
  daysInPeriod: number;
  daysElapsed: number;
  iterations?: number;          // Default 1000
  seed?: number;
}

/** Plan impact: compare two plans across rep population */
export interface PlanImpactInput {
  planA: ClientConfig;
  planB: ClientConfig;
  reps: Array<{
    repId: string;
    period: PeriodContext;
    historicalDeals: ScenarioDeal[];
  }>;
  iterations: number;
}

/* ── Outputs ───────────────────────────────────── */

/** Statistical distribution of commission outcomes */
export interface DistributionResult {
  mean: number;
  median: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  min: number;
  max: number;
  stdDev: number;
  histogram: Array<{
    bucketMin: number;
    bucketMax: number;
    count: number;
  }>;
}

/** What-if result */
export interface WhatIfResult {
  baselineCommission: number;
  projectedCommission: number;
  delta: number;
  deltaPercent: number;
  componentDeltas: Array<{
    componentId: string;
    label: string;
    baseline: number;
    projected: number;
    delta: number;
  }>;
  newTier: { reached: boolean; tierIndex: number; rate: number } | null;
}

/** Forecast result */
export interface ForecastResult {
  distribution: DistributionResult;
  attainmentProbability: number; // Chance of hitting target (0-1)
  expectedCommission: number;
  riskLevel: 'on_track' | 'at_risk' | 'behind';
  daysRemaining: number;
  runRate: number;               // Current daily revenue rate
  requiredRate: number;          // Rate needed to hit target
}

/** Plan impact result */
export interface PlanImpactResult {
  planA: {
    totalPayout: number;
    distribution: DistributionResult;
    repResults: Array<{ repId: string; commission: number }>;
  };
  planB: {
    totalPayout: number;
    distribution: DistributionResult;
    repResults: Array<{ repId: string; commission: number }>;
  };
  delta: {
    totalPayoutDelta: number;
    totalPayoutDeltaPercent: number;
    winnersCount: number;        // Reps who earn more under Plan B
    losersCount: number;         // Reps who earn less
    neutralCount: number;        // Within 2% of same
  };
}
