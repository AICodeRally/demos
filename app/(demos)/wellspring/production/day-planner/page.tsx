'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  RouteMap,
  StopCard,
  MobilePreview,
  RepSelector,
  StatCard,
  AreaChart,
} from '@/components/demos/wellspring';
import {
  DAY_PLANS,
  JAKE_DAY_PLAN,
  MARIA_DAY_PLAN,
  type DayPlan,
  type Stop,
  type DataSource,
} from '@/data/wellspring/day-plans';
import { PRODUCTION } from '@/data/wellspring/production';

/* ── Source icon colors ────────────────────────────────── */

const SOURCE_COLORS: Record<DataSource, string> = {
  scada: '#16A34A',
  enverus: '#7C3AED',
  aries: '#B45309',
  rrc: '#C2A04E',
  weather: '#0D9488',
  maintenance: '#6B7280',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: '#DC2626',
  medium: '#D97706',
  low: '#2563EB',
};

/* ── Detail Panel ─────────────────────────────────────── */

function DetailPanel({
  stop,
  activeTab,
  setActiveTab,
}: {
  stop: Stop;
  activeTab: 'tasks' | 'production' | 'intelligence';
  setActiveTab: (tab: 'tasks' | 'production' | 'intelligence') => void;
}) {
  // Find production history for this well
  const wellProd = stop.wellId
    ? PRODUCTION.find((p) => p.wellId === stop.wellId)
    : null;

  const chartData = wellProd
    ? wellProd.history.map((d) => ({
        label: d.date.slice(5),
        value: d.oilBpd,
      }))
    : [];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(
          [
            { id: 'tasks' as const, label: 'Field Tasks' },
            { id: 'production' as const, label: 'Production' },
            { id: 'intelligence' as const, label: 'Intelligence' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="text-[11px] font-mono px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: activeTab === t.id ? '#B45309' : '#252B36',
              color: activeTab === t.id ? 'white' : '#94A3B8',
              fontWeight: activeTab === t.id ? 700 : 400,
              border:
                activeTab === t.id
                  ? '1px solid #D97706'
                  : '1px solid #334155',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Field Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* SCADA Readings */}
          {stop.scadaReadings && (
            <div>
              <div
                className="text-[9px] uppercase tracking-wider font-mono mb-2 flex items-center gap-1"
                style={{ color: '#64748B' }}
              >
                <span style={{ color: '#16A34A' }}>&#9679;</span> SCADA
                Readings
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stop.scadaReadings.pressure !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: '#1A1D23' }}
                  >
                    <div
                      className="text-[8px] uppercase tracking-wider"
                      style={{ color: '#64748B' }}
                    >
                      Pressure
                    </div>
                    <div
                      className="text-sm font-bold mt-0.5"
                      style={{ color: '#F1F5F9' }}
                    >
                      {stop.scadaReadings.pressure}{' '}
                      <span
                        className="text-[10px] font-normal"
                        style={{ color: '#94A3B8' }}
                      >
                        psi
                      </span>
                    </div>
                  </div>
                )}
                {stop.scadaReadings.temperature !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: '#1A1D23' }}
                  >
                    <div
                      className="text-[8px] uppercase tracking-wider"
                      style={{ color: '#64748B' }}
                    >
                      Temperature
                    </div>
                    <div
                      className="text-sm font-bold mt-0.5"
                      style={{ color: '#F1F5F9' }}
                    >
                      {stop.scadaReadings.temperature}{' '}
                      <span
                        className="text-[10px] font-normal"
                        style={{ color: '#94A3B8' }}
                      >
                        &deg;F
                      </span>
                    </div>
                  </div>
                )}
                {stop.scadaReadings.flowRate !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: '#1A1D23' }}
                  >
                    <div
                      className="text-[8px] uppercase tracking-wider"
                      style={{ color: '#64748B' }}
                    >
                      Flow Rate
                    </div>
                    <div
                      className="text-sm font-bold mt-0.5"
                      style={{ color: '#F1F5F9' }}
                    >
                      {stop.scadaReadings.flowRate}{' '}
                      <span
                        className="text-[10px] font-normal"
                        style={{ color: '#94A3B8' }}
                      >
                        bpd
                      </span>
                    </div>
                  </div>
                )}
                {stop.scadaReadings.status && (
                  <div
                    className="rounded-lg px-3 py-2"
                    style={{ background: '#1A1D23' }}
                  >
                    <div
                      className="text-[8px] uppercase tracking-wider"
                      style={{ color: '#64748B' }}
                    >
                      Status
                    </div>
                    <div
                      className="text-sm font-bold mt-0.5 uppercase"
                      style={{
                        color:
                          stop.scadaReadings.status === 'alarm'
                            ? '#EF4444'
                            : stop.scadaReadings.status === 'flowback'
                              ? '#7C3AED'
                              : '#16A34A',
                      }}
                    >
                      {stop.scadaReadings.status}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Production Data */}
          {stop.productionData && (
            <div>
              <div
                className="text-[9px] uppercase tracking-wider font-mono mb-2"
                style={{ color: '#64748B' }}
              >
                Production
              </div>
              <div className="flex gap-4 text-sm">
                {stop.productionData.oilBpd !== undefined && (
                  <div>
                    <span
                      className="font-bold"
                      style={{ color: '#16A34A' }}
                    >
                      {stop.productionData.oilBpd}
                    </span>
                    <span
                      className="text-[10px] ml-1"
                      style={{ color: '#94A3B8' }}
                    >
                      bopd
                    </span>
                  </div>
                )}
                {stop.productionData.gasMcfd !== undefined && (
                  <div>
                    <span
                      className="font-bold"
                      style={{ color: '#EA580C' }}
                    >
                      {stop.productionData.gasMcfd}
                    </span>
                    <span
                      className="text-[10px] ml-1"
                      style={{ color: '#94A3B8' }}
                    >
                      Mcfd
                    </span>
                  </div>
                )}
                {stop.productionData.waterCut !== undefined && (
                  <div>
                    <span
                      className="font-bold"
                      style={{ color: '#2563EB' }}
                    >
                      {(stop.productionData.waterCut * 100).toFixed(0)}%
                    </span>
                    <span
                      className="text-[10px] ml-1"
                      style={{ color: '#94A3B8' }}
                    >
                      WC
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Field Actions Checklist */}
          {stop.fieldActions.length > 0 && (
            <div>
              <div
                className="text-[9px] uppercase tracking-wider font-mono mb-2"
                style={{ color: '#64748B' }}
              >
                Field Actions ({stop.fieldActions.length})
              </div>
              <div className="space-y-1.5">
                {stop.fieldActions.map((fa, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[11px]"
                  >
                    <div
                      className="shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5"
                      style={{
                        borderColor: fa.completed ? '#16A34A' : '#475569',
                        background: fa.completed
                          ? 'rgba(22,163,74,0.15)'
                          : 'transparent',
                      }}
                    >
                      {fa.completed && (
                        <span
                          className="text-[9px]"
                          style={{ color: '#16A34A' }}
                        >
                          &#10003;
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        color: fa.completed ? '#64748B' : '#CBD5E1',
                      }}
                    >
                      {fa.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Required */}
          {stop.photoRequired && (
            <div
              className="flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(194,160,78,0.1)',
                border: '1px solid rgba(194,160,78,0.3)',
                color: '#C2A04E',
              }}
            >
              <span className="text-base">&#128247;</span>
              <span className="font-bold uppercase tracking-wider">
                Photo Required
              </span>
            </div>
          )}
        </div>
      )}

      {/* Production Tab */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          {wellProd && chartData.length > 0 ? (
            <>
              <div>
                <div
                  className="text-[9px] uppercase tracking-wider font-mono mb-2"
                  style={{ color: '#64748B' }}
                >
                  30-Day Oil Production (bopd)
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: '#1A1D23',
                    border: '1px solid #334155',
                  }}
                >
                  <AreaChart
                    data={chartData}
                    color="#16A34A"
                    height={160}
                    showDots={false}
                  />
                </div>
              </div>

              {/* Current rates */}
              <div className="grid grid-cols-3 gap-2">
                {stop.productionData?.oilBpd !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2.5 text-center"
                    style={{
                      background: '#1A1D23',
                      border: '1px solid #334155',
                    }}
                  >
                    <div
                      className="text-lg font-bold"
                      style={{ color: '#16A34A' }}
                    >
                      {stop.productionData.oilBpd}
                    </div>
                    <div
                      className="text-[9px] uppercase"
                      style={{ color: '#94A3B8' }}
                    >
                      Oil bopd
                    </div>
                  </div>
                )}
                {stop.productionData?.gasMcfd !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2.5 text-center"
                    style={{
                      background: '#1A1D23',
                      border: '1px solid #334155',
                    }}
                  >
                    <div
                      className="text-lg font-bold"
                      style={{ color: '#EA580C' }}
                    >
                      {stop.productionData.gasMcfd}
                    </div>
                    <div
                      className="text-[9px] uppercase"
                      style={{ color: '#94A3B8' }}
                    >
                      Gas Mcfd
                    </div>
                  </div>
                )}
                {stop.productionData?.waterCut !== undefined && (
                  <div
                    className="rounded-lg px-3 py-2.5 text-center"
                    style={{
                      background: '#1A1D23',
                      border: '1px solid #334155',
                    }}
                  >
                    <div
                      className="text-lg font-bold"
                      style={{ color: '#2563EB' }}
                    >
                      {(stop.productionData.waterCut * 100).toFixed(0)}%
                    </div>
                    <div
                      className="text-[9px] uppercase"
                      style={{ color: '#94A3B8' }}
                    >
                      Water Cut
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div
                className="text-sm"
                style={{ color: '#64748B' }}
              >
                No production history available
              </div>
              <div
                className="text-[11px] mt-1"
                style={{ color: '#475569' }}
              >
                {stop.type === 'yard-departure' || stop.type === 'yard-return'
                  ? 'Yard location — no well production data'
                  : 'Production data not tracked for this stop type'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Intelligence Tab */}
      {activeTab === 'intelligence' && (
        <div className="space-y-3">
          {stop.aiInsights.length > 0 ? (
            stop.aiInsights.map((insight, i) => (
              <div
                key={i}
                className="rounded-lg p-3"
                style={{
                  background:
                    insight.priority === 'high'
                      ? 'rgba(220,38,38,0.08)'
                      : insight.priority === 'medium'
                        ? 'rgba(217,119,6,0.08)'
                        : 'rgba(37,99,235,0.08)',
                  borderLeft: `3px solid ${PRIORITY_COLORS[insight.priority]}`,
                }}
              >
                <div
                  className="text-[11px] leading-relaxed"
                  style={{ color: '#CBD5E1' }}
                >
                  {insight.insight}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: `${SOURCE_COLORS[insight.source]}20`,
                      color: SOURCE_COLORS[insight.source],
                    }}
                  >
                    {insight.source}
                  </span>
                  <span
                    className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${PRIORITY_COLORS[insight.priority]}15`,
                      color: PRIORITY_COLORS[insight.priority],
                    }}
                  >
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-sm" style={{ color: '#64748B' }}>
                No AI insights for this stop
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────── */

export default function DayPlannerPage() {
  const [selectedForeman, setSelectedForeman] = useState(
    JAKE_DAY_PLAN.foremanId,
  );
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [showMobile, setShowMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'tasks' | 'production' | 'intelligence'
  >('tasks');

  const plan: DayPlan =
    DAY_PLANS.find((p) => p.foremanId === selectedForeman) ?? JAKE_DAY_PLAN;
  const activeStop = plan.stops.find((s) => s.id === activeStopId) ?? null;

  const foremen = DAY_PLANS.map((p) => ({
    id: p.foremanId,
    name: p.foremanName,
    route: p.route,
    region: p.regionName,
  }));

  const handleStopClick = useCallback((id: string) => {
    setActiveStopId((prev) => (prev === id ? null : id));
    setActiveTab('tasks');
  }, []);

  const handleStopHover = useCallback((_id: string | null) => {
    // Hover is secondary to click
  }, []);

  // Reset selection when foreman changes
  useEffect(() => {
    setActiveStopId(null);
  }, [selectedForeman]);

  // Close mobile modal on Escape
  useEffect(() => {
    if (!showMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMobile(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showMobile]);

  // Count alarm stops
  const alarmCount = plan.stops.filter((s) => s.alarmSeverity).length;

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div
              className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
              style={{ color: '#B45309' }}
            >
              Act 3 &middot; Production Operations
            </div>
            <h1
              className="text-2xl font-extrabold"
              style={{ color: '#F1F5F9' }}
            >
              Field Route Planner
            </h1>
            <p
              className="text-[12px] mt-1"
              style={{ color: '#94A3B8' }}
            >
              {plan.date} &middot; {plan.regionName}
            </p>
          </div>
          <RepSelector
            foremen={foremen}
            selected={selectedForeman}
            onChange={setSelectedForeman}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: '#1E2530', border: '1px solid #334155' }}
        >
          <div
            className="text-[9px] uppercase tracking-wider font-mono"
            style={{ color: '#94A3B8' }}
          >
            Total Miles
          </div>
          <div
            className="text-xl font-bold mt-0.5"
            style={{ color: '#F1F5F9' }}
          >
            {plan.totalMiles}
            <span
              className="text-xs font-normal ml-1"
              style={{ color: '#64748B' }}
            >
              mi
            </span>
          </div>
        </div>
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: '#1E2530', border: '1px solid #334155' }}
        >
          <div
            className="text-[9px] uppercase tracking-wider font-mono"
            style={{ color: '#94A3B8' }}
          >
            Duration
          </div>
          <div
            className="text-xl font-bold mt-0.5"
            style={{ color: '#F1F5F9' }}
          >
            {plan.totalDuration}
          </div>
        </div>
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: '#1E2530', border: '1px solid #334155' }}
        >
          <div
            className="text-[9px] uppercase tracking-wider font-mono"
            style={{ color: '#94A3B8' }}
          >
            Stops
          </div>
          <div
            className="text-xl font-bold mt-0.5"
            style={{ color: '#F1F5F9' }}
          >
            {plan.stops.length}
            {alarmCount > 0 && (
              <span
                className="text-xs font-bold ml-2 px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(220,38,38,0.15)',
                  color: '#EF4444',
                }}
              >
                {alarmCount} alarm{alarmCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: '#1E2530', border: '1px solid #334155' }}
        >
          <div
            className="text-[9px] uppercase tracking-wider font-mono"
            style={{ color: '#94A3B8' }}
          >
            Truck #
          </div>
          <div
            className="text-xl font-bold mt-0.5 font-mono"
            style={{ color: '#F1F5F9' }}
          >
            {plan.truckNumber}
          </div>
        </div>
      </div>

      {/* Route optimized badge */}
      <div
        className="rounded-lg px-4 py-2.5 mb-5 flex items-center justify-between flex-wrap gap-2"
        style={{
          background: 'rgba(22,163,74,0.06)',
          border: '1px solid rgba(22,163,74,0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold" style={{ color: '#16A34A' }}>
            Route Optimized
          </span>
          <span className="text-[11px]" style={{ color: '#94A3B8' }}>
            AI-sequenced for minimum drive time between wells
          </span>
        </div>
        <div
          className="flex items-center gap-3 text-[11px] font-mono"
          style={{ color: '#64748B' }}
        >
          <span>{plan.route}</span>
          <span>{plan.totalMiles} mi</span>
        </div>
      </div>

      {/* Three-Column Layout */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        style={{ minHeight: 600 }}
      >
        {/* Left: Route Map + Mobile toggle */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div
            className="rounded-xl p-3 sticky top-4"
            style={{ background: '#1E2530', border: '1px solid #334155' }}
          >
            <div
              className="text-[10px] uppercase tracking-wider font-mono mb-2"
              style={{ color: '#64748B' }}
            >
              Route Map &middot; {plan.regionName.split('(')[0].trim()}
            </div>
            <RouteMap
              stops={plan.stops}
              activeStop={activeStopId}
              onStopClick={handleStopClick}
              onStopHover={handleStopHover}
            />
          </div>

          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowMobile(true)}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-mono transition-all hover:border-amber-700/40"
            style={{
              background: '#1E2530',
              border: '1px solid #334155',
              color: '#94A3B8',
            }}
          >
            <span className="text-base">&#128241;</span>
            <span>Foreman Mobile View</span>
          </button>
        </div>

        {/* Center: Stop Cards */}
        <div className="lg:col-span-4 xl:col-span-4">
          <div
            className="text-[10px] uppercase tracking-wider font-mono mb-2"
            style={{ color: '#64748B' }}
          >
            Stops ({plan.stops.length})
          </div>
          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {plan.stops.map((stop) => (
              <StopCard
                key={stop.id}
                stop={stop}
                isActive={activeStopId === stop.id}
                onClick={() => handleStopClick(stop.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="lg:col-span-4 xl:col-span-5">
          {activeStop ? (
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-mono mb-2"
                style={{ color: '#64748B' }}
              >
                Stop Detail
              </div>
              <div
                className="rounded-xl p-5"
                style={{
                  background: '#1E2530',
                  border: '1px solid #334155',
                }}
              >
                {/* Stop header */}
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: '#B4530920',
                      color: '#B45309',
                    }}
                  >
                    {activeStop.sequence}
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-[15px] font-bold"
                      style={{ color: '#F1F5F9' }}
                    >
                      {activeStop.wellName}
                    </div>
                    <div
                      className="text-[11px] mt-0.5"
                      style={{ color: '#94A3B8' }}
                    >
                      {activeStop.arrivalTime} &middot;{' '}
                      {activeStop.duration} min &middot;{' '}
                      {activeStop.type.replace(/-/g, ' ')}
                    </div>
                  </div>
                  {activeStop.alarmSeverity && (
                    <div
                      className="shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded"
                      style={{
                        background:
                          activeStop.alarmSeverity === 'critical'
                            ? 'rgba(220,38,38,0.2)'
                            : 'rgba(217,119,6,0.2)',
                        color:
                          activeStop.alarmSeverity === 'critical'
                            ? '#EF4444'
                            : '#F59E0B',
                      }}
                    >
                      {activeStop.alarmSeverity}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div
                  className="text-[10px] font-mono mb-4 pl-11"
                  style={{ color: '#64748B' }}
                >
                  {activeStop.address}
                </div>

                {/* Tab content */}
                <DetailPanel
                  stop={activeStop}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-24">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#252B36' }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="text-sm" style={{ color: '#64748B' }}>
                Select a stop
              </div>
              <div
                className="text-[11px] mt-1 max-w-[200px]"
                style={{ color: '#475569' }}
              >
                Click any stop on the map or list to view field tasks,
                production data, and AI intelligence
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showMobile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMobile(false);
          }}
        >
          <div className="relative">
            <button
              onClick={() => setShowMobile(false)}
              className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
              style={{
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
              }}
            >
              &#10005;
            </button>
            <MobilePreview
              plan={plan}
              activeStopId={activeStopId}
            />
          </div>
        </div>
      )}
    </>
  );
}
