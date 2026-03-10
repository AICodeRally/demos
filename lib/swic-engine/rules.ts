import type {
  Rule,
  SaleItem,
  PeriodContext,
  RateTable,
  ThresholdResult,
  TieredRule,
} from './types';

/* ── Sale Aggregates (computed once, shared across rules) ── */

export interface SaleAggregates {
  revenue: number;
  cost: number;
  margin: number;
  marginPercent: number;
  units: number;
  items: SaleItem[];
}

export function aggregateSale(items: SaleItem[]): SaleAggregates {
  let revenue = 0;
  let cost = 0;
  let units = 0;
  for (const item of items) {
    revenue += item.price * item.quantity;
    cost += item.cost * item.quantity;
    units += item.quantity;
  }
  const margin = revenue - cost;
  const marginPercent = revenue > 0 ? margin / revenue : 0;
  return { revenue, cost, margin, marginPercent, units, items };
}

/* ── Rule Evaluator ─────────────────────────────────────── */

export function evaluateRule(
  rule: Rule,
  sale: SaleAggregates,
  period: PeriodContext,
  rateTables: RateTable[],
  splitFactor: number
): { amount: number; detail: string } {
  switch (rule.type) {
    case 'percent_of':
      return evalPercentOf(rule, sale, splitFactor);

    case 'fixed_per_match':
      return evalFixedPerMatch(rule, sale, splitFactor);

    case 'tiered':
      return evalTiered(rule, sale, period, splitFactor);

    case 'lookup':
      return evalLookup(rule, sale, rateTables, splitFactor);

    case 'multiplier':
      // Multiplier is handled externally (applied to other component results)
      return { amount: 0, detail: `${(rule.factor * 100).toFixed(0)}% credit multiplier` };

    case 'placeholder':
      return { amount: 0, detail: rule.description ?? 'Formula TBD — awaiting client configuration' };

    case 'bundle_bonus':
      return evalBundleBonus(rule, sale, splitFactor);
  }
}

/* ── Individual Rule Evaluators ─────────────────────────── */

function evalPercentOf(
  rule: Extract<Rule, { type: 'percent_of' }>,
  sale: SaleAggregates,
  splitFactor: number
): { amount: number; detail: string } {
  const basisMap: Record<string, number> = {
    revenue: sale.revenue,
    cost: sale.cost,
    margin: sale.margin,
    margin_percent: sale.marginPercent,
  };
  const basisValue = basisMap[rule.basis] ?? 0;
  const amount = basisValue * rule.rate * splitFactor;
  const pct = (rule.rate * 100).toFixed(2);
  return {
    amount,
    detail: `${pct}% of ${formatCurrency(basisValue)} ${rule.basis}`,
  };
}

function evalFixedPerMatch(
  rule: Extract<Rule, { type: 'fixed_per_match' }>,
  sale: SaleAggregates,
  splitFactor: number
): { amount: number; detail: string } {
  let matchingUnits = 0;
  for (const item of sale.items) {
    const matches =
      (rule.match.field === 'tag' && item.tags.includes(rule.match.value)) ||
      (rule.match.field === 'category' && item.category === rule.match.value) ||
      (rule.match.field === 'sku' && item.sku === rule.match.value);
    if (matches) matchingUnits += item.quantity;
  }
  const amount = matchingUnits * rule.amount * splitFactor;
  return {
    amount,
    detail:
      matchingUnits > 0
        ? `${matchingUnits} qualifying \u00d7 ${formatCurrency(rule.amount)}`
        : 'No qualifying items',
  };
}

function evalTiered(
  rule: Extract<Rule, { type: 'tiered' }>,
  sale: SaleAggregates,
  period: PeriodContext,
  splitFactor: number
): { amount: number; detail: string } {
  const tiers = [...rule.tiers].sort((a, b) => a.min - b.min);
  const basisMap: Record<string, { ytd: number; sale: number }> = {
    revenue: { ytd: period.revenue, sale: sale.revenue },
    margin: { ytd: period.margin, sale: sale.margin },
    units: { ytd: period.units, sale: sale.units },
  };
  const { ytd: ytdBasis, sale: saleBasis } = basisMap[rule.basis] ?? { ytd: 0, sale: 0 };

  let amount: number;
  let appliedRate: number;

  if (rule.marginal) {
    amount = 0;
    let remaining = saleBasis;
    let cursor = ytdBasis;
    appliedRate = tiers[0]?.rate ?? 0;

    for (let i = findTierIndex(tiers, ytdBasis); i < tiers.length && remaining > 0; i++) {
      const tierRate = tiers[i].rate;
      const nextMin = i + 1 < tiers.length ? tiers[i + 1].min : Infinity;
      const roomInTier = Math.max(0, nextMin - cursor);
      const applied = Math.min(remaining, roomInTier);
      amount += applied * tierRate;
      remaining -= applied;
      cursor += applied;
      appliedRate = tierRate;
    }
  } else {
    const totalAfterSale = ytdBasis + saleBasis;
    const tierIndex = findTierIndex(tiers, totalAfterSale);
    appliedRate = tiers[tierIndex]?.rate ?? 0;
    amount = saleBasis * appliedRate;
  }

  amount *= splitFactor;

  return {
    amount,
    detail: `Tier rate: ${(appliedRate * 100).toFixed(2)}%`,
  };
}

function evalLookup(
  rule: Extract<Rule, { type: 'lookup' }>,
  sale: SaleAggregates,
  rateTables: RateTable[],
  splitFactor: number
): { amount: number; detail: string } {
  const table = rateTables.find((t) => t.id === rule.tableId);
  if (!table) {
    return { amount: 0, detail: `Rate table "${rule.tableId}" not found` };
  }

  const basisMap: Record<string, number> = {
    revenue: sale.revenue,
    margin: sale.margin,
    units: sale.units,
    margin_percent: sale.marginPercent,
  };
  const input = basisMap[rule.inputBasis] ?? 0;

  const row = table.rows.find((r) => input >= r.min && input < r.max);
  if (!row) {
    return { amount: 0, detail: `No matching rate for ${formatCurrency(input)}` };
  }

  const amount = sale.revenue * row.rate * splitFactor;
  return {
    amount,
    detail: `Table "${table.name}" \u2192 ${(row.rate * 100).toFixed(2)}%`,
  };
}

function evalBundleBonus(
  rule: Extract<Rule, { type: 'bundle_bonus' }>,
  sale: SaleAggregates,
  splitFactor: number
): { amount: number; detail: string } {
  if (rule.requiredCategories.length === 0) {
    return { amount: 0, detail: 'No categories configured' };
  }

  const categoryCounts: Record<string, number> = {};
  for (const cat of rule.requiredCategories) {
    categoryCounts[cat] = 0;
  }
  for (const item of sale.items) {
    if (item.category in categoryCounts) {
      categoryCounts[item.category] += item.quantity;
    }
  }

  const missingCategories = rule.requiredCategories.filter(
    (cat) => categoryCounts[cat] === 0
  );

  if (missingCategories.length > 0) {
    return {
      amount: 0,
      detail: `Missing: ${missingCategories.join(', ')}`,
    };
  }

  const completeBundles = Math.min(...Object.values(categoryCounts));
  const amount = completeBundles * rule.amount * splitFactor;
  return {
    amount,
    detail: `${completeBundles} \u00d7 ${rule.label} @ ${formatCurrency(rule.amount)}`,
  };
}

/* ── Threshold Calculator ───────────────────────────────── */

export function calculateThreshold(
  rule: TieredRule,
  sale: SaleAggregates,
  period: PeriodContext
): ThresholdResult {
  const tiers = [...rule.tiers].sort((a, b) => a.min - b.min);
  const basisMap: Record<string, number> = {
    revenue: period.revenue + sale.revenue,
    margin: period.margin + sale.margin,
    units: period.units + sale.units,
  };
  const currentTotal = basisMap[rule.basis] ?? 0;
  const tierIndex = findTierIndex(tiers, currentTotal);

  const nextTier = tierIndex + 1 < tiers.length ? tiers[tierIndex + 1] : null;
  const amountToNextTier = nextTier ? Math.max(0, nextTier.min - currentTotal) : null;

  const potentialAtNextTier = nextTier ? sale.revenue * nextTier.rate : null;

  return {
    currentTier: tierIndex,
    currentRate: tiers[tierIndex]?.rate ?? 0,
    nextTierMin: nextTier?.min ?? null,
    amountToNextTier,
    nextTierRate: nextTier?.rate ?? null,
    potentialAtNextTier,
  };
}

/* ── Helpers ────────────────────────────────────────────── */

function findTierIndex(tiers: { min: number }[], value: number): number {
  let idx = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (value >= tiers[i].min) {
      idx = i;
      break;
    }
  }
  return idx;
}

export function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrencyShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return formatCurrency(n);
}
