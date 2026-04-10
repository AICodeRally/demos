import type { ThemePresetDef } from '../types';
import { generateShades } from '../shade';

/**
 * sgm-glass — Sales Governance Manager
 *
 * Dark mode: navy glass with frosted translucent cards on near-black bg
 * Light mode: SPARCC cyan→blue→indigo→purple gradient body, dark-navy
 *             sidebar/header chrome, translucent white glass cards, all
 *             text white. Mirrors the original Summit SGM demo aesthetic.
 *
 * Design principle: every surface is translucent glass (rgba white or
 * rgba navy) so the gradient shows through. Text is always white or
 * near-white — never the banned slate-400/500 muted grays.
 */
export const sgmGlass: ThemePresetDef = {
  palette: {
    primary: generateShades('#06b6d4'), // cyan — SPARCC start
    accent: generateShades('#8b5cf6'),  // violet — SPARCC end
    neutral: generateShades('#64748b'),
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  semantic: {
    dark: {
      bgPrimary: '#0a0f1e',
      bgSecondary: 'rgba(30,41,59,0.5)',
      bgContent: 'transparent',
      cardBg: 'rgba(30,41,59,0.7)',
      textPrimary: '#ffffff',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      textInverse: '#0f172a',
      borderDefault: 'rgba(148,163,184,0.25)',
      borderSubtle: 'rgba(148,163,184,0.12)',
      shadowCard: '0 2px 8px rgba(0,0,0,0.3)',
      shadowElevated: '0 8px 24px rgba(99,102,241,0.12)',
    },
    light: {
      // Light mode paints the body with the SPARCC gradient (via
      // prizym-governance.css) and uses translucent glass surfaces so
      // the gradient shows through everywhere.
      bgPrimary: 'transparent',
      bgSecondary: 'rgba(15,23,42,0.45)',
      bgContent: 'transparent',
      cardBg: 'rgba(255,255,255,0.12)',
      textPrimary: '#ffffff',
      textSecondary: '#f1f5f9',
      textMuted: '#e2e8f0',
      textInverse: '#0f172a',
      borderDefault: 'rgba(255,255,255,0.2)',
      borderSubtle: 'rgba(255,255,255,0.12)',
      shadowCard: '0 6px 18px rgba(15,23,42,0.18)',
      shadowElevated: '0 14px 40px rgba(15,23,42,0.28)',
    },
  },
  component: {
    dark: {
      sidebarBg: 'rgba(15,23,42,0.85)',
      sidebarText: '#ffffff',
      sidebarTextMuted: 'rgba(255,255,255,0.72)',
      sidebarBorder: 'rgba(14,165,233,0.18)',
      sidebarActiveAccent: '#06b6d4',
      headerBg: 'rgba(10,15,30,0.9)',
      headerBorder: 'rgba(14,165,233,0.2)',
      footerBg: 'rgba(10,15,30,0.9)',
      navSectionLabel: 'rgba(255,255,255,0.72)',
      progressBarFill: '#06b6d4',
    },
    light: {
      sidebarBg: 'rgba(15,23,42,0.55)',
      sidebarText: '#ffffff',
      sidebarTextMuted: 'rgba(255,255,255,0.82)',
      sidebarBorder: 'rgba(255,255,255,0.16)',
      sidebarActiveAccent: '#ffffff',
      headerBg: 'rgba(15,23,42,0.5)',
      headerBorder: 'rgba(255,255,255,0.16)',
      footerBg: 'rgba(15,23,42,0.45)',
      navSectionLabel: 'rgba(255,255,255,0.82)',
      progressBarFill: '#ffffff',
    },
  },
};
