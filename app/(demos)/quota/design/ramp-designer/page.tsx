'use client';

import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Users, Clock, CheckCircle2, Zap, Building2, Globe, Handshake,
} from 'lucide-react';

/* ── Ramp Templates ────────────────────────────────────────── */
interface RampTemplate {
  name: string;
  segment: string;
  icon: React.ElementType;
  months: number;
  percentages: number[];
  color: string;
}

const templates: RampTemplate[] = [
  {
    name: 'Fast Ramp',
    segment: 'SMB',
    icon: Zap,
    months: 3,
    percentages: [33, 67, 100],
    color: '#f59e0b',
  },
  {
    name: 'Standard',
    segment: 'Mid-Market',
    icon: Building2,
    months: 6,
    percentages: [17, 33, 50, 67, 83, 100],
    color: '#3b82f6',
  },
  {
    name: 'Enterprise',
    segment: 'Enterprise',
    icon: Globe,
    months: 9,
    percentages: [0, 11, 22, 33, 50, 67, 78, 89, 100],
    color: '#8b5cf6',
  },
  {
    name: 'Channel',
    segment: 'Channel',
    icon: Handshake,
    months: 6,
    percentages: [0, 25, 50, 75, 100, 100],
    color: '#10b981',
  },
];

/* ── Impact Data ───────────────────────────────────────────── */
const impactData = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  const fullQuota = 125_000;
  // blended ramp curve across active reps
  const rampPct = Math.min(100, month * 12);
  const rampedQuota = Math.round(fullQuota * Math.min(1, (month * 0.12 + month * month * 0.005)));
  const expectedAttainment = Math.round(rampedQuota * (0.65 + month * 0.03));
  return {
    month: `M${month}`,
    fullQuota,
    rampedQuota: Math.min(rampedQuota, fullQuota),
    expectedAttainment: Math.min(expectedAttainment, rampedQuota),
  };
});

/* ── Active Ramps ──────────────────────────────────────────── */
const activeRamps = [
  { rep: 'Sarah Chen', territory: 'West Enterprise', template: 'Enterprise', start: 'Jan 2026', currentMonth: 3, currentPct: 22, estFull: 'Sep 2026' },
  { rep: 'Marcus Johnson', territory: 'Southeast MM', template: 'Standard', start: 'Feb 2026', currentMonth: 2, currentPct: 33, estFull: 'Jul 2026' },
  { rep: 'Aisha Patel', territory: 'Northeast SMB', template: 'Fast Ramp', start: 'Mar 2026', currentMonth: 1, currentPct: 33, estFull: 'May 2026' },
  { rep: 'David Kim', territory: 'Central Channel', template: 'Channel', start: 'Jan 2026', currentMonth: 3, currentPct: 50, estFull: 'Jun 2026' },
  { rep: 'Rachel Torres', territory: 'West MM', template: 'Standard', start: 'Dec 2025', currentMonth: 4, currentPct: 67, estFull: 'May 2026' },
];

/* ── KPIs ──────────────────────────────────────────────────── */
const kpis = [
  { label: 'Reps on Ramp', value: '5 of 24', subtitle: '21%', icon: Users },
  { label: 'Avg Ramp Duration', value: '5.2', subtitle: 'months', icon: Clock },
  { label: 'Ramp Completion Rate', value: '82%', subtitle: 'last 12 months', icon: CheckCircle2 },
];

/* ── Template Card ─────────────────────────────────────────── */
function TemplateCard({ t }: { t: RampTemplate }) {
  const chartData = t.percentages.map((pct, i) => ({ month: i + 1, pct }));

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: '2rem', height: '2rem', background: `${t.color}18` }}
          >
            <t.icon className="h-4 w-4" style={{ color: t.color }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              {t.name}
            </h3>
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
              {t.segment}
            </span>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${t.color}18`, color: t.color }}
        >
          {t.months}mo
        </span>
      </div>

      {/* Mini Chart */}
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              tickFormatter={(v) => `M${v}`}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Line
              type="monotone"
              dataKey="pct"
              stroke={t.color}
              strokeWidth={2}
              dot={{ r: 3, fill: t.color, stroke: '#fff', strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Percentages */}
      <div className="flex flex-wrap gap-1.5">
        {t.percentages.map((pct, i) => (
          <span
            key={i}
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              background: '#f3f4f6',
              color: 'var(--prizym-text-muted)',
            }}
          >
            M{i + 1}: {pct}%
          </span>
        ))}
      </div>

      {/* Button */}
      <button
        className="mt-auto w-full py-2 text-xs font-semibold rounded-lg transition hover:opacity-90"
        style={{ background: t.color, color: '#fff' }}
      >
        Use Template
      </button>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function RampDesignerPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-amber-500" />
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
            Ramp Designer
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--prizym-text-muted)' }}>
          Build and customize quota ramp schedules for new hire onboarding
        </p>
      </div>

      {/* Ramp KPIs */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-5"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[11px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {k.label}
              </span>
              <k.icon className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              {k.value}
            </p>
            <span className="text-xs" style={{ color: 'var(--prizym-text-secondary)' }}>
              {k.subtitle}
            </span>
          </div>
        ))}
      </div>

      {/* Ramp Templates */}
      <div className="mb-2">
        <h2
          className="text-[11px] font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Ramp Templates
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {templates.map((t) => (
          <TemplateCard key={t.name} t={t} />
        ))}
      </div>

      {/* Ramp Impact Analysis */}
      <div className="mb-2">
        <h2
          className="text-[11px] font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Ramp Impact Analysis
        </h2>
      </div>
      <div
        className="rounded-xl p-6 mb-8"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              Revenue Impact Over 12 Months
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
              Gap between full quota and ramped quota represents ramp cost
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 border-t-2 border-dashed border-gray-400" />
              <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Full Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-400 opacity-60" />
              <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Ramped Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-500 opacity-60" />
              <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Expected Attainment</span>
            </div>
          </div>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={impactData} margin={{ top: 8, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any, name: any) => [
                  `$${Number(value ?? 0).toLocaleString()}`,
                  name === 'fullQuota' ? 'Full Quota' : name === 'rampedQuota' ? 'Ramped Quota' : 'Expected Attainment',
                ]) as any}
              />
              <Line
                type="monotone"
                dataKey="fullQuota"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="rampedQuota"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expectedAttainment"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Ramps Table */}
      <div className="mb-2">
        <h2
          className="text-[11px] font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Active Ramps
        </h2>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
              {['Rep', 'Territory', 'Template', 'Start Date', 'Current Month', 'Current %', 'Est. Full Quota Date'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeRamps.map((r, i) => (
              <tr
                key={r.rep}
                style={{
                  borderBottom: i < activeRamps.length - 1 ? '1px solid var(--prizym-border-default)' : undefined,
                }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>
                  {r.rep}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--prizym-text-secondary)' }}>
                  {r.territory}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: r.template === 'Enterprise' ? '#8b5cf618' :
                        r.template === 'Standard' ? '#3b82f618' :
                        r.template === 'Fast Ramp' ? '#f59e0b18' : '#10b98118',
                      color: r.template === 'Enterprise' ? '#8b5cf6' :
                        r.template === 'Standard' ? '#3b82f6' :
                        r.template === 'Fast Ramp' ? '#f59e0b' : '#10b981',
                    }}
                  >
                    {r.template}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--prizym-text-secondary)' }}>
                  {r.start}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--prizym-text-secondary)' }}>
                  Month {r.currentMonth}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.currentPct}%`,
                          background: r.currentPct >= 67 ? '#10b981' : r.currentPct >= 33 ? '#f59e0b' : '#f97316',
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--prizym-text-primary)' }}>
                      {r.currentPct}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--prizym-text-secondary)' }}>
                  {r.estFull}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
