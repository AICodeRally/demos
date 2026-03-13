'use client';

import { Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  children: React.ReactNode;
  label?: string;
  action?: { label: string; onClick: () => void };
  compact?: boolean;
}

export function AIInsightCard({ children, label = 'AI Insight', action, compact }: AIInsightCardProps) {
  return (
    <div
      style={{
        padding: compact ? '10px 14px' : '16px 20px',
        borderRadius: 12,
        background: 'rgba(139, 92, 246, 0.08)',
        borderLeft: '3px solid #8B5CF6',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Sparkles size={compact ? 16 : 20} color="#8B5CF6" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#A78BFA',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: compact ? '0.8rem' : '0.875rem', color: 'var(--register-text)' }}>
          {children}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: '#8B5CF6',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
