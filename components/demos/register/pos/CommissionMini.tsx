'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

interface CommissionMiniProps {
  totalCommission: number;
  breakdown: string;
}

/* Silver/Gold thresholds mirror SAMPLE_PERIODS tier math. */
const TIER_STOPS = [
  { label: 'Bronze',   value: 0,     color: '#CD7F32' },
  { label: 'Silver',   value: 1500,  color: '#9CA3AF' },
  { label: 'Gold',     value: 3000,  color: '#D97706' },
  { label: 'Platinum', value: 5000,  color: '#7C3AED' },
];

export function CommissionMini({ totalCommission, breakdown }: CommissionMiniProps) {
  const displayValue = useAnimatedNumber(totalCommission, 420);
  const prevRef = useRef(totalCommission);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (totalCommission > prevRef.current + 0.5) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      prevRef.current = totalCommission;
      return () => clearTimeout(t);
    }
    prevRef.current = totalCommission;
  }, [totalCommission]);

  /* Find current + next tier */
  const activeIdx = [...TIER_STOPS].reverse().findIndex((t) => totalCommission >= t.value);
  const currentTier = activeIdx === -1 ? TIER_STOPS[0] : TIER_STOPS[TIER_STOPS.length - 1 - activeIdx];
  const nextTier = TIER_STOPS[Math.min(TIER_STOPS.length - 1 - activeIdx + 1, TIER_STOPS.length - 1)];
  const toNext = Math.max(0, nextTier.value - totalCommission);
  const tierProgress = currentTier.value === nextTier.value
    ? 100
    : Math.min(100, Math.max(0, ((totalCommission - currentTier.value) / (nextTier.value - currentTier.value)) * 100));

  const ringRadius = 22;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - tierProgress / 100);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 12,
        background: flash
          ? 'color-mix(in srgb, var(--register-success) 14%, var(--register-bg-elevated))'
          : 'var(--register-bg-elevated)',
        border: `1px solid ${flash ? 'var(--register-success)' : 'color-mix(in srgb, var(--register-success) 35%, var(--register-border))'}`,
        boxShadow: flash
          ? '0 0 0 4px color-mix(in srgb, var(--register-success) 16%, transparent)'
          : 'var(--register-shadow-card)',
        transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Radial tier ring */}
      <div style={{ width: 56, height: 56, position: 'relative', flexShrink: 0 }}>
        <svg viewBox="0 0 56 56" width="56" height="56">
          <circle
            cx="28" cy="28" r={ringRadius}
            fill="none" stroke="var(--register-border)" strokeWidth="3.5"
          />
          <circle
            cx="28" cy="28" r={ringRadius}
            fill="none"
            stroke={currentTier.color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 28 28)"
            style={{ transition: 'stroke-dashoffset 500ms cubic-bezier(0.33,1,0.68,1), stroke 220ms ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', lineHeight: 1,
        }}>
          <span style={{
            fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.06em',
            color: currentTier.color, textTransform: 'uppercase',
          }}>
            {currentTier.label}
          </span>
          <span style={{
            fontSize: '0.72rem', fontWeight: 800,
            color: 'var(--register-text)', fontVariantNumeric: 'tabular-nums',
            marginTop: 1,
          }}>
            {Math.round(tierProgress)}%
          </span>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontSize: '1.42rem', fontWeight: 800,
              color: 'var(--register-success)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
              transition: 'color 160ms ease',
            }}
          >
            ${displayValue.toFixed(2)}
          </span>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--register-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            this sale
          </span>
          {flash && (
            <Sparkles
              size={12}
              style={{
                color: 'var(--register-warning)',
                animation: 'reg-pop 600ms ease-out',
              }}
            />
          )}
        </div>
        <div style={{
          fontSize: '0.78rem', color: 'var(--register-text-muted)', marginTop: 3,
          lineHeight: 1.35,
        }}>
          {breakdown}
        </div>

        {/* Tier progress line */}
        {toNext > 0 && (
          <div style={{
            marginTop: 6, display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.72rem', color: 'var(--register-text-dim)',
          }}>
            <TrendingUp size={10} style={{ color: nextTier.color }} />
            <span>
              <strong style={{ color: 'var(--register-text)', fontVariantNumeric: 'tabular-nums' }}>
                ${toNext.toFixed(2)}
              </strong>
              {' '}to {nextTier.label}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes reg-pop {
          0%   { opacity: 0; transform: scale(0.4) rotate(-12deg); }
          40%  { opacity: 1; transform: scale(1.25) rotate(8deg); }
          100% { opacity: 0; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

function useAnimatedNumber(target: number, durationMs: number): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(fromRef.current + (target - fromRef.current) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}
