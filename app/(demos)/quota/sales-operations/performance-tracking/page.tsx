'use client';

import { REPS, MONTHLY_TREND } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, Target, Activity, ArrowUpRight, ArrowDownRight,
  Phone, Calendar, FileText, Zap,
} from 'lucide-react';

const avgAttainment = REPS.reduce((s, r) => s + (r.actual / r.quota), 0) / REPS.length * 100;
const aboveTarget = REPS.filter(r => r.actual >= r.quota).length;
const belowTarget = REPS.filter(r => r.actual < r.quota).length;

const kpis = [
  { label: 'Avg Attainment', value: fmtPct(avgAttainment), icon: Target, delta: '+3.2% vs prior', up: true },
  { label: 'Above Target', value: `${aboveTarget} reps`, icon: TrendingUp, delta: `${fmtPct((aboveTarget / REPS.length) * 100)} of team`, up: true },
  { label: 'Below Target', value: `${belowTarget} reps`, icon: TrendingDown, delta: 'Need coaching', up: false },
  { label: 'Trend', value: 'Improving', icon: Activity, delta: '3 consecutive weeks', up: true },
];

const repChart = REPS.map(r => ({
  name: r.name.split(' ')[0],
  attainment: Math.round((r.actual / r.quota) * 100),
})).sort((a, b) => b.attainment - a.attainment);

// Activity metrics (inline data)
const activityData = [
  { rep: 'Sarah Chen', calls: 142, meetings: 28, proposals: 12, emails: 340, score: 92 },
  { rep: 'Marcus Johnson', calls: 168, meetings: 34, proposals: 15, emails: 410, score: 97 },
  { rep: 'Priya Patel', calls: 95, meetings: 18, proposals: 8, emails: 220, score: 68 },
  { rep: 'James Wilson', calls: 130, meetings: 26, proposals: 11, emails: 290, score: 85 },
  { rep: 'Emily Rodriguez', calls: 155, meetings: 30, proposals: 13, emails: 380, score: 89 },
  { rep: 'David Kim', calls: 118, meetings: 22, proposals: 10, emails: 260, score: 82 },
  { rep: 'Rachel Torres', calls: 88, meetings: 15, proposals: 6, emails: 190, score: 58 },
  { rep: 'Alex Nguyen', calls: 145, meetings: 31, proposals: 14, emails: 350, score: 94 },
];

// Weekly performance trend (inline data)
const weeklyTrend = [
  { week: 'W1', attainment: 78, calls: 820, meetings: 145 },
  { week: 'W2', attainment: 82, calls: 890, meetings: 162 },
  { week: 'W3', attainment: 85, calls: 940, meetings: 170 },
  { week: 'W4', attainment: 88, calls: 980, meetings: 185 },
  { week: 'W5', attainment: 84, calls: 910, meetings: 158 },
  { week: 'W6', attainment: 90, calls: 1020, meetings: 192 },
  { week: 'W7', attainment: 92, calls: 1050, meetings: 204 },
  { week: 'W8', attainment: 91, calls: 1040, meetings: 198 },
];

export default function PerformanceTrackingPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Performance Tracking</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Monitor individual and team performance against quota targets with real-time activity metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-xs rounded-lg" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
            <option>This Quarter</option>
            <option>Last Quarter</option>
            <option>YTD</option>
          </select>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{k.label}</span>
              <k.icon className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--prizym-text-primary)' }}>{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.up ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : <ArrowDownRight className="h-3 w-3 text-red-600" />}
              <span className={`text-xs ${k.up ? 'text-emerald-600' : 'text-red-600'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Rep Attainment Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Attainment Ranking</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repChart} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[0, 130]} tickFormatter={v => `${v}%`} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                  formatter={(v: any) => [`${v}%`, 'Attainment']}
                />
                <Bar dataKey="attainment" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {repChart.map((entry, i) => (
                    <Cell key={i} fill={entry.attainment >= 100 ? '#34d399' : entry.attainment >= 85 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Weekly Performance Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ left: 0, right: 10 }}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis domain={[70, 100]} tickFormatter={v => `${v}%`} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                  formatter={(v: any, name: any) => [
                    name === 'attainment' ? `${v}%` : v,
                    name === 'attainment' ? 'Attainment' : name,
                  ]}
                />
                <Area type="monotone" dataKey="attainment" stroke="#f59e0b" fill="url(#perfGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Monthly Revenue Trend</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND} margin={{ left: 10, right: 10 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                formatter={(v: any) => [fmtDollar(v), 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revGrad)" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Metrics Table */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Activity Metrics (Last 30 Days)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                <th className="text-left py-3 pr-4">Rep</th>
                <th className="text-center py-3 pr-4">
                  <div className="flex items-center justify-center gap-1"><Phone className="h-3 w-3" /> Calls</div>
                </th>
                <th className="text-center py-3 pr-4">
                  <div className="flex items-center justify-center gap-1"><Calendar className="h-3 w-3" /> Meetings</div>
                </th>
                <th className="text-center py-3 pr-4">
                  <div className="flex items-center justify-center gap-1"><FileText className="h-3 w-3" /> Proposals</div>
                </th>
                <th className="text-center py-3 pr-4">Emails</th>
                <th className="text-center py-3">
                  <div className="flex items-center justify-center gap-1"><Zap className="h-3 w-3" /> Score</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {activityData.map(a => (
                <tr key={a.rep} className="transition hover:opacity-80" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <td className="py-3 pr-4 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{a.rep}</td>
                  <td className="py-3 pr-4 text-center tabular-nums text-xs">{a.calls}</td>
                  <td className="py-3 pr-4 text-center tabular-nums text-xs">{a.meetings}</td>
                  <td className="py-3 pr-4 text-center tabular-nums text-xs">{a.proposals}</td>
                  <td className="py-3 pr-4 text-center tabular-nums text-xs">{a.emails}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 rounded-full h-1.5 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${a.score}%`,
                            background: a.score >= 90 ? '#34d399' : a.score >= 70 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${a.score >= 90 ? 'text-emerald-600' : a.score >= 70 ? 'text-amber-400' : 'text-red-600'}`}>
                        {a.score}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
