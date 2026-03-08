'use client';

import {
  AreaChart, Area, ReferenceLine,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Dice5, Play, SlidersHorizontal, Target, TrendingUp,
  ShieldCheck, AlertTriangle, Sparkles, Lightbulb,
} from 'lucide-react';
import { fmtDollar } from '@/lib/utils';

/* ── Monte Carlo Distribution Data ────────────────────────── */

function generateDistribution() {
  const points: { revenue: number; density: number }[] = [];
  const mean = 27.3;
  const stdDev = 3.2;
  for (let x = 20; x <= 35; x += 0.3) {
    const z = (x - mean) / stdDev;
    const density = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
    points.push({ revenue: parseFloat(x.toFixed(1)), density: parseFloat((density * 100).toFixed(2)) });
  }
  return points;
}

const DISTRIBUTION_DATA = generateDistribution();

const PERCENTILES = [
  { label: 'P10', value: 22.1, color: '#ef4444' },
  { label: 'P25', value: 24.8, color: '#f97316' },
  { label: 'P50', value: 27.3, color: '#f59e0b' },
  { label: 'P75', value: 29.6, color: '#22c55e' },
  { label: 'P90', value: 31.9, color: '#10b981' },
];

const OUTCOME_CARDS = [
  { label: 'P10', sublabel: 'Pessimistic', value: '$22.1M', color: '#ef4444', bg: 'bg-red-50' },
  { label: 'P25', sublabel: '', value: '$24.8M', color: '#f97316', bg: 'bg-orange-50' },
  { label: 'P50', sublabel: 'Median', value: '$27.3M', color: '#f59e0b', bg: 'bg-amber-50' },
  { label: 'P75', sublabel: '', value: '$29.6M', color: '#22c55e', bg: 'bg-green-50' },
  { label: 'P90', sublabel: 'Optimistic', value: '$31.9M', color: '#10b981', bg: 'bg-emerald-50' },
];

const SCENARIOS = [
  { name: 'Conservative', target: 25_000_000, overAssign: '3%', probability: '91%', risk: 'Low', riskColor: 'text-emerald-600', riskBg: 'bg-emerald-50' },
  { name: 'Base Case', target: 28_500_000, overAssign: '6%', probability: '73%', risk: 'Medium', riskColor: 'text-amber-600', riskBg: 'bg-amber-50' },
  { name: 'Aggressive', target: 32_000_000, overAssign: '10%', probability: '42%', risk: 'High', riskColor: 'text-red-600', riskBg: 'bg-red-50' },
];

const PARAMETERS = [
  { label: 'Win Rate Variance', value: '±15%', icon: Target },
  { label: 'Avg Deal Size Variance', value: '±20%', icon: TrendingUp },
  { label: 'Pipeline Conversion Variance', value: '±10%', icon: SlidersHorizontal },
  { label: 'New Hire Ramp Variance', value: '±1 month', icon: Dice5 },
  { label: 'Market Growth Rate', value: '±5%', icon: TrendingUp },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function ScenarioSimulatorPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Scenario Simulator</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Monte Carlo simulation engine — test assumptions before committing to quota targets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full font-medium">
            <Sparkles className="h-3 w-3" /> AI-Powered
          </span>
        </div>
      </div>

      {/* Simulation Parameters + Results */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr] mb-6">
        {/* Parameters Panel */}
        <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div>
            <h2 className="font-semibold mb-0.5" style={{ color: 'var(--prizym-text-primary)' }}>Simulation Parameters</h2>
            <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Adjust variance ranges for Monte Carlo inputs</p>
          </div>

          {/* Corporate Target */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--prizym-text-muted)' }}>Corporate Target</label>
            <div className="rounded-lg px-3 py-2.5 text-sm font-semibold" style={{ background: '#F8FAFC', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-primary)' }}>
              $28,500,000
            </div>
          </div>

          {/* Variance Parameters */}
          <div className="flex flex-col gap-3">
            {PARAMETERS.map(p => (
              <div key={p.label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: '#F8FAFC', border: '1px solid var(--prizym-border-default)' }}>
                <div className="flex items-center gap-2">
                  <p.icon className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-medium" style={{ color: 'var(--prizym-text-secondary)' }}>{p.label}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{p.value}</span>
              </div>
            ))}
          </div>

          {/* Run Button */}
          <div className="mt-auto pt-2">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Play className="h-4 w-4" />
              Run Simulation
            </button>
            <div className="flex items-center justify-center mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-500">10,000 iterations</span>
            </div>
          </div>
        </div>

        {/* Probability Distribution Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Probability Distribution</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>Revenue outcome density from 10,000 Monte Carlo iterations</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium" style={{ color: 'var(--prizym-text-muted)' }}>
              {PERCENTILES.map(p => (
                <span key={p.label} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={DISTRIBUTION_DATA} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="revenue"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(v: number) => `$${v}M`}
                type="number"
                domain={[20, 35]}
                ticks={[20, 22, 24, 26, 28, 30, 32, 34]}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 11 }, offset: -5 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                formatter={(v: number) => [`${v.toFixed(2)}%`, 'Density']}
                labelFormatter={(v: number) => `$${v}M Revenue`}
                labelStyle={{ color: '#64748B' }}
              />
              <Area type="monotone" dataKey="density" stroke="#f59e0b" fill="url(#mcGrad)" strokeWidth={2.5} />
              {PERCENTILES.map(p => (
                <ReferenceLine
                  key={p.label}
                  x={p.value}
                  stroke={p.color}
                  strokeDasharray="6 3"
                  strokeWidth={1.5}
                  label={{ value: p.label, position: 'top', fill: p.color, fontSize: 11, fontWeight: 600 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outcome Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mb-6">
        {OUTCOME_CARDS.map(c => (
          <div key={c.label} className={`rounded-xl p-4 text-center ${c.bg}`} style={{ border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-xs font-bold" style={{ color: c.color }}>{c.label}</span>
              {c.sublabel && <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>({c.sublabel})</span>}
            </div>
            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Key Insight */}
      <div className="rounded-xl p-5 mb-6 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A', boxShadow: 'var(--prizym-shadow-card)' }}>
        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Key Insight</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--prizym-text-secondary)' }}>
            <strong>73% probability</strong> of hitting $28.5M corporate target. Risk-adjusted recommendation:
            Set quotas at <strong>$26.8M</strong> with <strong>6% over-assignment buffer</strong> to account for
            pipeline variance and new hire ramp delays.
          </p>
        </div>
      </div>

      {/* Scenario Comparison Table */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Scenario Comparison</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Pre-built quota scenarios with risk-adjusted probability analysis</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Scenario</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Corporate Target</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Over-Assignment %</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Probability of Hit</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIOS.map(s => (
                <tr key={s.name} className="transition-colors hover:bg-gray-50/50" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {s.risk === 'Low' && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                      {s.risk === 'Medium' && <Target className="h-4 w-4 text-amber-500" />}
                      {s.risk === 'High' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium" style={{ color: 'var(--prizym-text-primary)' }}>
                    {fmtDollar(s.target)}
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--prizym-text-secondary)' }}>
                    {s.overAssign}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: s.probability, background: s.risk === 'Low' ? '#10b981' : s.risk === 'Medium' ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{s.probability}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.riskColor} ${s.riskBg}`}>
                      {s.risk}
                    </span>
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
