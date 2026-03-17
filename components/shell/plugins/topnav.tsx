'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { registerLayout } from '../registry';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';
import { CaptureDrawer } from '../cockpit/CaptureDrawer';

function TopnavLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const gradient = config.gradient;
  const gradientStyle = gradient
    ? { background: `linear-gradient(135deg, ${gradient.start}, ${gradient.mid}, ${gradient.end})` }
    : {};

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-2 pt-4">
      {config.nav.map(section => (
        <parts.NavSection
          key={section.section}
          section={section}
          collapsible={false}
          slug={config.slug}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen flex-col">
      {/* Top gradient bar */}
      <div className="h-1 shrink-0" style={gradientStyle} />

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-6">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-[var(--sem-text-primary)]" />
          </button>
          <span
            className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent"
            style={{ backgroundImage: gradient ? `linear-gradient(135deg, ${gradient.start}, ${gradient.end})` : undefined }}
          >
            {config.suite?.name}
          </span>
          {config.module && (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={gradientStyle}
            >
              {config.module.code}
            </div>
          )}
          {config.module && (
            <div>
              <div className="text-sm font-bold text-[var(--sem-text-primary)]">{config.module.name}</div>
              <div className="text-xs text-[var(--sem-text-muted)]">{config.module.description}</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--palette-accent-500)]/10 px-2 py-0.5 text-xs font-medium text-[var(--palette-accent-500)]">
            Demo Data
          </span>
          <parts.ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-[var(--comp-sidebar-border)] bg-[var(--comp-sidebar-bg)] overflow-y-auto">
          {sidebarContent}
        </aside>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
            {children}
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>
      </div>

      <div className="h-0.5 shrink-0" style={gradientStyle} />
      <parts.Footer config={config} />
      <div className="h-0.5 shrink-0" style={gradientStyle} />

      <parts.MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} width={240}>
        {sidebarContent}
      </parts.MobileDrawer>
    </div>
  );
}

registerLayout({
  id: 'topnav',
  label: 'Topnav',
  render: (props) => <TopnavLayout {...props} />,
});
