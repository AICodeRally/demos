/* ══════════════════════════════════════════════════════════
   @aicr/swic-engine — Configuration-Driven Commission Types

   The engine is generic. Every client (Mattress Firm, etc.)
   is a ClientConfig — a JSON-serializable definition of their
   commission structure. No client-specific logic in the engine.
   ══════════════════════════════════════════════════════════ */

/* ── Rule Primitives ────────────────────────────────────── */

/** Percent of a sale basis (revenue, cost, margin) */
export interface PercentOfRule {
  type: 'percent_of';
  rate: number;                  // e.g. 0.04 = 4%
  basis: 'revenue' | 'cost' | 'margin' | 'margin_percent';
}

/** Fixed $ amount per item matching a condition */
export interface FixedPerMatchRule {
  type: 'fixed_per_match';
  amount: number;                // flat $ per qualifying unit
  match: ItemMatcher;
}

/** Tiered rate — rate changes at cumulative thresholds */
export interface TieredRule {
  type: 'tiered';
  basis: 'revenue' | 'margin' | 'units';
  tiers: TierStep[];            // sorted ascending by min
  marginal: boolean;            // true = marginal rates (like tax brackets)
}

/** Table-driven lookup (rate table loaded from ICM or config) */
export interface LookupRule {
  type: 'lookup';
  tableId: string;               // reference to a RateTable
  inputBasis: 'revenue' | 'margin' | 'units' | 'margin_percent';
}

/** Multiplier applied to other components (e.g. split credit) */
export interface MultiplierRule {
  type: 'multiplier';
  factor: number;                // e.g. 0.5 = 50% credit
  appliesTo: string[] | 'all';  // component IDs or all
}

/** Formula not yet defined — shows component label with $0 / pending */
export interface PlaceholderRule {
  type: 'placeholder';
  description?: string;          // "Awaiting formula from client"
}

/** Bonus applied when items from all required categories are present in the sale */
export interface BundleBonusRule {
  type: 'bundle_bonus';
  amount: number;                  // flat $ per complete bundle
  requiredCategories: string[];    // all must be present for bonus
  label: string;                   // "Sleep System Bundle"
}

export type Rule =
  | PercentOfRule
  | FixedPerMatchRule
  | TieredRule
  | LookupRule
  | MultiplierRule
  | PlaceholderRule
  | BundleBonusRule;

/* ── Supporting Types ───────────────────────────────────── */

export interface TierStep {
  min: number;                   // cumulative threshold (inclusive)
  rate: number;
}

export interface ItemMatcher {
  field: 'tag' | 'category' | 'sku';
  value: string;
}

export interface RateTable {
  id: string;
  name: string;
  rows: { min: number; max: number; rate: number }[];
}

/* ── Component Config ───────────────────────────────────── */

export interface ComponentConfig {
  id: string;
  label: string;                 // displayed in UI (e.g. "Base Comm.")
  rule: Rule;
  group?: 'commission' | 'spiff' | 'bonus' | 'other';
  splitAware?: boolean;          // default true — respects split multiplier
  visible?: boolean;             // default true — show in UI
}

/* ── Summary Metric Config ──────────────────────────────── */

export type MetricBasis =
  | 'total_revenue'
  | 'total_cost'
  | 'gross_margin_dollar'
  | 'gross_margin_percent'
  | 'total_commission'
  | 'item_count'
  | 'unit_count';

export interface SummaryMetricConfig {
  id: string;
  label: string;                 // "Total Revenue", "Gross Margin %"
  basis: MetricBasis;
  format: 'currency' | 'percent' | 'number';
}

/* ── Threshold Config ───────────────────────────────────── */

export interface ThresholdConfig {
  enabled: boolean;
  label: string;                 // "Amount Needed for Next Tier"
  basisComponentId: string;      // which component drives tiers
  showPotentialAtNextTier: boolean;
  potentialLabel?: string;       // "Potential Base Comm. at Next Tier"
}

/* ── Client Config (the master configuration) ───────────── */

export interface ClientConfig {
  id: string;
  name: string;
  logo?: string;                 // URL or component key
  theme?: {
    primary: string;             // hex color
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  components: ComponentConfig[];
  summaryMetrics: SummaryMetricConfig[];
  thresholds?: ThresholdConfig;
  rateTables?: RateTable[];
  notes?: string[];              // displayed as info banners
  splitConfig?: {
    enabled: boolean;
    defaultFactor: number;
    label: string;
  };
}

/* ── Sale Items ─────────────────────────────────────────── */

export interface SaleItem {
  id: string;
  name: string;
  sku?: string;
  category: string;
  tags: string[];
  price: number;
  cost: number;
  quantity: number;
}

/* ── YTD / Period Context ───────────────────────────────── */

export interface PeriodContext {
  revenue: number;
  cost: number;
  margin: number;
  units: number;
  periodStart: string;
  periodEnd: string;
  target?: number;               // for attainment %
}

/* ── Calculation Results ────────────────────────────────── */

export interface ComponentResult {
  componentId: string;
  label: string;
  group: string;
  amount: number;
  detail: string;                // human-readable breakdown
  rule: Rule['type'];
}

export interface ThresholdResult {
  currentTier: number;
  currentRate: number;
  nextTierMin: number | null;
  amountToNextTier: number | null;
  nextTierRate: number | null;
  potentialAtNextTier: number | null;
}

export interface SummaryMetricResult {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'percent' | 'number';
}

export interface CalculationResult {
  clientId: string;
  saleTotal: number;
  totalCost: number;
  grossMargin: number;
  grossMarginPercent: number;
  totalCommission: number;
  components: ComponentResult[];
  summaryMetrics: SummaryMetricResult[];
  threshold: ThresholdResult | null;
}
