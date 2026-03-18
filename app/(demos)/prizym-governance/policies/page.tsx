'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge, GaugeChart } from '@/components/demos/prizym-governance/StatusBadge';
import { ALL_POLICIES, getPolicyStats } from '@/data/prizym-governance/policies';
import { Search, Shield, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function PoliciesPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  useEffect(() => { setMounted(true); }, []);
  const stats = getPolicyStats();

  const filtered = ALL_POLICIES.filter(p => {
    if (filter !== 'all' && p.status.toUpperCase() !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const FILTERS = [
    { key: 'all', label: `All (${stats.total})`, color: 'var(--pg-cyan)' },
    { key: 'APPROVED', label: `Approved (${stats.approved})`, color: '#10b981' },
    { key: 'DRAFT', label: `Draft (${stats.draft})`, color: '#f59e0b' },
    { key: 'UNDER_REVIEW', label: `Review (${stats.review})`, color: '#8b5cf6' },
  ];

  return (
    <PrizymPage title="Policy Library" subtitle="17 SCP policies governing sales compensation programs" mode="operate">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Shield, label: 'Total Policies', value: stats.total, color: '#06b6d4' },
          { icon: CheckCircle2, label: 'Approved', value: stats.approved, color: '#10b981' },
          { icon: AlertCircle, label: 'Drafts', value: stats.draft, color: '#f59e0b' },
          { icon: Clock, label: 'Under Review', value: stats.review, color: '#8b5cf6' },
        ].map((s, i) => (
          <div
            key={s.label}
            className="pg-card"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <div className="pg-icon-bubble" style={{ background: `${s.color}18` }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div className="pg-value-sm" style={{ color: s.color }}>{s.value}</div>
              <div className="pg-caption">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className="pg-filter-btn"
            data-active={filter === f.key ? 'true' : undefined}
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? { borderColor: f.color, background: `${f.color}12`, color: f.color } : undefined}
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
            className="pg-search"
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
