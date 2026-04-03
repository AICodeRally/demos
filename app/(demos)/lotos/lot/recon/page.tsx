'use client';

import { useState } from 'react';
import {
  RECON_ORDERS,
  RECON_STATUS_COLORS,
  RECON_STATUS_LABELS,
  VEHICLES,
  type ReconStatus,
} from '@/data/lotos';
import { DetailPanel, VehicleDetail, DealDetail } from '@/components/demos/lotos';

type PanelEntity = { type: 'vehicle' | 'deal'; id: string } | null;

const KANBAN_COLUMNS: ReconStatus[] = [
  'needs-assessment',
  'parts-ordered',
  'in-shop',
  'qc',
  'complete',
];

const TECHS = ['Mike Torres', 'Carlos Ruiz', 'Unassigned'];

function buildInitialColumns(): Record<ReconStatus, string[]> {
  const map: Record<string, string[]> = {};
  for (const col of KANBAN_COLUMNS) map[col] = [];
  for (const order of RECON_ORDERS) {
    map[order.status].push(order.id);
  }
  return map as Record<ReconStatus, string[]>;
}

function buildInitialAssignments(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const order of RECON_ORDERS) {
    map[order.id] = order.assignedTo;
  }
  return map;
}

export default function LotosReconPage() {
  const [columns, setColumns] = useState<Record<ReconStatus, string[]>>(buildInitialColumns);
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);
  const [techAssignments, setTechAssignments] = useState<Record<string, string>>(buildInitialAssignments);

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
  const getOrder = (orderId: string) => RECON_ORDERS.find((o) => o.id === orderId);

  function handleDragStart(e: React.DragEvent, orderId: string) {
    e.dataTransfer.setData('text/plain', orderId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e: React.DragEvent, targetStatus: ReconStatus) {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    setColumns((prev) => {
      const next = { ...prev };
      for (const status of KANBAN_COLUMNS) {
        next[status] = prev[status].filter((id) => id !== orderId);
      }
      next[targetStatus] = [...next[targetStatus], orderId];
      return next;
    });
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px' }}>
        <h1 className="lot-heading">
          Recon Board
        </h1>
        <p className="lot-description">
          Reconditioning pipeline — track every vehicle from assessment to frontline
        </p>
      </div>

      <div className="lot-card" style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--lot-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Units in Recon
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--lot-text)', marginTop: '2px' }}>
            {unitsInRecon}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid var(--lot-border)', paddingLeft: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--lot-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Recon Cost
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--lot-text)', marginTop: '2px' }}>
            ${avgReconCost.toLocaleString()}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid var(--lot-border)', paddingLeft: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--lot-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Cycle Time
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--lot-text)', marginTop: '2px' }}>
            {avgCycleTime} days
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '14px',
          alignItems: 'start',
        }}
      >
        {KANBAN_COLUMNS.map((status) => {
          const orderIds = columns[status];
          const columnColor = RECON_STATUS_COLORS[status];
          const label = RECON_STATUS_LABELS[status];

          return (
            <div key={status}>
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
                  {orderIds.length}
                </span>
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
                style={{
                  background: 'var(--lot-card-alt)',
                  borderRadius: '0 0 8px 8px',
                  padding: '10px',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {orderIds.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '24px 8px',
                      color: 'var(--lot-text-muted)',
                      fontSize: '14px',
                    }}
                  >
                    No orders
                  </div>
                ) : (
                  orderIds.map((orderId) => {
                    const order = getOrder(orderId);
                    if (!order) return null;
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
                        draggable
                        onDragStart={(e) => handleDragStart(e, order.id)}
                        onClick={() => setPanelEntity({ type: 'vehicle', id: order.vehicleId })}
                        style={{
                          background: 'var(--lot-card)',
                          border: '1px solid var(--lot-border)',
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'grab',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--lot-text)' }}>
                          {order.vehicleId}
                        </div>
                        {vehicle && (
                          <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', marginBottom: '8px' }}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                        )}

                        <ul style={{ margin: '0 0 8px 0', padding: '0 0 0 16px' }}>
                          {order.items.map((item, i) => (
                            <li key={i} style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                              {item}
                            </li>
                          ))}
                        </ul>

                        <div style={{ marginBottom: '8px' }} onClick={(e) => e.stopPropagation()}>
                          <select
                            value={techAssignments[order.id] || 'Unassigned'}
                            onChange={(e) =>
                              setTechAssignments((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            className="lot-input"
                            style={{ padding: '4px 8px' }}
                          >
                            {TECHS.map((tech) => (
                              <option key={tech} value={tech}>{tech}</option>
                            ))}
                          </select>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid var(--lot-border-faint)',
                            paddingTop: '8px',
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: 700, color: columnColor }}>
                            {costDisplay}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)' }}>
                            {order.cycleDays}d
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

      <DetailPanel open={!!panelEntity} onClose={() => setPanelEntity(null)} title={panelEntity?.type === 'vehicle' ? 'Vehicle Details' : 'Deal Details'}>
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} />}
        {panelEntity?.type === 'deal' && <DealDetail dealId={panelEntity.id} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} />}
      </DetailPanel>
    </div>
  );
}
