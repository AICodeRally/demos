'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { POS_REPS, SAMPLE_PERIODS } from '@/data/register/summit-sleep';
import { Users, Target, AlertTriangle, Zap, TrendingUp, TrendingDown, Award, ArrowUp } from 'lucide-react';

const ACCENT = '#10B981';

/* ── Rep enrichment ─────────────────────────────────────── */

interface RepData {
  id: string;
  name: string;
  initials: string;
  revenue: number;
  target: number;
  pct: number;
  tier: string;
  tierColor: string;
  pace: 'on-track' | 'at-risk' | 'behind';
  gapToNext: number;
  nextTier: string;
  commissionMTD: number;
}

function enrichReps(): RepData[] {
  const tierDefs = [
    { name: 'Bronze', min: 0, max: 24999, color: '#CD7F32', rate: 0.04 },
    { name: 'Silver', min: 25000, max: 49999, color: '#C0C0C0', rate: 0.045 },
    { name: 'Gold', min: 50000, max: 74999, color: '#FFD700', rate: 0.05 },
    { name: 'Platinum', min: 75000, max: Infinity, color: '#E5E4E2', rate: 0.055 },
  ];

  return POS_REPS.map((rep) => {
    const period = SAMPLE_PERIODS[rep.id];
    const revenue = period.revenue;
    const target = period.target ?? 75000;
    const pct = Math.round((revenue / target) * 100);
    const tier = tierDefs.find(t => revenue >= t.min && revenue <= t.max)!;
    const tierIdx = tierDefs.indexOf(tier);
    const nextTier = tierIdx < tierDefs.length - 1 ? tierDefs[tierIdx + 1] : null;
    const gapToNext = nextTier ? nextTier.min - revenue : 0;
    const commissionMTD = revenue * tier.rate;
    const nameParts = rep.name.split(' ');
    const initials = nameParts[0][0] + nameParts[1][0];

    let pace: 'on-track' | 'at-risk' | 'behind';
    if (pct >= 75) pace = 'on-track';
    else if (pct >= 50) pace = 'at-risk';
    else pace = 'behind';

    return {
      id: rep.id,
      name: rep.name,
      initials,
      revenue,
      target,
      pct,
      tier: tier.name,
      tierColor: tier.color,
      pace,
      gapToNext,
      nextTier: nextTier?.name ?? 'MAX',
      commissionMTD: Math.round(commissionMTD),
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

const REPS = enrichReps();

/* ── SPIFF ROI data ─────────────────────────────────────── */

const SPIFF_DATA = [
  { name: 'Adjustable Base SPIFF', roi: 4.1, triggered: 23, color: '#8B5CF6', spend: 575, revenue: 2358 },
  { name: 'Premium Tier Bonus', roi: 2.8, triggered: 15, color: '#06B6D4', spend: 450, revenue: 1260 },
  { name: 'Bundle Accelerator', roi: 3.7, triggered: 11, color: '#F59E0B', spend: 825, revenue: 3053 },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function TeamPerformancePage() {
  const [mounted, setMounted] = useState(false);
  const [barWidths, setBarWidths] = useState<number[]>(REPS.map(() => 0));

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setBarWidths(REPS.map(r => r.pct));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const avgPace = Math.round(REPS.reduce((s, r) => s + r.pct, 0) / REPS.length);
  const deadZoneReps = REPS.filter(r => r.pace === 'at-risk');
  const avgSpiffROI = (SPIFF_DATA.reduce((s, sp) => s + sp.roi, 0) / SPIFF_DATA.length).toFixed(1);

  const paceColor = (pace: string) => {
    if (pace === 'on-track') return ACCENT;
    if (pace === 'at-risk') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <RegisterPage title="Floor Intelligence Dashboard" subtitle="Flagship #12 -- March 2026" accentColor={ACCENT}>

      {/* ── Top Stat Cards ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active Reps', value: '5', icon: Users, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
          { label: 'Avg Pace-to-Target', value: `${avgPace}%`, icon: Target, color: ACCENT, bg: 'rgba(16,185,129,0.1)' },
          { label: 'In Dead Zone', value: String(deadZoneReps.length), icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
          { label: 'SPIFF ROI', value: `${avgSpiffROI}x`, icon: Zap, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                borderRadius: 14,
                padding: '18px 20px',
                background: 'var(--register-bg-elevated)',
                border: '1px solid var(--register-border)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 14, right: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={stat.color} />
                </div>
              </div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--register-text-muted)', marginBottom: 6 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 900, color: stat.color, fontFamily: 'monospace', margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Rep Performance Cards ───────────────────────────── */}
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 24,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
        }}
      >
        <div style={{ padding: '20px 28px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Award size={16} color={ACCENT} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Rep Performance</span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 600,
              color: 'var(--register-text-muted)',
              marginLeft: 'auto',
              background: 'var(--register-bg-surface)',
              padding: '3px 10px',
              borderRadius: 12,
            }}
          >
            Target: $75K / month
          </span>
        </div>

        <div style={{ padding: '0 28px 24px' }}>
          {REPS.map((rep, i) => {
            const PaceIcon = rep.pace === 'on-track' ? TrendingUp : rep.pace === 'at-risk' ? TrendingDown : TrendingDown;
            return (
              <div
                key={rep.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 0',
                  borderBottom: i < REPS.length - 1 ? '1px solid var(--register-border)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${paceColor(rep.pace)}22, ${paceColor(rep.pace)}44)`,
                    border: `2px solid ${paceColor(rep.pace)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: paceColor(rep.pace) }}>{rep.initials}</span>
                </div>

                {/* Name + tier */}
                <div style={{ width: 130, flexShrink: 0 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>{rep.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: `${rep.tierColor}22`,
                        color: rep.tierColor,
                        border: `1px solid ${rep.tierColor}44`,
                      }}
                    >
                      {rep.tier}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>
                      ${(rep.commissionMTD).toLocaleString()} earned
                    </span>
                  </div>
                </div>

                {/* Revenue bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)' }}>
                      ${(rep.revenue / 1000).toFixed(1)}K
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>
                      {rep.pct}% of $75K
                    </span>
                  </div>
                  <div style={{ height: 12, borderRadius: 6, background: 'var(--register-bg-surface)', overflow: 'hidden', position: 'relative' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 6,
                        background: rep.pace === 'on-track'
                          ? `linear-gradient(90deg, ${ACCENT}, #06B6D4)`
                          : rep.pace === 'at-risk'
                          ? `linear-gradient(90deg, #F59E0B, #FB923C)`
                          : `linear-gradient(90deg, #EF4444, #F87171)`,
                        width: `${barWidths[i]}%`,
                        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                        transitionDelay: `${i * 150}ms`,
                        maxWidth: '100%',
                      }}
                    />
                    {/* Target line at 100% */}
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: -2,
                        bottom: -2,
                        width: 2,
                        background: 'var(--register-text-muted)',
                        opacity: 0.4,
                      }}
                    />
                  </div>
                </div>

                {/* Pace + Gap */}
                <div style={{ width: 110, textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginBottom: 3 }}>
                    <PaceIcon size={12} color={paceColor(rep.pace)} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: paceColor(rep.pace), textTransform: 'capitalize' }}>
                      {rep.pace === 'on-track' ? 'On Track' : rep.pace === 'at-risk' ? 'At Risk' : 'Behind'}
                    </span>
                  </div>
                  {rep.gapToNext > 0 && (
                    <span style={{ fontSize: '0.62rem', color: 'var(--register-text-muted)' }}>
                      ${(rep.gapToNext / 1000).toFixed(1)}K to {rep.nextTier}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dead Zone Alert ─────────────────────────────────── */}
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 24,
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.25)',
          position: 'relative',
        }}
      >
        {/* Pulsing border glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            boxShadow: '0 0 20px rgba(245,158,11,0.08)',
            animation: 'dead-zone-pulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        <div style={{ padding: '22px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(245,158,11,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={16} color="#F59E0B" />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F59E0B', margin: 0 }}>Dead Zone Alert</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
                2 reps stuck between Bronze ($0-$50K) and Silver ($50K) thresholds
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            {[
              { name: 'Marcus Chen', gap: '$2,000', action: '1 Sleep System Bundle would do it', revenue: '$48K', pct: 64 },
              { name: 'Lisa Kim', gap: '$5,000', action: 'Needs 2-3 more premium sales', revenue: '$45K', pct: 60 },
            ].map((rep) => (
              <div
                key={rep.name}
                style={{
                  borderRadius: 12,
                  padding: '16px 18px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>{rep.name}</p>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'monospace', color: '#F59E0B' }}>{rep.revenue}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <ArrowUp size={12} color={ACCENT} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ACCENT }}>
                    {rep.gap} from Silver
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--register-text-muted)', margin: 0, fontStyle: 'italic' }}>
                  {rep.action}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#EF4444' }}>
              Dead zone reps have 40% higher turnover risk
            </span>
          </div>
        </div>
      </div>

      {/* ── SPIFF ROI Tracker ───────────────────────────────── */}
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 24,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
        }}
      >
        <div style={{ padding: '20px 28px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={16} color="#8B5CF6" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>SPIFF ROI Tracker</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: '0 28px 24px' }}>
          {SPIFF_DATA.map((spiff) => (
            <div
              key={spiff.name}
              style={{
                borderRadius: 14,
                padding: '18px 16px',
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: spiff.color }} />

              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
                {spiff.name}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'monospace', color: spiff.color, lineHeight: 1 }}>
                  {spiff.roi}x
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>ROI</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>Triggered</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)' }}>
                  {spiff.triggered}x
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>Spend</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: '#EF4444' }}>
                  ${spiff.spend.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>Revenue</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: ACCENT }}>
                  ${spiff.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Insight ──────────────────────────────────────── */}
      <AIInsightCard>
        23% of reps in dead zone between Bronze and Silver. Lower Tier 2 threshold from $25K to $22K -- estimated <strong>+$8K monthly payout</strong>, <strong>+$340K revenue</strong>. Adjustable Base SPIFF is the highest-ROI incentive at 4.1x -- consider extending through Q2.
      </AIInsightCard>

      {/* ── Keyframe Animations ─────────────────────────────── */}
      <style>{`
        @keyframes dead-zone-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.05); }
          50% { box-shadow: 0 0 30px rgba(245,158,11,0.12); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </RegisterPage>
  );
}
