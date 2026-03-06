'use client';

import { BarChart, DonutChart, AreaChart } from '@/components/demos/register';

/* ── Active SPIFF cards ──────────────────────────────────── */

const ACTIVE_SPIFFS = [
  {
    name: 'Purple Power Week',
    vendor: 'Purple Innovation',
    duration: 'Mar 1\u20137',
    payout: '$50/King sold',
    earned: 32000,
    target: 50000,
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
  {
    name: 'Adjustable Base Blitz',
    vendor: 'Leggett & Platt',
    duration: 'Mar 1\u201314',
    payout: '$75/base sold',
    earned: 18000,
    target: 30000,
    color: '#06B6D4',
    bg: '#CFFAFE',
  },
  {
    name: 'Protection Plan Push',
    vendor: 'Summit Sleep Co.',
    duration: 'Mar 1\u201331',
    payout: '$15/plan sold',
    earned: 4200,
    target: 8000,
    color: '#10B981',
    bg: '#D1FAE5',
  },
];

/* ── Leaderboard ─────────────────────────────────────────── */

const LEADERBOARD = [
  { rank: 1, name: 'Sarah J.', store: 'Flagship #12 \u2014 Plano', spiff: '$4,280', commission: '$8,420', streak: 14 },
  { rank: 2, name: 'Marcus W.', store: 'Flagship #8 \u2014 Frisco', spiff: '$3,650', commission: '$7,180', streak: 9 },
  { rank: 3, name: 'Diana K.', store: 'Flagship #3 \u2014 Dallas', spiff: '$3,120', commission: '$6,840', streak: 7 },
  { rank: 4, name: 'Alex R.', store: 'Standard #42 \u2014 Arlington', spiff: '$2,890', commission: '$5,420', streak: 5 },
  { rank: 5, name: 'Emily R.', store: 'Flagship #12 \u2014 Plano', spiff: '$2,640', commission: '$5,180', streak: 4 },
  { rank: 6, name: 'Chris M.', store: 'Standard #18 \u2014 Irving', spiff: '$2,380', commission: '$4,890', streak: 3 },
  { rank: 7, name: 'James T.', store: 'Flagship #3 \u2014 Dallas', spiff: '$2,120', commission: '$4,620', streak: 2 },
  { rank: 8, name: 'Beth S.', store: 'Standard #7 \u2014 McKinney', spiff: '$1,890', commission: '$4,210', streak: 0 },
  { rank: 9, name: 'Raj P.', store: 'Flagship #8 \u2014 Frisco', spiff: '$1,640', commission: '$3,880', streak: 0 },
  { rank: 10, name: 'Dana L.', store: 'Standard #31 \u2014 Denton', spiff: '$1,420', commission: '$3,640', streak: 0 },
];

const RANK_STYLES: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: '#FEF3C7', text: '#B45309', border: '#F59E0B' },
  2: { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' },
  3: { bg: '#FFF7ED', text: '#C2410C', border: '#F97316' },
};

/* ── SPIFF earnings by store ─────────────────────────────── */

const SPIFF_BY_STORE = [
  { label: 'Flagship #12', value: 8420, color: '#1E3A5F' },
  { label: 'Flagship #8', value: 7180, color: '#1E3A5F' },
  { label: 'Flagship #3', value: 6840, color: '#1E3A5F' },
  { label: 'Standard #42', value: 5420, color: '#06B6D4' },
  { label: 'Flagship #15', value: 5180, color: '#1E3A5F' },
  { label: 'Standard #18', value: 4890, color: '#06B6D4' },
  { label: 'Standard #7', value: 4210, color: '#06B6D4' },
  { label: 'Flagship #1', value: 3880, color: '#1E3A5F' },
  { label: 'Standard #31', value: 3640, color: '#06B6D4' },
  { label: 'Outlet #9', value: 2280, color: '#8B5CF6' },
];

/* ── Participation rate by format ────────────────────────── */

const PARTICIPATION = [
  { label: 'Flagship', value: 92, color: '#1E3A5F' },
  { label: 'Standard', value: 78, color: '#06B6D4' },
  { label: 'Outlet', value: 65, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 45, color: '#10B981' },
];

/* ── Streak trackers ─────────────────────────────────────── */

const STREAKS = [
  { rep: 'Sarah J.', days: 14, store: 'Flagship #12' },
  { rep: 'Marcus W.', days: 9, store: 'Flagship #8' },
  { rep: 'Diana K.', days: 7, store: 'Flagship #3' },
  { rep: 'Alex R.', days: 5, store: 'Standard #42' },
  { rep: 'Emily R.', days: 4, store: 'Flagship #12' },
];

/* ── Badge wall ──────────────────────────────────────────── */

const BADGES = [
  { emoji: '\uD83C\uDFC6', name: 'First $5K Day', earned: 24 },
  { emoji: '\uD83D\uDD1F', name: '10-Sale Week', earned: 18 },
  { emoji: '\uD83D\uDCA1', name: 'Base Attach King', earned: 12 },
  { emoji: '\u2B50', name: 'Perfect CSAT', earned: 31 },
  { emoji: '\u26A1', name: 'SPIFF Slayer', earned: 8 },
  { emoji: '\uD83E\uDD1D', name: 'Mentorship Star', earned: 6 },
  { emoji: '\uD83D\uDD25', name: 'Comeback Kid', earned: 14 },
  { emoji: '\uD83C\uDF19', name: 'Night Owl', earned: 22 },
  { emoji: '\u23F1\uFE0F', name: 'Speed Demon', earned: 9 },
  { emoji: '\uD83C\uDF81', name: 'Bundle Master', earned: 16 },
  { emoji: '\uD83D\uDCB3', name: 'Finance Pro', earned: 11 },
  { emoji: '\uD83C\uDF1F', name: 'Rookie of Month', earned: 4 },
];

/* ── Contest engagement trend ────────────────────────────── */

const ENGAGEMENT_TREND = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: 65 + Math.round((i / 29) * 17 + Math.sin(i * 0.6) * 3),
}));

export default function ContestBoard() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Contest Board</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Active SPIFFs, leaderboards, streaks, and achievement badges across all 200 stores
        </p>
      </div>

      {/* 3 Active SPIFF Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {ACTIVE_SPIFFS.map((spiff) => {
          const pct = Math.round((spiff.earned / spiff.target) * 100);
          return (
            <div
              key={spiff.name}
              className="rounded-xl border p-5"
              style={{ backgroundColor: spiff.bg, borderColor: `${spiff.color}30` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[14px] font-bold" style={{ color: spiff.color }}>
                    {spiff.name}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>
                    {spiff.vendor} &middot; {spiff.duration}
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ backgroundColor: `${spiff.color}20`, color: spiff.color }}
                >
                  {spiff.payout}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span style={{ color: '#475569' }}>${(spiff.earned / 1000).toFixed(0)}K earned</span>
                  <span className="font-mono" style={{ color: spiff.color }}>{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `${spiff.color}20` }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: spiff.color }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-right" style={{ color: '#94A3B8' }}>
                  Target: ${(spiff.target / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          SPIFF Leaderboard &mdash; Top 10 Reps
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider w-16 text-center" style={{ color: '#94A3B8' }}>Rank</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Name</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Store</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>SPIFF $</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Total Comm.</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: '#94A3B8' }}>Streak</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((rep) => {
                const rankStyle = RANK_STYLES[rep.rank];
                return (
                  <tr
                    key={rep.rank}
                    className="border-b last:border-0"
                    style={{ borderColor: '#F1F5F9' }}
                  >
                    <td className="py-2.5 text-center">
                      {rankStyle ? (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold"
                          style={{ backgroundColor: rankStyle.bg, color: rankStyle.text, border: `2px solid ${rankStyle.border}` }}
                        >
                          {rep.rank}
                        </span>
                      ) : (
                        <span className="text-[13px] font-mono" style={{ color: '#94A3B8' }}>{rep.rank}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-[13px] font-semibold" style={{ color: '#0F172A' }}>{rep.name}</td>
                    <td className="py-2.5 text-[12px]" style={{ color: '#475569' }}>{rep.store}</td>
                    <td className="py-2.5 text-[13px] font-bold font-mono text-right" style={{ color: '#8B5CF6' }}>{rep.spiff}</td>
                    <td className="py-2.5 text-[12px] font-mono text-right" style={{ color: '#0F172A' }}>{rep.commission}</td>
                    <td className="py-2.5 text-center">
                      {rep.streak > 0 ? (
                        <span className="text-[12px] font-bold" style={{ color: '#F59E0B' }}>
                          \uD83D\uDD25 {rep.streak}d
                        </span>
                      ) : (
                        <span className="text-[11px]" style={{ color: '#94A3B8' }}>&mdash;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SPIFF by Store + Participation Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            SPIFF Earnings by Store (top 10)
          </p>
          <BarChart data={SPIFF_BY_STORE} unit="" color="#8B5CF6" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            SPIFF Participation by Format
          </p>
          <div className="flex justify-center">
            <DonutChart segments={PARTICIPATION} centerValue="72%" centerLabel="overall" size={200} />
          </div>
        </div>
      </div>

      {/* Streak Trackers + Badge Wall */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Streaks */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Active Streaks (consecutive days hitting target)
          </p>
          <div className="space-y-3">
            {STREAKS.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">\uD83D\uDD25</span>
                  <div>
                    <span className="text-[13px] font-bold" style={{ color: '#0F172A' }}>{s.rep}</span>
                    <span className="text-[11px] ml-2" style={{ color: '#94A3B8' }}>{s.store}</span>
                  </div>
                </div>
                <span
                  className="text-[16px] font-bold font-mono"
                  style={{ color: s.days >= 10 ? '#EF4444' : s.days >= 5 ? '#F59E0B' : '#06B6D4' }}
                >
                  {s.days} days
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Badge Wall */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Achievement Badges
          </p>
          <div className="grid grid-cols-4 gap-3">
            {BADGES.map((badge, i) => (
              <div
                key={i}
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
              >
                <span className="text-2xl block mb-1">{badge.emoji}</span>
                <p className="text-[10px] font-semibold leading-tight mb-1" style={{ color: '#0F172A' }}>
                  {badge.name}
                </p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}
                >
                  {badge.earned} earned
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contest Engagement Trend */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Contest Engagement (30-Day Participation %)
        </p>
        <AreaChart data={ENGAGEMENT_TREND} color="#8B5CF6" showDots={false} />
        <div className="flex justify-center gap-6 mt-2">
          <span className="text-[10px]" style={{ color: '#94A3B8' }}>
            Day 1: 65% participation
          </span>
          <span className="text-[10px] font-bold" style={{ color: '#10B981' }}>
            Current: 82% participation (+17pp)
          </span>
        </div>
      </div>
    </>
  );
}
