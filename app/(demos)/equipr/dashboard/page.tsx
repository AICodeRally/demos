'use client';


import { ASSETS, CATEGORY_COLORS } from '@/data/equipr';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import {
  Radio,
  Database,
  Server,
  Wrench,
  BarChart3,
} from 'lucide-react';

/* ── KPI Card (inline) ────────────────────────────────── */
interface KpiCardProps {
  label: string;
  value: string;
  accent: string;
  delta?: string;
  deltaUp?: boolean;
  sub?: string;
  source?: string;
}

function KpiCard({ label, value, accent, delta, deltaUp, sub, source }: KpiCardProps) {
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
      {source && (
        <div
          className="flex items-center gap-1 mt-2"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          <Radio size={10} className="opacity-60" />
          <span className="text-[9px]">{source}</span>
        </div>
      )}
    </div>
  );
}

/* ── Chart data ───────────────────────────────────────── */
const utilizationByCategory: { category: string; utilization: number; fill: string }[] = [
  { category: 'Heavy', utilization: 82, fill: CATEGORY_COLORS.heavy },
  { category: 'Aerial', utilization: 75, fill: CATEGORY_COLORS.aerial },
  { category: 'Compaction', utilization: 68, fill: CATEGORY_COLORS.compaction },
  { category: 'Power', utilization: 71, fill: CATEGORY_COLORS.power },
  { category: 'Tools', utilization: 84, fill: CATEGORY_COLORS.tools },
];

const revenueTrend = [
  { month: 'Sep', revenue: 98000 },
  { month: 'Oct', revenue: 108000 },
  { month: 'Nov', revenue: 115000 },
  { month: 'Dec', revenue: 105000 },
  { month: 'Jan', revenue: 131000 },
  { month: 'Feb', revenue: 142000 },
];

/* ── Connected Systems ─────────────────────────────────── */
const CONNECTED_SYSTEMS = [
  { name: 'Wynne Systems', type: 'Rental ERP', status: 'connected' as const, lastSync: '2 min ago', icon: 'Database' as const, color: '#2563EB', detail: 'Reservations, contracts, billing' },
  { name: 'Point of Rental', type: 'Rental Management', status: 'connected' as const, lastSync: '5 min ago', icon: 'Server' as const, color: '#0891B2', detail: 'Inventory, rates, customers' },
  { name: 'Trackunit', type: 'Telematics / GPS', status: 'connected' as const, lastSync: 'Live stream', icon: 'Radio' as const, color: '#10B981', detail: '147 units streaming' },
  { name: 'SmartEquip', type: 'Parts & Service', status: 'connected' as const, lastSync: '14 min ago', icon: 'Wrench' as const, color: '#8B5CF6', detail: 'Parts catalog, work orders' },
  { name: 'Rouse Analytics', type: 'Market Benchmarks', status: 'connected' as const, lastSync: 'Q4 2025 loaded', icon: 'BarChart3' as const, color: '#F59E0B', detail: 'Rates, utilization benchmarks' },
];

const SYSTEM_ICONS = {
  Database,
  Server,
  Radio,
  Wrench,
  BarChart3,
} as const;

export default function DashboardPage() {
  const totalAssets = ASSETS.length;

  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Fleet Dashboard
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Blue Horizons Equipment Solutions
          </p>
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(37,99,235,0.12)',
            color: '#2563EB',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          Feb 2026
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Utilization"
          value="78%"
          accent="#2563EB"
          delta="+3.2%"
          deltaUp
          sub={`across ${totalAssets} assets`}
          source="Trackunit Telematics"
        />
        <KpiCard
          label="Revenue MTD"
          value="$142K"
          accent="#10B981"
          delta="+8.1%"
          deltaUp
          sub="vs $131K last month"
          source="Wynne Systems"
        />
        <KpiCard
          label="Active Rentals"
          value="24"
          accent="#0891B2"
          delta="+2"
          deltaUp
          sub="8 checked out today"
          source="Point of Rental"
        />
        <KpiCard
          label="Overdue Returns"
          value="3"
          accent="#EF4444"
          delta="1 resolved today"
          deltaUp
          sub="avg 2.1 days late"
          source="Point of Rental"
        />
      </div>

      {/* ── Connected Systems ──────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2
            className="text-[13px] font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Connected Systems
          </h2>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(16,185,129,0.12)',
              color: '#10B981',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            5 of 5 online
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CONNECTED_SYSTEMS.map((sys) => {
            const IconComponent = SYSTEM_ICONS[sys.icon];
            return (
              <div
                key={sys.name}
                className="relative rounded-xl px-4 py-3 transition-shadow hover:shadow-md overflow-hidden"
                style={{
                  background: 'var(--prizym-card-bg)',
                  border: '1px solid var(--prizym-border-default)',
                  boxShadow: 'var(--prizym-shadow-card)',
                }}
              >
                {/* Colored left accent bar */}
                <div
                  className="absolute top-0 left-0 w-[3px] h-full rounded-r"
                  style={{ background: sys.color }}
                />
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="h-[6px] w-[6px] rounded-full shrink-0"
                    style={{
                      background: '#10B981',
                      boxShadow: '0 0 6px rgba(16,185,129,0.5)',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  <span className="text-[9px] font-medium" style={{ color: '#10B981' }}>
                    Connected
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <IconComponent size={13} style={{ color: sys.color }} className="shrink-0" />
                  <span
                    className="text-[13px] font-bold leading-tight truncate"
                    style={{
                      color: 'var(--prizym-text-primary)',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {sys.name}
                  </span>
                </div>
                <div
                  className="text-[11px] mb-2 truncate"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  {sys.type}
                </div>
                <div
                  className="text-[10px] truncate"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Last sync: {sys.lastSync}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Charts Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Utilization by Category */}
        <div
          className="rounded-xl p-5"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[13px] font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Utilization by Category
            </h3>
            <div className="flex items-center gap-1" style={{ color: '#9CA3AF' }}>
              <Radio size={9} />
              <span className="text-[9px]">Trackunit + Wynne</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={utilizationByCategory}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  color: '#111827',
                  fontSize: 12,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                }}
                formatter={(value) => [`${value}%`, 'Utilization']}
              />
              <Bar
                dataKey="utilization"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              >
                {utilizationByCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div
          className="rounded-xl p-5"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            boxShadow: 'var(--prizym-shadow-card)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[13px] font-bold"
              style={{
                color: 'var(--prizym-text-primary)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Revenue Trend
            </h3>
            <div className="flex items-center gap-1" style={{ color: '#9CA3AF' }}>
              <Radio size={9} />
              <span className="text-[9px]">Wynne Systems</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={revenueTrend}
              margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
            >
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
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
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  color: '#111827',
                  fontSize: 12,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                }}
                formatter={(value) => [
                  `$${(Number(value) / 1000).toFixed(0)}K`,
                  'Revenue',
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#revGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Alert Strip ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Overdue */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div
            className="mt-0.5 h-2 w-2 rounded-full shrink-0"
            style={{ background: '#EF4444' }}
          />
          <div>
            <div
              className="text-[12px] font-bold"
              style={{ color: '#EF4444' }}
            >
              3 Overdue Returns
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>
              Coastal Builders (2), Walk-in (1)
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <div
            className="mt-0.5 h-2 w-2 rounded-full shrink-0"
            style={{ background: '#F59E0B' }}
          />
          <div>
            <div
              className="text-[12px] font-bold"
              style={{ color: '#F59E0B' }}
            >
              2 Maintenance Due
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>
              CAT 320 Excavator, Wacker DPU Compactor
            </div>
          </div>
        </div>

        {/* Conflict */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{
            background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(37,99,235,0.2)',
          }}
        >
          <div
            className="mt-0.5 h-2 w-2 rounded-full shrink-0"
            style={{ background: '#2563EB' }}
          />
          <div>
            <div
              className="text-[12px] font-bold"
              style={{ color: '#2563EB' }}
            >
              1 Availability Conflict
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>
              JLG 600S Boom Lift, Mar 3
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
