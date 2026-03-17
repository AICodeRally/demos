'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { DecisionItem, OrgMember } from '../types';
import { computeWeightedScore } from '../store';

interface VoteBarProps {
  decision: DecisionItem;
  org: OrgMember[];
  currentMemberId?: string;
  onVote: (value: 'up' | 'down') => void;
  disabled?: boolean;
}

export function VoteBar({ decision, org, currentMemberId, onVote, disabled }: VoteBarProps) {
  const score = computeWeightedScore(decision, org);
  const myVote = currentMemberId ? decision.votes.find(v => v.memberId === currentMemberId)?.value : undefined;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onVote('up')}
        disabled={disabled || decision.status === 'locked'}
        className={`rounded p-1 transition-colors ${myVote === 'up' ? 'bg-green-500/20 text-green-400' : 'text-[var(--sem-text-muted)] hover:text-green-400'} disabled:opacity-30`}
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <span className={`min-w-[2rem] text-center text-sm font-bold ${score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : 'text-[var(--sem-text-muted)]'}`}>
        {score > 0 ? `+${score}` : score}
      </span>
      <button
        onClick={() => onVote('down')}
        disabled={disabled || decision.status === 'locked'}
        className={`rounded p-1 transition-colors ${myVote === 'down' ? 'bg-red-500/20 text-red-400' : 'text-[var(--sem-text-muted)] hover:text-red-400'} disabled:opacity-30`}
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
    </div>
  );
}
