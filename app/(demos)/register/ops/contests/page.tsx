'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Crown,
  Trophy,
  Flame,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Radio,
  Tv,
  Sparkles,
  Swords,
  Gift,
  Medal,
  Award,
  PartyPopper,
  Star,
} from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { POS_REPS, SAMPLE_PERIODS } from '@/data/register/summit-sleep';
import { ORG_HIERARCHY, TEAM_EARNINGS, SPIFF_CALENDAR } from '@/data/register/comp-data';

/* ══════════════════════════════════════════════════════════
   Contest Board — live sports-broadcast scoreboard
   Summit Sleep · Galleria Flagship #12
   ══════════════════════════════════════════════════════════ */

/* ── Derive Galleria leaderboard from ORG_HIERARCHY ──────── */

type LBRep = {
  id: string;
  name: string;
  initials: string;
  revenueMTD: number;
  quotaMTD: number;
  commissionMTD: number;
  spiffsToday: number;
  unitsToday: number;
  bundleHits: number;
  attachRate: number;
  contestPoints: number;
  trend: number[];
  trendDir: 'up' | 'down' | 'flat';
};

const TREND_SHAPES: Record<string, { trend: number[]; dir: 'up' | 'down' | 'flat' }> = {
  'rep-sarah':  { trend: [62, 70, 74, 80, 88, 94, 100], dir: 'up' },
  'rep-raj':    { trend: [58, 64, 70, 75, 81, 88, 93],  dir: 'up' },
  'rep-mike':   { trend: [70, 72, 68, 66, 64, 60, 58],  dir: 'down' },
  'rep-casey':  { trend: [40, 44, 48, 52, 56, 60, 64],  dir: 'up' },
  'rep-james':  { trend: [55, 56, 54, 55, 56, 55, 54],  dir: 'flat' },
  'rep-anna':   { trend: [62, 60, 57, 55, 52, 50, 48],  dir: 'down' },
};

const SPIFF_PROFILE: Record<string, { spiffs: number; units: number; bundles: number; attach: number }> = {
  'rep-sarah':  { spiffs: 18, units: 11, bundles: 4, attach: 0.52 },
  'rep-raj':    { spiffs: 15, units: 9,  bundles: 3, attach: 0.47 },
  'rep-mike':   { spiffs: 7,  units: 5,  bundles: 1, attach: 0.31 },
  'rep-casey':  { spiffs: 12, units: 7,  bundles: 2, attach: 0.38 },
  'rep-james':  { spiffs: 6,  units: 4,  bundles: 1, attach: 0.28 },
  'rep-anna':   { spiffs: 5,  units: 4,  bundles: 0, attach: 0.24 },
};

const GALLERIA_REPS: LBRep[] = ORG_HIERARCHY
  .filter((n) => n.parentId === 'mgr-galleria')
  .map((node) => {
    const profile = SPIFF_PROFILE[node.id] ?? { spiffs: 0, units: 0, bundles: 0, attach: 0 };
    const trend = TREND_SHAPES[node.id] ?? { trend: [50, 50, 50, 50, 50, 50, 50], dir: 'flat' as const };
    // Contest points = revenue/100 + units*20 + bundles*75 + spiffs*25
    const contestPoints = Math.round(node.revenueMTD / 100 + profile.units * 20 + profile.bundles * 75 + profile.spiffs * 25);
    const initials = node.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    return {
      id: node.id,
      name: node.name,
      initials,
      revenueMTD: node.revenueMTD,
      quotaMTD: node.quotaMTD,
      commissionMTD: node.commissionMTD,
      spiffsToday: profile.spiffs,
      unitsToday: profile.units,
      bundleHits: profile.bundles,
      attachRate: profile.attach,
      contestPoints,
      trend: trend.trend,
      trendDir: trend.dir,
    };
  })
  .sort((a, b) => b.contestPoints - a.contestPoints);

// Cross-check: include SAMPLE_PERIODS data when id overlaps (e.g. rep-sarah, rep-casey)
// Already captured via ORG_HIERARCHY; we note alignment but canonical source = ORG.
void POS_REPS;
void SAMPLE_PERIODS;

/* ── Podium / rank colors ─────────────────────────────────── */

const PODIUM_COLORS = {
  gold:   { text: '#FDE68A', ring: '#F59E0B', fill: 'linear-gradient(180deg, #F59E0B 0%, #B45309 100%)', glow: 'rgba(245, 158, 11, 0.55)' },
  silver: { text: '#F1F5F9', ring: '#CBD5E1', fill: 'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%)', glow: 'rgba(203, 213, 225, 0.45)' },
  bronze: { text: '#FED7AA', ring: '#B45309', fill: 'linear-gradient(180deg, #B45309 0%, #78350F 100%)', glow: 'rgba(180, 83, 9, 0.45)' },
};

/* ── Active SPIFFs (live incentive cards) ────────────────── */

const ACTIVE_SPIFFS = [
  { id: 'sp-adj',    name: 'Adj Base SPIFF',        amount: 25, unit: '/unit',         claimed: 23, since: '9:00 AM', color: 'var(--register-warning)',  icon: Zap },
  { id: 'sp-prot',   name: 'Protector Attach',      amount: 10, unit: '/attach',       claimed: 47, since: '9:00 AM', color: 'var(--register-accent)',   icon: Target },
  { id: 'sp-bundle', name: 'Bundle Hitter',         amount: 75, unit: '/bundle',       claimed: 11, since: '10:00 AM', color: 'var(--register-success)',  icon: Gift },
  { id: 'sp-king',   name: 'King Closer Bounty',    amount: 50, unit: '/king mattress',claimed:  8, since: '9:00 AM', color: 'var(--register-chart-6)',  icon: Crown },
  { id: 'sp-new',    name: 'New Customer Bonus',    amount: 15, unit: '/new buyer',    claimed:  6, since: '9:00 AM', color: 'var(--register-chart-7)',  icon: Sparkles },
  { id: 'sp-fin',    name: 'Financing Push',        amount: 20, unit: '/financed',     claimed: 14, since: '11:00 AM', color: 'var(--register-primary)',  icon: Flame },
];

/* ── Recognition Feed ─────────────────────────────────────── */

type FeedBadge = 'GOLD' | 'BIG DEAL' | 'STREAK' | 'MILESTONE' | 'SPIFF';

const FEED_ITEMS: { initials: string; name: string; action: string; time: string; badge: FeedBadge }[] = [
  { initials: 'SL', name: 'Sarah Lin',    action: 'just hit Gold tier — unlocks 5% rate',          time: '2 min ago',  badge: 'GOLD' },
  { initials: 'RP', name: 'Raj Patel',    action: 'closed $5,147 — biggest ticket of the week',    time: '8 min ago',  badge: 'BIG DEAL' },
  { initials: 'CM', name: 'Casey Miller', action: '3-in-a-row attach hits — earned +$30 streak',   time: '14 min ago', badge: 'STREAK' },
  { initials: 'GT', name: 'Galleria Team',action: 'crossed 80% quota mark — lunch unlocked',       time: '22 min ago', badge: 'MILESTONE' },
  { initials: 'RP', name: 'Raj Patel',    action: 'claimed Adj Base SPIFF — +$25',                 time: '28 min ago', badge: 'SPIFF' },
  { initials: 'SL', name: 'Sarah Lin',    action: 'bundled Sleep System — +$75 bonus',             time: '35 min ago', badge: 'STREAK' },
];

const BADGE_STYLE: Record<FeedBadge, { bg: string; fg: string; border: string }> = {
  GOLD:      { bg: 'rgba(245, 158, 11, 0.18)', fg: '#FDE68A', border: 'rgba(245, 158, 11, 0.55)' },
  'BIG DEAL':{ bg: 'rgba(220, 38, 38, 0.18)',  fg: '#FECACA', border: 'rgba(220, 38, 38, 0.55)' },
  STREAK:    { bg: 'rgba(124, 58, 237, 0.18)', fg: '#DDD6FE', border: 'rgba(124, 58, 237, 0.55)' },
  MILESTONE: { bg: 'rgba(5, 150, 105, 0.18)',  fg: '#A7F3D0', border: 'rgba(5, 150, 105, 0.55)' },
  SPIFF:     { bg: 'rgba(8, 145, 178, 0.18)',  fg: '#BAE6FD', border: 'rgba(8, 145, 178, 0.55)' },
};

/* ── Past winners rail ────────────────────────────────────── */

const PAST_WINNERS = [
  { contest: 'Presidents Day Dash',    winner: 'Sarah Lin',  prize: '$1,500', score: '168 pts',  date: 'Feb 24' },
  { contest: 'Valentine Premium Push', winner: 'Raj Patel',  prize: '$1,200', score: '142 pts',  date: 'Feb 14' },
  { contest: 'Super Bowl Sleep Sprint',winner: 'Sarah Lin',  prize: '$900',   score: '118 pts',  date: 'Feb 09' },
  { contest: 'January Kickoff',        winner: 'Mike Tran',  prize: '$750',   score: '104 pts',  date: 'Jan 31' },
];

/* ── Team vs Team ─────────────────────────────────────────── */

const HEAD_TO_HEAD = {
  us:   { name: 'Galleria #12',   revenue: 268_000, units: 142, attach: 31, color: 'var(--register-success)' },
  them: { name: 'SoMa #08',       revenue: 252_000, units: 138, attach: 34, color: 'var(--register-danger)'  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function currency(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function medalIcon(rank: number) {
  if (rank === 1) return <Crown size={18} color={PODIUM_COLORS.gold.ring} strokeWidth={2.5} />;
  if (rank === 2) return <Medal size={16} color={PODIUM_COLORS.silver.ring} strokeWidth={2.5} />;
  if (rank === 3) return <Award size={16} color={PODIUM_COLORS.bronze.ring} strokeWidth={2.5} />;
  return null;
}

/* ── Sparkline (tiny SVG) ─────────────────────────────────── */

function Sparkline({ points, color, width = 80, height = 24 }: { points: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);
  const step = width / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(points.length - 1) * step} cy={height - ((points[points.length - 1] - min) / range) * height} r={2.5} fill={color} />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════ */

export default function ContestBoard() {
  const insight = getInsight('ops/contests');

  // Countdown — Day 3 of 7, ends Monday 6 PM CT. Use a fixed target for SSR match.
  // Target ≈ 4 days 5h 23m from a deterministic "now".
  const TARGET_SECONDS = 4 * 86400 + 5 * 3600 + 23 * 60;
  const [remaining, setRemaining] = useState<number>(TARGET_SECONDS);
  const [claims, setClaims] = useState<Record<string, number>>(() =>
    Object.fromEntries(ACTIVE_SPIFFS.map((s) => [s.id, s.claimed])),
  );
  const [bumpId, setBumpId] = useState<string | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    // Randomly bump a SPIFF claim every ~5s to feel live
    const bumper = setInterval(() => {
      const pickIdx = Math.floor(Math.random() * ACTIVE_SPIFFS.length);
      const pick = ACTIVE_SPIFFS[pickIdx];
      setClaims((prev) => ({ ...prev, [pick.id]: (prev[pick.id] ?? 0) + 1 }));
      setBumpId(pick.id);
      setTimeout(() => setBumpId(null), 900);
    }, 5000);
    return () => {
      clearInterval(tick);
      clearInterval(bumper);
    };
  }, []);

  const countdownText = useMemo(() => {
    const d = Math.floor(remaining / 86400);
    const h = Math.floor((remaining % 86400) / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    return `${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remaining]);

  const [top1, top2, top3, ...restRanks] = GALLERIA_REPS;
  const thirdPoints = top3?.contestPoints ?? 0;

  // Head-to-head comparison: are we ahead on each metric?
  const h2hRevWin = HEAD_TO_HEAD.us.revenue >= HEAD_TO_HEAD.them.revenue;
  const h2hUnitsWin = HEAD_TO_HEAD.us.units >= HEAD_TO_HEAD.them.units;
  const h2hAttachWin = HEAD_TO_HEAD.us.attach >= HEAD_TO_HEAD.them.attach;
  const revGap = HEAD_TO_HEAD.us.revenue - HEAD_TO_HEAD.them.revenue;

  // Active SPIFF for the hero banner — pull from SPIFF_CALENDAR
  const activeSpiffMonth = SPIFF_CALENDAR.find((s) => s.active);

  /* ── Render ────────────────────────────────────────────── */

  return (
    <RegisterPage
      title="Contest Board"
      subtitle="Galleria Flagship #12 · Contest Floor · Powered by REGISTER Pulse — updates instantly to rep tablets"
      accentColor="var(--register-warning)"
    >
      <div style={{ width: '100%', maxWidth: 'none' }}>

        {/* AI Insight */}
        {insight && (
          <div className="reg-fade-up reg-stagger-1" style={{ marginBottom: 20 }}>
            <AIInsightCard>{insight.text}</AIInsightCard>
          </div>
        )}

        {/* ═════════ SECTION 1 — LIVE NOW hero banner ═════════ */}
        <div
          className="reg-fade-up reg-stagger-1"
          style={{
            position: 'relative',
            borderRadius: 18,
            padding: '28px 32px',
            marginBottom: 28,
            background:
              'linear-gradient(120deg, rgba(220,38,38,0.18) 0%, rgba(245,158,11,0.16) 45%, rgba(124,58,237,0.18) 100%)',
            border: '1px solid rgba(245,158,11,0.45)',
            boxShadow: '0 10px 40px rgba(220, 38, 38, 0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* decorative radial glow */}
          <div
            aria-hidden
            style={{
              position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
            <div style={{ flex: '1 1 420px', minWidth: 300 }}>
              {/* LIVE NOW chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '4px 12px', borderRadius: 999,
                    background: 'rgba(220, 38, 38, 0.25)',
                    border: '1px solid rgba(220, 38, 38, 0.6)',
                    fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.1em',
                    color: '#FECACA',
                    textTransform: 'uppercase',
                  }}
                >
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#EF4444',
                      boxShadow: '0 0 0 0 rgba(239,68,68,0.7)',
                      animation: 'reg-livePulse 1.2s ease-in-out infinite',
                    }}
                  />
                  Live Now
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-muted)', letterSpacing: '0.04em' }}>
                  Day 3 of 7 · Ends Mon 6:00 PM CT
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 1.3rem + 2.2vw, 3rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#FFFFFF', margin: '0 0 8px' }}>
                Spring Mattress Spree
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--register-text-muted)', margin: '0 0 18px', fontWeight: 500 }}>
                {activeSpiffMonth ? `${activeSpiffMonth.name} · ${activeSpiffMonth.bonus} on ${activeSpiffMonth.product}` : 'Store-wide contest — rep tablets live'}
              </p>

              {/* Prize pool + countdown row */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <div
                  style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(245,158,11,0.4)',
                    minWidth: 220,
                  }}
                >
                  <div className="register-meta-label" style={{ color: 'var(--register-text-dim)', marginBottom: 6 }}>
                    Prize Pool
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FDE68A', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
                    $8,400
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 600, marginTop: 2 }}>
                    $3,000 / $2,000 / $1,000 top 3
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                    minWidth: 220,
                  }}
                >
                  <div className="register-meta-label" style={{ color: 'var(--register-text-dim)', marginBottom: 6 }}>
                    Time Remaining
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FECACA', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
                    {countdownText}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 600, marginTop: 2 }}>
                    Counting down, live
                  </div>
                </div>
              </div>
            </div>

            {/* Broadcast button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch', minWidth: 200 }}>
              <button
                type="button"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'center',
                  padding: '14px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.03em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
                  textTransform: 'uppercase',
                }}
              >
                <Tv size={18} strokeWidth={2.5} />
                Broadcast to Tablets
              </button>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--register-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--register-text-muted)', fontWeight: 600 }}>On-air to</div>
                <div style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>18 tablets</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════ SECTION 2 — LEADERBOARD (podium + table) ═════════ */}
        <div
          className="register-section reg-fade-up reg-stagger-2"
          style={{ padding: '28px 28px 24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Trophy size={28} color="var(--register-warning)" strokeWidth={2.2} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--register-text)', margin: 0, letterSpacing: '-0.01em' }}>
                Contest Leaderboard
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={14} color="var(--register-success)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-success)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live · refreshes every 30s
              </span>
            </div>
          </div>

          {/* PODIUM */}
          {top1 && top2 && top3 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1fr',
                gap: 16,
                alignItems: 'end',
                marginBottom: 32,
                padding: '24px 12px 0',
              }}
            >
              {/* Rank 2 (left) */}
              <PodiumColumn rep={top2} rank={2} color={PODIUM_COLORS.silver} gapToNext={top1.contestPoints - top2.contestPoints} heightPx={120} />
              {/* Rank 1 (center, bigger) */}
              <PodiumColumn rep={top1} rank={1} color={PODIUM_COLORS.gold} gapToNext={0} heightPx={160} isLeader />
              {/* Rank 3 (right) */}
              <PodiumColumn rep={top3} rank={3} color={PODIUM_COLORS.bronze} gapToNext={top2.contestPoints - top3.contestPoints} heightPx={90} />
            </div>
          )}

          {/* REST OF LEADERBOARD TABLE */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 800 }}>
              <thead>
                <tr>
                  {[
                    { label: 'Rank', align: 'left', width: 60 },
                    { label: 'Rep', align: 'left' },
                    { label: 'Points', align: 'right' },
                    { label: "Today's Spiffs", align: 'right' },
                    { label: 'Units', align: 'right' },
                    { label: 'Bundles', align: 'right' },
                    { label: 'Attach %', align: 'right' },
                    { label: 'Gap to #3', align: 'right' },
                    { label: 'Trend', align: 'center', width: 110 },
                  ].map((h) => (
                    <th
                      key={h.label}
                      style={{
                        textAlign: h.align as 'left' | 'right' | 'center',
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--register-text-dim)',
                        borderBottom: '2px solid var(--register-border)',
                        width: h.width,
                      }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {restRanks.map((rep, i) => {
                  const absoluteRank = i + 4;
                  const gap = rep.contestPoints - thirdPoints;
                  const gapColor = gap < 0 ? 'var(--register-danger)' : 'var(--register-success)';
                  const trendColor =
                    rep.trendDir === 'up' ? 'var(--register-success)' :
                    rep.trendDir === 'down' ? 'var(--register-danger)' :
                    'var(--register-text-muted)';
                  const TrendIcon = rep.trendDir === 'up' ? TrendingUp : rep.trendDir === 'down' ? TrendingDown : Star;

                  return (
                    <tr
                      key={rep.id}
                      className="register-card-hover"
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'var(--register-bg-surface)',
                      }}
                    >
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'var(--register-bg-surface)',
                            border: '1px solid var(--register-border)',
                            fontSize: '0.95rem', fontWeight: 800,
                            color: 'var(--register-text)',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {absoluteRank}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Avatar initials={rep.initials} color="var(--register-primary)" size={36} />
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>{rep.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', fontWeight: 500 }}>
                              {currency(rep.revenueMTD)} MTD · {currency(rep.commissionMTD)} earned
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontSize: '1.05rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                        {rep.contestPoints.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontSize: '0.95rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-warning)' }}>
                        {rep.spiffsToday}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontSize: '0.95rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                        {rep.unitsToday}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontSize: '0.95rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                        {rep.bundleHits}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontSize: '0.95rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                        {pct(rep.attachRate)}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontSize: '0.95rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: gapColor }}>
                        {gap > 0 ? '+' : ''}{gap.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                          <TrendIcon size={14} color={trendColor} strokeWidth={2.5} />
                          <Sparkline points={rep.trend} color={trendColor} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════════ SECTION 3 — ACTIVE SPIFFS (live cards) ═════════ */}
        <div className="reg-fade-up reg-stagger-3" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={22} color="var(--register-warning)" strokeWidth={2.5} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
                Active SPIFFs &amp; Bounties
              </h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)', fontWeight: 600 }}>
              6 live · claims ticking
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {ACTIVE_SPIFFS.map((spiff) => {
              const Icon = spiff.icon;
              const isBumping = bumpId === spiff.id;
              return (
                <div
                  key={spiff.id}
                  className="register-card register-card-hover"
                  style={{
                    padding: '16px 18px',
                    borderLeft: `3px solid ${spiff.color}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 180ms ease, box-shadow 180ms ease, background 300ms ease',
                    background: isBumping ? `color-mix(in srgb, ${spiff.color} 12%, var(--register-bg-elevated))` : 'var(--register-bg-elevated)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `color-mix(in srgb, ${spiff.color} 18%, transparent)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `1px solid color-mix(in srgb, ${spiff.color} 40%, transparent)`,
                        }}
                      >
                        <Icon size={18} color={spiff.color} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)' }}>{spiff.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', fontWeight: 500 }}>
                          Active since {spiff.since}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: spiff.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                        ${spiff.amount}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 600, marginTop: 2 }}>
                        {spiff.unit}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          fontVariantNumeric: 'tabular-nums',
                          color: 'var(--register-text)',
                          transform: isBumping ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 300ms ease',
                        }}
                      >
                        {claims[spiff.id]}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        claimed today
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═════════ SECTION 4 — TEAM vs TEAM ═════════ */}
        <div
          className="register-section reg-fade-up reg-stagger-4"
          style={{
            background:
              'linear-gradient(100deg, rgba(5, 150, 105, 0.06) 0%, transparent 45%, rgba(220, 38, 38, 0.06) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Swords size={22} color="var(--register-danger)" strokeWidth={2.2} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
              Weekly Head-to-Head
            </h3>
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text-muted)' }}>
              2 days remaining
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <TeamHeader name={HEAD_TO_HEAD.us.name} subtitle="Your team" color="var(--register-success)" align="left" ahead={h2hRevWin && h2hUnitsWin} />
            <div
              style={{
                fontSize: '1.4rem', fontWeight: 900, color: 'var(--register-text-dim)',
                padding: '6px 14px', borderRadius: 999,
                border: '1px solid var(--register-border)',
                background: 'var(--register-bg-surface)',
                letterSpacing: '0.06em',
              }}
            >
              VS
            </div>
            <TeamHeader name={HEAD_TO_HEAD.them.name} subtitle="Pacific District" color="var(--register-danger)" align="right" ahead={!h2hRevWin && !h2hUnitsWin} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <H2HBar label="Revenue"    usValue={HEAD_TO_HEAD.us.revenue} themValue={HEAD_TO_HEAD.them.revenue} format={currency}  winUs={h2hRevWin} />
            <H2HBar label="Units Sold" usValue={HEAD_TO_HEAD.us.units}   themValue={HEAD_TO_HEAD.them.units}   format={(n) => `${n}`} winUs={h2hUnitsWin} />
            <H2HBar label="Attach %"   usValue={HEAD_TO_HEAD.us.attach}  themValue={HEAD_TO_HEAD.them.attach}  format={(n) => `${n}%`} winUs={h2hAttachWin} />
          </div>

          <div
            style={{
              marginTop: 18, padding: '12px 16px', borderRadius: 10,
              background: revGap >= 0 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(220, 38, 38, 0.12)',
              border: `1px solid ${revGap >= 0 ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            {revGap >= 0 ? <TrendingUp size={18} color="var(--register-success)" /> : <TrendingDown size={18} color="var(--register-danger)" />}
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>
              {revGap >= 0
                ? `Leading by ${currency(Math.abs(revGap))} · 2 days left to hold`
                : `Trailing by ${currency(Math.abs(revGap))} · 2 days left to close`}
            </span>
          </div>
        </div>

        {/* ═════════ SECTION 5 — RECOGNITION FEED ═════════ */}
        <div className="register-section reg-fade-up reg-stagger-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <PartyPopper size={22} color="var(--register-chart-6)" strokeWidth={2.2} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
              Recognition Feed
            </h3>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-success)' }}>
              <span className="reg-live-dot" />
              Streaming
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEED_ITEMS.map((item, i) => {
              const badge = BADGE_STYLE[item.badge];
              return (
                <div
                  key={i}
                  className="reg-fade-up"
                  style={{
                    animationDelay: `${0.5 + i * 0.08}s`,
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--register-bg-surface)',
                    border: '1px solid var(--register-border)',
                  }}
                >
                  <Avatar initials={item.initials} color={`var(--register-chart-${(i % 7) + 1})`} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.95rem', color: 'var(--register-text)', fontWeight: 600, lineHeight: 1.3 }}>
                      <span style={{ fontWeight: 800 }}>{item.name}</span> {item.action}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', fontWeight: 500, marginTop: 2 }}>
                      {item.time}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px', borderRadius: 6,
                      fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
                      background: badge.bg, color: badge.fg,
                      border: `1px solid ${badge.border}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═════════ SECTION 6 — PAST WINNERS RAIL ═════════ */}
        <div
          className="register-section reg-fade-up reg-stagger-6"
          style={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Trophy size={20} color="var(--register-text-muted)" strokeWidth={2.2} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
              Recent Contest Champions
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {PAST_WINNERS.map((w) => (
              <div
                key={w.contest}
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Medal size={14} color="var(--register-warning)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--register-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {w.date}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)', lineHeight: 1.25 }}>{w.contest}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--register-text)' }}>{w.winner}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--register-warning)', fontVariantNumeric: 'tabular-nums' }}>{w.prize}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', fontWeight: 500 }}>{w.score}</div>
              </div>
            ))}
          </div>

          {/* Team earnings footer reference */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--register-border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              YTD contest winnings
            </span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {TEAM_EARNINGS.slice(0, 5).map((t, i) => (
                <span key={t.name} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)' }}>
                  <span style={{ color: `var(--register-chart-${(i % 7) + 1})`, fontWeight: 800 }}>{t.name}</span>{' '}
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)' }}>
                    ${t.earnings.toLocaleString()}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RegisterPage>
  );
}

/* ══════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════ */

function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `color-mix(in srgb, ${color} 25%, transparent)`,
        border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 800, color: 'var(--register-text)',
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function PodiumColumn({
  rep, rank, color, gapToNext, heightPx, isLeader,
}: {
  rep: LBRep;
  rank: number;
  color: { text: string; ring: string; fill: string; glow: string };
  gapToNext: number;
  heightPx: number;
  isLeader?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Avatar + name */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {isLeader && (
          <Crown size={28} color={color.ring} strokeWidth={2.5} style={{ marginBottom: -4 }} />
        )}
        <div
          style={{
            position: 'relative',
            width: isLeader ? 86 : 68,
            height: isLeader ? 86 : 68,
            borderRadius: '50%',
            background: `color-mix(in srgb, ${color.ring} 20%, var(--register-bg-surface))`,
            border: `3px solid ${color.ring}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isLeader ? '1.75rem' : '1.4rem',
            fontWeight: 900, color: '#FFFFFF',
            letterSpacing: '0.02em',
            boxShadow: isLeader ? `0 0 0 0 ${color.glow}` : undefined,
            animation: isLeader ? 'reg-livePulse 2.4s ease-in-out infinite' : undefined,
          }}
        >
          {rep.initials}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: isLeader ? '1.05rem' : '0.95rem', fontWeight: 800, color: 'var(--register-text)', lineHeight: 1.2 }}>
            {rep.name}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: color.text, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
            {rep.contestPoints.toLocaleString()} pts
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--register-text-muted)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
            ${rep.commissionMTD.toLocaleString()} earned
          </div>
          {gapToNext > 0 && (
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text-dim)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
              −{gapToNext.toLocaleString()} to next
            </div>
          )}
        </div>
      </div>

      {/* Podium pedestal */}
      <div
        style={{
          width: '100%',
          height: heightPx,
          borderRadius: '10px 10px 4px 4px',
          background: color.fill,
          position: 'relative',
          boxShadow: `0 -4px 20px ${color.glow}, inset 0 2px 0 rgba(255,255,255,0.25)`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: 12,
          border: `1px solid ${color.ring}`,
        }}
      >
        <span
          style={{
            fontSize: isLeader ? '3rem' : '2.25rem',
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {rank}
        </span>
        {medalIcon(rank) && (
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            {medalIcon(rank)}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamHeader({ name, subtitle, color, align, ahead }: { name: string; subtitle: string; color: string; align: 'left' | 'right'; ahead: boolean }) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 12,
            background: `color-mix(in srgb, ${color} 25%, transparent)`,
            border: `2px solid ${color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Trophy size={22} color={color} strokeWidth={2.2} />
        </div>
        <div style={{ textAlign: align }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--register-text)' }}>{name}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>{subtitle}</div>
        </div>
      </div>
      {ahead && (
        <div
          style={{
            marginTop: 6,
            display: 'inline-block',
            padding: '2px 10px', borderRadius: 999,
            background: `color-mix(in srgb, ${color} 18%, transparent)`,
            border: `1px solid ${color}`,
            fontSize: '0.75rem', fontWeight: 800, color,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          Leading
        </div>
      )}
    </div>
  );
}

function H2HBar({ label, usValue, themValue, format, winUs }: { label: string; usValue: number; themValue: number; format: (n: number) => string; winUs: boolean }) {
  const total = Math.max(1, usValue + themValue);
  const usPct = (usValue / total) * 100;
  const themPct = (themValue / total) * 100;
  const usColor = winUs ? 'var(--register-success)' : 'var(--register-text-dim)';
  const themColor = !winUs ? 'var(--register-danger)' : 'var(--register-text-dim)';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: usColor, fontVariantNumeric: 'tabular-nums' }}>
          {format(usValue)}
        </span>
        <span className="register-meta-label" style={{ color: 'var(--register-text-muted)' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: themColor, fontVariantNumeric: 'tabular-nums' }}>
          {format(themValue)}
        </span>
      </div>
      <div
        style={{
          display: 'flex', height: 14, borderRadius: 7, overflow: 'hidden',
          border: '1px solid var(--register-border)',
          background: 'var(--register-bg-surface)',
        }}
      >
        <div
          style={{
            width: `${usPct}%`,
            background: winUs
              ? 'linear-gradient(90deg, #059669 0%, #10B981 100%)'
              : 'linear-gradient(90deg, var(--register-bg-surface) 0%, var(--register-border-strong) 100%)',
            transition: 'width 0.6s ease',
          }}
        />
        <div
          style={{
            width: `${themPct}%`,
            background: !winUs
              ? 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(90deg, #334155 0%, var(--register-bg-surface) 100%)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}
