'use client';

import { StatCard, WaterfallChart, BarChart, ConfidenceBand } from '@/components/demos/charter';

/* -- Mock Data ---------------------------------------------------------- */

const SPARKLINE_RISK_CAPITAL = [198, 202, 206, 210, 214, 216, 218, 220, 222, 224, 226, 228];
const SPARKLINE_CAPITAL_RATIO = [10.2, 10.3, 10.4, 10.5, 10.5, 10.6, 10.7, 10.7, 10.8, 10.8, 10.85, 10.86];
const SPARKLINE_RISK_SCORE = [2.8, 2.7, 2.6, 2.5, 2.4, 2.4, 2.3, 2.3, 2.2, 2.2, 2.1, 2.1];
const SPARKLINE_STRESS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const WATERFALL_DATA = [
  { label: 'Credit', value: 142, type: 'add' as const },
  { label: 'Int. Rate', value: 38, type: 'add' as const },
  { label: 'Operational', value: 24, type: 'add' as const },
  { label: 'Liquidity', value: 16, type: 'add' as const },
  { label: 'Concentr.', value: 8, type: 'add' as const },
  { label: 'Total', value: 228, type: 'total' as const },
];

const CONCENTRATION_DATA = [
  { label: 'Real Estate', value: 28, color: '#475569' },
  { label: 'Healthcare', value: 18, color: '#B87333' },
  { label: 'Manufacturing', value: 14, color: '#6B8F71' },
  { label: 'Retail', value: 12, color: '#475569' },
  { label: 'Construction', value: 10, color: '#B87333' },
  { label: 'Professional Svcs', value: 8, color: '#6B8F71' },
  { label: 'Other', value: 10, color: '#A8A29E' },
];

// Interest rate scenario impact on NIM over 12 months
const NIM_SCENARIOS = [
  { label: 'Jan', value: 3.12, low: 2.84, high: 3.42 },
  { label: 'Feb', value: 3.10, low: 2.78, high: 3.46 },
  { label: 'Mar', value: 3.08, low: 2.72, high: 3.50 },
  { label: 'Apr', value: 3.06, low: 2.66, high: 3.52 },
  { label: 'May', value: 3.04, low: 2.60, high: 3.54 },
  { label: 'Jun', value: 3.03, low: 2.56, high: 3.55 },
  { label: 'Jul', value: 3.02, low: 2.52, high: 3.56 },
  { label: 'Aug', value: 3.01, low: 2.50, high: 3.57 },
  { label: 'Sep', value: 3.00, low: 2.48, high: 3.58 },
  { label: 'Oct', value: 2.99, low: 2.46, high: 3.59 },
  { label: 'Nov', value: 2.98, low: 2.44, high: 3.60 },
  { label: 'Dec', value: 2.97, low: 2.42, high: 3.61 },
];

/* -- Page --------------------------------------------------------------- */

export default function RiskManagement() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Risk Management</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Capital allocation, concentration analysis &amp; interest rate stress scenarios
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Risk Capital" value="$228M" trend="up" trendValue="+3.6%" color="#475569" sparkline={SPARKLINE_RISK_CAPITAL} />
        <StatCard label="Capital Ratio" value="10.86%" trend="up" trendValue="+0.16%" color="#6B8F71" sparkline={SPARKLINE_CAPITAL_RATIO} />
        <StatCard label="Risk Score" value="2.1 (Low)" trend="down" trendValue="-0.7" color="#6B8F71" sparkline={SPARKLINE_RISK_SCORE} />
        <StatCard label="Stress Test Pass" value="Yes" trend="up" trendValue="All scenarios" color="#6B8F71" sparkline={SPARKLINE_STRESS} />
      </div>

      {/* Risk Capital Allocation Waterfall */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Risk Capital Allocation ($M)</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Breakdown by risk category contributing to total capital requirement</p>
        <WaterfallChart data={WATERFALL_DATA} height={280} />
      </div>

      {/* Concentration by Industry */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Concentration by Industry (%)</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Loan portfolio exposure by industry sector</p>
        <BarChart data={CONCENTRATION_DATA} unit="%" />
      </div>

      {/* Interest Rate Scenarios */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Interest Rate Scenario Impact on NIM</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>
          Baseline (3.12%) with +100bps to +300bps stress band over 12 months
        </p>
        <ConfidenceBand data={NIM_SCENARIOS} color="#475569" height={200} />
        <div className="flex gap-6 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5" style={{ backgroundColor: '#475569' }} />
            <span className="text-[10px]" style={{ color: '#57534E' }}>Baseline NIM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 border-t border-dashed" style={{ borderColor: '#475569' }} />
            <span className="text-[10px]" style={{ color: '#57534E' }}>+100bps / +300bps Band</span>
          </div>
        </div>
      </div>
    </>
  );
}
