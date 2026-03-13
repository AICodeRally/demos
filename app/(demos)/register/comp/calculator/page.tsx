'use client';

import { useState, useEffect, useMemo } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { Clock, Award, Zap, Target } from 'lucide-react';
import { COMP_TIERS } from '@/data/register/comp-data';
import { SAMPLE_PERIODS } from '@/data/register/summit-sleep';

const ACCENT = '#10B981';

/* ── Mock data ───────────────────────────────────────────── */

const VARICENT_PROJECTED = {
  total: 3847,
  components: [
    { name: 'Base Salary', amount: 1384.62 },
    { name: 'Mattress Commission', amount: 873.60 },
    { name: 'Accessory Commission', amount: 111.00 },
    { name: 'Volume Tier Bonus', amount: 963.00 },
    { name: 'SPIFF Bonus', amount: 50.00 },
    { name: 'Prior Period Adj.', amount: 7.00 },
  ],
};

const LIVE_BASE_EARNINGS = 3389.22;

const RECENT_SALES = [
  { time: '2:47 PM', item: 'King Hybrid + Adj Base + Protector', amount: 5247, commission: 236.12, components: 'Base 4.5% + SPIFF $25 + Bundle $75' },
  { time: '1:12 PM', item: 'Queen Hybrid + Protector', amount: 1968, commission: 88.56, components: 'Base 4.5%' },
  { time: '11:30 AM', item: 'Full Firm', amount: 849, commission: 38.21, components: 'Base 4.5%' },
  { time: '10:15 AM', item: 'King Pillow-Top + Base + Protector + Pillows', amount: 3636, commission: 163.62, components: 'Base 4.5% + SPIFF $25 + Bundle $75' },
  { time: '9:02 AM', item: 'Queen Medium + Sheets', amount: 1428, commission: 64.26, components: 'Base 4.5%' },
];

/* ── Tier progress data ──────────────────────────────────── */

const caseyRevenue = SAMPLE_PERIODS['rep-casey'].revenue; // $21,400
const currentTier = COMP_TIERS.find((t) => caseyRevenue >= t.minRevenue && caseyRevenue <= t.maxRevenue) ?? COMP_TIERS[0];
const nextTier = COMP_TIERS[COMP_TIERS.indexOf(currentTier) + 1] ?? null;
const amountToNext = nextTier ? nextTier.minRevenue - caseyRevenue : 0;
const tierProgress = nextTier
  ? ((caseyRevenue - currentTier.minRevenue) / (nextTier.minRevenue - currentTier.minRevenue)) * 100
  : 100;

/* ── SVG Tier Ring ───────────────────────────────────────── */

function TierRing({ progress, animatedProgress }: { progress: number; animatedProgress: number }) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--register-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ACCENT}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Glow filter */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={0.4}
          style={{ filter: 'blur(4px)', transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 6,
            background: `${currentTier.color}20`,
            marginBottom: 4,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: currentTier.color }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--register-text)' }}>
            {currentTier.tier}
          </span>
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>
          ${(amountToNext / 1000).toFixed(1)}K
        </span>
        <span style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)' }}>
          to {nextTier?.tier ?? 'Max'}
        </span>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function CalculatorPage() {
  /* ── Animated earnings counter ─────────────────────────── */
  const [liveEarnings, setLiveEarnings] = useState(LIVE_BASE_EARNINGS);
  const [ringProgress, setRingProgress] = useState(0);

  // Slowly tick up the live earnings counter
  useEffect(() => {
    const id = setInterval(() => {
      setLiveEarnings((prev) => {
        const increment = 0.12 + Math.random() * 0.35;
        return parseFloat((prev + increment).toFixed(2));
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Animate ring on mount
  useEffect(() => {
    const timeout = setTimeout(() => setRingProgress(tierProgress), 300);
    return () => clearTimeout(timeout);
  }, []);

  /* ── Format helpers ────────────────────────────────────── */
  const fmtCurrency = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <RegisterPage title="Commission Calculator" subtitle="Live Floor Earnings vs. Varicent Projection" accentColor={ACCENT}>
      {/* ── Split View: Varicent vs Live ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* LEFT: Varicent Projected Statement */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'var(--register-bg-surface)',
            border: '1px solid var(--register-border)',
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(148, 163, 184, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={16} color="#94A3B8" />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--register-text-muted)', margin: 0 }}>
                Projected Varicent Statement
              </p>
              <p style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', margin: 0 }}>
                Month-end projection -- updated at close of business
              </p>
            </div>
          </div>

          {/* Projected total */}
          <div
            style={{
              textAlign: 'center',
              padding: '16px 0',
              marginBottom: 16,
              borderBottom: '1px dashed var(--register-border)',
            }}
          >
            <p style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
              Projected Payout
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--register-text-muted)', margin: 0, fontFamily: 'monospace' }}>
              {fmtCurrency(VARICENT_PROJECTED.total)}
            </p>
          </div>

          {/* Component lines (document-style) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {VARICENT_PROJECTED.components.map((comp, i) => (
              <div
                key={comp.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < VARICENT_PROJECTED.components.length - 1 ? '1px dotted var(--register-border)' : 'none',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>{comp.name}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--register-text-muted)' }}>
                  {fmtCurrency(comp.amount)}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(148, 163, 184, 0.08)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)' }}>
              Next Varicent sync: March 31 at 11:59 PM
            </span>
          </div>
        </div>

        {/* RIGHT: Live Floor Earnings */}
        <div
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.04), rgba(16,185,129,0.12))',
            border: '2px solid rgba(16,185,129,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated shimmer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.03), transparent)',
              animation: 'shimmer 3s infinite',
              pointerEvents: 'none',
            }}
          />
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(50%); }
            }
            @keyframes pulse-dot {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
          `}</style>

          <div className="flex items-center gap-3 mb-5" style={{ position: 'relative' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(16,185,129,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={16} color={ACCENT} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p style={{ fontSize: '0.85rem', fontWeight: 800, color: ACCENT, margin: 0 }}>
                  Live Floor Earnings
                </p>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: ACCENT,
                    animation: 'pulse-dot 1.5s ease-in-out infinite',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)', margin: 0 }}>
                Updating in real time from POS
              </p>
            </div>
          </div>

          {/* Live total — animated counter */}
          <div
            style={{
              textAlign: 'center',
              padding: '20px 0',
              marginBottom: 16,
              borderBottom: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <p style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--register-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
              Earned Right Now
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: ACCENT, margin: 0, fontFamily: 'monospace' }}>
              {fmtCurrency(liveEarnings)}
            </p>
          </div>

          {/* Delta from Varicent */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginBottom: 16,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                vs Varicent
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', margin: 0, color: liveEarnings < VARICENT_PROJECTED.total ? '#F59E0B' : ACCENT }}>
                {liveEarnings < VARICENT_PROJECTED.total ? '-' : '+'}
                {fmtCurrency(Math.abs(liveEarnings - VARICENT_PROJECTED.total))}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Today&apos;s Sales
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', margin: 0, color: 'var(--register-text)' }}>
                5
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.6rem', color: 'var(--register-text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Eff. Rate
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', margin: 0, color: '#06B6D4' }}>
                4.8%
              </p>
            </div>
          </div>

          {/* "Varicent only knows what happened at month-end" callout */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(16,185,129,0.1)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ACCENT, fontStyle: 'italic' }}>
              Varicent only knows what happened at month-end. You see it NOW.
            </span>
          </div>
        </div>
      </div>

      {/* ── Tier Progress Ring ───────────────────────────────── */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--register-text)', margin: '0 0 16px' }}>
          Tier Progress
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Ring */}
          <TierRing progress={tierProgress} animatedProgress={ringProgress} />

          {/* Info panel */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: `${currentTier.color}20`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Award size={14} color={currentTier.color} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)' }}>
                  {currentTier.tier} Tier
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>
                {(currentTier.rate * 100).toFixed(1)}% rate
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--register-text)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Casey is <strong style={{ fontFamily: 'monospace' }}>${amountToNext.toLocaleString()}</strong> away from{' '}
              <strong style={{ color: nextTier?.color ?? ACCENT }}>{nextTier?.tier ?? 'Max'}</strong> tier at{' '}
              <strong>{nextTier ? (nextTier.rate * 100).toFixed(1) : '--'}%</strong>.
            </p>

            {/* Next sale unlock callout */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(6, 182, 212, 0.08)',
                borderLeft: '3px solid #06B6D4',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} color="#06B6D4" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Next Tier Unlock
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--register-text)', margin: 0 }}>
                One sale of <strong style={{ color: '#06B6D4' }}>$2,800+</strong> unlocks{' '}
                <strong>{nextTier?.tier}</strong> tier —{' '}
                <strong style={{ color: ACCENT }}>+$1,200</strong> in accelerator bonus.
              </p>
            </div>

            {/* Revenue bar */}
            <div style={{ marginTop: 16 }}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>
                  ${caseyRevenue.toLocaleString()} MTD
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>
                  ${nextTier?.minRevenue.toLocaleString() ?? '--'} target
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(tierProgress, 100)}%`,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${currentTier.color}, ${ACCENT})`,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Sale Impact List ──────────────────────────── */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
            Recent Sale Impact
          </h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>
            Today, March 13
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Header */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: '60px 1fr 90px 90px 1fr',
              padding: '8px 12px',
              borderBottom: '2px solid var(--register-border)',
            }}
          >
            {['Time', 'Item', 'Sale', 'Commission', 'Components'].map((h) => (
              <span key={h} style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {RECENT_SALES.map((sale, i) => (
            <div
              key={sale.time}
              className="grid gap-3"
              style={{
                gridTemplateColumns: '60px 1fr 90px 90px 1fr',
                padding: '10px 12px',
                borderBottom: i < RECENT_SALES.length - 1 ? '1px solid var(--register-border)' : 'none',
                background: i === 0 ? 'rgba(16,185,129,0.04)' : 'transparent',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--register-text-muted)' }}>
                {sale.time}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--register-text)', fontWeight: 500 }}>
                {sale.item}
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--register-text)' }}>
                ${sale.amount.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: ACCENT }}>
                +${sale.commission.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)' }}>
                {sale.components}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Insight ───────────────────────────────────────── */}
      <AIInsightCard label="AI Pace Forecast">
        At current pace, Casey reaches <strong style={{ color: nextTier?.color ?? ACCENT }}>{nextTier?.tier ?? 'max'}</strong> tier
        by <strong>March 22</strong>. One additional <strong style={{ color: '#06B6D4' }}>$3K+ sale</strong> this
        week would accelerate by <strong>4 days</strong> — unlocking the higher rate on all remaining March revenue.
      </AIInsightCard>
    </RegisterPage>
  );
}
