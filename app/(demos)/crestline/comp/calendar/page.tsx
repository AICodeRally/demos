'use client';

import { StatCard } from '@/components/demos/crestline';
import { RETAIL_CALENDAR_454, PAYROLL_CALENDAR, COMMISSION_COMPONENTS, COLORS } from '@/data/crestline';

const CALENDAR_MAP: { component: string; calendar: string; note: string }[] = [
  { component: 'Basic Commission', calendar: 'Semi-Monthly Payroll', note: 'Calculated per payroll period (PP1-PP24)' },
  { component: 'Premium Commission', calendar: 'Semi-Monthly Payroll', note: 'Achiever additive rate on payroll cycle' },
  { component: 'Counter Lead Bonus', calendar: '4-5-4 Retail', note: 'Uses retail periods — 5-week periods get full bonus calc' },
  { component: 'Achiever Scorecard', calendar: 'Semi-Monthly Payroll', note: 'Percentile ranking within payroll period' },
  { component: 'Negative Balance Carry-Forward', calendar: 'Semi-Monthly Payroll', note: 'Offsets accumulate across payroll periods' },
];

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DualCalendar() {
  // Build a combined timeline for overlap visualization (first 6 months)
  const timelineStart = new Date('2026-02-01T00:00:00');
  const timelineEnd = new Date('2026-05-01T00:00:00');
  const totalDays = Math.round((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));

  function dayOffset(iso: string) {
    const d = new Date(iso + 'T00:00:00');
    return Math.round((d.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
  }

  function pctLeft(iso: string) {
    return Math.max(0, (dayOffset(iso) / totalDays) * 100);
  }

  function pctWidth(start: string, end: string) {
    const s = Math.max(0, dayOffset(start));
    const e = Math.min(totalDays, dayOffset(end));
    return Math.max(1, ((e - s) / totalDays) * 100);
  }

  const visibleRetail = RETAIL_CALENDAR_454.filter(p => {
    const s = dayOffset(p.start);
    const e = dayOffset(p.end);
    return e > 0 && s < totalDays;
  });

  const visiblePayroll = PAYROLL_CALENDAR.filter(p => {
    const s = dayOffset(p.start);
    const e = dayOffset(p.end);
    return e > 0 && s < totalDays;
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Dual Calendar</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Semi-monthly payroll vs. 4-5-4 retail calendar — two timing systems, zero conflicts
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Payroll Periods / Year" value="24" color={COLORS.standard} />
        <StatCard label="Retail Periods / Year" value="12" color={COLORS.flagship} />
        <StatCard label="5-Week Periods" value="4" color={COLORS.counter} />
        <StatCard label="Calendar Conflicts Resolved" value="48" trend="up" trendValue="100%" color="#059669" />
      </div>

      {/* Side-by-side calendars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Payroll calendar */}
        <div className="rounded-xl border p-5" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Semi-Monthly Payroll Calendar</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>24 periods per year (PP1-PP24), each ~15 days</p>
          <div className="space-y-2">
            {PAYROLL_CALENDAR.map(p => (
              <div key={p.period} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: 'var(--pl-bg)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums" style={{ color: COLORS.standard, minWidth: 36 }}>{p.period}</span>
                  <span className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{formatDate(p.start)} — {formatDate(p.end)}</span>
                </div>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: '#DBEAFE', color: COLORS.standard }}>
                  Semi-Monthly
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Retail calendar */}
        <div className="rounded-xl border p-5" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>4-5-4 Retail Calendar</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>12 periods per year (P1-P12), alternating 4-5-4 weeks</p>
          <div className="space-y-2">
            {RETAIL_CALENDAR_454.map(p => (
              <div
                key={p.period}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ backgroundColor: p.weeks === 5 ? '#FDF2F8' : 'var(--pl-bg)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums" style={{ color: COLORS.flagship, minWidth: 28 }}>{p.period}</span>
                  <span className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
                    {formatDate(p.start)} — {formatDate(p.end)}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>
                    {p.weeks}w
                  </span>
                </div>
                {p.weeks === 5 ? (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: '#FCE7F3', color: '#DB2777' }}>
                    Counter Lead Bonus
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: 'var(--pl-stripe)', color: 'var(--pl-text-muted)' }}>
                    Standard
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline overlap visualization */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Calendar Overlap — Feb to Apr 2026</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-secondary)' }}>
          Payroll periods and retail periods rarely align — the system handles both simultaneously
        </p>

        {/* Month labels */}
        <div className="relative h-6 mb-2">
          {['Feb', 'Mar', 'Apr'].map((m, i) => (
            <div key={m} className="absolute text-[10px] font-medium" style={{ left: `${(i / 3) * 100}%`, color: 'var(--pl-text-muted)' }}>
              {m}
            </div>
          ))}
        </div>

        {/* Payroll row */}
        <div className="mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.standard }}>Payroll</span>
        </div>
        <div className="relative h-8 mb-4 rounded" style={{ backgroundColor: 'var(--pl-bg)' }}>
          {visiblePayroll.map(p => (
            <div
              key={p.period}
              className="absolute top-1 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
              style={{
                left: `${pctLeft(p.start)}%`,
                width: `${pctWidth(p.start, p.end)}%`,
                backgroundColor: COLORS.standard,
                opacity: 0.85,
              }}
            >
              {p.period}
            </div>
          ))}
        </div>

        {/* Retail row */}
        <div className="mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.flagship }}>Retail 4-5-4</span>
        </div>
        <div className="relative h-8 mb-4 rounded" style={{ backgroundColor: 'var(--pl-bg)' }}>
          {visibleRetail.map(p => (
            <div
              key={p.period}
              className="absolute top-1 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
              style={{
                left: `${pctLeft(p.start)}%`,
                width: `${pctWidth(p.start, p.end)}%`,
                backgroundColor: p.weeks === 5 ? '#DB2777' : COLORS.flagship,
                opacity: 0.85,
              }}
            >
              {p.period} ({p.weeks}w)
            </div>
          ))}
        </div>

        {/* Misalignment indicators */}
        <div className="border-t pt-3 mt-2" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: '#f59e0b' }} />
            <p className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
              Notice how PP3/PP4 (payroll) overlap with P1/P2 (retail) boundaries. Payroll splits on the 15th; retail splits on week boundaries. The system reconciles both for every commission calculation.
            </p>
          </div>
        </div>
      </div>

      {/* Counter Lead Bonus callout */}
      <div className="rounded-xl border-2 p-5 mb-8" style={{ borderColor: '#DB2777', backgroundColor: '#FDF2F8' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#DB2777' }}>
            <span className="text-white text-lg font-bold">!</span>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--pl-text)' }}>Counter Lead Bonus Uses the 4-5-4 Calendar</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--pl-text-secondary)' }}>
              Counter Lead Bonus is calculated on the retail calendar, not the payroll calendar.
              In 5-week periods, reps earn on the full extended period, which does not align with payroll splits.
            </p>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--pl-card)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Example: Period P2 (5 weeks, Mar 1 — Apr 4)</p>
              <p className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
                Counter Lead Bonus is calculated on the full 5-week period — not split across PP3 (Mar 1-15) and PP4 (Mar 16-31).
                The system accumulates sales for the entire retail period, then allocates the bonus to the correct payroll period for payout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt-Style Annual Calendar View */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Annual Calendar — Gantt View</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-secondary)' }}>
          All three calendars overlaid across the fiscal year
        </p>

        {/* Month header */}
        <div className="grid gap-0" style={{ gridTemplateColumns: '140px repeat(12, 1fr)' }}>
          <div className="text-[10px] font-semibold" style={{ color: 'var(--pl-text-muted)' }}>CALENDAR</div>
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
            <div key={m} className="text-[10px] text-center font-medium" style={{ color: 'var(--pl-text-muted)' }}>{m}</div>
          ))}
        </div>

        {/* Semi-Monthly Payroll */}
        <div className="grid gap-0 mt-2" style={{ gridTemplateColumns: '140px repeat(12, 1fr)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#1a1f3d' }} />
            <span className="text-[10px] font-semibold" style={{ color: 'var(--pl-text)' }}>Semi-Monthly</span>
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex gap-0.5 px-0.5">
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: '#1a1f3d', opacity: 0.75 }} />
              <div className="flex-1 h-6 rounded-sm" style={{ backgroundColor: '#1a1f3d', opacity: 0.55 }} />
            </div>
          ))}
        </div>

        {/* 4-5-4 Retail */}
        <div className="grid gap-0 mt-2" style={{ gridTemplateColumns: '140px repeat(12, 1fr)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#c9a84c' }} />
            <span className="text-[10px] font-semibold" style={{ color: 'var(--pl-text)' }}>4-5-4 Retail</span>
          </div>
          {/* 4-5-4 pattern: each quarter = 4wk + 5wk + 4wk ≈ 1mo + 1.25mo + 1mo */}
          {[4,5,4,4,5,4,4,5,4,4,5,4].map((weeks, i) => (
            <div key={i} className="px-0.5">
              <div
                className="h-6 rounded-sm flex items-center justify-center text-[8px] font-bold text-white"
                style={{ backgroundColor: weeks === 5 ? '#b8942e' : '#c9a84c' }}
              >
                {weeks}w
              </div>
            </div>
          ))}
        </div>

        {/* Counter Lead Bonus Windows */}
        <div className="grid gap-0 mt-2" style={{ gridTemplateColumns: '140px repeat(12, 1fr)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#059669' }} />
            <span className="text-[10px] font-semibold" style={{ color: 'var(--pl-text)' }}>Counter Lead</span>
          </div>
          {/* CLB windows align with the 5-week retail periods: ~Mar, Jun, Sep, Dec */}
          {Array.from({ length: 12 }).map((_, i) => {
            const isWindow = [2, 5, 8, 11].includes(i); // Mar, Jun, Sep, Dec
            return (
              <div key={i} className="px-0.5">
                {isWindow ? (
                  <div className="h-6 rounded-sm flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: '#059669' }}>
                    CLB
                  </div>
                ) : (
                  <div className="h-6" />
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t pt-3 mt-4" style={{ borderColor: 'var(--pl-border)' }}>
          <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>
            Counter Lead Bonus calculation windows align with 5-week retail periods.
            Semi-monthly payroll runs on the 1st and 16th regardless of retail period boundaries.
          </p>
        </div>
      </div>

      {/* Commission Stream Comparison Table */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Commission Stream Calendar Comparison</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Each commission stream runs on its own calendar and frequency
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pl-border)' }}>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Component</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Calendar</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Frequency</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Current Period</th>
              </tr>
            </thead>
            <tbody>
              {[
                { comp: 'Basic Commission', cal: 'Semi-Monthly Payroll', freq: '24x / year', period: 'PP5 (Apr 1-15)', calColor: '#1a1f3d' },
                { comp: 'Premium Commission', cal: 'Semi-Monthly Payroll', freq: '24x / year', period: 'PP5 (Apr 1-15)', calColor: '#1a1f3d' },
                { comp: 'Counter Lead Bonus', cal: '4-5-4 Retail', freq: '4x / year (5-wk)', period: 'P2 (Mar 1 - Apr 4)', calColor: '#c9a84c' },
                { comp: 'Achiever Scorecard', cal: 'Semi-Monthly Payroll', freq: '24x / year', period: 'PP5 (Apr 1-15)', calColor: '#1a1f3d' },
                { comp: 'Neg. Balance Carry-Fwd', cal: 'Semi-Monthly Payroll', freq: 'Rolling', period: 'Cumulative', calColor: '#1a1f3d' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                  <td className="py-3 text-xs font-medium" style={{ color: 'var(--pl-text)' }}>{row.comp}</td>
                  <td className="py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: row.calColor }}
                    >
                      {row.cal}
                    </span>
                  </td>
                  <td className="py-3 text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{row.freq}</td>
                  <td className="py-3 text-xs font-medium" style={{ color: 'var(--pl-text)' }}>{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Component-to-Calendar mapping table */}
      <div className="rounded-xl border p-5" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Component Calendar Assignment</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Each commission component is tied to a specific calendar for calculation and payout
        </p>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--pl-border)' }}>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Component</th>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Calendar</th>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {CALENDAR_MAP.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                <td className="py-3 text-xs font-medium" style={{ color: 'var(--pl-text)' }}>{row.component}</td>
                <td className="py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: row.calendar === '4-5-4 Retail' ? '#FCE7F3' : '#DBEAFE',
                      color: row.calendar === '4-5-4 Retail' ? '#DB2777' : COLORS.standard,
                    }}
                  >
                    {row.calendar}
                  </span>
                </td>
                <td className="py-3 text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}
