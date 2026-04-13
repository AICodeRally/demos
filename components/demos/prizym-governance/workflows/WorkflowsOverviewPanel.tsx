'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { APPROVALS } from '@/data/prizym-governance/operate';
import { EXCEPTIONS } from '@/data/prizym-governance/workflows/exceptions';
import { DISPUTE_CASES } from '@/data/prizym-governance/dispute';
import { AUDIT_EVENTS, IMPACT_COLORS } from '@/data/prizym-governance/audit';
import { DOCUMENTS } from '@/data/prizym-governance/documents/catalog';
import { CheckSquare, AlertOctagon, Briefcase, Activity, PenLine, ArrowRight } from 'lucide-react';

interface WorkflowsOverviewPanelProps {
  onJumpToTab: (tab: string) => void;
}

export function WorkflowsOverviewPanel({ onJumpToTab }: WorkflowsOverviewPanelProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pendingApprovals = APPROVALS.filter(a => a.status === 'pending');
  const pendingExceptions = EXCEPTIONS.filter(e => e.status === 'pending');
  const openCases = DISPUTE_CASES.filter(c => c.status === 'open' || c.status === 'under_review' || c.status === 'escalated');
  const overdueAttestations = DOCUMENTS.filter(d => d.type === 'policy' && d.status === 'published' && (d.attestationPct ?? 100) < 70);
  const recentEvents = [...AUDIT_EVENTS].slice(0, 5);

  const metrics = [
    { label: 'Pending Approvals', value: String(pendingApprovals.length), icon: CheckSquare, color: 'var(--pg-operate-bright)' },
    { label: 'Active Exceptions', value: String(pendingExceptions.length), icon: AlertOctagon, color: 'var(--pg-warning-bright)' },
    { label: 'Open Cases', value: String(openCases.length), icon: Briefcase, color: 'var(--pg-dispute-bright)' },
    { label: 'Overdue Attestations', value: String(overdueAttestations.length), icon: PenLine, color: 'var(--pg-danger-bright)' },
  ];

  const sectionCardStyle: React.CSSProperties = {
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  };

  const rowStyle: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    flexShrink: 0,
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* Pending Approvals */}
        <div className="pg-card-elevated" style={sectionCardStyle}>
          <SectionHeader
            label="Pending Approvals"
            count={pendingApprovals.length}
            color="var(--pg-operate-bright)"
            icon={CheckSquare}
            onJump={() => onJumpToTab('approvals')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingApprovals.slice(0, 3).map(a => (
              <div key={a.id} style={{ ...rowStyle, borderLeft: '4px solid var(--pg-operate-bright)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-operate-bright)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{a.policyRef}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: '#f1f5f9', marginTop: 3 }}>{a.requestor} · Due {a.decisionDueBy}</div>
              </div>
            ))}
            {pendingApprovals.length === 0 && <EmptyRow label="No pending approvals" />}
          </div>
        </div>

        {/* Active Exceptions */}
        <div className="pg-card-elevated" style={sectionCardStyle}>
          <SectionHeader
            label="Active Exceptions"
            count={pendingExceptions.length}
            color="var(--pg-warning-bright)"
            icon={AlertOctagon}
            onJump={() => onJumpToTab('exceptions')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingExceptions.slice(0, 3).map(e => (
              <div key={e.id} style={{ ...rowStyle, borderLeft: '4px solid var(--pg-warning-bright)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-warning-bright)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{e.caseNumber}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{e.title}</div>
                <div style={{ fontSize: 13, color: '#f1f5f9', marginTop: 3 }}>{e.requestedBy} · Approver: {e.approver}</div>
              </div>
            ))}
            {pendingExceptions.length === 0 && <EmptyRow label="No pending exceptions" />}
          </div>
        </div>

        {/* Open Cases */}
        <div className="pg-card-elevated" style={sectionCardStyle}>
          <SectionHeader
            label="Open Cases"
            count={openCases.length}
            color="var(--pg-dispute-bright)"
            icon={Briefcase}
            onJump={() => onJumpToTab('cases')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {openCases.slice(0, 3).map(c => (
              <div key={c.id} style={{ ...rowStyle, borderLeft: '4px solid var(--pg-dispute-bright)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-dispute-bright)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.caseNumber}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: '#f1f5f9', marginTop: 3 }}>{c.filedBy} · {c.daysOpen}/{c.slaDays} days</div>
              </div>
            ))}
            {openCases.length === 0 && <EmptyRow label="No open cases" />}
          </div>
        </div>

        {/* Recent Audit Trail */}
        <div className="pg-card-elevated" style={sectionCardStyle}>
          <SectionHeader
            label="Recent Audit Events"
            count={AUDIT_EVENTS.length}
            color="var(--pg-oversee-bright)"
            icon={Activity}
            onJump={() => onJumpToTab('audit')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentEvents.map(e => (
              <div key={e.id} style={{ ...rowStyle, borderLeft: `4px solid ${IMPACT_COLORS[e.impactLevel]}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: IMPACT_COLORS[e.impactLevel], textTransform: 'uppercase', letterSpacing: '0.04em' }}>{e.action}</div>
                <div style={{ fontSize: 14, color: '#ffffff', marginTop: 3, lineHeight: 1.4 }}>{e.description}</div>
                <div style={{ fontSize: 13, color: '#f1f5f9', marginTop: 3 }}>{e.actor} · {new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ label, count, color, icon: Icon, onJump }: { label: string; count: number; color: string; icon: typeof CheckSquare; onJump: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div className="pg-icon-bubble" style={{ borderColor: color }}>
        <Icon size={18} color={color} strokeWidth={2.4} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, flex: 1 }}>{label}</h3>
      <span style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 700 }}>{count}</span>
      <button
        type="button"
        onClick={onJump}
        aria-label={`Open ${label}`}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30, borderRadius: 8,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.24)',
          color,
          cursor: 'pointer',
        }}
      >
        <ArrowRight size={14} strokeWidth={2.8} />
      </button>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div style={{ padding: '14px 16px', fontSize: 14, color: '#cbd5e1', fontWeight: 600, textAlign: 'center', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.18)' }}>
      {label}
    </div>
  );
}
