'use client';

import type { ThresholdResult, ThresholdConfig } from '@/lib/swic/engine/types';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { TrendingUp, Zap } from 'lucide-react';

interface ThresholdMeterProps {
  threshold: ThresholdResult;
  thresholdConfig: ThresholdConfig;
  theme?: { primary: string; accent: string; text: string } | null;
  accent?: string;
}

export function ThresholdMeter({ threshold, thresholdConfig, theme, accent: accentProp }: ThresholdMeterProps) {
  const accent = accentProp ?? theme?.accent ?? '#6366f1';

  if (!threshold.nextTierMin || threshold.amountToNextTier === null) {
    return (
      <div
        className="rounded-xl p-3.5"
        style={{
          background: `linear-gradient(135deg, #22c55e15, #22c55e08)`,
          border: '1px solid #22c55e20',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22c55e20' }}>
            <Zap className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
          </div>
          <span className="text-sm font-bold" style={{ color: '#22c55e' }}>Max Tier Reached!</span>
        </div>
        <p className="text-xs mt-1.5" style={{ color: theme?.text ?? '#ffffff', opacity: 0.5 }}>
          Earning at {(threshold.currentRate * 100).toFixed(1)}% — top rate
        </p>
      </div>
    );
  }

  const progress = threshold.nextTierMin > 0
    ? Math.min(100, ((threshold.nextTierMin - threshold.amountToNextTier) / threshold.nextTierMin) * 100)
    : 0;

  return (
    <div
      className="rounded-xl p-3.5"
      style={{ backgroundColor: `${theme?.primary ?? '#1a1b4b'}80` }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
            <TrendingUp className="w-3.5 h-3.5" style={{ color: accent }} />
          </div>
          <span className="text-xs font-bold">Tier Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold" style={{ color: accent }}>
            {(threshold.currentRate * 100).toFixed(1)}%
          </span>
          {threshold.nextTierRate && (
            <>
              <span className="text-xs opacity-30">→</span>
              <span className="text-xs font-mono font-bold opacity-50">
                {(threshold.nextTierRate * 100).toFixed(1)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 0 12px ${accent}40`,
          }}
        />
        {/* Glowing dot at position */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-700 ease-out"
          style={{
            left: `calc(${progress}% - 7px)`,
            backgroundColor: accent,
            borderColor: theme?.primary ?? '#1a1b4b',
            boxShadow: `0 0 8px ${accent}60`,
          }}
        />
      </div>

      {/* Amount to next tier */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs opacity-40">
          {formatCurrency(threshold.amountToNextTier)} to next tier
        </p>
        <p className="text-xs font-mono opacity-30">
          {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
