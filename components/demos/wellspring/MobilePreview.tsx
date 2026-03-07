'use client';

import { Signal, BatteryFull, Gauge, Flame, Droplets } from 'lucide-react';
import type { DayPlan, StopType } from '@/data/wellspring/day-plans';

interface MobilePreviewProps {
  plan: DayPlan;
  activeStopId: string | null;
}

const TYPE_COLORS: Record<StopType, string> = {
  'yard-departure': '#6B7280',
  'producing-well': '#16A34A',
  'alarm-response': '#DC2626',
  'tank-battery': '#EA580C',
  'chemical-injection': '#2563EB',
  'new-completion': '#7C3AED',
  'permit-site': '#C2A04E',
  'workover': '#D97706',
  'drive-by': '#9CA3AF',
  'yard-return': '#6B7280',
};

export function MobilePreview({ plan, activeStopId }: MobilePreviewProps) {
  const activeStop = activeStopId
    ? plan.stops.find((s) => s.id === activeStopId) ?? null
    : null;

  const activeIndex = activeStop
    ? plan.stops.findIndex((s) => s.id === activeStopId)
    : -1;

  const nextStops = activeIndex >= 0
    ? plan.stops.slice(activeIndex + 1, activeIndex + 3)
    : plan.stops.slice(0, 2);

  return (
    <div className="relative mx-auto" style={{ width: 260, height: 540 }}>
      {/* iPhone frame */}
      <div
        className="absolute inset-0 rounded-[36px] border-2 overflow-hidden"
        style={{ background: '#1A1D23', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-2xl z-10" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-[8px] pb-1 text-[10px] text-white/60 relative z-0">
          <span className="font-medium">06:42</span>
          <div className="flex items-center gap-1">
            <Signal size={10} />
            <span className="text-[9px]">LTE</span>
            <BatteryFull size={12} />
          </div>
        </div>

        {/* App header */}
        <div className="px-4 pt-4 pb-2">
          <div className="text-[10px] uppercase tracking-wider font-mono" style={{ color: '#B45309' }}>
            WELLSPRING Mobile
          </div>
          <div className="text-sm font-semibold text-white mt-0.5">
            {plan.foremanName}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px]" style={{ color: '#64748B' }}>
              Route {plan.route}
            </span>
            <span className="text-[10px]" style={{ color: '#64748B' }}>
              Truck {plan.truckNumber}
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="px-4 flex-1">
          {activeStop ? (
            <>
              {/* Current stop card */}
              <div
                className="rounded-xl p-3 mt-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Type badge + time */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: `${TYPE_COLORS[activeStop.type]}20`,
                      color: TYPE_COLORS[activeStop.type],
                    }}
                  >
                    {activeStop.type.replace(/-/g, ' ')}
                  </span>
                  <span className="text-[10px] text-white/40">{activeStop.arrivalTime}</span>
                  {activeStop.alarmSeverity && (
                    <span
                      className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                      style={{
                        background: activeStop.alarmSeverity === 'critical' ? 'rgba(220,38,38,0.2)' : 'rgba(217,119,6,0.2)',
                        color: activeStop.alarmSeverity === 'critical' ? '#EF4444' : '#F59E0B',
                      }}
                    >
                      {activeStop.alarmSeverity}
                    </span>
                  )}
                </div>

                {/* Well name */}
                <div className="text-sm font-bold text-white mb-2">{activeStop.wellName}</div>

                {/* Mini SCADA readings */}
                {activeStop.scadaReadings && (
                  <div className="mb-2">
                    <div className="text-[8px] uppercase tracking-wider mb-1 font-mono flex items-center gap-1" style={{ color: '#64748B' }}>
                      <Gauge size={7} /> SCADA
                    </div>
                    <div className="flex gap-2">
                      {activeStop.scadaReadings.pressure !== undefined && (
                        <div className="rounded px-1.5 py-1" style={{ background: '#1E2530' }}>
                          <div className="text-[7px]" style={{ color: '#64748B' }}>PSI</div>
                          <div className="text-[10px] font-bold text-white">{activeStop.scadaReadings.pressure}</div>
                        </div>
                      )}
                      {activeStop.scadaReadings.temperature !== undefined && (
                        <div className="rounded px-1.5 py-1" style={{ background: '#1E2530' }}>
                          <div className="text-[7px]" style={{ color: '#64748B' }}>TEMP</div>
                          <div className="text-[10px] font-bold text-white">{activeStop.scadaReadings.temperature}°F</div>
                        </div>
                      )}
                      {activeStop.scadaReadings.flowRate !== undefined && (
                        <div className="rounded px-1.5 py-1" style={{ background: '#1E2530' }}>
                          <div className="text-[7px]" style={{ color: '#64748B' }}>FLOW</div>
                          <div className="text-[10px] font-bold text-white">{activeStop.scadaReadings.flowRate}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mini production data */}
                {activeStop.productionData && (
                  <div className="flex gap-2 text-[10px]">
                    {activeStop.productionData.oilBpd !== undefined && (
                      <span className="flex items-center gap-0.5">
                        <Flame size={8} style={{ color: '#16A34A' }} />
                        <span className="font-bold text-white">{activeStop.productionData.oilBpd}</span>
                        <span style={{ color: '#64748B' }}>bopd</span>
                      </span>
                    )}
                    {activeStop.productionData.waterCut !== undefined && (
                      <span className="flex items-center gap-0.5">
                        <Droplets size={8} style={{ color: '#2563EB' }} />
                        <span className="font-bold text-white">{(activeStop.productionData.waterCut * 100).toFixed(0)}%</span>
                        <span style={{ color: '#64748B' }}>WC</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Next stops */}
              {nextStops.length > 0 && (
                <div className="mt-3">
                  <div className="text-[8px] uppercase tracking-wider font-mono mb-1.5" style={{ color: '#64748B' }}>
                    Up Next
                  </div>
                  <div className="space-y-1.5">
                    {nextStops.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: TYPE_COLORS[s.type] }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-medium text-white/80 truncate">{s.wellName}</div>
                          <div className="text-[8px]" style={{ color: '#64748B' }}>
                            {s.type.replace(/-/g, ' ')}
                          </div>
                        </div>
                        <div className="text-[9px] shrink-0" style={{ color: '#94A3B8' }}>
                          {s.arrivalTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <Gauge size={24} style={{ color: '#475569' }} />
              </div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Select a stop</div>
              <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
                Tap a well on the map to preview
              </div>
            </div>
          )}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-white/20" />
      </div>
    </div>
  );
}
