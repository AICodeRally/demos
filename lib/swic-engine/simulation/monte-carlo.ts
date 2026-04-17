import type { MonteCarloInput, DistributionResult } from './types';
import { calculate } from '../calculator';
import { createRng } from './rng';
import { computeDistribution } from './distribution';

/**
 * Monte Carlo simulation: run N iterations with probabilistic deal inclusion.
 *
 * Each iteration rolls each deal's probability independently.
 * Included deal items become the "current sale" on top of the baseline
 * period. The engine adds period + sale internally for cumulative metrics.
 *
 * Deterministic when seed is provided.
 */
export function monteCarlo(input: MonteCarloInput): DistributionResult {
  const { config, baseline, pipeline, iterations, seed } = input;
  const rng = createRng(seed ?? Date.now());

  const outcomes: number[] = new Array(iterations);

  for (let i = 0; i < iterations; i++) {
    // Roll each deal's probability — include or exclude
    const includedItems = [];

    for (const deal of pipeline) {
      if (rng() < deal.probability) {
        includedItems.push(...deal.items);
      }
    }

    // Deal items are the "current sale", baseline is the YTD context
    const result = calculate(config, includedItems, baseline);
    outcomes[i] = result.totalCommission;
  }

  return computeDistribution(outcomes);
}
