'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, Shield, Zap, Check } from 'lucide-react';
import type { SaleItem, CalculationResult } from '@/lib/swic/engine/types';
import type {
  D365TransactionEvent,
  D365StoreContext,
  ClosedSale,
} from '@/lib/swic/data/d365-schemas';
import { generateTransactionEvent } from '@/lib/swic/adapters/d365';
import { broadcastSale } from '@/lib/swic/util/broadcast';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { ArchitectureDiagram } from './ArchitectureDiagram';

interface CloseSaleFlowProps {
  items: SaleItem[];
  rep: { id: string; name: string; storeId: string };
  store: D365StoreContext;
  commission: CalculationResult;
  onComplete: (event: D365TransactionEvent) => void;
  onCancel: () => void;
}

const STEP_DELAYS = [1000, 500, 2000] as const; // auto-advance delays for steps 0-2

interface StepConfig {
  label: string;
  icon: React.ReactNode;
}

const STEPS: StepConfig[] = [
  { label: 'Processing transaction...', icon: <Loader2 className="w-5 h-5 animate-spin" /> },
  { label: 'Generating D365 event...', icon: <Zap className="w-5 h-5" /> },
  { label: 'Syncing architecture pipeline...', icon: <Shield className="w-5 h-5" /> },
  { label: 'Sale Complete!', icon: <Check className="w-5 h-5" /> },
];

export function CloseSaleFlow({
  items,
  rep,
  store,
  commission,
  onComplete,
  onCancel,
}: CloseSaleFlowProps) {
  const [step, setStep] = useState(0);
  const event = useMemo(
    () => generateTransactionEvent(items, rep, store),
    [items, rep, store]
  );

  // Auto-advance steps 0 -> 1 -> 2 -> 3
  useEffect(() => {
    if (step >= 3) return;
    const timer = setTimeout(() => {
      setStep((s) => s + 1);
    }, STEP_DELAYS[step]);
    return () => clearTimeout(timer);
  }, [step]);

  // When we reach the final step, broadcast the sale
  useEffect(() => {
    if (step === 3 && event) {
      const sale: ClosedSale = {
        event,
        commission: {
          total: commission.totalCommission,
          components: commission.components.map((c) => ({
            id: c.componentId,
            label: c.label,
            amount: c.amount,
          })),
        },
        rep,
        timestamp: new Date().toISOString(),
      };
      broadcastSale(sale);
    }
  }, [step, event, commission, rep]);

  const handleDone = useCallback(() => {
    if (event) {
      onComplete(event);
    }
  }, [event, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={step < 3 ? undefined : onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'var(--glass-bg-strong)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow-lg)',
          backdropFilter: 'var(--glass-blur-strong)',
          WebkitBackdropFilter: 'var(--glass-blur-strong)',
        }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: 'var(--glass-border)' }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: step === 3 ? '#22c55e' : '#6366f1',
            }}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    idx === step
                      ? step === 3
                        ? '#22c55e'
                        : '#6366f1'
                      : idx < step
                        ? '#22c55e'
                        : 'var(--glass-border)',
                  transform: idx === step ? 'scale(1.5)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          {/* Current step label + icon */}
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mx-auto"
              style={{
                background:
                  step === 3
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(99, 102, 241, 0.15)',
                color: step === 3 ? '#22c55e' : '#6366f1',
              }}
            >
              {STEPS[step].icon}
            </div>
            <h3
              className="text-lg font-bold"
              style={{ color: 'var(--page-text)' }}
            >
              {STEPS[step].label}
            </h3>
          </div>

          {/* Step 1 (index 1): show event preview */}
          {step === 1 && event && (
            <div
              className="rounded-lg p-3 text-xs font-mono overflow-hidden"
              style={{
                background: 'var(--surface-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--page-muted)',
                maxHeight: '80px',
              }}
            >
              <span style={{ color: '#6366f1' }}>EventId</span>:{' '}
              {event.EventId.slice(0, 18)}...
              <br />
              <span style={{ color: '#6366f1' }}>BusinessEventId</span>:{' '}
              {event.BusinessEventId}
              <br />
              <span style={{ color: '#6366f1' }}>ReceiptId</span>:{' '}
              {event.receiptId}
            </div>
          )}

          {/* Step 2 (index 2): architecture diagram */}
          {step === 2 && (
            <ArchitectureDiagram animating={true} currentStep={2} />
          )}

          {/* Step 3 (index 3): receipt summary */}
          {step === 3 && event && (
            <div className="space-y-4">
              {/* Receipt details grid */}
              <div
                className="grid grid-cols-2 gap-3 rounded-xl p-4"
                style={{
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <ReceiptRow label="Transaction ID" value={event.transactionId} mono />
                <ReceiptRow label="Receipt ID" value={event.receiptId} mono />
                <ReceiptRow label="Store" value={`${store.storeName} (${store.storeId})`} />
                <ReceiptRow label="Rep" value={rep.name} />
                <ReceiptRow label="Items" value={`${event.numberOfItems} items (${event.numberOfItemLines} lines)`} />
                <ReceiptRow
                  label="Total Amount"
                  value={formatCurrency(event.paymentAmount)}
                  mono
                />
              </div>

              {/* Commission hero */}
              <div
                className="rounded-xl p-5 text-center"
                style={{
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <p
                  className="text-xs uppercase tracking-widest font-semibold mb-1"
                  style={{ color: 'var(--page-muted)' }}
                >
                  Commission Earned
                </p>
                <p
                  className="text-4xl font-mono font-black animate-commission-pulse"
                  style={{ color: '#22c55e' }}
                >
                  {formatCurrency(commission.totalCommission)}
                </p>
              </div>

              {/* Done button */}
              <button
                onClick={handleDone}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                }}
              >
                Done
              </button>
            </div>
          )}

          {/* Cancel link (visible only while processing) */}
          {step < 3 && (
            <button
              onClick={onCancel}
              className="block mx-auto text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--page-muted)' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Internal sub-component ──────────────────────────────── */

function ReceiptRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-wider font-semibold"
        style={{ color: 'var(--page-muted)' }}
      >
        {label}
      </p>
      <p
        className={`text-sm font-medium mt-0.5 truncate ${mono ? 'font-mono' : ''}`}
        style={{ color: 'var(--page-text)' }}
      >
        {value}
      </p>
    </div>
  );
}
