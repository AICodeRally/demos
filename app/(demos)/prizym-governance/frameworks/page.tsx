'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { FRAMEWORKS } from '@/data/prizym-governance/frameworks';
import { Network, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FrameworksPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage title="Governance Frameworks" subtitle="Methodologies and standards governing compensation design and operations" mode="design">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {FRAMEWORKS.map((fw, i) => (
          <div
            key={fw.id}
            className="pg-card-elevated"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.12}s`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <div className="pg-icon-bubble" style={{ background: 'rgba(139,92,246,0.12)', padding: 10 }}>
                <Network size={22} color="#8b5cf6" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <span className="pg-overline" style={{ color: '#8b5cf6' }}>{fw.code}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <StatusBadge status={fw.status} />
                    {fw.isMandatory && (
                      <span className="pg-badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <AlertCircle size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                        Mandatory
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="pg-subheading" style={{ marginTop: 4, fontSize: '1.15rem' }}>{fw.title}</h3>
                <span className="pg-caption">{fw.category} &middot; v{fw.version}</span>
              </div>
            </div>

            <p className="pg-body" style={{ color: 'var(--pg-text-muted)', marginBottom: 14, lineHeight: 1.6 }}>{fw.summary}</p>

            <div style={{ marginBottom: 14 }}>
              <div className="pg-overline" style={{ marginBottom: 8 }}>Key Principles</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {fw.keyPrinciples.map(p => (
                  <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)', fontSize: 'var(--pg-fs-caption)', color: 'var(--pg-text-muted)', transition: 'all 0.15s' }}>
                    <CheckCircle2 size={11} color="#10b981" />
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="pg-overline" style={{ marginBottom: 6 }}>Applies To</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
