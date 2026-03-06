import type { ThemeTokens } from '../types';

export const midnight: ThemeTokens = {
  colors: {
    primary: '#3B82F6',
    accent: '#06B6D4',
    success: '#10B981',
    danger: '#EF4444',
    neutral: '#6B7280',
  },
  surfaces: {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    bgContent: '#1E293B',
    cardBg: '#334155',
    borderDefault: '#475569',
    borderSubtle: 'rgba(59,130,246,0.15)',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    muted: '#64748B',
    inverse: '#0F172A',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
    elevated: '0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
  },
};
