'use client';

import type { CaptureTag } from '../types';

const TAG_OPTIONS: { value: CaptureTag; label: string; color: string }[] = [
  { value: 'pain-point', label: 'Pain Point', color: '#EF4444' },
  { value: 'decision', label: 'Decision', color: '#8B5CF6' },
  { value: 'action-item', label: 'Action', color: '#F59E0B' },
  { value: 'question', label: 'Question', color: '#3B82F6' },
  { value: 'insight', label: 'Insight', color: '#10B981' },
];

export const ALL_TAGS: CaptureTag[] = TAG_OPTIONS.map(o => o.value);

interface TagPickerProps {
  selected: CaptureTag[];
  onChange: (tags: CaptureTag[]) => void;
  size?: 'sm' | 'md';
}

export function TagPicker({ selected, onChange, size = 'sm' }: TagPickerProps) {
  const toggle = (tag: CaptureTag) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {TAG_OPTIONS.map(opt => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`rounded-full border font-medium transition-colors ${
              size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            }`}
            style={{
              borderColor: active ? opt.color : 'var(--sem-border-default)',
              backgroundColor: active ? `${opt.color}20` : 'transparent',
              color: active ? opt.color : 'var(--sem-text-muted)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function TagBadge({ tag }: { tag: CaptureTag }) {
  const opt = TAG_OPTIONS.find(o => o.value === tag);
  if (!opt) return null;
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
    >
      {opt.label}
    </span>
  );
}
