'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DECISIONS } from '@/data/prizym-governance/operate';
import { Users, CheckCircle2, Edit3, XCircle } from 'lucide-react';

const DECISION_COLORS = {
  approved: { fg: 'var(--pg-success-bright)', icon: CheckCircle2 },
  modified: { fg: 'var(--pg-warning-bright)', icon: Edit3 },
  rejected: { fg: 'var(--pg-danger-bright)', icon: XCircle },
};

export default function DecisionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalImpact = DECISIONS.reduce((sum, d) => sum + (d.impactDollars ?? 0), 0);

  const summaryTiles = [
    { label: 'Total Decisions', value: DECISIONS.length, color: 'var(--pg-operate-bright)' },
    { label: 'Approved', value: DECISIONS.filter(d => d.decision === 'approved').length, color: 'var(--pg-success-bright)' },
    { label: 'Modified', value: DECISIONS.filter(d => d.decision === 'modified').length, color: 'var(--pg-warning-bright)' },
    { label: 'Impact Tracked', value: `$${(totalImpact / 1000).toFixed(0)}K`, color: '#ffffff' },
  ];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Decisions Log
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Audit-ready record of governance decisions with rationale and voters.
        </p>
      </div>

      <div style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {summaryTiles.map((t) => (
          <div
            key={t.label}
            className="pg-card-elevated"
            style={{ padding: '14px 18px' }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: t.color, lineHeight: 1, marginTop: 5 }}>{t.value}</div>
          </div>
        ))}
      </div>

      <div className="pg-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        <div style={{ position: 'relative', paddingLeft: 30 }}>
          <div style={{ position: 'absolute', left: 11, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, var(--pg-operate-bright), transparent)' }} />

          {DECISIONS.map((d, i) => {
            const config = DECISION_COLORS[d.decision];
            const Icon = config.icon;
            return (
              <div
                key={d.id}
                style={{
                  position: 'relative',
                  marginBottom: 14,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                <div
                  className="pg-icon-bubble pg-icon-bubble-sm"
                  style={{ position: 'absolute', left: -34, top: 12, borderColor: config.fg, width: 26, height: 26 }}
                >
                  <Icon size={14} color={config.fg} strokeWidth={2.6} />
                </div>

                <div
                  style={{
                    padding: '16px 18px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.12)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                    borderLeft: `5px solid ${config.fg}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-operate-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.policyRef}</span>
                        <span style={{ fontSize: 14, color: '#f1f5f9' }}>{d.date}</span>
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 5, lineHeight: 1.3 }}>{d.title}</h3>
                    </div>
                    <span style={{ height: 'fit-content' }}><StatusBadge status={d.decision} /></span>
                  </div>
                  <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.55, marginBottom: 10 }}>{d.rationale}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#ffffff', flexWrap: 'wrap', gap: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} strokeWidth={2.4} /> {d.voters.join(', ')}
                    </span>
                    {d.impactDollars && (
                      <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Impact:</strong> ${(d.impactDollars / 1000).toFixed(0)}K</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
