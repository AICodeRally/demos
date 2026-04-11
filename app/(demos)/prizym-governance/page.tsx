'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { DOCUMENTS, getDocumentStats } from '@/data/prizym-governance/documents/catalog';
import { isReviewOverdue } from '@/data/prizym-governance/documents/types';
import { getApprovalStats, DECISIONS } from '@/data/prizym-governance/operate';
import { getComplianceScore, COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';
import { getExceptionStats, EXCEPTIONS } from '@/data/prizym-governance/workflows/exceptions';
import { getObligationStats } from '@/data/prizym-governance/compliance/obligations';
import { demoOrgProfile } from '@/data/prizym-governance/tenant/org-profile';
import {
  CheckSquare, PenLine, AlertTriangle, ShieldCheck, ArrowRight, Gavel,
  Clock, AlertOctagon, Activity, FileText, Calculator, Scale, CheckCircle2, XCircle, Edit3,
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
    { label: 'Pending Attestations', value: String(pendingAttestations), icon: PenLine, color: 'var(--pg-warning-bright)', sub: 'need acknowledgment' },
    { label: 'Pending Approvals', value: String(approvalStats.pending), icon: CheckSquare, color: 'var(--pg-cyan-bright)', sub: `${approvalStats.highPriority} high priority` },
    { label: 'Reviews Overdue', value: String(overdueReviews), icon: Clock, color: 'var(--pg-danger-bright)', sub: 'past review date' },
    { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: 'var(--pg-success-bright)', sub: `${atRiskControls} at risk` },
    { label: 'Active Exceptions', value: String(exceptionStats.pending), icon: AlertOctagon, color: 'var(--pg-oversee-bright)', sub: `${exceptionStats.approved} approved` },
    { label: 'Obligations', value: `${oblStats.compliant}/${oblStats.total}`, icon: Scale, color: 'var(--pg-info-bright)', sub: 'compliant' },
  ];


  const quickLinks = [
    { href: '/prizym-governance/documents', label: 'Documents Library', icon: FileText, count: `${docStats.total} documents`, color: 'var(--pg-cyan-bright)' },
    { href: '/prizym-governance/tools/asc606-calculator', label: 'ASC 606 Calculator', icon: Calculator, count: 'Interactive tool', color: 'var(--pg-success-bright)' },
    { href: '/prizym-governance/compliance/obligations', label: 'Obligations', icon: Scale, count: `${oblStats.total} tracked`, color: 'var(--pg-info-bright)' },
    { href: '/prizym-governance/workflows/actions', label: 'Actions Queue', icon: AlertOctagon, count: `${exceptionStats.pending} exceptions pending`, color: 'var(--pg-warning-bright)' },
  ];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.35fr)',
          gap: 18,
          marginBottom: 20,
          alignItems: 'stretch',
        }}
        className="pg-home-hero-grid"
      >
        <section className="pg-hero-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-success-bright)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Sales Governance Manager
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 10 }}>
            Welcome back — {demoOrgProfile.name}
          </h1>
          <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.5 }}>
            Unified workspace for compensation program oversight across the four SGM quadrants — <strong style={{ color: 'var(--pg-design-bright)' }}>Design</strong>, <strong style={{ color: 'var(--pg-operate-bright)' }}>Operate</strong>, <strong style={{ color: 'var(--pg-dispute-bright)' }}>Dispute</strong>, and <strong style={{ color: 'var(--pg-oversee-bright)' }}>Oversee</strong>.
          </p>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '1fr 1fr',
            gap: 12,
          }}
        >
          {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.06} />)}
        </div>
      </div>

      <div
        className="pg-mid-grid gap-5 mb-5"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.2fr) minmax(0, 0.85fr)',
        }}
      >
        <div className="pg-card-elevated" style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flex: 'none' }}>
            <div className="pg-icon-bubble" style={{ borderColor: 'var(--pg-warning-bright)' }}>
              <AlertTriangle size={20} color="var(--pg-warning-bright)" strokeWidth={2.4} />
            </div>
            For Your Attention
            <span style={{ marginLeft: 'auto', fontSize: 14, color: '#ffffff', fontWeight: 700 }}>
              {EXCEPTIONS.filter(e => e.status === 'pending').length + DOCUMENTS.filter(d => isReviewOverdue(d, TODAY)).length} items
            </span>
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              paddingRight: 8,
            }}
            className="pg-scroll"
          >
            {EXCEPTIONS.filter(e => e.status === 'pending').map((e) => (
              <Link
                key={e.id}
                href="/prizym-governance/workflows/actions"
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  padding: '14px 18px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                  borderLeft: '5px solid var(--pg-warning)',
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--pg-warning)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e.caseNumber} · {e.policyRef}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: '#ffffff', marginTop: 5, lineHeight: 1.3 }}>{e.title}</div>
                    <div style={{ fontSize: 16, color: '#ffffff', marginTop: 5, lineHeight: 1.4 }}>Awaiting {e.approver}</div>
                  </div>
                  {e.amountImpact && <div style={{ textAlign: 'right', fontSize: 24, fontWeight: 800, color: '#ffffff' }}>${Math.round(e.amountImpact / 1000)}K</div>}
                </div>
              </Link>
            ))}
            {DOCUMENTS.filter(d => isReviewOverdue(d, TODAY)).map((d) => (
              <Link
                key={d.id}
                href="/prizym-governance/documents"
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  padding: '14px 18px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                  borderLeft: '5px solid var(--pg-danger)',
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--pg-danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.code} · Review Overdue</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: '#ffffff', marginTop: 5, lineHeight: 1.3 }}>{d.title}</div>
                    <div style={{ fontSize: 16, color: '#ffffff', marginTop: 5 }}>Next review was: {d.nextReview} · Owner: {d.owner}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="pg-card-elevated" style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flex: 'none' }}>
            <div className="pg-icon-bubble" style={{ borderColor: 'var(--pg-operate-bright)' }}>
              <Gavel size={20} color="var(--pg-operate-bright)" strokeWidth={2.4} />
            </div>
            Recent Decisions
            <Link href="/prizym-governance/workflows/actions" style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 800, color: 'var(--pg-operate-bright)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              View all
            </Link>
          </h3>
          <div
            className="pg-scroll"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 8 }}
          >
            {DECISIONS.slice(0, 8).map((d) => {
              const config = d.decision === 'approved'
                ? { color: 'var(--pg-success-bright)', Icon: CheckCircle2, label: 'Approved' }
                : d.decision === 'modified'
                ? { color: 'var(--pg-warning-bright)', Icon: Edit3, label: 'Modified' }
                : { color: 'var(--pg-danger-bright)', Icon: XCircle, label: 'Rejected' };
              const DIcon = config.Icon;
              return (
                <Link
                  key={d.id}
                  href="/prizym-governance/workflows/actions"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.12)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                    borderLeft: `5px solid ${config.color}`,
                    transition: 'background 0.15s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                >
                  <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: config.color, marginTop: 2 }}>
                    <DIcon size={16} color={config.color} strokeWidth={2.4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.policyRef} · {config.label}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 14, color: '#ffffff' }}>{d.date}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{d.title}</div>
                    {d.impactDollars && (
                      <div style={{ fontSize: 15, color: '#ffffff', marginTop: 4 }}>Impact: ${(d.impactDollars / 1000).toFixed(0)}K</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pg-card-elevated" style={{ padding: 16, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flex: 'none' }}>
            <div className="pg-icon-bubble" style={{ borderColor: 'var(--pg-success-bright)' }}>
              <Activity size={20} color="var(--pg-success-bright)" strokeWidth={2.4} />
            </div>
            Program Pulse
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {(() => {
              const size = 116;
              const stroke = 11;
              const r = (size - stroke) / 2;
              const c = 2 * Math.PI * r;
              const offset = c * (1 - complianceScore / 100);
              return (
                <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
                  <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={stroke} />
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      fill="none"
                      stroke="var(--pg-success)"
                      strokeWidth={stroke}
                      strokeDasharray={c}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{complianceScore}%</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Compliance</div>
                  </div>
                </div>
              );
            })()}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, flex: 1, color: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Docs published</span><strong style={{ color: '#ffffff', fontWeight: 800 }}>{DOCUMENTS.filter(d => d.status === 'published').length}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Obligations</span><strong style={{ color: '#ffffff', fontWeight: 800 }}>{oblStats.total}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Exceptions</span><strong style={{ color: '#ffffff', fontWeight: 800 }}>{exceptionStats.pending}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>At risk</span><strong style={{ color: 'var(--pg-warning)', fontWeight: 800 }}>{oblStats.atRisk}</strong></div>
            </div>
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.18)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Quadrant Maturity
            </div>
            {[
              { label: 'Design', pct: 92, color: 'var(--pg-design)' },
              { label: 'Operate', pct: 48, color: 'var(--pg-operate)' },
              { label: 'Dispute', pct: 22, color: 'var(--pg-dispute)' },
              { label: 'Oversee', pct: 78, color: 'var(--pg-oversee)' },
            ].map((q) => (
              <div key={q.label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{q.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: q.color }}>{q.pct}%</span>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,0.14)', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${q.pct}%`,
                      background: q.color,
                      borderRadius: 4,
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="pg-subheading" style={{ marginBottom: 14, fontSize: '1.375rem', color: '#ffffff' }}>Jump to</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {quickLinks.map((t, i) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="pg-card" style={{
              display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease', transitionDelay: `${0.3 + i * 0.06}s`,
            }}>
              <div className="pg-icon-bubble pg-icon-bubble-lg" style={{ borderColor: t.color }}>
                <Icon size={22} color={t.color} strokeWidth={2.4} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff' }}>{t.label}</div>
                <div style={{ fontSize: 15, color: '#ffffff' }}>{t.count}</div>
              </div>
              <ArrowRight size={18} style={{ color: '#ffffff' }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
