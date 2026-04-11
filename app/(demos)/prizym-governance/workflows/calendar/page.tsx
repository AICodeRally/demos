'use client';

import { useState, useMemo } from 'react';
import { CALENDAR_EVENTS, type CalendarEvent } from '@/data/prizym-governance/operate';
import { Calendar as CalIcon, Users, Clock, MapPin, Gavel, GraduationCap, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

const CATEGORY_CONFIG: Record<CalendarEvent['category'], { color: string; icon: typeof CalIcon; label: string }> = {
  committee: { color: 'var(--pg-info-bright)', icon: Users, label: 'Committee' },
  approval: { color: 'var(--pg-warning-bright)', icon: Gavel, label: 'Approval' },
  review: { color: 'var(--pg-cyan-bright)', icon: CalIcon, label: 'Review' },
  training: { color: 'var(--pg-oversee-bright)', icon: GraduationCap, label: 'Training' },
  deadline: { color: 'var(--pg-danger-bright)', icon: AlertCircle, label: 'Deadline' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TODAY = new Date('2026-04-10T12:00:00Z');

function sameDay(a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

function parseEventDate(dateStr: string): Date {
  return new Date(dateStr + 'T12:00:00Z');
}

export default function CalendarPage() {
  // Default view: April 2026 (where seed events live)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(3); // April (0-indexed)
  const [filter, setFilter] = useState<CalendarEvent['category'] | 'all'>('all');
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? CALENDAR_EVENTS : CALENDAR_EVENTS.filter(e => e.category === filter)),
    [filter]
  );

  // Grid math — first visible day = Sunday of the week containing day 1
  const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const firstWeekday = firstOfMonth.getUTCDay(); // 0 = Sun
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - firstWeekday;
    const cellDate = new Date(Date.UTC(viewYear, viewMonth, 1 + dayOffset));
    cells.push({ date: cellDate, inMonth: cellDate.getUTCMonth() === viewMonth });
  }

  const eventsForDate = (d: Date) => filtered.filter(e => sameDay(parseEventDate(e.date), d));

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const goToday = () => {
    setViewYear(TODAY.getUTCFullYear());
    setViewMonth(TODAY.getUTCMonth());
  };

  const filters: Array<CalendarEvent['category'] | 'all'> = ['all', 'committee', 'approval', 'review', 'training', 'deadline'];
  const visibleEventCount = filtered.filter(e => {
    const d = parseEventDate(e.date);
    return d.getUTCFullYear() === viewYear && d.getUTCMonth() === viewMonth;
  }).length;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Governance Calendar
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Committee meetings, approvals, reviews, training, and deadlines.
        </p>
      </div>

      {/* Month header + filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={prevMonth}
            className="pg-icon-bubble"
            style={{ cursor: 'pointer', borderColor: 'var(--pg-cyan-bright)' }}
            aria-label="Previous month"
          >
            <ChevronLeft size={20} color="var(--pg-cyan-bright)" strokeWidth={2.6} />
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', minWidth: 220, textAlign: 'center', margin: 0 }}>
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <button
            onClick={nextMonth}
            className="pg-icon-bubble"
            style={{ cursor: 'pointer', borderColor: 'var(--pg-cyan-bright)' }}
            aria-label="Next month"
          >
            <ChevronRight size={20} color="var(--pg-cyan-bright)" strokeWidth={2.6} />
          </button>
          <button
            onClick={goToday}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.28)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginLeft: 4,
            }}
          >
            Today
          </button>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: 14, color: '#f1f5f9', fontWeight: 700 }}>
          {visibleEventCount} event{visibleEventCount !== 1 ? 's' : ''} this month
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {filters.map(f => {
          const active = filter === f;
          const count = f === 'all' ? CALENDAR_EVENTS.length : CALENDAR_EVENTS.filter(e => e.category === f).length;
          const color = f === 'all' ? 'var(--pg-cyan-bright)' : CATEGORY_CONFIG[f].color;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                border: active ? `1.5px solid ${color}` : '1px solid rgba(255,255,255,0.2)',
                color: active ? color : '#ffffff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Weekday header */}
      <div className="pg-card-elevated" style={{ padding: 14, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
          {WEEKDAYS.map((d) => (
            <div key={d} style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center', padding: '6px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(0, 1fr)', gap: 6, flex: 1, minHeight: 0 }}>
          {cells.map((cell, i) => {
            const dayEvents = eventsForDate(cell.date);
            const isToday = sameDay(cell.date, TODAY);
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: cell.inMonth ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isToday ? '2px solid var(--pg-cyan-bright)' : '1px solid rgba(255,255,255,0.14)',
                  opacity: cell.inMonth ? 1 : 0.4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  fontSize: isToday ? 16 : 14,
                  fontWeight: isToday ? 800 : 700,
                  color: isToday ? 'var(--pg-cyan-bright)' : cell.inMonth ? '#ffffff' : '#e2e8f0',
                  lineHeight: 1,
                }}>
                  {cell.date.getUTCDate()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  {dayEvents.slice(0, 3).map((ev) => {
                    const cfg = CATEGORY_CONFIG[ev.category];
                    const EIcon = cfg.icon;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelected(ev)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '4px 6px',
                          borderRadius: 6,
                          background: 'rgba(0,0,0,0.28)',
                          border: `1px solid ${cfg.color}`,
                          color: cfg.color,
                          fontSize: 12,
                          fontWeight: 700,
                          textAlign: 'left',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}
                        title={ev.title}
                      >
                        <EIcon size={11} strokeWidth={2.6} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
                      </button>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: 11, color: '#f1f5f9', fontWeight: 700, padding: '2px 6px' }}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            style={{
              width: 'min(520px, 92vw)',
              padding: '28px 32px',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(24px) saturate(150%)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderTop: `4px solid ${CATEGORY_CONFIG[selected.category].color}`,
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(15,23,42,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="pg-icon-bubble" style={{ borderColor: CATEGORY_CONFIG[selected.category].color }}>
                  {(() => {
                    const EIcon = CATEGORY_CONFIG[selected.category].icon;
                    return <EIcon size={19} color={CATEGORY_CONFIG[selected.category].color} strokeWidth={2.4} />;
                  })()}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: CATEGORY_CONFIG[selected.category].color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {CATEGORY_CONFIG[selected.category].label}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="pg-icon-bubble" style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: 14 }}>{selected.title}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 15, color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CalIcon size={16} color="#f1f5f9" strokeWidth={2.4} />
                {parseEventDate(selected.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} color="#f1f5f9" strokeWidth={2.4} />
                {selected.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={16} color="#f1f5f9" strokeWidth={2.4} />
                {selected.location}
              </div>
              {selected.attendees > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Users size={16} color="#f1f5f9" strokeWidth={2.4} />
                  {selected.attendees} attendees
                  {selected.committee && <span style={{ color: '#f1f5f9' }}>· {selected.committee}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
