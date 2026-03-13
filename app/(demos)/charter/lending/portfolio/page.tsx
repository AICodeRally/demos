'use client';

import { StatCard, DonutChart, BarChart, AreaChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const LOAN_MIX = [
  { label: 'Auto Loans', value: 490, color: '#475569' },
  { label: 'Mortgages', value: 420, color: '#B87333' },
  { label: 'Personal', value: 210, color: '#64748B' },
  { label: 'HELOC', value: 168, color: '#6B8F71' },
  { label: 'Commercial', value: 112, color: '#0D9488' },
];

const DELINQUENCY_BY_PRODUCT = [
  { label: 'Auto', value: 0.8, color: '#475569' },
  { label: 'Mortgage', value: 0.4, color: '#B87333' },
  { label: 'Personal', value: 1.2, color: '#64748B' },
  { label: 'HELOC', value: 0.6, color: '#6B8F71' },
  { label: 'Commercial', value: 0.9, color: '#0D9488' },
];

const NPL_TREND = [
  { label: 'Apr', value: 0.82 },
  { label: 'May', value: 0.80 },
  { label: 'Jun', value: 0.79 },
  { label: 'Jul', value: 0.78 },
  { label: 'Aug', value: 0.76 },
  { label: 'Sep', value: 0.74 },
  { label: 'Oct', value: 0.73 },
  { label: 'Nov', value: 0.72 },
  { label: 'Dec', value: 0.71 },
  { label: 'Jan', value: 0.70 },
  { label: 'Feb', value: 0.69 },
  { label: 'Mar', value: 0.68 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function PortfolioHealth() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Portfolio Health</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Loan portfolio composition, performance, and risk metrics
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Portfolio" value="$1.4B" trend="up" trendValue="+3.2% YoY" color="#475569" />
        <StatCard label="Weighted Avg Rate" value="5.82%" trend="up" trendValue="+18bps" color="#B87333" />
        <StatCard label="NPL Ratio" value="0.68%" trend="down" trendValue="-14bps" color="#6B8F71" />
        <StatCard label="Charge-off Rate" value="0.42%" trend="down" trendValue="-5bps" color="#6B8F71" />
      </div>

      {/* Loan Mix Donut + Delinquency Bar */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Loan Mix ($M)</h2>
          <DonutChart segments={LOAN_MIX} centerValue="$1.4B" centerLabel="Total" size={200} />
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Delinquency by Product (%)</h2>
          <BarChart data={DELINQUENCY_BY_PRODUCT} unit="%" maxVal={1.5} />
        </div>
      </div>

      {/* NPL Trend */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>12-Month NPL Trend</h2>
          <span className="text-xs tabular-nums" style={{ color: '#6B8F71' }}>Target: &lt; 0.75%</span>
        </div>
        <AreaChart data={NPL_TREND} color="#475569" height={200} />
      </div>
    </>
  );
}
