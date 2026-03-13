'use client';

interface KpiCardProps {
  label: string;
  value: string;
  accent: string;
  sub?: string;
  stagger?: number;
}

export function KpiCard({ label, value, accent, sub, stagger }: KpiCardProps) {
  return (
    <div
      className={stagger != null ? 'animate-mr-fade-in h-full' : 'h-full'}
      style={stagger != null ? { animationDelay: `${stagger * 60}ms` } : undefined}
    >
      <div
        className="relative rounded-xl border p-4 transition-shadow hover:shadow-md h-full flex flex-col"
        style={{ background: 'var(--mr-card)', borderColor: 'var(--mr-border)', boxShadow: 'var(--mr-shadow)' }}
      >
        <div className="absolute top-3 left-0 w-[3px] h-8 rounded-r" style={{ background: accent }} />
        <div className="text-xs uppercase tracking-[1.5px] font-mono mb-1 flex items-start" style={{ color: 'var(--mr-text-muted)', lineHeight: '1.4', minHeight: 34 }}>
          <span>{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
            {value}
          </span>
        </div>
        <div className="mt-auto pt-1.5" style={{ lineHeight: '1.4', minHeight: 38 }}>
          {sub && (
            <div className="text-[13px]" style={{ color: 'var(--mr-text-muted)' }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
