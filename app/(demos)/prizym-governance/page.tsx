'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, GaugeChart } from '@/components/demos/prizym-governance/StatusBadge';
import { DOCUMENTS, getDocumentStats } from '@/data/prizym-governance/documents/catalog';
import { isReviewOverdue } from '@/data/prizym-governance/documents/types';
import { getApprovalStats } from '@/data/prizym-governance/operate';
import { getComplianceScore, COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';
import { getExceptionStats, EXCEPTIONS } from '@/data/prizym-governance/workflows/exceptions';
import { getObligationStats } from '@/data/prizym-governance/compliance/obligations';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
import {
  CheckSquare, PenLine, AlertTriangle, ShieldCheck, ArrowRight,
  Clock, AlertOctagon, Activity, FileText, Calculator, Scale,
} from 'lucide-react';

const TODAY = new Date('2026-04-10');

export default function MyWorkspacePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const docStats = getDocumentStats();
  const approvalStats = getApprovalStats();
  const complianceScore = getComplianceScore();
  const exceptionStats = getExceptionStats();
  const oblStats = getObligationStats();

  const overdueReviews = DOCUMENTS.filter(d => isReviewOverdue(d, TODAY)).length;
  const pendingAttestations = DOCUMENTS.filter(d => d.type === 'policy' && (d.attestationPct ?? 100) < 100).length;
  const atRiskControls = COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk' || c.status === 'non_compliant').length;

  const metrics = [
    { label: 'Pending Attestations', value: String(pendingAttestations), icon: PenLine, color: '#f59e0b', sub: 'policies need acknowledgment' },
    { label: 'Pending Approvals', value: String(approvalStats.pending), icon: CheckSquare, color: '#0ea5e9', sub: `${approvalStats.highPriority} high priority` },
    { label: 'Reviews Overdue', value: String(overdueReviews), icon: Clock, color: '#ef4444', sub: 'past next review date' },
    { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: '#10b981', sub: `${atRiskControls} at risk` },
  ];

  const urlForType = (type: string) => (type === 'comp_plan' ? 'comp-plans' : `${type}s`);

  const quickLinks = [
    { href: '/prizym-governance/documents/policies', label: 'Policy Library', icon: FileText, count: `${docStats.byType.policy} policies` },
    { href: '/prizym-governance/tools/asc606-calculator', label: 'ASC 606 Calculator', icon: Calculator, count: 'Interactive tool' },
    { href: '/prizym-governance/compliance/obligations', label: 'Obligations', icon: Scale, count: `${oblStats.total} tracked` },
    { href: '/prizym-governance/workflows/exceptions', label: 'Exceptions', icon: AlertOctagon, count: `${exceptionStats.pending} pending` },
  ];

  return (
    <PrizymPage
      title={`Welcome back — ${henryScheinOrgProfile.name}`}
      subtitle="Your compliance workspace — pending attestations, approvals, reviews, and program pulse in one view."
      hero
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="pg-card-elevated lg:col-span-2">
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
            For Your Attention
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EXCEPTIONS.filter(e => e.status === 'pending').slice(0, 3).map((e) => (
              <Link key={e.id} href="/prizym-governance/workflows/exceptions" className="pg-card" style={{ textDecoration: 'none', borderLeft: '3px solid #f59e0b', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="pg-overline" style={{ color: '#f59e0b' }}>{e.caseNumber} · Exception · {e.policyRef}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{e.title}</div>
                    <div className="pg-caption" style={{ marginTop: 6, lineHeight: 1.5 }}>Awaiting {e.approver}</div>
                  </div>
                  {e.amountImpact && <div style={{ textAlign: 'right', fontSize: 18, fontWeight: 700, color: 'var(--pg-text)' }}>${Math.round(e.amountImpact / 1000)}K</div>}
                </div>
              </Link>
            ))}
            {DOCUMENTS.filter(d => isReviewOverdue(d, TODAY)).slice(0, 2).map((d) => (
              <Link key={d.id} href={`/prizym-governance/documents/${urlForType(d.type)}`} className="pg-card" style={{ textDecoration: 'none', borderLeft: '3px solid #ef4444', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="pg-overline" style={{ color: '#ef4444' }}>{d.code} · Review Overdue</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{d.title}</div>
                    <div className="pg-caption" style={{ marginTop: 6 }}>Next review was: {d.nextReview} · Owner: {d.owner}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="pg-card-elevated">
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={18} style={{ color: '#10b981' }} />
            Program Pulse
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <GaugeChart value={complianceScore} size={140} strokeWidth={12} color="#10b981" label="Compliance" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Documents published</span><strong>{DOCUMENTS.filter(d => d.status === 'published').length}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Obligations tracked</span><strong>{oblStats.total}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Active exceptions</span><strong>{exceptionStats.pending}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Obligations at risk</span><strong style={{ color: '#f59e0b' }}>{oblStats.atRisk}</strong></div>
          </div>
        </div>
      </div>

      <h3 className="pg-subheading" style={{ marginBottom: 14 }}>Jump to</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {quickLinks.map((t, i) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="pg-card" style={{
              display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease', transitionDelay: `${0.3 + i * 0.06}s`,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: '#10b981' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)' }}>{t.label}</div>
                <div className="pg-caption" style={{ fontSize: 13 }}>{t.count}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--pg-text-muted)' }} />
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
