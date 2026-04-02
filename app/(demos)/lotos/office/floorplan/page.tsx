'use client';

import { useState } from 'react';
import { VEHICLES, PAYMENTS, PAYMENT_STATUS_COLORS } from '@/data/lotos';
import { DataTable, type Column, DetailPanel, VehicleDetail, DealDetail, CustomerDetail, StatusBadge } from '@/components/demos/lotos';
import type { Vehicle } from '@/data/lotos';

const APR = 0.065;

function calcCurtailmentDate(acquiredDate: string): string {
  const d = new Date(acquiredDate);
  d.setDate(d.getDate() + 90);
  return d.toISOString().split('T')[0];
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

const TODAY = '2026-04-01';

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

interface FloorplanRow extends Vehicle {
  curtailDate: string;
  daysLeft: number;
  monthlyInterest: number;
}

const pulseKeyframes = `
@keyframes urgentPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
`;

export default function FloorplanPage() {
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);

  const activeVehicles = VEHICLES.filter(v => v.status !== 'sold' && v.status !== 'wholesale');

  const floorplanVehicles: FloorplanRow[] = activeVehicles
    .filter(v => v.source === 'auction-manheim' || v.source === 'auction-adesa')
    .map(v => {
      const curtailDate = calcCurtailmentDate(v.acquiredDate);
      const daysLeft = daysBetween(TODAY, curtailDate);
      const monthlyInterest = Math.round((v.acquisitionCost * APR) / 12);
      return { ...v, curtailDate, daysLeft, monthlyInterest };
    });

  const cashVehicles = activeVehicles.filter(v =>
    v.source === 'trade-in' || v.source === 'private-party'
  );

  const totalFloorplanBalance = floorplanVehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
  const monthlyInterestTotal = floorplanVehicles.reduce((sum, v) => sum + v.monthlyInterest, 0);
  const avgDaysOnPlan = floorplanVehicles.length > 0
    ? Math.round(floorplanVehicles.reduce((sum, v) => sum + v.daysOnLot, 0) / floorplanVehicles.length)
    : 0;

  function curtailmentStatus(daysTo: number): { label: string; bg: string; color: string } {
    if (daysTo > 30) return { label: 'On Track', bg: '#DCFCE7', color: '#16A34A' };
    if (daysTo > 15) return { label: 'Watch', bg: '#FEF9C3', color: '#D97706' };
    return { label: 'Urgent', bg: '#FEE2E2', color: '#DC2626' };
  }

  const floorplanColumns: Column<FloorplanRow>[] = [
    {
      key: 'id',
      label: 'Stock #',
      render: (v) => <span style={{ fontWeight: 700, color: '#1C1917' }}>{v.id}</span>,
      sortFn: (a, b) => a.id.localeCompare(b.id),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (v) => <span>{v.year} {v.make} {v.model} {v.trim}</span>,
    },
    {
      key: 'daysOnLot',
      label: 'Days on Lot',
      align: 'right',
      sortFn: (a, b) => a.daysOnLot - b.daysOnLot,
      render: (v) => <span>{v.daysOnLot}</span>,
    },
    {
      key: 'acquisitionCost',
      label: 'Floorplan Amt',
      align: 'right',
      sortFn: (a, b) => a.acquisitionCost - b.acquisitionCost,
      render: (v) => <span style={{ fontWeight: 600, color: '#1C1917' }}>${v.acquisitionCost.toLocaleString()}</span>,
    },
    {
      key: 'monthlyInterest',
      label: 'Mo. Interest',
      align: 'right',
      sortFn: (a, b) => a.monthlyInterest - b.monthlyInterest,
      render: (v) => <span style={{ color: '#D97706' }}>${v.monthlyInterest.toLocaleString()}</span>,
    },
    {
      key: 'curtailDate',
      label: 'Curtailment Date',
      align: 'center',
      render: (v) => <span>{v.curtailDate}</span>,
    },
    {
      key: 'daysLeft',
      label: 'Days Left',
      align: 'right',
      sortFn: (a, b) => a.daysLeft - b.daysLeft,
      render: (v) => (
        <span
          style={{
            fontWeight: 700,
            color: v.daysLeft < 15 ? '#DC2626' : v.daysLeft < 30 ? '#D97706' : '#16A34A',
          }}
        >
          {v.daysLeft}d
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (v) => {
        const status = curtailmentStatus(v.daysLeft);
        return (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: status.bg,
              color: status.color,
              animation: v.daysLeft < 15 ? 'urgentPulse 1.5s ease-in-out infinite' : undefined,
            }}
          >
            {status.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <style dangerouslySetInnerHTML={{ __html: pulseKeyframes }} />

      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Floorplan Tracker
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          Vehicles on floorplan financing — curtailment dates and interest accruing
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total Floorplan Balance
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            ${totalFloorplanBalance.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{floorplanVehicles.length} units on plan</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Monthly Interest
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#D97706' }}>
            ${monthlyInterestTotal.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>at 6.5% APR</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Days on Plan
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>
            {avgDaysOnPlan}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>days average</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Units on Floorplan
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            {floorplanVehicles.length}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>of {activeVehicles.length} active units</p>
        </div>
      </div>

      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
            Floorplan Detail
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
            Auction-sourced vehicles — 90-day curtailment window — click row for details
          </p>
        </div>
        <DataTable
          columns={floorplanColumns}
          data={floorplanVehicles}
          keyFn={(v) => v.id}
          onRowClick={(v) => setPanelEntity({ type: 'vehicle', id: v.id })}
        />
        <div className="px-6 py-3 flex justify-between" style={{ borderTop: '2px solid #E7E5E4', backgroundColor: '#F8FAFC' }}>
          <span className="text-sm font-bold" style={{ color: '#1C1917' }}>Totals</span>
          <div className="flex gap-12">
            <span className="text-sm font-bold" style={{ color: '#1C1917' }}>${totalFloorplanBalance.toLocaleString()}</span>
            <span className="text-sm font-bold" style={{ color: '#D97706' }}>${monthlyInterestTotal.toLocaleString()}/mo</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>
          BHPH Collections
        </h2>
        <p className="text-sm mb-4" style={{ color: '#57534E' }}>
          Payment schedule for Buy-Here-Pay-Here accounts
        </p>
        {PAYMENTS.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#78716C', fontStyle: 'italic' }}>No payments scheduled.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PAYMENTS.map((pmt) => (
              <div
                key={pmt.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#FAFAF9',
                  borderRadius: '10px',
                  border: '1px solid #E7E5E4',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#1C1917' }}>{pmt.id}</span>
                  <span style={{ fontSize: '14px', color: '#57534E' }}>Deal: {pmt.dealId}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#57534E' }}>Due: {pmt.dueDate}</span>
                  {pmt.paidDate && <span style={{ fontSize: '14px', color: '#78716C' }}>Paid: {pmt.paidDate}</span>}
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#1C1917' }}>${pmt.amount}</span>
                  <StatusBadge
                    label={pmt.status.charAt(0).toUpperCase() + pmt.status.slice(1)}
                    color={PAYMENT_STATUS_COLORS[pmt.status]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>
          Cash vs Floorplan Mix
        </h2>
        <div className="flex items-end gap-8 h-36">
          {[
            { label: 'Floorplan (Auction)', count: floorplanVehicles.length, color: '#2563EB', total: totalFloorplanBalance },
            { label: 'Cash (Trade-in / Private)', count: cashVehicles.length, color: '#16A34A', total: cashVehicles.reduce((s, v) => s + v.acquisitionCost, 0) },
          ].map(bar => {
            const maxCount = Math.max(floorplanVehicles.length, cashVehicles.length);
            const heightPct = maxCount > 0 ? Math.round((bar.count / maxCount) * 100) : 0;
            return (
              <div key={bar.label} className="flex flex-col items-center gap-2 flex-1">
                <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{bar.count} units</p>
                <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                  <div
                    className="w-24 rounded-t-lg"
                    style={{ height: `${heightPct}%`, backgroundColor: bar.color, minHeight: '20px' }}
                  />
                </div>
                <p className="text-sm font-semibold text-center" style={{ color: '#57534E' }}>{bar.label}</p>
                <p className="text-xs" style={{ color: '#78716C' }}>${bar.total.toLocaleString()} total</p>
              </div>
            );
          })}
        </div>
        <p className="text-sm mt-4" style={{ color: '#57534E' }}>
          <strong style={{ color: '#1C1917' }}>{floorplanVehicles.length} of {activeVehicles.length}</strong> active units are on floorplan financing.
          Monthly interest cost of <strong style={{ color: '#D97706' }}>${monthlyInterestTotal.toLocaleString()}</strong> incentivizes faster turnover on aged units.
        </p>
      </div>

      <DetailPanel
        open={!!panelEntity}
        onClose={() => setPanelEntity(null)}
        title={panelEntity?.type === 'vehicle' ? 'Vehicle Details' : panelEntity?.type === 'customer' ? 'Customer Details' : 'Deal Details'}
      >
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} />}
        {panelEntity?.type === 'customer' && <CustomerDetail customerId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} />}
        {panelEntity?.type === 'deal' && <DealDetail dealId={panelEntity.id} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} onCustomerClick={(id) => setPanelEntity({ type: 'customer', id })} />}
      </DetailPanel>
    </div>
  );
}
