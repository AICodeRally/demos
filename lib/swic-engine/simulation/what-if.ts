import type { WhatIfInput, WhatIfResult } from './types';
import { calculate } from '../calculator';

/**
 * What-if analysis: "What changes if I add these deals?"
 *
 * Runs calculate() twice — once on baseline (empty sale), once with
 * additional deal items as the "current sale" — and returns the deltas.
 *
 * The engine treats PeriodContext as YTD *before* the sale, and items
 * as the current sale. Tiered rules add period + sale to find the
 * cumulative total. So we pass deal items directly — no period mutation.
 */
export function whatIf(input: WhatIfInput): WhatIfResult {
  const { baseline, config, additionalDeals } = input;

  const allItems = additionalDeals.flatMap((d) => d.items);

  // Baseline: no current sale, just YTD context
  const baseResult = calculate(config, [], baseline);

  // Projected: deal items as the "current sale" on top of baseline YTD
  const projResult = calculate(config, allItems, baseline);

  // Component-level deltas
  const componentDeltas = baseResult.components.map((bc) => {
    const pc = projResult.components.find((c) => c.componentId === bc.componentId);
    const projected = pc?.amount ?? 0;
    return {
      componentId: bc.componentId,
      label: bc.label,
      baseline: bc.amount,
      projected,
      delta: projected - bc.amount,
    };
  });

  // Check for new tier reached
  let newTier: WhatIfResult['newTier'] = null;
  if (baseResult.threshold && projResult.threshold) {
    if (projResult.threshold.currentTier > baseResult.threshold.currentTier) {
      newTier = {
        reached: true,
        tierIndex: projResult.threshold.currentTier,
        rate: projResult.threshold.currentRate,
      };
    }
  }

  const delta = projResult.totalCommission - baseResult.totalCommission;
  const deltaPercent =
    baseResult.totalCommission !== 0
      ? delta / baseResult.totalCommission
      : delta > 0 ? 1 : 0;

  return {
    baselineCommission: baseResult.totalCommission,
    projectedCommission: projResult.totalCommission,
    delta,
    deltaPercent,
    componentDeltas,
    newTier,
  };
}
