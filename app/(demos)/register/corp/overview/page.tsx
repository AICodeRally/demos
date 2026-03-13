'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';

const STORE_FORMATS = [
  { name: 'Flagship', stores: 12, tag: 'Premium Experience', color: '#1E3A5F' },
  { name: 'Standard', stores: 120, tag: 'Volume Driver', color: '#06B6D4' },
  { name: 'Outlet', stores: 48, tag: 'Clearance & Value', color: '#8B5CF6' },
  { name: 'Shop-in-Shop', stores: 20, tag: 'Partner Locations', color: '#10B981' },
];

const STATS = [
  { label: 'Total Stores', value: '200', sub: 'Across 4 formats' },
  { label: 'Store Formats', value: '4', sub: 'Flagship / Std / Outlet / SiS' },
  { label: 'Annual Revenue', value: '$340M', sub: 'FY25 actual' },
  { label: 'Sales Reps', value: '850', sub: 'Active headcount' },
];

const QUICK_METRICS = [
  { label: 'Avg ASP', value: '$1,890' },
  { label: 'Attach Rate', value: '31%' },
  { label: 'YoY Growth', value: '+8.2%' },
];

export default function CorpOverview() {
  const insight = getInsight('corp/overview');

  return (
    <RegisterPage
      title="Company Overview"
      subtitle="Summit Sleep Co. — National Retail Chain"
      accentColor="#1E3A5F"
    >
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              borderTop: '3px solid #1E3A5F',
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              borderTopWidth: 3,
              borderTopColor: '#1E3A5F',
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--register-text)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', marginTop: 2 }}>
              {s.label}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Store Format Breakdown */}
      <div
        style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Store Format Breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STORE_FORMATS.map((f) => (
            <div
              key={f.name}
              style={{
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
                borderRadius: 10,
                padding: '16px',
                borderLeft: `4px solid ${f.color}`,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: f.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {f.tag}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 6 }}>
                {f.name}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 4 }}>
                {f.stores}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--register-text-muted)', marginLeft: 4 }}>
                  stores
                </span>
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
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Quick Metrics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {QUICK_METRICS.map((m) => (
            <div
              key={m.label}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--register-text)' }}>
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
    </RegisterPage>
  );
}
