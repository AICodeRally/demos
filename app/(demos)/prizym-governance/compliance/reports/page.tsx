'use client';

import { useState, useEffect } from 'react';
import { REPORTS, type GovernanceReport } from '@/data/prizym-governance/oversee';
import { FileText, Download, Play, Calendar, Clock, User } from 'lucide-react';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { EmptyState } from '@/components/demos/prizym-governance/EmptyState';

const CATEGORY_CONFIG: Record<GovernanceReport['category'], { color: string; label: string }> = {
  performance: { color: 'var(--pg-cyan-bright)', label: 'Performance' },
  compliance: { color: 'var(--pg-oversee-bright)', label: 'Compliance' },
  audit: { color: 'var(--pg-dispute-bright)', label: 'Audit' },
  operational: { color: 'var(--pg-operate-bright)', label: 'Operational' },
};

export default function ReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState<GovernanceReport['category'] | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = categoryFilter === 'all' ? REPORTS : REPORTS.filter(r => r.category === categoryFilter);

  const categories: Array<GovernanceReport['category'] | 'all'> = ['all', 'performance', 'compliance', 'audit', 'operational'];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Reports Library
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Pre-built governance reports with run history and scheduled delivery.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {categories.map(c => {
          const active = categoryFilter === c;
          const count = c === 'all' ? REPORTS.length : REPORTS.filter(r => r.category === c).length;
          const color = c === 'all' ? 'var(--pg-oversee-bright)' : CATEGORY_CONFIG[c].color;
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
                fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      <div
        className="pg-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 6,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No reports match this filter"
            description={`Switch to a different category or clear the "${categoryFilter}" filter to see more.`}
          />
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map((r, i) => {
            const cfg = CATEGORY_CONFIG[r.category];
            return (
              <div
                key={r.id}
                className="pg-card-elevated"
                style={{
                  padding: 18,
                  borderTop: `4px solid ${cfg.color}`,
                  display: 'flex', flexDirection: 'column',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${i * 0.04}s`,
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div className="pg-icon-bubble" style={{ borderColor: cfg.color }}>
                    <FileText size={19} color={cfg.color} strokeWidth={2.4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cfg.label}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', marginTop: 3, lineHeight: 1.3 }}>{r.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#f1f5f9', marginBottom: 12, lineHeight: 1.55, flex: 1 }}>{r.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.18)', fontSize: 14, color: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={14} strokeWidth={2.4} /> {r.schedule}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#f1f5f9' }}><Clock size={14} strokeWidth={2.4} /> Last: {r.lastRun}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><User size={14} strokeWidth={2.4} /> {r.owner}</span>
                    <span style={{ color: '#f1f5f9' }}>{r.pageCount} pages</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => showDemoToast(`Running "${r.title}"…`, 'success')}
                    style={{
                      flex: 1, padding: '10px 14px',
                      background: cfg.color, color: '#0f172a',
                      border: 'none', borderRadius: 8,
                      fontSize: 14, fontWeight: 800, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Play size={14} strokeWidth={2.6} /> Run
                  </button>
                  <button
                    type="button"
                    onClick={() => showDemoToast(`Exporting "${r.title}" as ${r.format[0]}…`, 'info')}
                    style={{
                      flex: 1, padding: '10px 14px',
                      background: 'rgba(0,0,0,0.3)', color: cfg.color,
                      border: `1.5px solid ${cfg.color}`, borderRadius: 8,
                      fontSize: 14, fontWeight: 800, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Download size={14} strokeWidth={2.6} /> {r.format[0]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
