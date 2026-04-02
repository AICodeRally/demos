'use client';

import { VEHICLES, STATUS_COLORS, STATUS_LABELS } from '@/data/lotos';
import { DEALS, DEAL_STATUS_COLORS } from '@/data/lotos';
import { RECON_ORDERS } from '@/data/lotos';

export default function LosDashboardPage() {
  // --- Computed KPIs ---
  const inStock = VEHICLES.filter((v) => v.status !== 'sold');
  const unitsInStock = inStock.length;

  const avgDaysOnLot =
    inStock.length > 0
      ? Math.round(inStock.reduce((sum, v) => sum + v.daysOnLot, 0) / inStock.length)
      : 0;

  const frontlineReady = VEHICLES.filter((v) => v.status === 'frontline').length;
  const reconInProgress = VEHICLES.filter((v) => v.status === 'in-recon').length;

  // Current month = April 2026
  const currentMonthDeals = DEALS.filter((d) => d.closedDate.startsWith('2026-04'));
  const monthGross = currentMonthDeals.reduce((sum, d) => sum + d.totalGross, 0);

  // --- Aging Distribution ---
  const aged0_30 = inStock.filter((v) => v.daysOnLot <= 30).length;
  const aged31_60 = inStock.filter((v) => v.daysOnLot > 30 && v.daysOnLot <= 60).length;
  const aged61_90 = inStock.filter((v) => v.daysOnLot > 60).length;

  // --- Recent Deals (last 5 by date) ---
  const recentDeals = [...DEALS]
    .sort((a, b) => new Date(b.closedDate).getTime() - new Date(a.closedDate).getTime())
    .slice(0, 5);

  // --- Alerts ---
  const agedCount = VEHICLES.filter((v) => v.daysOnLot > 60 && v.status !== 'sold').length;
  const needsAssessmentCount = RECON_ORDERS.filter((r) => r.status === 'needs-assessment').length;
  const bhphDeals = DEALS.filter((d) => d.type === 'bhph' && d.status === 'funded').length;

  const getVehicleLabel = (vehicleId: string) => {
    const v = VEHICLES.find((v) => v.id === vehicleId);
    return v ? `${v.year} ${v.make} ${v.model}` : vehicleId;
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Lot Dashboard
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Real-time inventory health and recent activity
        </p>
      </div>

      {/* Hero KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Units in Stock */}
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#2563EB' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {unitsInStock}
          </div>
          <div style={{ color: '#57534E', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
            Units in Stock
          </div>
        </div>

        {/* Avg Days on Lot */}
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#7C3AED' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {avgDaysOnLot}
          </div>
          <div style={{ color: '#57534E', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
            Avg Days on Lot
          </div>
        </div>

        {/* Frontline Ready */}
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#16A34A' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {frontlineReady}
          </div>
          <div style={{ color: '#57534E', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
            Frontline Ready
          </div>
        </div>

        {/* Recon in Progress */}
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#D97706' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {reconInProgress}
          </div>
          <div style={{ color: '#57534E', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
            Recon in Progress
          </div>
        </div>

        {/* Month Gross */}
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#0891B2' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            ${monthGross.toLocaleString()}
          </div>
          <div style={{ color: '#57534E', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
            Month Gross (Apr)
          </div>
        </div>
      </div>

      {/* Two-column lower section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Aging Distribution */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
            Aging Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 0-30 */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#57534E', fontWeight: 600 }}>
                  0–30 Days
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>
                  {aged0_30} units
                </span>
              </div>
              <div
                style={{
                  height: '12px',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(aged0_30 / inStock.length) * 100}%`,
                    background: '#16A34A',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </div>
            {/* 31-60 */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#57534E', fontWeight: 600 }}>
                  31–60 Days
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#D97706' }}>
                  {aged31_60} units
                </span>
              </div>
              <div
                style={{
                  height: '12px',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(aged31_60 / inStock.length) * 100}%`,
                    background: '#D97706',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </div>
            {/* 61-90 */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#57534E', fontWeight: 600 }}>
                  61+ Days
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>
                  {aged61_90} units
                </span>
              </div>
              <div
                style={{
                  height: '12px',
                  background: '#F1F5F9',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(aged61_90 / inStock.length) * 100}%`,
                    background: '#DC2626',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
            Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {agedCount > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#DC2626' }}>
                    Aged Inventory
                  </div>
                  <div style={{ fontSize: '14px', color: '#57534E' }}>
                    {agedCount} vehicle{agedCount !== 1 ? 's' : ''} aged over 60 days — consider
                    price reduction or wholesale
                  </div>
                </div>
              </div>
            )}
            {needsAssessmentCount > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <span style={{ fontSize: '18px' }}>🔧</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#D97706' }}>
                    Recon Needs Assessment
                  </div>
                  <div style={{ fontSize: '14px', color: '#57534E' }}>
                    {needsAssessmentCount} recon order{needsAssessmentCount !== 1 ? 's' : ''} waiting
                    for inspection
                  </div>
                </div>
              </div>
            )}
            {bhphDeals > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <span style={{ fontSize: '18px' }}>💳</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#2563EB' }}>
                    BHPH Payment Due
                  </div>
                  <div style={{ fontSize: '14px', color: '#57534E' }}>
                    {bhphDeals} in-house account{bhphDeals !== 1 ? 's' : ''} — next payment cycle due
                    today
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Deals Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
          Recent Deals
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                {['Deal #', 'Vehicle', 'Sale Price', 'Total Gross', 'Status', 'Days to Fund'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600,
                        color: '#78716C',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentDeals.map((deal) => (
                <tr
                  key={deal.id}
                  style={{ borderBottom: '1px solid #F1F5F9' }}
                >
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: '#1C1917' }}>
                    {deal.id}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E' }}>
                    {getVehicleLabel(deal.vehicleId)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E' }}>
                    ${deal.salePrice.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>
                    ${deal.totalGross.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px' }}>
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
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E' }}>
                    {deal.daysToFund !== null ? `${deal.daysToFund} days` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
