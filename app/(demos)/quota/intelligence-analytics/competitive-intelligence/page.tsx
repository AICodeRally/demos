'use client';

import {
  BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Shield, Target, ArrowUpRight, ArrowDownRight,
  Swords, Award, AlertTriangle, ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── KPI Card ──────────────────────────────────────────────── */

function KpiCard({ title, value, subtitle, icon: Icon, trend, trendUp }: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; trend?: string; trendUp?: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--prizym-text-muted)' }}>{title}</span>
        <Icon className="h-4 w-4 text-amber-500" />
      </div>
      <p className="text-2xl font-bold mt-1" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trendUp === undefined ? '' : trendUp ? 'text-emerald-600' : 'text-red-600'}`} style={trendUp === undefined ? { color: 'var(--prizym-text-muted)' } : undefined}>
            {trendUp !== undefined && (trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
            {trend}
          </span>
        )}
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{subtitle}</span>
      </div>
    </div>
  );
}

/* ── Inline Data ───────────────────────────────────────────── */

const COMPETITORS = [
  { name: 'CompetitorX', wins: 12, losses: 5, winRate: 71, marketShare: 28, avgDiscount: 8, threat: 'high' as const },
  { name: 'SalesForceIQ', wins: 8, losses: 9, winRate: 47, marketShare: 22, avgDiscount: 15, threat: 'medium' as const },
  { name: 'QuotaPath', wins: 6, losses: 4, winRate: 60, marketShare: 15, avgDiscount: 12, threat: 'medium' as const },
  { name: 'Xactly', wins: 4, losses: 7, winRate: 36, marketShare: 18, avgDiscount: 18, threat: 'low' as const },
  { name: 'CaptivateIQ', wins: 3, losses: 2, winRate: 60, marketShare: 8, avgDiscount: 10, threat: 'medium' as const },
  { name: 'Other/None', wins: 15, losses: 3, winRate: 83, marketShare: 9, avgDiscount: 5, threat: 'low' as const },
];

const WIN_LOSS_CHART = COMPETITORS.filter(c => c.name !== 'Other/None').map(c => ({
  name: c.name,
  wins: c.wins,
  losses: -c.losses,
}));

const WIN_LOSS_REASONS = [
  { reason: 'Better product fit', pct: 34, type: 'win' as const },
  { reason: 'Stronger ROI case', pct: 28, type: 'win' as const },
  { reason: 'Superior UX/UI', pct: 22, type: 'win' as const },
  { reason: 'Faster implementation', pct: 16, type: 'win' as const },
  { reason: 'Price sensitivity', pct: 38, type: 'loss' as const },
  { reason: 'Missing integration', pct: 26, type: 'loss' as const },
  { reason: 'Incumbent advantage', pct: 21, type: 'loss' as const },
  { reason: 'Feature gap', pct: 15, type: 'loss' as const },
];

const MARKET_SHARE_DATA = [
  { name: 'Us', value: 28, color: '#f59e0b' },
  { name: 'CompetitorX', value: 22, color: '#ef4444' },
  { name: 'Xactly', value: 18, color: '#8b5cf6' },
  { name: 'QuotaPath', value: 15, color: '#3b82f6' },
  { name: 'CaptivateIQ', value: 8, color: '#10b981' },
  { name: 'Others', value: 9, color: '#6b7280' },
];

const FEATURE_COMPARISON = [
  { feature: 'Quota Planning', us: 5, compX: 4, salesIQ: 3, quotaP: 4 },
  { feature: 'Commission Calc', us: 5, compX: 5, salesIQ: 4, quotaP: 5 },
  { feature: 'Territory Mgmt', us: 4, compX: 3, salesIQ: 5, quotaP: 3 },
  { feature: 'AI Forecasting', us: 5, compX: 3, salesIQ: 4, quotaP: 2 },
  { feature: 'Pipeline Analytics', us: 4, compX: 4, salesIQ: 5, quotaP: 3 },
  { feature: 'Custom Reports', us: 4, compX: 5, salesIQ: 3, quotaP: 4 },
  { feature: 'Integration Hub', us: 3, compX: 4, salesIQ: 5, quotaP: 3 },
  { feature: 'Mobile App', us: 3, compX: 4, salesIQ: 4, quotaP: 2 },
];

const DEAL_DISPLACEMENT = [
  { quarter: 'Q2 2025', displaced: 4, displacedBy: 2, net: 2 },
  { quarter: 'Q3 2025', displaced: 6, displacedBy: 3, net: 3 },
  { quarter: 'Q4 2025', displaced: 5, displacedBy: 1, net: 4 },
  { quarter: 'Q1 2026', displaced: 7, displacedBy: 2, net: 5 },
];

const COMPETITIVE_ALERTS = [
  { title: 'CompetitorX launched AI forecasting module', severity: 'high', date: 'Mar 5', impact: 'Narrows our AI advantage' },
  { title: 'QuotaPath raised Series C ($45M)', severity: 'medium', date: 'Mar 2', impact: 'Expect aggressive GTM expansion' },
  { title: 'Xactly price cut on mid-market tier (20%)', severity: 'high', date: 'Feb 28', impact: 'May pressure our SMB pipeline' },
  { title: 'CaptivateIQ + Salesforce native integration', severity: 'medium', date: 'Feb 25', impact: 'Strengthens SFDC ecosystem play' },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function CompetitiveIntelligencePage() {
  const totalWins = COMPETITORS.reduce((s, c) => s + c.wins, 0);
  const totalLosses = COMPETITORS.reduce((s, c) => s + c.losses, 0);
  const overallWinRate = Math.round((totalWins / (totalWins + totalLosses)) * 100);
  const avgDiscount = Math.round(COMPETITORS.reduce((s, c) => s + c.avgDiscount, 0) / COMPETITORS.length);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Competitive Intelligence</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Win/loss analysis, competitor benchmarks, and market positioning insights.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Win Rate vs Competitors" value={fmtPct(overallWinRate)} subtitle="All competitive deals" icon={Target} trend="+6%" trendUp />
        <KpiCard title="Market Position" value="#1" subtitle="Est. market share 28%" icon={Award} trend="+3% YoY" trendUp />
        <KpiCard title="Deals Lost" value={String(totalLosses)} subtitle="Last 4 quarters" icon={Swords} trend="-4 vs prior" trendUp />
        <KpiCard title="Avg Deal Discount" value={fmtPct(avgDiscount)} subtitle="In competitive deals" icon={TrendingDown} trend="-2%" trendUp />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Win/Loss by Competitor */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Win/Loss by Competitor</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Head-to-head outcomes over last 4 quarters</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WIN_LOSS_CHART} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} domain={[-12, 16]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                formatter={(v: any) => [Math.abs(v), v > 0 ? 'Wins' : 'Losses']}
              />
              <Bar dataKey="wins" fill="#22c55e" radius={[0, 4, 4, 0]} name="Wins" />
              <Bar dataKey="losses" fill="#ef4444" radius={[4, 0, 0, 4]} name="Losses" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs justify-center" style={{ color: 'var(--prizym-text-muted)' }}>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Wins</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Losses</span>
          </div>
        </div>

        {/* Market Share */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Estimated Market Share</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Sales Quota Management segment</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={MARKET_SHARE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {MARKET_SHARE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                  formatter={(v: any) => [`${v}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {MARKET_SHARE_DATA.map(s => (
              <span key={s.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} ({s.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Win/Loss Reasons */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1 text-emerald-600">Why We Win</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Top reasons cited in won competitive deals</p>
          <div className="space-y-3">
            {WIN_LOSS_REASONS.filter(r => r.type === 'win').map(r => (
              <div key={r.reason} className="flex items-center gap-3">
                <span className="text-sm flex-1" style={{ color: 'var(--prizym-text-primary)' }}>{r.reason}</span>
                <div className="w-40 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs font-medium w-10 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-1 text-red-600">Why We Lose</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Top reasons cited in lost competitive deals</p>
          <div className="space-y-3">
            {WIN_LOSS_REASONS.filter(r => r.type === 'loss').map(r => (
              <div key={r.reason} className="flex items-center gap-3">
                <span className="text-sm flex-1" style={{ color: 'var(--prizym-text-primary)' }}>{r.reason}</span>
                <div className="w-40 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs font-medium w-10 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Feature Comparison Matrix</h2>
          <span className="text-xs ml-auto" style={{ color: 'var(--prizym-text-muted)' }}>Rating: 1 (basic) to 5 (best-in-class)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Feature</th>
                <th className="text-center py-3 px-4 font-semibold text-amber-400">Us</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>CompetitorX</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>SalesForceIQ</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>QuotaPath</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_COMPARISON.map(f => {
                const maxScore = Math.max(f.us, f.compX, f.salesIQ, f.quotaP);
                const renderScore = (score: number, isUs: boolean) => {
                  const isMax = score === maxScore;
                  return (
                    <td key={`${f.feature}-${isUs ? 'us' : score}`} className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-sm ${
                            i < score
                              ? isUs ? 'bg-amber-500' : isMax ? 'bg-emerald-500' : 'bg-slate-300'
                              : 'bg-slate-100'
                          }`} />
                        ))}
                      </div>
                    </td>
                  );
                };
                return (
                  <tr key={f.feature} className="transition-colors" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{f.feature}</td>
                    {renderScore(f.us, true)}
                    {renderScore(f.compX, false)}
                    {renderScore(f.salesIQ, false)}
                    {renderScore(f.quotaP, false)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Competitor Table */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="font-semibold mb-3" style={{ color: 'var(--prizym-text-primary)' }}>Competitor Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <th className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Competitor</th>
                  <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Win Rate</th>
                  <th className="text-right py-2 px-3 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Share</th>
                  <th className="text-center py-2 px-3 font-semibold" style={{ color: 'var(--prizym-text-muted)' }}>Threat</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.filter(c => c.name !== 'Other/None').map(c => (
                  <tr key={c.name} className="transition-colors" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{c.name}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={c.winRate >= 60 ? 'text-emerald-600' : c.winRate >= 45 ? 'text-amber-400' : 'text-red-600'}>
                        {c.winRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right" style={{ color: 'var(--prizym-text-primary)' }}>{c.marketShare}%</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        c.threat === 'high' ? 'bg-red-500/10 text-red-600'
                        : c.threat === 'medium' ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {c.threat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitive Alerts */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Competitive Alerts</h2>
          </div>
          <div className="space-y-3">
            {COMPETITIVE_ALERTS.map((a, i) => (
              <div key={i} className="p-3 rounded-lg hover:border-amber-500/30 transition-colors" style={{ border: '1px solid var(--prizym-border-default)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${a.severity === 'high' ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <h3 className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{a.title}</h3>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{a.date}</span>
                </div>
                <p className="text-xs mt-1.5 ml-4" style={{ color: 'var(--prizym-text-muted)' }}>{a.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deal Displacement Trend */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--prizym-text-primary)' }}>Competitive Displacement Trend</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--prizym-text-muted)' }}>Deals we displaced competitors vs. deals we were displaced</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DEAL_DISPLACEMENT} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="quarter" tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }} />
            <Bar dataKey="displaced" fill="#22c55e" radius={[4, 4, 0, 0]} name="We Displaced" />
            <Bar dataKey="displacedBy" fill="#ef4444" radius={[4, 4, 0, 0]} name="Displaced By" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 text-xs justify-center" style={{ color: 'var(--prizym-text-muted)' }}>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> We Displaced Competitor</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Competitor Displaced Us</span>
          <span className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" /> Net positive trend: {DEAL_DISPLACEMENT[DEAL_DISPLACEMENT.length - 1].net} net wins in Q1
          </span>
        </div>
      </div>
    </>
  );
}
