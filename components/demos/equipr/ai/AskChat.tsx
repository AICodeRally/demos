'use client';

import { useState } from 'react';
import { Send, MessageSquareText, BookOpen } from 'lucide-react';
import { askConversation, askModes } from '@/data/equipr/ai-platform';
import type { AskMessage } from '@/data/equipr/ai-platform';
import { cn } from '@/lib/utils';

export function AskChat() {
  const [activeMode, setActiveMode] = useState('.fleet');

  return (
    <div className="flex h-[680px] flex-col rounded-xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(37,99,235,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[#2563EB]" />
          <span className="text-sm font-semibold text-[#2d3142]">
            Ask EQUIPR
          </span>
        </div>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-cyan-700">
          DEMO MODE
        </span>
      </div>

      {/* Mode buttons */}
      <div className="flex gap-2 border-b border-gray-100 px-5 py-2.5">
        {askModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              'rounded-full px-3 py-1 text-[11px] font-semibold transition-all',
              activeMode === mode.id
                ? 'bg-[#2563EB] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {askConversation.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input bar (disabled) */}
      <div className="border-t border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
          <input
            type="text"
            placeholder="Ask about fleet, rates, operations, or safety..."
            disabled
            className="flex-1 bg-transparent text-sm text-gray-400 placeholder:text-gray-400 outline-none"
          />
          <button
            disabled
            className="rounded-lg bg-gray-200 p-1.5 text-gray-400"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: AskMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-[#2563EB] text-white'
            : 'bg-gray-50 border border-gray-100 text-gray-800'
        )}
      >
        {/* Message content */}
        <div
          className={cn(
            'whitespace-pre-wrap text-sm leading-relaxed',
            isUser ? 'text-white' : 'text-gray-800'
          )}
        >
          {message.content}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-gray-200/50 pt-2">
            {message.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
              >
                <BookOpen className="h-2.5 w-2.5" />
                {src.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
