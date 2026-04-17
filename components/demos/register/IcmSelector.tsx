'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, Plug } from 'lucide-react';
import { useIcm } from './IcmContext';

export function IcmSelector({ compact = false }: { compact?: boolean }) {
  const { provider, providers, setProviderId } = useIcm();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: compact ? '5px 10px' : '7px 12px', borderRadius: 999,
          background: 'var(--register-bg-elevated)',
          border: `1px solid ${provider.color}55`,
          boxShadow: `inset 0 0 0 0 ${provider.color}`,
          color: 'var(--register-text)',
          fontSize: compact ? '0.78rem' : '0.85rem', fontWeight: 600,
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'border-color 160ms ease',
        }}
        title="Switch ICM provider"
        aria-expanded={open}
      >
        <Plug size={compact ? 12 : 13} style={{ color: provider.color }} />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--register-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ICM
        </span>
        <span
          style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: 999,
            background: provider.color,
            boxShadow: `0 0 8px ${provider.color}`,
          }}
        />
        <span style={{ fontWeight: 700 }}>{provider.shortName}</span>
        <ChevronDown size={12} style={{ color: 'var(--register-text-dim)', transition: 'transform 140ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 70,
            width: 320,
            background: 'var(--register-bg-elevated)',
            border: '1px solid var(--register-border)',
            borderRadius: 12,
            boxShadow: '0 18px 48px rgba(15, 23, 42, 0.20)',
            padding: 6,
            animation: 'icm-dd 140ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{
            padding: '8px 10px 6px',
            fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em',
            color: 'var(--register-text-dim)', textTransform: 'uppercase',
          }}>
            Connected ICM
          </div>
          {providers.map((p) => {
            const active = p.id === provider.id;
            return (
              <button
                key={p.id}
                onClick={() => { setProviderId(p.id); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 8,
                  border: 'none', textAlign: 'left',
                  background: active ? `color-mix(in srgb, ${p.color} 10%, transparent)` : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 100ms ease',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--register-bg-surface)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <span
                  style={{
                    width: 8, height: 8, borderRadius: 999, flexShrink: 0,
                    background: p.color,
                    boxShadow: active ? `0 0 10px ${p.color}` : 'none',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--register-text)', lineHeight: 1.2 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--register-text-muted)', marginTop: 1, lineHeight: 1.4 }}>
                    {p.positioning}
                  </div>
                </div>
                {active && <Check size={14} style={{ color: p.color, flexShrink: 0 }} />}
              </button>
            );
          })}
          <div style={{
            padding: '8px 10px 4px', marginTop: 4,
            borderTop: '1px solid var(--register-border)',
            fontSize: '0.72rem', color: 'var(--register-text-dim)', lineHeight: 1.4,
          }}>
            REGISTER is ICM-agnostic. Pull rules from your system,
            design + simulate here, publish back.
          </div>
        </div>
      )}

      <style>{`
        @keyframes icm-dd {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
