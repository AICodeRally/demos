'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CONSULTANTS } from '@/data/phoenix-intel/nonprofit-data';

const TIME_ENTRIES = [
  { date: '2026-03-15', consultant: 'Jennifer Blake', client: 'Mountain View Academy', hours: 4.5, category: 'Campaign Management' },
  { date: '2026-03-15', consultant: 'Marcus Rivera', client: 'Hope Springs Foundation', hours: 3.0, category: 'Board Development' },
  { date: '2026-03-15', consultant: 'Sarah Kim', client: 'Heritage Arts Collective', hours: 6.0, category: 'Assessment' },
  { date: '2026-03-14', consultant: 'Thomas Park', client: 'Riverside Health Alliance', hours: 2.5, category: 'Planned Giving' },
  { date: '2026-03-14', consultant: 'Jennifer Blake', client: 'Hope Springs Foundation', hours: 3.0, category: 'Feasibility Study' },
  { date: '2026-03-14', consultant: 'Carlos Mendez', client: 'Internal', hours: 4.0, category: 'Project Management' },
  { date: '2026-03-13', consultant: 'Diana Reeves', client: 'Mountain View Academy', hours: 5.0, category: 'Prospect Research' },
  { date: '2026-03-13', consultant: 'Marcus Rivera', client: 'Heritage Arts Collective', hours: 3.5, category: 'Stewardship' },
];

const ONBOARDING_CHECKLIST = [
  { task: 'Welcome packet sent', done: true },
  { task: 'Discovery meeting scheduled', done: true },
  { task: 'Stakeholder interviews completed', done: true },
  { task: 'Data request submitted', done: false },
  { task: 'Assessment template selected', done: false },
  { task: 'Engagement timeline finalized', done: false },
];

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
        <div className="phoenix-card">
          <h3 className="pi-section-title">Recent Time Entries</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                  {['Date', 'Consultant', 'Client', 'Hours', 'Category'].map(h => (
                    <th key={h} className="pi-overline" style={{ textAlign: 'left', padding: '8px 6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_ENTRIES.map((entry, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                    <td className="pi-caption" style={{ padding: '8px 6px' }}>{entry.date}</td>
                    <td className="pi-label" style={{ padding: '8px 6px', fontWeight: 600 }}>{entry.consultant}</td>
                    <td className="pi-body" style={{ padding: '8px 6px', color: 'var(--pi-text-secondary)' }}>{entry.client}</td>
                    <td className="pi-label" style={{ padding: '8px 6px' }}>{entry.hours}h</td>
                    <td className="pi-body-muted" style={{ padding: '8px 6px' }}>{entry.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
