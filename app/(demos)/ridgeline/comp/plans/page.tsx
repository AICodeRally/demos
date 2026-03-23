'use client';

import { COMP_PLANS } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

export default function CompPlansPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
        >
          <span className="text-3xl text-white">&#127942;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Compensation Plans
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            FY2026 plans by role &middot; Varicent-managed ICM
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="space-y-6">
        {COMP_PLANS.map((plan) => {
          const incentiveAmount = Math.round(plan.baseSalaryRange.median * plan.incentiveTarget);
          return (
            <div
              key={plan.role}
              className="rounded-xl border p-6"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ background: '#1E3A5F' }}>{plan.role}</span>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>{plan.planName}</h3>
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: 'var(--rl-text-muted)' }}>
                    Pay: {plan.payFrequency} &middot; True-up: {plan.trueUpFrequency}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>OTE Median</div>
                  <div className="text-2xl font-extrabold" style={{ color: '#10B981' }}>{fmtDollar(plan.oteRange.median)}</div>
                </div>
              </div>

              {/* Salary + Incentive */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--rl-border)' }}>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Base Salary</div>
                  <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>{fmtDollar(plan.baseSalaryRange.median)}</div>
                  <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                    {fmtDollar(plan.baseSalaryRange.min)} &mdash; {fmtDollar(plan.baseSalaryRange.max)}
                  </div>
                </div>
                <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--rl-border)' }}>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Incentive Target</div>
                  <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{(plan.incentiveTarget * 100).toFixed(0)}%</div>
                  <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>= {fmtDollar(incentiveAmount)}</div>
                </div>
                <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--rl-border)' }}>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>OTE Range</div>
                  <div className="text-lg font-bold" style={{ color: '#10B981' }}>{fmtDollar(plan.oteRange.median)}</div>
                  <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                    {fmtDollar(plan.oteRange.min)} &mdash; {fmtDollar(plan.oteRange.max)}
                  </div>
                </div>
              </div>

              {/* Component Breakdown with visual bars */}
              <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-3" style={{ color: 'var(--rl-text-muted)' }}>
                Plan Components
              </div>
              <div className="space-y-2">
                {plan.components.map((comp) => (
                  <div key={comp.name} className="flex items-center gap-3">
                    <div className="w-24 text-[12px] font-semibold truncate" style={{ color: 'var(--rl-text)' }}>{comp.name}</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded flex items-center px-2"
                        style={{ width: `${comp.weight}%`, background: '#1E3A5F', minWidth: '40px' }}
                      >
                        <span className="text-[10px] font-bold text-white">{comp.weight}%</span>
                      </div>
                    </div>
                    <div className="w-48 text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{comp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
