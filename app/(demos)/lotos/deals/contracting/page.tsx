'use client';

import { useState } from 'react';
import { DEALS, DEAL_STATUS_COLORS, VEHICLES, CUSTOMERS } from '@/data/lotos';
import { DetailPanel, DealDetail, VehicleDetail, CustomerDetail, Toast } from '@/components/demos/lotos';

type DocStatus = 'complete' | 'pending' | 'missing';

interface DocItem {
  name: string;
  status: DocStatus;
}

const DOC_CHECKLIST: DocItem[] = [
  { name: "Buyer's Order", status: 'complete' },
  { name: 'Credit Application', status: 'complete' },
  { name: 'Lender Approval Letter', status: 'complete' },
  { name: 'Title Assignment', status: 'complete' },
  { name: 'Odometer Disclosure', status: 'complete' },
  { name: 'F&I Product Contracts', status: 'complete' },
  { name: 'Power of Attorney', status: 'pending' },
  { name: 'Tag & Title Application', status: 'pending' },
];

const DOC_STATUS_STYLES: Record<DocStatus, { color: string; bg: string; border: string; label: string }> = {
  complete: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Complete' },
  pending: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Pending' },
  missing: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Missing' },
};

const STATUS_CYCLE: DocStatus[] = ['complete', 'pending', 'missing'];

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

export default function ContractingPage() {
  const [selectedDealId, setSelectedDealId] = useState('DL-2026-003');
  const [docStatus, setDocStatus] = useState<DocItem[]>(() => DOC_CHECKLIST.map((d) => ({ ...d })));
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const featuredDeal = DEALS.find((d) => d.id === selectedDealId)!;
  const featuredVehicle = VEHICLES.find((v) => v.id === featuredDeal.vehicleId)!;
  const featuredCustomer = CUSTOMERS.find((c) => c.id === featuredDeal.customerId)!;

  const handleDealChange = (dealId: string) => {
    setSelectedDealId(dealId);
    setDocStatus(DOC_CHECKLIST.map((d) => ({ ...d })));
  };

  const cycleDocStatus = (index: number) => {
    setDocStatus((prev) => {
      const next = [...prev];
      const currentIdx = STATUS_CYCLE.indexOf(next[index].status);
      next[index] = { ...next[index], status: STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length] };
      return next;
    });
    setToastMsg('Status updated');
  };

  const pendingDeals = DEALS.filter((d) => d.status === 'pending' || d.status === 'submitted');
  const allDeals = [...DEALS].sort(
    (a, b) => new Date(b.closedDate).getTime() - new Date(a.closedDate).getTime()
  );

  const completedDocs = docStatus.filter((d) => d.status === 'complete').length;
  const totalDocs = docStatus.length;
  const completionPct = Math.round((completedDocs / totalDocs) * 100);

  const today = new Date('2026-04-01');
  const daysSinceClose = Math.floor((today.getTime() - new Date(featuredDeal.closedDate).getTime()) / (1000 * 60 * 60 * 24));

  const getVehicleLabel = (vehicleId: string) => {
    const v = VEHICLES.find((v) => v.id === vehicleId);
    return v ? `${v.year} ${v.make} ${v.model}` : vehicleId;
  };

  const getCustomerName = (customerId: string) => {
    const c = CUSTOMERS.find((c) => c.id === customerId);
    return c ? `${c.firstName} ${c.lastName}` : customerId;
  };

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="lot-heading">
            Contracting
          </h1>
          <p className="lot-description">
            Document checklist, funding status, and deal summary
          </p>
        </div>
        <select
          value={selectedDealId}
          onChange={(e) => handleDealChange(e.target.value)}
          className="lot-input"
        >
          {DEALS.map((d) => {
            const v = VEHICLES.find((veh) => veh.id === d.vehicleId);
            return (
              <option key={d.id} value={d.id}>
                {d.id} — {v ? `${v.year} ${v.make} ${v.model}` : d.vehicleId}
              </option>
            );
          })}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="lot-card lot-animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="lot-subheading">
              Deal Summary
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
              >
                {daysSinceClose} days since close
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{
                  background: DEAL_STATUS_COLORS[featuredDeal.status] + '20',
                  color: DEAL_STATUS_COLORS[featuredDeal.status],
                  border: `1px solid ${DEAL_STATUS_COLORS[featuredDeal.status]}40`,
                  textTransform: 'capitalize',
                }}
              >
                {featuredDeal.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Deal', value: featuredDeal.id, bold: true, clickable: true, onClick: () => setPanelEntity({ type: 'deal', id: featuredDeal.id }) },
              { label: 'Vehicle', value: `${featuredVehicle.year} ${featuredVehicle.make} ${featuredVehicle.model} ${featuredVehicle.trim}`, clickable: true, onClick: () => setPanelEntity({ type: 'vehicle', id: featuredVehicle.id }) },
              { label: 'Customer', value: `${featuredCustomer.firstName} ${featuredCustomer.lastName}`, clickable: true, onClick: () => setPanelEntity({ type: 'customer', id: featuredCustomer.id }) },
              { label: 'Sale Price', value: `$${featuredDeal.salePrice.toLocaleString()}` },
              { label: 'Trade Allowance', value: `$${featuredDeal.tradeAllowance.toLocaleString()}` },
              { label: 'Down Payment', value: `$${featuredDeal.downPayment.toLocaleString()}` },
              { label: 'Amount Financed', value: `$${(featuredDeal.salePrice - featuredDeal.tradeAllowance - featuredDeal.downPayment).toLocaleString()}` },
              { label: 'Lender', value: featuredDeal.lender },
              { label: 'Days to Fund', value: featuredDeal.daysToFund !== null ? `${featuredDeal.daysToFund} days` : '—' },
              { label: 'Funded Date', value: featuredDeal.fundedDate ?? '—' },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--lot-border-faint)',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 500 }}>{row.label}</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: row.bold ? 700 : 600,
                    color: row.clickable ? '#2563EB' : 'var(--lot-text)',
                    textAlign: 'right',
                    cursor: row.clickable ? 'pointer' : undefined,
                  }}
                  onClick={row.onClick}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lot-card lot-animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="lot-subheading">
              Document Checklist
            </h2>
            <span style={{ fontSize: '14px', fontWeight: 700, color: completionPct === 100 ? '#16A34A' : '#D97706' }}>
              {completedDocs}/{totalDocs}
            </span>
          </div>

          <div
            style={{
              height: '8px',
              background: 'var(--lot-border-faint)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${completionPct}%`,
                background: completionPct === 100 ? '#16A34A' : '#D97706',
                borderRadius: '4px',
                transition: 'width 0.3s',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {docStatus.map((doc, idx) => {
              const style = DOC_STATUS_STYLES[doc.status];
              return (
                <div
                  key={doc.name}
                  onClick={() => cycleDocStatus(idx)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--lot-text)' }}>
                    {doc.name}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{
                      background: 'var(--lot-card)',
                      color: style.color,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '12px' }}>Click any item to cycle status</p>
        </div>
      </div>

      <div className="lot-card lot-animate-in" style={{ marginBottom: '20px' }}>
        <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
          Funding Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {pendingDeals.map((deal) => {
            const closedDate = new Date(deal.closedDate);
            const daysSinceClosed = Math.floor((today.getTime() - closedDate.getTime()) / (1000 * 60 * 60 * 24));
            const targetDays = 5;
            const progress = Math.min((daysSinceClosed / targetDays) * 100, 100);
            const vehicle = VEHICLES.find((v) => v.id === deal.vehicleId);
            const customer = CUSTOMERS.find((c) => c.id === deal.customerId);

            return (
              <div
                key={deal.id}
                style={{
                  border: '1.5px solid var(--lot-border)',
                  borderRadius: '10px',
                  padding: '16px',
                  background: 'var(--lot-card-alt)',
                  cursor: 'pointer',
                }}
                onClick={() => setPanelEntity({ type: 'deal', id: deal.id })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--lot-text)' }}>{deal.id}</div>
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', marginTop: '2px' }}>
                      {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : deal.vehicleId}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                      {customer ? `${customer.firstName} ${customer.lastName}` : deal.customerId}
                    </div>
                  </div>
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
                </div>

                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--lot-text-secondary)', marginBottom: '6px' }}>
                  Day {daysSinceClosed} of funding (target: {targetDays} days)
                </div>

                <div
                  style={{
                    height: '10px',
                    background: 'var(--lot-border-faint)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: progress < 60 ? '#16A34A' : progress < 90 ? '#D97706' : '#DC2626',
                      borderRadius: '5px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)' }}>Closed {deal.closedDate}</span>
                  <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>
                    Lender: {deal.lender}
                  </span>
                </div>
              </div>
            );
          })}

          {pendingDeals.length === 0 && (
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontStyle: 'italic' }}>
              No pending deals in funding pipeline.
            </div>
          )}
        </div>
      </div>

      <div className="lot-card lot-animate-in">
        <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
          All Deals
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--lot-border-faint)' }}>
                {['Deal #', 'Vehicle', 'Customer', 'Sale Price', 'Lender', 'Status', 'Days to Fund', 'Closed'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600,
                        color: 'var(--lot-text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {allDeals.map((deal, idx) => (
                <tr
                  key={deal.id}
                  style={{
                    borderBottom: '1px solid var(--lot-border-faint)',
                    background: idx % 2 === 0 ? 'var(--lot-card)' : 'var(--lot-card-alt)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setPanelEntity({ type: 'deal', id: deal.id })}
                >
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: 'var(--lot-text)', whiteSpace: 'nowrap' }}>
                    {deal.id}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>
                    {getVehicleLabel(deal.vehicleId)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>
                    {getCustomerName(deal.customerId)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--lot-text)', whiteSpace: 'nowrap' }}>
                    ${deal.salePrice.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>
                    {deal.lender}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        background: DEAL_STATUS_COLORS[deal.status] + '20',
                        color: DEAL_STATUS_COLORS[deal.status],
                        border: `1px solid ${DEAL_STATUS_COLORS[deal.status]}40`,
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>
                    {deal.daysToFund !== null ? `${deal.daysToFund} days` : '—'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>
                    {deal.closedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
