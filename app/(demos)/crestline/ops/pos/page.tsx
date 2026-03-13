'use client';

import { StatCard, BarChart, DonutChart, AreaChart, HeatMap } from '@/components/demos/crestline';
import { SELLING_DEPTS, PRODUCTS, COLORS, RETURNS_IMPACT } from '@/data/crestline';

/* -- Transaction volume by hour ------------------------- */

const HOURLY_VOLUME = [
  { label: '9AM', value: 4 }, { label: '10AM', value: 8 }, { label: '11AM', value: 14 },
  { label: '12PM', value: 11 }, { label: '1PM', value: 13 }, { label: '2PM', value: 18 },
  { label: '3PM', value: 22 }, { label: '4PM', value: 17 }, { label: '5PM', value: 14 },
  { label: '6PM', value: 12 }, { label: '7PM', value: 10 }, { label: '8PM', value: 6 },
  { label: '9PM', value: 3 },
];

/* -- Revenue by selling department ---------------------- */

const DEPT_BREAKDOWN = SELLING_DEPTS.map((d) => ({
  label: d.name.split('&')[0].trim(),
  value: d.id === 'designer' ? 27.8 : d.id === 'cosmetics' ? 21.4 : d.id === 'shoes' ? 19.6 : d.id === 'accessories' ? 17.2 : 12.4,
  color: d.color,
}));

/* -- Payment method split ------------------------------- */

const PAYMENT_SPLIT = [
  { label: 'Credit', value: 62, color: COLORS.primary },
  { label: 'Debit', value: 18, color: '#2563eb' },
  { label: 'Cash', value: 8, color: '#059669' },
  { label: 'Financing', value: 12, color: COLORS.flagship },
];

/* -- Transaction size distribution ---------------------- */

const TX_SIZE = [
  { label: '<$100', value: 22, color: '#94A3B8' },
  { label: '$100-500', value: 38, color: '#2563eb' },
  { label: '$500-1K', value: 20, color: COLORS.accent },
  { label: '$1K-2K', value: 12, color: COLORS.flagship },
  { label: '$2K+', value: 8, color: '#059669' },
];

/* -- Heatmap: volume by day x hour ---------------------- */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];

const TX_HEATMAP: number[][] = [
  [4, 8, 12, 10, 11, 15, 18, 14, 12, 10, 8, 5, 2],
  [3, 7, 11, 9, 10, 14, 17, 13, 11, 9, 7, 4, 2],
  [5, 9, 14, 12, 13, 18, 22, 17, 14, 12, 10, 6, 3],
  [4, 8, 13, 11, 12, 16, 20, 16, 13, 11, 9, 5, 3],
  [6, 11, 18, 15, 17, 22, 28, 22, 18, 16, 14, 8, 4],
  [8, 14, 24, 20, 22, 30, 38, 30, 24, 20, 18, 12, 6],
  [7, 12, 20, 17, 19, 26, 32, 26, 20, 17, 15, 10, 5],
];

/* -- Top-selling items ---------------------------------- */

const TOP_ITEMS = [
  { name: 'Burberry Trench Coat', dept: 'Designer', units: 8, revenue: 18320, asp: 2290 },
  { name: 'Louis Vuitton Neverfull', dept: 'Accessories', units: 6, revenue: 11760, asp: 1960 },
  { name: 'Chanel No. 5 Eau de Parfum', dept: 'Cosmetics', units: 14, revenue: 1988, asp: 142 },
  { name: 'Christian Louboutin Pumps', dept: 'Shoes', units: 5, revenue: 3975, asp: 795 },
  { name: 'Casper Wave Hybrid', dept: 'Home', units: 3, revenue: 8085, asp: 2695 },
  { name: 'David Yurman Bracelet', dept: 'Accessories', units: 7, revenue: 4550, asp: 650 },
  { name: 'La Mer Moisturizing Cream', dept: 'Cosmetics', units: 9, revenue: 3105, asp: 345 },
  { name: 'Theory Blazer', dept: 'Designer', units: 6, revenue: 2970, asp: 495 },
  { name: 'Dyson Airwrap', dept: 'Home', units: 8, revenue: 4792, asp: 599 },
  { name: 'Tory Burch Crossbody', dept: 'Accessories', units: 10, revenue: 3480, asp: 348 },
];

const DEPT_COLORS: Record<string, string> = {
  Designer: '#7c3aed',
  Cosmetics: '#d946ef',
  Shoes: '#2563eb',
  Accessories: '#c9a84c',
  Home: '#059669',
};

export default function PosAnalytics() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--pl-text)' }}>POS Analytics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Point-of-sale transaction patterns, department mix, and product performance &mdash; Flagship F-001
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Transactions Today" value="142" trend="up" trendValue="+12%" color={COLORS.primary} />
        <StatCard label="Avg Items/Transaction" value="1.8" trend="up" trendValue="+0.3" color="#2563eb" />
        <StatCard label="Return Rate" value="3.1%" trend="down" trendValue="-0.4%" color="#059669" />
        <StatCard label="Financing Rate" value="12%" trend="up" trendValue="+2%" color={COLORS.flagship} />
      </div>

      {/* Revenue by Dept + Payment Mix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Revenue by Selling Department ($K)
          </p>
          <BarChart data={DEPT_BREAKDOWN} unit="K" />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Payment Method Split
          </p>
          <div className="flex justify-center">
            <DonutChart segments={PAYMENT_SPLIT} centerValue="$693" centerLabel="avg sale" size={200} />
          </div>
        </div>
      </div>

      {/* Hourly Volume + Transaction Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Transaction Volume by Hour
          </p>
          <AreaChart data={HOURLY_VOLUME} color={COLORS.accent} />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Transaction Size Distribution
          </p>
          <div className="flex justify-center">
            <DonutChart segments={TX_SIZE} centerValue="$693" centerLabel="avg txn" size={200} />
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Transaction Volume Heatmap (Day x Hour)
        </p>
        <HeatMap
          rows={DAYS}
          cols={HOURS}
          data={TX_HEATMAP}
          colorScale={{ low: '#F5F3FF', mid: '#8B5CF6', high: COLORS.primary }}
        />
      </div>

      {/* Returns Impact — Net Sales (Nordstrom-style) */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
              Returns Impact — Net Sales
            </p>
            <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>
              Commission is calculated on net sales, not gross. Returns reduce prior sales credit and directly impact SPH.
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
          >
            {(RETURNS_IMPACT.returnRate * 100).toFixed(1)}% RETURN RATE
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--pl-bg)', border: '1px solid var(--pl-border)' }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Gross Sales</span>
            <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--pl-text)' }}>
              ${(RETURNS_IMPACT.mtdGrossSales / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Returns</span>
            <p className="text-lg font-bold tabular-nums" style={{ color: '#EF4444' }}>
              -${(RETURNS_IMPACT.mtdReturns / 1000).toFixed(1)}K
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Net Sales</span>
            <p className="text-lg font-bold tabular-nums" style={{ color: '#059669' }}>
              ${(RETURNS_IMPACT.mtdNetSales / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--pl-bg)', border: '1px solid var(--pl-border)' }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Avg Return</span>
            <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--pl-text-secondary)' }}>
              ${RETURNS_IMPACT.avgReturnValue}
            </p>
          </div>
        </div>

        {/* Returns by Department + Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By Department */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--pl-bg)', border: '1px solid var(--pl-border)' }}>
            <p className="text-[11px] font-semibold mb-3" style={{ color: COLORS.primary }}>Return Rate by Department</p>
            <div className="space-y-2.5">
              {RETURNS_IMPACT.byDepartment.map((d) => (
                <div key={d.dept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium" style={{ color: 'var(--pl-text)' }}>{d.dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tabular-nums" style={{ color: '#EF4444' }}>
                        -${(d.returns / 1000).toFixed(1)}K
                      </span>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: d.returnRate > 0.035 ? '#EF4444' : 'var(--pl-text-secondary)' }}>
                        {(d.returnRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--pl-border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.returnRate * 2500}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] mt-3" style={{ color: 'var(--pl-text-muted)' }}>
              Shoes &amp; Designer have highest return rates (fit/size issues). Associates can start a pay period &ldquo;in the hole&rdquo; from returns.
            </p>
          </div>

          {/* Return Reasons */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--pl-bg)', border: '1px solid var(--pl-border)' }}>
            <p className="text-[11px] font-semibold mb-3" style={{ color: COLORS.primary }}>Return Reasons</p>
            <div className="flex justify-center mb-3">
              <DonutChart
                segments={RETURNS_IMPACT.topReturnReasons.map(r => ({ label: r.reason, value: r.pct, color: r.color }))}
                centerValue={`${(RETURNS_IMPACT.returnRate * 100).toFixed(1)}%`}
                centerLabel="return rate"
                size={160}
              />
            </div>
            <p className="text-[9px] text-center" style={{ color: 'var(--pl-text-muted)' }}>
              Fit/Size (38%) is the #1 return reason — impacts Designer &amp; Shoes departments most heavily
            </p>
          </div>
        </div>
      </div>

      {/* Top-Selling Items Table */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Top-Selling Items Today
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--pl-border)' }}>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Product</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Department</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--pl-text-muted)' }}>Units</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--pl-text-muted)' }}>Revenue</th>
                <th className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--pl-text-muted)' }}>ASP</th>
              </tr>
            </thead>
            <tbody>
              {TOP_ITEMS.map((item, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0"
                  style={{ borderColor: 'var(--pl-stripe)', backgroundColor: i % 2 === 0 ? 'var(--pl-bg)' : 'transparent' }}
                >
                  <td className="py-2.5 text-[12px] font-medium" style={{ color: 'var(--pl-text)' }}>{item.name}</td>
                  <td className="py-2.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: `${DEPT_COLORS[item.dept] ?? '#94A3B8'}15`,
                        color: DEPT_COLORS[item.dept] ?? '#94A3B8',
                      }}
                    >
                      {item.dept}
                    </span>
                  </td>
                  <td className="py-2.5 text-[12px] tabular-nums text-right" style={{ color: 'var(--pl-text-secondary)' }}>{item.units}</td>
                  <td className="py-2.5 text-[12px] font-bold tabular-nums text-right" style={{ color: 'var(--pl-text)' }}>
                    ${item.revenue.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-[12px] tabular-nums text-right" style={{ color: 'var(--pl-text-secondary)' }}>
                    ${item.asp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
