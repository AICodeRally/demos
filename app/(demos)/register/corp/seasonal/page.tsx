'use client';

import { useState } from 'react';
import { FormatSelector, AreaChart, HeatMap, BarChart, ConfidenceBand } from '@/components/demos/register';

/* ── 12-month seasonality curve ── */
const SEASONALITY = [
  { label: 'Jan', value: 62 },
  { label: 'Feb', value: 88 },  // Presidents' Day
  { label: 'Mar', value: 70 },
  { label: 'Apr', value: 65 },
  { label: 'May', value: 92 },  // Memorial Day
  { label: 'Jun', value: 72 },
  { label: 'Jul', value: 68 },
  { label: 'Aug', value: 66 },
  { label: 'Sep', value: 85 },  // Labor Day
  { label: 'Oct', value: 70 },
  { label: 'Nov', value: 100 }, // Black Friday
  { label: 'Dec', value: 82 },
];

/* ── Product demand heatmap: 12 months x 4 categories ── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PRODUCT_CATS = ['Mattresses', 'Bases', 'Bedding', 'Sleep Tech'];
const DEMAND_DATA = [
  [55, 82, 65, 58, 88, 68, 62, 60, 80, 65, 95, 78], // Mattresses
  [50, 75, 60, 52, 80, 62, 58, 55, 72, 58, 85, 70], // Bases
  [60, 70, 55, 50, 65, 55, 50, 70, 60, 68, 90, 88], // Bedding
  [45, 60, 50, 48, 55, 50, 48, 45, 55, 52, 72, 68], // Sleep Tech
];

/* ── Promotional spend by quarter ── */
const QUARTERLY_SPEND = [
  { label: 'Q1 (Jan-Mar)', value: 3.6, color: '#1E3A5F' },
  { label: 'Q2 (Apr-Jun)', value: 4.3, color: '#06B6D4' },
  { label: 'Q3 (Jul-Sep)', value: 4.0, color: '#8B5CF6' },
  { label: 'Q4 (Oct-Dec)', value: 7.7, color: '#10B981' },
];

/* ── Calendar events ── */
const EVENTS = [
  { name: "Presidents' Day", dates: 'Feb 14-17', budget: '$2.4M', lift: '18%', color: '#1E3A5F' },
  { name: 'Memorial Day', dates: 'May 23-26', budget: '$3.1M', lift: '22%', color: '#06B6D4' },
  { name: 'July 4th', dates: 'Jul 1-6', budget: '$1.2M', lift: '8%', color: '#8B5CF6' },
  { name: 'Labor Day', dates: 'Aug 29-Sep 1', budget: '$2.8M', lift: '20%', color: '#10B981' },
  { name: 'Black Friday', dates: 'Nov 27-30', budget: '$4.5M', lift: '35%', color: '#EF4444' },
  { name: 'Holiday Season', dates: 'Dec 1-24', budget: '$3.2M', lift: '25%', color: '#F59E0B' },
];

/* ── Holiday forecast confidence band (Nov-Dec weekly) ── */
const HOLIDAY_FORECAST = [
  { label: 'W1 Nov', value: 5.2, low: 4.6, high: 5.8 },
  { label: 'W2 Nov', value: 5.8, low: 5.0, high: 6.6 },
  { label: 'W3 Nov', value: 6.4, low: 5.4, high: 7.4 },
  { label: 'BF Wk', value: 10.2, low: 8.6, high: 11.8 },
  { label: 'W1 Dec', value: 7.8, low: 6.8, high: 8.8 },
  { label: 'W2 Dec', value: 7.2, low: 6.2, high: 8.2 },
  { label: 'W3 Dec', value: 8.4, low: 7.2, high: 9.6 },
  { label: 'Xmas Wk', value: 3.0, low: 2.4, high: 3.6 },
];

/* ── Inventory buildup timeline ── */
const INVENTORY_TIMELINE = [
  { event: "Presidents' Day", weeks: 4, color: '#1E3A5F' },
  { event: 'Memorial Day', weeks: 6, color: '#06B6D4' },
  { event: 'July 4th', weeks: 3, color: '#8B5CF6' },
  { event: 'Labor Day', weeks: 5, color: '#10B981' },
  { event: 'Black Friday', weeks: 8, color: '#EF4444' },
  { event: 'Holiday Season', weeks: 6, color: '#F59E0B' },
];

export default function SeasonalStrategy() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Seasonal Strategy</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Annual promotional calendar, demand forecasting, and inventory pre-positioning
        </p>
      </div>

      {/* Seasonality Curve */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          12-Month Seasonality Index (100 = peak demand)
        </p>
        <AreaChart data={SEASONALITY} color="#1E3A5F" height={200} />
      </div>

      {/* Demand Heatmap + Quarterly Spend */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Product Demand Intensity (0-100)</p>
          <HeatMap
            rows={PRODUCT_CATS}
            cols={MONTHS}
            data={DEMAND_DATA}
            colorScale={{ low: '#F1F5F9', mid: '#06B6D4', high: '#1E3A5F' }}
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Promotional Investment by Quarter ($M)</p>
          <BarChart data={QUARTERLY_SPEND} unit="M" />
        </div>
      </div>

      {/* Event Calendar Cards */}
      <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Key Promotional Events</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {EVENTS.map((evt) => (
          <div
            key={evt.name}
            className="rounded-xl bg-white border p-5"
            style={{ borderColor: '#E2E8F0', borderLeft: `4px solid ${evt.color}` }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{evt.name}</p>
            <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>{evt.dates}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Budget</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>{evt.budget}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Target Lift</span>
                <span className="font-semibold" style={{ color: '#10B981' }}>+{evt.lift}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Holiday Forecast */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Holiday Season Revenue Forecast ($M weekly)</p>
          <div className="flex gap-4 text-[10px]" style={{ color: '#94A3B8' }}>
            <span>Center: $48M</span>
            <span>Low: $42M</span>
            <span>High: $54M</span>
          </div>
        </div>
        <ConfidenceBand data={HOLIDAY_FORECAST} color="#1E3A5F" height={180} />
      </div>

      {/* Inventory Buildup Timeline */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Inventory Pre-Positioning (weeks before event)</p>
        <div className="space-y-3">
          {INVENTORY_TIMELINE.map((item) => {
            const maxWeeks = 8;
            const pct = (item.weeks / maxWeeks) * 100;
            return (
              <div key={item.event} className="flex items-center gap-3">
                <span className="w-[120px] shrink-0 text-right text-xs" style={{ color: '#475569' }}>
                  {item.event}
                </span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
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
