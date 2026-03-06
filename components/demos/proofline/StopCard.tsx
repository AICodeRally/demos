'use client';

import { Clock, DollarSign, MapPin, Package } from 'lucide-react';
import type { Stop } from '@/data/proofline/day-plans';

interface StopCardProps {
  stop: Stop;
  isActive: boolean;
  onClick: () => void;
}

const STOP_COLORS: Record<string, string> = {
  'load-out': '#C6A052',
  'key-account': '#2563EB',
  'chain-drop': '#7C3AED',
  'presell': '#B87333',
  'new-account': '#22D3EE',
  'compliance': '#EF4444',
  'problem-resolution': '#F97316',
  'presell-spirits': '#A855F7',
  'merchandising': '#10B981',
  'drive-by': '#6B7280',
  'windshield': '#6B7280',
  'return': '#C6A052',
};

export function StopCard({ stop, isActive, onClick }: StopCardProps) {
  const borderColor = STOP_COLORS[stop.type] ?? '#6B7280';
  const firstManifest = stop.deliveryManifest.slice(0, 3);
  const firstInsight = stop.aiInsights[0];

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg transition-all duration-200"
      style={{
        background: isActive ? '#F8FAFC' : 'white',
        border: '1px solid',
        borderColor: isActive ? `${borderColor}60` : '#E2E8F0',
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
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ background: `${borderColor}20`, color: borderColor }}
            >
              {stop.type.replace(/-/g, ' ')}
            </span>
            {stop.tabcStatus === 'expiring' && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600">
                TABC Expiring
              </span>
            )}
            {stop.tabcStatus === 'flagged' && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/20 text-red-500">
                TABC Flagged
              </span>
            )}
          </div>
          <div className="text-sm font-semibold mt-1 truncate" style={{ color: '#1A1A2E' }}>
            {stop.accountName}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin size={10} />
              {stop.address.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Time + revenue */}
        <div className="shrink-0 text-right">
          <div className="text-xs text-slate-500 flex items-center gap-1 justify-end">
            <Clock size={10} />
            {stop.arrivalTime}
          </div>
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end mt-0.5">
            <DollarSign size={10} className="text-emerald-500" />
            ${stop.revenueOpportunity.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: isActive ? 200 : 0, opacity: isActive ? 1 : 0 }}
      >
        <div className="px-4 pb-3 border-t border-slate-100 pt-2">
          {/* Delivery manifest preview */}
          {firstManifest.length > 0 && (
            <div className="mb-2">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-1 flex items-center gap-1">
                <Package size={9} />
                Delivery Manifest
              </div>
              <div className="flex flex-wrap gap-1.5">
                {firstManifest.map((item) => (
                  <span
                    key={item.sku}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                  >
                    {item.brand} ({item.cases}cs)
                    {item.promo && (
                      <span className="text-amber-600 ml-0.5">*</span>
                    )}
                  </span>
                ))}
                {stop.deliveryManifest.length > 3 && (
                  <span className="text-[10px] text-slate-400">
                    +{stop.deliveryManifest.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* First AI insight */}
          {firstInsight && (
            <div
              className="rounded-md p-2 text-[11px]"
              style={{
                background: firstInsight.priority === 'high'
                  ? 'rgba(239, 68, 68, 0.08)'
                  : firstInsight.priority === 'medium'
                    ? 'rgba(245, 158, 11, 0.08)'
                    : 'rgba(34, 197, 94, 0.08)',
                borderLeft: `2px solid ${
                  firstInsight.priority === 'high'
                    ? '#EF4444'
                    : firstInsight.priority === 'medium'
                      ? '#F59E0B'
                      : '#22C55E'
                }`,
              }}
            >
              <span className="text-slate-600">{firstInsight.insight}</span>
              <span className="text-[9px] text-slate-400 ml-1.5 uppercase">
                via {firstInsight.source}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
