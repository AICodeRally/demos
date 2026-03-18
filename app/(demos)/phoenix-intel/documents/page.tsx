'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCard } from '@/components/demos/phoenix-intel/MetricCard';
import { DataTable } from '@/components/demos/phoenix-intel/DataTable';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { FolderOpen, FileText, File, FileCheck, Archive } from 'lucide-react';

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
  template: 'Template', contract: 'Contract', proposal: 'Proposal', report: 'Report', policy: 'Policy',
};

const TYPE_COLOR: Record<Document['type'], string> = {
  template: '#7c3aed', contract: '#3b6bf5', proposal: '#10b981', report: '#c9942b', policy: '#64748b',
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
      <Alert variant="danger">
        <strong style={{ color: '#ef4444' }}>Pain point:</strong> Documents previously scattered across Dropbox, email attachments, and local drives. Kelly (Director of Client Services) manages contracts manually — version confusion and missed renewals are common.
      </Alert>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Document summary">
        <MetricCard label="Total Documents" value={String(total)} icon={FolderOpen} color="#7c3aed" />
        <MetricCard label="Templates" value={String(templates)} icon={FileText} color="#3b6bf5" />
        <MetricCard label="Contracts" value={String(contracts)} icon={FileCheck} color="#10b981" />
        <MetricCard label="Proposals" value={String(proposals)} icon={File} color="#c9942b" />
      </div>

      {/* Document Table */}
      <div className="phoenix-card">
        <h3 className="pi-section-title">All Documents</h3>
        <DataTable
          data={DOCUMENTS}
          keyFn={(doc) => doc.id}
          emptyMessage="No documents found"
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (doc) => <span className="pi-label" style={{ fontWeight: 600 }}>{doc.name}</span>,
            },
            {
              key: 'type',
              header: 'Type',
              render: (doc) => (
                <span className="pi-badge" style={{ background: `${TYPE_COLOR[doc.type]}18`, color: TYPE_COLOR[doc.type] }}>
                  {TYPE_LABEL[doc.type]}
                </span>
              ),
            },
            {
              key: 'client',
              header: 'Client',
              hideSm: true,
              render: (doc) => <span className="pi-body-muted">{doc.client}</span>,
            },
            {
              key: 'lastModified',
              header: 'Last Modified',
              hideSm: true,
              render: (doc) => <span className="pi-body-muted">{doc.lastModified}</span>,
            },
            {
              key: 'owner',
              header: 'Owner',
              hideSm: true,
              render: (doc) => <span className="pi-body-muted">{doc.owner}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (doc) => {
                const SIcon = STATUS_ICON[doc.status];
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SIcon size={12} color={STATUS_COLOR[doc.status]} aria-hidden="true" />
                    <span className="pi-overline" style={{ color: STATUS_COLOR[doc.status], textTransform: 'capitalize' }}>{doc.status}</span>
                  </div>
                );
              },
            },
          ]}
        />
      </div>

      {insight && <div style={{ marginTop: 20 }}><AIInsightCard>{insight.text}</AIInsightCard></div>}
    </PhoenixPage>
  );
}
