'use client';

import { StatCard, BubbleChart, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const MERCHANT_SPEND = [
  { x: 20, y: 80, size: 100, color: '#475569', label: 'Grocery $12.4M' },
  { x: 45, y: 65, size: 66, color: '#B87333', label: 'Gas $8.2M' },
  { x: 70, y: 50, size: 55, color: '#6B8F71', label: 'Restaurants $6.8M' },
  { x: 30, y: 35, size: 44, color: '#64748B', label: 'Retail $5.4M' },
  { x: 80, y: 25, size: 26, color: '#7C3AED', label: 'Travel $3.2M' },
  { x: 55, y: 85, size: 17, color: '#0D9488', label: 'Entertainment $2.1M' },
];

const INTERCHANGE_REVENUE = [
  { label: 'Apr', value: 192, color: '#475569' },
  { label: 'May', value: 205, color: '#475569' },
  { label: 'Jun', value: 218, color: '#475569' },
  { label: 'Jul', value: 234, color: '#475569' },
  { label: 'Aug', value: 248, color: '#475569' },
  { label: 'Sep', value: 256, color: '#475569' },
  { label: 'Oct', value: 268, color: '#475569' },
  { label: 'Nov', value: 285, color: '#B87333' },
  { label: 'Dec', value: 320, color: '#B87333' },
  { label: 'Jan', value: 275, color: '#475569' },
  { label: 'Feb', value: 290, color: '#475569' },
  { label: 'Mar', value: 304, color: '#B87333' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function CardServices() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Card Services</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Card portfolio performance, merchant spend, and interchange revenue
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Portfolio" value="89K Cards" trend="up" trendValue="+3.2%" color="#475569" />
        <StatCard label="Activation Rate" value="82%" trend="up" trendValue="+1.8%" color="#6B8F71" />
        <StatCard label="Fraud Rate" value="0.04%" trend="down" trendValue="-0.01%" color="#B91C1C" />
        <StatCard label="Reward Redemption" value="$340K" trend="up" trendValue="+15% QoQ" color="#B87333" />
      </div>

      {/* Merchant Category Spend */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Merchant Category Spend</h2>
        <BubbleChart
          data={MERCHANT_SPEND}
          xLabel="Transaction Frequency"
          yLabel="Avg Ticket Size"
          height={320}
        />
      </div>

      {/* Interchange Revenue */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Interchange Revenue by Month ($K)</h2>
        <BarChart data={INTERCHANGE_REVENUE} unit="K" />
      </div>
    </>
  );
}
