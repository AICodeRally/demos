import type { ThemeTokens } from '../types';

export const cleanLight: ThemeTokens = {
  colors: {
    primary: '#2563EB',
    accent: '#7C3AED',
    success: '#059669',
    danger: '#DC2626',
    neutral: '#6B7280',
  },
  surfaces: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F9FAFB',
    bgContent: '#FFFFFF',
    cardBg: '#FFFFFF',
    borderDefault: '#E5E7EB',
    borderSubtle: '#F3F4F6',
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  shadows: {
    card: '0 1px 2px rgba(0,0,0,0.05)',
    elevated: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
  },
};
