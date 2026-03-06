'use client';

import { useState } from 'react';
import { HeartPulse, X, RefreshCw, TrendingUp, TrendingDown, Minus, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { healthDimensions, healthAlerts } from '@/data/equipr/ai-platform';
import type { HealthDimension } from '@/data/equipr/ai-platform';
import { useAIWidgets } from './AIWidgetProvider';
import { cn } from '@/lib/utils';

const OVERALL_SCORE = 94;

const severityStyles = {
  critical: { border: '#EF4444', icon: AlertTriangle, iconColor: 'text-red-500', bg: 'bg-red-50' },
  warning: { border: '#F59E0B', icon: AlertCircle, iconColor: 'text-amber-500', bg: 'bg-amber-50' },
  info: { border: '#3B82F6', icon: Info, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-500',
  stable: 'text-gray-400',
};

export function OpsOrb({ panelOnly }: { panelOnly?: boolean } = {}) {
  const { state, toggleOps, closeAll } = useAIWidgets();
  const isOpen = state.opsOpen;

  const [alerts, setAlerts] = useState([...healthAlerts]);
  const [refreshing, setRefreshing] = useState(false);

  const handleAcknowledge = (idx: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <>
      {/* Orb button */}
      {!panelOnly && !isOpen && (
        <button
          onClick={toggleOps}
          className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          }}
          title="Fleet Health"
        >
          <HeartPulse className="h-5 w-5 text-white" />
          {/* Score badge */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#7C3AED] shadow">
            {OVERALL_SCORE}
          </span>
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[45] bg-black/40 backdrop-blur-sm" onClick={closeAll} />
      )}

      {/* Modal panel */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl shadow-2xl transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
        style={{ background: 'var(--prizym-card-bg, #FFFFFF)', border: '1px solid var(--prizym-border-default, #E5E7EB)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl px-5 py-3"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Fleet Health</span>
            </div>
            <span className="text-[11px] text-white/70">OpsChief Monitoring</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
            </button>
            <button
              onClick={toggleOps}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Overall score */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(OVERALL_SCORE / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#2d3142]">{OVERALL_SCORE}</span>
                <span className="text-[10px] text-gray-400">/100</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2d3142]">Fleet Health Score</h3>
              <p className="text-sm text-gray-500">Composite of 6 operational dimensions</p>
              <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-green-600">
                <TrendingUp className="h-3.5 w-3.5" />
                +3 pts from last month
              </div>
            </div>
          </div>

          {/* Health dimensions */}
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Dimensions</h4>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {healthDimensions.map((dim) => (
              <DimensionCard key={dim.name} dim={dim} />
            ))}
          </div>

          {/* Alerts */}
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Active Alerts ({alerts.length})
          </h4>
          <div className="space-y-2">
            {alerts.length === 0 && (
              <div className="text-center py-6 text-sm text-gray-400">
                All alerts acknowledged
              </div>
            )}
            {alerts.map((alert, idx) => {
              const sev = severityStyles[alert.severity];
              const SevIcon = sev.icon;
              return (
                <div
                  key={`${alert.title}-${idx}`}
                  className="flex items-start gap-3 rounded-lg border p-3"
                  style={{ borderLeftWidth: 4, borderLeftColor: sev.border, borderColor: 'var(--prizym-border-default, #E5E7EB)' }}
                >
                  <SevIcon className={cn('h-4 w-4 shrink-0 mt-0.5', sev.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#2d3142]">{alert.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{alert.detail}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{alert.time}</span>
                  </div>
                  <button
                    onClick={() => handleAcknowledge(idx)}
                    className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-[10px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Acknowledge
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Dimension card
// ---------------------------------------------------------------------------

function DimensionCard({ dim }: { dim: HealthDimension }) {
  const TrendIcon = trendIcons[dim.trend];
  const trendColor = trendColors[dim.trend];

  return (
    <div className="rounded-lg border p-3" style={{ borderColor: 'var(--prizym-border-default, #E5E7EB)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-semibold text-[#2d3142]">{dim.name}</span>
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-bold" style={{ color: dim.color }}>
            {dim.score}
          </span>
          <TrendIcon className={cn('h-3 w-3', trendColor)} />
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${dim.score}%`, background: dim.color }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-gray-500 leading-snug">{dim.details}</p>
    </div>
  );
}
