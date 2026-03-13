'use client';

import { useState } from 'react';
import { CreditCard, Banknote, Landmark, Receipt, CheckCircle, X } from 'lucide-react';
import type { SaleItem } from '@/lib/swic-engine/types';
import type { D365TransactionEvent, D365StoreContext } from '@/data/register/d365-schemas';
import { generateTransactionEvent } from '@/lib/register-d365-adapter';
import { broadcastAlert } from '@/lib/register-broadcast';

const PAYMENT_METHODS = [
  { id: 'card' as const, label: 'Card', icon: CreditCard },
  { id: 'cash' as const, label: 'Cash', icon: Banknote },
  { id: 'finance' as const, label: 'Finance', icon: Landmark },
  { id: 'check' as const, label: 'Check', icon: Receipt },
];

interface CloseSaleFlowProps {
  items: SaleItem[];
  rep: { id: string; name: string; storeId: string };
  store: D365StoreContext;
  total: number;
  onClose: (event: D365TransactionEvent) => void;
  onCancel: () => void;
}

export function CloseSaleFlow({ items, rep, store, total, onClose, onCancel }: CloseSaleFlowProps) {
  const [method, setMethod] = useState<'card' | 'cash' | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    const event = generateTransactionEvent(items, rep, store, method === 'cash' ? 'cash' : 'card');
    broadcastAlert({
      id: `sale-${Date.now()}`,
      severity: 'info',
      message: `Sale closed: $${total.toLocaleString()} (${items.length} items) by ${rep.name}`,
      timestamp: new Date().toISOString(),
    });
    setConfirmed(true);
    setTimeout(() => onClose(event), 1200);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          width: 400, borderRadius: 16,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          overflow: 'hidden',
        }}
      >
        {confirmed ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <CheckCircle size={48} style={{ color: '#10B981', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Sale Complete!</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: '8px 0 0' }}>
              D365 event generated &middot; Commission calculated
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--register-border)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)' }}>Close Sale</span>
              <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--register-text-muted)', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            {/* Total */}
            <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid var(--register-border)' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)', margin: '0 0 4px' }}>Total Due</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--register-text)', margin: 0 }}>
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', margin: '4px 0 0' }}>
                {items.length} item{items.length !== 1 ? 's' : ''} &middot; Tax: ${(total * store.taxRate).toFixed(2)}
              </p>
            </div>

            {/* Payment methods */}
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PAYMENT_METHODS.map((pm) => {
                const Icon = pm.icon;
                const selected = method === pm.id || (method !== 'cash' && method !== null && pm.id === 'card');
                return (
                  <button
                    key={pm.id}
                    onClick={() => setMethod(pm.id === 'finance' || pm.id === 'check' ? 'card' : pm.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '14px 8px', borderRadius: 10,
                      border: `2px solid ${selected ? 'var(--register-accent)' : 'var(--register-border)'}`,
                      background: selected ? 'rgba(6,182,212,0.08)' : 'var(--register-bg-surface)',
                      cursor: 'pointer', color: selected ? 'var(--register-accent)' : 'var(--register-text-muted)',
                      fontSize: '0.8rem', fontWeight: 600,
                    }}
                  >
                    <Icon size={22} />
                    {pm.label}
                  </button>
                );
              })}
            </div>

            {/* Confirm */}
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={handleConfirm}
                disabled={!method}
                style={{
                  width: '100%', padding: '12px',
                  borderRadius: 10, border: 'none',
                  background: method ? '#10B981' : 'var(--register-bg-surface)',
                  color: method ? '#FFFFFF' : 'var(--register-text-dim)',
                  fontSize: '0.9rem', fontWeight: 700,
                  cursor: method ? 'pointer' : 'default',
                  opacity: method ? 1 : 0.5,
                }}
              >
                Confirm &amp; Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
