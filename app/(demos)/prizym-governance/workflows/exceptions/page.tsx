'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { EXCEPTIONS, getExceptionStats, type PolicyException, type ExceptionStatus } from '@/data/prizym-governance/workflows/exceptions';
import { AlertOctagon, Clock, CheckCircle2, XCircle, X, Calendar, User } from 'lucide-react';

export default function ExceptionsPage() {
  const [tab, setTab] = useState<ExceptionStatus | 'all'>('all');
  const [selected, setSelected] = useState<PolicyException | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getExceptionStats();
  const filtered = tab === 'all' ? EXCEPTIONS : EXCEPTIONS.filter(e => e.status === tab);

  const metrics = [
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: String(stats.approved), icon: CheckCircle2, color: '#10b981' },
    { label: 'Expired', value: String(stats.expired), icon: XCircle, color: '#64748b' },
    { label: 'Total Impact', value: `$${Math.round(stats.totalImpact / 1000)}K`, icon: AlertOctagon, color: '#ef4444' },
  ];

  const tabs: Array<ExceptionStatus | 'all'> = ['all', 'pending', 'approved', 'expired', 'rejected'];

  return (
    <PrizymPage title="Policy Exceptions" subtitle="Active and historical requests to deviate from published policies. Each exception has an approval chain and expiry.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--pg-border)', marginBottom: 20 }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? EXCEPTIONS.length : EXCEPTIONS.filter(e => e.status === t).length;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 18px', background: 'transparent', border: 'none',
              borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
              color: active ? '#10b981' : 'var(--pg-text-muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t} <span style={{ padding: '2px 8px', borderRadius: 10, background: active ? 'rgba(16,185,129,0.2)' : 'var(--pg-stripe)', fontSize: 11 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((e, i) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            className="pg-card-elevated"
            style={{
              textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%',
              borderLeft: `4px solid ${e.status === 'pending' ? '#f59e0b' : e.status === 'approved' ? '#10b981' : '#64748b'}`,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(6px)',
              transition: 'all 0.4s ease', transitionDelay: `${i * 0.05}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="pg-overline" style={{ color: '#10b981' }}>{e.caseNumber}</span>
                  <StatusBadge status={e.status} />
                  <span style={{ fontSize: 12, color: 'var(--pg-text-muted)', textTransform: 'capitalize' }}>· {e.type.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="pg-subheading" style={{ marginBottom: 6 }}>{e.title}</h3>
                <p className="pg-caption" style={{ marginBottom: 10, lineHeight: 1.55 }}>{e.justification}</p>
              </div>
              {e.amountImpact && (
                <div style={{ textAlign: 'right' }}>
                  <div className="pg-overline" style={{ fontSize: 11 }}>Impact</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--pg-text)' }}>${Math.round(e.amountImpact / 1000)}K</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, color: 'var(--pg-text-muted)', flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid var(--pg-border-faint)' }}>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Policy:</strong> {e.policyRef}</span>
              <span><User size={12} style={{ display: 'inline', marginRight: 4 }} />{e.requestedBy}</span>
              <span><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Filed {e.requestedAt}</span>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Approver:</strong> {e.approver}</span>
              {e.expiresAt && <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Expires:</strong> {e.expiresAt}</span>}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={ev => ev.stopPropagation()} className="pg-card" style={{ width: 'min(680px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <span className="pg-overline" style={{ color: '#10b981' }}>{selected.caseNumber} · {selected.policyRef}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <h3 className="pg-subheading" style={{ marginBottom: 8 }}>Justification</h3>
            <p className="pg-caption" style={{ marginBottom: 18, lineHeight: 1.7 }}>{selected.justification}</p>
            {selected.dealContext && (
              <>
                <h3 className="pg-subheading" style={{ marginBottom: 8 }}>Deal Context</h3>
                <p className="pg-caption" style={{ marginBottom: 18, lineHeight: 1.7 }}>{selected.dealContext}</p>
              </>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 18 }}>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Requested By</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.requestedBy}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Approver</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.approver}</div>
              </div>
              {selected.expiresAt && (
                <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                  <div className="pg-overline" style={{ fontSize: 11 }}>Expires</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.expiresAt}</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
