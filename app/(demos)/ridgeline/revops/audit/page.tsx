'use client';

import { useState } from 'react';
import { AUDIT_EVENTS, getRecentAuditEvents } from '@/data/ridgeline';

const severityColors: Record<string, string> = { info: '#10B981', warning: '#F59E0B', critical: '#EF4444' };
const severityIcons: Record<string, string> = { info: '🟢', warning: '🟡', critical: '🔴' };

const actionLabels: Record<string, string> = {
  plan_published: 'Plan Published', territory_changed: 'Territory Changed', quota_adjusted: 'Quota Adjusted',
  payout_approved: 'Payout Approved', payout_reversed: 'Payout Reversed', dispute_opened: 'Dispute Opened',
  dispute_resolved: 'Dispute Resolved', spiff_activated: 'SPIFF Activated', spiff_expired: 'SPIFF Expired',
  rebate_tier_changed: 'Rebate Tier Changed', employee_reassigned: 'Employee Reassigned',
  branch_integrated: 'Branch Integrated', rate_change: 'Rate Change', data_feed_error: 'Data Feed Error',
};

export default function AuditTrailPage() {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bySeverity = AUDIT_EVENTS.reduce<Record<string, number>>((acc, e) => { acc[e.severity] = (acc[e.severity] || 0) + 1; return acc; }, {});
  const filtered = filterSeverity ? AUDIT_EVENTS.filter((e) => e.severity === filterSeverity) : AUDIT_EVENTS;
  const recentEvents = filtered.slice(0, 15);

  // Group by date for timeline
  const grouped = recentEvents.reduce<Record<string, typeof AUDIT_EVENTS>>((acc, evt) => {
    const date = evt.timestamp.split('T')[0];
    (acc[date] = acc[date] || []).push(evt);
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes dotPop { from { transform: scale(0) } to { transform: scale(1) } }
        @keyframes timelineDraw { from { height: 0 } }
        @keyframes criticalPulse { 0%, 100% { background: rgba(239,68,68,0.05) } 50% { background: rgba(239,68,68,0.1) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <span className="text-3xl text-white">&#128737;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>Act 4 &middot; RevOps Control Plane</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Audit Trail</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Immutable event log &middot; SOX compliance &middot; {AUDIT_EVENTS.length} events
          </p>
        </div>
      </div>

      {/* Severity Filter Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(['info', 'warning', 'critical'] as const).map((sev, i) => {
          const isActive = filterSeverity === sev;
          return (
            <button key={sev} onClick={() => setFilterSeverity(isActive ? null : sev)}
              className="rounded-xl border p-4 text-center transition-all"
              style={{
                background: isActive ? `${severityColors[sev]}10` : 'var(--rl-card)',
                borderColor: isActive ? severityColors[sev] : 'var(--rl-border)',
                borderTop: `4px solid ${severityColors[sev]}`,
                boxShadow: isActive ? `0 0 16px ${severityColors[sev]}20` : 'var(--rl-shadow)',
                animation: `fadeUp ${0.3 + i * 0.1}s ease-out`,
              }}>
              <div className="text-2xl mb-1">{severityIcons[sev]}</div>
              <div className="text-3xl font-extrabold tabular-nums" style={{ color: severityColors[sev] }}>{bySeverity[sev] || 0}</div>
              <div className="text-[10px] uppercase tracking-[1px] capitalize" style={{ color: 'var(--rl-text-muted)' }}>{sev}</div>
            </button>
          );
        })}
      </div>

      {/* Timeline View */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="text-[11px] uppercase tracking-[1.5px] font-semibold" style={{ color: 'var(--rl-text-muted)' }}>
            Event Timeline {filterSeverity ? `(${filterSeverity})` : ''}
          </div>
          {filterSeverity && (
            <button onClick={() => setFilterSeverity(null)} className="text-[10px] font-bold px-2 py-1 rounded-lg border" style={{ color: '#7C3AED', borderColor: '#7C3AED40' }}>
              Show All
            </button>
          )}
        </div>

        {Object.entries(grouped).map(([date, events], gi) => (
          <div key={date} className="mb-6 last:mb-0" style={{ animation: `fadeUp ${0.3 + gi * 0.1}s ease-out` }}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-24 text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>
                {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 h-px" style={{ background: 'var(--rl-border)' }} />
              <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{events.length} events</div>
            </div>

            {/* Events with vertical line */}
            <div className="ml-4 pl-6 space-y-2" style={{ borderLeft: '2px solid var(--rl-border)' }}>
              {events.map((evt, ei) => {
                const sColor = severityColors[evt.severity];
                const isExpanded = expandedId === evt.id;

                return (
                  <button key={evt.id} onClick={() => setExpandedId(isExpanded ? null : evt.id)} className="w-full text-left relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[31px] top-3 w-4 h-4 rounded-full border-2 border-white"
                      style={{ background: sColor, animation: `dotPop 0.3s ease-out ${ei * 0.05}s both` }} />

                    <div className="rounded-xl border p-3 transition-all"
                      style={{
                        borderColor: isExpanded ? sColor : 'var(--rl-border)',
                        background: evt.severity === 'critical' ? undefined : 'transparent',
                        animation: evt.severity === 'critical' ? 'criticalPulse 3s ease-in-out infinite' : `slideIn ${0.2 + ei * 0.05}s ease-out`,
                      }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{severityIcons[evt.severity]}</span>
                          <span className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>
                            {actionLabels[evt.action] || evt.action}
                          </span>
                        </div>
                        <span className="text-[9px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                          {new Date(evt.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>
                        {evt.actor} ({evt.actorRole}) &middot; {evt.entityType}/{evt.entityId}
                      </div>

                      {isExpanded && (
                        <div className="mt-2 pt-2 space-y-2" style={{ borderTop: '1px solid var(--rl-border)', animation: 'fadeUp 0.2s ease-out' }}>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>{evt.details}</p>
                          {evt.approvedBy && (
                            <div className="text-[10px]" style={{ color: '#10B981' }}>Approved by: {evt.approvedBy}</div>
                          )}
                          {Object.keys(evt.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(evt.metadata).map(([k, v]) => (
                                <span key={k} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--rl-stripe)', color: 'var(--rl-text-muted)' }}>
                                  {k}: {String(v)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
