'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, ChevronRight, TrendingUp, Zap, ChevronLeft, MessageCircle } from 'lucide-react';
import type { RouteStop, AISuggestion } from '@/data/routeiq/route-data';
import { STRATEGY_TAG_CONFIG } from '@/data/routeiq/route-data';
import type { CalculationResult } from '@/lib/swic-engine/types';

interface CommissionPanelProps {
  activeStop: RouteStop;
  result: CalculationResult | null;
  baselineCommission: number;
  addedSuggestions: Record<string, string[]>;
  onAddSuggestion: (stopId: string, suggestionId: string) => void;
  onAcceptAll: (stopId: string) => void;
  tierProgress: number;
  tierLabel: string;
  collapsed: boolean;
  onToggle: () => void;
}

export function CommissionPanel({
  activeStop,
  result,
  baselineCommission,
  addedSuggestions,
  onAddSuggestion,
  onAcceptAll,
  tierProgress,
  tierLabel,
  collapsed,
  onToggle,
}: CommissionPanelProps) {
  const totalCommission = result?.totalCommission ?? 0;
  const delta = totalCommission - baselineCommission;
  const stopSuggestions = activeStop.aiSuggestions;
  const acceptedIds = addedSuggestions[activeStop.id] ?? [];
  const unacceptedSuggestions = stopSuggestions.filter((s) => !acceptedIds.includes(s.id));
  const hasUnaccepted = unacceptedSuggestions.length > 0;

  const allAcceptedStrategies = Object.values(addedSuggestions).flat();

  const [displayCommission, setDisplayCommission] = useState(totalCommission);
  const [flashKey, setFlashKey] = useState(0);
  const prevCommission = useRef(totalCommission);

  useEffect(() => {
    if (totalCommission !== prevCommission.current) {
      const start = prevCommission.current;
      const end = totalCommission;
      const duration = 600;
      const startTime = Date.now();
      setFlashKey((k) => k + 1);
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayCommission(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      prevCommission.current = end;
    }
  }, [totalCommission]);

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="tap-active flex-shrink-0 flex flex-col items-center justify-center"
        style={{
          width: 28,
          background: 'var(--pl-bar-bg)',
          borderLeft: '1px solid var(--pl-bar-border)',
        }}
      >
        <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'var(--pl-gold)' }} />
        <span
          className="font-mono font-black mt-1"
          style={{ color: 'var(--pl-gold)', fontSize: '0.75em', writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          ${displayCommission.toFixed(0)}
        </span>
      </button>
    );
  }

  return (
    <div
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        width: 320,
        background: 'var(--pl-bar-bg)',
        borderLeft: '1px solid var(--pl-bar-border)',
        backdropFilter: 'blur(12px)',
        transition: 'width 0.3s ease',
      }}
    >
      <div className="flex items-center justify-between px-3 pt-1.5 pb-1 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--pl-zone-border)' }}>
        <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>
          Commission
        </span>
        <button onClick={onToggle} className="tap-active p-1 rounded-md"
          style={{ background: 'var(--pl-surface)' }}>
          <ChevronRight className="w-3 h-3" style={{ color: 'var(--pl-text-muted)' }} />
        </button>
      </div>

      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--pl-zone-border)' }}>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>
              Day Total
            </p>
            <span
              key={flashKey}
              className="font-black font-mono animate-commission-flash"
              style={{ color: 'var(--pl-gold)', fontSize: '1.5em' }}
            >
              ${displayCommission.toFixed(2)}
            </span>
          </div>
          {delta > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                <span className="font-mono font-bold" style={{ color: '#22c55e', fontSize: '0.85em' }}>
                  +${delta.toFixed(2)}
                </span>
              </div>
              <p className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.65em' }}>
                from AI suggestions
              </p>
            </div>
          )}
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-0.5">
            <span style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>{tierLabel}</span>
            <span className="font-mono font-bold" style={{ color: 'var(--pl-gold)', fontSize: '0.75em' }}>
              {tierProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pl-surface-border)' }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out animate-tier-shimmer"
              style={{ width: `${Math.min(tierProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--pl-zone-border)' }}>
        <p className="font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--pl-text-muted)', fontSize: '0.65em' }}>
          2026 Strategy Impact
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <StrategyMiniCard label="Margin Priority" value="6% target" color="#F59E0B" active={allAcceptedStrategies.length > 0} />
          <StrategyMiniCard label="Mix Shift" value="Craft +15%" color="#a855f7" active={allAcceptedStrategies.length > 0} />
          <StrategyMiniCard label="New Pipeline" value="1 new acct" color="#22c55e" active={true} />
          <StrategyMiniCard label="Placements" value="3 displays" color="#3b82f6" active={allAcceptedStrategies.length > 0} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain px-2 py-2">
        <p className="font-bold uppercase tracking-wider mb-1.5 px-1" style={{ color: 'var(--pl-text-muted)', fontSize: '0.65em' }}>
          Stop {activeStop.sequence} — {activeStop.accountName}
        </p>

        {stopSuggestions.length === 0 ? (
          <div className="rounded-lg p-3" style={{ background: 'var(--pl-surface)', border: '1px solid var(--pl-surface-border)' }}>
            <p style={{ color: 'var(--pl-text-muted)', fontSize: '0.85em' }}>
              {activeStop.type === 'warehouse' ? 'Load-out stop — no sales' : 'No suggestions'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stopSuggestions.map((sug) => {
              const isAccepted = acceptedIds.includes(sug.id);
              return (
                <StrategySuggestionCard
                  key={sug.id}
                  suggestion={sug}
                  isAccepted={isAccepted}
                  onAdd={() => onAddSuggestion(activeStop.id, sug.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {hasUnaccepted && unacceptedSuggestions.length > 1 && (
        <div className="px-3 py-2 flex-shrink-0" style={{ borderTop: '1px solid var(--pl-zone-border)' }}>
          <button
            onClick={() => onAcceptAll(activeStop.id)}
            className="tap-active w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all"
            style={{
              fontSize: '0.85em',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#0a0f1e',
              boxShadow: '0 2px 12px rgba(198, 160, 82, 0.3)',
              minHeight: 36,
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Accept All ({unacceptedSuggestions.length}) — +${unacceptedSuggestions.reduce((s, u) => s + u.commissionDelta, 0)}
          </button>
        </div>
      )}
    </div>
  );
}

function StrategyMiniCard({ label, value, color, active }: {
  label: string;
  value: string;
  color: string;
  active: boolean;
}) {
  return (
    <div
      className="rounded-md px-2 py-1.5"
      style={{
        background: active ? `${color}10` : 'var(--pl-surface)',
        border: `1px solid ${active ? `${color}30` : 'var(--pl-surface-border)'}`,
      }}
    >
      <p className="font-bold uppercase tracking-wider" style={{ color: active ? color : 'var(--pl-text-muted)', fontSize: '0.6em' }}>
        {label}
      </p>
      <p className="font-mono font-bold" style={{ color: active ? color : 'var(--pl-text-muted)', fontSize: '0.8em' }}>
        {value}
      </p>
    </div>
  );
}

function StrategySuggestionCard({
  suggestion,
  isAccepted,
  onAdd,
}: {
  suggestion: AISuggestion;
  isAccepted: boolean;
  onAdd: () => void;
}) {
  const [justAccepted, setJustAccepted] = useState(false);
  const stratConfig = STRATEGY_TAG_CONFIG[suggestion.strategy];

  const handleClick = () => {
    if (isAccepted) return;
    onAdd();
    setJustAccepted(true);
    setTimeout(() => setJustAccepted(false), 600);
  };

  return (
    <div
      className="rounded-lg overflow-hidden transition-all duration-300"
      style={{
        border: isAccepted
          ? '1px solid var(--pl-accepted-border)'
          : '1px solid var(--pl-card-border)',
      }}
    >
      <div
        className="flex items-center justify-between px-2.5 py-1"
        style={{
          background: isAccepted ? 'var(--pl-accepted-bg)' : `${stratConfig.color}12`,
          borderBottom: `1px solid ${isAccepted ? 'var(--pl-accepted-border)' : `${stratConfig.color}25`}`,
        }}
      >
        <div className="flex items-center gap-1">
          <span style={{ fontSize: '0.7em' }}>{stratConfig.icon}</span>
          <span className="font-black uppercase tracking-wider" style={{ color: stratConfig.color, fontSize: '0.6em' }}>
            {stratConfig.label}
          </span>
        </div>
        <span className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.65em' }}>
          {'\u25B2'}{suggestion.marginDelta}% margin
        </span>
      </div>

      <div
        className="px-2.5 py-2"
        style={{ background: isAccepted ? 'var(--pl-accepted-bg)' : 'var(--pl-card-bg)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate" style={{ color: 'var(--pl-text)', fontSize: '0.85em' }}>
              {suggestion.product}
            </p>
            <p className="font-mono" style={{ color: 'var(--pl-text-muted)', fontSize: '0.7em' }}>
              {suggestion.cases}cs · {suggestion.source}
            </p>
          </div>
          <span className="font-mono font-black ml-2 flex-shrink-0" style={{ color: 'var(--pl-gold)', fontSize: '1em' }}>
            +${suggestion.commissionDelta}
          </span>
        </div>

        <div className="flex items-start gap-1.5 mb-1.5">
          <MessageCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--pl-gold)' }} />
          <p className="leading-tight" style={{ color: 'var(--pl-text-secondary)', fontSize: '0.75em' }}>
            {suggestion.coachingPlay.length > 90
              ? suggestion.coachingPlay.slice(0, 90) + '...'
              : suggestion.coachingPlay}
          </p>
        </div>

        <button
          onClick={handleClick}
          disabled={isAccepted}
          className="tap-active w-full flex items-center justify-center gap-1 py-1.5 rounded-md font-bold transition-all"
          style={{
            fontSize: '0.75em',
            background: isAccepted ? 'var(--pl-accepted-bg)' : 'var(--pl-gold-bg)',
            color: isAccepted ? '#22c55e' : 'var(--pl-gold)',
            border: isAccepted ? '1px solid var(--pl-accepted-border)' : '1px solid var(--pl-gold-border)',
            cursor: isAccepted ? 'default' : 'pointer',
            minHeight: 32,
          }}
        >
          {isAccepted ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added to Sale
            </>
          ) : justAccepted ? (
            <span className="animate-sparkle">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          ) : (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              Add to Sale — +${suggestion.commissionDelta}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
