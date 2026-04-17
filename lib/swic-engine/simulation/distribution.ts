import type { DistributionResult } from './types';

const DEFAULT_BUCKETS = 20;

/**
 * Compute distribution statistics from an array of numeric outcomes.
 *
 * Used by monteCarlo, forecast, and planImpact to summarize
 * N iteration results into percentiles, mean, stdDev, and histogram.
 */
export function computeDistribution(
  values: number[],
  bucketCount: number = DEFAULT_BUCKETS
): DistributionResult {
  if (values.length === 0) {
    return {
      mean: 0, median: 0,
      p10: 0, p25: 0, p75: 0, p90: 0,
      min: 0, max: 0, stdDev: 0,
      histogram: [],
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const sum = values.reduce((s, v) => s + v, 0);
  const mean = sum / n;

  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  const percentile = (p: number) => sorted[Math.min(Math.floor(n * p), n - 1)];

  const p10 = percentile(0.1);
  const p25 = percentile(0.25);
  const p75 = percentile(0.75);
  const p90 = percentile(0.9);
  const min = sorted[0];
  const max = sorted[n - 1];

  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  // Build histogram buckets
  const range = max - min || 1;
  const bucketSize = range / bucketCount;
  const histogram = Array.from({ length: bucketCount }, (_, i) => ({
    bucketMin: min + i * bucketSize,
    bucketMax: min + (i + 1) * bucketSize,
    count: 0,
  }));

  for (const v of values) {
    const idx = Math.min(Math.floor((v - min) / bucketSize), bucketCount - 1);
    histogram[idx].count++;
  }

  return { mean, median, p10, p25, p75, p90, min, max, stdDev, histogram };
}
