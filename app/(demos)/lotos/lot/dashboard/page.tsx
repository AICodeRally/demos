'use client';

import { useState, useMemo } from 'react';
import { VEHICLES, DEALS, DEAL_STATUS_COLORS, RECON_ORDERS } from '@/data/lotos';
import { StatCard, DetailPanel, VehicleDetail, DealDetail } from '@/components/demos/lotos';

type TimeRange = '7d' | '30d' | '60d' | '90d';
type PanelEntity = { type: 'vehicle' | 'deal'; id: string } | null;

const REFERENCE_DATE = new Date('2026-04-01T00:00:00');

function daysAgo(days: number): Date {
  const d = new Date(REFERENCE_DATE);
  d.setDate(d.getDate() - days);
  return d;
}

const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  '7d': 7,
  '30d': 30,
  '60d': 60,
  '90d': 90,
};

export default function LosDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);

  const cutoffDate = useMemo(() => daysAgo(TIME_RANGE_DAYS[timeRange]), [timeRange]);

  const filteredDeals = useMemo(
    () => DEALS.filter((d) => new Date(d.closedDate) >= cutoffDate),
    [cutoffDate]
  );

  const inStock = VEHICLES.filter((v) => v.status !== 'sold');
  const unitsInStock = inStock.length;
  const avgDaysOnLot =
    inStock.length > 0
      ? Math.round(inStock.reduce((sum, v) => sum + v.daysOnLot, 0) / inStock.length)
      : 0;
  const frontlineReady = VEHICLES.filter((v) => v.status === 'frontline').length;
  const reconInProgress = VEHICLES.filter((v) => v.status === 'in-recon').length;
  const monthGross = filteredDeals.reduce((sum, d) => sum + d.totalGross, 0);

  const aged0_30 = inStock.filter((v) => v.daysOnLot <= 30).length;
  const aged31_60 = inStock.filter((v) => v.daysOnLot > 30 && v.daysOnLot <= 60).length;
  const aged61_90 = inStock.filter((v) => v.daysOnLot > 60).length;

  const recentDeals = useMemo(
    () =>
      [...filteredDeals]
        .sort((a, b) => new Date(b.closedDate).getTime() - new Date(a.closedDate).getTime())
        .slice(0, 5),
    [filteredDeals]
  );

  const agedCount = VEHICLES.filter((v) => v.daysOnLot > 60 && v.status !== 'sold').length;
  const needsAssessmentCount = RECON_ORDERS.filter((r) => r.status === 'needs-assessment').length;
  const bhphDeals = DEALS.filter((d) => d.type === 'bhph' && d.status === 'funded').length;

  const getVehicleLabel = (vehicleId: string) => {
    const v = VEHICLES.find((v) => v.id === vehicleId);
    return v ? `${v.year} ${v.make} ${v.model}` : vehicleId;
  };

  const timeRangeLabel: Record<TimeRange, string> = {
    '7d': '7 Days',
    '30d': '30 Days',
    '60d': '60 Days',
    '90d': '90 Days',
  };

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '28px' }}>
        <h1 className="lot-heading">
          Lot Dashboard
        </h1>
        <p className="lot-description">
          Real-time inventory health and recent activity
        </p>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {(['7d', '30d', '60d', '90d'] as TimeRange[]).map((tr) => (
          <button
            key={tr}
            onClick={() => setTimeRange(tr)}
            className={timeRange === tr ? 'lot-btn lot-btn-active' : 'lot-btn'}
          >
            {timeRangeLabel[tr]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <StatCard label="Units in Stock" value={String(unitsInStock)} color="#2563EB" animationDelay={0} />
        <StatCard label="Avg Days on Lot" value={String(avgDaysOnLot)} color="#7C3AED" animationDelay={1} />
        <StatCard label="Frontline Ready" value={String(frontlineReady)} color="#16A34A" animationDelay={2} />
        <StatCard label="Recon in Progress" value={String(reconInProgress)} color="#D97706" animationDelay={3} />
        <StatCard
          label={`Gross (${timeRangeLabel[timeRange]})`}
          value={`$${monthGross.toLocaleString()}`}
          color="#0891B2"
          animationDelay={4}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="lot-card lot-animate-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
            Aging Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 600 }}>0–30 Days</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>{aged0_30} units</span>
              </div>
              <div className="lot-progress-track">
                <div className="lot-progress-fill" style={{ width: `${inStock.length > 0 ? (aged0_30 / inStock.length) * 100 : 0}%`, background: '#16A34A' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 600 }}>31–60 Days</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#D97706' }}>{aged31_60} units</span>
              </div>
              <div className="lot-progress-track">
                <div className="lot-progress-fill" style={{ width: `${inStock.length > 0 ? (aged31_60 / inStock.length) * 100 : 0}%`, background: '#D97706' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 600 }}>61+ Days</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>{aged61_90} units</span>
              </div>
              <div className="lot-progress-track">
                <div className="lot-progress-fill" style={{ width: `${inStock.length > 0 ? (aged61_90 / inStock.length) * 100 : 0}%`, background: '#DC2626' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lot-card lot-animate-in" style={{ animationDelay: '0.36s' }}>
          <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
            Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {agedCount > 0 && (
              <a href="/lotos/lot/inventory" style={{ textDecoration: 'none' }}>
                <div className="lot-alert lot-alert-danger">
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#DC2626' }}>Aged Inventory</div>
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                      {agedCount} vehicle{agedCount !== 1 ? 's' : ''} aged over 60 days — consider price reduction or wholesale
                    </div>
                  </div>
                </div>
              </a>
            )}
            {needsAssessmentCount > 0 && (
              <a href="/lotos/lot/recon" style={{ textDecoration: 'none' }}>
                <div className="lot-alert lot-alert-warning">
                  <span style={{ fontSize: '18px' }}>🔧</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#D97706' }}>Recon Needs Assessment</div>
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                      {needsAssessmentCount} recon order{needsAssessmentCount !== 1 ? 's' : ''} waiting for inspection
                    </div>
                  </div>
                </div>
              </a>
            )}
            {bhphDeals > 0 && (
              <div className="lot-alert lot-alert-info">
                <span style={{ fontSize: '18px' }}>💳</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#2563EB' }}>BHPH Payment Due</div>
                  <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                    {bhphDeals} in-house account{bhphDeals !== 1 ? 's' : ''} — next payment cycle due today
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lot-card lot-animate-in" style={{ animationDelay: '0.42s' }}>
        <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
          Recent Deals
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="lot-table">
            <thead>
              <tr>
                {['Deal #', 'Vehicle', 'Sale Price', 'Total Gross', 'Status', 'Days to Fund'].map((h) => (
                  <th key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentDeals.map((deal) => (
                <tr
                  key={deal.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPanelEntity({ type: 'deal', id: deal.id })}
                >
                  <td style={{ fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}>
                    {deal.id}
                  </td>
                  <td
                    style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 500 }}
                    onClick={(e) => { e.stopPropagation(); setPanelEntity({ type: 'vehicle', id: deal.vehicleId }); }}
                  >
                    {getVehicleLabel(deal.vehicleId)}
                  </td>
                  <td style={{ color: 'var(--lot-text-secondary)' }}>
                    ${deal.salePrice.toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 700, color: '#16A34A' }}>
                    ${deal.totalGross.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        background: DEAL_STATUS_COLORS[deal.status] + '20',
                        color: DEAL_STATUS_COLORS[deal.status],
                        border: `1px solid ${DEAL_STATUS_COLORS[deal.status]}40`,
                        textTransform: 'capitalize',
                      }}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--lot-text-secondary)' }}>
                    {deal.daysToFund !== null ? `${deal.daysToFund} days` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DetailPanel open={!!panelEntity} onClose={() => setPanelEntity(null)} title={panelEntity?.type === 'vehicle' ? 'Vehicle Details' : 'Deal Details'}>
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} />}
        {panelEntity?.type === 'deal' && <DealDetail dealId={panelEntity.id} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} />}
      </DetailPanel>
    </div>
  );
}
