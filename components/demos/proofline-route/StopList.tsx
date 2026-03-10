'use client';

import { ROUTE_STOPS, STOP_TYPE_COLORS, STOP_TYPE_LABELS } from '@/data/proofline-route/route-data';

interface StopListProps {
  activeStopIndex: number;
  onStopClick: (index: number) => void;
  completedSuggestions: Record<string, string[]>;
}

export function StopList({ activeStopIndex, onStopClick, completedSuggestions }: StopListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-2 pt-1.5 pb-0.5 flex-shrink-0">
        <h3 className="font-bold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>
          Stops
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain snap-y-mandatory px-1.5 pb-1">
        {ROUTE_STOPS.map((stop, i) => {
          const isActive = i === activeStopIndex;
          const color = STOP_TYPE_COLORS[stop.type];
          const acceptedCount = (completedSuggestions[stop.id] ?? []).length;
          const totalSuggestions = stop.aiSuggestions.length;

          return (
            <button
              key={stop.id}
              onClick={() => onStopClick(i)}
              className="tap-active w-full text-left rounded-lg p-2 mb-1 transition-all duration-300 snap-start"
              style={{
                background: isActive ? 'var(--pl-gold-bg)' : 'var(--pl-surface)',
                border: isActive
                  ? '1px solid rgba(198, 160, 82, 0.4)'
                  : '1px solid var(--pl-surface-border)',
                minHeight: 44,
              }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-black"
                  style={{
                    fontSize: '0.8em',
                    background: isActive ? '#C6A052' : `${color}20`,
                    color: isActive ? '#0a0f1e' : color,
                  }}
                >
                  {stop.sequence}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--pl-text)', fontSize: '0.9em' }}>
                    {stop.accountName}
                  </p>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="font-bold uppercase tracking-wider px-1 py-0.5 rounded"
                      style={{ fontSize: '0.65em', background: `${color}15`, color }}
                    >
                      {STOP_TYPE_LABELS[stop.type]}
                    </span>
                    <span style={{ color: 'var(--pl-text-muted)', fontSize: '0.75em' }}>
                      {stop.arrivalTime}
                    </span>
                  </div>

                  {totalSuggestions > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span style={{ color: 'var(--pl-gold)', fontSize: '0.7em' }}>
                        {acceptedCount > 0
                          ? `${acceptedCount}/${totalSuggestions} accepted`
                          : `${totalSuggestions} suggestion${totalSuggestions > 1 ? 's' : ''}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
