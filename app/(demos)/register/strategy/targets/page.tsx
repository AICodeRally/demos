'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { Target, ArrowUp } from 'lucide-react';

/* ── Animated count-up hook ─────────────────────────────── */
function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, target, duration, decimals]);

  return value;
}

const FORMAT_TARGETS = [
  { format: 'Flagship', target: '$280K', current: '$248K', pct: 89, stores: 12, color: '#1E3A5F' },
  { format: 'Standard', target: '$160K', current: '$142K', pct: 89, stores: 120, color: '#06B6D4' },
  { format: 'Outlet', target: '$95K', current: '$88K', pct: 93, stores: 48, color: '#8B5CF6' },
  { format: 'Shop-in-Shop', target: '$55K', current: '$51K', pct: 93, stores: 20, color: '#10B981' },
];

const VARIANCE = [
  { format: 'Flagship', variance: '-$32K', status: 'Under', statusColor: '#EF4444', note: 'Q1 traffic below forecast in 4 locations' },
  { format: 'Standard', variance: '-$18K', status: 'Under', statusColor: '#EF4444', note: 'Seasonal softness — recovery expected by May' },
  { format: 'Outlet', variance: '-$7K', status: 'Slight Under', statusColor: '#F59E0B', note: 'Clearance inventory replenishment pending' },
  { format: 'Shop-in-Shop', variance: '-$4K', status: 'On Track', statusColor: '#10B981', note: 'Purple partnership driving above-plan weekends' },
];

export default function StoreTargets() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pcts = [
    useCountUp(89, 1600),
    useCountUp(89, 1600),
    useCountUp(93, 1600),
    useCountUp(93, 1600),
  ];

  return (
    <RegisterPage title="Store Targets" subtitle="FY26 Target Allocation" accentColor="#06B6D4">
      {/* Target Allocation by Format */}
      <div
        className="register-section"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          <Target size={16} color="#06B6D4" />
          <h2 className="register-section-header" style={{ margin: 0 }}>
            Target Allocation by Format (per store/month)
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FORMAT_TARGETS.map((f, i) => (
            <div
              key={f.format}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                borderLeft: `4px solid ${f.color}`,
                position: 'relative',
                overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 60, height: 60,
                background: `radial-gradient(circle at top right, ${f.color}10, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div className="register-meta-label">
                {f.format} ({f.stores} stores)
              </div>
              <div className="register-kpi-value" style={{ marginTop: 6 }}>
                {f.target}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                per store / month
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current vs Target Progress Bars */}
      <div
        className="register-section"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.2s',
        }}>
        <h2 className="register-section-header" style={{ marginBottom: 20 }}>
          Current vs. Target (MTD)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {FORMAT_TARGETS.map((f, i) => (
            <div
              key={f.format}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${0.3 + i * 0.08}s`,
              }}
            >
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, display: 'inline-block', boxShadow: `0 0 6px ${f.color}40` }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)' }}>{f.format}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)' }}>
                  {f.current} / {f.target}
                  <span style={{
                    fontWeight: 700,
                    color: f.pct >= 90 ? '#10B981' : '#F59E0B',
                    marginLeft: 8,
                    fontSize: '0.9rem',
                  }}>
                    {Math.round(pcts[i])}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 12, borderRadius: 6, background: 'var(--register-bg-surface)', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: mounted ? `${f.pct}%` : '0%',
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${f.color}, ${f.color}CC)`,
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${0.4 + i * 0.1}s`,
                    boxShadow: `0 0 8px ${f.color}30`,
                  }}
                />
                {/* 100% marker */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, right: 0, width: 2,
                  background: 'var(--register-text-dim)',
                  opacity: 0.3,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Variance Analysis */}
      <div
        className="register-section"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.4s',
        }}>
        <h2 className="register-section-header">Variance Analysis</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {VARIANCE.map((v, i) => (
            <div
              key={v.format}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                borderLeft: `4px solid ${v.statusColor}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${0.5 + i * 0.08}s`,
              }}
            >
              <div style={{ minWidth: 80 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{v.format}</div>
              </div>
              <div style={{
                fontSize: '1rem', fontWeight: 800, color: '#EF4444',
                minWidth: 60, textAlign: 'center',
              }}>
                {v.variance}
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: `${v.statusColor}18`, color: v.statusColor,
                textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}>
                {v.status}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', flex: 1 }}>
                {v.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RegisterPage>
  );
}
