'use client';

import {
  RECON_ORDERS,
  RECON_STATUS_COLORS,
  RECON_STATUS_LABELS,
  VEHICLES,
  type ReconStatus,
} from '@/data/lotos';

const KANBAN_COLUMNS: ReconStatus[] = [
  'needs-assessment',
  'parts-ordered',
  'in-shop',
  'qc',
  'complete',
];

export default function LotosReconPage() {
  // Summary stats (only active recon, not complete)
  const activeOrders = RECON_ORDERS.filter((r) => r.status !== 'complete');
  const unitsInRecon = activeOrders.length;

  const ordersWithCost = RECON_ORDERS.filter((r) => r.actualCost !== null && r.actualCost > 0);
  const avgReconCost =
    ordersWithCost.length > 0
      ? Math.round(ordersWithCost.reduce((sum, r) => sum + (r.actualCost ?? 0), 0) / ordersWithCost.length)
      : 0;

  const avgCycleTime =
    RECON_ORDERS.length > 0
      ? (RECON_ORDERS.reduce((sum, r) => sum + r.cycleDays, 0) / RECON_ORDERS.length).toFixed(1)
      : '0';

  const getVehicle = (vehicleId: string) => VEHICLES.find((v) => v.id === vehicleId);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Recon Board
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Reconditioning pipeline — track every vehicle from assessment to frontline
        </p>
      </div>

      {/* Summary Bar */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          background: '#FFFFFF',
          border: '1px solid #E7E5E4',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Units in Recon
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C1917', marginTop: '2px' }}>
            {unitsInRecon}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid #E7E5E4', paddingLeft: '24px' }}>
          <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Recon Cost
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C1917', marginTop: '2px' }}>
            ${avgReconCost.toLocaleString()}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid #E7E5E4', paddingLeft: '24px' }}>
          <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Cycle Time
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C1917', marginTop: '2px' }}>
            {avgCycleTime} days
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '14px',
          alignItems: 'start',
        }}
      >
        {KANBAN_COLUMNS.map((status) => {
          const orders = RECON_ORDERS.filter((r) => r.status === status);
          const columnColor = RECON_STATUS_COLORS[status];
          const label = RECON_STATUS_LABELS[status];

          return (
            <div key={status}>
              {/* Column Header */}
              <div
                style={{
                  borderRadius: '8px 8px 0 0',
                  padding: '10px 14px',
                  background: columnColor,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#FFFFFF' }}>
                  {label}
                </span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    padding: '1px 8px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {orders.length}
                </span>
              </div>

              {/* Column Body */}
              <div
                style={{
                  background: '#F1F5F9',
                  borderRadius: '0 0 8px 8px',
                  padding: '10px',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {orders.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '24px 8px',
                      color: '#A8A29E',
                      fontSize: '13px',
                    }}
                  >
                    No orders
                  </div>
                ) : (
                  orders.map((order) => {
                    const vehicle = getVehicle(order.vehicleId);
                    const costDisplay =
                      order.actualCost !== null
                        ? `$${order.actualCost.toLocaleString()} actual`
                        : order.estimatedCost > 0
                        ? `$${order.estimatedCost.toLocaleString()} est.`
                        : 'Assessment pending';

                    return (
                      <div
                        key={order.id}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E7E5E4',
                          borderRadius: '8px',
                          padding: '12px',
                        }}
                      >
                        {/* Vehicle */}
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1C1917' }}>
                          {order.vehicleId}
                        </div>
                        {vehicle && (
                          <div style={{ fontSize: '13px', color: '#57534E', marginBottom: '8px' }}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                        )}

                        {/* Items */}
                        <ul style={{ margin: '0 0 8px 0', padding: '0 0 0 16px' }}>
                          {order.items.map((item, i) => (
                            <li key={i} style={{ fontSize: '13px', color: '#57534E' }}>
                              {item}
                            </li>
                          ))}
                        </ul>

                        {/* Meta row */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid #F1F5F9',
                            paddingTop: '8px',
                            marginTop: '4px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: columnColor,
                            }}
                          >
                            {costDisplay}
                          </span>
                          <span style={{ fontSize: '12px', color: '#78716C' }}>
                            {order.cycleDays}d · {order.assignedTo.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
