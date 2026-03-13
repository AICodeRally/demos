'use client';

import { StatCard, ConfidenceBand, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const LATENCY_24H = [
  { label: '12 AM', value: 4.2, low: 3.1, high: 16.5 },
  { label: '1 AM', value: 3.8, low: 2.8, high: 15.2 },
  { label: '2 AM', value: 3.5, low: 2.6, high: 14.8 },
  { label: '3 AM', value: 3.2, low: 2.4, high: 14.1 },
  { label: '4 AM', value: 3.0, low: 2.3, high: 13.8 },
  { label: '5 AM', value: 3.4, low: 2.5, high: 14.5 },
  { label: '6 AM', value: 3.8, low: 2.9, high: 15.8 },
  { label: '7 AM', value: 4.2, low: 3.2, high: 17.2 },
  { label: '8 AM', value: 4.8, low: 3.6, high: 19.4 },
  { label: '9 AM', value: 5.2, low: 3.9, high: 21.1 },
  { label: '10 AM', value: 5.0, low: 3.8, high: 20.5 },
  { label: '11 AM', value: 4.8, low: 3.6, high: 19.8 },
  { label: '12 PM', value: 5.1, low: 3.8, high: 21.5 },
  { label: '1 PM', value: 4.9, low: 3.7, high: 20.2 },
  { label: '2 PM', value: 4.6, low: 3.5, high: 19.0 },
  { label: '3 PM', value: 4.4, low: 3.3, high: 18.4 },
  { label: '4 PM', value: 4.8, low: 3.6, high: 19.6 },
  { label: '5 PM', value: 5.0, low: 3.8, high: 20.8 },
  { label: '6 PM', value: 4.6, low: 3.4, high: 18.9 },
  { label: '7 PM', value: 4.2, low: 3.2, high: 17.4 },
  { label: '8 PM', value: 3.9, low: 3.0, high: 16.2 },
  { label: '9 PM', value: 3.6, low: 2.8, high: 15.5 },
  { label: '10 PM', value: 3.4, low: 2.6, high: 15.0 },
  { label: '11 PM', value: 3.2, low: 2.5, high: 14.6 },
];

const DAILY_FEDNOW_VOLUME = [
  { label: 'Feb 18', value: 1420, color: '#475569' },
  { label: 'Feb 19', value: 1580, color: '#475569' },
  { label: 'Feb 20', value: 1750, color: '#475569' },
  { label: 'Feb 21', value: 1890, color: '#475569' },
  { label: 'Feb 22', value: 1200, color: '#475569' },
  { label: 'Feb 23', value: 1350, color: '#475569' },
  { label: 'Feb 24', value: 1680, color: '#475569' },
  { label: 'Feb 25', value: 1920, color: '#B87333' },
  { label: 'Feb 26', value: 2100, color: '#B87333' },
  { label: 'Feb 27', value: 2050, color: '#B87333' },
  { label: 'Feb 28', value: 1850, color: '#475569' },
  { label: 'Mar 1', value: 1780, color: '#475569' },
  { label: 'Mar 2', value: 2240, color: '#B87333' },
  { label: 'Mar 3', value: 2400, color: '#B87333' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function FedNowDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>FedNow Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Instant payment settlement, latency monitoring, and enrollment metrics
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Enrolled Members" value="42K" trend="up" trendValue="+2.4K this quarter" color="#475569" />
        <StatCard label="Success Rate" value="99.92%" trend="up" trendValue="+0.03%" color="#6B8F71" />
        <StatCard label="Avg Settlement" value="8.3s" trend="down" trendValue="-1.2s vs Q4" color="#B87333" />
        <StatCard label="Daily Volume" value="$1.8M" trend="up" trendValue="+34% YoY" color="#475569" />
      </div>

      {/* Transaction Latency Confidence Band */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Transaction Latency (seconds) &mdash; 24 Hour View</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>
          P50 (center line), P95/P99 (band boundaries)
        </p>
        <ConfidenceBand data={LATENCY_24H} color="#475569" height={220} />
      </div>

      {/* Daily FedNow Volume */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Daily FedNow Volume &mdash; 14 Days ($K)</h2>
        <BarChart data={DAILY_FEDNOW_VOLUME} unit="K" />
      </div>
    </>
  );
}
