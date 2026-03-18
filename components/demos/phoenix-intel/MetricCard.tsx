'use client';

import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  color?: string;
  sub?: string;
  mounted?: boolean;
  delay?: number;
}

export function MetricCard({ label, value, icon: Icon, color = '#3b6bf5', sub, mounted = true, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="phoenix-card"
      style={{
        textAlign: 'center',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
      }}
    >
      {Icon && <Icon size={20} color={color} style={{ margin: '0 auto 8px' }} aria-hidden="true" />}
      <div className="pi-value">{value}</div>
      <div className="pi-caption" style={{ marginTop: 2 }}>{label}</div>
      {sub && <div className="pi-label" style={{ color, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/** Variant with icon background bubble (used on dashboard, finance) */
export function MetricCardWithIcon({ label, value, icon: Icon, color = '#3b6bf5', sub, mounted = true, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="phoenix-card"
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
        <span className="pi-label-muted">{label}</span>
      </div>
      <div className="pi-value">{value}</div>
      {sub && <div className="pi-label" style={{ color, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
