'use client';

import { StatCard, SankeyFlow, WaterfallChart, SeverityGauge } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const SANKEY_NODES = [
  { id: 'breach', label: 'Breach Event' },
  { id: 'legal', label: 'Legal' },
  { id: 'forensics', label: 'Forensics' },
  { id: 'pr', label: 'PR/Comms' },
  { id: 'fines', label: 'Reg Fines' },
  { id: 'interruption', label: 'Biz Interruption' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'exposure', label: 'Net Exposure' },
];

const SANKEY_LINKS = [
  { source: 'breach', target: 'legal', value: 2100, color: '#7C3AED' },
  { source: 'breach', target: 'forensics', value: 1400, color: '#2563EB' },
  { source: 'breach', target: 'pr', value: 800, color: '#EA580C' },
  { source: 'breach', target: 'fines', value: 1200, color: '#DC2626' },
  { source: 'breach', target: 'interruption', value: 3800, color: '#78716C' },
  { source: 'legal', target: 'exposure', value: 2100, color: '#7C3AED40' },
  { source: 'forensics', target: 'exposure', value: 1400, color: '#2563EB40' },
  { source: 'pr', target: 'exposure', value: 800, color: '#EA580C40' },
  { source: 'fines', target: 'exposure', value: 1200, color: '#DC262640' },
  { source: 'interruption', target: 'exposure', value: 3800, color: '#78716C40' },
  { source: 'insurance', target: 'exposure', value: 4200, color: '#059669' },
];

const WATERFALL_DATA = [
  { label: 'Total Loss', value: 14500, type: 'add' as const },
  { label: 'Deductible', value: 1000, type: 'subtract' as const },
  { label: 'Cyber Liability', value: 3200, type: 'subtract' as const },
  { label: 'Biz Interruption', value: 1800, type: 'subtract' as const },
  { label: 'Reg Defense', value: 500, type: 'subtract' as const },
  { label: 'Denied Claims', value: 2900, type: 'subtract' as const },
  { label: 'Net Exposure', value: 5100, type: 'total' as const },
];

const COST_BREAKDOWN = [
  { category: 'Legal Fees', actual: 2100, budgeted: 2500, variance: 400 },
  { category: 'Forensic Investigation', actual: 1400, budgeted: 1200, variance: -200 },
  { category: 'PR & Communications', actual: 800, budgeted: 900, variance: 100 },
  { category: 'Regulatory Fines', actual: 1200, budgeted: 2000, variance: 800 },
  { category: 'Business Interruption', actual: 3800, budgeted: 4000, variance: 200 },
  { category: 'Customer Remediation', actual: 2400, budgeted: 2800, variance: 400 },
  { category: 'System Upgrades', actual: 1900, budgeted: 1500, variance: -400 },
  { category: 'Insurance Premiums', actual: 900, budgeted: 800, variance: -100 },
];

const BILLING = [
  { item: 'Monthly Retainer', amount: 150 },
  { item: 'Hourly Overage (210hr @ $2K)', amount: 420 },
  { item: 'Fixed Incident Fee', amount: 250 },
  { item: 'Expenses & Disbursements', amount: 80 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function FinancialImpact() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Financial Impact</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Cost analysis, insurance recovery, and ROI of rapid response
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Losses" value="$14.5M" color="#DC2626" />
        <StatCard label="Net Exposure" value="$5.1M" color="#EA580C" />
        <StatCard label="Insurance Recovery" value="$4.2M" color="#059669" />
        <StatCard label="Savings vs. Unmanaged" value="$8.2M" color="#059669" />
      </div>

      {/* Sankey Flow */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Crisis Cost Flow</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>Values in thousands ($K) — flows from breach event through cost categories to net exposure</p>
        <SankeyFlow nodes={SANKEY_NODES} links={SANKEY_LINKS} height={350} />
      </div>

      {/* ROI of Rapid Response */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>ROI of Rapid Response</h2>
        <p className="text-[12px] mb-4" style={{ color: '#57534E' }}>
          Estimated <span className="font-bold" style={{ color: '#059669' }}>$8.2M saved</span> vs. unmanaged crisis
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#ECFDF5' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#059669' }}>Managed Response</p>
            <p className="text-xl font-bold" style={{ color: '#1C1917' }}>$5.1M</p>
            <p className="text-[10px]" style={{ color: '#57534E' }}>Net exposure after insurance</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FEF2F2' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#DC2626' }}>Unmanaged Estimate</p>
            <p className="text-xl font-bold" style={{ color: '#1C1917' }}>$13.3M</p>
            <p className="text-[10px]" style={{ color: '#57534E' }}>Projected without Ironclad</p>
          </div>
        </div>
      </div>

      {/* Waterfall: Insurance Recovery */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Insurance Recovery Waterfall</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>From total loss to net exposure (values in $K)</p>
        <WaterfallChart data={WATERFALL_DATA} height={280} />
      </div>

      {/* SeverityGauge: Exposure Reduction */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3 self-start" style={{ color: '#1C1917' }}>Exposure Reduction</h2>
          <SeverityGauge
            value={65}
            max={100}
            label="65% Reduction"
            zones={[
              { threshold: 25, color: '#DC2626' },
              { threshold: 50, color: '#EA580C' },
              { threshold: 75, color: '#059669' },
              { threshold: 100, color: '#059669' },
            ]}
          />
        </div>

        {/* Billing Summary */}
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4', borderTopColor: '#8B7355', borderTopWidth: 3 }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Ironclad Billing Summary</h2>
          <div className="space-y-3">
            {BILLING.map((b) => (
              <div key={b.item} className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: '#57534E' }}>{b.item}</span>
                <span className="text-[12px] tabular-nums font-semibold" style={{ color: '#1C1917' }}>${b.amount}K</span>
              </div>
            ))}
            <div className="pt-2" style={{ borderTop: '2px solid #8B7355' }}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold" style={{ color: '#8B7355' }}>Total</span>
                <span className="text-lg tabular-nums font-bold" style={{ color: '#8B7355' }}>$900K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Cost Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Category', 'Actual ($K)', 'Budgeted ($K)', 'Variance ($K)'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COST_BREAKDOWN.map((row) => (
                <tr key={row.category} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td className="py-2 px-2 font-semibold" style={{ color: '#1C1917' }}>{row.category}</td>
                  <td className="py-2 px-2 tabular-nums" style={{ color: '#57534E' }}>{row.actual.toLocaleString()}</td>
                  <td className="py-2 px-2 tabular-nums" style={{ color: '#57534E' }}>{row.budgeted.toLocaleString()}</td>
                  <td className="py-2 px-2 tabular-nums font-semibold" style={{ color: row.variance >= 0 ? '#059669' : '#DC2626' }}>
                    {row.variance >= 0 ? '+' : ''}{row.variance.toLocaleString()}
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
