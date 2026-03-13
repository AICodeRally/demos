'use client';

import { BarChart, DonutChart, AreaChart, HeatMap, RadarChart } from '@/components/demos/crestline';
import { ASSOCIATES, SELLING_DEPTS, ACHIEVER_TIERS, SPIFFS, COLORS } from '@/data/crestline';

/* -- Active SPIFF cards (from data model) --------------- */

const ACTIVE_SPIFFS = SPIFFS.filter((s) => s.active).map((s, i) => {
  const colors = ['#7c3aed', '#c9a84c', '#059669'];
  const bgs = ['#EDE9FE', '#FEF9C3', '#D1FAE5'];
  const earned = [8400, 2200, 3600];
  const target = [12000, 4000, 6000];
  return { ...s, color: colors[i], bg: bgs[i], earned: earned[i], target: target[i] };
});

/* -- Leaderboard ---------------------------------------- */

const LEADERBOARD = [
  { rank: 1, name: 'Elena Vasquez', department: 'Designer Apparel', revenue: 78000, commission: 6430, tier: 'platinum' },
  { rank: 2, name: 'Priya Sharma', department: 'Accessories', revenue: 82000, commission: 5820, tier: 'platinum' },
  { rank: 3, name: 'Marcus Chen', department: 'Shoes', revenue: 62000, commission: 4480, tier: 'gold' },
  { rank: 4, name: 'James Park', department: 'Accessories', revenue: 58000, commission: 3920, tier: 'gold' },
  { rank: 5, name: 'Aisha Thompson', department: 'Cosmetics', revenue: 28000, commission: 2240, tier: 'gold' },
  { rank: 6, name: 'Diana Okafor', department: 'Cosmetics', revenue: 35000, commission: 2100, tier: 'silver' },
  { rank: 7, name: 'Roberto Diaz', department: 'Shoes', revenue: 18000, commission: 1080, tier: 'silver' },
  { rank: 8, name: 'Tyler Morrison', department: 'Designer Apparel', revenue: 26000, commission: 1300, tier: 'none' },
  { rank: 9, name: 'Sarah Kim', department: 'Home', revenue: 24000, commission: 960, tier: 'none' },
  { rank: 10, name: 'Chris Nakamura', department: 'Home', revenue: 12000, commission: 480, tier: 'none' },
];

const RANK_STYLES: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: '#FEF3C7', text: '#B45309', border: '#F59E0B' },
  2: { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' },
  3: { bg: '#FFF7ED', text: '#C2410C', border: '#F97316' },
};

const TIER_BADGE: Record<string, { bg: string; text: string }> = {
  platinum: { bg: '#EDE9FE', text: '#7c3aed' },
  gold: { bg: '#FEF9C3', text: '#92400E' },
  silver: { bg: '#F1F5F9', text: '#475569' },
  none: { bg: '#F8FAFC', text: '#94A3B8' },
};

/* -- Performance radar: top 3 reps ---------------------- */

const RADAR_AXES = [
  { label: 'Revenue', value: 95 },
  { label: 'ASP', value: 88 },
  { label: 'Conversion', value: 82 },
  { label: 'Attach Rate', value: 78 },
  { label: 'CSAT', value: 92 },
];
const TOP3_BENCHMARK = [85, 80, 75, 72, 88];

/* -- HeatMap: rep x metric performance grid ------------- */

const HEAT_REPS = LEADERBOARD.slice(0, 8).map((r) => r.name.split(' ')[0] + ' ' + r.name.split(' ')[1][0] + '.');
const HEAT_METRICS = ['Revenue', 'Commission', 'ASP', 'Conversion', 'Units'];
const HEAT_DATA: number[][] = [
  [95, 92, 88, 82, 78],
  [92, 88, 85, 80, 82],
  [82, 78, 72, 75, 80],
  [78, 74, 80, 68, 72],
  [70, 68, 65, 72, 68],
  [72, 64, 68, 62, 70],
  [58, 52, 55, 58, 62],
  [52, 48, 45, 50, 55],
];

/* -- Revenue by dept for contest ----------------------- */

const CONTEST_DEPT = SELLING_DEPTS.map((d) => ({
  label: d.name.split('&')[0].trim(),
  value: d.id === 'designer' ? 28.4 : d.id === 'cosmetics' ? 21.4 : d.id === 'shoes' ? 18.2 : d.id === 'accessories' ? 16.8 : 12.4,
  color: d.color,
}));

/* -- Engagement trend ----------------------------------- */

const ENGAGEMENT_TREND = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: 55 + Math.round((i / 29) * 22 + Math.sin(i * 0.6) * 4),
}));

/* -- Achiever tier distribution ------------------------- */

const TIER_DIST = [
  { label: 'Platinum', value: 8, color: '#a78bfa' },
  { label: 'Gold', value: 22, color: '#c9a84c' },
  { label: 'Silver', value: 35, color: '#94a3b8' },
  { label: 'Not Qualified', value: 35, color: '#64748b' },
];

export default function ContestsAndBoards() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Contests &amp; Leaderboards</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Active SPIFFs, performance rankings, Achiever tiers, and engagement tracking across 200 stores
        </p>
      </div>

      {/* Current Contest Banner */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: `${COLORS.flagship}10`, border: `1px solid ${COLORS.flagship}30` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[16px] font-bold" style={{ color: COLORS.flagship }}>
              Spring Designer Challenge
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--pl-text-secondary)' }}>
              Top revenue in Designer Apparel wins $2,500 bonus + Platinum fast-track &mdash; Mar 1&ndash;31
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--pl-text-muted)' }}>Leader</span>
            <p className="text-[14px] font-bold" style={{ color: COLORS.flagship }}>Elena Vasquez &mdash; $78K</p>
          </div>
        </div>
      </div>

      {/* 3 Active SPIFF Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <p className="text-[14px] font-bold" style={{ color: spiff.color }}>{spiff.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--pl-text-secondary)' }}>
                    {spiff.trigger}
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ backgroundColor: `${spiff.color}20`, color: spiff.color }}
                >
                  ${spiff.amount}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] mb-1">
                  <span style={{ color: 'var(--pl-text-secondary)' }}>${(spiff.earned / 1000).toFixed(1)}K earned</span>
                  <span className="tabular-nums" style={{ color: spiff.color }}>{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `${spiff.color}20` }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: spiff.color }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--pl-text-muted)' }}>
                  Target: ${(spiff.target / 1000).toFixed(0)}K
                  {spiff.expires ? ` | Expires ${spiff.expires}` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Leaderboard &mdash; Top 10 Associates (MTD)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--pl-border)' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider w-16 text-center" style={{ color: 'var(--pl-text-muted)' }}>Rank</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Name</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Department</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--pl-text-muted)' }}>Revenue</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--pl-text-muted)' }}>Commission</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--pl-text-muted)' }}>Achiever Tier</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((rep) => {
                const rankStyle = RANK_STYLES[rep.rank];
                const tierBadge = TIER_BADGE[rep.tier];
                return (
                  <tr key={rep.rank} className="border-b last:border-0" style={{ borderColor: 'var(--pl-stripe)' }}>
                    <td className="py-2.5 text-center">
                      {rankStyle ? (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold"
                          style={{ backgroundColor: rankStyle.bg, color: rankStyle.text, border: `2px solid ${rankStyle.border}` }}
                        >
                          {rep.rank}
                        </span>
                      ) : (
                        <span className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>{rep.rank}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-[13px] font-semibold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                    <td className="py-2.5 text-[12px]" style={{ color: 'var(--pl-text-secondary)' }}>{rep.department}</td>
                    <td className="py-2.5 text-[13px] font-bold tabular-nums text-right" style={{ color: 'var(--pl-text)' }}>
                      ${(rep.revenue / 1000).toFixed(0)}K
                    </td>
                    <td className="py-2.5 text-[13px] font-bold tabular-nums text-right" style={{ color: '#059669' }}>
                      ${rep.commission.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: tierBadge.bg, color: tierBadge.text }}
                      >
                        {rep.tier === 'none' ? 'N/A' : rep.tier.charAt(0).toUpperCase() + rep.tier.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart + HeatMap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Top Performer Radar (5 Dimensions)
          </p>
          <div className="flex justify-center">
            <RadarChart axes={RADAR_AXES} color={COLORS.flagship} benchmarkData={TOP3_BENCHMARK} size={280} />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: COLORS.flagship }} />
              <span className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>Elena V. (#1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded border-b border-dashed" style={{ borderColor: '#A8A29E' }} />
              <span className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>Top 3 Avg</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Rep Performance Grid (Percentile)
          </p>
          <HeatMap
            rows={HEAT_REPS}
            cols={HEAT_METRICS}
            data={HEAT_DATA}
            colorScale={{ low: '#F5F3FF', mid: '#8B5CF6', high: COLORS.primary }}
          />
        </div>
      </div>

      {/* Achiever Tier Distribution + Contest Dept Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Achiever Tier Distribution
          </p>
          <div className="flex justify-center">
            <DonutChart segments={TIER_DIST} centerValue="200" centerLabel="stores" size={200} />
          </div>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Designer Challenge &mdash; Revenue by Department ($K)
          </p>
          <BarChart data={CONTEST_DEPT} unit="K" />
        </div>
      </div>

      {/* Contest Engagement Trend */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Contest Engagement (30-Day Participation %)
        </p>
        <AreaChart data={ENGAGEMENT_TREND} color={COLORS.flagship} showDots={false} />
        <div className="flex justify-center gap-6 mt-2">
          <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>
            Day 1: 55% participation
          </span>
          <span className="text-[10px] font-bold" style={{ color: '#059669' }}>
            Current: 77% participation (+22pp)
          </span>
        </div>
      </div>
    </>
  );
}
