'use client';

import { DonutChart, WaterfallChart, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const DEPOSIT_MIX = [
  { label: 'Checking 30%', value: 510, color: '#475569' },
  { label: 'Savings 25%', value: 425, color: '#B87333' },
  { label: 'Money Market 20%', value: 340, color: '#6B8F71' },
  { label: 'CDs 15%', value: 255, color: '#7C3AED' },
  { label: 'IRAs 10%', value: 170, color: '#A8A29E' },
];

const DEPOSIT_GROWTH = [
  { label: 'Starting', value: 1580, type: 'total' as const },
  { label: 'New Accts', value: 62, type: 'add' as const },
  { label: 'Rate Migration', value: 38, type: 'add' as const },
  { label: 'Seasonal', value: 22, type: 'add' as const },
  { label: 'Attrition', value: 14, type: 'subtract' as const },
  { label: 'Ending', value: 0, type: 'total' as const },
];

const RATE_TIERS = [
  { label: 'Checking', value: 0.05 },
  { label: 'Savings', value: 0.25 },
  { label: 'Money Market', value: 1.15 },
  { label: '6-mo CD', value: 3.25 },
  { label: '12-mo CD', value: 4.10 },
  { label: '24-mo CD', value: 4.35 },
  { label: 'IRA', value: 4.50 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function DepositPortfolio() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Deposit Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>$1.7B total deposits &mdash; composition, growth drivers &amp; rate structure</p>
      </div>

      {/* Deposit Mix Donut */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Deposit Composition ($M)</h2>
        <div className="flex justify-center">
          <DonutChart segments={DEPOSIT_MIX} centerValue="$1.7B" centerLabel="Total Deposits" size={220} />
        </div>
      </div>

      {/* Deposit Growth Waterfall */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Deposit Growth Waterfall ($M)</h2>
        <WaterfallChart data={DEPOSIT_GROWTH} height={280} />
      </div>

      {/* Rate Tiers */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Current Rate Tiers (APY %)</h2>
        <BarChart data={RATE_TIERS} color="#B87333" maxVal={5.0} unit="%" />
      </div>
    </>
  );
}
