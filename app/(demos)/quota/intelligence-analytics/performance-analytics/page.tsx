'use client';

import {
  BarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import {
  BarChart3, TrendingUp, Zap, Target, ArrowUpRight, ArrowDownRight,
  Users, Award, Activity,
} from 'lucide-react';
import { REPS, MONTHLY_TREND } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── KPI Card ──────────────────────────────────────────────── */

function KpiCard({ title, value, subtitle, icon: Icon, trend, trendUp }: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--prizym-text-muted)' }}>{title}</span>
        <Icon className="h-4 w-4 text-amber-500" />
      </div>
      <p className="text-2xl font-bold mt-1" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{subtitle}</span>
      </div>
    </div>
  );
}

/* ── Derived Data ──────────────────────────────────────────── */

const totalActual = REPS.reduce((s, r) => s + r.actual, 0);
const avgDealSize = Math.round(totalActual / 115);
const winRate = 68;
const salesVelocity = 42;

const TEAM_DATA = ['Enterprise', 'Mid-Market', 'SMB'].map(team => {
  const members = REPS.filter(r => r.team === team);
  const quota = members.reduce((s, r) => s + r.quota, 0);
  const actual = members.reduce((s, r) => s + r.actual, 0);
  return { team, quota, actual, attainment: Math.round((actual / quota) * 100), reps: members.length };
});

const REP_PERFORMANCE = REPS.map(r => ({
  ...r,
  attainment: Math.round((r.actual / r.quota) * 100),
  pipelineCoverage: +(1.8 + Math.random() * 2.4).toFixed(1),
  dealsClosed: Math.floor(8 + Math.random() * 12),
  avgCycleTime: Math.floor(28 + Math.random() * 25),
})).sort((a, b) => b.attainment - a.attainment);

const VELOCITY_TREND = MONTHLY_TREND.map((m, i) => ({
  month: m.month,
  winRate: 62 + Math.floor(i * 0.8 + Math.random() * 4),
  avgDealSize: Math.round(45000 + i * 2000 + Math.random() * 5000),
  cycleTime: Math.round(45 - i * 1.2 + Math.random() * 5),
}));

const PERFORMANCE_CORRELATORS = [
  { factor: 'Pipeline Coverage', correlation: 0.89, impact: 'Strong Positive' },
  { factor: 'Discovery Call Quality', correlation: 0.82, impact: 'Strong Positive' },
  { factor: 'Multi-Threading', correlation: 0.76, impact: 'Moderate Positive' },
  { factor: 'Proposal Response Time', correlation: -0.71, impact: 'Moderate Negative' },
  { factor: 'Discount Frequency', correlation: -0.65, impact: 'Moderate Negative' },
  { factor: 'Territory Size', correlation: 0.34, impact: 'Weak Positive' },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function PerformanceAnalyticsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Performance Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Deep-dive analytics on sales velocity, team performance, and success correlators.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Avg Deal Size" value={fmtDollar(avgDealSize)} subtitle="Across 115 deals" icon={BarChart3} trend="+8%" trendUp />
        <KpiCard title="Win Rate" value={fmtPct(winRate)} subtitle="Qualified opportunities" icon={Target} trend="+5%" trendUp />
        <KpiCard title="Sales Velocity" value={`${salesVelocity} days`} subtitle="Avg close cycle" icon={Zap} trend="-3 days" trendUp />
        <KpiCard title="Top Correlator" value="Pipeline 3x+" subtitle="Strongest predictor" icon={TrendingUp} trend="r=0.89" trendUp />
      </div>

      {/* Team Performance Comparison */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Team Performance Comparison</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Quota vs. actual by team segment</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={TEAM_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="team" tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis tickFormatter={(v: number) => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
              formatter={(v: any) => [fmtDollar(v), '']}
            />
            <Bar dataKey="quota" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Quota" />
            <Bar dataKey="actual" radius={[4, 4, 0, 0]} name="Actual">
              {TEAM_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.attainment >= 100 ? '#22c55e' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3 text-xs justify-center" style={{ color: 'var(--prizym-text-muted)' }}>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#CBD5E1]" /> Quota</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Below Target</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Above Target</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Sales Velocity Trend */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Sales Velocity Trend</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Win rate and cycle time over 8 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={VELOCITY_TREND} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: '#64748B', fontSize: 12 }} domain={[55, 80]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748B', fontSize: 12 }} domain={[30, 55]} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }} />
              <Line yAxisId="left" type="monotone" dataKey="winRate" stroke="#f59e0b" strokeWidth={2} name="Win Rate %" dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="cycleTime" stroke="#ef4444" strokeWidth={2} name="Cycle Time (days)" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-xs justify-center" style={{ color: 'var(--prizym-text-muted)' }}>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Win Rate</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Cycle Time</span>
          </div>
        </div>

        {/* Avg Deal Size Trend */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Average Deal Size Trend</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Monthly progression of average closed-won deal value</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={VELOCITY_TREND} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1e3).toFixed(0)}K`} tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                formatter={(v: any) => [fmtDollar(v), 'Avg Deal']}
              />
              <Bar dataKey="avgDealSize" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rep Performance Table */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Rep Performance Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="text-left py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Rep</th>
                <th className="text-left py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Team</th>
                <th className="text-right py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Attainment</th>
                <th className="text-right py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Pipeline</th>
                <th className="text-right py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Deals</th>
                <th className="text-right py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Cycle</th>
                <th className="text-left py-3 px-3 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {REP_PERFORMANCE.map((r, i) => (
                <tr key={r.id} className="transition-colors" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Award className="h-3.5 w-3.5 text-amber-500" />}
                      <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{r.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3" style={{ color: 'var(--prizym-text-muted)' }}>{r.team}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-medium ${r.attainment >= 100 ? 'text-emerald-600' : r.attainment >= 85 ? 'text-amber-400' : 'text-red-600'}`}>
                      {r.attainment}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{r.pipelineCoverage}x</td>
                  <td className="py-3 px-3 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{r.dealsClosed}</td>
                  <td className="py-3 px-3 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{r.avgCycleTime}d</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      r.attainment >= 100 ? 'bg-emerald-500/10 text-emerald-600'
                      : r.attainment >= 85 ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-red-500/10 text-red-600'
                    }`}>
                      {r.attainment >= 100 ? 'Exceeding' : r.attainment >= 85 ? 'On Track' : 'At Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Correlators */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Performance Correlators</h2>
          <span className="text-xs ml-auto" style={{ color: 'var(--prizym-text-muted)' }}>Factors most correlated with quota attainment</span>
        </div>
        <div className="space-y-3">
          {PERFORMANCE_CORRELATORS.map(c => (
            <div key={c.factor} className="flex items-center gap-4">
              <span className="text-sm w-48 shrink-0" style={{ color: 'var(--prizym-text-primary)' }}>{c.factor}</span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                <div
                  className={`h-full rounded-full ${c.correlation > 0 ? 'bg-amber-500' : 'bg-red-400'}`}
                  style={{ width: `${Math.abs(c.correlation) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono w-12 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{c.correlation > 0 ? '+' : ''}{c.correlation.toFixed(2)}</span>
              <span className={`text-xs px-2 py-0.5 rounded w-36 text-center ${
                c.impact.includes('Strong Positive') ? 'bg-emerald-500/10 text-emerald-600'
                : c.impact.includes('Moderate Positive') ? 'bg-amber-500/10 text-amber-400'
                : c.impact.includes('Strong Negative') ? 'bg-red-500/10 text-red-600'
                : 'bg-orange-500/10 text-orange-400'
              }`}>
                {c.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
