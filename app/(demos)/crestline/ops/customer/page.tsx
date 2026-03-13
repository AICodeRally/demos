'use client';

import { BarChart, AreaChart, RadarChart } from '@/components/demos/crestline';
import { SELLING_DEPTS, COLORS } from '@/data/crestline';

/* -- Conversion funnel ---------------------------------- */

const FUNNEL = [
  { stage: 'Browse Store', count: 1200, color: COLORS.primary },
  { stage: 'Engage Associate', count: 540, color: '#2563eb' },
  { stage: 'Try / Assess', count: 324, color: '#7c3aed' },
  { stage: 'Add to Cart', count: 216, color: COLORS.accent },
  { stage: 'Purchase', count: 142, color: '#059669' },
];

/* -- Traffic by department ------------------------------ */

const DEPT_TRAFFIC = SELLING_DEPTS.map((d) => ({
  label: d.name.split('&')[0].trim(),
  value: d.id === 'cosmetics' ? 320 : d.id === 'designer' ? 280 : d.id === 'shoes' ? 260 : d.id === 'accessories' ? 210 : 130,
  color: d.color,
}));

/* -- Peak hours analysis -------------------------------- */

const PEAK_HOURS = [
  { label: '9AM', value: 42 }, { label: '10AM', value: 68 }, { label: '11AM', value: 112 },
  { label: '12PM', value: 96 }, { label: '1PM', value: 104 }, { label: '2PM', value: 128 },
  { label: '3PM', value: 148 }, { label: '4PM', value: 132 }, { label: '5PM', value: 118 },
  { label: '6PM', value: 98 }, { label: '7PM', value: 82 }, { label: '8PM', value: 52 },
  { label: '9PM', value: 28 },
];

/* -- 30-day traffic trend ------------------------------- */

const TRAFFIC_TREND = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: 1000 + Math.round(Math.sin(i * 0.5) * 120 + (i % 7 >= 5 ? 180 : 0) + Math.random() * 60),
}));

/* -- Customer segments ---------------------------------- */

const SEGMENTS = [
  { name: 'Luxury', pct: 28, asp: '$1,420', visits: 2.1, loyalty: '68%', color: '#7c3aed' },
  { name: 'Contemporary', pct: 45, asp: '$480', visits: 3.4, loyalty: '52%', color: '#2563eb' },
  { name: 'Value', pct: 27, asp: '$165', visits: 4.8, loyalty: '41%', color: '#059669' },
];

/* -- Customer satisfaction radar ------------------------ */

const CSAT_RADAR = [
  { label: 'Product Quality', value: 92 },
  { label: 'Service', value: 88 },
  { label: 'Selection', value: 85 },
  { label: 'Ambiance', value: 90 },
  { label: 'Value', value: 72 },
  { label: 'Convenience', value: 78 },
];
const INDUSTRY_AVG = [82, 76, 80, 74, 70, 74];

/* -- Conversion by stage -------------------------------- */

const STAGE_CONV = [
  { label: 'Browse > Engage', value: 45, color: '#2563eb' },
  { label: 'Engage > Try', value: 60, color: '#7c3aed' },
  { label: 'Try > Cart', value: 67, color: COLORS.accent },
  { label: 'Cart > Buy', value: 66, color: '#059669' },
];

/* -- Abandonment insights ------------------------------- */

const ABANDONMENT = [
  {
    transition: 'Browse > Engage',
    dropPct: '55%',
    reason: 'No associate available within 2 minutes',
    suggestion: 'Zone staffing during peak traffic hours',
    color: '#EF4444',
  },
  {
    transition: 'Try > Cart',
    dropPct: '33%',
    reason: 'Price shock on premium items without context',
    suggestion: 'Lead with value proposition and financing options',
    color: '#F59E0B',
  },
  {
    transition: 'Cart > Buy',
    dropPct: '34%',
    reason: 'Long checkout wait or payment issues',
    suggestion: 'Mobile POS for high-value floor closes',
    color: '#2563eb',
  },
];

export default function CustomerJourney() {
  const maxCount = FUNNEL[0].count;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Customer Journey</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          End-to-end conversion funnel, traffic analysis, and customer segment insights &mdash; Flagship F-001
        </p>
      </div>

      {/* Funnel Visualization */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-5" style={{ color: 'var(--pl-text)' }}>
          Conversion Funnel &mdash; Today
        </p>
        <div className="space-y-2">
          {FUNNEL.map((stage, i) => {
            const widthPct = Math.max((stage.count / maxCount) * 100, 12);
            const prevCount = i > 0 ? FUNNEL[i - 1].count : stage.count;
            const convPct = i > 0 ? ((stage.count / prevCount) * 100).toFixed(0) : '100';
            return (
              <div key={stage.stage} className="flex items-center gap-4">
                <span className="w-[140px] text-right text-[12px] font-medium shrink-0" style={{ color: 'var(--pl-text-secondary)' }}>
                  {stage.stage}
                </span>
                <div className="flex-1 relative">
                  <div
                    className="h-9 rounded-lg flex items-center justify-between px-4 transition-all duration-500"
                    style={{ width: `${widthPct}%`, backgroundColor: stage.color, minWidth: '80px' }}
                  >
                    <span className="text-white text-[13px] font-bold">{stage.count.toLocaleString()}</span>
                    <span className="text-white/80 text-[11px]">
                      {i > 0 ? `${convPct}%` : ''}
                    </span>
                  </div>
                </div>
                {i > 0 && (
                  <span
                    className="text-[11px] shrink-0 w-[48px]"
                    style={{ color: parseInt(convPct) >= 60 ? '#10B981' : parseInt(convPct) >= 45 ? '#F59E0B' : '#EF4444' }}
                  >
                    {convPct}% cvr
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: 'var(--pl-stripe)' }}>
          <span className="text-[12px]" style={{ color: 'var(--pl-text-muted)' }}>
            Overall Conversion: Browse &rarr; Purchase ={' '}
            <span className="font-bold" style={{ color: '#059669' }}>
              {((FUNNEL[FUNNEL.length - 1].count / FUNNEL[0].count) * 100).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>

      {/* Stage Conversion + Traffic by Dept */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Stage Conversion Rate (%)
          </p>
          <BarChart data={STAGE_CONV} unit="%" />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Traffic by Department
          </p>
          <BarChart data={DEPT_TRAFFIC} unit="" />
        </div>
      </div>

      {/* Peak Hours + 30-day Traffic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Peak Hours Analysis (visitors/hr)
          </p>
          <AreaChart data={PEAK_HOURS} color={COLORS.accent} />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            30-Day Traffic Trend (daily visitors)
          </p>
          <AreaChart data={TRAFFIC_TREND} color="#2563eb" showDots={false} />
        </div>
      </div>

      {/* Customer Segments + CSAT Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Customer Segments
          </p>
          <div className="space-y-3">
            {SEGMENTS.map((seg) => (
              <div
                key={seg.name}
                className="rounded-xl p-4 border-l-4"
                style={{ borderLeftColor: seg.color, backgroundColor: 'var(--pl-bg)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-bold" style={{ color: 'var(--pl-text)' }}>{seg.name}</span>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: seg.color }}>{seg.pct}% of traffic</span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Avg Spend</span>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{seg.asp}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Visits/Mo</span>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{seg.visits}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Loyalty</span>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>{seg.loyalty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Customer Satisfaction (CSAT)
          </p>
          <div className="flex justify-center">
            <RadarChart axes={CSAT_RADAR} color={COLORS.flagship} benchmarkData={INDUSTRY_AVG} size={280} />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: COLORS.flagship }} />
              <span className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>Crestline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded border-b border-dashed" style={{ borderColor: '#A8A29E' }} />
              <span className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>Industry Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abandonment Analysis */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Abandonment Analysis
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ABANDONMENT.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border-l-4 p-4"
              style={{ borderLeftColor: item.color, backgroundColor: 'var(--pl-bg)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold" style={{ color: 'var(--pl-text)' }}>
                  Drop-off: {item.transition}
                </span>
                <span className="text-[13px] font-bold tabular-nums" style={{ color: item.color }}>
                  {item.dropPct}
                </span>
              </div>
              <p className="text-[11px] mb-2" style={{ color: 'var(--pl-text-secondary)' }}>
                <span className="font-medium" style={{ color: '#EF4444' }}>Reason:</span> {item.reason}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>
                <span className="font-medium" style={{ color: '#10B981' }}>Action:</span> {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
