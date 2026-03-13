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
    bgPrimary: '#0B1220',
    bgSecondary: '#111B2E',
    bgContent: '#0B1220',
    cardBg: '#111B2E',
    borderDefault: '#1E3A5F40',
    borderSubtle: '#1E3A5F30',
  },
  text: {
    primary: '#E2E8F0',
    secondary: '#94A3B8',
    muted: '#64748B',
    inverse: '#0B1220',
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)',
    elevated: '0 8px 24px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)',
  },
};
