'use client';

import { PIPELINE } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area,
} from 'recharts';
import {
  Layers, DollarSign, Trophy, Clock, ArrowUpRight,
  ChevronDown, AlertTriangle,
} from 'lucide-react';

const totalPipeline = PIPELINE.reduce((s, p) => s + p.value, 0);
const totalDeals = PIPELINE.reduce((s, p) => s + p.deals, 0);
const closedWon = PIPELINE.find(p => p.stage === 'Closed Won')!;
const winRate = (closedWon.deals / totalDeals) * 100;
const avgCycle = PIPELINE.filter(p => p.avgDays > 0).reduce((s, p) => s + p.avgDays, 0) / PIPELINE.filter(p => p.avgDays > 0).length;

// Weighted pipeline value (stage-based probability)
const stageProb: Record<string, number> = {
  'Prospecting': 0.10, 'Qualification': 0.25, 'Proposal': 0.50,
  'Negotiation': 0.75, 'Closed Won': 1.00,
};
const weightedValue = PIPELINE.reduce((s, p) => s + p.value * (stageProb[p.stage] ?? 0), 0);

const kpis = [
  { label: 'Total Pipeline', value: fmtDollar(totalPipeline), icon: Layers, delta: `${totalDeals} active deals`, up: true },
  { label: 'Weighted Value', value: fmtDollar(Math.round(weightedValue)), icon: DollarSign, delta: 'Probability-adjusted', up: true },
  { label: 'Win Rate', value: fmtPct(winRate), icon: Trophy, delta: '+2.1% vs prior Q', up: true },
  { label: 'Avg Cycle', value: `${Math.round(avgCycle)} days`, icon: Clock, delta: '-3 days improvement', up: true },
];

// Funnel widths for visual
const maxVal = Math.max(...PIPELINE.map(p => p.value));
const funnelColors = ['#f59e0b', '#eab308', '#22d3ee', '#818cf8', '#34d399'];

// Pipeline velocity trend (inline data)
const velocityTrend = [
  { week: 'W1', created: 12, moved: 8, closed: 2, value: 1_800_000 },
  { week: 'W2', created: 15, moved: 10, closed: 3, value: 2_100_000 },
  { week: 'W3', created: 9, moved: 12, closed: 1, value: 1_600_000 },
  { week: 'W4', created: 18, moved: 14, closed: 4, value: 2_800_000 },
  { week: 'W5', created: 11, moved: 9, closed: 2, value: 1_900_000 },
  { week: 'W6', created: 14, moved: 11, closed: 3, value: 2_400_000 },
];

// Stalled deals (inline data)
const stalledDeals = [
  { name: 'Acme Corp Platform License', value: 340_000, stage: 'Negotiation', days: 38, owner: 'Sarah Chen' },
  { name: 'TechVision Analytics Suite', value: 285_000, stage: 'Negotiation', days: 32, owner: 'Marcus Johnson' },
  { name: 'GlobalTech CRM Migration', value: 265_000, stage: 'Proposal', days: 28, owner: 'Emily Rodriguez' },
  { name: 'Pinnacle Data Warehouse', value: 180_000, stage: 'Qualification', days: 35, owner: 'Priya Patel' },
];

export default function PipelineManagementPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize, track, and manage your sales pipeline from prospecting through close.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
            Pipeline Review
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            + New Deal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
              <k.icon className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
        <h2 className="text-sm font-semibold mb-5">Pipeline Funnel</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {PIPELINE.map((p, i) => {
            const widthPct = (p.value / maxVal) * 100;
            return (
              <div key={p.stage} className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-28 text-xs text-right text-muted-foreground shrink-0">{p.stage}</div>
                  <div className="flex-1">
                    <div
                      className="h-10 rounded-lg flex items-center px-3 transition-all relative overflow-hidden"
                      style={{
                        width: `${Math.max(widthPct, 15)}%`,
                        background: `${funnelColors[i]}20`,
                        border: `1px solid ${funnelColors[i]}40`,
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-lg opacity-30"
                        style={{ width: `${widthPct}%`, background: funnelColors[i] }}
                      />
                      <span className="text-xs font-semibold relative z-10" style={{ color: funnelColors[i] }}>
                        {fmtDollar(p.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-20 text-xs text-muted-foreground shrink-0">
                    {p.deals} deals
                  </div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ChevronDown className="h-3 w-3 text-white/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Pipeline Value by Stage */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold mb-4">Value by Stage</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PIPELINE} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="stage" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [fmtDollar(v), 'Value']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {PIPELINE.map((_, i) => (
                    <Cell key={i} fill={funnelColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Velocity */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold mb-4">Deal Velocity Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityTrend} margin={{ left: 0, right: 10 }}>
                <defs>
                  <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="created" stroke="#f59e0b" fill="url(#velGrad)" strokeWidth={2} name="Created" />
                <Area type="monotone" dataKey="closed" stroke="#34d399" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Closed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stage Detail Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
        <h2 className="text-sm font-semibold mb-4">Stage Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left py-3 pr-4">Stage</th>
                <th className="text-right py-3 pr-4">Deals</th>
                <th className="text-right py-3 pr-4">Value</th>
                <th className="text-right py-3 pr-4">Avg Days</th>
                <th className="text-right py-3 pr-4">Win Prob</th>
                <th className="text-right py-3">Weighted</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINE.map((p, i) => (
                <tr key={p.stage} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: funnelColors[i] }} />
                      <span className="font-medium">{p.stage}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{p.deals}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(p.value)}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{p.avgDays > 0 ? `${p.avgDays}d` : '--'}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{fmtPct((stageProb[p.stage] ?? 0) * 100)}</td>
                  <td className="py-3 text-right font-semibold text-amber-400 font-mono text-xs">
                    {fmtDollar(Math.round(p.value * (stageProb[p.stage] ?? 0)))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td className="py-3 font-semibold">Total</td>
                <td className="py-3 pr-4 text-right font-mono">{totalDeals}</td>
                <td className="py-3 pr-4 text-right font-mono">{fmtDollar(totalPipeline)}</td>
                <td className="py-3 pr-4 text-right font-mono">{Math.round(avgCycle)}d</td>
                <td className="py-3 pr-4" />
                <td className="py-3 text-right font-bold text-amber-400 font-mono">{fmtDollar(Math.round(weightedValue))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Stalled Deals */}
      <div className="rounded-xl border border-red-400/20 bg-red-400/[0.03] p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <h2 className="text-sm font-semibold text-red-400">Stalled Deals ({stalledDeals.length})</h2>
        </div>
        <div className="space-y-3">
          {stalledDeals.map(d => (
            <div key={d.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <span className="font-medium text-sm">{d.name}</span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground">{d.owner}</span>
                  <span className="text-xs text-muted-foreground">{d.stage}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-semibold">{fmtDollar(d.value)}</span>
                <div className="text-xs text-red-400">{d.days} days stalled</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
