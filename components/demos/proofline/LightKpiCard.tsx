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
      className={stagger != null ? 'animate-fade-in h-full' : 'h-full'}
      style={stagger != null ? { animationDelay: `${stagger * 60}ms` } : undefined}
    >
      <div
        className="relative rounded-xl border p-4 transition-shadow hover:shadow-md h-full flex flex-col"
        style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', boxShadow: 'var(--pl-shadow)' }}
      >
        <div className="absolute top-3 left-0 w-[3px] h-8 rounded-r" style={{ background: accent }} />
        {/* Row 1: label — fixed 2-line min-height so values always align */}
        <div className="text-xs uppercase tracking-[1.5px] font-mono mb-1 flex items-start" style={{ color: 'var(--pl-text-muted)', lineHeight: '1.4', minHeight: 34 }}>
          <span>{label}</span>
        </div>
        {/* Row 2: value — always starts at same position */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
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
        {/* Row 3: sub — pushed to bottom, fixed 2-line min-height so cards match */}
        <div className="mt-auto pt-1.5" style={{ lineHeight: '1.4', minHeight: 38 }}>
          {sub && (
            <div className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
