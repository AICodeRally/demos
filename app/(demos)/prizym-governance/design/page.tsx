'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { QuadrantTile, type QuadrantTileProps } from '@/components/demos/prizym-governance/QuadrantTile';
import { PLANS } from '@/data/prizym-governance/plans';
import { SCP_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Frameworks, asc606Templates, asc606Policies } from '@/data/prizym-governance/asc606';
import { Calculator, BookOpen, FileText, LayoutTemplate, Network, Landmark } from 'lucide-react';

type TileSpec = Omit<QuadrantTileProps, 'mounted' | 'delay'>;

const PRIMARY_TILES: TileSpec[] = [
  {
    href: '/prizym-governance/design/asc606-calculator',
    title: 'ASC 606 Calculator',
    description:
      'Model revenue allocation across performance obligations using standalone selling prices. Generates monthly recognition schedule and sample journal entries.',
    icon: Calculator,
    accent: '#06b6d4',
    badge: 'GAAP compliant',
    variant: 'primary',
  },
  {
    href: '/prizym-governance/design/asc606-library',
    title: 'ASC 606 Framework Library',
    description:
      'Five-step model, BHG offering PO catalog, policy and template library for revenue recognition governance.',
    icon: BookOpen,
    accent: '#8b5cf6',
    badge: '2 frameworks · 4 policies · 3 templates',
    variant: 'primary',
  },
];

const SECONDARY_TILES: TileSpec[] = [
  {
    href: '/prizym-governance/plans',
    title: 'Compensation Plans',
    description: 'Active and in-progress compensation plan documents.',
    icon: FileText,
    accent: '#06b6d4',
    variant: 'secondary',
  },
  {
    href: '/prizym-governance/templates',
    title: 'Plan Templates',
    description: 'System and custom templates for governance and comp plan authoring.',
    icon: LayoutTemplate,
    accent: '#3b82f6',
    variant: 'secondary',
  },
  {
    href: '/prizym-governance/frameworks',
    title: 'Governance Frameworks',
    description: '88-checkpoint SGM framework + supporting pillars.',
    icon: Network,
    accent: '#8b5cf6',
    variant: 'secondary',
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
        {PRIMARY_TILES.map((tile, i) => (
          <QuadrantTile key={tile.href} {...tile} mounted={mounted} delay={0.2 + i * 0.1} />
        ))}
      </div>

      <h2 className="pg-subheading" style={{ marginBottom: 14 }}>
        Plans, Templates, Frameworks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECONDARY_TILES.map((tile, i) => (
          <QuadrantTile key={tile.href} {...tile} mounted={mounted} delay={0.45 + i * 0.08} />
        ))}
      </div>
    </PrizymPage>
  );
}
