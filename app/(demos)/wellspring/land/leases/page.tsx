'use client';

import { StatCard, LeaseBlockMap } from '@/components/demos/wellspring';
import type { LeaseBlock } from '@/components/demos/wellspring';
import { LEASES } from '@/data/wellspring/leases';

/* ── Map lease data to LeaseBlock format ─────────────── */

const leaseBlocks: LeaseBlock[] = LEASES.map((l, i) => ({
  id: l.leaseId,
  name: l.name,
  section: String(i + 1),
  status: l.status,
  royaltyRate: l.royaltyRate,
  acreage: l.acreage,
}));

/* ── Computed stats ──────────────────────────────────── */

const totalAcreage = LEASES.reduce((s, l) => s + l.acreage, 0);
const activeLeases = LEASES.filter((l) => l.status === 'active').length;
const avgRoyalty =
  LEASES.reduce((s, l) => s + l.royaltyRate, 0) / LEASES.length;
const expiringIn90d = LEASES.filter((l) => {
  const exp = new Date(l.expirationDate);
  const now = new Date('2026-03-04');
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 90 && diff > 0;
}).length;

/* ── Status badge colors ─────────────────────────────── */

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  active: { bg: '#14432A', text: '#34D399' },
  expiring: { bg: '#4A3400', text: '#FBBF24' },
  prospect: { bg: '#1E3A5F', text: '#60A5FA' },
};

export default function LeasePortfolioPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#C2A04E' }}
        >
          Act 1 &middot; The Landman
        </div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Lease Portfolio
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Permian Basin &middot; Reeves, Pecos &amp; Loving Counties &middot;{' '}
          {LEASES.length} leases
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Acreage"
          value={totalAcreage.toLocaleString()}
          trend="up"
          trendValue="+640 ac"
          color="#C2A04E"
          sparkline={[3200, 3560, 3800, 3960, 4080, totalAcreage]}
        />
        <StatCard
          label="Active Leases"
          value={String(activeLeases)}
          trend="flat"
          trendValue="steady"
          color="#C2A04E"
          sparkline={[7, 7, 8, 8, 8, activeLeases]}
        />
        <StatCard
          label="Avg Royalty Rate"
          value={`${(avgRoyalty * 100).toFixed(1)}%`}
          trend="flat"
          trendValue="blended"
          color="#C2A04E"
        />
        <StatCard
          label="Expiring in 90d"
          value={String(expiringIn90d)}
          trend="up"
          trendValue="action needed"
          color="#DC2626"
        />
      </div>

      {/* Lease Block Map */}
      <div className="mb-6">
        <LeaseBlockMap leases={leaseBlocks} />
      </div>

      {/* Lease Table */}
      <div
        className="rounded-xl border p-5 overflow-x-auto"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: '#F1F5F9' }}
        >
          Lease Register
        </h3>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Lease Name', 'County', 'Acreage', 'Royalty', 'NRI', 'Expiration', 'Status'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-2 font-semibold uppercase tracking-wider"
                    style={{ color: '#94A3B8', fontSize: 10 }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {LEASES.map((l) => {
              const badge = STATUS_BADGE[l.status] ?? STATUS_BADGE.active;
              return (
                <tr
                  key={l.leaseId}
                  style={{ borderBottom: '1px solid #252B36' }}
                >
                  <td className="py-2 px-2 font-medium" style={{ color: '#F1F5F9' }}>
                    {l.name}
                  </td>
                  <td className="py-2 px-2" style={{ color: '#CBD5E1' }}>
                    {l.county}
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {l.acreage.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {(l.royaltyRate * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {(l.netRevenueInterest * 100).toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {l.expirationDate}
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
