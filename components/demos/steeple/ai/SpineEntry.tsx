'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SpineEntryData } from '@/data/steeple/ai-platform';
import { cn } from '@/lib/utils';

const categoryStyles: Record<
  SpineEntryData['category'],
  { bg: string; text: string; label: string }
> = {
  financial: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Financial' },
  membership: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Membership' },
  governance: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Governance' },
  facility: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'Facility' },
  communication: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'Communication' },
};

export function SpineEntryRow({ entry }: { entry: SpineEntryData }) {
  const [expanded, setExpanded] = useState(false);
  const cat = categoryStyles[entry.category];

  const ts = new Date(entry.timestamp);
  const timeStr = ts.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' ' +
    ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        'w-full rounded-lg border border-gray-100 bg-white px-4 py-3 text-left transition-all duration-150 hover:border-gray-200 hover:shadow-sm',
        expanded && 'border-gray-200 shadow-sm'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Timestamp */}
        <span className="shrink-0 w-[110px] font-mono text-[11px] text-gray-400">
          {timeStr}
        </span>

        {/* Category badge */}
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${cat.bg} ${cat.text}`}
        >
          {cat.label}
        </span>

        {/* Actor + action */}
        <div className="flex-1 min-w-0">
          <span className="text-sm text-gray-800">
            <span className="font-medium">{entry.actor}</span>
            {' — '}
            {entry.action}
          </span>
          <span className="ml-2 text-xs text-gray-400">
            {entry.entity} {entry.entityId}
          </span>
        </div>

        {/* Expand icon */}
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-300" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-300" />
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-2 ml-[110px] rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          {entry.details}
        </div>
      )}
    </button>
  );
}
