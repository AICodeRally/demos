'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { DEALS, PIPELINE_STAGES } from '@/data/phoenix-intel/nonprofit-data';
import { EmptyState } from '@/components/demos/phoenix-intel/EmptyState';
import type { PipelineStage } from '@/data/phoenix-intel/nonprofit-data';

const STAGE_COLORS: Record<string, string> = {
  Inquiry: '#94a3b8',
  Qualified: '#2563eb',
  'Proposal Sent': '#6366f1',
  Negotiation: '#c026d3',
  Contract: '#c9942b',
  Active: '#10b981',
  Completed: '#059669',
  Declined: '#ef4444',
};

export default function PipelinePage() {
  const insight = getInsight('pipeline');
  const [filterStage, setFilterStage] = useState<PipelineStage | 'All'>('All');

  const filtered = filterStage === 'All' ? DEALS : DEALS.filter(d => d.stage === filterStage);
  const totalValue = filtered.reduce((sum, d) => sum + d.value, 0);

  return (
    <PhoenixPage title="Deal Pipeline" subtitle={`${filtered.length} deals — $${(totalValue / 1000).toFixed(0)}K total value`} accentColor="#3b6bf5">
      {/* Lead Source & Capture */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: 16 }}>
        {[
          { label: 'Referral Source', value: '75%+', sub: 'Client referrals dominate', color: '#10b981' },
          { label: 'Repeat Business', value: '60%', sub: 'Existing client renewals', color: '#3b6bf5' },
          { label: 'Contact Database', value: '2,500-3K', sub: 'After 20 years — needs growth', color: '#ef4444' },
          { label: 'Conference Capture', value: 'Manual', sub: 'No systematized process', color: '#c9942b' },
        ].map(m => (
          <div key={m.label} style={{
            padding: '10px 12px', borderRadius: 8, textAlign: 'center',
            background: `${m.color}08`, border: `1px solid ${m.color}20`,
          }}>
            <div className="pi-value-sm" style={{ color: m.color }}>{m.value}</div>
            <div className="pi-label-muted" style={{ marginTop: 2 }}>{m.label}</div>
            <div className="pi-caption" style={{ marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      {/* Stage filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          onClick={() => setFilterStage('All')}
          aria-pressed={filterStage === 'All'}
          style={{
            padding: '6px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: filterStage === 'All' ? 'var(--pi-sapphire)' : 'var(--pi-card)',
            color: filterStage === 'All' ? '#fff' : 'var(--pi-text-muted)',
          }}
        >
          All ({DEALS.length})
        </button>
        {PIPELINE_STAGES.map((stage) => {
          const count = DEALS.filter(d => d.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              aria-pressed={filterStage === stage}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                background: filterStage === stage ? STAGE_COLORS[stage] : 'var(--pi-card)',
                color: filterStage === stage ? '#fff' : 'var(--pi-text-muted)',
              }}
            >
              {stage} ({count})
            </button>
          );
        })}
      </div>

      {/* Deal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map((deal) => (
          <Link key={deal.id} href={`/phoenix-intel/pipeline/${deal.id}`} style={{ textDecoration: 'none' }}>
            <div className="phoenix-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div className="pi-label">{deal.clientName}</div>
                  <div className="pi-body-muted" style={{ marginTop: 2 }}>{deal.title}</div>
                </div>
                <span className="pi-badge" style={{
                  background: `${STAGE_COLORS[deal.stage]}20`, color: STAGE_COLORS[deal.stage],
                }}>
                  {deal.stage}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span className="pi-value-sm">
                  ${(deal.value / 1000).toFixed(0)}K
                </span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span className="pi-caption">
                    {deal.probability}% prob
                  </span>
                  <span className="pi-caption">
                    {deal.source}
                  </span>
                </div>
              </div>
              <div className="pi-caption" style={{ color: 'var(--pi-text-faint)', marginTop: 8, borderTop: '1px solid var(--pi-border-faint)', paddingTop: 8 }}>
                Next: {deal.nextStep}
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState title="No deals in this stage" message="Try selecting a different pipeline stage" />
          </div>
        )}
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
