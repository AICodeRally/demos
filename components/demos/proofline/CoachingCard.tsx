import { AlertTriangle, CheckCircle, Info, User, Tag } from 'lucide-react';

interface CoachingCardProps {
  repName: string;
  route: string;
  insight: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const PRIORITY_CONFIG = {
  high: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', label: 'High Priority', Icon: AlertTriangle },
  medium: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', label: 'Medium', Icon: Info },
  low: { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)', label: 'Low', Icon: CheckCircle },
} as const;

export function CoachingCard({ repName, route, insight, action, priority, category }: CoachingCardProps) {
  const { color, bg, label, Icon } = PRIORITY_CONFIG[priority];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--pl-card)',
        border: '1px solid var(--pl-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--pl-border)' }}>
        <div className="flex items-center gap-2">
          <User size={14} style={{ color: 'var(--pl-text-faint)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>{repName}</span>
          <span className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{route}</span>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: bg, color }}
        >
          <Icon size={10} />
          {label}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2.5">
        {/* Insight */}
        <div>
          <div className="text-[9px] uppercase tracking-wider font-mono mb-1" style={{ color: 'var(--pl-text-faint)' }}>
            Insight
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>{insight}</p>
        </div>

        {/* Suggested action */}
        <div
          className="rounded-lg p-2.5"
          style={{ background: 'rgba(198, 160, 82, 0.06)', borderLeft: '2px solid #C6A052' }}
        >
          <div className="text-[9px] uppercase tracking-wider text-[#C6A052]/60 font-mono mb-1">
            Suggested Action
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>{action}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--pl-border)' }}>
        <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--pl-text-faint)' }}>
          <Tag size={9} />
          {category}
        </span>
      </div>
    </div>
  );
}
