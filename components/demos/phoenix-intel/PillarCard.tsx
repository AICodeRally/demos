'use client';

import { useState, useEffect } from 'react';

const PILLAR_COLORS: Record<string, string> = {
  Purpose: '#facc15',
  People: '#7c3aed',
  Process: '#2563eb',
  Practice: '#c026d3',
  Pipeline: '#db2777',
  Profit: '#10b981',
};

interface PillarCardProps {
  pillar: string;
  score: number;
  trend: number;
  sparkline?: number[];
  delay?: number;
}

export function PillarCard({ pillar, score, trend, sparkline = [], delay = 0 }: PillarCardProps) {
  const color = PILLAR_COLORS[pillar] || '#3b6bf5';
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const maxVal = Math.max(...sparkline, 1);
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
  const trendColor = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : 'var(--pi-text-muted)';

  return (
    <div
      className="phoenix-card"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="pi-overline" style={{ color }}>
          {pillar}
        </span>
        <span className="pi-caption" style={{ fontWeight: 600, color: trendColor }}>
          {trendIcon} {Math.abs(trend)}%
        </span>
      </div>
      <div className="pi-heading" style={{ marginBottom: 8 }}>
        {score}
      </div>
      {sparkline.length > 0 && (
        <svg viewBox={`0 0 ${sparkline.length * 12} 24`} style={{ width: '100%', height: 24 }}>
          <polyline
            points={sparkline.map((v, i) => `${i * 12},${24 - (v / maxVal) * 20}`).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
