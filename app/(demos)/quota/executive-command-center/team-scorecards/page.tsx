'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  Users, Target, Trophy, TrendingUp,
  ArrowUpRight, ArrowDownRight, ChevronRight, Star, Zap,
} from 'lucide-react';
import { REPS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';

/* ── Team grouping ────────────────────────────────────────────── */
const teams = ['Enterprise', 'Mid-Market', 'SMB'] as const;

type TeamData = {
  name: string;
  reps: typeof REPS;
  totalQuota: number;
  totalActual: number;
  attainment: number;
  repsAbove: number;
  avgDealSize: number;
  color: string;
  accent: string;
};

const teamData: TeamData[] = teams.map(team => {
  const reps = REPS.filter(r => r.team === team);
  const totalQuota = reps.reduce((s, r) => s + r.quota, 0);
  const totalActual = reps.reduce((s, r) => s + r.actual, 0);
  const colors: Record<string, { color: string; accent: string }> = {
    Enterprise: { color: '#f59e0b', accent: 'amber' },
    'Mid-Market': { color: '#6366f1', accent: 'indigo' },
    SMB: { color: '#10b981', accent: 'emerald' },
  };
  return {
    name: team,
    reps,
    totalQuota,
    totalActual,
    attainment: Math.round((totalActual / totalQuota) * 100),
    repsAbove: reps.filter(r => r.actual >= r.quota).length,
    avgDealSize: Math.round(totalActual / reps.length / 12),
    ...colors[team],
  };
});

const totalOrg = {
  quota: teamData.reduce((s, t) => s + t.totalQuota, 0),
  actual: teamData.reduce((s, t) => s + t.totalActual, 0),
  reps: REPS.length,
  repsAbove: teamData.reduce((s, t) => s + t.repsAbove, 0),
};

const comparisonData = teamData.map(t => ({
  name: t.name,
  attainment: t.attainment,
  reps: t.reps.length,
  color: t.color,
}));

const radarData = [
  { metric: 'Attainment', Enterprise: 95, 'Mid-Market': 105, SMB: 97 },
  { metric: 'Pipeline', Enterprise: 88, 'Mid-Market': 92, SMB: 78 },
  { metric: 'Win Rate', Enterprise: 72, 'Mid-Market': 68, SMB: 82 },
  { metric: 'Deal Size', Enterprise: 95, 'Mid-Market': 75, SMB: 55 },
  { metric: 'Cycle Time', Enterprise: 60, 'Mid-Market': 78, SMB: 90 },
  { metric: 'Retention', Enterprise: 92, 'Mid-Market': 85, SMB: 88 },
];

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

/* ── Page ──────────────────────────────────────────────────────── */
export default function TeamScorecardsPage() {
  const [expandedTeam, setExpandedTeam] = useState<string | null>('Enterprise');

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Team Scorecards</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Performance breakdown by team with individual rep metrics and cross-team comparison.
          </p>
        </div>
      </div>

      {/* Org-Level KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI
          label="Org Revenue" value={fmtDollar(totalOrg.actual)} sub="Q1 2026"
          icon={TrendingUp} trend="+6.8%" trendUp
        />
        <KPI
          label="Org Attainment" value={fmtPct((totalOrg.actual / totalOrg.quota) * 100)} sub="across all teams"
          icon={Target} trend="-1.2%" trendUp={false}
        />
        <KPI
          label="Reps Above Quota" value={`${totalOrg.repsAbove} / ${totalOrg.reps}`} sub={fmtPct((totalOrg.repsAbove / totalOrg.reps) * 100) + ' hit rate'}
          icon={Users} trend="+2 reps" trendUp
        />
        <KPI
          label="Top Performer" value="Alex N." sub="110% attainment"
          icon={Trophy} trend="Mountain territory" trendUp
        />
      </div>

      {/* Team Comparison Bar Chart + Radar */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Team Attainment Comparison</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis domain={[0, 120]} tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}>
                      <p className="font-medium mb-1">{label}</p>
                      <p>Attainment: {payload[0].value}%</p>
                      <p style={{ color: 'var(--prizym-text-muted)' }}>{payload[0].payload.reps} reps</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="attainment" name="Attainment %" radius={[6, 6, 0, 0]} barSize={48}>
                {comparisonData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Team Capability Radar</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748B', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Enterprise" dataKey="Enterprise" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Mid-Market" dataKey="Mid-Market" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="SMB" dataKey="SMB" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {teamData.map(t => (
              <div key={t.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Scorecard Accordions */}
      <div className="space-y-4">
        {teamData.map(team => {
          const isExpanded = expandedTeam === team.name;
          const sortedReps = [...team.reps].sort((a, b) => (b.actual / b.quota) - (a.actual / a.quota));

          return (
            <div key={team.name} className="rounded-xl overflow-hidden" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
              {/* Team Header */}
              <button
                onClick={() => setExpandedTeam(isExpanded ? null : team.name)}
                className="w-full px-5 py-4 flex items-center justify-between hover:opacity-90 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: team.color + '20' }}>
                    <Users className="h-5 w-5" style={{ color: team.color }} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{team.name}</p>
                    <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{team.reps.length} reps &middot; {team.repsAbove} above quota</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Revenue</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(team.totalActual)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Quota</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(team.totalQuota)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Attainment</p>
                    <p className={`text-sm font-bold ${team.attainment >= 100 ? 'text-emerald-600' : team.attainment >= 90 ? 'text-amber-400' : 'text-red-600'}`}>
                      {team.attainment}%
                    </p>
                  </div>
                  <div className="w-32 hidden lg:block">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(team.attainment, 100)}%`,
                          backgroundColor: team.color,
                        }}
                      />
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} style={{ color: 'var(--prizym-text-muted)' }} />
                </div>
              </button>

              {/* Expanded Rep List */}
              {isExpanded && (
                <div className="px-5 py-4" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {sortedReps.map((rep, i) => {
                      const att = (rep.actual / rep.quota) * 100;
                      const isTop = i === 0;
                      return (
                        <div
                          key={rep.id}
                          className={`rounded-xl p-4 transition ${
                            isTop ? 'border border-amber-500/30 bg-amber-500/5' : ''
                          }`}
                          style={isTop ? undefined : { background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{rep.name}</p>
                                {isTop && <Star className="h-3.5 w-3.5 text-amber-400" />}
                              </div>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>{rep.territory}</p>
                            </div>
                            <span className={`text-lg font-bold ${att >= 100 ? 'text-emerald-600' : att >= 85 ? 'text-amber-400' : 'text-red-600'}`}>
                              {fmtPct(att)}
                            </span>
                          </div>

                          <div className="h-2 rounded-full mb-3 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(att, 100)}%`,
                                backgroundColor: att >= 100 ? '#10b981' : att >= 85 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>

                          <div className="flex justify-between text-xs">
                            <div>
                              <span style={{ color: 'var(--prizym-text-muted)' }}>Actual</span>
                              <p className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{fmtDollar(rep.actual)}</p>
                            </div>
                            <div className="text-right">
                              <span style={{ color: 'var(--prizym-text-muted)' }}>Quota</span>
                              <p className="font-medium" style={{ color: 'var(--prizym-text-secondary)' }}>{fmtDollar(rep.quota)}</p>
                            </div>
                          </div>

                          {att >= 100 && (
                            <div className="mt-3 pt-3 flex items-center gap-1.5" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
                              <Zap className="h-3 w-3 text-emerald-600" />
                              <span className="text-[10px] font-medium text-emerald-600 uppercase">
                                Accelerator Eligible &middot; +{fmtDollar(rep.actual - rep.quota)} over
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Team Summary Bar */}
                  <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
                    <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
                      <span>Team Quota: {fmtDollar(team.totalQuota)}</span>
                      <span>Team Revenue: {fmtDollar(team.totalActual)}</span>
                      <span className={team.totalActual >= team.totalQuota ? 'text-emerald-600 font-medium' : 'text-amber-400 font-medium'}>
                        Gap: {fmtDollar(Math.abs(team.totalQuota - team.totalActual))}
                        {team.totalActual >= team.totalQuota ? ' surplus' : ' shortfall'}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Updated 12 min ago</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cross-Team Insights */}
      <div className="mt-6 rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Cross-Team Insights</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600 uppercase">Top Team</span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>Mid-Market</p>
            <p className="text-xs mt-1" style={{ color: 'var(--prizym-text-muted)' }}>105% attainment with highest consistency across reps</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase">Fastest Growing</span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>SMB</p>
            <p className="text-xs mt-1" style={{ color: 'var(--prizym-text-muted)' }}>David Kim at 110% driving Pacific NW growth</p>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-red-600" />
              <span className="text-xs font-semibold text-red-600 uppercase">Needs Attention</span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>Enterprise</p>
            <p className="text-xs mt-1" style={{ color: 'var(--prizym-text-muted)' }}>2 of 3 reps below quota; Northeast and West regions lagging</p>
          </div>
        </div>
      </div>
    </>
  );
}
