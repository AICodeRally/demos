'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCard } from '@/components/demos/phoenix-intel/MetricCard';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CONSULTANTS, ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';

const UTILIZATION_TARGET = 80;
const BURNOUT_THRESHOLD = 90;

export default function UtilizationPage() {
  const insight = getInsight('operations/utilization');
  const avgUtilization = Math.round(CONSULTANTS.reduce((s, c) => s + c.utilization, 0) / CONSULTANTS.length);
  const overTarget = CONSULTANTS.filter(c => c.utilization >= UTILIZATION_TARGET).length;
  const atRisk = CONSULTANTS.filter(c => c.utilization >= BURNOUT_THRESHOLD);

  return (
    <PhoenixPage title="Team Utilization" subtitle="Consultant workload, capacity planning, and burnout risk monitoring" accentColor="#f59e0b">
      {/* Burnout Alert */}
      {atRisk.length > 0 && (
        <Alert variant="danger" icon={AlertTriangle}>
          <strong style={{ color: '#ef4444' }}>Burnout risk:</strong>{' '}
          {atRisk.map(c => `${c.name} (${c.utilization}%)`).join(', ')} — above {BURNOUT_THRESHOLD}% utilization threshold.
          Recommend redistributing 1+ engagement to maintain sustainable workloads.
        </Alert>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Utilization summary">
        <MetricCard label="Avg Utilization" value={`${avgUtilization}%`} icon={TrendingUp} color={avgUtilization >= UTILIZATION_TARGET ? '#10b981' : '#f59e0b'} />
        <MetricCard label="Above Target" value={`${overTarget}/${CONSULTANTS.length}`} icon={Users} color="#3b6bf5" />
        <MetricCard label={`At Risk (>${BURNOUT_THRESHOLD}%)`} value={String(atRisk.length)} icon={AlertTriangle} color={atRisk.length > 0 ? '#ef4444' : '#10b981'} />
        <MetricCard label="Target" value={`${UTILIZATION_TARGET}%`} icon={Clock} color="#64748b" />
      </div>

      {/* Utilization Bars */}
      <div className="phoenix-card pi-card-section" role="region" aria-label="Consultant utilization bars">
        <h3 className="pi-section-title" style={{ marginBottom: 16 }}>Consultant Utilization</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...CONSULTANTS].sort((a, b) => b.utilization - a.utilization).map(c => {
            const barColor = c.utilization >= BURNOUT_THRESHOLD ? '#ef4444' : c.utilization >= UTILIZATION_TARGET ? '#10b981' : '#f59e0b';
            const engagements = ENGAGEMENTS.filter(e => e.leadConsultant === c.name && e.status === 'active');
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div>
                    <span className="pi-label">{c.name}</span>
                    <span className="pi-body-muted" style={{ marginLeft: 8 }}>{c.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="pi-caption">{engagements.length} active</span>
                    <span className="pi-label" style={{ color: barColor }}>{c.utilization}%</span>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--pi-border-faint)', overflow: 'hidden', position: 'relative' }}
                  role="progressbar"
                  aria-valuenow={c.utilization}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${c.name} utilization: ${c.utilization}%`}
                >
                  <div style={{ position: 'absolute', left: `${UTILIZATION_TARGET}%`, top: 0, bottom: 0, width: 2, background: 'var(--pi-text-faint)', zIndex: 1 }} />
                  <div style={{ height: '100%', width: `${c.utilization}%`, borderRadius: 4, background: barColor, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="pi-caption" style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444' }} aria-hidden="true" /> Burnout risk (&gt;90%)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981' }} aria-hidden="true" /> On target (80-90%)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b' }} aria-hidden="true" /> Under target (&lt;80%)</span>
        </div>
      </div>

      {/* Capacity Recommendations */}
      <div className="phoenix-card" style={{ borderLeft: '3px solid #f59e0b' }} role="region" aria-label="Capacity recommendations">
        <h3 className="pi-section-title">Capacity Recommendations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {atRisk.map(c => {
            const lowUtil = CONSULTANTS.filter(x => x.utilization < UTILIZATION_TARGET && x.id !== c.id).sort((a, b) => a.utilization - b.utilization);
            const candidate = lowUtil[0];
            return (
              <div key={c.id} className="pi-body-muted" style={{ padding: '8px 12px', borderRadius: 6, background: '#ef444408', border: '1px solid #ef444420' }}>
                <strong style={{ color: '#ef4444' }}>{c.name} ({c.utilization}%)</strong>
                <span>
                  {' '}— {c.activeEngagements} active engagements.
                  {candidate ? ` Recommend shifting 1 to ${candidate.name} (${candidate.utilization}%).` : ' No available capacity on team.'}
                </span>
              </div>
            );
          })}
          {atRisk.length === 0 && (
            <div className="pi-body" style={{ color: '#10b981' }}>All consultants within sustainable utilization range.</div>
          )}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
