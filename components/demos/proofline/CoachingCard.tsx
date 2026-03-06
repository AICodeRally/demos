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
        background: 'white',
        border: '1px solid #E2E8F0',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <User size={14} className="text-slate-400" />
          <span className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{repName}</span>
          <span className="text-[11px] text-slate-400 font-mono">{route}</span>
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
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-1">
            Insight
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed">{insight}</p>
        </div>

        {/* Suggested action */}
        <div
          className="rounded-lg p-2.5"
          style={{ background: 'rgba(198, 160, 82, 0.06)', borderLeft: '2px solid #C6A052' }}
        >
          <div className="text-[9px] uppercase tracking-wider text-[#C6A052]/60 font-mono mb-1">
            Suggested Action
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed">{action}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Tag size={9} />
          {category}
        </span>
      </div>
    </div>
  );
}
