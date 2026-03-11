'use client';

import { useState, useEffect } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';

const ACCENT = '#F97316';
const GOLD = '#C6A052';
const GREEN = '#22C55E';
const BLUE = '#2563EB';
const CYAN = '#0EA5E9';
const PURPLE = '#8B5CF6';
const SLATE = '#94A3B8';
const RED = '#EF4444';

/* ── Platform Layer Cake Data ──────────────────── */
const LAYERS = [
  { id: 'L1', name: 'Infrastructure', color: SLATE, items: ['Neon PostgreSQL', 'Vercel Edge', 'NATS JetStream'] },
  { id: 'L2', name: 'Security & Identity', color: RED, items: ['Multi-tenant isolation', 'RBAC', 'SSO/SAML'] },
  { id: 'L3', name: 'Governance (GOCC)', color: PURPLE, items: ['14 policies', 'Approval gates', 'Immutable audit'] },
  { id: 'L4', name: 'Data Platform (Spine)', color: CYAN, items: ['Event sourcing', '2.4M audit events', 'RAG search'] },
  { id: 'L5', name: 'AI Services', color: GREEN, items: ['AI Gateway', 'Hallucination prevention', '6 agents'] },
  { id: 'L6', name: 'PROOFLINE', color: ACCENT, items: ['Beverage distribution ICM', 'The application layer'] },
];

/* ── Governance & Compliance Cards ─────────────── */
const GOVERNANCE_CARDS = [
  { title: 'SOX Compliance', color: PURPLE, icon: '\u2696', description: 'Every comp plan change has a proposal, approval chain, and immutable record. No retroactive edits. Finance & Audit ready.' },
  { title: 'Role-Based Access', color: BLUE, icon: '\u229A', description: 'Rep < Manager < Director < VP < Admin. Each sees only their scope. Row-level security enforced at every query.' },
  { title: 'Immutable Audit Trail', color: CYAN, icon: '\u29C9', description: 'Row-level lineage: every number traces from source transaction to payout. 2.4M events tracked and searchable.' },
  { title: 'Approval Gates', color: GREEN, icon: '\u2713', description: 'Configurable chains: Manager \u2192 Finance \u2192 Payroll. Threshold-based escalation. SLA tracking on every gate.' },
  { title: 'Data Ownership', color: GOLD, icon: '\u26B1', description: 'Customer owns all data. Export at any time. No vendor lock-in. Data residency controls for compliance.' },
  { title: 'Change Intelligence', color: ACCENT, icon: '\u26A1', description: 'AI-powered drift detection. Proactive alerts when calculations deviate from expected patterns.' },
];

/* ── AI Governance Callouts ────────────────────── */
const AI_CALLOUTS = [
  { title: 'Deterministic Math', color: ACCENT, icon: '\u03A3', description: 'Commission calculations NEVER use LLM output. AI is advisory only. Every payout is computed by deterministic rule engines.' },
  { title: 'Data Boundaries', color: BLUE, icon: '\u2B21', description: 'AI models never see data from other tenants. Training is tenant-scoped. Zero data leakage by architecture.' },
  { title: 'Hallucination Prevention', color: GREEN, icon: '\u2691', description: 'Every AI recommendation is grounded in transactional data \u2014 IRI/Nielsen scan data + internal shipments. No ungrounded claims.' },
  { title: 'Cost Control', color: PURPLE, icon: '\u2261', description: 'AI Gateway routes all LLM calls with cost ceilings, rate limiting, and provider failover. No runaway spend.' },
];

/* ── Certified Connectors ──────────────────────── */
const CONNECTOR_ROWS = [
  { category: 'Route Accounting', connectors: [
    { name: 'eoStar', type: 'Real-time' },
    { name: 'VIP/Encompass', type: 'Real-time' },
  ]},
  { category: 'Financials', connectors: [
    { name: 'GreatPlains/D365', type: 'Bidirectional' },
    { name: 'ADP Workforce', type: 'Batch' },
  ]},
  { category: 'Analytics', connectors: [
    { name: 'IRI/Nielsen', type: 'Batch' },
    { name: 'Snowflake', type: 'Bidirectional' },
  ]},
  { category: 'BI', connectors: [
    { name: 'Power BI', type: 'Real-time' },
    { name: 'Tableau', type: 'Batch' },
  ]},
];

/* ── Deployment Model Cards ────────────────────── */
const DEPLOY_CARDS = [
  { title: 'Cloud-Native', color: CYAN, icon: '\u2601', points: ['Vercel Edge Functions', 'Neon PostgreSQL (serverless)', 'NATS JetStream events', 'No on-prem hardware required'] },
  { title: 'Security', color: PURPLE, icon: '\u26E8', points: ['SOC 2 Type II ready', 'Encryption at rest & transit', 'Zero-trust architecture', 'Tenant-scoped key management'] },
  { title: 'Reliability', color: GREEN, icon: '\u2713', points: ['99.97% uptime SLA', 'Instant rollback capability', 'Point-in-time recovery', 'Zero-downtime upgrades'] },
];

/* ── Animated Pulse Dot ────────────────────────── */
function PulseDot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: color,
        animation: 'pa-pulse-ring 2s ease-out infinite',
      }} />
      <div className="absolute inset-0 rounded-full" style={{ background: color }} />
      <style>{`
        @keyframes pa-pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Platform Layer Cake SVG ───────────────────── */
function LayerCakeDiagram({ mounted }: { mounted: boolean }) {
  const layerHeight = 50;
  const gap = 6;
  const startY = 370;
  const leftMargin = 40;
  const layerWidth = 720;

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{
      background: 'var(--pl-card)',
      border: '1px solid var(--pl-border)',
    }}>
      <svg viewBox="0 0 800 420" className="w-full" style={{ minHeight: 280 }}>
        <defs>
          <pattern id="pa-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--pl-border)" strokeWidth="0.3" opacity="0.3" />
          </pattern>
          {/* Upward pulse particle */}
          <linearGradient id="pa-pulse-up" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
            <stop offset="50%" stopColor={ACCENT} stopOpacity="0.9" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="800" height="420" fill="url(#pa-grid)" />

        {/* Title */}
        <text x="400" y="24" textAnchor="middle" fill="var(--pl-text-muted)" fontSize="11" fontFamily="monospace" letterSpacing="3">
          PLATFORM LAYER ARCHITECTURE
        </text>

        {/* Layer bands — bottom to top */}
        {LAYERS.map((layer, i) => {
          const y = startY - i * (layerHeight + gap);
          const isTop = i === LAYERS.length - 1;
          return (
            <g key={layer.id} style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(15px)',
              transition: `all 0.5s ease ${i * 120}ms`,
            }}>
              {/* Layer background */}
              <rect x={leftMargin} y={y} width={layerWidth} height={layerHeight} rx={8}
                fill={`${layer.color}${isTop ? '18' : '0A'}`}
                stroke={layer.color}
                strokeWidth={isTop ? 2 : 1}
                strokeOpacity={isTop ? 0.6 : 0.25}
              />
              {/* Top accent line for PROOFLINE */}
              {isTop && (
                <rect x={leftMargin} y={y} width={layerWidth} height={3} rx={1.5} fill={layer.color} opacity="0.7">
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
                </rect>
              )}
              {/* Layer ID badge */}
              <rect x={leftMargin + 10} y={y + 12} width={32} height={26} rx={6}
                fill={`${layer.color}20`} stroke={layer.color} strokeWidth="0.5" strokeOpacity="0.4" />
              <text x={leftMargin + 26} y={y + 30} textAnchor="middle" fill={layer.color}
                fontSize="11" fontWeight="bold" fontFamily="monospace">
                {layer.id}
              </text>
              {/* Layer name */}
              <text x={leftMargin + 56} y={y + 31} fill={layer.color}
                fontSize={isTop ? 14 : 12} fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                {layer.name.toUpperCase()}
              </text>
              {/* Key items on the right */}
              {layer.items.map((item, ii) => {
                const itemX = leftMargin + 300 + ii * 150;
                return (
                  <g key={ii}>
                    <circle cx={itemX} cy={y + 25} r={2.5} fill={layer.color} opacity="0.5" />
                    <text x={itemX + 8} y={y + 29} fill="var(--pl-text-muted)"
                      fontSize="10" fontFamily="monospace">
                      {item}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Animated pulse dots flowing upward */}
        {[0, 1, 2].map((i) => {
          const x = 200 + i * 200;
          const baseDelay = i * 1.2;
          return (
            <g key={`pulse-${i}`}>
              <circle r="3.5" fill={ACCENT} opacity="0.8">
                <animateMotion dur="3s" begin={`${baseDelay}s`} repeatCount="indefinite"
                  path={`M${x},${startY + 20} L${x},${startY - 5 * (layerHeight + gap) - 10}`} />
                <animate attributeName="opacity" values="0;0.9;0.9;0" dur="3s" begin={`${baseDelay}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="2;4;2" dur="3s" begin={`${baseDelay}s`} repeatCount="indefinite" />
              </circle>
              <circle r="2" fill={GREEN} opacity="0.5">
                <animateMotion dur="3s" begin={`${baseDelay + 0.8}s`} repeatCount="indefinite"
                  path={`M${x + 15},${startY + 20} L${x + 15},${startY - 5 * (layerHeight + gap) - 10}`} />
                <animate attributeName="opacity" values="0;0.6;0.6;0" dur="3s" begin={`${baseDelay + 0.8}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Multi-Tenant Isolation SVG ────────────────── */
function TenantIsolationDiagram({ mounted }: { mounted: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-xl" style={{
      background: 'var(--pl-card)',
      border: '1px solid var(--pl-border)',
    }}>
      <svg viewBox="0 0 800 320" className="w-full" style={{ minHeight: 240 }}>
        <defs>
          <pattern id="ti-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--pl-border)" strokeWidth="0.3" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="800" height="320" fill="url(#ti-grid)" />

        {/* Left tenant bubble — Lone Star Distribution */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'all 0.6s ease 200ms',
        }}>
          <rect x={40} y={30} width={260} height={250} rx={16}
            fill={`${GOLD}08`} stroke={GOLD} strokeWidth="1.5" strokeOpacity="0.35"
            strokeDasharray="4 2" />
          <text x={170} y={58} textAnchor="middle" fill={GOLD}
            fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
            LONE STAR DISTRIBUTION
          </text>
          {/* Tenant data items */}
          {[
            { y: 82, icon: '\u25A3', label: 'Data', detail: '48K delivery records' },
            { y: 120, icon: '\u2637', label: 'Plans', detail: '3 active comp plans' },
            { y: 158, icon: '\u229A', label: 'Rules', detail: 'Keg volume tiers' },
            { y: 196, icon: '\u25C8', label: 'Branding', detail: 'Custom portal theme' },
            { y: 234, icon: '\u2261', label: 'AI Models', detail: 'Tenant-scoped training' },
          ].map((item) => (
            <g key={item.label}>
              <rect x={58} y={item.y} width={224} height={30} rx={8}
                fill={`${GOLD}0A`} stroke={`${GOLD}20`} strokeWidth="1" />
              <text x={74} y={item.y + 20} fill={GOLD} fontSize="13" fontFamily="monospace">{item.icon}</text>
              <text x={92} y={item.y + 19} fill="var(--pl-text)" fontSize="11" fontWeight="bold" fontFamily="monospace">{item.label}</text>
              <text x={160} y={item.y + 19} fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace">{item.detail}</text>
            </g>
          ))}
        </g>

        {/* Right tenant bubble — Pacific Beverage Co. */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(20px)',
          transition: 'all 0.6s ease 400ms',
        }}>
          <rect x={500} y={30} width={260} height={250} rx={16}
            fill={`${BLUE}08`} stroke={BLUE} strokeWidth="1.5" strokeOpacity="0.35"
            strokeDasharray="4 2" />
          <text x={630} y={58} textAnchor="middle" fill={BLUE}
            fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
            PACIFIC BEVERAGE CO.
          </text>
          {[
            { y: 82, icon: '\u25A3', label: 'Data', detail: '92K delivery records' },
            { y: 120, icon: '\u2637', label: 'Plans', detail: '5 active comp plans' },
            { y: 158, icon: '\u229A', label: 'Rules', detail: 'Case volume + mix' },
            { y: 196, icon: '\u25C8', label: 'Branding', detail: 'Pacific brand portal' },
            { y: 234, icon: '\u2261', label: 'AI Models', detail: 'Tenant-scoped training' },
          ].map((item) => (
            <g key={item.label}>
              <rect x={518} y={item.y} width={224} height={30} rx={8}
                fill={`${BLUE}0A`} stroke={`${BLUE}20`} strokeWidth="1" />
              <text x={534} y={item.y + 20} fill={BLUE} fontSize="13" fontFamily="monospace">{item.icon}</text>
              <text x={552} y={item.y + 19} fill="var(--pl-text)" fontSize="11" fontWeight="bold" fontFamily="monospace">{item.label}</text>
              <text x={620} y={item.y + 19} fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace">{item.detail}</text>
            </g>
          ))}
        </g>

        {/* Center — shared platform services */}
        <g style={{
          opacity: mounted ? 1 : 0,
          transition: 'all 0.6s ease 600ms',
        }}>
          {/* Center column background */}
          <rect x={320} y={60} width={160} height={200} rx={12}
            fill={`${PURPLE}08`} stroke={PURPLE} strokeWidth="1" strokeOpacity="0.2" />
          <text x={400} y={82} textAnchor="middle" fill={PURPLE}
            fontSize="10" fontWeight="bold" fontFamily="monospace" letterSpacing="2">
            SHARED PLATFORM
          </text>
          {[
            { y: 100, label: 'AI Gateway', color: GREEN },
            { y: 135, label: 'Governance', color: PURPLE },
            { y: 170, label: 'Audit Trail', color: CYAN },
            { y: 205, label: 'Pulse Intel', color: ACCENT },
          ].map((svc) => (
            <g key={svc.label}>
              <rect x={340} y={svc.y} width={120} height={28} rx={8}
                fill={`${svc.color}12`} stroke={svc.color} strokeWidth="0.5" strokeOpacity="0.3" />
              <circle cx={354} cy={svc.y + 14} r={3} fill={svc.color} opacity="0.7">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={366} y={svc.y + 18} fill={svc.color} fontSize="10" fontWeight="bold" fontFamily="monospace">
                {svc.label}
              </text>
            </g>
          ))}

          {/* Connection lines — left tenant to center */}
          {[105, 140, 175, 210].map((y, i) => (
            <g key={`left-${i}`}>
              <line x1={300} y1={y + 9} x2={340} y2={y + 9}
                stroke={GOLD} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
              <circle r="2" fill={GOLD} opacity="0.6">
                <animateMotion dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite"
                  path={`M300,${y + 9} L340,${y + 9}`} />
                <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Connection lines — center to right tenant */}
          {[105, 140, 175, 210].map((y, i) => (
            <g key={`right-${i}`}>
              <line x1={460} y1={y + 9} x2={500} y2={y + 9}
                stroke={BLUE} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
              <circle r="2" fill={BLUE} opacity="0.6">
                <animateMotion dur="2s" begin={`${i * 0.4 + 0.2}s`} repeatCount="indefinite"
                  path={`M460,${y + 9} L500,${y + 9}`} />
                <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin={`${i * 0.4 + 0.2}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ── Page ──────────────────────────────────────── */
export default function PlatformArchitecturePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <ActNavigation currentAct={6} />

      {/* ======= HERO ======= */}
      <div className="rounded-xl overflow-hidden mb-8 relative" style={{
        background: `linear-gradient(135deg, rgba(249,115,22,0.12), rgba(139,92,246,0.06), rgba(14,165,233,0.04))`,
        border: '1px solid rgba(249,115,22,0.25)',
      }}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background: `${ACCENT}18`, color: ACCENT }}>
              {'\u2699'}
            </div>
            <div>
              <div className="text-xs tracking-[4px] uppercase font-mono font-bold" style={{ color: 'var(--pl-text-faint)' }}>
                Platform & Integrations / Platform Architecture
              </div>
              <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                Enterprise Platform Architecture
              </h1>
            </div>
          </div>
          <p className="text-sm font-mono leading-relaxed max-w-3xl" style={{ color: 'var(--pl-text-muted)' }}>
            Powered by AICR &mdash; Multi-Tenant, AI-Governed, SOX-Ready.
            PROOFLINE is not a standalone app. It sits on top of a battle-tested enterprise platform that handles
            governance, security, audit, and AI &mdash; so you get enterprise-grade infrastructure from day one.
          </p>
        </div>
        <div className="h-1 w-full" style={{
          background: `linear-gradient(90deg, ${ACCENT}, ${PURPLE}, ${CYAN})`,
          opacity: 0.5,
        }} />
      </div>

      {/* ======= KPIs ======= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <LightKpiCard
          label="Platform Uptime"
          value="99.97%"
          accent={GREEN}
          sub="zero incidents (90d)"
          stagger={0}
        />
        <LightKpiCard
          label="Audit Events"
          value="2.4M"
          accent={CYAN}
          delta={18.2}
          sub="immutable records (8-wk growth)"
          sparkline={[1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.3, 2.4]}
          stagger={1}
        />
        <LightKpiCard
          label="Active Policies"
          value="14"
          accent={PURPLE}
          sub="governance rules (deployment ramp)"
          sparkline={[8, 9, 10, 11, 12, 13, 14, 14]}
          stagger={2}
        />
        <LightKpiCard
          label="AI Agents"
          value="6"
          accent={ACCENT}
          sub="active & monitored (8-wk ramp)"
          sparkline={[2, 3, 3, 4, 4, 5, 6, 6]}
          stagger={3}
        />
        <LightKpiCard
          label="Tenant Isolation"
          value="Complete"
          accent={BLUE}
          sub="zero cross-tenant leaks"
          stagger={4}
        />
      </div>

      {/* ======= SECTION 1: PLATFORM LAYER CAKE ======= */}
      <LightSectionCard title="PLATFORM LAYER ARCHITECTURE">
        <LayerCakeDiagram mounted={mounted} />
        <div className="mt-5 p-4 rounded-xl" style={{
          background: `${ACCENT}06`,
          border: `1px solid ${ACCENT}15`,
        }}>
          <p className="text-sm font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
            PROOFLINE sits on top of a battle-tested platform. When the platform improves, every tenant benefits &mdash;
            zero migration required. Infrastructure upgrades, security patches, and AI model improvements flow through
            automatically.
          </p>
        </div>
      </LightSectionCard>

      {/* ======= SECTION 2: MULTI-TENANT ISOLATION ======= */}
      <LightSectionCard title="MULTI-TENANT ISOLATION">
        <TenantIsolationDiagram mounted={mounted} />
        <div className="mt-5 p-4 rounded-xl" style={{
          background: `${PURPLE}06`,
          border: `1px solid ${PURPLE}15`,
        }}>
          <p className="text-sm font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
            Your data never touches another tenant&apos;s data. Your rules are yours.
            But you get all platform upgrades automatically &mdash; security patches, AI improvements, and new features
            roll out without migration or downtime.
          </p>
        </div>
      </LightSectionCard>

      {/* ======= SECTION 3: GOVERNANCE & COMPLIANCE ======= */}
      <LightSectionCard title="GOVERNANCE & COMPLIANCE">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOVERNANCE_CARDS.map((card, i) => (
            <div key={card.title} className="rounded-xl p-4 transition-all"
              style={{
                background: `${card.color}06`,
                border: `1px solid ${card.color}18`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.5s ease ${i * 100}ms`,
              }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <span className="text-sm font-bold" style={{ color: card.color, fontFamily: 'var(--pl-font)' }}>
                  {card.title}
                </span>
              </div>
              <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ======= SECTION 4: AI GOVERNANCE ======= */}
      <LightSectionCard title="AI GOVERNANCE">
        {/* 3-step flow */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {[
            { label: 'AI Suggests', color: GREEN, sub: 'Advisory recommendations' },
            { label: 'Manager Reviews', color: ACCENT, sub: 'Human-in-the-loop gate' },
            { label: 'System Executes', color: BLUE, sub: 'Deterministic calculations' },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="rounded-xl px-5 py-3 text-center" style={{
                background: `${step.color}0A`,
                border: `1px solid ${step.color}25`,
                opacity: mounted ? 1 : 0,
                transition: `all 0.5s ease ${i * 200}ms`,
              }}>
                <div className="text-sm font-bold font-mono" style={{ color: step.color }}>
                  {step.label}
                </div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>
                  {step.sub}
                </div>
              </div>
              {i < 2 && (
                <div className="flex items-center gap-1">
                  <div className="w-6 h-px" style={{ background: 'var(--pl-border)' }} />
                  <div className="rounded px-1.5 py-0.5 text-xs font-bold font-mono"
                    style={{ background: `${PURPLE}12`, color: PURPLE, border: `1px solid ${PURPLE}25` }}>
                    GATE
                  </div>
                  <div className="w-6 h-px" style={{ background: 'var(--pl-border)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Callout grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_CALLOUTS.map((callout, i) => (
            <div key={callout.title} className="rounded-xl p-4"
              style={{
                background: `${callout.color}06`,
                border: `1px solid ${callout.color}18`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.5s ease ${i * 100 + 300}ms`,
              }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: `${callout.color}15`, color: callout.color }}>
                  {callout.icon}
                </div>
                <span className="text-sm font-bold" style={{ color: callout.color, fontFamily: 'var(--pl-font)' }}>
                  {callout.title}
                </span>
              </div>
              <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
                {callout.description}
              </p>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ======= SECTION 5: CERTIFIED CONNECTORS ======= */}
      <LightSectionCard title="CERTIFIED CONNECTORS">
        <div className="grid gap-3">
          {CONNECTOR_ROWS.map((row) => (
            <div key={row.category} className="flex items-center gap-3 flex-wrap">
              <div className="w-36 text-right">
                <span className="text-xs font-bold font-mono uppercase tracking-wider" style={{ color: 'var(--pl-text-faint)' }}>
                  {row.category}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {row.connectors.map((conn) => (
                  <div key={conn.name} className="flex items-center gap-2 rounded-full px-4 py-2"
                    style={{
                      background: `${GREEN}08`,
                      border: `1px solid ${GREEN}20`,
                    }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: `${GREEN}25` }}>
                      <svg viewBox="0 0 16 16" width="10" height="10">
                        <path d="M3 8l3 3 7-7" stroke={GREEN} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>
                      {conn.name}
                    </span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                      style={{
                        background: conn.type === 'Real-time' ? `${CYAN}12` : conn.type === 'Bidirectional' ? `${PURPLE}12` : `${SLATE}10`,
                        color: conn.type === 'Real-time' ? CYAN : conn.type === 'Bidirectional' ? PURPLE : SLATE,
                      }}>
                      {conn.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ======= SECTION 6: DEPLOYMENT MODEL ======= */}
      <LightSectionCard title="DEPLOYMENT MODEL">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEPLOY_CARDS.map((card, i) => (
            <div key={card.title} className="rounded-xl p-5"
              style={{
                background: `${card.color}06`,
                border: `1px solid ${card.color}18`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.5s ease ${i * 120}ms`,
              }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-2xl"
                  style={{ background: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <span className="text-base font-bold" style={{ color: card.color, fontFamily: 'var(--pl-font)' }}>
                  {card.title}
                </span>
              </div>
              <ul className="space-y-2">
                {card.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: card.color, opacity: 0.6 }} />
                    <span className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ======= FOOTER ======= */}
      <div className="rounded-xl overflow-hidden mb-6" style={{
        background: `linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.04))`,
        border: '1px solid rgba(249,115,22,0.15)',
      }}>
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PulseDot color={ACCENT} size={6} />
            <span className="text-xs tracking-[4px] uppercase font-mono font-bold" style={{ color: ACCENT }}>
              AICR Platform
            </span>
          </div>
          <p className="text-sm font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
            Powering enterprise incentive compensation for beverage distribution and beyond.
          </p>
        </div>
        <div className="h-0.5 w-full" style={{
          background: `linear-gradient(90deg, ${ACCENT}, ${PURPLE}, ${CYAN}, ${GREEN}, ${BLUE})`,
          opacity: 0.4,
        }} />
      </div>
    </>
  );
}
