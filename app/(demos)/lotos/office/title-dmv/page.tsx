'use client';

import { useState } from 'react';
import { DEALS, VEHICLES, CUSTOMERS } from '@/data/lotos';
import { DetailPanel, DealDetail, VehicleDetail, CustomerDetail, Toast } from '@/components/demos/lotos';

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

interface PipelineEntry {
  dealId: string;
  titleReceived: boolean;
  dmvSubmitted: boolean;
  registered: boolean;
}

const INITIAL_PIPELINE: PipelineEntry[] = [
  { dealId: 'DL-2026-001', titleReceived: true, dmvSubmitted: true, registered: true },
  { dealId: 'DL-2026-002', titleReceived: true, dmvSubmitted: true, registered: false },
  { dealId: 'DL-2026-003', titleReceived: true, dmvSubmitted: false, registered: false },
  { dealId: 'DL-2026-004', titleReceived: false, dmvSubmitted: false, registered: false },
  { dealId: 'DL-2026-005', titleReceived: false, dmvSubmitted: false, registered: false },
  { dealId: 'DL-2026-006', titleReceived: true, dmvSubmitted: true, registered: true },
  { dealId: 'DL-2026-007', titleReceived: false, dmvSubmitted: false, registered: false },
];

const TODAY = new Date('2026-04-01');

function StageIcon({ complete, inProgress, onClick }: { complete: boolean; inProgress: boolean; onClick?: () => void }) {
  const base = onClick ? { cursor: 'pointer' as const } : {};
  if (complete) return <span className="text-base font-bold" style={{ color: '#16A34A', ...base }} onClick={onClick}>✓</span>;
  if (inProgress) return <span className="text-base" style={{ color: '#2563EB', ...base }} onClick={onClick}>◐</span>;
  return <span className="text-base" style={{ color: '#D1D5DB', ...base }} onClick={onClick}>○</span>;
}

export default function TitleDmvPage() {
  const [stages, setStages] = useState<PipelineEntry[]>(() => INITIAL_PIPELINE.map((p) => ({ ...p })));
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const dealMap = Object.fromEntries(DEALS.map(d => [d.id, d]));
  const vehicleMap = Object.fromEntries(VEHICLES.map(v => [v.id, v]));
  const customerMap = Object.fromEntries(CUSTOMERS.map(c => [c.id, c]));

  const advanceStage = (index: number) => {
    setStages((prev) => {
      const next = [...prev];
      const entry = { ...next[index] };
      if (!entry.titleReceived) {
        entry.titleReceived = true;
      } else if (!entry.dmvSubmitted) {
        entry.dmvSubmitted = true;
      } else if (!entry.registered) {
        entry.registered = true;
      }
      next[index] = entry;
      return next;
    });
    setToastMsg('Stage advanced');
  };

  const dealClosed = stages.length;
  const titleReceived = stages.filter(p => p.titleReceived).length;
  const dmvSubmitted = stages.filter(p => p.dmvSubmitted).length;
  const registered = stages.filter(p => p.registered).length;

  const completedDeals = stages
    .filter(p => p.registered)
    .map(p => dealMap[p.dealId])
    .filter(d => d && d.fundedDate && d.closedDate);

  const avgDaysToTitle = completedDeals.length > 0
    ? Math.round(
        completedDeals.reduce((sum, d) => {
          const days = Math.round((new Date(d!.fundedDate!).getTime() - new Date(d!.closedDate).getTime()) / (1000 * 60 * 60 * 24));
          return sum + days + 12;
        }, 0) / completedDeals.length
      )
    : 14;

  const stagesSummary = [
    { label: 'Deal Closed', count: dealClosed },
    { label: 'Title Received', count: titleReceived },
    { label: 'DMV Submitted', count: dmvSubmitted },
    { label: 'Registration Complete', count: registered },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Title &amp; DMV
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          Title transfer pipeline and registration status for all active deals
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Deals Closed
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>{dealClosed}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>in pipeline</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Titles Received
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>{titleReceived}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>of {dealClosed} deals</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            DMV Submitted
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#7C3AED' }}>{dmvSubmitted}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>submitted for registration</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Days to Title
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>{avgDaysToTitle}</p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>days for completed titles</p>
        </div>
      </div>

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-5" style={{ color: '#1C1917' }}>
          Pipeline Stages
        </h2>
        <div className="flex items-center gap-0">
          {stagesSummary.map((stage, i) => (
            <div key={stage.label} className="flex items-center flex-1">
              <div className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    backgroundColor: stage.count === dealClosed ? '#16A34A' : stage.count > 0 ? '#2563EB' : '#E7E5E4',
                    color: stage.count > 0 ? '#FFFFFF' : '#78716C',
                  }}
                >
                  {stage.count}
                </div>
                <p className="text-sm font-semibold text-center" style={{ color: '#1C1917' }}>{stage.label}</p>
                <p className="text-xs" style={{ color: '#78716C' }}>
                  {Math.round((stage.count / dealClosed) * 100)}% of deals
                </p>
              </div>
              {i < stagesSummary.length - 1 && (
                <div
                  className="h-1 flex-1 mx-1"
                  style={{ backgroundColor: stagesSummary[i + 1].count > 0 ? '#2563EB' : '#E7E5E4', maxWidth: '60px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
            Per-Deal Title Tracker
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
            Click a stage icon to advance — click a row to view deal details
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Deal #</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Vehicle</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Customer</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Close Date</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Days in Stage</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Deal Closed</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Title Received</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>DMV Submitted</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((pipeline, i) => {
              const deal = dealMap[pipeline.dealId];
              if (!deal) return null;
              const vehicle = vehicleMap[deal.vehicleId];
              const customer = customerMap[deal.customerId];
              const daysInStage = Math.floor((TODAY.getTime() - new Date(deal.closedDate).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <tr
                  key={pipeline.dealId}
                  style={{
                    borderBottom: i < stages.length - 1 ? '1px solid #F5F5F4' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => setPanelEntity({ type: 'deal', id: deal.id })}
                >
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1C1917' }}>{deal.id}</td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>
                    {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : deal.vehicleId}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>
                    {customer ? `${customer.firstName} ${customer.lastName}` : deal.customerId}
                  </td>
                  <td className="px-4 py-3 text-center" style={{ color: '#57534E' }}>{deal.closedDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      style={{
                        fontWeight: 700,
                        color: daysInStage > 10 ? '#DC2626' : daysInStage > 5 ? '#D97706' : '#16A34A',
                      }}
                    >
                      {daysInStage}d
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <StageIcon complete={true} inProgress={false} />
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => { e.stopPropagation(); if (!pipeline.titleReceived) advanceStage(i); }}>
                    <StageIcon
                      complete={pipeline.titleReceived}
                      inProgress={!pipeline.titleReceived}
                      onClick={!pipeline.titleReceived ? () => advanceStage(i) : undefined}
                    />
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => { e.stopPropagation(); if (pipeline.titleReceived && !pipeline.dmvSubmitted) advanceStage(i); }}>
                    <StageIcon
                      complete={pipeline.dmvSubmitted}
                      inProgress={pipeline.titleReceived && !pipeline.dmvSubmitted}
                      onClick={pipeline.titleReceived && !pipeline.dmvSubmitted ? () => advanceStage(i) : undefined}
                    />
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => { e.stopPropagation(); if (pipeline.dmvSubmitted && !pipeline.registered) advanceStage(i); }}>
                    <StageIcon
                      complete={pipeline.registered}
                      inProgress={pipeline.dmvSubmitted && !pipeline.registered}
                      onClick={pipeline.dmvSubmitted && !pipeline.registered ? () => advanceStage(i) : undefined}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-3 flex gap-6" style={{ borderTop: '1px solid #E7E5E4', backgroundColor: '#F8FAFC' }}>
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#57534E' }}>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span> Complete
          </span>
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#57534E' }}>
            <span style={{ color: '#2563EB' }}>◐</span> In Progress (click to advance)
          </span>
          <span className="text-sm flex items-center gap-1.5" style={{ color: '#57534E' }}>
            <span style={{ color: '#D1D5DB' }}>○</span> Pending
          </span>
        </div>
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

      {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}
    </div>
  );
}
