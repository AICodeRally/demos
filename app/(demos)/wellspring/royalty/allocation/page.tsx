'use client';

import { StatCard, SankeyFlow } from '@/components/demos/wellspring';

/* ── Sankey data: revenue flow ────────────────────────── */

const sankeyNodes = [
  { id: 'gross', label: 'Gross Revenue ($2.42M)' },
  { id: 'wi', label: 'Working Interest' },
  { id: 'nri', label: 'Net Revenue Interest' },
  { id: 'royalty', label: 'Royalty Owners ($605K)' },
  { id: 'sevtax', label: 'Severance Tax ($151K)' },
  { id: 'loe', label: 'LOE ($492K)' },
  { id: 'net', label: 'Net to Operator ($982K)' },
];

const sankeyLinks = [
  { source: 'gross', target: 'wi', value: 2424, color: 'rgba(13, 148, 136, 0.3)' },
  { source: 'wi', target: 'nri', value: 1819, color: 'rgba(13, 148, 136, 0.25)' },
  { source: 'wi', target: 'royalty', value: 605, color: 'rgba(220, 38, 38, 0.3)' },
  { source: 'nri', target: 'net', value: 982, color: 'rgba(5, 150, 105, 0.3)' },
  { source: 'nri', target: 'sevtax', value: 151, color: 'rgba(124, 58, 237, 0.3)' },
  { source: 'nri', target: 'loe', value: 492, color: 'rgba(234, 179, 8, 0.3)' },
];

export default function RoyaltyAllocationPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-semibold mb-1"
          style={{ color: '#7C3AED' }}
        >
          Act 6 &middot; Royalty Accountant
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Revenue Allocation
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Gross revenue to net operator income — February 2026
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Gross Revenue"
          value="$2.42M"
          trend="up"
          trendValue="+4.1%"
          color="#7C3AED"
          sparkline={[2.1, 2.2, 2.3, 2.35, 2.4, 2.42]}
        />
        <StatCard
          label="Royalty Burden"
          value="22.5%"
          trend="flat"
          trendValue="of gross"
          color="#DC2626"
        />
        <StatCard
          label="Net to Operator"
          value="$982K"
          trend="up"
          trendValue="+5.2%"
          color="#059669"
          sparkline={[880, 900, 920, 940, 960, 982]}
        />
        <StatCard
          label="Effective Tax Rate"
          value="8%"
          trend="flat"
          trendValue="severance + reg"
          color="#7C3AED"
        />
      </div>

      {/* Sankey Flow */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Revenue Flow
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Gross Revenue → Working Interest → Net Revenue Interest → Distributions
        </p>
        <SankeyFlow nodes={sankeyNodes} links={sankeyLinks} height={340} />
      </div>

      {/* Allocation Breakdown */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
          Allocation Detail
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Oil Revenue', amount: '$1,842,000', pct: '76.0%', color: '#B45309' },
            { label: 'Gas Revenue', amount: '$384,000', pct: '15.8%', color: '#6B7280' },
            { label: 'NGL Revenue', amount: '$198,000', pct: '8.2%', color: '#0D9488' },
            { label: 'Less: Royalties', amount: '-$605,000', pct: '25.0%', color: '#DC2626' },
            { label: 'Less: Severance Tax', amount: '-$151,000', pct: '6.2%', color: '#7C3AED' },
            { label: 'Less: LOE', amount: '-$492,000', pct: '20.3%', color: '#EAB308' },
            { label: 'Net Operating Income', amount: '$1,176,000', pct: '48.5%', color: '#059669' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: '1px solid #252B36' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[12px] font-medium" style={{ color: '#CBD5E1' }}>
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px]" style={{ color: '#94A3B8' }}>
                  {item.pct}
                </span>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: item.amount.startsWith('-') ? '#DC2626' : '#F1F5F9' }}
                >
                  {item.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
