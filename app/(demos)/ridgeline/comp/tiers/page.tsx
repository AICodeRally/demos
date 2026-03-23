'use client';

import { COMP_TIERS, EMPLOYEES } from '@/data/ridgeline';
import { getTierByAttainment } from '@/data/ridgeline';

const repEmployees = EMPLOYEES.filter((e) => e.attainment > 0);
const tierDistribution = COMP_TIERS.map((tier) => {
  const count = repEmployees.filter((e) => {
    const att = e.attainment / 100;
    return att >= tier.floor && att < tier.ceiling;
  }).length;
  return { ...tier, count, pct: repEmployees.length > 0 ? ((count / repEmployees.length) * 100).toFixed(0) : '0' };
});

export default function AttainmentTiersPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
        >
          <span className="text-3xl text-white">&#128200;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Attainment Tiers
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Payout multipliers by attainment level &middot; {repEmployees.length} active reps
          </p>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {tierDistribution.map((tier) => (
          <div
            key={tier.level}
            className="rounded-xl border p-5 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `4px solid ${tier.color}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="text-xs uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: tier.color }}>
              {tier.label}
            </div>
            <div className="text-3xl font-extrabold mb-1" style={{ color: tier.color }}>
              {tier.rate}x
            </div>
            <div className="text-[11px] tabular-nums mb-3" style={{ color: 'var(--rl-text-muted)' }}>
              {(tier.floor * 100).toFixed(0)}% &mdash; {tier.ceiling < 900 ? `${(tier.ceiling * 100).toFixed(0)}%` : 'Uncapped'}
            </div>
            <div className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>
              {tier.count} reps ({tier.pct}%)
            </div>
          </div>
        ))}
      </div>

      {/* Visual Stacked Bar */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Payout Curve
        </h2>
        <div className="relative h-48">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] w-10" style={{ color: 'var(--rl-text-muted)' }}>
            <span>1.5x</span>
            <span>1.25x</span>
            <span>1.0x</span>
            <span>0.5x</span>
            <span>0x</span>
          </div>
          {/* Chart area */}
          <div className="ml-12 h-full flex items-end gap-1">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140].map((att) => {
              const tier = getTierByAttainment(att / 100);
              const height = (tier.rate / 1.5) * 100;
              return (
                <div key={att} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t"
                    style={{ height: `${height}%`, background: tier.color, minHeight: '4px' }}
                  />
                  <div className="text-[9px] mt-1 tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                    {att}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Rep Attainment Table */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Rep Attainment Detail
        </h2>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: 'var(--rl-text-muted)' }}>
              <th className="text-left font-semibold pb-2 pl-2">Name</th>
              <th className="text-left font-semibold pb-2">Role</th>
              <th className="text-right font-semibold pb-2">Attainment</th>
              <th className="text-right font-semibold pb-2">Tier</th>
              <th className="text-right font-semibold pb-2 pr-2">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {repEmployees.sort((a, b) => b.attainment - a.attainment).map((emp, i) => {
              const tier = getTierByAttainment(emp.attainment / 100);
              return (
                <tr key={emp.id} style={i % 2 === 0 ? { background: 'var(--rl-stripe)' } : undefined}>
                  <td className="py-2 pl-2 font-semibold" style={{ color: 'var(--rl-text)' }}>{emp.name}</td>
                  <td className="py-2" style={{ color: 'var(--rl-text-muted)' }}>{emp.role}</td>
                  <td className="py-2 text-right tabular-nums font-bold" style={{ color: tier.color }}>
                    {emp.attainment}%
                  </td>
                  <td className="py-2 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${tier.color}15`, color: tier.color }}>
                      {tier.label}
                    </span>
                  </td>
                  <td className="py-2 text-right tabular-nums font-bold pr-2" style={{ color: tier.color }}>
                    {tier.rate}x
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
