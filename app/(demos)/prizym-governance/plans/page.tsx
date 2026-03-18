'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { PLANS, getPlanStats } from '@/data/prizym-governance/plans';
import { FileText, Clock, CheckCircle2, Edit3 } from 'lucide-react';

export default function PlansPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const stats = getPlanStats();

  return (
    <PrizymPage title="Compensation Plans" subtitle="Active and in-progress compensation plan documents" mode="design">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Plans', value: stats.total, icon: FileText, color: '#06b6d4' },
          { label: 'In Progress', value: stats.inProgress, icon: Edit3, color: '#f59e0b' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: '#10b981' },
          { label: 'Published', value: stats.published, icon: Clock, color: '#8b5cf6' },
        ].map((m, i) => (
          <div
            key={m.label}
            className="pg-card"
            style={{
              textAlign: 'center',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div className="pg-value">{m.value}</div>
            <div className="pg-caption" style={{ marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLANS.map(plan => (
          <div key={plan.id} className="pg-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{plan.planCode}</span>
                <h3 className="pg-subheading" style={{ marginTop: 4 }}>{plan.title}</h3>
              </div>
              <StatusBadge status={plan.status} />
            </div>
            <p className="pg-caption" style={{ marginBottom: 12 }}>{plan.description}</p>

            {/* Progress bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="pg-caption">Completion</span>
                <span className="pg-caption">{plan.completionPercentage}% ({plan.sectionsCompleted}/{plan.sectionsTotal} sections)</span>
              </div>
              <div className="pg-bar-track">
                <div
                  className="pg-bar-fill"
                  style={{
                    width: `${plan.completionPercentage}%`,
                    background: plan.completionPercentage === 100 ? '#10b981' : '#06b6d4',
                  }}
                />
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span className="pg-caption">Owner: {plan.owner}</span>
              <span className="pg-caption">Template: {plan.templateName}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
              {plan.tags.map(t => (
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
