'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import {
  Map, Building2, Target, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Users, Eye,
} from 'lucide-react';
import { TERRITORIES, REPS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── Derived data ─────────────────────────────────────────────── */
const totalAccounts = TERRITORIES.reduce((s, t) => s + t.accounts, 0);
const totalRevenue = TERRITORIES.reduce((s, t) => s + t.revenue, 0);
const totalQuota = TERRITORIES.reduce((s, t) => s + t.quota, 0);
const avgAttainment = (totalRevenue / totalQuota) * 100;
const coverageGap = totalQuota - totalRevenue;
const territoriesAbove = TERRITORIES.filter(t => t.revenue >= t.quota).length;

const territoryCards = TERRITORIES.map(t => ({
  ...t,
  attainment: Math.round((t.revenue / t.quota) * 100),
  gap: t.quota - t.revenue,
  revPerAccount: Math.round(t.revenue / t.accounts),
  status: t.revenue >= t.quota ? 'above' : t.revenue / t.quota >= 0.85 ? 'on-track' : 'at-risk',
  repsInTerritory: REPS.filter(r => r.territory === t.name),
})).sort((a, b) => b.attainment - a.attainment);

const pieData = [
  { name: 'Above Quota', value: territoriesAbove, fill: '#10b981' },
  { name: 'On Track', value: TERRITORIES.filter(t => t.revenue / t.quota >= 0.85 && t.revenue < t.quota).length, fill: '#f59e0b' },
  { name: 'At Risk', value: TERRITORIES.filter(t => t.revenue / t.quota < 0.85).length, fill: '#ef4444' },
];

const revPerAccountData = territoryCards.map(t => ({
  name: t.name,
  revPerAccount: t.revPerAccount,
})).sort((a, b) => b.revPerAccount - a.revPerAccount);

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

/* ── Status badge ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const config = {
    above: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', label: 'EXCEEDING' },
    'on-track': { bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'ON TRACK' },
    'at-risk': { bg: 'bg-red-500/10', text: 'text-red-600', label: 'AT RISK' },
  }[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500', label: 'UNKNOWN' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function TerritoryHeatmapPage() {
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Territory Heatmap</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Visual territory analysis with attainment scoring, coverage gaps, and rep allocation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5" style={{ color: 'var(--prizym-text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>8 territories monitored</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Territories" value={String(TERRITORIES.length)} sub="regions" icon={Map} trend={`${territoriesAbove} exceeding`} trendUp />
        <KPI label="Total Accounts" value={totalAccounts.toLocaleString()} sub="across all regions" icon={Building2} trend="+18 this quarter" trendUp />
        <KPI label="Avg Attainment" value={fmtPct(avgAttainment)} sub="weighted average" icon={Target} trend="-1.8% vs Q4" trendUp={false} />
        <KPI label="Coverage Gap" value={fmtDollar(coverageGap)} sub="total shortfall" icon={AlertTriangle} trend="3 territories at risk" trendUp={false} />
      </div>

      {/* Territory Grid */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Territory Performance Cards</h2>
          <div className="flex items-center gap-4">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {territoryCards.map(t => {
            const isSelected = selectedTerritory === t.name;
            const borderColor = t.status === 'above' ? 'border-emerald-500/40' : t.status === 'on-track' ? 'border-amber-500/40' : 'border-red-500/40';
            const glowColor = t.status === 'above' ? 'shadow-emerald-500/10' : t.status === 'on-track' ? 'shadow-amber-500/10' : 'shadow-red-500/10';

            return (
              <button
                key={t.name}
                onClick={() => setSelectedTerritory(isSelected ? null : t.name)}
                className={`text-left rounded-xl border-2 ${borderColor} p-4 transition-all ${
                  isSelected ? `ring-1 ring-amber-400/50 shadow-lg ${glowColor}` : ''
                }`}
                style={{ background: 'var(--prizym-card-bg)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{t.name}</span>
                  <StatusBadge status={t.status} />
                </div>

                {/* Attainment bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Attainment</span>
                    <span className={`text-sm font-bold ${t.status === 'above' ? 'text-emerald-600' : t.status === 'on-track' ? 'text-amber-400' : 'text-red-600'}`}>
                      {t.attainment}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(t.attainment, 100)}%`,
                        backgroundColor: t.status === 'above' ? '#10b981' : t.status === 'on-track' ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span style={{ color: 'var(--prizym-text-muted)' }} className="block">Revenue</span>
                    <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(t.revenue)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--prizym-text-muted)' }} className="block">Quota</span>
                    <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(t.quota)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--prizym-text-muted)' }} className="block">Accounts</span>
                    <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{t.accounts}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--prizym-text-muted)' }} className="block">Reps</span>
                    <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{t.reps}</span>
                  </div>
                </div>

                {/* Gap or surplus */}
                <div className={`mt-3 pt-3 text-xs ${t.gap > 0 ? 'text-red-600' : 'text-emerald-600'}`} style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
                  {t.gap > 0 ? `${fmtDollar(t.gap)} gap to quota` : `${fmtDollar(Math.abs(t.gap))} above quota`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Territory Distribution Pie */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Territory Health Distribution</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
                        {payload[0].name}: {payload[0].value} territories
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="text-center">
                <p className="text-lg font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{d.value}</p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{d.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue per Account */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Revenue per Account by Territory</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revPerAccountData} margin={{ top: 5, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
                      <p className="mb-1" style={{ color: 'var(--prizym-text-secondary)' }}>{label}</p>
                      <p>Rev/Account: {fmtDollar(payload[0].value)}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="revPerAccount" name="Rev/Account" radius={[4, 4, 0, 0]} barSize={28}>
                {revPerAccountData.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? '#f59e0b' : 'rgba(245,158,11,0.4)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Territory Detail */}
      {selectedTerritory && (() => {
        const t = territoryCards.find(tc => tc.name === selectedTerritory);
        if (!t) return null;
        return (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--prizym-text-primary)' }}>
                <Map className="h-4 w-4 text-amber-400" />
                {t.name} Territory Detail
              </h2>
              <button onClick={() => setSelectedTerritory(null)} className="text-xs hover:opacity-70" style={{ color: 'var(--prizym-text-muted)' }}>Dismiss</button>
            </div>
            {t.repsInTerritory.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {t.repsInTerritory.map(r => {
                  const att = (r.actual / r.quota) * 100;
                  return (
                    <div key={r.id} className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{r.name}</p>
                        <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{r.team} Team</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${att >= 100 ? 'text-emerald-600' : att >= 85 ? 'text-amber-400' : 'text-red-600'}`}>
                          {fmtPct(att)}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{fmtDollar(r.actual)} / {fmtDollar(r.quota)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--prizym-text-muted)' }}>No individual rep data for this territory.</p>
            )}
          </div>
        );
      })()}

      {/* Full Territory Table */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>All Territories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="pb-3 text-xs font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Territory</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Accounts</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Revenue</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Quota</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Attainment</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Rev/Account</th>
                <th className="pb-3 text-xs font-semibold text-right" style={{ color: 'var(--prizym-text-muted)' }}>Reps</th>
                <th className="pb-3 text-xs font-semibold text-center" style={{ color: 'var(--prizym-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {territoryCards.map(t => (
                <tr key={t.name} className="transition cursor-pointer hover:opacity-80" style={{ borderBottom: '1px solid var(--prizym-border-default)' }} onClick={() => setSelectedTerritory(t.name)}>
                  <td className="py-3 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{t.name}</td>
                  <td className="py-3 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>{t.accounts}</td>
                  <td className="py-3 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(t.revenue)}</td>
                  <td className="py-3 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(t.quota)}</td>
                  <td className={`py-3 text-right font-bold ${t.status === 'above' ? 'text-emerald-600' : t.status === 'on-track' ? 'text-amber-400' : 'text-red-600'}`}>
                    {t.attainment}%
                  </td>
                  <td className="py-3 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(t.revPerAccount)}</td>
                  <td className="py-3 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>{t.reps}</td>
                  <td className="py-3 text-center"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
