'use client';

import { useState } from 'react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import {
  TrendingUp, Target, Users, Layers, ArrowUpRight, ArrowDownRight,
  Trophy, Medal, Award, ChevronDown,
} from 'lucide-react';
import { REPS, MONTHLY_TREND } from '@/data/quota';
import { fmtDollar, fmtPct, fmtM } from '@/lib/utils';

/* ── Derived data ─────────────────────────────────────────────── */
const totalRevenue = REPS.reduce((s, r) => s + r.actual, 0);
const totalQuota = REPS.reduce((s, r) => s + r.quota, 0);
const attainmentPct = (totalRevenue / totalQuota) * 100;
const repsAbove = REPS.filter(r => r.actual >= r.quota).length;
const pipelineCoverage = 3.2; // simulated

const attainmentData = REPS
  .map(r => ({
    name: r.name.split(' ')[0],
    fullName: r.name,
    attainment: Math.round((r.actual / r.quota) * 100),
    territory: r.territory,
    team: r.team,
  }))
  .sort((a, b) => b.attainment - a.attainment);

const trendData = MONTHLY_TREND.map(m => ({
  ...m,
  target: 2_300_000,
}));

const leaderboard = [...REPS]
  .sort((a, b) => (b.actual / b.quota) - (a.actual / a.quota));

/* ── KPI card ─────────────────────────────────────────────────── */
function KPI({ label, value, sub, icon: Icon, trend, trendUp }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
        }
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>{trend}</span>
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{sub}</span>
      </div>
    </div>
  );
}

/* ── Tooltip ──────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--prizym-text-secondary)' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? fmtDollar(p.value) : `${p.value}%`}
        </p>
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function PerformanceDashboardPage() {
  const [period] = useState('Q1 2026');

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Performance Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Real-time view of sales performance across all teams and quota attainment metrics.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-secondary)' }}>
          {period} <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI
          label="Total Revenue" value={fmtDollar(totalRevenue)} sub="vs last quarter"
          icon={TrendingUp} trend="+8.2%" trendUp
        />
        <KPI
          label="Quota Attainment" value={fmtPct(attainmentPct)} sub="org-wide"
          icon={Target} trend="-2.4%" trendUp={false}
        />
        <KPI
          label="Reps Above Quota" value={`${repsAbove} / ${REPS.length}`} sub="50% hit rate"
          icon={Users} trend="+1 rep" trendUp
        />
        <KPI
          label="Pipeline Coverage" value={`${pipelineCoverage}x`} sub="target: 3.0x"
          icon={Layers} trend="+0.3x" trendUp
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Rep Attainment Bar Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Rep Attainment %</h2>
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Sorted by performance</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attainmentData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis type="number" domain={[0, 130]} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine x={100} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
              <Bar dataKey="attainment" name="Attainment" radius={[0, 4, 4, 0]} barSize={18}>
                {attainmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.attainment >= 100 ? '#10b981' : entry.attainment >= 85 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Trend Area Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Monthly Revenue Trend</h2>
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Last 8 months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => fmtM(v)} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={2_300_000} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" label={{ value: 'Target', fill: 'rgba(245,158,11,0.6)', fontSize: 10 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Leaderboard</h2>
          <span className="text-xs text-amber-400 font-medium">{period}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="pb-3 text-xs font-semibold w-10" style={{ color: 'var(--prizym-text-muted)' }}>#</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Rep</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Team</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Territory</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Quota</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Actual</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Attainment</th>
                <th className="pb-3 text-xs font-semibold w-24" style={{ color: 'var(--prizym-text-muted)' }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((rep, i) => {
                const att = (rep.actual / rep.quota) * 100;
                const Icon = i === 0 ? Trophy : i === 1 ? Medal : i === 2 ? Award : null;
                return (
                  <tr key={rep.id} className="transition hover:opacity-80" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-3" style={{ color: 'var(--prizym-text-muted)' }}>
                      {Icon ? <Icon className="h-4 w-4 text-amber-400" /> : <span className="text-xs">{i + 1}</span>}
                    </td>
                    <td className="py-3 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{rep.name}</td>
                    <td className="py-3" style={{ color: 'var(--prizym-text-secondary)' }}>{rep.team}</td>
                    <td className="py-3" style={{ color: 'var(--prizym-text-secondary)' }}>{rep.territory}</td>
                    <td className="py-3 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(rep.quota)}</td>
                    <td className="py-3 text-right font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(rep.actual)}</td>
                    <td className={`py-3 text-right font-bold ${att >= 100 ? 'text-emerald-600' : att >= 85 ? 'text-amber-400' : 'text-red-600'}`}>
                      {fmtPct(att)}
                    </td>
                    <td className="py-3">
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(att, 130)}%`,
                            maxWidth: '100%',
                            backgroundColor: att >= 100 ? '#10b981' : att >= 85 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Above Quota ({repsAbove})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>On Track ({REPS.filter(r => r.actual / r.quota >= 0.85 && r.actual < r.quota).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
              <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>At Risk ({REPS.filter(r => r.actual / r.quota < 0.85).length})</span>
            </div>
          </div>
          <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Updated 5 min ago</span>
        </div>
      </div>
    </>
  );
}
