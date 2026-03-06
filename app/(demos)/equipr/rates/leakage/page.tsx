'use client';


import {
  LEAKAGE_SUMMARY,
  LEAKAGE_ITEMS,
  REP_LEAKAGE,
  LEAKAGE_BY_CATEGORY,
  LEAKAGE_TREND,
  TOP_OFFENDING_ACCOUNTS,
} from '@/data/equipr/rates';
import type { LeakageBadge, LeakageItem } from '@/data/equipr/rates';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Cell,
} from 'recharts';

/* ── Helpers ──────────────────────────────────────────────── */

function fmtK(n: number): string {
  return `$${(n / 1e3).toFixed(1)}K`;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

/* ── Dark Tooltip ─────────────────────────────────────────── */

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#111827',
  fontSize: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
};

/* ── Badge colors ─────────────────────────────────────────── */

const BADGE_STYLES: Record<LeakageBadge, { bg: string; text: string }> = {
  REPEAT: { bg: 'rgba(249,115,22,0.10)', text: '#EA580C' },
  PATTERN: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
  NEW: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB' },
  WATCH: { bg: 'rgba(139,92,246,0.10)', text: '#7C3AED' },
};

/* ── Sorted leakage items (descending by amount) ──────────── */

const sortedItems = [...LEAKAGE_ITEMS].sort((a, b) => b.amountLost - a.amountLost);

/* ── Bar color gradient (darkest = highest amount) ────────── */

const BAR_REDS = ['#DC2626', '#E53E3E', '#EF4444', '#F87171', '#FCA5A5'];

/* ── Top offending max for proportional bars ──────────────── */

const topAccountMax = Math.max(...TOP_OFFENDING_ACCOUNTS.map((a) => a.amount));

/* ── Source Badge ─────────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
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

export default function RateLeakagePage() {
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
            Rate Leakage Dashboard
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Identifying revenue loss from unauthorized discounts, missed fees, and below-floor pricing
          </p>
          <SourceBadge source="Wynne Systems ERP" synced="2 min ago" />
        </div>
        <div
          className="text-[12px] font-mono font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(220,38,38,0.12)',
            color: '#EF4444',
            border: '1px solid rgba(220,38,38,0.25)',
          }}
        >
          Feb 2026
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 1: Hero KPIs
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Leakage — dominant card */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid rgba(220,38,38,0.35)',
            boxShadow: '0 0 20px rgba(220,38,38,0.08), var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-10 rounded-r"
            style={{ background: '#DC2626' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Total Leakage
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-bold"
              style={{
                color: '#DC2626',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {fmtK(LEAKAGE_SUMMARY.total)}
            </span>
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#EF4444',
              }}
            >
              {'\u25B2'}{LEAKAGE_SUMMARY.momChange}% MoM
            </span>
          </div>
          <div
            className="text-[11px] mt-1.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            this month alone
          </div>
        </div>

        {/* Unauthorized Discounts */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-8 rounded-r"
            style={{ background: '#EF4444' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Unauthorized Discounts
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#EF4444',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {fmtK(LEAKAGE_SUMMARY.unauthorizedDiscounts.amount)}
          </div>
          <div
            className="text-[11px] mt-1.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {LEAKAGE_SUMMARY.unauthorizedDiscounts.orders} orders
          </div>
        </div>

        {/* Missed Fees */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-8 rounded-r"
            style={{ background: '#F97316' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Missed Fees
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#F97316',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {fmtK(LEAKAGE_SUMMARY.missedFees.amount)}
          </div>
          <div
            className="text-[11px] mt-1.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {LEAKAGE_SUMMARY.missedFees.jobs} jobs
          </div>
        </div>

        {/* Below-Floor Rates */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-8 rounded-r"
            style={{ background: '#F59E0B' }}
          />
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Below-Floor Rates
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#F59E0B',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {fmtK(LEAKAGE_SUMMARY.belowFloor.amount)}
          </div>
          <div
            className="text-[11px] mt-1.5"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {LEAKAGE_SUMMARY.belowFloor.transactions} transactions
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2: Two charts side by side
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: Leakage by Category — Horizontal Bar */}
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
            Leakage by Category
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={LEAKAGE_BY_CATEGORY}
              layout="vertical"
              margin={{ top: 5, right: 40, bottom: 5, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: '#374151', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [fmtDollar(Number(value)), 'Leakage']}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {LEAKAGE_BY_CATEGORY.map((_entry, i) => (
                  <Cell key={i} fill={BAR_REDS[i] || BAR_REDS[BAR_REDS.length - 1]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Leakage Trend — Stacked Area */}
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
            Leakage Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={LEAKAGE_TREND}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <defs>
                <linearGradient id="gradDiscount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradFees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradFloor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
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
                    discounts: 'Discounts',
                    fees: 'Missed Fees',
                    belowFloor: 'Below-Floor',
                  };
                  return [fmtDollar(Number(value)), labels[String(name)] || String(name)];
                }}
              />
              <Area
                type="monotone"
                dataKey="discounts"
                stackId="1"
                stroke="#DC2626"
                strokeWidth={2}
                fill="url(#gradDiscount)"
              />
              <Area
                type="monotone"
                dataKey="fees"
                stackId="1"
                stroke="#F97316"
                strokeWidth={2}
                fill="url(#gradFees)"
              />
              <Area
                type="monotone"
                dataKey="belowFloor"
                stackId="1"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#gradFloor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 3: Leakage Detail Table
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
            Leakage Detail
          </h3>
          <span
            className="text-[11px] font-mono"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Sort: Impact {'\u25BE'}
          </span>
        </div>

        {/* Rows */}
        {sortedItems.map((item, i) => (
          <LeakageRow key={item.id} item={item} rank={i} total={sortedItems.length} />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: Bottom two panels
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Leakage by Rep — Horizontal Bar */}
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
            Leakage by Rep
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={REP_LEAKAGE}
              layout="vertical"
              margin={{ top: 5, right: 40, bottom: 5, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="rep"
                tick={{ fill: '#374151', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [fmtDollar(Number(value)), 'Leakage']}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={24}>
                {REP_LEAKAGE.map((_entry, i) => (
                  <Cell key={i} fill={BAR_REDS[i] || BAR_REDS[BAR_REDS.length - 1]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Top Offending Accounts — Ranked List */}
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
            Top Offending Accounts
          </h3>
          <div className="flex flex-col gap-3">
            {TOP_OFFENDING_ACCOUNTS.map((acct, i) => {
              const pct = (acct.amount / topAccountMax) * 100;
              const isTop = i === 0;
              return (
                <div key={acct.accountName} className="relative">
                  {/* Background proportional bar */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: isTop
                        ? 'rgba(220,38,38,0.12)'
                        : 'rgba(220,38,38,0.06)',
                      width: `${pct}%`,
                    }}
                  />
                  <div
                    className="relative flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{
                      border: isTop
                        ? '1px solid rgba(220,38,38,0.25)'
                        : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Rank */}
                    <span
                      className="text-[12px] font-bold font-mono w-6 shrink-0"
                      style={{
                        color: isTop ? '#EF4444' : 'var(--prizym-text-muted)',
                      }}
                    >
                      #{i + 1}
                    </span>

                    {/* Account Name */}
                    <span
                      className="flex-1 text-[13px] font-semibold"
                      style={{
                        color: isTop
                          ? 'var(--prizym-text-primary)'
                          : 'var(--prizym-text-secondary)',
                      }}
                    >
                      {acct.accountName}
                    </span>

                    {/* Incidents */}
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: 'var(--prizym-text-muted)' }}
                    >
                      {acct.incidents} incidents
                    </span>

                    {/* Amount */}
                    <span
                      className="text-[13px] font-bold font-mono shrink-0"
                      style={{ color: '#EF4444' }}
                    >
                      {fmtDollar(acct.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Leakage Detail Row Component
   ════════════════════════════════════════════════════════════ */

function LeakageRow({
  item,
  rank,
  total,
}: {
  item: LeakageItem;
  rank: number;
  total: number;
}) {
  const badge = BADGE_STYLES[item.badge];
  // Top 3 items get more prominent red left borders
  const borderIntensity = rank < 3 ? 0.6 : rank < 6 ? 0.35 : 0.15;

  return (
    <div
      className="px-5 py-3.5"
      style={{
        borderLeft: `3px solid rgba(220,38,38,${borderIntensity})`,
        borderBottom:
          rank < total - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
        background:
          rank % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
      }}
    >
      {/* Line 1: Account + Issue + Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: '#DC2626' }}
        />
        <span
          className="text-[13px] font-semibold"
          style={{ color: 'var(--prizym-text-primary)' }}
        >
          {item.accountName}
        </span>
        <span
          className="text-[12px]"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          {'\u2014'}
        </span>
        <span
          className="text-[12px]"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          {item.issue}
        </span>
        {item.badge && (
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: badge.bg,
              color: badge.text,
            }}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Line 2: Rep | Location | Amount | Occurrences */}
      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
        <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
          Rep:
        </span>
        <span
          className="text-[11px] font-medium"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          {item.rep}
        </span>
        <span className="text-[11px] mx-1" style={{ color: 'rgba(0,0,0,0.15)' }}>
          |
        </span>
        <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
          {item.location}
        </span>
        <span className="text-[11px] mx-1" style={{ color: 'rgba(0,0,0,0.15)' }}>
          |
        </span>
        <span
          className="text-[11px] font-bold"
          style={{ color: '#EF4444' }}
        >
          {fmtDollar(item.amountLost)} lost
        </span>
        <span className="text-[11px] mx-1" style={{ color: 'rgba(0,0,0,0.15)' }}>
          |
        </span>
        <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
          {item.occurrences} {item.type === 'missed_fee' ? 'jobs' : 'orders'}
        </span>
      </div>

      {/* Line 3: Rate comparison (only for items with rate data) */}
      {item.rateCharged != null && item.rateFloor != null && (
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
            Charged: ${item.rateCharged}/day
          </span>
          <span className="text-[11px] mx-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
            {'\u2192'}
          </span>
          <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
            Floor: ${item.rateFloor}/day
          </span>
          <span
            className="text-[10px] font-bold font-mono ml-1.5 px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(239,68,68,0.12)',
              color: '#EF4444',
            }}
          >
            -${item.rateFloor - item.rateCharged}/day gap
          </span>
        </div>
      )}
    </div>
  );
}
