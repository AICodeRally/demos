'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { GaugeChart } from '@/components/demos/prizym-governance/StatusBadge';
import { COMPLIANCE_CONTROLS, getComplianceScore, type ComplianceControl } from '@/data/prizym-governance/oversee';
import { ShieldCheck, AlertTriangle, XCircle, Clock, FileCheck } from 'lucide-react';

const STATUS_CONFIG: Record<ComplianceControl['status'], { label: string; color: string; icon: typeof ShieldCheck }> = {
  compliant: { label: 'Compliant', color: '#10b981', icon: ShieldCheck },
  at_risk: { label: 'At Risk', color: '#f59e0b', icon: AlertTriangle },
  non_compliant: { label: 'Non-Compliant', color: '#ef4444', icon: XCircle },
  not_tested: { label: 'Not Tested', color: '#64748b', icon: Clock },
};

export default function CompliancePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const score = getComplianceScore();
  const categories = Array.from(new Set(COMPLIANCE_CONTROLS.map(c => c.category)));
  const filtered = categoryFilter === 'all'
    ? COMPLIANCE_CONTROLS
    : COMPLIANCE_CONTROLS.filter(c => c.category === categoryFilter);

  const counts = {
    compliant: COMPLIANCE_CONTROLS.filter(c => c.status === 'compliant').length,
    at_risk: COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk').length,
    non_compliant: COMPLIANCE_CONTROLS.filter(c => c.status === 'non_compliant').length,
    not_tested: COMPLIANCE_CONTROLS.filter(c => c.status === 'not_tested').length,
  };

  return (
    <PrizymPage title="Compliance Dashboard" subtitle="SOX controls, wage law, tax, data security — unified compliance view" mode="oversee">
      {/* Score hero */}
      <div className="pg-card-elevated" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <GaugeChart value={score} size={160} strokeWidth={14} color="#8b5cf6" label="Compliance" />

          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 className="pg-heading" style={{ marginBottom: 8 }}>Program Compliance Score</h2>
            <p className="pg-caption" style={{ marginBottom: 16, lineHeight: 1.6 }}>
              Weighted score across {COMPLIANCE_CONTROLS.length} controls in {categories.length} categories.
              SOX / ICFR, wage and hour, tax, and data security.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {Object.entries(counts).map(([k, v]) => {
                const cfg = STATUS_CONFIG[k as ComplianceControl['status']];
                return (
                  <div key={k} style={{ padding: 10, borderRadius: 8, background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: cfg.color }}>{v}</div>
                    <div style={{ fontSize: 14, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{cfg.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setCategoryFilter('all')}
          style={{
            padding: '8px 16px', borderRadius: 20,
            background: categoryFilter === 'all' ? 'rgba(139,92,246,0.2)' : 'var(--pg-stripe)',
            border: categoryFilter === 'all' ? '1px solid rgba(139,92,246,0.6)' : '1px solid var(--pg-border)',
            color: categoryFilter === 'all' ? 'var(--pg-oversee)' : 'var(--pg-text-muted)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          All ({COMPLIANCE_CONTROLS.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              background: categoryFilter === cat ? 'rgba(139,92,246,0.2)' : 'var(--pg-stripe)',
              border: categoryFilter === cat ? '1px solid rgba(139,92,246,0.6)' : '1px solid var(--pg-border)',
              color: categoryFilter === cat ? 'var(--pg-oversee)' : 'var(--pg-text-muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {cat} ({COMPLIANCE_CONTROLS.filter(c => c.category === cat).length})
          </button>
        ))}
      </div>

      {/* Controls table */}
      <div className="pg-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pg-surface-alt)', borderBottom: '1px solid var(--pg-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Control</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Tested</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const cfg = STATUS_CONFIG[c.status];
                const Icon = cfg.icon;
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom: '1px solid var(--pg-border-faint)',
                      opacity: mounted ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                      transitionDelay: `${i * 0.03}s`,
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div className="pg-overline" style={{ color: 'var(--pg-oversee)', fontSize: 14 }}>{c.code}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginTop: 2 }}>{c.name}</div>
                      <div className="pg-caption" style={{ fontSize: 14, marginTop: 2 }}>{c.relatedPolicy}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--pg-text-secondary)' }}>{c.category}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 12,
                        background: `${cfg.color}18`, color: cfg.color,
                        fontSize: 14, fontWeight: 600,
                      }}>
                        <Icon size={14} /> {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--pg-text-secondary)' }}>{c.owner}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--pg-text-muted)' }}>{c.lastTested}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--pg-text-secondary)' }}>
                        <FileCheck size={14} /> {c.evidence}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PrizymPage>
  );
}
