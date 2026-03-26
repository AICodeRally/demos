'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { SPIFF_CALENDAR } from '@/data/register/comp-data';
import { HeatMap } from '@/components/demos/register/HeatMap';
import { Calendar, TrendingUp, Grid3X3 } from 'lucide-react';

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

/* ── Department × Month Heatmap Data ──────────────────── */
const DEPT_ROWS = ['King Premium', 'Queen Value', 'Adjustable Bases', 'Kids & Twin', 'Accessories', 'Outlet Corner'];
const DEPT_COLS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEPT_HEATMAP = [
  // King Premium — spikes on holidays, steady mid-range
  [55, 78, 62, 58, 82, 60, 65, 52, 75, 55, 95, 70],
  // Queen Value — steady performer, slight summer dip
  [60, 70, 65, 62, 72, 55, 52, 48, 68, 58, 80, 65],
  // Adjustable Bases — growing category, strong Q4
  [35, 45, 42, 38, 55, 40, 45, 38, 52, 42, 72, 55],
  // Kids & Twin — back-to-school spike, holiday bump
  [30, 25, 28, 22, 35, 40, 55, 78, 65, 35, 50, 42],
  // Accessories — follows mattress trends with lag
  [42, 55, 48, 45, 60, 45, 48, 40, 58, 45, 75, 55],
  // Outlet Corner — inverse premium pattern, strong clearance months
  [68, 45, 55, 70, 40, 72, 65, 75, 42, 68, 35, 85],
];

export default function SeasonalStrategy() {
  const insight = getInsight('corp/seasonal');
  const maxIndex = Math.max(...MONTHLY_INDEX.map((m) => m.index));
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <RegisterPage title="Seasonal Strategy" subtitle="Revenue Patterns & SPIFF Timing" accentColor="#1E3A5F">
      {/* Monthly Revenue Index */}
      <div className="register-section" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Calendar size={16} color="#1E3A5F" />
          <h2 className="register-section-header" style={{ marginBottom: 0 }}>
            Monthly Revenue Index (100 = average)
          </h2>
        </div>
        {/* 100 baseline */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: `${160 - (100 / maxIndex) * 140 - 6}px`,
            left: 0, right: 0,
            height: 1,
            borderTop: '1px dashed var(--register-text-dim)',
            opacity: 0.3,
            pointerEvents: 'none',
          }}>
            <span style={{ position: 'absolute', right: 0, top: -8, fontSize: '0.7rem', color: 'var(--register-text-dim)' }}>avg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
            {MONTHLY_INDEX.map((m, i) => {
              const barH = (m.index / maxIndex) * 140;
              const isHigh = m.index >= 100;
              return (
                <div
                  key={m.month}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    transitionDelay: `${0.1 + i * 0.04}s`,
                  }}
                >
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: isHigh ? '#10B981' : 'var(--register-text-muted)',
                  }}>
                    {m.index}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: mounted ? barH : 0,
                      borderRadius: '4px 4px 0 0',
                      background: isHigh
                        ? `linear-gradient(180deg, #1E3A5F, #1E3A5FCC)`
                        : 'var(--register-bg-surface)',
                      border: isHigh ? 'none' : '1px solid var(--register-border)',
                      transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: `${0.2 + i * 0.05}s`,
                      boxShadow: isHigh ? '0 -2px 8px rgba(30, 58, 95, 0.2)' : 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', fontWeight: isHigh ? 600 : 400 }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holiday Impact Callouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {HOLIDAYS.map((h, i) => (
          <div
            key={h.name}
            className="register-card"
            style={{
              borderTop: `3px solid ${h.color}`,
              padding: '18px 18px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${0.4 + i * 0.08}s`,
            }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 50, height: 50,
              background: `radial-gradient(circle at top right, ${h.color}15, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <TrendingUp size={14} color="#10B981" style={{ margin: '0 auto 6px' }} />
            <div className="register-kpi-value" style={{ color: '#10B981' }}>{h.lift}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginTop: 4 }}>{h.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{h.month} traffic spike</div>
          </div>
        ))}
      </div>

      {/* Department × Month Revenue Heatmap */}
      <div className="register-section" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.5s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Grid3X3 size={16} color="#8B5CF6" />
          <h2 className="register-section-header" style={{ marginBottom: 0 }}>
            Revenue Intensity by Department
          </h2>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--register-text-muted)' }}>
          Index 0–100 showing relative sales volume per department per month. Brighter = higher volume.
        </p>
        <HeatMap
          rows={DEPT_ROWS}
          cols={DEPT_COLS}
          data={DEPT_HEATMAP}
          colorScale={{ low: '#1E293B', mid: '#1E3A5F', high: '#06B6D4' }}
        />
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 10, borderRadius: 2, background: '#1E293B' }} />
            <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 10, borderRadius: 2, background: '#1E3A5F' }} />
            <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 10, borderRadius: 2, background: '#06B6D4' }} />
            <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>High</span>
          </div>
        </div>
      </div>

      {/* SPIFF Calendar Timeline */}
      <div className="register-section" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.5s',
      }}>
        <h2 className="register-section-header">
          SPIFF Calendar
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPIFF_CALENDAR.map((s, idx) => {
            const isPast = !s.active && new Date(s.endDate) < new Date('2026-03-13');
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
                  opacity: mounted ? opacity : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.6 + idx * 0.05}s`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Active glow stripe */}
                {s.active && (
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                    background: 'linear-gradient(180deg, #10B981, #06B6D4)',
                    borderRadius: '10px 0 0 10px',
                  }} />
                )}
                <div style={{ marginLeft: s.active ? 8 : 0 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</span>
                    {s.active && (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: '#10B981', color: '#fff', textTransform: 'uppercase',
                        animation: 'register-pulse 2s ease-in-out infinite',
                      }}>
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

      <style>{`
        @keyframes register-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </RegisterPage>
  );
}
