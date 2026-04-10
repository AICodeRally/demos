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

/**
 * NavSection renders a collapsible group of nav links.
 *
 * Layout strategy: every row (section header + items) is a CSS grid with
 * three columns — [icon:18px] [label:1fr] [trailing:auto]. That shared
 * grid guarantees icons, labels, and trailing content line up across the
 * section header and every item below it regardless of label length.
 */
export function NavSection({ section, collapsible = true, defaultExpanded, slug: _slug }: Props) {
  const pathname = usePathname();
  const hasActiveItem = section.items.some(
    item => pathname === item.href || pathname.startsWith(item.href + '/')
  );
  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const expanded = userToggled ?? (defaultExpanded !== undefined ? defaultExpanded : hasActiveItem);
  const accent = section.color ?? 'var(--comp-sidebar-active-accent, #6366f1)';

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '18px 1fr auto',
    alignItems: 'center',
    columnGap: 12,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 12,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <button
        type="button"
        onClick={() => collapsible && setUserToggled(expanded ? false : true)}
        aria-expanded={expanded}
        style={{
          ...rowStyle,
          height: 28,
          background: 'transparent',
          border: 'none',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--comp-sidebar-text-muted, rgba(255,255,255,0.78))',
          cursor: collapsible ? 'pointer' : 'default',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
          }}
        >
          <span
            style={{
              display: 'block',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 10px ${accent}, 0 0 2px rgba(255,255,255,0.4)`,
            }}
          />
        </span>
        <span
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
          }}
        >
          {section.section}
        </span>
        {collapsible ? (
          <ChevronDown
            aria-hidden
            style={{
              width: 14,
              height: 14,
              transform: expanded ? 'none' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease',
              color: 'var(--comp-sidebar-text-muted, rgba(255,255,255,0.6))',
            }}
          />
        ) : (
          <span />
        )}
      </button>

      {expanded && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: 4 }}>
          {section.items.map(item => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} style={{ position: 'relative' }}>
                <Link
                  href={item.href}
                  style={{
                    ...rowStyle,
                    minHeight: 38,
                    paddingTop: 8,
                    paddingBottom: 8,
                    marginBottom: 2,
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 14,
                    lineHeight: 1.3,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? 'var(--comp-sidebar-text, #ffffff)'
                      : 'var(--comp-sidebar-text-muted, rgba(255,255,255,0.82))',
                    background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'var(--comp-sidebar-text, #ffffff)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--comp-sidebar-text-muted, rgba(255,255,255,0.82))';
                    }
                  }}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 22,
                        borderRadius: 2,
                        background: accent,
                        boxShadow: `0 0 10px ${accent}`,
                      }}
                    />
                  )}
                  <span
                    aria-hidden
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 18,
                      height: 18,
                    }}
                  >
                    {item.icon && <Icon name={item.icon} style={{ width: 16, height: 16 }} />}
                  </span>
                  <span
                    style={{
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </span>
                  <span />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
