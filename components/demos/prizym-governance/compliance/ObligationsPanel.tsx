'use client';

import { useState, useEffect, useMemo } from 'react';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { OBLIGATIONS, type Obligation, type ObligationStatus } from '@/data/prizym-governance/compliance/obligations';
import { Scale, CheckCircle2, AlertTriangle, Clock, X, Save } from 'lucide-react';

const STATUS_LABELS: Record<ObligationStatus, string> = {
  compliant: 'Compliant',
  at_risk: 'At Risk',
  non_compliant: 'Non-Compliant',
  not_assessed: 'Not Assessed',
};

export function ObligationsPanel({ showMetrics = true }: { showMetrics?: boolean } = {}) {
  const [obligations, setObligations] = useState<Obligation[]>(() => [...OBLIGATIONS]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ status: ObligationStatus; nextReview: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = useMemo(() => ({
    total: obligations.length,
    compliant: obligations.filter(o => o.status === 'compliant').length,
    atRisk: obligations.filter(o => o.status === 'at_risk').length,
    notAssessed: obligations.filter(o => o.status === 'not_assessed').length,
  }), [obligations]);

  const selected = obligations.find(o => o.id === selectedId) ?? null;

  function openRow(o: Obligation) {
    setSelectedId(o.id);
    setDraft({ status: o.status, nextReview: o.nextReview });
  }

  function closePanel() {
    setSelectedId(null);
    setDraft(null);
  }

  function save() {
    if (!selected || !draft) return;
    setObligations(prev => prev.map(o => o.id === selected.id ? { ...o, status: draft.status, nextReview: draft.nextReview } : o));
    showDemoToast(`${selected.code} updated · ${STATUS_LABELS[draft.status]}`, 'success');
    closePanel();
  }

  const metrics = [
    { label: 'Total Obligations', value: String(stats.total), icon: Scale, color: 'var(--pg-cyan-bright)' },
    { label: 'Compliant', value: String(stats.compliant), icon: CheckCircle2, color: 'var(--pg-success-bright)' },
    { label: 'At Risk', value: String(stats.atRisk), icon: AlertTriangle, color: 'var(--pg-warning-bright)' },
    { label: 'Not Assessed', value: String(stats.notAssessed), icon: Clock, color: 'var(--pg-neutral)' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(15, 23, 42, 0.55)',
    border: '1px solid rgba(255, 255, 255, 0.28)',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 700,
    outline: 'none',
    fontFamily: 'inherit',
  };

  const isDirty = selected && draft && (draft.status !== selected.status || draft.nextReview !== selected.nextReview);

  return (
    <>
      {showMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
        </div>
      )}

      <div className="pg-card" style={{ padding: 0, overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="pg-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 23, 42, 0.72)', backdropFilter: 'blur(12px)', zIndex: 1 }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.24)' }}>
                {['Code', 'Name', 'Jurisdiction', 'Category', 'Status', 'Policies', 'Controls', 'Next Review'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {obligations.map((o, i) => (
                <tr
                  key={o.id}
                  onClick={() => openRow(o)}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                    opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease, background 0.15s ease', transitionDelay: `${i * 0.02}s`,
                  }}
                  onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(ev) => { ev.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{o.code}</td>
                  <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{o.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{o.jurisdiction}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{o.category}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{o.policiesMapped.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{o.controlsMapped.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, color: '#f1f5f9' }}>{o.nextReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && draft && (
        <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.code} · {selected.category}</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>{selected.name}</h2>
                <p style={{ fontSize: 15, color: '#f1f5f9', marginTop: 6 }}>{selected.jurisdiction}</p>
              </div>
              <button onClick={closePanel} className="pg-icon-bubble" style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>
            <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.7, marginBottom: 24 }}>{selected.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24, padding: 18, borderRadius: 12, background: 'rgba(14,165,233,0.08)', border: '1.5px solid var(--pg-cyan-bright)' }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Compliance Status</label>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft(d => d ? { ...d, status: e.target.value as ObligationStatus } : d)}
                  style={inputStyle}
                >
                  {(Object.keys(STATUS_LABELS) as ObligationStatus[]).map(s => (
                    <option key={s} value={s} style={{ background: '#0f172a', color: '#ffffff' }}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Next Review</label>
                <input
                  type="date"
                  value={draft.nextReview}
                  onChange={(e) => setDraft(d => d ? { ...d, nextReview: e.target.value } : d)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={save}
                  disabled={!isDirty}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 22px',
                    background: isDirty ? 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 10,
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: isDirty ? 'pointer' : 'not-allowed',
                    opacity: isDirty ? 1 : 0.5,
                    boxShadow: isDirty ? '0 8px 24px rgba(14,165,233,0.3)' : 'none',
                  }}
                >
                  <Save size={16} strokeWidth={2.6} /> Save Changes
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Mapped Policies ({selected.policiesMapped.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
              {selected.policiesMapped.map(p => <span key={p} className="pg-tag">{p}</span>)}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Mapped Controls ({selected.controlsMapped.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selected.controlsMapped.map(c => <span key={c} className="pg-tag">{c}</span>)}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
