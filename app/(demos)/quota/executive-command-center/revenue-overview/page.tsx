'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, BarChart3,
  ArrowUpRight, ArrowDownRight, Calendar,
} from 'lucide-react';
import { QUARTERLY_REVENUE, TERRITORIES } from '@/data/quota';
import { fmtDollar, fmtPct, fmtM } from '@/lib/utils';

/* ── Derived data ─────────────────────────────────────────────── */
const ytdRevenue = QUARTERLY_REVENUE.reduce((s, q) => s + q.actual, 0);
const ytdTarget = QUARTERLY_REVENUE.reduce((s, q) => s + q.target, 0);
const ytdVariance = ytdRevenue - ytdTarget;
const ytdVariancePct = (ytdVariance / ytdTarget) * 100;

const latestQ = QUARTERLY_REVENUE[QUARTERLY_REVENUE.length - 1];
const prevQ = QUARTERLY_REVENUE[QUARTERLY_REVENUE.length - 2];
const qoqGrowth = ((latestQ.actual - prevQ.actual) / prevQ.actual) * 100;

const bestQuarter = [...QUARTERLY_REVENUE].sort((a, b) => b.actual - a.actual)[0];

const territoryData = [...TERRITORIES]
  .sort((a, b) => b.revenue - a.revenue)
  .map(t => ({
    ...t,
    attainment: Math.round((t.revenue / t.quota) * 100),
    gap: t.quota - t.revenue,
  }));

/* ── KPI card ─────────────────────────────────────────────────── */
function KPI({ label, value, sub, icon: Icon, trend, trendUp }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{label}</span>
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
          {p.name}: {fmtDollar(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function RevenueOverviewPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Revenue Overview</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Comprehensive revenue tracking against targets across all business segments.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-secondary)' }}>
          <Calendar className="h-3.5 w-3.5" />
          FY 2025 - Q1 2026
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI
          label="YTD Revenue" value={fmtDollar(ytdRevenue)} sub="all segments"
          icon={DollarSign} trend="+12.4%" trendUp
        />
        <KPI
          label="vs Target" value={`${ytdVariance >= 0 ? '+' : ''}${fmtDollar(Math.abs(ytdVariance))}`}
          sub={fmtPct(Math.abs(ytdVariancePct)) + ' variance'}
          icon={ytdVariance >= 0 ? TrendingUp : TrendingDown}
          trend={fmtPct(Math.abs(ytdVariancePct))} trendUp={ytdVariance >= 0}
        />
        <KPI
          label="QoQ Growth" value={fmtPct(Math.abs(qoqGrowth))}
          sub={`${latestQ.quarter} vs ${prevQ.quarter}`}
          icon={TrendingUp} trend={qoqGrowth >= 0 ? 'up' : 'down'} trendUp={qoqGrowth >= 0}
        />
        <KPI
          label="Best Quarter" value={bestQuarter.quarter}
          sub={fmtDollar(bestQuarter.actual)}
          icon={BarChart3} trend="+5.5% over target" trendUp
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Quarterly Revenue vs Target */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Quarterly Revenue vs Target</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={QUARTERLY_REVENUE} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="quarter" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => fmtM(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748B' }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#6366f1" fill="url(#targetGrad)" strokeWidth={2} strokeDasharray="5 3" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#f59e0b" fill="url(#actualGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Territory */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Revenue by Territory</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={territoryData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => fmtM(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="quota" name="Quota" fill="rgba(99,102,241,0.3)" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]} barSize={24}>
                {territoryData.map((t, i) => (
                  <Cell key={i} fill={t.attainment >= 100 ? '#10b981' : t.attainment >= 85 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quarterly Breakdown Table */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Quarterly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Quarter</th>
                <th className="pb-3 text-xs font-medium text-right" style={{ color: 'var(--prizym-text-muted)' }}>Target</th>
                <th className="pb-3 text-xs font-medium text-right" style={{ color: 'var(--prizym-text-muted)' }}>Actual</th>
                <th className="pb-3 text-xs font-medium text-right" style={{ color: 'var(--prizym-text-muted)' }}>Variance</th>
                <th className="pb-3 text-xs font-medium text-right" style={{ color: 'var(--prizym-text-muted)' }}>Attainment</th>
                <th className="pb-3 text-xs font-medium w-40" style={{ color: 'var(--prizym-text-muted)' }}>Progress</th>
                <th className="pb-3 text-xs font-medium text-center" style={{ color: 'var(--prizym-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {QUARTERLY_REVENUE.map((q) => {
                const variance = q.actual - q.target;
                const att = (q.actual / q.target) * 100;
                const hit = att >= 100;
                return (
                  <tr key={q.quarter} className="transition hover:opacity-80" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-3 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{q.quarter}</td>
                    <td className="py-3 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(q.target)}</td>
                    <td className="py-3 text-right font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(q.actual)}</td>
                    <td className={`py-3 text-right font-medium ${variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {variance >= 0 ? '+' : ''}{fmtDollar(variance)}
                    </td>
                    <td className={`py-3 text-right font-bold ${hit ? 'text-emerald-600' : att >= 90 ? 'text-amber-400' : 'text-red-600'}`}>
                      {fmtPct(att)}
                    </td>
                    <td className="py-3">
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(att, 100)}%`,
                            backgroundColor: hit ? '#10b981' : att >= 90 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        hit ? 'bg-emerald-500/10 text-emerald-600' : att >= 90 ? 'bg-amber-400/10 text-amber-400' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {hit ? 'EXCEEDED' : att >= 90 ? 'ON TRACK' : 'MISSED'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
                <td className="pt-3 font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Total</td>
                <td className="pt-3 text-right font-medium" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(ytdTarget)}</td>
                <td className="pt-3 text-right font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(ytdRevenue)}</td>
                <td className={`pt-3 text-right font-bold ${ytdVariance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {ytdVariance >= 0 ? '+' : ''}{fmtDollar(ytdVariance)}
                </td>
                <td className={`pt-3 text-right font-bold ${ytdRevenue >= ytdTarget ? 'text-emerald-600' : 'text-amber-400'}`}>
                  {fmtPct((ytdRevenue / ytdTarget) * 100)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Territory Detail Cards */}
      <div className="mt-6 rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Territory Revenue Detail</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {territoryData.map(t => (
            <div key={t.name} className="rounded-lg p-4" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{t.name}</span>
                <span className={`text-xs font-bold ${t.attainment >= 100 ? 'text-emerald-600' : t.attainment >= 85 ? 'text-amber-400' : 'text-red-600'}`}>
                  {t.attainment}%
                </span>
              </div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(t.attainment, 100)}%`,
                    backgroundColor: t.attainment >= 100 ? '#10b981' : t.attainment >= 85 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--prizym-text-muted)' }}>Rev: {fmtDollar(t.revenue)}</span>
                <span style={{ color: 'var(--prizym-text-muted)' }}>{t.accounts} accts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
