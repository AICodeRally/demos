'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ActNavigationProps {
  currentAct: 1 | 2 | 3 | 4 | 5 | 6;
}

const ACTS = [
  { act: 1, label: 'Fund Overview', pages: 3, color: '#D4A847', path: '/fund/strategy' },
  { act: 2, label: 'Deal Pipeline', pages: 4, color: '#8B5CF6', path: '/deals/pipeline' },
  { act: 3, label: 'Portfolio', pages: 4, color: '#2563EB', path: '/portfolio/overview' },
  { act: 4, label: 'Waterfall', pages: 4, color: '#10B981', path: '/waterfall/distribution' },
  { act: 5, label: 'Carry Allocation', pages: 4, color: '#0EA5E9', path: '/carry/pool' },
  { act: 6, label: 'Analytics', pages: 3, color: '#F97316', path: '/platform/analytics' },
] as const;

function useBasePrefix(): string {
  const pathname = usePathname();
  const match = pathname.match(/^\/([^/]+)/);
  return match ? `/${match[1]}` : '';
}

export function ActNavigation({ currentAct }: ActNavigationProps) {
  const prefix = useBasePrefix();
  return (
    <div className="flex w-full gap-1 rounded-lg overflow-hidden mb-6" style={{ background: 'var(--mr-hover)' }}>
      {ACTS.map(({ act, label, pages, color, path }) => {
        const isActive = act === currentAct;
        return (
          <Link
            key={act}
            href={`${prefix}${path}`}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 transition-all duration-200 group relative"
            style={{
              background: isActive ? `${color}15` : 'transparent',
              borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
            }}
          >
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: isActive ? `${color}25` : 'var(--mr-hover)',
                color: isActive ? color : 'var(--mr-text-faint)',
              }}
            >
              {act}
            </span>
            <div className="min-w-0">
              <div
                className="text-[13px] font-semibold truncate"
                style={{ color: isActive ? color : 'var(--mr-text-faint)' }}
              >
                {label}
              </div>
              <div
                className="text-xs font-mono"
                style={{ color: isActive ? `${color}80` : 'var(--mr-text-faint)' }}
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
