import type { ThemePresetDef } from '../types';
import { generateShades } from '../shade';

/**
 * sgm-compliance — Sales Governance Manager (client product theme)
 *
 * Single-mode gradient-glass aesthetic tuned to compliance buyers (CCO,
 * auditor, comp manager). Deep trust blue → confident teal → compliant
 * emerald gradient on body, dark navy glass sidebar/header, translucent
 * white glass cards throughout.
 *
 * Both theme.semantic.dark and theme.semantic.light are set to the same
 * values so the theme toggle (if ever re-enabled) is a no-op — this is
 * a single-theme product.
 */
const sharedSemantic = {
  bgPrimary: 'transparent',
  bgSecondary: 'rgba(15,23,42,0.45)',
  bgContent: 'transparent',
  cardBg: 'rgba(255,255,255,0.12)',
  textPrimary: '#ffffff',
  textSecondary: '#f1f5f9',
  textMuted: '#e2e8f0',
  textInverse: '#0f172a',
  borderDefault: 'rgba(255,255,255,0.22)',
  borderSubtle: 'rgba(255,255,255,0.14)',
  shadowCard: '0 6px 18px rgba(15,23,42,0.22)',
  shadowElevated: '0 14px 40px rgba(15,23,42,0.32)',
};

const sharedComponent = {
  sidebarBg: 'rgba(15,23,42,0.55)',
  sidebarText: '#ffffff',
  sidebarTextMuted: 'rgba(255,255,255,0.82)',
  sidebarBorder: 'rgba(255,255,255,0.16)',
  sidebarActiveAccent: '#10b981',
  headerBg: 'rgba(15,23,42,0.5)',
  headerBorder: 'rgba(255,255,255,0.16)',
  footerBg: 'rgba(15,23,42,0.45)',
  navSectionLabel: 'rgba(255,255,255,0.82)',
  progressBarFill: '#10b981',
};

export const sgmCompliance: ThemePresetDef = {
  palette: {
    primary: generateShades('#0891b2'),
    accent: generateShades('#10b981'),
    neutral: generateShades('#64748b'),
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  semantic: { dark: sharedSemantic, light: sharedSemantic },
  component: { dark: sharedComponent, light: sharedComponent },
};
