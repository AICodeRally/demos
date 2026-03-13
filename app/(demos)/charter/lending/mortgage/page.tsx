'use client';

import { StatCard, WaterfallChart, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const MORTGAGE_REVENUE = [
  { label: 'Origination', value: 2100000, type: 'add' as const },
  { label: 'Servicing', value: 1800000, type: 'add' as const },
  { label: 'Secondary Mkt', value: 900000, type: 'add' as const },
  { label: 'Ancillary', value: 300000, type: 'subtract' as const },
  { label: 'Total Revenue', value: 0, type: 'total' as const },
];

const ORIGINATION_VOLUME = [
  { label: 'Apr', value: 24, color: '#475569' },
  { label: 'May', value: 28, color: '#475569' },
  { label: 'Jun', value: 35, color: '#475569' },
  { label: 'Jul', value: 38, color: '#475569' },
  { label: 'Aug', value: 42, color: '#B87333' },
  { label: 'Sep', value: 36, color: '#475569' },
  { label: 'Oct', value: 30, color: '#475569' },
  { label: 'Nov', value: 22, color: '#475569' },
  { label: 'Dec', value: 18, color: '#475569' },
  { label: 'Jan', value: 20, color: '#475569' },
  { label: 'Feb', value: 26, color: '#475569' },
  { label: 'Mar', value: 32, color: '#475569' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function MortgageCenter() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Mortgage Center</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Rate lock pipeline, origination metrics, and revenue analysis
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Rate Lock Pipeline" value="$28M" trend="up" trendValue="+15%" color="#475569" />
        <StatCard label="Avg Rate" value="6.75%" trend="up" trendValue="+12bps" color="#B87333" />
        <StatCard label="Apps in Progress" value="142" trend="up" trendValue="+18 this week" color="#475569" />
        <StatCard label="Avg Days to Close" value="38" trend="down" trendValue="-4 days" color="#6B8F71" />
      </div>

      {/* Mortgage Revenue Waterfall */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Mortgage Revenue Breakdown</h2>
        <WaterfallChart data={MORTGAGE_REVENUE} height={280} />
      </div>

      {/* Origination Volume */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Origination Volume by Month ($M)</h2>
          <span className="text-xs tabular-nums" style={{ color: '#B87333' }}>Peak: Aug $42M</span>
        </div>
        <BarChart data={ORIGINATION_VOLUME} unit="M" maxVal={50} />
      </div>
    </>
  );
}
