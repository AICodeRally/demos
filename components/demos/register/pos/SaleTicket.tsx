'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import type { SaleItem } from '@/lib/swic-engine/types';

interface SaleTicketProps {
  items: SaleItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  aiUpsellSlot?: React.ReactNode;
}

export function SaleTicket({ items, onRemoveItem, onUpdateQuantity, aiUpsellSlot }: SaleTicketProps) {
  if (items.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
        <span style={{ fontSize: '2rem', opacity: 0.3 }}>&#128722;</span>
        <p style={{ fontSize: '0.85rem', color: 'var(--register-text-dim)' }}>No items in this sale</p>
        <p style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)' }}>Select products from the showroom</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flex: 1 }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 8,
            background: 'var(--register-bg-surface)',
            border: '1px solid var(--register-border)',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', margin: 0 }}>
              {item.name}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
              {item.category} &middot; ${item.price.toLocaleString()} ea
            </p>
          </div>

          {/* Quantity controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              style={{
                width: 24, height: 24, borderRadius: 6,
                border: '1px solid var(--register-border)',
                background: 'var(--register-bg-elevated)',
                color: 'var(--register-text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)', minWidth: 20, textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              style={{
                width: 24, height: 24, borderRadius: 6,
                border: '1px solid var(--register-border)',
                background: 'var(--register-bg-elevated)',
                color: 'var(--register-text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Line total */}
          <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)', minWidth: 70, textAlign: 'right' }}>
            ${(item.price * item.quantity).toLocaleString()}
          </span>

          {/* Remove */}
          <button
            onClick={() => onRemoveItem(item.id)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--register-danger)', cursor: 'pointer',
              padding: 2, display: 'flex',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {/* AI Upsell Slot */}
      {aiUpsellSlot && <div style={{ marginTop: 4 }}>{aiUpsellSlot}</div>}
    </div>
  );
}
