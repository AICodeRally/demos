'use client';

import Link from 'next/link';
import {
  GitBranch,
  FlaskConical,
  Orbit,
  TrendingUp,
  BarChart3,
  Layers,
  Clock,
  Activity,
  Shield,
} from 'lucide-react';

/* ── Key Metrics ────────────────────────────────────────────── */
const metrics = [
  { label: 'Allocation Methods', value: '7', icon: Layers },
  { label: 'Ramp Templates', value: '4', icon: Clock },
  { label: 'Active Scenarios', value: '12', icon: Activity },
  { label: 'Fairness Index (QFI)', value: '0.87', icon: Shield },
];

/* ── Feature Tiles ──────────────────────────────────────────── */
const primaryFeatures = [
  {
    title: 'Allocation Frameworks',
    description: '7 allocation methods from flat distribution to ML-driven dynamic matching',
    href: '/quota/design/allocation-frameworks',
    icon: GitBranch,
  },
  {
    title: 'Scenario Simulator',
    description: 'Monte Carlo what-if engine with P10\u2013P90 confidence bands',
    href: '/quota/design/scenario-simulator',
    icon: FlaskConical,
  },
  {
    title: 'Quota Forces Model',
    description: 'Visualize converging forces that produce optimal quota outcomes',
    href: '/quota/design/quota-forces',
    icon: Orbit,
  },
];

const analysisTools = [
  {
    title: 'Ramp Designer',
    description: 'Build and customize ramp schedules for new hire onboarding',
    href: '/quota/design/ramp-designer',
    icon: TrendingUp,
  },
  {
    title: 'Fairness Analyzer',
    description: 'QFI histogram and outlier detection across territories',
    href: '/quota/dispute/fairness-analyzer',
    icon: BarChart3,
  },
];

/* ── Metric Card ────────────────────────────────────────────── */
function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          {label}
        </span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

/* ── Feature Tile ───────────────────────────────────────────── */
function FeatureTile({
  title,
  description,
  href,
  icon: Icon,
  primary = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl transition-all duration-200"
      style={{
        background: 'var(--prizym-card-bg)',
        border: primary ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
        padding: primary ? '1.75rem' : '1.25rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#f59e0b';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = primary
          ? 'rgba(245, 158, 11, 0.3)'
          : 'var(--prizym-border-default)';
        e.currentTarget.style.boxShadow = 'var(--prizym-shadow-card)';
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: primary ? '2.5rem' : '2rem',
            height: primary ? '2.5rem' : '2rem',
            background: 'rgba(245, 158, 11, 0.1)',
          }}
        >
          <Icon
            className={primary ? 'h-5 w-5' : 'h-4 w-4'}
            style={{ color: '#f59e0b' }}
          />
        </div>
      </div>
      <h3
        className={`font-bold mb-1.5 ${primary ? 'text-base' : 'text-sm'}`}
        style={{ color: 'var(--prizym-text-primary)' }}
      >
        {title}
      </h3>
      <p
        className={`leading-relaxed ${primary ? 'text-sm' : 'text-xs'}`}
        style={{ color: 'var(--prizym-text-muted)' }}
      >
        {description}
      </p>
      <div className="mt-4 flex items-center gap-1">
        <span
          className="text-xs font-medium transition-colors group-hover:text-amber-500"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          Open
        </span>
        <span
          className="text-xs transition-transform duration-200 group-hover:translate-x-0.5"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function QuotaDesignCenterPage() {
  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, #F59E0B10, #F59E0B05)',
        minHeight: '100%',
        padding: '0',
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
          Quota Design Center
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
          Architect your quota strategy &mdash; frameworks, models, and simulations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} />
        ))}
      </div>

      {/* Primary Features */}
      <div className="mb-2">
        <h2
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Core Frameworks
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {primaryFeatures.map((f) => (
          <FeatureTile key={f.title} {...f} primary />
        ))}
      </div>

      {/* Analysis & Tools */}
      <div className="mb-2">
        <h2
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Analysis &amp; Tools
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {analysisTools.map((f) => (
          <FeatureTile key={f.title} {...f} />
        ))}
      </div>
    </div>
  );
}
