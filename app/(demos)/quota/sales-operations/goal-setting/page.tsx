'use client';

import { REPS } from '@/data/quota';
import { fmtDollar, fmtPct } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  Target, Users, CheckCircle2, Activity, ArrowUpRight, ArrowDownRight,
  Building2, ChevronDown, Layers,
} from 'lucide-react';

// Company-level goals
const companyGoal = 30_000_000;
const companyActual = 27_375_000;
const companyAtt = companyActual / companyGoal;

// Team-level goals (cascaded from company)
const teamGoals = [
  { team: 'Enterprise', goal: 14_000_000, actual: 13_090_000, members: 3, stretch: 15_400_000 },
  { team: 'Mid-Market', goal: 10_000_000, actual: 9_465_000, members: 3, stretch: 11_000_000 },
  { team: 'SMB', goal: 6_000_000, actual: 4_820_000, members: 2, stretch: 6_600_000 },
];

const totalTeamGoals = teamGoals.reduce((s, t) => s + t.goal, 0);
const alignmentScore = Math.round((1 - Math.abs(totalTeamGoals - companyGoal) / companyGoal) * 100);
const goalsSet = teamGoals.length;

// Individual targets (derived from REPS)
const individualTargets = REPS.map(r => {
  const teamGoal = teamGoals.find(t => t.team === r.team);
  const teamMembers = teamGoal ? teamGoal.members : 1;
  const target = teamGoal ? Math.round(teamGoal.goal / teamMembers) : r.quota;
  const att = r.actual / target;
  return { ...r, target, att };
});

// Quarterly milestones
const milestones = [
  { quarter: 'Q1', target: 7_500_000, actual: 6_915_000, status: 'complete' as const },
  { quarter: 'Q2', target: 7_500_000, actual: 0, status: 'current' as const },
  { quarter: 'Q3', target: 7_500_000, actual: 0, status: 'upcoming' as const },
  { quarter: 'Q4', target: 7_500_000, actual: 0, status: 'upcoming' as const },
];

const kpis = [
  { label: 'Company Goal', value: fmtDollar(companyGoal), icon: Target, delta: '+8% vs FY25', up: true },
  { label: 'Team Goals Set', value: `${goalsSet} / ${goalsSet}`, icon: Users, delta: '100% configured', up: true },
  { label: 'Individual Targets', value: `${REPS.length} reps`, icon: CheckCircle2, delta: 'All assigned', up: true },
  { label: 'Alignment Score', value: `${alignmentScore}%`, icon: Activity, delta: 'Goals fully cascaded', up: alignmentScore >= 95 },
];

const teamChartData = teamGoals.map(t => ({
  team: t.team,
  goal: t.goal,
  actual: t.actual,
  stretch: t.stretch,
  att: Math.round((t.actual / t.goal) * 100),
}));

export default function GoalSettingPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Goal Setting & Cascading</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Set company-wide goals and cascade targets through teams to individual contributors.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
            Import Goals
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            Recalculate Cascade
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{k.label}</span>
              <k.icon className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--prizym-text-primary)' }}>{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.up ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : <ArrowDownRight className="h-3 w-3 text-red-600" />}
              <span className={`text-xs ${k.up ? 'text-emerald-600' : 'text-red-600'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Cascade Visual */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--prizym-text-primary)' }}>Goal Cascade: Company &rarr; Teams &rarr; Individuals</h2>

        {/* Company Level */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border-2 border-amber-400/40 bg-amber-400/[0.05] p-5 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-lg" style={{ color: 'var(--prizym-text-primary)' }}>Company Target</span>
              <span className="ml-auto text-2xl font-bold text-amber-400">{fmtDollar(companyGoal)}</span>
            </div>
            <div className="flex items-center gap-4 text-xs mb-2" style={{ color: 'var(--prizym-text-muted)' }}>
              <span>FY2026 Annual Revenue Goal</span>
              <span>|</span>
              <span>Current: {fmtDollar(companyActual)} ({fmtPct(companyAtt * 100)} YTD pace)</span>
            </div>
            <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                style={{ width: `${Math.min(companyAtt * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center my-1">
            <ChevronDown className="h-5 w-5 text-amber-400/50" />
          </div>

          {/* Team Level */}
          <div className="grid gap-3 md:grid-cols-3 mb-2">
            {teamGoals.map(t => {
              const att = t.actual / t.goal;
              const color = att >= 0.90 ? '#34d399' : att >= 0.75 ? '#f59e0b' : '#ef4444';
              return (
                <div key={t.team} className="rounded-xl p-4" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-amber-400" />
                      <span className="font-semibold text-sm" style={{ color: 'var(--prizym-text-primary)' }}>{t.team}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{t.members} reps</span>
                  </div>
                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--prizym-text-muted)' }}>Goal</span>
                      <span className="tabular-nums font-semibold">{fmtDollar(t.goal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--prizym-text-muted)' }}>Stretch</span>
                      <span className="tabular-nums" style={{ color: 'var(--prizym-text-muted)' }}>{fmtDollar(t.stretch)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--prizym-text-muted)' }}>Actual</span>
                      <span className="tabular-nums">{fmtDollar(t.actual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--prizym-text-muted)' }}>Attainment</span>
                      <span className="font-semibold" style={{ color }}>{fmtPct(att * 100)}</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(att * 100, 100)}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center my-1">
            <ChevronDown className="h-5 w-5 text-amber-400/50" />
          </div>

          {/* Individual Level */}
          <div className="rounded-xl p-4" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-sm" style={{ color: 'var(--prizym-text-primary)' }}>Individual Targets ({individualTargets.length} reps)</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {individualTargets.map(r => {
                const color = r.att >= 1.0 ? '#34d399' : r.att >= 0.85 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={r.id} className="rounded p-3" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{r.name}</span>
                      <span className="text-xs font-semibold" style={{ color }}>{fmtPct(r.att * 100)}</span>
                    </div>
                    <div className="text-xs mb-2" style={{ color: 'var(--prizym-text-muted)' }}>
                      {r.team} &middot; {fmtDollar(r.target)}
                    </div>
                    <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(r.att * 100, 100)}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Team Goals Chart */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Team Goal vs Actual</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamChartData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="team" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(0)}M`} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 4px 6px rgba(0,0,0,0.07)' }}
                  formatter={(v: any) => [fmtDollar(v)]}
                />
                <Bar dataKey="goal" fill="rgba(148,163,184,0.25)" radius={[4, 4, 0, 0]} maxBarSize={36} name="Goal" />
                <Bar dataKey="actual" radius={[4, 4, 0, 0]} maxBarSize={36} name="Actual">
                  {teamChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.att >= 90 ? '#34d399' : entry.att >= 75 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
                <Bar dataKey="stretch" fill="none" stroke="#818cf8" strokeDasharray="4 2" radius={[4, 4, 0, 0]} maxBarSize={36} name="Stretch" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Milestones */}
        <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Quarterly Milestones</h2>
          <div className="space-y-4">
            {milestones.map(m => {
              const att = m.actual > 0 ? m.actual / m.target : 0;
              const isComplete = m.status === 'complete';
              const isCurrent = m.status === 'current';
              return (
                <div key={m.quarter} className={`rounded-xl p-4 ${isCurrent ? 'border-amber-400/30 bg-amber-400/[0.05]' : ''}`} style={isCurrent ? { border: '1px solid rgba(251,191,36,0.3)' } : { background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isComplete && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      {isCurrent && <Activity className="h-4 w-4 text-amber-400 animate-pulse" />}
                      {m.status === 'upcoming' && <Target className="h-4 w-4" style={{ color: 'var(--prizym-text-muted)' }} />}
                      <span className="font-semibold" style={m.status === 'upcoming' ? { color: 'var(--prizym-text-muted)' } : { color: 'var(--prizym-text-primary)' }}>{m.quarter} FY2026</span>
                      {isCurrent && <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-xs border border-amber-400/30">Current</span>}
                    </div>
                    <span className="font-mono text-sm">{fmtDollar(m.target)}</span>
                  </div>
                  {(isComplete || isCurrent) && (
                    <>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span style={{ color: 'var(--prizym-text-muted)' }}>
                          {isComplete ? `Closed: ${fmtDollar(m.actual)}` : 'In Progress'}
                        </span>
                        {m.actual > 0 && (
                          <span className={att >= 0.90 ? 'text-emerald-600' : att >= 0.75 ? 'text-amber-400' : 'text-red-600'}>
                            {fmtPct(att * 100)}
                          </span>
                        )}
                      </div>
                      <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--prizym-border-default)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(att * 100, 100)}%`,
                            background: att >= 0.90 ? '#34d399' : att >= 0.75 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alignment Summary */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--prizym-text-primary)' }}>Cascade Alignment Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-muted)' }}>
                <th className="text-left py-3 pr-4">Level</th>
                <th className="text-right py-3 pr-4">Target</th>
                <th className="text-right py-3 pr-4">Actual</th>
                <th className="text-right py-3 pr-4">Gap</th>
                <th className="text-right py-3 pr-4">Attainment</th>
                <th className="text-center py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-amber-400/[0.03]" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <td className="py-3 pr-4 font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Company</td>
                <td className="py-3 pr-4 text-right tabular-nums">{fmtDollar(companyGoal)}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{fmtDollar(companyActual)}</td>
                <td className="py-3 pr-4 text-right tabular-nums text-red-600">{fmtDollar(companyGoal - companyActual)}</td>
                <td className="py-3 pr-4 text-right font-semibold text-amber-400">{fmtPct(companyAtt * 100)}</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-xs border border-amber-400/30 bg-amber-400/10 text-amber-400">On Pace</span>
                </td>
              </tr>
              {teamGoals.map(t => {
                const att = t.actual / t.goal;
                const gap = t.goal - t.actual;
                const color = att >= 0.90 ? 'text-emerald-600' : att >= 0.75 ? 'text-amber-400' : 'text-red-600';
                return (
                  <tr key={t.team} style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                    <td className="py-3 pr-4 pl-6" style={{ color: 'var(--prizym-text-muted)' }}>{t.team}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-xs">{fmtDollar(t.goal)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-xs">{fmtDollar(t.actual)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-xs text-red-600">{gap > 0 ? fmtDollar(gap) : '--'}</td>
                    <td className={`py-3 pr-4 text-right font-semibold ${color}`}>{fmtPct(att * 100)}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${att >= 0.90 ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-600' : att >= 0.75 ? 'border-amber-400/30 bg-amber-400/10 text-amber-400' : 'border-red-400/30 bg-red-400/10 text-red-600'}`}>
                        {att >= 0.90 ? 'On Track' : att >= 0.75 ? 'At Risk' : 'Behind'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
