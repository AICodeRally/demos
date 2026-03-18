'use client';

import { useState } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { ALL_DOCUMENTS, DOCUMENT_COUNTS, DOC_TYPE_COLORS } from '@/data/prizym-governance/documents';
import { Search } from 'lucide-react';

export default function DocumentsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ALL_DOCUMENTS.filter(d => {
    if (typeFilter !== 'all' && d.documentType !== typeFilter) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.documentCode.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TYPE_FILTERS = [
    { key: 'all', label: `All (${DOCUMENT_COUNTS.TOTAL})` },
    { key: 'FRAMEWORK', label: `Frameworks (${DOCUMENT_COUNTS.FRAMEWORK})` },
    { key: 'POLICY', label: `Policies (${DOCUMENT_COUNTS.POLICY})` },
    { key: 'PROCEDURE', label: `Procedures (${DOCUMENT_COUNTS.PROCEDURE})` },
    { key: 'TEMPLATE', label: `Templates (${DOCUMENT_COUNTS.TEMPLATE})` },
    { key: 'GUIDE', label: `Guides (${DOCUMENT_COUNTS.GUIDE})` },
  ];

  return (
    <PrizymPage title="Document Library" subtitle={`${DOCUMENT_COUNTS.TOTAL} governance documents across 6 categories`} mode="operate">
      {/* Type stats bar */}
      <div className="pg-card mb-4" role="region" aria-label="Document type breakdown">
        <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', height: 8 }}>
          {Object.entries(DOCUMENT_COUNTS).filter(([k]) => k !== 'TOTAL').map(([type, count]) => (
            <div
              key={type}
              style={{
                width: `${(count / DOCUMENT_COUNTS.TOTAL) * 100}%`,
                background: DOC_TYPE_COLORS[type] ?? '#64748b',
                minWidth: count > 0 ? 4 : 0,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {Object.entries(DOCUMENT_COUNTS).filter(([k]) => k !== 'TOTAL').map(([type, count]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: DOC_TYPE_COLORS[type] ?? '#64748b' }} />
              <span className="pg-caption">{type.charAt(0) + type.slice(1).toLowerCase()} ({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {TYPE_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setTypeFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${typeFilter === f.key ? (DOC_TYPE_COLORS[f.key] ?? 'var(--pg-cyan)') : 'var(--pg-border)'}`,
              background: typeFilter === f.key ? `${DOC_TYPE_COLORS[f.key] ?? 'var(--pg-cyan)'}18` : 'transparent',
              color: typeFilter === f.key ? (DOC_TYPE_COLORS[f.key] ?? 'var(--pg-cyan)') : 'var(--pg-text-muted)',
              fontWeight: 600,
              fontSize: 'var(--pg-fs-caption)',
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pg-text-faint)' }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '6px 10px 6px 30px',
              borderRadius: 6,
              border: '1px solid var(--pg-border)',
              background: 'var(--pg-surface-alt)',
              color: 'var(--pg-text)',
              fontSize: 'var(--pg-fs-caption)',
              width: 200,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="pg-card">
        <div className="pg-table-wrap">
          <table className="pg-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Version</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.documentCode}>
                  <td><span className="pg-label" style={{ color: DOC_TYPE_COLORS[d.documentType] ?? 'var(--pg-cyan)' }}>{d.documentCode}</span></td>
                  <td>
                    <div className="pg-label">{d.title}</div>
                    <div className="pg-caption" style={{ marginTop: 2 }}>{d.description}</div>
                  </td>
                  <td>
                    <span className="pg-badge" style={{ background: `${DOC_TYPE_COLORS[d.documentType]}18`, color: DOC_TYPE_COLORS[d.documentType], border: `1px solid ${DOC_TYPE_COLORS[d.documentType]}40` }}>
                      {d.documentType}
                    </span>
                  </td>
                  <td><StatusBadge status={d.status} /></td>
                  <td><span className="pg-caption">v{d.version}</span></td>
                  <td><span className="pg-caption">{d.owner}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pg-text-faint)' }}>No documents match your filters</div>
        )}
      </div>
    </PrizymPage>
  );
}
