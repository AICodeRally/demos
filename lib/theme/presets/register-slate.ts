import type { ThemeTokens } from '../types';

export const registerSlate: ThemeTokens = {
  colors: {
    primary: '#1E3A5F',
    accent: '#06B6D4',
    success: '#10B981',
    danger: '#EF4444',
    neutral: '#8B5CF6',
  },
  surfaces: {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    bgContent: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderDefault: '#E2E8F0',
    borderSubtle: '#334155',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    elevated: '0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
  },
};
