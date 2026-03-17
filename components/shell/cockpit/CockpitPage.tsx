'use client';

import { useState } from 'react';
import { Settings, MessageSquare, Scale, Kanban, FileOutput } from 'lucide-react';
import type { DemoConfig } from '../config/types';
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

  return (
    <div className="flex flex-col h-full">
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
