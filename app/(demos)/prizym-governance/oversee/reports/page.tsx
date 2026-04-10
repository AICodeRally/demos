'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { REPORTS, type GovernanceReport } from '@/data/prizym-governance/oversee';
import { FileText, Download, Play, Calendar, Clock, User } from 'lucide-react';

const CATEGORY_CONFIG: Record<GovernanceReport['category'], { color: string; label: string }> = {
  performance: { color: '#06b6d4', label: 'Performance' },
  compliance: { color: '#8b5cf6', label: 'Compliance' },
  audit: { color: '#6366f1', label: 'Audit' },
  operational: { color: '#3b82f6', label: 'Operational' },
};

export default function ReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState<GovernanceReport['category'] | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = categoryFilter === 'all' ? REPORTS : REPORTS.filter(r => r.category === categoryFilter);

  const categories: Array<GovernanceReport['category'] | 'all'> = ['all', 'performance', 'compliance', 'audit', 'operational'];

  return (
    <PrizymPage title="Reports Library" subtitle="Pre-built governance reports with run history and scheduled delivery" mode="oversee">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(c => {
          const active = categoryFilter === c;
          const count = c === 'all' ? REPORTS.length : REPORTS.filter(r => r.category === c).length;
          const color = c === 'all' ? '#8b5cf6' : CATEGORY_CONFIG[c].color;
          return (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                background: active ? `${color}20` : 'var(--pg-stripe)',
                border: active ? `1px solid ${color}60` : '1px solid var(--pg-border)',
                color: active ? color : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r, i) => {
          const cfg = CATEGORY_CONFIG[r.category];
          return (
            <div
              key={r.id}
              className="pg-card-elevated"
              style={{
                borderTop: `3px solid ${cfg.color}`,
                display: 'flex', flexDirection: 'column',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FileText size={18} style={{ color: cfg.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="pg-overline" style={{ color: cfg.color, fontSize: 14 }}>{cfg.label}</span>
                  <h3 className="pg-subheading" style={{ fontSize: 15, marginTop: 4, lineHeight: 1.3 }}>{r.title}</h3>
                </div>
              </div>
              <p className="pg-caption" style={{ marginBottom: 12, lineHeight: 1.55, flex: 1 }}>{r.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 0', borderTop: '1px solid var(--pg-border-faint)', fontSize: 14, color: 'var(--pg-text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={10} /> {r.schedule}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> Last: {r.lastRun}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={10} /> {r.owner}</span>
                  <span>{r.pageCount} pages</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  style={{
                    flex: 1, padding: '8px 12px',
                    background: cfg.color, color: '#fff',
                    border: 'none', borderRadius: 6,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Play size={12} /> Run
                </button>
                <button
                  style={{
                    flex: 1, padding: '8px 12px',
                    background: 'transparent', color: cfg.color,
                    border: `1px solid ${cfg.color}60`, borderRadius: 6,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Download size={12} /> {r.format[0]}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
