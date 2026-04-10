'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { OBLIGATIONS, getObligationStats, type Obligation } from '@/data/prizym-governance/compliance/obligations';
import { Scale, CheckCircle2, AlertTriangle, Clock, X } from 'lucide-react';

export default function ObligationsPage() {
  const [selected, setSelected] = useState<Obligation | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getObligationStats();

  const metrics = [
    { label: 'Total Obligations', value: String(stats.total), icon: Scale, color: '#0891b2' },
    { label: 'Compliant', value: String(stats.compliant), icon: CheckCircle2, color: '#10b981' },
    { label: 'At Risk', value: String(stats.atRisk), icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Not Assessed', value: String(stats.notAssessed), icon: Clock, color: '#64748b' },
  ];

  return (
    <PrizymPage
      title="Obligations Register"
      subtitle="Regulatory and internal obligations mapped to policies, controls, and evidence. The single source of truth for what we must comply with."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="pg-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pg-surface-alt)', borderBottom: '1px solid var(--pg-border)' }}>
                {['Code', 'Name', 'Jurisdiction', 'Category', 'Status', 'Policies', 'Controls', 'Next Review'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OBLIGATIONS.map((o, i) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  style={{
                    borderBottom: '1px solid var(--pg-border-faint)', cursor: 'pointer',
                    opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: `${i * 0.03}s`,
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--pg-cyan)' }}>{o.code}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{o.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.jurisdiction}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.category}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.policiesMapped.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.controlsMapped.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-muted)' }}>{o.nextReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={e => e.stopPropagation()} className="pg-card" style={{ width: 'min(720px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{selected.code} · {selected.category}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.name}</h2>
                <p className="pg-caption" style={{ marginTop: 6 }}>{selected.jurisdiction}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <p className="pg-caption" style={{ lineHeight: 1.7, marginBottom: 24 }}>{selected.description}</p>
            <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Mapped Policies ({selected.policiesMapped.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {selected.policiesMapped.map(p => <span key={p} className="pg-tag">{p}</span>)}
            </div>
            <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Mapped Controls ({selected.controlsMapped.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selected.controlsMapped.map(c => <span key={c} className="pg-tag">{c}</span>)}
            </div>
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
