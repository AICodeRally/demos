'use client';

import { use } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { ArrowLeft, Calendar, DollarSign, FileText, Users } from 'lucide-react';

export default function EngagementDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const eng = ENGAGEMENTS.find(e => e.id === id) ?? ENGAGEMENTS[0];
  const budgetPct = Math.min((eng.spent / eng.budget) * 100, 100);

  // Synthetic timeline
  const timeline = [
    { date: eng.startDate, event: 'Engagement kicked off', type: 'milestone' },
    { date: '2 weeks later', event: 'Discovery interviews completed', type: 'deliverable' },
    { date: '1 month in', event: 'Initial assessment delivered', type: 'deliverable' },
    { date: 'Ongoing', event: `${eng.sessions} sessions conducted`, type: 'session' },
    { date: eng.endDate, event: 'Target completion', type: 'milestone' },
  ];

  return (
    <PhoenixPage title={eng.clientName} subtitle={eng.title} accentColor="#c9942b">
      <Link href="/phoenix-intel/engagements" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--pi-sapphire)', textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Engagements
      </Link>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Calendar, label: 'Duration', value: `${eng.startDate} → ${eng.endDate}`, color: '#3b6bf5' },
          { icon: DollarSign, label: 'Budget', value: `$${(eng.budget / 1000).toFixed(0)}K`, color: '#10b981' },
          { icon: FileText, label: 'Deliverables', value: `${eng.completedDeliverables}/${eng.deliverables}`, color: '#c9942b' },
          { icon: Users, label: 'Lead', value: eng.leadConsultant, color: '#7c3aed' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="phoenix-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ background: `${card.color}18`, borderRadius: 6, padding: 4, display: 'flex' }}><Icon size={14} color={card.color} /></div>
                <span style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)' }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 12 }}>Progress & Budget</h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--pi-text-muted)' }}>Overall Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--pi-text)' }}>{eng.progress}%</span>
          </div>
          <div style={{ height: 10, background: 'var(--pi-border-faint)', borderRadius: 5 }}>
            <div style={{ height: '100%', width: `${eng.progress}%`, background: '#3b6bf5', borderRadius: 5 }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
            <span style={{ color: 'var(--pi-text-muted)' }}>Budget Burn: ${(eng.spent / 1000).toFixed(1)}K of ${(eng.budget / 1000).toFixed(0)}K</span>
            <span style={{ fontWeight: 700, color: budgetPct > 90 ? '#ef4444' : '#10b981' }}>{budgetPct.toFixed(0)}%</span>
          </div>
          <div style={{ height: 10, background: 'var(--pi-border-faint)', borderRadius: 5 }}>
            <div style={{ height: '100%', width: `${budgetPct}%`, background: budgetPct > 90 ? '#ef4444' : '#10b981', borderRadius: 5 }} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="phoenix-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Engagement Timeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {timeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                background: t.type === 'milestone' ? '#3b6bf5' : t.type === 'deliverable' ? '#10b981' : '#c9942b',
              }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-faint)', fontWeight: 600 }}>{t.date}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--pi-text-secondary)' }}>{t.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoenixPage>
  );
}
