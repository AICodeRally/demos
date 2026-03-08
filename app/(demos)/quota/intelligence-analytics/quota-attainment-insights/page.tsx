'use client';

import {
  BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import {
  Target, TrendingUp, ArrowUpRight, ArrowDownRight,
  Users, Award, Lightbulb, ChevronRight, BarChart3, Gauge,
} from 'lucide-react';
import { REPS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── KPI Card ──────────────────────────────────────────────── */

function KpiCard({ title, value, subtitle, icon: Icon, trend, trendUp }: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</span>
        <Icon className="h-4 w-4 text-amber-500" />
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

/* ── Derived Data ──────────────────────────────────────────── */

const repAttainments = REPS.map(r => ({
  ...r,
  attainment: Math.round((r.actual / r.quota) * 100),
})).sort((a, b) => b.attainment - a.attainment);

const attainmentValues = repAttainments.map(r => r.attainment);
const sortedValues = [...attainmentValues].sort((a, b) => a - b);
const median = sortedValues.length % 2 === 0
  ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
  : sortedValues[Math.floor(sortedValues.length / 2)];

const topDecile = Math.max(...attainmentValues);
const bottomDecile = Math.min(...attainmentValues);

const DISTRIBUTION_BUCKETS = [
  { bucket: '<60%', min: 0, max: 60, color: '#ef4444' },
  { bucket: '60-80%', min: 60, max: 80, color: '#f97316' },
  { bucket: '80-100%', min: 80, max: 100, color: '#f59e0b' },
  { bucket: '100-120%', min: 100, max: 120, color: '#22c55e' },
  { bucket: '>120%', min: 120, max: 999, color: '#10b981' },
].map(b => ({
  ...b,
  count: repAttainments.filter(r => r.attainment >= b.min && r.attainment < b.max).length,
}));

const PEER_BENCHMARKS = [
  { metric: 'Median Attainment', company: `${median}%`, industry: '88%', top25: '102%' },
  { metric: 'Avg Pipeline Coverage', company: '3.1x', industry: '2.8x', top25: '3.6x' },
  { metric: 'Avg Win Rate', company: '68%', industry: '62%', top25: '74%' },
  { metric: 'Avg Deal Cycle', company: '42 days', industry: '48 days', top25: '35 days' },
  { metric: 'Ramp Time (new reps)', company: '4.2 mo', industry: '5.1 mo', top25: '3.5 mo' },
  { metric: 'Quota Coverage Ratio', company: '1.15x', industry: '1.08x', top25: '1.22x' },
];

const SUCCESS_PATTERNS = [
  {
    title: 'Multi-Threading Champions',
    description: 'Top performers engage 3.2 stakeholders per deal vs. 1.8 for average reps. They identify economic buyers earlier and build broader consensus.',
    impact: '+24% win rate',
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Pipeline Discipline',
    description: 'Reps exceeding quota maintain 3.5x pipeline coverage consistently. They proactively remove stale opportunities and focus on high-probability deals.',
    impact: '+18% attainment',
    icon: Target,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: 'Early Discovery Excellence',
    description: 'High performers spend 40% more time in discovery calls and ask twice as many qualifying questions. Their proposals have 31% higher win rates.',
    impact: '+31% close rate',
    icon: Lightbulb,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Velocity Over Volume',
    description: 'Top reps close 15% fewer deals but at 45% higher average value. They prioritize deal quality and are faster to disqualify poor-fit opportunities.',
    impact: '+45% deal size',
    icon: TrendingUp,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

const QUARTILE_DATA = [
  { quartile: 'Q4 (Top)', avgAttainment: 109, avgRevenue: 921_667, reps: 2, label: 'Top Performers' },
  { quartile: 'Q3', avgAttainment: 97, avgRevenue: 810_000, reps: 2, label: 'Strong Contributors' },
  { quartile: 'Q2', avgAttainment: 90, avgRevenue: 750_000, reps: 2, label: 'Developing' },
  { quartile: 'Q1 (Bottom)', avgAttainment: 82, avgRevenue: 666_000, reps: 2, label: 'Needs Coaching' },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function QuotaAttainmentInsightsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quota Attainment Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Attainment distribution analysis with peer benchmarks and success patterns.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Median Attainment" value={fmtPct(median)} subtitle="Across all reps" icon={Gauge} trend="+3%" trendUp />
        <KpiCard title="Distribution Skew" value="Right-leaning" subtitle="Healthy distribution" icon={BarChart3} trend="Positive" trendUp />
        <KpiCard title="Top Decile" value={fmtPct(topDecile)} subtitle={repAttainments[0].name} icon={Award} trend="+8%" trendUp />
        <KpiCard title="Bottom Decile" value={fmtPct(bottomDecile)} subtitle={repAttainments[repAttainments.length - 1].name} icon={Target} trend="-5%" trendUp={false} />
      </div>

      {/* Attainment Distribution */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="font-semibold mb-1">Attainment Distribution</h2>
        <p className="text-xs text-muted-foreground mb-4">Number of reps in each attainment bracket</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={DISTRIBUTION_BUCKETS} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="bucket" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis tick={{ fill: '#888', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
              formatter={(v: any) => [`${v} reps`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {DISTRIBUTION_BUCKETS.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground justify-center">
          <span>Target: bell curve centered at 100%</span>
          <span className="text-amber-400">|</span>
          <span>Current: {DISTRIBUTION_BUCKETS.filter(b => b.count > 0 && b.min >= 100).reduce((s, b) => s + b.count, 0)} of {REPS.length} reps at or above quota</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Individual Rep Attainment */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-1">Individual Rep Attainment</h2>
          <p className="text-xs text-muted-foreground mb-4">Ranked by quota attainment percentage</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={repAttainments} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" domain={[0, 130]} tick={{ fill: '#888', fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
                formatter={(v: any) => [`${v}%`, 'Attainment']}
              />
              <Bar dataKey="attainment" radius={[0, 4, 4, 0]}>
                {repAttainments.map((entry, i) => (
                  <Cell key={i} fill={entry.attainment >= 100 ? '#22c55e' : entry.attainment >= 85 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quartile Analysis */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-1">Quartile Analysis</h2>
          <p className="text-xs text-muted-foreground mb-4">Performance segmented by quartile rank</p>
          <div className="space-y-3">
            {QUARTILE_DATA.map((q, i) => (
              <div key={q.quartile} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-emerald-500/20 text-emerald-400'
                  : i === 1 ? 'bg-amber-500/20 text-amber-400'
                  : i === 2 ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-red-500/20 text-red-400'
                }`}>
                  {q.quartile.charAt(0)}{q.quartile.charAt(1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{q.label}</p>
                  <p className="text-xs text-muted-foreground">{q.reps} reps</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{q.avgAttainment}%</p>
                  <p className="text-xs text-muted-foreground">avg attainment</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{fmtDollar(q.avgRevenue)}</p>
                  <p className="text-xs text-muted-foreground">avg revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peer Benchmarks */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold">Peer Benchmark Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Metric</th>
                <th className="text-center py-3 px-4 font-medium text-amber-500">Your Company</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Industry Avg</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Top 25%</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">vs. Industry</th>
              </tr>
            </thead>
            <tbody>
              {PEER_BENCHMARKS.map(b => {
                const companyNum = parseFloat(b.company);
                const industryNum = parseFloat(b.industry);
                const isAbove = companyNum > industryNum;
                return (
                  <tr key={b.metric} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{b.metric}</td>
                    <td className="py-3 px-4 text-center font-semibold text-amber-400">{b.company}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{b.industry}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{b.top25}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`flex items-center justify-center gap-1 text-xs font-medium ${isAbove ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isAbove ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {isAbove ? 'Above' : 'Below'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Patterns */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold">What Top Performers Do Differently</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {SUCCESS_PATTERNS.map(p => (
            <div key={p.title} className="p-4 rounded-lg border border-border/50 hover:border-amber-500/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${p.bgColor} flex items-center justify-center shrink-0`}>
                  <p.icon className={`h-4 w-4 ${p.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${p.bgColor} ${p.color} font-medium`}>
                      {p.impact}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
          <span>Based on analysis of 8 reps over 12 months. Patterns validated against industry research.</span>
        </div>
      </div>
    </>
  );
}
