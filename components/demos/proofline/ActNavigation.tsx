'use client';

import Link from 'next/link';

interface ActNavigationProps {
  currentAct: 1 | 2 | 3 | 4;
}

const ACTS = [
  { act: 1, label: 'Corporate Strategy', pages: 3, color: '#C6A052', href: '/strategy/mandate' },
  { act: 2, label: 'Sales Strategy', pages: 5, color: '#7C3AED', href: '/strategy/territories' },
  { act: 3, label: 'Sales Operations', pages: 7, color: '#2563EB', href: '/ops/day-planner' },
  { act: 4, label: 'Sales Compensation', pages: 8, color: '#10B981', href: '/comp/plan' },
] as const;

export function ActNavigation({ currentAct }: ActNavigationProps) {
  return (
    <div className="flex w-full gap-1 rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.03)' }}>
      {ACTS.map(({ act, label, pages, color, href }) => {
        const isActive = act === currentAct;
        return (
          <Link
            key={act}
            href={href}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 transition-all duration-200 group relative"
            style={{
              background: isActive ? `${color}15` : 'transparent',
              borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
            }}
          >
            {/* Act number */}
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: isActive ? `${color}25` : 'rgba(0,0,0,0.06)',
                color: isActive ? color : 'rgba(0,0,0,0.3)',
              }}
            >
              {act}
            </span>

            {/* Label + page count */}
            <div className="min-w-0">
              <div
                className="text-[11px] font-semibold truncate"
                style={{ color: isActive ? color : 'rgba(0,0,0,0.4)' }}
              >
                {label}
              </div>
              <div
                className="text-[9px] font-mono"
                style={{ color: isActive ? `${color}80` : 'rgba(0,0,0,0.3)' }}
              >
                {pages} pages
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
