'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { SERVICE_RATES } from '@/data/phoenix-intel/nonprofit-data';
import type { ServiceRate } from '@/data/phoenix-intel/nonprofit-data';

export default function ProposalsPage() {
  const insight = getInsight('proposals');
  const [selectedCategory, setSelectedCategory] = useState<ServiceRate['category'] | 'All'>('All');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const categories: (ServiceRate['category'] | 'All')[] = ['All', 'Advisory', 'Operational', 'Training'];
  const filtered = selectedCategory === 'All' ? SERVICE_RATES : SERVICE_RATES.filter(s => s.category === selectedCategory);

  const toggleService = (service: string) => {
    setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  const selectedRates = SERVICE_RATES.filter(s => selectedServices.includes(s.service));
  const estimatedTotal = selectedRates.reduce((sum, s) => sum + s.rate, 0);

  return (
    <PhoenixPage title="Proposal Builder" subtitle="Rate card and engagement scoping tool" accentColor="#3b6bf5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Rate Card */}
        <div className="lg:col-span-2">
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: selectedCategory === cat ? 'var(--pi-sapphire)' : 'var(--pi-card)',
                  color: selectedCategory === cat ? '#fff' : 'var(--pi-text-muted)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(rate => {
              const isSelected = selectedServices.includes(rate.service);
              return (
                <div
                  key={rate.service}
                  className="phoenix-card"
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--pi-sapphire)' : undefined,
                    background: isSelected ? 'var(--pi-sapphire-bg)' : undefined,
                  }}
                  onClick={() => toggleService(rate.service)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: '#3b6bf5' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>{rate.service}</span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700,
                          background: rate.category === 'Advisory' ? '#3b6bf520' : rate.category === 'Operational' ? '#10b98120' : '#7c3aed20',
                          color: rate.category === 'Advisory' ? '#3b6bf5' : rate.category === 'Operational' ? '#10b981' : '#7c3aed',
                        }}>
                          {rate.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', marginTop: 4, marginLeft: 24 }}>{rate.description}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pi-text)' }}>
                        ${rate.rate.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)' }}>{rate.rateType}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proposal Summary */}
        <div>
          <div className="phoenix-card" style={{ position: 'sticky', top: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16, borderBottom: '2px solid var(--pi-sapphire)', paddingBottom: 8 }}>
              Proposal Summary
            </h3>
            {selectedRates.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--pi-text-muted)' }}>Select services from the rate card to build a proposal</p>
            ) : (
              <>
                {selectedRates.map(r => (
                  <div key={r.service} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '6px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
                    <span style={{ color: 'var(--pi-text-secondary)' }}>{r.service}</span>
                    <span style={{ fontWeight: 700, color: 'var(--pi-text)' }}>${r.rate.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, marginTop: 12, paddingTop: 8, borderTop: '2px solid var(--pi-sapphire)' }}>
                  <span style={{ color: 'var(--pi-text)' }}>Total</span>
                  <span style={{ color: 'var(--pi-sapphire)' }}>${estimatedTotal.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
