'use client';

import { StatCard, AreaChart, BarChart, DonutChart } from '@/components/demos/crestline';
import { FloorLayoutMap } from '@/components/demos/register/FloorLayoutMap';
import { TransactionFeed, type Transaction } from '@/components/demos/register/TransactionFeed';
import { FLOOR_ZONES, TRANSACTIONS, SELLING_DEPTS, COLORS } from '@/data/crestline';

/* -- Adapt transactions to TransactionFeed shape -------- */

const FEED_TRANSACTIONS: Transaction[] = TRANSACTIONS.map((tx) => ({
  time: tx.time,
  rep: tx.rep.split(' ')[0] + ' ' + tx.rep.split(' ')[1][0] + '.',
  items: tx.items.join(', '),
  total: `$${tx.total.toLocaleString()}`,
  commission: `$${tx.commission}`,
  method: tx.method as Transaction['method'],
}));

/* -- Hourly sales curve (flagship store) ---------------- */

const HOURLY_SALES = [
  { label: '9AM', value: 2.4 }, { label: '10AM', value: 5.8 }, { label: '11AM', value: 9.2 },
  { label: '12PM', value: 7.6 }, { label: '1PM', value: 8.8 }, { label: '2PM', value: 11.4 },
  { label: '3PM', value: 13.2 }, { label: '4PM', value: 10.8 }, { label: '5PM', value: 9.4 },
  { label: '6PM', value: 8.2 }, { label: '7PM', value: 6.8 }, { label: '8PM', value: 4.2 },
  { label: '9PM', value: 2.1 },
];

/* -- Revenue by department ------------------------------ */

const DEPT_REVENUE = SELLING_DEPTS.map((d) => ({
  label: d.name.split(' ')[0],
  value: d.id === 'designer' ? 28.4 : d.id === 'cosmetics' ? 22.6 : d.id === 'shoes' ? 18.2 : d.id === 'accessories' ? 16.8 : 12.4,
  color: d.color,
}));

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
          Flagship Store F-001 &mdash; Live View &mdash; 14 reps, 5 departments
        </p>
      </div>

      {/* Floor Map + Transaction Feed (hero row) */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="col-span-3 rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Live Floor Layout &mdash; Flagship F-001
            </p>
            <span className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
              48,000 sq ft
            </span>
          </div>
          {/* Department store SVG floor map */}
          <svg viewBox="0 0 580 360" className="w-full" height={320}>
            <rect x="0" y="0" width="580" height="360" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
            {FLOOR_ZONES.map((zone) => {
              const sx = zone.x * 5.2;
              const sy = zone.y * 3.2;
              const sw = zone.w * 5.2;
              const sh = zone.h * 3.2;
              return (
                <g key={zone.id}>
                  <rect x={sx} y={sy} width={sw} height={sh} rx="6" fill={`${zone.color}15`} stroke={`${zone.color}40`} strokeWidth="1.5" />
                  <text x={sx + sw / 2} y={sy + sh / 2 - 6} textAnchor="middle" dominantBaseline="middle" fill={zone.color} fontSize="11" fontWeight="600">
                    {zone.name.split('&')[0].trim()}
                  </text>
                  <text x={sx + sw / 2} y={sy + sh / 2 + 10} textAnchor="middle" dominantBaseline="middle" fill={zone.color} fontSize="9" opacity={0.7}>
                    {zone.reps} reps
                  </text>
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
            {/* Entrance label */}
            <text x="555" y="190" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">Entry</text>
          </svg>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
            {FLOOR_ZONES.map((zone) => (
              <div key={zone.id} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${zone.color}20`, border: `1px solid ${zone.color}60` }} />
                <span className="text-[10px]" style={{ color: '#94A3B8' }}>{zone.name.split('&')[0].trim()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <TransactionFeed transactions={FEED_TRANSACTIONS} />
        </div>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today's Revenue"
          value="$98.4K"
          sparkline={[12, 18, 22, 28, 35, 42, 56, 68, 78, 92, 98]}
          color={COLORS.primary}
        />
        <StatCard
          label="Transactions"
          value="142"
          sparkline={[8, 12, 18, 24, 32, 38, 48, 62, 85, 110, 142]}
          color="#2563eb"
        />
        <StatCard
          label="Avg Transaction"
          value="$693"
          trend="up"
          trendValue="+$38 vs avg"
          color={COLORS.accent}
        />
        <StatCard
          label="Active Reps"
          value="12 / 14"
          color="#059669"
        />
      </div>

      {/* Charts row: Hourly Sales + Revenue by Dept + Payment Mix */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Hourly Sales Curve ($K)
          </p>
          <AreaChart data={HOURLY_SALES} color={COLORS.accent} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Revenue by Department ($K)
          </p>
          <BarChart data={DEPT_REVENUE} unit="K" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Payment Method Mix
          </p>
          <div className="flex justify-center">
            <DonutChart segments={PAYMENT_MIX} centerValue="142" centerLabel="txns" size={180} />
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
