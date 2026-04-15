'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, Send } from 'lucide-react';
import type { AskForgeQA } from '@/data/routeiq/askforge-qa';

export function AskForgePrompt({ qa }: { qa: AskForgeQA[] }) {
  const [activeId, setActiveId] = useState<string | null>(qa[0]?.id ?? null);
  const active = qa.find((q) => q.id === activeId) ?? qa[0];

  if (!active) return null;

  return (
    <article
      className="rq-askforge-card rq-animate-fade-in flex flex-col gap-4 rounded-xl border p-5"
      style={{
        background: 'var(--rq-card)',
        borderColor: 'var(--rq-border)',
        borderLeftColor: 'var(--rq-askforge)',
        borderLeftWidth: 4,
      }}
    >
      <header className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--rq-askforge)' }}
        >
          <Sparkles className="h-3 w-3" />
          ASKFORGE
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>
          ASK THE SYSTEM
        </span>
      </header>

      {qa.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {qa.map((q) => (
            <button
              key={q.id}
              onClick={() => setActiveId(q.id)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: q.id === activeId ? 'var(--rq-askforge)' : 'var(--rq-card-alt)',
                color: q.id === activeId ? '#0F172A' : 'var(--rq-text-muted)',
                border: '1px solid var(--rq-border)',
              }}
            >
              {q.question}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5" style={{ borderColor: 'var(--rq-border)', background: 'var(--rq-card-alt)' }}>
        <Send className="h-4 w-4" style={{ color: 'var(--rq-askforge)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--rq-text)' }}>
          {active.question}
        </span>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--rq-text-secondary)' }}>
        {active.answer}
      </p>

      {active.action && (
        <button
          className="group flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors"
          style={{
            background: 'var(--rq-askforge)',
            color: '#0F172A',
          }}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {active.action.label}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-normal opacity-80">
            {active.action.impact}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      )}
    </article>
  );
}
