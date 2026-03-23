'use client';

import { useState } from 'react';
import { COMP_PLANS, SAMPLE_SCORECARDS, TIER_COLORS, getPayoutAtAttainment } from '@/data/srs-blt/comp';
import { EMPLOYEES, ROLE_COLORS, ROLE_LABELS } from '@/data/srs-blt/employees';
import { fmtDollar } from '@/lib/utils';
import type { PlanTier } from '@/data/srs-blt/comp';

export default function CompPage() {
  const [selectedTier, setSelectedTier] = useState<PlanTier | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [calcAttainment, setCalcAttainment] = useState(100);

  const activePlans = COMP_PLANS.filter((p) => p.status === 'active');
  const displayPlans = selectedTier ? activePlans.filter((p) => p.tier === selectedTier) : activePlans;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
          <span className="text-3xl text-white">&#127942;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#059669' }}>Compensation</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--sb-text)' }}>Comp Plans</h1>
          <p className="text-[13px]" style={{ color: 'var(--sb-text-muted)' }}>
            {activePlans.length} active plans &middot; SVP through BM tiers &middot; Interactive scorecard
          </p>
        </div>
      </div>

      {/* Tier Filter */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(['SVP', 'RVP', 'RM', 'BM'] as PlanTier[]).map((tier, i) => {
          const plan = activePlans.find((p) => p.tier === tier);
          const isActive = selectedTier === tier;
          const color = TIER_COLORS[tier];
          return (
            <button key={tier} onClick={() => setSelectedTier(isActive ? null : tier)}
              className="rounded-xl border p-4 text-center transition-all"
              style={{
                background: isActive ? `${color}10` : 'var(--sb-card)',
                borderColor: isActive ? color : 'var(--sb-border)',
                borderTop: `3px solid ${color}`,
                boxShadow: isActive ? `0 0 14px ${color}20` : 'var(--sb-shadow)',
                animation: `fadeUp ${0.3 + i * 0.1}s ease-out`,
              }}>
              <div className="text-lg font-extrabold" style={{ color }}>{tier}</div>
              <div className="text-[10px] uppercase tracking-[0.5px] mb-1" style={{ color: 'var(--sb-text-muted)' }}>{ROLE_LABELS[tier]}</div>
              {plan && (
                <div className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--sb-text)' }}>
                  {fmtDollar(plan.targetIncentive)}
                </div>
              )}
              <div className="text-[9px]" style={{ color: 'var(--sb-text-faint)' }}>target incentive</div>
            </button>
          );
        })}
      </div>

      {/* Plan Cards */}
      <div className="space-y-4 mb-8">
        {displayPlans.map((plan, idx) => {
          const isExpanded = expandedPlan === plan.id;
          const color = TIER_COLORS[plan.tier];

          return (
            <button key={plan.id} onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
              className="w-full text-left" style={{ animation: `fadeUp ${0.3 + idx * 0.1}s ease-out` }}>
              <div className="rounded-xl border p-5 transition-all"
                style={{
                  borderColor: isExpanded ? color : 'var(--sb-border)',
                  borderLeft: `4px solid ${color}`,
                  background: isExpanded ? `${color}05` : 'var(--sb-card)',
                  boxShadow: 'var(--sb-shadow)',
                }}>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-bold" style={{ color: 'var(--sb-text)' }}>{plan.name}</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>{plan.tier}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>{plan.status}</span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--sb-text-muted)' }}>
                      {plan.division} &middot; Effective {plan.effectiveDate} &middot; {plan.components.length} components
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-extrabold tabular-nums" style={{ color }}>{fmtDollar(plan.targetIncentive)}</div>
                    <div className="text-[9px]" style={{ color: 'var(--sb-text-muted)' }}>target / {fmtDollar(plan.maxPayout)} max</div>
                  </div>
                </div>

                {/* Component Weights — Stacked Bar */}
                <div className="flex gap-0.5 h-8 mb-3 rounded-lg overflow-hidden">
                  {plan.components.map((comp, ci) => {
                    const compColor = [color, '#2563EB', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'][ci % 6];
                    return (
                      <div key={ci} className="flex items-center justify-center text-[8px] font-bold text-white transition-all"
                        style={{
                          width: `${comp.weight * 100}%`,
                          background: compColor,
                          animation: `barReveal 0.6s ease-out ${ci * 0.1}s both`,
                        }}>
                        {comp.weight >= 0.15 ? `${(comp.weight * 100).toFixed(0)}%` : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Component breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {plan.components.map((comp, ci) => {
                    const compColor = [color, '#2563EB', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'][ci % 6];
                    return (
                      <div key={ci} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: compColor }} />
                        <span style={{ color: 'var(--sb-text-muted)' }}>{comp.name}</span>
                        <span className="ml-auto font-bold tabular-nums" style={{ color: compColor }}>{(comp.weight * 100).toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded: Payout curve + thresholds */}
                {isExpanded && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--sb-border)', animation: 'fadeUp 0.2s ease-out' }}>
                    <div className="text-[10px] uppercase font-semibold mb-3" style={{ color: 'var(--sb-text-muted)' }}>Component Detail</div>
                    <div className="space-y-2">
                      {plan.components.map((comp, ci) => {
                        const compColor = [color, '#2563EB', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'][ci % 6];
                        return (
                          <div key={ci} className="rounded-lg p-3" style={{ background: 'var(--sb-stripe)' }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[12px] font-bold" style={{ color: compColor }}>{comp.name}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded capitalize" style={{ background: `${compColor}15`, color: compColor }}>{comp.payoutCurve}</span>
                            </div>
                            <div className="flex gap-6 text-[10px]">
                              <span style={{ color: 'var(--sb-text-muted)' }}>Threshold: <strong style={{ color: '#EF4444' }}>{(comp.threshold * 100).toFixed(0)}%</strong></span>
                              <span style={{ color: 'var(--sb-text-muted)' }}>Target: <strong style={{ color: '#10B981' }}>{(comp.target * 100).toFixed(0)}%</strong></span>
                              <span style={{ color: 'var(--sb-text-muted)' }}>Stretch: <strong style={{ color: '#7C3AED' }}>{(comp.stretch * 100).toFixed(0)}%</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Salary range */}
                    <div className="mt-3 flex gap-4 text-[10px]" style={{ color: 'var(--sb-text-muted)' }}>
                      <span>Base Salary: <strong style={{ color: 'var(--sb-text)' }}>{fmtDollar(plan.baseSalaryRange[0])} — {fmtDollar(plan.baseSalaryRange[1])}</strong></span>
                    </div>
                  </div>
                )}

                <div className="text-[9px] mt-2 text-right" style={{ color }}>
                  {isExpanded ? '\u25B2 Less' : '\u25BC Component detail'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Payout Calculator */}
      <div className="rounded-xl border p-6 mb-6"
        style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow)', animation: 'fadeUp 0.7s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--sb-text-muted)' }}>
          Payout Calculator &mdash; Slide to see projected payouts
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold" style={{ color: 'var(--sb-text)' }}>Attainment: {calcAttainment}%</span>
            <span className="text-[11px]" style={{ color: calcAttainment >= 100 ? '#10B981' : calcAttainment >= 90 ? '#F59E0B' : '#EF4444' }}>
              {calcAttainment >= 115 ? 'Max Payout' : calcAttainment >= 100 ? 'Above Target' : calcAttainment >= 90 ? 'Below Target' : 'Below Threshold'}
            </span>
          </div>
          <input type="range" min="80" max="120" value={calcAttainment}
            onChange={(e) => setCalcAttainment(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(90deg, #EF4444 0%, #F59E0B 30%, #10B981 60%, #7C3AED 100%)` }} />
          <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--sb-text-faint)' }}>
            <span>80%</span><span>90%</span><span>100%</span><span>110%</span><span>120%</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {activePlans.map((plan) => {
            const payout = getPayoutAtAttainment(plan, calcAttainment);
            const color = TIER_COLORS[plan.tier];
            const ratio = plan.targetIncentive > 0 ? payout / plan.targetIncentive : 0;
            return (
              <div key={plan.id} className="rounded-lg p-3 text-center" style={{ background: 'var(--sb-stripe)', borderLeft: `3px solid ${color}` }}>
                <div className="text-[11px] font-bold mb-1" style={{ color }}>{plan.tier}</div>
                <div className="text-[16px] font-extrabold tabular-nums" style={{ color: payout > 0 ? 'var(--sb-text)' : '#EF4444' }}>
                  {payout > 0 ? fmtDollar(Math.round(payout)) : '$0'}
                </div>
                <div className="text-[9px]" style={{ color: 'var(--sb-text-faint)' }}>
                  {(ratio * 100).toFixed(0)}% of target
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample Scorecard */}
      {SAMPLE_SCORECARDS.map((sc) => {
        const emp = EMPLOYEES.find((e) => e.id === sc.employeeId);
        if (!emp) return null;
        const plan = COMP_PLANS.find((p) => p.id === sc.planId);
        const attColor = sc.totalAttainment >= 100 ? '#10B981' : '#F59E0B';

        return (
          <div key={sc.employeeId} className="rounded-xl border p-6"
            style={{ background: 'var(--sb-card)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow)', animation: 'fadeUp 0.8s ease-out' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: ROLE_COLORS[emp.role] }}>
                  {emp.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-[14px] font-bold" style={{ color: 'var(--sb-text)' }}>{emp.name} &mdash; {sc.period}</div>
                  <div className="text-[11px]" style={{ color: 'var(--sb-text-muted)' }}>{plan?.name} &middot; {emp.branchCount} branches</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold tabular-nums" style={{ color: attColor }}>{sc.totalAttainment}%</div>
                <div className="text-[10px]" style={{ color: 'var(--sb-text-muted)' }}>
                  Projected: <strong style={{ color: '#059669' }}>{fmtDollar(sc.projectedPayout)}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {sc.components.map((comp, i) => {
                const compAttColor = comp.attainmentPct >= 100 ? '#10B981' : comp.attainmentPct >= 95 ? '#F59E0B' : '#EF4444';
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-40 text-[11px] font-semibold truncate" style={{ color: 'var(--sb-text)' }}>{comp.componentName}</div>
                    <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'var(--sb-stripe)' }}>
                      <div className="h-full rounded-full flex items-center px-2"
                        style={{
                          width: `${Math.min(comp.attainmentPct, 115)}%`,
                          background: `linear-gradient(90deg, ${compAttColor}80, ${compAttColor})`,
                          animation: `barReveal 0.6s ease-out ${i * 0.1}s both`,
                        }}>
                        <span className="text-[9px] font-bold text-white tabular-nums">{comp.attainmentPct}%</span>
                      </div>
                    </div>
                    <div className="w-12 text-[10px] font-bold tabular-nums text-right" style={{ color: compAttColor }}>
                      {comp.weightedScore.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
