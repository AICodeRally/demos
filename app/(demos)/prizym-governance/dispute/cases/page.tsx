'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DISPUTE_CASES, type DisputeCase, type DisputeStatus } from '@/data/prizym-governance/dispute';
import { X, MessageSquare, User, Calendar, Clock } from 'lucide-react';

const STATUS_COLORS: Record<DisputeStatus, string> = {
  open: '#3b82f6',
  under_review: '#f59e0b',
  resolved: '#10b981',
  escalated: '#ef4444',
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
    <PrizymPage title="Dispute Cases" subtitle="Commission dispute case queue with thread history and SLA tracking" mode="oversee">
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--pg-border)', marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? DISPUTE_CASES.length : DISPUTE_CASES.filter(d => d.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 18px', background: 'transparent', border: 'none',
                borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
                color: active ? '#6366f1' : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, textTransform: 'capitalize',
              }}
            >
              {t === 'all' ? 'All' : STATUS_LABELS[t]}
              <span style={{ padding: '2px 8px', borderRadius: 10, background: active ? 'rgba(99,102,241,0.15)' : 'var(--pg-stripe)', fontSize: 14 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((c, i) => {
          const slaColor = c.daysOpen > c.slaDays * 0.7 ? '#ef4444' : c.daysOpen > c.slaDays * 0.4 ? '#f59e0b' : '#10b981';
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="pg-card-elevated"
              style={{
                textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%',
                borderLeft: `4px solid ${STATUS_COLORS[c.status]}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="pg-overline" style={{ color: '#6366f1', fontSize: 14 }}>{c.caseNumber}</span>
                    <StatusBadge status={c.status} />
                    <span style={{ fontSize: 14, color: 'var(--pg-text-muted)', textTransform: 'capitalize' }}>· {c.category.replace('_', ' ')}</span>
                  </div>
                  <h3 className="pg-subheading" style={{ marginBottom: 6 }}>{c.title}</h3>
                  <p className="pg-caption" style={{ marginBottom: 10, lineHeight: 1.55 }}>{c.summary}</p>
                </div>
                {c.amountDisputed > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div className="pg-overline" style={{ fontSize: 14 }}>Disputed</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--pg-text)' }}>
                      ${(c.amountDisputed / 1000).toFixed(0)}K
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, color: 'var(--pg-text-muted)', flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid var(--pg-border-faint)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={11} /> {c.filedBy}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> Filed {c.filedAt}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: slaColor, fontWeight: 600 }}>
                  <Clock size={11} /> {c.daysOpen}/{c.slaDays} days
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MessageSquare size={11} /> {c.thread.length}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={e => e.stopPropagation()} className="pg-card" style={{ width: 'min(720px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <span className="pg-overline" style={{ color: '#6366f1' }}>{selected.caseNumber} · {selected.relatedPolicy}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 14 }}>Status</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: STATUS_COLORS[selected.status], textTransform: 'capitalize' }}>{STATUS_LABELS[selected.status]}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 14 }}>Amount</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>
                  {selected.amountDisputed > 0 ? `$${(selected.amountDisputed / 1000).toFixed(0)}K` : '—'}
                </div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 14 }}>Assigned</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.assignedTo}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 14 }}>SLA</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.daysOpen} / {selected.slaDays} days</div>
              </div>
            </div>

            <h3 className="pg-subheading" style={{ marginBottom: 12, fontSize: 15 }}>Summary</h3>
            <p className="pg-caption" style={{ marginBottom: 24, lineHeight: 1.7 }}>{selected.summary}</p>

            <h3 className="pg-subheading" style={{ marginBottom: 12, fontSize: 15 }}>Thread ({selected.thread.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selected.thread.map((t, i) => (
                <div key={i} className="pg-card" style={{ padding: 14, background: 'var(--pg-surface-alt)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text)' }}>{t.author}</span>
                    <span style={{ fontSize: 14, color: 'var(--pg-text-muted)' }}>{t.at}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--pg-text-secondary)', lineHeight: 1.6 }}>{t.note}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
