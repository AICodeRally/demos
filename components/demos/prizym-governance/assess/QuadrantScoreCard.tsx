'use client';

import React from 'react';
import type { Quadrant } from '@/data/prizym-governance/engine/types';

const QUADRANT_META: Record<Quadrant, { label: string; color: string }> = {
  design:  { label: 'Design',  color: '#0ea5e9' },
  operate: { label: 'Operate', color: '#3b82f6' },
  dispute: { label: 'Dispute', color: '#6366f1' },
  oversee: { label: 'Oversee', color: '#8b5cf6' },
};

interface Props {
  quadrant: Quadrant;
  /** Score in [0, 1] */
  score: number;
}

export function QuadrantScoreCard({ quadrant, score }: Props) {
  const meta = QUADRANT_META[quadrant];
  const pct = Math.round(Math.max(0, Math.min(1, score)) * 100);

  return (
    <div
      style={{
        background: 'var(--pg-card)',
        border: '1px solid var(--pg-border)',
        borderRadius: 12,
        padding: 20,
        boxShadow: 'var(--pg-shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: meta.color }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--pg-text)' }}>{meta.label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, color: meta.color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--pg-border)', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: meta.color,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
    </div>
  );
}
