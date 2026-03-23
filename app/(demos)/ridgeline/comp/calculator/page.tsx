'use client';

import { useState } from 'react';
import { COMP_PLANS, COMP_TIERS, getTierByAttainment } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';
import type { EmployeeRole } from '@/data/ridgeline';

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
  const vsPlan = ((totalComp / oteMedian) * 100).toFixed(1);

  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
        >
          <span className="text-3xl text-white">&#128178;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Comp Calculator
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Model payout scenarios by role and attainment
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[11px] uppercase tracking-[1.5px] font-semibold block mb-2" style={{ color: 'var(--rl-text-muted)' }}>
              Select Role
            </label>
            <div className="flex gap-2 flex-wrap">
              {COMP_PLANS.map((p) => (
                <button
                  key={p.role}
                  onClick={() => setSelectedRole(p.role)}
                  className="text-[12px] font-bold px-3 py-1.5 rounded-lg border transition-colors"
                  style={{
                    background: selectedRole === p.role ? '#1E3A5F' : 'transparent',
                    color: selectedRole === p.role ? 'white' : 'var(--rl-text)',
                    borderColor: selectedRole === p.role ? '#1E3A5F' : 'var(--rl-border)',
                  }}
                >
                  {p.role}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[1.5px] font-semibold block mb-2" style={{ color: 'var(--rl-text-muted)' }}>
              Attainment: {attainment}%
            </label>
            <input
              type="range"
              min={0}
              max={150}
              value={attainment}
              onChange={(e) => setAttainment(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: tier.color }}
            />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--rl-text-muted)' }}>
              <span>0%</span>
              <span>80%</span>
              <span>100%</span>
              <span>115%</span>
              <span>150%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border p-5 text-center" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: '3px solid #1E3A5F', boxShadow: 'var(--rl-shadow)' }}>
          <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>Base Salary</div>
          <div className="text-xl font-extrabold" style={{ color: '#1E3A5F' }}>{fmtDollar(baseSalary)}</div>
        </div>
        <div className="rounded-xl border p-5 text-center" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${tier.color}`, boxShadow: 'var(--rl-shadow)' }}>
          <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>Incentive Earned</div>
          <div className="text-xl font-extrabold" style={{ color: tier.color }}>{fmtDollar(actualIncentive)}</div>
          <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{tier.label} ({tier.rate}x)</div>
        </div>
        <div className="rounded-xl border p-5 text-center" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: '3px solid #10B981', boxShadow: 'var(--rl-shadow)' }}>
          <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>Total Comp</div>
          <div className="text-xl font-extrabold" style={{ color: '#10B981' }}>{fmtDollar(totalComp)}</div>
        </div>
        <div className="rounded-xl border p-5 text-center" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: '3px solid #7C3AED', boxShadow: 'var(--rl-shadow)' }}>
          <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>vs OTE Target</div>
          <div className="text-xl font-extrabold" style={{ color: parseFloat(vsPlan) >= 100 ? '#10B981' : '#F59E0B' }}>{vsPlan}%</div>
        </div>
      </div>

      {/* Tier Breakdown Visual */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          {plan.planName} — Tier Scale
        </h2>
        <div className="flex gap-2 h-20">
          {COMP_TIERS.map((t) => {
            const width = t.ceiling < 900
              ? ((t.ceiling - t.floor) / 1.5) * 100
              : ((1.5 - t.floor) / 1.5) * 100;
            const isActive = tier.level === t.level;
            return (
              <div
                key={t.level}
                className="rounded-lg flex flex-col items-center justify-center transition-all"
                style={{
                  flex: Math.max(width, 15),
                  background: isActive ? t.color : `${t.color}20`,
                  color: isActive ? 'white' : t.color,
                  border: isActive ? `2px solid ${t.color}` : '2px solid transparent',
                }}
              >
                <div className="text-[12px] font-bold">{t.label}</div>
                <div className="text-[18px] font-extrabold">{t.rate}x</div>
                <div className="text-[9px]">
                  {(t.floor * 100).toFixed(0)}%{t.ceiling < 900 ? `–${(t.ceiling * 100).toFixed(0)}%` : '+'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Details */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Component Contribution at {attainment}% Attainment
        </h2>
        <div className="space-y-3">
          {plan.components.map((comp) => {
            const compValue = Math.round((comp.weight / 100) * actualIncentive);
            return (
              <div key={comp.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#1E3A5F' }} />
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--rl-text)' }}>{comp.name} ({comp.weight}%)</span>
                </div>
                <span className="text-[14px] font-bold tabular-nums" style={{ color: '#10B981' }}>{fmtDollar(compValue)}</span>
              </div>
            );
          })}
          <div className="pt-3 flex items-center justify-between" style={{ borderTop: '2px solid var(--rl-border)' }}>
            <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>Total Incentive</span>
            <span className="text-lg font-extrabold" style={{ color: '#10B981' }}>{fmtDollar(actualIncentive)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
