'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createThemeVars, resolveTheme } from '@/lib/theme';
import type { DemoConfig, NavSection } from './types';

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return twMerge(clsx(inputs));
}

function getIcon(name: string): LucideIcons.LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>;
  return icons[name] ?? LucideIcons.Circle;
}

interface DemoShellProps {
  config: DemoConfig;
  children: React.ReactNode;
}

export function DemoShell({ config, children }: DemoShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true); // default: dark
  const [expandedSections, setExpandedSections] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (!config.darkMode) return;
    const saved = localStorage.getItem('proofline-theme');
    if (saved === 'light') setIsDark(false);
    if (saved === 'dark') setIsDark(true);
  }, [config.darkMode]);

  useEffect(() => {
    const storageKey = `demoshell-nav-state-${config.product.name}`;
    const saved = localStorage.getItem(storageKey);
    let initial: Set<number>;

    if (saved) {
      try {
        initial = new Set(JSON.parse(saved) as number[]);
      } catch {
        initial = new Set();
      }
    } else {
      initial = new Set();
    }

    // Always expand the section containing the active route
    const activeIdx = config.nav.findIndex((section) =>
      section.items.some((item) =>
        item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
      )
    );
    if (activeIdx !== -1) initial.add(activeIdx);

    setExpandedSections(initial);
  }, [pathname, config.product.name, config.nav]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('proofline-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const toggleSection = (idx: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      const storageKey = `demoshell-nav-state-${config.product.name}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const themeVars = createThemeVars(config.theme);
  const resolved = resolveTheme(config.theme);
  const primaryColor = resolved.colors.primary;

  // Flatten nav items for active detection
  const allItems = config.nav.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.section, color: section.color }))
  );

  const currentNav = allItems.find((n) =>
    n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href)
  );
  const sectionColor = currentNav?.color ?? primaryColor;

  // Logo icon & home path (link logo to demo root, not site index)
  const LogoIcon = config.client.logo ?? LucideIcons.Circle;
  const demoBase = pathname?.match(/^\/[^/]+/)?.[0] ?? '/';

  return (
    <div className={`h-screen flex overflow-hidden${config.darkMode && isDark ? ' dark' : ''}`} style={themeVars as React.CSSProperties}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed, full height */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: config.darkMode
            ? `linear-gradient(180deg, var(--pl-sidebar-bg-start) 0%, var(--pl-sidebar-bg-end) 100%)`
            : `linear-gradient(180deg, var(--prizym-bg-secondary) 0%, var(--prizym-bg-primary) 100%)`,
        }}
      >
        {/* Logo */}
        <Link
          href={demoBase}
          className="flex flex-col px-6 py-5 hover:bg-white/[0.02] transition-colors"
          style={{ borderBottom: `1px solid ${config.darkMode ? 'var(--pl-sidebar-border)' : 'var(--prizym-border-subtle)'}` }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${resolved.colors.accent} 100%)`,
                boxShadow: `0 4px 12px ${primaryColor}40`,
              }}
            >
              <LogoIcon className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <div
                className={cn("text-[19px] font-bold tracking-wide", !config.darkMode && "text-white")}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  ...(config.darkMode ? { color: 'var(--pl-sidebar-text)' } : {}),
                }}
              >
                {config.product.name.toUpperCase()}
              </div>
              <div
                className="text-[10px] font-semibold tracking-[0.12em] uppercase"
                style={{ color: config.darkMode ? 'var(--pl-sidebar-text-muted)' : `${primaryColor}AA` }}
              >
                {config.client.tagline}
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-5">
          {config.nav.map((section, idx) => {
            const sectionClr = section.color ?? primaryColor;
            const isExpanded = expandedSections.has(idx);

            return (
              <div key={`${idx}-${section.section}`}>
                {/* Collapsible section header */}
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between mb-2 mt-4 first:mt-0 px-3 py-0.5 rounded transition-colors hover:bg-white/[0.03] group"
                >
                  <span
                    className="text-[10px] font-semibold tracking-[0.15em] uppercase text-left"
                    style={{ color: `${sectionClr}CC` }}
                  >
                    {section.section}
                  </span>
                  {isExpanded ? (
                    <LucideIcons.ChevronDown
                      className="h-3 w-3 transition-transform duration-200"
                      style={{ color: `${sectionClr}66` }}
                    />
                  ) : (
                    <LucideIcons.ChevronRight
                      className="h-3 w-3 transition-transform duration-200"
                      style={{ color: `${sectionClr}44` }}
                    />
                  )}
                </button>

                {/* Section items — only rendered when expanded */}
                {isExpanded && section.items.map((item) => {
                  const Icon = getIcon(item.icon);
                  const isActive =
                    item.href === '/' ? pathname === '/' : pathname === item.href;
                  const itemColor = sectionClr;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                        config.darkMode
                          ? isActive
                            ? 'shadow-sm'
                            : ''
                          : isActive
                          ? 'bg-white/[0.10] text-white shadow-sm'
                          : 'text-white/65 hover:bg-white/[0.04] hover:text-white/80'
                      )}
                      style={config.darkMode ? {
                        background: isActive ? 'var(--pl-sidebar-active-bg)' : undefined,
                        color: isActive ? 'var(--pl-sidebar-text)' : 'var(--pl-sidebar-text-muted)',
                      } : undefined}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors',
                          !config.darkMode && !isActive ? 'text-white/50 group-hover:text-white/60' : ''
                        )}
                        style={isActive ? { color: itemColor } : config.darkMode ? { color: 'var(--pl-sidebar-text-muted)' } : undefined}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && (
                        <LucideIcons.ChevronRight
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: `${itemColor}66` }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Client info */}
        <div className="p-4" style={{ borderTop: `1px solid ${config.darkMode ? 'var(--pl-sidebar-border)' : 'var(--prizym-border-subtle)'}` }}>
          <div
            className="rounded-xl p-3.5"
            style={{ background: `${primaryColor}0F` }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: `${primaryColor}1F` }}
              >
                <LogoIcon className="h-4 w-4" style={{ color: primaryColor }} />
              </div>
              <div>
                <div
                  className={cn("text-[13px] font-semibold", !config.darkMode && "text-white/90")}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    ...(config.darkMode ? { color: 'var(--pl-sidebar-text)' } : {}),
                  }}
                >
                  {config.client.name}
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: primaryColor }}
                  />
                  <span className="text-[11px]" style={{ color: `${primaryColor}99` }}>
                    {config.product.badge ?? 'Live Demo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* Main content — fills remaining width, full height, internal scroll */}
      <div className="flex min-w-0 flex-1 flex-col h-screen">
        {/* Top bar — fixed at top */}
        <header
          className="shrink-0 z-30 flex h-14 items-center px-6 lg:px-8 backdrop-blur-xl"
          style={{
            background: config.darkMode
              ? `var(--pl-header-bg)`
              : `color-mix(in srgb, var(--prizym-bg-content) 95%, transparent)`,
            borderBottom: `1px solid var(--prizym-border-default)`,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/[0.06] lg:hidden"
            >
              {sidebarOpen ? (
                <LucideIcons.X className="h-5 w-5" style={{ color: 'var(--prizym-text-secondary)' }} />
              ) : (
                <LucideIcons.Menu className="h-5 w-5" style={{ color: 'var(--prizym-text-secondary)' }} />
              )}
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${resolved.colors.accent} 100%)`,
                  boxShadow: `0 2px 8px ${primaryColor}30`,
                }}
              >
                <LogoIcon className="h-4 w-4 text-white" />
              </div>
              <span
                className="text-[13px] font-bold"
                style={{ color: 'var(--prizym-text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {config.client.name.toUpperCase()}
              </span>
              <span
                className="text-[11px] font-mono hidden sm:inline"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {config.client.tagline}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {config.darkMode && (
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{ background: 'var(--pl-hover, rgba(0,0,0,0.04))' }}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <LucideIcons.Sun className="h-4 w-4" style={{ color: '#F59E0B' }} />
                ) : (
                  <LucideIcons.Moon className="h-4 w-4" style={{ color: 'var(--pl-text-muted)' }} />
                )}
              </button>
            )}
            <div
              className="flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[13px] font-medium shadow-sm shimmer"
              style={{
                border: `1px solid ${primaryColor}40`,
                background: `${primaryColor}0F`,
                color: primaryColor,
              }}
            >
              <div
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: primaryColor, boxShadow: `0 0 6px ${primaryColor}66` }}
              />
              {config.product.badge ?? 'Interactive Demo'}
            </div>
          </div>
        </header>

        {/* Page content — this is the ONLY thing that scrolls */}
        <main
          className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8"
          style={{ background: config.darkMode ? 'var(--pl-bg)' : 'var(--prizym-bg-content)' }}
        >
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>

        {/* Footer — fixed at bottom */}
        <footer
          className="shrink-0"
          style={{
            background: config.darkMode ? 'var(--pl-footer-bg)' : 'var(--prizym-bg-content)',
            borderTop: `1px solid var(--prizym-border-default)`,
          }}
        >
          <div className="px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-5">
              {config.nav.map((section, idx) => (
                <span
                  key={`${idx}-${section.section}`}
                  className="text-[11px] font-semibold font-mono"
                  style={{ color: section.color ?? primaryColor }}
                >
                  {section.section}
                </span>
              ))}
            </div>
            <div
              className="mt-2 flex items-center justify-center gap-3 text-[10px] tracking-[0.1em] uppercase"
              style={{ color: 'var(--prizym-text-muted)', opacity: 0.5 }}
            >
              <span>{config.footer.copyright}</span>
              <span style={{ opacity: 0.5 }}>&bull;</span>
              <span>
                Powered by{' '}
                <span className="font-bold" style={{ color: 'var(--prizym-text-secondary)' }}>
                  {config.footer.poweredBy.toUpperCase()}
                </span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
