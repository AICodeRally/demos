'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart, HeatMap, RadarChart } from '@/components/demos/register';
import { FORMAT_META, WORKFORCE, type FormatId } from '@/data/register/store-data';

/* ── Workforce data ───────────────────────────────────────── */

const HEADCOUNT_BY_ROLE: Record<FormatId, { label: string; value: number; color?: string }[]> = {
  flagship: [
    { label: 'Sleep Consultants', value: 175, color: '#1E3A5F' },
    { label: 'Associates', value: 125, color: '#06B6D4' },
    { label: 'Store Managers', value: 50, color: '#10B981' },
    { label: 'Asst Managers', value: 25, color: '#8B5CF6' },
  ],
  standard: [
    { label: 'Associates', value: 500, color: '#06B6D4' },
    { label: 'Sleep Consultants', value: 200, color: '#1E3A5F' },
    { label: 'Store Managers', value: 100, color: '#10B981' },
  ],
  outlet: [
    { label: 'Associates', value: 175, color: '#06B6D4' },
    { label: 'Floor Leads', value: 50, color: '#1E3A5F' },
    { label: 'Store Managers', value: 25, color: '#10B981' },
  ],
  'shop-in-shop': [
    { label: 'Brand Reps', value: 25, color: '#1E3A5F' },
    { label: 'Associates', value: 25, color: '#06B6D4' },
  ],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];

const STAFFING_GRID: Record<FormatId, number[][]> = {
  flagship: [
    [20, 25, 35, 45, 55, 60, 65, 70, 65, 55, 45, 35, 25, 15],
    [20, 25, 35, 45, 55, 60, 65, 70, 65, 55, 45, 35, 25, 15],
    [20, 25, 35, 50, 60, 65, 70, 75, 70, 60, 50, 40, 30, 18],
    [22, 28, 38, 50, 62, 68, 72, 78, 72, 62, 50, 40, 30, 18],
    [25, 32, 42, 55, 68, 75, 80, 85, 80, 70, 58, 45, 35, 22],
    [35, 45, 58, 70, 82, 90, 95, 100, 95, 85, 72, 60, 48, 35],
    [30, 40, 52, 65, 78, 85, 90, 95, 88, 78, 65, 52, 42, 28],
  ],
  standard: [
    [15, 20, 30, 40, 50, 55, 58, 62, 58, 48, 38, 28, 18, 10],
    [15, 20, 30, 40, 50, 55, 58, 62, 58, 48, 38, 28, 18, 10],
    [18, 22, 32, 42, 52, 58, 62, 65, 60, 50, 40, 30, 20, 12],
    [18, 25, 35, 45, 55, 60, 65, 68, 62, 52, 42, 32, 22, 14],
    [22, 28, 38, 48, 60, 68, 72, 78, 72, 62, 50, 38, 28, 18],
    [30, 38, 50, 62, 75, 82, 88, 92, 88, 78, 65, 52, 40, 28],
    [25, 35, 45, 58, 70, 78, 82, 88, 82, 72, 58, 45, 35, 22],
  ],
  outlet: [
    [10, 15, 22, 32, 42, 48, 52, 55, 50, 42, 32, 22, 15, 8],
    [10, 15, 22, 32, 42, 48, 52, 55, 50, 42, 32, 22, 15, 8],
    [12, 18, 25, 35, 45, 50, 55, 58, 52, 44, 34, 24, 16, 10],
    [12, 18, 25, 35, 45, 52, 58, 62, 56, 46, 36, 26, 18, 10],
    [15, 22, 30, 40, 52, 60, 65, 70, 65, 55, 42, 32, 22, 14],
    [25, 35, 45, 58, 70, 78, 85, 90, 85, 75, 62, 48, 35, 22],
    [22, 30, 40, 52, 65, 72, 78, 82, 78, 68, 55, 42, 30, 18],
  ],
  'shop-in-shop': [
    [5, 10, 18, 28, 38, 42, 45, 48, 44, 35, 25, 18, 10, 5],
    [5, 10, 18, 28, 38, 42, 45, 48, 44, 35, 25, 18, 10, 5],
    [8, 12, 20, 30, 40, 45, 48, 50, 46, 38, 28, 20, 12, 6],
    [8, 14, 22, 32, 42, 48, 52, 55, 50, 40, 30, 22, 14, 8],
    [12, 18, 28, 38, 50, 58, 62, 68, 62, 52, 40, 28, 18, 10],
    [20, 30, 42, 55, 68, 75, 80, 85, 80, 70, 55, 42, 30, 18],
    [18, 25, 38, 50, 62, 70, 75, 80, 75, 65, 50, 38, 25, 15],
  ],
};

const WORKFORCE_HEALTH: Record<FormatId, { label: string; value: number }[]> = {
  flagship: [
    { label: 'Tenure', value: 82 }, { label: 'Training', value: 92 }, { label: 'Certification', value: 88 },
    { label: 'Satisfaction', value: 85 }, { label: 'Productivity', value: 90 }, { label: 'Retention', value: 78 },
  ],
  standard: [
    { label: 'Tenure', value: 68 }, { label: 'Training', value: 78 }, { label: 'Certification', value: 72 },
    { label: 'Satisfaction', value: 70 }, { label: 'Productivity', value: 75 }, { label: 'Retention', value: 66 },
  ],
  outlet: [
    { label: 'Tenure', value: 52 }, { label: 'Training', value: 60 }, { label: 'Certification', value: 48 },
    { label: 'Satisfaction', value: 55 }, { label: 'Productivity', value: 62 }, { label: 'Retention', value: 45 },
  ],
  'shop-in-shop': [
    { label: 'Tenure', value: 42 }, { label: 'Training', value: 55 }, { label: 'Certification', value: 40 },
    { label: 'Satisfaction', value: 48 }, { label: 'Productivity', value: 52 }, { label: 'Retention', value: 38 },
  ],
};

const COST_MODELS = [
  { format: 'Flagship', pct: '18%', color: '#1E3A5F', note: 'High-touch model, premium service justifies labor investment' },
  { format: 'Standard', pct: '22%', color: '#06B6D4', note: 'Balanced staffing with targeted consultant placement' },
  { format: 'Outlet', pct: '26%', color: '#8B5CF6', note: 'Lean floor coverage, volume-based scheduling' },
  { format: 'Shop-in-Shop', pct: '30%', color: '#10B981', note: 'Host store dependency, brand rep premium per sq ft' },
];

const HIRING_PIPELINE = [
  { format: 'Flagship', district: 'Northeast', role: 'Sleep Consultant', open: 4, apps: 62, days: 28, status: 'Active' },
  { format: 'Flagship', district: 'Mid-Atlantic', role: 'Store Manager', open: 1, apps: 18, days: 42, status: 'Final Round' },
  { format: 'Standard', district: 'Southeast', role: 'Associate', open: 8, apps: 124, days: 14, status: 'Active' },
  { format: 'Standard', district: 'Midwest', role: 'Associate', open: 5, apps: 78, days: 18, status: 'Active' },
  { format: 'Outlet', district: 'Southwest', role: 'Floor Lead', open: 2, apps: 32, days: 22, status: 'Screening' },
  { format: 'Outlet', district: 'Mountain', role: 'Associate', open: 6, apps: 45, days: 12, status: 'Active' },
  { format: 'SiS', district: 'Pacific NW', role: 'Brand Rep', open: 3, apps: 28, days: 35, status: 'Interviewing' },
  { format: 'SiS', district: 'Great Lakes', role: 'Brand Rep', open: 2, apps: 15, days: 21, status: 'Active' },
];

function statusColor(status: string) {
  if (status === 'Final Round') return '#8B5CF6';
  if (status === 'Interviewing') return '#06B6D4';
  if (status === 'Screening') return '#F59E0B';
  return '#10B981';
}

export default function WorkforceModel() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;
  const wf = WORKFORCE[currentFormat];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Workforce Model</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Staffing, scheduling, workforce health, and hiring pipeline across 1,475 associates
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Associates" value={String(wf.totalAssociates)} color="#1E3A5F" />
        <StatCard label="Rev / Associate" value={wf.revenuePerAssociate} trend="up" trendValue="+6%" color="#06B6D4" />
        <StatCard label="Avg Tenure" value={wf.avgTenure} color="#10B981" />
        <StatCard label="Turnover Rate" value={wf.turnover} trend="down" trendValue="-3pp" color="#EF4444" />
      </div>

      {/* Headcount + Radar */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Headcount by Role — {FORMAT_META[currentFormat].name}
          </p>
          <BarChart data={HEADCOUNT_BY_ROLE[currentFormat]} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Workforce Health — {FORMAT_META[currentFormat].name}
          </p>
          <div className="flex justify-center">
            <RadarChart axes={WORKFORCE_HEALTH[currentFormat]} color="#06B6D4" size={280} />
          </div>
        </div>
      </div>

      {/* Traffic HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>
          Optimal Staffing Levels — {FORMAT_META[currentFormat].name}
        </p>
        <p className="text-[11px] mb-4" style={{ color: '#94A3B8' }}>
          Traffic-based staffing model (0=low, 100=peak)
        </p>
        <HeatMap
          rows={DAYS}
          cols={HOURS}
          data={STAFFING_GRID[currentFormat]}
          colorScale={{ low: '#F1F5F9', mid: '#06B6D4', high: '#1E3A5F' }}
        />
      </div>

      {/* Cost Model Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {COST_MODELS.map((c) => (
          <div key={c.format} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{c.format}</span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: c.color }}>{c.pct}</p>
            <p className="text-[10px]" style={{ color: '#94A3B8' }}>Labor % of Revenue</p>
            <p className="text-[10px] mt-2 italic" style={{ color: '#475569' }}>{c.note}</p>
          </div>
        ))}
      </div>

      {/* Hiring Pipeline Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Hiring Pipeline</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Format', 'District', 'Role', 'Open', 'Applications', 'Avg Days', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HIRING_PIPELINE.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: '#0F172A' }}>{r.format}</td>
                  <td className="py-2 px-3" style={{ color: '#475569' }}>{r.district}</td>
                  <td className="py-2 px-3" style={{ color: '#475569' }}>{r.role}</td>
                  <td className="py-2 px-3 font-mono font-semibold" style={{ color: '#0F172A' }}>{r.open}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{r.apps}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: r.days > 30 ? '#EF4444' : '#475569' }}>{r.days}d</td>
                  <td className="py-2 px-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${statusColor(r.status)}18`, color: statusColor(r.status) }}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
