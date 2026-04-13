'use client';

import { useState } from 'react';
import { ComplianceOverviewPanel } from '@/components/demos/prizym-governance/compliance/ComplianceOverviewPanel';
import { ObligationsPanel } from '@/components/demos/prizym-governance/compliance/ObligationsPanel';
import { ControlsPanel } from '@/components/demos/prizym-governance/compliance/ControlsPanel';
import { LayoutDashboard, Scale, ShieldCheck } from 'lucide-react';

type Tab = 'all' | 'obligations' | 'controls';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard; description: string }[] = [
  { id: 'all', label: 'All', icon: LayoutDashboard, description: 'Composite readiness, open findings, evidence summary.' },
  { id: 'obligations', label: 'Obligations', icon: Scale, description: 'Regulatory and internal obligations with mapped policies and controls.' },
  { id: 'controls', label: 'Controls', icon: ShieldCheck, description: 'SOX / ICFR, wage, tax, and data-security controls with test status.' },
];

export default function ComplianceCenterPage() {
  const [tab, setTab] = useState<Tab>('all');
  const active = TABS.find(t => t.id === tab)!;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Compliance Center
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

      {tab === 'all' && <ComplianceOverviewPanel />}
      {tab === 'obligations' && <ObligationsPanel showMetrics={true} />}
      {tab === 'controls' && <ControlsPanel showGauge={true} />}
    </div>
  );
}
