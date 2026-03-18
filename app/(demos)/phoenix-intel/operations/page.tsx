'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { DataTable } from '@/components/demos/phoenix-intel/DataTable';
import { CONSULTANTS } from '@/data/phoenix-intel/nonprofit-data';
import { TIME_ENTRIES, ONBOARDING_CHECKLIST } from '@/data/phoenix-intel/operations-data';

export default function OperationsPage() {
  const insight = getInsight('operations');

  return (
    <PhoenixPage title="Operations" subtitle="Team utilization, time tracking, and onboarding" accentColor="#3b6bf5">
      {/* Operations Org Structure */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Operations Team — Key Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Kelly Martinez', title: 'Director of Client Services', scope: 'Contracts, reporting, QC, proposals, state filings, Knack/Dropbox management', color: '#3b6bf5' },
            { name: 'Timmesse Thompson', title: 'Corp. Operations & Events', scope: 'Events, onboarding, IT support, SOPs, compliance, tech modernization', color: '#10b981' },
            { name: 'Cassandra Williams', title: 'Business Manager', scope: 'Finance, accounting, invoicing, QuickBooks, Alliance Bank, ADP, Amex reconciliation', color: '#c9942b' },
          ].map(r => (
            <div key={r.name} style={{
              padding: '12px 14px', borderRadius: 8,
              borderLeft: `3px solid ${r.color}`, background: `${r.color}08`,
            }}>
              <div className="pi-label">{r.name}</div>
              <div className="pi-caption" style={{ fontWeight: 600, color: r.color, marginTop: 2 }}>{r.title}</div>
              <div className="pi-caption" style={{ marginTop: 4 }}>{r.scope}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {[
            { name: 'Natalie Graff', role: 'Executive Coordinator (PT)' },
            { name: 'Evelyn Torres', role: 'Prospect Research' },
            { name: 'Kris Jacober', role: 'Marketing & Comms' },
          ].map(s => (
            <span key={s.name} className="pi-badge" style={{
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))', border: '1px solid var(--pi-border-faint)',
              color: 'var(--pi-text-muted)',
            }}>
              <strong style={{ color: 'var(--pi-text-secondary)' }}>{s.name}</strong> — {s.role}
            </span>
          ))}
        </div>
      </div>

      {/* Utilization bars */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Consultant Utilization</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CONSULTANTS.sort((a, b) => b.utilization - a.utilization).map(c => {
            const color = c.utilization > 90 ? '#ef4444' : c.utilization > 80 ? '#c9942b' : '#10b981';
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="pi-body">
                    <span className="pi-label">{c.name}</span>
                    <span className="pi-body-muted" style={{ marginLeft: 8 }}>{c.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span className="pi-caption">{c.activeEngagements} engagements</span>
                    <span className="pi-label" style={{ color }}>{c.utilization}%</span>
                  </div>
                </div>
                <div className="pi-bar-track" style={{ height: 8, borderRadius: 4 }}>
                  <div className="pi-bar-fill" style={{ width: `${c.utilization}%`, background: color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Time entries table */}
        <div className="phoenix-card" role="region" aria-label="Recent time entries">
          <h3 className="pi-section-title">Recent Time Entries</h3>
          <DataTable
            data={TIME_ENTRIES}
            keyFn={(_, i) => String(i)}
            columns={[
              { key: 'date', header: 'Date', render: (e) => <span className="pi-caption">{e.date}</span> },
              { key: 'consultant', header: 'Consultant', render: (e) => <span className="pi-label" style={{ fontWeight: 600 }}>{e.consultant}</span> },
              { key: 'client', header: 'Client', hideSm: true, render: (e) => <span className="pi-body-muted">{e.client}</span> },
              { key: 'hours', header: 'Hours', render: (e) => <span className="pi-label">{e.hours}h</span> },
              { key: 'category', header: 'Category', hideSm: true, render: (e) => <span className="pi-body-muted">{e.category}</span> },
            ]}
          />
        </div>

        {/* Onboarding checklist */}
        <div className="phoenix-card">
          <h3 className="pi-section-title">Client Onboarding Checklist</h3>
          <p className="pi-body-muted" style={{ marginBottom: 12 }}>SafeHaven Social Services — New Engagement</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ONBOARDING_CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.done ? '#10b981' : 'var(--pi-border)',
                  color: item.done ? '#fff' : 'transparent',
                  fontSize: '0.85rem', fontWeight: 800,
                }}>
                  {item.done ? '\u2713' : ''}
                </div>
                <span className="pi-body" style={{ color: item.done ? 'var(--pi-text-muted)' : 'var(--pi-text)', textDecoration: item.done ? 'line-through' : 'none' }}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
