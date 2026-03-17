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
  { id: 'context', label: 'Context', icon: Settings },
  { id: 'capture', label: 'Capture', icon: MessageSquare },
  { id: 'decisions', label: 'Decisions', icon: Scale },
  { id: 'workboard', label: 'Workboard', icon: Kanban },
  { id: 'spec', label: 'Spec', icon: FileOutput },
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
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--sem-text-muted)] transition-colors hover:bg-[var(--sem-bg-tertiary)] hover:text-[var(--sem-text-primary)]"
          >
            <ArrowLeft className="h-3 w-3" />
            Demo
          </Link>
          <div className="h-4 w-px bg-[var(--sem-border-default)]" />
          <Rocket className="h-4 w-4 text-[var(--palette-primary-500)]" />
          <span className="text-sm font-bold text-[var(--sem-text-primary)]">Rally Cockpit</span>
          <span className="text-sm text-[var(--sem-text-muted)]">— {sessionName}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--sem-text-muted)]">
          <span>{noteCount} notes</span>
          <span>{decisionCount} decisions</span>
          <span>{taskCount} tasks</span>
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
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                active
                  ? 'border-[var(--palette-primary-500)] text-[var(--palette-primary-500)]'
                  : 'border-transparent text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
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
