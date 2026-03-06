'use client';

import { AreaChart, DonutChart, BarChart, StatCard } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const MEMBER_GROWTH = [
  { label: 'Jan \'24', value: 128000 },
  { label: 'Mar', value: 129200 },
  { label: 'May', value: 130500 },
  { label: 'Jul', value: 131800 },
  { label: 'Sep', value: 133000 },
  { label: 'Nov', value: 134200 },
  { label: 'Jan \'25', value: 135400 },
  { label: 'Mar', value: 136800 },
  { label: 'May', value: 137900 },
  { label: 'Jul', value: 139200 },
  { label: 'Sep', value: 140500 },
  { label: 'Nov', value: 142000 },
];

const DEMOGRAPHICS = [
  { label: 'Young Adults 18-34', value: 22, color: '#475569' },
  { label: 'Families 35-54', value: 38, color: '#B87333' },
  { label: 'Pre-retirees 55-64', value: 18, color: '#6B8F71' },
  { label: 'Retirees 65+', value: 15, color: '#7C3AED' },
  { label: 'Business', value: 7, color: '#A8A29E' },
];

const CROSS_SELL = [
  { label: 'Young Adults', value: 2.1 },
  { label: 'Families', value: 3.8 },
  { label: 'Pre-retirees', value: 4.2 },
  { label: 'Retirees', value: 3.4 },
  { label: 'Business', value: 5.6 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function MemberGrowth() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Member Growth</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>142,000 members &mdash; demographics, acquisition &amp; engagement</p>
      </div>

      {/* Member Growth Area Chart */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>24-Month Member Growth</h2>
        <AreaChart data={MEMBER_GROWTH} color="#475569" height={220} />
      </div>

      {/* Demographics + Cross-Sell */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Demographics Donut */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Member Demographics</h2>
          <div className="flex justify-center">
            <DonutChart segments={DEMOGRAPHICS} centerValue="142K" centerLabel="Members" size={200} />
          </div>
        </div>

        {/* Cross-Sell Ratios */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Cross-Sell Ratio (Avg Products/Member)</h2>
          <BarChart data={CROSS_SELL} color="#6B8F71" maxVal={6.0} />
        </div>
      </div>

      {/* Funnel Metrics */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Monthly Acquisition Funnel</h2>
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="New Applications" value="2,840" trend="up" trendValue="+12%" color="#475569" sparkline={[2200, 2300, 2400, 2500, 2550, 2600, 2650, 2700, 2740, 2780, 2810, 2840]} />
          <StatCard label="Approved" value="2,130" trend="up" trendValue="+9%" color="#B87333" sparkline={[1700, 1760, 1820, 1860, 1900, 1940, 1980, 2010, 2050, 2080, 2100, 2130]} />
          <StatCard label="Funded" value="1,890" trend="up" trendValue="+7%" color="#6B8F71" sparkline={[1520, 1560, 1600, 1640, 1680, 1720, 1750, 1790, 1820, 1850, 1870, 1890]} />
          <StatCard label="Active After 90d" value="1,650" trend="up" trendValue="+6%" color="#7C3AED" sparkline={[1340, 1370, 1400, 1430, 1460, 1490, 1510, 1540, 1570, 1600, 1620, 1650]} />
        </div>
      </div>
    </>
  );
}
