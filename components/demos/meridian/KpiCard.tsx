'use client';

import { useEffect, useRef, useState } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  accent: string;
  sub?: string;
  stagger?: number;
  variant?: 'primary' | 'supporting' | 'context';
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
}

function useCountUp(target: string, duration = 800): string {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const match = target.match(/^([^0-9]*)([\d,.]+)(.*)/);
    if (!match) return;

    const [, prefix, numStr, suffix] = match;
    const num = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(num)) return;

    const hasDecimals = numStr.includes('.');
    const decimals = hasDecimals ? (numStr.split('.')[1]?.length ?? 0) : 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = num * eased;
          setDisplay(`${prefix}${current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return display;
}

export function KpiCard({ label, value, accent, sub, stagger, variant = 'supporting', delta, deltaDirection }: KpiCardProps) {
  const displayValue = useCountUp(value);
  const isPrimary = variant === 'primary';
  const isContext = variant === 'context';

  return (
    <div
      ref={undefined}
      className={stagger != null ? 'animate-mr-count-up h-full' : 'h-full'}
      style={stagger != null ? { animationDelay: `${stagger * 80}ms` } : undefined}
    >
      <div
        className={`relative rounded-xl border transition-all hover:shadow-lg h-full flex flex-col ${
          isPrimary ? 'p-5' : isContext ? 'p-3' : 'p-4'
        }`}
        style={{
          background: isPrimary ? `${accent}08` : 'var(--mr-card)',
          borderColor: isPrimary ? `${accent}30` : 'var(--mr-border)',
          boxShadow: isPrimary ? 'var(--mr-shadow-premium)' : 'var(--mr-shadow)',
        }}
      >
        {/* Accent bar */}
        <div
          className={`absolute top-0 left-4 right-4 rounded-b ${isPrimary ? 'h-[3px]' : 'h-[2px]'}`}
          style={{ background: isPrimary ? accent : `${accent}60` }}
        />

        <div
          className={`uppercase tracking-[1.5px] mb-2 flex items-start ${
            isPrimary ? 'text-[11px] font-semibold' : isContext ? 'text-[10px] font-medium' : 'text-[11px] font-medium'
          }`}
          style={{ color: isPrimary ? accent : 'var(--mr-text-muted)', lineHeight: '1.4', minHeight: isContext ? 'auto' : 30 }}
        >
          <span>{label}</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className={`font-extrabold ${isPrimary ? 'text-3xl' : isContext ? 'text-lg' : 'text-2xl'}`}
            style={{ color: isPrimary ? accent : 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}
          >
            {displayValue}
          </span>
          {delta && (
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{
                background: deltaDirection === 'up' ? '#10B98115' : deltaDirection === 'down' ? '#EF444415' : '#6B728015',
                color: deltaDirection === 'up' ? '#10B981' : deltaDirection === 'down' ? '#EF4444' : '#6B7280',
              }}
            >
              {delta}
            </span>
          )}
        </div>

        <div className="mt-auto pt-1.5" style={{ lineHeight: '1.4', minHeight: isContext ? 'auto' : 34 }}>
          {sub && (
            <div className={`${isContext ? 'text-[11px]' : 'text-[13px]'}`} style={{ color: 'var(--mr-text-muted)' }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
