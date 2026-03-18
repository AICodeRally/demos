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

  // Active proposals in progress
  const ACTIVE_PROPOSALS = [
    { client: 'SafeHaven Social Services', title: 'Comprehensive Advancement Program', value: 58000, status: 'Scope Refinement', owner: 'Jennifer Blake', daysOpen: 14, template: 'Campaign Readiness' },
    { client: 'Green Valley Community Foundation', title: 'Capital Campaign Consulting', value: 85000, status: 'Awaiting Response', owner: 'Jennifer Blake', daysOpen: 6, template: 'Campaign Management' },
    { client: 'Sunrise Children\'s Hospital', title: 'Major Gifts Strategy', value: 42000, status: 'Discovery', owner: 'Sarah Kim', daysOpen: 9, template: 'Major Gifts' },
  ];

  const PROPOSAL_TEMPLATES = [
    { name: 'Capital Campaign', uses: 12, winRate: '72%', avgValue: '$85K' },
    { name: 'Feasibility Study', uses: 18, winRate: '81%', avgValue: '$42K' },
    { name: 'Board Development', uses: 8, winRate: '65%', avgValue: '$24K' },
    { name: 'Annual Fund Optimization', uses: 6, winRate: '58%', avgValue: '$32K' },
    { name: 'Major Gifts Program', uses: 9, winRate: '68%', avgValue: '$55K' },
    { name: 'Strategic Planning', uses: 5, winRate: '75%', avgValue: '$65K' },
  ];

  return (
    <PhoenixPage title="Proposal Builder" subtitle="Collaborative proposal development — templates, rate card, and active proposals" accentColor="#3b6bf5">
      {/* Proposal Workflow */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>Proposal Workflow</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>
          Data flows from scope &rarr; proposal &rarr; contract &rarr; project worksheets. No re-entry needed. Kelly drafts contracts, circulates for review, manages client feedback, and tracks via proposal grid. DocuSign recommended for signing.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { step: '1. Select Template', desc: 'Draw from prior proposals & proven language', color: '#94a3b8' },
            { step: '2. Build Scope', desc: 'Services, hours, rate card, deliverables', color: '#3b6bf5' },
            { step: '3. Internal Review', desc: 'Peer review + Richard sign-off', color: '#6366f1' },
            { step: '4. Present to Client', desc: 'Board session included for >$50K deals', color: '#c026d3' },
            { step: '5. Ops Handoff', desc: 'Auto-generates PM worksheet, budget, billing codes', color: '#c9942b' },
          ].map(s => (
            <div key={s.step} style={{
              flex: '1 1 150px', padding: '10px 12px', borderRadius: 8,
              borderLeft: `3px solid ${s.color}`, background: `${s.color}08`,
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{s.step}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-muted)', marginTop: 4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RFP Management */}
      <div className="phoenix-card" style={{ marginBottom: 24, borderLeft: '3px solid #ef4444' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>RFP Management</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          Automated RFP sourcing, compliance tracking, and multi-state registration management. Replaces manual deadline tracking and reduces last-minute scrambles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'Active RFPs', value: '4', sub: '2 state/gov, 1 foundation, 1 higher-ed', color: '#3b6bf5' },
            { title: 'State Registrations', value: '12', sub: 'Active across required states', color: '#10b981' },
            { title: 'Avg Response Time', value: '14 days', sub: 'Down from 21 days (manual process)', color: '#c9942b' },
          ].map(s => (
            <div key={s.title} style={{
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pi-text)', marginTop: 2 }}>{s.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-faint)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 6,
          background: '#ef444408', border: '1px solid #ef444420',
          fontSize: '0.8rem', color: 'var(--pi-text-muted)',
        }}>
          <strong style={{ color: '#ef4444' }}>Pain point:</strong> Kelly (Director of Client Services) currently tracks RFP deadlines manually and monitors Arizona Procurement Portal. State registrations managed through InCorp — foreign entity and fundraising counsel filings required per state. Natalie (Executive Coordinator) now handles initial RFP vetting and inquiry screening.
        </div>
      </div>

      {/* Active Proposals */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Active Proposals</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Client', 'Title', 'Value', 'Status', 'Template', 'Owner', 'Days'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVE_PROPOSALS.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>{p.client}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-secondary)' }}>{p.title}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>${(p.value / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                      background: p.status === 'Awaiting Response' ? '#c9942b20' : p.status === 'Discovery' ? '#3b6bf520' : '#c026d320',
                      color: p.status === 'Awaiting Response' ? '#c9942b' : p.status === 'Discovery' ? '#3b6bf5' : '#c026d3',
                    }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>{p.template}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>{p.owner}</td>
                  <td style={{ padding: '10px 8px', color: p.daysOpen > 10 ? '#ef4444' : 'var(--pi-text-faint)', fontWeight: 600 }}>{p.daysOpen}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Templates */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>Proposal Template Library</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>
          Tried-and-true language, structures, and scope patterns from past winning proposals
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROPOSAL_TEMPLATES.map(t => (
            <div key={t.name} style={{
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 6 }}>{t.name}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--pi-text-muted)' }}>
                <span>{t.uses} used</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{t.winRate} win</span>
                <span>avg {t.avgValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
