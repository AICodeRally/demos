'use client';

import { useState } from 'react';
import { Settings, MessageSquare, Scale, Kanban, FileOutput, Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { DemoConfig } from '../config/types';
import { useCockpit } from './store';
import { ContextTab } from './tabs/ContextTab';
import { CaptureTab } from './tabs/CaptureTab';
import { DecisionsTab } from './tabs/DecisionsTab';
import { WorkboardTab } from './tabs/WorkboardTab';
import { SpecTab } from './tabs/SpecTab';

const TABS = [
  { id: 'context', label: 'Context', icon: Settings, desc: 'Identity, team, personas, scope, roadmap' },
  { id: 'capture', label: 'Capture', icon: MessageSquare, desc: 'Live notes and transcript import' },
  { id: 'decisions', label: 'Decisions', icon: Scale, desc: 'Vote, rank, and lock priorities' },
  { id: 'workboard', label: 'Workboard', icon: Kanban, desc: 'P0/P1/P2 task queue' },
  { id: 'spec', label: 'Spec', icon: FileOutput, desc: 'Export forge_spec.json' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function CockpitPage({ config }: { config: DemoConfig }) {
  const [activeTab, setActiveTab] = useState<TabId>('context');
  const { session } = useCockpit();

  const sessionName = session.context.identity.projectName || config.client?.name || config.slug;
  const noteCount = session.capture.notes.length;
  const decisionCount = session.decisions.items.length;
  const taskCount = session.workboard.tasks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Cockpit header */}
      <div className="flex items-center justify-between border-b border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href={`/${config.slug}`}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[var(--sem-text-secondary)] transition-colors hover:bg-[var(--sem-bg-secondary)] hover:text-[var(--sem-text-primary)]"
          >
            <ArrowLeft className="h-3 w-3" />
            Demo
          </Link>
          <div className="h-4 w-px bg-[var(--sem-border-default)]" />
          <Rocket className="h-4 w-4 text-[var(--palette-primary-500)]" />
          <span className="text-sm font-bold text-[var(--sem-text-primary)]">Rally Cockpit</span>
          <span className="text-sm text-[var(--sem-text-secondary)]" suppressHydrationWarning>— {sessionName}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--sem-text-secondary)]">
          <span suppressHydrationWarning>{noteCount} notes</span>
          <span suppressHydrationWarning>{decisionCount} decisions</span>
          <span suppressHydrationWarning>{taskCount} tasks</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)]">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.desc}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                active
                  ? 'border-[var(--palette-primary-500)] text-[var(--palette-primary-500)]'
                  : 'border-transparent text-[var(--sem-text-secondary)] hover:text-[var(--sem-text-primary)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active tab descriptor */}
      <div className="shrink-0 border-b border-[var(--sem-border-default)] bg-[var(--sem-bg-primary)] px-6 py-2">
        <p className="text-xs text-[var(--sem-text-muted)]">
          {TABS.find(t => t.id === activeTab)?.desc}
        </p>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'context' && <ContextTab />}
        {activeTab === 'capture' && <CaptureTab />}
        {activeTab === 'decisions' && <DecisionsTab />}
        {activeTab === 'workboard' && <WorkboardTab />}
        {activeTab === 'spec' && <SpecTab config={config} />}
      </div>
    </div>
  );
}
