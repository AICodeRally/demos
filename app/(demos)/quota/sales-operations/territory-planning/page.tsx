'use client';

import { TERRITORIES, REPS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  MapPin, Users, DollarSign, BarChart3, ArrowUpRight,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

const totalAccounts = TERRITORIES.reduce((s, t) => s + t.accounts, 0);
const totalRevenue = TERRITORIES.reduce((s, t) => s + t.revenue, 0);
const totalReps = TERRITORIES.reduce((s, t) => s + t.reps, 0);
const avgRevenuePerRep = totalRevenue / totalReps;
const coverageScore = Math.round((TERRITORIES.filter(t => t.revenue >= t.quota).length / TERRITORIES.length) * 100);

const kpis = [
  { label: 'Territories', value: `${TERRITORIES.length}`, icon: MapPin, delta: '2 new this quarter', up: true },
  { label: 'Total Accounts', value: `${totalAccounts}`, icon: Users, delta: '+18 net new', up: true },
  { label: 'Avg Revenue/Rep', value: fmtDollar(Math.round(avgRevenuePerRep)), icon: DollarSign, delta: '+11% YoY', up: true },
  { label: 'Coverage Score', value: `${coverageScore}%`, icon: BarChart3, delta: `${TERRITORIES.filter(t => t.revenue >= t.quota).length}/${TERRITORIES.length} hitting quota`, up: coverageScore >= 60 },
];

const chartData = TERRITORIES.map(t => ({
  name: t.name,
  revenue: t.revenue,
  quota: t.quota,
  attainment: Math.round((t.revenue / t.quota) * 100),
})).sort((a, b) => b.attainment - a.attainment);

// Radar chart data (normalized)
const maxAccounts = Math.max(...TERRITORIES.map(t => t.accounts));
const maxRev = Math.max(...TERRITORIES.map(t => t.revenue));
const radarData = TERRITORIES.map(t => ({
  territory: t.name.length > 8 ? t.name.slice(0, 8) : t.name,
  accounts: Math.round((t.accounts / maxAccounts) * 100),
  revenue: Math.round((t.revenue / maxRev) * 100),
  capacity: Math.round(((t.accounts / t.reps) / (maxAccounts / 2)) * 100),
}));

function getTrend(att: number) {
  if (att >= 1.05) return { icon: TrendingUp, color: 'text-emerald-600', label: 'Exceeding' };
  if (att >= 0.90) return { icon: Minus, color: 'text-amber-400', label: 'On Pace' };
  return { icon: TrendingDown, color: 'text-red-600', label: 'Behind' };
}

export default function TerritoryPlanningPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Territory Planning</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Design, balance, and optimize sales territories for maximum coverage and revenue.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
            Rebalance
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            + New Territory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{k.label}</span>
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

      {/* Territory Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {TERRITORIES.map(t => {
          const att = t.revenue / t.quota;
          const trend = getTrend(att);
          const TrendIcon = trend.icon;
          const reps = REPS.filter(r => r.territory === t.name);
          return (
            <div key={t.name} className="rounded-xl p-4 transition hover:opacity-90" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-sm" style={{ color: 'var(--prizym-text-primary)' }}>{t.name}</span>
                </div>
                <span className={`flex items-center gap-1 text-xs ${trend.color}`}>
                  <TrendIcon className="h-3 w-3" />
                  {trend.label}
                </span>
              </div>
              <div className="space-y-2 text-xs mb-3">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--prizym-text-muted)' }}>Revenue</span>
                  <span className="font-mono">{fmtDollar(t.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--prizym-text-muted)' }}>Quota</span>
                  <span className="font-mono">{fmtDollar(t.quota)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--prizym-text-muted)' }}>Accounts</span>
                  <span>{t.accounts}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--prizym-text-muted)' }}>Reps</span>
                  <span>{t.reps}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--prizym-text-muted)' }}>Attainment</span>
                  <span className={`font-semibold ${trend.color}`}>{fmtPct(att * 100)}</span>
                </div>
              </div>
              <div className="w-full rounded-full h-2 overflow-hidden mb-2" style={{ background: 'var(--prizym-border-default)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(att * 100, 100)}%`,
                    background: att >= 1.05 ? '#34d399' : att >= 0.90 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              {reps.length > 0 && (
                <div className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
                  {reps.map(r => r.name.split(' ')[0]).join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Territory Comparison Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Revenue vs Quota by Territory</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} angle={-20} />
                <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                  formatter={(v: any) => [fmtDollar(v)]}
                />
                <Bar dataKey="quota" fill="rgba(148,163,184,0.25)" radius={[4, 4, 0, 0]} maxBarSize={28} name="Quota" />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={28} name="Revenue">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.attainment >= 100 ? '#34d399' : entry.attainment >= 90 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Territory Balance Radar</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="territory" tick={{ fill: '#64748B', fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Accounts" dataKey="accounts" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Revenue" dataKey="revenue" stroke="#34d399" fill="#34d399" fillOpacity={0.1} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-0.5 bg-amber-400 rounded" />
              <span style={{ color: 'var(--prizym-text-muted)' }}>Accounts</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-0.5 bg-emerald-400 rounded" />
              <span style={{ color: 'var(--prizym-text-muted)' }}>Revenue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Territory Table */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Territory Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                <th className="text-left py-3 pr-4">Territory</th>
                <th className="text-right py-3 pr-4">Accounts</th>
                <th className="text-right py-3 pr-4">Reps</th>
                <th className="text-right py-3 pr-4">Accts/Rep</th>
                <th className="text-right py-3 pr-4">Revenue</th>
                <th className="text-right py-3 pr-4">Quota</th>
                <th className="text-right py-3 pr-4">Attainment</th>
                <th className="text-right py-3">Rev/Acct</th>
              </tr>
            </thead>
            <tbody>
              {TERRITORIES.map(t => {
                const att = t.revenue / t.quota;
                const trend = getTrend(att);
                return (
                  <tr key={t.name} className="transition hover:opacity-80" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-amber-400" />
                        <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{t.accounts}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{t.reps}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{Math.round(t.accounts / t.reps)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(t.revenue)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(t.quota)}</td>
                    <td className={`py-3 pr-4 text-right font-semibold ${trend.color}`}>
                      {fmtPct(att * 100)}
                    </td>
                    <td className="py-3 text-right font-mono text-xs">{fmtDollar(Math.round(t.revenue / t.accounts))}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="text-xs" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
                <td className="py-3 font-semibold">Total / Avg</td>
                <td className="py-3 pr-4 text-right font-mono">{totalAccounts}</td>
                <td className="py-3 pr-4 text-right font-mono">{totalReps}</td>
                <td className="py-3 pr-4 text-right font-mono">{Math.round(totalAccounts / totalReps)}</td>
                <td className="py-3 pr-4 text-right font-mono">{fmtDollar(totalRevenue)}</td>
                <td className="py-3 pr-4 text-right font-mono">{fmtDollar(TERRITORIES.reduce((s, t) => s + t.quota, 0))}</td>
                <td className="py-3 pr-4 text-right font-semibold text-amber-400">
                  {fmtPct((totalRevenue / TERRITORIES.reduce((s, t) => s + t.quota, 0)) * 100)}
                </td>
                <td className="py-3 text-right font-mono">{fmtDollar(Math.round(totalRevenue / totalAccounts))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
