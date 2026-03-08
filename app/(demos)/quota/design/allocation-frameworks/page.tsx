'use client';

import {
  Layers, TrendingUp, BarChart3, GitMerge, Users, FileText, Cpu,
  Sparkles, CheckCircle2, Database, ArrowRight,
} from 'lucide-react';

type Method = {
  name: string;
  description: string;
  bestFor: string;
  complexity: 1 | 2 | 3;
  complexityLabel: string;
  dataRequirements: string;
  icon: typeof Layers;
  borderColor: string;
};

const methods: Method[] = [
  {
    name: 'Top-Down Flat',
    description:
      'Equal distribution of the corporate target across all territories. Every rep gets the same number regardless of market size or historical performance. Simple to implement and easy to explain, but ignores territory potential differences.',
    bestFor: 'New markets, unknown potential',
    complexity: 1,
    complexityLabel: 'Low',
    dataRequirements: 'Minimal',
    icon: Layers,
    borderColor: '#22c55e',
  },
  {
    name: 'Top-Down Historical',
    description:
      'Allocates quota proportional to each territory\'s prior-year actuals, interlocked to the corporate target. Territories that sold more last year receive a proportionally larger share. Rewards consistency but can perpetuate uneven territory design.',
    bestFor: 'Mature, stable territories',
    complexity: 1,
    complexityLabel: 'Low',
    dataRequirements: '12+ months history',
    icon: TrendingUp,
    borderColor: '#22c55e',
  },
  {
    name: 'Bottom-Up Pipeline',
    description:
      'Sums weighted pipeline opportunities per territory to derive each quota. Relies on CRM data quality and consistent stage definitions. Produces quotas that reflect current market reality rather than historical patterns.',
    bestFor: 'Data-rich orgs with clean CRM',
    complexity: 2,
    complexityLabel: 'Medium',
    dataRequirements: 'Live pipeline data',
    icon: BarChart3,
    borderColor: '#f59e0b',
  },
  {
    name: 'Hybrid Interlock',
    description:
      'Combines bottom-up territory forecasts with a top-down corporate target, adjusting individual quotas until they reconcile. The most common enterprise approach because it balances field reality with board-level commitments.',
    bestFor: 'Most common enterprise approach',
    complexity: 2,
    complexityLabel: 'Medium',
    dataRequirements: 'Pipeline + history',
    icon: GitMerge,
    borderColor: '#f59e0b',
  },
  {
    name: 'Market Contribution',
    description:
      'Sets quota based on each territory\'s historical contribution rate within its peer group. Normalizes for territory size differences and rewards efficient sellers. Requires well-defined peer groupings and consistent data.',
    bestFor: 'Outside sales, territory models',
    complexity: 2,
    complexityLabel: 'Medium',
    dataRequirements: 'Peer group data',
    icon: Users,
    borderColor: '#f59e0b',
  },
  {
    name: 'Account Plan',
    description:
      'Builds quota from the sum of account-level opportunity assessments. Each strategic account has a documented revenue plan, and quotas aggregate those plans. High-touch but extremely accurate for named-account selling motions.',
    bestFor: 'Named account / strategic sales',
    complexity: 3,
    complexityLabel: 'High',
    dataRequirements: 'Account plans',
    icon: FileText,
    borderColor: '#ef4444',
  },
  {
    name: 'Dynamic Opportunity',
    description:
      'Uses ML models to match resources to opportunities based on propensity scoring, territory potential indices, and rep capacity. Continuously re-optimizes as new data arrives. Requires mature data infrastructure and organizational trust in algorithmic allocation.',
    bestFor: 'Advanced, high data quality orgs',
    complexity: 3,
    complexityLabel: 'High',
    dataRequirements: 'Rich feature set',
    icon: Cpu,
    borderColor: '#ef4444',
  },
];

function ComplexityDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: i <= level
              ? level === 1 ? '#22c55e' : level === 2 ? '#f59e0b' : '#ef4444'
              : '#e5e7eb',
          }}
        />
      ))}
    </div>
  );
}

export default function AllocationFrameworksPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
              Allocation Frameworks
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
              Choose the right method for your organization&apos;s maturity and data quality
            </p>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
          Method Comparison
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: 'var(--prizym-card-bg)',
            border: '1px solid var(--prizym-border-default)',
            color: 'var(--prizym-text-muted)',
          }}
        >
          7 methods
        </span>
      </div>

      {/* Method Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {methods.map(m => (
          <div
            key={m.name}
            className="rounded-xl p-5 relative overflow-hidden"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
              borderLeft: `4px solid ${m.borderColor}`,
            }}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${m.borderColor}15` }}
                >
                  <m.icon className="h-4 w-4" style={{ color: m.borderColor }} />
                </div>
                <h3 className="text-base font-bold" style={{ color: '#d97706' }}>
                  {m.name}
                </h3>
              </div>
              <ComplexityDots level={m.complexity} />
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--prizym-text-secondary)' }}>
              {m.description}
            </p>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Best For Badge */}
              <span
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                }}
              >
                <CheckCircle2 className="h-3 w-3" />
                {m.bestFor}
              </span>

              {/* Complexity Label */}
              <span
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: m.complexity === 1 ? '#dcfce7' : m.complexity === 2 ? '#fef9c3' : '#fee2e2',
                  color: m.complexity === 1 ? '#166534' : m.complexity === 2 ? '#854d0e' : '#991b1b',
                }}
              >
                Complexity: {m.complexityLabel}
              </span>

              {/* Data Requirements */}
              <span
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                }}
              >
                <Database className="h-3 w-3" />
                {m.dataRequirements}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Engine Card */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fbbf24',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold" style={{ color: '#92400e' }}>
                Recommendation Engine
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold">
                AI
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: '#78350f' }}>
              Based on your data maturity and territory model, QUOTA recommends:
            </p>
            <div
              className="rounded-lg p-4 mb-3"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #fbbf24' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <GitMerge className="h-5 w-5 text-amber-600" />
                <span className="text-base font-bold" style={{ color: '#d97706' }}>
                  Hybrid Interlock
                </span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                  Best Match
                </span>
              </div>
              <p className="text-sm" style={{ color: '#78350f' }}>
                Your organization has 12+ months of historical data and an active pipeline in CRM.
                Hybrid Interlock lets field managers build bottom-up forecasts while finance ensures
                alignment to the board-approved revenue target. This balances local market knowledge
                with corporate accountability and is the most widely adopted method among mid-to-large
                enterprises.
              </p>
            </div>
            <p className="text-xs" style={{ color: '#a16207' }}>
              Recommendation based on territory count, data completeness score, and CRM integration status.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
