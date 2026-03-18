'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Shield, Link2, Users, CheckCircle, Clock, AlertCircle, ArrowRight, Fingerprint, AlertTriangle, Lock, Globe } from 'lucide-react';
import { CONSULTANTS } from '@/data/phoenix-intel/nonprofit-data';

const CONNECTORS = [
  { name: 'QuickBooks Online', data: 'P&L, AR/AP, invoices, bank transactions, budget vs. actuals', status: 'connected' as const, lastSync: '2026-03-16 08:30', icon: '📊' },
  { name: 'Alliance Bank', data: 'Daily balance monitoring, ACH payments, check deposits (still physical)', status: 'connected' as const, lastSync: '2026-03-17 06:00', icon: '🏦' },
  { name: 'ADP Payroll', data: '1099 contractor payments, tax filings, fringe benefit documentation', status: 'connected' as const, lastSync: '2026-03-16 12:00', icon: '💰' },
  { name: 'MS365 / SharePoint', data: 'Calendar, email, docs, file storage (replacing Dropbox)', status: 'connected' as const, lastSync: '2026-03-16 07:00', icon: '📧' },
  { name: 'Outlook', data: 'Richard personal + Phoenix org — email, scheduling, contact sync', status: 'connected' as const, lastSync: '2026-03-16 07:00', icon: '📬' },
  { name: 'Constant Contact', data: 'Email marketing, newsletters, subscriber lists', status: 'connected' as const, lastSync: '2026-03-16 06:45', icon: '📨' },
  { name: 'Formsite', data: 'Client satisfaction surveys — sent/received/ratings tracking', status: 'connected' as const, lastSync: '2026-03-14 09:00', icon: '📋' },
  { name: 'Knack', data: 'CRM data, 2,500-3,000 contacts — migrating to relational DB', status: 'migrating' as const, lastSync: '2026-03-12 14:00', icon: '🗃️' },
  { name: 'Intervals', data: 'DEPRECATED — replaced by passive telemetry time capture', status: 'deprecated' as const, lastSync: 'Sunset', icon: '⏱️' },
  { name: 'Dropbox', data: 'Legacy file storage — migrating to SharePoint', status: 'deprecated' as const, lastSync: 'Sunset', icon: '📁' },
  { name: 'Zoom', data: 'Video conferencing — migrating to MS Teams (saves $7,500/yr)', status: 'deprecated' as const, lastSync: 'Sunset', icon: '📹' },
];

const DATA_MIGRATIONS = [
  { source: 'Knack', target: 'Relational Database', records: '2,500-3,000 contacts', status: 'In Progress', progress: 35, note: 'AI dedup running — 127 potential duplicates flagged' },
  { source: 'Dropbox', target: 'SharePoint / M365', records: '~8,200 files', status: 'Planning', progress: 10, note: 'MCP connector configured for automated migration' },
  { source: 'Intervals', target: 'Passive Telemetry', records: '18 months history', status: 'Mapping', progress: 20, note: 'Historical data export complete, mapping project codes' },
];

const COMPLIANCE_FRAMEWORKS = [
  { name: 'SOC 2 Type II', status: 'target', desc: 'Service organization controls — required for enterprise nonprofit clients', icon: Shield },
  { name: 'FERPA', status: 'aware', desc: 'Education records privacy — applies to higher-ed advancement work', icon: Lock },
  { name: 'HIPAA', status: 'aware', desc: 'Health data privacy — applies to healthcare nonprofit engagements', icon: Lock },
  { name: 'GDPR', status: 'target', desc: 'International data privacy — applies to any EU-based donor records', icon: Globe },
];

const STATUS_CONFIG = {
  connected: { color: '#10b981', bg: '#10b98120', icon: CheckCircle, label: 'Connected' },
  pending: { color: '#c9942b', bg: '#c9942b20', icon: Clock, label: 'Pending' },
  migrating: { color: '#3b6bf5', bg: '#3b6bf520', icon: AlertCircle, label: 'Migrating' },
  deprecated: { color: '#94a3b8', bg: '#94a3b820', icon: Clock, label: 'Sunset' },
};

export default function AdminPage() {
  const insight = getInsight('admin');

  return (
    <PhoenixPage title="Admin" subtitle="Users, connectors, and system settings" accentColor="#6b7280">
      {/* Users */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Users size={18} color="var(--pi-sapphire)" />
          <h3 className="pi-section-title" style={{ marginBottom: 0 }}>Team Members</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Name', 'Title', 'Specialty', 'Utilization', 'Engagements', 'Email'].map(h => (
                  <th key={h} className="pi-overline" style={{ textAlign: 'left', padding: '8px 6px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONSULTANTS.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td className="pi-label" style={{ padding: '10px 6px' }}>{c.name}</td>
                  <td className="pi-body" style={{ padding: '10px 6px', color: 'var(--pi-text-secondary)' }}>{c.title}</td>
                  <td className="pi-body-muted" style={{ padding: '10px 6px' }}>{c.specialty}</td>
                  <td style={{ padding: '10px 6px' }}>
                    <span className="pi-label" style={{ color: c.utilization > 90 ? '#ef4444' : c.utilization > 80 ? '#c9942b' : '#10b981' }}>{c.utilization}%</span>
                  </td>
                  <td className="pi-body" style={{ padding: '10px 6px' }}>{c.activeEngagements}</td>
                  <td className="pi-caption" style={{ padding: '10px 6px' }}>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connectors */}
      <div className="mb-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Link2 size={18} color="var(--pi-sapphire)" />
          <h3 className="pi-section-title" style={{ marginBottom: 0 }}>Connectors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONNECTORS.map(conn => {
            const config = STATUS_CONFIG[conn.status];
            const StatusIcon = config.icon;
            return (
              <div key={conn.name} className="phoenix-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{conn.icon}</span>
                    <div>
                      <div className="pi-label">{conn.name}</div>
                      <div className="pi-body-muted" style={{ marginTop: 2 }}>{conn.data}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
                  <span className="pi-caption">Last sync: {conn.lastSync}</span>
                  <span className="pi-badge" style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: config.bg, color: config.color,
                  }}>
                    <StatusIcon size={12} /> {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Migrations */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <ArrowRight size={18} color="#3b6bf5" />
          <h3 className="pi-section-title" style={{ marginBottom: 0 }}>Active Data Migrations</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DATA_MIGRATIONS.map((m, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 8,
              background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="pi-label">{m.source}</span>
                  <ArrowRight size={14} color="var(--pi-text-faint)" />
                  <span className="pi-label" style={{ color: '#3b6bf5' }}>{m.target}</span>
                </div>
                <span className="pi-badge" style={{
                  background: m.progress > 25 ? '#3b6bf520' : '#c9942b20',
                  color: m.progress > 25 ? '#3b6bf5' : '#c9942b',
                }}>{m.status}</span>
              </div>
              <div className="pi-caption" style={{ marginBottom: 6 }}>{m.records}</div>
              <div className="pi-bar-track" style={{ height: 6, borderRadius: 3, marginBottom: 6 }}>
                <div className="pi-bar-fill" style={{ width: `${m.progress}%`, background: '#3b6bf5', borderRadius: 3 }} />
              </div>
              <div className="pi-caption">{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Contact Deduplication */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Fingerprint size={18} color="#7c3aed" />
          <h3 className="pi-section-title" style={{ marginBottom: 0 }}>AI Contact Deduplication</h3>
        </div>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Machine learning model scores potential duplicates across Knack, Constant Contact, and Outlook contacts.
          Human review required for matches below 90% confidence.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Record A', 'Record B', 'Source', 'Confidence', 'Action'].map(h => (
                  <th key={h} className="pi-overline" style={{ textAlign: 'left', padding: '8px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { a: 'Dr. Sarah Mitchell', b: 'Sarah M. Mitchell', source: 'Knack ↔ CC', confidence: 97, action: 'Auto-merge' },
                { a: 'Heritage Arts Collective', b: 'Heritage Arts Coll.', source: 'Knack ↔ Outlook', confidence: 94, action: 'Auto-merge' },
                { a: 'Robert Chen', b: 'Bob Chen', source: 'CC ↔ Outlook', confidence: 82, action: 'Review' },
                { a: 'Mountain View Academy', b: 'MV Academy Foundation', source: 'Knack ↔ Knack', confidence: 71, action: 'Review' },
                { a: 'Jennifer Nguyen', b: 'Jenny Nguyen-Park', source: 'CC ↔ CC', confidence: 58, action: 'Review' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td className="pi-label" style={{ padding: '8px', fontWeight: 600 }}>{row.a}</td>
                  <td className="pi-body" style={{ padding: '8px', color: 'var(--pi-text-secondary)' }}>{row.b}</td>
                  <td className="pi-caption" style={{ padding: '8px' }}>{row.source}</td>
                  <td style={{ padding: '8px' }}>
                    <span className="pi-label" style={{
                      color: row.confidence >= 90 ? '#10b981' : row.confidence >= 70 ? '#c9942b' : '#ef4444',
                    }}>{row.confidence}%</span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span className="pi-badge" style={{
                      background: row.action === 'Auto-merge' ? '#10b98120' : '#c9942b20',
                      color: row.action === 'Auto-merge' ? '#10b981' : '#c9942b',
                    }}>{row.action}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pi-caption" style={{ display: 'flex', gap: 16, marginTop: 12, borderTop: '1px solid var(--pi-border-faint)', paddingTop: 10 }}>
          <span><strong style={{ color: 'var(--pi-text)' }}>127</strong> potential dupes flagged</span>
          <span><strong style={{ color: '#10b981' }}>84</strong> auto-merged (&gt;90%)</span>
          <span><strong style={{ color: '#c9942b' }}>43</strong> awaiting review</span>
        </div>
      </div>

      {/* Data Compliance & Privacy */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Lock size={18} color="#ef4444" />
          <h3 className="pi-section-title" style={{ marginBottom: 0 }}>Data Compliance & Privacy</h3>
        </div>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Phoenix handles sensitive donor data across education, healthcare, and faith-based nonprofits. AI capabilities require private LLM deployment — no client data may traverse public APIs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: 16 }}>
          {COMPLIANCE_FRAMEWORKS.map((f, i) => {
            const FIcon = f.icon;
            return (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 8,
                borderLeft: `3px solid ${f.status === 'target' ? '#ef4444' : '#c9942b'}`,
                background: f.status === 'target' ? '#ef444408' : '#c9942b08',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <FIcon size={14} color={f.status === 'target' ? '#ef4444' : '#c9942b'} />
                  <span className="pi-label">{f.name}</span>
                  <span className="pi-badge" style={{
                    background: f.status === 'target' ? '#ef444420' : '#c9942b20',
                    color: f.status === 'target' ? '#ef4444' : '#c9942b',
                  }}>{f.status === 'target' ? 'Target' : 'Awareness'}</span>
                </div>
                <div className="pi-caption">{f.desc}</div>
              </div>
            );
          })}
        </div>
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: '#7c3aed08', border: '1px solid #7c3aed20',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Shield size={14} color="#7c3aed" />
            <span className="pi-label" style={{ color: '#7c3aed' }}>Private LLM Requirement</span>
          </div>
          <p className="pi-caption" style={{ margin: 0 }}>
            All AI features (advisor, dedup, auto-tagging) run on a private, SOC 2-compliant LLM deployment. No donor PII, engagement data, or financial information is sent to public AI APIs. Model hosted within Phoenix&apos;s Azure tenant with RBAC access controls.
          </p>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
