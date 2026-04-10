'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DECISIONS } from '@/data/prizym-governance/operate';
import { Users, CheckCircle2, Edit3, XCircle } from 'lucide-react';

const DECISION_COLORS = {
  approved: { bg: 'rgba(16,185,129,0.15)', fg: '#10b981', icon: CheckCircle2 },
  modified: { bg: 'rgba(245,158,11,0.15)', fg: '#f59e0b', icon: Edit3 },
  rejected: { bg: 'rgba(239,68,68,0.15)', fg: '#ef4444', icon: XCircle },
};

export default function DecisionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage title="Decisions Log" subtitle="Audit-ready record of governance decisions with rationale and voters" mode="operate">
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div className="pg-card" style={{ padding: 14, flex: 1, minWidth: 180 }}>
          <div className="pg-overline">Total Decisions</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--pg-operate)' }}>{DECISIONS.length}</div>
        </div>
        <div className="pg-card" style={{ padding: 14, flex: 1, minWidth: 180 }}>
          <div className="pg-overline">Approved</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{DECISIONS.filter(d => d.decision === 'approved').length}</div>
        </div>
        <div className="pg-card" style={{ padding: 14, flex: 1, minWidth: 180 }}>
          <div className="pg-overline">Modified</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{DECISIONS.filter(d => d.decision === 'modified').length}</div>
        </div>
        <div className="pg-card" style={{ padding: 14, flex: 1, minWidth: 180 }}>
          <div className="pg-overline">Impact Tracked</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--pg-text)' }}>
            ${(DECISIONS.reduce((sum, d) => sum + (d.impactDollars ?? 0), 0) / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: 10, top: 10, bottom: 10, width: 2, background: 'linear-gradient(to bottom, var(--pg-operate), transparent)' }} />

        {DECISIONS.map((d, i) => {
          const config = DECISION_COLORS[d.decision];
          const Icon = config.icon;
          return (
            <div
              key={d.id}
              style={{
                position: 'relative',
                marginBottom: 20,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.07}s`,
              }}
            >
              {/* Dot */}
              <div style={{
                position: 'absolute', left: -25, top: 16,
                width: 22, height: 22, borderRadius: '50%',
                background: config.bg, border: `2px solid ${config.fg}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={14} style={{ color: config.fg }} />
              </div>

              <div className="pg-card-elevated">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span className="pg-overline" style={{ color: 'var(--pg-operate)' }}>{d.policyRef}</span>
                      <span style={{ fontSize: 14, color: 'var(--pg-text-muted)' }}>{d.date}</span>
                    </div>
                    <h3 className="pg-subheading" style={{ marginBottom: 6 }}>{d.title}</h3>
                  </div>
                  <span style={{ height: 'fit-content' }}><StatusBadge status={d.decision} /></span>
                </div>
                <p className="pg-caption" style={{ marginBottom: 12, lineHeight: 1.6 }}>{d.rationale}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--pg-text-muted)', flexWrap: 'wrap', gap: 12, paddingTop: 10, borderTop: '1px solid var(--pg-border-faint)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Users size={14} /> {d.voters.join(', ')}
                  </span>
                  {d.impactDollars && (
                    <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Impact:</strong> ${(d.impactDollars / 1000).toFixed(0)}K</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
