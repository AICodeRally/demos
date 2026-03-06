'use client';

import { MessageSquareText, Radio, HeartPulse } from 'lucide-react';
import { useAIWidgets } from './AIWidgetProvider';

export function OrbButtons() {
  const { state, toggleAsk, togglePulse, toggleOps } = useAIWidgets();

  return (
    <div className="flex items-center gap-2">
      {/* Ops orb button */}
      <button
        onClick={toggleOps}
        className="relative flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-110"
        style={{
          background: state.opsOpen
            ? 'linear-gradient(135deg, #6D28D9, #7C3AED)'
            : 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)',
        }}
        title="Fleet Health"
      >
        <HeartPulse className="h-4 w-4 text-white" />
        {/* Score badge */}
        <span
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
          style={{ background: '#10B981', fontSize: '7px', lineHeight: 1 }}
        >
          94
        </span>
      </button>

      {/* Pulse orb button */}
      <button
        onClick={togglePulse}
        className="flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-110"
        style={{
          background: state.pulseOpen
            ? 'linear-gradient(135deg, #B45309, #D97706)'
            : 'linear-gradient(135deg, #D97706, #F59E0B)',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)',
        }}
        title="Pulse Insights"
      >
        <Radio className="h-4 w-4 text-white" />
      </button>

      {/* Ask orb button */}
      <button
        onClick={toggleAsk}
        className="flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-110"
        style={{
          background: state.askOpen
            ? 'linear-gradient(135deg, #1D4ED8, #0284C7)'
            : 'linear-gradient(135deg, #2563EB, #06B6D4)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
        }}
        title="Ask EQUIPR"
      >
        <MessageSquareText className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
