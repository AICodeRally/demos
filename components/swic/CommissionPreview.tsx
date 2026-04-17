'use client';

import { useState } from 'react';
import type { CalculationResult, ClientConfig } from '@/lib/swic/engine/types';
import { formatCurrency } from '@/lib/swic/engine/calculator';
import { ThresholdMeter } from './ThresholdMeter';
import { EarningsBreakdown } from './EarningsBreakdown';
import { ChevronRight, ChevronDown, Info, DollarSign, Zap, TrendingUp, Percent, HelpCircle } from 'lucide-react';

interface CommissionPreviewProps {
  config: ClientConfig;
  result: CalculationResult | null;
  repName?: string;
  pulseKey?: number;
  glass?: boolean; // true = light glass style matching page; false = dark branded (widget)
}

const RULE_ICONS: Record<string, { icon: typeof DollarSign; color: string }> = {
  percent_of: { icon: Percent, color: '#6366f1' },
  fixed_per_match: { icon: Zap, color: '#f59e0b' },
  tiered: { icon: TrendingUp, color: '#22c55e' },
  lookup: { icon: DollarSign, color: '#3b82f6' },
  multiplier: { icon: DollarSign, color: '#a855f7' },
  placeholder: { icon: HelpCircle, color: '#64748b' },
};

function ClientLogo({ config, glass }: { config: ClientConfig; glass?: boolean }) {
  const theme = config.theme;
  const accent = theme?.accent ?? '#6366f1';
  if (config.logo === 'mattress-firm') {
    return (
      <div className="text-3xl font-black tracking-tight mb-1">
        <span style={{ color: accent }}>SUMMIT</span>
        <span className="font-normal" style={{ color: glass ? 'var(--page-text)' : (theme?.text ?? '#fff') }}>SLEEP</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 mb-1">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
        style={{ background: `linear-gradient(135deg, ${accent}, ${theme?.primary ?? '#14141f'})` }}
      >
        {config.name.charAt(0)}
      </div>
      <span className="text-2xl font-bold" style={{ color: glass ? 'var(--page-text)' : undefined }}>{config.name}</span>
    </div>
  );
}

export function CommissionPreview({ config, result, repName, pulseKey, glass }: CommissionPreviewProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [notesCollapsed, setNotesCollapsed] = useState(true);

  const theme = config.theme;
  const accent = theme?.accent ?? '#6366f1';
  const totalComm = result?.totalCommission ?? 0;

  // Glass mode: light background with accent highlights
  // Dark mode: branded gradient background (for widget/POS embed)
  const cardBg = glass
    ? 'var(--glass-bg)'
    : (theme ? `linear-gradient(180deg, ${theme.primary} 0%, ${theme.background} 100%)` : 'linear-gradient(180deg, #1a1b4b 0%, #12133a 100%)');
  const cardColor = glass ? 'var(--page-text)' : (theme?.text ?? '#ffffff');
  const innerBg = glass ? 'var(--glass-bg)' : `${theme?.primary ?? '#1a1b4b'}80`;
  const mutedColor = glass ? 'var(--page-muted)' : undefined;
  const zeroDim = glass ? 'var(--page-muted)' : 'rgba(255,255,255,0.4)';
  const placeholderBorder = glass ? '3px dashed var(--glass-border)' : '3px dashed rgba(255,255,255,0.15)';

  return (
    <>
      <div
        className={`rounded-2xl overflow-hidden ${glass ? 'glass' : ''}`}
        style={{
          background: cardBg,
          color: cardColor,
          boxShadow: glass ? `0 4px 24px ${accent}12` : `0 8px 40px ${accent}20`,
          border: glass ? `1px solid var(--glass-border)` : undefined,
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4 text-center relative overflow-hidden">
          {/* Subtle gradient glow behind logo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${accent}15 0%, transparent 60%)`,
            }}
          />
          <div className="relative">
            <ClientLogo config={config} glass={glass} />
            <h2 className="text-lg font-bold">Estimated Ticket Summary</h2>
            {repName && <p className="text-sm mt-0.5" style={{ color: mutedColor, opacity: glass ? 1 : 0.6 }}>{repName}</p>}
          </div>
        </div>

        {/* Notes — collapsible */}
        {config.notes && config.notes.length > 0 && (
          <div className="mx-4 mb-3">
            <button
              onClick={() => setNotesCollapsed(!notesCollapsed)}
              className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity px-1"
              style={{ color: mutedColor, opacity: glass ? 1 : 0.5 }}
            >
              <Info className="w-3 h-3" />
              {config.notes.length} note{config.notes.length > 1 ? 's' : ''}
              <ChevronDown
                className="w-3 h-3 transition-transform duration-200"
                style={{ transform: notesCollapsed ? 'rotate(0)' : 'rotate(180deg)' }}
              />
            </button>
            {!notesCollapsed && (
              <div className="mt-2 space-y-2 animate-fade-in-up">
                {config.notes.map((note, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg text-xs flex items-start gap-2"
                    style={{
                      backgroundColor: glass ? `${accent}08` : `${theme?.secondary ?? '#c8cad8'}20`,
                      color: glass ? 'var(--page-muted)' : (theme?.secondary ?? '#c8cad8'),
                    }}
                  >
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" />
                    <span className="opacity-80">{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Commission Components + Total */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-12 gap-3">
            {/* Left: Component rows */}
            <div className="col-span-7 space-y-2">
              {config.components.map((comp) => {
                const compResult = result?.components.find((r) => r.componentId === comp.id);
                const amount = compResult?.amount ?? 0;
                const isPlaceholder = comp.rule.type === 'placeholder';
                const meta = RULE_ICONS[comp.rule.type] ?? RULE_ICONS.placeholder;
                const Icon = meta.icon;

                return (
                  <div
                    key={comp.id}
                    className={`rounded-xl p-3.5 flex items-center gap-3 transition-all duration-200 ${glass ? 'glass-hover' : ''}`}
                    style={{
                      backgroundColor: innerBg,
                      borderLeft: amount > 0 ? `3px solid ${accent}` : isPlaceholder ? placeholderBorder : '3px solid transparent',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${meta.color}20` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                    </div>
                    <span className="text-sm font-medium flex-1">{comp.label}</span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: amount > 0 ? accent : zeroDim }}
                    >
                      {isPlaceholder && !result ? 'TBD' : formatCurrency(amount)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Total Potential Commission — the HERO */}
            <div className="col-span-5">
              <div
                className="rounded-xl p-5 h-full flex flex-col justify-center items-center text-center relative overflow-hidden"
                style={{
                  backgroundColor: innerBg,
                  border: `1px solid ${accent}30`,
                }}
              >
                {/* Glow behind number */}
                {totalComm > 0 && (
                  <div
                    className="absolute inset-0 animate-glow-pulse pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${accent}20 0%, transparent 70%)`,
                    }}
                  />
                )}
                <div className="relative">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: mutedColor, opacity: glass ? 1 : 0.5 }}>
                    Total Potential Comm.
                  </span>
                  <div
                    key={pulseKey}
                    className={`text-4xl font-mono font-black mt-2 tracking-tight ${totalComm > 0 ? 'animate-commission-pulse' : ''}`}
                    style={{
                      color: totalComm > 0 ? accent : zeroDim,
                    }}
                  >
                    {result ? formatCurrency(totalComm) : '$0.00'}
                  </div>
                  {result && totalComm > 0 && (
                    <button
                      onClick={() => setShowBreakdown(true)}
                      className="text-xs mt-3 flex items-center gap-1 transition-opacity mx-auto"
                      style={{ color: mutedColor, opacity: glass ? 0.8 : 0.6 }}
                    >
                      View details <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  {!result && (
                    <p className="text-xs mt-2" style={{ color: mutedColor, opacity: glass ? 0.6 : 0.3 }}>Add items to see commission</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Threshold Info */}
          {config.thresholds?.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3.5"
                style={{ backgroundColor: innerBg }}
              >
                <span className="text-xs" style={{ color: mutedColor, opacity: glass ? 1 : 0.5 }}>{config.thresholds.label}</span>
                <p className="text-xl font-mono font-bold mt-1">
                  {result?.threshold?.amountToNextTier != null
                    ? formatCurrency(result.threshold.amountToNextTier)
                    : <span style={{ color: mutedColor, opacity: 0.3 }}>--</span>}
                </p>
              </div>
              {config.thresholds.showPotentialAtNextTier && (
                <div
                  className="rounded-xl p-3.5"
                  style={{ backgroundColor: innerBg }}
                >
                  <span className="text-xs" style={{ color: mutedColor, opacity: glass ? 1 : 0.5 }}>
                    {config.thresholds.potentialLabel ?? 'Potential at Next Tier'}
                  </span>
                  <p className="text-xl font-mono font-bold mt-1">
                    {result?.threshold?.potentialAtNextTier != null
                      ? formatCurrency(result.threshold.potentialAtNextTier)
                      : <span style={{ color: mutedColor, opacity: 0.3 }}>--</span>}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Threshold progress bar */}
          {result?.threshold && (
            <ThresholdMeter
              threshold={result.threshold}
              thresholdConfig={config.thresholds!}
              theme={theme}
              accent={accent}
            />
          )}

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-2">
            {config.summaryMetrics.map((metric) => {
              const metricResult = result?.summaryMetrics.find((m) => m.id === metric.id);
              const isMarginPct = metric.basis === 'gross_margin_percent';
              let valueColor = glass ? 'var(--page-text)' : 'inherit';
              if (isMarginPct && metricResult) {
                valueColor = metricResult.value >= 35 ? '#22c55e' : metricResult.value >= 20 ? '#f59e0b' : '#ef4444';
              }
              return (
                <div
                  key={metric.id}
                  className="rounded-xl p-3"
                  style={{ backgroundColor: innerBg }}
                >
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: mutedColor, opacity: glass ? 1 : 0.5 }}>{metric.label}</span>
                  <p className="text-base font-mono font-bold mt-1" style={{ color: metricResult ? valueColor : undefined }}>
                    {metricResult
                      ? metricResult.format === 'currency'
                        ? formatCurrency(metricResult.value)
                        : metricResult.format === 'percent'
                          ? `${metricResult.value.toFixed(1)}%`
                          : metricResult.value.toLocaleString()
                      : <span style={{ color: mutedColor, opacity: 0.3 }}>--</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showBreakdown && result && (
        <EarningsBreakdown config={config} result={result} onClose={() => setShowBreakdown(false)} />
      )}
    </>
  );
}
