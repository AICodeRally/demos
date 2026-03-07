'use client';

type Priority = 'critical' | 'high' | 'medium' | 'low';

interface KanbanCard {
  title: string;
  assignee: string;
  priority: Priority;
  due?: string;
  category?: string;
}

interface KanbanColumn {
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
}

const priorityColors: Record<Priority, string> = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#EAB308',
  low: '#059669',
};

const priorityLabels: Record<Priority, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MED',
  low: 'LOW',
};

export function KanbanBoard({ columns }: KanbanBoardProps) {
  if (columns.length === 0) return null;

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col">
          {/* Column header */}
          <div
            className="rounded-t-md px-3 py-2"
            style={{
              borderTop: `3px solid ${col.color}`,
              backgroundColor: '#1A1D23',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[12px] font-semibold uppercase tracking-wider"
                style={{ color: '#F1F5F9' }}
              >
                {col.title}
              </span>
              <span
                className="text-[11px] font-mono"
                style={{ color: '#94A3B8' }}
              >
                {col.cards.length}
              </span>
            </div>
          </div>

          {/* Cards container */}
          <div
            className="flex flex-col gap-2 rounded-b-md p-2"
            style={{
              backgroundColor: '#2A3241',
              minHeight: 100,
            }}
          >
            {col.cards.map((card, cardIdx) => {
              const borderColor = priorityColors[card.priority];

              return (
                <div
                  key={cardIdx}
                  className="rounded-md p-2.5 shadow-sm"
                  style={{
                    backgroundColor: '#1E2530',
                    borderLeft: `3px solid ${borderColor}`,
                  }}
                >
                  {/* Title */}
                  <p
                    className="text-[12px] font-semibold leading-tight"
                    style={{ color: '#F1F5F9' }}
                  >
                    {card.title}
                  </p>

                  {/* Metadata row */}
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {/* Priority indicator */}
                    <span
                      className="inline-flex items-center rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${borderColor}15`,
                        color: borderColor,
                      }}
                    >
                      {priorityLabels[card.priority]}
                    </span>

                    {/* Category tag */}
                    {card.category && (
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px]"
                        style={{
                          backgroundColor: '#334155',
                          color: '#CBD5E1',
                        }}
                      >
                        {card.category}
                      </span>
                    )}
                  </div>

                  {/* Bottom row: assignee + due date */}
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className="text-[10px]"
                      style={{ color: '#CBD5E1' }}
                    >
                      {card.assignee}
                    </span>
                    {card.due && (
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: '#94A3B8' }}
                      >
                        {card.due}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
