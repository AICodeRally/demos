'use client';

import { AlertTriangle, Camera, CheckCircle2, Circle, Clock, Droplets, Flame, MapPin, Thermometer, Gauge } from 'lucide-react';
import type { Stop, StopType } from '@/data/wellspring/day-plans';

interface StopCardProps {
  stop: Stop;
  isActive: boolean;
  onClick: () => void;
}

const STOP_COLORS: Record<StopType, string> = {
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

export function StopCard({ stop, isActive, onClick }: StopCardProps) {
  const borderColor = STOP_COLORS[stop.type];
  const firstInsight = stop.aiInsights[0];

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg transition-all duration-200"
      style={{
        background: isActive ? '#252B36' : '#1E2530',
        border: '1px solid',
        borderColor: isActive ? `${borderColor}60` : '#334155',
        borderLeft: `3px solid ${borderColor}`,
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Sequence number */}
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `${borderColor}20`, color: borderColor }}
        >
          {stop.sequence}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ background: `${borderColor}20`, color: borderColor }}
            >
              {stop.type.replace(/-/g, ' ')}
            </span>
            {stop.alarmSeverity === 'critical' && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 flex items-center gap-0.5">
                <AlertTriangle size={8} />
                CRITICAL
              </span>
            )}
            {stop.alarmSeverity === 'warning' && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-400 flex items-center gap-0.5">
                <AlertTriangle size={8} />
                WARNING
              </span>
            )}
          </div>
          <div className="text-sm font-semibold mt-1 truncate" style={{ color: '#F1F5F9' }}>
            {stop.wellName}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
              <MapPin size={10} />
              {stop.address.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Time + duration */}
        <div className="shrink-0 text-right">
          <div className="text-xs flex items-center gap-1 justify-end" style={{ color: '#CBD5E1' }}>
            <Clock size={10} />
            {stop.arrivalTime}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: '#64748B' }}>
            {stop.duration} min
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: isActive ? 400 : 0, opacity: isActive ? 1 : 0 }}
      >
        <div className="px-4 pb-3 pt-2" style={{ borderTop: '1px solid #334155' }}>
          {/* SCADA Readings */}
          {stop.scadaReadings && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1" style={{ color: '#64748B' }}>
                <Gauge size={9} />
                SCADA Readings
              </div>
              <div className="grid grid-cols-3 gap-2">
                {stop.scadaReadings.pressure !== undefined && (
                  <div className="rounded px-2 py-1.5" style={{ background: '#1A1D23' }}>
                    <div className="text-[8px] uppercase" style={{ color: '#64748B' }}>Pressure</div>
                    <div className="text-xs font-bold" style={{ color: '#F1F5F9' }}>
                      {stop.scadaReadings.pressure} <span className="text-[9px] font-normal" style={{ color: '#94A3B8' }}>psi</span>
                    </div>
                  </div>
                )}
                {stop.scadaReadings.temperature !== undefined && (
                  <div className="rounded px-2 py-1.5" style={{ background: '#1A1D23' }}>
                    <div className="text-[8px] uppercase flex items-center gap-0.5" style={{ color: '#64748B' }}>
                      <Thermometer size={7} />Temp
                    </div>
                    <div className="text-xs font-bold" style={{ color: '#F1F5F9' }}>
                      {stop.scadaReadings.temperature} <span className="text-[9px] font-normal" style={{ color: '#94A3B8' }}>°F</span>
                    </div>
                  </div>
                )}
                {stop.scadaReadings.flowRate !== undefined && (
                  <div className="rounded px-2 py-1.5" style={{ background: '#1A1D23' }}>
                    <div className="text-[8px] uppercase" style={{ color: '#64748B' }}>Flow Rate</div>
                    <div className="text-xs font-bold" style={{ color: '#F1F5F9' }}>
                      {stop.scadaReadings.flowRate} <span className="text-[9px] font-normal" style={{ color: '#94A3B8' }}>bpd</span>
                    </div>
                  </div>
                )}
              </div>
              {stop.scadaReadings.status && stop.scadaReadings.status !== 'normal' && (
                <div
                  className="text-[9px] font-bold uppercase tracking-wider mt-1.5 px-2 py-0.5 rounded inline-block"
                  style={{
                    background: stop.scadaReadings.status === 'alarm' ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)',
                    color: stop.scadaReadings.status === 'alarm' ? '#EF4444' : '#F59E0B',
                  }}
                >
                  Status: {stop.scadaReadings.status}
                </div>
              )}
            </div>
          )}

          {/* Production Data */}
          {stop.productionData && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-wider font-mono mb-1.5 flex items-center gap-1" style={{ color: '#64748B' }}>
                <Flame size={9} />
                Production
              </div>
              <div className="flex gap-3 text-[11px]">
                {stop.productionData.oilBpd !== undefined && (
                  <span style={{ color: '#16A34A' }}>
                    <span className="font-bold">{stop.productionData.oilBpd}</span>
                    <span className="text-[9px] ml-0.5" style={{ color: '#94A3B8' }}>bopd</span>
                  </span>
                )}
                {stop.productionData.gasMcfd !== undefined && (
                  <span style={{ color: '#EA580C' }}>
                    <span className="font-bold">{stop.productionData.gasMcfd}</span>
                    <span className="text-[9px] ml-0.5" style={{ color: '#94A3B8' }}>Mcfd</span>
                  </span>
                )}
                {stop.productionData.waterCut !== undefined && (
                  <span className="flex items-center gap-0.5" style={{ color: '#2563EB' }}>
                    <Droplets size={9} />
                    <span className="font-bold">{(stop.productionData.waterCut * 100).toFixed(0)}%</span>
                    <span className="text-[9px]" style={{ color: '#94A3B8' }}>WC</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Field Actions Checklist */}
          {stop.fieldActions.length > 0 && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-wider font-mono mb-1.5" style={{ color: '#64748B' }}>
                Field Actions
              </div>
              <div className="space-y-1">
                {stop.fieldActions.map((fa, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                    {fa.completed ? (
                      <CheckCircle2 size={12} className="shrink-0 mt-px" style={{ color: '#16A34A' }} />
                    ) : (
                      <Circle size={12} className="shrink-0 mt-px" style={{ color: '#475569' }} />
                    )}
                    <span style={{ color: fa.completed ? '#64748B' : '#CBD5E1' }}>
                      {fa.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First AI Insight */}
          {firstInsight && (
            <div
              className="rounded-md p-2 text-[11px] mb-2"
              style={{
                background: firstInsight.priority === 'high'
                  ? 'rgba(220, 38, 38, 0.1)'
                  : firstInsight.priority === 'medium'
                    ? 'rgba(217, 119, 6, 0.1)'
                    : 'rgba(37, 99, 235, 0.1)',
                borderLeft: `2px solid ${
                  firstInsight.priority === 'high'
                    ? '#DC2626'
                    : firstInsight.priority === 'medium'
                      ? '#D97706'
                      : '#2563EB'
                }`,
              }}
            >
              <span style={{ color: '#CBD5E1' }}>{firstInsight.insight}</span>
              <span className="text-[9px] ml-1.5 uppercase" style={{ color: '#64748B' }}>
                via {firstInsight.source}
              </span>
            </div>
          )}

          {/* Photo Required */}
          {stop.photoRequired && (
            <div className="flex items-center gap-1 text-[10px]" style={{ color: '#C2A04E' }}>
              <Camera size={10} />
              <span className="font-medium uppercase tracking-wider">Photo Required</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
