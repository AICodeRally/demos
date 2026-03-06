'use client';

import { PrivilegeBadge } from './PrivilegeBadge';

type EventType = 'legal' | 'cyber' | 'media' | 'regulatory' | 'internal';

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: EventType;
  privileged?: boolean;
}

interface CrisisTimelineProps {
  events: TimelineEvent[];
}

const typeColors: Record<EventType, string> = {
  legal: '#7C3AED',
  cyber: '#2563EB',
  media: '#EA580C',
  regulatory: '#DC2626',
  internal: '#78716C',
};

const typeLabels: Record<EventType, string> = {
  legal: 'Legal',
  cyber: 'Cyber',
  media: 'Media',
  regulatory: 'Regulatory',
  internal: 'Internal',
};

export function CrisisTimeline({ events }: CrisisTimelineProps) {
  if (events.length === 0) return null;

  return (
    <div className="relative flex flex-col">
      {events.map((event, i) => {
        const color = typeColors[event.type];
        const isLast = i === events.length - 1;

        return (
          <div key={i} className="flex gap-4" style={{ minHeight: 72 }}>
            {/* Left: time */}
            <div
              className="w-[72px] shrink-0 pt-[2px] text-right"
            >
              <span
                className="text-[11px] font-mono leading-tight"
                style={{ color: '#57534E' }}
              >
                {event.time}
              </span>
            </div>

            {/* Center: line + node */}
            <div className="relative flex flex-col items-center w-[24px] shrink-0">
              {/* Node circle */}
              <div
                className="z-10 flex items-center justify-center rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: color,
                  marginTop: 2,
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>

              {/* Vertical line (skip for last item) */}
              {!isLast && (
                <div
                  className="flex-1"
                  style={{
                    width: 2,
                    backgroundColor: '#E7E5E4',
                    marginTop: 2,
                  }}
                />
              )}
            </div>

            {/* Right: content */}
            <div className="flex-1 pb-5 pt-[1px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[13px] font-semibold leading-tight"
                  style={{ color: '#1C1917' }}
                >
                  {event.title}
                </span>

                {/* Type tag */}
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: `${color}18`,
                    color: color,
                  }}
                >
                  {typeLabels[event.type]}
                </span>

                {event.privileged && <PrivilegeBadge size="sm" />}
              </div>

              <p
                className="mt-1 text-[12px] leading-relaxed"
                style={{ color: '#57534E' }}
              >
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
