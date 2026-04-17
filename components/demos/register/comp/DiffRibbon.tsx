'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus, RefreshCcw, GitBranch } from 'lucide-react';
import { DRAFT_DIFF, APPROVAL_TRAIL, type RuleDelta } from '@/data/register/comp-data';
import { useIcm } from '@/components/demos/register/IcmContext';

export function DiffRibbon({ onPublish }: { onPublish?: () => void }) {
  const { provider } = useIcm();
  const [expanded, setExpanded] = useState(false);
  const counts = DRAFT_DIFF.reduce(
    (acc, d) => { acc[d.kind]++; return acc; },
    { added: 0, modified: 0, removed: 0 } as Record<RuleDelta['kind'], number>,
  );

  const approvedCount = new Set(
    APPROVAL_TRAIL.filter((a) => a.state === 'approved').map((a) => a.ruleId)
  ).size;
  const pendingApprovals = APPROVAL_TRAIL.filter((a) => a.state === 'pending').length;
  const readyToPublish = pendingApprovals === 0;

  return (
    <div
      style={{
        marginBottom: 20,
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        boxShadow: 'var(--register-shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Summary row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GitBranch size={18} style={{ color: 'var(--register-ai)' }} />
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--register-ai)',
          }}>
            Draft
          </span>
          <span style={{ color: 'var(--register-text-dim)', fontSize: '0.82rem' }}>vs</span>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--register-text-dim)',
          }}>
            Live
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DeltaPill icon={Plus} count={counts.added} label="new" color="var(--register-success)" />
          <DeltaPill icon={RefreshCcw} count={counts.modified} label="modified" color="var(--register-warning)" />
          <DeltaPill icon={Minus} count={counts.removed} label="removed" color="var(--register-danger)" />
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{
            fontSize: '0.82rem', color: 'var(--register-text-muted)', fontWeight: 500,
          }}>
            <span style={{ fontWeight: 700, color: 'var(--register-text)' }}>{approvedCount} of {DRAFT_DIFF.length}</span>
            {' '}rules have stakeholder sign-off · {pendingApprovals} approval{pendingApprovals === 1 ? '' : 's'} pending
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', borderRadius: 6,
            background: 'transparent', border: '1px solid var(--register-border-strong)',
            color: 'var(--register-text)', fontSize: '0.82rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Hide details' : 'Show details'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          onClick={onPublish}
          disabled={!readyToPublish}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            background: readyToPublish ? 'var(--register-success)' : 'var(--register-bg-surface)',
            border: 'none',
            color: readyToPublish ? '#FFFFFF' : 'var(--register-text-dim)',
            fontSize: '0.88rem', fontWeight: 700,
            cursor: readyToPublish ? 'pointer' : 'not-allowed',
            letterSpacing: '0.02em',
            boxShadow: readyToPublish ? '0 2px 8px rgba(5,150,105,0.24)' : 'none',
          }}
          title={readyToPublish ? `Fan out approved rules to ${provider.name}, tablets, and REGISTER consoles` : `${pendingApprovals} approvals pending`}
        >
          Publish
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--register-border)',
          background: 'var(--register-bg-surface)',
          padding: '14px 18px',
        }}>
          <div style={{
            display: 'grid', gap: 8,
            gridTemplateColumns: '100px 1fr 1fr 1fr 120px',
            alignItems: 'center',
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: 'var(--register-text-dim)',
            paddingBottom: 8, borderBottom: '1px solid var(--register-border)',
          }}>
            <div>Change</div><div>Component</div><div>Before</div><div>After</div><div>Approvals</div>
          </div>
          {DRAFT_DIFF.map((d) => {
            const apps = APPROVAL_TRAIL.filter((a) => a.ruleId === d.id);
            const approved = apps.filter((a) => a.state === 'approved').length;
            const needed = apps.length;
            return (
              <div key={d.id} style={{
                display: 'grid', gap: 8,
                gridTemplateColumns: '100px 1fr 1fr 1fr 120px',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid var(--register-border)',
                fontSize: '0.85rem',
              }}>
                <KindBadge kind={d.kind} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--register-text)' }}>{d.component}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {d.group}
                  </div>
                </div>
                <div style={{ color: 'var(--register-text-muted)', textDecoration: d.kind === 'removed' ? 'line-through' : 'none' }}>
                  {d.before ?? <span style={{ color: 'var(--register-text-dim)' }}>—</span>}
                </div>
                <div style={{ color: 'var(--register-text)', fontWeight: d.kind === 'added' ? 700 : 500 }}>
                  {d.after ?? <span style={{ color: 'var(--register-text-dim)' }}>—</span>}
                </div>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 700,
                  color: approved === needed ? 'var(--register-success)' : 'var(--register-warning)',
                }}>
                  {approved}/{needed} approved
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DeltaPill({ icon: Icon, count, label, color }:
  { icon: typeof Plus; count: number; label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 9px', borderRadius: 999,
      background: `color-mix(in srgb, ${color} 14%, transparent)`,
      color,
      fontSize: '0.78rem', fontWeight: 700,
    }}>
      <Icon size={12} strokeWidth={2.5} />
      {count} {label}
    </span>
  );
}

function KindBadge({ kind }: { kind: RuleDelta['kind'] }) {
  const cfg = {
    added:    { label: 'NEW',       color: 'var(--register-success)' },
    modified: { label: 'CHANGED',   color: 'var(--register-warning)' },
    removed:  { label: 'REMOVED',   color: 'var(--register-danger)'  },
  }[kind];
  return (
    <span style={{
      display: 'inline-block', padding: '3px 8px', borderRadius: 4,
      background: `color-mix(in srgb, ${cfg.color} 14%, transparent)`,
      color: cfg.color, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.06em',
      textAlign: 'center',
    }}>
      {cfg.label}
    </span>
  );
}
