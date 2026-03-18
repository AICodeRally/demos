'use client';

import { useState } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { ALL_POLICIES, getPolicyStats } from '@/data/prizym-governance/policies';
import { Search } from 'lucide-react';

export default function PoliciesPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const stats = getPolicyStats();

  const filtered = ALL_POLICIES.filter(p => {
    if (filter !== 'all' && p.status.toUpperCase() !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const FILTERS = [
    { key: 'all', label: `All (${stats.total})` },
    { key: 'APPROVED', label: `Approved (${stats.approved})` },
    { key: 'DRAFT', label: `Draft (${stats.draft})` },
    { key: 'UNDER_REVIEW', label: `Review (${stats.review})` },
  ];

  return (
    <PrizymPage title="Policy Library" subtitle="17 SCP policies governing sales compensation programs" mode="operate">
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${filter === f.key ? 'var(--pg-cyan)' : 'var(--pg-border)'}`,
              background: filter === f.key ? 'var(--pg-cyan-bg)' : 'transparent',
              color: filter === f.key ? 'var(--pg-cyan)' : 'var(--pg-text-muted)',
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
            placeholder="Search policies..."
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
                <th>Category</th>
                <th>Status</th>
                <th>Version</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="pg-label" style={{ color: 'var(--pg-cyan)' }}>{p.code}</span></td>
                  <td>
                    <div className="pg-label">{p.title}</div>
                    <div className="pg-caption" style={{ marginTop: 2 }}>{p.description}</div>
                  </td>
                  <td><span className="pg-caption">{p.category}</span></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><span className="pg-caption">v{p.version}</span></td>
                  <td><span className="pg-caption">{p.owner}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--pg-text-faint)' }}>
            No policies match your filters
          </div>
        )}
      </div>
    </PrizymPage>
  );
}
