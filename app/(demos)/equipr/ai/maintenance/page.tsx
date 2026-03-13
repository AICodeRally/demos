'use client';

import { useState } from 'react';

import {
  PREDICTIONS,
  MAINTENANCE_SAVINGS,
  MAINTENANCE_TREND,
  COMPONENT_FAILURE_RATES,
  RISK_COLORS,
} from '@/data/equipr/ai-maintenance';
import type { MaintenancePrediction, RiskLevel } from '@/data/equipr/ai-maintenance';
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
import {
  Activity,
  AlertTriangle,
  Shield,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  User,
  Gauge,
  Wrench,
  Brain,
} from 'lucide-react';

/* ── Helpers ────────────────────────────────────────────────── */

function fmtK(n: number): string {
  return `$${(n / 1e3).toFixed(1)}K`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function daysUntil(dateStr: string): number {
  const now = new Date('2026-02-26');
  const target = new Date(dateStr);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

/* ── Shared Tooltip Style ───────────────────────────────────── */

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#111827',
  fontSize: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
};

/* ── Sorted Predictions (critical first) ────────────────────── */

const RISK_ORDER: Record<RiskLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const sortedPredictions = [...PREDICTIONS].sort(
  (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
);

/* ── Accuracy chart colors ──────────────────────────────────── */

const ACCURACY_BARS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#60A5FA', '#3B82F6', '#2563EB'];

/* ── Trend area gradients ───────────────────────────────────── */

const TREND_COLORS = {
  predicted: '#8B5CF6',
  prevented: '#10B981',
  missed: '#EF4444',
};

/* ════════════════════════════════════════════════════════════
   KPI Card
   ════════════════════════════════════════════════════════════ */

interface KpiCardProps {
  label: string;
  value: string;
  accent: string;
  icon: React.ReactNode;
  delta?: string;
  deltaUp?: boolean;
  sub?: string;
}

function KpiCard({ label, value, accent, icon, delta, deltaUp, sub }: KpiCardProps) {
  return (
    <div
      className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute top-4 left-0 w-[3px] h-8 rounded-r"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {label}
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {value}
            </span>
            {delta && (
              <span
                className="text-xs font-semibold"
                style={{ color: deltaUp ? '#10B981' : '#EF4444' }}
              >
                {deltaUp ? '\u25B2' : '\u25BC'} {delta}
              </span>
            )}
          </div>
          {sub && (
            <div
              className="text-[11px] mt-1.5"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {sub}
            </div>
          )}
        </div>
        <div
          className="p-2 rounded-lg"
          style={{
            background: `${accent}18`,
            color: accent,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Prediction Card (Expandable)
   ════════════════════════════════════════════════════════════ */

function PredictionCard({ prediction }: { prediction: MaintenancePrediction }) {
  const [expanded, setExpanded] = useState(false);
  const risk = RISK_COLORS[prediction.riskLevel];
  const days = daysUntil(prediction.predictedFailureDate);
  const hoursPct = Math.round(
    (prediction.currentHoursUsed / prediction.failureThresholdHours) * 100
  );

  return (
    <div
      className="rounded-xl transition-shadow hover:shadow-lg cursor-pointer"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
        borderLeft: `4px solid ${risk.border}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Main row */}
      <div className="p-4 flex items-center gap-4">
        {/* Pulsing dot for critical */}
        <div className="shrink-0 relative">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: risk.dot }}
          />
          {prediction.riskLevel === 'critical' && (
            <div
              className="absolute inset-0 h-3 w-3 rounded-full animate-ping"
              style={{ background: risk.dot, opacity: 0.5 }}
            />
          )}
        </div>

        {/* Asset + Component */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[13px] font-bold"
              style={{ color: 'var(--prizym-text-primary)' }}
            >
              {prediction.assetName}
            </span>
            <span
              className="text-[11px]"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {prediction.assetId}
            </span>
          </div>
          <div
            className="text-[12px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            {prediction.component}
          </div>
        </div>

        {/* Risk badge */}
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: risk.bg,
            color: risk.text,
          }}
        >
          {prediction.riskLevel}
        </span>

        {/* Confidence */}
        <div className="text-center shrink-0 hidden sm:block">
          <div
            className="text-[10px] uppercase tracking-[1px] font-semibold"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Confidence
          </div>
          <div
            className="text-[14px] font-bold tabular-nums"
            style={{ color: 'var(--prizym-text-primary)' }}
          >
            {(prediction.confidenceScore * 100).toFixed(0)}%
          </div>
        </div>

        {/* Days until failure */}
        <div className="text-center shrink-0 hidden sm:block">
          <div
            className="text-[10px] uppercase tracking-[1px] font-semibold"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Failure in
          </div>
          <div
            className="text-[14px] font-bold tabular-nums"
            style={{
              color:
                days <= 7 ? '#DC2626' : days <= 14 ? '#EA580C' : 'var(--prizym-text-primary)',
            }}
          >
            {days}d
          </div>
        </div>

        {/* Expand arrow */}
        <div style={{ color: 'var(--prizym-text-muted)' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-0"
          style={{
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Prescribed Action */}
            <div>
              <div
                className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2 flex items-center gap-1.5"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                <Wrench size={12} />
                Prescribed Action
              </div>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: 'var(--prizym-text-secondary)' }}
              >
                {prediction.prescribedAction}
              </p>

              {/* Technician */}
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="p-1.5 rounded-md"
                  style={{
                    background: 'rgba(37,99,235,0.08)',
                    color: '#2563EB',
                  }}
                >
                  <User size={12} />
                </div>
                <div>
                  <div
                    className="text-[10px] uppercase tracking-[1px] font-semibold"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    Recommended Tech
                  </div>
                  <div
                    className="text-[12px] font-semibold"
                    style={{ color: 'var(--prizym-text-primary)' }}
                  >
                    {prediction.technicianRecommended}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Metrics */}
            <div className="flex flex-col gap-3">
              {/* Hours gauge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[10px] uppercase tracking-[1.5px] font-semibold flex items-center gap-1.5"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    <Gauge size={12} />
                    Hours Used vs Threshold
                  </span>
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{
                      color:
                        hoursPct >= 90
                          ? '#DC2626'
                          : hoursPct >= 75
                          ? '#EA580C'
                          : 'var(--prizym-text-secondary)',
                    }}
                  >
                    {prediction.currentHoursUsed.toLocaleString()} / {prediction.failureThresholdHours.toLocaleString()} hrs
                  </span>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(hoursPct, 100)}%`,
                      background:
                        hoursPct >= 90
                          ? '#DC2626'
                          : hoursPct >= 75
                          ? '#EA580C'
                          : '#2563EB',
                    }}
                  />
                </div>
              </div>

              {/* Cost + Downtime row */}
              <div className="flex gap-3">
                <div
                  className="flex-1 rounded-xl p-3"
                  style={{
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[1px] font-semibold flex items-center gap-1"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    <DollarSign size={10} />
                    Est. Repair Cost
                  </div>
                  <div
                    className="text-[15px] font-bold mt-0.5"
                    style={{
                      color: 'var(--prizym-text-primary)',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    ${prediction.estimatedCost.toLocaleString()}
                  </div>
                </div>
                <div
                  className="flex-1 rounded-xl p-3"
                  style={{
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[1px] font-semibold flex items-center gap-1"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    <Clock size={10} />
                    Est. Downtime
                  </div>
                  <div
                    className="text-[15px] font-bold mt-0.5"
                    style={{
                      color: 'var(--prizym-text-primary)',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {prediction.estimatedDowntimeDays} day{prediction.estimatedDowntimeDays !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Predicted failure date */}
              <div
                className="text-[11px] flex items-center gap-1.5"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                <AlertTriangle size={11} />
                Predicted failure: {prediction.predictedFailureDate} ({days} days)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

export default function AIPredictiveMaintenancePage() {
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
            AI Predictive Maintenance
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Machine learning failure prediction + prescriptive repair recommendations
          </p>
          <SourceBadge source="Trackunit Telematics + SmartEquip" synced="Live telemetry" />
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{
            background: 'rgba(139,92,246,0.12)',
            color: '#8B5CF6',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <Brain size={13} />
          AI Active
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 1: Hero KPIs
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Prevented Breakdowns"
          value={String(MAINTENANCE_SAVINGS.preventedBreakdowns)}
          accent="#10B981"
          icon={<Shield size={18} />}
          sub="this month"
        />
        <KpiCard
          label="Downtime Saved"
          value={`${MAINTENANCE_SAVINGS.downtimeSaved} days`}
          accent="#2563EB"
          icon={<Clock size={18} />}
          sub="vs unplanned repairs"
        />
        <KpiCard
          label="Cost Avoided"
          value={fmtK(MAINTENANCE_SAVINGS.costSaved)}
          accent="#059669"
          icon={<DollarSign size={18} />}
          sub="emergency repair savings"
        />
        <KpiCard
          label="Fleet Uptime"
          value={fmtPct(MAINTENANCE_SAVINGS.fleetUptime)}
          accent="#8B5CF6"
          icon={<Activity size={18} />}
          delta="+5.6pp vs pre-AI"
          deltaUp
          sub="up from 91.2%"
        />
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2: Two charts side by side
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: Prediction Accuracy by Component — Horizontal Bar */}
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
            Prediction Accuracy by Component
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={COMPONENT_FAILURE_RATES}
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
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="component"
                tick={{ fill: '#374151', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, _name, props) => {
                  const item = props.payload;
                  return [
                    `${Number(value).toFixed(1)}% (${item.predicted}/${item.failures} predicted)`,
                    'Accuracy',
                  ];
                }}
              />
              <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} maxBarSize={24}>
                {COMPONENT_FAILURE_RATES.map((_entry, i) => (
                  <Cell key={i} fill={ACCURACY_BARS[i] || '#2563EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Monthly Prevention Trend — Stacked Area */}
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
            Monthly Prevention Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={MAINTENANCE_TREND}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <defs>
                <linearGradient id="gradPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TREND_COLORS.predicted} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={TREND_COLORS.predicted} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradPrevented" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TREND_COLORS.prevented} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={TREND_COLORS.prevented} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradMissed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TREND_COLORS.missed} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={TREND_COLORS.missed} stopOpacity={0.02} />
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
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    predicted: 'Predicted',
                    prevented: 'Prevented',
                    missed: 'Missed',
                  };
                  return [value, labels[String(name)] || String(name)];
                }}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke={TREND_COLORS.predicted}
                strokeWidth={2}
                fill="url(#gradPredicted)"
              />
              <Area
                type="monotone"
                dataKey="prevented"
                stroke={TREND_COLORS.prevented}
                strokeWidth={2}
                fill="url(#gradPrevented)"
              />
              <Area
                type="monotone"
                dataKey="missed"
                stroke={TREND_COLORS.missed}
                strokeWidth={2}
                fill="url(#gradMissed)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 justify-center">
            {Object.entries(TREND_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: color }}
                />
                <span
                  className="text-[11px] capitalize"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 3: Active Predictions List
          ════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-[15px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Active Predictions
          </h2>
          <span
            className="text-[11px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {PREDICTIONS.length} assets monitored
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {sortedPredictions.map((p) => (
            <PredictionCard key={`${p.assetId}-${p.component}`} prediction={p} />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: AI Insight Banner
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(37,99,235,0.06) 100%)',
          border: '1px solid rgba(139,92,246,0.20)',
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 shimmer pointer-events-none"
          style={{ opacity: 0.5 }}
        />

        <div className="relative flex items-start gap-4">
          <div
            className="p-2.5 rounded-xl shrink-0"
            style={{
              background: 'rgba(139,92,246,0.12)',
              color: '#8B5CF6',
            }}
          >
            <Brain size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[13px] font-bold"
                style={{
                  color: 'var(--prizym-text-primary)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                AI Recommendation
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(139,92,246,0.12)',
                  color: '#8B5CF6',
                }}
              >
                Prescriptive
              </span>
            </div>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: 'var(--prizym-text-secondary)' }}
            >
              Schedule <strong style={{ color: 'var(--prizym-text-primary)' }}>CAT 320 Excavator</strong> hydraulic pump service during its return window (<strong style={{ color: 'var(--prizym-text-primary)' }}>Mar 4</strong>). Assign to <strong style={{ color: 'var(--prizym-text-primary)' }}>Dave Rodriguez</strong> (hydraulics specialist, 96% confidence match). Parts in stock at Orlando Central warehouse. Estimated 5-hour job &mdash; complete before next rental starts Mar 6.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#10B981' }} />
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
                  Parts: In Stock
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#2563EB' }} />
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
                  Tech: Available Mar 4
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#8B5CF6' }} />
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
                  Risk: Avoided $8,200 emergency repair
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
