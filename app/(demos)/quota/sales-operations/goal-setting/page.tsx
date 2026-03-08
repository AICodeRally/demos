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
          <h1 className="text-2xl font-bold">Goal Setting & Cascading</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set company-wide goals and cascade targets through teams to individual contributors.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
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
          <div key={k.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
              <k.icon className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.up ? <ArrowUpRight className="h-3 w-3 text-emerald-400" /> : <ArrowDownRight className="h-3 w-3 text-red-400" />}
              <span className={`text-xs ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Cascade Visual */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
        <h2 className="text-sm font-semibold mb-5">Goal Cascade: Company &rarr; Teams &rarr; Individuals</h2>

        {/* Company Level */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border-2 border-amber-400/40 bg-amber-400/[0.05] p-5 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-lg">Company Target</span>
              <span className="ml-auto text-2xl font-bold text-amber-400">{fmtDollar(companyGoal)}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <span>FY2026 Annual Revenue Goal</span>
              <span>|</span>
              <span>Current: {fmtDollar(companyActual)} ({fmtPct(companyAtt * 100)} YTD pace)</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
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
                <div key={t.team} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-amber-400" />
                      <span className="font-semibold text-sm">{t.team}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{t.members} reps</span>
                  </div>
                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Goal</span>
                      <span className="font-mono font-semibold">{fmtDollar(t.goal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stretch</span>
                      <span className="font-mono text-muted-foreground">{fmtDollar(t.stretch)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actual</span>
                      <span className="font-mono">{fmtDollar(t.actual)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attainment</span>
                      <span className="font-semibold" style={{ color }}>{fmtPct(att * 100)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
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
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-sm">Individual Targets ({individualTargets.length} reps)</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {individualTargets.map(r => {
                const color = r.att >= 1.0 ? '#34d399' : r.att >= 0.85 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={r.id} className="rounded border border-white/5 bg-white/[0.01] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{r.name}</span>
                      <span className="text-xs font-semibold" style={{ color }}>{fmtPct(r.att * 100)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {r.team} &middot; {fmtDollar(r.target)}
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
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
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold mb-4">Team Goal vs Actual</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamChartData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="team" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tickFormatter={v => `$${(v / 1e6).toFixed(0)}M`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: any) => [fmtDollar(v)]}
                />
                <Bar dataKey="goal" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} maxBarSize={36} name="Goal" />
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
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold mb-4">Quarterly Milestones</h2>
          <div className="space-y-4">
            {milestones.map(m => {
              const att = m.actual > 0 ? m.actual / m.target : 0;
              const isComplete = m.status === 'complete';
              const isCurrent = m.status === 'current';
              return (
                <div key={m.quarter} className={`rounded-lg border p-4 ${isCurrent ? 'border-amber-400/30 bg-amber-400/[0.05]' : 'border-white/10 bg-white/[0.02]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isComplete && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {isCurrent && <Activity className="h-4 w-4 text-amber-400 animate-pulse" />}
                      {m.status === 'upcoming' && <Target className="h-4 w-4 text-white/30" />}
                      <span className={`font-semibold ${m.status === 'upcoming' ? 'text-muted-foreground' : ''}`}>{m.quarter} FY2026</span>
                      {isCurrent && <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-xs border border-amber-400/30">Current</span>}
                    </div>
                    <span className="font-mono text-sm">{fmtDollar(m.target)}</span>
                  </div>
                  {(isComplete || isCurrent) && (
                    <>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground">
                          {isComplete ? `Closed: ${fmtDollar(m.actual)}` : 'In Progress'}
                        </span>
                        {m.actual > 0 && (
                          <span className={att >= 0.90 ? 'text-emerald-400' : att >= 0.75 ? 'text-amber-400' : 'text-red-400'}>
                            {fmtPct(att * 100)}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
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
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold mb-4">Cascade Alignment Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left py-3 pr-4">Level</th>
                <th className="text-right py-3 pr-4">Target</th>
                <th className="text-right py-3 pr-4">Actual</th>
                <th className="text-right py-3 pr-4">Gap</th>
                <th className="text-right py-3 pr-4">Attainment</th>
                <th className="text-center py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 bg-amber-400/[0.03]">
                <td className="py-3 pr-4 font-semibold">Company</td>
                <td className="py-3 pr-4 text-right font-mono">{fmtDollar(companyGoal)}</td>
                <td className="py-3 pr-4 text-right font-mono">{fmtDollar(companyActual)}</td>
                <td className="py-3 pr-4 text-right font-mono text-red-400">{fmtDollar(companyGoal - companyActual)}</td>
                <td className="py-3 pr-4 text-right font-semibold text-amber-400">{fmtPct(companyAtt * 100)}</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-xs border border-amber-400/30 bg-amber-400/10 text-amber-400">On Pace</span>
                </td>
              </tr>
              {teamGoals.map(t => {
                const att = t.actual / t.goal;
                const gap = t.goal - t.actual;
                const color = att >= 0.90 ? 'text-emerald-400' : att >= 0.75 ? 'text-amber-400' : 'text-red-400';
                return (
                  <tr key={t.team} className="border-b border-white/5">
                    <td className="py-3 pr-4 pl-6 text-muted-foreground">{t.team}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(t.goal)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs">{fmtDollar(t.actual)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-xs text-red-400">{gap > 0 ? fmtDollar(gap) : '--'}</td>
                    <td className={`py-3 pr-4 text-right font-semibold ${color}`}>{fmtPct(att * 100)}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${att >= 0.90 ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' : att >= 0.75 ? 'border-amber-400/30 bg-amber-400/10 text-amber-400' : 'border-red-400/30 bg-red-400/10 text-red-400'}`}>
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
