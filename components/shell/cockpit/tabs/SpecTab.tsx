'use client';

import { useMemo, useCallback } from 'react';
import { Copy, Download, FileText } from 'lucide-react';
import type { DemoConfig } from '../../config/types';
import { useCockpit, useCockpitContext } from '../store';
import { deriveForgeSpec, forgeSpecToMarkdown } from '../forge-spec';

export function SpecTab({ config }: { config: DemoConfig }) {
  const { session } = useCockpit();
  const { org } = useCockpitContext();

  const spec = useMemo(() => deriveForgeSpec(session, config.client?.name ?? config.product?.name ?? session.slug), [session, config]);
  const json = useMemo(() => JSON.stringify(spec, null, 2), [spec]);
  const markdown = useMemo(() => forgeSpecToMarkdown(spec), [spec]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(json);
  }, [json]);

  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-spec-${session.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [json, session.slug]);

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-spec-${session.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, session.slug]);

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex gap-2">
        <button onClick={handleCopy} className="flex items-center gap-1.5 rounded border border-[var(--sem-border-default)] px-3 py-1.5 text-xs text-[var(--sem-text-primary)] hover:bg-[var(--sem-bg-secondary)]">
          <Copy className="h-3.5 w-3.5" /> Copy JSON
        </button>
        <button onClick={handleDownloadJson} className="flex items-center gap-1.5 rounded border border-[var(--sem-border-default)] px-3 py-1.5 text-xs text-[var(--sem-text-primary)] hover:bg-[var(--sem-bg-secondary)]">
          <Download className="h-3.5 w-3.5" /> Download JSON
        </button>
        <button onClick={handleDownloadMd} className="flex items-center gap-1.5 rounded border border-[var(--sem-border-default)] px-3 py-1.5 text-xs text-[var(--sem-text-primary)] hover:bg-[var(--sem-bg-secondary)]">
          <FileText className="h-3.5 w-3.5" /> Download Markdown
        </button>
      </div>

      {/* Rendered spec */}
      <SpecSection title="Identity">
        <KV label="Project" value={spec.identity.projectName} />
        {spec.identity.brandColor && <KV label="Brand Color" value={spec.identity.brandColor} />}
        {spec.identity.tagline && <KV label="Tagline" value={spec.identity.tagline} />}
      </SpecSection>

      <SpecSection title="Team">
        {spec.team.length === 0 ? <Empty text="No team members defined" /> : (
          <div className="space-y-1">
            {spec.team.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-[var(--sem-text-primary)]">{m.name}</span>
                <span className="text-[var(--sem-text-muted)]">— {m.title}, {m.company}</span>
                <span className="rounded bg-[var(--sem-bg-secondary)] px-1.5 py-0.5 text-xs text-[var(--sem-text-muted)]">{m.role} (W:{m.weight})</span>
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Personas">
        {spec.personas.length === 0 ? <Empty text="No personas defined" /> : (
          <div className="space-y-3">
            {spec.personas.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-[var(--sem-text-primary)]">{p.name} — {p.role}</div>
                {p.painPoints.length > 0 && <div className="text-xs text-[var(--sem-text-muted)]">Pain: {p.painPoints.join(', ')}</div>}
                {p.goals.length > 0 && <div className="text-xs text-[var(--sem-text-muted)]">Goals: {p.goals.join(', ')}</div>}
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Priorities">
        {(['p0', 'p1', 'p2'] as const).map(level => {
          const items = spec.priorities[level];
          if (items.length === 0) return null;
          return (
            <div key={level} className="mb-3">
              <div className="mb-1 text-xs font-bold uppercase text-[var(--sem-text-muted)]">{level.toUpperCase()}</div>
              {items.map((item, i) => (
                <div key={i} className="ml-2 mb-1">
                  <div className="text-sm text-[var(--sem-text-primary)]">{item.title}</div>
                  <div className="text-xs text-[var(--sem-text-muted)]">{item.rationale}</div>
                </div>
              ))}
            </div>
          );
        })}
        {spec.priorities.p0.length === 0 && spec.priorities.p1.length === 0 && spec.priorities.p2.length === 0 && (
          <Empty text="No priorities defined — add tasks to the Workboard" />
        )}
      </SpecSection>

      <SpecSection title="Decisions">
        {spec.decisions.length === 0 ? <Empty text="No decisions recorded" /> : (
          <div className="space-y-2">
            {spec.decisions.map((d, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-[var(--sem-text-primary)]">{d.text}</div>
                  <div className="text-xs text-[var(--sem-text-muted)]">
                    Score: {d.weightedScore} | {d.status} | {d.voters.length} voter(s)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Roadmap">
        {spec.roadmap.length === 0 ? <Empty text="No roadmap phases defined" /> : (
          <div className="space-y-1">
            {spec.roadmap.map((r, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-[var(--sem-text-primary)]">{r.phase}</span>
                <span className="text-[var(--sem-text-muted)]"> — {r.modules.join(', ')}{r.timeline ? ` (${r.timeline})` : ''}</span>
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Backlog">
        {spec.backlog.length === 0 ? <Empty text="No backlog items" /> : (
          <div className="space-y-1">
            {spec.backlog.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                  b.priority === 'P0' ? 'bg-red-500/20 text-red-400' :
                  b.priority === 'P1' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{b.priority}</span>
                <span className="text-[var(--sem-text-primary)]">{b.title}</span>
                <span className="text-xs text-[var(--sem-text-muted)]">({b.status})</span>
              </div>
            ))}
          </div>
        )}
      </SpecSection>
    </div>
  );
}

// --- Helpers ---

function SpecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--sem-border-default)] p-4">
      <h3 className="mb-3 text-base font-bold text-[var(--sem-text-primary)]">{title}</h3>
      {children}
    </section>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-[var(--sem-text-muted)]">{label}:</span>
      <span className="text-[var(--sem-text-primary)]">{value}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="py-4 text-center text-sm text-[var(--sem-text-muted)]">{text}</div>;
}
