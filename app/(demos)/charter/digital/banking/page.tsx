'use client';

import { StatCard, AreaChart, DonutChart, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const DIGITAL_VS_BRANCH = [
  { label: 'Apr', value: 52000 },
  { label: 'May', value: 54000 },
  { label: 'Jun', value: 56000 },
  { label: 'Jul', value: 58000 },
  { label: 'Aug', value: 61000 },
  { label: 'Sep', value: 63000 },
  { label: 'Oct', value: 66000 },
  { label: 'Nov', value: 69000 },
  { label: 'Dec', value: 71000 },
  { label: 'Jan', value: 73000 },
  { label: 'Feb', value: 76000 },
  { label: 'Mar', value: 78000 },
];

const BRANCH_TREND = [
  { label: 'Apr', value: 45000 },
  { label: 'May', value: 44000 },
  { label: 'Jun', value: 43000 },
  { label: 'Jul', value: 42000 },
  { label: 'Aug', value: 40000 },
  { label: 'Sep', value: 39000 },
  { label: 'Oct', value: 37000 },
  { label: 'Nov', value: 36000 },
  { label: 'Dec', value: 35000 },
  { label: 'Jan', value: 34000 },
  { label: 'Feb', value: 33000 },
  { label: 'Mar', value: 32000 },
];

const FEATURE_ADOPTION = [
  { label: 'Mobile Deposit', value: 78, color: '#475569' },
  { label: 'Bill Pay', value: 65, color: '#B87333' },
  { label: 'P2P Transfers', value: 52, color: '#6B8F71' },
  { label: 'Alert Subscriptions', value: 88, color: '#64748B' },
];

const SESSIONS_BY_MONTH = [
  { label: 'Oct — Mobile', value: 68, color: '#475569' },
  { label: 'Oct — Desktop', value: 32, color: '#B87333' },
  { label: 'Nov — Mobile', value: 70, color: '#475569' },
  { label: 'Nov — Desktop', value: 30, color: '#B87333' },
  { label: 'Dec — Mobile', value: 69, color: '#475569' },
  { label: 'Dec — Desktop', value: 31, color: '#B87333' },
  { label: 'Jan — Mobile', value: 72, color: '#475569' },
  { label: 'Jan — Desktop', value: 28, color: '#B87333' },
  { label: 'Feb — Mobile', value: 74, color: '#475569' },
  { label: 'Feb — Desktop', value: 26, color: '#B87333' },
  { label: 'Mar — Mobile', value: 76, color: '#475569' },
  { label: 'Mar — Desktop', value: 24, color: '#B87333' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function DigitalBanking() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Digital Banking</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Digital channel adoption, engagement metrics, and feature utilization
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Daily Active Users" value="28,400" trend="up" trendValue="+12.3%" color="#475569" />
        <StatCard label="Mobile Sessions" value="72%" trend="up" trendValue="+4% YoY" color="#B87333" />
        <StatCard label="Avg Session" value="4.2 min" trend="up" trendValue="+0.6 min" color="#6B8F71" />
        <StatCard label="Support Tickets" value="18/day" trend="down" trendValue="-22% vs Q4" color="#475569" />
      </div>

      {/* Digital vs Branch Transaction Trend */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Transaction Trend &mdash; Digital vs Branch</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: '#475569' }}>Digital Transactions (rising)</p>
            <AreaChart data={DIGITAL_VS_BRANCH} color="#475569" height={200} />
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: '#B87333' }}>Branch Transactions (declining)</p>
            <AreaChart data={BRANCH_TREND} color="#B87333" height={200} />
          </div>
        </div>
      </div>

      {/* Feature Adoption + Sessions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Feature Adoption Donut */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Feature Adoption (%)</h2>
          <DonutChart
            segments={FEATURE_ADOPTION}
            centerValue="71%"
            centerLabel="Average"
          />
        </div>

        {/* Mobile vs Desktop Sessions */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Mobile vs Desktop Sessions (6 months, %)</h2>
          <BarChart data={SESSIONS_BY_MONTH} unit="%" />
        </div>
      </div>
    </>
  );
}
