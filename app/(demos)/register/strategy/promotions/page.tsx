'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { SPIFF_CALENDAR } from '@/data/register/comp-data';
import { Megaphone, TrendingUp, Calendar } from 'lucide-react';

const PAST_ROI = [
  { name: 'New Year Mattress Push', spend: '$42K', incremental: '$186K', roi: '4.4x', roiColor: '#10B981' },
  { name: "Presidents' Day Sale SPIFF", spend: '$38K', incremental: '$210K', roi: '5.5x', roiColor: '#10B981' },
];

const UPCOMING = [
  { name: 'Spring Clearance Bonus', month: 'April', product: 'Outlet Inventory', bonus: '2x commission', projectedROI: '3.8x', color: '#8B5CF6' },
  { name: 'Memorial Day Weekend', month: 'May', product: 'All Products', bonus: '$10/unit + team pool', projectedROI: '4.2x', color: '#06B6D4' },
  { name: 'Summer Sleep Challenge', month: 'June', product: 'Cooling Products', bonus: '$20/unit', projectedROI: '3.5x', color: '#10B981' },
];

export default function PromotionCalendar() {
  const insight = getInsight('strategy/promotions');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <RegisterPage title="Promotion Calendar" subtitle="SPIFF & Incentive Programs" accentColor="#06B6D4">
      {/* Timeline View */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Calendar size={16} color="#06B6D4" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            FY26 SPIFF Timeline
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPIFF_CALENDAR.map((s, idx) => {
            const isPast = !s.active && new Date(s.endDate) < new Date('2026-03-13');
            const isFuture = !s.active && !isPast;
            let borderStyle: string;
            let bgStyle: string;
            let opacity = 1;

            if (s.active) {
              borderStyle = '2px solid #10B981';
              bgStyle = 'rgba(16, 185, 129, 0.06)';
            } else if (isPast) {
              borderStyle = '1px solid var(--register-border)';
              bgStyle = 'var(--register-bg-surface)';
              opacity = 0.5;
            } else {
              borderStyle = '1px dashed #06B6D4';
              bgStyle = 'var(--register-bg-surface)';
            }

            return (
              <div
                key={s.name}
                style={{
                  background: bgStyle,
                  border: borderStyle,
                  borderRadius: 10,
                  padding: '12px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: mounted ? opacity : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.1 + idx * 0.05}s`,
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
                        animation: 'register-promo-pulse 2s ease-in-out infinite',
                      }}>
                        Active
                      </span>
                    )}
                    {isFuture && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', textTransform: 'uppercase' }}>
                        Upcoming
                      </span>
                    )}
                    {isPast && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--register-bg-surface)', color: 'var(--register-text-dim)', textTransform: 'uppercase' }}>
                        Completed
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                    {s.product} &middot; {s.bonus}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {s.startDate.slice(5)} &mdash; {s.endDate.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Promotion ROI */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.25s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <TrendingUp size={16} color="#10B981" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Past Promotion ROI</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PAST_ROI.map((r, i) => (
            <div
              key={r.name}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                borderLeft: '4px solid #10B981',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${0.35 + i * 0.08}s`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{r.name}</div>
                <div className="flex items-center gap-4" style={{ marginTop: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>
                    Spend: <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{r.spend}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>
                    Incremental: <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{r.incremental}</span>
                  </span>
                </div>
              </div>
              <div style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 10,
                padding: '8px 16px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: r.roiColor }}>{r.roi}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ROI</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Promotions */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.4s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Megaphone size={16} color="#06B6D4" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Upcoming Promotions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPCOMING.map((u, i) => (
            <div
              key={u.name}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '18px 18px',
                borderLeft: `4px solid ${u.color}`,
                position: 'relative',
                overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.5 + i * 0.1}s`,
              }}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 60, height: 60,
                background: `radial-gradient(circle at top right, ${u.color}10, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{u.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 4 }}>
                {u.month} &middot; {u.product}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                Bonus: <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{u.bonus}</span>
              </div>
              <div style={{
                marginTop: 12,
                padding: '6px 12px',
                background: `${u.color}08`,
                border: `1px solid ${u.color}20`,
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <TrendingUp size={12} color={u.color} />
                <span style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)' }}>Projected ROI: </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981' }}>{u.projectedROI}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}

      <style>{`
        @keyframes register-promo-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </RegisterPage>
  );
}
