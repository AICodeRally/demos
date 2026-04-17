'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { D365TransactionEvent } from '@/lib/swic/data/d365-schemas';

interface D365EventLogProps {
  events: D365TransactionEvent[];
  className?: string;
}

export function D365EventLog({ events, className = '' }: D365EventLogProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all duration-200 ${className}`}
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color: 'var(--page-text)' }}
      >
        <span>
          D365 Event Log{' '}
          <span
            className="text-xs font-normal ml-1 px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--glass-bg-strong)',
              color: 'var(--page-muted)',
            }}
          >
            {events.length} event{events.length !== 1 ? 's' : ''}
          </span>
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4" style={{ color: 'var(--page-muted)' }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--page-muted)' }} />
        )}
      </button>

      {/* Event list */}
      {expanded && (
        <div
          className="border-t overflow-y-auto space-y-3 px-4 py-3"
          style={{
            borderColor: 'var(--glass-border)',
            maxHeight: '400px',
          }}
        >
          {events.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color: 'var(--page-muted)' }}>
              No events yet. Close a sale to generate a D365 transaction event.
            </p>
          )}
          {/* Most recent first */}
          {[...events].reverse().map((event) => (
            <div key={event.EventId} className="rounded-lg overflow-hidden"
              style={{
                border: '1px solid var(--glass-border)',
              }}
            >
              {/* Event header */}
              <div
                className="px-3 py-2 text-xs font-medium flex items-center justify-between"
                style={{
                  background: 'var(--glass-bg-strong)',
                  color: 'var(--page-text)',
                }}
              >
                <span>Transaction {event.receiptId}</span>
                <span style={{ color: 'var(--page-muted)' }}>
                  {formatEventTime(event.EventTime)}
                </span>
              </div>

              {/* JSON body */}
              <pre
                className="px-3 py-2 overflow-x-auto text-[11px] leading-relaxed font-mono"
                style={{
                  background: 'var(--surface-bg)',
                  color: 'var(--page-text)',
                  margin: 0,
                }}
              >
                <code>{JSON.stringify(event, null, 2)}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatEventTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return iso;
  }
}
