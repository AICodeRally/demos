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
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
        }
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span>
        <span className="text-xs text-white/40">{sub}</span>
      </div>
    </div>
  );
}

/* ── Tooltip ──────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-white/70 mb-1">{label}</p>
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
          <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
          <p className="text-sm text-white/50 mt-1">
            Real-time view of sales performance across all teams and quota attainment metrics.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 transition">
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
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Rep Attainment %</h2>
            <span className="text-xs text-white/40">Sorted by performance</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attainmentData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" domain={[0, 130]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" width={60} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
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
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Monthly Revenue Trend</h2>
            <span className="text-xs text-white/40">Last 8 months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickFormatter={v => fmtM(v)} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={2_300_000} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4" label={{ value: 'Target', fill: 'rgba(245,158,11,0.6)', fontSize: 10 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Leaderboard</h2>
          <span className="text-xs text-amber-400 font-medium">{period}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-3 text-xs font-medium text-white/40 w-10">#</th>
                <th className="pb-3 text-xs font-medium text-white/40">Rep</th>
                <th className="pb-3 text-xs font-medium text-white/40">Team</th>
                <th className="pb-3 text-xs font-medium text-white/40">Territory</th>
                <th className="pb-3 text-xs font-medium text-white/40 text-right">Quota</th>
                <th className="pb-3 text-xs font-medium text-white/40 text-right">Actual</th>
                <th className="pb-3 text-xs font-medium text-white/40 text-right">Attainment</th>
                <th className="pb-3 text-xs font-medium text-white/40 w-24">Progress</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((rep, i) => {
                const att = (rep.actual / rep.quota) * 100;
                const Icon = i === 0 ? Trophy : i === 1 ? Medal : i === 2 ? Award : null;
                return (
                  <tr key={rep.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 text-white/50">
                      {Icon ? <Icon className="h-4 w-4 text-amber-400" /> : <span className="text-xs">{i + 1}</span>}
                    </td>
                    <td className="py-3 font-medium text-white">{rep.name}</td>
                    <td className="py-3 text-white/60">{rep.team}</td>
                    <td className="py-3 text-white/60">{rep.territory}</td>
                    <td className="py-3 text-right text-white/60">{fmtDollar(rep.quota)}</td>
                    <td className="py-3 text-right font-medium text-white">{fmtDollar(rep.actual)}</td>
                    <td className={`py-3 text-right font-bold ${att >= 100 ? 'text-emerald-400' : att >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
                      {fmtPct(att)}
                    </td>
                    <td className="py-3">
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
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
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/50">Above Quota ({repsAbove})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-xs text-white/50">On Track ({REPS.filter(r => r.actual / r.quota >= 0.85 && r.actual < r.quota).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="text-xs text-white/50">At Risk ({REPS.filter(r => r.actual / r.quota < 0.85).length})</span>
            </div>
          </div>
          <span className="text-xs text-white/30">Updated 5 min ago</span>
        </div>
      </div>
    </>
  );
}
