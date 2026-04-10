'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { QuadrantTile, type QuadrantTileProps } from '@/components/demos/prizym-governance/QuadrantTile';
import { COMPLIANCE_CONTROLS, REPORTS, PULSE_SIGNALS, getComplianceScore } from '@/data/prizym-governance/oversee';
import { SCP_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Policies } from '@/data/prizym-governance/asc606';
import { ShieldCheck, BarChart3, Activity, BookOpen, History, AlertTriangle } from 'lucide-react';

export default function OverseeQuadrantPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const atRisk = COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk' || c.status === 'non_compliant').length;
  const totalSCPs = SCP_POLICIES.length + asc606Policies.length;
  const score = getComplianceScore();

  const metrics = [
    { label: 'Compliance Score', value: `${score}%`, icon: ShieldCheck, color: '#8b5cf6' },
    { label: 'Total SCPs', value: String(totalSCPs), icon: BookOpen, color: '#06b6d4' },
    { label: 'Controls At Risk', value: String(atRisk), icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Report Library', value: String(REPORTS.length), icon: BarChart3, color: '#3b82f6' },
  ];

  const tiles: Array<Omit<QuadrantTileProps, 'mounted' | 'delay'>> = [
    {
      href: '/prizym-governance/policies',
      title: 'Policy Library',
      description: `${totalSCPs} SCPs covering crediting, quota, payments, compliance, and ASC 606 revenue recognition.`,
      icon: BookOpen,
      accent: '#8b5cf6',
      badge: `${totalSCPs} policies`,
    },
    {
      href: '/prizym-governance/oversee/compliance',
      title: 'Compliance Dashboard',
      description: `SOX, wage law, tax, and data security controls. ${score}% compliance score.`,
      icon: ShieldCheck,
      accent: '#06b6d4',
      badge: `${score}% score`,
    },
    {
      href: '/prizym-governance/oversee/reports',
      title: 'Reports Library',
      description: 'Pre-built governance reports: performance, compliance, audit, and operational.',
      icon: BarChart3,
      accent: '#3b82f6',
      badge: `${REPORTS.length} reports`,
    },
    {
      href: '/prizym-governance/oversee/pulse',
      title: 'Governance Pulse',
      description: 'Real-time health signals, risks, activity, and trend indicators for the governance program.',
      icon: Activity,
      accent: '#ec4899',
      badge: `${PULSE_SIGNALS.length} signals`,
    },
    {
      href: '/prizym-governance/audit',
      title: 'Audit Trail',
      description: 'Immutable event log for every decision, approval, and policy change.',
      icon: History,
      accent: '#6366f1',
      badge: 'Event log',
    },
  ];

  return (
    <PrizymPage title="Oversee" subtitle="Monitor the governance program — compliance, reports, pulse, and audit" mode="oversee">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <h2 className="pg-subheading" style={{ marginBottom: 14 }}>Oversight Surfaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tiles.map((tile, i) => (
          <QuadrantTile key={tile.href} {...tile} mounted={mounted} delay={0.2 + i * 0.08} />
        ))}
      </div>
    </PrizymPage>
  );
}
