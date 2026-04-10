'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
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
    { label: 'Attestable Policies', value: String(attestable.length), icon: PenLine, color: '#0891b2' },
    { label: 'Complete (>=90%)', value: String(complete.length), icon: CheckCircle2, color: '#10b981' },
    { label: 'Due Soon (70-89%)', value: String(dueSoon.length), icon: Clock, color: '#f59e0b' },
    { label: 'Overdue (<70%)', value: String(overdue.length), icon: AlertTriangle, color: '#ef4444' },
  ];

  return (
    <PrizymPage title="Attestations" subtitle="Track employee acknowledgment of published policies. Items below 70% are overdue and need escalation.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {attestable.sort((a, b) => (a.attestationPct ?? 0) - (b.attestationPct ?? 0)).map((d, i) => {
          const pct = d.attestationPct ?? 0;
          const state = pct >= 90 ? 'complete' : pct >= 70 ? 'due_soon' : 'overdue';
          const color = state === 'complete' ? '#10b981' : state === 'due_soon' ? '#f59e0b' : '#ef4444';
          const label = state === 'complete' ? 'COMPLETE' : state === 'due_soon' ? 'DUE SOON' : 'OVERDUE';
          return (
            <div key={d.id} className="pg-card" style={{ borderLeft: `3px solid ${color}`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-6px)', transition: 'all 0.3s ease', transitionDelay: `${i * 0.03}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{d.code}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${color}22`, color, fontWeight: 700 }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)' }}>{d.title}</div>
                  <div className="pg-caption" style={{ marginTop: 4 }}>{d.category} · {d.owner} · {d.targetAudience} target employees</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color }}>{pct}%</div>
                  <div className="pg-caption" style={{ fontSize: 11 }}>attested</div>
                </div>
              </div>
              <div style={{ marginTop: 12, height: 6, background: 'var(--pg-border-faint)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: mounted ? `${pct}%` : '0%', background: color, transition: 'width 0.8s ease', transitionDelay: `${0.2 + i * 0.03}s` }} />
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
