'use client';

import { useState } from 'react';
import { VEHICLES, STATUS_COLORS, STATUS_LABELS, type VehicleStatus } from '@/data/lotos';

type FilterTab = 'all' | VehicleStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'frontline', label: 'Frontline' },
  { key: 'in-recon', label: 'In Recon' },
  { key: 'aged', label: 'Aged' },
  { key: 'sold', label: 'Sold' },
];

function getDaysColor(days: number): string {
  if (days <= 30) return '#16A34A';
  if (days <= 60) return '#D97706';
  return '#DC2626';
}

export default function LotosInventoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = VEHICLES.filter((v) => {
    const matchesFilter = activeFilter === 'all' || v.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      v.id.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.trim.toLowerCase().includes(q) ||
      v.color.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getCounts = (key: FilterTab) =>
    key === 'all' ? VEHICLES.length : VEHICLES.filter((v) => v.status === key).length;

  // Summary stats (across all non-sold vehicles)
  const inStock = VEHICLES.filter((v) => v.status !== 'sold');
  const avgDaysOnLot =
    inStock.length > 0
      ? Math.round(inStock.reduce((sum, v) => sum + v.daysOnLot, 0) / inStock.length)
      : 0;
  const totalInventoryValue = inStock.reduce((sum, v) => sum + v.askingPrice, 0);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Inventory
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Full vehicle list with status, pricing, and lot age
        </p>
      </div>

      {/* Summary bar */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          background: '#FFFFFF',
          border: '1px solid #E7E5E4',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}
      >
        <div>
          <span style={{ fontSize: '14px', color: '#78716C', fontWeight: 600 }}>Total Units: </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917' }}>
            {inStock.length} in stock
          </span>
        </div>
        <div style={{ borderLeft: '1px solid #E7E5E4', paddingLeft: '24px' }}>
          <span style={{ fontSize: '14px', color: '#78716C', fontWeight: 600 }}>
            Avg Days on Lot:{' '}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917' }}>
            {avgDaysOnLot} days
          </span>
        </div>
        <div style={{ borderLeft: '1px solid #E7E5E4', paddingLeft: '24px' }}>
          <span style={{ fontSize: '14px', color: '#78716C', fontWeight: 600 }}>
            Total Inventory Value:{' '}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>
            ${totalInventoryValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search by stock #, make, model, trim, or color..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '10px 14px',
            border: '1px solid #E7E5E4',
            borderRadius: '8px',
            fontSize: '15px',
            color: '#1C1917',
            background: '#FFFFFF',
            outline: 'none',
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTER_TABS.map((tab) => {
          const count = getCounts(tab.key);
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: isActive ? '2px solid #2563EB' : '2px solid #E7E5E4',
                background: isActive ? '#EFF6FF' : '#FFFFFF',
                color: isActive ? '#2563EB' : '#57534E',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
              <span
                style={{
                  background: isActive ? '#2563EB' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#57534E',
                  borderRadius: '999px',
                  padding: '1px 7px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vehicle Table */}
      <div className="rounded-xl bg-white border" style={{ borderColor: '#E7E5E4', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              {[
                'Stock #',
                'Vehicle',
                'Color',
                'Mileage',
                'Status',
                'Days on Lot',
                'Acq Cost',
                'Asking Price',
                'Spread',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: '#78716C',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#78716C',
                    fontSize: '15px',
                  }}
                >
                  No vehicles match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const spread = v.askingPrice - v.acquisitionCost - v.reconCost;
                return (
                  <tr
                    key={v.id}
                    style={{ borderBottom: '1px solid #F1F5F9' }}
                  >
                    <td
                      style={{
                        padding: '12px 14px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#1C1917',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v.id}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#1C1917' }}>
                      <div style={{ fontWeight: 600 }}>
                        {v.year} {v.make} {v.model}
                      </div>
                      <div style={{ fontSize: '13px', color: '#78716C' }}>{v.trim}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#57534E' }}>
                      {v.color}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                      {v.mileage.toLocaleString()} mi
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: STATUS_COLORS[v.status] + '20',
                          color: STATUS_COLORS[v.status],
                          border: `1px solid ${STATUS_COLORS[v.status]}40`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: getDaysColor(v.daysOnLot),
                        }}
                      >
                        {v.daysOnLot}d
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                      ${v.acquisitionCost.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: '#1C1917', whiteSpace: 'nowrap' }}>
                      ${v.askingPrice.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: '12px 14px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: spread > 0 ? '#16A34A' : '#DC2626',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ${spread.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
