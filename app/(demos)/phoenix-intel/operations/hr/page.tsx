'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CheckCircle2, Circle, AlertTriangle, Shield, Users, Calendar, Laptop } from 'lucide-react';

const TEAM_ROSTER = [
  { name: 'Richard Tollefson', title: 'CEO & Managing Partner', status: 'active', type: 'Full-Time', since: '2008', compliance: 'current' },
  { name: 'Cheryl Tollefson', title: 'COO', status: 'active', type: 'Full-Time', since: '2010', compliance: 'current' },
  { name: 'Dr. Michal Tyra', title: 'Senior Consultant', status: 'active', type: 'Contract', since: '2018', compliance: 'current' },
  { name: 'Kelly Martinez', title: 'Director of Client Services', status: 'active', type: 'Full-Time', since: '2020', compliance: 'current' },
  { name: 'Timmesse Thompson', title: 'Corporate Operations & Events Coordinator', status: 'active', type: 'Full-Time', since: '2023', compliance: 'current' },
  { name: 'Jennifer Blake', title: 'Senior Consultant', status: 'active', type: 'Contract', since: '2019', compliance: 'current' },
  { name: 'Marcus Rivera', title: 'Consultant', status: 'active', type: 'Contract', since: '2021', compliance: 'current' },
  { name: 'Sarah Kim', title: 'Consultant', status: 'active', type: 'Contract', since: '2022', compliance: 'due-soon' },
  { name: 'Thomas Park', title: 'Associate Consultant', status: 'active', type: 'Contract', since: '2023', compliance: 'current' },
  { name: 'Carlos Mendez', title: 'Project Coordinator', status: 'active', type: 'Full-Time', since: '2023', compliance: 'current' },
  { name: 'Diana Reeves', title: 'Research Analyst', status: 'active', type: 'Part-Time', since: '2024', compliance: 'current' },
  { name: 'Evelyn Torres', title: 'Prospect Research & Screening', status: 'active', type: 'Part-Time', since: '2024', compliance: 'current' },
  { name: 'Kris Jacober', title: 'Marketing & Communications Consultant', status: 'active', type: 'Contract', since: '2024', compliance: 'current' },
  { name: 'Natalie Graff', title: 'Executive Coordinator', status: 'active', type: 'Part-Time', since: '2024', compliance: 'current' },
  { name: 'Cassandra Williams', title: 'Business Manager', status: 'active', type: 'Full-Time', since: '2021', compliance: 'current' },
];

const COMPLIANCE_ITEMS = [
  { name: 'Annual Ethics Training', dueDate: '2026-04-15', status: 'upcoming', assignedTo: 'All Staff' },
  { name: 'Cybersecurity Awareness', dueDate: '2026-03-31', status: 'due-soon', assignedTo: 'All Staff' },
  { name: 'Professional License Renewal — Sarah Kim', dueDate: '2026-04-01', status: 'due-soon', assignedTo: 'Sarah Kim' },
  { name: 'W-9 Collection — Contract Consultants', dueDate: '2026-01-31', status: 'complete', assignedTo: 'Kelly Martinez' },
  { name: 'Workers Comp Policy Renewal', dueDate: '2026-06-01', status: 'upcoming', assignedTo: 'Cheryl Tollefson' },
  { name: 'E&O Insurance Review', dueDate: '2026-07-15', status: 'upcoming', assignedTo: 'Richard Tollefson' },
];

const ONBOARDING_TEMPLATES = [
  { name: 'New Consultant Onboarding', steps: 14, avgDays: 21, description: 'Full onboarding: accounts, training, shadow sessions, client introductions' },
  { name: 'Contract Consultant Setup', steps: 8, avgDays: 5, description: 'Limited access: NDA, project brief, time tracking, billing setup' },
  { name: 'Operations Team Member', steps: 12, avgDays: 14, description: 'Systems access, process documentation, payroll setup, vendor contacts' },
];

const IT_ASSETS = [
  { category: 'CRM & Data', tools: ['Knack (NAC Database)', 'Constant Contact', 'DonorSearch', 'Formsite (Surveys)'] },
  { category: 'Email & Comms', tools: ['Outlook (Org)', 'Outlook (Richard)', 'MS Teams (replacing Zoom)', 'Intermedia/MS365'] },
  { category: 'Finance', tools: ['QuickBooks Online', 'Alliance Bank', 'ADP Payroll', 'Amex (Reconciliation)'] },
  { category: 'Project Mgmt', tools: ['SharePoint', 'Monday.com (Recommended)', 'DocuSign (Contracts)', 'InCorp (State Filings)'] },
  { category: 'Deprecated', tools: ['Intervals (→ Telemetry)', 'Dropbox (→ SharePoint)', 'Zoom (→ Teams)'] },
  { category: 'Web & Marketing', tools: ['Phoenix Website (Pixa)', 'Constant Contact', 'Handshake (Interns)'] },
];

export default function HRCompliancePage() {
  const insight = getInsight('operations/hr');

  return (
    <PhoenixPage title="HR & Compliance" subtitle="Team roster, compliance tracking, onboarding, and technology inventory" accentColor="#f59e0b">
      {/* Team Roster */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Team Roster</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)' }}>{TEAM_ROSTER.length} team members</p>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--pi-text-muted)' }}><strong style={{ color: '#10b981' }}>{TEAM_ROSTER.filter(t => t.type === 'Full-Time').length}</strong> FT</span>
            <span style={{ color: 'var(--pi-text-muted)' }}><strong style={{ color: '#3b6bf5' }}>{TEAM_ROSTER.filter(t => t.type === 'Part-Time').length}</strong> PT</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Name', 'Title', 'Type', 'Since', 'Compliance'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_ROSTER.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>{m.name}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-secondary)' }}>{m.title}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>{m.type}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-faint)' }}>{m.since}</td>
                  <td style={{ padding: '10px 8px' }}>
                    {m.compliance === 'current' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Current
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#c9942b', fontSize: '0.8rem', fontWeight: 600 }}>
                        <AlertTriangle size={14} /> Due Soon
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Tracker */}
        <div className="phoenix-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Shield size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Compliance Tracker</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COMPLIANCE_ITEMS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: '1px solid var(--pi-border-faint)',
              }}>
                {item.status === 'complete' ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : item.status === 'due-soon' ? (
                  <AlertTriangle size={16} color="#c9942b" />
                ) : (
                  <Circle size={16} color="var(--pi-text-faint)" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem', fontWeight: 600,
                    color: item.status === 'complete' ? 'var(--pi-text-muted)' : 'var(--pi-text)',
                    textDecoration: item.status === 'complete' ? 'line-through' : 'none',
                  }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)' }}>
                    Due: {item.dueDate} · {item.assignedTo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Templates */}
        <div className="phoenix-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Users size={18} color="#3b6bf5" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Onboarding Templates</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ONBOARDING_TEMPLATES.map((t, i) => (
              <div key={i} style={{
                padding: 12, borderRadius: 8,
                background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
                border: '1px solid var(--pi-border-faint)',
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginBottom: 8 }}>{t.description}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--pi-text-faint)' }}>
                  <span>{t.steps} steps</span>
                  <span>~{t.avgDays} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Inventory */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Laptop size={18} color="#7c3aed" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Technology Inventory</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {IT_ASSETS.map((cat) => (
            <div key={cat.category}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pi-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{cat.category}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cat.tools.map(tool => (
                  <span key={tool} style={{
                    fontSize: '0.85rem', color: 'var(--pi-text-secondary)', padding: '4px 8px',
                    borderRadius: 6, background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
                  }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
