'use client';

import { useState } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { AUDIT_EVENTS, IMPACT_COLORS, CATEGORY_COLORS } from '@/data/prizym-governance/audit';
import { History, Filter } from 'lucide-react';

export default function AuditPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = AUDIT_EVENTS.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    return true;
  });

  const categories = ['all', 'APPROVAL', 'CASE', 'POLICY', 'DOCUMENT'];

  return (
    <PrizymPage title="Audit Trail" subtitle="Immutable event log — governance decisions, approvals, and case activity" mode="oversee">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Events', value: AUDIT_EVENTS.length, color: '#8b5cf6' },
          { label: 'Critical', value: AUDIT_EVENTS.filter(e => e.impactLevel === 'CRITICAL').length, color: '#dc2626' },
          { label: 'High', value: AUDIT_EVENTS.filter(e => e.impactLevel === 'HIGH').length, color: '#f97316' },
          { label: 'Committees', value: AUDIT_EVENTS.filter(e => e.committee).length, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="pg-card" style={{ textAlign: 'center' }}>
            <div className="pg-value-sm" style={{ color: s.color }}>{s.value}</div>
            <div className="pg-caption" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${categoryFilter === c ? (CATEGORY_COLORS[c] ?? 'var(--pg-cyan)') : 'var(--pg-border)'}`,
              background: categoryFilter === c ? `${CATEGORY_COLORS[c] ?? 'var(--pg-cyan)'}18` : 'transparent',
              color: categoryFilter === c ? (CATEGORY_COLORS[c] ?? 'var(--pg-cyan)') : 'var(--pg-text-muted)',
              fontWeight: 600,
              fontSize: 'var(--pg-fs-caption)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {c === 'all' ? `All (${AUDIT_EVENTS.length})` : c.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="pg-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((event, i) => (
            <div
              key={event.id}
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--pg-border-faint)' : 'none',
              }}
            >
              {/* Impact dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: IMPACT_COLORS[event.impactLevel],
                  marginTop: 4,
                }} />
                {i < filtered.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'var(--pg-border-faint)', marginTop: 4 }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <span className="pg-label">{event.action}</span>
                    {event.committee && (
                      <span className="pg-badge" style={{ marginLeft: 8, background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}>
                        {event.committee}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={event.impactLevel} />
                </div>
                <div className="pg-caption" style={{ marginTop: 4 }}>{event.description}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="pg-overline">{event.actor}</span>
                  <span className="pg-caption">{event.actorRole}</span>
                  <span className="pg-caption">{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PrizymPage>
  );
}
