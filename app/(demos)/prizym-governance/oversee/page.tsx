'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { COMPLIANCE_CONTROLS, REPORTS, PULSE_SIGNALS, getComplianceScore } from '@/data/prizym-governance/oversee';
import { SCP_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Policies } from '@/data/prizym-governance/asc606';
import { ShieldCheck, BarChart3, Activity, BookOpen, History, ArrowRight, AlertTriangle } from 'lucide-react';

interface OverseeTile {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>;
  accent: string;
  badge: string;
}

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

  const tiles: OverseeTile[] = [
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
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="pg-card-elevated"
              style={{
                display: 'block',
                textDecoration: 'none',
                borderTop: `3px solid ${tile.accent}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${tile.accent}18`, border: `1px solid ${tile.accent}50`, flexShrink: 0 }}>
                  <Icon size={20} style={{ color: tile.accent }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="pg-subheading" style={{ marginBottom: 4 }}>{tile.title}</h3>
                  <span className="pg-overline" style={{ color: tile.accent, fontSize: 11 }}>{tile.badge}</span>
                </div>
              </div>
              <p className="pg-caption" style={{ marginBottom: 12, lineHeight: 1.5 }}>{tile.description}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: tile.accent, fontSize: 13, fontWeight: 600 }}>
                Open <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
