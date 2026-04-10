'use client';

import { useState, useEffect } from 'react';
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
    { label: 'Audit Readiness', value: `${readinessPct}%`, icon: ClipboardCheck, color: 'var(--pg-success-bright)', sub: 'composite score' },
    { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: 'var(--pg-cyan-bright)' },
    { label: 'Open Findings', value: String(atRiskControls.length + overdueDocs.length), icon: AlertTriangle, color: 'var(--pg-warning-bright)', sub: 'controls + reviews' },
    { label: 'Obligations Current', value: `${oblStats.compliant}/${oblStats.total}`, icon: CheckCircle2, color: 'var(--pg-success-bright)' },
  ];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Audit Readiness
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Composite view of program readiness for external audit — findings, evidence gaps, and remediation status.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 18, flex: 1, minHeight: 0 }} className="pg-home-hero-grid">
        <div className="pg-card-elevated" style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flex: 'none' }}>
            <div className="pg-icon-bubble" style={{ borderColor: 'var(--pg-warning-bright)' }}>
              <AlertTriangle size={20} color="var(--pg-warning-bright)" strokeWidth={2.4} />
            </div>
            Open Findings
            <span style={{ marginLeft: 'auto', fontSize: 14, color: '#f1f5f9', fontWeight: 700 }}>
              {atRiskControls.length + Math.min(3, overdueDocs.length)} items
            </span>
          </h3>
          <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
            {atRiskControls.map((c, i) => (
              <div
                key={c.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                  borderLeft: '5px solid var(--pg-warning-bright)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${i * 0.04}s`,
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-warning-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {c.code} · {c.status === 'non_compliant' ? 'NON-COMPLIANT' : 'AT RISK'}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', marginTop: 4, lineHeight: 1.3 }}>{c.name}</div>
                <div style={{ fontSize: 14, color: '#f1f5f9', marginTop: 4 }}>Owner: {c.owner} · Next test: {c.nextTest}</div>
              </div>
            ))}
            {overdueDocs.map((d, i) => (
              <div
                key={d.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                  borderLeft: '5px solid var(--pg-danger-bright)',
                  opacity: mounted ? 1 : 0,
                  transition: 'all 0.4s ease',
                  transitionDelay: `${(atRiskControls.length + i) * 0.04}s`,
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-danger-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {d.code} · REVIEW OVERDUE
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', marginTop: 4, lineHeight: 1.3 }}>{d.title}</div>
                <div style={{ fontSize: 14, color: '#f1f5f9', marginTop: 4 }}>Next review was: {d.nextReview} · Owner: {d.owner}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pg-card-elevated" style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flex: 'none' }}>
            <div className="pg-icon-bubble" style={{ borderColor: 'var(--pg-success-bright)' }}>
              <CheckCircle2 size={20} color="var(--pg-success-bright)" strokeWidth={2.4} />
            </div>
            Evidence Summary
            <span style={{ marginLeft: 'auto', fontSize: 14, color: '#f1f5f9', fontWeight: 700 }}>
              {OBLIGATIONS.length} obligations
            </span>
          </h3>
          <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
            {OBLIGATIONS.map((o, i) => {
              const hasEvidence = o.evidenceCount > 0;
              return (
                <div
                  key={o.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderLeft: `4px solid ${hasEvidence ? 'var(--pg-success-bright)' : 'var(--pg-danger-bright)'}`,
                    opacity: mounted ? 1 : 0,
                    transition: 'all 0.4s ease',
                    transitionDelay: `${i * 0.03}s`,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{o.code}</div>
                    <div style={{ fontSize: 14, color: '#f1f5f9', marginTop: 2 }}>{o.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: hasEvidence ? 'var(--pg-success-bright)' : 'var(--pg-danger-bright)', lineHeight: 1 }}>{o.evidenceCount}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 3 }}>artifacts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
