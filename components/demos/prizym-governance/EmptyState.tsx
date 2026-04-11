'use client';

import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  color?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  color = 'var(--pg-cyan-bright)',
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        borderRadius: 14,
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px dashed rgba(255, 255, 255, 0.28)',
        flex: 1,
        minHeight: 220,
      }}
    >
      <div className="pg-icon-bubble pg-icon-bubble-lg" style={{ borderColor: color, marginBottom: 14 }}>
        <Icon size={22} color={color} strokeWidth={2.4} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 15, color: '#f1f5f9', maxWidth: 480, lineHeight: 1.5 }}>
          {description}
        </div>
      )}
    </div>
  );
}
