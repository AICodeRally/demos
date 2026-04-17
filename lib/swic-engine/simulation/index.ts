// Simulation functions
export { whatIf } from './what-if';
export { monteCarlo } from './monte-carlo';
export { forecast } from './forecast';
export { planImpact } from './plan-impact';

// Utilities (exposed for advanced consumers)
export { createRng } from './rng';
export { computeDistribution } from './distribution';

// All simulation types
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
} from './types';
