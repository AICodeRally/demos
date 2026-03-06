'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart, DonutChart, AreaChart } from '@/components/demos/register';
import { FloorLayoutMap } from '@/components/demos/register/FloorLayoutMap';
import { TransactionFeed, type Transaction } from '@/components/demos/register/TransactionFeed';
import { FORMAT_META, type FormatId } from '@/data/register/store-data';

/* ── Live transaction feed data ─────────────────────────── */

const TRANSACTIONS: Transaction[] = [
  { time: '2:47p', rep: 'Sarah J.', items: 'King Tempur-Pedic + Adj Base', total: '$4,290', commission: '$172', method: 'Financing' },
  { time: '2:38p', rep: 'Marcus W.', items: 'Queen Beautyrest + Pillows', total: '$1,640', commission: '$66', method: 'Credit' },
  { time: '2:31p', rep: 'Diana K.', items: 'King Purple Hybrid + Protector', total: '$3,890', commission: '$156', method: 'Financing' },
  { time: '2:24p', rep: 'James T.', items: 'Twin XL Sealy Posture (x2)', total: '$1,180', commission: '$47', method: 'Credit' },
  { time: '2:18p', rep: 'Sarah J.', items: 'Queen Stearns & Foster + Sheets', total: '$5,240', commission: '$210', method: 'Financing' },
  { time: '2:11p', rep: 'Raj P.', items: 'Pillow Pack (4) + Protector', total: '$340', commission: '$14', method: 'Cash' },
  { time: '2:04p', rep: 'Emily R.', items: 'Full Serta iComfort + Frame', total: '$2,180', commission: '$87', method: 'Credit' },
  { time: '1:52p', rep: 'Marcus W.', items: 'King Beautyrest Black + Adj Base', total: '$6,420', commission: '$257', method: 'Financing' },
  { time: '1:45p', rep: 'Diana K.', items: 'Queen Purple + Pillows + Sheets', total: '$2,890', commission: '$116', method: 'Digital' },
  { time: '1:38p', rep: 'James T.', items: 'Cal King Tempur-Adapt', total: '$2,490', commission: '$100', method: 'Credit' },
];

/* ── Hourly sales curve ──────────────────────────────────── */

const HOURLY_SALES: Record<FormatId, { label: string; value: number }[]> = {
  flagship: [
    { label: '8AM', value: 1.2 }, { label: '9AM', value: 3.8 }, { label: '10AM', value: 6.4 },
    { label: '11AM', value: 11.2 }, { label: '12PM', value: 8.6 }, { label: '1PM', value: 7.4 },
    { label: '2PM', value: 9.8 }, { label: '3PM', value: 12.1 }, { label: '4PM', value: 10.2 },
    { label: '5PM', value: 8.4 }, { label: '6PM', value: 7.8 }, { label: '7PM', value: 5.6 },
    { label: '8PM', value: 3.2 }, { label: '9PM', value: 1.4 },
  ],
  standard: [
    { label: '8AM', value: 0.8 }, { label: '9AM', value: 2.4 }, { label: '10AM', value: 4.2 },
    { label: '11AM', value: 7.8 }, { label: '12PM', value: 5.6 }, { label: '1PM', value: 4.8 },
    { label: '2PM', value: 6.2 }, { label: '3PM', value: 8.4 }, { label: '4PM', value: 7.1 },
    { label: '5PM', value: 5.8 }, { label: '6PM', value: 5.2 }, { label: '7PM', value: 3.8 },
    { label: '8PM', value: 2.1 }, { label: '9PM', value: 0.8 },
  ],
  outlet: [
    { label: '8AM', value: 0.4 }, { label: '9AM', value: 1.2 }, { label: '10AM', value: 2.8 },
    { label: '11AM', value: 4.2 }, { label: '12PM', value: 3.6 }, { label: '1PM', value: 3.0 },
    { label: '2PM', value: 3.8 }, { label: '3PM', value: 5.1 }, { label: '4PM', value: 4.4 },
    { label: '5PM', value: 3.2 }, { label: '6PM', value: 2.6 }, { label: '7PM', value: 1.8 },
    { label: '8PM', value: 0.8 }, { label: '9PM', value: 0.2 },
  ],
  'shop-in-shop': [
    { label: '10AM', value: 0.6 }, { label: '11AM', value: 1.8 }, { label: '12PM', value: 2.4 },
    { label: '1PM', value: 1.6 }, { label: '2PM', value: 2.2 }, { label: '3PM', value: 3.0 },
    { label: '4PM', value: 2.6 }, { label: '5PM', value: 2.0 }, { label: '6PM', value: 1.4 },
    { label: '7PM', value: 0.8 }, { label: '8PM', value: 0.4 }, { label: '9PM', value: 0.1 },
  ],
};

/* ── Revenue by zone ─────────────────────────────────────── */

const ZONE_REVENUE: Record<FormatId, { label: string; value: number; color?: string }[]> = {
  flagship: [
    { label: 'Mattresses', value: 42.8, color: '#1E3A5F' },
    { label: 'Adj. Bases', value: 18.4, color: '#06B6D4' },
    { label: 'Bedding', value: 12.2, color: '#10B981' },
    { label: 'Sleep Tech', value: 9.6, color: '#8B5CF6' },
    { label: 'Checkout', value: 6.0, color: '#EF4444' },
  ],
  standard: [
    { label: 'Mattresses', value: 36.2, color: '#1E3A5F' },
    { label: 'Adj. Bases', value: 12.8, color: '#06B6D4' },
    { label: 'Bedding', value: 10.4, color: '#10B981' },
    { label: 'Sleep Tech', value: 4.2, color: '#8B5CF6' },
    { label: 'Checkout', value: 3.8, color: '#EF4444' },
  ],
  outlet: [
    { label: 'Mattresses', value: 22.4, color: '#1E3A5F' },
    { label: 'Bases', value: 5.2, color: '#06B6D4' },
    { label: 'Bedding', value: 4.8, color: '#10B981' },
    { label: 'Sleep Tech', value: 0.8, color: '#8B5CF6' },
    { label: 'Checkout', value: 1.6, color: '#EF4444' },
  ],
  'shop-in-shop': [
    { label: 'Mattresses', value: 12.6, color: '#1E3A5F' },
    { label: 'Bases', value: 4.2, color: '#06B6D4' },
    { label: 'Bedding', value: 2.8, color: '#10B981' },
    { label: 'Sleep Tech', value: 0.6, color: '#8B5CF6' },
    { label: 'Checkout', value: 1.2, color: '#EF4444' },
  ],
};

/* ── Payment method mix ──────────────────────────────────── */

const PAYMENT_MIX = [
  { label: 'Credit', value: 55, color: '#1E3A5F' },
  { label: 'Financing', value: 30, color: '#8B5CF6' },
  { label: 'Cash', value: 10, color: '#10B981' },
  { label: 'Digital', value: 5, color: '#F59E0B' },
];

/* ── Format-specific stat values ─────────────────────────── */

const FORMAT_STATS: Record<FormatId, {
  transactions: string; txSparkline: number[];
  revenue: string; revSparkline: number[];
  asp: string;
  conversion: string; convTrend: string;
  traffic: string;
  activeReps: string;
}> = {
  flagship: {
    transactions: '47', txSparkline: [3, 5, 4, 6, 5, 7, 6, 8, 7],
    revenue: '$89K', revSparkline: [5, 8, 7, 12, 10, 15, 14, 18],
    asp: '$1,893',
    conversion: '34%', convTrend: '+2.1%',
    traffic: '138',
    activeReps: '6/8',
  },
  standard: {
    transactions: '32', txSparkline: [2, 4, 3, 5, 4, 5, 5, 6, 5],
    revenue: '$61K', revSparkline: [4, 6, 5, 9, 8, 11, 10, 13],
    asp: '$1,906',
    conversion: '28%', convTrend: '+1.4%',
    traffic: '114',
    activeReps: '5/6',
  },
  outlet: {
    transactions: '24', txSparkline: [3, 4, 5, 4, 6, 5, 7, 6, 5],
    revenue: '$29K', revSparkline: [3, 4, 5, 6, 5, 7, 6, 8],
    asp: '$1,208',
    conversion: '22%', convTrend: '+0.8%',
    traffic: '109',
    activeReps: '4/5',
  },
  'shop-in-shop': {
    transactions: '11', txSparkline: [1, 2, 1, 2, 2, 3, 2, 3, 2],
    revenue: '$18K', revSparkline: [2, 3, 2, 4, 3, 5, 4, 5],
    asp: '$1,636',
    conversion: '19%', convTrend: '+0.5%',
    traffic: '58',
    activeReps: '2/2',
  },
};

/* ── Live alerts ─────────────────────────────────────────── */

const ALERTS = [
  { message: 'Sarah J. just hit Tier 2 commission!', color: '#10B981', bg: '#D1FAE5', icon: '\u2B50' },
  { message: 'Purple SPIFF: $50 per King sold today', color: '#8B5CF6', bg: '#EDE9FE', icon: '\u26A1' },
  { message: 'Financing system delay \u2014 avg 3min wait', color: '#F59E0B', bg: '#FEF3C7', icon: '\u26A0\uFE0F' },
];

export default function FloorDashboard() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;
  const stats = FORMAT_STATS[currentFormat];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Floor Dashboard</h1>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse"
            style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
          >
            LIVE
          </span>
        </div>
        <p className="text-sm" style={{ color: '#475569' }}>
          Real-time store operations for {FORMAT_META[currentFormat].name} format &mdash; {FORMAT_META[currentFormat].stores} stores, {FORMAT_META[currentFormat].staff} avg staff
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Floor Map + Transaction Feed (hero row) */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="col-span-3 rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Live Floor Layout &mdash; {FORMAT_META[currentFormat].name}
            </p>
            <span className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
              {FORMAT_META[currentFormat].sqft.toLocaleString()} sq ft
            </span>
          </div>
          <FloorLayoutMap format={format} />
          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1E3A5F' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Rep on Floor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-6 border-b border-dashed" style={{ borderColor: '#94A3B8' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Traffic Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1E3A5F15', border: '1px solid #1E3A5F40' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>Zone</span>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <TransactionFeed transactions={TRANSACTIONS} />
        </div>
      </div>

      {/* 6 StatCards with sparklines */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <StatCard
          label="Transactions Today"
          value={stats.transactions}
          sparkline={stats.txSparkline}
          color="#1E3A5F"
        />
        <StatCard
          label="Revenue Today"
          value={stats.revenue}
          sparkline={stats.revSparkline}
          color="#06B6D4"
        />
        <StatCard
          label="Avg Sale Price"
          value={stats.asp}
          color="#8B5CF6"
        />
        <StatCard
          label="Conversion Rate"
          value={stats.conversion}
          trend="up"
          trendValue={stats.convTrend}
          color="#10B981"
        />
        <StatCard
          label="Floor Traffic"
          value={stats.traffic}
          color="#F59E0B"
        />
        <StatCard
          label="Active Reps"
          value={stats.activeReps}
          color="#1E3A5F"
        />
      </div>

      {/* Charts row: Hourly Sales + Revenue by Zone + Payment Mix */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Hourly Sales Curve ($K)
          </p>
          <AreaChart data={HOURLY_SALES[currentFormat]} color="#8B5CF6" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Revenue by Zone ($K)
          </p>
          <BarChart data={ZONE_REVENUE[currentFormat]} unit="K" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Payment Method Mix
          </p>
          <div className="flex justify-center">
            <DonutChart segments={PAYMENT_MIX} centerValue="47" centerLabel="txns" size={180} />
          </div>
        </div>
      </div>

      {/* Live Alerts Strip */}
      <div className="grid grid-cols-3 gap-4">
        {ALERTS.map((alert, i) => (
          <div
            key={i}
            className="rounded-xl border px-5 py-4 flex items-start gap-3"
            style={{ backgroundColor: alert.bg, borderColor: `${alert.color}40` }}
          >
            <span className="text-lg shrink-0">{alert.icon}</span>
            <p className="text-sm font-medium leading-snug" style={{ color: alert.color }}>
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
