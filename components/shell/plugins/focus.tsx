'use client';

import { registerLayout } from '../registry';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';
import { CaptureDrawer } from '../cockpit/CaptureDrawer';

function FocusLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  return (
    <div className="flex h-screen flex-col bg-[var(--sem-bg-primary)]">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-sm font-semibold text-[var(--sem-text-primary)]">{config.product.name}</span>
          {config.product.badge && (
            <span className="rounded-full bg-[var(--comp-sidebar-active-accent)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--comp-sidebar-active-accent)]">
              {config.product.badge}
            </span>
          )}
        </div>
        <parts.ThemeToggle />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)]">{children}</main>
        {config.cockpit?.enabled && <CaptureDrawer config={config} />}
      </div>
    </div>
  );
}

registerLayout({
  id: 'focus',
  label: 'Focus',
  render: (props) => <FocusLayout {...props} />,
});
