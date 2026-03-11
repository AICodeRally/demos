'use client';

import { useState, useEffect } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard, Sparkline } from '@/components/demos/proofline';

const ACCENT = '#F97316';
const GREEN = '#22C55E';
const BLUE = '#2563EB';
const CYAN = '#0EA5E9';
const PURPLE = '#8B5CF6';
const SLATE = '#94A3B8';

/* ── Connector definitions ─────────────────────── */
interface Connector {
  name: string;
  layer: 'ingestion' | 'engine' | 'workflow';
  description: string;
  status: 'live' | 'configured' | 'available';
  lastSync?: string;
  records?: number;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  icon: string;
  throughput?: string;
  latency?: number;
}

const CONNECTORS: Connector[] = [
  // Layer 1 — Ingestion
  { name: 'eoStar', layer: 'ingestion', description: 'Route accounting & DSD — delivery confirmation, keg tracking, invoice reconciliation. Real-time sync on delivery close-out.', status: 'live', lastSync: '12m ago', records: 48200, direction: 'bidirectional', icon: 'eS', throughput: '2.4K/hr', latency: 28 },
  { name: 'VIP/Encompass', layer: 'ingestion', description: 'Warehouse management — pick/pack/ship, inventory positions, lot tracking, FIFO rotation', status: 'live', lastSync: '45m ago', records: 186000, direction: 'inbound', icon: 'V', throughput: '1.8K/hr', latency: 56 },
  { name: 'GreatPlains/D365', layer: 'ingestion', description: 'Financials — GL posting, accruals, AP/AR, chargebacks, supplier rebate tracking', status: 'live', lastSync: '2h ago', records: 24800, direction: 'bidirectional', icon: 'GP', throughput: '960/hr', latency: 89 },
  { name: 'IRI/Nielsen', layer: 'ingestion', description: 'Syndicated scan data — velocity by SKU/store, category share, price tracking, promotional lift measurement', status: 'configured', direction: 'inbound', icon: 'IR', latency: 340 },
  { name: 'RetailLink / Kroger 84.51\u00B0', layer: 'ingestion', description: 'Chain retail portals — POS scan data, on-shelf availability, promotional compliance, planogram adherence', status: 'available', direction: 'inbound', icon: 'RL', latency: 450 },
  { name: 'TABC License API', layer: 'ingestion', description: 'Texas Alcoholic Beverage Commission — license validation, permit expiration alerts, compliance checks', status: 'live', lastSync: '24h ago', records: 4847, direction: 'inbound', icon: 'TX', throughput: '120/day', latency: 210 },
  { name: 'ADP Workforce', layer: 'ingestion', description: 'HRIS data — org chart, job levels, compensation bands, RSR/KAM role mapping', status: 'live', lastSync: '24h ago', records: 43, direction: 'inbound', icon: '$', throughput: '43/day', latency: 210 },
  { name: 'Snowflake', layer: 'ingestion', description: 'Data warehouse — centralized sales & comp analytics, historical route performance', status: 'live', lastSync: '1h ago', records: 2400000, direction: 'bidirectional', icon: '\u2744', throughput: '48K/hr', latency: 124 },
  // Layer 2 — Engine
  { name: 'Alteryx', layer: 'engine', description: 'Legacy ETL workflows — territory mapping, data blending (migration path to native PROOFLINE pipelines)', status: 'live', lastSync: '4h ago', records: 186000, direction: 'inbound', icon: 'A', throughput: '8.4K/hr', latency: 56 },
  // Layer 3 — Workflow / Outbound
  { name: 'Power BI', layer: 'workflow', description: 'Executive dashboards — comp expense heatmaps, territory deep-dives, route profitability', status: 'live', lastSync: '30m ago', records: 12400, direction: 'outbound', icon: 'P', throughput: '2.1K/hr', latency: 34 },
  { name: 'Tableau', layer: 'workflow', description: 'Self-service analytics — what-if models, brand mix scenario comparison, kicker ROI analysis', status: 'configured', direction: 'outbound', icon: 'T', latency: 67 },
  { name: 'Alteryx Reports', layer: 'workflow', description: 'Scheduled report generation — payroll files, supplier scorecards, route performance PDFs', status: 'available', direction: 'outbound', icon: 'A', latency: 45 },
];

const LAYER_META: Record<string, { label: string; color: string; description: string }> = {
  ingestion: { label: 'Ingestion + Data Layer', color: '#3B82F6', description: 'Source connectors feeding event-driven data into PROOFLINE' },
  engine: { label: 'Calculation Engine', color: ACCENT, description: 'ML and analytics powering the computation core' },
  workflow: { label: 'Workflow + Finalization', color: '#10B981', description: 'Outbound to BI tools, payroll, and rep-facing portals' },
};

const LAYER_ORDER: Array<'ingestion' | 'engine' | 'workflow'> = ['ingestion', 'engine', 'workflow'];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; pulse: boolean }> = {
  live: { bg: 'rgba(34,197,94,0.12)', color: GREEN, label: 'LIVE', pulse: true },
  configured: { bg: 'rgba(37,99,235,0.12)', color: BLUE, label: 'CONFIGURED', pulse: false },
  available: { bg: 'rgba(148,163,184,0.10)', color: SLATE, label: 'AVAILABLE', pulse: false },
};

const DIRECTION_LABELS: Record<string, { label: string; color: string }> = {
  inbound: { label: '\u2190 Inbound', color: '#3B82F6' },
  outbound: { label: 'Outbound \u2192', color: '#10B981' },
  bidirectional: { label: '\u2194 Bidirectional', color: '#8B5CF6' },
};

/* ── API Metrics ────────────────────────────────── */
const API_METRICS = [
  { endpoint: '/api/orders', calls24h: 12480, avgMs: 42, errorRate: 0.02, p99: 128 },
  { endpoint: '/api/accounts', calls24h: 3200, avgMs: 38, errorRate: 0.0, p99: 95 },
  { endpoint: '/api/comp/credits', calls24h: 8640, avgMs: 56, errorRate: 0.05, p99: 180 },
  { endpoint: '/api/comp/payments', calls24h: 720, avgMs: 124, errorRate: 0.0, p99: 340 },
  { endpoint: '/api/analytics/push', calls24h: 480, avgMs: 890, errorRate: 0.1, p99: 2400 },
];

/* ── Platform Capabilities ─────────────────────── */
const PLATFORM_CAPABILITIES = [
  {
    name: 'GOCC',
    title: 'Governance',
    description: 'Policy enforcement, approval guardrails, compliance rules. Every comp plan change goes through configurable approval gates.',
    color: '#8B5CF6',
    icon: '\u229A',
    stats: '14 active policies',
  },
  {
    name: 'Spine',
    title: 'Audit Trail',
    description: 'Immutable audit log. Every calculation traced, every change recorded. Row-level lineage from source data to payout.',
    color: '#0EA5E9',
    icon: '\u29C9',
    stats: '2.4M audit events',
  },
  {
    name: 'AICC',
    title: 'AI Agents',
    description: 'AI-powered forecasting, coaching recommendations, anomaly detection. Proactive alerts before problems become disputes.',
    color: '#F97316',
    icon: '\u269B',
    stats: '6 active agents',
  },
  {
    name: 'Pulse',
    title: 'Telemetry',
    description: 'Real-time change intelligence and drift detection. Know when comp plans, territories, or quotas shift before reps notice.',
    color: '#10B981',
    icon: '\u2261',
    stats: '99.97% uptime',
  },
  {
    name: 'Edge',
    title: 'Runtime',
    description: 'Multi-tenant deployment with client isolation. Custom configuration per distributor — separate plans, rules, and branding.',
    color: '#2563EB',
    icon: '\u25C8',
    stats: 'Tenant-isolated',
  },
];

/* ── Alteryx Comparison Data ───────────────────── */
const COMPARISON = [
  { dimension: 'Data Processing', alteryx: 'Batch ETL workflows\u200A\u2014\u200Ahourly or daily runs', proofline: 'Event-driven ingestion\u200A\u2014\u200Areal-time, sub-second', icon: '\u23F1' },
  { dimension: 'Recalculation', alteryx: 'Full rerun on any change\u200A\u2014\u200A45 min per cycle', proofline: 'Selective recompute\u200A\u2014\u200Aonly affected rows, seconds', icon: '\u21BB' },
  { dimension: 'Audit Trail', alteryx: 'Workflow-level logs\u200A\u2014\u200A"this workflow ran"', proofline: 'Row-level lineage\u200A\u2014\u200Aevery number traced to source', icon: '\u2690' },
  { dimension: 'Version Control', alteryx: 'Manual file versions\u200A\u2014\u200Ahope you saved the right one', proofline: 'Built-in versioning\u200A\u2014\u200Aeffective-dated plan rules, rollback', icon: '\u2637' },
];

/* ── Animated Pulse Dot ─────────────────────────── */
function PulseDot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: color,
        animation: 'pulse-ring 2s ease-out infinite',
      }} />
      <div className="absolute inset-0 rounded-full" style={{ background: color }} />
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Latency Bar ────────────────────────────────── */
function LatencyBar({ ms, max = 1000 }: { ms: number; max?: number }) {
  const pct = Math.min((ms / max) * 100, 100);
  const color = ms < 100 ? GREEN : ms < 500 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pl-hover)', maxWidth: 80 }}>
        <div className="h-full rounded-full" style={{
          width: `${pct}%`,
          background: color,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <span className="text-xs font-mono font-bold" style={{ color }}>{ms}ms</span>
    </div>
  );
}

/* ── Three-Layer Architecture SVG ─────────────── */
function ArchitectureDiagram({ mounted }: { mounted: boolean }) {
  const layerColors = ['#3B82F6', ACCENT, '#10B981'];
  const layerLabels = ['Ingestion + Data', 'Calculation Engine', 'Workflow + Finalization'];
  const layerDescLines = [
    ['CRM, ERP, HR/Payroll', 'Event-driven ingestion', 'Idempotent processing'],
    ['Rule interpreter', 'Version-aware plans', 'Selective recompute'],
    ['Approval workflows', 'Immutable payouts', 'Rep portal, BI export'],
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{
      background: 'var(--pl-card)',
      border: '1px solid var(--pl-border)',
    }}>
      <svg viewBox="0 0 900 320" className="w-full" style={{ minHeight: 240 }}>
        <defs>
          {/* Animated flow gradient */}
          <linearGradient id="flow-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8">
              <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="flow-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.1" />
            <stop offset="50%" stopColor={ACCENT} stopOpacity="0.8">
              <animate attributeName="offset" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.1" />
          </linearGradient>
          {/* Glow filters */}
          {layerColors.map((c, i) => (
            <filter key={i} id={`glow-${i}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor={c} floodOpacity="0.3" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Background grid */}
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--pl-border)" strokeWidth="0.3" opacity="0.3" />
        </pattern>
        <rect width="900" height="320" fill="url(#grid)" />

        {/* Three layer boxes */}
        {[0, 1, 2].map((i) => {
          const x = 40 + i * 290;
          const color = layerColors[i];
          return (
            <g key={i} style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s ease ${i * 200}ms`,
            }}>
              {/* Box background */}
              <rect x={x} y={30} width={240} height={260} rx={12}
                fill={`${color}08`} stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
              {/* Top accent bar */}
              <rect x={x} y={30} width={240} height={4} rx={2} fill={color} opacity="0.6">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </rect>
              {/* Layer number */}
              <circle cx={x + 24} cy={60} r={14} fill={`${color}20`} stroke={color} strokeWidth="1" />
              <text x={x + 24} y={65} textAnchor="middle" fill={color} fontSize="14" fontWeight="bold" fontFamily="monospace">{i + 1}</text>
              {/* Title */}
              <text x={x + 48} y={64} fill={color} fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="1.5">
                {layerLabels[i].toUpperCase()}
              </text>
              {/* Description items */}
              {layerDescLines[i].map((line, li) => (
                <g key={li}>
                  <rect x={x + 16} y={88 + li * 56} width={208} height={42} rx={8}
                    fill={`${color}10`} stroke={`${color}20`} strokeWidth="1" />
                  <circle cx={x + 32} cy={109 + li * 56} r={3} fill={color} opacity="0.7">
                    {li === 0 && (
                      <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
                    )}
                  </circle>
                  <text x={x + 44} y={113 + li * 56} fill="var(--pl-text)" fontSize="12" fontFamily="monospace">
                    {line}
                  </text>
                </g>
              ))}
            </g>
          );
        })}

        {/* Animated flow arrows between layers */}
        {[0, 1].map((i) => {
          const x1 = 280 + i * 290;
          const x2 = x1 + 50;
          return (
            <g key={`arrow-${i}`}>
              <line x1={x1} y1={160} x2={x2} y2={160}
                stroke={`url(#flow-grad-${i + 1})`} strokeWidth="3" strokeLinecap="round" />
              {/* Arrow head */}
              <polygon points={`${x2 - 2},153 ${x2 + 8},160 ${x2 - 2},167`}
                fill={layerColors[i + 1]} opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </polygon>
              {/* Data particles */}
              <circle r="2.5" fill={layerColors[i + 1]}>
                <animateMotion dur="1.5s" begin={`${i * 0.3}s`} repeatCount="indefinite"
                  path={`M${x1},160 L${x2 + 8},160`} />
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle r="2" fill={layerColors[i + 1]} opacity="0.5">
                <animateMotion dur="1.5s" begin={`${i * 0.3 + 0.7}s`} repeatCount="indefinite"
                  path={`M${x1},160 L${x2 + 8},160`} />
                <animate attributeName="opacity" values="0;0.7;0" dur="1.5s" begin={`${i * 0.3 + 0.7}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────  */
export default function IntegrationsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const liveCount = CONNECTORS.filter(c => c.status === 'live').length;
  const totalRecords = CONNECTORS.filter(c => c.records).reduce((s, c) => s + c.records!, 0);

  return (
    <>
      <ActNavigation currentAct={6} />

      {/* ═══════ HERO ═══════ */}
      <div className="rounded-xl overflow-hidden mb-8 relative" style={{
        background: `linear-gradient(135deg, rgba(249,115,22,0.12), rgba(14,165,233,0.06), rgba(16,185,129,0.04))`,
        border: '1px solid rgba(249,115,22,0.25)',
      }}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background: `${ACCENT}18`, color: ACCENT }}>
              {'\u26A1'}
            </div>
            <div>
              <div className="text-xs tracking-[4px] uppercase font-mono font-bold" style={{ color: ACCENT }}>
                Act 6 \u00B7 Platform Architecture
              </div>
              <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                How PROOFLINE Connects, Calculates, and Delivers
              </h1>
            </div>
          </div>
          <p className="text-sm font-mono leading-relaxed max-w-3xl" style={{ color: 'var(--pl-text-muted)' }}>
            PROOFLINE replaces batch-driven Alteryx workflows with an event-driven architecture across three layers:
            real-time data ingestion, a version-aware calculation engine, and automated approval workflows.
            Every number is traced from source to payout.
          </p>
        </div>
        {/* Decorative bottom accent */}
        <div className="h-1 w-full" style={{
          background: `linear-gradient(90deg, #3B82F6, ${ACCENT}, #10B981)`,
          opacity: 0.5,
        }} />
      </div>

      {/* ═══════ KPIs ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <LightKpiCard
          label="Live Connectors"
          value={String(liveCount)}
          accent={GREEN}
          sub={`of ${CONNECTORS.length} total (8-wk ramp)`}
          sparkline={[4, 5, 5, 6, 6, 7, 7, 7]}
          stagger={0}
        />
        <LightKpiCard
          label="Records / 24h"
          value={totalRecords >= 1000000 ? `${(totalRecords / 1000000).toFixed(1)}M` : `${(totalRecords / 1000).toFixed(0)}K`}
          accent={ACCENT}
          delta={12.4}
          sub="synced records (8-wk trend)"
          sparkline={[180, 210, 195, 240, 220, 260, 245, 265]}
          stagger={1}
        />
        <LightKpiCard
          label="Avg Latency"
          value="67ms"
          accent={CYAN}
          delta={-8.2}
          sub="across all endpoints (8-wk trend)"
          sparkline={[89, 82, 74, 78, 71, 68, 65, 67]}
          stagger={2}
        />
        <LightKpiCard
          label="System Uptime"
          value="99.97%"
          accent={GREEN}
          sub="zero incidents (30d)"
          stagger={3}
        />
      </div>

      {/* ═══════ THREE-LAYER ARCHITECTURE DIAGRAM ═══════ */}
      <LightSectionCard title="THREE-LAYER ARCHITECTURE">
        <ArchitectureDiagram mounted={mounted} />
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layer summaries beneath the diagram */}
          {[
            {
              num: '1',
              title: 'Ingestion + Data',
              color: '#3B82F6',
              points: [
                'Event-driven, not batch \u2014 changes propagate in real-time',
                'Idempotent processing \u2014 deals split, backdate, or change safely',
                'Replaces Alteryx input/output workflows entirely',
              ],
            },
            {
              num: '2',
              title: 'Calculation Engine',
              color: ACCENT,
              points: [
                'Rule-based comp plan interpreter with gate cascades',
                'Version-aware \u2014 plan rules tied to effective dates',
                'Selective recompute, not full Alteryx-style reruns',
              ],
            },
            {
              num: '3',
              title: 'Workflow + Finalization',
              color: '#10B981',
              points: [
                'Manager \u2192 Finance \u2192 Payroll approval chain',
                'Immutable payout records at approval (ledger pattern)',
                'Rep portal for live attainment + outbound to payroll & BI',
              ],
            },
          ].map((layer, i) => (
            <div key={i} className="rounded-xl p-4" style={{
              background: `${layer.color}06`,
              border: `1px solid ${layer.color}20`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: `all 0.5s ease ${(i + 3) * 150}ms`,
            }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                  style={{ background: `${layer.color}20`, color: layer.color }}>
                  {layer.num}
                </div>
                <span className="text-sm font-bold font-mono uppercase tracking-wider" style={{ color: layer.color }}>
                  {layer.title}
                </span>
              </div>
              <ul className="space-y-2">
                {layer.points.map((pt, pi) => (
                  <li key={pi} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: layer.color, opacity: 0.6 }} />
                    <span className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ═══════ CONNECTORS BY LAYER ═══════ */}
      {LAYER_ORDER.map((layerKey) => {
        const meta = LAYER_META[layerKey];
        const layerConnectors = CONNECTORS.filter(c => c.layer === layerKey);
        if (layerConnectors.length === 0) return null;
        return (
          <LightSectionCard key={layerKey} title={`LAYER: ${meta.label.toUpperCase()}`}>
            <p className="text-xs font-mono mb-4" style={{ color: 'var(--pl-text-faint)' }}>{meta.description}</p>
            <div className="grid gap-3">
              {layerConnectors.map((conn, ci) => {
                const s = STATUS_STYLES[conn.status];
                const dir = DIRECTION_LABELS[conn.direction];
                return (
                  <div key={conn.name} className="rounded-xl p-4 transition-all"
                    style={{
                      background: conn.status === 'live' ? `${s.color}04` : 'var(--pl-card)',
                      border: `1px solid ${conn.status === 'live' ? s.color + '20' : 'var(--pl-border)'}`,
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                      transition: `all 0.3s ease ${ci * 60}ms`,
                    }}>
                    <div className="flex items-start gap-3">
                      {/* Icon + Status */}
                      <div className="flex flex-col items-center gap-1.5 min-w-[48px]">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: s.bg, color: s.color }}>
                          {conn.icon}
                        </div>
                        <div className="flex items-center gap-1">
                          {s.pulse && <PulseDot color={s.color} size={5} />}
                          <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </div>
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                            {conn.name}
                          </span>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${dir.color}12`, color: dir.color }}>
                            {dir.label}
                          </span>
                        </div>
                        <div className="text-xs font-mono mb-2" style={{ color: 'var(--pl-text-muted)' }}>{conn.description}</div>
                        {/* Metrics row */}
                        <div className="flex items-center gap-4 flex-wrap">
                          {conn.records !== undefined && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Records:</span>
                              <span className="text-xs font-bold font-mono" style={{ color: meta.color }}>
                                {conn.records >= 1000000 ? `${(conn.records / 1000000).toFixed(1)}M`
                                  : conn.records >= 1000 ? `${(conn.records / 1000).toFixed(0)}K`
                                  : String(conn.records)}
                              </span>
                            </div>
                          )}
                          {conn.throughput && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Throughput:</span>
                              <span className="text-xs font-bold font-mono" style={{ color: GREEN }}>{conn.throughput}</span>
                            </div>
                          )}
                          {conn.lastSync && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Last sync:</span>
                              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>{conn.lastSync}</span>
                            </div>
                          )}
                          {conn.latency !== undefined && (
                            <LatencyBar ms={conn.latency} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        );
      })}

      {/* ═══════ WHY NOT ALTERYX? ═══════ */}
      <LightSectionCard title="WHY NOT ALTERYX?">
        <div className="mb-4 p-4 rounded-xl" style={{
          background: `${ACCENT}06`,
          border: `1px solid ${ACCENT}15`,
        }}>
          <p className="text-sm font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
            Alteryx is a powerful data-blending tool, but it was never designed for incentive compensation.
            PROOFLINE is purpose-built for ICM \u2014 event-driven, version-aware, and auditable at the row level.
          </p>
        </div>
        <div className="grid gap-4">
          {/* Header row */}
          <div className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center px-4">
            <div className="w-10" />
            <div className="text-xs font-bold font-mono uppercase tracking-widest" style={{ color: SLATE }}>
              Alteryx Approach
            </div>
            <div className="text-xs font-bold font-mono uppercase tracking-widest" style={{ color: ACCENT }}>
              PROOFLINE
            </div>
          </div>
          {/* Comparison rows */}
          {COMPARISON.map((row, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_1fr] gap-4 items-start rounded-xl p-4"
              style={{
                background: i % 2 === 0 ? 'var(--pl-card)' : 'var(--pl-hover)',
                border: '1px solid var(--pl-border)',
                opacity: mounted ? 1 : 0,
                transition: `opacity 0.4s ease ${i * 100}ms`,
              }}>
              {/* Dimension icon & label */}
              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: `${ACCENT}10`, color: ACCENT }}>
                  {row.icon}
                </div>
                <span className="text-xs font-bold font-mono text-center leading-tight" style={{ color: 'var(--pl-text)' }}>
                  {row.dimension}
                </span>
              </div>
              {/* Alteryx side */}
              <div className="rounded-lg p-3" style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.12)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#EF4444', opacity: 0.7 }} />
                  <span className="text-xs font-bold font-mono" style={{ color: SLATE }}>Legacy</span>
                </div>
                <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-faint)' }}>{row.alteryx}</p>
              </div>
              {/* PROOFLINE side */}
              <div className="rounded-lg p-3" style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}15` }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: GREEN }} />
                  <span className="text-xs font-bold font-mono" style={{ color: ACCENT }}>PROOFLINE</span>
                </div>
                <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>{row.proofline}</p>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ═══════ PLATFORM — POWERED BY AICR ═══════ */}
      <div className="rounded-xl overflow-hidden mb-6" style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(14,165,233,0.04), rgba(249,115,22,0.04))',
        border: '1px solid rgba(139,92,246,0.15)',
        boxShadow: 'var(--pl-shadow)',
      }}>
        <div className="p-6 pb-2">
          <div className="text-xs tracking-[4px] uppercase font-mono font-bold mb-2" style={{ color: PURPLE }}>
            Enterprise Platform
          </div>
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            PROOFLINE Is Powered by the AICR Platform
          </h2>
          <p className="text-sm font-mono leading-relaxed mb-6" style={{ color: 'var(--pl-text-muted)' }}>
            Enterprise governance, AI intelligence, and immutable audit trail \u2014 built in from day one, not bolted on.
            Every PROOFLINE deployment includes these platform capabilities.
          </p>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {PLATFORM_CAPABILITIES.map((cap, i) => (
              <div key={cap.name} className="rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{
                  background: `${cap.color}06`,
                  border: `1px solid ${cap.color}18`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.5s ease ${i * 100 + 400}ms`,
                }}>
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
                  style={{ background: `${cap.color}15`, color: cap.color }}>
                  {cap.icon}
                </div>
                {/* Name tag */}
                <div className="text-xs font-bold font-mono uppercase tracking-widest mb-1" style={{ color: cap.color }}>
                  {cap.name}
                </div>
                <div className="text-sm font-bold mb-2" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                  {cap.title}
                </div>
                <p className="text-xs font-mono leading-relaxed mb-3" style={{ color: 'var(--pl-text-muted)' }}>
                  {cap.description}
                </p>
                {/* Stat */}
                <div className="flex items-center gap-1.5">
                  <PulseDot color={cap.color} size={5} />
                  <span className="text-xs font-bold font-mono" style={{ color: cap.color }}>{cap.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom accent */}
        <div className="h-0.5 w-full" style={{
          background: `linear-gradient(90deg, ${PURPLE}, ${CYAN}, ${ACCENT}, ${GREEN}, ${BLUE})`,
          opacity: 0.4,
        }} />
      </div>

      {/* ═══════ API HEALTH ═══════ */}
      <LightSectionCard title="API HEALTH \u2014 LAST 24H">
        <div className="space-y-3">
          {API_METRICS.map((api, i) => {
            const healthColor = api.errorRate === 0 ? GREEN : api.errorRate < 0.1 ? '#F59E0B' : '#EF4444';
            return (
              <div key={i} className="rounded-lg p-3" style={{
                background: `${healthColor}04`,
                border: `1px solid ${healthColor}15`,
              }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PulseDot color={healthColor} size={6} />
                    <span className="text-sm font-bold font-mono" style={{ color: ACCENT }}>{api.endpoint}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                    {api.calls24h.toLocaleString()} calls
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--pl-text-faint)' }}>Avg Latency</div>
                    <LatencyBar ms={api.avgMs} />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--pl-text-faint)' }}>P99 Latency</div>
                    <LatencyBar ms={api.p99} max={3000} />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--pl-text-faint)' }}>Error Rate</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pl-hover)', maxWidth: 80 }}>
                        <div className="h-full rounded-full" style={{
                          width: `${Math.max(api.errorRate * 10, 1)}%`,
                          background: healthColor,
                        }} />
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: healthColor }}>{api.errorRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: GREEN }}>25,520</div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Total API Calls (24h)</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: GREEN }}>67ms</div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Avg Response Time</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: GREEN }}>0.03%</div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Error Rate</div>
          </div>
        </div>
      </LightSectionCard>
    </>
  );
}
