'use client';

import { Sparkles, Plus } from 'lucide-react';
import type { BundleSuggestion, POSProduct } from '@/lib/swic/data/summit-sleep-pos';

interface BundleSuggestionsProps {
  suggestions: BundleSuggestion[];
  onAdd: (product: POSProduct) => void;
  isDark: boolean;
}

export function BundleSuggestions({ suggestions, onAdd, isDark }: BundleSuggestionsProps) {
  const cardBg = isDark ? '#1E293B' : '#FFFBEB';
  const borderColor = isDark ? '#334155' : '#FDE68A';
  const textPrimary = isDark ? '#F1F5F9' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} style={{ color: '#F59E0B' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#F59E0B' }}>
          AI Bundle Suggestions
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="rounded-lg border p-3 flex items-start gap-3"
            style={{ borderColor, background: cardBg }}
          >
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: textPrimary }}>
                {s.suggestion.name} — ${s.suggestion.price}
              </div>
              <div className="text-xs mt-1" style={{ color: textSecondary }}>
                {s.reason}
              </div>
              <div className="flex gap-3 mt-1.5">
                <span className="text-[10px] font-medium" style={{ color: '#10B981' }}>
                  +${s.commissionLift} commission
                </span>
                <span className="text-[10px]" style={{ color: textSecondary }}>
                  {s.attachRateLift}% attach rate
                </span>
              </div>
            </div>
            <button
              onClick={() => onAdd(s.suggestion)}
              className="shrink-0 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:brightness-110"
              style={{ background: '#10B981' }}
            >
              <Plus size={12} />
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
