'use client';

import {
  Globe, TrendingUp, GitBranch, Users, Brain, Layers,
  Target, ArrowRight, Quote, Sparkles, Shield, MapPin,
} from 'lucide-react';

/* ── Force Definitions ────────────────────────────────────── */

interface Force {
  key: string;
  label: string;
  icon: React.ElementType;
  bullets: string[];
  weight: number;
  /** CSS position offsets from center (%) */
  x: number;
  y: number;
}

const FORCES: Force[] = [
  {
    key: 'market',
    label: 'Market Potential',
    icon: Globe,
    bullets: ['TAM / SAM / SOM analysis', 'Territory sizing & density', 'Market growth rates'],
    weight: 25,
    x: -38,
    y: -42,
  },
  {
    key: 'historical',
    label: 'Historical Performance',
    icon: TrendingUp,
    bullets: ['Last-year actuals', 'Trend analysis', 'Seasonality patterns'],
    weight: 20,
    x: 38,
    y: -42,
  },
  {
    key: 'pipeline',
    label: 'Pipeline Intelligence',
    icon: GitBranch,
    bullets: ['Current pipeline value', 'Conversion rates', 'Deal velocity metrics'],
    weight: 20,
    x: -48,
    y: 0,
  },
  {
    key: 'capacity',
    label: 'Sales Capacity',
    icon: Users,
    bullets: ['Headcount & ramp status', 'Territory coverage gaps', 'Open roles impact'],
    weight: 15,
    x: 48,
    y: 0,
  },
  {
    key: 'predictive',
    label: 'Predictive Forecasting',
    icon: Brain,
    bullets: ['ML ensemble models', 'ARIMA + Prophet blend', 'XGBoost feature ranking'],
    weight: 12,
    x: -38,
    y: 42,
  },
  {
    key: 'strategic',
    label: 'Strategic Overlay',
    icon: Layers,
    bullets: ['Management judgment', 'Product launch lift', 'Market expansion plans'],
    weight: 8,
    x: 38,
    y: 42,
  },
];

/* ── Force Card ───────────────────────────────────────────── */

function ForceCard({ force }: { force: Force }) {
  const Icon = force.icon;
  return (
    <div
      className="rounded-xl p-4 w-[220px] z-10"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Icon className="h-4 w-4 text-amber-600" />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
          {force.label}
        </span>
      </div>
      <ul className="space-y-1">
        {force.bullets.map((b) => (
          <li key={b} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--prizym-text-muted)' }}>
            <span className="text-amber-400 mt-0.5">&#8226;</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── SVG Connecting Lines ─────────────────────────────────── */

function ConnectingLines() {
  /* 6 lines from each force position toward center. Coordinates mapped
     to a 700x500 viewBox where center = (350, 250). Card positions are
     approximate anchor points near card edges closest to center. */
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [
    { x1: 190, y1: 110, x2: 310, y2: 220 },  // market → center
    { x1: 510, y1: 110, x2: 390, y2: 220 },  // historical → center
    { x1: 150, y1: 250, x2: 290, y2: 250 },  // pipeline → center
    { x1: 550, y1: 250, x2: 410, y2: 250 },  // capacity → center
    { x1: 190, y1: 390, x2: 310, y2: 280 },  // predictive → center
    { x1: 510, y1: 390, x2: 390, y2: 280 },  // strategic → center
  ];

  return (
    <svg
      viewBox="0 0 700 500"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
        </linearGradient>
        <marker
          id="arrowHead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" opacity="0.7" />
        </marker>
      </defs>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="url(#lineGrad)"
          strokeWidth="2"
          strokeDasharray="6 4"
          markerEnd="url(#arrowHead)"
        />
      ))}
    </svg>
  );
}

/* ── Weight Bar ───────────────────────────────────────────── */

function WeightBar({ label, weight, icon: Icon }: { label: string; weight: number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[180px] flex items-center gap-2 shrink-0">
        <Icon className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium truncate" style={{ color: 'var(--prizym-text-primary)' }}>
          {label}
        </span>
      </div>
      <div className="flex-1 h-7 rounded-full overflow-hidden" style={{ background: '#fef3c7' }}>
        <div
          className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
          style={{
            width: `${weight}%`,
            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
          }}
        >
          <span className="text-xs font-bold text-white">{weight}%</span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function QuotaForcesPage() {
  return (
    <div className="space-y-10 pb-12">
      {/* ── Header ────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
          Quota Forces Model
        </h1>
        <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--prizym-text-muted)' }}>
          Converging forces that produce optimal quota outcomes — the science behind intelligent quotas
        </p>
      </div>

      {/* ── Forces Convergence Diagram ────────────────────── */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-6" style={{ color: 'var(--prizym-text-muted)' }}>
          Forces Convergence Diagram
        </h2>

        <div className="relative w-full" style={{ height: 560 }}>
          <ConnectingLines />

          {/* Center — Optimal Quota */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Glow rings */}
            <div className="absolute h-32 w-32 rounded-full bg-amber-200 opacity-20 animate-pulse" />
            <div className="absolute h-24 w-24 rounded-full bg-amber-300 opacity-30" />
            <div className="h-[88px] w-[88px] rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex flex-col items-center justify-center shadow-lg shadow-amber-300/40">
              <Target className="h-5 w-5 text-white mb-0.5" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-tight text-center">
                Optimal<br />Quota
              </span>
            </div>
          </div>

          {/* Force cards — positioned radially */}
          {FORCES.map((f) => (
            <div
              key={f.key}
              className="absolute"
              style={{
                left: `calc(50% + ${f.x}% - 110px)`,
                top: `calc(50% + ${f.y}% - 50px)`,
              }}
            >
              <ForceCard force={f} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Intelligent Quotas Principle ──────────────────── */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
            <Quote className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold italic" style={{ color: 'var(--prizym-text-primary)' }}>
              &ldquo;Assign reps to quotas, not quotas to reps.&rdquo;
            </p>
            <p className="text-sm mt-2 leading-relaxed max-w-3xl" style={{ color: 'var(--prizym-text-secondary)' }}>
              Traditional quota setting starts with a number and forces it onto the salesforce.
              Intelligent quotas start with the territory&rsquo;s true potential and match the right rep
              to the right opportunity. The result: higher attainment, lower turnover, and better coverage.
            </p>
          </div>
        </div>

        {/* Three pillars */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {[
            { label: 'Predictive Forecasting', icon: Brain, desc: 'ML-driven demand signals' },
            { label: 'Territory Alignment', icon: MapPin, desc: 'Balanced opportunity zones' },
            { label: 'Sales Coverage', icon: Shield, desc: 'Right rep, right territory' },
          ].map((pillar, i) => (
            <div key={pillar.label} className="flex items-center gap-3">
              <div
                className="rounded-lg p-4 w-[200px] text-center"
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                }}
              >
                <pillar.icon className="h-5 w-5 text-amber-600 mx-auto mb-1.5" />
                <p className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
                  {pillar.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
                  {pillar.desc}
                </p>
              </div>
              {i < 2 && (
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
              )}
            </div>
          ))}

          {/* Equals sign + result */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-amber-500">=</span>
            <div
              className="rounded-lg p-4 w-[200px] text-center"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              }}
            >
              <Sparkles className="h-5 w-5 text-white mx-auto mb-1.5" />
              <p className="text-sm font-bold text-white">Inherited Quotas</p>
              <p className="text-xs mt-0.5 text-amber-100">Territory-first allocation</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Force Weights ─────────────────────────────────── */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: 'var(--prizym-text-muted)' }}>
          Force Weights — Relative Influence on Quota Outcome
        </h2>
        <div className="space-y-3 max-w-2xl">
          {FORCES.sort((a, b) => b.weight - a.weight).map((f) => (
            <WeightBar key={f.key} label={f.label} weight={f.weight} icon={f.icon} />
          ))}
        </div>
        <p className="text-xs mt-4 max-w-xl" style={{ color: 'var(--prizym-text-muted)' }}>
          Weights are configurable per business unit. The default distribution above reflects best-practice
          benchmarks from 200+ enterprise quota-setting engagements.
        </p>
      </div>
    </div>
  );
}
