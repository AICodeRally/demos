'use client';

interface MigrationModule {
  name: string;
  progress: number;
  status: 'live' | 'parallel' | 'testing' | 'pending';
  validationScore: number;
}

interface MigrationTrackerProps {
  modules: MigrationModule[];
}

const STATUS_STYLES: Record<MigrationModule['status'], { bg: string; text: string; barColor: string; label: string }> = {
  live:     { bg: '#ECFDF5', text: '#059669', barColor: '#059669', label: 'Live' },
  parallel: { bg: '#FFF7ED', text: '#EA580C', barColor: '#EA580C', label: 'Parallel Run' },
  testing:  { bg: '#EFF6FF', text: '#2563EB', barColor: '#2563EB', label: 'Testing' },
  pending:  { bg: '#F5F5F4', text: '#78716C', barColor: '#A8A29E', label: 'Pending' },
};

export function MigrationTracker({ modules }: MigrationTrackerProps) {
  return (
    <div className="space-y-3">
      {modules.map((mod) => {
        const style = STATUS_STYLES[mod.status];
        return (
          <div key={mod.name} className="flex items-center gap-4">
            <div className="w-28 shrink-0 text-sm font-medium" style={{ color: '#1C1917' }}>
              {mod.name}
            </div>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E7E5E4' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${mod.progress}%`, backgroundColor: style.barColor }}
              />
            </div>
            <span className="w-10 text-right text-xs font-semibold" style={{ color: '#57534E' }}>
              {mod.progress}%
            </span>
            <span
              className="inline-block w-24 text-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {style.label}
            </span>
            <span className="w-14 text-right text-xs" style={{ color: '#A8A29E' }}>
              {mod.validationScore}% val
            </span>
          </div>
        );
      })}
    </div>
  );
}
