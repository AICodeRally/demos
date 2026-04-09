'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge, MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { PLANS, getPlanStats } from '@/data/prizym-governance/plans';
import { FileText, Clock, CheckCircle2, Edit3, Tag } from 'lucide-react';

export default function PlansPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const stats = getPlanStats();

  return (
    <PrizymPage title="Compensation Plans" subtitle="Active and in-progress compensation plan documents" mode="design">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Plans', value: String(stats.total), icon: FileText, color: '#06b6d4' },
          { label: 'In Progress', value: String(stats.inProgress), icon: Edit3, color: '#f59e0b' },
          { label: 'Approved', value: String(stats.approved), icon: CheckCircle2, color: '#10b981' },
          { label: 'Published', value: String(stats.published), icon: Clock, color: '#8b5cf6' },
        ].map((m, i) => (
          <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className="pg-card-elevated"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${0.3 + i * 0.1}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{plan.planCode}</span>
                <h3 className="pg-subheading" style={{ marginTop: 4 }}>{plan.title}</h3>
              </div>
              <StatusBadge status={plan.status} />
            </div>
            <p className="pg-caption" style={{ marginBottom: 14 }}>{plan.description}</p>

            {/* Progress bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="pg-caption">Completion</span>
                <span className="pg-label" style={{ color: plan.completionPercentage === 100 ? '#10b981' : '#06b6d4', fontSize: 'var(--pg-fs-caption)' }}>
                  {plan.completionPercentage}% ({plan.sectionsCompleted}/{plan.sectionsTotal} sections)
                </span>
              </div>
              <div className="pg-bar-track-lg">
                <div
                  className="pg-bar-fill"
                  style={{
                    width: mounted ? `${plan.completionPercentage}%` : '0%',
                    background: plan.completionPercentage === 100
                      ? 'linear-gradient(90deg, #10b981, #06d6a0)'
                      : 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                    height: '100%',
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <span className="pg-caption">Owner: <strong>{plan.owner}</strong></span>
              <span className="pg-caption">Template: <strong>{plan.templateName}</strong></span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {plan.tags.map(t => (
                <span key={t} className="pg-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrizymPage>
  );
}
