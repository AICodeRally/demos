'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { PLAN_TEMPLATES } from '@/data/prizym-governance/plans';
import { LayoutTemplate, Award, Layers, ArrowRight } from 'lucide-react';

export default function TemplatesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage title="Plan Templates" subtitle="Gold-standard templates for compensation plan creation" mode="design">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PLAN_TEMPLATES.map((tpl, i) => (
          <div
            key={tpl.id}
            className="pg-card-elevated"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.1}s`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <div className="pg-icon-bubble" style={{ background: 'var(--pg-cyan-bg)' }}>
                <LayoutTemplate size={22} color="var(--pg-cyan)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{tpl.code}</span>
                  <StatusBadge status={tpl.status} />
                </div>
                <h3 className="pg-subheading" style={{ marginTop: 4 }}>{tpl.name}</h3>
              </div>
            </div>

            <p className="pg-caption" style={{ marginBottom: 14, lineHeight: 1.6 }}>{tpl.description}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10, padding: '10px 14px', borderRadius: 8, background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border-faint)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={14} color="var(--pg-gold)" />
                <span className="pg-caption" style={{ color: 'var(--pg-gold)', fontWeight: 700 }}>{tpl.tier}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={14} color="var(--pg-text-faint)" />
                <span className="pg-caption">{tpl.sectionCount} sections</span>
              </div>
              <span className="pg-caption">v{tpl.version}</span>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tpl.tags.map(t => (
                <span key={t} className="pg-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrizymPage>
  );
}
