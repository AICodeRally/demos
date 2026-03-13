'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ActNavigationProps {
  currentAct: 1 | 2 | 3 | 4 | 5 | 6;
}

const ACTS = [
  { act: 1, label: 'Fund Overview', color: '#D4A847', path: '/fund/strategy' },
  { act: 2, label: 'Deal Pipeline', color: '#8B5CF6', path: '/deals/pipeline' },
  { act: 3, label: 'Portfolio', color: '#2563EB', path: '/portfolio/overview' },
  { act: 4, label: 'Waterfall', color: '#10B981', path: '/waterfall/distribution' },
  { act: 5, label: 'Carry', color: '#0EA5E9', path: '/carry/pool' },
  { act: 6, label: 'Analytics', color: '#F97316', path: '/platform/analytics' },
] as const;

function useBasePrefix(): string {
  const pathname = usePathname();
  const match = pathname.match(/^\/([^/]+)/);
  return match ? `/${match[1]}` : '';
}

export function ActNavigation({ currentAct }: ActNavigationProps) {
  const prefix = useBasePrefix();

  return (
    <div className="flex w-full gap-1.5 rounded-xl overflow-x-auto mb-6 p-1.5" style={{ background: 'var(--mr-hover)' }}>
      {ACTS.map(({ act, label, color, path }) => {
        const isActive = act === currentAct;
        return (
          <Link
            key={act}
            href={`${prefix}${path}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 transition-all duration-200 group relative rounded-lg min-w-[120px]"
            style={{
              background: isActive ? 'var(--mr-card)' : 'transparent',
              boxShadow: isActive ? 'var(--mr-shadow)' : 'none',
            }}
          >
            {/* Active gradient rail at bottom */}
            {isActive && (
              <div
                className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                style={{ background: color }}
              />
            )}

            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: isActive ? `${color}20` : 'transparent',
                color: isActive ? color : 'var(--mr-text-faint)',
                border: isActive ? `1.5px solid ${color}40` : '1.5px solid transparent',
              }}
            >
              {act}
            </span>
            <div className="min-w-0">
              <div
                className="text-[13px] font-semibold truncate"
                style={{ color: isActive ? 'var(--mr-text)' : 'var(--mr-text-faint)' }}
              >
                {label}
              </div>
            </div>
          </Link>
        );
      })}

      {/* Progress indicator */}
      <div className="flex items-center px-3 shrink-0">
        <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: 'var(--mr-text-faint)' }}>
          Act {currentAct} of {ACTS.length}
        </span>
      </div>
    </div>
  );
}
