'use client';

import { useState } from 'react';
import { WorkflowsOverviewPanel } from '@/components/demos/prizym-governance/workflows/WorkflowsOverviewPanel';
import { ApprovalsView } from '@/components/demos/prizym-governance/actions/ApprovalsView';
import { ExceptionsView } from '@/components/demos/prizym-governance/actions/ExceptionsView';
import { AttestationsView } from '@/components/demos/prizym-governance/actions/AttestationsView';
import { DecisionsView } from '@/components/demos/prizym-governance/actions/DecisionsView';
import { CasesPanel } from '@/components/demos/prizym-governance/workflows/CasesPanel';
import { AuditTrailPanel } from '@/components/demos/prizym-governance/workflows/AuditTrailPanel';
import { LayoutDashboard, CheckSquare, AlertOctagon, PenLine, Gavel, Briefcase, Activity } from 'lucide-react';

type Tab = 'all' | 'approvals' | 'exceptions' | 'attestations' | 'decisions' | 'cases' | 'audit';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: 'all', label: 'All', icon: LayoutDashboard, description: 'Cross-workflow rollup — pending work, open exceptions, cases, and recent audit activity.' },
  { id: 'approvals', label: 'Approvals', icon: CheckSquare, description: 'CRB, SGCC, and policy-gated approvals awaiting action.' },
  { id: 'exceptions', label: 'Exceptions', icon: AlertOctagon, description: 'Active and historical requests to deviate from published policies.' },
  { id: 'attestations', label: 'Attestations', icon: PenLine, description: 'Track employee acknowledgment of published policies.' },
  { id: 'decisions', label: 'Decisions', icon: Gavel, description: 'Audit-ready record of governance decisions with rationale and voters.' },
  { id: 'cases', label: 'Cases', icon: Briefcase, description: 'Commission dispute cases with thread history and SLA tracking.' },
  { id: 'audit', label: 'Audit Trail', icon: Activity, description: 'Immutable event log — decisions, approvals, and case activity.' },
];

export default function WorkflowsCenterPage() {
  const [tab, setTab] = useState<Tab>('all');
  const active = TABS.find(t => t.id === tab)!;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Workflows Center
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          {active.description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.22)', marginBottom: 14, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--pg-cyan-bright)' : '2px solid transparent',
                color: isActive ? 'var(--pg-cyan-bright)' : '#ffffff',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Icon size={16} strokeWidth={2.4} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'all' && <WorkflowsOverviewPanel onJumpToTab={(t) => setTab(t as Tab)} />}
      {tab === 'approvals' && <ApprovalsView />}
      {tab === 'exceptions' && <ExceptionsView />}
      {tab === 'attestations' && <AttestationsView />}
      {tab === 'decisions' && <DecisionsView />}
      {tab === 'cases' && <CasesPanel />}
      {tab === 'audit' && <AuditTrailPanel showStats={true} />}
    </div>
  );
}
