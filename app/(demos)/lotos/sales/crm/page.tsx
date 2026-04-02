'use client';

import { useState } from 'react';
import { CUSTOMERS, TIER_COLORS, TIER_LABELS, type CreditTier } from '@/data/lotos';

const LEAD_SOURCE_LABELS: Record<string, string> = {
  website: 'Website',
  'walk-in': 'Walk-in',
  phone: 'Phone',
  referral: 'Referral',
  facebook: 'Facebook',
  cargurus: 'CarGurus',
};

type TierFilter = 'all' | CreditTier;

const TIERS: { key: TierFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'prime', label: 'Prime' },
  { key: 'near-prime', label: 'Near-Prime' },
  { key: 'subprime', label: 'Subprime' },
  { key: 'deep-subprime', label: 'Deep Sub' },
];

export default function CRMPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');

  const tierCounts = CUSTOMERS.reduce<Record<string, number>>((acc, c) => {
    acc[c.creditTier] = (acc[c.creditTier] || 0) + 1;
    return acc;
  }, {});

  const filtered = CUSTOMERS.filter((c) => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesSearch =
      search === '' ||
      name.includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesTier = tierFilter === 'all' || c.creditTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          CRM — Customers
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          {CUSTOMERS.length} customers tracked across all credit tiers
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {TIERS.filter((t) => t.key !== 'all').map((t) => (
          <div
            key={t.key}
            className="rounded-xl bg-white border p-4"
            style={{ borderColor: '#E7E5E4' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
              {t.label}
            </p>
            <p className="text-3xl font-bold mt-1" style={{ color: TIER_COLORS[t.key as CreditTier] }}>
              {tierCounts[t.key] || 0}
            </p>
          </div>
        ))}
        <div className="rounded-xl bg-white border p-4" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            {CUSTOMERS.length}
          </p>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
        />
        <div className="flex gap-2 flex-wrap">
          {TIERS.map((t) => {
            const isActive = tierFilter === t.key;
            const count = t.key === 'all' ? CUSTOMERS.length : (tierCounts[t.key] || 0);
            const color = t.key === 'all' ? '#1E3A5F' : TIER_COLORS[t.key as CreditTier];
            return (
              <button
                key={t.key}
                onClick={() => setTierFilter(t.key)}
                className="rounded-full px-4 py-2 text-sm font-semibold border transition-colors"
                style={{
                  backgroundColor: isActive ? color : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : color,
                  borderColor: color,
                }}
              >
                {t.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Contact
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Credit Tier
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Lead Source
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Created
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid #F5F5F4' : undefined,
                }}
              >
                <td className="px-4 py-3">
                  <p className="font-semibold" style={{ color: '#1C1917' }}>
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="text-xs" style={{ color: '#78716C' }}>
                    {c.id}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p style={{ color: '#1C1917' }}>{c.phone}</p>
                  <p className="text-xs" style={{ color: '#78716C' }}>
                    {c.email}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: TIER_COLORS[c.creditTier] }}
                  >
                    {TIER_LABELS[c.creditTier].split(' (')[0]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: '#57534E' }}>{LEAD_SOURCE_LABELS[c.leadSource]}</span>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: '#57534E' }}>{c.createdDate}</span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <span
                    style={{ color: '#78716C' }}
                    className="block truncate text-sm"
                    title={c.notes}
                  >
                    {c.notes}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: '#78716C' }}>
            No customers match your search.
          </div>
        )}
      </div>
    </div>
  );
}
