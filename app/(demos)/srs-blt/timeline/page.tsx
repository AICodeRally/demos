'use client';

import { useState } from 'react';
import { TIMELINE_EVENTS, EVENT_TYPE_COLORS, EVENT_TYPE_LABELS, IMPACT_COLORS, getEventsByType } from '@/data/srs-blt/timeline';
import type { EventType } from '@/data/srs-blt/timeline';

const byType = (Object.keys(EVENT_TYPE_COLORS) as EventType[]).map((type) => ({
  type,
  count: TIMELINE_EVENTS.filter((e) => e.type === type).length,
}));

export default function TimelinePage() {
  const [typeFilter, setTypeFilter] = useState<EventType | null>(null);
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'SRS' | 'Heritage'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  let filtered = typeFilter ? getEventsByType(typeFilter) : TIMELINE_EVENTS;
  if (divisionFilter !== 'all') {
    filtered = filtered.filter((e) => e.division === divisionFilter || e.division === 'Both');
  }

  // Group by month
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, event) => {
    const month = event.date.slice(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  const months = Object.keys(grouped).sort();

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes dotPulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.3) } }
        @keyframes lineGrow { from { height: 0 } }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <span className="text-3xl text-white">&#128197;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#7C3AED' }}>Governance</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--sb-text)' }}>Effective-Dated Timeline</h1>
          <p className="text-[13px]" style={{ color: 'var(--sb-text-muted)' }}>
            {TIMELINE_EVENTS.length} events &middot; Territory changes, plan updates, and branch events
          </p>
        </div>
      </div>

      {/* Event Type Filter Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {byType.map(({ type, count }, i) => {
          const isActive = typeFilter === type;
          const color = EVENT_TYPE_COLORS[type];
          return (
            <button key={type} onClick={() => setTypeFilter(isActive ? null : type)}
              className="rounded-xl border p-3 text-center transition-all"
              style={{
                background: isActive ? `${color}10` : 'var(--sb-card)',
                borderColor: isActive ? color : 'var(--sb-border)',
                borderTop: `3px solid ${color}`,
                boxShadow: isActive ? `0 0 12px ${color}20` : 'var(--sb-shadow)',
                animation: `fadeUp ${0.3 + i * 0.08}s ease-out`,
              }}>
              <div className="text-xl font-extrabold tabular-nums" style={{ color }}>{count}</div>
              <div className="text-[9px] uppercase tracking-[0.5px]" style={{ color: 'var(--sb-text-muted)' }}>{EVENT_TYPE_LABELS[type]}</div>
            </button>
          );
        })}
      </div>

      {/* Division filter */}
      <div className="flex gap-2 mb-6" style={{ animation: 'fadeUp 0.5s ease-out' }}>
        {(['all', 'SRS', 'Heritage'] as const).map((div) => {
          const isActive = divisionFilter === div;
          const color = div === 'SRS' ? '#2563EB' : div === 'Heritage' ? '#D97706' : '#7C3AED';
          return (
            <button key={div} onClick={() => setDivisionFilter(div)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{ background: isActive ? color : 'var(--sb-card)', color: isActive ? 'white' : color, border: `1.5px solid ${isActive ? color : 'var(--sb-border)'}` }}>
              {div === 'all' ? 'All' : div}
            </button>
          );
        })}
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 rounded-full"
          style={{ background: 'var(--sb-border)', animation: 'lineGrow 0.8s ease-out' }} />

        {months.map((month, mi) => {
          const events = grouped[month];
          const monthLabel = new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

          return (
            <div key={month} className="mb-8" style={{ animation: `fadeUp ${0.3 + mi * 0.1}s ease-out` }}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-4 ml-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 text-[11px] font-bold text-white"
                  style={{ background: '#7C3AED' }}>
                  {month.slice(5)}
                </div>
                <span className="text-[14px] font-bold" style={{ color: 'var(--sb-text)' }}>{monthLabel}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--sb-stripe)', color: 'var(--sb-text-muted)' }}>
                  {events.length} events
                </span>
              </div>

              {/* Events */}
              <div className="space-y-3 ml-[46px]">
                {events.map((event, ei) => {
                  const isExpanded = expandedId === event.id;
                  const typeColor = EVENT_TYPE_COLORS[event.type];
                  const impactColor = IMPACT_COLORS[event.impact];
                  const divColor = event.division === 'SRS' ? '#2563EB' : event.division === 'Heritage' ? '#D97706' : '#7C3AED';

                  return (
                    <button key={event.id} onClick={() => setExpandedId(isExpanded ? null : event.id)}
                      className="w-full text-left relative" style={{ animation: `slideIn ${0.2 + ei * 0.06}s ease-out` }}>

                      {/* Connector dot */}
                      <div className="absolute -left-[30px] top-4 w-3 h-3 rounded-full border-2 z-10"
                        style={{
                          background: isExpanded ? typeColor : 'var(--sb-card)',
                          borderColor: typeColor,
                          animation: isExpanded ? 'dotPulse 1.5s ease-in-out infinite' : 'none',
                        }} />

                      <div className="rounded-xl border p-4 transition-all"
                        style={{
                          borderColor: isExpanded ? typeColor : 'var(--sb-border)',
                          borderLeft: `4px solid ${typeColor}`,
                          background: isExpanded ? `${typeColor}05` : 'var(--sb-card)',
                          boxShadow: 'var(--sb-shadow)',
                        }}>

                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold" style={{ color: 'var(--sb-text)' }}>{event.title}</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${typeColor}15`, color: typeColor }}>
                              {EVENT_TYPE_LABELS[event.type]}
                            </span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${divColor}15`, color: divColor }}>
                              {event.division}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: impactColor }} />
                            <span className="text-[9px] font-bold capitalize" style={{ color: impactColor }}>{event.impact}</span>
                          </div>
                        </div>

                        <p className="text-[11px] mb-2" style={{ color: 'var(--sb-text-muted)' }}>{event.description}</p>

                        <div className="flex gap-6 text-[10px]" style={{ color: 'var(--sb-text-faint)' }}>
                          <span>Entered: <strong style={{ color: 'var(--sb-text)' }}>{event.date}</strong></span>
                          <span>Effective: <strong style={{ color: typeColor }}>{event.effectiveStart}</strong></span>
                          {event.effectiveEnd && <span>Expires: <strong style={{ color: '#EF4444' }}>{event.effectiveEnd}</strong></span>}
                        </div>

                        {isExpanded && (
                          <div className="mt-3 pt-3 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid var(--sb-border)', animation: 'fadeUp 0.2s ease-out' }}>
                            <div>
                              <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>Event Type</div>
                              <div className="text-[12px] font-bold" style={{ color: typeColor }}>{EVENT_TYPE_LABELS[event.type]}</div>
                            </div>
                            <div>
                              <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>Impact Level</div>
                              <div className="text-[12px] font-bold capitalize" style={{ color: impactColor }}>{event.impact}</div>
                            </div>
                            <div>
                              <div className="text-[9px] uppercase mb-0.5" style={{ color: 'var(--sb-text-faint)' }}>Duration</div>
                              <div className="text-[12px] font-bold" style={{ color: 'var(--sb-text)' }}>
                                {event.effectiveEnd ? `${event.effectiveStart} — ${event.effectiveEnd}` : 'Ongoing'}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="text-[9px] mt-2 text-right" style={{ color: typeColor }}>
                          {isExpanded ? '\u25B2 Less' : '\u25BC More detail'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodology note */}
      <div className="rounded-xl px-6 py-4 mt-6" style={{ background: 'rgba(124,58,237,0.05)', borderLeft: '3px solid #7C3AED', animation: 'fadeUp 0.8s ease-out' }}>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--sb-text-muted)' }}>
          <strong style={{ color: 'var(--sb-text)' }}>Effective Dating:</strong> Every change in SRS BLT is tracked with entry date and effective date.
          Territory assignments, plan rules, and branch configurations are versioned with start/end dates to support
          mid-period adjustments without retroactive payout chaos. This is critical for multi-entity consolidation
          during acquisitions.
        </p>
      </div>
    </>
  );
}
