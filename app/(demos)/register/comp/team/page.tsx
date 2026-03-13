'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { TEAM_EARNINGS, COMP_TIERS } from '@/data/register/comp-data';

const ACCENT = '#10B981';

export default function TeamPerformancePage() {
  const insight = getInsight('comp/team');
  const maxEarnings = Math.max(...TEAM_EARNINGS.map((r) => r.earnings));

  // Tier distribution — assign each rep to a tier based on simulated monthly revenue
  const repRevenues = [
    { name: 'Sarah L.', revenue: 62000 },
    { name: 'Raj P.', revenue: 52000 },
    { name: 'Mike T.', revenue: 38000 },
    { name: 'Casey M.', revenue: 21400 },
    { name: 'James W.', revenue: 18000 },
    { name: 'Anna K.', revenue: 16000 },
  ];

  const tierCounts: Record<string, number> = {};
  COMP_TIERS.forEach((t) => { tierCounts[t.tier] = 0; });
  for (const rep of repRevenues) {
    const tier = COMP_TIERS.find((t) => rep.revenue >= t.minRevenue && rep.revenue <= t.maxRevenue);
    if (tier) tierCounts[tier.tier]++;
  }

  return (
    <RegisterPage title="Team Performance" subtitle="Flagship #12 — March 2026" accentColor={ACCENT}>
      {/* Horizontal Bar Chart */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
          Rep Earnings — March MTD
        </h2>
        <div className="space-y-3">
          {TEAM_EARNINGS.map((rep) => {
            const pct = (rep.earnings / maxEarnings) * 100;
            return (
              <div key={rep.name} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--register-text)' }}>{rep.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>{rep.role}</p>
                </div>
                <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--register-bg-surface)' }}>
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${pct}%`, backgroundColor: rep.color, minWidth: 60 }}
                  >
                    <span className="text-xs font-bold text-white">
                      ${rep.earnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tier Distribution */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
            Tier Distribution
          </h2>
          <div className="space-y-3">
            {COMP_TIERS.map((tier) => {
              const count = tierCounts[tier.tier] || 0;
              const barWidth = (count / repRevenues.length) * 100;
              return (
                <div key={tier.tier} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.tier[0]}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--register-text)' }}>
                      {tier.tier}
                    </span>
                  </div>
                  <div className="flex-1 h-6 rounded overflow-hidden" style={{ background: 'var(--register-bg-surface)' }}>
                    <div
                      className="h-full rounded flex items-center justify-center transition-all"
                      style={{ width: `${Math.max(barWidth, 8)}%`, backgroundColor: tier.color }}
                    >
                      {count > 0 && (
                        <span className="text-[10px] font-bold text-white">{count} rep{count !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono w-8 text-right" style={{ color: 'var(--register-text-muted)' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Avg Attach Rate', value: '28%', target: '35%', status: 'below', color: '#F59E0B' },
              { label: 'Avg Financing Penetration', value: '58%', target: '70%', status: 'below', color: '#F59E0B' },
              { label: 'Avg Sale Price', value: '$1,890', target: '$2,000', status: 'close', color: '#06B6D4' },
              { label: 'Team Total Earnings', value: '$37,800', target: '$42,000', status: 'close', color: ACCENT },
              { label: 'Avg Commission per Rep', value: '$6,300', target: '$7,000', status: 'close', color: ACCENT },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: 'var(--register-bg-surface)' }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--register-text)' }}>{metric.label}</p>
                  <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>Target: {metric.target}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold font-mono" style={{ color: metric.color }}>{metric.value}</p>
                  <p
                    className="text-[10px] font-semibold"
                    style={{ color: metric.status === 'below' ? '#F59E0B' : ACCENT }}
                  >
                    {metric.status === 'below' ? 'Below Target' : 'On Track'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <AIInsightCard label={insight.label}>
          {insight.text}
        </AIInsightCard>
      )}
    </RegisterPage>
  );
}
