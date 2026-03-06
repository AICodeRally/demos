import type { ThemeConfig } from '@aicr/prizym-theme';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name, e.g. 'LayoutDashboard'
}

export interface NavSection {
  section: string;
  color?: string;
  items: NavItem[];
}

export interface ClientBranding {
  name: string;
  tagline: string;
  region?: string;
  logo?: LucideIcon;
}

export interface ProductBranding {
  name: string;
  badge?: string;
}

export interface FooterConfig {
  copyright: string;
  poweredBy: string;
}

export interface DemoConfig {
  client: ClientBranding;
  product: ProductBranding;
  theme: ThemeConfig;
  nav: NavSection[];
  footer: FooterConfig;
}
