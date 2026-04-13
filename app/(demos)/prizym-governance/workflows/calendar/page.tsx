'use client';

import { useState, useMemo } from 'react';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { CALENDAR_EVENTS, type CalendarEvent } from '@/data/prizym-governance/operate';
import { Calendar as CalIcon, Users, Clock, MapPin, Gavel, GraduationCap, AlertCircle, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

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

type NewEventDraft = {
  title: string;
  date: string;
  time: string;
  category: CalendarEvent['category'];
  attendees: string;
  location: string;
  committee: string;
};

function emptyDraft(date: string): NewEventDraft {
  return { title: '', date, time: '10:00 AM', category: 'committee', attendees: '5', location: 'Conference Room A', committee: '' };
}

export default function CalendarPage() {
  // Default view: April 2026 (where seed events live)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(3); // April (0-indexed)
  const [filter, setFilter] = useState<CalendarEvent['category'] | 'all'>('all');
  const [events, setEvents] = useState<CalendarEvent[]>(() => [...CALENDAR_EVENTS]);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [draft, setDraft] = useState<NewEventDraft | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? events : events.filter(e => e.category === filter)),
    [events, filter]
  );

  function openCreate(dateStr?: string) {
    const defaultDate = dateStr ?? new Date(Date.UTC(viewYear, viewMonth, 15)).toISOString().slice(0, 10);
    setDraft(emptyDraft(defaultDate));
  }

  function saveDraft() {
    if (!draft) return;
    if (!draft.title.trim() || !draft.date || !draft.time.trim() || !draft.location.trim()) {
      showDemoToast('Title, date, time, and location are required', 'warning');
      return;
    }
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now().toString(36)}`,
      title: draft.title.trim(),
      date: draft.date,
      time: draft.time.trim(),
      category: draft.category,
      attendees: Number(draft.attendees) || 0,
      location: draft.location.trim(),
      ...(draft.committee.trim() ? { committee: draft.committee.trim() } : {}),
    };
    setEvents(prev => [...prev, newEvent]);
    const d = parseEventDate(newEvent.date);
    setViewYear(d.getUTCFullYear());
    setViewMonth(d.getUTCMonth());
    setDraft(null);
    showDemoToast(`"${newEvent.title}" added to calendar`, 'success');
  }

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

  const allEventCount = events.length;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
            Governance Calendar
          </h1>
          <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
            Committee meetings, approvals, reviews, training, and deadlines.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 22px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 12, color: '#ffffff',
            fontSize: 15, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={18} strokeWidth={2.6} /> New Event
        </button>
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
          const count = f === 'all' ? allEventCount : events.filter(e => e.category === f).length;
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

      {draft && (
        <div
          onClick={() => setDraft(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="pg-scroll"
            style={{
              width: 'min(640px, 96vw)',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(24px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(15,23,42,0.5)',
              padding: '30px 36px 32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>New Event</div>
                <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>{draft.title || 'Untitled Event'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="pg-icon-bubble"
                style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
                aria-label="Close"
              >
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>

            {(() => {
              const labelStyle: React.CSSProperties = {
                display: 'block', fontSize: 13, fontWeight: 800, color: '#f1f5f9',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
              };
              const inputStyle: React.CSSProperties = {
                width: '100%', padding: '11px 14px',
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                borderRadius: 10, color: '#ffffff',
                fontSize: 15, fontWeight: 600, outline: 'none', fontFamily: 'inherit',
              };
              return (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Title *</label>
                    <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Q2 SGCC Meeting" style={inputStyle} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Date *</label>
                      <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} style={{ ...inputStyle, colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Time *</label>
                      <input type="text" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} placeholder="10:00 AM" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as CalendarEvent['category'] })} style={inputStyle}>
                        <option value="committee" style={{ background: '#0f172a' }}>Committee</option>
                        <option value="approval" style={{ background: '#0f172a' }}>Approval</option>
                        <option value="review" style={{ background: '#0f172a' }}>Review</option>
                        <option value="training" style={{ background: '#0f172a' }}>Training</option>
                        <option value="deadline" style={{ background: '#0f172a' }}>Deadline</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Attendees</label>
                      <input type="number" min="0" value={draft.attendees} onChange={(e) => setDraft({ ...draft, attendees: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Location *</label>
                    <input type="text" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="e.g. Conference Room A, Zoom, Chicago HQ" style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: 22 }}>
                    <label style={labelStyle}>Committee (optional)</label>
                    <input type="text" value={draft.committee} onChange={(e) => setDraft({ ...draft, committee: e.target.value })} placeholder="e.g. SGCC, CRB" style={inputStyle} />
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setDraft(null)} style={{ padding: '11px 22px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.24)', borderRadius: 10, color: '#ffffff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button type="button" onClick={saveDraft} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, color: '#ffffff', fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
                      <Plus size={16} strokeWidth={2.8} /> Create Event
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
