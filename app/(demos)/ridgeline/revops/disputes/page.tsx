'use client';

import { DISPUTES, DISPUTE_METRICS } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

const statusColors: Record<string, string> = {
  open: '#F59E0B',
  under_review: '#2563EB',
  escalated: '#EF4444',
  resolved: '#10B981',
  rejected: '#94A3B8',
};

const priorityColors: Record<string, string> = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

export default function DisputesPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
        >
          <span className="text-3xl text-white">&#128172;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F59E0B' }}>
            Act 4 &middot; RevOps Control Plane
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Disputes & Inquiries
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            SLA Compliance: {DISPUTE_METRICS.slaCompliance}% &middot; Avg Resolution: {DISPUTE_METRICS.avgResolutionDays} days
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Open', value: String(DISPUTE_METRICS.totalOpen), color: '#F59E0B' },
          { label: 'Resolved', value: String(DISPUTE_METRICS.totalResolved), color: '#10B981' },
          { label: 'Total Disputed', value: fmtDollar(DISPUTE_METRICS.totalDisputedAmount), color: '#EF4444' },
          { label: 'SLA Compliance', value: `${DISPUTE_METRICS.slaCompliance}%`, color: DISPUTE_METRICS.slaCompliance >= 90 ? '#10B981' : '#F59E0B' },
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

      {/* By Type */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          By Type
        </h2>
        <div className="space-y-2">
          {DISPUTE_METRICS.byType.map((t) => (
            <div key={t.type} className="flex items-center gap-3">
              <div className="w-36 text-[12px] font-semibold capitalize" style={{ color: 'var(--rl-text)' }}>
                {t.type.replace(/_/g, ' ')}
              </div>
              <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded flex items-center px-2"
                  style={{ width: `${(t.count / DISPUTES.length) * 100}%`, background: '#F59E0B', minWidth: '40px' }}
                >
                  <span className="text-[10px] font-bold text-white">{t.count}</span>
                </div>
              </div>
              <div className="w-20 text-right text-[12px] tabular-nums font-semibold" style={{ color: 'var(--rl-text)' }}>
                {fmtDollar(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispute List */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          All Disputes
        </h2>
        <div className="space-y-3">
          {DISPUTES.map((d) => (
            <div
              key={d.id}
              className="rounded-lg border p-4"
              style={{ borderColor: 'var(--rl-border)', borderLeft: `3px solid ${statusColors[d.status]}` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColors[d.status]}15`, color: statusColors[d.status] }}>
                      {d.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${priorityColors[d.priority]}15`, color: priorityColors[d.priority] }}>
                      {d.priority}
                    </span>
                    <span className="text-[11px] capitalize" style={{ color: 'var(--rl-text-muted)' }}>{d.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--rl-text)' }}>{d.repName} &middot; {d.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: d.amount > 0 ? '#EF4444' : 'var(--rl-text-muted)' }}>{d.amount > 0 ? fmtDollar(d.amount) : '$0'}</div>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed mb-2" style={{ color: 'var(--rl-text-muted)' }}>{d.description}</p>
              <div className="flex gap-4 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                <span>Submitted: {d.submittedDate}</span>
                <span>Assigned: {d.assignedTo}</span>
                {d.resolvedDate && <span>Resolved: {d.resolvedDate}</span>}
              </div>
              {d.resolution && (
                <div className="mt-2 rounded-lg p-2 text-[11px]" style={{ background: 'rgba(16,185,129,0.06)', color: '#059669' }}>
                  <strong>Resolution:</strong> {d.resolution}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
