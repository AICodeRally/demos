'use client';

import { useState, useMemo } from 'react';
import { Filter, ArrowUpCircle } from 'lucide-react';
import { useCapture, useCockpitContext } from '../store';
import type { CaptureTag } from '../types';
import { TagBadge, ALL_TAGS } from '../parts/TagPicker';

type SourceFilter = 'all' | 'manual' | 'transcript-parse';

export function CaptureTab() {
  const { notes, addNote, promote } = useCapture();
  const { org } = useCockpitContext();
  const [tagFilter, setTagFilter] = useState<CaptureTag | null>(null);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newNote, setNewNote] = useState('');

  const filtered = useMemo(() => {
    let items = [...notes];
    if (tagFilter) items = items.filter(n => n.tags.includes(tagFilter));
    if (sourceFilter !== 'all') items = items.filter(n => n.source === sourceFilter);
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notes, tagFilter, sourceFilter]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handlePromoteSelected = () => {
    selected.forEach(id => promote(id));
    setSelected(new Set());
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-[var(--sem-text-muted)]" />
        <div className="flex gap-1">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                tagFilter === tag
                  ? 'bg-[var(--palette-primary-500)] text-white'
                  : 'bg-[var(--sem-bg-secondary)] text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value as SourceFilter)}
          className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-muted)]"
        >
          <option value="all">All Sources</option>
          <option value="manual">Manual</option>
          <option value="transcript-parse">Transcript</option>
        </select>
        {selected.size > 0 && (
          <button
            onClick={handlePromoteSelected}
            className="flex items-center gap-1 rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white"
          >
            <ArrowUpCircle className="h-3 w-3" /> Promote {selected.size} to Decisions
          </button>
        )}
      </div>

      {/* Add note */}
      <div className="flex gap-2">
        <input
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddNote()}
          placeholder="Add a capture note..."
          className="flex-1 rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]"
        />
        <button onClick={handleAddNote} className="rounded bg-[var(--palette-primary-500)] px-4 py-2 text-sm font-medium text-white">
          Add
        </button>
      </div>

      {/* Notes feed */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--sem-text-muted)]">No capture items yet. Add your first note above.</div>
        )}
        {filtered.map(note => (
          <div key={note.id} className="flex items-start gap-3 rounded border border-[var(--sem-border-default)] p-3">
            <input
              type="checkbox"
              checked={selected.has(note.id)}
              onChange={() => toggleSelect(note.id)}
              className="mt-1 shrink-0"
            />
            <div className="flex-1">
              <div className="text-sm text-[var(--sem-text-primary)]">
                {note.author && <span className="font-medium">{note.author}: </span>}
                {note.text}
              </div>
              <div className="mt-1 flex items-center gap-2">
                {note.tags.map(t => <TagBadge key={t} tag={t} />)}
                <span className="text-xs text-[var(--sem-text-muted)]">
                  {new Date(note.timestamp).toLocaleTimeString()}
                </span>
                {note.source === 'transcript-parse' && (
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400">transcript</span>
                )}
                {note.source === 'ops-functions-doc' && (
                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400">ops doc</span>
                )}
                {note.source === 'tech-recommendation' && (
                  <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-xs text-teal-400">tech rec</span>
                )}
                {note.source === 'swot-analysis' && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400">SWOT</span>
                )}
                {note.source === 'academy-intake' && (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-xs text-rose-400">academy</span>
                )}
                {note.promotedToDecision && (
                  <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">Promoted</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
