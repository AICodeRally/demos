'use client';

import { useState } from 'react';
import {
  FileText,
  CreditCard,
  UserCheck,
  Smartphone,
  Trophy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { CoachingCardData } from '@/data/steeple/ai-platform';

const iconMap: Record<string, typeof FileText> = {
  FileText,
  CreditCard,
  UserCheck,
  Smartphone,
  Trophy,
};

const priorityStyles: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
  MEDIUM: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  LOW: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
};

export function CoachingCard({ card }: { card: CoachingCardData }) {
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const Icon = iconMap[card.icon] ?? FileText;
  const pStyle = priorityStyles[card.priority] ?? priorityStyles.MEDIUM;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all duration-200">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 rounded-lg p-2.5"
            style={{ backgroundColor: `${card.color}12` }}
          >
            <Icon className="h-5 w-5" style={{ color: card.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#2d3142]">
                {card.title}
              </h4>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${pStyle.bg} ${pStyle.text}`}
              >
                {card.priority}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-gray-600">
              {card.recommendation}
            </p>
          </div>
        </div>

        {/* Expected impact */}
        <div className="mt-3 rounded-lg bg-emerald-50/60 px-3 py-2 text-xs font-medium text-emerald-700">
          Expected impact: {card.expectedImpact}
        </div>

        {/* Metrics */}
        <div className="mt-2 text-xs text-gray-500">{card.metrics}</div>

        {/* Action steps (expandable) */}
        <button
          onClick={() => setStepsExpanded(!stepsExpanded)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
        >
          Action steps ({card.actionSteps.length})
          {stepsExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        {stepsExpanded && (
          <ol className="mt-2 space-y-1.5 pl-4">
            {card.actionSteps.map((step, i) => (
              <li
                key={i}
                className="list-decimal text-xs text-gray-700 marker:font-semibold marker:text-purple-400"
              >
                {step}
              </li>
            ))}
          </ol>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button className="rounded-lg bg-[#522398] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#3d1a72]">
            Take Action
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-50">
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
