'use client';

import { StatCard, BarChart, AreaChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const CHANNEL_MIX = [
  { label: 'ACH — $1.89M (45%)', value: 1890, color: '#475569' },
  { label: 'Card — $1.26M (30%)', value: 1260, color: '#B87333' },
  { label: 'Wire — $630K (15%)', value: 630, color: '#6B8F71' },
  { label: 'FedNow — $420K (10%)', value: 420, color: '#64748B' },
];

const DAILY_VOLUME = [
  { label: 'Mar 1', value: 3800 },
  { label: 'Mar 2', value: 3500 },
  { label: 'Mar 3', value: 3200 },
  { label: 'Mar 4', value: 4100 },
  { label: 'Mar 5', value: 4400 },
  { label: 'Mar 6', value: 4600 },
  { label: 'Mar 7', value: 4300 },
  { label: 'Mar 8', value: 3900 },
  { label: 'Mar 9', value: 3600 },
  { label: 'Mar 10', value: 4200 },
  { label: 'Mar 11', value: 4500 },
  { label: 'Mar 12', value: 4800 },
  { label: 'Mar 13', value: 5100 },
  { label: 'Mar 14', value: 4700 },
  { label: 'Mar 15', value: 4400 },
  { label: 'Mar 16', value: 4100 },
  { label: 'Mar 17', value: 3800 },
  { label: 'Mar 18', value: 4200 },
  { label: 'Mar 19', value: 4600 },
  { label: 'Mar 20', value: 4900 },
  { label: 'Mar 21', value: 4500 },
  { label: 'Mar 22', value: 4200 },
  { label: 'Mar 23', value: 3900 },
  { label: 'Mar 24', value: 4300 },
  { label: 'Mar 25', value: 4700 },
  { label: 'Mar 26', value: 5000 },
  { label: 'Mar 27', value: 4800 },
  { label: 'Mar 28', value: 4500 },
  { label: 'Mar 29', value: 4100 },
  { label: 'Mar 30', value: 4200 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function PaymentOperations() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Payment Operations</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Real-time payment processing, channel mix, and volume analytics
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Daily Volume" value="$4.2M" trend="up" trendValue="+6.8%" color="#475569" />
        <StatCard label="Success Rate" value="99.7%" trend="up" trendValue="+0.1%" color="#6B8F71" />
        <StatCard label="Avg Processing" value="1.2s" trend="down" trendValue="-0.3s" color="#B87333" />
        <StatCard label="Disputes Open" value="34" trend="down" trendValue="-8 vs last month" color="#B91C1C" />
      </div>

      {/* Channel Mix */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Payment Channel Mix ($K)</h2>
        <BarChart data={CHANNEL_MIX} unit="K" />
      </div>

      {/* Daily Payment Volume Trend */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Daily Payment Volume &mdash; 30 Day Trend ($K)</h2>
        <AreaChart data={DAILY_VOLUME} color="#475569" height={240} />
      </div>
    </>
  );
}
