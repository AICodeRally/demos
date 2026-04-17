'use client';

import { ArrowLeftRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VARICENT_SYNC } from '@/data/register/comp-data';

export function SyncBanner() {
  const s = VARICENT_SYNC;
  const drift = s.registerRuleCount - s.varicentRuleCount;
  const Icon = s.inSync ? CheckCircle2 : AlertCircle;
  const stateColor = s.inSync ? 'var(--register-success)' : 'var(--register-warning)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 18px',
        marginBottom: 20,
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderLeft: `3px solid ${stateColor}`,
        borderRadius: 10,
        boxShadow: 'var(--register-shadow-card)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ArrowLeftRight size={18} style={{ color: 'var(--register-primary)' }} />
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--register-text)' }}>
          Varicent
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)' }}>⇄</span>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--register-text)' }}>
          REGISTER
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 999,
        background: `color-mix(in srgb, ${stateColor} 14%, transparent)`,
        color: stateColor, fontSize: '0.78rem', fontWeight: 700,
        letterSpacing: '0.02em',
      }}>
        <Icon size={14} />
        {s.inSync ? 'In Sync' : 'Drift'}
      </div>

      <div style={{ flex: 1, minWidth: 260, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <Stat label="Varicent rules" value={String(s.varicentRuleCount)} />
        <Stat label="REGISTER rules" value={String(s.registerRuleCount)} accent={drift !== 0 ? stateColor : undefined} />
        <Stat label="Last pull" value={formatShort(s.lastPullFromVaricent)} />
        <Stat label="Last push" value={formatShort(s.lastPushToVaricent)} />
      </div>

      {s.driftReason && (
        <div style={{
          fontSize: '0.82rem', color: 'var(--register-text-muted)',
          paddingLeft: 12, borderLeft: '1px solid var(--register-border)',
        }}>
          {s.driftReason}
        </div>
      )}

      <button
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 12px', borderRadius: 8,
          background: 'transparent', border: '1px solid var(--register-border-strong)',
          color: 'var(--register-text)', fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer',
        }}
        onClick={() => { /* noop demo */ }}
      >
        <RefreshCw size={13} />
        Re-pull from Varicent
      </button>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
      <span style={{
        fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
        color: 'var(--register-text-dim)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.95rem', fontWeight: 700, color: accent ?? 'var(--register-text)',
        fontVariantNumeric: 'tabular-nums', marginTop: 2,
      }}>
        {value}
      </span>
    </div>
  );
}

function formatShort(ts: string): string {
  // "2026-03-11 2:30 PM" → "Mar 11 · 2:30 PM"
  const [date, ...rest] = ts.split(' ');
  const time = rest.join(' ');
  const [, m, d] = date.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)} · ${time}`;
}
