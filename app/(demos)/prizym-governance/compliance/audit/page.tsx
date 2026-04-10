'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { OBLIGATIONS, getObligationStats } from '@/data/prizym-governance/compliance/obligations';
import { getComplianceScore, COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';
import { getDocumentStats, DOCUMENTS } from '@/data/prizym-governance/documents/catalog';
import { isReviewOverdue } from '@/data/prizym-governance/documents/types';
import { ClipboardCheck, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TODAY = new Date('2026-04-10');

export default function AuditReadinessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const oblStats = getObligationStats();
  const complianceScore = getComplianceScore();
  const docStats = getDocumentStats();
  const overdueDocs = DOCUMENTS.filter(d => isReviewOverdue(d, TODAY));
  const atRiskControls = COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk' || c.status === 'non_compliant');
  const readinessPct = Math.round(
    (complianceScore * 0.5) +
    ((oblStats.compliant / oblStats.total) * 100 * 0.3) +
    ((docStats.total - docStats.reviewOverdue) / docStats.total * 100 * 0.2)
  );

  const metrics = [
    { label: 'Audit Readiness', value: `${readinessPct}%`, icon: ClipboardCheck, color: '#10b981', sub: 'composite score' },
    { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: '#0891b2' },
    { label: 'Open Findings', value: String(atRiskControls.length + overdueDocs.length), icon: AlertTriangle, color: '#f59e0b', sub: 'controls + reviews' },
    { label: 'Obligations Current', value: `${oblStats.compliant}/${oblStats.total}`, icon: CheckCircle2, color: '#10b981' },
  ];

  return (
    <PrizymPage title="Audit Readiness" subtitle="Composite view of program readiness for external audit — findings, evidence gaps, and remediation status.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pg-card-elevated">
          <h3 className="pg-section-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} /> Open Findings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {atRiskControls.map(c => (
              <div key={c.id} className="pg-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                <div className="pg-overline" style={{ color: '#f59e0b', fontSize: 11 }}>{c.code} · {c.status === 'non_compliant' ? 'NON-COMPLIANT' : 'AT RISK'}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{c.name}</div>
                <div className="pg-caption" style={{ marginTop: 4 }}>Owner: {c.owner} · Next test: {c.nextTest}</div>
              </div>
            ))}
            {overdueDocs.slice(0, 3).map(d => (
              <div key={d.id} className="pg-card" style={{ borderLeft: '3px solid #ef4444' }}>
                <div className="pg-overline" style={{ color: '#ef4444', fontSize: 11 }}>{d.code} · REVIEW OVERDUE</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{d.title}</div>
                <div className="pg-caption" style={{ marginTop: 4 }}>Next review was: {d.nextReview} · Owner: {d.owner}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pg-card-elevated">
          <h3 className="pg-section-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Evidence Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OBLIGATIONS.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--pg-surface-alt)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pg-text)' }}>{o.code}</div>
                  <div className="pg-caption" style={{ fontSize: 11 }}>{o.category}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: o.evidenceCount > 0 ? '#10b981' : '#ef4444' }}>{o.evidenceCount}</div>
                  <div className="pg-caption" style={{ fontSize: 10 }}>artifacts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrizymPage>
  );
}
