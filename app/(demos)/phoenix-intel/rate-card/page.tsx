'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
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
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 20,
        borderRadius: 8, background: '#c9942b08', border: '1px solid #c9942b20', fontSize: '0.85rem', color: 'var(--pi-text-muted)',
      }}>
        <DollarSign size={14} color="#c9942b" style={{ flexShrink: 0 }} />
        <span>All rates are <strong style={{ color: 'var(--pi-text)' }}>pre-negotiation list prices</strong>. Actual engagement pricing configured in Scoping / CPQ. Hourly rates billed monthly. Fixed fees divided over engagement duration.</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Services', value: String(SERVICE_RATES.length), icon: FileText, color: '#3b6bf5' },
          { label: 'Advisory', value: String(SERVICE_RATES.filter(r => r.category === 'Advisory').length), icon: Tag, color: '#3b6bf5' },
          { label: 'Operational', value: String(SERVICE_RATES.filter(r => r.category === 'Operational').length), icon: Tag, color: '#10b981' },
          { label: 'Training', value: String(SERVICE_RATES.filter(r => r.category === 'Training').length), icon: Tag, color: '#7c3aed' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{m.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Rate Cards by Category */}
      {categories.map(cat => (
        <div key={cat} className="phoenix-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: CATEGORY_COLORS[cat] }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>{cat} Services</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                  {['Service', 'Rate Type', 'Price', 'Description'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICE_RATES.filter(r => r.category === cat).map(r => (
                  <tr key={r.service} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>{r.service}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                        background: `${CATEGORY_COLORS[cat]}15`, color: CATEGORY_COLORS[cat],
                        textTransform: 'capitalize',
                      }}>{r.rateType}</span>
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--pi-text)' }}>
                      ${r.rate.toLocaleString()}{r.rateType === 'hourly' ? '/hr' : r.rateType === 'retainer' ? '/mo' : ''}
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)', fontSize: '0.8rem' }}>{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Margin Insight */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #c9942b' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>Margin Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { cat: 'Advisory', margin: '55-65%', note: 'Highest margin — assessment + planning services' },
            { cat: 'Operational', margin: '35-45%', note: 'Volume-driven — campaign management retainers' },
            { cat: 'Training', margin: '45-55%', note: 'Highest scalability via digital delivery' },
          ].map(m => (
            <div key={m.cat} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))', border: '1px solid var(--pi-border-faint)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TrendingUp size={14} color={CATEGORY_COLORS[m.cat]} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text)' }}>{m.cat}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: CATEGORY_COLORS[m.cat] }}>{m.margin}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
