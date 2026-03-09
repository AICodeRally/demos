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
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Dual Calendar</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
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
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Semi-Monthly Payroll Calendar</h2>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>24 periods per year (PP1-PP24), each ~15 days</p>
          <div className="space-y-2">
            {PAYROLL_CALENDAR.map(p => (
              <div key={p.period} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono" style={{ color: COLORS.standard, minWidth: 36 }}>{p.period}</span>
                  <span className="text-xs" style={{ color: '#475569' }}>{formatDate(p.start)} — {formatDate(p.end)}</span>
                </div>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: '#DBEAFE', color: COLORS.standard }}>
                  Semi-Monthly
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Retail calendar */}
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>4-5-4 Retail Calendar</h2>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>12 periods per year (P1-P12), alternating 4-5-4 weeks</p>
          <div className="space-y-2">
            {RETAIL_CALENDAR_454.map(p => (
              <div
                key={p.period}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ backgroundColor: p.weeks === 5 ? '#FDF2F8' : '#F8FAFC' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono" style={{ color: COLORS.flagship, minWidth: 28 }}>{p.period}</span>
                  <span className="text-xs" style={{ color: '#475569' }}>
                    {formatDate(p.start)} — {formatDate(p.end)}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>
                    {p.weeks}w
                  </span>
                </div>
                {p.weeks === 5 ? (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: '#FCE7F3', color: '#DB2777' }}>
                    Counter Lead Bonus
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                    Standard
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline overlap visualization */}
      <div className="rounded-xl border bg-white p-5 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Calendar Overlap — Feb to Apr 2026</h2>
        <p className="text-xs mb-5" style={{ color: '#475569' }}>
          Payroll periods and retail periods rarely align — the system handles both simultaneously
        </p>

        {/* Month labels */}
        <div className="relative h-6 mb-2">
          {['Feb', 'Mar', 'Apr'].map((m, i) => (
            <div key={m} className="absolute text-[10px] font-medium" style={{ left: `${(i / 3) * 100}%`, color: '#94a3b8' }}>
              {m}
            </div>
          ))}
        </div>

        {/* Payroll row */}
        <div className="mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.standard }}>Payroll</span>
        </div>
        <div className="relative h-8 mb-4 rounded" style={{ backgroundColor: '#F8FAFC' }}>
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
        <div className="relative h-8 mb-4 rounded" style={{ backgroundColor: '#F8FAFC' }}>
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
        <div className="border-t pt-3 mt-2" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: '#f59e0b' }} />
            <p className="text-xs" style={{ color: '#475569' }}>
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
            <h3 className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>Counter Lead Bonus Uses the 4-5-4 Calendar</h3>
            <p className="text-xs mb-3" style={{ color: '#475569' }}>
              Counter Lead Bonus is calculated on the retail calendar, not the payroll calendar.
              In 5-week periods, reps earn on the full extended period, which does not align with payroll splits.
            </p>
            <div className="rounded-lg p-3 bg-white">
              <p className="text-xs font-semibold mb-1" style={{ color: '#0F172A' }}>Example: Period P2 (5 weeks, Mar 1 — Apr 4)</p>
              <p className="text-xs" style={{ color: '#475569' }}>
                Counter Lead Bonus is calculated on the full 5-week period — not split across PP3 (Mar 1-15) and PP4 (Mar 16-31).
                The system accumulates sales for the entire retail period, then allocates the bonus to the correct payroll period for payout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Component-to-Calendar mapping table */}
      <div className="rounded-xl border bg-white p-5" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Component Calendar Assignment</h2>
        <p className="text-xs mb-4" style={{ color: '#475569' }}>
          Each commission component is tied to a specific calendar for calculation and payout
        </p>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Component</th>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Calendar</th>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {CALENDAR_MAP.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td className="py-3 text-xs font-medium" style={{ color: '#0F172A' }}>{row.component}</td>
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
                <td className="py-3 text-xs" style={{ color: '#475569' }}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}
