'use client';

import { DollarSign } from 'lucide-react';

interface CommissionMiniProps {
  totalCommission: number;
  breakdown: string;
}

export function CommissionMini({ totalCommission, breakdown }: CommissionMiniProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 10,
        border: '1px solid rgba(16,185,129,0.25)',
        background: 'rgba(16,185,129,0.06)',
      }}
    >
      <DollarSign size={16} style={{ color: '#10B981', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: '#10B981' }}>
            ${totalCommission.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            est. commission
          </span>
        </div>
        <p style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>
          {breakdown}
        </p>
      </div>
      <span style={{ fontSize: '0.55rem', color: 'var(--register-text-dim)', whiteSpace: 'nowrap' }}>
        Rewards tab for full breakdown
      </span>
    </div>
  );
}
