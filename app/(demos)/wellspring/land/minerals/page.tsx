'use client';

import { StatCard, TreeMap } from '@/components/demos/wellspring';

/* ── Mineral ownership data ──────────────────────────── */

const MINERAL_OWNERS = [
  { name: 'Davis Family Trust', interest: 12.5, status: 'contacted' as const, acres: 1600 },
  { name: 'Permian Royalties LLC', interest: 8.3, status: 'negotiating' as const, acres: 1060 },
  { name: 'XTO Energy (Exxon)', interest: 7.8, status: 'contacted' as const, acres: 998 },
  { name: 'Apache Minerals Co', interest: 6.2, status: 'contacted' as const, acres: 793 },
  { name: 'Henderson Estate', interest: 5.1, status: 'negotiating' as const, acres: 653 },
  { name: 'BLM Federal', interest: 4.8, status: 'contacted' as const, acres: 614 },
  { name: 'Texas GLO (State)', interest: 3.9, status: 'contacted' as const, acres: 499 },
  { name: 'Ramirez Minerals', interest: 3.2, status: 'pending' as const, acres: 410 },
  { name: 'Basin Resources LP', interest: 2.8, status: 'negotiating' as const, acres: 358 },
  { name: 'Sullivan Ranch Co', interest: 2.0, status: 'contacted' as const, acres: 256 },
  { name: 'Other (28 owners)', interest: 43.4, status: 'pending' as const, acres: 5559 },
];

const TREEMAP_DATA = MINERAL_OWNERS.map((o) => ({
  label: o.name,
  value: o.interest,
}));

/* ── Status badge colors ─────────────────────────────── */

const CONTACT_BADGE: Record<string, { bg: string; text: string }> = {
  contacted: { bg: '#14432A', text: '#34D399' },
  pending: { bg: '#4A3400', text: '#FBBF24' },
  negotiating: { bg: '#3B1F6E', text: '#A78BFA' },
};

export default function MineralRightsPage() {
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
          Mineral Rights
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Ownership breakdown across all leasehold positions
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Owners"
          value="38"
          trend="flat"
          trendValue="across 12 leases"
          color="#C2A04E"
        />
        <StatCard
          label="Avg Interest"
          value="2.6%"
          trend="flat"
          trendValue="per owner"
          color="#C2A04E"
        />
        <StatCard
          label="Contacted"
          value="28"
          trend="up"
          trendValue="73.7%"
          color="#C2A04E"
          sparkline={[18, 21, 23, 25, 27, 28]}
        />
        <StatCard
          label="Negotiating"
          value="4"
          trend="up"
          trendValue="+1 this week"
          color="#7C3AED"
          sparkline={[1, 2, 2, 3, 3, 4]}
        />
      </div>

      {/* TreeMap */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-1"
          style={{ color: '#F1F5F9' }}
        >
          Ownership Breakdown
        </h3>
        <p
          className="text-[11px] mb-4"
          style={{ color: '#64748B' }}
        >
          Mineral interest by owner (% of total)
        </p>
        <TreeMap data={TREEMAP_DATA} />
      </div>

      {/* Mineral Owners Table */}
      <div
        className="rounded-xl border p-5 overflow-x-auto"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: '#F1F5F9' }}
        >
          Mineral Owner Register
        </h3>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Owner', 'Interest %', 'Est. Acres', 'Contact Status'].map(
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
            {MINERAL_OWNERS.map((o, i) => {
              const badge = CONTACT_BADGE[o.status];
              return (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid #252B36' }}
                >
                  <td className="py-2 px-2 font-medium" style={{ color: '#F1F5F9' }}>
                    {o.name}
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {o.interest.toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#CBD5E1' }}>
                    {o.acres.toLocaleString()}
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {o.status}
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
