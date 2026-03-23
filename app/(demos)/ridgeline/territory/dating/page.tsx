'use client';

import { TERRITORIES, AUDIT_EVENTS } from '@/data/ridgeline';

const TIMELINE_EVENTS = [
  { date: '2025-01-01', label: 'FY2025 Territory Plan', type: 'plan', detail: 'Initial territory assignments for FY2025. Heritage division operated independently.' },
  { date: '2025-06-15', label: 'GMS Acquisition Closed', type: 'acquisition', detail: 'Home Depot completes GMS acquisition through SRS. 200+ new locations added to platform.' },
  { date: '2025-09-01', label: 'Heritage Integration Phase 1', type: 'integration', detail: 'Heritage East and Heritage South branches begin integration into SRS reporting. Dual-comp period starts.' },
  { date: '2025-12-31', label: 'Heritage TX Consolidated', type: 'consolidation', detail: 'Heritage TX territory archived. Branches moved to South Central region under existing RVP.' },
  { date: '2026-01-01', label: 'FY2026 Territory Plan', type: 'plan', detail: 'Unified territory structure goes live. 10 regions across 2 divisions. Effective-dated master data.' },
  { date: '2026-01-15', label: 'Heritage Branch Reassignment', type: 'reassignment', detail: '3 Heritage East branches reassigned to TX North territory. Quota pro-rated.' },
  { date: '2026-02-01', label: 'Q1 Mid-Quarter Adjustment', type: 'adjustment', detail: 'New effective date for expanded territories. Comp plans updated retroactively.' },
  { date: '2026-04-01', label: 'Q2 Territory Refresh', type: 'plan', detail: 'Planned: Quarterly territory review. Address coverage gaps in Mountain and Heritage West regions.' },
];

const TYPE_COLORS: Record<string, string> = {
  plan: '#1E3A5F',
  acquisition: '#7C3AED',
  integration: '#2563EB',
  consolidation: '#F59E0B',
  reassignment: '#10B981',
  adjustment: '#EF4444',
};

const territoryChanges = AUDIT_EVENTS.filter((e) =>
  ['territory_changed', 'employee_reassigned', 'quota_adjusted', 'branch_integrated'].includes(e.action)
);

export default function EffectiveDatingPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
        >
          <span className="text-3xl text-white">&#128197;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 2 &middot; Territory & Branch Ops
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Effective Dating Timeline
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Territory and assignment changes with effective dates — preventing retro-rate errors
          </p>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-6" style={{ color: 'var(--rl-text-muted)' }}>
          Territory Evolution Timeline
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5" style={{ background: 'var(--rl-border)' }} />

          <div className="space-y-6">
            {TIMELINE_EVENTS.map((evt, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-white text-[10px] font-bold"
                  style={{ background: TYPE_COLORS[evt.type] }}
                >
                  {evt.date.slice(5, 7)}
                </div>
                <div className="flex-1 rounded-lg border p-4" style={{ borderColor: 'var(--rl-border)', borderLeft: `3px solid ${TYPE_COLORS[evt.type]}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{evt.label}</h3>
                    <span className="text-[11px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>{evt.date}</span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>{evt.detail}</p>
                  <span
                    className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${TYPE_COLORS[evt.type]}15`, color: TYPE_COLORS[evt.type] }}
                  >
                    {evt.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Trail for Territory Changes */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Territory Change Audit Log
        </h2>
        <div className="space-y-3">
          {territoryChanges.map((evt) => (
            <div
              key={evt.id}
              className="rounded-lg border p-3 flex items-start gap-3"
              style={{ borderColor: 'var(--rl-border)' }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ background: evt.severity === 'critical' ? '#EF4444' : evt.severity === 'warning' ? '#F59E0B' : '#10B981' }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--rl-text)' }}>{evt.details}</span>
                  <span className="text-[10px] tabular-nums shrink-0 ml-4" style={{ color: 'var(--rl-text-muted)' }}>
                    {new Date(evt.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-3 mt-1 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                  <span>Actor: {evt.actor}</span>
                  {evt.approvedBy && <span>Approved: {evt.approvedBy}</span>}
                  <span className="font-bold" style={{ color: evt.severity === 'critical' ? '#EF4444' : evt.severity === 'warning' ? '#F59E0B' : '#94A3B8' }}>
                    {evt.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Effective Dating */}
      <div className="rounded-lg px-6 py-4 mt-6" style={{ background: 'rgba(37,99,235,0.06)', borderLeft: '3px solid #2563EB' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--rl-text-secondary)' }}>
          <strong>Why Effective Dating Matters:</strong> At SRS scale (982 branches, continuous acquisitions),
          territory assignments, pricing, product hierarchies, and plan rules change constantly. Without effective-dated
          master data, retro-rate errors multiply and dispute volume explodes. Every change carries a valid-from/valid-to
          timestamp, enabling accurate historical comp calculations and clean audit trails.
        </p>
      </div>
    </>
  );
}
