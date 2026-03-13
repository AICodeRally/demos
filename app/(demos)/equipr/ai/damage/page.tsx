'use client';


import {
  DAMAGE_KPIS,
  DAMAGE_DETECTIONS,
  DAMAGE_BY_TYPE,
  RECOVERY_TREND,
  DAMAGE_BY_CATEGORY,
} from '@/data/equipr/ai-damage';
import type { DamageDetection, DamageStatus } from '@/data/equipr/ai-damage';
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
  ScanSearch,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

/* ── Helpers ──────────────────────────────────────────────── */

function fmtK(n: number): string {
  return n >= 1000 ? `$${(n / 1e3).toFixed(1)}K` : `$${n.toLocaleString('en-US')}`;
}

function fmtDollar(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

function fmtNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ── Tooltip Shared Style ─────────────────────────────────── */

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  color: '#111827',
  fontSize: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
};

/* ── Status Badge Styles ──────────────────────────────────── */

const STATUS_STYLES: Record<DamageStatus, { bg: string; text: string; label: string }> = {
  pending_review: { bg: 'rgba(245,158,11,0.12)', text: '#D97706', label: 'Pending Review' },
  confirmed: { bg: 'rgba(16,185,129,0.12)', text: '#059669', label: 'Confirmed' },
  disputed: { bg: 'rgba(249,115,22,0.12)', text: '#EA580C', label: 'Disputed' },
  charged: { bg: 'rgba(37,99,235,0.12)', text: '#2563EB', label: 'Charged' },
};

/* ── Bar colors for charts ────────────────────────────────── */

const TYPE_COLORS = ['#7C3AED', '#2563EB', '#DC2626', '#F59E0B', '#059669', '#EC4899'];
const CAT_COLORS = ['#DC2626', '#2563EB', '#7C3AED', '#F59E0B', '#10B981'];

/* ── Featured detection (the most interesting one) ────────── */

const featured = DAMAGE_DETECTIONS[0]; // Volvo excavator with 3 detections

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */

export default function AiDamageDetectionPage() {
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
            AI Damage Detection
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Computer-vision photo comparison catches damage humans miss — recovering revenue automatically
          </p>
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{
            background: 'rgba(124,58,237,0.10)',
            color: '#7C3AED',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <ScanSearch size={13} />
          Live — Feb 2026
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 1: Hero KPIs
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Photos Analyzed */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-10 rounded-r"
            style={{ background: '#7C3AED' }}
          />
          <div className="flex items-center justify-between mb-1">
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Photos Analyzed
            </div>
            <Camera size={14} style={{ color: '#7C3AED' }} />
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#7C3AED',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {fmtNumber(DAMAGE_KPIS.photosAnalyzed)}
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            this month
          </div>
        </div>

        {/* Damage Cases */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-10 rounded-r"
            style={{ background: '#F97316' }}
          />
          <div className="flex items-center justify-between mb-1">
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Damage Cases
            </div>
            <AlertTriangle size={14} style={{ color: '#F97316' }} />
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#F97316',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {DAMAGE_KPIS.damageDetected}
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            new detections
          </div>
        </div>

        {/* Revenue Recovered */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid rgba(16,185,129,0.35)',
            boxShadow: '0 0 20px rgba(16,185,129,0.08), var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-10 rounded-r"
            style={{ background: '#059669' }}
          />
          <div className="flex items-center justify-between mb-1">
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Revenue Recovered
            </div>
            <DollarSign size={14} style={{ color: '#059669' }} />
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#059669',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {fmtK(DAMAGE_KPIS.revenueRecovered)}
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            charges that would have been missed
          </div>
        </div>

        {/* Detection Speed */}
        <div
          className="relative rounded-xl p-5 transition-shadow hover:shadow-lg"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div
            className="absolute top-4 left-0 w-[4px] h-10 rounded-r"
            style={{ background: '#2563EB' }}
          />
          <div className="flex items-center justify-between mb-1">
            <div
              className="text-[10px] uppercase tracking-[1.5px] font-semibold"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Detection Speed
            </div>
            <Zap size={14} style={{ color: '#2563EB' }} />
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: '#2563EB',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {DAMAGE_KPIS.avgDetectionTime} sec
          </div>
          <div
            className="text-[11px] mt-1"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            per pair — <span style={{ color: '#DC2626' }}>vs 45 min manual</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 2: Featured Detection — "Before vs After" Showcase
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(37,99,235,0.06))',
            borderBottom: '1px solid var(--prizym-border-default)',
          }}
        >
          <div className="flex items-center gap-2">
            <ScanSearch size={16} style={{ color: '#7C3AED' }} />
            <h3
              className="text-[13px] font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              AI Photo Comparison — Featured Detection
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px]"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {featured.assetId}
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: STATUS_STYLES[featured.status].bg,
                color: STATUS_STYLES[featured.status].text,
              }}
            >
              {STATUS_STYLES[featured.status].label}
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Asset info */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[15px] font-bold"
              style={{ color: 'var(--prizym-text-primary)' }}
            >
              {featured.assetName}
            </span>
            <span
              className="text-[11px] px-2 py-0.5 rounded"
              style={{
                background: 'rgba(0,0,0,0.04)',
                color: 'var(--prizym-text-muted)',
              }}
            >
              {featured.category}
            </span>
            <span className="text-[12px]" style={{ color: 'var(--prizym-text-muted)' }}>
              &middot; Rented to {featured.customerName}
            </span>
          </div>

          {/* Before / After photo comparison */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-5">
            {/* CHECK-OUT photo placeholder */}
            <div
              className="rounded-xl p-6 flex flex-col items-center justify-center gap-2"
              style={{
                background: 'rgba(16,185,129,0.04)',
                border: '2px dashed rgba(16,185,129,0.25)',
                minHeight: 160,
              }}
            >
              <Camera size={28} style={{ color: '#059669' }} />
              <span
                className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: '#059669' }}
              >
                Check-Out
              </span>
              <span
                className="text-[11px]"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {formatDate(featured.checkoutDate)}
              </span>
              <div
                className="flex items-center gap-1 mt-1 px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(16,185,129,0.10)',
                }}
              >
                <CheckCircle size={11} style={{ color: '#059669' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#059669' }}>
                  No damage recorded
                </span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[42px] h-[32px] rounded flex items-center justify-center"
                    style={{
                      background: '#F3F4F6',
                      border: '1px solid rgba(16,185,129,0.15)',
                    }}
                  >
                    <Camera size={10} style={{ color: 'var(--prizym-text-muted)' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow / AI Scan badge */}
            <div className="flex flex-col items-center gap-2 py-3">
              <div
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
                }}
              >
                AI Scan
              </div>
              <ArrowRight size={20} style={{ color: '#7C3AED' }} />
              <span
                className="text-[10px]"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {featured.photoCount} photos
              </span>
            </div>

            {/* RETURN photo placeholder */}
            <div
              className="rounded-xl p-6 flex flex-col items-center justify-center gap-2"
              style={{
                background: 'rgba(220,38,38,0.04)',
                border: '2px dashed rgba(220,38,38,0.25)',
                minHeight: 160,
              }}
            >
              <ScanSearch size={28} style={{ color: '#DC2626' }} />
              <span
                className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: '#DC2626' }}
              >
                Return
              </span>
              <span
                className="text-[11px]"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {formatDate(featured.returnDate)}
              </span>
              <div
                className="flex items-center gap-1 mt-1 px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(220,38,38,0.10)',
                }}
              >
                <AlertTriangle size={11} style={{ color: '#DC2626' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#DC2626' }}>
                  {featured.aiDetections.length} damage areas detected
                </span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[42px] h-[32px] rounded flex items-center justify-center"
                    style={{
                      background: 'rgba(220,38,38,0.06)',
                      border: '1px solid rgba(220,38,38,0.15)',
                    }}
                  >
                    <Camera size={10} style={{ color: '#DC2626' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Findings Panel */}
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(124,58,237,0.04)',
              border: '1px solid rgba(124,58,237,0.15)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} style={{ color: '#7C3AED' }} />
              <span
                className="text-[12px] font-bold"
                style={{ color: '#7C3AED' }}
              >
                AI Findings
              </span>
              <span
                className="text-[10px] ml-auto"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                Processed in {DAMAGE_KPIS.avgDetectionTime}s &middot; {DAMAGE_KPIS.falsePositiveRate}% false positive rate
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {featured.aiDetections.map((det, i) => {
                const severityColors = {
                  minor: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
                  moderate: { bg: 'rgba(249,115,22,0.10)', text: '#EA580C' },
                  major: { bg: 'rgba(220,38,38,0.10)', text: '#DC2626' },
                };
                const sv = severityColors[det.severity];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{
                      background: 'var(--prizym-card-bg)',
                      border: '1px solid var(--prizym-border-default)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: sv.text }}
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {det.area}
                      </span>
                      <span
                        className="text-[11px] ml-2"
                        style={{ color: 'var(--prizym-text-secondary)' }}
                      >
                        {det.damageType}
                      </span>
                    </div>
                    <span
                      className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: sv.bg, color: sv.text }}
                    >
                      {det.severity}
                    </span>
                    <div
                      className="text-[11px] shrink-0 px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(124,58,237,0.08)',
                        color: '#7C3AED',
                      }}
                    >
                      {Math.round(det.confidence * 100)}% conf
                    </div>
                    <span
                      className="text-[12px] font-bold tabular-nums shrink-0"
                      style={{ color: 'var(--prizym-text-primary)' }}
                    >
                      {fmtDollar(det.estimatedRepairCost)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              className="flex items-center justify-between mt-3 pt-3"
              style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}
            >
              <div className="flex items-center gap-2">
                <Clock size={12} style={{ color: 'var(--prizym-text-muted)' }} />
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
                  Human review: {featured.humanReviewTime} (vs 45 min manual)
                </span>
              </div>
              <span
                className="text-[13px] font-bold"
                style={{
                  color: '#059669',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Total: {fmtDollar(featured.totalDamageValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 3: Two Charts Side by Side
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: Recovery Trend — Stacked Area */}
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
            Recovery Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={RECOVERY_TREND}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <defs>
                <linearGradient id="gradRecovered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradMissed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.05} />
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
                    recovered: 'Recovered',
                    missed: 'Missed',
                  };
                  return [fmtDollar(Number(value)), labels[String(name)] || String(name)];
                }}
              />
              <Area
                type="monotone"
                dataKey="recovered"
                stackId="1"
                stroke="#059669"
                strokeWidth={2}
                fill="url(#gradRecovered)"
              />
              <Area
                type="monotone"
                dataKey="missed"
                stackId="1"
                stroke="#DC2626"
                strokeWidth={2}
                fill="url(#gradMissed)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: '#059669' }} />
              <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>
                Recovered
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm" style={{ background: '#DC2626' }} />
              <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>
                Missed
              </span>
            </div>
          </div>
        </div>

        {/* Right: Damage by Type — Horizontal Bar */}
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
            Damage by Type
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={DAMAGE_BY_TYPE}
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
                dataKey="type"
                tick={{ fill: '#374151', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [fmtDollar(Number(value)), 'Cost']}
              />
              <Bar dataKey="totalCost" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {DAMAGE_BY_TYPE.map((_entry, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i] || TYPE_COLORS[TYPE_COLORS.length - 1]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: Recent Detections List
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
            Recent Detections
          </h3>
          <span
            className="text-[11px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            {DAMAGE_DETECTIONS.length} cases this month
          </span>
        </div>

        {/* Column headers */}
        <div
          className="grid px-5 py-2.5"
          style={{
            gridTemplateColumns: '1.5fr 1fr 0.8fr 0.6fr 0.7fr 0.8fr 0.6fr',
            borderBottom: '1px solid var(--prizym-border-default)',
            background: 'rgba(0,0,0,0.02)',
          }}
        >
          {['Asset', 'Customer', 'Return Date', 'Detections', 'Total Value', 'Status', 'Review'].map(
            (col) => (
              <span
                key={col}
                className="text-[10px] uppercase tracking-[1.5px] font-bold tabular-nums"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {col}
              </span>
            ),
          )}
        </div>

        {/* Rows */}
        {DAMAGE_DETECTIONS.map((det, idx) => (
          <DetectionRow key={det.id} detection={det} idx={idx} total={DAMAGE_DETECTIONS.length} />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 5: Bottom Insight Callout
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(37,99,235,0.06))',
          border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 0 20px rgba(16,185,129,0.06)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-lg shrink-0 mt-0.5"
            style={{
              background: 'rgba(16,185,129,0.12)',
            }}
          >
            <ShieldCheck size={18} style={{ color: '#059669' }} />
          </div>
          <div>
            <h4
              className="text-[13px] font-bold mb-1"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              AI Impact
            </h4>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: 'var(--prizym-text-secondary)' }}
            >
              Without AI damage detection, an estimated{' '}
              <span style={{ color: '#059669', fontWeight: 700 }}>$31.4K</span> in damage
              charges would have gone unrecovered this month. The system pays for itself{' '}
              <span style={{ color: '#059669', fontWeight: 700 }}>4.7x over</span>.
              Human inspection time reduced by{' '}
              <span style={{ color: '#2563EB', fontWeight: 700 }}>{DAMAGE_KPIS.humanTimeSaved} hours</span>{' '}
              this month with a{' '}
              <span style={{ color: '#7C3AED', fontWeight: 700 }}>{DAMAGE_KPIS.falsePositiveRate}%</span>{' '}
              false positive rate.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Detection Row Component
   ════════════════════════════════════════════════════════════ */

function DetectionRow({
  detection,
  idx,
  total,
}: {
  detection: DamageDetection;
  idx: number;
  total: number;
}) {
  const st = STATUS_STYLES[detection.status];
  const hasMajor = detection.aiDetections.some((d) => d.severity === 'major');

  return (
    <div
      className="grid items-center px-5 py-3"
      style={{
        gridTemplateColumns: '1.5fr 1fr 0.8fr 0.6fr 0.7fr 0.8fr 0.6fr',
        borderLeft: hasMajor ? '3px solid #DC2626' : '3px solid transparent',
        borderBottom: idx < total - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
        background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
      }}
    >
      {/* Asset */}
      <div className="min-w-0">
        <span
          className="text-[13px] font-semibold block truncate"
          style={{ color: 'var(--prizym-text-primary)' }}
        >
          {detection.assetName}
        </span>
        <span
          className="text-[10px]"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          {detection.assetId}
        </span>
      </div>

      {/* Customer */}
      <span
        className="text-[12px] truncate"
        style={{ color: 'var(--prizym-text-secondary)' }}
      >
        {detection.customerName}
      </span>

      {/* Return Date */}
      <span
        className="text-[12px]"
        style={{ color: 'var(--prizym-text-secondary)' }}
      >
        {formatDate(detection.returnDate)}
      </span>

      {/* Detections count */}
      <span
        className="text-[12px] font-bold tabular-nums"
        style={{ color: 'var(--prizym-text-primary)' }}
      >
        {detection.aiDetections.length}
      </span>

      {/* Total Value */}
      <span
        className="text-[12px] font-bold tabular-nums"
        style={{ color: '#059669' }}
      >
        {fmtDollar(detection.totalDamageValue)}
      </span>

      {/* Status Badge */}
      <span
        className="text-[10px] font-bold px-2 py-1 rounded-full text-center whitespace-nowrap"
        style={{ background: st.bg, color: st.text }}
      >
        {st.label}
      </span>

      {/* Review Time */}
      <span
        className="text-[11px]"
        style={{ color: 'var(--prizym-text-muted)' }}
      >
        {detection.humanReviewTime}
      </span>
    </div>
  );
}
