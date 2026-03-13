'use client';

import { REPS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Target, Users, AlertTriangle, TrendingUp, CheckCircle2, Clock, ArrowUpRight,
} from 'lucide-react';

const totalQuota = REPS.reduce((s, r) => s + r.quota, 0);
const totalActual = REPS.reduce((s, r) => s + r.actual, 0);
const avgPerRep = totalQuota / REPS.length;
const unassignedPool = 15_200_000 - totalQuota; // company pool minus assigned

function getStatus(att: number) {
  if (att >= 1.05) return { label: 'Exceeding', color: 'text-emerald-600', bg: 'bg-emerald-400/15 border-emerald-400/30' };
  if (att >= 0.85) return { label: 'On Track', color: 'text-amber-400', bg: 'bg-amber-400/15 border-amber-400/30' };
  return { label: 'At Risk', color: 'text-red-600', bg: 'bg-red-400/15 border-red-400/30' };
}

const kpis = [
  { label: 'Total Quota Pool', value: fmtDollar(15_200_000), icon: Target, delta: '+8% vs FY25', up: true },
  { label: 'Assigned', value: fmtDollar(totalQuota), icon: Users, delta: fmtPct((totalQuota / 15_200_000) * 100) + ' allocated', up: true },
  { label: 'Unassigned', value: fmtDollar(unassignedPool), icon: AlertTriangle, delta: fmtPct((unassignedPool / 15_200_000) * 100) + ' remaining', up: false },
  { label: 'Avg per Rep', value: fmtDollar(Math.round(avgPerRep)), icon: TrendingUp, delta: '+12% vs prior', up: true },
];

const chartData = REPS.map(r => ({
  name: r.name.split(' ')[0],
  attainment: Math.round((r.actual / r.quota) * 100),
  quota: r.quota,
  actual: r.actual,
}));

const teamSummary = ['Enterprise', 'Mid-Market', 'SMB'].map(team => {
  const members = REPS.filter(r => r.team === team);
  const tQuota = members.reduce((s, r) => s + r.quota, 0);
  const tActual = members.reduce((s, r) => s + r.actual, 0);
  return { team, members: members.length, quota: tQuota, actual: tActual, att: tActual / tQuota };
});

export default function QuotaAssignmentPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Quota Assignment</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Create, assign, and manage sales quotas across teams, individuals, and territories.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
            Export CSV
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            + Assign Quota
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
              <ArrowUpRight className={`h-3 w-3 ${k.up ? 'text-emerald-600' : 'text-red-600'}`} />
              <span className={`text-xs ${k.up ? 'text-emerald-600' : 'text-red-600'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Attainment Chart */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Quota Attainment by Rep</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 130]} tickFormatter={v => `${v}%`} tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} width={70} />
              <Tooltip
                contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                formatter={(v: any) => [`${v}%`, 'Attainment']}
              />
              <Bar dataKey="attainment" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.attainment >= 100 ? '#34d399' : entry.attainment >= 85 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rep Assignment Table */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Individual Quota Assignments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                <th className="text-left py-3 pr-4">Rep</th>
                <th className="text-left py-3 pr-4">Team</th>
                <th className="text-left py-3 pr-4">Territory</th>
                <th className="text-right py-3 pr-4">Quota</th>
                <th className="text-right py-3 pr-4">Actual</th>
                <th className="text-right py-3 pr-4">Attainment</th>
                <th className="py-3 pr-4 w-40">Progress</th>
                <th className="text-center py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {REPS.map(r => {
                const att = r.actual / r.quota;
                const status = getStatus(att);
                return (
                  <tr key={r.id} className="transition hover:opacity-80" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-3 pr-4 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{r.name}</td>
                    <td className="py-3 pr-4" style={{ color: 'var(--prizym-text-muted)' }}>{r.team}</td>
                    <td className="py-3 pr-4" style={{ color: 'var(--prizym-text-muted)' }}>{r.territory}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-xs">{fmtDollar(r.quota)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-xs">{fmtDollar(r.actual)}</td>
                    <td className={`py-3 pr-4 text-right font-semibold ${status.color}`}>
                      {fmtPct(att * 100)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(att * 100, 100)}%`,
                            background: att >= 1.05 ? '#34d399' : att >= 0.85 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${status.bg}`}>
                        {att >= 1.05 ? <CheckCircle2 className="h-3 w-3" /> : att >= 0.85 ? <Clock className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Summary */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Team Quota Summary</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {teamSummary.map(t => {
            const status = getStatus(t.att);
            return (
              <div key={t.team} className="rounded-xl p-4" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{t.team}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${status.bg}`}>{status.label}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--prizym-text-muted)' }}>Members</span>
                    <span>{t.members} reps</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--prizym-text-muted)' }}>Total Quota</span>
                    <span className="tabular-nums">{fmtDollar(t.quota)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--prizym-text-muted)' }}>Total Actual</span>
                    <span className="tabular-nums">{fmtDollar(t.actual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--prizym-text-muted)' }}>Attainment</span>
                    <span className={`font-semibold ${status.color}`}>{fmtPct(t.att * 100)}</span>
                  </div>
                </div>
                <div className="mt-3 w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(t.att * 100, 100)}%`,
                      background: t.att >= 1.05 ? '#34d399' : t.att >= 0.85 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
