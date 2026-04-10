'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DISPUTE_CASES, type DisputeCase, type DisputeStatus } from '@/data/prizym-governance/dispute';
import { X, MessageSquare, User, Calendar, Clock } from 'lucide-react';

const STATUS_COLORS: Record<DisputeStatus, string> = {
  open: 'var(--pg-info-bright)',
  under_review: 'var(--pg-warning-bright)',
  resolved: 'var(--pg-success-bright)',
  escalated: 'var(--pg-danger-bright)',
};

const STATUS_LABELS: Record<DisputeStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  resolved: 'Resolved',
  escalated: 'Escalated',
};

export default function DisputeCasesPage() {
  const [tab, setTab] = useState<DisputeStatus | 'all'>('all');
  const [selected, setSelected] = useState<DisputeCase | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = tab === 'all' ? DISPUTE_CASES : DISPUTE_CASES.filter(d => d.status === tab);
  const tabs: Array<DisputeStatus | 'all'> = ['all', 'open', 'under_review', 'escalated', 'resolved'];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Dispute Cases
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Commission dispute case queue with thread history and SLA tracking.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.22)', marginBottom: 14, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? DISPUTE_CASES.length : DISPUTE_CASES.filter(d => d.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 18px', background: 'transparent', border: 'none',
                borderBottom: active ? '2px solid var(--pg-dispute-bright)' : '2px solid transparent',
                color: active ? 'var(--pg-dispute-bright)' : '#ffffff',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, textTransform: 'capitalize',
              }}
            >
              {t === 'all' ? 'All' : STATUS_LABELS[t]}
              <span style={{ padding: '3px 10px', borderRadius: 10, background: active ? 'rgba(165, 180, 252, 0.22)' : 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 700 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {filtered.map((c, i) => {
          const slaColor = c.daysOpen > c.slaDays * 0.7 ? 'var(--pg-danger-bright)' : c.daysOpen > c.slaDays * 0.4 ? 'var(--pg-warning-bright)' : 'var(--pg-success-bright)';
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                textAlign: 'left', cursor: 'pointer', width: '100%',
                padding: '16px 18px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                borderLeft: `5px solid ${STATUS_COLORS[c.status]}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.04}s`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-dispute-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.caseNumber}</span>
                    <StatusBadge status={c.status} />
                    <span style={{ fontSize: 14, color: '#f1f5f9', textTransform: 'capitalize' }}>· {c.category.replace('_', ' ')}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 5 }}>{c.title}</h3>
                  <p style={{ fontSize: 15, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 8 }}>{c.summary}</p>
                </div>
                {c.amountDisputed > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disputed</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginTop: 2 }}>
                      ${(c.amountDisputed / 1000).toFixed(0)}K
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, color: '#ffffff', flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><User size={14} strokeWidth={2.4} /> {c.filedBy}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={14} strokeWidth={2.4} /> Filed {c.filedAt}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: slaColor, fontWeight: 800 }}>
                  <Clock size={14} strokeWidth={2.4} /> {c.daysOpen}/{c.slaDays} days
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MessageSquare size={14} strokeWidth={2.4} /> {c.thread.length}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside
            onClick={e => e.stopPropagation()}
            className="pg-scroll"
            style={{
              width: 'min(720px, 92vw)',
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
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-dispute-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.caseNumber} · {selected.relatedPolicy}</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="pg-icon-bubble" style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 22 }}>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: STATUS_COLORS[selected.status], marginTop: 3 }}>{STATUS_LABELS[selected.status]}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>
                  {selected.amountDisputed > 0 ? `$${(selected.amountDisputed / 1000).toFixed(0)}K` : '—'}
                </div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.assignedTo}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SLA</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.daysOpen} / {selected.slaDays} days</div>
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Summary</h3>
            <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.7, marginBottom: 24 }}>{selected.summary}</p>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Thread ({selected.thread.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.thread.map((t, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>{t.author}</span>
                    <span style={{ fontSize: 14, color: '#f1f5f9' }}>{t.at}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#ffffff', lineHeight: 1.6 }}>{t.note}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
