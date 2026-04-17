import type { PlanImpactInput, PlanImpactResult, DistributionResult } from './types';
import type { PeriodContext } from '../types';
import { monteCarlo } from './monte-carlo';
import { computeDistribution } from './distribution';

const NEUTRAL_THRESHOLD = 0.02; // Within 2% = neutral

/**
 * Plan impact analysis: compare two comp plans across a rep population.
 *
 * For each rep, runs Monte Carlo under both Plan A and Plan B,
 * then compares outcomes. Reports winners (earn more under B),
 * losers (earn less), and neutrals (within 2%).
 */
export function planImpact(input: PlanImpactInput): PlanImpactResult {
  const { planA, planB, reps, iterations } = input;

  const repResultsA: Array<{ repId: string; commission: number }> = [];
  const repResultsB: Array<{ repId: string; commission: number }> = [];

  let winnersCount = 0;
  let losersCount = 0;
  let neutralCount = 0;

  for (let r = 0; r < reps.length; r++) {
    const rep = reps[r];
    // Use a per-rep seed offset for reproducibility
    const seedBase = (r + 1) * 7919; // prime multiplier for spread

    const distA = monteCarlo({
      config: planA,
      baseline: rep.period,
      pipeline: rep.historicalDeals,
      iterations,
      seed: seedBase,
    });

    const distB = monteCarlo({
      config: planB,
      baseline: rep.period,
      pipeline: rep.historicalDeals,
      iterations,
      seed: seedBase, // same seed — same deal inclusion pattern
    });

    repResultsA.push({ repId: rep.repId, commission: distA.mean });
    repResultsB.push({ repId: rep.repId, commission: distB.mean });

    // Classify: winner, loser, or neutral
    const commA = distA.mean;
    const commB = distB.mean;
    const pctChange = commA !== 0 ? (commB - commA) / commA : (commB > 0 ? 1 : 0);

    if (Math.abs(pctChange) <= NEUTRAL_THRESHOLD) {
      neutralCount++;
    } else if (pctChange > 0) {
      winnersCount++;
    } else {
      losersCount++;
    }
  }

  // Aggregate distributions across all reps
  const allCommissionsA = repResultsA.map((r) => r.commission);
  const allCommissionsB = repResultsB.map((r) => r.commission);

  const totalPayoutA = allCommissionsA.reduce((s, v) => s + v, 0);
  const totalPayoutB = allCommissionsB.reduce((s, v) => s + v, 0);

  const distributionA = computeDistribution(allCommissionsA);
  const distributionB = computeDistribution(allCommissionsB);

  const totalPayoutDelta = totalPayoutB - totalPayoutA;
  const totalPayoutDeltaPercent =
    totalPayoutA !== 0 ? totalPayoutDelta / totalPayoutA : (totalPayoutDelta > 0 ? 1 : 0);

  return {
    planA: {
      totalPayout: totalPayoutA,
      distribution: distributionA,
      repResults: repResultsA,
    },
    planB: {
      totalPayout: totalPayoutB,
      distribution: distributionB,
      repResults: repResultsB,
    },
    delta: {
      totalPayoutDelta,
      totalPayoutDeltaPercent,
      winnersCount,
      losersCount,
      neutralCount,
    },
  };
}
