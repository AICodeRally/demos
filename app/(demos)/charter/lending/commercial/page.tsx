'use client';

import { StatCard, TreeMap, BarChart, DonutChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const INDUSTRY_EXPOSURE = [
  { label: 'Healthcare', value: 22, color: '#475569' },
  { label: 'Manufacturing', value: 18, color: '#B87333' },
  { label: 'Retail', value: 16, color: '#64748B' },
  { label: 'Construction', value: 14, color: '#6B8F71' },
  { label: 'Prof. Services', value: 12, color: '#0D9488' },
  { label: 'Hospitality', value: 10, color: '#7C3AED' },
  { label: 'Other', value: 8, color: '#A8A29E' },
];

const SBA_PARTICIPATION = [
  { label: 'Q1 2025', value: 68, color: '#475569' },
  { label: 'Q2 2025', value: 72, color: '#475569' },
  { label: 'Q3 2025', value: 78, color: '#475569' },
  { label: 'Q4 2025', value: 84, color: '#B87333' },
];

const GUARANTEE_UTILIZATION = [
  { label: 'Fully Guaranteed', value: 45, color: '#6B8F71' },
  { label: 'Partially Guaranteed', value: 35, color: '#B87333' },
  { label: 'Unguaranteed', value: 20, color: '#475569' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function SBACommercial() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>SBA & Commercial</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Commercial lending portfolio, SBA participation, and industry concentration
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Commercial Portfolio" value="$112M" trend="up" trendValue="+7.2% YoY" color="#475569" />
        <StatCard label="SBA Loans Active" value="84" trend="up" trendValue="+12 this quarter" color="#B87333" />
        <StatCard label="Avg Loan Size" value="$420K" trend="up" trendValue="+$15K" color="#475569" />
        <StatCard label="Default Rate" value="1.1%" trend="down" trendValue="-20bps" color="#6B8F71" />
      </div>

      {/* Industry Exposure TreeMap */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Industry Concentration (%)</h2>
        <TreeMap data={INDUSTRY_EXPOSURE} />
      </div>

      {/* SBA Participation + Guarantee Donut */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>SBA Participation Rate by Quarter (%)</h2>
          <BarChart data={SBA_PARTICIPATION} unit="%" maxVal={100} />
        </div>
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Guarantee Utilization</h2>
          <DonutChart segments={GUARANTEE_UTILIZATION} centerValue="84" centerLabel="SBA Loans" size={200} />
        </div>
      </div>
    </>
  );
}
