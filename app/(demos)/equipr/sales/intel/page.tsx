'use client';

import { useState } from 'react';

import {
  DATA_SOURCES,
  ACTION_CARDS,
  ACTION_TYPE_META,
  TERRITORY_KPIS,
} from '@/data/equipr/sales-intel';
import type { ActionCard, ActionType } from '@/data/equipr/sales-intel';
import {
  ACQUISITION_SCENARIO,
  INTEGRATION_PHASES,
  TRADITIONAL_TOTAL_WEEKS,
  EQUIPR_TOTAL_WEEKS,
  ACCOUNT_MERGE_EXAMPLES,
  COMP_STABILIZATION,
  CRM_TASKS,
  ADOPTION_METRICS,
  LEAD_SOURCES,
  PIPELINE_STAGES,
  RATE_INTEL,
  COMMISSION_TIERS,
  DEMAND_STYLES,
} from '@/data/equipr/industry-intel';
import {
  Zap,
  Building2,
  CloudRain,
  FileCheck,
  Radio,
  Users,
  TrendingUp,
  Target,
  Truck,
  UserCheck,
  MapPin,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  DollarSign,
  AlertTriangle,
  Activity,
  GitMerge,
  Timer,
  Radar,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

/* ── Icon map for dynamic rendering ────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Building2,
  CloudRain,
  FileCheck,
  Radio,
  Users,
  TrendingUp,
  Target,
  Truck,
  UserCheck,
  MapPin,
};

/* ── Helpers ──────────────────────────────────────────────── */

function fmtDollar(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString('en-US')}`;
}

function fmtProjectValue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

/* ── Source Badge ─────────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ── Section Header ──────────────────────────────────────── */

function SectionHeader({ icon: Icon, title, subtitle, color, badge }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  color: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2
            className="text-[15px] font-bold"
            style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h2>
          {badge && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--prizym-text-secondary)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ── AI Score Circle ──────────────────────────────────────── */

function AiScoreCircle({ score, color }: { score: number; color: string }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
      <svg width={52} height={52} viewBox="0 0 52 52">
        <circle cx={26} cy={26} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={4} />
        <circle
          cx={26} cy={26} r={radius} fill="none" stroke={color} strokeWidth={4}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 26 26)" style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-[12px] font-bold font-mono" style={{ color }}>{score}</span>
    </div>
  );
}

/* ── Data Source Pill ──────────────────────────────────────── */

function DataSourcePill({ name, color, status, recordCount }: {
  name: string; color: string; status: 'live' | 'syncing' | 'scheduled'; recordCount: string;
}) {
  const statusColor = status === 'live' ? '#10B981' : status === 'syncing' ? '#2563EB' : '#94A3B8';
  const Icon = ICON_MAP[DATA_SOURCES.find(s => s.name === name)?.icon || ''];

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      {Icon && <Icon size={13} style={{ color }} />}
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{name}</span>
        <span className="text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>{recordCount}</span>
      </div>
      <div
        className="h-2 w-2 rounded-full ml-auto flex-shrink-0"
        style={{ background: statusColor, boxShadow: status === 'live' ? `0 0 6px ${statusColor}` : 'none' }}
      />
    </div>
  );
}

/* ── Action Card Component ─────────────────────────────────── */

function ActionCardRow({ card, rank, defaultExpanded }: {
  card: ActionCard; rank: number; defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const meta = ACTION_TYPE_META[card.type];
  const TypeIcon = ICON_MAP[meta.icon];

  return (
    <div
      className="rounded-xl p-5 transition-shadow hover:shadow-lg"
      style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
          style={{ background: meta.bgColor, color: meta.color, fontFamily: "'Space Grotesk', sans-serif", border: `2px solid ${meta.color}30` }}
        >
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: meta.bgColor, color: meta.color }}>
              {TypeIcon && <TypeIcon size={10} />}
              {meta.label}
            </span>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
              style={{
                background: card.timeWindow === 'Call now' || card.timeWindow === 'Today' ? 'rgba(239,68,68,0.1)' : 'rgba(100,116,139,0.08)',
                color: card.timeWindow === 'Call now' || card.timeWindow === 'Today' ? '#DC2626' : '#64748B',
                border: card.timeWindow === 'Call now' || card.timeWindow === 'Today' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(100,116,139,0.15)',
              }}
            >
              <Clock size={9} />
              {card.timeWindow}
            </span>
          </div>
          <h3 className="text-[14px] font-bold mb-0.5" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {card.title}
          </h3>
          <p className="text-[12px] mb-2" style={{ color: 'var(--prizym-text-secondary)' }}>{card.subtitle}</p>
          {expanded && (
            <div className="text-[12px] leading-relaxed mb-3 px-3 py-2.5 rounded-lg" style={{ color: 'var(--prizym-text-secondary)', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
              {card.details}
            </div>
          )}
          <button onClick={() => setExpanded(!expanded)} className="text-[11px] font-medium flex items-center gap-1 mb-2" style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide details' : 'Show details'}
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}><MapPin size={10} />{card.location}</span>
            <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}><Truck size={10} />{card.distance}</span>
            {card.projectValue && (
              <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}><Building2 size={10} />{fmtProjectValue(card.projectValue)} project</span>
            )}
            <div className="flex items-center gap-1 ml-auto flex-wrap justify-end">
              {card.dataSources.map((src) => (
                <span key={src} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--prizym-text-muted)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {src}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <AiScoreCircle score={card.aiScore} color={meta.color} />
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-[1px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>Revenue</div>
            <span className="text-[16px] font-bold font-mono" style={{ color: '#059669' }}>{fmtDollar(card.revenuePotential)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer px-3 py-1.5 rounded-lg" style={{ color: '#2563EB', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
            {card.callToAction}
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */

export default function SalesIntelPage() {
  return (
    <>
      {/* ── Zone 1: Header ───────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} style={{ color: '#F59E0B' }} />
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Sales Intelligence
            </h1>
          </div>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--prizym-text-secondary)' }}>
            AI-prioritized daily actions powered by Dodge Construction data, weather, permits, telematics &amp; CRM
          </p>
          <SourceBadge source="Dodge Construction + 5 Sources" synced="2 min ago" />
        </div>
        <div className="text-[12px] font-mono font-medium px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.25)' }}>
          Feb 26, 2026
        </div>
      </div>

      {/* ── Zone 2: Data Sources Bar ─────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} style={{ color: 'var(--prizym-text-muted)' }} />
          <h2 className="text-[13px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Data Fusion Pipeline
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}>
            5 of 6 live
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {DATA_SOURCES.map((src) => (
            <DataSourcePill key={src.name} name={src.name} color={src.color} status={src.status} recordCount={src.recordCount} />
          ))}
        </div>
      </div>

      {/* ── Zone 3: Territory KPIs (4 cards) ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative rounded-xl p-5 transition-shadow hover:shadow-lg" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="absolute top-4 left-0 w-[3px] h-8 rounded-r" style={{ background: '#2563EB' }} />
          <div className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1" style={{ color: 'var(--prizym-text-muted)' }}>Revenue Potential</div>
          <span className="text-2xl font-bold" style={{ color: '#2563EB', fontFamily: "'Space Grotesk', sans-serif" }}>$1.21M</span>
          <div className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}><DollarSign size={11} /> Across today&apos;s 10 actions</div>
        </div>
        <div className="relative rounded-xl p-5 transition-shadow hover:shadow-lg" style={{ background: 'var(--prizym-card-bg)', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 16px rgba(16,185,129,0.06), var(--prizym-shadow-card)' }}>
          <div className="absolute top-4 left-0 w-[3px] h-8 rounded-r" style={{ background: '#10B981' }} />
          <div className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1" style={{ color: 'var(--prizym-text-muted)' }}>AI Actions Today</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: '#10B981', fontFamily: "'Space Grotesk', sans-serif" }}>{TERRITORY_KPIS.aiActionsToday}</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}><Zap size={11} /> Prioritized by AI score</div>
        </div>
        <div className="relative rounded-xl p-5 transition-shadow hover:shadow-lg" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="absolute top-4 left-0 w-[3px] h-8 rounded-r" style={{ background: '#8B5CF6' }} />
          <div className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1" style={{ color: 'var(--prizym-text-muted)' }}>New Projects This Week</div>
          <span className="text-2xl font-bold" style={{ color: '#8B5CF6', fontFamily: "'Space Grotesk', sans-serif" }}>{TERRITORY_KPIS.newProjectsThisWeek}</span>
          <div className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}><Building2 size={11} /> From Dodge Construction</div>
        </div>
        <div className="relative rounded-xl p-5 transition-shadow hover:shadow-lg" style={{ background: 'var(--prizym-card-bg)', border: '1px solid rgba(245,158,11,0.25)', boxShadow: 'var(--prizym-shadow-card)' }}>
          <div className="absolute top-4 left-0 w-[3px] h-8 rounded-r" style={{ background: '#F59E0B' }} />
          <div className="text-[10px] uppercase tracking-[1.5px] font-mono mb-1" style={{ color: 'var(--prizym-text-muted)' }}>Weather Alerts</div>
          <span className="text-2xl font-bold" style={{ color: '#F59E0B', fontFamily: "'Space Grotesk', sans-serif" }}>{TERRITORY_KPIS.weatherAlerts}</span>
          <div className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}><AlertTriangle size={11} /> Impacting active contracts</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 4: M&A Integration Command Center
          ════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <SectionHeader
          icon={GitMerge}
          title="M&A Integration Command Center"
          subtitle={`${ACQUISITION_SCENARIO.acquirer} acquires ${ACQUISITION_SCENARIO.target} — ${ACQUISITION_SCENARIO.branches} branches, ${ACQUISITION_SCENARIO.reps} reps, ${ACQUISITION_SCENARIO.accounts.toLocaleString()} accounts`}
          color="#8B5CF6"
          badge="Enterprise"
        />

        {/* Panel 1: Integration Timeline — CSS Grid Gantt */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
              Integration Timeline
            </h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: '#EF4444' }}>
                <span className="h-2.5 w-6 rounded" style={{ background: 'rgba(239,68,68,0.3)' }} />
                Traditional: {TRADITIONAL_TOTAL_WEEKS} weeks
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: '#10B981' }}>
                <span className="h-2.5 w-6 rounded" style={{ background: 'rgba(16,185,129,0.4)' }} />
                EQUIPR: {EQUIPR_TOTAL_WEEKS} weeks
              </span>
            </div>
          </div>

          {/* Gantt rows */}
          <div className="flex flex-col gap-2">
            {INTEGRATION_PHASES.map((phase) => {
              const tradPct = (phase.traditionalWeeks / TRADITIONAL_TOTAL_WEEKS) * 100;
              const equiprPct = (phase.equiprWeeks / TRADITIONAL_TOTAL_WEEKS) * 100;
              const statusColor = phase.status === 'complete' ? '#10B981' : phase.status === 'in-progress' ? '#F59E0B' : '#94A3B8';

              return (
                <div key={phase.name} className="grid items-center gap-3" style={{ gridTemplateColumns: '140px 1fr' }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                    <span className="text-[11px] font-medium truncate" style={{ color: 'var(--prizym-text-secondary)' }}>
                      {phase.name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {/* Traditional bar */}
                    <div className="flex items-center gap-2">
                      <div className="h-4 rounded flex items-center px-2" style={{ width: `${tradPct}%`, minWidth: 40, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <span className="text-[9px] font-mono font-medium" style={{ color: '#DC2626' }}>{phase.traditionalWeeks}w</span>
                      </div>
                      <span className="text-[9px] font-mono truncate hidden lg:block" style={{ color: 'var(--prizym-text-muted)', maxWidth: 200 }}>{phase.traditionalRisk}</span>
                    </div>
                    {/* EQUIPR bar */}
                    <div className="flex items-center gap-2">
                      <div className="h-4 rounded flex items-center px-2" style={{ width: `${equiprPct}%`, minWidth: 40, background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)' }}>
                        <span className="text-[9px] font-mono font-medium" style={{ color: '#059669' }}>{phase.equiprWeeks}w</span>
                      </div>
                      <span className="text-[9px] font-mono truncate hidden lg:block" style={{ color: '#059669', maxWidth: 200 }}>{phase.equiprAdvantage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary callout */}
          <div className="flex items-center justify-center gap-3 mt-4 py-2.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <span className="text-[13px] font-mono line-through" style={{ color: '#94A3B8' }}>{TRADITIONAL_TOTAL_WEEKS} weeks</span>
            <ArrowRight size={14} style={{ color: '#8B5CF6' }} />
            <span className="text-[13px] font-bold font-mono" style={{ color: '#8B5CF6' }}>{EQUIPR_TOTAL_WEEKS} weeks</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>
              {Math.round(((TRADITIONAL_TOTAL_WEEKS - EQUIPR_TOTAL_WEEKS) / TRADITIONAL_TOTAL_WEEKS) * 100)}% faster
            </span>
          </div>
        </div>

        {/* Panel 2: Account Merge Tracker */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
        >
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#F3F4F6', borderBottom: '1px solid var(--prizym-border-default)' }}>
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
              Account Merge Tracker
            </h3>
            <span className="text-[10px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
              {ACQUISITION_SCENARIO.fromSystem} → {ACQUISITION_SCENARIO.toSystem}
            </span>
          </div>
          {ACCOUNT_MERGE_EXAMPLES.map((acct, i) => {
            const statusMeta = acct.status === 'merged'
              ? { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.08)', label: 'MERGED' }
              : acct.status === 'review'
              ? { icon: AlertCircle, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', label: 'REVIEW' }
              : { icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: 'CONFLICT' };
            const StatusIcon = statusMeta.icon;

            return (
              <div
                key={acct.customer}
                className="px-5 py-3"
                style={{
                  borderBottom: i < ACCOUNT_MERGE_EXAMPLES.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: acct.customer === 'Apex Energy Services' ? 'rgba(139,92,246,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                  borderLeft: acct.customer === 'Apex Energy Services' ? '3px solid #8B5CF6' : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{acct.customer}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}>{acct.systemA}</span>
                    <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>+</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)' }}>{acct.systemB}</span>
                    {acct.systemC && (
                      <>
                        <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>+</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.08)', color: '#7C3AED', border: '1px solid rgba(139,92,246,0.15)' }}>{acct.systemC}</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] font-mono ml-auto" style={{ color: 'var(--prizym-text-muted)' }}>{acct.confidence}% confidence</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: statusMeta.bg, color: statusMeta.color }}>
                    <StatusIcon size={10} />
                    {statusMeta.label}
                  </span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: 'var(--prizym-text-muted)' }}>{acct.note}</p>
              </div>
            );
          })}
        </div>

        {/* Panel 3: Comp Stabilization — Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Industry Standard */}
          <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(100,116,139,0.12)' }}>
                <Users size={16} style={{ color: '#64748B' }} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {COMP_STABILIZATION.industry.approach}
                </h3>
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>During M&A transition</span>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--prizym-text-secondary)' }}>{COMP_STABILIZATION.industry.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="text-[10px] uppercase tracking-[1px] font-mono mb-0.5" style={{ color: 'var(--prizym-text-muted)' }}>Monthly Variance</div>
                <span className="text-[14px] font-bold font-mono" style={{ color: '#EF4444' }}>{COMP_STABILIZATION.industry.monthlyVariance}</span>
              </div>
              <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="text-[10px] uppercase tracking-[1px] font-mono mb-0.5" style={{ color: 'var(--prizym-text-muted)' }}>Rep Motivation</div>
                <span className="text-[12px] font-bold" style={{ color: '#EF4444' }}>{COMP_STABILIZATION.industry.repMotivation}</span>
              </div>
            </div>
          </div>

          {/* EQUIPR AI */}
          <div className="rounded-xl p-5 relative" style={{ background: 'var(--prizym-card-bg)', border: '1px solid rgba(16,185,129,0.35)', boxShadow: '0 0 24px rgba(16,185,129,0.08), var(--prizym-shadow-card)' }}>
            <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>
              Recommended
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)' }}>
                <Zap size={16} style={{ color: '#059669' }} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {COMP_STABILIZATION.equipr.approach}
                </h3>
                <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>During M&A transition</span>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--prizym-text-secondary)' }}>{COMP_STABILIZATION.equipr.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                <div className="text-[10px] uppercase tracking-[1px] font-mono mb-0.5" style={{ color: 'var(--prizym-text-muted)' }}>Monthly Variance</div>
                <span className="text-[14px] font-bold font-mono" style={{ color: '#059669' }}>{COMP_STABILIZATION.equipr.monthlyVariance}</span>
              </div>
              <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                <div className="text-[10px] uppercase tracking-[1px] font-mono mb-0.5" style={{ color: 'var(--prizym-text-muted)' }}>Rep Motivation</div>
                <span className="text-[12px] font-bold" style={{ color: '#059669' }}>{COMP_STABILIZATION.equipr.repMotivation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 5: CRM Speed Comparison
          ════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <SectionHeader
          icon={Timer}
          title="Why Your Reps Stopped Logging"
          subtitle="CRM task time: what they had, what they got, what EQUIPR delivers"
          color="#2563EB"
        />

        {/* Three-column task comparison */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
        >
          {/* Column headers */}
          <div className="grid gap-0" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
            <div className="px-4 py-3" style={{ background: '#F3F4F6', borderBottom: '1px solid var(--prizym-border-default)' }}>
              <span className="text-[10px] uppercase tracking-[1.5px] font-mono font-bold" style={{ color: 'var(--prizym-text-muted)' }}>Task</span>
            </div>
            <div className="px-4 py-3 text-center" style={{ background: 'rgba(16,185,129,0.06)', borderBottom: '2px solid #10B981' }}>
              <span className="text-[10px] uppercase tracking-[1.5px] font-mono font-bold" style={{ color: '#059669' }}>Legacy</span>
              <div className="text-[9px] font-mono" style={{ color: '#059669' }}>It worked</div>
            </div>
            <div className="px-4 py-3 text-center" style={{ background: 'rgba(239,68,68,0.04)', borderBottom: '2px solid #EF4444' }}>
              <span className="text-[10px] uppercase tracking-[1.5px] font-mono font-bold" style={{ color: '#DC2626' }}>Current CRM</span>
              <div className="text-[9px] font-mono" style={{ color: '#DC2626' }}>The problem</div>
            </div>
            <div className="px-4 py-3 text-center" style={{ background: 'rgba(37,99,235,0.04)', borderBottom: '2px solid #2563EB' }}>
              <span className="text-[10px] uppercase tracking-[1.5px] font-mono font-bold" style={{ color: '#2563EB' }}>EQUIPR</span>
              <div className="text-[9px] font-mono" style={{ color: '#2563EB' }}>The fix</div>
            </div>
          </div>

          {/* Task rows */}
          {CRM_TASKS.map((task, i) => (
            <div
              key={task.task}
              className="grid gap-0 items-center"
              style={{
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                borderBottom: i < CRM_TASKS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
              }}
            >
              <div className="px-4 py-3">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{task.task}</span>
              </div>
              <div className="px-4 py-3 text-center">
                <span className="text-[14px] font-bold font-mono" style={{ color: '#059669' }}>{task.legacy.time}</span>
                <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>{task.legacy.system}</div>
              </div>
              <div className="px-4 py-3 text-center" style={{ background: 'rgba(239,68,68,0.03)' }}>
                <span className="text-[14px] font-bold font-mono" style={{ color: '#DC2626' }}>{task.current.time}</span>
                <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>{task.current.system}</div>
              </div>
              <div className="px-4 py-3 text-center" style={{ background: 'rgba(37,99,235,0.03)' }}>
                <span className="text-[14px] font-bold font-mono" style={{ color: '#2563EB' }}>{task.equipr.time}</span>
                <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>{task.equipr.method}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Adoption metrics — 4 mini cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {ADOPTION_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl p-4"
              style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
            >
              <div className="text-[10px] uppercase tracking-[1.5px] font-mono mb-2" style={{ color: 'var(--prizym-text-muted)' }}>
                {metric.label}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono font-medium" style={{ color: '#059669' }}>{metric.legacy.value}</span>
                <ArrowRight size={10} style={{ color: '#EF4444' }} />
                <span className="text-[11px] font-mono font-medium" style={{ color: '#DC2626' }}>{metric.current.value}</span>
                <ArrowRight size={10} style={{ color: '#2563EB' }} />
                <span className="text-[11px] font-mono font-bold" style={{ color: '#2563EB' }}>{metric.equipr.value}</span>
              </div>
              {/* Mini bar chart: 3 bars */}
              <div className="flex items-end gap-1 h-6">
                <div className="flex-1 rounded-t" style={{ height: `${(metric.legacy.pct / 100) * 24}px`, background: 'rgba(16,185,129,0.3)' }} />
                <div className="flex-1 rounded-t" style={{ height: `${(metric.current.pct / 100) * 24}px`, background: 'rgba(239,68,68,0.3)' }} />
                <div className="flex-1 rounded-t" style={{ height: `${(metric.equipr.pct / 100) * 24}px`, background: 'rgba(37,99,235,0.5)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 6: Lead Intelligence Pipeline
          ════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <SectionHeader
          icon={Radar}
          title="Lead Intelligence Pipeline"
          subtitle="Your Dodge data is sitting in a portal. EQUIPR pushes it."
          color="#0891B2"
        />

        {/* 4 source cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {LEAD_SOURCES.map((source) => {
            const SourceIcon = ICON_MAP[source.icon] || Target;
            return (
              <div
                key={source.name}
                className="rounded-xl p-4"
                style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <SourceIcon size={14} style={{ color: source.color }} />
                  <span className="text-[12px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {source.name}
                  </span>
                </div>

                {/* Today (red tint) */}
                <div className="rounded-lg px-3 py-2 mb-2" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <div className="text-[9px] uppercase tracking-wider font-bold mb-0.5" style={{ color: '#DC2626' }}>Today</div>
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--prizym-text-secondary)' }}>{source.today}</p>
                </div>

                {/* EQUIPR (green tint) */}
                <div className="rounded-lg px-3 py-2 mb-3" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
                  <div className="text-[9px] uppercase tracking-wider font-bold mb-0.5" style={{ color: '#059669' }}>EQUIPR</div>
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--prizym-text-secondary)' }}>{source.equipr}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>{source.leadsPerWeek} leads/wk</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${source.color}12`, color: source.color, border: `1px solid ${source.color}25` }}>
                    {source.daysEarlier} days earlier
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline conversion comparison */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
        >
          <h3 className="text-[13px] font-bold mb-4" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Pipeline Conversion: Manual vs EQUIPR
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage.stage} className="text-center">
                <div className="text-[10px] font-bold mb-2" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stage.stage}
                </div>
                {/* Two bars side by side */}
                <div className="flex items-end justify-center gap-1 h-16 mb-2">
                  <div
                    className="w-6 rounded-t transition-all"
                    style={{ height: `${(stage.manualConversion / 100) * 64}px`, background: 'rgba(100,116,139,0.25)', border: '1px solid rgba(100,116,139,0.35)' }}
                  />
                  <div
                    className="w-6 rounded-t transition-all"
                    style={{ height: `${(stage.equiprConversion / 100) * 64}px`, background: 'rgba(8,145,178,0.4)', border: '1px solid rgba(8,145,178,0.5)' }}
                  />
                </div>
                <div className="text-[10px] font-mono" style={{ color: '#64748B' }}>{stage.manualConversion}%</div>
                <div className="text-[10px] font-mono font-bold" style={{ color: '#0891B2' }}>{stage.equiprConversion}%</div>
                {i < PIPELINE_STAGES.length - 1 && stage.equiprDays > 0 && (
                  <div className="text-[9px] font-mono mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
                    Day {stage.manualDays} → {stage.equiprDays}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: '#64748B' }}>
              <span className="h-2.5 w-4 rounded" style={{ background: 'rgba(100,116,139,0.25)' }} /> Manual
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: '#0891B2' }}>
              <span className="h-2.5 w-4 rounded" style={{ background: 'rgba(8,145,178,0.4)' }} /> EQUIPR
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 7: Rate Intelligence
          ════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <SectionHeader
          icon={BarChart3}
          title="Rate Intelligence"
          subtitle="Market rate monitor + commission visibility — CST $5 steps, demand signals, floor alerts"
          color="#2563EB"
        />

        {/* Rate table */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
        >
          {/* Header */}
          <div
            className="grid gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[1.5px] font-mono"
            style={{ gridTemplateColumns: '1.5fr 1.2fr 0.8fr 0.6fr 0.6fr', color: 'var(--prizym-text-muted)', background: '#F3F4F6', borderBottom: '1px solid var(--prizym-border-default)' }}
          >
            <div>Equipment</div>
            <div>Market Range</div>
            <div className="text-right">Your Rate</div>
            <div className="text-center">Demand</div>
            <div className="text-center">Floor</div>
          </div>

          {RATE_INTEL.map((row, i) => {
            const signal = DEMAND_STYLES[row.demand];
            const position = ((row.yourRate - row.marketLow) / (row.marketHigh - row.marketLow)) * 100;
            const isSurge = row.demand === 'surge';

            return (
              <div
                key={row.equipment}
                className="grid gap-2 px-5 py-3 items-center"
                style={{
                  gridTemplateColumns: '1.5fr 1.2fr 0.8fr 0.6fr 0.6fr',
                  borderBottom: i < RATE_INTEL.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: isSurge ? 'rgba(220,38,38,0.03)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                }}
              >
                <div className="text-[13px] font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{row.equipment}</div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono mb-1">
                    <span style={{ color: 'var(--prizym-text-muted)' }}>${row.marketLow}</span>
                    <span style={{ color: 'var(--prizym-text-muted)' }}>—</span>
                    <span style={{ color: 'var(--prizym-text-muted)' }}>${row.marketHigh}</span>
                  </div>
                  {/* Position bar */}
                  <div className="relative h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div className="absolute h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(to right, rgba(239,68,68,0.15), rgba(245,158,11,0.15), rgba(16,185,129,0.15))' }} />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
                      style={{ left: `${Math.min(Math.max(position, 5), 95)}%`, transform: 'translate(-50%, -50%)', background: '#2563EB', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[14px] font-bold font-mono" style={{ color: 'var(--prizym-text-primary)' }}>${row.yourRate}</span>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>±${row.cstStep} step</div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: signal.bg, color: signal.text }}>
                    {signal.label}
                  </span>
                </div>
                <div className="text-center">
                  {row.floorAlert ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626' }}>
                      <AlertTriangle size={10} /> LOW
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono" style={{ color: '#10B981' }}>OK</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Commission tier strip */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}
        >
          <h3 className="text-[13px] font-bold mb-3" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Rate Compliance → Commission Rate
          </h3>
          <div className="flex gap-2">
            {COMMISSION_TIERS.map((tier) => (
              <div
                key={tier.label}
                className="flex-1 rounded-lg p-3 text-center"
                style={{ background: tier.bgColor, border: `1px solid ${tier.color}25` }}
              >
                <div className="text-[18px] font-bold font-mono mb-1" style={{ color: tier.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {tier.rate}
                </div>
                <div className="text-[10px] font-mono font-medium" style={{ color: tier.color }}>{tier.range}</div>
                <div className="text-[9px] mt-1" style={{ color: 'var(--prizym-text-muted)' }}>{tier.label}</div>
                {tier.alert && (
                  <div className="flex items-center justify-center gap-1 mt-1.5 text-[9px] font-bold" style={{ color: '#DC2626' }}>
                    <AlertTriangle size={9} /> Alert
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone 8: Your Top 10 Moves Today ───────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
              Your Top 10 Moves Today
            </h2>
            <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-lg" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)' }}>
              Sorted by AI Revenue Score
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
            {(Object.entries(ACTION_TYPE_META) as [ActionType, typeof ACTION_TYPE_META[ActionType]][]).map(([key, meta]) => (
              <span key={key} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                {meta.label.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {ACTION_CARDS.map((card, idx) => (
            <ActionCardRow key={card.id} card={card} rank={idx + 1} defaultExpanded={idx < 2} />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          Zone 9: Industry Pain Closer
          ════════════════════════════════════════════════════ */}
      <div
        className="rounded-xl p-6 relative overflow-hidden"
        style={{ background: 'var(--prizym-card-bg)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 0 30px rgba(139,92,246,0.08), var(--prizym-shadow-card)' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: 'linear-gradient(to bottom, #8B5CF6, #2563EB, #0891B2)' }} />
        <div className="pl-4">
          <p className="text-[18px] font-bold mb-1" style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            We talked to your people. We built the solution.
          </p>
          <p className="text-[14px] mb-5" style={{ color: 'var(--prizym-text-secondary)' }}>
            Every pain point on this page came from equipment rental operators — not a whiteboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="rounded-lg px-4 py-3 text-center" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[16px] font-mono line-through" style={{ color: '#94A3B8' }}>{TRADITIONAL_TOTAL_WEEKS} weeks</span>
                <ArrowRight size={14} style={{ color: '#8B5CF6' }} />
                <span className="text-[20px] font-bold font-mono" style={{ color: '#8B5CF6' }}>{EQUIPR_TOTAL_WEEKS} weeks</span>
              </div>
              <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>M&A integration</span>
            </div>
            <div className="rounded-lg px-4 py-3 text-center" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[16px] font-mono line-through" style={{ color: '#94A3B8' }}>10 min</span>
                <ArrowRight size={14} style={{ color: '#2563EB' }} />
                <span className="text-[20px] font-bold font-mono" style={{ color: '#2563EB' }}>30 sec</span>
              </div>
              <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>CRM task time</span>
            </div>
            <div className="rounded-lg px-4 py-3 text-center" style={{ background: 'rgba(8,145,178,0.06)', border: '1px solid rgba(8,145,178,0.12)' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[16px] font-mono line-through" style={{ color: '#94A3B8' }}>Portal</span>
                <ArrowRight size={14} style={{ color: '#0891B2' }} />
                <span className="text-[20px] font-bold font-mono" style={{ color: '#0891B2' }}>6am push</span>
              </div>
              <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>Lead intelligence</span>
            </div>
          </div>

          <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--prizym-text-secondary)' }}>
              Your competitors are still doing this by hand.{' '}
              <span className="font-bold" style={{ color: '#8B5CF6' }}>
                That&apos;s why you&apos;re at ARA — and why EQUIPR exists.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
