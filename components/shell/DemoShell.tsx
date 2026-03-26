'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { DemoConfig } from './config/types';
import { resolveConfig } from './config/resolve';
import { resolveTokens } from './theme/resolve';
import { tokensToCssVars } from './theme/css-vars';
import { getLayout, type SharedParts } from './registry';
import { NavSection } from './parts/NavSection';
import { Footer } from './parts/Footer';
import { MobileDrawer } from './parts/MobileDrawer';
import { ThemeToggle } from './parts/ThemeToggle';
import { Icon } from './parts/IconResolver';
import { CockpitProvider } from './cockpit/store';

// Import plugins to trigger self-registration
import './plugins/sidebar';
import './plugins/topnav';
import './plugins/wizard';

const parts: SharedParts = { NavSection, Footer, MobileDrawer, ThemeToggle, Icon };

interface Props {
  config: DemoConfig;
  children: React.ReactNode;
}

export function DemoShell({ config, children }: Props) {
  const resolved = useMemo(() => resolveConfig(config), [config]);

  // Track dark mode state — syncs with ThemeToggle via custom event
  const [isDark, setIsDark] = useState(resolved.darkMode);

  useEffect(() => {
    // Read persisted preference on mount
    const stored = typeof window !== 'undefined' ? localStorage.getItem('demo-theme') : null;
    if (stored) setIsDark(stored === 'dark');

    const handler = (e: Event) => {
      const dark = (e as CustomEvent).detail?.dark;
      if (typeof dark === 'boolean') {
        // Defer to avoid setState-during-render when ThemeToggle dispatches synchronously
        queueMicrotask(() => setIsDark(dark));
      }
    };
    window.addEventListener('shell-theme-change', handler);
    return () => window.removeEventListener('shell-theme-change', handler);
  }, []);

  const cssVars = useMemo(() => {
    return tokensToCssVars(resolveTokens({
      preset: config.theme,
      colors: config.colors,
      darkMode: isDark,
    }));
  }, [config.theme, config.colors, isDark]);

  const layout = getLayout(resolved.layout);

  const content = (
    <div className="demo-shell" style={cssVars as React.CSSProperties}>
      {layout.render({ config: resolved, children, parts })}

      <Link
        href="/"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs backdrop-blur transition-colors"
        style={{
          background: 'var(--sem-bg-secondary, rgba(0,0,0,0.8))',
          color: 'var(--sem-text-secondary, rgba(255,255,255,0.8))',
          border: '1px solid var(--sem-border-subtle, transparent)',
        }}
      >
        <ArrowLeft className="h-3 w-3" />
        All Demos
      </Link>
    </div>
  );

  if (resolved.cockpit?.enabled) {
    return (
      <CockpitProvider slug={resolved.slug} defaultOpen={resolved.cockpit.defaultOpen}>
        {content}
      </CockpitProvider>
    );
  }

  return content;
}
