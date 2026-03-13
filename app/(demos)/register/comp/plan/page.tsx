'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { COMP_TIERS, SPIFF_CALENDAR } from '@/data/register/comp-data';

const ACCENT = '#10B981';

const ACCELERATOR_RULES = [
  { metric: 'Attach Rate', threshold: '> 35%', multiplier: '1.15x', description: '15% bonus on all commission when accessory attach rate exceeds 35%' },
  { metric: 'Financing Penetration', threshold: '> 70%', multiplier: '1.10x', description: '10% bonus when financing penetration exceeds 70%' },
  { metric: 'Bundle Completion', threshold: '> 25%', multiplier: '1.05x', description: '5% bonus when 25%+ of mattress sales include adjustable base' },
];

export default function CompPlanPage() {
  const now = new Date();
  const activeSpiffs = SPIFF_CALENDAR.filter((s) => s.active);
  const upcomingSpiffs = SPIFF_CALENDAR.filter((s) => !s.active && new Date(s.startDate) > now);
  const pastSpiffs = SPIFF_CALENDAR.filter((s) => !s.active && new Date(s.endDate) < now);

  return (
    <RegisterPage title="Compensation Plan" subtitle="FY26 Floor Sales Plan" accentColor={ACCENT}>
      {/* Plan Metadata */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', color: 'var(--register-text-muted)' }}
        >
          Version 3.2
        </span>
        <span
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', color: 'var(--register-text-muted)' }}
        >
          Effective: Jan 1 – Dec 31, 2026
        </span>
        <span
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: ACCENT }}
        >
          170 Reps Enrolled
        </span>
        <span
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: ACCENT }}
        >
          Active
        </span>
      </div>

      {/* Tier Visualization */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
          Commission Tiers
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--register-border)' }}>
                <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Tier</th>
                <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Revenue Range</th>
                <th className="text-right py-3 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Rate</th>
                <th className="text-right py-3 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Est. Monthly Earnings</th>
              </tr>
            </thead>
            <tbody>
              {COMP_TIERS.map((tier) => {
                const rangeLabel =
                  tier.maxRevenue === Infinity
                    ? `$${tier.minRevenue.toLocaleString()}+`
                    : `$${tier.minRevenue.toLocaleString()} – $${tier.maxRevenue.toLocaleString()}`;
                const midpoint = tier.maxRevenue === Infinity ? tier.minRevenue + 25000 : (tier.minRevenue + tier.maxRevenue) / 2;
                const estEarnings = midpoint * tier.rate;

                return (
                  <tr key={tier.tier} style={{ borderBottom: '1px solid var(--register-border)' }}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: tier.color }}
                        >
                          {tier.tier[0]}
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--register-text)' }}>
                          {tier.tier}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono" style={{ color: 'var(--register-text-muted)' }}>
                      {rangeLabel}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                      >
                        {(tier.rate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold" style={{ color: ACCENT }}>
                      ${estEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tier bar visual */}
        <div className="mt-6">
          <div className="flex h-4 rounded-full overflow-hidden">
            {COMP_TIERS.map((tier, i) => (
              <div
                key={i}
                className="h-full"
                style={{ backgroundColor: tier.color, flex: tier.maxRevenue === Infinity ? 2 : 1 }}
                title={`${tier.tier}: ${(tier.rate * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {COMP_TIERS.map((tier, i) => (
              <span key={i} className="text-xs" style={{ color: 'var(--register-text-muted)' }}>
                {tier.tier}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Active SPIFFs */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
          SPIFF Calendar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPIFF_CALENDAR.map((spiff, i) => {
            const isActive = spiff.active;
            const isUpcoming = !isActive && new Date(spiff.startDate) > now;
            return (
              <div
                key={i}
                className="rounded-lg p-4 transition-all"
                style={{
                  background: isActive ? 'rgba(16,185,129,0.08)' : 'var(--register-bg-surface)',
                  border: `2px solid ${isActive ? ACCENT : 'var(--register-border)'}`,
                  opacity: isActive ? 1 : isUpcoming ? 0.7 : 0.45,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--register-text-muted)' }}>
                    {spiff.month}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
                      ACTIVE
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                      UPCOMING
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--register-text)' }}>{spiff.name}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--register-text-muted)' }}>{spiff.product}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: isActive ? ACCENT : 'var(--register-text-muted)' }}>
                    {spiff.bonus}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>
                    {spiff.startDate.slice(5)} – {spiff.endDate.slice(5)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accelerator Rules */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
          Accelerator Rules
        </h2>
        <div className="space-y-3">
          {ACCELERATOR_RULES.map((rule, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg px-5 py-4"
              style={{ background: 'rgba(59,130,246,0.06)', borderLeft: '3px solid #3B82F6' }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-bold" style={{ color: 'var(--register-text)' }}>{rule.metric}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                    {rule.threshold}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: ACCENT }}>
                    {rule.multiplier}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--register-text-muted)' }}>{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RegisterPage>
  );
}
