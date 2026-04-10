'use client';

import type { LucideIcon } from 'lucide-react';

const GREEN = { bg: 'rgba(16,185,129,0.12)', text: '#10b981', border: 'rgba(16,185,129,0.3)' };
const AMBER = { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' };
const BLUE = { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' };
const PURPLE = { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' };
const SLATE = { bg: 'rgba(100,116,139,0.12)', text: '#64748b', border: 'rgba(100,116,139,0.3)' };
const RED = { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' };
const CRIMSON = { bg: 'rgba(220,38,38,0.12)', text: '#dc2626', border: 'rgba(220,38,38,0.3)' };
const ORANGE = { bg: 'rgba(249,115,22,0.12)', text: '#f97316', border: 'rgba(249,115,22,0.3)' };
const YELLOW = { bg: 'rgba(234,179,8,0.12)', text: '#eab308', border: 'rgba(234,179,8,0.3)' };

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  APPROVED: GREEN, ACTIVE: GREEN, PUBLISHED: GREEN,
  approved: GREEN, done: GREEN, resolved: GREEN, compliant: GREEN,
  DRAFT: AMBER, draft: AMBER, modified: AMBER,
  pending: AMBER, at_risk: AMBER,
  IN_PROGRESS: BLUE, in_progress: BLUE, open: BLUE,
  UNDER_REVIEW: PURPLE, under_review: PURPLE, escalated: PURPLE,
  superseded: SLATE, INACTIVE: SLATE, todo: SLATE, not_tested: SLATE, low: SLATE, LOW: SLATE,
  rejected: RED, blocked: RED, non_compliant: RED, high: RED,
  CRITICAL: CRIMSON,
  HIGH: ORANGE,
  MEDIUM: YELLOW, medium: YELLOW,
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
      className="pg-card-elevated"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        {Icon && (
          <div
            className="pg-icon-bubble"
            style={{ background: `${color}18` }}
            aria-hidden="true"
          >
            <Icon size={20} color={color} />
          </div>
        )}
        <span className="pg-label-muted">{label}</span>
      </div>
      <div className="pg-value" style={{ fontSize: '1.75rem' }}>{value}</div>
      {sub && (
        <div className="pg-caption" style={{ color, marginTop: 6, fontWeight: 600 }}>{sub}</div>
      )}
    </div>
  );
}

interface GaugeChartProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function GaugeChart({ value, max = 100, size = 120, strokeWidth = 10, color = '#06b6d4', label, sublabel }: GaugeChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const trackColor = 'var(--pg-border-faint)';

  return (
    <div className="pg-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="pg-gauge-value">
        <span className="pg-value-lg" style={{ color }}>{value}%</span>
        {label && <span className="pg-caption" style={{ marginTop: 2 }}>{label}</span>}
      </div>
    </div>
  );
}
