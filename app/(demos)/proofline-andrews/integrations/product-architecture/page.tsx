'use client';

import { useState, useEffect } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ORANGE = '#F97316';
const GOLD = '#C6A052';
const GREEN = '#22C55E';
const BLUE = '#2563EB';
const CYAN = '#0EA5E9';
const PURPLE = '#8B5CF6';
const EMERALD = '#10B981';

/* ── Module Definitions ──────────────────────────── */
interface Module {
  name: string;
  shortName: string;
  color: string;
  icon: string;
  capabilities: string[];
  inputs: string;
  outputs: string;
  linkLabel: string;
  linkHref: string;
}

const MODULES: Module[] = [
  {
    name: 'Strategy Engine',
    shortName: 'Strategy',
    color: GOLD,
    icon: '\u2726',
    capabilities: [
      'Territory design & assignment',
      'Quota cascade from corporate to rep',
      'Brand mix optimization',
      'Scenario modeling & what-if analysis',
    ],
    inputs: 'Market data, historical performance',
    outputs: 'Quotas, territory assignments',
    linkLabel: 'See in demo \u2192 Act 2',
    linkHref: '/proofline-andrews/strategy/territories',
  },
  {
    name: 'Operations Hub',
    shortName: 'Operations',
    color: BLUE,
    icon: '\u2630',
    capabilities: [
      'Manager console & team oversight',
      'Day planner & route dispatch',
      'Field intelligence & account insights',
      'TABC compliance monitoring',
    ],
    inputs: 'eoStar deliveries, GPS, TABC',
    outputs: 'Route plans, coaching cards',
    linkLabel: 'See in demo \u2192 Act 3',
    linkHref: '/proofline-andrews/ops/manager',
  },
  {
    name: 'SWIC Engine',
    shortName: 'SWIC',
    color: ORANGE,
    icon: '\u2699',
    capabilities: [
      'Sales-Weighted Incentive Calculator',
      'Tier assignment (T1\u2013T4)',
      'BBI gate evaluation & cascade',
      'Kicker & accelerator processing',
    ],
    inputs: 'Credited sales, plan rules',
    outputs: 'Commission amounts, gate status',
    linkLabel: 'See in demo \u2192 Act 4',
    linkHref: '/proofline-andrews/comp/plan',
  },
  {
    name: 'Comp Management',
    shortName: 'Comp Mgmt',
    color: CYAN,
    icon: '\u2261',
    capabilities: [
      'Data ingestion & measurements',
      'Rewards calculation & statements',
      'Payment processing & payroll files',
      'Inquiry resolution & audit reports',
    ],
    inputs: 'SWIC output, approvals',
    outputs: 'Payroll files, statements',
    linkLabel: 'See in demo \u2192 Act 5',
    linkHref: '/proofline-andrews/comp/mgmt/data',
  },
  {
    name: 'AI Intelligence',
    shortName: 'AI',
    color: EMERALD,
    icon: '\u269B',
    capabilities: [
      'Demand forecasting & trend prediction',
      'Pricing optimization & elasticity',
      'Route optimization & scheduling',
      'Coaching cards & anomaly detection',
    ],
    inputs: 'Historical data, scan data, weather',
    outputs: 'Forecasts, recommendations',
    linkLabel: 'See in demo \u2192 Act 3 AI',
    linkHref: '/proofline-andrews/ops/ai',
  },
  {
    name: 'Integration Layer',
    shortName: 'Integrations',
    color: PURPLE,
    icon: '\u26A1',
    capabilities: [
      'eoStar & VIP/Encompass connectors',
      'D365 & IRI/Nielsen data feeds',
      'ADP payroll & Snowflake warehouse',
      'Event normalization & idempotency',
    ],
    inputs: 'External systems',
    outputs: 'Normalized events',
    linkLabel: 'See in demo \u2192 Act 6 Integrations',
    linkHref: '/proofline-andrews/integrations',
  },
];

/* ── Data Spine Steps ────────────────────────────── */
const SPINE_STEPS = [
  { label: 'Source Event', detail: 'Delivery closes in eoStar', timing: 'real-time' },
  { label: 'Credit Assignment', detail: 'Primary/split/KAM rules applied', timing: '<5ms' },
  { label: 'Gate Evaluation', detail: '4 BBI gates checked', timing: '<10ms' },
  { label: 'Tier Assignment', detail: 'T1\u2013T4 based on attainment', timing: '<5ms' },
  { label: 'Commission Calc', detail: 'Rate \u00D7 cases \u00D7 multiplier', timing: '<20ms' },
  { label: 'Approval Flow', detail: 'Manager \u2192 Finance \u2192 Payroll', timing: 'same day' },
  { label: 'Payment', detail: 'ADP payroll file generated', timing: 'next cycle' },
];

/* ── Module Map SVG ──────────────────────────────── */
function ModuleMapSVG({ mounted }: { mounted: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-xl" style={{
      background: 'var(--pl-card)',
      border: '1px solid var(--pl-border)',
    }}>
      <svg viewBox="0 0 800 340" className="w-full" style={{ minHeight: 260 }}>
        <defs>
          <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--pl-border)" strokeWidth="0.3" opacity="0.3" />
          </pattern>
          <marker id="arrow-flow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--pl-text-faint)" strokeWidth="1" />
          </marker>
        </defs>
        <rect width="800" height="340" fill="url(#arch-grid)" />

        {/* ── External Sources ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0ms',
        }}>
          <rect x={10} y={100} width={80} height={140} rx={8}
            fill="var(--pl-card-alt)" stroke="var(--pl-border)" strokeWidth="1" />
          <text x={50} y={130} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="9" fontFamily="monospace">EXTERNAL</text>
          <text x={50} y={143} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="9" fontFamily="monospace">SOURCES</text>
          {['eoStar', 'VIP', 'D365', 'IRI'].map((s, i) => (
            <g key={s}>
              <rect x={18} y={155 + i * 20} width={64} height={16} rx={4}
                fill="var(--pl-hover)" stroke="var(--pl-border)" strokeWidth="0.5" />
              <text x={50} y={166 + i * 20} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{s}</text>
            </g>
          ))}
        </g>

        {/* ── Flow arrow: Sources → Integration ── */}
        <line x1={92} y1={170} x2={118} y2={170}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>

        {/* ── Integration Layer (Purple) ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 100ms',
        }}>
          <rect x={120} y={80} width={110} height={180} rx={10}
            fill={`${PURPLE}08`} stroke={PURPLE} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={120} y={80} width={110} height={4} rx={2} fill={PURPLE} opacity="0.5" />
          <text x={175} y={104} textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="bold" fontFamily="monospace">INTEGRATION</text>
          <text x={175} y={116} textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="bold" fontFamily="monospace">LAYER</text>
          {['Event normalization', 'Connector mgmt', 'Idempotent ingest'].map((t, i) => (
            <text key={i} x={175} y={138 + i * 16} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{t}</text>
          ))}
          {/* Data flow particles */}
          <circle r="2" fill={PURPLE} opacity="0.7">
            <animateMotion dur="2s" repeatCount="indefinite" path="M92,170 L130,170" />
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ── Flow arrows: Integration → Strategy/Ops ── */}
        <line x1={232} y1={140} x2={270} y2={120}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1={232} y1={200} x2={270} y2={220}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>

        {/* ── Strategy Engine (Gold) ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 200ms',
        }}>
          <rect x={272} y={60} width={130} height={100} rx={10}
            fill={`${GOLD}08`} stroke={GOLD} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={272} y={60} width={130} height={4} rx={2} fill={GOLD} opacity="0.5" />
          <text x={337} y={84} textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="bold" fontFamily="monospace">STRATEGY</text>
          <text x={337} y={96} textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="bold" fontFamily="monospace">ENGINE</text>
          {['Territories & quotas', 'Brand mix & scenarios'].map((t, i) => (
            <text key={i} x={337} y={116 + i * 14} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{t}</text>
          ))}
        </g>

        {/* ── Operations Hub (Blue) ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 200ms',
        }}>
          <rect x={272} y={180} width={130} height={100} rx={10}
            fill={`${BLUE}08`} stroke={BLUE} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={272} y={180} width={130} height={4} rx={2} fill={BLUE} opacity="0.5" />
          <text x={337} y={204} textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="bold" fontFamily="monospace">OPERATIONS</text>
          <text x={337} y={216} textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="bold" fontFamily="monospace">HUB</text>
          {['Manager console', 'Dispatch & compliance'].map((t, i) => (
            <text key={i} x={337} y={236 + i * 14} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{t}</text>
          ))}
        </g>

        {/* ── AI Intelligence Bar (Green) — spanning across Strategy/Ops/SWIC ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 350ms',
        }}>
          <rect x={272} y={296} width={268} height={34} rx={8}
            fill={`${EMERALD}08`} stroke={EMERALD} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={272} y={296} width={268} height={3} rx={1.5} fill={EMERALD} opacity="0.4">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
          </rect>
          <text x={406} y={316} textAnchor="middle" fill={EMERALD} fontSize="9" fontWeight="bold" fontFamily="monospace">
            AI INTELLIGENCE \u2014 Forecasting \u00B7 Pricing \u00B7 Coaching
          </text>
          {/* Dotted connections up to Strategy, Ops, SWIC */}
          <line x1={310} y1={296} x2={310} y2={282} stroke={EMERALD} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.4" />
          <line x1={400} y1={296} x2={400} y2={282} stroke={EMERALD} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.4" />
          <line x1={490} y1={296} x2={490} y2={282} stroke={EMERALD} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.4" />
        </g>

        {/* ── Flow arrows: Strategy/Ops → SWIC ── */}
        <line x1={404} y1={120} x2={442} y2={160}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1={404} y1={220} x2={442} y2={190}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>

        {/* ── SWIC Calculation Engine (Orange) ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 400ms',
        }}>
          <rect x={444} y={120} width={120} height={160} rx={10}
            fill={`${ORANGE}08`} stroke={ORANGE} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={444} y={120} width={120} height={4} rx={2} fill={ORANGE} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </rect>
          <text x={504} y={148} textAnchor="middle" fill={ORANGE} fontSize="11" fontWeight="bold" fontFamily="monospace">SWIC</text>
          <text x={504} y={162} textAnchor="middle" fill={ORANGE} fontSize="9" fontWeight="bold" fontFamily="monospace">CALC ENGINE</text>
          {['Tier assignment', 'Gate evaluation', 'Kicker processing', 'Rate calculation'].map((t, i) => (
            <text key={i} x={504} y={184 + i * 14} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{t}</text>
          ))}
        </g>

        {/* ── Flow arrow: SWIC → Comp Management ── */}
        <line x1={566} y1={200} x2={600} y2={200}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>

        {/* ── Comp Management (Cyan) ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 500ms',
        }}>
          <rect x={602} y={120} width={110} height={160} rx={10}
            fill={`${CYAN}08`} stroke={CYAN} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={602} y={120} width={110} height={4} rx={2} fill={CYAN} opacity="0.5" />
          <text x={657} y={148} textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily="monospace">COMP</text>
          <text x={657} y={160} textAnchor="middle" fill={CYAN} fontSize="10" fontWeight="bold" fontFamily="monospace">MANAGEMENT</text>
          {['Measurements', 'Rewards & payments', 'Inquiries & reports'].map((t, i) => (
            <text key={i} x={657} y={180 + i * 14} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{t}</text>
          ))}
        </g>

        {/* ── Flow arrow: Comp → Payments/BI ── */}
        <line x1={714} y1={200} x2={740} y2={200}
          stroke="var(--pl-text-faint)" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrow-flow)">
          <animate attributeName="strokeDashoffset" values="14;0" dur="1.5s" repeatCount="indefinite" />
        </line>

        {/* ── Payments / BI Output ── */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 600ms',
        }}>
          <rect x={742} y={140} width={50} height={120} rx={8}
            fill="var(--pl-card-alt)" stroke="var(--pl-border)" strokeWidth="1" />
          <text x={767} y={168} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="8" fontFamily="monospace">OUTPUT</text>
          {['ADP', 'Power BI', 'Snowflake'].map((s, i) => (
            <text key={i} x={767} y={190 + i * 16} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="8" fontFamily="monospace">{s}</text>
          ))}
        </g>

        {/* ── Data flow particles along main spine ── */}
        {[
          { path: 'M90,170 L130,170', color: PURPLE, dur: '2.5s', begin: '0s' },
          { path: 'M230,170 L280,140', color: GOLD, dur: '2s', begin: '0.5s' },
          { path: 'M230,170 L280,220', color: BLUE, dur: '2s', begin: '0.8s' },
          { path: 'M400,120 L450,160', color: ORANGE, dur: '2s', begin: '1s' },
          { path: 'M565,200 L610,200', color: CYAN, dur: '1.8s', begin: '1.3s' },
          { path: 'M712,200 L745,200', color: GREEN, dur: '1.5s', begin: '1.6s' },
        ].map((p, i) => (
          <circle key={i} r="2.5" fill={p.color}>
            <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.path} />
            <animate attributeName="opacity" values="0;0.9;0" dur={p.dur} begin={p.begin} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

/* ── Data Spine SVG ──────────────────────────────── */
function DataSpineSVG({ mounted }: { mounted: boolean }) {
  const stepCount = SPINE_STEPS.length;
  const svgWidth = 840;
  const svgHeight = 160;
  const startX = 50;
  const endX = svgWidth - 50;
  const stepSpacing = (endX - startX) / (stepCount - 1);
  const cy = 50;

  // Color gradient from blue to green
  const stepColors = [
    '#3B82F6', '#6366F1', '#8B5CF6', ORANGE, '#F59E0B', EMERALD, GREEN,
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{
      background: 'var(--pl-card)',
      border: '1px solid var(--pl-border)',
    }}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ minHeight: 140 }}>
        <defs>
          <linearGradient id="spine-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor={ORANGE} />
            <stop offset="100%" stopColor={GREEN} />
          </linearGradient>
        </defs>

        {/* Connecting line */}
        <line x1={startX} y1={cy} x2={endX} y2={cy}
          stroke="url(#spine-line-grad)" strokeWidth="2" strokeOpacity="0.3" />

        {/* Animated flow along spine */}
        <circle r="3" fill={ORANGE} opacity="0.8">
          <animateMotion dur="4s" repeatCount="indefinite" path={`M${startX},${cy} L${endX},${cy}`} />
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill={GREEN} opacity="0.5">
          <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path={`M${startX},${cy} L${endX},${cy}`} />
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* Step circles + labels */}
        {SPINE_STEPS.map((step, i) => {
          const cx = startX + i * stepSpacing;
          const color = stepColors[i];
          return (
            <g key={i} style={{
              opacity: mounted ? 1 : 0,
              transition: `opacity 0.4s ease ${i * 100}ms`,
            }}>
              {/* Outer glow */}
              <circle cx={cx} cy={cy} r={18} fill={`${color}10`} stroke={color} strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Inner circle */}
              <circle cx={cx} cy={cy} r={12} fill={`${color}20`} />
              {/* Step number */}
              <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize="11" fontWeight="bold" fontFamily="monospace">
                {i + 1}
              </text>
              {/* Label */}
              <text x={cx} y={cy + 36} textAnchor="middle" fill="var(--pl-text)" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                {step.label}
              </text>
              {/* Detail */}
              <text x={cx} y={cy + 50} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="7" fontFamily="monospace">
                {step.detail}
              </text>
              {/* Timing badge */}
              <rect x={cx - 20} y={cy + 56} width={40} height={14} rx={4}
                fill={`${color}12`} stroke={color} strokeWidth="0.5" strokeOpacity="0.4" />
              <text x={cx} y={cy + 66} textAnchor="middle" fill={color} fontSize="7" fontWeight="bold" fontFamily="monospace">
                {step.timing}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Event-Driven Comparison SVG ─────────────────── */
function ComparisonTimeline({ mounted }: { mounted: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-xl" style={{
      background: 'var(--pl-card)',
      border: '1px solid var(--pl-border)',
    }}>
      <svg viewBox="0 0 700 120" className="w-full" style={{ minHeight: 100 }}>
        {/* Traditional timeline (gray, slow) */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 0ms' }}>
          <text x={20} y={25} fill="var(--pl-text-muted)" fontSize="10" fontWeight="bold" fontFamily="monospace">TRADITIONAL (Alteryx/Excel)</text>
          <rect x={20} y={34} width={660} height={16} rx={4} fill="var(--pl-chart-bar-track)" />
          {/* Slow segments */}
          {[
            { x: 20, w: 160, label: 'Batch ETL', color: '#6B7280' },
            { x: 185, w: 180, label: 'Overnight Processing', color: '#9CA3AF' },
            { x: 370, w: 140, label: 'Next-Day Visibility', color: '#6B7280' },
            { x: 515, w: 165, label: 'Manual Reconciliation', color: '#9CA3AF' },
          ].map((seg, i) => (
            <g key={i}>
              <rect x={seg.x} y={34} width={seg.w} height={16} rx={4} fill={seg.color} opacity="0.25" />
              <text x={seg.x + seg.w / 2} y={45} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="7.5" fontFamily="monospace">{seg.label}</text>
            </g>
          ))}
          <text x={690} y={45} textAnchor="end" fill="var(--pl-text-faint)" fontSize="8" fontWeight="bold" fontFamily="monospace">HOURS / DAYS</text>
        </g>

        {/* PROOFLINE timeline (gold, fast) */}
        <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 200ms' }}>
          <text x={20} y={80} fill={GOLD} fontSize="10" fontWeight="bold" fontFamily="monospace">PROOFLINE</text>
          <rect x={20} y={88} width={660} height={16} rx={4} fill="var(--pl-chart-bar-track)" />
          {/* Fast segments */}
          {[
            { x: 20, w: 40, label: 'Event', color: '#3B82F6' },
            { x: 64, w: 50, label: 'Process', color: ORANGE },
            { x: 118, w: 50, label: 'Visible', color: GREEN },
            { x: 172, w: 60, label: 'Audit Trail', color: GOLD },
          ].map((seg, i) => (
            <g key={i}>
              <rect x={seg.x} y={88} width={seg.w} height={16} rx={4} fill={seg.color} opacity="0.4" />
              <text x={seg.x + seg.w / 2} y={99} textAnchor="middle" fill={seg.color} fontSize="7.5" fontWeight="bold" fontFamily="monospace">{seg.label}</text>
            </g>
          ))}
          {/* Fast indicator arrow */}
          <line x1={240} y1={96} x2={660} y2={96} stroke={GOLD} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.3" />
          <text x={690} y={100} textAnchor="end" fill={GOLD} fontSize="8" fontWeight="bold" fontFamily="monospace">MILLISECONDS</text>
        </g>
      </svg>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────── */
export default function ProductArchitecturePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <ActNavigation currentAct={6} />

      {/* ═══════ HEADER ═══════ */}
      <div className="rounded-xl overflow-hidden mb-8 relative" style={{
        background: `linear-gradient(135deg, rgba(249,115,22,0.12), rgba(198,160,82,0.06), rgba(139,92,246,0.04))`,
        border: '1px solid rgba(249,115,22,0.25)',
      }}>
        <div className="p-8">
          <div className="text-xs mb-3" style={{ color: 'var(--pl-text-faint)' }}>
            Platform &amp; Integrations / Product Architecture
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            PROOFLINE Product Architecture
          </h1>
          <p className="text-sm tabular-nums leading-relaxed max-w-3xl" style={{ color: 'var(--pl-text-muted)' }}>
            Six modules, one data spine, zero spreadsheets
          </p>
        </div>
        <div className="h-1 w-full" style={{
          background: `linear-gradient(90deg, ${PURPLE}, ${GOLD}, ${BLUE}, ${ORANGE}, ${CYAN}, ${EMERALD})`,
          opacity: 0.5,
        }} />
      </div>

      {/* ═══════ KPI ROW ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <LightKpiCard
          label="Modules"
          value="6"
          accent={ORANGE}
          sub="purpose-built"
          stagger={0}
        />
        <LightKpiCard
          label="Data Sources"
          value="8"
          accent={PURPLE}
          sub="connectors integrated"
          stagger={1}
        />
        <LightKpiCard
          label="Calc Latency"
          value="<50ms"
          accent={GOLD}
          sub="end-to-end p95"
          sparkline={[62, 58, 54, 52, 50, 48, 47, 48]}
          stagger={2}
        />
        <LightKpiCard
          label="Audit Events"
          value="2.4M"
          accent={CYAN}
          delta={18.2}
          sub="monthly (8-wk trend)"
          sparkline={[1.6, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4]}
          stagger={3}
        />
        <LightKpiCard
          label="Uptime"
          value="99.97%"
          accent={GREEN}
          sub="zero incidents (30d)"
          stagger={4}
        />
      </div>

      {/* ═══════ MODULE MAP ═══════ */}
      <LightSectionCard title="MODULE MAP">
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-faint)' }}>
          Six modules connected by an event-driven data spine. Data flows left to right, from external sources through to payments and BI.
        </p>
        <ModuleMapSVG mounted={mounted} />
      </LightSectionCard>

      {/* ═══════ DATA SPINE ═══════ */}
      <LightSectionCard title="DATA SPINE \u2014 ONE DELIVERY TO ONE COMMISSION">
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-faint)' }}>
          Seven steps from delivery close-out to payroll file. Every step timed, every number traced.
        </p>
        <DataSpineSVG mounted={mounted} />

        {/* Gold callout */}
        <div className="mt-5 rounded-xl p-4" style={{
          background: `${GOLD}06`,
          border: `1.5px solid ${GOLD}30`,
        }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: `${GOLD}15`, color: GOLD }}>
              {'\u23F1'}
            </div>
            <p className="text-sm tabular-nums leading-relaxed" style={{ color: 'var(--pl-text)' }}>
              <span className="font-bold" style={{ color: GOLD }}>End-to-end:</span>{' '}
              From delivery close-out to commission visibility in under 50 milliseconds.
              Payout in next pay cycle. No batch ETL. No overnight jobs. No spreadsheet reconciliation.
            </p>
          </div>
        </div>
      </LightSectionCard>

      {/* ═══════ MODULE DETAIL CARDS ═══════ */}
      <LightSectionCard title="MODULE DETAILS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map((mod, i) => (
            <div key={mod.name} className="rounded-xl overflow-hidden transition-all"
              style={{
                background: 'var(--pl-card)',
                border: `1px solid var(--pl-border)`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.5s ease ${i * 80}ms`,
              }}>
              {/* Colored left border accent */}
              <div className="flex">
                <div className="w-1 flex-shrink-0" style={{ background: mod.color }} />
                <div className="flex-1 p-4">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ background: `${mod.color}15`, color: mod.color }}>
                      {mod.icon}
                    </div>
                    <span className="text-sm font-bold" style={{ color: mod.color, fontFamily: 'var(--pl-font)' }}>
                      {mod.name}
                    </span>
                  </div>

                  {/* Capabilities */}
                  <ul className="space-y-1.5 mb-3">
                    {mod.capabilities.map((cap, ci) => (
                      <li key={ci} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: mod.color, opacity: 0.6 }} />
                        <span className="text-xs leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Inputs / Outputs */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-[10px] font-bold tabular-nums uppercase tracking-widest mb-1" style={{ color: 'var(--pl-text-faint)' }}>
                        Inputs
                      </div>
                      <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>{mod.inputs}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tabular-nums uppercase tracking-widest mb-1" style={{ color: 'var(--pl-text-faint)' }}>
                        Outputs
                      </div>
                      <div className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>{mod.outputs}</div>
                    </div>
                  </div>

                  {/* Link */}
                  <a href={mod.linkHref}
                    className="text-xs font-bold tabular-nums transition-colors"
                    style={{ color: mod.color }}>
                    {mod.linkLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ═══════ WHY EVENT-DRIVEN ═══════ */}
      <LightSectionCard title="WHY EVENT-DRIVEN?">
        <div className="mb-4 rounded-xl p-4" style={{
          background: `${GOLD}06`,
          border: `1.5px solid ${GOLD}25`,
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Traditional */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#9CA3AF' }} />
                <span className="text-xs font-bold tabular-nums uppercase tracking-widest" style={{ color: 'var(--pl-text-faint)' }}>
                  Traditional (Alteryx/Excel)
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  'Batch ETL \u2192 overnight processing',
                  'Next-day visibility at best',
                  'Manual reconciliation required',
                  'No row-level audit trail',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#EF4444', opacity: 0.6 }} />
                    <span className="text-xs" style={{ color: 'var(--pl-text-faint)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* PROOFLINE */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
                <span className="text-xs font-bold tabular-nums uppercase tracking-widest" style={{ color: GOLD }}>
                  PROOFLINE
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  'Event-driven \u2192 real-time processing',
                  'Instant visibility on delivery close',
                  'Automated audit trail end-to-end',
                  'Row-level lineage from source to payout',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GREEN }} />
                    <span className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Timeline */}
          <ComparisonTimeline mounted={mounted} />
        </div>
      </LightSectionCard>

      {/* ═══════ FOOTER ═══════ */}
      <div className="text-center py-6">
        <p className="text-xs" style={{ color: 'var(--pl-text-faint)' }}>
          PROOFLINE architecture designed for beverage distribution at scale. 36 routes today, engineered for 500+.
        </p>
      </div>
    </>
  );
}
