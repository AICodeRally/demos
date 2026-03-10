'use client';

import Link from 'next/link';

interface ActNavigationProps {
  currentAct: 1 | 2 | 3 | 4 | 5 | 6;
}

const ACTS = [
  { act: 1, label: 'Corporate Strategy', pages: 3, color: '#C6A052', href: '/strategy/mandate' },
  { act: 2, label: 'Sales Strategy', pages: 5, color: '#7C3AED', href: '/strategy/territories' },
  { act: 3, label: 'Sales Operations', pages: 7, color: '#2563EB', href: '/ops/day-planner' },
  { act: 4, label: 'Sales Comp Planning', pages: 5, color: '#10B981', href: '/comp/plan' },
  { act: 5, label: 'Sales Comp Management', pages: 6, color: '#0EA5E9', href: '/comp/mgmt/data' },
  { act: 6, label: 'Platform & Integrations', pages: 1, color: '#F97316', href: '/integrations' },
] as const;

export function ActNavigation({ currentAct }: ActNavigationProps) {
  return (
    <div className="flex w-full gap-1 rounded-lg overflow-hidden mb-6" style={{ background: 'var(--pl-hover)' }}>
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
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: isActive ? `${color}25` : 'var(--pl-hover)',
                color: isActive ? color : 'var(--pl-text-faint)',
              }}
            >
              {act}
            </span>
            <div className="min-w-0">
              <div
                className="text-[11px] font-semibold truncate"
                style={{ color: isActive ? color : 'var(--pl-text-faint)' }}
              >
                {label}
              </div>
              <div
                className="text-[9px] font-mono"
                style={{ color: isActive ? `${color}80` : 'var(--pl-text-faint)' }}
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
