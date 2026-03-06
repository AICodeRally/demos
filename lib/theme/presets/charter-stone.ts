import type { ThemeTokens } from '../types';

export const charterStone: ThemeTokens = {
  colors: {
    primary: '#475569',    // Slate blue
    accent: '#B87333',     // Copper
    success: '#6B8F71',    // Sage green
    danger: '#B91C1C',     // Brick red
    neutral: '#64748B',    // Slate-500
  },
  surfaces: {
    bgPrimary: '#1E293B',    // Charcoal sidebar
    bgSecondary: '#0F172A',  // Darker sidebar gradient
    bgContent: '#F5F5F0',    // Warm gray content
    cardBg: '#FFFFFF',       // White cards
    borderDefault: '#D6D3D1', // Stone-300
    borderSubtle: '#E7E5E4',  // Stone-200
  },
  text: {
    primary: '#1C1917',    // Stone-900
    secondary: '#57534E',  // Stone-600
    muted: '#A8A29E',      // Stone-400
    inverse: '#FAFAF9',    // Stone-50
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.08)',
    elevated: '0 4px 12px rgba(0,0,0,0.12)',
  },
};
