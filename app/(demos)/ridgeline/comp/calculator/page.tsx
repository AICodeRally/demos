'use client';

import { useState } from 'react';
import { COMP_PLANS, COMP_TIERS, getTierByAttainment } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';
import type { EmployeeRole } from '@/data/ridgeline';

const ROLE_COLORS: Record<string, string> = { SVP: '#7C3AED', RVP: '#2563EB', RSM: '#0891B2', BM: '#10B981' };

export default function CalculatorPage() {
  const [selectedRole, setSelectedRole] = useState<EmployeeRole>('BM');
  const [attainment, setAttainment] = useState(100);

  const plan = COMP_PLANS.find((p) => p.role === selectedRole);
  const tier = getTierByAttainment(attainment / 100);

  if (!plan) return null;

  const baseSalary = plan.baseSalaryRange.median;
  const incentiveTarget = baseSalary * plan.incentiveTarget;
  const actualIncentive = Math.round(incentiveTarget * tier.rate);
  const totalComp = baseSalary + actualIncentive;
  const oteMedian = plan.oteRange.median;
  const vsPlan = (totalComp / oteMedian) * 100;
  const color = ROLE_COLORS[plan.role] || '#1E3A5F';

  // Gauge angle: 0-150% maps to -135deg to +135deg (270deg arc)
  const gaugeAngle = Math.min((attainment / 150) * 270 - 135, 135);
  const gaugeArcLength = (Math.min(attainment, 150) / 150) * 220;

  // Waterfall segments
  const waterfall = plan.components.map((comp) => ({
    name: comp.name,
    weight: comp.weight,
    value: Math.round((comp.weight / 100) * actualIncentive),
  }));

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes gaugeArc { from { stroke-dashoffset: 220 } }
        @keyframes needleSweep { from { transform: rotate(-135deg) } }
        @keyframes scaleUp { from { transform: scale(0.8); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes stackGrow { from { height: 0 } }
        @keyframes glowPulse { 0%, 100% { filter: drop-shadow(0 0 6px currentColor) } 50% { filter: drop-shadow(0 0 14px currentColor) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`, boxShadow: `0 4px 12px ${color}40` }}
        >
          <span className="text-3xl text-white">&#128178;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Comp Calculator
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Model payout scenarios &middot; Drag the slider to see live changes
          </p>
        </div>
      </div>

      {/* Controls */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.4s ease-out' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Role Selector */}
          <div>
            <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-3" style={{ color: 'var(--rl-text-muted)' }}>
              Select Role
            </div>
            <div className="flex gap-2 flex-wrap">
              {COMP_PLANS.map((p) => {
                const c = ROLE_COLORS[p.role] || '#1E3A5F';
                const active = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    onClick={() => setSelectedRole(p.role)}
                    className="text-[12px] font-bold px-4 py-2 rounded-lg transition-all"
                    style={{
                      background: active ? c : 'transparent',
                      color: active ? 'white' : c,
                      border: `2px solid ${active ? c : `${c}40`}`,
                      boxShadow: active ? `0 0 12px ${c}40` : 'none',
                      transform: active ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {p.role}
                    <span className="block text-[9px] font-normal opacity-80">{fmtDollar(p.oteRange.median)} OTE</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attainment Slider */}
          <div>
            <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-3" style={{ color: 'var(--rl-text-muted)' }}>
              Attainment Level
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={150}
                value={attainment}
                onChange={(e) => setAttainment(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: tier.color, background: `linear-gradient(90deg, #94A3B8 0%, #F59E0B 53%, #2563EB 67%, #22C55E 77%, #22C55E 100%)` }}
              />
              <div className="flex justify-between text-[10px] mt-1 tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                {[0, 50, 80, 100, 115, 150].map((v) => (
                  <span key={v} style={{ fontWeight: v === attainment ? 800 : 400, color: v === attainment ? tier.color : undefined }}>{v}%</span>
                ))}
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-4xl font-extrabold tabular-nums" style={{ color: tier.color }}>
                {attainment}%
              </span>
              <span className="text-[12px] font-bold ml-2 px-2 py-0.5 rounded-full" style={{ background: `${tier.color}15`, color: tier.color }}>
                {tier.label} — {tier.rate}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gauge + Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-6 mb-8">
        {/* SVG Speedometer Gauge */}
        <div
          className="rounded-xl border p-4 flex flex-col items-center justify-center"
          style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'scaleUp 0.5s ease-out' }}
        >
          <svg viewBox="0 0 100 65" className="w-full">
            {/* Background arc */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="var(--rl-border)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Colored tier segments */}
            {COMP_TIERS.map((t, i) => {
              const startPct = Math.min(t.floor / 1.5, 1);
              const endPct = Math.min(t.ceiling / 1.5, 1);
              // Map percentage to arc angles: 0% = -135deg, 100% = +135deg
              const totalArc = 270;
              const startAngle = -135 + startPct * totalArc;
              const endAngle = -135 + endPct * totalArc;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const cx = 50, cy = 55, r = 40;
              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy + r * Math.sin(endRad);
              const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
              return (
                <path
                  key={t.level}
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={t.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity={tier.level === t.level ? 1 : 0.3}
                  style={{ transition: 'opacity 0.3s' }}
                />
              );
            })}

            {/* Needle */}
            {(() => {
              const needleAngle = gaugeAngle;
              const rad = (needleAngle * Math.PI) / 180;
              const cx = 50, cy = 55, len = 32;
              const nx = cx + len * Math.cos(rad);
              const ny = cy + len * Math.sin(rad);
              return (
                <g style={{ transformOrigin: '50px 55px', animation: `needleSweep 1s ease-out both`, transform: `rotate(${needleAngle}deg)` }}>
                  <line x1="50" y1="55" x2={cx + len} y2={cy} stroke={tier.color} strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="50" cy="55" r="3" fill={tier.color} />
                </g>
              );
            })()}

            {/* Center value */}
            <text x="50" y="50" textAnchor="middle" fontSize="10" fontWeight="800" fill={tier.color}>
              {fmtDollar(totalComp)}
            </text>
            <text x="50" y="58" textAnchor="middle" fontSize="4" fill="var(--rl-text-muted)">
              total compensation
            </text>

            {/* Min/Max labels */}
            <text x="8" y="62" textAnchor="start" fontSize="3.5" fill="var(--rl-text-muted)">0%</text>
            <text x="92" y="62" textAnchor="end" fontSize="3.5" fill="var(--rl-text-muted)">150%</text>
          </svg>
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Base Salary', value: fmtDollar(baseSalary), sub: plan.planName, topColor: color },
            { label: 'Incentive Earned', value: fmtDollar(actualIncentive), sub: `${tier.label} (${tier.rate}x)`, topColor: tier.color },
            { label: 'Total Comp', value: fmtDollar(totalComp), sub: `${selectedRole} at ${attainment}%`, topColor: '#10B981' },
            { label: 'vs OTE Target', value: `${vsPlan.toFixed(1)}%`, sub: `OTE: ${fmtDollar(oteMedian)}`, topColor: vsPlan >= 100 ? '#10B981' : '#F59E0B' },
          ].map((card, i) => (
            <div
              key={card.label}
              className="rounded-xl border p-4 text-center transition-all"
              style={{
                background: 'var(--rl-card)',
                borderColor: 'var(--rl-border)',
                borderTop: `3px solid ${card.topColor}`,
                boxShadow: 'var(--rl-shadow)',
                animation: `fadeUp ${0.4 + i * 0.1}s ease-out`,
              }}
            >
              <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1" style={{ color: 'var(--rl-text-muted)' }}>{card.label}</div>
              <div className="text-2xl font-extrabold tabular-nums" style={{ color: card.topColor }}>{card.value}</div>
              <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Waterfall */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.7s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Component Waterfall at {attainment}% Attainment
        </div>

        <div className="flex items-end gap-3 h-48">
          {/* Base column */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-[10px] font-bold tabular-nums mb-1" style={{ color }}>
              {fmtDollar(baseSalary)}
            </div>
            <div
              className="w-full rounded-t-lg"
              style={{
                height: `${(baseSalary / totalComp) * 100}%`,
                background: `linear-gradient(180deg, ${color}, ${color}80)`,
                animation: 'stackGrow 0.6s ease-out both',
              }}
            />
            <div className="text-[9px] mt-1 font-semibold" style={{ color: 'var(--rl-text-muted)' }}>Base</div>
          </div>

          {/* Component columns */}
          {waterfall.map((comp, i) => {
            const compColors = ['#7C3AED', '#2563EB', '#F59E0B', '#EF4444', '#10B981'];
            const c = compColors[i % compColors.length];
            return (
              <div key={comp.name} className="flex-1 flex flex-col items-center">
                <div className="text-[10px] font-bold tabular-nums mb-1" style={{ color: c }}>
                  {fmtDollar(comp.value)}
                </div>
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${(comp.value / totalComp) * 100}%`,
                    background: `linear-gradient(180deg, ${c}, ${c}80)`,
                    animation: `stackGrow 0.5s ease-out ${0.2 + i * 0.1}s both`,
                    minHeight: '8px',
                  }}
                />
                <div className="text-[8px] mt-1 font-semibold text-center leading-tight" style={{ color: 'var(--rl-text-muted)' }}>
                  {comp.name.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            );
          })}

          {/* Total column */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-[10px] font-bold tabular-nums mb-1" style={{ color: '#10B981' }}>
              {fmtDollar(totalComp)}
            </div>
            <div
              className="w-full rounded-t-lg"
              style={{
                height: '100%',
                background: `linear-gradient(180deg, #10B981, #10B98180)`,
                animation: 'stackGrow 0.6s ease-out 0.6s both',
              }}
            />
            <div className="text-[9px] mt-1 font-extrabold" style={{ color: '#10B981' }}>TOTAL</div>
          </div>
        </div>
      </div>

      {/* Active Tier Scale */}
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.8s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-3" style={{ color: 'var(--rl-text-muted)' }}>
          Tier Scale — {plan.planName}
        </div>
        <div className="flex gap-2 h-16">
          {COMP_TIERS.map((t) => {
            const width = t.ceiling < 900 ? ((t.ceiling - t.floor) / 1.5) * 100 : ((1.5 - t.floor) / 1.5) * 100;
            const isActive = tier.level === t.level;
            return (
              <div
                key={t.level}
                className="rounded-lg flex flex-col items-center justify-center transition-all"
                style={{
                  flex: Math.max(width, 15),
                  background: isActive ? t.color : `${t.color}15`,
                  color: isActive ? 'white' : t.color,
                  border: isActive ? `2px solid ${t.color}` : '2px solid transparent',
                  boxShadow: isActive ? `0 0 16px ${t.color}40` : 'none',
                  animation: isActive ? 'glowPulse 2s ease-in-out infinite' : 'none',
                }}
              >
                <div className="text-[11px] font-bold">{t.label}</div>
                <div className="text-[18px] font-extrabold">{t.rate}x</div>
                <div className="text-[8px]">{(t.floor * 100).toFixed(0)}%{t.ceiling < 900 ? `–${(t.ceiling * 100).toFixed(0)}%` : '+'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
