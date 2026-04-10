'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Icon } from './IconResolver';
import type { NavSection as NavSectionType } from '../config/types';

interface Props {
  section: NavSectionType;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  slug: string;
}

export function NavSection({ section, collapsible = true, defaultExpanded, slug }: Props) {
  const pathname = usePathname();
  const hasActiveItem = section.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'));
  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const expanded = userToggled ?? (defaultExpanded !== undefined ? defaultExpanded : hasActiveItem);

  const accent = section.color ?? 'var(--comp-sidebar-active-accent)';

  return (
    <div className="mb-3">
      <button
        onClick={() => collapsible && setUserToggled(expanded ? false : true)}
        className="flex w-full items-center justify-between rounded pl-5 pr-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]"
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <span
          className="flex items-center gap-2 truncate"
          style={{ color: 'var(--comp-sidebar-text-muted, rgba(255,255,255,0.72))' }}
        >
          <span
            aria-hidden
            className="inline-block h-1 w-1 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          {section.section}
        </span>
        {collapsible && (
          <ChevronDown
            className={`h-3 w-3 shrink-0 transition-transform ${expanded ? '' : '-rotate-90'}`}
            style={{ color: 'var(--comp-sidebar-text-muted, rgba(255,255,255,0.6))' }}
          />
        )}
      </button>

      {(expanded || !collapsible) && (
        <div className="mt-1 space-y-0.5">
          {section.items.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex min-h-[36px] items-center gap-3 rounded-lg pl-5 pr-3 py-2 text-sm leading-tight transition-colors ${
                  isActive
                    ? 'bg-white/15 font-semibold text-[var(--comp-sidebar-text)]'
                    : 'text-[var(--comp-sidebar-text-muted)] hover:bg-white/10 hover:text-[var(--comp-sidebar-text)]'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute left-1 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r"
                    style={{ backgroundColor: accent }}
                  />
                )}
                {item.icon && <Icon name={item.icon} className="h-4 w-4 shrink-0" />}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
