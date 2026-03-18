'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCard } from '@/components/demos/phoenix-intel/MetricCard';
import { DataTable } from '@/components/demos/phoenix-intel/DataTable';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { SERVICE_RATES } from '@/data/phoenix-intel/nonprofit-data';
import { DollarSign, TrendingUp, FileText, Tag } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Advisory: '#3b6bf5',
  Operational: '#10b981',
  Training: '#7c3aed',
};

export default function RateCardPage() {
  const insight = getInsight('rate-card');
  const categories = ['Advisory', 'Operational', 'Training'] as const;

  return (
    <PhoenixPage title="Rate Card" subtitle="Service line pricing, rate types, and margin analysis" accentColor="#c9942b">
      {/* Billing Context */}
      <Alert variant="warning" icon={DollarSign}>
        All rates are <strong style={{ color: 'var(--pi-text)' }}>pre-negotiation list prices</strong>. Actual engagement pricing configured in Scoping / CPQ. Hourly rates billed monthly. Fixed fees divided over engagement duration.
      </Alert>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Rate card summary">
        <MetricCard label="Total Services" value={String(SERVICE_RATES.length)} icon={FileText} color="#3b6bf5" />
        <MetricCard label="Advisory" value={String(SERVICE_RATES.filter(r => r.category === 'Advisory').length)} icon={Tag} color="#3b6bf5" />
        <MetricCard label="Operational" value={String(SERVICE_RATES.filter(r => r.category === 'Operational').length)} icon={Tag} color="#10b981" />
        <MetricCard label="Training" value={String(SERVICE_RATES.filter(r => r.category === 'Training').length)} icon={Tag} color="#7c3aed" />
      </div>

      {/* Rate Cards by Category */}
      {categories.map(cat => (
        <div key={cat} className="phoenix-card" style={{ marginBottom: 20 }} role="region" aria-label={`${cat} services`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: CATEGORY_COLORS[cat] }} aria-hidden="true" />
            <h3 className="pi-section-title" style={{ marginBottom: 0 }}>{cat} Services</h3>
          </div>
          <DataTable
            data={SERVICE_RATES.filter(r => r.category === cat)}
            keyFn={(r) => r.service}
            columns={[
              { key: 'service', header: 'Service', render: (r) => <span className="pi-label">{r.service}</span> },
              { key: 'rateType', header: 'Rate Type', render: (r) => (
                <span className="pi-badge" style={{ background: `${CATEGORY_COLORS[cat]}15`, color: CATEGORY_COLORS[cat], textTransform: 'capitalize' }}>
                  {r.rateType}
                </span>
              )},
              { key: 'price', header: 'Price', render: (r) => (
                <span className="pi-label" style={{ fontWeight: 800 }}>
                  ${r.rate.toLocaleString()}{r.rateType === 'hourly' ? '/hr' : r.rateType === 'retainer' ? '/mo' : ''}
                </span>
              )},
              { key: 'description', header: 'Description', hideSm: true, render: (r) => <span className="pi-caption">{r.description}</span> },
            ]}
          />
        </div>
      ))}

      {/* Margin Insight */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #c9942b' }}>
        <h3 className="pi-section-title">Margin Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { cat: 'Advisory', margin: '55-65%', note: 'Highest margin — assessment + planning services' },
            { cat: 'Operational', margin: '35-45%', note: 'Volume-driven — campaign management retainers' },
            { cat: 'Training', margin: '45-55%', note: 'Highest scalability via digital delivery' },
          ].map(m => (
            <div key={m.cat} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))', border: '1px solid var(--pi-border-faint)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TrendingUp size={14} color={CATEGORY_COLORS[m.cat]} />
                <span className="pi-label">{m.cat}</span>
              </div>
              <div className="pi-value-sm" style={{ color: CATEGORY_COLORS[m.cat] }}>{m.margin}</div>
              <div className="pi-caption" style={{ marginTop: 2 }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
