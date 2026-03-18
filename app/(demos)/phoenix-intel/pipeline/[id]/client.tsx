'use client';

import { use } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { DEALS, PIPELINE_STAGES } from '@/data/phoenix-intel/nonprofit-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const STAGE_COLORS: Record<string, string> = {
  Inquiry: '#94a3b8', Qualified: '#3b6bf5', 'Proposal Sent': '#6366f1',
  Negotiation: '#c026d3', Contract: '#c9942b', Active: '#10b981', Completed: '#059669', Declined: '#ef4444',
};

export default function DealDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const deal = DEALS.find(d => d.id === id) ?? DEALS[0];
  const stageIndex = PIPELINE_STAGES.indexOf(deal.stage as typeof PIPELINE_STAGES[number]);

  return (
    <PhoenixPage title={deal.clientName} subtitle={deal.title} accentColor={STAGE_COLORS[deal.stage]}>
      <Link href="/phoenix-intel/pipeline" className="pi-body" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--pi-sapphire)', textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Pipeline
      </Link>

      {/* Stage progress bar */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage} style={{
              flex: 1, height: 6, borderRadius: 3,
              background: i <= stageIndex ? STAGE_COLORS[deal.stage] : 'var(--pi-border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <div className="pi-caption" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--pi-text-muted)' }}>
          {PIPELINE_STAGES.map((stage) => (
            <span key={stage} style={{ fontWeight: stage === deal.stage ? 700 : 400, color: stage === deal.stage ? STAGE_COLORS[deal.stage] : undefined }}>{stage}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="phoenix-card">
          <div className="pi-label-muted" style={{ textTransform: 'uppercase', marginBottom: 4 }}>Deal Value</div>
          <div className="pi-value">${(deal.value / 1000).toFixed(0)}K</div>
        </div>
        <div className="phoenix-card">
          <div className="pi-label-muted" style={{ textTransform: 'uppercase', marginBottom: 4 }}>Probability</div>
          <div className="pi-value">{deal.probability}%</div>
        </div>
        <div className="phoenix-card">
          <div className="pi-label-muted" style={{ textTransform: 'uppercase', marginBottom: 4 }}>Source</div>
          <div className="pi-value">{deal.source}</div>
        </div>
      </div>

      {/* Contact info */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Contact</h3>
        <div style={{ fontSize: '0.95rem', color: 'var(--pi-text-secondary)' }}>
          <div style={{ fontWeight: 600 }}>{deal.contactName}</div>
          <div style={{ color: 'var(--pi-text-muted)', marginTop: 2 }}>Next Step: {deal.nextStep}</div>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="phoenix-card">
        <h3 className="pi-section-title" style={{ marginBottom: 16 }}>Activity History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {deal.history.map((event, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pi-sapphire)', marginTop: 6, flexShrink: 0 }} />
              <div>
                <div className="pi-caption" style={{ fontWeight: 600 }}>{event.date}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--pi-text-secondary)' }}>{event.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoenixPage>
  );
}
