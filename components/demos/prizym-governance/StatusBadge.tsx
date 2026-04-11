'use client';

import type { LucideIcon } from 'lucide-react';

/* Text colors are lightened variants of the base hue so chips stay readable
   on both light cards and the rgba dark-mode surfaces. */
const GREEN = { bg: 'rgba(217,70,239,0.22)', text: '#f0abfc', border: 'rgba(217,70,239,0.55)' };
const AMBER = { bg: 'rgba(245,158,11,0.22)', text: '#fcd34d', border: 'rgba(245,158,11,0.5)' };
const BLUE = { bg: 'rgba(59,130,246,0.22)', text: '#93c5fd', border: 'rgba(59,130,246,0.5)' };
const PURPLE = { bg: 'rgba(139,92,246,0.22)', text: '#c4b5fd', border: 'rgba(139,92,246,0.5)' };
const SLATE = { bg: 'rgba(148,163,184,0.22)', text: '#e2e8f0', border: 'rgba(148,163,184,0.5)' };
const RED = { bg: 'rgba(239,68,68,0.22)', text: '#fca5a5', border: 'rgba(239,68,68,0.5)' };
const CRIMSON = { bg: 'rgba(220,38,38,0.22)', text: '#fca5a5', border: 'rgba(220,38,38,0.5)' };
const ORANGE = { bg: 'rgba(249,115,22,0.22)', text: '#fdba74', border: 'rgba(249,115,22,0.5)' };
const YELLOW = { bg: 'rgba(234,179,8,0.22)', text: '#fde047', border: 'rgba(234,179,8,0.5)' };

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  APPROVED: GREEN, ACTIVE: GREEN, PUBLISHED: GREEN,
  approved: GREEN, done: GREEN, resolved: GREEN, compliant: GREEN,
  DRAFT: AMBER, draft: AMBER, modified: AMBER,
  pending: AMBER, at_risk: AMBER,
  IN_PROGRESS: BLUE, in_progress: BLUE, open: BLUE,
  UNDER_REVIEW: PURPLE, under_review: PURPLE, escalated: PURPLE,
  superseded: SLATE, INACTIVE: SLATE, queued: SLATE, not_tested: SLATE, low: SLATE, LOW: SLATE,
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
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        {Icon && (
          <div
            className="pg-icon-bubble"
            style={{ width: 34, height: 34, borderRadius: 9, borderColor: color }}
            aria-hidden="true"
          >
            <Icon size={19} color={color} strokeWidth={2.4} />
          </div>
        )}
        <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', letterSpacing: '0.01em' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: '2.125rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{value}</div>
        {sub && (
          <div style={{ color, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{sub}</div>
        )}
      </div>
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
