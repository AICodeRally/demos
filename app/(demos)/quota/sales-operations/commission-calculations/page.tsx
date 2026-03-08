'use client';

import { REPS, COMMISSION_TIERS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import {
  DollarSign, TrendingUp, Award, AlertCircle, ArrowUpRight, ChevronRight,
} from 'lucide-react';

// Calculate commission for each rep based on attainment tier
function calcCommission(quota: number, actual: number): { amount: number; tier: string; rate: number } {
  const att = actual / quota;
  let commission = 0;

  // Tiered calculation
  const thresholds = [
    { cap: 0.80, rate: 0.06 },
    { cap: 1.00, rate: 0.08 },
    { cap: 1.20, rate: 0.12 },
    { cap: Infinity, rate: 0.18 },
  ];

  let remaining = actual;
  let prevCap = 0;
  for (const t of thresholds) {
    const slabTop = Math.min(t.cap, att) * quota;
    const slabBase = prevCap * quota;
    if (remaining <= 0) break;
    const slabAmount = Math.max(0, Math.min(remaining, slabTop - slabBase));
    commission += slabAmount * t.rate;
    remaining -= slabAmount;
    prevCap = t.cap;
  }

  // Determine tier label
  let tier = 'Base';
  if (att >= 1.20) tier = 'Super Accelerator';
  else if (att >= 1.00) tier = 'Accelerator';
  else if (att >= 0.80) tier = 'Standard';

  const rate = att >= 1.20 ? 0.18 : att >= 1.00 ? 0.12 : att >= 0.80 ? 0.08 : 0.06;

  return { amount: Math.round(commission), tier, rate };
}

const repCommissions = REPS.map(r => {
  const c = calcCommission(r.quota, r.actual);
  return { ...r, ...c, attainment: r.actual / r.quota };
}).sort((a, b) => b.amount - a.amount);

const totalCommissions = repCommissions.reduce((s, r) => s + r.amount, 0);
const avgRate = repCommissions.reduce((s, r) => s + r.rate, 0) / repCommissions.length;
const highestEarner = repCommissions[0];
const disputes = 2; // inline mock

const kpis = [
  { label: 'Total Commissions', value: fmtDollar(totalCommissions), icon: DollarSign, delta: '+14% vs prior Q', up: true },
  { label: 'Avg Effective Rate', value: fmtPct(avgRate * 100), icon: TrendingUp, delta: 'Blended across tiers', up: true },
  { label: 'Highest Earner', value: highestEarner.name.split(' ')[0], icon: Award, delta: fmtDollar(highestEarner.amount), up: true },
  { label: 'Open Disputes', value: `${disputes}`, icon: AlertCircle, delta: '$12,400 under review', up: false },
];

const chartData = repCommissions.map(r => ({
  name: r.name.split(' ')[0],
  commission: r.amount,
  tier: r.tier,
}));

// Tier distribution for pie chart
const tierCounts = COMMISSION_TIERS.map(t => ({
  name: t.tier,
  value: repCommissions.filter(r => r.tier === t.tier).length,
  fill: t.tier === 'Super Accelerator' ? '#34d399' : t.tier === 'Accelerator' ? '#22d3ee' : t.tier === 'Standard' ? '#f59e0b' : '#ef4444',
})).filter(t => t.value > 0);

const tierColors: Record<string, string> = {
  'Base': 'border-red-400/30 bg-red-400/10 text-red-400',
  'Standard': 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  'Accelerator': 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400',
  'Super Accelerator': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
};

export default function CommissionCalculationsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Commission Calculations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate, review, and manage commission payouts based on quota attainment tiers.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
            Run Payroll
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            Export Statements
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
              <ArrowUpRight className={`h-3 w-3 ${k.up ? 'text-emerald-400' : 'text-red-400'}`} />
              <span className={`text-xs ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Tier Ladder */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
        <h2 className="text-sm font-semibold mb-4">Commission Tier Structure</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {COMMISSION_TIERS.map((t, i) => (
            <div key={t.tier} className="relative">
              <div className={`rounded-lg border p-4 ${tierColors[t.tier]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold">{t.tier}</span>
                  <span className="text-lg font-bold">{t.label}</span>
                </div>
                <p className="text-xs opacity-80">Attainment: {t.range}</p>
                <div className="mt-2 text-xs opacity-60">
                  {repCommissions.filter(r => r.tier === t.tier).length} reps in tier
                </div>
              </div>
              {i < COMMISSION_TIERS.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="h-5 w-5 text-white/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Commission by Rep Chart */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold mb-4">Commission Earned by Rep</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [fmtDollar(v), 'Commission']}
                />
                <Bar dataKey="commission" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={
                      entry.tier === 'Super Accelerator' ? '#34d399' :
                      entry.tier === 'Accelerator' ? '#22d3ee' :
                      entry.tier === 'Standard' ? '#f59e0b' : '#ef4444'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution Pie */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold mb-4">Tier Distribution</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tierCounts.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any, name: any) => [`${v} reps`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {tierCounts.map(t => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.fill }} />
                  <span className="text-muted-foreground">{t.name}</span>
                </div>
                <span className="font-semibold">{t.value} reps</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Detail Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold mb-4">Commission Detail</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left py-3 pr-4">Rep</th>
                <th className="text-right py-3 pr-4">Quota</th>
                <th className="text-right py-3 pr-4">Actual</th>
                <th className="text-right py-3 pr-4">Attainment</th>
                <th className="text-center py-3 pr-4">Tier</th>
                <th className="text-right py-3 pr-4">Eff. Rate</th>
                <th className="text-right py-3">Commission</th>
              </tr>
            </thead>
            <tbody>
              {repCommissions.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="py-3 pr-4">
                    <div>
                      <span className="font-medium">{r.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{r.team}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(r.quota)}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(r.actual)}</td>
                  <td className={`py-3 pr-4 text-right font-semibold ${r.attainment >= 1 ? 'text-emerald-400' : r.attainment >= 0.85 ? 'text-amber-400' : 'text-red-400'}`}>
                    {fmtPct(r.attainment * 100)}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${tierColors[r.tier]}`}>
                      {r.tier}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">{fmtPct(r.rate * 100)}</td>
                  <td className="py-3 text-right font-semibold text-amber-400 font-mono">{fmtDollar(r.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td className="py-3 pr-4 font-semibold" colSpan={6}>Total Commissions</td>
                <td className="py-3 text-right font-bold text-amber-400 font-mono text-base">{fmtDollar(totalCommissions)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
