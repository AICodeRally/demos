'use client';

import { useState, useEffect, useMemo } from 'react';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { DOCUMENTS } from '@/data/prizym-governance/documents/catalog';
import type { DocumentRecord } from '@/data/prizym-governance/documents/types';
import { PenLine, CheckCircle2, AlertTriangle, Clock, Bell, Check } from 'lucide-react';

export function AttestationsView() {
  const [mounted, setMounted] = useState(false);
  const [attestations, setAttestations] = useState<DocumentRecord[]>(() =>
    DOCUMENTS.filter(d => d.type === 'policy' && d.status === 'published' && d.attestationPct !== undefined)
  );
  useEffect(() => { setMounted(true); }, []);

  const overdue = attestations.filter(d => (d.attestationPct ?? 0) < 70);
  const dueSoon = attestations.filter(d => (d.attestationPct ?? 0) >= 70 && (d.attestationPct ?? 0) < 90);
  const complete = attestations.filter(d => (d.attestationPct ?? 0) >= 90);

  const metrics = [
    { label: 'Attestable Policies', value: String(attestations.length), icon: PenLine, color: 'var(--pg-cyan-bright)' },
    { label: 'Complete (>=90%)', value: String(complete.length), icon: CheckCircle2, color: 'var(--pg-success-bright)' },
    { label: 'Due Soon (70-89%)', value: String(dueSoon.length), icon: Clock, color: 'var(--pg-warning-bright)' },
    { label: 'Overdue (<70%)', value: String(overdue.length), icon: AlertTriangle, color: 'var(--pg-danger-bright)' },
  ];

  function markComplete(id: string) {
    setAttestations(prev => prev.map(d => d.id === id ? { ...d, attestationPct: 100 } : d));
    const item = attestations.find(d => d.id === id);
    showDemoToast(`${item?.code ?? ''} marked attestation complete (100%)`, 'success');
  }

  function sendReminder(id: string) {
    setAttestations(prev => prev.map(d => {
      if (d.id !== id) return d;
      const cur = d.attestationPct ?? 0;
      const bump = Math.min(10, 100 - cur);
      return { ...d, attestationPct: cur + bump };
    }));
    const item = attestations.find(d => d.id === id);
    showDemoToast(`Reminders sent for ${item?.code ?? ''} (${item?.targetAudience ?? 0} employees)`, 'info');
  }

  function sendAllReminders() {
    const incomplete = attestations.filter(d => (d.attestationPct ?? 0) < 90);
    if (incomplete.length === 0) {
      showDemoToast('All policies already at 90%+ — no reminders needed', 'info');
      return;
    }
    setAttestations(prev => prev.map(d => {
      const cur = d.attestationPct ?? 0;
      if (cur >= 90) return d;
      const bump = Math.min(10, 100 - cur);
      return { ...d, attestationPct: cur + bump };
    }));
    const total = incomplete.reduce((sum, d) => sum + (d.targetAudience ?? 0), 0);
    showDemoToast(`Reminders sent · ${incomplete.length} policies · ${total} employees notified`, 'success');
  }

  const sorted = useMemo(
    () => [...attestations].sort((a, b) => (a.attestationPct ?? 0) - (b.attestationPct ?? 0)),
    [attestations]
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.05} />)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          type="button"
          onClick={sendAllReminders}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 12, color: '#ffffff',
            fontSize: 14, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
          }}
        >
          <Bell size={15} strokeWidth={2.6} />
          Send Reminders to All Incomplete
        </button>
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {sorted.map((d, i) => {
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
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.code}</span>
                    <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 10, background: 'rgba(0,0,0,0.28)', border: `1.5px solid ${color}`, color, fontWeight: 800, letterSpacing: '0.05em' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{d.title}</div>
                  <div style={{ fontSize: 14, color: '#f1f5f9', marginTop: 4 }}>{d.category} · {d.owner} · {d.targetAudience} target employees</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 110 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>attested</div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 7, background: 'rgba(255,255,255,0.14)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: mounted ? `${pct}%` : '0%', background: color, transition: 'width 0.8s ease', transitionDelay: `${0.2 + i * 0.03}s` }} />
              </div>
              {pct < 100 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.16)', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => sendReminder(d.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '8px 16px',
                      background: 'rgba(125,211,252,0.14)',
                      border: '1.5px solid var(--pg-cyan-bright)',
                      borderRadius: 10, color: 'var(--pg-cyan-bright)',
                      fontSize: 13, fontWeight: 800, cursor: 'pointer',
                    }}
                  >
                    <Bell size={13} strokeWidth={2.8} /> Send Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => markComplete(d.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)',
                      border: '1px solid rgba(255,255,255,0.35)',
                      borderRadius: 10, color: '#ffffff',
                      fontSize: 13, fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(14,165,233,0.28)',
                    }}
                  >
                    <Check size={13} strokeWidth={2.8} /> Mark Complete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
