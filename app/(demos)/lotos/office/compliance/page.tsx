'use client';

import { useState } from 'react';
import { CUSTOMERS } from '@/data/lotos';
import { DetailPanel, CustomerDetail, DealDetail, VehicleDetail } from '@/components/demos/lotos';

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

const TILA_CHECKLIST = [
  { item: 'APR Disclosure', status: 'Complete', required: true },
  { item: 'Finance Charge Disclosure', status: 'Complete', required: true },
  { item: 'Amount Financed', status: 'Complete', required: true },
  { item: 'Total of Payments', status: 'Complete', required: true },
  { item: 'Payment Schedule', status: 'Complete', required: true },
  { item: 'Late Payment Terms', status: 'Complete', required: true },
];

const AZ_REQUIREMENTS = [
  { requirement: 'Temp Tag Limit', detail: '30 days', status: 'Compliant', applicable: true },
  { requirement: 'Emissions Test', detail: 'Required (Maricopa County)', status: 'Compliant', applicable: true },
  { requirement: 'Sales Tax', detail: '5.6% state rate', status: 'Compliant', applicable: true },
  { requirement: 'Doc Fee Cap', detail: '$499 maximum', status: 'Compliant', applicable: true },
  { requirement: 'Lemon Law', detail: 'New vehicles only', status: 'N/A', applicable: false },
];

const AUDIT_TRAIL = [
  { timestamp: '2026-04-01 09:15', action: 'OFAC Screen', entity: 'CUS-010 Nicole Anderson', result: 'Clear', user: 'System' },
  { timestamp: '2026-04-01 08:30', action: 'TILA Disclosure Generated', entity: 'DL-2026-007', result: 'Complete', user: 'Lisa Park' },
  { timestamp: '2026-03-31 16:45', action: 'Contract Audit', entity: 'DL-2026-006', result: 'Passed', user: 'Jake Moreno' },
  { timestamp: '2026-03-31 14:20', action: 'OFAC Screen', entity: 'CUS-007 Robert Martinez', result: 'Clear', user: 'System' },
  { timestamp: '2026-03-30 11:00', action: 'Doc Fee Compliance Check', entity: 'DL-2026-005', result: 'Compliant ($399)', user: 'System' },
  { timestamp: '2026-03-29 09:30', action: 'Title Transfer Initiated', entity: 'DL-2026-003', result: 'Submitted', user: 'Lisa Park' },
  { timestamp: '2026-03-28 15:00', action: 'Emissions Report Filed', entity: 'STK-009', result: 'Passed', user: 'System' },
  { timestamp: '2026-03-27 10:15', action: 'OFAC Screen', entity: 'CUS-006 Ashley Brown', result: 'Clear', user: 'System' },
];

function resultBadge(result: string) {
  const lc = result.toLowerCase();
  if (lc.includes('clear') || lc.includes('complete') || lc.includes('passed') || lc.includes('compliant') || lc.includes('submitted')) {
    return { bg: '#DCFCE7', color: '#16A34A' };
  }
  return { bg: '#FEE2E2', color: '#DC2626' };
}

type DateRange = '7d' | '30d' | 'all';

function filterAuditByRange(range: DateRange) {
  if (range === 'all') return AUDIT_TRAIL;
  const now = new Date('2026-04-01T23:59:59');
  const days = range === '7d' ? 7 : 30;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return AUDIT_TRAIL.filter((e) => new Date(e.timestamp) >= cutoff);
}

export default function CompliancePage() {
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);
  const [screeningStatus, setScreeningStatus] = useState<Record<string, 'idle' | 'loading' | 'clear'>>({});
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  const filteredAudit = filterAuditByRange(dateRange);

  const runOfacScreen = (customerId: string) => {
    setScreeningStatus((prev) => ({ ...prev, [customerId]: 'loading' }));
    setTimeout(() => {
      setScreeningStatus((prev) => ({ ...prev, [customerId]: 'clear' }));
    }, 500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Compliance
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          OFAC screening, TILA disclosures, Arizona state requirements, and audit trail
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>OFAC Screening</h2>
              <p className="text-sm" style={{ color: '#57534E' }}>All customers screened against OFAC SDN list</p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold"
              style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
            >
              All Clear
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CUSTOMERS.map(customer => {
              const status = screeningStatus[customer.id] || 'idle';
              return (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}
                >
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: '#2563EB', cursor: 'pointer' }}
                      onClick={() => setPanelEntity({ type: 'customer', id: customer.id })}
                    >
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs" style={{ color: '#78716C' }}>{customer.id}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {status === 'clear' ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                      >
                        Clear
                      </span>
                    ) : status === 'loading' ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                      >
                        Screening...
                      </span>
                    ) : (
                      <>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                        >
                          Clear
                        </span>
                        <button
                          onClick={() => runOfacScreen(customer.id)}
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#2563EB',
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Re-screen
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1C1917' }}>
              TILA Disclosure Checklist
            </h2>
            <p className="text-sm mb-4" style={{ color: '#57534E' }}>
              Truth in Lending Act required disclosures
            </p>
            <div className="space-y-2">
              {TILA_CHECKLIST.map(item => (
                <div
                  key={item.item}
                  className="flex items-center justify-between rounded-lg px-4 py-2.5"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>{item.item}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                  >
                    ✓ {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
              <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>Arizona Requirements</h2>
              <p className="text-sm" style={{ color: '#57534E' }}>Phoenix dealer — Maricopa County</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
                  <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Requirement</th>
                  <th className="text-left px-4 py-2.5 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Detail</th>
                  <th className="text-center px-4 py-2.5 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {AZ_REQUIREMENTS.map((req, i) => (
                  <tr key={req.requirement} style={{ borderBottom: i < AZ_REQUIREMENTS.length - 1 ? '1px solid #F5F5F4' : undefined }}>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: '#1C1917' }}>{req.requirement}</td>
                    <td className="px-4 py-2.5" style={{ color: '#57534E' }}>{req.detail}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: req.applicable ? '#DCFCE7' : '#F1F5F9',
                          color: req.applicable ? '#16A34A' : '#78716C',
                        }}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>Compliance Audit Trail</h2>
            <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
              Recent compliance events, screens, and verifications
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {([['7d', 'Last 7d'], ['30d', 'Last 30d'], ['all', 'All']] as [DateRange, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setDateRange(value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid #E7E5E4',
                  background: dateRange === value ? '#2563EB' : '#FFFFFF',
                  color: dateRange === value ? '#FFFFFF' : '#57534E',
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Timestamp</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Action</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Entity</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Result</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>User</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudit.map((entry, i) => {
              const badge = resultBadge(entry.result);
              return (
                <tr key={i} style={{ borderBottom: i < filteredAudit.length - 1 ? '1px solid #F5F5F4' : undefined }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#78716C' }}>{entry.timestamp}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1C1917' }}>{entry.action}</td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>{entry.entity}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: badge.bg, color: badge.color }}
                    >
                      {entry.result}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>{entry.user}</td>
                </tr>
              );
            })}
            {filteredAudit.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: '#A8A29E' }}>
                  No audit entries in this date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
