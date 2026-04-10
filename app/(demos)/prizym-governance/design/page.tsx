'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { PLANS } from '@/data/prizym-governance/plans';
import { SCP_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Frameworks, asc606Templates, asc606Policies } from '@/data/prizym-governance/asc606';
import { Calculator, BookOpen, FileText, LayoutTemplate, Network, ArrowRight, Landmark } from 'lucide-react';

interface FeatureTile {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>;
  accent: string;
  badge?: string;
  primary?: boolean;
}

const PRIMARY_TILES: FeatureTile[] = [
  {
    href: '/prizym-governance/design/asc606-calculator',
    title: 'ASC 606 Calculator',
    description:
      'Model revenue allocation across performance obligations using standalone selling prices. Generates monthly recognition schedule and sample journal entries.',
    icon: Calculator,
    accent: '#06b6d4',
    badge: 'GAAP compliant',
    primary: true,
  },
  {
    href: '/prizym-governance/design/asc606-library',
    title: 'ASC 606 Framework Library',
    description:
      'Five-step model, BHG offering PO catalog, policy and template library for revenue recognition governance.',
    icon: BookOpen,
    accent: '#8b5cf6',
    badge: '2 frameworks · 4 policies · 3 templates',
    primary: true,
  },
];

const SECONDARY_TILES: FeatureTile[] = [
  {
    href: '/prizym-governance/plans',
    title: 'Compensation Plans',
    description: 'Active and in-progress compensation plan documents.',
    icon: FileText,
    accent: '#06b6d4',
  },
  {
    href: '/prizym-governance/templates',
    title: 'Plan Templates',
    description: 'System and custom templates for governance and comp plan authoring.',
    icon: LayoutTemplate,
    accent: '#3b82f6',
  },
  {
    href: '/prizym-governance/frameworks',
    title: 'Governance Frameworks',
    description: '88-checkpoint SGM framework + supporting pillars.',
    icon: Network,
    accent: '#8b5cf6',
  },
];

export default function DesignQuadrantPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = [
    { label: 'Comp Plans', value: String(PLANS.length), icon: FileText, color: '#06b6d4' },
    { label: 'SCPs (incl. ASC 606)', value: String(SCP_POLICIES.length + asc606Policies.length), icon: BookOpen, color: '#3b82f6' },
    { label: 'ASC 606 Templates', value: String(asc606Templates.length), icon: LayoutTemplate, color: '#8b5cf6' },
    { label: 'ASC 606 Frameworks', value: String(asc606Frameworks.length), icon: Landmark, color: '#0ea5e9' },
  ];

  return (
    <PrizymPage
      title="Design"
      subtitle="Author compensation plans, templates, frameworks, and revenue recognition models"
      mode="design"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />
        ))}
      </div>

      <h2 className="pg-subheading" style={{ marginBottom: 14 }}>
        Revenue Recognition (ASC 606)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {PRIMARY_TILES.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="pg-card-elevated"
              style={{
                display: 'block',
                textDecoration: 'none',
                borderTop: `3px solid ${tile.accent}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.1}s`,
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${tile.accent}18`,
                    border: `1px solid ${tile.accent}50`,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} style={{ color: tile.accent }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="pg-subheading" style={{ marginBottom: 4 }}>
                    {tile.title}
                  </h3>
                  {tile.badge && (
                    <span
                      className="pg-overline"
                      style={{
                        color: tile.accent,
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tile.badge}
                    </span>
                  )}
                </div>
              </div>
              <p className="pg-caption" style={{ marginBottom: 12, lineHeight: 1.5 }}>
                {tile.description}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: tile.accent,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Open
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="pg-subheading" style={{ marginBottom: 14 }}>
        Plans, Templates, Frameworks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECONDARY_TILES.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="pg-card"
              style={{
                display: 'block',
                textDecoration: 'none',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.45 + i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${tile.accent}18`,
                    border: `1px solid ${tile.accent}40`,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: tile.accent }} />
                </div>
                <h3 className="pg-subheading" style={{ fontSize: 16 }}>
                  {tile.title}
                </h3>
              </div>
              <p className="pg-caption" style={{ lineHeight: 1.5 }}>
                {tile.description}
              </p>
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
