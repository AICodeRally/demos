'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { CheckCircle, Circle, AlertCircle, FileText } from 'lucide-react';

const DELIVERABLES = ENGAGEMENTS.flatMap(eng => {
  const types: Record<string, string[]> = {
    'Campaign Readiness': ['Feasibility Report', 'Donor Interview Summary', 'Gift Range Chart', 'Campaign Timeline', 'Case for Support Draft', 'Prospect List', 'Board Presentation', 'Final Recommendation'],
    'Board Engagement': ['Board Assessment Survey', 'Governance Review', 'Board Manual Update', 'Recruitment Plan', 'Orientation Guide', 'Annual Plan'],
    'Donor Pipeline': ['Donor Analysis Report', 'Cultivation Matrix', 'Solicitation Plan', 'Stewardship Calendar', 'Major Gift Toolkit', 'Pipeline Dashboard', 'Ask Training Materials', 'Acknowledgment Templates', 'Impact Report Template', 'Final Review'],
    'Campaign Management': Array.from({ length: 15 }, (_, i) => [`Campaign Plan`, 'Volunteer Training', 'Prospect Screening', 'Gift Range Update', 'Solicitation Schedule', 'Progress Report Q1', 'Progress Report Q2', 'Donor Communications', 'Recognition Plan', 'Mid-Campaign Assessment', 'Progress Report Q3', 'Year-End Appeal', 'Progress Report Q4', 'Annual Report', 'Campaign Evaluation'][i]),
  };
  const names = types[eng.type] || Array.from({ length: eng.deliverables }, (_, i) => `Deliverable ${i + 1}`);
  return names.slice(0, eng.deliverables).map((name, i) => ({
    id: `${eng.id}-d${i + 1}`,
    engagementId: eng.id,
    clientName: eng.clientName,
    engagementTitle: eng.title,
    name,
    status: i < eng.completedDeliverables ? 'complete' as const : i === eng.completedDeliverables ? 'in-progress' as const : 'pending' as const,
    consultant: eng.leadConsultant,
  }));
});

const STATUS_ICON = { 'complete': CheckCircle, 'in-progress': AlertCircle, 'pending': Circle };
const STATUS_COLOR = { 'complete': '#10b981', 'in-progress': '#f59e0b', 'pending': 'var(--pi-text-faint)' };

export default function DeliverablesPage() {
  const insight = getInsight('deliverables');
  const total = DELIVERABLES.length;
  const complete = DELIVERABLES.filter(d => d.status === 'complete').length;
  const inProgress = DELIVERABLES.filter(d => d.status === 'in-progress').length;
  const pending = DELIVERABLES.filter(d => d.status === 'pending').length;

  // Group by engagement
  const grouped = ENGAGEMENTS.filter(e => e.status !== 'completed').map(eng => ({
    ...eng,
    items: DELIVERABLES.filter(d => d.engagementId === eng.id),
  }));

  return (
    <PhoenixPage title="Deliverables" subtitle="Track project deliverables across all active engagements" accentColor="#10b981">
      {/* Pain Point */}
      <div className="pi-body-muted" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#ef444408', border: '1px solid #ef444420',
      }}>
        <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
        <span><strong style={{ color: '#ef4444' }}>Pain point:</strong> Deliverables previously tracked across 8-9 separate systems. This unified view replaces Excel Gantt charts, email threads, and spreadsheet trackers.</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Deliverables', value: String(total), icon: FileText, color: '#3b6bf5' },
          { label: 'Complete', value: String(complete), icon: CheckCircle, color: '#10b981' },
          { label: 'In Progress', value: String(inProgress), icon: AlertCircle, color: '#f59e0b' },
          { label: 'Pending', value: String(pending), icon: Circle, color: 'var(--pi-text-faint)' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div className="pi-value">{m.value}</div>
            <div className="pi-caption" style={{ marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Deliverables by Engagement */}
      {grouped.filter(g => g.items.length > 0).map(eng => (
        <div key={eng.id} className="phoenix-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div>
              <h3 className="pi-label">{eng.clientName}</h3>
              <div className="pi-caption">{eng.title} — {eng.leadConsultant}</div>
            </div>
            <div className="pi-caption" style={{ fontWeight: 700, color: '#10b981' }}>
              {eng.completedDeliverables}/{eng.deliverables}
            </div>
          </div>
          {/* Progress bar */}
          <div className="pi-bar-track" style={{ height: 6, borderRadius: 3, marginBottom: 10 }}>
            <div className="pi-bar-fill" style={{ width: `${(eng.completedDeliverables / eng.deliverables) * 100}%`, background: '#10b981', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {eng.items.map(d => {
              const Icon = STATUS_ICON[d.status];
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <Icon size={14} color={STATUS_COLOR[d.status]} />
                  <span className="pi-body" style={{
                    color: d.status === 'complete' ? 'var(--pi-text-muted)' : 'var(--pi-text)',
                    textDecoration: d.status === 'complete' ? 'line-through' : 'none',
                    fontWeight: d.status === 'in-progress' ? 600 : 400,
                  }}>{d.name}</span>
                  {d.status === 'in-progress' && (
                    <span className="pi-badge" style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 'var(--pi-fs-overline)' }}>IN PROGRESS</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
