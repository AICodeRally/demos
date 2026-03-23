'use client';

import { AUDIT_EVENTS, getRecentAuditEvents } from '@/data/ridgeline';

const recentEvents = getRecentAuditEvents(12);

const severityColors: Record<string, string> = {
  info: '#10B981',
  warning: '#F59E0B',
  critical: '#EF4444',
};

const actionLabels: Record<string, string> = {
  plan_published: 'Plan Published',
  territory_changed: 'Territory Changed',
  quota_adjusted: 'Quota Adjusted',
  payout_approved: 'Payout Approved',
  payout_reversed: 'Payout Reversed',
  dispute_opened: 'Dispute Opened',
  dispute_resolved: 'Dispute Resolved',
  spiff_activated: 'SPIFF Activated',
  spiff_expired: 'SPIFF Expired',
  rebate_tier_changed: 'Rebate Tier Changed',
  employee_reassigned: 'Employee Reassigned',
  branch_integrated: 'Branch Integrated',
  rate_change: 'Rate Change',
  data_feed_error: 'Data Feed Error',
};

export default function AuditTrailPage() {
  const byAction = AUDIT_EVENTS.reduce<Record<string, number>>((acc, e) => {
    acc[e.action] = (acc[e.action] || 0) + 1;
    return acc;
  }, {});

  const bySeverity = AUDIT_EVENTS.reduce<Record<string, number>>((acc, e) => {
    acc[e.severity] = (acc[e.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
        >
          <span className="text-3xl text-white">&#128737;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F59E0B' }}>
            Act 4 &middot; RevOps Control Plane
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Audit Trail
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Immutable event log for SOX compliance &middot; {AUDIT_EVENTS.length} events
          </p>
        </div>
      </div>

      {/* Severity Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(['info', 'warning', 'critical'] as const).map((sev) => (
          <div
            key={sev}
            className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${severityColors[sev]}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1 capitalize" style={{ color: 'var(--rl-text-muted)' }}>{sev}</div>
            <div className="text-2xl font-extrabold" style={{ color: severityColors[sev] }}>{bySeverity[sev] || 0}</div>
          </div>
        ))}
      </div>

      {/* Event Timeline */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Recent Events
        </h2>
        <div className="space-y-3">
          {recentEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-lg border p-4"
              style={{ borderColor: 'var(--rl-border)', borderLeft: `3px solid ${severityColors[evt.severity]}` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: severityColors[evt.severity] }}
                  />
                  <span className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>
                    {actionLabels[evt.action] || evt.action}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded capitalize"
                    style={{ background: `${severityColors[evt.severity]}15`, color: severityColors[evt.severity] }}>
                    {evt.severity}
                  </span>
                </div>
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                  {new Date(evt.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed mb-2" style={{ color: 'var(--rl-text-muted)' }}>{evt.details}</p>
              <div className="flex flex-wrap gap-3 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                <span>Actor: <strong>{evt.actor}</strong> ({evt.actorRole})</span>
                <span>Entity: {evt.entityType}/{evt.entityId}</span>
                {evt.approvedBy && <span>Approved: <strong>{evt.approvedBy}</strong></span>}
              </div>
              {Object.keys(evt.metadata).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(evt.metadata).map(([k, v]) => (
                    <span
                      key={k}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--rl-stripe)', color: 'var(--rl-text-muted)' }}
                    >
                      {k}: {String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
