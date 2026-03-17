'use client';

import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import type { CaptureItem } from '../types';
import { parseTranscript } from '../transcript-parser';
import { TagBadge } from './TagPicker';

interface TranscriptImportProps {
  onImport: (items: CaptureItem[], rawText: string) => void;
  onClose: () => void;
}

export function TranscriptImport({ onImport, onClose }: TranscriptImportProps) {
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<CaptureItem[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleParse = () => {
    const items = parseTranscript(rawText);
    setParsed(items);
    setSelected(new Set(items.map(i => i.id)));
  };

  const handleImport = () => {
    if (!parsed) return;
    const items = parsed.filter(i => selected.has(i.id));
    onImport(items, rawText);
  };

  const toggleItem = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (!parsed) {
    return (
      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--sem-text-primary)]">
            <Upload className="h-4 w-4" /> Import Transcript
          </div>
          <button onClick={onClose} className="text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Paste Granola transcript here..."
          className="h-48 w-full rounded border border-[var(--sem-border-default)] bg-transparent p-2 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] outline-none resize-none"
        />
        <button
          onClick={handleParse}
          disabled={rawText.trim().length < 20}
          className="rounded bg-[var(--palette-primary-500)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-30"
        >
          Parse Transcript
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--sem-text-primary)]">
          {selected.size} of {parsed.length} items selected
        </span>
        <div className="flex gap-2">
          <button onClick={() => { setParsed(null); setRawText(''); }} className="text-xs text-[var(--sem-text-muted)]">Back</button>
          <button onClick={onClose} className="text-[var(--sem-text-muted)]"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {parsed.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full rounded border p-2 text-left text-xs transition-colors ${
              selected.has(item.id)
                ? 'border-[var(--palette-primary-500)] bg-[var(--palette-primary-500)]/10'
                : 'border-[var(--sem-border-default)]'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border ${selected.has(item.id) ? 'border-[var(--palette-primary-500)] bg-[var(--palette-primary-500)]' : 'border-[var(--sem-border-default)]'} flex items-center justify-center`}>
                {selected.has(item.id) && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                {item.author && <span className="font-medium text-[var(--sem-text-primary)]">{item.author}: </span>}
                <span className="text-[var(--sem-text-secondary)]">{item.text.slice(0, 120)}{item.text.length > 120 ? '...' : ''}</span>
                <div className="mt-1 flex gap-1">{item.tags.map(t => <TagBadge key={t} tag={t} />)}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={handleImport}
        disabled={selected.size === 0}
        className="rounded bg-[var(--palette-primary-500)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-30"
      >
        Import {selected.size} Items
      </button>
    </div>
  );
}
