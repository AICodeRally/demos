'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { Users, BarChart3, ArrowDown } from 'lucide-react';

/* ── Animated count-up hook ─────────────────────────────── */
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const [active, setActive] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => { setActive(true); }, []);

  useEffect(() => {
    if (!active) return;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return value;
}

const FORMAT_HEADCOUNT = [
  { format: 'Flagship', stores: 12, avgReps: 8, totalReps: 96, trafficRatio: '1:420', color: '#1E3A5F' },
  { format: 'Standard', stores: 120, avgReps: 4, totalReps: 480, trafficRatio: '1:580', color: '#06B6D4' },
  { format: 'Outlet', stores: 48, avgReps: 3, totalReps: 144, trafficRatio: '1:720', color: '#8B5CF6' },
  { format: 'Shop-in-Shop', stores: 20, avgReps: 2, totalReps: 40, trafficRatio: '1:350', color: '#10B981' },
];

const TURNOVER = [
  { label: 'Annual Turnover Rate', value: '22%', numVal: 22, suffix: '%', color: '#EF4444' },
  { label: 'Cost per Replacement', value: '$8,000', numVal: 8000, prefix: '$', color: '#F59E0B' },
  { label: 'Avg Time-to-Productive', value: '6 weeks', numVal: 6, suffix: ' wks', color: '#06B6D4' },
  { label: 'Total Annual Turnover Cost', value: '$1.5M', numVal: 1.5, prefix: '$', suffix: 'M', color: '#EF4444' },
];

const TRAFFIC_ANALYSIS = [
  { format: 'Flagship', peakRatio: '1:280', offPeakRatio: '1:620', recommendation: 'Adequate staffing', recColor: '#10B981' },
  { format: 'Standard', peakRatio: '1:380', offPeakRatio: '1:840', recommendation: 'Add flex shifts on weekends', recColor: '#F59E0B' },
  { format: 'Outlet', peakRatio: '1:480', offPeakRatio: '1:960', recommendation: 'Consider cross-training', recColor: '#F59E0B' },
  { format: 'Shop-in-Shop', peakRatio: '1:220', offPeakRatio: '1:510', recommendation: 'Optimal — partner covers gaps', recColor: '#10B981' },
];

const totalReps = FORMAT_HEADCOUNT.reduce((a, b) => a + b.totalReps, 0);

export default function WorkforceModel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalRepsCount = useCountUp(760, 1600);
  const turnoverCount = useCountUp(22, 1400);

  return (
    <RegisterPage title="Workforce Model" subtitle="Staffing Efficiency" accentColor="#06B6D4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Sales Reps', value: totalRepsCount.toString(), color: '#06B6D4' },
          { label: 'Store Formats', value: '4', color: '#8B5CF6' },
          { label: 'Turnover Rate', value: `${turnoverCount}%`, color: '#EF4444' },
        ].map((s, i) => (
          <div
            key={s.label}
            className="register-card"
            style={{
              padding: '16px 20px',
              textAlign: 'center',
              borderTop: `3px solid ${s.color}`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <div className="register-kpi-value">{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Headcount by Format */}
      <div
        className="register-section"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.15s',
        }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Users size={16} color="#06B6D4" />
          <h2 className="register-section-header" style={{ margin: 0 }}>
            Headcount by Format
          </h2>
        </div>

        {/* Stacked bar showing proportion */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 28, marginBottom: 16, gap: 2 }}>
          {FORMAT_HEADCOUNT.map((f, i) => (
            <div
              key={f.format}
              style={{
                width: mounted ? `${(f.totalReps / totalReps) * 100}%` : '0%',
                background: `linear-gradient(135deg, ${f.color}, ${f.color}CC)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.3 + i * 0.1}s`,
              }}
            >
              {f.totalReps >= 40 && (
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#fff' }}>{f.totalReps}</span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FORMAT_HEADCOUNT.map((f, i) => (
            <div
              key={f.format}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                borderTop: `3px solid ${f.color}`,
                position: 'relative',
                overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.08}s`,
              }}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 50, height: 50,
                background: `radial-gradient(circle at top right, ${f.color}10, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div className="register-meta-label">
                {f.format}
              </div>
              <div className="register-kpi-value" style={{ marginTop: 6 }}>
                {f.avgReps}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--register-text-muted)', marginLeft: 4 }}>avg reps</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                <div className="flex justify-between" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>Total Reps</span>
                  <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{f.totalReps}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>Stores</span>
                  <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{f.stores}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>Rep:Traffic</span>
                  <span style={{ fontWeight: 600, color: f.color }}>{f.trafficRatio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rep-to-Traffic Ratio Analysis */}
      <div
        className="register-section"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.3s',
        }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <BarChart3 size={16} color="#06B6D4" />
          <h2 className="register-section-header" style={{ margin: 0 }}>Rep-to-Traffic Ratio Analysis</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: '4px 0 16px' }}>Monthly walk-ins per sales rep</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TRAFFIC_ANALYSIS.map((t, i) => {
            const fData = FORMAT_HEADCOUNT.find(f => f.format === t.format);
            return (
              <div
                key={t.format}
                style={{
                  background: 'var(--register-bg-surface)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  borderLeft: `4px solid ${fData?.color || '#06B6D4'}`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${0.4 + i * 0.08}s`,
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{t.format}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    background: `${t.recColor}15`, color: t.recColor, textTransform: 'uppercase',
                  }}>
                    {t.recommendation}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="register-meta-label">Peak</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginLeft: 6 }}>{t.peakRatio}</span>
                  </div>
                  <div>
                    <span className="register-meta-label">Off-Peak</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text-muted)', marginLeft: 6 }}>{t.offPeakRatio}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Turnover Metrics */}
      <div
        className="register-section"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.45s',
        }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <ArrowDown size={16} color="#EF4444" />
          <h2 className="register-section-header" style={{ margin: 0 }}>
            Turnover Metrics
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TURNOVER.map((t, i) => (
            <div
              key={t.label}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '18px 18px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.5 + i * 0.08}s`,
              }}
            >
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: t.color,
                opacity: 0.5,
              }} />
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: t.color }}>{t.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 4 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </RegisterPage>
  );
}
