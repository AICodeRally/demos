'use client';

import { useState } from 'react';
import { StatCard, AreaChart, BarChart, DonutChart, FormatSelector } from '@/components/demos/crestline';
import { TransactionFeed, type Transaction } from '@/components/demos/register/TransactionFeed';
import { TRANSACTIONS, COLORS, FORMATS } from '@/data/crestline';

/* -- Format-specific floor zones ----------------------- */

const FORMAT_ZONES: Record<string, { id: string; name: string; x: number; y: number; w: number; h: number; color: string; reps: number }[]> = {
  flagship: [
    { id: 'designer', name: 'Designer Gallery', x: 10, y: 10, w: 25, h: 35, color: '#7c3aed', reps: 4 },
    { id: 'cosmetics', name: 'Cosmetics Bar', x: 10, y: 55, w: 25, h: 38, color: '#d946ef', reps: 3 },
    { id: 'shoes', name: 'Shoes Salon', x: 40, y: 10, w: 25, h: 35, color: '#2563eb', reps: 3 },
    { id: 'accessories', name: 'Accessories', x: 40, y: 55, w: 25, h: 38, color: '#c9a84c', reps: 2 },
    { id: 'home', name: 'Home', x: 70, y: 10, w: 18, h: 35, color: '#059669', reps: 2 },
    { id: 'vip', name: 'VIP Lounge', x: 70, y: 55, w: 18, h: 18, color: '#1a1f3d', reps: 1 },
    { id: 'checkout', name: 'Checkout', x: 70, y: 78, w: 18, h: 15, color: '#94a3b8', reps: 1 },
  ],
  standard: [
    { id: 'apparel', name: 'Apparel', x: 10, y: 10, w: 30, h: 40, color: '#7c3aed', reps: 3 },
    { id: 'cosmetics', name: 'Cosmetics', x: 10, y: 55, w: 30, h: 38, color: '#d946ef', reps: 2 },
    { id: 'shoes', name: 'Shoes', x: 45, y: 10, w: 22, h: 40, color: '#2563eb', reps: 2 },
    { id: 'accessories', name: 'Accessories', x: 45, y: 55, w: 22, h: 38, color: '#c9a84c', reps: 2 },
    { id: 'home', name: 'Home', x: 72, y: 10, w: 18, h: 35, color: '#059669', reps: 1 },
    { id: 'checkout', name: 'Checkout', x: 72, y: 55, w: 18, h: 20, color: '#94a3b8', reps: 1 },
  ],
  rack: [
    { id: 'clearance', name: 'Clearance Floor', x: 10, y: 10, w: 35, h: 40, color: '#059669', reps: 3 },
    { id: 'offprice', name: 'Off-Price Apparel', x: 10, y: 55, w: 35, h: 38, color: '#7c3aed', reps: 3 },
    { id: 'shoes', name: 'Shoes', x: 50, y: 10, w: 20, h: 40, color: '#2563eb', reps: 2 },
    { id: 'accessories', name: 'Accessories', x: 50, y: 55, w: 20, h: 38, color: '#c9a84c', reps: 1 },
    { id: 'checkout', name: 'Checkout', x: 75, y: 30, w: 15, h: 30, color: '#94a3b8', reps: 1 },
  ],
  counter: [
    { id: 'beauty', name: 'Beauty Counter', x: 15, y: 15, w: 30, h: 35, color: '#d946ef', reps: 2 },
    { id: 'fragrance', name: 'Fragrance', x: 15, y: 58, w: 30, h: 30, color: '#7c3aed', reps: 2 },
    { id: 'gifts', name: 'Gift Sets', x: 50, y: 15, w: 20, h: 35, color: '#c9a84c', reps: 1 },
    { id: 'checkout', name: 'Checkout', x: 50, y: 58, w: 20, h: 30, color: '#94a3b8', reps: 1 },
  ],
};

/* -- Format-specific stats ----------------------------- */

const FORMAT_STATS: Record<string, {
  revenue: string; revSparkline: number[];
  transactions: string; txSparkline: number[];
  avgTransaction: string; avgTxTrend: string;
  activeReps: string;
  activeZones: string;
  conversion: string; convTrend: string;
}> = {
  flagship: {
    revenue: '$98.4K', revSparkline: [12, 18, 22, 28, 35, 42, 56, 68, 78, 92, 98],
    transactions: '142', txSparkline: [8, 12, 18, 24, 32, 38, 48, 62, 85, 110, 142],
    avgTransaction: '$693', avgTxTrend: '+$38 vs avg',
    activeReps: '12 / 14', activeZones: '7 / 7', conversion: '34%', convTrend: '+2.1%',
  },
  standard: {
    revenue: '$62.1K', revSparkline: [8, 12, 16, 22, 28, 34, 40, 48, 54, 58, 62],
    transactions: '108', txSparkline: [6, 10, 14, 20, 28, 36, 44, 56, 72, 90, 108],
    avgTransaction: '$575', avgTxTrend: '+$22 vs avg',
    activeReps: '8 / 10', activeZones: '6 / 6', conversion: '28%', convTrend: '+1.4%',
  },
  rack: {
    revenue: '$34.8K', revSparkline: [4, 7, 10, 14, 18, 22, 25, 28, 30, 32, 35],
    transactions: '186', txSparkline: [10, 18, 28, 40, 55, 72, 90, 110, 140, 165, 186],
    avgTransaction: '$187', avgTxTrend: '+$12 vs avg',
    activeReps: '6 / 8', activeZones: '5 / 5', conversion: '42%', convTrend: '+3.8%',
  },
  counter: {
    revenue: '$18.6K', revSparkline: [2, 3, 5, 7, 9, 11, 13, 15, 16, 17, 19],
    transactions: '64', txSparkline: [4, 8, 12, 18, 24, 30, 38, 44, 52, 58, 64],
    avgTransaction: '$291', avgTxTrend: '+$18 vs avg',
    activeReps: '4 / 5', activeZones: '4 / 4', conversion: '38%', convTrend: '+2.4%',
  },
};

/* -- Peak hours by format ------------------------------ */

const PEAK_HOURS: Record<string, { label: string; value: number }[]> = {
  flagship: [
    { label: '9a', value: 18 }, { label: '10a', value: 42 }, { label: '11a', value: 68 },
    { label: '12p', value: 55 }, { label: '1p', value: 62 }, { label: '2p', value: 78 },
    { label: '3p', value: 85 }, { label: '4p', value: 72 }, { label: '5p', value: 58 },
    { label: '6p', value: 48 }, { label: '7p', value: 35 }, { label: '8p', value: 22 },
  ],
  standard: [
    { label: '9a', value: 12 }, { label: '10a', value: 32 }, { label: '11a', value: 52 },
    { label: '12p', value: 45 }, { label: '1p', value: 48 }, { label: '2p', value: 58 },
    { label: '3p', value: 65 }, { label: '4p', value: 55 }, { label: '5p', value: 42 },
    { label: '6p', value: 35 }, { label: '7p', value: 25 }, { label: '8p', value: 15 },
  ],
  rack: [
    { label: '9a', value: 22 }, { label: '10a', value: 48 }, { label: '11a', value: 72 },
    { label: '12p', value: 65 }, { label: '1p', value: 55 }, { label: '2p', value: 68 },
    { label: '3p', value: 78 }, { label: '4p', value: 62 }, { label: '5p', value: 45 },
    { label: '6p', value: 32 }, { label: '7p', value: 20 }, { label: '8p', value: 10 },
  ],
  counter: [
    { label: '10a', value: 15 }, { label: '11a', value: 28 }, { label: '12p', value: 42 },
    { label: '1p', value: 35 }, { label: '2p', value: 48 }, { label: '3p', value: 55 },
    { label: '4p', value: 50 }, { label: '5p', value: 38 }, { label: '6p', value: 25 },
    { label: '7p', value: 12 },
  ],
};

/* -- Hourly sales curve by format ---------------------- */

const HOURLY_SALES: Record<string, { label: string; value: number }[]> = {
  flagship: [
    { label: '9AM', value: 2.4 }, { label: '10AM', value: 5.8 }, { label: '11AM', value: 9.2 },
    { label: '12PM', value: 7.6 }, { label: '1PM', value: 8.8 }, { label: '2PM', value: 11.4 },
    { label: '3PM', value: 13.2 }, { label: '4PM', value: 10.8 }, { label: '5PM', value: 9.4 },
    { label: '6PM', value: 8.2 }, { label: '7PM', value: 6.8 }, { label: '8PM', value: 4.2 },
    { label: '9PM', value: 2.1 },
  ],
  standard: [
    { label: '9AM', value: 1.6 }, { label: '10AM', value: 3.8 }, { label: '11AM', value: 6.4 },
    { label: '12PM', value: 5.2 }, { label: '1PM', value: 5.8 }, { label: '2PM', value: 7.6 },
    { label: '3PM', value: 8.8 }, { label: '4PM', value: 7.2 }, { label: '5PM', value: 6.1 },
    { label: '6PM', value: 5.4 }, { label: '7PM', value: 4.2 }, { label: '8PM', value: 2.8 },
    { label: '9PM', value: 1.2 },
  ],
  rack: [
    { label: '9AM', value: 0.8 }, { label: '10AM', value: 2.4 }, { label: '11AM', value: 4.2 },
    { label: '12PM', value: 3.6 }, { label: '1PM', value: 3.2 }, { label: '2PM', value: 4.8 },
    { label: '3PM', value: 5.6 }, { label: '4PM', value: 4.4 }, { label: '5PM', value: 3.2 },
    { label: '6PM', value: 2.4 }, { label: '7PM', value: 1.6 }, { label: '8PM', value: 0.6 },
  ],
  counter: [
    { label: '10AM', value: 0.6 }, { label: '11AM', value: 1.4 }, { label: '12PM', value: 2.2 },
    { label: '1PM', value: 1.8 }, { label: '2PM', value: 2.6 }, { label: '3PM', value: 3.2 },
    { label: '4PM', value: 2.8 }, { label: '5PM', value: 2.0 }, { label: '6PM', value: 1.2 },
    { label: '7PM', value: 0.5 },
  ],
};

/* -- Adapt transactions to TransactionFeed shape -------- */

const FEED_TRANSACTIONS: Transaction[] = TRANSACTIONS.map((tx) => ({
  time: tx.time,
  rep: tx.rep.split(' ')[0] + ' ' + tx.rep.split(' ')[1][0] + '.',
  items: tx.items.join(', '),
  total: `$${tx.total.toLocaleString()}`,
  commission: `$${tx.commission}`,
  method: tx.method as Transaction['method'],
}));

/* -- Revenue by department (format-aware) --------------- */

const DEPT_REVENUE: Record<string, { label: string; value: number; color: string }[]> = {
  flagship: [
    { label: 'Designer', value: 28.4, color: '#7c3aed' },
    { label: 'Cosmetics', value: 22.6, color: '#d946ef' },
    { label: 'Shoes', value: 18.2, color: '#2563eb' },
    { label: 'Accessories', value: 16.8, color: '#c9a84c' },
    { label: 'Home', value: 12.4, color: '#059669' },
  ],
  standard: [
    { label: 'Apparel', value: 18.2, color: '#7c3aed' },
    { label: 'Cosmetics', value: 14.8, color: '#d946ef' },
    { label: 'Shoes', value: 12.6, color: '#2563eb' },
    { label: 'Accessories', value: 10.2, color: '#c9a84c' },
    { label: 'Home', value: 6.3, color: '#059669' },
  ],
  rack: [
    { label: 'Clearance', value: 12.8, color: '#059669' },
    { label: 'Off-Price', value: 10.4, color: '#7c3aed' },
    { label: 'Shoes', value: 6.8, color: '#2563eb' },
    { label: 'Accessories', value: 4.8, color: '#c9a84c' },
  ],
  counter: [
    { label: 'Beauty', value: 8.2, color: '#d946ef' },
    { label: 'Fragrance', value: 5.6, color: '#7c3aed' },
    { label: 'Gift Sets', value: 3.2, color: '#c9a84c' },
    { label: 'Other', value: 1.6, color: '#94a3b8' },
  ],
};

/* -- Payment mix ---------------------------------------- */

const PAYMENT_MIX = [
  { label: 'Credit', value: 62, color: COLORS.primary },
  { label: 'Debit', value: 18, color: '#2563eb' },
  { label: 'Cash', value: 8, color: '#059669' },
  { label: 'Financing', value: 12, color: '#7c3aed' },
];

/* -- Live alerts ---------------------------------------- */

const ALERTS = [
  { message: 'Elena V. just closed a $2,780 Burberry + Gucci sale!', color: '#10B981', bg: '#D1FAE5' },
  { message: 'Designer Launch SPIFF: $75 per Burberry Spring unit', color: '#7c3aed', bg: '#EDE9FE' },
  { message: 'Fragrance Gift Set Bonus active through Mar 31', color: '#c9a84c', bg: '#FEF9C3' },
];

export default function FloorDashboard() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = FORMATS.find((f) => f.id === format);
  const stats = FORMAT_STATS[format];
  const zones = FORMAT_ZONES[format];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Floor Dashboard</h1>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse"
            style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
          >
            LIVE
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--pl-text-secondary)' }}>
          {currentFormat?.name ?? 'Flagship'} Format &mdash; Live View &mdash; {currentFormat?.avgStaff ?? 45} avg staff, {zones.length} zones
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Floor Map + Transaction Feed (hero row) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div className="col-span-3 rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
              Live Floor Layout &mdash; {currentFormat?.name ?? 'Flagship'}
            </p>
            <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
              {format === 'flagship' ? '48,000' : format === 'standard' ? '28,000' : format === 'rack' ? '18,000' : '4,500'} sq ft
            </span>
          </div>
          {/* Department store SVG floor map */}
          <svg viewBox="0 0 580 360" className="w-full" height={320}>
            <rect x="0" y="0" width="580" height="360" rx="8" fill="var(--pl-bg)" stroke="var(--pl-border)" />
            {zones.map((zone) => {
              const sx = zone.x * 5.2;
              const sy = zone.y * 3.2;
              const sw = zone.w * 5.2;
              const sh = zone.h * 3.2;
              return (
                <g key={zone.id}>
                  <rect x={sx} y={sy} width={sw} height={sh} rx="6" fill={`${zone.color}15`} stroke={`${zone.color}40`} strokeWidth="1.5" />
                  <text x={sx + sw / 2} y={sy + sh / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill={zone.color} fontSize="11" fontWeight="600">
                    {zone.name}
                  </text>
                  <text x={sx + sw / 2} y={sy + sh / 2 + 10} textAnchor="middle" dominantBaseline="middle" fill={zone.color} fontSize="9" opacity={0.7}>
                    {zone.reps} reps
                  </text>
                  {/* Subtle rep dots inside each zone */}
                  {Array.from({ length: zone.reps }).map((_, ri) => (
                    <circle
                      key={ri}
                      cx={sx + 12 + ri * 14}
                      cy={sy + sh - 12}
                      r="4"
                      fill={zone.color}
                      opacity={0.5}
                    />
                  ))}
                </g>
              );
            })}
            {/* Traffic arrows */}
            <defs>
              <marker id="arrowhead-c" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
              </marker>
            </defs>
            <path d="M 530 180 Q 480 120 370 60" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead-c)" opacity="0.6" />
            <path d="M 530 200 Q 460 240 370 260" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead-c)" opacity="0.6" />
            <path d="M 540 170 Q 500 80 300 30" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#arrowhead-c)" opacity="0.4" />
            {/* Entrance label */}
            <rect x="520" y="168" width="50" height="28" rx="4" fill="#1a1f3d" opacity="0.08" />
            <text x="545" y="186" textAnchor="middle" fill="var(--pl-text)" fontSize="10" fontWeight="600">Entry</text>
          </svg>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t flex-wrap" style={{ borderColor: 'var(--pl-stripe)' }}>
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${zone.color}20`, border: `1px solid ${zone.color}60` }} />
                <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>{zone.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span className="w-6 border-b border-dashed" style={{ borderColor: 'var(--pl-text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>Traffic Flow</span>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <TransactionFeed transactions={FEED_TRANSACTIONS} />
        </div>
      </div>

      {/* 6 StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <StatCard
          label="Today's Revenue"
          value={stats.revenue}
          sparkline={stats.revSparkline}
          color={COLORS.primary}
        />
        <StatCard
          label="Transactions"
          value={stats.transactions}
          sparkline={stats.txSparkline}
          color="#2563eb"
        />
        <StatCard
          label="Avg Transaction"
          value={stats.avgTransaction}
          trend="up"
          trendValue={stats.avgTxTrend}
          color={COLORS.accent}
        />
        <StatCard
          label="Conversion Rate"
          value={stats.conversion}
          trend="up"
          trendValue={stats.convTrend}
          color="#10B981"
        />
        <StatCard
          label="Active Zones"
          value={stats.activeZones}
          color="#7c3aed"
        />
        <StatCard
          label="Active Reps"
          value={stats.activeReps}
          color="#059669"
        />
        <StatCard
          label="Avg SPH"
          value={format === 'flagship' ? '$480' : format === 'standard' ? '$310' : format === 'rack' ? '$185' : '$240'}
          trend="up"
          trendValue={format === 'flagship' ? '+$22' : format === 'standard' ? '+$15' : format === 'rack' ? '+$8' : '+$12'}
          color={COLORS.accent}
        />
      </div>

      {/* Charts row 1: Hourly Sales + Revenue by Dept */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Hourly Sales Curve ($K) &mdash; {currentFormat?.name ?? 'Flagship'}
          </p>
          <AreaChart data={HOURLY_SALES[format]} color={COLORS.accent} />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Revenue by Department ($K)
          </p>
          <BarChart data={DEPT_REVENUE[format]} unit="K" />
        </div>
      </div>

      {/* Charts row 2: Peak Hours + Payment Mix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
              Peak Hours (Traffic Count)
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#EDE9FE', color: '#7c3aed' }}>
              {format === 'flagship' ? '3PM peak' : format === 'standard' ? '3PM peak' : format === 'rack' ? '3PM peak' : '3PM peak'}
            </span>
          </div>
          <BarChart data={PEAK_HOURS[format]} color="#7c3aed" />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Payment Method Mix
          </p>
          <div className="flex justify-center">
            <DonutChart segments={PAYMENT_MIX} centerValue={stats.transactions} centerLabel="txns" size={180} />
          </div>
        </div>
      </div>

      {/* Live Alerts Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ALERTS.map((alert, i) => (
          <div
            key={i}
            className="rounded-xl border px-5 py-4 flex items-start gap-3"
            style={{ backgroundColor: alert.bg, borderColor: `${alert.color}40` }}
          >
            <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: alert.color }} />
            <p className="text-sm font-medium leading-snug" style={{ color: alert.color }}>
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
