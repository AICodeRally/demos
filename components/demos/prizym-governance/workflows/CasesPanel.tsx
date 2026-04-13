'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { DISPUTE_CASES, type DisputeCase, type DisputeStatus } from '@/data/prizym-governance/dispute';
import { X, MessageSquare, User, Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';

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

export function CasesPanel() {
  const [tab, setTab] = useState<DisputeStatus | 'all'>('all');
  const [cases, setCases] = useState<DisputeCase[]>(() => DISPUTE_CASES.map(c => ({ ...c, thread: [...c.thread] })));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const selected = cases.find(c => c.id === selectedId) ?? null;
  const filtered = tab === 'all' ? cases : cases.filter(d => d.status === tab);
  const tabs: Array<DisputeStatus | 'all'> = ['all', 'open', 'under_review', 'escalated', 'resolved'];

  function updateStatus(next: DisputeStatus, verb: string) {
    if (!selected) return;
    setCases(prev => prev.map(c => c.id === selected.id ? { ...c, status: next } : c));
    showDemoToast(`${selected.caseNumber} ${verb}`, next === 'resolved' ? 'success' : 'info');
  }

  function postReply() {
    if (!selected || !reply.trim()) return;
    const entry = { author: 'You (Demo User)', at: new Date().toISOString().slice(0, 10), note: reply.trim() };
    setCases(prev => prev.map(c => c.id === selected.id ? { ...c, thread: [...c.thread, entry] } : c));
    setReply('');
    showDemoToast(`Reply posted to ${selected.caseNumber}`, 'success');
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.22)', marginBottom: 14, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? cases.length : cases.filter(d => d.status === t).length;
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
              onClick={() => { setSelectedId(c.id); setReply(''); }}
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
        <div onClick={() => setSelectedId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
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
              <button onClick={() => setSelectedId(null)} className="pg-icon-bubble" style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap', padding: '14px 16px', borderRadius: 12, background: 'rgba(14,165,233,0.08)', border: '1.5px solid var(--pg-cyan-bright)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center', marginRight: 'auto' }}>Update Status</div>
              {selected.status !== 'under_review' && (
                <button type="button" onClick={() => updateStatus('under_review', 'moved to Under Review')} style={{ padding: '8px 14px', background: 'rgba(252,211,77,0.14)', border: '1.5px solid var(--pg-warning-bright)', borderRadius: 10, color: 'var(--pg-warning-bright)', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Under Review</button>
              )}
              {selected.status !== 'escalated' && (
                <button type="button" onClick={() => updateStatus('escalated', 'escalated')} style={{ padding: '8px 14px', background: 'rgba(252,165,165,0.14)', border: '1.5px solid var(--pg-danger-bright)', borderRadius: 10, color: 'var(--pg-danger-bright)', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Escalate</button>
              )}
              {selected.status !== 'resolved' && (
                <button type="button" onClick={() => updateStatus('resolved', 'resolved')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, color: '#ffffff', fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 18px rgba(14,165,233,0.28)' }}>
                  <CheckCircle2 size={13} strokeWidth={2.8} /> Resolve
                </button>
              )}
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

            <div style={{ marginTop: 18, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'block' }}>Post Reply</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') postReply(); }}
                placeholder="Add a note to the thread…"
                rows={3}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'rgba(15, 23, 42, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: 10,
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 500,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: 1.5,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={postReply}
                  disabled={!reply.trim()}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px',
                    background: reply.trim() ? 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 10,
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: reply.trim() ? 'pointer' : 'not-allowed',
                    opacity: reply.trim() ? 1 : 0.5,
                    boxShadow: reply.trim() ? '0 6px 18px rgba(14,165,233,0.28)' : 'none',
                  }}
                >
                  <Send size={13} strokeWidth={2.6} /> Post Reply
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
