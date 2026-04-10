'use client';

import { useState, useRef, useCallback } from 'react';
import { Menu, Rocket, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { registerLayout } from '../registry';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';
import { CaptureDrawer } from '../cockpit/CaptureDrawer';

function SidebarLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const isResizing = useRef(false);
  const Logo = config.client.logo;

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(Math.max(startWidth + ev.clientX - startX, 200), 480);
      setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [sidebarWidth]);

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-2 pt-4">
      {config.nav.map(section => (
        <parts.NavSection
          key={section.section}
          section={section}
          collapsible
          slug={config.slug}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar — resizable */}
      <aside
        className="hidden lg:flex shrink-0 flex-col border-r border-[var(--comp-sidebar-border)] bg-[var(--comp-sidebar-bg)] overflow-y-auto relative"
        style={{ width: sidebarWidth }}
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--comp-sidebar-border)] px-4">
          {Logo && <Logo className="h-6 w-6 text-[var(--comp-sidebar-active-accent)]" />}
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-[var(--comp-sidebar-text)]">{config.client.name}</div>
            {config.client.tagline && (
              <div className="truncate text-xs text-[var(--comp-sidebar-text-muted)]">{config.client.tagline}</div>
            )}
          </div>
        </div>
        {sidebarContent}
        {config.cockpit?.enabled && !config.cockpit.captureOnly && (
          <Link
            href={`/${config.slug}/cockpit`}
            className="mx-2 mb-3 mt-auto flex items-center gap-2 rounded-lg border border-[var(--comp-sidebar-border)] bg-[var(--comp-sidebar-active-accent)]/10 px-3 py-2 text-xs font-medium text-[var(--comp-sidebar-active-accent)] transition-colors hover:bg-[var(--comp-sidebar-active-accent)]/20"
          >
            <Rocket className="h-3.5 w-3.5" />
            Rally Cockpit
          </Link>
        )}
        {/* Resize handle */}
        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 w-2 h-full cursor-col-resize group flex items-center justify-center"
          style={{ zIndex: 10 }}
        >
          <div className="w-0.5 h-8 rounded-full bg-[var(--comp-sidebar-border)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5 text-[var(--sem-text-primary)]" />
            </button>
            <span className="text-lg font-bold text-[var(--sem-text-primary)]">{config.product.name}</span>
            {config.product.badge && (
              <span className="rounded-full bg-[var(--comp-sidebar-active-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--comp-sidebar-active-accent)]">
                {config.product.badge}
              </span>
            )}
          </div>
          <parts.ThemeToggle />
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
            {children}
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>

        <parts.Footer config={config} />
      </div>

      <parts.MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {sidebarContent}
      </parts.MobileDrawer>
    </div>
  );
}

registerLayout({
  id: 'sidebar',
  label: 'Sidebar',
  render: (props) => <SidebarLayout {...props} />,
});
