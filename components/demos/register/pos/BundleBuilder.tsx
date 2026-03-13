'use client';

import { Gift } from 'lucide-react';
import type { SaleItem } from '@/lib/swic-engine/types';

interface BundleBuilderProps {
  items: SaleItem[];
}

export function BundleBuilder({ items }: BundleBuilderProps) {
  const hasMattress = items.some((i) => i.category === 'Mattress');
  const hasBase = items.some((i) => i.category === 'Adjustable Base');
  const isBundle = hasMattress && hasBase;

  if (!isBundle) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        background: 'rgba(6,182,212,0.1)',
        border: '1px solid rgba(6,182,212,0.3)',
      }}
    >
      <Gift size={14} style={{ color: 'var(--register-accent)' }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--register-accent)' }}>
        Sleep System Bundle +$75
      </span>
    </div>
  );
}
