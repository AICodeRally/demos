'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createThemeVars, resolveTheme } from '@/lib/theme';
import type { SpmDemoConfig } from './types';

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return twMerge(clsx(inputs));
}

function getIcon(name: string): LucideIcons.LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;
  return icons[name] ?? LucideIcons.Circle;
}

interface SpmShellProps {
  config: SpmDemoConfig;
  children: React.ReactNode;
}

export function SpmShell({ config, children }: SpmShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const themeVars = createThemeVars(config.theme);
  const { gradient } = config;
  const gradientCss = `linear-gradient(90deg, ${gradient.start}, ${gradient.mid}, ${gradient.end})`;

  // Flatten nav for active detection
  const allItems = config.nav.flatMap((s) => s.items);
  const currentNav = allItems.find((n) =>
    n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href)
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={themeVars as React.CSSProperties}>
      {/* ── Top gradient bar ── */}
      <div className="h-1 shrink-0" style={{ background: gradientCss }} />

      {/* ── Navbar ── */}
      <nav
        className="shrink-0 flex items-center h-16 px-6"
        style={{
          background: 'var(--prizym-bg-primary)',
          borderBottom: '1px solid var(--prizym-border-subtle)',
        }}
      >
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 rounded-lg p-1.5 hover:bg-white/[0.06] lg:hidden"
        >
          {sidebarOpen ? (
            <LucideIcons.X className="h-5 w-5 text-white/70" />
          ) : (
            <LucideIcons.Menu className="h-5 w-5 text-white/70" />
          )}
        </button>

        {/* Suite branding */}
        <Link href="/" className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span
              className="text-2xl font-bold bg-clip-text text-transparent tracking-tight"
              style={{ backgroundImage: gradientCss, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {config.suite.name}
            </span>
            <span className="text-[8px] text-white/40 uppercase tracking-widest -mt-0.5">
              {config.suite.tagline}
            </span>
          </div>

          {/* Module circle */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{
              backgroundImage: `linear-gradient(135deg, ${gradient.start}, ${gradient.mid}, ${gradient.end})`,
              boxShadow: `0 4px 12px ${gradient.start}40`,
            }}
          >
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {config.module.code}
            </span>
          </div>

          {/* Module info */}
          <div className="border-l border-white/10 pl-4">
            <h1
              className="text-lg font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: gradientCss, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {config.module.name}
            </h1>
            <p className="text-xs text-white/50">{config.module.description}</p>
          </div>
        </Link>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          <span
            className="px-3 py-1 text-sm font-bold uppercase tracking-wide rounded text-white"
            style={{
              background: gradientCss,
              boxShadow: `0 2px 4px ${gradient.start}40`,
            }}
          >
            Demo Data
          </span>
        </div>
      </nav>

      {/* ── Body (sidebar + content) ── */}
      <div className="flex flex-1 min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col pt-[68px] shrink-0 transition-transform duration-300 lg:relative lg:pt-0 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{
            background: 'var(--prizym-bg-primary)',
            borderRight: '1px solid var(--prizym-border-subtle)',
          }}
        >
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {config.nav.map((section, idx) => (
              <div key={`${idx}-${section.section}`}>
                <div
                  className="mb-2 mt-4 first:mt-0 px-3 text-[10px] font-semibold tracking-[0.15em] uppercase"
                  style={{ color: `${gradient.start}CC` }}
                >
                  {section.section}
                </div>
                {section.items.map((item) => {
                  const Icon = getIcon(item.icon);
                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                        isActive
                          ? 'bg-white/[0.10] text-white shadow-sm'
                          : 'text-white/60 hover:bg-white/[0.04] hover:text-white/80'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isActive ? '' : 'text-white/40 group-hover:text-white/60'
                        )}
                        style={isActive ? { color: gradient.start } : undefined}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8"
          style={{ background: 'var(--prizym-bg-content)' }}
        >
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer
        className="shrink-0"
        style={{ background: 'var(--prizym-bg-primary)' }}
      >
        <div className="px-6 py-3">
          {/* Section links */}
          <div className="flex items-center justify-center gap-5">
            {config.nav.map((section, idx) => (
              <span
                key={`${idx}-${section.section}`}
                className="text-[11px] font-semibold font-mono"
                style={{ color: gradient.start }}
              >
                {section.section}
              </span>
            ))}
          </div>
          {/* Attribution */}
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px] tracking-[0.1em] uppercase text-white/30">
            <span>{config.footer.copyright}</span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>
              Part of the{' '}
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: gradientCss }}
              >
                {config.suite.name}
              </span>{' '}
              {config.suite.tagline}
            </span>
            <span style={{ opacity: 0.5 }}>&bull;</span>
            <span>
              Powered by{' '}
              <span
                className="font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: gradientCss }}
              >
                {config.footer.poweredBy}
              </span>
            </span>
          </div>
        </div>
        {/* Bottom gradient bar */}
        <div className="h-1" style={{ background: gradientCss }} />
      </footer>
    </div>
  );
}
