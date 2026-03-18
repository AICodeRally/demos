'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { setTokens } from '../../theme/runtime';
import { useCockpitContext } from '../store';
import type { Persona, ModuleScope, RoadmapPhase, Artifact } from '../types';
import { OrgChart } from '../parts/OrgChart';

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-4">
      <h3 className="mb-1 text-lg font-bold text-[var(--sem-text-primary)]">{title}</h3>
      {description && <p className="mb-3 text-xs text-[var(--sem-text-muted)] leading-relaxed">{description}</p>}
      {!description && <div className="mb-3" />}
      {children}
    </section>
  );
}

export function ContextTab() {
  const {
    identity, org, personas, scope, roadmap, artifacts,
    updateIdentity, addOrgMember, removeOrgMember, updateOrgMember,
    setPersonas, setScope, setRoadmap, setArtifacts,
  } = useCockpitContext();

  return (
    <div className="space-y-6">
      {/* Identity */}
      <Section title="Identity" description="The project name, brand color, and tagline that define this engagement. Changes here update the demo shell in real time.">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Project Name</label>
            <input
              value={identity.projectName}
              onChange={e => updateIdentity({ ...identity, projectName: e.target.value })}
              className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Tagline</label>
            <input
              value={identity.tagline ?? ''}
              onChange={e => updateIdentity({ ...identity, tagline: e.target.value })}
              className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Theme</label>
            <input
              value={identity.themeName ?? ''}
              onChange={e => updateIdentity({ ...identity, themeName: e.target.value })}
              className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Brand Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={identity.brandColor ?? '#3b82f6'}
                onChange={e => {
                  const hex = e.target.value;
                  updateIdentity({ ...identity, brandColor: hex });
                  setTokens({ 'palette-primary-500': hex });
                }}
                className="h-9 w-12 cursor-pointer rounded border border-[var(--sem-border-default)]"
              />
              <span className="text-xs text-[var(--sem-text-muted)]" suppressHydrationWarning>{identity.brandColor ?? '#3b82f6'}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Team (Org Chart) */}
      <Section title="Team" description="Stakeholders in the room and their influence. Weights determine how much each person's vote counts in the Decisions tab.">
        <OrgChart members={org} onAdd={addOrgMember} onRemove={removeOrgMember} onUpdate={updateOrgMember} />
      </Section>

      {/* Personas */}
      <Section title="Personas" description="The end users of the system being built. Who are they, what are their pain points, and what outcomes do they need?">
        <PersonaList personas={personas} onChange={setPersonas} />
      </Section>

      {/* Scope */}
      <Section title="Module Scope" description="The buildable functional areas of the system — e.g., Pipeline, Assessments, Training. Each module maps to a department or feature section. Reorder by priority.">
        <ScopeList scope={scope} onChange={setScope} />
      </Section>

      {/* Roadmap */}
      <Section title="Roadmap" description="Delivery phases with timelines. Map modules to phases to define what ships when.">
        <RoadmapList roadmap={roadmap} onChange={setRoadmap} />
      </Section>

      {/* Artifacts */}
      <Section title="Artifacts" description="Links, documents, and decks relevant to this engagement. Reference materials the team can access during and after the session.">
        <ArtifactList artifacts={artifacts} onChange={setArtifacts} />
      </Section>
    </div>
  );
}

// --- Sub-components ---

function PersonaList({ personas, onChange }: { personas: Persona[]; onChange: (p: Persona[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', role: '', painPoints: '', goals: '' });

  const handleAdd = () => {
    onChange([...personas, {
      id: crypto.randomUUID(), name: draft.name, role: draft.role,
      painPoints: draft.painPoints.split('\n').filter(Boolean),
      goals: draft.goals.split('\n').filter(Boolean),
    }]);
    setDraft({ name: '', role: '', painPoints: '', goals: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      {personas.map(p => (
        <div key={p.id} className="flex items-start justify-between rounded border border-[var(--sem-border-default)] p-3">
          <div>
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{p.name} — {p.role}</div>
            {p.painPoints.length > 0 && (
              <div className="mt-1 text-xs text-[var(--sem-text-muted)]">Pain: {p.painPoints.join(', ')}</div>
            )}
            {p.goals.length > 0 && (
              <div className="mt-1 text-xs text-[var(--sem-text-muted)]">Goals: {p.goals.join(', ')}</div>
            )}
          </div>
          <button onClick={() => onChange(personas.filter(x => x.id !== p.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Role" value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          </div>
          <textarea placeholder="Pain points (one per line)" value={draft.painPoints} onChange={e => setDraft(d => ({ ...d, painPoints: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] resize-none" rows={2} />
          <textarea placeholder="Goals (one per line)" value={draft.goals} onChange={e => setDraft(d => ({ ...d, goals: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] resize-none" rows={2} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add persona
        </button>
      )}
    </div>
  );
}

function ScopeList({ scope, onChange }: { scope: ModuleScope[]; onChange: (s: ModuleScope[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ department: '', moduleName: '', description: '' });

  const handleAdd = () => {
    onChange([...scope, { id: crypto.randomUUID(), department: draft.department || undefined, moduleName: draft.moduleName, description: draft.description, priority: scope.length + 1 }]);
    setDraft({ department: '', moduleName: '', description: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {[...scope].sort((a, b) => a.priority - b.priority).map((m, idx) => (
        <div key={m.id} className="flex items-center gap-2 rounded border border-[var(--sem-border-default)] px-3 py-2">
          <GripVertical className="h-4 w-4 shrink-0 text-[var(--sem-text-muted)]" />
          <span className="w-6 text-center text-xs font-bold text-[var(--sem-text-muted)]">#{idx + 1}</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">
              {m.department && <span className="text-xs font-semibold text-[var(--palette-primary-500)] mr-1.5">{m.department} /</span>}
              {m.moduleName}
            </div>
            {m.description && <div className="text-xs text-[var(--sem-text-muted)]">{m.description}</div>}
          </div>
          <button onClick={() => onChange(scope.filter(x => x.id !== m.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Department (optional)" value={draft.department} onChange={e => setDraft(d => ({ ...d, department: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Module name" value={draft.moduleName} onChange={e => setDraft(d => ({ ...d, moduleName: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          </div>
          <input placeholder="Description" value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add module
        </button>
      )}
    </div>
  );
}

function RoadmapList({ roadmap, onChange }: { roadmap: RoadmapPhase[]; onChange: (r: RoadmapPhase[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ phase: '', modules: '', timeline: '' });

  const handleAdd = () => {
    onChange([...roadmap, { id: crypto.randomUUID(), phase: draft.phase, modules: draft.modules.split(',').map(s => s.trim()).filter(Boolean), timeline: draft.timeline || undefined }]);
    setDraft({ phase: '', modules: '', timeline: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {roadmap.map(r => (
        <div key={r.id} className="flex items-center justify-between rounded border border-[var(--sem-border-default)] px-3 py-2">
          <div>
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{r.phase}</div>
            <div className="text-xs text-[var(--sem-text-muted)]">{r.modules.join(', ')}{r.timeline ? ` — ${r.timeline}` : ''}</div>
          </div>
          <button onClick={() => onChange(roadmap.filter(x => x.id !== r.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <input placeholder="Phase name" value={draft.phase} onChange={e => setDraft(d => ({ ...d, phase: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <input placeholder="Modules (comma-separated)" value={draft.modules} onChange={e => setDraft(d => ({ ...d, modules: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <input placeholder="Timeline (optional)" value={draft.timeline} onChange={e => setDraft(d => ({ ...d, timeline: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add phase
        </button>
      )}
    </div>
  );
}

function ArtifactList({ artifacts, onChange }: { artifacts: Artifact[]; onChange: (a: Artifact[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', type: 'link' as Artifact['type'], content: '' });

  const handleAdd = () => {
    onChange([...artifacts, { id: crypto.randomUUID(), name: draft.name, type: draft.type, content: draft.content }]);
    setDraft({ name: '', type: 'link', content: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {artifacts.map(a => (
        <div key={a.id} className="flex items-center justify-between rounded border border-[var(--sem-border-default)] px-3 py-2">
          <div>
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{a.name}</div>
            <div className="text-xs text-[var(--sem-text-muted)]">[{a.type}] {a.content.slice(0, 80)}{a.content.length > 80 ? '...' : ''}</div>
          </div>
          <button onClick={() => onChange(artifacts.filter(x => x.id !== a.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as Artifact['type'] }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-muted)]">
              <option value="link">Link</option>
              <option value="doc">Doc</option>
              <option value="deck">Deck</option>
            </select>
          </div>
          <textarea placeholder="URL or content" value={draft.content} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] resize-none" rows={2} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add artifact
        </button>
      )}
    </div>
  );
}
