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
        padding: 2,
        borderRadius: 14,
        background: 'linear-gradient(135deg, #7c3aed, #3b6bf5, #06b6d4, #10b981, #c9942b, #db2777, #7c3aed)',
        backgroundSize: '300% 300%',
        animation: 'pi-rainbow-border 6s linear infinite',
      }}
    >
      <div
        style={{
          padding: compact ? '10px 14px' : '16px 20px',
          borderRadius: 12,
          background: 'var(--pi-ai-fill, #1a1530)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <Sparkles size={compact ? 16 : 20} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#7c3aed',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 4,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: compact ? '0.9rem' : '0.875rem', color: 'var(--pi-text)' }}>
            {children}
          </div>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            style={{
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.875rem',
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
    </div>
  );
}
