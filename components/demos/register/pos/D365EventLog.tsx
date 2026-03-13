'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Server } from 'lucide-react';
import type { D365TransactionEvent } from '@/data/register/d365-schemas';

interface D365EventLogProps {
  events: D365TransactionEvent[];
}

export function D365EventLog({ events }: D365EventLogProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (events.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Server size={24} style={{ color: 'var(--register-text-dim)', margin: '0 auto 8px' }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)', margin: 0 }}>
          No D365 events yet. Close a sale to generate.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 300, padding: '8px 0' }}>
      {events.map((event) => {
        const isOpen = expanded === event.transactionId;
        return (
          <div
            key={event.transactionId}
            style={{
              borderRadius: 8,
              border: '1px solid var(--register-border)',
              background: 'var(--register-bg-surface)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : event.transactionId)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              {isOpen ? (
                <ChevronDown size={14} style={{ color: 'var(--register-text-muted)', flexShrink: 0 }} />
              ) : (
                <ChevronRight size={14} style={{ color: 'var(--register-text-muted)', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--register-accent)' }}>
                    {event.transactionId}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)' }}>
                    {event.transTime}
                  </span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                  {event.numberOfItems} items &middot; ${event.paymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span
                style={{
                  padding: '2px 6px', borderRadius: 4, fontSize: '0.55rem', fontWeight: 700,
                  background: 'rgba(16,185,129,0.1)', color: '#10B981',
                }}
              >
                POSTED
              </span>
            </button>

            {isOpen && (
              <div style={{ padding: '0 12px 10px', borderTop: '1px solid var(--register-border)' }}>
                <pre
                  style={{
                    fontSize: '0.55rem',
                    fontFamily: 'monospace',
                    color: 'var(--register-text-muted)',
                    background: 'var(--register-bg)',
                    borderRadius: 6,
                    padding: 10,
                    margin: '8px 0 0',
                    overflowX: 'auto',
                    maxHeight: 200,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {JSON.stringify(event, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
