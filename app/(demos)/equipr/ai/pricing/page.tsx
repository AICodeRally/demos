'use client';


import {
  PRICING_KPIS,
  PRICING_RECOMMENDATIONS,
  PRICING_TREND,
  DEMAND_HEATMAP,
  COMPETITOR_RATES,
  PRICING_BY_CATEGORY,
} from '@/data/equipr/ai-pricing';
import type { PricingRecommendation, DemandSignal } from '@/data/equipr/ai-pricing';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Zap,
  UserCheck,
} from 'lucide-react';

/* ── Helpers ──────────────────────────────────────────────── */

function fmtK(n: number): string {
  return `$${(n / 1e3).toFixed(1)}K`;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

/* ── Tooltip Style ────────────────────────────────────────── */

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#111827',
  fontSize: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
};

/* ── Demand Signal Badge Config ───────────────────────────── */

const SIGNAL_STYLES: Record<DemandSignal, { bg: string; text: string; label: string }> = {
  surge: { bg: 'rgba(220,38,38,0.12)', text: '#DC2626', label: 'SURGE' },
  high: { bg: 'rgba(249,115,22,0.10)', text: '#EA580C', label: 'HIGH' },
  normal: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB', label: 'NORMAL' },
  low: { bg: 'rgba(107,114,128,0.10)', text: '#6B7280', label: 'LOW' },
};

/* ── Category Badge Config ────────────────────────────────── */

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  heavy: { bg: 'rgba(220,38,38,0.10)', text: '#DC2626' },
  aerial: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB' },
  compaction: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
  power: { bg: 'rgba(16,185,129,0.10)', text: '#059669' },
  tools: { bg: 'rgba(139,92,246,0.10)', text: '#7C3AED' },
};

const CATEGORY_LABELS: Record<string, string> = {
  heavy: 'Heavy',
  aerial: 'Aerial',
  compaction: 'Compaction',
  power: 'Power',
  tools: 'Tools',
};

/* ── Sorted recommendations (descending by revenue impact) ── */

const sortedRecs = [...PRICING_RECOMMENDATIONS].sort(
  (a, b) => b.projectedRevenueImpact - a.projectedRevenueImpact,
);

/* ── Heatmap color ────────────────────────────────────────── */

function heatColor(value: number): { background: string; color: string } {
  if (value >= 85) return { background: 'rgba(220,38,38,0.70)', color: '#FFFFFF' };
  if (value >= 70) return { background: 'rgba(249,115,22,0.55)', color: '#FFFFFF' };
  if (value >= 50) return { background: 'rgba(245,158,11,0.40)', color: '#78350F' };
  if (value >= 30) return { background: 'rgba(245,158,11,0.20)', color: '#92400E' };
  return { background: 'rgba(107,114,128,0.08)', color: '#6B7280' };
}

/* ── Our current & AI recommended rates for competitor table ── */

const OUR_CURRENT = { excavator: 850, scissorLift: 385, generator: 275 };
const OUR_AI = { excavator: 1020, scissorLift: 440, generator: 345 };

/* ── Source Badge ─────────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>•</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */

export default function AiPricingPage() {
  return (
    <>
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            AI Dynamic Pricing Engine
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Real-time rate optimization driven by demand signals, competitor intelligence, and market conditions
          </p>
          <SourceBadge source="Rouse Analytics + Wynne Systems" synced="Live market data" />
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(16,185,129,0.12)',
            color: '#059669',
            border: '1px solid rgba(16,185,129,0.25)',
          }}
        >
          AI Active
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 1: Hero KPIs
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue Uplift */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#10B981' }}
          />
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} style={{ color: '#10B981' }} />
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Revenue Uplift
            </div>
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#10B981',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            +{PRICING_KPIS.revenueUplift}%
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            vs manual pricing
          </div>
        </div>

        {/* AI Revenue Gain */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#2563EB' }}
          />
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} style={{ color: '#2563EB' }} />
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              AI Revenue Gain
            </div>
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#2563EB',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {fmtK(PRICING_KPIS.revenueGain)}
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            this month
          </div>
        </div>

        {/* Rates Optimized */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#7C3AED' }}
          />
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} style={{ color: '#7C3AED' }} />
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Rates Optimized
            </div>
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#7C3AED',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {PRICING_KPIS.ratesOptimized}
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            decisions this month
          </div>
        </div>

        {/* Manual Overrides */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#9CA3AF' }}
          />
          <div className="flex items-center gap-2 mb-1">
            <UserCheck size={14} style={{ color: '#9CA3AF' }} />
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Manual Overrides
            </div>
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#6B7280',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {PRICING_KPIS.manualOverrides}
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            high trust = low overrides
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2: Two charts side by side
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: AI vs Manual Revenue */}
        <div
          className="rounded-xl p-5"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <h3
            className="text-[13px] font-bold mb-4"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            AI vs Manual Revenue
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={PRICING_TREND}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    manualRevenue: 'Manual',
                    aiRevenue: 'AI-Optimized',
                  };
                  return [fmtDollar(Number(value)), labels[String(name)] || String(name)];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#6B7280' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    manualRevenue: 'Manual',
                    aiRevenue: 'AI-Optimized',
                  };
                  return labels[value] || value;
                }}
              />
              <Bar
                dataKey="manualRevenue"
                fill="#D1D5DB"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="aiRevenue"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Demand Heatmap (table, not chart) */}
        <div
          className="rounded-xl p-5"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <h3
            className="text-[13px] font-bold mb-4"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Demand Heatmap
          </h3>

          {/* Column headers */}
          <div
            className="grid gap-2 mb-2"
            style={{ gridTemplateColumns: '56px 1fr 1fr 1fr' }}
          >
            <div />
            {['Morning', 'Afternoon', 'Evening'].map((label) => (
              <div
                key={label}
                className="text-[10px] uppercase tracking-[1.5px] tabular-nums text-center"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2">
            {DEMAND_HEATMAP.map((row) => (
              <div
                key={row.day}
                className="grid gap-2 items-center"
                style={{ gridTemplateColumns: '56px 1fr 1fr 1fr' }}
              >
                <div
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--prizym-text-secondary)' }}
                >
                  {row.day}
                </div>
                {[row.morning, row.afternoon, row.evening].map((val, i) => {
                  const heat = heatColor(val);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded-lg py-3 text-[12px] font-semibold"
                      style={{
                        background: heat.background,
                        color: heat.color,
                        minHeight: 28,
                      }}
                    >
                      {val}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Intensity:
            </span>
            {[
              { label: 'Low', bg: 'rgba(107,114,128,0.08)' },
              { label: 'Med', bg: 'rgba(245,158,11,0.20)' },
              { label: 'High', bg: 'rgba(249,115,22,0.55)' },
              { label: 'Peak', bg: 'rgba(220,38,38,0.70)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="h-3 w-3 rounded"
                  style={{ background: item.bg }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 3: Active Price Recommendations
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: '#F3F4F6',
            borderBottom: '1px solid var(--prizym-border-default)',
          }}
        >
          <h3
            className="text-[13px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Active Price Recommendations
          </h3>
          <span
            className="text-[11px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Sort: Revenue Impact {'\u25BE'}
          </span>
        </div>

        {/* Rows */}
        {sortedRecs.map((rec, i) => (
          <RecommendationRow key={rec.id} rec={rec} rank={i} total={sortedRecs.length} />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: Competitor Rate Comparison
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: '#F3F4F6',
            borderBottom: '1px solid var(--prizym-border-default)',
          }}
        >
          <h3
            className="text-[13px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Competitor Rate Comparison
          </h3>
          <span
            className="text-[11px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Daily rates
          </span>
        </div>

        {/* Table Header */}
        <div
          className="grid gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[1.5px] font-semibold"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            color: 'var(--prizym-text-muted)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div>Competitor</div>
          <div className="text-right">Excavator/day</div>
          <div className="text-right">Scissor Lift/day</div>
          <div className="text-right">Generator/day</div>
        </div>

        {/* Our Current Row */}
        <div
          className="grid gap-2 px-5 py-3 items-center text-[13px]"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            background: 'rgba(37,99,235,0.06)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            borderLeft: '3px solid #2563EB',
          }}
        >
          <div>
            <span
              className="font-semibold"
              style={{ color: '#2563EB' }}
            >
              Blue Horizons
            </span>
            <span
              className="text-[10px] ml-2 px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(37,99,235,0.12)', color: '#2563EB' }}
            >
              CURRENT
            </span>
          </div>
          <div className="text-right tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
            ${OUR_CURRENT.excavator}
          </div>
          <div className="text-right tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
            ${OUR_CURRENT.scissorLift}
          </div>
          <div className="text-right tabular-nums" style={{ color: 'var(--prizym-text-primary)' }}>
            ${OUR_CURRENT.generator}
          </div>
        </div>

        {/* Our AI Recommended Row */}
        <div
          className="grid gap-2 px-5 py-3 items-center text-[13px]"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            background: 'rgba(16,185,129,0.06)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            borderLeft: '3px solid #10B981',
          }}
        >
          <div>
            <span
              className="font-semibold"
              style={{ color: '#059669' }}
            >
              Blue Horizons
            </span>
            <span
              className="text-[10px] ml-2 px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}
            >
              AI REC
            </span>
          </div>
          <div className="text-right tabular-nums font-semibold" style={{ color: '#059669' }}>
            ${OUR_AI.excavator}
          </div>
          <div className="text-right tabular-nums font-semibold" style={{ color: '#059669' }}>
            ${OUR_AI.scissorLift}
          </div>
          <div className="text-right tabular-nums font-semibold" style={{ color: '#059669' }}>
            ${OUR_AI.generator}
          </div>
        </div>

        {/* Competitor Rows */}
        {COMPETITOR_RATES.map((comp, i) => (
          <div
            key={comp.competitor}
            className="grid gap-2 px-5 py-3 items-center text-[13px]"
            style={{
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
              borderBottom:
                i < COMPETITOR_RATES.length - 1
                  ? '1px solid rgba(0,0,0,0.06)'
                  : 'none',
            }}
          >
            <div
              className="font-medium"
              style={{ color: 'var(--prizym-text-secondary)' }}
            >
              {comp.competitor}
            </div>
            <div className="text-right tabular-nums" style={{ color: 'var(--prizym-text-secondary)' }}>
              ${comp.excavator}
            </div>
            <div className="text-right tabular-nums" style={{ color: 'var(--prizym-text-secondary)' }}>
              ${comp.scissorLift}
            </div>
            <div className="text-right tabular-nums" style={{ color: 'var(--prizym-text-secondary)' }}>
              ${comp.generator}
            </div>
          </div>
        ))}

        {/* Category Uplift Summary Strip */}
        <div
          className="px-5 py-3"
          style={{
            background: '#F9FAFB',
            borderTop: '1px solid var(--prizym-border-default)',
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            AI Uplift by Category
          </div>
          <div className="flex flex-wrap gap-3">
            {PRICING_BY_CATEGORY.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.15)',
                }}
              >
                <span
                  className="text-[11px] font-medium"
                  style={{ color: 'var(--prizym-text-secondary)' }}
                >
                  {cat.category}
                </span>
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: '#059669' }}
                >
                  +{cat.uplift}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Recommendation Row Component
   ════════════════════════════════════════════════════════════ */

function RecommendationRow({
  rec,
  rank,
  total,
}: {
  rec: PricingRecommendation;
  rank: number;
  total: number;
}) {
  const signal = SIGNAL_STYLES[rec.demandSignal];
  const catColor = CATEGORY_COLORS[rec.assetCategory] || CATEGORY_COLORS.tools;
  const catLabel = CATEGORY_LABELS[rec.assetCategory] || rec.assetCategory;
  const isSurge = rec.demandSignal === 'surge';
  const isPositive = rec.changePercent > 0;

  return (
    <div
      className="px-5 py-4"
      style={{
        borderBottom:
          rank < total - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
        background: isSurge
          ? 'rgba(220,38,38,0.03)'
          : rank % 2 === 0
          ? 'transparent'
          : 'rgba(0,0,0,0.015)',
      }}
    >
      {/* Line 1: Asset name, category badge, demand signal, confidence */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Pulsing dot for surge */}
        {isSurge ? (
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{
                background: '#DC2626',
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: '#DC2626' }}
            />
          </span>
        ) : (
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{
              background:
                rec.demandSignal === 'high'
                  ? '#EA580C'
                  : rec.demandSignal === 'normal'
                  ? '#2563EB'
                  : '#9CA3AF',
            }}
          />
        )}

        {/* Asset name */}
        <span
          className="text-[13px] font-semibold"
          style={{ color: 'var(--prizym-text-primary)' }}
        >
          {rec.assetName}
        </span>

        {/* Category badge */}
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            background: catColor.bg,
            color: catColor.text,
          }}
        >
          {catLabel}
        </span>

        {/* Demand signal badge */}
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            background: signal.bg,
            color: signal.text,
          }}
        >
          {signal.label}
        </span>

        {/* Confidence */}
        <span
          className="text-[10px] ml-auto"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          {(rec.confidence * 100).toFixed(0)}% confidence
        </span>
      </div>

      {/* Line 2: Rate change + Revenue impact */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {/* Current rate */}
        <span
          className="text-[12px]"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          ${rec.currentRate}/day
        </span>

        {/* Arrow */}
        <span
          className="text-[12px]"
          style={{
            color: isPositive ? '#10B981' : rec.changePercent < 0 ? '#6B7280' : 'var(--prizym-text-muted)',
          }}
        >
          {'\u2192'}
        </span>

        {/* Recommended rate */}
        <span
          className="text-[13px] font-bold tabular-nums"
          style={{
            color: isPositive ? '#10B981' : rec.changePercent < 0 ? '#6B7280' : 'var(--prizym-text-secondary)',
          }}
        >
          ${rec.recommendedRate}/day
        </span>

        {/* Change percent badge */}
        {rec.changePercent !== 0 && (
          <span
            className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded"
            style={{
              background: isPositive
                ? 'rgba(16,185,129,0.12)'
                : 'rgba(107,114,128,0.10)',
              color: isPositive ? '#059669' : '#6B7280',
            }}
          >
            {isPositive ? '+' : ''}{rec.changePercent.toFixed(1)}%
          </span>
        )}

        {/* Spacer */}
        <span className="text-[11px] mx-1" style={{ color: 'rgba(0,0,0,0.15)' }}>
          |
        </span>

        {/* Projected revenue impact */}
        <span
          className="text-[12px] font-bold tabular-nums"
          style={{
            color: rec.projectedRevenueImpact > 0
              ? '#10B981'
              : rec.projectedRevenueImpact < 0
              ? '#EF4444'
              : 'var(--prizym-text-muted)',
          }}
        >
          {rec.projectedRevenueImpact > 0 ? '+' : ''}
          {fmtDollar(rec.projectedRevenueImpact)} projected
        </span>
      </div>

      {/* Line 3: AI reasoning quote */}
      <div
        className="mt-2 pl-4 text-[12px] italic leading-relaxed"
        style={{
          color: 'var(--prizym-text-secondary)',
          borderLeft: '2px solid rgba(0,0,0,0.08)',
        }}
      >
        &ldquo;{rec.reason}&rdquo;
      </div>
    </div>
  );
}
