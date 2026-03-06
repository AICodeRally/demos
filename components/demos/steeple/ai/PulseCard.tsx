'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { PulseCardData, PulseUrgency } from '@/data/steeple/ai-platform';

const urgencyStyles: Record<PulseUrgency, { border: string; badge: string; badgeBg: string }> = {
  critical: { border: '#EF4444', badge: 'text-red-700', badgeBg: 'bg-red-50 border-red-200' },
  high: { border: '#F97316', badge: 'text-orange-700', badgeBg: 'bg-orange-50 border-orange-200' },
  medium: { border: '#F59E0B', badge: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-200' },
  low: { border: '#3B82F6', badge: 'text-blue-700', badgeBg: 'bg-blue-50 border-blue-200' },
};

export function PulseCard({ card }: { card: PulseCardData }) {
  const [expanded, setExpanded] = useState(false);
  const style = urgencyStyles[card.urgency];

  return (
    <div
      className="relative rounded-xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all duration-200"
      style={{ borderLeftWidth: 4, borderLeftColor: style.border }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#2d3142]">
              {card.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600">{card.summary}</p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.badge} ${style.badgeBg}`}
          >
            {card.urgency}
          </span>
        </div>

        {/* Impact */}
        <div className="mt-3 text-xs font-medium text-gray-500">
          Impact: <span className="text-gray-700">{card.impact}</span>
        </div>

        {/* Expandable "Why it matters" */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
        >
          Why it matters
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        {expanded && (
          <p className="mt-2 rounded-lg bg-purple-50/50 p-3 text-xs text-gray-700">
            {card.whyItMatters}
          </p>
        )}

        {/* Source + actions */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Source: {card.source}
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-[#522398] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#3d1a72]">
              Pursue
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-50">
              Snooze
            </button>
            <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
