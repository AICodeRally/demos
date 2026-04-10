'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { CALENDAR_EVENTS, type CalendarEvent } from '@/data/prizym-governance/operate';
import { Calendar as CalIcon, Users, Clock, MapPin, Gavel, GraduationCap, AlertCircle } from 'lucide-react';

const CATEGORY_CONFIG: Record<CalendarEvent['category'], { color: string; icon: typeof CalIcon; label: string }> = {
  committee: { color: '#3b82f6', icon: Users, label: 'Committee' },
  approval: { color: '#f59e0b', icon: Gavel, label: 'Approval' },
  review: { color: '#06b6d4', icon: CalIcon, label: 'Review' },
  training: { color: '#8b5cf6', icon: GraduationCap, label: 'Training' },
  deadline: { color: '#ef4444', icon: AlertCircle, label: 'Deadline' },
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
    <PrizymPage title="Governance Calendar" subtitle="Committee meetings, approvals, reviews, training, and deadlines" mode="operate">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {filters.map(f => {
          const active = filter === f;
          const count = f === 'all' ? CALENDAR_EVENTS.length : CALENDAR_EVENTS.filter(e => e.category === f).length;
          const color = f === 'all' ? '#3b82f6' : CATEGORY_CONFIG[f].color;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                background: active ? `${color}20` : 'var(--pg-stripe)',
                border: active ? `1px solid ${color}60` : '1px solid var(--pg-border)',
                color: active ? color : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {grouped.map(([date, events], gi) => (
          <div key={date} style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.4s ease', transitionDelay: `${gi * 0.08}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{
                minWidth: 60, padding: '10px 12px', borderRadius: 8,
                background: 'linear-gradient(135deg, var(--pg-operate), var(--pg-cyan))',
                color: '#fff', textAlign: 'center',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
                  {new Date(date + 'T12:00:00Z').getUTCDate()}
                </div>
              </div>
              <div>
                <h3 className="pg-subheading" style={{ marginBottom: 2 }}>{formatDate(date)}</h3>
                <p className="pg-caption">{events.length} event{events.length > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12, marginLeft: 72 }}>
              {events.map(e => {
                const config = CATEGORY_CONFIG[e.category];
                const Icon = config.icon;
                return (
                  <div key={e.id} className="pg-card" style={{ borderLeft: `3px solid ${config.color}` }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: `${config.color}18`, border: `1px solid ${config.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={16} style={{ color: config.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{config.label}</span>
                          {e.committee && <span style={{ fontSize: 14, color: 'var(--pg-text-muted)' }}>· {e.committee}</span>}
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginBottom: 6, lineHeight: 1.3 }}>{e.title}</p>
                        <div style={{ display: 'flex', gap: 12, fontSize: 14, color: 'var(--pg-text-muted)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {e.time}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {e.location}</span>
                          {e.attendees > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={10} /> {e.attendees}</span>}
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
    </PrizymPage>
  );
}
