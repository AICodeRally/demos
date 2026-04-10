'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { TASKS, type TaskStatus } from '@/data/prizym-governance/operate';
import { CheckCircle2, Clock, Pause, ListTodo, User, Calendar } from 'lucide-react';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  todo: { label: 'To Do', color: '#64748b', icon: ListTodo },
  in_progress: { label: 'In Progress', color: '#3b82f6', icon: Clock },
  blocked: { label: 'Blocked', color: '#ef4444', icon: Pause },
  done: { label: 'Done', color: '#10b981', icon: CheckCircle2 },
};

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#64748b' };

export default function TasksPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const byStatus: Record<TaskStatus, typeof TASKS> = {
    todo: TASKS.filter(t => t.status === 'todo'),
    in_progress: TASKS.filter(t => t.status === 'in_progress'),
    blocked: TASKS.filter(t => t.status === 'blocked'),
    done: TASKS.filter(t => t.status === 'done'),
  };

  const columns: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done'];

  return (
    <PrizymPage title="Action Items" subtitle="Open governance tasks grouped by status — kanban view" mode="operate">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {columns.map((col, ci) => {
          const config = STATUS_CONFIG[col];
          const Icon = config.icon;
          const tasks = byStatus[col];
          return (
            <div
              key={col}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${ci * 0.1}s`,
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 8, background: `${config.color}15`, border: `1px solid ${config.color}30`,
                marginBottom: 12,
              }}>
                <Icon size={16} style={{ color: config.color }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {config.label}
                </span>
                <span style={{
                  marginLeft: 'auto', padding: '2px 8px', borderRadius: 10,
                  background: config.color, color: '#fff', fontSize: 11, fontWeight: 700,
                }}>{tasks.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasks.map(t => (
                  <div key={t.id} className="pg-card" style={{ borderTop: `3px solid ${PRIORITY_COLORS[t.priority]}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      {t.relatedPolicy && <span className="pg-overline" style={{ color: 'var(--pg-operate)' }}>{t.relatedPolicy}</span>}
                      <span style={{
                        fontSize: 9, padding: '2px 6px', borderRadius: 8,
                        background: `${PRIORITY_COLORS[t.priority]}20`, color: PRIORITY_COLORS[t.priority],
                        textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginLeft: 'auto',
                      }}>{t.priority}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginBottom: 8, lineHeight: 1.35 }}>{t.title}</p>
                    <p className="pg-caption" style={{ marginBottom: 10, fontSize: 12, lineHeight: 1.5 }}>{t.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--pg-text-muted)', paddingTop: 8, borderTop: '1px solid var(--pg-border-faint)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><User size={11} /> {t.owner}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {t.due}</span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--pg-text-muted)', fontSize: 12, fontStyle: 'italic', border: '1px dashed var(--pg-border)', borderRadius: 8 }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
