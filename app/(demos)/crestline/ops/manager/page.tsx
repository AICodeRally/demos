'use client';

import { StatCard, BarChart, AreaChart, DonutChart } from '@/components/demos/crestline';
import { ASSOCIATES, SELLING_DEPTS, ACHIEVER_TIERS, COLORS, DRAW_CONFIG, SPH_BENCHMARKS, SELLING_EFFICIENCY, LOYALTY_METRICS } from '@/data/crestline';

/* -- Flagship F-001 associates (filtered) --------------- */

const STORE_REPS = ASSOCIATES.filter((a) => a.storeId === 'F-001' || a.storeId === 'F-003' || a.storeId === 'F-002' || a.storeId === 'F-005');

/* -- Rep performance by today's commission -------------- */

const REP_PERFORMANCE = [
  { label: 'Elena V.', value: 6.43, color: '#059669' },
  { label: 'Priya S.', value: 5.82, color: COLORS.primary },
  { label: 'Marcus C.', value: 4.48, color: COLORS.primary },
  { label: 'James P.', value: 3.92, color: COLORS.primary },
  { label: 'Tyler M.', value: 2.88, color: COLORS.primary },
];

/* -- Hourly revenue vs target --------------------------- */

const HOURLY_ACTUAL = [
  { label: '9AM', value: 2.4 }, { label: '10AM', value: 5.8 }, { label: '11AM', value: 9.2 },
  { label: '12PM', value: 7.6 }, { label: '1PM', value: 8.8 }, { label: '2PM', value: 11.4 },
  { label: '3PM', value: 13.2 }, { label: '4PM', value: 10.8 }, { label: '5PM', value: 9.4 },
  { label: '6PM', value: 8.2 }, { label: '7PM', value: 6.8 }, { label: '8PM', value: 4.2 },
];

/* -- Department vs target ------------------------------- */

const DEPT_VS_TARGET = SELLING_DEPTS.map((d) => {
  const targets: Record<string, { actual: number; target: number }> = {
    cosmetics: { actual: 22.6, target: 24.0 },
    designer: { actual: 28.4, target: 26.0 },
    shoes: { actual: 18.2, target: 19.0 },
    accessories: { actual: 16.8, target: 15.5 },
    home: { actual: 12.4, target: 14.0 },
  };
  const data = targets[d.id] ?? { actual: 10, target: 12 };
  return { id: d.id, name: d.name.split('&')[0].trim(), ...data, color: d.color, pct: Math.round((data.actual / data.target) * 100) };
});

/* -- Exception alerts ----------------------------------- */

const EXCEPTIONS = [
  { message: 'POS Terminal #4 offline since 2:15 PM', detail: 'IT ticket #4891 opened. Backup terminal assigned.', color: '#EF4444', bg: '#FEE2E2' },
  { message: 'Designer dept understaffed: 2/4 reps on floor', detail: 'Tyler on break, Sarah call-out. Peak traffic at 3PM.', color: '#F59E0B', bg: '#FEF3C7' },
  { message: 'Achiever tier change: Elena V. hit Platinum today', detail: 'YTD sales crossed 120% of target. Additive rate now 3.5%.', color: '#059669', bg: '#D1FAE5' },
];

/* -- Coaching queue ------------------------------------- */

const COACHING = [
  {
    rep: 'Tyler Morrison',
    area: 'MTD $26K / $28K target',
    benchmark: 'store avg: $48K MTD',
    action: 'Focus on premium Designer items; shadow Elena for 2 sales',
    color: '#EF4444',
  },
  {
    rep: 'Sarah Kim',
    area: 'Conversion 14%',
    benchmark: 'store avg: 18%',
    action: 'Practice engagement greeting; lead with home entertaining bundles',
    color: '#F59E0B',
  },
  {
    rep: 'Chris Nakamura',
    area: 'ASP $148',
    benchmark: 'store avg: $693',
    action: 'Upsell opportunities in Home dept; suggest complementary items',
    color: '#F59E0B',
  },
];

/* -- Team leaderboard ----------------------------------- */

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  platinum: { bg: '#EDE9FE', text: '#7c3aed', border: '#a78bfa' },
  gold: { bg: '#FEF9C3', text: '#92400E', border: '#c9a84c' },
  silver: { bg: '#F1F5F9', text: '#475569', border: '#94a3b8' },
  none: { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' },
};

export default function ManagerConsole() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Manager Console</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Real-time shift management, team performance, and operational exceptions &mdash; Flagship F-001
        </p>
      </div>

      {/* Shift Summary Card */}
      <div className="rounded-xl bg-white border p-5 mb-6" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Today&apos;s Shift</span>
              <p className="text-sm font-bold" style={{ color: '#0F172A' }}>9:00 AM &ndash; 9:00 PM</p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: '#E2E8F0' }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Hours Elapsed</span>
              <p className="text-sm font-bold" style={{ color: '#0F172A' }}>7.5 hrs</p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: '#E2E8F0' }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Reps on Floor</span>
              <p className="text-sm font-bold" style={{ color: '#059669' }}>12 / 14</p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: '#E2E8F0' }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Comm Budget Used</span>
              <p className="text-sm font-bold" style={{ color: '#c9a84c' }}>68%</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Absent</span>
            <p className="text-[12px] font-medium" style={{ color: '#EF4444' }}>Sarah K. (call-out)</p>
          </div>
        </div>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <StatCard label="Today's Revenue" value="$98.4K" color={COLORS.primary} />
          <span className="absolute top-3 right-3 text-[10px] font-mono" style={{ color: '#059669' }}>
            vs $95K target (+$3.4K)
          </span>
        </div>
        <StatCard label="Transactions" value="142" trend="up" trendValue="+12 vs yesterday" color="#2563eb" />
        <StatCard label="Team Avg ASP" value="$693" trend="up" trendValue="+$38" color={COLORS.accent} />
        <StatCard label="Comm Earned Today" value="$5,840" sparkline={[420, 680, 1100, 1820, 2640, 3480, 4320, 5180, 5840]} color="#059669" />
      </div>

      {/* Rep Performance + Hourly Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Rep Commission Today ($K)
          </p>
          <BarChart data={REP_PERFORMANCE} unit="K" />
          <div className="mt-3 pt-2 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>
              Top performer:{' '}
              <span className="font-bold" style={{ color: '#059669' }}>Elena V.</span>{' '}
              &mdash; $6.43K (Platinum Achiever)
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Hourly Revenue ($K)
          </p>
          <AreaChart data={HOURLY_ACTUAL} color={COLORS.primary} />
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono" style={{ color: '#059669' }}>
              Pacing: 103.6% of daily target &mdash; $3.4K ahead
            </span>
          </div>
        </div>
      </div>

      {/* Department Performance vs Target */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Department Performance vs Target ($K)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {DEPT_VS_TARGET.map((dept) => (
            <div
              key={dept.id}
              className="rounded-lg p-4 text-center"
              style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
            >
              <p className="text-[11px] font-semibold mb-2" style={{ color: dept.color }}>{dept.name}</p>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#E2E8F0' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, dept.pct)}%`,
                    backgroundColor: dept.pct >= 100 ? '#059669' : dept.pct >= 90 ? '#c9a84c' : '#EF4444',
                  }}
                />
              </div>
              <p className="text-[13px] font-bold" style={{ color: '#0F172A' }}>${dept.actual}K</p>
              <p className="text-[10px] font-mono" style={{ color: dept.pct >= 100 ? '#059669' : '#EF4444' }}>
                {dept.pct}% of ${dept.target}K
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Team Leaderboard &mdash; Today&apos;s Commission
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider w-12 text-center" style={{ color: '#94A3B8' }}>#</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Associate</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Department</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: '#94A3B8' }}>Tier</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Today Comm</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>MTD Sales</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Elena Vasquez', dept: 'Designer Apparel', tier: 'platinum', todayComm: 6430, mtd: 78000 },
                { name: 'Priya Sharma', dept: 'Accessories', tier: 'platinum', todayComm: 5820, mtd: 82000 },
                { name: 'Marcus Chen', dept: 'Shoes', tier: 'gold', todayComm: 4480, mtd: 62000 },
                { name: 'James Park', dept: 'Accessories', tier: 'gold', todayComm: 3920, mtd: 58000 },
                { name: 'Tyler Morrison', dept: 'Designer Apparel', tier: 'none', todayComm: 2880, mtd: 26000 },
              ].map((rep, i) => {
                const tierStyle = TIER_COLORS[rep.tier];
                return (
                  <tr key={i} className="border-b last:border-0" style={{ borderColor: '#F1F5F9' }}>
                    <td className="py-2.5 text-center text-[13px] font-bold font-mono" style={{ color: i < 3 ? COLORS.accent : '#94A3B8' }}>
                      {i + 1}
                    </td>
                    <td className="py-2.5 text-[13px] font-semibold" style={{ color: '#0F172A' }}>{rep.name}</td>
                    <td className="py-2.5 text-[12px]" style={{ color: '#475569' }}>{rep.dept}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: tierStyle.bg, color: tierStyle.text, border: `1px solid ${tierStyle.border}` }}
                      >
                        {rep.tier === 'none' ? 'N/A' : rep.tier.charAt(0).toUpperCase() + rep.tier.slice(1)}
                      </span>
                    </td>
                    <td className="py-2.5 text-[13px] font-bold font-mono text-right" style={{ color: '#059669' }}>
                      ${rep.todayComm.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-[12px] font-mono text-right" style={{ color: '#475569' }}>
                      ${(rep.mtd / 1000).toFixed(0)}K
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exception Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {EXCEPTIONS.map((ex, i) => (
          <div
            key={i}
            className="rounded-xl border p-4"
            style={{ backgroundColor: ex.bg, borderColor: `${ex.color}30` }}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="shrink-0 w-2 h-2 rounded-full mt-1" style={{ backgroundColor: ex.color }} />
              <p className="text-[12px] font-semibold leading-tight" style={{ color: ex.color }}>
                {ex.message}
              </p>
            </div>
            <p className="text-[11px] ml-4" style={{ color: '#475569' }}>
              {ex.detail}
            </p>
          </div>
        ))}
      </div>

      {/* SPH Leaderboard — The Core Metric */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Sales Per Hour (SPH) — Real-Time Leaderboard
            </p>
            <p className="text-[11px]" style={{ color: '#475569' }}>
              The #1 performance metric — drives commission eligibility, schedule quality, and retention
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}
          >
            NET OF RETURNS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider w-12 text-center" style={{ color: '#94A3B8' }}>#</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Associate</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>SPH</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Draw</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: '#94A3B8' }}>Status</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Selling Hrs</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Net Sales</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#94A3B8' }}>Returns</th>
              </tr>
            </thead>
            <tbody>
              {STORE_REPS
                .sort((a, b) => b.sph - a.sph)
                .map((rep, i) => {
                  const drawConfig = DRAW_CONFIG.find(d => d.format === (rep.format.charAt(0).toUpperCase() + rep.format.slice(1)));
                  const threshold = drawConfig?.commissionThresholdSPH ?? 340;
                  const makingCommission = rep.sph >= threshold;
                  const netSales = rep.mtdSales - rep.mtdReturns;
                  return (
                    <tr key={rep.id} className="border-b last:border-0" style={{ borderColor: '#F1F5F9' }}>
                      <td className="py-2.5 text-center text-[13px] font-bold font-mono" style={{ color: i < 3 ? COLORS.accent : '#94A3B8' }}>
                        {i + 1}
                      </td>
                      <td className="py-2.5">
                        <span className="text-[13px] font-semibold" style={{ color: '#0F172A' }}>{rep.name}</span>
                        <span className="ml-2 text-[10px]" style={{ color: '#94A3B8' }}>{rep.department}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="text-[14px] font-bold font-mono" style={{ color: makingCommission ? '#059669' : '#EF4444' }}>
                          ${rep.sph}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-[12px] font-mono" style={{ color: '#94A3B8' }}>
                        ${rep.hourlyDraw}/hr
                      </td>
                      <td className="py-2.5 text-center">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: makingCommission ? '#D1FAE5' : '#FEE2E2',
                            color: makingCommission ? '#059669' : '#EF4444',
                          }}
                        >
                          {makingCommission ? 'COMMISSION' : 'ON DRAW'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-[12px] font-mono" style={{ color: '#475569' }}>
                        {rep.sellingHours}h / {rep.scheduledHours}h
                      </td>
                      <td className="py-2.5 text-right text-[12px] font-bold font-mono" style={{ color: '#0F172A' }}>
                        ${(netSales / 1000).toFixed(0)}K
                      </td>
                      <td className="py-2.5 text-right text-[12px] font-mono" style={{ color: '#EF4444' }}>
                        -${(rep.mtdReturns / 1000).toFixed(1)}K
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-3 border-t text-[10px]" style={{ borderColor: '#F1F5F9', color: '#94A3B8' }}>
          SPH = (MTD Net Sales) &divide; (Selling Hours). Net Sales = Gross Sales &minus; Returns.
          Associates earning below draw threshold receive hourly rate as floor.
        </div>
      </div>

      {/* Selling-Time Efficiency + Credit Card Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>
            Selling-Time Efficiency
          </p>
          <p className="text-[11px] mb-4" style={{ color: '#475569' }}>
            SPH is sensitive to selling hours — time on the floor directly impacts earnings
          </p>
          <div className="space-y-3">
            {SELLING_EFFICIENCY.byFormat.map((f) => (
              <div key={f.format} className="flex items-center gap-3">
                <span className="text-[11px] font-medium w-20" style={{ color: '#0F172A' }}>{f.format}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden flex" style={{ backgroundColor: '#F1F5F9' }}>
                  <div
                    className="h-full rounded-l-full flex items-center justify-end pr-1"
                    style={{ width: `${f.sellingPct * 100}%`, backgroundColor: '#059669' }}
                  >
                    <span className="text-[9px] font-bold text-white">{Math.round(f.sellingPct * 100)}%</span>
                  </div>
                  <div
                    className="h-full rounded-r-full flex items-center justify-start pl-1"
                    style={{ width: `${f.nonSellingPct * 100}%`, backgroundColor: '#CBD5E1' }}
                  >
                    <span className="text-[9px] font-bold" style={{ color: '#475569' }}>{Math.round(f.nonSellingPct * 100)}%</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono w-16 text-right" style={{ color: '#475569' }}>
                  ${f.avgSph} SPH
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#059669' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Selling</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#CBD5E1' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Non-Selling</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>
            Credit Card & Loyalty Tracking
          </p>
          <p className="text-[11px] mb-4" style={{ color: '#475569' }}>
            Secondary metric — influences coaching, perception, and schedule preference
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: '#94A3B8' }}>MTD Sign-ups</span>
              <p className="text-xl font-bold" style={{ color: COLORS.primary }}>{LOYALTY_METRICS.mtdSignups}</p>
              <p className="text-[10px] font-mono" style={{ color: LOYALTY_METRICS.mtdSignups >= LOYALTY_METRICS.targetSignups ? '#059669' : '#c9a84c' }}>
                {Math.round((LOYALTY_METRICS.mtdSignups / LOYALTY_METRICS.targetSignups) * 100)}% of {LOYALTY_METRICS.targetSignups} target
              </p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: '#94A3B8' }}>Loyalty Lift</span>
              <p className="text-xl font-bold" style={{ color: '#059669' }}>+74%</p>
              <p className="text-[10px] font-mono" style={{ color: '#475569' }}>
                ${LOYALTY_METRICS.avgSpendLoyalty} vs ${LOYALTY_METRICS.avgSpendNonLoyalty} avg
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {LOYALTY_METRICS.topPerformers.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono w-5 text-center" style={{ color: i < 3 ? COLORS.accent : '#94A3B8' }}>#{i + 1}</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>{p.name}</span>
                </div>
                <span className="font-bold font-mono" style={{ color: COLORS.primary }}>{p.signups} sign-ups</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coaching Queue */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Coaching Queue
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COACHING.map((coach, i) => (
            <div
              key={i}
              className="rounded-lg border-l-4 p-4"
              style={{ borderLeftColor: coach.color, backgroundColor: '#F8FAFC' }}
            >
              <p className="text-[13px] font-bold mb-1" style={{ color: '#0F172A' }}>
                {coach.rep}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono" style={{ color: coach.color }}>
                  {coach.area}
                </span>
                <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                  ({coach.benchmark})
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[10px] font-medium shrink-0 mt-px" style={{ color: '#10B981' }}>Action:</span>
                <p className="text-[11px]" style={{ color: '#475569' }}>
                  {coach.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
