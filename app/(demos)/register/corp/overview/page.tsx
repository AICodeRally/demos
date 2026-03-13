'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { Building2, BarChart3, DollarSign, Users } from 'lucide-react';

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

const STORE_FORMATS = [
  { name: 'Flagship', stores: 12, tag: 'Premium Experience', color: '#1E3A5F' },
  { name: 'Standard', stores: 120, tag: 'Volume Driver', color: '#06B6D4' },
  { name: 'Outlet', stores: 48, tag: 'Clearance & Value', color: '#8B5CF6' },
  { name: 'Shop-in-Shop', stores: 20, tag: 'Partner Locations', color: '#10B981' },
];

const STATS = [
  { label: 'Total Stores', value: '200', numVal: 200, sub: 'Across 4 formats', icon: Building2, color: '#1E3A5F' },
  { label: 'Store Formats', value: '4', numVal: 4, sub: 'Flagship / Std / Outlet / SiS', icon: BarChart3, color: '#06B6D4' },
  { label: 'Annual Revenue', value: '$340M', numVal: 340, prefix: '$', suffix: 'M', sub: 'FY25 actual', icon: DollarSign, color: '#10B981' },
  { label: 'Sales Reps', value: '850', numVal: 850, sub: 'Active headcount', icon: Users, color: '#8B5CF6' },
];

const QUICK_METRICS = [
  { label: 'Avg ASP', value: '$1,890' },
  { label: 'Attach Rate', value: '31%' },
  { label: 'YoY Growth', value: '+8.2%' },
];

export default function CorpOverview() {
  const insight = getInsight('corp/overview');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalStores = useCountUp(200);
  const formats = useCountUp(4);
  const revenue = useCountUp(340);
  const reps = useCountUp(850);
  const countVals = [totalStores, formats, revenue, reps];

  const totalAllFormats = STORE_FORMATS.reduce((a, b) => a + b.stores, 0);

  return (
    <RegisterPage
      title="Company Overview"
      subtitle="Summit Sleep Co. — National Retail Chain"
      accentColor="#1E3A5F"
    >
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: 'var(--register-bg-elevated)',
                border: '1px solid var(--register-border)',
                borderRadius: 12,
                padding: '20px 20px 16px',
                borderTop: `3px solid ${s.color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${i * 0.08}s`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Gradient glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                background: `radial-gradient(circle at top right, ${s.color}15, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--register-text)', lineHeight: 1 }}>
                {s.prefix || ''}{Math.round(countVals[i])}{s.suffix || ''}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', marginTop: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Store Format Breakdown */}
      <div
        style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.35s',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Store Format Breakdown
        </h2>

        {/* Stacked horizontal bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 32, marginBottom: 20 }}>
          {STORE_FORMATS.map((f) => (
            <div
              key={f.name}
              style={{
                width: mounted ? `${(f.stores / totalAllFormats) * 100}%` : '0%',
                background: `linear-gradient(135deg, ${f.color}, ${f.color}CC)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '0.5s',
              }}
            >
              {f.stores >= 20 && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>{f.stores}</span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STORE_FORMATS.map((f, i) => (
            <div
              key={f.name}
              className="register-card-hover"
              style={{
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
                borderRadius: 10,
                padding: '16px',
                borderLeft: `4px solid ${f.color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.5 + i * 0.08}s`,
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: f.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {f.tag}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 6 }}>
                {f.name}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 4 }}>
                {f.stores}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--register-text-muted)', marginLeft: 4 }}>
                  stores
                </span>
              </div>
              {/* Mini bar showing proportion */}
              <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: `${f.color}20`, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: mounted ? `${(f.stores / totalAllFormats) * 100}%` : '0%',
                  borderRadius: 2,
                  background: f.color,
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.6 + i * 0.1}s`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div
        style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.5s',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Quick Metrics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {QUICK_METRICS.map((m, i) => (
            <div
              key={m.label}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '20px 20px',
                textAlign: 'center',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.6 + i * 0.1}s`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, #1E3A5F, #06B6D4)`,
                opacity: 0.6,
              }} />
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--register-text)' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', marginTop: 4 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}

      <style>{`
        .register-card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .register-card-hover:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </RegisterPage>
  );
}
