'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { SPIFF_CALENDAR } from '@/data/register/comp-data';

const MONTHLY_INDEX = [
  { month: 'Jan', index: 72 },
  { month: 'Feb', index: 95 },
  { month: 'Mar', index: 88 },
  { month: 'Apr', index: 82 },
  { month: 'May', index: 110 },
  { month: 'Jun', index: 85 },
  { month: 'Jul', index: 90 },
  { month: 'Aug', index: 78 },
  { month: 'Sep', index: 105 },
  { month: 'Oct', index: 80 },
  { month: 'Nov', index: 135 },
  { month: 'Dec', index: 98 },
];

const HOLIDAYS = [
  { name: "Presidents' Day", lift: '+22%', month: 'Feb', color: '#1E3A5F' },
  { name: 'Memorial Day', lift: '+18%', month: 'May', color: '#06B6D4' },
  { name: 'Labor Day', lift: '+15%', month: 'Sep', color: '#8B5CF6' },
  { name: 'Black Friday', lift: '+35%', month: 'Nov', color: '#10B981' },
];

export default function SeasonalStrategy() {
  const insight = getInsight('corp/seasonal');
  const maxIndex = Math.max(...MONTHLY_INDEX.map((m) => m.index));

  return (
    <RegisterPage title="Seasonal Strategy" subtitle="Revenue Patterns & SPIFF Timing" accentColor="#1E3A5F">
      {/* Monthly Revenue Index */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Monthly Revenue Index (100 = average)
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
          {MONTHLY_INDEX.map((m) => {
            const barH = (m.index / maxIndex) * 140;
            const isHigh = m.index >= 100;
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isHigh ? '#10B981' : 'var(--register-text-muted)' }}>
                  {m.index}
                </span>
                <div
                  style={{
                    width: '100%',
                    height: barH,
                    borderRadius: '4px 4px 0 0',
                    background: isHigh ? '#1E3A5F' : 'var(--register-bg-surface)',
                    border: isHigh ? 'none' : '1px solid var(--register-border)',
                    transition: 'height 0.3s ease',
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holiday Impact Callouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {HOLIDAYS.map((h) => (
          <div
            key={h.name}
            style={{
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              borderTop: `3px solid ${h.color}`,
              borderRadius: 10,
              padding: '16px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{h.lift}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginTop: 4 }}>{h.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{h.month} traffic spike</div>
          </div>
        ))}
      </div>

      {/* SPIFF Calendar Timeline */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          SPIFF Calendar
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPIFF_CALENDAR.map((s) => {
            const isPast = !s.active && new Date(s.endDate) < new Date('2026-03-13');
            const borderColor = s.active ? '#10B981' : isPast ? 'var(--register-border)' : '#06B6D4';
            const opacity = isPast ? 0.5 : 1;
            return (
              <div
                key={s.name}
                style={{
                  background: s.active ? 'rgba(16, 185, 129, 0.06)' : 'var(--register-bg-surface)',
                  border: s.active ? '2px solid #10B981' : isPast ? '1px solid var(--register-border)' : '1px dashed #06B6D4',
                  borderRadius: 10,
                  padding: '12px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</span>
                    {s.active && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#10B981', color: '#fff', textTransform: 'uppercase' }}>
                        Active
                      </span>
                    )}
                    {!s.active && !isPast && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', textTransform: 'uppercase' }}>
                        Upcoming
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                    {s.product} &middot; {s.bonus}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {s.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
