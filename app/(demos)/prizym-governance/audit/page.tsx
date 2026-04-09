'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { AUDIT_EVENTS, IMPACT_COLORS, CATEGORY_COLORS } from '@/data/prizym-governance/audit';
import { History, Shield, AlertTriangle, Activity } from 'lucide-react';

export default function AuditPage() {
  const [mounted, setMounted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  useEffect(() => { setMounted(true); }, []);

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
          { label: 'Total Events', value: AUDIT_EVENTS.length, color: '#8b5cf6', icon: Activity },
          { label: 'Critical', value: AUDIT_EVENTS.filter(e => e.impactLevel === 'CRITICAL').length, color: '#dc2626', icon: AlertTriangle },
          { label: 'High', value: AUDIT_EVENTS.filter(e => e.impactLevel === 'HIGH').length, color: '#f97316', icon: Shield },
          { label: 'Committees', value: AUDIT_EVENTS.filter(e => e.committee).length, color: '#10b981', icon: History },
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

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            className="pg-filter-btn"
            data-active={categoryFilter === c ? 'true' : undefined}
            onClick={() => setCategoryFilter(c)}
            style={categoryFilter === c ? {
              borderColor: CATEGORY_COLORS[c] ?? 'var(--pg-cyan)',
              background: `${CATEGORY_COLORS[c] ?? 'var(--pg-cyan)'}12`,
              color: CATEGORY_COLORS[c] ?? 'var(--pg-cyan)',
            } : undefined}
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
                gap: 14,
                padding: '14px 0',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--pg-border-faint)' : 'none',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.04}s`,
              }}
            >
              {/* Impact dot + timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: IMPACT_COLORS[event.impactLevel],
                  boxShadow: `0 0 8px ${IMPACT_COLORS[event.impactLevel]}40`,
                  marginTop: 4,
                }} />
                {i < filtered.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'var(--pg-border-faint)', marginTop: 4 }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pg-label">{event.action}</span>
                    {event.committee && (
                      <span className="pg-badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}>
                        {event.committee}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={event.impactLevel} />
                </div>
                <div className="pg-caption" style={{ marginTop: 4, lineHeight: 1.5 }}>{event.description}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{event.actor}</span>
                  <span className="pg-caption">{event.actorRole}</span>
                  <span className="pg-caption" style={{ fontWeight: 600 }}>{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PrizymPage>
  );
}
