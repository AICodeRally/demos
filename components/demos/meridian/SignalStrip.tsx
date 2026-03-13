'use client';

interface Signal {
  label: string;
  value: string;
  status: 'green' | 'amber' | 'red' | 'neutral';
  detail?: string;
}

interface SignalStripProps {
  signals: Signal[];
}

const STATUS_COLORS = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  neutral: '#6B7280',
};

export function SignalStrip({ signals }: SignalStripProps) {
  return (
    <div className="mr-signal-strip mb-6 animate-mr-slide-in">
      {signals.map((s) => {
        const color = STATUS_COLORS[s.status];
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: color, boxShadow: `0 0 8px ${color}40` }}
            />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>
                {s.label}
              </div>
              <div className="text-[14px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
                {s.value}
              </div>
              {s.detail && (
                <div className="text-[10px]" style={{ color: 'var(--mr-text-faint)' }}>{s.detail}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
