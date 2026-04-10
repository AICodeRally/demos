'use client';

import { useState, useEffect } from 'react';
import { CALENDAR_EVENTS, type CalendarEvent } from '@/data/prizym-governance/operate';
import { Calendar as CalIcon, Users, Clock, MapPin, Gavel, GraduationCap, AlertCircle } from 'lucide-react';

const CATEGORY_CONFIG: Record<CalendarEvent['category'], { color: string; icon: typeof CalIcon; label: string }> = {
  committee: { color: 'var(--pg-info-bright)', icon: Users, label: 'Committee' },
  approval: { color: 'var(--pg-warning-bright)', icon: Gavel, label: 'Approval' },
  review: { color: 'var(--pg-cyan-bright)', icon: CalIcon, label: 'Review' },
  training: { color: 'var(--pg-oversee-bright)', icon: GraduationCap, label: 'Training' },
  deadline: { color: 'var(--pg-danger-bright)', icon: AlertCircle, label: 'Deadline' },
};

function groupByDate(events: CalendarEvent[]) {
  const groups = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    if (!groups.has(e.date)) groups.set(e.date, []);
    groups.get(e.date)!.push(e);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function formatDate(date: string) {
  const d = new Date(date + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function CalendarPage() {
  const [filter, setFilter] = useState<CalendarEvent['category'] | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = filter === 'all' ? CALENDAR_EVENTS : CALENDAR_EVENTS.filter(e => e.category === filter);
  const grouped = groupByDate(filtered);

  const filters: Array<CalendarEvent['category'] | 'all'> = ['all', 'committee', 'approval', 'review', 'training', 'deadline'];

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

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {filters.map(f => {
          const active = filter === f;
          const count = f === 'all' ? CALENDAR_EVENTS.length : CALENDAR_EVENTS.filter(e => e.category === f).length;
          const color = f === 'all' ? 'var(--pg-info-bright)' : CATEGORY_CONFIG[f].color;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                border: active ? `1.5px solid ${color}` : '1px solid rgba(255,255,255,0.2)',
                color: active ? color : '#ffffff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 22, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {grouped.map(([date, events], gi) => (
          <div key={date} style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.4s ease', transitionDelay: `${gi * 0.06}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{
                minWidth: 68, padding: '12px 14px', borderRadius: 10,
                background: 'linear-gradient(135deg, var(--pg-operate-bright), var(--pg-cyan-bright))',
                color: '#0f172a', textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>
                  {new Date(date + 'T12:00:00Z').getUTCDate()}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 2 }}>{formatDate(date)}</h3>
                <p style={{ fontSize: 14, color: '#f1f5f9' }}>{events.length} event{events.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10, marginLeft: 82 }}>
              {events.map(e => {
                const config = CATEGORY_CONFIG[e.category];
                const Icon = config.icon;
                return (
                  <div
                    key={e.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                      borderLeft: `4px solid ${config.color}`,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: config.color }}>
                        <Icon size={15} color={config.color} strokeWidth={2.4} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{config.label}</span>
                          {e.committee && <span style={{ fontSize: 13, color: '#f1f5f9' }}>· {e.committee}</span>}
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 5, lineHeight: 1.3 }}>{e.title}</p>
                        <div style={{ display: 'flex', gap: 12, fontSize: 14, color: '#ffffff', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={13} strokeWidth={2.4} /> {e.time}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={13} strokeWidth={2.4} /> {e.location}</span>
                          {e.attendees > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={13} strokeWidth={2.4} /> {e.attendees}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
