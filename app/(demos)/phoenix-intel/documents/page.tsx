'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { FolderOpen, FileText, AlertCircle, File, FileCheck, Archive } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'template' | 'contract' | 'proposal' | 'report' | 'policy';
  client: string;
  lastModified: string;
  owner: string;
  status: 'draft' | 'active' | 'archived';
}

const DOCUMENTS: Document[] = [
  { id: 'doc-1', name: 'Capital Campaign Proposal Template', type: 'template', client: '—', lastModified: '2026-03-14', owner: 'Kelly Martinez', status: 'active' },
  { id: 'doc-2', name: 'Hope Springs Engagement Contract', type: 'contract', client: 'Hope Springs Foundation', lastModified: '2026-03-10', owner: 'Kelly Martinez', status: 'active' },
  { id: 'doc-3', name: 'Riverside Health Major Gifts Proposal', type: 'proposal', client: 'Riverside Health Alliance', lastModified: '2026-02-28', owner: 'Jennifer Blake', status: 'active' },
  { id: 'doc-4', name: 'Heritage Arts Assessment Report', type: 'report', client: 'Heritage Arts Collective', lastModified: '2026-03-12', owner: 'Sarah Kim', status: 'active' },
  { id: 'doc-5', name: 'Mountain View Campaign Case Statement', type: 'proposal', client: 'Mountain View Academy', lastModified: '2026-03-08', owner: 'Jennifer Blake', status: 'active' },
  { id: 'doc-6', name: 'Standard Consulting Agreement Template', type: 'template', client: '—', lastModified: '2026-01-15', owner: 'Kelly Martinez', status: 'active' },
  { id: 'doc-7', name: 'Faith & Light Stewardship Contract', type: 'contract', client: 'Faith & Light Ministries', lastModified: '2026-01-20', owner: 'Kelly Martinez', status: 'active' },
  { id: 'doc-8', name: 'Board Presentation Template', type: 'template', client: '—', lastModified: '2026-02-05', owner: 'Marcus Rivera', status: 'active' },
  { id: 'doc-9', name: 'Sonoran State Campaign Progress Report', type: 'report', client: 'Sonoran State University', lastModified: '2026-03-01', owner: 'Jennifer Blake', status: 'active' },
  { id: 'doc-10', name: 'Pacific Crest Feasibility Proposal', type: 'proposal', client: 'Pacific Crest College', lastModified: '2026-02-18', owner: 'Marcus Rivera', status: 'active' },
  { id: 'doc-11', name: 'Data Privacy & Donor Compliance Policy', type: 'policy', client: '—', lastModified: '2025-11-20', owner: 'Kelly Martinez', status: 'active' },
  { id: 'doc-12', name: 'SafeHaven Advancement Assessment Draft', type: 'proposal', client: 'SafeHaven Social Services', lastModified: '2026-03-15', owner: 'Jennifer Blake', status: 'draft' },
  { id: 'doc-13', name: 'Annual Fund Optimization Template', type: 'template', client: '—', lastModified: '2025-12-10', owner: 'Thomas Park', status: 'active' },
  { id: 'doc-14', name: 'Riverside Health Q4 Assessment Report', type: 'report', client: 'Riverside Health Alliance', lastModified: '2025-10-30', owner: 'Jennifer Blake', status: 'archived' },
  { id: 'doc-15', name: 'Conflict of Interest & Ethics Policy', type: 'policy', client: '—', lastModified: '2025-09-15', owner: 'Kelly Martinez', status: 'archived' },
];

const TYPE_LABEL: Record<Document['type'], string> = {
  template: 'Template',
  contract: 'Contract',
  proposal: 'Proposal',
  report: 'Report',
  policy: 'Policy',
};

const TYPE_COLOR: Record<Document['type'], string> = {
  template: '#7c3aed',
  contract: '#3b6bf5',
  proposal: '#10b981',
  report: '#c9942b',
  policy: '#64748b',
};

const STATUS_ICON = { draft: File, active: FileCheck, archived: Archive };
const STATUS_COLOR = { draft: '#f59e0b', active: '#10b981', archived: 'var(--pi-text-faint)' };

export default function DocumentsPage() {
  const insight = getInsight('documents');

  const total = DOCUMENTS.length;
  const templates = DOCUMENTS.filter(d => d.type === 'template').length;
  const contracts = DOCUMENTS.filter(d => d.type === 'contract').length;
  const proposals = DOCUMENTS.filter(d => d.type === 'proposal').length;

  return (
    <PhoenixPage title="Document Library" subtitle="Centralized document management for Phoenix Philanthropy Group" accentColor="#7c3aed">
      {/* Pain Point */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#ef444408', border: '1px solid #ef444420', fontSize: '0.85rem', color: 'var(--pi-text-muted)',
      }}>
        <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
        <span><strong style={{ color: '#ef4444' }}>Pain point:</strong> Documents previously scattered across Dropbox, email attachments, and local drives. Kelly (Director of Client Services) manages contracts manually — version confusion and missed renewals are common.</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Documents', value: String(total), icon: FolderOpen, color: '#7c3aed' },
          { label: 'Templates', value: String(templates), icon: FileText, color: '#3b6bf5' },
          { label: 'Contracts', value: String(contracts), icon: FileCheck, color: '#10b981' },
          { label: 'Proposals', value: String(proposals), icon: File, color: '#c9942b' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{m.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Document Table */}
      <div className="phoenix-card" style={{ overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>All Documents</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--pi-border-faint)' }}>
              {['Name', 'Type', 'Client', 'Last Modified', 'Owner', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map(doc => {
              const SIcon = STATUS_ICON[doc.status];
              return (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td style={{ padding: '10px 10px', color: 'var(--pi-text)', fontWeight: 600 }}>{doc.name}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, background: `${TYPE_COLOR[doc.type]}18`, color: TYPE_COLOR[doc.type] }}>
                      {TYPE_LABEL[doc.type]}
                    </span>
                  </td>
                  <td style={{ padding: '10px 10px', color: 'var(--pi-text-muted)' }}>{doc.client}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--pi-text-muted)' }}>{doc.lastModified}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--pi-text-muted)' }}>{doc.owner}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <SIcon size={12} color={STATUS_COLOR[doc.status]} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: STATUS_COLOR[doc.status], textTransform: 'capitalize' }}>{doc.status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {insight && <div style={{ marginTop: 20 }}><AIInsightCard>{insight.text}</AIInsightCard></div>}
    </PhoenixPage>
  );
}
