'use client';

import { useState } from 'react';
import { TERRITORIES, AUDIT_EVENTS } from '@/data/ridgeline';
import { REGIONS } from '@/data/ridgeline';
import { fmtM } from '@/lib/utils';

/* -- Timeline data ------------------------------------------ */

const TIMELINE_EVENTS = [
  { date: '2025-01-01', label: 'FY2025 Territory Plan', type: 'plan' as const, detail: 'Initial territory assignments for FY2025. Heritage division operated independently.', impact: 'high' as const },
  { date: '2025-06-15', label: 'GMS Acquisition Closed', type: 'acquisition' as const, detail: 'Home Depot completes GMS acquisition through SRS. 200+ new locations added to platform.', impact: 'critical' as const },
  { date: '2025-09-01', label: 'Heritage Integration Phase 1', type: 'integration' as const, detail: 'Heritage East and Heritage South branches begin integration into SRS reporting. Dual-comp period starts.', impact: 'high' as const },
  { date: '2025-12-31', label: 'Heritage TX Consolidated', type: 'consolidation' as const, detail: 'Heritage TX territory archived. Branches moved to South Central region under existing RVP.', impact: 'high' as const },
  { date: '2026-01-01', label: 'FY2026 Territory Plan', type: 'plan' as const, detail: 'Unified territory structure goes live. 10 regions across 2 divisions. Effective-dated master data.', impact: 'critical' as const },
  { date: '2026-01-15', label: 'Heritage Branch Reassignment', type: 'reassignment' as const, detail: '3 Heritage East branches reassigned to TX North territory. Quota pro-rated.', impact: 'medium' as const },
  { date: '2026-02-01', label: 'Q1 Mid-Quarter Adjustment', type: 'adjustment' as const, detail: 'New effective date for expanded territories. Comp plans updated retroactively.', impact: 'high' as const },
  { date: '2026-04-01', label: 'Q2 Territory Refresh', type: 'plan' as const, detail: 'Planned: Quarterly territory review. Address coverage gaps in Mountain and Heritage West regions.', impact: 'medium' as const },
];

const TYPE_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  plan: { color: '#1E3A5F', icon: '📋', label: 'Plan' },
  acquisition: { color: '#7C3AED', icon: '🤝', label: 'Acquisition' },
  integration: { color: '#2563EB', icon: '🔗', label: 'Integration' },
  consolidation: { color: '#F59E0B', icon: '📦', label: 'Consolidation' },
  reassignment: { color: '#10B981', icon: '🔄', label: 'Reassignment' },
  adjustment: { color: '#EF4444', icon: '⚡', label: 'Adjustment' },
};

const IMPACT_COLORS = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#2563EB',
};

/* -- Gantt helpers ------------------------------------------- */

const GANTT_START = new Date('2025-01-01').getTime();
const GANTT_END = new Date('2026-06-30').getTime();
const GANTT_RANGE = GANTT_END - GANTT_START;

function dateToPercent(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return ((t - GANTT_START) / GANTT_RANGE) * 100;
}

const QUARTER_MARKERS = [
  { date: '2025-01-01', label: 'Q1\'25' },
  { date: '2025-04-01', label: 'Q2\'25' },
  { date: '2025-07-01', label: 'Q3\'25' },
  { date: '2025-10-01', label: 'Q4\'25' },
  { date: '2026-01-01', label: 'Q1\'26' },
  { date: '2026-04-01', label: 'Q2\'26' },
];

const territoryChanges = AUDIT_EVENTS.filter((e) =>
  ['territory_changed', 'employee_reassigned', 'quota_adjusted', 'branch_integrated'].includes(e.action)
);

export default function EffectiveDatingPage() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes timelineReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }
        @keyframes eventPop { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes markerPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .gantt-bar { animation: timelineReveal 1.2s ease-out backwards; }
        .event-marker { animation: eventPop 0.3s ease-out backwards; }
        .audit-row { animation: fadeSlide 0.3s ease-out backwards; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
          </svg>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
            Act 2 &middot; Territory &amp; Branch Ops
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Effective Dating Timeline
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Territory lifecycle, acquisition events, and effective-dated assignments &mdash; 18 months
          </p>
        </div>
      </div>

      {/* Gantt Chart — Territory Swim Lanes */}
      <div
        className="rounded-2xl border p-6 mb-8 overflow-hidden"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: 'var(--rl-text-muted)' }}>
            Territory Lifespan Gantt
          </h2>
          <div className="flex items-center gap-3 text-[9px]" style={{ color: 'var(--rl-text-muted)' }}>
            <span className="flex items-center gap-1">
              <span className="w-4 h-2 rounded-sm" style={{ background: '#1E3A5F' }} /> SRS Core
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-2 rounded-sm border border-dashed" style={{ borderColor: '#7C3AED', background: '#7C3AED30' }} /> Heritage
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-2 rounded-sm" style={{ background: '#94A3B8', opacity: 0.4 }} /> Archived
            </span>
          </div>
        </div>

        {/* Quarter headers */}
        <div className="relative h-8 mb-2">
          {QUARTER_MARKERS.map((q) => {
            const left = dateToPercent(q.date);
            return (
              <div
                key={q.date}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${left}%` }}
              >
                <div className="text-[9px] font-bold tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>{q.label}</div>
                <div className="w-px h-4 mt-0.5" style={{ background: 'var(--rl-border)' }} />
              </div>
            );
          })}
        </div>

        {/* Swim lanes */}
        <div className="space-y-2 relative">
          {/* Quarter grid lines (behind the lanes) */}
          <div className="absolute inset-0 pointer-events-none">
            {QUARTER_MARKERS.map((q) => (
              <div
                key={q.date}
                className="absolute top-0 bottom-0 w-px"
                style={{ left: `${dateToPercent(q.date)}%`, background: 'var(--rl-border)', opacity: 0.3 }}
              />
            ))}
            {/* Today marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 z-20"
              style={{ left: `${dateToPercent('2026-03-23')}%`, background: '#EF4444' }}
            />
            <div
              className="absolute z-20 text-[8px] font-bold px-1 py-0.5 rounded"
              style={{
                left: `${dateToPercent('2026-03-23')}%`,
                top: '-4px',
                background: '#EF4444',
                color: 'white',
                transform: 'translateX(-50%)',
              }}
            >
              TODAY
            </div>
          </div>

          {/* Territory bars */}
          {TERRITORIES.map((t, i) => {
            const region = REGIONS.find((r) => r.id === t.regionId);
            const isHeritage = t.divisionId === 'heritage';
            const isArchived = t.status === 'archived';
            const startPct = dateToPercent(t.effectiveStart);
            const endPct = t.effectiveEnd ? dateToPercent(t.effectiveEnd) : dateToPercent('2026-06-30');
            const widthPct = endPct - startPct;
            const isHovered = hoveredTerritory === t.id;

            return (
              <div
                key={t.id}
                className="flex items-center gap-3 h-10"
                onMouseEnter={() => setHoveredTerritory(t.id)}
                onMouseLeave={() => setHoveredTerritory(null)}
              >
                {/* Label */}
                <div className="w-32 shrink-0 text-right pr-2">
                  <div
                    className="text-[11px] font-bold truncate"
                    style={{ color: isArchived ? 'var(--rl-text-muted)' : 'var(--rl-text)' }}
                  >
                    {t.name}
                  </div>
                  <div className="text-[9px]" style={{ color: 'var(--rl-text-muted)' }}>{t.managerRole}</div>
                </div>

                {/* Bar track */}
                <div className="flex-1 relative h-8 rounded-lg" style={{ background: 'var(--rl-stripe)' }}>
                  {/* The territory bar */}
                  <div
                    className="gantt-bar absolute inset-y-1 rounded-md flex items-center px-2 overflow-hidden"
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      background: isArchived
                        ? 'linear-gradient(90deg, #94A3B840, #94A3B820)'
                        : isHeritage
                          ? `linear-gradient(90deg, ${region?.color}80, ${region?.color}50)`
                          : `linear-gradient(90deg, ${region?.color}CC, ${region?.color}90)`,
                      border: isHeritage ? `1px dashed ${region?.color}80` : `1px solid ${region?.color}40`,
                      animationDelay: `${i * 0.15}s`,
                      boxShadow: isHovered ? `0 0 12px ${region?.color}40` : undefined,
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    {/* Quota inside the bar */}
                    <span
                      className="text-[9px] font-bold whitespace-nowrap"
                      style={{
                        color: isArchived ? 'var(--rl-text-muted)' : 'white',
                        textShadow: isArchived ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      ${fmtM(t.annualQuota)}
                    </span>
                  </div>

                  {/* Effective start/end markers */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5"
                    style={{ left: `${startPct}%`, background: region?.color, opacity: 0.6 }}
                  />
                  {t.effectiveEnd && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5"
                      style={{ left: `${endPct}%`, background: '#EF4444', opacity: 0.6 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gantt Footer — Event Markers */}
        <div className="relative h-12 mt-4" style={{ borderTop: '1px solid var(--rl-border)' }}>
          {TIMELINE_EVENTS.map((evt, i) => {
            const left = dateToPercent(evt.date);
            const config = TYPE_CONFIG[evt.type];
            return (
              <div
                key={i}
                className="event-marker absolute cursor-pointer"
                style={{
                  left: `${left}%`,
                  top: '8px',
                  transform: 'translateX(-50%)',
                  animationDelay: `${0.8 + i * 0.1}s`,
                }}
                title={evt.label}
                onClick={() => setExpandedEvent(expandedEvent === i ? null : i)}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                  style={{
                    background: config.color,
                    border: `2px solid ${expandedEvent === i ? 'white' : 'transparent'}`,
                    boxShadow: expandedEvent === i ? `0 0 12px ${config.color}60` : `0 2px 4px rgba(0,0,0,0.15)`,
                    animation: expandedEvent === i ? 'markerPulse 1s ease-in-out infinite' : undefined,
                  }}
                >
                  <span style={{ fontSize: '9px' }}>{config.icon}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Cards — Visual Timeline */}
      <div
        className="rounded-2xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
      >
        <h2 className="text-[10px] uppercase tracking-[2px] font-bold mb-6" style={{ color: 'var(--rl-text-muted)' }}>
          Event Stream — {TIMELINE_EVENTS.length} Territory Events
        </h2>

        <div className="relative">
          {/* Center spine */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 rounded-full" style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED, #F59E0B, #10B981)' }} />

          <div className="space-y-4">
            {TIMELINE_EVENTS.map((evt, i) => {
              const config = TYPE_CONFIG[evt.type];
              const isExpanded = expandedEvent === i;
              return (
                <div
                  key={i}
                  className="relative flex gap-4 pl-2 cursor-pointer"
                  onClick={() => setExpandedEvent(isExpanded ? null : i)}
                >
                  {/* Node */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                      style={{
                        background: isExpanded ? config.color : 'var(--rl-card)',
                        border: `2.5px solid ${config.color}`,
                        boxShadow: isExpanded ? `0 0 16px ${config.color}40` : undefined,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {config.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-xl border p-4 transition-all"
                    style={{
                      background: isExpanded ? `${config.color}08` : 'var(--rl-stripe)',
                      borderColor: isExpanded ? config.color : 'var(--rl-border)',
                      borderLeft: `3px solid ${config.color}`,
                      boxShadow: isExpanded ? `0 4px 20px ${config.color}15` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{evt.label}</h3>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${config.color}15`, color: config.color }}
                        >
                          {config.label}
                        </span>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${IMPACT_COLORS[evt.impact]}15`, color: IMPACT_COLORS[evt.impact] }}
                        >
                          {evt.impact}
                        </span>
                      </div>
                      <span className="text-[11px] tabular-nums font-semibold" style={{ color: 'var(--rl-text-muted)' }}>
                        {evt.date}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-2" style={{ animation: 'fadeSlide 0.2s ease-out' }}>
                        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>
                          {evt.detail}
                        </p>
                      </div>
                    )}

                    {!isExpanded && (
                      <p className="text-[11px] truncate" style={{ color: 'var(--rl-text-muted)' }}>
                        {evt.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Territory Change Audit Log — Visual */}
      <div
        className="rounded-2xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}
      >
        <h2 className="text-[10px] uppercase tracking-[2px] font-bold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Territory Change Audit Trail — SOX Compliant
        </h2>
        <div className="space-y-2">
          {territoryChanges.map((evt, i) => {
            const severityConfig = {
              critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.15)', icon: '🔴' },
              warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.05)', border: 'rgba(245,158,11,0.15)', icon: '🟡' },
              info: { color: '#10B981', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.15)', icon: '🟢' },
            }[evt.severity];

            return (
              <div
                key={evt.id}
                className="audit-row rounded-xl p-4 flex items-start gap-3"
                style={{
                  background: severityConfig.bg,
                  border: `1px solid ${severityConfig.border}`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <span className="text-sm shrink-0 mt-0.5">{severityConfig.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--rl-text)' }}>
                      {evt.details}
                    </span>
                    <span className="text-[10px] tabular-nums shrink-0" style={{ color: 'var(--rl-text-muted)' }}>
                      {new Date(evt.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {evt.actor} ({evt.actorRole})
                    </span>
                    {evt.approvedBy && (
                      <span className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span style={{ color: '#10B981' }}>Approved by {evt.approvedBy}</span>
                      </span>
                    )}
                    <span
                      className="font-bold uppercase"
                      style={{ color: severityConfig.color, fontSize: '9px', letterSpacing: '1px' }}
                    >
                      {evt.severity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Effective Dating callout */}
      <div className="rounded-xl px-6 py-5 mt-6" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.04))', borderLeft: '4px solid #2563EB' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--rl-text-secondary)' }}>
          <strong>Why Effective Dating Matters at SRS Scale:</strong> With 982 branches under continuous acquisition integration,
          territory assignments, pricing, product hierarchies, and plan rules change constantly. Without effective-dated
          master data, retro-rate errors multiply and dispute volume explodes. Every change carries a valid-from/valid-to
          timestamp, enabling accurate historical comp calculations and SOX-compliant audit trails. The Gantt above shows
          how Heritage TX was archived while Heritage East persists — each with clean date boundaries.
        </p>
      </div>
    </>
  );
}
