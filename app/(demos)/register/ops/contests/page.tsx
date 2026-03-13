'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { REPS } from '@/data/register/coaching-data';
import { SAMPLE_PERIODS } from '@/data/register/summit-sleep';
import { COMP_TIERS } from '@/data/register/comp-data';

/* ── Leaderboard data ────────────────────────────────────── */

const LEADERBOARD = [
  { name: 'Sarah Johnson', units: 145, revenue: 72000, tier: 'Gold', repId: 'rep-sarah' },
  { name: 'David Rodriguez', units: 130, revenue: 62000, tier: 'Gold', repId: 'rep-david' },
  { name: 'Marcus Chen', units: 98, revenue: 48000, tier: 'Silver', repId: 'rep-marcus' },
  { name: 'Lisa Kim', units: 95, revenue: 45000, tier: 'Silver', repId: 'rep-lisa' },
  { name: 'Casey Miller', units: 42, revenue: 21400, tier: 'Bronze', repId: 'rep-casey' },
];

const TIER_COLORS: Record<string, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
};

export default function ContestBoard() {
  const insight = getInsight('ops/contests');

  return (
    <RegisterPage title="Contest Board" accentColor="#8B5CF6">
      {/* AI Insight */}
      {insight && (
        <div style={{ marginBottom: 20 }}>
          <AIInsightCard>{insight.text}</AIInsightCard>
        </div>
      )}

      {/* Active SPIFF Spotlight */}
      <div
        style={{
          padding: '18px 22px', borderRadius: 12, marginBottom: 24,
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B', margin: '0 0 4px' }}>
              March Adjustable Base SPIFF
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', margin: 0 }}>
              ErgoMotion Adjustable Bases &middot; Mar 1 &ndash; Mar 31
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#F59E0B', margin: 0 }}>
              $25
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>per unit sold</p>
          </div>
        </div>
      </div>

      {/* Monthly Leaderboard */}
      <div className="register-section">
        <p className="register-section-header">
          Monthly Leaderboard
        </p>
        <div className="overflow-x-auto -mx-1">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              {['Rank', 'Rep', 'Units', 'Revenue', 'Tier', 'Progress'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === 'Revenue' || h === 'Units' ? 'right' : h === 'Progress' ? 'center' : 'left',
                    padding: '8px 10px',
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: 'var(--register-text-dim)',
                    borderBottom: '1px solid var(--register-border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((rep, i) => {
              const tierColor = TIER_COLORS[rep.tier] ?? 'var(--register-text-dim)';
              // Progress toward next tier
              const currentTier = COMP_TIERS.find((t) => t.tier === rep.tier);
              const nextTier = COMP_TIERS.find((t) => t.minRevenue > (currentTier?.minRevenue ?? 0));
              const progressPct = nextTier
                ? Math.min(100, ((rep.revenue - (currentTier?.minRevenue ?? 0)) / (nextTier.minRevenue - (currentTier?.minRevenue ?? 0))) * 100)
                : 100;

              return (
                <tr key={rep.name} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--register-bg-surface)' }}>
                  <td style={{ padding: '10px', width: 40 }}>
                    <span
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 26, height: 26, borderRadius: 13,
                        fontSize: '0.7rem', fontWeight: 700,
                        background: i < 3 ? `${tierColor}20` : 'var(--register-bg-surface)',
                        color: i < 3 ? tierColor : 'var(--register-text-dim)',
                        border: i < 3 ? `2px solid ${tierColor}` : '1px solid var(--register-border)',
                      }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ padding: '10px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)' }}>
                    {rep.name}
                  </td>
                  <td style={{ padding: '10px', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--register-text)', textAlign: 'right' }}>
                    {rep.units}
                  </td>
                  <td style={{ padding: '10px', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--register-text)', textAlign: 'right' }}>
                    ${rep.revenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 6,
                        fontSize: '0.65rem', fontWeight: 700,
                        background: `${tierColor}15`, color: tierColor,
                        border: `1px solid ${tierColor}30`,
                      }}
                    >
                      {rep.tier}
                    </span>
                  </td>
                  <td style={{ padding: '10px', width: 140 }}>
                    <div style={{ height: 8, borderRadius: 4, background: `${tierColor}20` }}>
                      <div
                        style={{
                          height: 8, borderRadius: 4,
                          width: `${progressPct}%`,
                          background: tierColor,
                          transition: 'width 0.5s',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Tier Threshold Tracker */}
      <div className="register-section" style={{ marginBottom: 0 }}>
        <p className="register-section-header">
          Tier Threshold Tracker
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LEADERBOARD.map((rep) => {
            const currentTier = COMP_TIERS.find((t) => t.tier === rep.tier);
            const nextTier = COMP_TIERS.find((t) => t.minRevenue > (currentTier?.minRevenue ?? 0));
            const toNext = nextTier ? nextTier.minRevenue - rep.revenue : 0;
            const tierColor = TIER_COLORS[rep.tier] ?? 'var(--register-text-dim)';
            const nextColor = nextTier ? (TIER_COLORS[nextTier.tier] ?? 'var(--register-text-dim)') : tierColor;

            // Full progress across all tiers
            const maxRev = COMP_TIERS[COMP_TIERS.length - 1].minRevenue;
            const fullPct = Math.min(100, (rep.revenue / maxRev) * 100);

            return (
              <div key={rep.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)' }}>{rep.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>
                    {nextTier ? (
                      <>
                        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: nextColor }}>
                          ${toNext.toLocaleString()}
                        </span>{' '}
                        to {nextTier.tier}
                      </>
                    ) : (
                      <span style={{ color: '#10B981', fontWeight: 700 }}>Max Tier</span>
                    )}
                  </span>
                </div>
                <div style={{ position: 'relative', height: 10, borderRadius: 5, background: 'var(--register-bg-surface)' }}>
                  {/* Tier threshold markers */}
                  {COMP_TIERS.slice(1).map((tier) => (
                    <div
                      key={tier.tier}
                      style={{
                        position: 'absolute',
                        left: `${(tier.minRevenue / maxRev) * 100}%`,
                        top: 0, height: '100%', width: 2,
                        background: 'var(--register-border)',
                      }}
                    />
                  ))}
                  <div
                    style={{
                      height: 10, borderRadius: 5,
                      width: `${fullPct}%`,
                      background: `linear-gradient(90deg, ${tierColor}, ${nextColor ?? tierColor})`,
                      transition: 'width 0.5s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RegisterPage>
  );
}
