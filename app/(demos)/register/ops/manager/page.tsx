'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ChevronRight,
  Tablet,
  Send,
  Megaphone,
  Sparkles,
  Radio,
  Users,
  TrendingUp,
  Target,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Layers,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import {
  REPS,
  COACHING_CARDS,
  getRepStatus,
  type CoachingPriority,
} from '@/data/register/coaching-data';
import { ORG_HIERARCHY, COMP_TIERS } from '@/data/register/comp-data';
import {
  broadcastCoaching,
  broadcastAlert,
  onRegisterBroadcast,
  type BroadcastMessage,
} from '@/lib/register-broadcast';

/* ═══════════════════════════════════════════════════════════════
   TYPES + STATIC CONFIG
   ═══════════════════════════════════════════════════════════════ */

type CoachUrgency = 'urgent' | 'watch' | 'healthy';

interface ManagerRep {
  orgId: string;             // rep-casey
  coachingId: string;        // casey  (short id used by /coaching/[id])
  name: string;
  role: string;
  avatar: string;
  revenueMTD: number;
  quotaMTD: number;
  commissionMTD: number;
  tier: (typeof COMP_TIERS)[number];
  tierProgressPct: number;   // pct of the way to the NEXT tier
  nextTierName: string | null;
  nextTierGap: number;
  urgency: CoachUrgency;
  coachingFocus: string;
  lastCoachedAt: string;
  hasScenario: boolean;
  attachRate: number;
  attachDelta: number;       // vs floor avg
  todayRevenue: number;
  todayTarget: number;
  sparkline: number[];
}

const URGENCY_CONFIG: Record<CoachUrgency, { color: string; bg: string; label: string; border: string }> = {
  urgent:  { color: '#EF4444', bg: 'rgba(239,68,68,0.10)',  label: 'COACH NOW',  border: '#EF4444' },
  watch:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', label: 'WATCH',      border: '#F59E0B' },
  healthy: { color: '#10B981', bg: 'rgba(16,185,129,0.10)', label: 'ON TRACK',   border: '#10B981' },
};

const PRIORITY_CONFIG: Record<CoachingPriority, { color: string; label: string }> = {
  urgent: { color: '#EF4444', label: 'URGENT' },
  high:   { color: '#F59E0B', label: 'HIGH' },
  medium: { color: '#3B82F6', label: 'MED' },
  low:    { color: '#10B981', label: 'LOW' },
};

/* Mini daily-revenue sparkline values — deterministic, no random flicker */
const SPARKLINES: Record<string, number[]> = {
  casey:  [380, 620, 410, 520, 480, 610, 720],
  raj:    [540, 680, 720, 650, 740, 820, 760],
  james:  [420, 510, 580, 540, 620, 680, 720],
  sarah:  [720, 810, 780, 860, 920, 880, 940],
  mike:   [480, 560, 620, 580, 640, 700, 740],
  anna:   [410, 490, 520, 540, 580, 610, 620],
};

/* Coaching-impact charts (static demo data) */
const RESPONSE_TIME_DATA = [
  { rep: 'Sarah',  mins: 2.8 },
  { rep: 'Raj',    mins: 4.2 },
  { rep: 'Mike',   mins: 3.6 },
  { rep: 'Casey',  mins: 7.4 },
  { rep: 'James',  mins: 4.8 },
  { rep: 'Anna',   mins: 5.1 },
];

const ATTACH_TREND_DATA = [
  { week: 'W1', before: 24, after: 24 },
  { week: 'W2', before: 26, after: 28 },
  { week: 'W3', before: 25, after: 31 },
  { week: 'W4', before: 27, after: 34 },
  { week: 'W5', before: 28, after: 37 },
  { week: 'W6', before: 27, after: 39 },
];

const COACHING_MIX_DATA = [
  { name: 'Attach push',      value: 34 },
  { name: 'Tier push',        value: 22 },
  { name: 'Financing script', value: 18 },
  { name: 'Cross-sell',       value: 14 },
  { name: 'Objection reset',  value: 12 },
];

/* Playbooks */
const PLAYBOOKS = [
  {
    id: 'tier-push',
    title: 'Tier push',
    description: 'Motivate reps within $2K of a tier break with a 4-hour challenge and live leaderboard.',
    expectedLift: '+$1.1K avg commission per pushed rep',
    icon: TrendingUp,
    accent: 'var(--register-chart-1)',
  },
  {
    id: 'attach-accel',
    title: 'Attach accelerator',
    description: 'Pair every mattress demo with adjustable base + protector. Shadow a top closer.',
    expectedLift: '+7 pts attach rate in 14 days',
    icon: Layers,
    accent: 'var(--register-chart-2)',
  },
  {
    id: 'objection-reset',
    title: 'Objection reset',
    description: 'Reframe price objections as monthly financing — lead with $/mo framing.',
    expectedLift: '+12% close on $2.5K+ tickets',
    icon: BookOpen,
    accent: 'var(--register-chart-3)',
  },
  {
    id: 'cross-sell',
    title: 'Cross-sell bridge',
    description: 'Anchor budget shoppers on mid-tier via side-by-side feel demo.',
    expectedLift: '+$340 avg ticket uplift',
    icon: ArrowUpRight,
    accent: 'var(--register-chart-4)',
  },
];

/* ═══════════════════════════════════════════════════════════════
   DERIVED DATA — build the 6-rep roster from ORG_HIERARCHY
   ═══════════════════════════════════════════════════════════════ */

const ORG_ID_TO_COACHING_ID: Record<string, string> = {
  'rep-sarah': 'sarah',
  'rep-raj':   'raj',
  'rep-mike':  'mike',
  'rep-casey': 'casey',
  'rep-james': 'james',
  'rep-anna':  'anna',
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function computeTier(revenueMTD: number) {
  const current = COMP_TIERS.find((t) => revenueMTD >= t.minRevenue && revenueMTD <= t.maxRevenue) ?? COMP_TIERS[0];
  const idx = COMP_TIERS.indexOf(current);
  const nextTier = COMP_TIERS[idx + 1] ?? null;
  if (!nextTier) {
    return { current, nextTierName: null as string | null, nextTierGap: 0, progressPct: 100 };
  }
  const gap = Math.max(0, nextTier.minRevenue - revenueMTD);
  const span = nextTier.minRevenue - current.minRevenue;
  const progressPct = span > 0 ? Math.min(100, Math.round(((revenueMTD - current.minRevenue) / span) * 100)) : 0;
  return { current, nextTierName: nextTier.tier, nextTierGap: gap, progressPct };
}

/* Coaching focus copy. Reps with a scenario get the rich AI-generated focus.
   Healthy reps get a positive "no coaching needed" narrative. */
const COACHING_FOCUS: Record<string, { focus: string; urgency: CoachUrgency; lastCoached: string }> = {
  casey: { focus: 'Low attach rate — 4 consecutive mattress-only sales',  urgency: 'urgent',  lastCoached: '2h ago' },
  raj:   { focus: 'Financing pitch dropping — $7.2K price-objection loss', urgency: 'urgent',  lastCoached: 'Yesterday' },
  james: { focus: 'ASP below floor avg — step-up demo missing',           urgency: 'watch',   lastCoached: 'Yesterday' },
  sarah: { focus: 'Three-day winning streak — ready for recognition',     urgency: 'healthy', lastCoached: '3d ago' },
  mike:  { focus: 'Quota gap closing — within $5.3K of target',           urgency: 'watch',   lastCoached: '4d ago' },
  anna:  { focus: 'Consistent performer — hold the line',                  urgency: 'healthy', lastCoached: '5d ago' },
};

function buildManagerReps(): ManagerRep[] {
  const roster = ORG_HIERARCHY.filter((n) => n.parentId === 'mgr-galleria');
  return roster.map((node) => {
    const coachingId = ORG_ID_TO_COACHING_ID[node.id] ?? node.id.replace(/^rep-/, '');
    const tierCalc = computeTier(node.revenueMTD);
    const focus = COACHING_FOCUS[coachingId] ?? COACHING_FOCUS.anna;
    const fromCoaching = REPS.find((r) => r.id === coachingId);
    const attachRate = fromCoaching?.metrics.attachRate ?? 30;
    const floorAvg = fromCoaching?.metrics.floorAvgAttach ?? 31;
    // Synthesize "today" numbers off MTD for the progress bar
    const todayRevenue = Math.round(node.revenueMTD / 18); // ~18 shift days in MTD
    const todayTarget = Math.round(node.quotaMTD / 20);
    return {
      orgId: node.id,
      coachingId,
      name: node.name,
      role: node.role === 'rep' ? 'Floor Associate' : node.role,
      avatar: initialsOf(node.name),
      revenueMTD: node.revenueMTD,
      quotaMTD: node.quotaMTD,
      commissionMTD: node.commissionMTD,
      tier: tierCalc.current,
      tierProgressPct: tierCalc.progressPct,
      nextTierName: tierCalc.nextTierName,
      nextTierGap: tierCalc.nextTierGap,
      urgency: focus.urgency,
      coachingFocus: focus.focus,
      lastCoachedAt: focus.lastCoached,
      hasScenario: !!fromCoaching,
      attachRate,
      attachDelta: attachRate - floorAvg,
      todayRevenue,
      todayTarget,
      sparkline: SPARKLINES[coachingId] ?? SPARKLINES.anna,
    };
  });
}

/* ═══════════════════════════════════════════════════════════════
   UTIL
   ═══════════════════════════════════════════════════════════════ */

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const w = 72;
  const h = 22;
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const points = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / Math.max(max - min, 1)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REP COACHING CARD
   ═══════════════════════════════════════════════════════════════ */

function RepCoachingCard({
  rep,
  onCoach,
  pushed,
  staggerIndex,
}: {
  rep: ManagerRep;
  onCoach: (rep: ManagerRep) => void;
  pushed: boolean;
  staggerIndex: number;
}) {
  const router = useRouter();
  const cfg = URGENCY_CONFIG[rep.urgency];
  const todayPct = Math.min(100, Math.round((rep.todayRevenue / Math.max(rep.todayTarget, 1)) * 100));
  const staggerClass = `reg-stagger-${Math.min(staggerIndex + 1, 6)}`;
  const clickable = rep.hasScenario;

  const handleCardClick = () => {
    if (clickable) router.push(`/register/ops/manager/coaching/${rep.coachingId}`);
  };

  return (
    <div
      className={`register-card register-card-hover reg-fade-up ${staggerClass}`}
      onClick={handleCardClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : -1}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      style={{
        position: 'relative',
        padding: 16,
        paddingLeft: 20,
        borderLeft: `4px solid ${cfg.border}`,
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      {/* Top row: avatar + name + urgency chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF',
            background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}AA)`,
            flexShrink: 0,
          }}
        >
          {rep.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
            {rep.name}
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
            {rep.role}
          </p>
        </div>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 999,
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.color}40`,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Today's revenue vs target */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>Today</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
            ${rep.todayRevenue.toLocaleString()}
            <span style={{ color: 'var(--register-text-dim)', fontWeight: 500 }}>
              {' / '}${rep.todayTarget.toLocaleString()}
            </span>
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--register-border)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%', width: `${todayPct}%`,
              background: cfg.color,
              borderRadius: 3,
              transition: 'width 400ms ease',
            }}
          />
        </div>
      </div>

      {/* Tier chip + progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            fontSize: '0.78rem', fontWeight: 700,
            background: `${rep.tier.color}22`,
            border: `1px solid ${rep.tier.color}55`,
            color: 'var(--register-text)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 4, background: rep.tier.color }} />
          {rep.tier.tier}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 3 }}>
            <span style={{ color: 'var(--register-text-muted)' }}>
              {rep.nextTierName ? `To ${rep.nextTierName}` : 'Maxed'}
            </span>
            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
              {rep.nextTierName ? formatMoney(rep.nextTierGap) : '—'}
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--register-border)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${rep.tierProgressPct}%`,
                background: rep.tier.color,
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* What to coach */}
      <div
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: 10, borderRadius: 10,
          background: cfg.bg,
          border: `1px solid ${cfg.color}33`,
          marginBottom: 12,
        }}
      >
        <Sparkles size={14} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="register-meta-label" style={{ margin: 0, color: cfg.color, fontSize: '0.72rem' }}>
            What to coach
          </p>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)', margin: '2px 0 0', lineHeight: 1.35 }}>
            {rep.coachingFocus}
          </p>
        </div>
      </div>

      {/* Footer: last coached + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--register-text-muted)' }}>
          <Clock size={12} /> Last coached {rep.lastCoachedAt}
        </span>
        {clickable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCoach(rep);
            }}
            disabled={pushed}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8, border: 'none',
              fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF',
              background: pushed ? 'var(--register-success)' : 'var(--register-primary)',
              cursor: pushed ? 'default' : 'pointer',
              opacity: pushed ? 0.85 : 1,
            }}
          >
            {pushed ? <CheckCircle2 size={12} /> : <Send size={12} />}
            {pushed ? 'Sent' : 'Coach now'}
            {!pushed && <ChevronRight size={12} />}
          </button>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: 'var(--register-success)' }}>
            <CheckCircle2 size={12} /> No coaching queued
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI COACH WATCH PROMPT
   ═══════════════════════════════════════════════════════════════ */

interface CoachPrompt {
  id: string;
  title: string;
  detail: string;
  accent: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  broadcast: { repId: string; repName: string; message: string; action: string; commissionDelta?: number };
}

const COACH_WATCH_PROMPTS: CoachPrompt[] = [
  {
    id: 'cw-1',
    title: 'Casey is 4 hours from tier-up',
    detail: '$1,180 under Gold. One adjustable-base bundle closes it. Send a push now.',
    accent: '#F59E0B',
    icon: Flame,
    broadcast: {
      repId: 'casey',
      repName: 'Casey Miller',
      message: 'Tier push: $1,180 from Gold',
      action: 'Lead every demo with the adjustable base — 1 bundle closes the tier.',
      commissionDelta: 89,
    },
  },
  {
    id: 'cw-2',
    title: 'Team attach rate dropped 8% this week',
    detail: 'Protector attach fell from 61% → 53%. Run the Attach Accelerator refresher across the floor.',
    accent: '#EF4444',
    icon: AlertTriangle,
    broadcast: {
      repId: 'all',
      repName: 'Floor Team',
      message: 'Attach refresher — protectors dropped 8%',
      action: 'Every mattress demo ends with protector + base trial. Warranty angle first.',
    },
  },
  {
    id: 'cw-3',
    title: 'Mike T. on a 3-day winning streak',
    detail: 'Quota gap down to $5.3K. Public recognition moment — boost the whole floor.',
    accent: '#10B981',
    icon: Sparkles,
    broadcast: {
      repId: 'mike',
      repName: 'Mike Tran',
      message: 'Recognition: 3-day streak',
      action: 'Public shout-out on the team tablet — pace is infectious.',
    },
  },
  {
    id: 'cw-4',
    title: 'Raj needs the financing script',
    detail: '$7.2K in price-objection loss this week. Push the $/mo reframe before next up.',
    accent: '#8B5CF6',
    icon: Target,
    broadcast: {
      repId: 'raj',
      repName: 'Raj Patel',
      message: 'Financing pitch script',
      action: 'Lead with "$69/mo — less than streaming." Pitch financing before the close.',
    },
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function ManagerConsole() {
  const reps = useMemo(() => buildManagerReps(), []);
  const [pushedCoaching, setPushedCoaching] = useState<Set<string>>(new Set());
  const [dismissedPrompts, setDismissedPrompts] = useState<Set<string>>(new Set());
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [liveTime, setLiveTime] = useState('3:14 PM');
  type BroadcastOutcome = 'sent' | 'seen' | 'ack' | 'converted';
  interface BroadcastLogEntry {
    id: string;
    repName: string;
    message: string;
    time: string;
    outcome: BroadcastOutcome;
  }
  const [broadcastLog, setBroadcastLog] = useState<BroadcastLogEntry[]>([
    { id: 'bl-1', repName: 'Sarah Lin',     message: 'Recognition: 3-day streak',       time: '3:08 PM', outcome: 'converted' },
    { id: 'bl-2', repName: 'Raj Patel',     message: 'Financing pitch script',          time: '2:47 PM', outcome: 'ack' },
    { id: 'bl-3', repName: 'Casey Miller',  message: 'Attach accelerator — base demo',  time: '2:15 PM', outcome: 'seen' },
    { id: 'bl-4', repName: 'Floor Team',    message: 'SPIFF active — ErgoMotion base',  time: '1:30 PM', outcome: 'seen' },
    { id: 'bl-5', repName: 'James Wu',      message: 'Step-up demo: mid-tier swap',     time: '12:42 PM', outcome: 'converted' },
    { id: 'bl-6', repName: 'Mike Tran',     message: 'Tier push: $5.3K to Silver',      time: '11:58 AM', outcome: 'ack' },
  ]);

  /* Live time ticker — deterministic look but feels live */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    tick();
    const iv = setInterval(tick, 30_000);
    return () => clearInterval(iv);
  }, []);

  /* Floor broadcast listener — keep parity with old implementation */
  useEffect(() => {
    const unsub = onRegisterBroadcast((_msg: BroadcastMessage) => {
      // no-op here; broadcast log is seeded + updated inline
    });
    return unsub;
  }, []);

  /* ── KPI derivation ─────────────────────────────────────── */

  const kpi = useMemo(() => {
    const revenueMTD = reps.reduce((s, r) => s + r.revenueMTD, 0);
    const quotaMTD = reps.reduce((s, r) => s + r.quotaMTD, 0);
    const attainment = quotaMTD > 0 ? Math.round((revenueMTD / quotaMTD) * 100) : 0;
    const top = [...reps].sort((a, b) => b.revenueMTD - a.revenueMTD)[0];
    const coaching = reps.filter((r) => r.urgency !== 'healthy').length;
    return { revenueMTD, quotaMTD, attainment, top, coaching };
  }, [reps]);

  /* ── Handlers ───────────────────────────────────────────── */

  const handleCoachRep = useCallback((rep: ManagerRep) => {
    const card = COACHING_CARDS.find((c) => c.repId === rep.coachingId);
    broadcastCoaching({
      id: card?.id ?? `coach-${rep.coachingId}-${Date.now()}`,
      repId: rep.coachingId,
      repName: rep.name,
      message: card?.title ?? rep.coachingFocus,
      action: card?.suggestedAction ?? 'Coach in person.',
      commissionDelta:
        card ? parseInt(card.commissionImpact.replace(/[^0-9]/g, '')) || undefined : undefined,
      timestamp: new Date().toISOString(),
    });
    setPushedCoaching((prev) => new Set(prev).add(rep.coachingId));
    setBroadcastLog((prev) => [
      {
        id: `bl-${Date.now()}`,
        repName: rep.name,
        message: card?.title ?? rep.coachingFocus,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        outcome: 'sent' as const,
      },
      ...prev,
    ].slice(0, 6));
  }, []);

  const handleBroadcastPrompt = useCallback((prompt: CoachPrompt) => {
    if (prompt.broadcast.repId === 'all') {
      broadcastAlert({
        id: `alert-${Date.now()}`,
        severity: 'info',
        message: `${prompt.broadcast.message} — ${prompt.broadcast.action}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      broadcastCoaching({
        id: `coach-${prompt.id}-${Date.now()}`,
        repId: prompt.broadcast.repId,
        repName: prompt.broadcast.repName,
        message: prompt.broadcast.message,
        action: prompt.broadcast.action,
        commissionDelta: prompt.broadcast.commissionDelta,
        timestamp: new Date().toISOString(),
      });
    }
    setDismissedPrompts((prev) => new Set(prev).add(prompt.id));
    setBroadcastLog((prev) => [
      {
        id: `bl-${Date.now()}`,
        repName: prompt.broadcast.repName,
        message: prompt.broadcast.message,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        outcome: 'sent' as const,
      },
      ...prev,
    ].slice(0, 6));
  }, []);

  const handleDismissPrompt = useCallback((id: string) => {
    setDismissedPrompts((prev) => new Set(prev).add(id));
  }, []);

  const handleBroadcastAll = useCallback(() => {
    broadcastAlert({
      id: `alert-${Date.now()}`,
      severity: 'info',
      message:
        'New SPIFF active: $25 bonus for every ErgoMotion Adjustable Base sold this month. Demo the zero-gravity position on every up.',
      timestamp: new Date().toISOString(),
    });
    setBroadcastSent(true);
    setBroadcastLog((prev) => [
      {
        id: `bl-${Date.now()}`,
        repName: 'Floor Team',
        message: 'SPIFF active — ErgoMotion base',
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        outcome: 'sent' as const,
      },
      ...prev,
    ].slice(0, 6));
  }, []);

  const chartColors = [
    'var(--register-chart-1)',
    'var(--register-chart-2)',
    'var(--register-chart-3)',
    'var(--register-chart-4)',
    'var(--register-chart-5)',
    'var(--register-chart-6)',
  ];

  const visiblePrompts = COACH_WATCH_PROMPTS.filter((p) => !dismissedPrompts.has(p.id));
  const sortedLeaderboard = [...reps].sort((a, b) => b.revenueMTD - a.revenueMTD);

  /* ═════════════════════════════════════════════════════════ */

  return (
    <RegisterPage title="Manager Console" subtitle="Alex Rivera · Galleria Flagship #12 · Summit Sleep Co" accentColor="#8B5CF6">
      <div style={{ width: '100%' }}>

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — MANAGER HEADER STRIP
            ══════════════════════════════════════════════════════ */}
        <section className="reg-fade-up" style={{ marginBottom: 20 }}>
          <div
            className="register-card"
            style={{
              padding: 20,
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, auto) 1fr auto',
              gap: 20,
              alignItems: 'center',
            }}
          >
            {/* Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 56, height: 56, borderRadius: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF',
                  background: 'linear-gradient(135deg, var(--register-primary), var(--register-accent))',
                  flexShrink: 0,
                }}
              >
                AR
              </div>
              <div>
                <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
                  Alex Rivera
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
                  Store Manager · Galleria Flagship #12
                </p>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.35)',
                    color: 'var(--register-success)',
                    marginTop: 6,
                  }}
                >
                  <span className="reg-live-dot" />
                  LIVE · {liveTime}
                </span>
              </div>
            </div>

            {/* Middle — narrative pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 999,
                  background: 'rgba(139,92,246,0.10)',
                  border: '1px solid rgba(139,92,246,0.30)',
                  color: 'var(--register-text)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <Radio size={14} style={{ color: 'var(--register-primary)' }} />
                Coaching instantly pushes to rep tablets · powered by REGISTER Pulse
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.open('/register/ops/pos-terminal', '_blank')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 10,
                  background: 'var(--register-bg-surface)',
                  border: '1px solid var(--register-border)',
                  color: 'var(--register-text)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Tablet size={14} /> Open Rep Tablet
              </button>
              <button
                onClick={handleBroadcastAll}
                disabled={broadcastSent}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 10, border: 'none',
                  background: broadcastSent ? 'var(--register-success)' : 'var(--register-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem', fontWeight: 700,
                  cursor: broadcastSent ? 'default' : 'pointer',
                  opacity: broadcastSent ? 0.9 : 1,
                  boxShadow: broadcastSent ? 'none' : '0 6px 18px rgba(139,92,246,0.25)',
                }}
              >
                {broadcastSent ? <CheckCircle2 size={14} /> : <Megaphone size={14} />}
                {broadcastSent ? 'Broadcast sent' : 'Broadcast all'}
              </button>
            </div>
          </div>

          {/* KPI tiles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
              marginTop: 14,
            }}
          >
            {[
              {
                label: 'Team Revenue MTD',
                value: formatMoney(kpi.revenueMTD),
                sub: `Quota ${formatMoney(kpi.quotaMTD)}`,
                accent: 'var(--register-chart-1)',
                icon: TrendingUp,
              },
              {
                label: 'Quota Attainment',
                value: `${kpi.attainment}%`,
                sub: kpi.attainment >= 100 ? 'Above plan' : `${100 - kpi.attainment} pts to plan`,
                accent: kpi.attainment >= 95 ? 'var(--register-success)' : 'var(--register-warning)',
                icon: Target,
              },
              {
                label: 'Top performer',
                value: kpi.top?.name.split(' ')[0] ?? '—',
                sub: `${formatMoney(kpi.top?.revenueMTD ?? 0)} MTD · ${kpi.top?.tier.tier ?? '—'}`,
                accent: 'var(--register-chart-3)',
                icon: Flame,
              },
              {
                label: 'Reps needing coaching',
                value: `${kpi.coaching}`,
                sub: `of ${reps.length} on floor`,
                accent: kpi.coaching > 0 ? 'var(--register-danger)' : 'var(--register-success)',
                icon: Users,
              },
            ].map((tile, i) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.label}
                  className={`register-card reg-fade-up reg-stagger-${(i % 4) + 1}`}
                  style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `color-mix(in oklab, ${tile.accent} 18%, transparent)`,
                      color: tile.accent,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="register-meta-label" style={{ margin: 0 }}>{tile.label}</p>
                    <p
                      className="register-kpi-value"
                      style={{
                        fontSize: '1.7rem', fontWeight: 800,
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--register-text)',
                        margin: '2px 0 0',
                        lineHeight: 1.05,
                      }}
                    >
                      {tile.value}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
                      {tile.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — COACHING WORKSTATION (centerpiece)
            ══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 55fr) minmax(0, 45fr)',
              gap: 16,
              alignItems: 'start',
            }}
          >
            {/* LEFT — Coaching Queue */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <p className="register-section-header" style={{ margin: 0 }}>
                    Coaching queue
                  </p>
                  <span
                    style={{
                      display: 'inline-flex', padding: '3px 10px', borderRadius: 999,
                      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
                      background: 'rgba(239,68,68,0.10)',
                      border: '1px solid rgba(239,68,68,0.35)',
                      color: 'var(--register-danger)',
                    }}
                  >
                    {kpi.coaching} NEED ATTENTION
                  </span>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>
                  {reps.length} reps on shift
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: 12,
                }}
              >
                {reps.map((rep, i) => (
                  <RepCoachingCard
                    key={rep.orgId}
                    rep={rep}
                    onCoach={handleCoachRep}
                    pushed={pushedCoaching.has(rep.coachingId)}
                    staggerIndex={i}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT — AI Coach Watch + broadcast log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* AI Coach Watch */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={16} style={{ color: 'var(--register-primary)' }} />
                    <p className="register-section-header" style={{ margin: 0 }}>AI Coach Watch</p>
                    <span
                      style={{
                        display: 'inline-flex', padding: '3px 8px', borderRadius: 999,
                        fontSize: '0.72rem', fontWeight: 700,
                        background: 'rgba(139,92,246,0.12)',
                        color: 'var(--register-primary)',
                      }}
                    >
                      {visiblePrompts.length} pending
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {visiblePrompts.length === 0 && (
                    <div
                      className="register-card"
                      style={{ padding: 16, textAlign: 'center', color: 'var(--register-text-muted)', fontSize: '0.85rem' }}
                    >
                      All AI prompts handled. Nice pace.
                    </div>
                  )}
                  {visiblePrompts.map((prompt, i) => {
                    const Icon = prompt.icon;
                    return (
                      <div
                        key={prompt.id}
                        className={`register-card reg-fade-up reg-stagger-${(i % 4) + 1}`}
                        style={{
                          padding: 14,
                          borderLeft: `3px solid ${prompt.accent}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div
                            style={{
                              width: 32, height: 32, borderRadius: 10,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: `${prompt.accent}22`,
                              color: prompt.accent,
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)', margin: 0, lineHeight: 1.3 }}>
                              {prompt.title}
                            </p>
                            <p style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', margin: '4px 0 10px', lineHeight: 1.4 }}>
                              {prompt.detail}
                            </p>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleBroadcastPrompt(prompt)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 6,
                                  padding: '6px 12px', borderRadius: 8, border: 'none',
                                  fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF',
                                  background: prompt.accent,
                                  cursor: 'pointer',
                                }}
                              >
                                <Send size={11} /> Broadcast
                              </button>
                              <button
                                onClick={() => handleDismissPrompt(prompt.id)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 6,
                                  padding: '6px 12px', borderRadius: 8,
                                  fontSize: '0.78rem', fontWeight: 600,
                                  background: 'transparent',
                                  border: '1px solid var(--register-border)',
                                  color: 'var(--register-text-muted)',
                                  cursor: 'pointer',
                                }}
                              >
                                <X size={11} /> Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Broadcast log */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Radio size={16} style={{ color: 'var(--register-accent)' }} />
                    <p className="register-section-header" style={{ margin: 0 }}>Recent broadcasts</p>
                  </div>
                </div>
                <div className="register-card" style={{ padding: 4 }}>
                  {broadcastLog.map((entry, i) => {
                    const outcomeConfig: Record<typeof entry.outcome, { color: string; label: string }> = {
                      sent:      { color: 'var(--register-text-muted)', label: 'Sent' },
                      seen:      { color: 'var(--register-accent)',     label: 'Seen' },
                      ack:       { color: 'var(--register-primary)',    label: 'Acknowledged' },
                      converted: { color: 'var(--register-success)',    label: 'Converted' },
                    };
                    const oc = outcomeConfig[entry.outcome];
                    return (
                      <div
                        key={entry.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: 10,
                          padding: '10px 12px',
                          borderBottom: i < broadcastLog.length - 1 ? '1px solid var(--register-border)' : 'none',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>
                              {entry.repName}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--register-text-muted)' }}>
                              {entry.time}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {entry.message}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-flex', padding: '3px 9px', borderRadius: 999,
                            fontSize: '0.72rem', fontWeight: 700,
                            background: `color-mix(in oklab, ${oc.color} 15%, transparent)`,
                            color: oc.color,
                            border: `1px solid color-mix(in oklab, ${oc.color} 40%, transparent)`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {oc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 3 — TEAM LEADERBOARD (horizontal rail)
            ══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p className="register-section-header" style={{ margin: 0 }}>Team leaderboard — MTD</p>
            <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>Ranked by revenue</span>
          </div>

          <div
            className="register-card"
            style={{
              padding: 4,
              display: 'grid',
              gridTemplateColumns: `repeat(${sortedLeaderboard.length}, minmax(0, 1fr))`,
              gap: 0,
            }}
          >
            {sortedLeaderboard.map((rep, i) => {
              const color = chartColors[i % chartColors.length];
              const clickable = rep.hasScenario;
              const Content = (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRight: i < sortedLeaderboard.length - 1 ? '1px solid var(--register-border)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    cursor: clickable ? 'pointer' : 'default',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 24, height: 24, borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: color,
                        color: '#FFFFFF',
                        fontSize: '0.78rem', fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--register-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rep.name}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--register-text-muted)', margin: '1px 0 0' }}>
                        {rep.tier.tier}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                      {formatMoney(rep.revenueMTD)}
                    </span>
                    <Sparkline values={rep.sparkline} color={color} />
                  </div>
                </div>
              );
              return clickable ? (
                <Link
                  key={rep.orgId}
                  href={`/register/ops/manager/coaching/${rep.coachingId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {Content}
                </Link>
              ) : (
                <div key={rep.orgId}>{Content}</div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 4 — COACHING IMPACT METRICS (3 charts)
            ══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p className="register-section-header" style={{ margin: 0 }}>Coaching impact — last 30 days</p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 14,
            }}
          >
            {/* Chart 1 — Avg response time bar */}
            <div className="register-card" style={{ padding: 16 }}>
              <div style={{ marginBottom: 10 }}>
                <p className="register-meta-label" style={{ margin: 0 }}>Avg response time to coaching</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--register-text-muted)', margin: '4px 0 0' }}>
                  Minutes from push → first rep action
                </p>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={RESPONSE_TIME_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="rep" />
                    <YAxis unit="m" />
                    <Tooltip cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                    <Bar dataKey="mins" radius={[6, 6, 0, 0]}>
                      {RESPONSE_TIME_DATA.map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2 — Attach rate before vs after */}
            <div className="register-card" style={{ padding: 16 }}>
              <div style={{ marginBottom: 10 }}>
                <p className="register-meta-label" style={{ margin: 0 }}>Attach rate — before vs after coaching</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--register-text-muted)', margin: '4px 0 0' }}>
                  Team average, week over week
                </p>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={ATTACH_TREND_DATA} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="before"
                      name="Before"
                      stroke="var(--register-chart-6)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="after"
                      name="After"
                      stroke="var(--register-chart-1)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3 — Coaching types donut */}
            <div className="register-card" style={{ padding: 16 }}>
              <div style={{ marginBottom: 10 }}>
                <p className="register-meta-label" style={{ margin: 0 }}>Coaching types — distribution</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--register-text-muted)', margin: '4px 0 0' }}>
                  Share of coaching broadcasts, 30 days
                </p>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Tooltip />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '0.82rem' }}
                    />
                    <Pie
                      data={COACHING_MIX_DATA}
                      dataKey="value"
                      nameKey="name"
                      cx="35%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {COACHING_MIX_DATA.map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} stroke="var(--register-bg-elevated)" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTION 5 — PLAYBOOK LIBRARY
            ══════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p className="register-section-header" style={{ margin: 0 }}>Coaching playbooks</p>
            <span style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)' }}>Apply to team in one tap</span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {PLAYBOOKS.map((pb, i) => {
              const Icon = pb.icon;
              return (
                <div
                  key={pb.id}
                  className={`register-card register-card-hover reg-fade-up reg-stagger-${(i % 4) + 1}`}
                  style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `color-mix(in oklab, ${pb.accent} 18%, transparent)`,
                        color: pb.accent,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--register-text)', margin: 0 }}>
                      {pb.title}
                    </p>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)', margin: 0, lineHeight: 1.45, flex: 1 }}>
                    {pb.description}
                  </p>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.82rem', fontWeight: 700,
                      color: pb.accent,
                    }}
                  >
                    <TrendingUp size={13} />
                    {pb.expectedLift}
                  </div>
                  <button
                    onClick={() => {
                      broadcastAlert({
                        id: `pb-${pb.id}-${Date.now()}`,
                        severity: 'info',
                        message: `Playbook active: ${pb.title}. ${pb.description}`,
                        timestamp: new Date().toISOString(),
                      });
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px 12px', borderRadius: 8, border: 'none',
                      fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF',
                      background: pb.accent,
                      cursor: 'pointer',
                    }}
                  >
                    <Send size={12} /> Apply to team
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </RegisterPage>
  );
}
