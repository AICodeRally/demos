'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  fontSize: 18,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function usePrizymTheme() {
  return useContext(ThemeContext);
}

const LIGHT_TOKENS: Record<string, string> = {
  '--pg-bg': '#f8fafc',
  '--pg-card': '#ffffff',
  '--pg-card-alt': '#f7fafc',
  '--pg-border': '#e2e8f0',
  '--pg-border-faint': '#edf2f7',
  '--pg-text': '#0f172a',
  '--pg-text-secondary': '#1e293b',
  '--pg-text-muted': '#334155',
  '--pg-text-faint': '#64748b',
  '--pg-shadow': '0 1px 3px rgba(0,0,0,0.06)',
  '--pg-hover': 'rgba(0,0,0,0.04)',
  '--pg-stripe': '#f1f5f9',
  '--pg-surface-alt': '#f1f5f9',
  '--pg-cyan-bg': 'rgba(14,165,233,0.08)',
  '--pg-accent-bg': 'rgba(139,92,246,0.08)',
  '--pg-gold-bg': 'rgba(201,148,43,0.08)',
  '--pl-sidebar-bg-start': '#ffffff',
  '--pl-sidebar-bg-end': '#f1f5f9',
  '--pl-sidebar-text': '#0f172a',
  '--pl-sidebar-text-muted': '#475569',
  '--pl-sidebar-border': '#e2e8f0',
};

const DARK_TOKENS: Record<string, string> = {
  '--pg-bg': '#0f172a',
  '--pg-card': '#1e293b',
  '--pg-card-alt': '#162032',
  '--pg-border': '#334155',
  '--pg-border-faint': '#1e293b',
  '--pg-text': '#f1f5f9',
  '--pg-text-secondary': '#cbd5e0',
  '--pg-text-muted': '#94a3b8',
  '--pg-text-faint': '#64748b',
  '--pg-shadow': '0 1px 3px rgba(0,0,0,0.3)',
  '--pg-hover': 'rgba(255,255,255,0.04)',
  '--pg-stripe': 'rgba(255,255,255,0.03)',
  '--pg-surface-alt': '#1e293b',
  '--pg-cyan-bg': 'rgba(14,165,233,0.12)',
  '--pg-accent-bg': 'rgba(139,92,246,0.12)',
  '--pg-gold-bg': 'rgba(201,148,43,0.12)',
  '--pl-sidebar-bg-start': '#1e293b',
  '--pl-sidebar-bg-end': '#0f172a',
  '--pl-sidebar-text': '#ffffff',
  '--pl-sidebar-text-muted': 'rgba(255,255,255,0.65)',
  '--pl-sidebar-border': 'rgba(139,92,246,0.18)',
};

const SHARED_TOKENS: Record<string, string> = {
  // SPARCC SPM palette — Blue → Indigo → Violet gradient (from Summit SGM themes.ts)
  '--pg-gradient-start': '#0ea5e9',  // sky
  '--pg-gradient-mid1':  '#3b82f6',  // blue
  '--pg-gradient-mid2':  '#6366f1',  // indigo
  '--pg-gradient-end':   '#8b5cf6',  // violet

  '--pg-primary':   '#0ea5e9',
  '--pg-secondary': '#6366f1',
  '--pg-accent':    '#8b5cf6',

  // Quadrant colors — tuned to the SPARCC range for visual coherence
  '--pg-design':  '#0ea5e9',  // sky (Design quadrant)
  '--pg-operate': '#3b82f6',  // blue (Operate quadrant)
  '--pg-dispute': '#6366f1',  // indigo (Dispute quadrant — new)
  '--pg-oversee': '#8b5cf6',  // violet (Oversee quadrant)

  // Status colors (unchanged — universal)
  '--pg-success': '#10b981',
  '--pg-warning': '#f59e0b',
  '--pg-danger':  '#ef4444',
  '--pg-info':    '#3b82f6',

  // Back-compat aliases — legacy CSS still reads these
  '--pg-navy': '#0f172a',
  '--pg-cyan': '#0ea5e9', // legacy alias — now points at SPARCC primary
  '--pg-gold': '#c9942b',
};

export function PrizymThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const shellTheme = localStorage.getItem('demo-shell-theme') as Theme | null;
    const ownTheme = localStorage.getItem('prizym-gov-theme') as Theme | null;
    const resolved = shellTheme ?? ownTheme;
    if (resolved === 'light' || resolved === 'dark') setTheme(resolved);
    const savedSize = localStorage.getItem('prizym-gov-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);

    const handleShellToggle = () => {
      queueMicrotask(() => {
        const t = localStorage.getItem('demo-shell-theme') as Theme | null;
        if (t === 'light' || t === 'dark') setTheme(t);
      });
    };
    window.addEventListener('shell-theme-change', handleShellToggle);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'demo-shell-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('shell-theme-change', handleShellToggle);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
    const root = document.documentElement;
    for (const [key, value] of Object.entries({ ...tokens, ...SHARED_TOKENS })) {
      root.style.setProperty(key, value);
    }
    localStorage.setItem('prizym-gov-theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('prizym-gov-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  const increaseFontSize = useCallback(() => setFontSize(s => Math.min(s + 2, 28)), []);
  const decreaseFontSize = useCallback(() => setFontSize(s => Math.max(s - 2, 15)), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}>
      <div className={spaceGrotesk.variable} style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
