'use client';

import { DEALS, DEAL_STATUS_COLORS } from '@/data/lotos';
import { VEHICLES } from '@/data/lotos';
import { CUSTOMERS } from '@/data/lotos';

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

export default function ContractingPage() {
  // Featured funded deal for document checklist
  const featuredDeal = DEALS.find((d) => d.id === 'DL-2026-003')!;
  const featuredVehicle = VEHICLES.find((v) => v.id === featuredDeal.vehicleId)!;
  const featuredCustomer = CUSTOMERS.find((c) => c.id === featuredDeal.customerId)!;

  // Pending deals with funding countdown
  const pendingDeals = DEALS.filter((d) => d.status === 'pending' || d.status === 'submitted');

  // All deals sorted by date desc
  const allDeals = [...DEALS].sort(
    (a, b) => new Date(b.closedDate).getTime() - new Date(a.closedDate).getTime()
  );

  const completedDocs = DOC_CHECKLIST.filter((d) => d.status === 'complete').length;
  const totalDocs = DOC_CHECKLIST.length;
  const completionPct = Math.round((completedDocs / totalDocs) * 100);

  const getVehicleLabel = (vehicleId: string) => {
    const v = VEHICLES.find((v) => v.id === vehicleId);
    return v ? `${v.year} ${v.make} ${v.model}` : vehicleId;
  };

  const getCustomerName = (customerId: string) => {
    const c = CUSTOMERS.find((c) => c.id === customerId);
    return c ? `${c.firstName} ${c.lastName}` : customerId;
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Contracting
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Document checklist, funding status, and deal summary
        </p>
      </div>

      {/* Top Two-Column: Deal Summary + Doc Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Deal Summary Card */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="text-xl font-bold" style={{ color: '#1C1917' }}>
              Deal Summary
            </h2>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Deal', value: featuredDeal.id, bold: true },
              { label: 'Vehicle', value: `${featuredVehicle.year} ${featuredVehicle.make} ${featuredVehicle.model} ${featuredVehicle.trim}` },
              { label: 'Customer', value: `${featuredCustomer.firstName} ${featuredCustomer.lastName}` },
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
                  borderBottom: '1px solid #F1F5F9',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#78716C', fontWeight: 500 }}>{row.label}</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: row.bold ? 700 : 600,
                    color: '#1C1917',
                    textAlign: 'right',
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Checklist */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="text-xl font-bold" style={{ color: '#1C1917' }}>
              Document Checklist
            </h2>
            <span style={{ fontSize: '14px', fontWeight: 700, color: completionPct === 100 ? '#16A34A' : '#D97706' }}>
              {completedDocs}/{totalDocs}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              height: '8px',
              background: '#F1F5F9',
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
            {DOC_CHECKLIST.map((doc) => {
              const style = DOC_STATUS_STYLES[doc.status];
              return (
                <div
                  key={doc.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1917' }}>
                    {doc.name}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{
                      background: '#FFFFFF',
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
        </div>
      </div>

      {/* Funding Countdown */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4', marginBottom: '20px' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
          Funding Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {pendingDeals.map((deal) => {
            const closedDate = new Date(deal.closedDate);
            const today = new Date('2026-04-01');
            const daysSinceClosed = Math.floor((today.getTime() - closedDate.getTime()) / (1000 * 60 * 60 * 24));
            const targetDays = 5;
            const progress = Math.min((daysSinceClosed / targetDays) * 100, 100);
            const vehicle = VEHICLES.find((v) => v.id === deal.vehicleId);
            const customer = CUSTOMERS.find((c) => c.id === deal.customerId);

            return (
              <div
                key={deal.id}
                style={{
                  border: '1.5px solid #E7E5E4',
                  borderRadius: '10px',
                  padding: '16px',
                  background: '#FAFAF9',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#1C1917' }}>{deal.id}</div>
                    <div style={{ fontSize: '13px', color: '#57534E', marginTop: '2px' }}>
                      {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : deal.vehicleId}
                    </div>
                    <div style={{ fontSize: '13px', color: '#57534E' }}>
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

                <div style={{ fontSize: '14px', fontWeight: 600, color: '#57534E', marginBottom: '6px' }}>
                  Day {daysSinceClosed} of funding (target: {targetDays} days)
                </div>

                <div
                  style={{
                    height: '10px',
                    background: '#F1F5F9',
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
                  <span style={{ fontSize: '12px', color: '#78716C' }}>Closed {deal.closedDate}</span>
                  <span style={{ fontSize: '12px', color: '#78716C', fontWeight: 600 }}>
                    Lender: {deal.lender}
                  </span>
                </div>
              </div>
            );
          })}

          {pendingDeals.length === 0 && (
            <div style={{ fontSize: '14px', color: '#78716C', fontStyle: 'italic' }}>
              No pending deals in funding pipeline.
            </div>
          )}
        </div>
      </div>

      {/* All Deals Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
          All Deals
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                {['Deal #', 'Vehicle', 'Customer', 'Sale Price', 'Lender', 'Status', 'Days to Fund', 'Closed'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 12px',
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {allDeals.map((deal, idx) => (
                <tr
                  key={deal.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9',
                  }}
                >
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: '#1C1917', whiteSpace: 'nowrap' }}>
                    {deal.id}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                    {getVehicleLabel(deal.vehicleId)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                    {getCustomerName(deal.customerId)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: '#1C1917', whiteSpace: 'nowrap' }}>
                    ${deal.salePrice.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
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
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                    {deal.daysToFund !== null ? `${deal.daysToFund} days` : '—'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                    {deal.closedDate}
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
