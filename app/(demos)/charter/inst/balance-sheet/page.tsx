'use client';

import { SankeyFlow, WaterfallChart, RadarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const BALANCE_NODES = [
  { id: 'deposits', label: 'Deposits $1.7B' },
  { id: 'borrowings', label: 'Borrowings $180M' },
  { id: 'capital', label: 'Capital $220M' },
  { id: 'loans', label: 'Loans $1.4B' },
  { id: 'investments', label: 'Investments $480M' },
  { id: 'cash', label: 'Cash $120M' },
  { id: 'other', label: 'Other $100M' },
];

const BALANCE_LINKS = [
  { source: 'deposits', target: 'loans', value: 1100, color: 'rgba(71, 85, 105, 0.25)' },
  { source: 'deposits', target: 'investments', value: 400, color: 'rgba(71, 85, 105, 0.20)' },
  { source: 'deposits', target: 'cash', value: 100, color: 'rgba(71, 85, 105, 0.15)' },
  { source: 'deposits', target: 'other', value: 100, color: 'rgba(71, 85, 105, 0.12)' },
  { source: 'borrowings', target: 'loans', value: 160, color: 'rgba(184, 115, 51, 0.25)' },
  { source: 'borrowings', target: 'investments', value: 20, color: 'rgba(184, 115, 51, 0.15)' },
  { source: 'capital', target: 'loans', value: 140, color: 'rgba(107, 143, 113, 0.25)' },
  { source: 'capital', target: 'investments', value: 60, color: 'rgba(107, 143, 113, 0.20)' },
  { source: 'capital', target: 'cash', value: 20, color: 'rgba(107, 143, 113, 0.15)' },
];

const CAPITAL_ADEQUACY = [
  { label: 'Net Worth', value: 220, type: 'total' as const },
  { label: 'Retained Earnings', value: 18, type: 'add' as const },
  { label: 'AOCI', value: 6, type: 'subtract' as const },
  { label: 'Risk Adj', value: 4, type: 'subtract' as const },
  { label: 'Total Capital', value: 0, type: 'total' as const },
];

const LIQUIDITY_RATIOS = [
  { label: 'Current Ratio', value: 92 },
  { label: 'Quick Ratio', value: 88 },
  { label: 'Cash Ratio', value: 78 },
  { label: 'NSFR', value: 95 },
  { label: 'LCR', value: 87 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function BalanceSheet() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Balance Sheet</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Sources &amp; uses of funds, capital adequacy &amp; liquidity position</p>
      </div>

      {/* Sankey Flow */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Sources &amp; Uses of Funds</h2>
        <SankeyFlow nodes={BALANCE_NODES} links={BALANCE_LINKS} height={340} />
      </div>

      {/* Capital Adequacy + Liquidity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Capital Adequacy Waterfall */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>Capital Adequacy ($M)</h2>
          <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Total Capital Ratio: 10.86%</p>
          <WaterfallChart data={CAPITAL_ADEQUACY} height={260} />
        </div>

        {/* Liquidity Radar */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Liquidity Ratios</h2>
          <div className="flex justify-center">
            <RadarChart axes={LIQUIDITY_RATIOS} color="#475569" size={280} />
          </div>
        </div>
      </div>
    </>
  );
}
