'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import type { RouteStop, AISuggestion } from '@/lib/swic/data/proofline-route-data';
import type { CalculationResult } from '@/lib/swic/engine/types';
import { useSwipe } from '@/hooks/useSwipe';

interface CommissionBarProps {
  activeStop: RouteStop;
  result: CalculationResult | null;
  baselineCommission: number;
  addedSuggestions: Record<string, string[]>;
  onAddSuggestion: (stopId: string, suggestionId: string) => void;
  onAcceptAll: (stopId: string) => void;
  tierProgress: number;
  tierLabel: string;
}

export function CommissionBar({
  activeStop,
  result,
  baselineCommission,
  addedSuggestions,
  onAddSuggestion,
  onAcceptAll,
  tierProgress,
  tierLabel,
}: CommissionBarProps) {
  const totalCommission = result?.totalCommission ?? 0;
  const delta = totalCommission - baselineCommission;
  const stopSuggestions = activeStop.aiSuggestions;
  const acceptedIds = addedSuggestions[activeStop.id] ?? [];
  const unacceptedSuggestions = stopSuggestions.filter((s) => !acceptedIds.includes(s.id));
  const hasUnaccepted = unacceptedSuggestions.length > 0;

  // Animated count-up
  const [displayCommission, setDisplayCommission] = useState(totalCommission);
  const flashKeyRef = useRef(0);
  const [flashKey, setFlashKey] = useState(0);
  const prevCommission = useRef(totalCommission);

  useEffect(() => {
    if (totalCommission !== prevCommission.current) {
      const start = prevCommission.current;
      const end = totalCommission;
      const duration = 600;
      const startTime = Date.now();

      flashKeyRef.current += 1;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayCommission(start + (end - start) * eased);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setFlashKey(flashKeyRef.current);
        }
      };
      requestAnimationFrame(animate);
      prevCommission.current = end;
    }
  }, [totalCommission]);

  return (
    <div
      className="flex-shrink-0 px-3 py-1.5"
      style={{
        background: 'var(--pl-bar-bg)',
        borderTop: '1px solid var(--pl-bar-border)',
        backdropFilter: 'blur(12px)',
        height: 96,
      }}
    >
      <div className="flex items-center gap-3 h-full">
        {/* AI Suggestion Cards (scrollable) */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar overscroll-contain min-w-0">
          {stopSuggestions.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'var(--pl-surface)', border: '1px solid var(--pl-surface-border)' }}>
              <PackageIcon className="w-3.5 h-3.5" style={{ color: 'var(--pl-text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>
                {activeStop.type === 'warehouse' ? 'Load-out stop — no sales at warehouse' : 'No AI suggestions for this stop'}
              </span>
            </div>
          ) : (
            <>
              {stopSuggestions.map((sug) => {
                const isAccepted = acceptedIds.includes(sug.id);
                return (
                  <SuggestionCard
                    key={sug.id}
                    suggestion={sug}
                    isAccepted={isAccepted}
                    onAdd={() => onAddSuggestion(activeStop.id, sug.id)}
                  />
                );
              })}

              {/* Accept All button */}
              {hasUnaccepted && unacceptedSuggestions.length > 1 && (
                <button
                  onClick={() => onAcceptAll(activeStop.id)}
                  className="tap-active flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #C6A052, #a8842e)',
                    color: '#0a0f1e',
                    boxShadow: '0 2px 12px rgba(198, 160, 82, 0.3)',
                    minHeight: 36,
                  }}
                >
                  <Zap className="w-3 h-3" />
                  Accept All
                </button>
              )}
            </>
          )}
        </div>

        {/* Day Total Card */}
        <div
          className="flex-shrink-0 rounded-xl px-3 py-1.5 text-center"
          style={{
            background: 'var(--pl-gold-bg)',
            border: '1px solid var(--pl-gold-border)',
            minWidth: 160,
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--pl-text-muted)' }}>
            Day Total Commission
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <span
              key={flashKey}
              className="text-2xl font-black font-mono animate-commission-flash"
              style={{ color: 'var(--pl-gold)' }}
            >
              ${displayCommission.toFixed(2)}
            </span>
          </div>
          {delta > 0 && (
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" style={{ color: '#22c55e' }} />
              <span className="text-[10px] font-mono font-bold" style={{ color: '#22c55e' }}>
                +${delta.toFixed(2)} from AI
              </span>
            </div>
          )}

          {/* Tier progress bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[8px]" style={{ color: 'var(--pl-text-muted)' }}>{tierLabel}</span>
              <span className="text-[8px] font-mono font-bold" style={{ color: 'var(--pl-gold)' }}>
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
      </div>
    </div>
  );
}

/* ── Package icon (inline SVG) ──────────────────────────── */
function PackageIcon(props: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

/* ── Suggestion Card with swipe-to-accept ──────────────── */

function SuggestionCard({
  suggestion,
  isAccepted,
  onAdd,
}: {
  suggestion: AISuggestion;
  isAccepted: boolean;
  onAdd: () => void;
}) {
  const [justAccepted, setJustAccepted] = useState(false);
  const [swiping, setSwiping] = useState(false);

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (isAccepted) return;
      setSwiping(true);
      setTimeout(() => {
        onAdd();
        setSwiping(false);
        setJustAccepted(true);
        setTimeout(() => setJustAccepted(false), 600);
      }, 300);
    },
    threshold: 40,
  });

  const handleClick = () => {
    if (isAccepted) return;
    onAdd();
    setJustAccepted(true);
    setTimeout(() => setJustAccepted(false), 600);
  };

  return (
    <div
      className={`flex-shrink-0 rounded-xl px-3 py-2 transition-all duration-300 ${swiping ? 'animate-swipe-accept' : ''}`}
      style={{
        background: isAccepted ? 'var(--pl-accepted-bg)' : 'var(--pl-card-bg)',
        border: isAccepted
          ? '1px solid var(--pl-accepted-border)'
          : '1px solid var(--pl-card-border)',
        minWidth: 220,
        maxWidth: 260,
      }}
      {...swipeHandlers}
    >
      {/* Reasoning (source) */}
      <div className="flex items-start gap-1.5 mb-1.5">
        <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--pl-gold)' }} />
        <p className="text-[9px] leading-tight" style={{ color: 'var(--pl-text-secondary)' }}>
          {suggestion.reasoning.length > 80
            ? suggestion.reasoning.slice(0, 80) + '...'
            : suggestion.reasoning}
        </p>
      </div>

      {/* Product + Cases */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold truncate" style={{ color: 'var(--pl-text)' }}>
            {suggestion.product}
          </p>
          <p className="text-[9px]" style={{ color: 'var(--pl-text-muted)' }}>
            {suggestion.cases}cs &middot; <span className="text-[9px] font-mono">{suggestion.source}</span>
          </p>
        </div>

        {/* Commission delta + button */}
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <span className="text-xs font-mono font-black" style={{ color: 'var(--pl-gold)' }}>
            +${suggestion.commissionDelta}
          </span>
          <button
            onClick={handleClick}
            disabled={isAccepted}
            className="tap-active flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all"
            style={{
              background: isAccepted
                ? 'var(--pl-accepted-bg)'
                : 'var(--pl-gold-bg)',
              color: isAccepted ? '#22c55e' : 'var(--pl-gold)',
              border: isAccepted
                ? '1px solid var(--pl-accepted-border)'
                : '1px solid var(--pl-gold-border)',
              minHeight: 44,
              minWidth: 44,
              cursor: isAccepted ? 'default' : 'pointer',
            }}
          >
            {isAccepted ? (
              <Check className="w-3 h-3" />
            ) : justAccepted ? (
              <span className="animate-sparkle">
                <Sparkles className="w-3 h-3" />
              </span>
            ) : (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="hidden xl:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
