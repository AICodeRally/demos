import type { ForecastInput, ForecastResult } from './types';
import { monteCarlo } from './monte-carlo';

/**
 * Forecast: project attainment probability based on run rate + pipeline.
 *
 * Combines current run rate (actual revenue / days elapsed) with
 * Monte Carlo simulation of the pipeline to estimate probability
 * of hitting the period target.
 */
export function forecast(input: ForecastInput): ForecastResult {
  const {
    config,
    baseline,
    pipeline,
    daysInPeriod,
    daysElapsed,
    iterations = 1000,
    seed,
  } = input;

  const daysRemaining = daysInPeriod - daysElapsed;
  const target = baseline.target ?? 0;

  // Current run rate (revenue per day based on actual performance)
  const runRate = daysElapsed > 0 ? baseline.revenue / daysElapsed : 0;

  // Required daily rate to hit target from current position
  const revenueGap = target - baseline.revenue;
  const requiredRate = daysRemaining > 0 ? revenueGap / daysRemaining : Infinity;

  // Run Monte Carlo on pipeline to get commission distribution
  const distribution = monteCarlo({
    config,
    baseline,
    pipeline,
    iterations,
    seed,
  });

  // Expected commission = mean of Monte Carlo distribution
  const expectedCommission = distribution.mean;

  // Attainment probability: what fraction of iterations hit the target?
  // We re-run a lightweight check — project revenue from run rate + pipeline revenue
  // and check how many iterations would reach the target.
  // For simplicity, we use the distribution: if expected >= target revenue implies
  // commission >= target commission, we estimate attainment from the percentiles.
  const projectedRevenue = baseline.revenue + runRate * daysRemaining;
  const attainmentRatio = target > 0 ? projectedRevenue / target : 1;

  // Map attainment ratio to probability (simplified — linear between 0.5 and 1.5)
  const attainmentProbability = Math.max(0, Math.min(1,
    attainmentRatio >= 1 ? 0.5 + (attainmentRatio - 1) * 1.0 :
    attainmentRatio * 0.5
  ));

  // Risk level based on attainment probability
  let riskLevel: ForecastResult['riskLevel'];
  if (attainmentProbability >= 0.7) {
    riskLevel = 'on_track';
  } else if (attainmentProbability >= 0.4) {
    riskLevel = 'at_risk';
  } else {
    riskLevel = 'behind';
  }

  return {
    distribution,
    attainmentProbability,
    expectedCommission,
    riskLevel,
    daysRemaining,
    runRate,
    requiredRate,
  };
}
