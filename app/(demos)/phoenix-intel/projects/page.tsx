'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { Kanban, CheckCircle, AlertTriangle, Clock, FileText, Users, DollarSign } from 'lucide-react';

function getProjectStatus(eng: typeof ENGAGEMENTS[number]): 'on-track' | 'monitor' | 'at-risk' {
  const budgetPct = (eng.spent / eng.budget) * 100;
  if (eng.progress >= budgetPct) return 'on-track';
  if (eng.progress >= budgetPct - 10) return 'monitor';
  return 'at-risk';
}

const STATUS_CONFIG = {
  'on-track': { label: 'On Track', color: '#10b981', bg: '#10b98118', icon: CheckCircle },
  'monitor': { label: 'Monitor', color: '#f59e0b', bg: '#f59e0b18', icon: Clock },
  'at-risk': { label: 'At Risk', color: '#ef4444', bg: '#ef444418', icon: AlertTriangle },
};

export default function ProjectsPage() {
  const insight = getInsight('projects');

  const activeEngagements = ENGAGEMENTS.filter(e => e.status === 'active');
  const planningEngagements = ENGAGEMENTS.filter(e => e.status === 'planning');
  const allProjects = [...activeEngagements, ...planningEngagements];
  const completedCount = ENGAGEMENTS.filter(e => e.status === 'completed').length;

  const projectsWithStatus = allProjects.map(eng => ({
    ...eng,
    projectStatus: eng.status === 'planning' ? 'monitor' as const : getProjectStatus(eng),
  }));

  // Sort by lead consultant
  projectsWithStatus.sort((a, b) => a.leadConsultant.localeCompare(b.leadConsultant));

  const onTrack = projectsWithStatus.filter(p => p.projectStatus === 'on-track').length;
  const atRisk = projectsWithStatus.filter(p => p.projectStatus === 'at-risk').length;

  return (
    <PhoenixPage title="Projects" subtitle="Project management view — replacing Kelly's Gantt charts and Excel tracking" accentColor="#10b981">
      {/* Pain Point */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#ef444408', border: '1px solid #ef444420', fontSize: '0.85rem', color: 'var(--pi-text-muted)',
      }}>
        <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
        <span><strong style={{ color: '#ef4444' }}>Pain point:</strong> Project tracking previously relied on Kelly&apos;s Excel Gantt charts, proposal tracking grids, and linked workbooks. Status updates required manual copy-paste across 8-9 systems.</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Projects', value: String(allProjects.length), icon: Kanban, color: '#3b6bf5' },
          { label: 'On Track', value: String(onTrack), icon: CheckCircle, color: '#10b981' },
          { label: 'At Risk', value: String(atRisk), icon: AlertTriangle, color: '#ef4444' },
          { label: 'Completed', value: String(completedCount), icon: FileText, color: '#7c3aed' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{m.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectsWithStatus.map(proj => {
          const cfg = STATUS_CONFIG[proj.projectStatus];
          const budgetPct = Math.min((proj.spent / proj.budget) * 100, 100);
          const StatusIcon = cfg.icon;
          return (
            <div key={proj.id} className="phoenix-card" style={{ borderLeft: `3px solid ${cfg.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{proj.clientName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{proj.title}</div>
                </div>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700,
                  background: cfg.bg, color: cfg.color,
                }}>
                  <StatusIcon size={10} /> {cfg.label}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                  <span style={{ color: 'var(--pi-text-muted)' }}>Progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--pi-text)' }}>{proj.progress}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--pi-border-faint)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${proj.progress}%`, borderRadius: 3, background: cfg.color }} />
                </div>
              </div>

              {/* Budget burn */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                  <span style={{ color: 'var(--pi-text-muted)' }}>Budget Burn</span>
                  <span style={{ fontWeight: 700, color: 'var(--pi-text)' }}>{budgetPct.toFixed(0)}% (${(proj.spent / 1000).toFixed(1)}K / ${(proj.budget / 1000).toFixed(0)}K)</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--pi-border-faint)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${budgetPct}%`, borderRadius: 3, background: budgetPct > 90 ? '#ef4444' : '#64748b' }} />
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '0.75rem', color: 'var(--pi-text-muted)', paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={10} /> {proj.leadConsultant}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><DollarSign size={10} /> ${(proj.budget / 1000).toFixed(0)}K</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><FileText size={10} /> {proj.completedDeliverables}/{proj.deliverables} deliverables</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {proj.startDate} — {proj.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {insight && <div style={{ marginTop: 20 }}><AIInsightCard>{insight.text}</AIInsightCard></div>}
    </PhoenixPage>
  );
}
