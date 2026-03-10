import type {
  ClientConfig,
  SaleItem,
  PeriodContext,
  CalculationResult,
  ComponentResult,
  SummaryMetricResult,
  ThresholdResult,
  TieredRule,
} from './types';
import {
  aggregateSale,
  evaluateRule,
  calculateThreshold,
  type SaleAggregates,
} from './rules';

/**
 * Master calculation function.
 *
 * Pure function — no side effects, no DB, no I/O.
 * Takes a client config + sale data, evaluates every component's rule,
 * computes summary metrics and thresholds.
 */
export function calculate(
  config: ClientConfig,
  items: SaleItem[],
  period: PeriodContext
): CalculationResult {
  const sale = aggregateSale(items);
  const splitFactor = config.splitConfig?.enabled
    ? config.splitConfig.defaultFactor
    : 1;

  // Evaluate each component's rule
  const componentResults = evaluateComponents(config, sale, period, splitFactor);

  // Apply multiplier rules (post-pass)
  applyMultipliers(config, componentResults);

  const totalCommission = componentResults.reduce((sum, c) => sum + c.amount, 0);

  // Compute summary metrics
  const summaryMetrics = computeSummaryMetrics(config, sale, totalCommission);

  // Compute threshold info
  const threshold = computeThreshold(config, sale, period);

  return {
    clientId: config.id,
    saleTotal: sale.revenue,
    totalCost: sale.cost,
    grossMargin: sale.margin,
    grossMarginPercent: sale.marginPercent,
    totalCommission,
    components: componentResults,
    summaryMetrics,
    threshold,
  };
}

/* ── Component Evaluation ───────────────────────────────── */

function evaluateComponents(
  config: ClientConfig,
  sale: SaleAggregates,
  period: PeriodContext,
  splitFactor: number
): ComponentResult[] {
  const results: ComponentResult[] = [];

  for (const comp of config.components) {
    const visible = comp.visible !== false;
    if (!visible) continue;

    const effectiveSplit = (comp.splitAware !== false) ? splitFactor : 1;
    const { amount, detail } = evaluateRule(
      comp.rule,
      sale,
      period,
      config.rateTables ?? [],
      effectiveSplit
    );

    results.push({
      componentId: comp.id,
      label: comp.label,
      group: comp.group ?? 'commission',
      amount,
      detail,
      rule: comp.rule.type,
    });
  }

  return results;
}

/* ── Multiplier Post-Pass ───────────────────────────────── */

function applyMultipliers(
  config: ClientConfig,
  results: ComponentResult[]
): void {
  for (const comp of config.components) {
    if (comp.rule.type !== 'multiplier') continue;
    const rule = comp.rule;

    for (const result of results) {
      if (result.componentId === comp.id) continue; // don't multiply self
      if (rule.appliesTo === 'all' || rule.appliesTo.includes(result.componentId)) {
        result.amount *= rule.factor;
      }
    }
  }
}

/* ── Summary Metrics ────────────────────────────────────── */

function computeSummaryMetrics(
  config: ClientConfig,
  sale: SaleAggregates,
  totalCommission: number
): SummaryMetricResult[] {
  return config.summaryMetrics.map((metric) => {
    let value: number;
    switch (metric.basis) {
      case 'total_revenue':
        value = sale.revenue;
        break;
      case 'total_cost':
        value = sale.cost;
        break;
      case 'gross_margin_dollar':
        value = sale.margin;
        break;
      case 'gross_margin_percent':
        value = sale.marginPercent * 100;
        break;
      case 'total_commission':
        value = totalCommission;
        break;
      case 'item_count':
        value = sale.items.length;
        break;
      case 'unit_count':
        value = sale.units;
        break;
      default:
        value = 0;
    }
    return { id: metric.id, label: metric.label, value, format: metric.format };
  });
}

/* ── Threshold ──────────────────────────────────────────── */

function computeThreshold(
  config: ClientConfig,
  sale: SaleAggregates,
  period: PeriodContext
): ThresholdResult | null {
  if (!config.thresholds?.enabled) return null;

  const comp = config.components.find(
    (c) => c.id === config.thresholds!.basisComponentId
  );
  if (!comp || comp.rule.type !== 'tiered') return null;

  return calculateThreshold(comp.rule as TieredRule, sale, period);
}
