'use client';

import { useState, useEffect } from 'react';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { EXCEPTIONS, getExceptionStats, type PolicyException, type ExceptionStatus } from '@/data/prizym-governance/workflows/exceptions';
import { AlertOctagon, Clock, CheckCircle2, XCircle, X, Calendar, User } from 'lucide-react';

const STATUS_COLOR: Record<ExceptionStatus, string> = {
  pending: 'var(--pg-warning-bright)',
  approved: 'var(--pg-success-bright)',
  rejected: 'var(--pg-danger-bright)',
  expired: 'var(--pg-neutral)',
};

export default function ExceptionsPage() {
  const [tab, setTab] = useState<ExceptionStatus | 'all'>('all');
  const [selected, setSelected] = useState<PolicyException | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getExceptionStats();
  const filtered = tab === 'all' ? EXCEPTIONS : EXCEPTIONS.filter(e => e.status === tab);

  const metrics = [
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: 'var(--pg-warning-bright)' },
    { label: 'Approved', value: String(stats.approved), icon: CheckCircle2, color: 'var(--pg-success-bright)' },
    { label: 'Expired', value: String(stats.expired), icon: XCircle, color: 'var(--pg-neutral)' },
    { label: 'Total Impact', value: `$${Math.round(stats.totalImpact / 1000)}K`, icon: AlertOctagon, color: 'var(--pg-danger-bright)' },
  ];

  const tabs: Array<ExceptionStatus | 'all'> = ['all', 'pending', 'approved', 'expired', 'rejected'];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Policy Exceptions
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Active and historical requests to deviate from published policies — each has an approval chain and expiry.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.22)', marginBottom: 14 }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? EXCEPTIONS.length : EXCEPTIONS.filter(e => e.status === t).length;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 18px', background: 'transparent', border: 'none',
              borderBottom: active ? '2px solid var(--pg-success-bright)' : '2px solid transparent',
              color: active ? 'var(--pg-success-bright)' : '#ffffff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t} <span style={{ padding: '3px 10px', borderRadius: 10, background: active ? 'rgba(110, 231, 183, 0.22)' : 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 700 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {filtered.map((e, i) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
              padding: '16px 18px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.12)',
              borderTop: '1px solid rgba(255, 255, 255, 0.22)',
              borderRight: '1px solid rgba(255, 255, 255, 0.22)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
              borderLeft: `5px solid ${STATUS_COLOR[e.status]}`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(6px)',
              transition: 'all 0.4s ease',
              transitionDelay: `${i * 0.04}s`,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-success-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e.caseNumber}</span>
                  <StatusBadge status={e.status} />
                  <span style={{ fontSize: 14, color: '#f1f5f9', textTransform: 'capitalize' }}>· {e.type.replace(/_/g, ' ')}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 5 }}>{e.title}</h3>
                <p style={{ fontSize: 15, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 8 }}>{e.justification}</p>
              </div>
              {e.amountImpact && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginTop: 2 }}>${Math.round(e.amountImpact / 1000)}K</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, fontSize: 14, color: '#ffffff', flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
              <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Policy:</strong> {e.policyRef}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><User size={14} strokeWidth={2.4} />{e.requestedBy}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={14} strokeWidth={2.4} />Filed {e.requestedAt}</span>
              <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Approver:</strong> {e.approver}</span>
              {e.expiresAt && <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Expires:</strong> {e.expiresAt}</span>}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside
            onClick={ev => ev.stopPropagation()}
            className="pg-scroll"
            style={{
              width: 'min(680px, 92vw)',
              height: '100%',
              overflowY: 'auto',
              padding: '32px 36px',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(24px) saturate(150%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.28)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-success-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.caseNumber} · {selected.policyRef}</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="pg-icon-bubble" style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Justification</h3>
            <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.7, marginBottom: 20 }}>{selected.justification}</p>

            {selected.dealContext && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Deal Context</h3>
                <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.7, marginBottom: 20 }}>{selected.dealContext}</p>
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 18 }}>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested By</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.requestedBy}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approver</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.approver}</div>
              </div>
              {selected.expiresAt && (
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expires</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.expiresAt}</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
