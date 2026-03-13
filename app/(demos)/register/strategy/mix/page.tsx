'use client';

import { useState, useEffect, useRef } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { Sliders, ArrowUp, Target } from 'lucide-react';

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

const CATEGORIES = [
  { name: 'Mattresses', revPct: 65, color: '#1E3A5F', attachRate: null },
  { name: 'Adjustable Bases', revPct: 20, color: '#06B6D4', attachRate: 31 },
  { name: 'Accessories', revPct: 8, color: '#8B5CF6', attachRate: 44 },
  { name: 'Protection Plans', revPct: 5, color: '#10B981', attachRate: 28 },
  { name: 'Delivery / Setup', revPct: 2, color: '#F59E0B', attachRate: 62 },
];

const ATTACH_TARGETS = [
  { name: 'Adjustable Bases', current: 31, target: 45, color: '#06B6D4' },
  { name: 'Accessories', current: 44, target: 55, color: '#8B5CF6' },
  { name: 'Protection Plans', current: 28, target: 40, color: '#10B981' },
  { name: 'Delivery / Setup', current: 62, target: 70, color: '#F59E0B' },
];

export default function ProductMix() {
  const insight = getInsight('strategy/mix');
  const maxRevPct = Math.max(...CATEGORIES.map((c) => c.revPct));
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const bundleCurrent = useCountUp(34, 1600);
  const bundleTarget = useCountUp(45, 1800);

  return (
    <RegisterPage title="Product Mix" subtitle="Category Performance & Attach Rates" accentColor="#06B6D4">
      {/* Category Revenue Breakdown */}
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
          <Sliders size={16} color="#06B6D4" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Revenue by Category
          </h2>
        </div>
        {/* Stacked horizontal bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 40, marginBottom: 20 }}>
          {CATEGORIES.map((c, i) => (
            <div
              key={c.name}
              style={{
                width: mounted ? `${c.revPct}%` : '0%',
                background: `linear-gradient(135deg, ${c.color}, ${c.color}CC)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.08}s`,
              }}
            >
              {c.revPct >= 8 && (
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{c.revPct}%</span>
              )}
            </div>
          ))}
        </div>
        {/* Legend + detail rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CATEGORIES.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-3"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${0.4 + i * 0.06}s`,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0, boxShadow: `0 0 6px ${c.color}40` }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', width: 140 }}>{c.name}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: mounted ? `${(c.revPct / maxRevPct) * 100}%` : '0%',
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${c.color}, ${c.color}BB)`,
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.5 + i * 0.08}s`,
                  boxShadow: `0 0 4px ${c.color}20`,
                }} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', width: 40, textAlign: 'right' }}>{c.revPct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attach Rate by Category */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.2s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Target size={16} color="#06B6D4" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Attach Rate by Category
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ATTACH_TARGETS.map((a, i) => (
            <div
              key={a.name}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${0.3 + i * 0.08}s`,
              }}
            >
              <div className="flex justify-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)' }}>{a.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)' }}>
                  <span style={{ fontWeight: 700, color: a.color }}>{a.current}%</span>
                  <span style={{ color: 'var(--register-text-dim)', margin: '0 4px' }}>/</span>
                  <span>{a.target}% target</span>
                </span>
              </div>
              <div style={{ position: 'relative', height: 12, borderRadius: 6, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: mounted ? `${a.current}%` : '0%',
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${a.color}, ${a.color}CC)`,
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.4 + i * 0.1}s`,
                  boxShadow: `0 0 6px ${a.color}25`,
                }} />
                {/* Target marker */}
                <div style={{
                  position: 'absolute', top: -2, bottom: -2,
                  left: `${a.target}%`,
                  width: 2,
                  background: 'var(--register-text)',
                  opacity: 0.4,
                  borderRadius: 1,
                }} />
                {/* Target label */}
                <div style={{
                  position: 'absolute', top: -16,
                  left: `${a.target}%`,
                  transform: 'translateX(-50%)',
                  fontSize: '0.55rem',
                  color: 'var(--register-text-dim)',
                  fontWeight: 600,
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 0.5s ease 1s',
                }}>
                  {a.target}%
                </div>
              </div>
              {/* Gap indicator */}
              <div style={{ marginTop: 4, fontSize: '0.7rem', color: 'var(--register-text-dim)' }}>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>+{a.target - a.current}pp</span> to target
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle Penetration */}
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
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 8 }}>
          Bundle Penetration
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', marginBottom: 20 }}>
          Percentage of mattress sales that include an adjustable base
        </p>
        <div className="flex items-center gap-6">
          {/* Current */}
          <div style={{
            textAlign: 'center',
            padding: '16px 24px',
            background: 'var(--register-bg-surface)',
            borderRadius: 12,
            border: '1px solid rgba(6,182,212,0.2)',
          }}>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#06B6D4', lineHeight: 1 }}>
              {bundleCurrent}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 4, fontWeight: 600 }}>Current</div>
          </div>
          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ArrowUp size={20} color="var(--register-text-dim)" style={{ transform: 'rotate(90deg)' }} />
            <div style={{
              width: 40, height: 2,
              background: 'linear-gradient(90deg, #06B6D4, #10B981)',
              borderRadius: 1,
            }} />
          </div>
          {/* Target */}
          <div style={{
            textAlign: 'center',
            padding: '16px 24px',
            background: 'var(--register-bg-surface)',
            borderRadius: 12,
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
              {bundleTarget}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 4, fontWeight: 600 }}>Target</div>
          </div>
          {/* Gap */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12,
            padding: '14px 24px',
            marginLeft: 8,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>+11pp</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', fontWeight: 600 }}>Gap to close</div>
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
