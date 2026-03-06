'use client';

import { useState } from 'react';
import { Radio, X, ChevronDown, ChevronUp, Check, Clock } from 'lucide-react';
import { pulseCards } from '@/data/equipr/ai-platform';
import type { PulseCardData, PulseUrgency } from '@/data/equipr/ai-platform';
import { useAIWidgets } from './AIWidgetProvider';
import { cn } from '@/lib/utils';

const urgencyColors: Record<PulseUrgency, string> = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#3B82F6',
};

const urgencyBadgeStyles: Record<PulseUrgency, string> = {
  critical: 'text-red-700 bg-red-50 border-red-200',
  high: 'text-orange-700 bg-orange-50 border-orange-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low: 'text-blue-700 bg-blue-50 border-blue-200',
};

type CardStatus = 'active' | 'pursuing' | 'snoozed' | 'dismissed';

interface TrackedCard extends PulseCardData {
  status: CardStatus;
}

export function PulseOrb({ panelOnly }: { panelOnly?: boolean } = {}) {
  const { state, togglePulse } = useAIWidgets();
  const isOpen = state.pulseOpen;

  const [cards, setCards] = useState<TrackedCard[]>(
    pulseCards.map((c) => ({ ...c, status: 'active' as CardStatus }))
  );
  const [toast, setToast] = useState<string | null>(null);

  const activeCards = cards.filter((c) => c.status === 'active' || c.status === 'pursuing');
  const criticalCount = activeCards.filter((c) => c.urgency === 'critical').length;
  const highCount = activeCards.filter((c) => c.urgency === 'high').length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleDismiss = (id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'dismissed' } : c)));
  };

  const handlePursue = (id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'pursuing' } : c)));
  };

  const handleSnooze = (id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'snoozed' } : c)));
    showToast('Snoozed \u2014 will resurface in 4 hours');
  };

  return (
    <>
      {/* Orb button */}
      {!panelOnly && !isOpen && (
        <button
          onClick={togglePulse}
          className="fixed bottom-4 right-20 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)',
          }}
          title="Pulse Insights"
        >
          <Radio className="h-5 w-5 text-white" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#D97706] shadow">
            {activeCards.length}
          </span>
        </button>
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed bottom-14 right-4 z-50 flex w-[420px] flex-col rounded-xl shadow-2xl transition-all duration-300',
          isOpen ? 'h-[560px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ background: 'var(--prizym-card-bg, #FFFFFF)', border: '1px solid var(--prizym-border-default, #E5E7EB)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl px-4 py-3"
          style={{ background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Pulse Insights</span>
            </div>
            <span className="text-[11px] text-white/70">AI-curated fleet alerts</span>
          </div>
          <button
            onClick={togglePulse}
            className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 border-b px-4 py-2" style={{ borderColor: 'var(--prizym-border-default, #E5E7EB)' }}>
          <span className="flex items-center gap-1 text-[11px] font-semibold">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-red-700">{criticalCount} critical</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-orange-700">{highCount} high</span>
          </span>
          <span className="text-[11px] text-gray-500">{activeCards.length} total</span>
        </div>

        {/* Cards list */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {activeCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Radio className="h-8 w-8 text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">All clear \u2014 no active insights</span>
            </div>
          )}
          {activeCards.map((card) => (
            <PulseCardItem
              key={card.id}
              card={card}
              onDismiss={handleDismiss}
              onPursue={handlePursue}
              onSnooze={handleSnooze}
            />
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pulse card item
// ---------------------------------------------------------------------------

function PulseCardItem({
  card,
  onDismiss,
  onPursue,
  onSnooze,
}: {
  card: TrackedCard;
  onDismiss: (id: string) => void;
  onPursue: (id: string) => void;
  onSnooze: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = urgencyColors[card.urgency];
  const isPursuing = card.status === 'pursuing';

  return (
    <div
      className="relative rounded-xl border bg-white transition-all duration-200"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
        borderColor: 'var(--prizym-border-default, #E5E7EB)',
      }}
    >
      <div className="p-4">
        {/* Title + urgency badge */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[13px] font-semibold text-[#2d3142] leading-snug flex-1">
            {isPursuing && <Check className="mr-1 inline h-3.5 w-3.5 text-green-600" />}
            {card.title}
          </h4>
          <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider', urgencyBadgeStyles[card.urgency])}>
            {card.urgency}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-1.5 text-[12px] text-gray-600 leading-relaxed">{card.summary}</p>

        {/* Impact */}
        <div className="mt-2 text-[11px] font-medium text-gray-500">
          Impact: <span className="text-gray-700">{card.impact}</span>
        </div>

        {/* Why it matters (expandable) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700"
        >
          Why it matters
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        {expanded && (
          <p className="mt-1.5 rounded-lg bg-blue-50/50 p-2.5 text-[11px] text-gray-700">
            {card.whyItMatters}
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            {card.source}
          </span>
          <div className="flex items-center gap-1.5">
            {!isPursuing && (
              <button
                onClick={() => onPursue(card.id)}
                className="rounded-lg bg-[#2563EB] px-2.5 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                Pursue
              </button>
            )}
            {isPursuing && (
              <span className="rounded-lg bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 border border-green-200">
                Pursuing
              </span>
            )}
            <button
              onClick={() => onSnooze(card.id)}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
              title="Snooze"
            >
              <Clock className="h-3 w-3" />
            </button>
            <button
              onClick={() => onDismiss(card.id)}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
              title="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
