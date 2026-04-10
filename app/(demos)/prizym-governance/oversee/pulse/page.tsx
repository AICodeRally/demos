'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { PULSE_SIGNALS, type PulseSignal } from '@/data/prizym-governance/oversee';
import { TrendingUp, TrendingDown, Minus, Activity, Heart, AlertCircle, Zap } from 'lucide-react';

const CATEGORY_CONFIG: Record<PulseSignal['category'], { color: string; icon: typeof Activity; label: string }> = {
  health: { color: '#10b981', icon: Heart, label: 'Program Health' },
  risk: { color: '#ef4444', icon: AlertCircle, label: 'Risk' },
  activity: { color: '#06b6d4', icon: Zap, label: 'Activity' },
  trend: { color: '#8b5cf6', icon: Activity, label: 'Trend' },
};

function DirectionIcon({ direction, positive }: { direction: PulseSignal['direction']; positive: boolean }) {
  const color = positive ? '#10b981' : '#ef4444';
  if (direction === 'up') return <TrendingUp size={14} style={{ color }} />;
  if (direction === 'down') return <TrendingDown size={14} style={{ color }} />;
  return <Minus size={14} style={{ color: '#64748b' }} />;
}

export default function PulsePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const byCategory: Record<PulseSignal['category'], PulseSignal[]> = {
    health: PULSE_SIGNALS.filter(s => s.category === 'health'),
    risk: PULSE_SIGNALS.filter(s => s.category === 'risk'),
    activity: PULSE_SIGNALS.filter(s => s.category === 'activity'),
    trend: PULSE_SIGNALS.filter(s => s.category === 'trend'),
  };

  const categories: PulseSignal['category'][] = ['health', 'risk', 'activity', 'trend'];

  return (
    <PrizymPage title="Governance Pulse" subtitle="Real-time signals across program health, risk, activity, and trend" mode="oversee">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {categories.map((cat, ci) => {
          const cfg = CATEGORY_CONFIG[cat];
          const CatIcon = cfg.icon;
          const signals = byCategory[cat];

          return (
            <div
              key={cat}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${ci * 0.12}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CatIcon size={18} style={{ color: cfg.color }} />
                </div>
                <h3 className="pg-subheading">{cfg.label}</h3>
                <span className="pg-caption" style={{ marginLeft: 'auto', fontSize: 11 }}>{signals.length} signal{signals.length > 1 ? 's' : ''}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                {signals.map((s, i) => (
                  <div
                    key={s.id}
                    className="pg-card-elevated"
                    style={{
                      borderLeft: `3px solid ${cfg.color}`,
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                      transition: 'all 0.4s ease',
                      transitionDelay: `${ci * 0.12 + i * 0.04}s`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p className="pg-caption" style={{ fontSize: 12, color: 'var(--pg-text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>{s.title}</p>
                      {s.delta && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 8px', borderRadius: 10,
                          background: s.positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                          fontSize: 11, fontWeight: 700,
                          color: s.positive ? '#10b981' : '#ef4444',
                        }}>
                          <DirectionIcon direction={s.direction} positive={s.positive} />
                          {s.delta}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--pg-text)', marginBottom: 8, lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <p className="pg-caption" style={{ fontSize: 12, lineHeight: 1.5 }}>{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
