'use client';

import { StatCard, RadarChart, DonutChart, BarChart, HeatMap } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const RISK_FACTORS = [
  { label: 'Credit Score', value: 88 },
  { label: 'DTI Ratio', value: 82 },
  { label: 'Employment', value: 90 },
  { label: 'Collateral', value: 85 },
  { label: 'Payment History', value: 92 },
];

const CREDIT_DISTRIBUTION = [
  { label: 'Excellent (750+)', value: 28, color: '#059669' },
  { label: 'Good (700-749)', value: 34, color: '#6B8F71' },
  { label: 'Fair (650-699)', value: 22, color: '#EAB308' },
  { label: 'Below 650', value: 16, color: '#B91C1C' },
];

const AUTO_VS_MANUAL = [
  { label: 'Oct', value: 145, color: '#475569' },
  { label: 'Oct (M)', value: 98, color: '#B87333' },
  { label: 'Nov', value: 152, color: '#475569' },
  { label: 'Nov (M)', value: 92, color: '#B87333' },
  { label: 'Dec', value: 138, color: '#475569' },
  { label: 'Dec (M)', value: 105, color: '#B87333' },
  { label: 'Jan', value: 160, color: '#475569' },
  { label: 'Jan (M)', value: 88, color: '#B87333' },
  { label: 'Feb', value: 168, color: '#475569' },
  { label: 'Feb (M)', value: 95, color: '#B87333' },
  { label: 'Mar', value: 174, color: '#475569' },
  { label: 'Mar (M)', value: 82, color: '#B87333' },
];

const HEATMAP_ROWS = ['DTI < 30%', 'DTI 30-36%', 'DTI 36-43%', 'DTI 43%+'];
const HEATMAP_COLS = ['750+', '700-749', '650-699', '< 650'];
const HEATMAP_DATA = [
  [96, 92, 78, 52],
  [88, 82, 65, 38],
  [72, 64, 48, 22],
  [45, 35, 20, 8],
];

/* ── Page ─────────────────────────────────────────────────── */

export default function UnderwritingAnalytics() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Underwriting Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Decision engine performance, risk factor analysis, and approval patterns
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Applications Processed" value="1,240" trend="up" trendValue="+6% MoM" color="#475569" />
        <StatCard label="Auto-Approved" value="42%" trend="up" trendValue="+3.5%" color="#6B8F71" />
        <StatCard label="Manual Review" value="38%" trend="down" trendValue="-2.1%" color="#B87333" />
        <StatCard label="Declined" value="20%" trend="flat" trendValue="Stable" color="#B91C1C" />
      </div>

      {/* Radar + Credit Score Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Risk Factor Scoring</h2>
          <RadarChart axes={RISK_FACTORS} color="#475569" size={260} />
        </div>
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Credit Score Distribution</h2>
          <DonutChart segments={CREDIT_DISTRIBUTION} centerValue="1,240" centerLabel="Apps" size={200} />
        </div>
      </div>

      {/* Auto vs Manual Decisions */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Auto vs Manual Decisions (6 months)</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#475569' }} />
              <span className="text-[11px]" style={{ color: '#57534E' }}>Auto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#B87333' }} />
              <span className="text-[11px]" style={{ color: '#57534E' }}>Manual</span>
            </div>
          </div>
        </div>
        <BarChart data={AUTO_VS_MANUAL} />
      </div>

      {/* Approval Rate HeatMap */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Approval Rate by DTI &times; Credit Score (%)</h2>
        <HeatMap
          rows={HEATMAP_ROWS}
          cols={HEATMAP_COLS}
          data={HEATMAP_DATA}
          colorScale={{ low: '#B91C1C', mid: '#EAB308', high: '#059669' }}
        />
      </div>
    </>
  );
}
