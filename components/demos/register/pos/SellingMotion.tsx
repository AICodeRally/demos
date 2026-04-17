'use client';

import { useMemo, useState } from 'react';
import {
  Activity, ArrowRight, ChevronRight, Crosshair, Target, TrendingUp, Flame,
  Clock, DollarSign, Zap, Compass,
} from 'lucide-react';
import {
  FLOOR_ZONES, ZONE_METRICS, METRIC_META, LENS_META, MOTION_INSIGHTS,
  TODAY_PLAY_BY_PLAY, SHIFT_RECS, type ZoneId, type MotionLens, type MotionMetric,
} from '@/data/register/selling-motion';

const METRIC_ORDER: MotionMetric[] = ['closeRate', 'attachRate', 'avgBasket', 'dwellMin', 'upsellHit'];
const METRIC_ICONS: Record<MotionMetric, typeof Target> = {
  closeRate: Target, attachRate: Zap, avgBasket: DollarSign, dwellMin: Clock, upsellHit: TrendingUp,
};

const ANALOGY_META: Record<string, { label: string; color: string }> = {
  spray:   { label: 'Spray Chart',      color: 'var(--register-chart-1)' },
  shift:   { label: 'Defensive Shift',  color: 'var(--register-chart-2)' },
  pitch:   { label: 'Pitch Location',   color: 'var(--register-chart-3)' },
  matchup: { label: 'Matchup Read',     color: 'var(--register-chart-6)' },
  pinch:   { label: 'Pinch Hitter',     color: 'var(--register-chart-4)' },
};

export function SellingMotion() {
  const [lens, setLens] = useState<MotionLens>('me');
  const [metric, setMetric] = useState<MotionMetric>('closeRate');
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);
  const [focusInsight, setFocusInsight] = useState<string | null>(null);
  const [subView, setSubView] = useState<'shift' | 'insights' | 'play'>('insights');

  const zoneData = ZONE_METRICS[lens][metric];
  const metricMeta = METRIC_META[metric];
  const lensMeta = LENS_META[lens];

  /* Current rep position = last event's zone */
  const currentZone = TODAY_PLAY_BY_PLAY[TODAY_PLAY_BY_PLAY.length - 1].zoneId;

  /* The focus insight's zone, if any — used to spotlight */
  const spotlightZoneId = focusInsight
    ? MOTION_INSIGHTS.find((m) => m.id === focusInsight)?.zoneId ?? null
    : null;

  /* Today's outcome summary */
  const todayStats = useMemo(() => {
    const closed = TODAY_PLAY_BY_PLAY.filter((e) => e.outcome === 'closed');
    const closedValue = closed.reduce((s, e) => s + (e.value ?? 0), 0);
    const attempts = TODAY_PLAY_BY_PLAY.filter((e) => e.outcome !== 'browsing').length;
    return { closeCount: closed.length, closedValue, attempts };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--register-bg)' }}>
      {/* ── Top control bar ─────────────────────────────────── */}
      <div style={{
        padding: '10px 12px',
        borderBottom: '1px solid var(--register-border)',
        background: 'var(--register-bg-elevated)',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {/* Title + lens toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Compass size={15} style={{ color: 'var(--register-primary)' }} />
          <span style={{
            fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--register-text)',
          }}>
            Selling Motion
          </span>
          <span style={{
            fontSize: '0.7rem', padding: '2px 7px', borderRadius: 999,
            background: 'color-mix(in srgb, var(--register-primary) 12%, transparent)',
            color: 'var(--register-primary)', fontWeight: 700, letterSpacing: '0.04em',
          }}>
            LIVE &middot; 3:12 PM
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 0, background: 'var(--register-bg-surface)', borderRadius: 8, padding: 2 }}>
            {(['me', 'team', 'top'] as MotionLens[]).map((l) => {
              const isActive = lens === l;
              return (
                <button
                  key={l}
                  onClick={() => setLens(l)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: 'none',
                    background: isActive ? 'var(--register-bg-elevated)' : 'transparent',
                    boxShadow: isActive ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                    color: isActive ? 'var(--register-text)' : 'var(--register-text-dim)',
                    fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                >
                  {LENS_META[l].label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Metric tabs */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {METRIC_ORDER.map((m) => {
            const isActive = metric === m;
            const Icon = METRIC_ICONS[m];
            return (
              <button
                key={m}
                onClick={() => setMetric(m)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '5px 10px', borderRadius: 6,
                  background: isActive ? lensMeta.accent : 'var(--register-bg-surface)',
                  border: '1px solid ' + (isActive ? 'transparent' : 'var(--register-border)'),
                  color: isActive ? '#FFFFFF' : 'var(--register-text-muted)',
                  fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'background 120ms ease',
                }}
              >
                <Icon size={11} />
                {METRIC_META[m].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main body: 2-column layout ──────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'row', gap: 12,
        padding: 12, overflow: 'hidden', minHeight: 0,
      }}>

        {/* LEFT: Floorplan (always visible) */}
        <div style={{
          width: '56%', minWidth: 340,
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
          flexShrink: 0,
        }}>
        <div style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '8px 12px',
            borderBottom: '1px solid var(--register-border)',
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--register-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Galleria Flagship #12 &middot; Floor 1
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--register-text-dim)' }}>
              {lensMeta.sublabel}
            </span>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--register-bg-surface)', position: 'relative' }}>
            <Floorplan
              zoneData={zoneData}
              metric={metric}
              hoveredZone={hoveredZone}
              onHover={setHoveredZone}
              spotlightZoneId={spotlightZoneId}
              currentZone={currentZone}
              lensAccent={lensMeta.accent}
            />

            <Legend metric={metric} zoneData={zoneData} />

            {hoveredZone && (
              <ZoneTooltip
                zoneId={hoveredZone}
                value={zoneData[hoveredZone] ?? 0}
                metric={metric}
              />
            )}
          </div>

          {/* Today's stats strip */}
          <div style={{
            padding: '8px 14px',
            borderTop: '1px solid var(--register-border)',
            background: 'var(--register-bg-elevated)',
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <Stat label="Today closes" value={String(todayStats.closeCount)} />
            <Stat label="Today revenue" value={fmtMoney(todayStats.closedValue)} />
            <Stat label="Current zone" value={FLOOR_ZONES.find(z => z.id === currentZone)?.shortLabel ?? '—'} accent={lensMeta.accent} />
          </div>
        </div>
        </div>
        {/* END LEFT column */}

        {/* RIGHT: sub-tab + selected view */}
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', flexDirection: 'column', gap: 10,
          overflow: 'hidden',
        }}>
          {/* Sub-tab bar */}
          <div style={{
            display: 'flex', gap: 4, padding: 4, borderRadius: 10,
            background: 'var(--register-bg-surface)',
            border: '1px solid var(--register-border)',
            flexShrink: 0,
          }}>
            {([
              { id: 'shift',    label: 'Shift Recs',       icon: Crosshair,  count: SHIFT_RECS.length },
              { id: 'insights', label: 'The Tape',         icon: Flame,      count: MOTION_INSIGHTS.length },
              { id: 'play',     label: 'Play-by-Play',     icon: Activity,   count: TODAY_PLAY_BY_PLAY.length },
            ] as const).map((t) => {
              const isActive = subView === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSubView(t.id)}
                  style={{
                    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 10px', borderRadius: 7, border: 'none',
                    background: isActive ? 'var(--register-bg-elevated)' : 'transparent',
                    boxShadow: isActive ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                    color: isActive ? 'var(--register-text)' : 'var(--register-text-dim)',
                    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    transition: 'background 120ms ease',
                  }}
                >
                  <Icon size={13} />
                  {t.label}
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700,
                    padding: '1px 6px', borderRadius: 999,
                    background: isActive ? 'var(--register-primary)' : 'var(--register-border)',
                    color: isActive ? '#FFFFFF' : 'var(--register-text-dim)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-view content area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Shift recommendations — baseball "defensive shift" */}
        {subView === 'shift' && (
        <div style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12, padding: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Crosshair size={14} style={{ color: 'var(--register-warning)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--register-text)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Recommended shift
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)', marginLeft: 'auto' }}>
              Live traffic &middot; last 60 min
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SHIFT_RECS.map((s, i) => (
              <div key={s.timeWindow} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: i === 0 ? `color-mix(in srgb, var(--register-warning) 10%, var(--register-bg-surface))` : 'var(--register-bg-surface)',
                border: `1px solid ${i === 0 ? 'color-mix(in srgb, var(--register-warning) 45%, transparent)' : 'var(--register-border)'}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'color-mix(in srgb, var(--register-warning) 18%, transparent)',
                  color: 'var(--register-warning)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.95rem',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--register-text)' }}>
                      {FLOOR_ZONES.find((z) => z.id === s.suggestedZone)?.label}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)', fontFamily: 'ui-monospace, Menlo, monospace' }}>
                      {s.timeWindow}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', marginTop: 2, lineHeight: 1.4 }}>
                    {s.reason}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'color-mix(in srgb, var(--register-success) 14%, transparent)',
                  color: 'var(--register-success)',
                  fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap',
                }}>
                  {s.expectedLift}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Baseball insights */}
        {subView === 'insights' && (
        <div style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12, padding: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Flame size={14} style={{ color: 'var(--register-ai)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--register-text)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              The tape — motion intelligence
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOTION_INSIGHTS.map((insight) => {
              const analogy = ANALOGY_META[insight.analogy];
              const isFocused = focusInsight === insight.id;
              const impactColor = {
                opportunity: 'var(--register-accent)',
                warning: 'var(--register-danger)',
                strength: 'var(--register-success)',
              }[insight.impact];

              return (
                <button
                  key={insight.id}
                  onMouseEnter={() => setFocusInsight(insight.id)}
                  onMouseLeave={() => setFocusInsight((f) => (f === insight.id ? null : f))}
                  onClick={() => setFocusInsight(isFocused ? null : insight.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px', borderRadius: 10,
                    background: isFocused
                      ? `color-mix(in srgb, ${impactColor} 9%, var(--register-bg-surface))`
                      : 'var(--register-bg-surface)',
                    border: `1px solid ${isFocused ? impactColor : 'var(--register-border)'}`,
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    cursor: 'pointer', width: '100%',
                    transition: 'background 140ms ease, border-color 140ms ease',
                  }}
                >
                  <div style={{
                    width: 3, alignSelf: 'stretch', borderRadius: 2,
                    background: impactColor,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em',
                        padding: '2px 7px', borderRadius: 4,
                        background: `color-mix(in srgb, ${analogy.color} 18%, transparent)`,
                        color: analogy.color,
                        textTransform: 'uppercase',
                      }}>
                        {analogy.label}
                      </span>
                      {insight.zoneId && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)' }}>
                          {FLOOR_ZONES.find((z) => z.id === insight.zoneId)?.shortLabel}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--register-text)', lineHeight: 1.3 }}>
                      {insight.headline}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text-muted)', marginTop: 3, lineHeight: 1.5 }}>
                      {insight.body}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--register-text-dim)', flexShrink: 0, marginTop: 3, opacity: isFocused ? 1 : 0.4 }} />
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* Play-by-play */}
        {subView === 'play' && (
        <div style={{
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          borderRadius: 12, padding: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Activity size={14} style={{ color: 'var(--register-primary)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--register-text)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Today&apos;s play-by-play
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)', marginLeft: 'auto', fontFamily: 'ui-monospace, Menlo, monospace' }}>
              {TODAY_PLAY_BY_PLAY.length} events
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TODAY_PLAY_BY_PLAY.slice().reverse().map((e, i) => {
              const zone = FLOOR_ZONES.find((z) => z.id === e.zoneId);
              const outcomeCfg = {
                closed:      { label: 'CLOSE',   color: 'var(--register-success)' },
                browsing:    { label: 'BROWSE',  color: 'var(--register-text-dim)' },
                'handed-off':{ label: 'HAND-OFF',color: 'var(--register-accent)' },
                lost:        { label: 'LOST',    color: 'var(--register-danger)' },
              }[e.outcome];

              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '8px 2px',
                  borderBottom: i === TODAY_PLAY_BY_PLAY.length - 1 ? 'none' : '1px solid var(--register-border)',
                }}>
                  <div style={{
                    fontSize: '0.74rem', fontFamily: 'ui-monospace, Menlo, monospace',
                    color: 'var(--register-text-dim)', width: 62, flexShrink: 0, paddingTop: 2,
                  }}>
                    {e.ts}
                  </div>
                  <div style={{
                    padding: '2px 8px', borderRadius: 4, flexShrink: 0,
                    background: `color-mix(in srgb, ${outcomeCfg.color} 14%, transparent)`,
                    color: outcomeCfg.color,
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.06em',
                    alignSelf: 'flex-start', marginTop: 2,
                  }}>
                    {outcomeCfg.label}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--register-text)', lineHeight: 1.4 }}>
                      <strong>{zone?.shortLabel}</strong> &middot; {e.dwellMin} min
                      {e.value != null && (
                        <> &middot; <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(e.value)}</span></>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--register-text-muted)', lineHeight: 1.4 }}>
                      {e.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

          </div>
          {/* END right column content */}
        </div>
        {/* END right column */}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Floorplan SVG — heatmap + rep dot
   ─────────────────────────────────────────────────────────── */

function Floorplan({
  zoneData, metric, hoveredZone, onHover, spotlightZoneId, currentZone, lensAccent,
}: {
  zoneData: Record<ZoneId, number>;
  metric: MotionMetric;
  hoveredZone: ZoneId | null;
  onHover: (z: ZoneId | null) => void;
  spotlightZoneId: ZoneId | null;
  currentZone: ZoneId;
  lensAccent: string;
}) {
  const meta = METRIC_META[metric];

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '72%' }}>
      <svg
        viewBox="0 0 100 72"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <pattern id="floor-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="var(--register-border)" strokeWidth="0.12" opacity="0.6" />
          </pattern>
          <filter id="rep-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Floor outline + grid */}
        <rect x="0" y="0" width="100" height="70" fill="var(--register-bg-elevated)" stroke="var(--register-border-strong)" strokeWidth="0.4" rx="2" />
        <rect x="0" y="0" width="100" height="70" fill="url(#floor-grid)" />

        {/* Traffic flow (subtle dashed arrows) */}
        <g stroke="var(--register-border-strong)" strokeDasharray="1 1.2" strokeWidth="0.3" fill="none" opacity="0.55">
          <path d="M 89 60 Q 60 52 50 26" markerEnd="url(#arr)" />
          <path d="M 89 60 Q 30 50 18 26" />
          <path d="M 50 34 Q 55 40 71 42" />
          <path d="M 30 42 Q 30 55 40 60" />
        </g>

        {/* Zones */}
        {FLOOR_ZONES.map((zone) => {
          const value = zoneData[zone.id] ?? 0;
          const t = scaleToHeat(value, meta.min, meta.max);
          const isHoverable = zone.kind === 'bay' || zone.kind === 'feature' || zone.kind === 'service' || zone.kind === 'entry';
          const isHovered = hoveredZone === zone.id;
          const isSpotlight = spotlightZoneId === zone.id;
          const isDimmed = spotlightZoneId != null && !isSpotlight;
          const isCurrent = currentZone === zone.id;

          const heatColor = heatAtT(t);
          const fillOpacity = isHoverable && t > 0 ? 0.28 + t * 0.55 : isHoverable ? 0.08 : 0.04;
          const strokeColor = isCurrent ? lensAccent : (isHovered || isSpotlight ? heatColor : 'var(--register-border-strong)');
          const strokeWidth = isCurrent ? 0.7 : (isHovered || isSpotlight ? 0.55 : 0.25);

          return (
            <g
              key={zone.id}
              onMouseEnter={() => isHoverable && onHover(zone.id)}
              onMouseLeave={() => onHover(null)}
              style={{
                cursor: isHoverable ? 'pointer' : 'default',
                opacity: isDimmed ? 0.35 : 1,
                transition: 'opacity 200ms ease',
              }}
            >
              <polygon
                points={zone.polygon}
                fill={isHoverable && t > 0 ? heatColor : 'var(--register-bg-surface)'}
                fillOpacity={fillOpacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                style={{ transition: 'fill 220ms ease, fill-opacity 220ms ease, stroke 180ms ease, stroke-width 180ms ease' }}
              />
              {/* Zone short label */}
              <text
                x={zone.anchor[0]}
                y={zone.anchor[1] - 1.2}
                fontSize="2.2"
                textAnchor="middle"
                fill="var(--register-text)"
                fontWeight="700"
                style={{ pointerEvents: 'none', letterSpacing: '0.02em' }}
              >
                {zone.shortLabel}
              </text>
              {/* Metric value overlay */}
              {isHoverable && t > 0 && (
                <text
                  x={zone.anchor[0]}
                  y={zone.anchor[1] + 2.6}
                  fontSize="2.8"
                  textAnchor="middle"
                  fill={heatColor}
                  fontWeight="800"
                  fontFamily="ui-monospace, Menlo, monospace"
                  style={{ pointerEvents: 'none', filter: 'drop-shadow(0 0.3px 0.4px rgba(15,23,42,0.3))' }}
                >
                  {meta.format(value)}
                </text>
              )}
              {/* Rep current-position dot */}
              {isCurrent && (
                <>
                  <circle cx={zone.anchor[0]} cy={zone.anchor[1]} r="2.6" fill={lensAccent} opacity="0.25">
                    <animate attributeName="r" values="2.6;3.8;2.6" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.05;0.25" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={zone.anchor[0]} cy={zone.anchor[1]} r="1.2" fill={lensAccent} filter="url(#rep-glow)" />
                  <text
                    x={zone.anchor[0] + 2}
                    y={zone.anchor[1] - 2.8}
                    fontSize="2"
                    fill={lensAccent}
                    fontWeight="800"
                    style={{ pointerEvents: 'none' }}
                  >
                    YOU
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Entry arrow */}
        <g opacity="0.75">
          <path d="M 100 64 L 94 64" stroke="var(--register-success)" strokeWidth="0.6" fill="none" />
          <polygon points="94,63 94,65 92,64" fill="var(--register-success)" />
          <text x="92" y="61" fontSize="1.8" fill="var(--register-success)" fontWeight="700" textAnchor="end">Customers</text>
        </g>
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Legend — color scale bar + scale endpoints
   ─────────────────────────────────────────────────────────── */

function Legend({ metric, zoneData }: { metric: MotionMetric; zoneData: Record<ZoneId, number> }) {
  const meta = METRIC_META[metric];
  const values = FLOOR_ZONES.filter((z) => z.kind === 'bay' || z.kind === 'feature' || z.kind === 'service').map((z) => zoneData[z.id] ?? 0).filter((v) => v > 0);
  const peak = values.length ? Math.max(...values) : meta.max;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginTop: 10,
      fontSize: '0.72rem', color: 'var(--register-text-dim)',
    }}>
      <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {meta.label}
      </span>
      <div style={{
        flex: 1, height: 8, borderRadius: 4,
        background: 'linear-gradient(90deg, #64748B 0%, #3B82F6 22%, #0891B2 42%, #D97706 68%, #059669 100%)',
        border: '1px solid var(--register-border)',
      }} />
      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{meta.format(meta.min)}</span>
      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', color: 'var(--register-text)' }}>{meta.format(peak)}</span>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Tooltip — floating zone readout
   ─────────────────────────────────────────────────────────── */

function ZoneTooltip({ zoneId, value, metric }: { zoneId: ZoneId; value: number; metric: MotionMetric }) {
  const zone = FLOOR_ZONES.find((z) => z.id === zoneId);
  if (!zone) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 14, right: 18,
      padding: '10px 12px',
      background: 'var(--register-chart-tooltip-bg)',
      border: '1px solid var(--register-chart-tooltip-border)',
      borderRadius: 10,
      boxShadow: 'var(--register-shadow-card-hover)',
      minWidth: 200, pointerEvents: 'none',
      animation: 'mo-fade 120ms ease',
    }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--register-text)', marginBottom: 4 }}>
        {zone.label}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--register-text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
        {zone.productFocus}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: '1.1rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
          color: 'var(--register-text)',
        }}>
          {METRIC_META[metric].format(value)}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--register-text-dim)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {METRIC_META[metric].label}
        </span>
      </div>
      <style>{`@keyframes mo-fade { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
      <span style={{
        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
        color: 'var(--register-text-dim)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.92rem', fontWeight: 800, color: accent ?? 'var(--register-text)',
        fontVariantNumeric: 'tabular-nums', marginTop: 2,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────────────────── */

function scaleToHeat(v: number, min: number, max: number): number {
  if (v <= 0) return 0;
  if (max === min) return 0.5;
  return Math.min(1, Math.max(0, (v - min) / (max - min)));
}

/** 5-stop heat scale: cool gray → cyan → amber → emerald */
function heatAtT(t: number): string {
  if (t <= 0) return '#64748B';
  if (t < 0.22) return '#3B82F6';
  if (t < 0.42) return '#0891B2';
  if (t < 0.68) return '#D97706';
  return '#059669';
}

function fmtMoney(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 1 : 2)}K`;
  return `$${Math.round(n)}`;
}
