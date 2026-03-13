'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { COMP_AS_PCT_REVENUE, KPI_MEASUREMENTS } from '@/data/register/comp-data';
import type { FormatId } from '@/data/register/store-data';

const ACCENT = '#10B981';

const FORMAT_SUMMARY: { format: string; formatId: FormatId; enrolled: number; budget: string; avgPayout: string; color: string }[] = [
  { format: 'Flagship', formatId: 'flagship', enrolled: 48, budget: '$142K', avgPayout: '$6,200', color: '#1E3A5F' },
  { format: 'Standard', formatId: 'standard', enrolled: 72, budget: '$198K', avgPayout: '$4,800', color: '#06B6D4' },
  { format: 'Outlet', formatId: 'outlet', enrolled: 34, budget: '$68K', avgPayout: '$3,400', color: '#8B5CF6' },
  { format: 'Shop-in-Shop', formatId: 'shop-in-shop', enrolled: 16, budget: '$42K', avgPayout: '$5,100', color: '#10B981' },
];

export default function ExecutiveViewPage() {
  const insight = getInsight('comp/executive');
  const maxPct = Math.max(...COMP_AS_PCT_REVENUE.map((d) => d.pct));
  const avgPct = (COMP_AS_PCT_REVENUE.reduce((s, d) => s + d.pct, 0) / COMP_AS_PCT_REVENUE.length).toFixed(1);

  return (
    <RegisterPage title="Executive View" subtitle="Compensation Program Health" accentColor={ACCENT}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Comp Budget', value: '$450K/mo', color: '#1E3A5F' },
          { label: 'Enrolled Reps', value: '170', color: '#06B6D4' },
          { label: 'Avg Comp/Revenue', value: `${avgPct}%`, color: ACCENT },
          { label: 'Budget Variance', value: '+2.1%', color: '#F59E0B' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-5"
            style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
          >
            <p className="text-[10px] uppercase tracking-wide font-semibold mb-2" style={{ color: 'var(--register-text-muted)' }}>
              {kpi.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Comp as % of Revenue — Bar/Sparkline */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--register-text)' }}>
            Comp as % of Revenue — Trend
          </h2>
          <span className="text-xs font-mono" style={{ color: 'var(--register-text-muted)' }}>
            Target: 8.0% | Avg: {avgPct}%
          </span>
        </div>
        <div className="flex items-end gap-3" style={{ height: 160 }}>
          {COMP_AS_PCT_REVENUE.map((d, i) => {
            const barHeight = (d.pct / (maxPct + 1)) * 140;
            const isAboveTarget = d.pct > 8.0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold font-mono" style={{ color: isAboveTarget ? '#F59E0B' : ACCENT }}>
                  {d.pct}%
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: barHeight,
                    backgroundColor: isAboveTarget ? '#F59E0B' : ACCENT,
                    opacity: 0.7 + (i * 0.05),
                  }}
                />
                <span className="text-xs font-medium" style={{ color: 'var(--register-text-muted)' }}>{d.month}</span>
              </div>
            );
          })}
        </div>
        {/* Target line label */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-px flex-1" style={{ backgroundColor: '#F59E0B', opacity: 0.4 }} />
          <span className="text-[10px] font-mono" style={{ color: '#F59E0B' }}>8.0% target</span>
          <div className="h-px flex-1" style={{ backgroundColor: '#F59E0B', opacity: 0.4 }} />
        </div>
      </div>

      {/* Format Comparison Table */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
          Format Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--register-border)' }}>
                <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Format</th>
                <th className="text-right py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Enrolled</th>
                <th className="text-right py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Monthly Budget</th>
                <th className="text-right py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Avg Payout</th>
                <th className="text-right py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Units Sold</th>
                <th className="text-right py-3 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {FORMAT_SUMMARY.map((row) => {
                const kpis = KPI_MEASUREMENTS[row.formatId];
                const units = kpis?.find((k) => k.label === 'Units Sold');
                const revenue = kpis?.find((k) => k.label === 'Revenue');
                return (
                  <tr key={row.format} style={{ borderBottom: '1px solid var(--register-border)' }}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        <span className="font-semibold" style={{ color: 'var(--register-text)' }}>{row.format}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono" style={{ color: 'var(--register-text)' }}>{row.enrolled}</td>
                    <td className="py-3 pr-4 text-right font-mono" style={{ color: 'var(--register-text)' }}>{row.budget}</td>
                    <td className="py-3 pr-4 text-right font-mono font-bold" style={{ color: ACCENT }}>{row.avgPayout}</td>
                    <td className="py-3 pr-4 text-right font-mono" style={{ color: 'var(--register-text-muted)' }}>
                      {units?.value ?? '-'}
                    </td>
                    <td className="py-3 text-right font-mono" style={{ color: 'var(--register-text-muted)' }}>
                      {revenue ? `$${(revenue.value / 1000).toFixed(0)}K` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Variance Callout */}
      <div
        className="rounded-xl p-5 mb-8 flex items-start gap-4"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}
      >
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
          style={{ backgroundColor: '#F59E0B' }}
        >
          !
        </span>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--register-text)' }}>
            Budget Variance: +2.1% Over Q1 Target
          </p>
          <p className="text-xs" style={{ color: 'var(--register-text-muted)' }}>
            Primary driver: Flagship format overpayment on Platinum tier. 8 reps hit Platinum ahead of schedule due to
            strong Presidents Day weekend performance. Recommend raising Flagship Platinum threshold from $75K to $82K
            for Q2 to align budget with revenue targets.
          </p>
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <AIInsightCard label={insight.label}>
          {insight.text}
        </AIInsightCard>
      )}
    </RegisterPage>
  );
}
