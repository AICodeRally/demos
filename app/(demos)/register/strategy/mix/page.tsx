'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';

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

  return (
    <RegisterPage title="Product Mix" subtitle="Category Performance & Attach Rates" accentColor="#06B6D4">
      {/* Category Revenue Breakdown */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Revenue by Category
        </h2>
        {/* Stacked horizontal bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 36, marginBottom: 16 }}>
          {CATEGORIES.map((c) => (
            <div
              key={c.name}
              style={{ width: `${c.revPct}%`, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {c.revPct >= 8 && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>{c.revPct}%</span>
              )}
            </div>
          ))}
        </div>
        {/* Legend + detail rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CATEGORIES.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', width: 140 }}>{c.name}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(c.revPct / maxRevPct) * 100}%`, borderRadius: 4, background: c.color }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', width: 40, textAlign: 'right' }}>{c.revPct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attach Rate by Category */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Attach Rate by Category
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ATTACH_TARGETS.map((a) => (
            <div key={a.name}>
              <div className="flex justify-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)' }}>{a.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)' }}>
                  {a.current}%
                  <span style={{ color: 'var(--register-text-dim)', margin: '0 4px' }}>/</span>
                  {a.target}% target
                </span>
              </div>
              <div style={{ position: 'relative', height: 10, borderRadius: 5, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.current}%`, borderRadius: 5, background: a.color }} />
                {/* Target marker */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${a.target}%`, width: 2, background: 'var(--register-text-dim)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle Penetration */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 8 }}>
          Bundle Penetration
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', marginBottom: 16 }}>
          Percentage of mattress sales that include an adjustable base
        </p>
        <div className="flex items-center gap-6">
          {/* Current */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#06B6D4' }}>34%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>Current</div>
          </div>
          {/* Arrow */}
          <div style={{ fontSize: '1.5rem', color: 'var(--register-text-dim)' }}>&rarr;</div>
          {/* Target */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981' }}>45%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>Target</div>
          </div>
          {/* Gap */}
          <div style={{ background: 'var(--register-bg-surface)', borderRadius: 10, padding: '12px 20px', marginLeft: 16 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>+11pp</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>Gap to close</div>
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
