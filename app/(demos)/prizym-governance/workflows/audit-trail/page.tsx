'use client';

import { useState, useEffect } from 'react';
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

  const stats = [
    { label: 'Total Events', value: AUDIT_EVENTS.length, color: 'var(--pg-oversee-bright)', icon: Activity },
    { label: 'Critical', value: AUDIT_EVENTS.filter(e => e.impactLevel === 'CRITICAL').length, color: 'var(--pg-danger-bright)', icon: AlertTriangle },
    { label: 'High', value: AUDIT_EVENTS.filter(e => e.impactLevel === 'HIGH').length, color: 'var(--pg-warning-bright)', icon: Shield },
    { label: 'Committees', value: AUDIT_EVENTS.filter(e => e.committee).length, color: 'var(--pg-success-bright)', icon: History },
  ];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Audit Trail
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Immutable event log — governance decisions, approvals, and case activity.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="pg-card-elevated"
            style={{
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <div className="pg-icon-bubble" style={{ borderColor: s.color }}>
              <s.icon size={19} color={s.color} strokeWidth={2.4} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {categories.map(c => {
          const active = categoryFilter === c;
          const color = c === 'all' ? 'var(--pg-cyan-bright)' : (CATEGORY_COLORS[c] ?? 'var(--pg-cyan-bright)');
          return (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                border: active ? `1.5px solid ${color}` : '1px solid rgba(255,255,255,0.2)',
                color: active ? color : '#ffffff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {c === 'all' ? `All (${AUDIT_EVENTS.length})` : c.toLowerCase()}
            </button>
          );
        })}
      </div>

      <div className="pg-card-elevated" style={{ padding: 18, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
          {filtered.map((event, i) => (
            <div
              key={event.id}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 0',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.16)' : 'none',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.15 + i * 0.03}s`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: IMPACT_COLORS[event.impactLevel],
                  boxShadow: `0 0 10px ${IMPACT_COLORS[event.impactLevel]}88`,
                  border: '2px solid rgba(255,255,255,0.28)',
                  marginTop: 4,
                }} />
                {i < filtered.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.18)', marginTop: 4 }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>{event.action}</span>
                    {event.committee && (
                      <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(196,181,253,0.18)', color: 'var(--pg-oversee-bright)', border: '1px solid var(--pg-oversee-bright)', fontSize: 13, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {event.committee}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={event.impactLevel} />
                </div>
                <div style={{ fontSize: 15, color: '#ffffff', marginTop: 4, lineHeight: 1.5 }}>{event.description}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{event.actor}</span>
                  <span style={{ fontSize: 14, color: '#f1f5f9' }}>{event.actorRole}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
