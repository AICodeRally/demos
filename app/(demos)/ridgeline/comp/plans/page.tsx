'use client';

import { useState } from 'react';
import { COMP_PLANS } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

const ROLE_COLORS: Record<string, string> = {
  SVP: '#7C3AED',
  RVP: '#2563EB',
  RSM: '#0891B2',
  BM: '#10B981',
};

export default function CompPlansPage() {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const maxOte = Math.max(...COMP_PLANS.map((p) => p.oteRange.max));

  return (
    <>
      <style>{`
        @keyframes barReveal { from { width: 0 } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes ringGrow { from { stroke-dashoffset: 251.2 } }
        @keyframes pulseGlow { 0%, 100% { filter: drop-shadow(0 0 4px rgba(16,185,129,0.3)) } 50% { filter: drop-shadow(0 0 12px rgba(16,185,129,0.5)) } }
        @keyframes slideDown { from { max-height: 0; opacity: 0 } to { max-height: 600px; opacity: 1 } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', animation: 'pulseGlow 3s ease-in-out infinite' }}
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
            FY2026 plans by role &middot; Varicent-managed ICM &middot; Click any role to drill
          </p>
        </div>
      </div>

      {/* OTE Comparison — Stacked Bar Race */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Total Compensation Landscape — Base + Incentive at Target
        </div>

        <div className="space-y-4">
          {COMP_PLANS.map((plan, idx) => {
            const color = ROLE_COLORS[plan.role] || '#1E3A5F';
            const incentiveAmount = Math.round(plan.baseSalaryRange.median * plan.incentiveTarget);
            const ote = plan.oteRange.median;
            const basePct = (plan.baseSalaryRange.median / maxOte) * 100;
            const incPct = (incentiveAmount / maxOte) * 100;
            const isExpanded = expandedRole === plan.role;

            return (
              <div key={plan.role} style={{ animation: `fadeUp ${0.4 + idx * 0.1}s ease-out` }}>
                {/* Clickable Role Bar */}
                <button
                  onClick={() => setExpandedRole(isExpanded ? null : plan.role)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-extrabold text-[14px] shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: color }}
                    >
                      {plan.role}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>
                          {plan.planName}
                        </div>
                        <div className="text-[18px] font-extrabold tabular-nums" style={{ color }}>
                          {fmtDollar(ote)}
                          <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--rl-text-muted)' }}>OTE</span>
                        </div>
                      </div>

                      {/* Stacked Bar */}
                      <div className="flex h-8 rounded-lg overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                        <div
                          className="h-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{
                            width: `${basePct}%`,
                            background: color,
                            opacity: 0.7,
                            animation: `barReveal 0.8s ease-out ${idx * 0.15}s both`,
                          }}
                        >
                          Base {fmtDollar(plan.baseSalaryRange.median)}
                        </div>
                        <div
                          className="h-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{
                            width: `${incPct}%`,
                            background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                            animation: `barReveal 0.6s ease-out ${0.3 + idx * 0.15}s both`,
                          }}
                        >
                          +{fmtDollar(incentiveAmount)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                          Pay: {plan.payFrequency}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                          True-up: {plan.trueUpFrequency}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                          Incentive Target: {(plan.incentiveTarget * 100).toFixed(0)}%
                        </span>
                        <span className="text-[10px] ml-auto" style={{ color }}>
                          {isExpanded ? '▲ Collapse' : '▼ Expand components'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded: Component Ring + Details */}
                {isExpanded && (
                  <div
                    className="ml-16 mt-3 rounded-xl border p-5 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6"
                    style={{ background: `${color}08`, borderColor: `${color}30`, animation: 'slideDown 0.3s ease-out' }}
                  >
                    {/* SVG Ring Chart */}
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 100 100" className="w-44 h-44">
                        {(() => {
                          const radius = 40;
                          const circumference = 2 * Math.PI * radius;
                          let offset = 0;
                          const componentColors = ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#EF4444'];
                          return plan.components.map((comp, ci) => {
                            const segment = (comp.weight / 100) * circumference;
                            const el = (
                              <circle
                                key={comp.name}
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke={componentColors[ci % componentColors.length]}
                                strokeWidth="12"
                                strokeDasharray={`${segment} ${circumference - segment}`}
                                strokeDashoffset={-offset}
                                strokeLinecap="round"
                                style={{ animation: `ringGrow 0.8s ease-out ${ci * 0.15}s both` }}
                                transform="rotate(-90 50 50)"
                              />
                            );
                            offset += segment;
                            return el;
                          });
                        })()}
                        <text x="50" y="46" textAnchor="middle" fontSize="8" fontWeight="800" fill={color}>
                          {plan.components.length}
                        </text>
                        <text x="50" y="57" textAnchor="middle" fontSize="5" fill="var(--rl-text-muted)">
                          components
                        </text>
                      </svg>
                    </div>

                    {/* Component List */}
                    <div className="space-y-3">
                      {plan.components.map((comp, ci) => {
                        const componentColors = ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#EF4444'];
                        const compColor = componentColors[ci % componentColors.length];
                        const compDollar = Math.round((comp.weight / 100) * plan.baseSalaryRange.median * plan.incentiveTarget);
                        return (
                          <div key={comp.name} className="flex items-center gap-3" style={{ animation: `fadeUp ${0.3 + ci * 0.1}s ease-out` }}>
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: compColor }} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>{comp.name}</span>
                                <span className="text-[12px] font-bold tabular-nums" style={{ color: compColor }}>{comp.weight}%</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{comp.description}</span>
                                <span className="text-[10px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>{fmtDollar(compDollar)} at target</span>
                              </div>
                              <div className="mt-1 h-2 rounded-full overflow-hidden" style={{ background: `${compColor}15` }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${comp.weight}%`, background: compColor, animation: `barReveal 0.6s ease-out ${ci * 0.1}s both` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* OTE Range Comparison — Horizontal range bars */}
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.7s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          OTE Range by Role — Min / Median / Max
        </div>

        <div className="space-y-5">
          {COMP_PLANS.map((plan, idx) => {
            const color = ROLE_COLORS[plan.role] || '#1E3A5F';
            const minPct = (plan.oteRange.min / maxOte) * 100;
            const medPct = (plan.oteRange.median / maxOte) * 100;
            const maxPct = (plan.oteRange.max / maxOte) * 100;

            return (
              <div key={plan.role} style={{ animation: `fadeUp ${0.5 + idx * 0.12}s ease-out` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold" style={{ color }}>{plan.role}</span>
                  <span className="text-[11px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                    {fmtDollar(plan.oteRange.min)} — {fmtDollar(plan.oteRange.max)}
                  </span>
                </div>
                <div className="relative h-6 rounded-full" style={{ background: 'var(--rl-stripe)' }}>
                  {/* Range bar */}
                  <div
                    className="absolute top-1 bottom-1 rounded-full"
                    style={{
                      left: `${minPct}%`,
                      width: `${maxPct - minPct}%`,
                      background: `linear-gradient(90deg, ${color}40, ${color}80)`,
                      animation: `barReveal 0.7s ease-out ${idx * 0.15}s both`,
                    }}
                  />
                  {/* Median diamond */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 rounded-sm"
                    style={{
                      left: `calc(${medPct}% - 8px)`,
                      background: color,
                      boxShadow: `0 0 8px ${color}60`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Scale */}
        <div className="flex justify-between mt-3 text-[9px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
          <span>$0</span>
          <span>$128K</span>
          <span>$256K</span>
          <span>$384K</span>
          <span>$512K</span>
        </div>
      </div>
    </>
  );
}
