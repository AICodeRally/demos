'use client';

import { useState } from 'react';
import { CUSTOMERS, TIER_COLORS, TIER_LABELS, type CreditTier, type LeadSource } from '@/data/lotos';
import { DetailPanel, CustomerDetail, VehicleDetail, DealDetail } from '@/components/demos/lotos';

const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  'walk-in': 'Walk-in',
  phone: 'Phone',
  referral: 'Referral',
  facebook: 'Facebook',
  cargurus: 'CarGurus',
};

const LEAD_SOURCES: { key: LeadSource | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'website', label: 'Website' },
  { key: 'walk-in', label: 'Walk-in' },
  { key: 'phone', label: 'Phone' },
  { key: 'referral', label: 'Referral' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'cargurus', label: 'CarGurus' },
];

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
  const [leadSourceFilter, setLeadSourceFilter] = useState<LeadSource | 'all'>('all');
  const [panelEntity, setPanelEntity] = useState<{ type: 'customer' | 'vehicle' | 'deal'; id: string } | null>(null);
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>(
    () => Object.fromEntries(CUSTOMERS.map(c => [c.id, c.notes]))
  );
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  const tierCounts = CUSTOMERS.reduce<Record<string, number>>((acc, c) => {
    acc[c.creditTier] = (acc[c.creditTier] || 0) + 1;
    return acc;
  }, {});

  const leadSourceCounts = CUSTOMERS.reduce<Record<string, number>>((acc, c) => {
    acc[c.leadSource] = (acc[c.leadSource] || 0) + 1;
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
    const matchesSource = leadSourceFilter === 'all' || c.leadSource === leadSourceFilter;
    return matchesSearch && matchesTier && matchesSource;
  });

  function startEditNote(customerId: string) {
    setEditingNote(customerId);
    setEditingNoteText(customerNotes[customerId] || '');
  }

  function saveNote(customerId: string) {
    setCustomerNotes(prev => ({ ...prev, [customerId]: editingNoteText }));
    setEditingNote(null);
    setEditingNoteText('');
  }

  return (
    <div className="lot-page">
      <div>
        <h1 className="lot-heading">
          CRM — Customers
        </h1>
        <p className="lot-description">
          {CUSTOMERS.length} customers tracked across all credit tiers
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {TIERS.filter((t) => t.key !== 'all').map((t, index) => (
          <div
            key={t.key}
            className="lot-card lot-animate-in"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>
              {t.label}
            </p>
            <p className="text-3xl font-bold mt-1" style={{ color: TIER_COLORS[t.key as CreditTier] }}>
              {tierCounts[t.key] || 0}
            </p>
          </div>
        ))}
        <div className="lot-card lot-animate-in" style={{ animationDelay: `${4 * 0.06}s` }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>
            Total
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--lot-text)' }}>
            {CUSTOMERS.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lot-input flex-1"
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

      <div className="flex gap-2 flex-wrap">
        {LEAD_SOURCES.map((s) => {
          const isActive = leadSourceFilter === s.key;
          const count = s.key === 'all' ? CUSTOMERS.length : (leadSourceCounts[s.key] || 0);
          return (
            <button
              key={s.key}
              onClick={() => setLeadSourceFilter(s.key)}
              className={`lot-btn ${isActive ? 'lot-btn-active' : ''}`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="lot-card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--lot-card-alt)', borderBottom: '1px solid var(--lot-border)' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }}>
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }}>
                Contact
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }}>
                Credit Tier
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }}>
                Lead Source
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }}>
                Created
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }}>
                Notes
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--lot-text-muted)' }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <>
                <tr
                  key={c.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{
                    borderBottom: editingNote === c.id ? undefined : (i < filtered.length - 1 ? '1px solid var(--lot-border-faint)' : undefined),
                  }}
                  onClick={() => setPanelEntity({ type: 'customer', id: c.id })}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold" style={{ color: 'var(--lot-text)' }}>
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--lot-text-muted)' }}>
                      {c.id}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p style={{ color: 'var(--lot-text)' }}>{c.phone}</p>
                    <p className="text-xs" style={{ color: 'var(--lot-text-muted)' }}>
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
                    <span style={{ color: 'var(--lot-text-secondary)' }}>{LEAD_SOURCE_LABELS[c.leadSource]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: 'var(--lot-text-secondary)' }}>{c.createdDate}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <span
                      style={{ color: 'var(--lot-text-muted)' }}
                      className="block truncate text-sm"
                      title={customerNotes[c.id]}
                    >
                      {customerNotes[c.id]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEditNote(c.id); }}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors hover:bg-blue-50"
                      style={{ color: '#2563EB', borderColor: '#2563EB' }}
                    >
                      Edit Note
                    </button>
                  </td>
                </tr>
                {editingNote === c.id && (
                  <tr key={`${c.id}-note`} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--lot-border-faint)' : undefined }}>
                    <td colSpan={7} className="px-4 py-3" style={{ backgroundColor: 'var(--lot-card-alt)' }}>
                      <textarea
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        className="lot-input w-full"
                        style={{ minHeight: '60px' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); saveNote(c.id); }}
                          className="rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-colors"
                          style={{ backgroundColor: '#2563EB' }}
                        >
                          Save
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingNote(null); }}
                          className="rounded-lg px-4 py-1.5 text-sm font-semibold border transition-colors"
                          style={{ color: 'var(--lot-text-secondary)', borderColor: 'var(--lot-border)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: 'var(--lot-text-muted)' }}>
            No customers match your search.
          </div>
        )}
      </div>

      <DetailPanel
        open={!!panelEntity}
        onClose={() => setPanelEntity(null)}
        title={panelEntity?.type === 'customer' ? 'Customer Details' : panelEntity?.type === 'vehicle' ? 'Vehicle Details' : 'Deal Details'}
      >
        {panelEntity?.type === 'customer' && (
          <CustomerDetail
            customerId={panelEntity.id}
            onDealClick={(id) => setPanelEntity({ type: 'deal', id })}
            onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })}
          />
        )}
        {panelEntity?.type === 'vehicle' && (
          <VehicleDetail
            vehicleId={panelEntity.id}
            onDealClick={(id) => setPanelEntity({ type: 'deal', id })}
          />
        )}
        {panelEntity?.type === 'deal' && (
          <DealDetail
            dealId={panelEntity.id}
            onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })}
            onCustomerClick={(id) => setPanelEntity({ type: 'customer', id })}
          />
        )}
      </DetailPanel>
    </div>
  );
}
