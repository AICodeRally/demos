import type { ThemeConfig } from '@aicr/prizym-theme';

export interface SpmNavItem {
  label: string;
  href: string;
  icon: string;
}

export interface SpmNavSection {
  section: string;
  items: SpmNavItem[];
}

export interface SpmSuiteBranding {
  name: string;
  tagline: string;
}

export interface SpmModuleBranding {
  code: string;
  name: string;
  description: string;
}

export interface SpmGradient {
  start: string;
  mid: string;
  end: string;
}

export interface SpmFooterConfig {
  copyright: string;
  poweredBy: string;
}

export interface SpmDemoConfig {
  suite: SpmSuiteBranding;
  module: SpmModuleBranding;
  gradient: SpmGradient;
  theme: ThemeConfig;
  nav: SpmNavSection[];
  footer: SpmFooterConfig;
}
