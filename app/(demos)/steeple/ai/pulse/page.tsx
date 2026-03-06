'use client';

import { useState } from 'react';
import { PulseCard, CoachingCard, EdgeBadge } from '@/components/demos/steeple';
import { pulseCards, coachingCards } from '@/data/steeple';
import type { PulseUrgency, PulseCardType } from '@/data/steeple/ai-platform';
import { cn } from '@/lib/utils';

const urgencyFilters: { label: string; value: PulseUrgency | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const typeFilters: { label: string; value: PulseCardType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Alert', value: 'alert' },
  { label: 'Insight', value: 'insight' },
  { label: 'Suggestion', value: 'suggestion' },
];

export default function PulsePage() {
  const [urgency, setUrgency] = useState<PulseUrgency | 'all'>('all');
  const [cardType, setCardType] = useState<PulseCardType | 'all'>('all');

  const filtered = pulseCards.filter((c) => {
    if (urgency !== 'all' && c.urgency !== urgency) return false;
    if (cardType !== 'all' && c.cardType !== cardType) return false;
    return true;
  });

  return (

      <div className="space-y-6">
        <div className="flex justify-end">
          <EdgeBadge variant="sync" />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(82,35,152,0.06)]">
          {/* Urgency pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Urgency
            </span>
            {urgencyFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setUrgency(f.value)}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
                  urgency === f.value
                    ? 'bg-[#522398] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Type pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Type
            </span>
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setCardType(f.value)}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
                  cardType === f.value
                    ? 'bg-[#522398] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} insight{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Pulse feed */}
        <div className="space-y-3">
          {filtered.map((card) => (
            <PulseCard key={card.id} card={card} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
              No insights match the current filters.
            </div>
          )}
        </div>

        {/* Coaching section */}
        <div>
          <h3 className="text-lg font-semibold text-[#2d3142] mb-4">
            AI Coaching Recommendations
          </h3>
          <div className="space-y-3">
            {coachingCards.map((card) => (
              <CoachingCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>

  );
}
