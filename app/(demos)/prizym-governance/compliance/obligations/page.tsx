'use client';

import { useState, useEffect } from 'react';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { OBLIGATIONS, getObligationStats, type Obligation } from '@/data/prizym-governance/compliance/obligations';
import { Scale, CheckCircle2, AlertTriangle, Clock, X } from 'lucide-react';

export default function ObligationsPage() {
  const [selected, setSelected] = useState<Obligation | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getObligationStats();

  const metrics = [
    { label: 'Total Obligations', value: String(stats.total), icon: Scale, color: 'var(--pg-cyan-bright)' },
    { label: 'Compliant', value: String(stats.compliant), icon: CheckCircle2, color: 'var(--pg-success-bright)' },
    { label: 'At Risk', value: String(stats.atRisk), icon: AlertTriangle, color: 'var(--pg-warning-bright)' },
    { label: 'Not Assessed', value: String(stats.notAssessed), icon: Clock, color: 'var(--pg-neutral)' },
  ];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Obligations Register
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Regulatory and internal obligations mapped to policies, controls, and evidence — the single source of truth for what we must comply with.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

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
              {OBLIGATIONS.map((o, i) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.code} · {selected.category}</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>{selected.name}</h2>
                <p style={{ fontSize: 15, color: '#f1f5f9', marginTop: 6 }}>{selected.jurisdiction}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="pg-icon-bubble"
                style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
              >
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>
            <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.7, marginBottom: 24 }}>{selected.description}</p>

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
    </div>
  );
}
