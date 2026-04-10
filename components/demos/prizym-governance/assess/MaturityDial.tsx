'use client';

import React from 'react';

interface Props {
  /** Score in [0, 1] */
  score: number;
  /** Total size in pixels (default 180) */
  size?: number;
  /** Label shown below the percentage (default "Maturity") */
  label?: string;
}

export function MaturityDial({ score, size = 180, label = 'Maturity' }: Props) {
  const clamped = Math.max(0, Math.min(1, score));
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const pct = Math.round(clamped * 100);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="mat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="33%" stopColor="#3b82f6" />
            <stop offset="66%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--pg-border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#mat-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--pg-text)', lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 14, color: 'var(--pg-text-muted)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}
