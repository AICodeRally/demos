'use client';

import { useState } from 'react';
import { ApprovalsView } from '@/components/demos/prizym-governance/actions/ApprovalsView';
import { ExceptionsView } from '@/components/demos/prizym-governance/actions/ExceptionsView';
import { AttestationsView } from '@/components/demos/prizym-governance/actions/AttestationsView';
import { DecisionsView } from '@/components/demos/prizym-governance/actions/DecisionsView';
import { CheckSquare, AlertOctagon, PenLine, Gavel } from 'lucide-react';

type ActionTab = 'approvals' | 'exceptions' | 'attestations' | 'decisions';

const TABS: { id: ActionTab; label: string; icon: typeof CheckSquare; color: string; description: string }[] = [
  {
    id: 'approvals',
    label: 'Approvals',
    icon: CheckSquare,
    color: 'var(--pg-operate-bright)',
    description: 'CRB, SGCC, and policy-gated approvals awaiting action.',
  },
  {
    id: 'exceptions',
    label: 'Exceptions',
    icon: AlertOctagon,
    color: 'var(--pg-success-bright)',
    description: 'Active and historical requests to deviate from published policies.',
  },
  {
    id: 'attestations',
    label: 'Attestations',
    icon: PenLine,
    color: 'var(--pg-cyan-bright)',
    description: 'Track employee acknowledgment of published policies — items below 70% are overdue.',
  },
  {
    id: 'decisions',
    label: 'Decisions',
    icon: Gavel,
    color: 'var(--pg-oversee-bright)',
    description: 'Audit-ready record of governance decisions with rationale and voters.',
  },
];

export default function ActionsPage() {
  const [tab, setTab] = useState<ActionTab>('approvals');
  const active = TABS.find(t => t.id === tab)!;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Actions Queue
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          {active.description}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 20px',
                borderRadius: 12,
                background: isActive ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.06)',
                border: isActive ? `2px solid ${t.color}` : '1.5px solid rgba(255, 255, 255, 0.2)',
                color: isActive ? t.color : '#ffffff',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                letterSpacing: '0.01em',
              }}
            >
              <Icon size={18} color={isActive ? t.color : '#ffffff'} strokeWidth={2.4} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'approvals' && <ApprovalsView />}
      {tab === 'exceptions' && <ExceptionsView />}
      {tab === 'attestations' && <AttestationsView />}
      {tab === 'decisions' && <DecisionsView />}
    </div>
  );
}
