// @aicr/swic-engine — Pure commission calculation engine
// Zero dependencies. Works in browser, Node, Deno, Bun, and (future) WASM.

// Core calculation
export { calculate } from './calculator';

// Rule evaluation primitives
export { aggregateSale, evaluateRule, calculateThreshold, formatCurrency, formatCurrencyShort } from './rules';
export type { SaleAggregates } from './rules';

// All types
export type {
  // Rules
  Rule,
  PercentOfRule,
  FixedPerMatchRule,
  TieredRule,
  LookupRule,
  MultiplierRule,
  PlaceholderRule,
  BundleBonusRule,
  TierStep,
  ItemMatcher,
  RateTable,
  // Config
  ClientConfig,
  ComponentConfig,
  SummaryMetricConfig,
  ThresholdConfig,
  MetricBasis,
  // Data
  SaleItem,
  PeriodContext,
  // Results
  CalculationResult,
  ComponentResult,
  ThresholdResult,
  SummaryMetricResult,
} from './types';

// Simulation engine
export { whatIf, monteCarlo, forecast, planImpact } from './simulation';
export { createRng, computeDistribution } from './simulation';
export type {
  ScenarioDeal,
  WhatIfInput,
  WhatIfResult,
  MonteCarloInput,
  ForecastInput,
  ForecastResult,
  PlanImpactInput,
  PlanImpactResult,
  DistributionResult,
} from './simulation';
