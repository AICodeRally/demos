'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { useIcm } from '@/components/demos/register/IcmContext';
import { CheckCircle, AlertTriangle, TrendingUp, Settings } from 'lucide-react';
import { COMP_TIERS } from '@/data/register/comp-data';
import { POS_REPS, SAMPLE_PERIODS } from '@/data/register/summit-sleep';

const ACCENT = '#10B981';

/* ── Mock rep tier assignments ───────────────────────────── */

const REP_TIER_DATA = POS_REPS.map((rep) => {
  const period = SAMPLE_PERIODS[rep.id];
  const revenue = period?.revenue ?? 0;
  const tier = COMP_TIERS.find((t) => revenue >= t.minRevenue && revenue <= t.maxRevenue) ?? COMP_TIERS[0];
  return { ...rep, revenue, tier: tier.tier, tierColor: tier.color, rate: tier.rate };
});

/* ── Component payout data ───────────────────────────────── */

const COMPONENT_PAYOUTS = [
  {
    name: 'Base Comm.',
    payout: 18420,
    trend: 5.2,
    sparkline: [14200, 15800, 16400, 17100, 18420],
    color: '#06B6D4',
  },
  {
    name: 'Product Prem.',
    payout: 4250,
    trend: -2.1,
    sparkline: [4800, 4600, 4400, 4350, 4250],
    color: '#8B5CF6',
  },
  {
    name: 'SPIFF',
    payout: 2875,
    trend: 12.4,
    sparkline: [1800, 2100, 2400, 2600, 2875],
    color: '#F59E0B',
  },
  {
    name: 'Bundle Accel.',
    payout: 3150,
    trend: 8.7,
    sparkline: [2200, 2500, 2700, 2900, 3150],
    color: '#10B981',
  },
];

/* ── Dead zone reps (between Bronze and Silver) ──────────── */

const DEAD_ZONE_REPS = 23;
const DEAD_ZONE_AVG_GAP = 2400;

/* ── Animated Dot ────────────────────────────────────────── */

function AnimatedDots({ tier, count }: { tier: string; count: number }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % 60);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 6, overflow: 'hidden', borderRadius: 3 }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = ((offset + i * (60 / count)) % 60) / 60 * 100;
        return (
          <div
            key={`${tier}-dot-${i}`}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: 0,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--register-accent)',
              opacity: 0.7,
              transition: 'left 0.08s linear',
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Mini Sparkline Bar ──────────────────────────────────── */

function MiniSparkBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}50`,
            borderRadius: 2,
            minHeight: 3,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function CompPlanPage() {
  const { provider: icm } = useIcm();
  const [glowPhase, setGlowPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setGlowPhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const glowIntensity = 0.15 + Math.sin(glowPhase / 15) * 0.1;

  /* ── Tier distribution ─────────────────────────────────── */

  const tierDistribution = COMP_TIERS.map((tier) => {
    const repsInTier = REP_TIER_DATA.filter((r) => r.tier === tier.tier);
    return { ...tier, repCount: repsInTier.length, reps: repsInTier };
  });

  // Total reps across org (mock: 170 enrolled)
  const totalReps = 170;
  const bronzeCount = 68;
  const silverCount = 52;
  const goldCount = 34;
  const platinumCount = 16;

  const tierCounts = [
    { ...COMP_TIERS[0], count: bronzeCount },
    { ...COMP_TIERS[1], count: silverCount },
    { ...COMP_TIERS[2], count: goldCount },
    { ...COMP_TIERS[3], count: platinumCount },
  ];

  return (
    <RegisterPage title="Live Plan Performance" subtitle="FY26 Floor Sales Plan -- Real-Time Tier Intelligence" accentColor={ACCENT}>
      {/* ICM sync badge + Edit in Designer link */}
      <div className="flex items-center gap-3 mb-8" style={{ flexWrap: 'wrap' }}>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}
        >
          <CheckCircle size={14} color="var(--register-success)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 600 }}>
            Synced from {icm.name}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--register-text-dim)' }}>
          Last sync: 2h ago &middot; v3.2 &middot; 24 rules
        </span>
        <Link
          href="/register/comp/admin"
          style={{
            marginLeft: 'auto',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: 'color-mix(in srgb, var(--register-ai) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--register-ai) 40%, transparent)',
            color: 'var(--register-ai)',
            fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
          }}
        >
          <Settings size={13} /> Edit in Designer
        </Link>
      </div>

      {/* ── Animated Tier Staircase ──────────────────────────── */}
      <div className="register-section">
        <div className="flex items-center justify-between mb-5">
          <h2 className="register-section-header" style={{ marginBottom: 0 }}>
            Tier Staircase
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>
            {totalReps} reps enrolled
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {tierCounts.map((tier, i) => {
            const maxCount = Math.max(...tierCounts.map((t) => t.count));
            const barWidth = Math.max((tier.count / maxCount) * 100, 20);
            const isDeadZoneBoundary = i === 0; // Bronze-Silver boundary

            return (
              <div key={tier.tier} style={{ position: 'relative' }}>
                {/* Tier row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 0',
                    borderBottom: i < tierCounts.length - 1 ? '1px solid var(--register-border)' : 'none',
                  }}
                >
                  {/* Tier badge */}
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: `${tier.color}20`,
                      }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: tier.color }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--register-text)' }}>
                        {tier.tier}
                      </span>
                    </div>
                  </div>

                  {/* Threshold & rate */}
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {tier.maxRevenue === Infinity
                        ? `$${(tier.minRevenue / 1000).toFixed(0)}K+`
                        : `$${(tier.minRevenue / 1000).toFixed(0)}K - $${(tier.maxRevenue / 1000).toFixed(0)}K`}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: tier.color }}>
                      {(tier.rate * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* Bar + dots */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: 32,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${tier.color}40, ${tier.color}80)`,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'width 0.5s ease',
                      }}
                    >
                      {/* Flowing dots inside bar */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                        <AnimatedDots tier={tier.tier} count={Math.min(tier.count / 5, 8)} />
                      </div>
                    </div>
                  </div>

                  {/* Rep count */}
                  <div style={{ width: 60, textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--register-text)' }}>
                      {tier.count}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', marginLeft: 4 }}>reps</span>
                  </div>
                </div>

                {/* Dead zone glow on Bronze-Silver boundary */}
                {isDeadZoneBoundary && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `rgba(245, 158, 11, ${glowIntensity})`,
                      boxShadow: `0 0 12px rgba(245, 158, 11, ${glowIntensity * 1.5})`,
                      borderRadius: 2,
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dead Zone Alert ──────────────────────────────────── */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{
          background: 'rgba(245, 158, 11, 0.06)',
          border: '2px solid rgba(245, 158, 11, 0.3)',
          boxShadow: `0 0 20px rgba(245, 158, 11, ${glowIntensity * 0.5})`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} color="#F59E0B" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F59E0B' }}>
                Dead Zone Alert
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#F59E0B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Action Needed
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--register-text)', margin: 0, lineHeight: 1.5 }}>
              <strong>{DEAD_ZONE_REPS} reps</strong> stuck between Bronze and Silver —{' '}
              <strong style={{ color: '#F59E0B' }}>${DEAD_ZONE_AVG_GAP.toLocaleString()}</strong> avg. gap to next tier.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', margin: '4px 0 0' }}>
              These reps are below the $25K Silver threshold but above $22.6K avg. They can see the tier but cannot reach it this period.
            </p>
          </div>
        </div>
      </div>

      {/* ── Component Breakdown Grid ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {COMPONENT_PAYOUTS.map((comp) => (
          <div
            key={comp.name}
            className="register-card"
            style={{ padding: '16px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="register-meta-label" style={{ color: 'var(--register-text-muted)' }}>
                {comp.name}
              </span>
              <div className="flex items-center gap-1">
                {comp.trend > 0 ? (
                  <TrendingUp size={12} color={ACCENT} />
                ) : (
                  <TrendingUp size={12} color="#EF4444" style={{ transform: 'scaleY(-1)' }} />
                )}
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: comp.trend > 0 ? ACCENT : '#EF4444' }}>
                  {comp.trend > 0 ? '+' : ''}{comp.trend}%
                </span>
              </div>
            </div>
            <p className="register-kpi-value" style={{ fontSize: '1.25rem', color: comp.color, margin: '0 0 8px' }}>
              ${comp.payout.toLocaleString()}
            </p>
            <MiniSparkBar data={comp.sparkline} color={comp.color} />
            <p style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', marginTop: 4 }}>
              Current period total
            </p>
          </div>
        ))}
      </div>

      {/* ── AI Insight ───────────────────────────────────────── */}
      <AIInsightCard
        label="AI Plan Optimization"
        action={{ label: 'Simulate', onClick: () => {} }}
      >
        Lower Tier 2 threshold from $25K to $22K — moves {DEAD_ZONE_REPS} reps out of the dead zone.
        Projected impact: <strong style={{ color: ACCENT }}>+$340K incremental revenue</strong> this quarter,
        with only $18K additional comp spend (5.3% ROI on comp investment).
      </AIInsightCard>
    </RegisterPage>
  );
}
