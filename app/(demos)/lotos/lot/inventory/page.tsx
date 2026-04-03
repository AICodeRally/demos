'use client';

import { useState } from 'react';
import { VEHICLES, STATUS_COLORS, STATUS_LABELS, type VehicleStatus, type Vehicle } from '@/data/lotos';
import { DataTable, type Column, DetailPanel, VehicleDetail, DealDetail, Toast } from '@/components/demos/lotos';

type FilterTab = 'all' | VehicleStatus;
type PanelEntity = { type: 'vehicle' | 'deal'; id: string } | null;

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
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  const inStock = VEHICLES.filter((v) => v.status !== 'sold');
  const avgDaysOnLot =
    inStock.length > 0
      ? Math.round(inStock.reduce((sum, v) => sum + v.daysOnLot, 0) / inStock.length)
      : 0;
  const totalInventoryValue = inStock.reduce((sum, v) => sum + v.askingPrice, 0);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const columns: Column<Vehicle>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      render: (v) => (
        <input
          type="checkbox"
          checked={selectedRows.has(v.id)}
          onChange={() => toggleRow(v.id)}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
      ),
    },
    {
      key: 'id',
      label: 'Stock #',
      sortFn: (a, b) => a.id.localeCompare(b.id),
      render: (v) => (
        <span style={{ fontWeight: 700, color: 'var(--lot-text)', whiteSpace: 'nowrap' }}>{v.id}</span>
      ),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortFn: (a, b) => `${a.year} ${a.make} ${a.model}`.localeCompare(`${b.year} ${b.make} ${b.model}`),
      render: (v) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--lot-text)' }}>{v.year} {v.make} {v.model}</div>
          <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)' }}>{v.trim}</div>
        </div>
      ),
    },
    {
      key: 'color',
      label: 'Color',
      sortFn: (a, b) => a.color.localeCompare(b.color),
      render: (v) => <span style={{ color: 'var(--lot-text-secondary)' }}>{v.color}</span>,
    },
    {
      key: 'mileage',
      label: 'Mileage',
      sortFn: (a, b) => a.mileage - b.mileage,
      align: 'right',
      render: (v) => <span style={{ color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>{v.mileage.toLocaleString()} mi</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortFn: (a, b) => a.status.localeCompare(b.status),
      render: (v) => (
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
      ),
    },
    {
      key: 'daysOnLot',
      label: 'Days on Lot',
      sortFn: (a, b) => a.daysOnLot - b.daysOnLot,
      align: 'right',
      render: (v) => (
        <span style={{ fontWeight: 700, color: getDaysColor(v.daysOnLot) }}>{v.daysOnLot}d</span>
      ),
    },
    {
      key: 'acquisitionCost',
      label: 'Acq Cost',
      sortFn: (a, b) => a.acquisitionCost - b.acquisitionCost,
      align: 'right',
      render: (v) => <span style={{ color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>${v.acquisitionCost.toLocaleString()}</span>,
    },
    {
      key: 'askingPrice',
      label: 'Asking Price',
      sortFn: (a, b) => a.askingPrice - b.askingPrice,
      align: 'right',
      render: (v) => <span style={{ fontWeight: 600, color: 'var(--lot-text)', whiteSpace: 'nowrap' }}>${v.askingPrice.toLocaleString()}</span>,
    },
    {
      key: 'spread',
      label: 'Spread',
      sortFn: (a, b) => (a.askingPrice - a.acquisitionCost - a.reconCost) - (b.askingPrice - b.acquisitionCost - b.reconCost),
      align: 'right',
      render: (v) => {
        const spread = v.askingPrice - v.acquisitionCost - v.reconCost;
        return (
          <span style={{ fontWeight: 700, color: spread > 0 ? '#16A34A' : '#DC2626', whiteSpace: 'nowrap' }}>
            ${spread.toLocaleString()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px' }}>
        <h1 className="lot-heading">
          Inventory
        </h1>
        <p className="lot-description">
          Full vehicle list with status, pricing, and lot age
        </p>
      </div>

      <div className="lot-card" style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Total Units: </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--lot-text)' }}>{inStock.length} in stock</span>
        </div>
        <div style={{ borderLeft: '1px solid var(--lot-border)', paddingLeft: '24px' }}>
          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Avg Days on Lot: </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--lot-text)' }}>{avgDaysOnLot} days</span>
        </div>
        <div style={{ borderLeft: '1px solid var(--lot-border)', paddingLeft: '24px' }}>
          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Total Inventory Value: </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>${totalInventoryValue.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search by stock #, make, model, trim, or color..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="lot-input"
          style={{ maxWidth: '480px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTER_TABS.map((tab) => {
          const count = getCounts(tab.key);
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={isActive ? 'lot-btn lot-btn-active' : 'lot-btn'}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {tab.label}
              <span
                style={{
                  background: isActive ? '#2563EB' : 'var(--lot-card-alt)',
                  color: isActive ? '#FFFFFF' : 'var(--lot-text-secondary)',
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

      {selectedRows.size > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--lot-text)' }}>
            {selectedRows.size} selected
          </span>
          <button
            onClick={() => {
              setToastMsg(`${selectedRows.size} vehicle${selectedRows.size !== 1 ? 's' : ''} marked for wholesale`);
              setSelectedRows(new Set());
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #D97706',
              background: '#FFFBEB',
              color: '#D97706',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Mark for Wholesale
          </button>
          <button
            onClick={() => {
              setToastMsg(`Price reduction applied to ${selectedRows.size} vehicle${selectedRows.size !== 1 ? 's' : ''}`);
              setSelectedRows(new Set());
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #DC2626',
              background: '#FEF2F2',
              color: '#DC2626',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Price Reduction
          </button>
        </div>
      )}

      <div className="lot-card" style={{ padding: 0 }}>
        <DataTable<Vehicle>
          columns={columns}
          data={filtered}
          keyFn={(v) => v.id}
          onRowClick={(v) => setPanelEntity({ type: 'vehicle', id: v.id })}
        />
      </div>

      <DetailPanel open={!!panelEntity} onClose={() => setPanelEntity(null)} title={panelEntity?.type === 'vehicle' ? 'Vehicle Details' : 'Deal Details'}>
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} />}
        {panelEntity?.type === 'deal' && <DealDetail dealId={panelEntity.id} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} />}
      </DetailPanel>

      {toastMsg && <Toast message={toastMsg} type="success" onDismiss={() => setToastMsg(null)} />}
    </div>
  );
}
