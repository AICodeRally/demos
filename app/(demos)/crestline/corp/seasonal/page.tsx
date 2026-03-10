'use client';

import { AreaChart, HeatMap, BarChart } from '@/components/demos/crestline';
import { COLORS, MONTHLY_REVENUE } from '@/data/crestline';

/* 12-month seasonality index (100 = peak demand, derived from MONTHLY_REVENUE totals) */
const SEASONALITY = MONTHLY_REVENUE.map((m) => {
  const total = m.flagship + m.standard + m.rack + m.counter;
  return { label: m.month, value: Math.round(total) };
});

/* Department demand heatmap: 12 months × 5 selling depts */
const MONTHS = MONTHLY_REVENUE.map((m) => m.month);
const DEPT_NAMES = ['Cosmetics', 'Designer', 'Shoes', 'Accessories', 'Home'];
const DEMAND_DATA = [
  [65, 60, 62, 58, 68, 72, 70, 85, 75, 68, 92, 95],  // Cosmetics (holiday gift peak)
  [55, 52, 58, 55, 52, 65, 62, 60, 78, 72, 88, 82],   // Designer (fall/holiday)
  [50, 48, 55, 52, 60, 58, 55, 82, 68, 62, 75, 70],   // Shoes (back-to-school peak)
  [58, 55, 60, 55, 62, 65, 60, 70, 68, 65, 90, 92],   // Accessories (holiday gift peak)
  [52, 50, 55, 58, 62, 58, 55, 72, 78, 68, 85, 88],   // Home (back-to-school + holiday)
];

/* Promotional spend by quarter */
const QUARTERLY_SPEND = [
  { label: 'Q1 (Mar-May)', value: 8.2, color: COLORS.flagship },
  { label: 'Q2 (Jun-Aug)', value: 12.5, color: COLORS.standard },
  { label: 'Q3 (Sep-Nov)', value: 18.4, color: COLORS.rack },
  { label: 'Q4 (Dec-Feb)', value: 6.8, color: COLORS.counter },
];

/* Key selling seasons */
const SEASONS = [
  { name: 'Back to School', dates: 'Jul 15 - Sep 5', budget: '$8.2M', lift: '24%', color: COLORS.standard, depts: 'Shoes, Designer, Home' },
  { name: 'Fall Fashion', dates: 'Sep 8 - Oct 31', budget: '$6.5M', lift: '18%', color: COLORS.flagship, depts: 'Designer, Accessories' },
  { name: 'Holiday Season', dates: 'Nov 1 - Dec 31', budget: '$18.4M', lift: '42%', color: '#EF4444', depts: 'All Departments' },
  { name: 'Spring Preview', dates: 'Mar 1 - Apr 15', budget: '$4.8M', lift: '12%', color: COLORS.rack, depts: 'Designer, Shoes' },
  { name: 'Anniversary Sale', dates: 'Jul 1 - Jul 14', budget: '$5.2M', lift: '28%', color: COLORS.accent, depts: 'All Departments' },
  { name: 'Mothers Day', dates: 'Apr 20 - May 11', budget: '$3.6M', lift: '15%', color: COLORS.counter, depts: 'Cosmetics, Accessories' },
];

/* 4-5-4 Retail Calendar visual */
const RETAIL_CALENDAR = [
  { period: 'P1', weeks: 4, quarter: 'Q1', type: 'payroll' as const },
  { period: 'P2', weeks: 5, quarter: 'Q1', type: 'counter-lead' as const },
  { period: 'P3', weeks: 4, quarter: 'Q1', type: 'payroll' as const },
  { period: 'P4', weeks: 4, quarter: 'Q2', type: 'payroll' as const },
  { period: 'P5', weeks: 5, quarter: 'Q2', type: 'counter-lead' as const },
  { period: 'P6', weeks: 4, quarter: 'Q2', type: 'payroll' as const },
  { period: 'P7', weeks: 4, quarter: 'Q3', type: 'payroll' as const },
  { period: 'P8', weeks: 5, quarter: 'Q3', type: 'counter-lead' as const },
  { period: 'P9', weeks: 4, quarter: 'Q3', type: 'payroll' as const },
  { period: 'P10', weeks: 4, quarter: 'Q4', type: 'payroll' as const },
  { period: 'P11', weeks: 5, quarter: 'Q4', type: 'counter-lead' as const },
  { period: 'P12', weeks: 4, quarter: 'Q4', type: 'payroll' as const },
];

const QUARTER_COLORS: Record<string, string> = {
  Q1: COLORS.flagship,
  Q2: COLORS.standard,
  Q3: COLORS.rack,
  Q4: COLORS.counter,
};

/* Inventory buildup timeline */
const INVENTORY_TIMELINE = [
  { event: 'Anniversary Sale', weeks: 6, color: COLORS.accent },
  { event: 'Back to School', weeks: 8, color: COLORS.standard },
  { event: 'Fall Fashion', weeks: 5, color: COLORS.flagship },
  { event: 'Holiday Season', weeks: 10, color: '#EF4444' },
  { event: 'Spring Preview', weeks: 4, color: COLORS.rack },
  { event: 'Mothers Day', weeks: 3, color: COLORS.counter },
];

export default function SeasonalStrategy() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Seasonal Strategy</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Annual promotional calendar, demand forecasting, and inventory pre-positioning
        </p>
      </div>

      {/* Seasonality Curve */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
          12-Month Revenue by Month ($M, all formats)
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-muted)' }}>
          Holiday peak (Nov-Dec) drives 32% of annual revenue; Aug back-to-school second peak
        </p>
        <AreaChart data={SEASONALITY} color={COLORS.primary} height={200} />
      </div>

      {/* Demand Heatmap + Quarterly Spend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Department Demand Intensity (0-100)</p>
          <HeatMap
            rows={DEPT_NAMES}
            cols={MONTHS}
            data={DEMAND_DATA}
            colorScale={{ low: '#F1F5F9', mid: COLORS.accent, high: COLORS.primary }}
          />
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Promotional Investment by Quarter ($M)</p>
          <BarChart data={QUARTERLY_SPEND} unit="M" />
        </div>
      </div>

      {/* Key Selling Seasons */}
      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Key Selling Seasons</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {SEASONS.map((evt) => (
          <div
            key={evt.name}
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--pl-border)', borderLeft: `4px solid ${evt.color}`, backgroundColor: 'var(--pl-card)' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>{evt.name}</p>
            <p className="text-xs mb-3" style={{ color: 'var(--pl-text-muted)' }}>{evt.dates}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Budget</span>
                <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{evt.budget}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Target Lift</span>
                <span className="font-semibold" style={{ color: '#10B981' }}>+{evt.lift}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Key Depts</span>
                <span className="font-medium text-right" style={{ color: 'var(--pl-text-secondary)' }}>{evt.depts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4-5-4 Retail Calendar */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>4-5-4 Retail Calendar</p>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-muted)' }}>
          Commission calculated on 4-5-4 retail weeks (not semi-monthly payroll). 5-week periods trigger Counter Lead Bonus.
        </p>
        <div className="grid grid-cols-12 gap-1.5">
          {RETAIL_CALENDAR.map((p) => {
            const qColor = QUARTER_COLORS[p.quarter];
            const isCounterLead = p.type === 'counter-lead';
            return (
              <div
                key={p.period}
                className="rounded-lg p-3 text-center"
                style={{
                  backgroundColor: isCounterLead ? `${qColor}18` : 'var(--pl-bg)',
                  border: `1px solid ${isCounterLead ? qColor : 'var(--pl-border)'}`,
                }}
              >
                <p className="text-xs font-bold" style={{ color: qColor }}>{p.period}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--pl-text-secondary)' }}>{p.weeks}w</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{p.quarter}</p>
                {isCounterLead && (
                  <span
                    className="inline-block mt-1 px-1 py-0.5 rounded text-[8px] font-bold"
                    style={{ backgroundColor: `${qColor}25`, color: qColor }}
                  >
                    CLB
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory Buildup Timeline */}
      <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Inventory Pre-Positioning (weeks before event)</p>
        <div className="space-y-3">
          {INVENTORY_TIMELINE.map((item) => {
            const maxWeeks = 10;
            const pct = (item.weeks / maxWeeks) * 100;
            return (
              <div key={item.event} className="flex items-center gap-3">
                <span className="w-[140px] shrink-0 text-right text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
                  {item.event}
                </span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--pl-stripe)' }}>
                  <div
                    className="h-full rounded-lg flex items-center px-2 transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  >
                    <span className="text-[10px] font-mono text-white whitespace-nowrap">{item.weeks} wks</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
