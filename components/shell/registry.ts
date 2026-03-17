import type { ResolvedDemoConfig } from './config/types';
import type { ReactElement, ReactNode } from 'react';

export interface SharedParts {
  NavSection: typeof import('./parts/NavSection').NavSection;
  Footer: typeof import('./parts/Footer').Footer;
  MobileDrawer: typeof import('./parts/MobileDrawer').MobileDrawer;
  ThemeToggle: typeof import('./parts/ThemeToggle').ThemeToggle;
  Icon: typeof import('./parts/IconResolver').Icon;
}

export interface ShellLayout {
  id: string;
  label: string;
  render(props: {
    config: ResolvedDemoConfig;
    children: ReactNode;
    parts: SharedParts;
  }): ReactElement;
  configSchema?: import('zod').ZodSchema;
}

const LAYOUTS = new Map<string, ShellLayout>();

export function registerLayout(layout: ShellLayout) {
  LAYOUTS.set(layout.id, layout);
}

export function getLayout(id: string): ShellLayout {
  const layout = LAYOUTS.get(id);
  if (!layout) return LAYOUTS.get('sidebar')!;
  return layout;
}
