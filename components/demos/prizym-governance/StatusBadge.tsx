'use client';

import type { LucideIcon } from 'lucide-react';

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  APPROVED: { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  ACTIVE: { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  PUBLISHED: { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  DRAFT: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  draft: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  IN_PROGRESS: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  UNDER_REVIEW: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  superseded: { bg: 'rgba(100,116,139,0.12)', text: '#64748b', border: 'rgba(100,116,139,0.3)' },
  INACTIVE: { bg: 'rgba(100,116,139,0.12)', text: '#64748b', border: 'rgba(100,116,139,0.3)' },
  // Impact levels
  CRITICAL: { bg: 'rgba(220,38,38,0.12)', text: '#dc2626', border: 'rgba(220,38,38,0.3)' },
  HIGH: { bg: 'rgba(249,115,22,0.12)', text: '#f97316', border: 'rgba(249,115,22,0.3)' },
  MEDIUM: { bg: 'rgba(234,179,8,0.12)', text: '#eab308', border: 'rgba(234,179,8,0.3)' },
  LOW: { bg: 'rgba(100,116,139,0.12)', text: '#64748b', border: 'rgba(100,116,139,0.3)' },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT;
  return (
    <span
      className="pg-badge"
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  color?: string;
  sub?: string;
  mounted?: boolean;
  delay?: number;
}

export function MetricCard({ label, value, icon: Icon, color = '#06b6d4', sub, mounted = true, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="pg-card"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {Icon && (
          <div style={{ background: `${color}18`, borderRadius: 8, padding: 6, display: 'flex' }} aria-hidden="true">
            <Icon size={18} color={color} />
          </div>
        )}
        <span className="pg-label-muted">{label}</span>
      </div>
      <div className="pg-value">{value}</div>
      {sub && <div className="pg-label" style={{ color, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
