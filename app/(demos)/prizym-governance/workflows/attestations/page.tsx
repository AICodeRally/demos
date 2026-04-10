'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { DOCUMENTS } from '@/data/prizym-governance/documents/catalog';
import { PenLine, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function AttestationsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const attestable = DOCUMENTS.filter(d => d.type === 'policy' && d.status === 'published' && d.attestationPct !== undefined);
  const overdue = attestable.filter(d => (d.attestationPct ?? 0) < 70);
  const dueSoon = attestable.filter(d => (d.attestationPct ?? 0) >= 70 && (d.attestationPct ?? 0) < 90);
  const complete = attestable.filter(d => (d.attestationPct ?? 0) >= 90);

  const metrics = [
    { label: 'Attestable Policies', value: String(attestable.length), icon: PenLine, color: 'var(--pg-cyan-bright)' },
    { label: 'Complete (>=90%)', value: String(complete.length), icon: CheckCircle2, color: 'var(--pg-success-bright)' },
    { label: 'Due Soon (70-89%)', value: String(dueSoon.length), icon: Clock, color: 'var(--pg-warning-bright)' },
    { label: 'Overdue (<70%)', value: String(overdue.length), icon: AlertTriangle, color: 'var(--pg-danger-bright)' },
  ];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Attestations
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Track employee acknowledgment of published policies — items below 70% are overdue and need escalation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {attestable.sort((a, b) => (a.attestationPct ?? 0) - (b.attestationPct ?? 0)).map((d, i) => {
          const pct = d.attestationPct ?? 0;
          const state = pct >= 90 ? 'complete' : pct >= 70 ? 'due_soon' : 'overdue';
          const color = state === 'complete' ? 'var(--pg-success-bright)' : state === 'due_soon' ? 'var(--pg-warning-bright)' : 'var(--pg-danger-bright)';
          const label = state === 'complete' ? 'COMPLETE' : state === 'due_soon' ? 'DUE SOON' : 'OVERDUE';
          return (
            <div
              key={d.id}
              style={{
                padding: '14px 18px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                borderRight: '1px solid rgba(255, 255, 255, 0.22)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
                borderLeft: `5px solid ${color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.03}s`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.code}</span>
                    <span style={{ fontSize: 14, padding: '3px 12px', borderRadius: 10, background: 'rgba(0,0,0,0.28)', border: `1.5px solid ${color}`, color, fontWeight: 800, letterSpacing: '0.05em' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{d.title}</div>
                  <div style={{ fontSize: 14, color: '#f1f5f9', marginTop: 4 }}>{d.category} · {d.owner} · {d.targetAudience} target employees</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 110 }}>
                  <div style={{ fontSize: 34, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>attested</div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 8, background: 'rgba(255,255,255,0.14)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: mounted ? `${pct}%` : '0%', background: color, transition: 'width 0.8s ease', transitionDelay: `${0.2 + i * 0.03}s` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
