'use client';

import { Sparkline } from './Sparkline';

interface LightKpiCardProps {
  label: string;
  value: string;
  accent: string;
  delta?: number;
  sub?: string;
  sparkline?: number[];
  stagger?: number;
}

export function LightKpiCard({ label, value, accent, delta, sub, sparkline, stagger }: LightKpiCardProps) {
  return (
    <div
      className={stagger != null ? 'animate-fade-in' : undefined}
      style={stagger != null ? { animationDelay: `${stagger * 60}ms` } : undefined}
    >
      <div
        className="relative rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
        style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <div className="absolute top-3 left-0 w-[3px] h-8 rounded-r" style={{ background: accent }} />
        <div className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1" style={{ color: '#718096' }}>
          {label}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
          </span>
          {delta != null && (
            <span className="text-xs font-semibold" style={{ color: delta > 0 ? '#10B981' : '#F87171' }}>
              {delta > 0 ? '\u25B2' : '\u25BC'} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
        {sparkline && sparkline.length > 0 && (
          <div className="mt-2">
            <Sparkline data={sparkline} color={accent} width={100} height={28} />
          </div>
        )}
        {sub && (
          <div className="text-[11px] mt-1.5" style={{ color: '#718096' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
