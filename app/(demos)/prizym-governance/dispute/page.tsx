'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { DISPUTE_CASES, getDisputeStats } from '@/data/prizym-governance/dispute';
import { Scale, Briefcase, AlertTriangle, CheckCircle2, DollarSign, ArrowRight } from 'lucide-react';

export default function DisputeQuadrantPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getDisputeStats();

  const metrics = [
    { label: 'Open Cases', value: String(stats.open + stats.underReview), icon: Briefcase, color: '#6366f1' },
    { label: 'Escalated to CRB', value: String(stats.escalated), icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Resolved YTD', value: String(stats.resolved), icon: CheckCircle2, color: '#10b981' },
    { label: 'Total Disputed', value: `$${Math.round(stats.totalDisputed / 1000)}K`, icon: DollarSign, color: '#ef4444' },
  ];

  return (
    <PrizymPage title="Dispute" subtitle="Commission dispute case management with CRB escalation paths" mode="oversee">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <h2 className="pg-subheading" style={{ marginBottom: 14 }}>Dispute Workflow</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <Link
          href="/prizym-governance/dispute/cases"
          className="pg-card-elevated"
          style={{
            display: 'block', textDecoration: 'none', borderTop: '3px solid #6366f1',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '0.2s',
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={22} style={{ color: '#6366f1' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="pg-subheading" style={{ marginBottom: 4 }}>Dispute Cases</h3>
              <span className="pg-overline" style={{ color: '#6366f1', fontSize: 11 }}>{DISPUTE_CASES.length} cases tracked</span>
            </div>
          </div>
          <p className="pg-caption" style={{ marginBottom: 12, lineHeight: 1.5 }}>
            Full case management for commission disputes: crediting, quota appeals, clawback challenges, territory boundaries, and plan interpretation. Includes thread history and SLA tracking.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: 13, fontWeight: 600 }}>
            Open case queue <ArrowRight size={14} />
          </div>
        </Link>

        <div
          className="pg-card-elevated"
          style={{
            borderTop: '3px solid #8b5cf6',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '0.3s',
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Scale size={22} style={{ color: '#8b5cf6' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="pg-subheading" style={{ marginBottom: 4 }}>Escalation Paths</h3>
              <span className="pg-overline" style={{ color: '#8b5cf6', fontSize: 11 }}>CRB · SGCC · Legal</span>
            </div>
          </div>
          <p className="pg-caption" style={{ marginBottom: 12, lineHeight: 1.5 }}>
            Standard escalation ladder for commission disputes: Sales Ops → Sales Comp Lead → VP Sales → CRB. High-dollar or precedent-setting cases route to the Compensation Review Board.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {['Tier 1 — Sales Ops review', 'Tier 2 — Sales Comp Lead', 'Tier 3 — VP Sales', 'Tier 4 — CRB (>$50K or precedent)'].map((tier, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--pg-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6' }} />
                {tier}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrizymPage>
  );
}
