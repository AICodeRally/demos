'use client';

import { useState } from 'react';
import { StatCard } from '@/components/demos/crestline';
import { DISPUTES, COLORS } from '@/data/crestline';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  open: { bg: '#DBEAFE', text: '#2563EB', dot: '#3b82f6' },
  investigating: { bg: '#FEF3C7', text: '#D97706', dot: '#f59e0b' },
  escalated: { bg: '#FEE2E2', text: '#DC2626', dot: '#ef4444' },
  resolved: { bg: '#DCFCE7', text: '#059669', dot: '#10b981' },
  denied: { bg: '#F1F5F9', text: '#64748B', dot: '#6b7280' },
};

const KANBAN_COLUMNS = ['open', 'investigating', 'escalated', 'resolved', 'denied'] as const;
const KANBAN_LABELS: Record<string, string> = {
  open: 'Open',
  investigating: 'Investigating',
  escalated: 'Escalated',
  resolved: 'Resolved',
  denied: 'Denied',
};

// Dispute detail timeline for d2 (Elena's receipt-linked return)
const DISPUTE_TIMELINE: Record<string, { ts: string; actor: string; action: string; detail: string }[]> = {
  d2: [
    { ts: '2026-03-18 09:00', actor: 'Elena Vasquez', action: 'Dispute filed', detail: 'Filed dispute for PP3 (Mar 1-15). Return credited at current dept rate instead of original business date rate.' },
    { ts: '2026-03-18 10:30', actor: 'System', action: 'Auto-assigned', detail: 'Assigned to Diana Okafor (Comp Analyst) based on district and dept routing rules.' },
    { ts: '2026-03-19 14:00', actor: 'Diana Okafor', action: 'Investigation started', detail: 'Pulled receipt #R-91442. Original sale was in Designer Apparel at 5% rate. Return processed 3 weeks later when rep had transferred to Shoes (4.5%).' },
    { ts: '2026-03-20 11:00', actor: 'Diana Okafor', action: 'Investigation notes', detail: 'Per receipt recall policy, returns should use the selling dept rate at time of original sale, not current assignment. System applied current rate incorrectly.' },
  ],
  d1: [
    { ts: '2026-03-02 08:30', actor: 'Marcus Chen', action: 'Dispute filed', detail: 'Rate applied at 4.5% instead of 5% after mid-period transfer from Home to Shoes.' },
    { ts: '2026-03-03 09:00', actor: 'System', action: 'Auto-assigned', detail: 'Assigned to comp analyst team.' },
    { ts: '2026-03-04 15:00', actor: 'Comp Analyst', action: 'Verified', detail: 'Transfer effective date was Feb 20. Sales before that date should use Home rate (4%), after should use Shoes rate (4.5%). System used 4.5% for entire period instead of split calc.' },
    { ts: '2026-03-05 10:00', actor: 'Karen Mitchell', action: 'Resolved', detail: 'Recalculated with split rates. Adjustment of +$245 applied to PP4.' },
  ],
  d3: [
    { ts: '2026-04-06 10:00', actor: 'Aisha Thompson', action: 'Dispute filed', detail: 'Counter Lead Bonus not calculated for 5-week period P2. System used semi-monthly calendar instead of 4-5-4.' },
  ],
  d4: [
    { ts: '2026-04-02 09:00', actor: 'James Park', action: 'Dispute filed', detail: 'YTD sales crossed Gold threshold on Mar 22 but additive rate not applied until Apr 1.' },
    { ts: '2026-04-03 11:00', actor: 'Comp Analyst', action: 'Escalated', detail: 'Threshold crossing mid-period requires policy decision on effective date. Escalated to Comp Manager.' },
  ],
  d5: [
    { ts: '2026-02-18 14:00', actor: 'Sarah Kim', action: 'Dispute filed', detail: 'Requested full credit for assisted sale.' },
    { ts: '2026-02-20 10:00', actor: 'Store Manager', action: 'Reviewed', detail: 'Manager confirmed 50/50 split with Tyler Morrison was correct per assisted sale policy.' },
    { ts: '2026-02-22 09:00', actor: 'Karen Mitchell', action: 'Denied', detail: 'Split credit confirmed. No adjustment.' },
  ],
};

const OVERRIDES = [
  { date: '2026-03-05', rep: 'Marcus Chen', type: 'Rate Correction', original: '$1,820', adjusted: '$2,065', approvedBy: 'Karen Mitchell', reason: 'Mid-period transfer split calc' },
  { date: '2026-02-28', rep: 'Priya Sharma', type: 'Tier Adjustment', original: '$5,240', adjusted: '$5,610', approvedBy: 'Karen Mitchell', reason: 'Platinum threshold crossed mid-period' },
  { date: '2026-02-15', rep: 'Roberto Diaz', type: 'SPIFF Credit', original: '$1,440', adjusted: '$1,515', approvedBy: 'James Rodriguez (DM)', reason: 'Missing launch SPIFF for 3 qualifying units' },
  { date: '2026-02-10', rep: 'Tyler Morrison', type: 'Dept Reassignment', original: '$2,180', adjusted: '$2,290', approvedBy: 'Karen Mitchell', reason: 'Incorrect dept code on 4 POS transactions' },
];

const TRACE_STEPS = [
  { label: 'POS Transaction', detail: 'Sale captured at register', color: '#3b82f6' },
  { label: 'Transaction Staging', detail: 'Validated, deduplicated', color: '#6366f1' },
  { label: 'Selling Dept Assignment', detail: 'Merch hierarchy lookup', color: '#8b5cf6' },
  { label: 'Rate Lookup', detail: 'Dept rate + tier rate', color: '#a855f7' },
  { label: 'Commission Calc', detail: '5 components evaluated', color: '#c026d3' },
  { label: 'Payout', detail: 'Payroll feed generated', color: '#059669' },
];

export default function DisputesAndAudit() {
  const [selectedDisputeId, setSelectedDisputeId] = useState('d2');
  const selectedDispute = DISPUTES.find(d => d.id === selectedDisputeId)!;
  const timeline = DISPUTE_TIMELINE[selectedDisputeId] || [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Disputes & Audit Trail</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Error handling, override workflows, and end-to-end auditability — every dollar is traceable
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Open Disputes" value="2" color="#3b82f6" />
        <StatCard label="Avg Resolution" value="3.2 days" trend="down" trendValue="-1.8d" color="#059669" />
        <StatCard label="Override Rate" value="0.8%" trend="flat" trendValue="stable" color={COLORS.accent} />
        <StatCard label="Audit Coverage" value="100%" color="#059669" />
      </div>

      {/* Dispute Kanban */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Dispute Board</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Click any dispute card to view its detail and timeline
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {KANBAN_COLUMNS.map(status => {
            const cards = DISPUTES.filter(d => d.status === status);
            const sc = STATUS_COLORS[status];
            return (
              <div key={status} className="flex flex-col">
                {/* Column header */}
                <div className="rounded-t-md px-3 py-2" style={{ borderTop: `3px solid ${sc.dot}`, backgroundColor: 'var(--pl-bg)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text)' }}>
                      {KANBAN_LABELS[status]}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{cards.length}</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 rounded-b-md p-2" style={{ backgroundColor: 'var(--pl-stripe)', minHeight: 100 }}>
                  {cards.map(d => {
                    const isSelected = d.id === selectedDisputeId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDisputeId(d.id)}
                        className="text-left rounded-md p-2.5 shadow-sm transition-all"
                        style={{
                          backgroundColor: 'var(--pl-card)',
                          borderLeft: `3px solid ${sc.dot}`,
                          outline: isSelected ? `2px solid ${sc.dot}` : 'none',
                          outlineOffset: -1,
                        }}
                      >
                        <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--pl-text)' }}>{d.repName}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{d.periodLabel}</p>
                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: sc.bg, color: sc.text }}
                          >
                            {d.type}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--pl-text)' }}>${d.amount}</span>
                          <span className="text-[9px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{d.filedDate}</span>
                        </div>
                      </button>
                    );
                  })}
                  {cards.length === 0 && (
                    <div className="flex items-center justify-center h-16">
                      <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>No disputes</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispute Detail Panel */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--pl-text)' }}>
              Dispute Detail — {selectedDispute.repName}
            </h2>
            <p className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
              {selectedDispute.type} | {selectedDispute.periodLabel} | Filed {selectedDispute.filedDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{
                backgroundColor: STATUS_COLORS[selectedDispute.status].bg,
                color: STATUS_COLORS[selectedDispute.status].text,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[selectedDispute.status].dot }} />
              {selectedDispute.status.toUpperCase()}
            </span>
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--pl-text)' }}>${selectedDispute.amount}</span>
          </div>
        </div>

        <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'var(--pl-bg)' }}>
          <p className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{selectedDispute.description}</p>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ backgroundColor: 'var(--pl-border)' }} />
            <div className="space-y-3">
              {timeline.map((entry, i) => {
                const isLast = i === timeline.length - 1;
                return (
                  <div key={i} className="flex items-start gap-3 pl-1">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 z-10 border-2"
                      style={{
                        backgroundColor: isLast ? STATUS_COLORS[selectedDispute.status].dot : 'var(--pl-card)',
                        borderColor: isLast ? STATUS_COLORS[selectedDispute.status].dot : '#CBD5E1',
                      }}
                    />
                    <div className="flex-1 rounded-lg p-3" style={{ backgroundColor: 'var(--pl-bg)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: 'var(--pl-text)' }}>{entry.action}</span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{entry.ts}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>{entry.detail}</p>
                      <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--pl-text-muted)' }}>{entry.actor}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Audit Trail — Transaction Trace */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Transaction-Level Audit Trace</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-secondary)' }}>
          Every sale follows this path — fully traceable from POS to payout
        </p>

        <div className="flex items-start gap-1">
          {TRACE_STEPS.map((step, i) => (
            <div key={i} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2"
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </div>
                <p className="text-[10px] font-semibold text-center mb-0.5" style={{ color: 'var(--pl-text)' }}>{step.label}</p>
                <p className="text-[9px] text-center" style={{ color: 'var(--pl-text-secondary)' }}>{step.detail}</p>
              </div>
              {i < TRACE_STEPS.length - 1 && (
                <div className="flex items-center pt-4 px-0.5 flex-shrink-0">
                  <div className="w-3 h-0.5" style={{ backgroundColor: '#CBD5E1' }} />
                  <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px]" style={{ borderColor: 'transparent transparent transparent #CBD5E1' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Override Tracking */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Override Tracking</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Recent manual adjustments — every override requires approval and reason
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pl-border)' }}>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Date</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Rep</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Type</th>
                <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Original</th>
                <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Adjusted</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Approved By</th>
                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {OVERRIDES.map((o, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                  <td className="py-2.5 text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>{o.date}</td>
                  <td className="py-2.5 text-xs font-medium" style={{ color: 'var(--pl-text)' }}>{o.rep}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: 'var(--pl-stripe)', color: 'var(--pl-text-secondary)' }}>
                      {o.type}
                    </span>
                  </td>
                  <td className="py-2.5 text-xs font-mono text-right" style={{ color: 'var(--pl-text-muted)' }}>{o.original}</td>
                  <td className="py-2.5 text-xs font-mono text-right font-semibold" style={{ color: '#059669' }}>{o.adjusted}</td>
                  <td className="py-2.5 text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{o.approvedBy}</td>
                  <td className="py-2.5 text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{o.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* X-in-X-out Controls */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>X-in-X-out Reconciliation</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Total commissionable sales in must equal the sum of all commission outputs — no dollars lost or created
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input */}
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#DBEAFE' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2563EB' }}>Total Sales In</p>
            <p className="text-xl font-bold font-mono" style={{ color: '#1e40af' }}>$14.2M</p>
            <p className="text-[10px] mt-1" style={{ color: '#3b82f6' }}>PP1-PP6 commissionable sales</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <div className="w-12 h-0.5" style={{ backgroundColor: '#059669' }} />
                <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px]" style={{ borderColor: 'transparent transparent transparent #059669' }} />
              </div>
              <div className="rounded-full px-3 py-1 mt-2" style={{ backgroundColor: '#DCFCE7' }}>
                <p className="text-[10px] font-bold" style={{ color: '#059669' }}>BALANCED</p>
              </div>
              <p className="text-[9px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>Variance: $0.00</p>
            </div>
          </div>

          {/* Output */}
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#DCFCE7' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#059669' }}>Total Commission Out</p>
            <p className="text-xl font-bold font-mono" style={{ color: '#166534' }}>$782K</p>
            <p className="text-[10px] mt-1" style={{ color: '#059669' }}>5 components across 3,200 reps</p>
          </div>
        </div>
      </div>

      {/* Key callout */}
      <div className="rounded-xl border-2 p-4" style={{ borderColor: COLORS.accent, backgroundColor: '#FFFBEB' }}>
        <p className="text-xs font-semibold" style={{ color: 'var(--pl-text)' }}>
          Every dollar from POS is traceable to a commission output. No black boxes.
        </p>
      </div>
    </>
  );
}
