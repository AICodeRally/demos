'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface QuadrantTileProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  badge?: string;
  mounted?: boolean;
  delay?: number;
  /**
   * primary: 44px icon bubble, accent top border, "Open →" footer (default)
   * secondary: 36px icon bubble, no border or footer
   */
  variant?: 'primary' | 'secondary';
}

export function QuadrantTile({
  href,
  title,
  description,
  icon: Icon,
  accent,
  badge,
  mounted = true,
  delay = 0,
  variant = 'primary',
}: QuadrantTileProps) {
  const isPrimary = variant === 'primary';
  const bubbleSize = isPrimary ? 42 : 36;
  const iconSize = isPrimary ? 20 : 18;

  return (
    <Link
      href={href}
      className={isPrimary ? 'pg-card-elevated' : 'pg-card'}
      style={{
        display: 'block',
        textDecoration: 'none',
        borderTop: isPrimary ? `3px solid ${accent}` : undefined,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}s`,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div
          style={{
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${accent}18`,
            border: `1px solid ${accent}${isPrimary ? '50' : '40'}`,
            flexShrink: 0,
          }}
        >
          <Icon size={iconSize} style={{ color: accent }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="pg-subheading" style={{ marginBottom: 4, fontSize: isPrimary ? undefined : 16 }}>
            {title}
          </h3>
          {badge && (
            <span className="pg-overline" style={{ color: accent, fontSize: 14 }}>
              {badge}
            </span>
          )}
        </div>
      </div>
      <p className="pg-caption" style={{ marginBottom: isPrimary ? 12 : 0, lineHeight: 1.5 }}>
        {description}
      </p>
      {isPrimary && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: accent,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Open <ArrowRight size={14} />
        </div>
      )}
    </Link>
  );
}
