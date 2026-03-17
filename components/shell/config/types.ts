import type { LucideIcon } from 'lucide-react';
import type { ThemePresetName } from '../theme/types';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface NavSection {
  section: string;
  color?: string;
  items: NavItem[];
}

interface DemoConfigBase {
  slug: string;
  client: {
    name: string;
    tagline?: string;
    region?: string;
    logo?: LucideIcon;
  };
  product: {
    name: string;
    badge?: string;
  };
  theme?: ThemePresetName;
  colors?: { primary?: string; accent?: string };
  darkMode?: boolean;
  nav?: NavSection[];
  footer?: {
    copyright?: string;
    poweredBy?: string;
  };
  meta: {
    industry: string;
    tagline: string;
    color?: string;
  };
  extensionVars?: string;
}

export interface SidebarDemoConfig extends DemoConfigBase {
  layout?: 'sidebar';
}

export interface TopnavDemoConfig extends DemoConfigBase {
  layout: 'topnav';
  suite: { name: string; tagline: string };
  module: { code: string; name: string; description: string };
  gradient: { start: string; mid: string; end: string };
}

export interface WizardStep {
  id: string;
  label: string;
  icon: string;
  skippable?: boolean;
}

export interface WizardDemoConfig extends DemoConfigBase {
  layout: 'wizard';
  wizard: {
    steps: WizardStep[];
    startInGuided?: boolean;
    showStepNumbers?: boolean;
  };
}

export type DemoConfig = SidebarDemoConfig | TopnavDemoConfig | WizardDemoConfig;

export interface ResolvedDemoConfig extends Omit<DemoConfigBase, 'theme' | 'footer'> {
  layout: 'sidebar' | 'topnav' | 'wizard';
  nav: NavSection[];
  footer: { copyright: string; poweredBy: string };
  suite?: TopnavDemoConfig['suite'];
  module?: TopnavDemoConfig['module'];
  gradient?: TopnavDemoConfig['gradient'];
  wizard?: WizardDemoConfig['wizard'];
}
