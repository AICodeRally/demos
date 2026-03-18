'use client';

import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { PLAN_TEMPLATES } from '@/data/prizym-governance/plans';
import { LayoutTemplate, Award, Layers } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <PrizymPage title="Plan Templates" subtitle="Gold-standard templates for compensation plan creation" mode="design">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLAN_TEMPLATES.map(tpl => (
          <div key={tpl.id} className="pg-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ background: 'var(--pg-cyan-bg)', borderRadius: 8, padding: 8, display: 'flex' }}>
                <LayoutTemplate size={20} color="var(--pg-cyan)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{tpl.code}</span>
                  <StatusBadge status={tpl.status} />
                </div>
                <h3 className="pg-subheading" style={{ marginTop: 4 }}>{tpl.name}</h3>
              </div>
            </div>

            <p className="pg-caption" style={{ marginBottom: 12 }}>{tpl.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Award size={12} color="var(--pg-gold)" />
                <span className="pg-caption" style={{ color: 'var(--pg-gold)' }}>{tpl.tier}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Layers size={12} color="var(--pg-text-faint)" />
                <span className="pg-caption">{tpl.sectionCount} sections</span>
              </div>
              <span className="pg-caption">v{tpl.version}</span>
            </div>

            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {tpl.tags.map(t => (
                <span key={t} style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)', fontSize: 'var(--pg-fs-overline)', color: 'var(--pg-text-faint)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrizymPage>
  );
}
