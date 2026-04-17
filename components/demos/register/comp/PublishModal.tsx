'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { X, Check, Loader2, Radio, Tablet, Monitor, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { PUBLISH_TARGETS, DRAFT_DIFF, type PublishTargetId, type PublishTarget } from '@/data/register/comp-data';
import { useIcm } from '@/components/demos/register/IcmContext';

type Phase = 'confirm' | 'publishing' | 'done';
type TargetState = 'idle' | 'connecting' | 'streaming' | 'done';

const TARGET_ICONS: Record<PublishTargetId, typeof Database> = {
  varicent: Database,
  tablets: Tablet,
  register: Monitor,
};

export function PublishModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { provider } = useIcm();
  const [phase, setPhase] = useState<Phase>('confirm');
  const [states, setStates] = useState<Record<PublishTargetId, TargetState>>({
    varicent: 'idle', tablets: 'idle', register: 'idle',
  });
  const [log, setLog] = useState<string[]>([]);

  /* Rewrite the first target (the ICM) based on selection. */
  const targets: PublishTarget[] = useMemo(() => {
    return PUBLISH_TARGETS.map((t) =>
      t.id === 'varicent'
        ? {
            ...t,
            name: provider.name,
            role: `System of record — ${provider.positioning.toLowerCase()}`,
            protocol: provider.protocol,
            endpoint: `https://${provider.endpointHost}/v2/plans/{planId}/rules`,
            avgLatencyMs: provider.avgLatencyMs,
          }
        : t,
    );
  }, [provider]);

  useEffect(() => {
    if (!open) {
      // reset when closed
      setTimeout(() => {
        setPhase('confirm');
        setStates({ varicent: 'idle', tablets: 'idle', register: 'idle' });
        setLog([]);
      }, 200);
    }
  }, [open]);

  if (!open) return null;

  async function start() {
    setPhase('publishing');
    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const push = (line: string) => setLog((l) => [...l, `[${now()}] ${line}`]);

    push(`Bundling ${DRAFT_DIFF.length} rule deltas into signed publish envelope…`);
    await sleep(400);
    push(`Envelope signed with tenant key skm_prod_5a8e`);

    const parallel = targets.map(async (t, i) => {
      await sleep(120 + i * 80);
      setStates((s) => ({ ...s, [t.id]: 'connecting' }));
      push(`→ ${t.name} — opening ${t.protocol.toLowerCase()}…`);
      await sleep(t.avgLatencyMs / 4);
      setStates((s) => ({ ...s, [t.id]: 'streaming' }));
      push(`→ ${t.name} — streaming ${DRAFT_DIFF.length} deltas to ${t.recipients} recipient${t.recipients === 1 ? '' : 's'}`);
      await sleep(t.avgLatencyMs / 2);
      setStates((s) => ({ ...s, [t.id]: 'done' }));
      push(`✓ ${t.name} — ack received (${t.avgLatencyMs}ms round-trip)`);
    });
    await Promise.all(parallel);
    push(`All targets acknowledged — rules are live.`);
    setPhase('done');
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'pub-fade 160ms ease-out',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && phase !== 'publishing') onClose(); }}
    >
      <style>{`
        @keyframes pub-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pub-slide { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={{
        width: 'min(780px, 100%)', maxHeight: '90vh',
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 16,
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.25)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'pub-slide 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--register-border)',
        }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--register-text)', letterSpacing: '-0.01em' }}>
              Publish approved ruleset
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--register-text-muted)', marginTop: 3 }}>
              {DRAFT_DIFF.length} deltas → {provider.name}, {targets[1].recipients} tablets, {targets[2].recipients} consoles
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={phase === 'publishing'}
            style={{
              background: 'transparent', border: 'none',
              padding: 6, borderRadius: 8,
              color: 'var(--register-text-muted)',
              cursor: phase === 'publishing' ? 'not-allowed' : 'pointer',
              opacity: phase === 'publishing' ? 0.4 : 1,
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
          {/* Target cards */}
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 18 }}>
            {targets.map((t) => (
              <TargetCard key={t.id} target={t} state={states[t.id]} />
            ))}
          </div>

          {/* Log / confirm message */}
          {phase === 'confirm' ? (
            <ConfirmSummary />
          ) : (
            <LogPanel lines={log} done={phase === 'done'} />
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '14px 22px', borderTop: '1px solid var(--register-border)',
          background: 'var(--register-bg-surface)',
        }}>
          {phase === 'confirm' && (
            <>
              <button onClick={onClose} style={btnSecondary}>Cancel</button>
              <button onClick={start} style={btnPrimary}>Publish to all 3 targets</button>
            </>
          )}
          {phase === 'publishing' && (
            <span style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)' }}>
              Publishing in progress — do not close
            </span>
          )}
          {phase === 'done' && (
            <>
              <Link
                href="/register/comp/statements"
                onClick={onClose}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid var(--register-border-strong)',
                  color: 'var(--register-text)',
                  fontSize: '0.9rem', fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                View on a rep&apos;s statement <ArrowRight size={14} />
              </Link>
              <button onClick={onClose} style={btnPrimary}>Done</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TargetCard({ target, state }: { target: PublishTarget; state: TargetState }) {
  const Icon = TARGET_ICONS[target.id];
  const stateCfg = {
    idle:       { label: 'Ready',       color: 'var(--register-text-dim)',  bg: 'var(--register-bg-surface)',       showSpin: false, showCheck: false },
    connecting: { label: 'Connecting',  color: 'var(--register-accent)',    bg: 'color-mix(in srgb, var(--register-accent) 10%, transparent)', showSpin: true,  showCheck: false },
    streaming:  { label: 'Streaming',   color: 'var(--register-primary)',   bg: 'color-mix(in srgb, var(--register-primary) 10%, transparent)', showSpin: true,  showCheck: false },
    done:       { label: 'Acknowledged', color: 'var(--register-success)',  bg: 'color-mix(in srgb, var(--register-success) 14%, transparent)', showSpin: false, showCheck: true },
  }[state];

  return (
    <div style={{
      padding: 14,
      background: 'var(--register-bg-elevated)',
      border: '1px solid var(--register-border)',
      borderRadius: 10,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'color-mix(in srgb, var(--register-primary) 12%, transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--register-primary)',
        }}>
          <Icon size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--register-text)' }}>{target.name}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)' }}>{target.role}</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 8px', borderRadius: 6,
        background: stateCfg.bg, color: stateCfg.color,
        fontSize: '0.78rem', fontWeight: 700, alignSelf: 'flex-start',
      }}>
        {stateCfg.showSpin && <Loader2 size={12} style={{ animation: 'spin 0.9s linear infinite' }} />}
        {stateCfg.showCheck && <Check size={12} strokeWidth={3} />}
        {!stateCfg.showSpin && !stateCfg.showCheck && <Radio size={11} />}
        {stateCfg.label}
      </div>

      <div style={{
        fontSize: '0.78rem', color: 'var(--register-text-muted)',
        lineHeight: 1.4, paddingTop: 4, borderTop: '1px solid var(--register-border)',
      }}>
        <div><strong style={{ color: 'var(--register-text)' }}>{target.recipients}</strong> {target.recipientLabel.toLowerCase()}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--register-text-dim)', marginTop: 2, fontFamily: 'monospace' }}>
          {target.protocol}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function ConfirmSummary() {
  const added = DRAFT_DIFF.filter((d) => d.kind === 'added').length;
  const modified = DRAFT_DIFF.filter((d) => d.kind === 'modified').length;
  const removed = DRAFT_DIFF.filter((d) => d.kind === 'removed').length;
  return (
    <div style={{
      padding: 14,
      background: 'var(--register-bg-surface)',
      border: '1px solid var(--register-border)',
      borderRadius: 10,
    }}>
      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 8 }}>
        You are about to publish
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.88rem', color: 'var(--register-text-muted)', lineHeight: 1.8 }}>
        <li><strong style={{ color: 'var(--register-success)' }}>{added} new</strong> rules</li>
        <li><strong style={{ color: 'var(--register-warning)' }}>{modified} modified</strong> rules</li>
        <li><strong style={{ color: 'var(--register-danger)' }}>{removed} removed</strong> rules</li>
      </ul>
      <div style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', marginTop: 10 }}>
        Rules go live immediately on tablet calculators. Next payroll run on the ICM picks up the updated ruleset.
      </div>
    </div>
  );
}

function LogPanel({ lines, done }: { lines: string[]; done: boolean }) {
  return (
    <div style={{
      height: 220, overflowY: 'auto',
      padding: 14,
      background: '#0F172A',
      border: '1px solid var(--register-border)',
      borderRadius: 10,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: '0.8rem', lineHeight: 1.55,
      color: '#E2E8F0',
    }}>
      {lines.map((line, i) => {
        const isAck = line.includes('✓');
        const isArrow = line.includes('→');
        return (
          <div
            key={i}
            style={{
              color: isAck ? '#34D399' : isArrow ? '#93C5FD' : '#E2E8F0',
              animation: 'pub-slide 180ms ease-out both',
            }}
          >
            {line}
          </div>
        );
      })}
      {done && (
        <div style={{
          marginTop: 10, padding: '8px 12px',
          background: 'rgba(52, 211, 153, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.32)',
          borderRadius: 6,
          color: '#34D399', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <CheckCircle2 size={14} /> Publish complete
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: '9px 18px', borderRadius: 8, border: 'none',
  background: 'var(--register-success)', color: '#FFFFFF',
  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(5,150,105,0.24)',
};

const btnSecondary: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 8,
  background: 'transparent', border: '1px solid var(--register-border-strong)',
  color: 'var(--register-text)',
  fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
