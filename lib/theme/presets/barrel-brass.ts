import type { ThemeTokens } from '../types';

export const barrelBrass: ThemeTokens = {
  colors: {
    primary: '#E879F9',
    accent: '#F59E0B',
    success: '#22D3EE',
    danger: '#F87171',
    neutral: '#38BDF8',
  },
  surfaces: {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    bgContent: '#0F172A',
    cardBg: '#FFFFFF',
    borderDefault: '#E2E8F0',
    borderSubtle: 'rgba(232,121,249,0.12)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#64748B',
    inverse: '#FFFFFF',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    elevated: '0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
  },
};
