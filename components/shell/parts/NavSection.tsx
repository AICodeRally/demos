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

export function NavSection({ section, collapsible = true, defaultExpanded = true, slug }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const pathname = usePathname();

  return (
    <div className="mb-1">
      <button
        onClick={() => collapsible && setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--comp-nav-section-label)]"
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <span className="text-white/70">
          {section.section}
        </span>
        {collapsible && (
          <ChevronDown
            className={`h-3 w-3 transition-transform ${expanded ? '' : '-rotate-90'}`}
          />
        )}
      </button>

      {(expanded || !collapsible) && (
        <div className="space-y-0.5">
          {section.items.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 font-medium text-[var(--comp-sidebar-text)]'
                    : 'text-[var(--comp-sidebar-text-muted)] hover:bg-white/5 hover:text-[var(--comp-sidebar-text)]'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute left-0 h-6 w-1 rounded-r"
                    style={{ backgroundColor: section.color ?? 'var(--comp-sidebar-active-accent)' }}
                  />
                )}
                {item.icon && <Icon name={item.icon} className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
