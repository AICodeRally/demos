'use client';


import {
  SALES_REPS,
  COMP_KPIS,
  COMP_VS_LEAKAGE,
  PLAN_COMPARISON,
  COMPLIANCE_TREND,
  LEAKAGE_IMPACT_PROJECTION,
} from '@/data/equipr/sales-comp';
import type { CompPlanType } from '@/data/equipr/sales-comp';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  Trophy,
  DollarSign,
  Target,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Users,
  ShieldCheck,
} from 'lucide-react';

/* ── Helpers ──────────────────────────────────────────────── */

function fmtK(n: number): string {
  return `$${(n / 1e3).toFixed(1)}K`;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

/* ── Tooltip style ───────────────────────────────────────── */

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#111827',
  fontSize: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
};

/* ── Plan badge styles ───────────────────────────────────── */

const PLAN_BADGE: Record<CompPlanType, { bg: string; text: string; label: string }> = {
  traditional: { bg: 'rgba(100,116,139,0.12)', text: '#64748B', label: 'Traditional' },
  'ai-optimized': { bg: 'rgba(16,185,129,0.12)', text: '#059669', label: 'AI-Optimized' },
};

/* ── Chart data: grouped bars for commission vs leakage ───── */

const chartCommVsLeak = COMP_VS_LEAKAGE.map((d) => ({
  name: d.name,
  Commission: d.commission,
  Leakage: d.leakage,
  planType: d.planType,
}));

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

export default function SalesCompPage() {
  const trad = PLAN_COMPARISON.traditional;
  const ai = PLAN_COMPARISON.aiOptimized;
  const proj = LEAKAGE_IMPACT_PROJECTION;

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
            Sales Compensation & Rate Impact
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            How comp plan structure drives rate compliance — and eliminates leakage
          </p>
          <SourceBadge source="Wynne Systems + Point of Rental" synced="5 min ago" />
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(16,185,129,0.12)',
            color: '#059669',
            border: '1px solid rgba(16,185,129,0.25)',
          }}
        >
          Feb 2026
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 1: Hero KPIs (4 cards)
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Team Revenue */}
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
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Team Revenue
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#2563EB',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {fmtK(COMP_KPIS.totalTeamRevenue)}
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <DollarSign size={11} /> MTD across 5 reps
          </div>
        </div>

        {/* Total Leakage */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid rgba(220,38,38,0.25)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#DC2626' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Total Leakage
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#DC2626',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {fmtK(COMP_KPIS.totalLeakage)}
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <TrendingDown size={11} /> See Leakage Analysis
          </div>
        </div>

        {/* AI Plan Reps */}
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
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            AI Plan Reps
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#10B981',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {COMP_KPIS.aiPlanReps}/{COMP_KPIS.totalReps}
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <Users size={11} /> On AI-optimized comp
          </div>
        </div>

        {/* Leakage Reduction */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid rgba(5,150,105,0.25)',
            boxShadow: '0 0 16px rgba(16,185,129,0.06), var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
            style={{ background: '#059669' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Leakage Reduction
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: '#059669',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              -{COMP_KPIS.leakageReductionAiPlan}%
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5 flex items-center gap-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            <ShieldCheck size={11} /> AI-optimized vs traditional
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2: The Comp-Leakage Connection
          ════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <h2
          className="text-[15px] font-bold mb-3"
          style={{
            color: 'var(--prizym-text-primary)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          The Comp-Leakage Connection
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Traditional Plan Card */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(100,116,139,0.12)' }}
              >
                <DollarSign size={16} style={{ color: '#64748B' }} />
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold"
                  style={{
                    color: 'var(--prizym-text-primary)',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {trad.label}
                </h3>
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Volume-only incentive
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <CompRow
                icon={<DollarSign size={13} />}
                label="Base Commission"
                value={trad.baseCommission}
                color="#64748B"
              />
              <CompRow
                icon={<XCircle size={13} />}
                label="Rate Compliance Bonus"
                value={trad.rateBonus}
                color="#94A3B8"
                muted
              />
              <CompRow
                icon={<XCircle size={13} />}
                label="Leakage Penalty"
                value={trad.leakagePenalty}
                color="#94A3B8"
                muted
              />

              <div
                className="mt-3 pt-3"
                style={{ borderTop: '1px solid var(--prizym-border-default)' }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <StatBox
                    label="Avg Leakage/Rep"
                    value={fmtDollar(trad.avgLeakagePerRep)}
                    subLabel="/month"
                    color="#EF4444"
                  />
                  <StatBox
                    label="Avg Compliance"
                    value={`${trad.avgComplianceScore}%`}
                    color="#F59E0B"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI-Optimized Plan Card */}
          <div
            className="rounded-xl p-5 relative"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid rgba(16,185,129,0.35)',
              boxShadow: '0 0 24px rgba(16,185,129,0.08), var(--prizym-shadow-card)',
            }}
          >
            {/* Recommended badge */}
            <div
              className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
              style={{
                background: 'rgba(16,185,129,0.12)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            >
              Recommended
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)' }}
              >
                <Trophy size={16} style={{ color: '#059669' }} />
              </div>
              <div>
                <h3
                  className="text-[14px] font-bold"
                  style={{
                    color: 'var(--prizym-text-primary)',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {ai.label}
                </h3>
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Rate compliance incentive
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <CompRow
                icon={<DollarSign size={13} />}
                label="Base Commission"
                value={ai.baseCommission}
                color="#059669"
              />
              <CompRow
                icon={<CheckCircle2 size={13} />}
                label="Rate Compliance Bonus"
                value={ai.rateBonus}
                color="#10B981"
              />
              <CompRow
                icon={<Target size={13} />}
                label="Leakage Penalty"
                value={ai.leakagePenalty}
                color="#F59E0B"
              />

              <div
                className="mt-3 pt-3"
                style={{ borderTop: '1px solid rgba(16,185,129,0.2)' }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <StatBox
                    label="Avg Leakage/Rep"
                    value={fmtDollar(ai.avgLeakagePerRep)}
                    subLabel="/month"
                    color="#10B981"
                  />
                  <StatBox
                    label="Avg Compliance"
                    value={`${ai.avgComplianceScore}%`}
                    color="#10B981"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "67% less leakage" callout */}
        <div
          className="flex items-center justify-center gap-3 mt-4 py-3 rounded-xl"
          style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.18)',
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{ color: '#64748B' }}
          >
            <span className="text-[13px] font-medium">
              ${(trad.avgLeakagePerRep / 1e3).toFixed(1)}K/rep
            </span>
          </div>
          <ArrowRight size={16} style={{ color: '#10B981' }} />
          <div
            className="flex items-center gap-2"
            style={{ color: '#059669' }}
          >
            <span className="text-[13px] font-medium">
              ${(ai.avgLeakagePerRep / 1e3).toFixed(1)}K/rep
            </span>
          </div>
          <span
            className="text-[13px] font-bold px-3 py-1 rounded-lg"
            style={{
              background: 'rgba(16,185,129,0.15)',
              color: '#059669',
            }}
          >
            67% less leakage
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 3: Two charts side by side
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: Commission vs Leakage by Rep */}
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
            Commission vs Leakage by Rep
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartCommVsLeak}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
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
                formatter={(value, name) => [
                  fmtDollar(Number(value)),
                  String(name),
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#6B7280' }}
              />
              <Bar
                dataKey="Commission"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="Leakage"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
          <div
            className="text-[11px] mt-2 text-center"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            AI-plan reps (Jake, Lisa, Carlos) show low leakage relative to commission earned
          </div>
        </div>

        {/* Right: Rate Compliance Trend */}
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
            Rate Compliance Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={COMPLIANCE_TREND}
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
                domain={[50, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    traditional: 'Traditional Reps',
                    aiOptimized: 'AI-Optimized Reps',
                  };
                  return [`${value}%`, labels[String(name)] || String(name)];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#6B7280' }}
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    traditional: 'Traditional Reps',
                    aiOptimized: 'AI-Optimized Reps',
                  };
                  return labels[value] || value;
                }}
              />
              <Line
                type="monotone"
                dataKey="traditional"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 3, fill: '#94A3B8', stroke: '#94A3B8' }}
              />
              <Line
                type="monotone"
                dataKey="aiOptimized"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981', stroke: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div
            className="text-[11px] mt-2 text-center"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            AI-optimized reps improve steadily; traditional stays flat around 65-68%
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: Rep Performance Cards
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
            Rep Performance
          </h3>
          <span
            className="text-[11px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Sort: Compliance {'\u25BE'}
          </span>
        </div>

        {/* Sorted reps: AI-optimized (high compliance) first, then traditional */}
        {[...SALES_REPS]
          .sort((a, b) => b.rateComplianceScore - a.rateComplianceScore)
          .map((rep, i, arr) => (
            <RepCard key={rep.id} rep={rep} index={i} total={arr.length} />
          ))}
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 5: Projection Banner (the wow moment)
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl p-6 relative overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid rgba(16,185,129,0.35)',
          boxShadow: '0 0 30px rgba(16,185,129,0.08), var(--prizym-shadow-card)',
        }}
      >
        {/* Subtle gradient accent along left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{
            background: 'linear-gradient(to bottom, #10B981, #059669)',
          }}
        />

        <div className="pl-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} style={{ color: '#059669' }} />
            <h3
              className="text-[16px] font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              If all reps moved to AI-Optimized compensation:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
            {/* Annual Leakage: Before → After */}
            <div>
              <div
                className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                Annual Leakage
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-xl font-bold tabular-nums line-through"
                  style={{ color: '#DC2626' }}
                >
                  {fmtDollar(proj.currentAnnualLeakage)}
                </span>
                <ArrowRight size={14} style={{ color: '#10B981' }} />
                <span
                  className="text-xl font-bold tabular-nums"
                  style={{ color: '#059669' }}
                >
                  {fmtDollar(proj.projectedAnnualLeakage)}
                </span>
              </div>
            </div>

            {/* Annual Savings */}
            <div>
              <div
                className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                Annual Savings
              </div>
              <span
                className="text-xl font-bold tabular-nums"
                style={{ color: '#059669' }}
              >
                {fmtDollar(proj.annualSavings)}
              </span>
            </div>

            {/* Net Revenue Lift */}
            <div>
              <div
                className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                Net Revenue Lift
              </div>
              <span
                className="text-2xl font-bold tabular-nums"
                style={{
                  color: '#059669',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {fmtDollar(proj.netRevenueLift)}/yr
              </span>
            </div>
          </div>

          {/* The punchline */}
          <div
            className="px-4 py-3 rounded-lg"
            style={{
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: 'var(--prizym-text-secondary)' }}
            >
              That&apos;s the equivalent of adding{' '}
              <span className="font-bold" style={{ color: '#059669' }}>
                2 new rental locations
              </span>
              {' '}worth of revenue — just by aligning comp with rate governance.
              No new trucks. No new yards. Just smarter incentives.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Helper Components
   ════════════════════════════════════════════════════════════ */

function CompRow({
  icon,
  label,
  value,
  color,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ color }}>{icon}</div>
      <span
        className="text-[12px] flex-1"
        style={{ color: muted ? 'var(--prizym-text-muted)' : 'var(--prizym-text-secondary)' }}
      >
        {label}
      </span>
      <span
        className="text-[12px] font-semibold"
        style={{ color: muted ? 'var(--prizym-text-muted)' : 'var(--prizym-text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}

function StatBox({
  label,
  value,
  subLabel,
  color,
}: {
  label: string;
  value: string;
  subLabel?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
    >
      <div
        className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
        style={{ color: 'var(--prizym-text-muted)' }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-[16px] font-bold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
        {subLabel && (
          <span
            className="text-[10px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Rep Performance Card ────────────────────────────────── */

function RepCard({
  rep,
  index,
  total,
}: {
  rep: (typeof SALES_REPS)[number];
  index: number;
  total: number;
}) {
  const badge = PLAN_BADGE[rep.compPlanType];
  const isAiPlan = rep.compPlanType === 'ai-optimized';
  const complianceColor =
    rep.rateComplianceScore >= 85
      ? '#10B981'
      : rep.rateComplianceScore >= 70
        ? '#F59E0B'
        : '#EF4444';

  return (
    <div
      className="px-5 py-4"
      style={{
        borderLeft: isAiPlan
          ? '3px solid rgba(16,185,129,0.5)'
          : '3px solid rgba(100,116,139,0.2)',
        borderBottom:
          index < total - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
        background:
          index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
      }}
    >
      {/* Row 1: Name, location, plan badge */}
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-[14px] font-semibold"
          style={{ color: 'var(--prizym-text-primary)' }}
        >
          {rep.name}
        </span>
        <span
          className="text-[11px]"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          {rep.location}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{
            background: badge.bg,
            color: badge.text,
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Row 2: Metrics grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Revenue */}
        <div>
          <div
            className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Revenue
          </div>
          <span
            className="text-[14px] font-bold tabular-nums"
            style={{ color: 'var(--prizym-text-primary)' }}
          >
            {fmtK(rep.ytdRevenue)}
          </span>
        </div>

        {/* Commission */}
        <div>
          <div
            className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Commission
          </div>
          <span
            className="text-[14px] font-bold tabular-nums"
            style={{ color: '#2563EB' }}
          >
            {fmtDollar(rep.ytdCommission)}
          </span>
        </div>

        {/* Leakage */}
        <div>
          <div
            className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Leakage
          </div>
          <span
            className="text-[14px] font-bold tabular-nums"
            style={{ color: rep.ytdLeakage > 5000 ? '#EF4444' : rep.ytdLeakage > 2000 ? '#F59E0B' : '#10B981' }}
          >
            {fmtDollar(rep.ytdLeakage)}
          </span>
        </div>

        {/* Rate Compliance */}
        <div>
          <div
            className="text-[10px] uppercase tracking-[1px] font-semibold mb-0.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Rate Compliance
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[14px] font-bold tabular-nums"
              style={{ color: complianceColor }}
            >
              {rep.rateComplianceScore}%
            </span>
            {/* Visual compliance bar */}
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${rep.rateComplianceScore}%`,
                  background: complianceColor,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Insight line for notable reps */}
      {rep.ytdLeakage >= 9000 && (
        <div
          className="mt-2 text-[11px] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5"
          style={{
            background: 'rgba(239,68,68,0.08)',
            color: '#DC2626',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <TrendingDown size={11} />
          High leakage erodes {fmtDollar(rep.ytdLeakage)} of {fmtK(rep.ytdRevenue)} revenue &mdash; comp plan switch recommended
        </div>
      )}
      {isAiPlan && rep.rateComplianceScore >= 89 && (
        <div
          className="mt-2 text-[11px] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5"
          style={{
            background: 'rgba(16,185,129,0.08)',
            color: '#059669',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <Trophy size={11} />
          Exemplary: {rep.rateComplianceScore}% compliance, only {fmtDollar(rep.ytdLeakage)} leakage
        </div>
      )}
      {rep.name === 'Jake Williams' && (
        <div
          className="mt-2 text-[11px] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5"
          style={{
            background: 'rgba(37,99,235,0.08)',
            color: '#2563EB',
            border: '1px solid rgba(37,99,235,0.15)',
          }}
        >
          <Target size={11} />
          Improving: compliance rose from 68% to 81% since switching to AI-optimized plan
        </div>
      )}
    </div>
  );
}
