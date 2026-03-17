'use client';

import { useState, useMemo } from 'react';
import { Plus, Lock, Unlock } from 'lucide-react';
import { useDecisions, useCockpitContext, computeWeightedScore } from '../store';
import type { CaptureTag } from '../types';
import { VoteBar } from '../parts/VoteBar';
import { TagBadge, ALL_TAGS, TagPicker } from '../parts/TagPicker';

type SortMode = 'score' | 'newest' | 'tag';

export function DecisionsTab() {
  const { items, addDecision, vote, lock, unlock } = useDecisions();
  const { org } = useCockpitContext();
  const [sortMode, setSortMode] = useState<SortMode>('score');
  const [votingAs, setVotingAs] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftTags, setDraftTags] = useState<CaptureTag[]>([]);

  const sorted = useMemo(() => {
    const list = [...items];
    switch (sortMode) {
      case 'score':
        return list.sort((a, b) => computeWeightedScore(b, org) - computeWeightedScore(a, org));
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'tag':
        return list.sort((a, b) => (a.tags[0] ?? '').localeCompare(b.tags[0] ?? ''));
    }
  }, [items, org, sortMode]);

  const handleAdd = () => {
    if (draftText.trim()) {
      addDecision(draftText.trim(), draftTags);
      setDraftText('');
      setDraftTags([]);
      setAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sortMode}
          onChange={e => setSortMode(e.target.value as SortMode)}
          className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-muted)]"
        >
          <option value="score">Sort by Score</option>
          <option value="newest">Sort by Newest</option>
          <option value="tag">Sort by Tag</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--sem-text-muted)]">Voting as:</span>
          <select
            value={votingAs}
            onChange={e => setVotingAs(e.target.value)}
            className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-muted)]"
          >
            <option value="">Select member...</option>
            {org.map(m => <option key={m.id} value={m.id}>{m.name} (W:{m.weight})</option>)}
          </select>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="ml-auto flex items-center gap-1 rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white"
        >
          <Plus className="h-3 w-3" /> Add Decision
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <input
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            placeholder="Decision text..."
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]"
          />
          <TagPicker selected={draftTags} onChange={setDraftTags} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      )}

      {/* Decision list */}
      {sorted.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--sem-text-muted)]">No decisions yet. Promote capture items or add directly.</div>
      )}
      {sorted.map(item => (
        <div key={item.id} className={`rounded border p-4 ${item.status === 'locked' ? 'border-green-500/30 bg-green-500/5' : 'border-[var(--sem-border-default)]'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-[var(--sem-text-primary)]">{item.text}</div>
              <div className="mt-1 flex gap-1">
                {item.tags.map(t => <TagBadge key={t} tag={t} />)}
                {item.status === 'locked' && (
                  <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">Locked</span>
                )}
              </div>
            </div>
            <button
              onClick={() => item.status === 'locked' ? unlock(item.id) : lock(item.id)}
              className="shrink-0 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
              title={item.status === 'locked' ? 'Unlock' : 'Lock decision'}
            >
              {item.status === 'locked' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-3">
            <VoteBar
              decision={item}
              org={org}
              currentMemberId={votingAs}
              onVote={(value) => votingAs && vote(item.id, votingAs, value)}
              disabled={item.status === 'locked' || !votingAs}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
