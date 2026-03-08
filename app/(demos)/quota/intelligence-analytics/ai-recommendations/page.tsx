'use client';

import { useState } from 'react';
import {
  BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Brain, Sparkles, TrendingUp, Target, ArrowUpRight, ArrowDownRight,
  ChevronDown, ChevronUp, AlertTriangle, Users, MapPin, Zap,
  CheckCircle2, Clock, ArrowRight,
} from 'lucide-react';
import { fmtDollar } from '@/lib/utils';

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

/* ── Inline Data ───────────────────────────────────────────── */

type Rec = {
  id: string;
  category: 'Quota Adjustment' | 'Territory Rebalance' | 'Coaching Focus' | 'Pipeline Action';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  impactValue: string;
  affectedReps: string[];
  confidence: number;
  steps: string[];
  status: 'new' | 'reviewed' | 'implemented';
};

const RECOMMENDATIONS: Rec[] = [
  {
    id: 'rec-1', category: 'Quota Adjustment',
    title: 'Reduce Q2 quota for Central territory by 12%',
    description: 'Central territory has consistently underperformed due to market contraction in the manufacturing sector. Historical data shows 3 consecutive quarters below 85% attainment. Adjusting quota will improve rep morale and set achievable targets.',
    impact: 'high', impactValue: '+$180K rev lift',
    affectedReps: ['Priya Patel'],
    confidence: 92,
    steps: ['Review Central territory pipeline health', 'Validate manufacturing sector decline data', 'Adjust Q2 quota from $800K to $704K', 'Update commission plan accordingly'],
    status: 'new',
  },
  {
    id: 'rec-2', category: 'Territory Rebalance',
    title: 'Reassign 15 Pacific NW accounts to Mountain territory',
    description: 'Pacific NW territory is over-saturated with 78 accounts per rep while Mountain has only 32 per rep. Rebalancing would equalize workload and capitalize on Mountain\'s higher close rates.',
    impact: 'high', impactValue: '+$240K rev lift',
    affectedReps: ['David Kim', 'Alex Nguyen'],
    confidence: 88,
    steps: ['Identify 15 accounts with Mountain geo proximity', 'Review active deals that would transfer', 'Create transition plan with 30-day handoff', 'Update CRM territory assignments'],
    status: 'reviewed',
  },
  {
    id: 'rec-3', category: 'Coaching Focus',
    title: 'Implement multi-threading playbook for Rachel Torres',
    description: 'Rachel\'s deals involve an average of 1.4 stakeholders vs. team average of 2.8. Coaching on multi-threading could increase her win rate from 52% to an estimated 68%, based on peer comparison analysis.',
    impact: 'medium', impactValue: '+$95K rev lift',
    affectedReps: ['Rachel Torres'],
    confidence: 85,
    steps: ['Schedule weekly coaching sessions', 'Assign multi-threading training module', 'Set stakeholder engagement targets per deal', 'Review progress in 30-day checkpoint'],
    status: 'new',
  },
  {
    id: 'rec-4', category: 'Pipeline Action',
    title: 'Accelerate 3 stalled Enterprise deals in Negotiation',
    description: 'Three Enterprise deals totaling $890K have been in Negotiation for 30+ days. Historical data shows deals stalling past 28 days have a 40% lower close probability. Recommend executive sponsor engagement.',
    impact: 'high', impactValue: '+$356K at risk',
    affectedReps: ['Sarah Chen', 'Emily Rodriguez'],
    confidence: 78,
    steps: ['Identify decision-maker blockers', 'Schedule VP-level sponsor calls', 'Prepare competitive displacement strategies', 'Set 14-day close-or-kill deadline'],
    status: 'new',
  },
  {
    id: 'rec-5', category: 'Quota Adjustment',
    title: 'Increase Q2 quota for East territory by 8%',
    description: 'Marcus Johnson has exceeded quota 3 of last 4 quarters. East territory market is expanding with new tech sector growth. Increasing quota aligns targets with territory potential and maintains stretch goals.',
    impact: 'medium', impactValue: '+$76K quota coverage',
    affectedReps: ['Marcus Johnson'],
    confidence: 91,
    steps: ['Validate East territory growth indicators', 'Model commission impact at higher quota', 'Discuss with Marcus in 1:1', 'Adjust Q2 plan from $950K to $1.03M'],
    status: 'implemented',
  },
  {
    id: 'rec-6', category: 'Coaching Focus',
    title: 'Reduce discounting frequency for SMB team',
    description: 'SMB reps are discounting on 62% of deals vs. 28% for Enterprise. Average discount is 18% — well above the 10% guideline. Coaching on value selling could recover $120K in margin annually.',
    impact: 'medium', impactValue: '+$120K margin',
    affectedReps: ['David Kim', 'Rachel Torres'],
    confidence: 82,
    steps: ['Review discount approval workflow', 'Train on value-based negotiation framework', 'Implement tiered discount authority', 'Track margin improvement monthly'],
    status: 'new',
  },
  {
    id: 'rec-7', category: 'Territory Rebalance',
    title: 'Create dedicated healthcare vertical in Southeast',
    description: 'Southeast has 18 healthcare accounts generating 35% of territory revenue. Creating a dedicated vertical focus would enable specialized selling motion and improve competitive positioning.',
    impact: 'low', impactValue: '+$60K potential',
    affectedReps: ['James Wilson'],
    confidence: 74,
    steps: ['Map healthcare accounts and buying patterns', 'Develop healthcare-specific pitch deck', 'Build reference customer program', 'Evaluate need for vertical specialist hire'],
    status: 'new',
  },
];

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Quota Adjustment': { icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'Territory Rebalance': { icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'Coaching Focus': { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'Pipeline Action': { icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10' },
};

const IMPACT_CHART = [
  { category: 'Quota Adjustment', value: 256000 },
  { category: 'Territory Rebalance', value: 300000 },
  { category: 'Coaching Focus', value: 215000 },
  { category: 'Pipeline Action', value: 356000 },
];

/* ── Expandable Card ───────────────────────────────────────── */

function RecommendationCard({ rec }: { rec: Rec }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[rec.category];
  const CatIcon = meta.icon;

  return (
    <div className="rounded-xl border bg-card overflow-hidden hover:border-amber-500/30 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        <div className={`w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <CatIcon className={`h-5 w-5 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${meta.bg} ${meta.color}`}>{rec.category}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
              rec.impact === 'high' ? 'bg-red-500/10 text-red-400'
              : rec.impact === 'medium' ? 'bg-amber-500/10 text-amber-400'
              : 'bg-slate-500/10 text-slate-400'
            }`}>
              {rec.impact.toUpperCase()} IMPACT
            </span>
            {rec.status === 'implemented' && (
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Implemented
              </span>
            )}
            {rec.status === 'reviewed' && (
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-500/10 text-blue-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> In Review
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold mt-2">{rec.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rec.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-emerald-400 font-medium">{rec.impactValue}</span>
            <span className="text-xs text-muted-foreground">Confidence: {rec.confidence}%</span>
            <span className="text-xs text-muted-foreground">{rec.affectedReps.length} rep{rec.affectedReps.length > 1 ? 's' : ''} affected</span>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border/50">
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Affected Reps</h4>
              <div className="flex flex-wrap gap-2">
                {rec.affectedReps.map(r => (
                  <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium">{r}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Confidence Score</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rec.confidence}%` }} />
                </div>
                <span className="text-sm font-semibold">{rec.confidence}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Implementation Steps</h4>
            <div className="space-y-2">
              {rec.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="text-xs px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3" /> Accept & Implement
            </button>
            <button className="text-xs px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */

export default function AiRecommendationsPage() {
  const highImpact = RECOMMENDATIONS.filter(r => r.impact === 'high').length;
  const implemented = RECOMMENDATIONS.filter(r => r.status === 'implemented').length;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Recommendations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Machine learning-driven recommendations for quota optimization and territory adjustments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full font-medium">
            <Brain className="h-3 w-3" /> {RECOMMENDATIONS.length} Active Recommendations
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Recommendations" value={String(RECOMMENDATIONS.length)} subtitle="Generated this quarter" icon={Sparkles} trend="+3 new" trendUp />
        <KpiCard title="High Impact" value={String(highImpact)} subtitle="Requiring immediate action" icon={AlertTriangle} trend="Urgent" />
        <KpiCard title="Implemented" value={String(implemented)} subtitle="Acted upon" icon={CheckCircle2} trend={`${Math.round((implemented / RECOMMENDATIONS.length) * 100)}% adoption`} trendUp />
        <KpiCard title="Est. Revenue Lift" value="$1.13M" subtitle="If all implemented" icon={TrendingUp} trend="+14.5%" trendUp />
      </div>

      {/* Impact by Category Chart */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="font-semibold mb-1">Estimated Revenue Impact by Category</h2>
        <p className="text-xs text-muted-foreground mb-4">Potential revenue lift if recommendations are implemented</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={IMPACT_CHART} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="category" tick={{ fill: '#888', fontSize: 11 }} />
            <YAxis tickFormatter={(v: number) => `$${(v / 1e3).toFixed(0)}K`} tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
              formatter={(v: any) => [fmtDollar(v), 'Impact']}
            />
            <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Summary */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {Object.entries(CATEGORY_META).map(([cat, meta]) => {
          const count = RECOMMENDATIONS.filter(r => r.category === cat).length;
          const CatIcon = meta.icon;
          return (
            <div key={cat} className={`rounded-xl border p-4 ${meta.bg} border-transparent`}>
              <div className="flex items-center gap-2 mb-2">
                <CatIcon className={`h-4 w-4 ${meta.color}`} />
                <span className={`text-sm font-medium ${meta.color}`}>{cat}</span>
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{count === 1 ? 'recommendation' : 'recommendations'}</p>
            </div>
          );
        })}
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold">All Recommendations</h2>
          <span className="text-xs text-muted-foreground ml-auto">Click to expand details</span>
        </div>
        {RECOMMENDATIONS.map(rec => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>

      {/* How It Works */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">How AI Recommendations Work</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { step: '1', title: 'Data Collection', desc: 'CRM, pipeline, and historical performance data ingested daily' },
            { step: '2', title: 'Pattern Analysis', desc: 'ML models identify trends, anomalies, and optimization opportunities' },
            { step: '3', title: 'Impact Scoring', desc: 'Each recommendation scored for revenue impact and implementation effort' },
            { step: '4', title: 'Action & Learn', desc: 'Implemented recommendations feed back into the model for continuous improvement' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
              {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground/30 mt-2 hidden md:block" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
