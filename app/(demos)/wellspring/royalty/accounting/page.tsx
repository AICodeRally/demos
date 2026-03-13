'use client';

import { StatCard, BarChart } from '@/components/demos/wellspring';
import { REVENUE_ALLOCATION } from '@/data/wellspring';

/* ── Revenue by product per lease ─────────────────────── */

const leaseRevenue = [
  { label: 'Mustang Ranch', value: 412, color: '#B45309' },
  { label: 'Rattlesnake Draw', value: 524, color: '#6B7280' },
  { label: 'Sidewinder Mesa', value: 618, color: '#0D9488' },
  { label: 'Diamondback Fed', value: 870, color: '#7C3AED' },
];

/* ── Volume reconciliation table ──────────────────────── */

const VOLUME_RECON = [
  { lease: 'Mustang Ranch Unit', measured: 4820, allocated: 4790, sold: 4785, variance: -0.7 },
  { lease: 'Rattlesnake Draw', measured: 6440, allocated: 6410, sold: 6405, variance: -0.5 },
  { lease: 'Sidewinder Mesa', measured: 7620, allocated: 7580, sold: 7575, variance: -0.6 },
  { lease: 'Diamondback Federal', measured: 10280, allocated: 10220, sold: 10210, variance: -0.7 },
];

const oilRevenue = REVENUE_ALLOCATION.find((r) => r.stream === 'oil')?.grossRevenue ?? 0;
const gasRevenue = REVENUE_ALLOCATION.find((r) => r.stream === 'gas')?.grossRevenue ?? 0;
const nglRevenue = REVENUE_ALLOCATION.find((r) => r.stream === 'ngl')?.grossRevenue ?? 0;
const totalRevenue = oilRevenue + gasRevenue + nglRevenue;

export default function RoyaltyAccountingPage() {
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
          Production Accounting
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Revenue by product, volume reconciliation &amp; lease allocation
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Oil Revenue"
          value={`$${(oilRevenue / 1000000).toFixed(1)}M`}
          trend="up"
          trendValue="+3.8%"
          color="#B45309"
          sparkline={[1.6, 1.65, 1.7, 1.75, 1.8, oilRevenue / 1000000]}
        />
        <StatCard
          label="Gas Revenue"
          value={`$${(gasRevenue / 1000).toFixed(0)}K`}
          trend="up"
          trendValue="+2.1%"
          color="#6B7280"
          sparkline={[350, 360, 370, 375, 380, gasRevenue / 1000]}
        />
        <StatCard
          label="NGL Revenue"
          value={`$${(nglRevenue / 1000).toFixed(0)}K`}
          trend="up"
          trendValue="+5.4%"
          color="#0D9488"
          sparkline={[160, 170, 175, 185, 190, nglRevenue / 1000]}
        />
        <StatCard
          label="Total Revenue"
          value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
          trend="up"
          trendValue="+4.1%"
          color="#7C3AED"
          sparkline={[2.1, 2.2, 2.25, 2.3, 2.35, totalRevenue / 1000000]}
        />
      </div>

      {/* Revenue by Lease */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Revenue by Lease
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Gross revenue ($K) by lease — Diamondback leads with new completions
        </p>
        <BarChart data={leaseRevenue} unit="K" />
      </div>

      {/* Revenue by Product Stream */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
          Revenue by Product Stream
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Product</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Volume</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Avg Price</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Gross Revenue</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Royalty Burden</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Net to Operator</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_ALLOCATION.map((ra) => (
                <tr key={ra.stream} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2 font-medium capitalize" style={{ color: '#F1F5F9' }}>
                    {ra.stream}
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    {ra.volume.toLocaleString()} {ra.unit}
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    ${ra.avgPrice.toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#F1F5F9' }}>
                    ${(ra.grossRevenue / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#DC2626' }}>
                    -${(ra.royaltyBurden / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#059669' }}>
                    ${(ra.netToOperator / 1000).toFixed(0)}K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Volume Reconciliation */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Volume Reconciliation
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Measured vs allocated vs sold (BBL) — variance within RRC tolerance
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Lease</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Measured (BBL)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Allocated (BBL)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Sold (BBL)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Variance %</th>
              </tr>
            </thead>
            <tbody>
              {VOLUME_RECON.map((v, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{v.lease}</td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    {v.measured.toLocaleString()}
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    {v.allocated.toLocaleString()}
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    {v.sold.toLocaleString()}
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#EAB308' }}>
                    {v.variance}%
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
