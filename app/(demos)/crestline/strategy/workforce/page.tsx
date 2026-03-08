'use client';

import { useState } from 'react';
import { StatCard, BarChart, RadarChart, HeatMap, FormatSelector } from '@/components/demos/crestline';
import { WORKFORCE, FORMATS, ASSOCIATES, COLORS } from '@/data/crestline';

/* ── Derived data ────────────────────────────────────────── */

type FormatKey = keyof typeof WORKFORCE;

const FORMAT_LABELS: Record<FormatKey, string> = {
  flagship: 'Flagship',
  standard: 'Standard',
  rack: 'Rack',
  counter: 'Counter',
};

const totalAssociates = Object.values(WORKFORCE).reduce((s, w) => s + w.total, 0);

// Bar chart: Revenue per associate by format
const REV_PER_ASSOC_BARS = (Object.keys(WORKFORCE) as FormatKey[]).map((key) => ({
  label: FORMAT_LABELS[key],
  value: Math.round(WORKFORCE[key].revenuePerAssoc / 1000),
  color: FORMATS.find((f) => f.id === key)?.color ?? '#64748b',
}));

// Bar chart: Turnover rate by format
const TURNOVER_BARS = (Object.keys(WORKFORCE) as FormatKey[]).map((key) => ({
  label: FORMAT_LABELS[key],
  value: Math.round(WORKFORCE[key].turnover * 100),
  color: WORKFORCE[key].turnover > 0.25 ? '#EF4444' : WORKFORCE[key].turnover > 0.20 ? '#F59E0B' : '#10B981',
}));

// Tenure distribution from associates
const TENURE_BUCKETS = [
  { label: '0-2 yrs', min: 0, max: 2 },
  { label: '3-5 yrs', min: 3, max: 5 },
  { label: '6-8 yrs', min: 6, max: 8 },
  { label: '9+ yrs', min: 9, max: 100 },
];
const TENURE_BARS = TENURE_BUCKETS.map((b) => ({
  label: b.label,
  value: ASSOCIATES.filter((a) => a.tenure >= b.min && a.tenure <= b.max).length,
  color: COLORS.standard,
}));

// Workforce health radar by format
const WORKFORCE_HEALTH: Record<string, { label: string; value: number }[]> = {
  flagship: [
    { label: 'Tenure', value: 85 }, { label: 'Training', value: 92 }, { label: 'Certification', value: 88 },
    { label: 'Satisfaction', value: 86 }, { label: 'Productivity', value: 90 }, { label: 'Retention', value: 82 },
  ],
  standard: [
    { label: 'Tenure', value: 68 }, { label: 'Training', value: 76 }, { label: 'Certification', value: 70 },
    { label: 'Satisfaction', value: 72 }, { label: 'Productivity', value: 78 }, { label: 'Retention', value: 64 },
  ],
  rack: [
    { label: 'Tenure', value: 45 }, { label: 'Training', value: 58 }, { label: 'Certification', value: 42 },
    { label: 'Satisfaction', value: 52 }, { label: 'Productivity', value: 65 }, { label: 'Retention', value: 40 },
  ],
  counter: [
    { label: 'Tenure', value: 90 }, { label: 'Training', value: 95 }, { label: 'Certification', value: 92 },
    { label: 'Satisfaction', value: 88 }, { label: 'Productivity', value: 94 }, { label: 'Retention', value: 88 },
  ],
};

// Staffing HeatMap: Days x Hours
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM'];

const STAFFING_GRID: Record<string, number[][]> = {
  flagship: [
    [25, 35, 50, 60, 65, 70, 75, 70, 60, 50, 40, 25],
    [25, 35, 50, 60, 65, 70, 75, 70, 60, 50, 40, 25],
    [28, 38, 55, 65, 70, 75, 80, 75, 65, 55, 42, 28],
    [30, 40, 58, 68, 72, 78, 82, 78, 68, 58, 45, 30],
    [35, 48, 62, 75, 80, 88, 92, 88, 78, 65, 52, 35],
    [45, 58, 72, 85, 92, 98, 100, 98, 88, 75, 60, 42],
    [40, 52, 68, 80, 88, 95, 98, 92, 82, 68, 55, 38],
  ],
  standard: [
    [20, 28, 42, 52, 58, 62, 65, 60, 52, 42, 32, 18],
    [20, 28, 42, 52, 58, 62, 65, 60, 52, 42, 32, 18],
    [22, 32, 45, 55, 60, 65, 68, 62, 55, 45, 35, 20],
    [25, 35, 48, 58, 65, 70, 72, 68, 58, 48, 38, 22],
    [30, 42, 55, 68, 75, 80, 85, 80, 70, 58, 45, 28],
    [38, 52, 65, 78, 85, 92, 95, 90, 80, 68, 52, 35],
    [35, 48, 60, 72, 80, 88, 90, 85, 75, 62, 48, 30],
  ],
  rack: [
    [15, 22, 35, 45, 52, 55, 58, 55, 48, 38, 25, 12],
    [15, 22, 35, 45, 52, 55, 58, 55, 48, 38, 25, 12],
    [18, 25, 38, 48, 55, 58, 62, 58, 50, 40, 28, 15],
    [18, 28, 40, 50, 58, 62, 65, 60, 52, 42, 30, 15],
    [22, 35, 48, 60, 68, 72, 78, 72, 62, 50, 38, 22],
    [32, 45, 58, 72, 80, 88, 92, 85, 75, 60, 45, 28],
    [28, 40, 52, 65, 75, 82, 85, 80, 70, 55, 40, 25],
  ],
  counter: [
    [30, 42, 58, 68, 72, 75, 78, 75, 68, 55, 42, 28],
    [30, 42, 58, 68, 72, 75, 78, 75, 68, 55, 42, 28],
    [32, 45, 60, 70, 75, 78, 82, 78, 70, 58, 45, 30],
    [35, 48, 62, 72, 78, 82, 85, 80, 72, 60, 48, 32],
    [38, 52, 68, 78, 82, 88, 92, 88, 78, 65, 52, 35],
    [48, 62, 78, 88, 92, 98, 100, 95, 88, 75, 60, 42],
    [42, 55, 72, 82, 88, 95, 98, 92, 82, 68, 55, 38],
  ],
};

// Labor cost cards
const COST_MODELS = FORMATS.map((f) => {
  const wf = WORKFORCE[f.id as FormatKey];
  const pct = f.id === 'flagship' ? '16%' : f.id === 'standard' ? '20%' : f.id === 'rack' ? '28%' : '14%';
  const notes: Record<string, string> = {
    flagship: 'Premium selling floor, concierge-level service justifies investment',
    standard: 'Balanced staffing with department coverage optimization',
    rack: 'Lean floor model, self-serve with volume-based scheduling',
    counter: 'Specialist beauty advisors, high per-associate productivity',
  };
  return { format: f.name, pct, color: f.color, note: notes[f.id] ?? '', total: wf.total };
});

export default function WorkforceModel() {
  const [format, setFormat] = useState<string>('flagship');

  const wf = WORKFORCE[format as FormatKey] ?? WORKFORCE.flagship;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Workforce Model</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Staffing, scheduling, workforce health, and turnover analysis across {totalAssociates.toLocaleString()} associates
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Associates" value={wf.total.toLocaleString()} color={COLORS.primary} />
        <StatCard label="Rev / Associate" value={`$${(wf.revenuePerAssoc / 1000).toFixed(0)}K`} trend="up" trendValue="+6%" color={COLORS.standard} />
        <StatCard label="Avg Tenure" value={`${wf.avgTenure} yrs`} color={COLORS.accent} />
        <StatCard label="Turnover Rate" value={`${Math.round(wf.turnover * 100)}%`} trend="down" trendValue="-2pp" color={wf.turnover > 0.25 ? '#EF4444' : '#10B981'} />
      </div>

      {/* Revenue/Associate + Turnover */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Revenue per Associate by Format ($K)
          </p>
          <BarChart data={REV_PER_ASSOC_BARS} unit="K" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Turnover Rate by Format (%)
          </p>
          <BarChart data={TURNOVER_BARS} unit="%" />
        </div>
      </div>

      {/* Tenure Distribution + Radar */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Tenure Distribution (Sample Associates)
          </p>
          <BarChart data={TENURE_BARS} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Workforce Health — {FORMAT_LABELS[format as FormatKey] ?? 'Flagship'}
          </p>
          <div className="flex justify-center">
            <RadarChart axes={WORKFORCE_HEALTH[format] ?? WORKFORCE_HEALTH.flagship} color={FORMATS.find((f) => f.id === format)?.color ?? COLORS.flagship} size={280} />
          </div>
        </div>
      </div>

      {/* Staffing HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
          Optimal Staffing Levels — {FORMAT_LABELS[format as FormatKey] ?? 'Flagship'}
        </p>
        <p className="text-[11px] mb-4" style={{ color: '#94A3B8' }}>
          Traffic-based staffing model (0=low, 100=peak)
        </p>
        <HeatMap
          rows={DAYS}
          cols={HOURS}
          data={STAFFING_GRID[format] ?? STAFFING_GRID.flagship}
          colorScale={{ low: '#F1F5F9', mid: COLORS.standard, high: COLORS.primary }}
        />
      </div>

      {/* Labor Cost Cards */}
      <div className="grid grid-cols-4 gap-4">
        {COST_MODELS.map((c) => (
          <div key={c.format} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{c.format}</span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.pct}</p>
            <p className="text-[10px]" style={{ color: '#94A3B8' }}>Labor % of Revenue</p>
            <div className="flex justify-between text-xs mt-2">
              <span style={{ color: '#94A3B8' }}>Headcount</span>
              <span className="font-mono font-medium" style={{ color: '#0F172A' }}>{c.total.toLocaleString()}</span>
            </div>
            <p className="text-[10px] mt-2 italic" style={{ color: '#475569' }}>{c.note}</p>
          </div>
        ))}
      </div>
    </>
  );
}
