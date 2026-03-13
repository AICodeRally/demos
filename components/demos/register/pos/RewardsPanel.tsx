'use client';

import { Award, DollarSign, Zap, TrendingUp, ChevronUp } from 'lucide-react';
import { calculate } from '@/lib/swic-engine/calculator';
import type { SaleItem, PeriodContext, ClientConfig } from '@/lib/swic-engine/types';
import { COMP_TIERS, SPIFF_CALENDAR } from '@/data/register/comp-data';

interface RewardsPanelProps {
  items: SaleItem[];
  period: PeriodContext;
  config: ClientConfig;
}

export function RewardsPanel({ items, period, config }: RewardsPanelProps) {
  const result = items.length > 0 ? calculate(config, items, period) : null;

  const ytdRev = period.revenue;
  const currentTier = COMP_TIERS.slice().reverse().find((t) => ytdRev >= t.minRevenue);
  const nextTier = COMP_TIERS.find((t) => ytdRev < t.minRevenue);
  const toNext = nextTier ? nextTier.minRevenue - ytdRev : 0;
  const tierPct = currentTier && nextTier
    ? ((ytdRev - currentTier.minRevenue) / (nextTier.minRevenue - currentTier.minRevenue)) * 100
    : 100;

  const activeSpiffs = SPIFF_CALENDAR.filter((s) => s.active);
  const heights = [40, 55, 70, 85];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, overflowY: 'auto', height: '100%' }}>
      {/* Tier Staircase */}
      <div style={{ padding: 14, borderRadius: 12, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Award size={16} style={{ color: currentTier?.color ?? '#8B5CF6' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Commission Tier</span>
        </div>

        <div style={{ display: 'flex', gap: 4, height: 64, alignItems: 'flex-end', marginBottom: 8 }}>
          {COMP_TIERS.map((tier, i) => {
            const isCurrent = tier.tier === currentTier?.tier;
            return (
              <div key={tier.tier} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, color: isCurrent ? tier.color : 'var(--register-text-dim)' }}>
                  {(tier.rate * 100).toFixed(1)}%
                </span>
                <div
                  style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    height: `${heights[i]}%`,
                    backgroundColor: isCurrent ? tier.color : `${tier.color}30`,
                    border: isCurrent ? `2px solid ${tier.color}` : 'none',
                    transition: 'all 0.3s',
                  }}
                />
                <span style={{ fontSize: '0.55rem', fontWeight: 600, color: isCurrent ? 'var(--register-text)' : 'var(--register-text-dim)' }}>
                  {tier.tier}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--register-text-muted)' }}>YTD: ${ytdRev.toLocaleString()}</span>
            {nextTier && <span style={{ color: 'var(--register-text-muted)' }}>${toNext.toLocaleString()} to {nextTier.tier}</span>}
          </div>
          <div style={{ height: 8, borderRadius: 4, background: `${currentTier?.color ?? '#8B5CF6'}20` }}>
            <div
              style={{
                height: 8, borderRadius: 4,
                width: `${Math.min(tierPct, 100)}%`,
                backgroundColor: currentTier?.color ?? '#8B5CF6',
                transition: 'width 0.5s',
              }}
            />
          </div>
        </div>
      </div>

      {/* Component Breakdown */}
      <div style={{ padding: 14, borderRadius: 12, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <DollarSign size={16} style={{ color: '#10B981' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Ticket Commission</span>
        </div>

        {result ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {result.components.map((comp) => (
                <div key={comp.componentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>{comp.label}</span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: comp.amount > 0 ? '#10B981' : 'var(--register-text-dim)' }}>
                    ${comp.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--register-border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Total</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace', color: '#10B981' }}>
                ${result.totalCommission.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--register-text-dim)', textAlign: 'center', padding: '16px 0' }}>
            Add items to see commission
          </p>
        )}
      </div>

      {/* Threshold / Next Tier */}
      {result?.threshold && result.threshold.amountToNextTier !== null && (
        <div style={{ padding: 14, borderRadius: 12, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <ChevronUp size={16} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Next Tier Potential</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', margin: 0 }}>
            ${result.threshold.amountToNextTier.toLocaleString()} more revenue to unlock{' '}
            <strong style={{ color: 'var(--register-text)' }}>{(result.threshold.nextTierRate! * 100).toFixed(1)}%</strong> rate
          </p>
        </div>
      )}

      {/* Active SPIFFs */}
      <div style={{ padding: 14, borderRadius: 12, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Zap size={16} style={{ color: '#F59E0B' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Active SPIFFs</span>
        </div>
        {activeSpiffs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {activeSpiffs.map((spiff, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.06)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)', margin: 0 }}>{spiff.name}</p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>{spiff.product}</p>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: '#F59E0B' }}>{spiff.bonus}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)' }}>No active SPIFFs</p>
        )}
      </div>

      {/* Today's Earnings */}
      <div style={{ padding: 14, borderRadius: 12, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <TrendingUp size={16} style={{ color: '#06B6D4' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Today&apos;s Earnings</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Shift Sales', value: '$8,520', color: 'var(--register-text)' },
            { label: 'Commission', value: '$383', color: '#10B981' },
            { label: 'SPIFFs', value: '$50', color: '#F59E0B' },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)', margin: 0 }}>{stat.label}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: stat.color, margin: '2px 0 0' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 8 }}>
        {config.notes?.map((note, i) => (
          <p key={i} style={{ fontSize: '0.6rem', fontStyle: 'italic', color: 'var(--register-text-dim)', margin: 0 }}>{note}</p>
        ))}
      </div>
    </div>
  );
}
