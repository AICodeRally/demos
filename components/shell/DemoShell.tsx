'use client';

import { useMemo } from 'react';
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
  const cssVars = useMemo(() => {
    return tokensToCssVars(resolveTokens({
      preset: config.theme,
      colors: config.colors,
      darkMode: resolved.darkMode,
    }));
  }, [config.theme, config.colors, resolved.darkMode]);

  const layout = getLayout(resolved.layout);

  const content = (
    <div style={cssVars as React.CSSProperties}>
      {layout.render({ config: resolved, children, parts })}

      <Link
        href="/"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition-colors hover:text-white"
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
