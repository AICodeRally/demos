'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { QuadrantTile, type QuadrantTileProps } from '@/components/demos/prizym-governance/QuadrantTile';
import { DECISIONS, CALENDAR_EVENTS, TASKS, NOTIFICATIONS, getApprovalStats } from '@/data/prizym-governance/operate';
import { CheckSquare, Gavel, Calendar, ListTodo, Bell, Users, AlertTriangle } from 'lucide-react';

export default function OperateQuadrantPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getApprovalStats();
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const metrics = [
    { label: 'Pending Approvals', value: String(stats.pending), icon: CheckSquare, color: '#3b82f6' },
    { label: 'High Priority', value: String(stats.highPriority), icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Upcoming Events', value: String(CALENDAR_EVENTS.length), icon: Calendar, color: '#06b6d4' },
    { label: 'Unread Alerts', value: String(unread), icon: Bell, color: '#8b5cf6' },
  ];

  const tiles: Array<Omit<QuadrantTileProps, 'mounted' | 'delay'>> = [
    {
      href: '/prizym-governance/operate/approvals',
      title: 'Approvals Queue',
      description: `${stats.pending} pending · ${stats.escalated} escalated. CRB, SGCC, and SCP-gated approvals.`,
      icon: CheckSquare,
      accent: '#3b82f6',
      badge: `${stats.pending} pending`,
    },
    {
      href: '/prizym-governance/operate/decisions',
      title: 'Decisions Log',
      description: 'Audit-ready record of every governance decision with rationale and voters.',
      icon: Gavel,
      accent: '#0ea5e9',
      badge: `${DECISIONS.length} decisions`,
    },
    {
      href: '/prizym-governance/operate/calendar',
      title: 'Governance Calendar',
      description: 'CRB, SGCC, review meetings, training, and deadlines across the month.',
      icon: Calendar,
      accent: '#06b6d4',
      badge: `${CALENDAR_EVENTS.length} events`,
    },
    {
      href: '/prizym-governance/operate/tasks',
      title: 'Action Items',
      description: 'Open governance tasks with owner, due date, and status.',
      icon: ListTodo,
      accent: '#8b5cf6',
      badge: `${TASKS.filter(t => t.status !== 'done').length} open`,
    },
    {
      href: '/prizym-governance/operate/notifications',
      title: 'Notifications',
      description: 'Approvals, decisions, mentions, and SOX alerts.',
      icon: Bell,
      accent: '#f59e0b',
      badge: `${unread} unread`,
    },
    {
      href: '/prizym-governance/committees',
      title: 'Committees',
      description: 'CRB, SGCC, and standing committee rosters and charters.',
      icon: Users,
      accent: '#6366f1',
      badge: '4 committees',
    },
  ];

  return (
    <PrizymPage title="Operate" subtitle="Run the governance program — approvals, decisions, committees, calendar, tasks" mode="operate">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <h2 className="pg-subheading" style={{ marginBottom: 14 }}>Operational Surfaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tiles.map((tile, i) => (
          <QuadrantTile key={tile.href} {...tile} mounted={mounted} delay={0.2 + i * 0.08} />
        ))}
      </div>
    </PrizymPage>
  );
}
