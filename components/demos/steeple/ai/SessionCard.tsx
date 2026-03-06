'use client';

import { Bot, MessageSquare, Zap } from 'lucide-react';
import type { AISession } from '@/data/steeple/ai-platform';

const statusConfig: Record<
  AISession['status'],
  { dot: string; label: string }
> = {
  ACTIVE: { dot: '#10B981', label: 'Active' },
  COMPLETED: { dot: '#9CA3AF', label: 'Completed' },
  PAUSED: { dot: '#F59E0B', label: 'Paused' },
};

function timeAgo(iso: string): string {
  const now = new Date('2026-02-17T10:00:00Z'); // Fixed demo time
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function SessionCard({ session }: { session: AISession }) {
  const sc = statusConfig[session.status];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(82,35,152,0.06)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(82,35,152,0.08)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-purple-50 p-2">
            <Bot className="h-4 w-4 text-[#522398]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#2d3142]">
              {session.agentName}
            </h4>
            <span className="text-[11px] text-gray-400 font-mono">
              {session.agentSlug}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: sc.dot,
              boxShadow: session.status === 'ACTIVE' ? `0 0 6px ${sc.dot}60` : undefined,
            }}
          />
          <span className="text-[11px] font-medium text-gray-500">
            {sc.label}
          </span>
        </div>
      </div>

      {/* Mission label */}
      {session.mission && (
        <div className="mt-2.5 rounded-lg bg-purple-50/50 px-3 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            MISSION
          </span>
          <p className="mt-0.5 text-xs text-purple-700">{session.mission}</p>
        </div>
      )}

      {/* Preview */}
      <p className="mt-2.5 text-xs text-gray-600 line-clamp-2">
        {session.preview}
      </p>

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {session.turns} turns
        </span>
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {session.toolCalls} tool calls
        </span>
        <span className="ml-auto">{timeAgo(session.startedAt)}</span>
      </div>
    </div>
  );
}
