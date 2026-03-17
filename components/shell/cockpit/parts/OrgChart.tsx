'use client';

import { useState } from 'react';
import { Plus, Trash2, Crown, Shield, AlertTriangle, User, Eye } from 'lucide-react';
import type { OrgMember, OrgRole } from '../types';

const ROLE_CONFIG: Record<OrgRole, { icon: typeof Crown; color: string }> = {
  Sponsor: { icon: Crown, color: '#F59E0B' },
  Champion: { icon: Shield, color: '#10B981' },
  Blocker: { icon: AlertTriangle, color: '#EF4444' },
  User: { icon: User, color: '#3B82F6' },
  Observer: { icon: Eye, color: '#6B7280' },
};

interface OrgChartProps {
  members: OrgMember[];
  onAdd: (member: OrgMember) => void;
  onRemove: (id: string) => void;
  onUpdate: (member: OrgMember) => void;
}

export function OrgChart({ members, onAdd, onRemove, onUpdate }: OrgChartProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', title: '', company: '', role: 'User' as OrgRole, weight: 3 });

  const handleAdd = () => {
    if (!draft.name.trim()) return;
    onAdd({ ...draft, id: crypto.randomUUID() });
    setDraft({ name: '', title: '', company: '', role: 'User', weight: 3 });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      {members.map(member => {
        const cfg = ROLE_CONFIG[member.role];
        const Icon = cfg.icon;
        return (
          <div key={member.id} className="flex items-center gap-3 rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-3">
            <Icon className="h-5 w-5 shrink-0" style={{ color: cfg.color }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--sem-text-primary)]">{member.name}</div>
              <div className="text-xs text-[var(--sem-text-muted)]">{member.title} — {member.company}</div>
            </div>
            <select
              value={member.role}
              onChange={e => onUpdate({ ...member, role: e.target.value as OrgRole })}
              className="rounded bg-transparent text-xs text-[var(--sem-text-muted)] outline-none"
            >
              {Object.keys(ROLE_CONFIG).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--sem-text-muted)]">W:</span>
              <input
                type="range" min={1} max={5} value={member.weight}
                onChange={e => onUpdate({ ...member, weight: Number(e.target.value) })}
                className="w-16"
              />
              <span className="w-4 text-center text-xs font-bold text-[var(--sem-text-primary)]">{member.weight}</span>
            </div>
            <button onClick={() => onRemove(member.id)} className="text-[var(--sem-text-muted)] hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {adding ? (
        <div className="space-y-2 rounded-lg border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Title" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Company" value={draft.company} onChange={e => setDraft(d => ({ ...d, company: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add member
        </button>
      )}
    </div>
  );
}
