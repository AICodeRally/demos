'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronLeft, Upload, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { ResolvedDemoConfig } from '../config/types';
import type { CaptureTag } from './types';
import { useCapture, useDrawer } from './store';
import { TagPicker, TagBadge } from './parts/TagPicker';
import { TranscriptImport } from './parts/TranscriptImport';

interface CaptureDrawerProps {
  config: ResolvedDemoConfig;
}

export function CaptureDrawer({ config }: CaptureDrawerProps) {
  const { isOpen, toggle } = useDrawer();
  const { notes, addNote, importTranscript } = useCapture();
  const [input, setInput] = useState('');
  const [tags, setTags] = useState<CaptureTag[]>([]);
  const [showImport, setShowImport] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when notes change
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [notes.length]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    addNote(text, tags);
    setInput('');
    setTags([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Collapsed state — thin toggle strip
  if (!isOpen) {
    return (
      <button
        onClick={toggle}
        className="flex w-10 shrink-0 flex-col items-center justify-center gap-2 border-l border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] transition-colors hover:bg-[var(--sem-bg-tertiary)]"
      >
        <ChevronLeft className="h-4 w-4 text-[var(--sem-text-muted)]" />
        <MessageSquare className="h-4 w-4 text-[var(--sem-text-muted)]" />
        {notes.length > 0 && (
          <span className="rounded-full bg-[var(--palette-primary-500)] px-1.5 text-[10px] font-bold text-white">
            {notes.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--sem-border-default)] px-3 py-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[var(--palette-primary-500)]" />
          <span className="text-sm font-medium text-[var(--sem-text-primary)]">Capture</span>
          {notes.length > 0 && (
            <span className="rounded-full bg-[var(--palette-primary-500)]/20 px-1.5 text-[10px] font-bold text-[var(--palette-primary-500)]">
              {notes.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!config.cockpit?.captureOnly && (
            <Link
              href={`/${config.slug}/cockpit`}
              className="rounded p-1 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
              title="Open full Cockpit"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            onClick={() => setShowImport(!showImport)}
            className={`rounded p-1 transition-colors ${showImport ? 'text-[var(--palette-primary-500)]' : 'text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]'}`}
            title="Import transcript"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
          <button onClick={toggle} className="rounded p-1 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Transcript import panel */}
      {showImport && (
        <TranscriptImport
          onImport={(items, rawText) => {
            importTranscript(items, rawText);
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Notes feed */}
      <div ref={feedRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {notes.length === 0 && (
          <p className="text-center text-xs text-[var(--sem-text-muted)] py-8">
            No notes yet. Type below to capture your first note.
          </p>
        )}
        {notes.map(note => (
          <div key={note.id} className="rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-primary)] p-2">
            <div className="text-xs text-[var(--sem-text-secondary)]">{note.text}</div>
            <div className="mt-1 flex items-center gap-1 flex-wrap">
              {note.tags.map(t => <TagBadge key={t} tag={t} />)}
              {note.author && <span className="text-[10px] text-[var(--sem-text-muted)]">— {note.author}</span>}
              {note.promotedToDecision && (
                <span className="rounded bg-purple-500/20 px-1 text-[10px] font-medium text-purple-400">Promoted</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-[var(--sem-border-default)] p-3 space-y-2">
        <TagPicker selected={tags} onChange={setTags} />
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note..."
            className="flex-1 rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1.5 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
