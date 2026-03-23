'use client';

import { fmtDollar, fmt } from '@/lib/utils';

const RECONCILIATION_STATUS = {
  lastRun: '2026-03-23T06:00:00Z',
  status: 'completed',
  transactionsProcessed: 14820,
  transactionsMatched: 14573,
  transactionsUnmatched: 247,
  matchRate: 98.3,
  accrualVariance: -42000,
  payoutsReconciled: 847,
  exceptionsFound: 12,
};

const VARIANCE_ITEMS = [
  { category: 'Commission Underpayment', count: 4, amount: 18200, direction: 'underpaid', status: 'pending_correction' },
  { category: 'Return Clawback Excess', count: 2, amount: 15600, direction: 'overpaid', status: 'under_review' },
  { category: 'SPIFF Miscategorization', count: 3, amount: 7800, direction: 'underpaid', status: 'corrected' },
  { category: 'Territory Credit Mismatch', count: 2, amount: 12400, direction: 'misattributed', status: 'pending_correction' },
  { category: 'Data Feed Timing Gap', count: 1, amount: 8200, direction: 'delayed', status: 'resolved' },
];

const RECONCILIATION_STEPS = [
  { step: 1, name: 'Transaction Ingestion', desc: 'ERP → Varicent feed validated', status: 'complete', records: '14,820', time: '12m' },
  { step: 2, name: 'Territory Resolution', desc: 'Match transactions to territories', status: 'complete', records: '14,573', time: '8m' },
  { step: 3, name: 'Commission Calculation', desc: 'Apply plans, tiers, SPIFFs', status: 'complete', records: '847 reps', time: '15m' },
  { step: 4, name: 'Accrual Comparison', desc: 'Expected vs actual variance', status: 'complete', records: '$42K var', time: '3m' },
  { step: 5, name: 'Exception Detection', desc: 'Flag outliers for review', status: 'complete', records: '12 flags', time: '2m' },
  { step: 6, name: 'Approval Routing', desc: 'Route to comp manager', status: 'in_progress', records: '3 pending', time: 'N/A' },
];

export default function ReconciliationPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
        >
          <span className="text-3xl text-white">&#9989;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F59E0B' }}>
            Act 4 &middot; RevOps Control Plane
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Reconciliation
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Transaction-to-payout reconciliation &middot; Match rate: {RECONCILIATION_STATUS.matchRate}%
          </p>
        </div>
      </div>

      {/* Status KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Processed', value: fmt(RECONCILIATION_STATUS.transactionsProcessed), color: '#1E3A5F' },
          { label: 'Match Rate', value: `${RECONCILIATION_STATUS.matchRate}%`, color: '#10B981' },
          { label: 'Exceptions', value: String(RECONCILIATION_STATUS.exceptionsFound), color: '#F59E0B' },
          { label: 'Accrual Variance', value: fmtDollar(Math.abs(RECONCILIATION_STATUS.accrualVariance)), color: '#EF4444' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
            <div className="text-xl font-extrabold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Steps */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Reconciliation Pipeline
        </h2>
        <div className="space-y-3">
          {RECONCILIATION_STEPS.map((step) => (
            <div
              key={step.step}
              className="flex items-center gap-4 rounded-lg border p-3"
              style={{ borderColor: 'var(--rl-border)', borderLeft: `3px solid ${step.status === 'complete' ? '#10B981' : '#F59E0B'}` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                style={{ background: step.status === 'complete' ? '#10B981' : '#F59E0B' }}
              >
                {step.status === 'complete' ? '\u2713' : step.step}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold" style={{ color: 'var(--rl-text)' }}>{step.name}</div>
                <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{step.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold tabular-nums" style={{ color: 'var(--rl-text)' }}>{step.records}</div>
                <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Variance Items */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Variance Detail
        </h2>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: 'var(--rl-text-muted)' }}>
              <th className="text-left font-semibold pb-2 pl-2">Category</th>
              <th className="text-right font-semibold pb-2">Count</th>
              <th className="text-right font-semibold pb-2">Amount</th>
              <th className="text-left font-semibold pb-2 pl-4">Direction</th>
              <th className="text-left font-semibold pb-2 pr-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {VARIANCE_ITEMS.map((v, i) => (
              <tr key={v.category} style={i % 2 === 0 ? { background: 'var(--rl-stripe)' } : undefined}>
                <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--rl-text)' }}>{v.category}</td>
                <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--rl-text)' }}>{v.count}</td>
                <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: '#EF4444' }}>{fmtDollar(v.amount)}</td>
                <td className="py-2.5 pl-4 capitalize" style={{ color: 'var(--rl-text-muted)' }}>{v.direction}</td>
                <td className="py-2.5 pr-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                    style={{
                      background: v.status === 'corrected' || v.status === 'resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: v.status === 'corrected' || v.status === 'resolved' ? '#10B981' : '#F59E0B',
                    }}>
                    {v.status.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
