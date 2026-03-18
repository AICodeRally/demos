'use client';

import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { FRAMEWORKS } from '@/data/prizym-governance/frameworks';
import { Network, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FrameworksPage() {
  return (
    <PrizymPage title="Governance Frameworks" subtitle="Methodologies and standards governing compensation design and operations" mode="design">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FRAMEWORKS.map(fw => (
          <div key={fw.id} className="pg-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ background: 'rgba(139,92,246,0.12)', borderRadius: 8, padding: 8, display: 'flex' }}>
                <Network size={20} color="#8b5cf6" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <span className="pg-overline" style={{ color: '#8b5cf6' }}>{fw.code}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <StatusBadge status={fw.status} />
                    {fw.isMandatory && (
                      <span className="pg-badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                        Mandatory
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="pg-subheading" style={{ marginTop: 4 }}>{fw.title}</h3>
                <span className="pg-caption">{fw.category} &middot; v{fw.version}</span>
              </div>
            </div>

            <p className="pg-body" style={{ color: 'var(--pg-text-muted)', marginBottom: 12 }}>{fw.summary}</p>

            <div style={{ marginBottom: 12 }}>
              <div className="pg-overline" style={{ marginBottom: 6 }}>Key Principles</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {fw.keyPrinciples.map(p => (
                  <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)', fontSize: 'var(--pg-fs-caption)', color: 'var(--pg-text-muted)' }}>
                    <CheckCircle2 size={10} color="#10b981" />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="pg-overline" style={{ marginBottom: 4 }}>Applies To</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {fw.applicableTo.map(a => (
                <span key={a} className="pg-badge" style={{ background: 'var(--pg-cyan-bg)', color: 'var(--pg-cyan)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrizymPage>
  );
}
