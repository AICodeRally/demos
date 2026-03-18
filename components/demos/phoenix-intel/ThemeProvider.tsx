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

export function usePhoenixTheme() {
  return useContext(ThemeContext);
}

const LIGHT_TOKENS: Record<string, string> = {
  '--pi-bg': '#f8fafc',
  '--pi-card': '#ffffff',
  '--pi-card-alt': '#f7fafc',
  '--pi-border': '#e2e8f0',
  '--pi-border-faint': '#edf2f7',
  '--pi-text': '#0f172a',
  '--pi-text-secondary': '#1e293b',
  '--pi-text-muted': '#334155',
  '--pi-text-faint': '#64748b',
  '--pi-shadow': '0 1px 3px rgba(0,0,0,0.06)',
  '--pi-hover': 'rgba(0,0,0,0.04)',
  '--pi-stripe': '#f1f5f9',
  '--pi-surface-alt': '#f1f5f9',
  '--pi-sapphire-bg': 'rgba(59,107,245,0.08)',
  '--pi-gold-bg': 'rgba(201,148,43,0.08)',
  '--pi-ai-fill': '#f3effe',
  // Sidebar — white/off-white with dark text
  '--pl-sidebar-bg-start': '#ffffff',
  '--pl-sidebar-bg-end': '#f1f5f9',
  '--pl-sidebar-text': '#0f172a',
  '--pl-sidebar-text-muted': '#475569',
  '--pl-sidebar-border': '#e2e8f0',
};

const DARK_TOKENS: Record<string, string> = {
  '--pi-bg': '#0f172a',
  '--pi-card': '#1e293b',
  '--pi-card-alt': '#162032',
  '--pi-border': '#334155',
  '--pi-border-faint': '#1e293b',
  '--pi-text': '#f1f5f9',
  '--pi-text-secondary': '#cbd5e0',
  '--pi-text-muted': '#94a3b8',
  '--pi-text-faint': '#64748b',
  '--pi-shadow': '0 1px 3px rgba(0,0,0,0.3)',
  '--pi-hover': 'rgba(255,255,255,0.04)',
  '--pi-stripe': 'rgba(255,255,255,0.03)',
  '--pi-surface-alt': '#1e293b',
  '--pi-sapphire-bg': 'rgba(59,107,245,0.12)',
  '--pi-gold-bg': 'rgba(201,148,43,0.12)',
  '--pi-ai-fill': '#1a1530',
  // Sidebar — dark navy with light text
  '--pl-sidebar-bg-start': '#1e293b',
  '--pl-sidebar-bg-end': '#0f172a',
  '--pl-sidebar-text': '#ffffff',
  '--pl-sidebar-text-muted': 'rgba(255,255,255,0.65)',
  '--pl-sidebar-border': 'rgba(59,107,245,0.12)',
};

const SHARED_TOKENS: Record<string, string> = {
  '--pi-sapphire': '#3b6bf5',
  '--pi-gold': '#c9942b',
  '--pi-purpose': '#facc15',
  '--pi-people': '#7c3aed',
  '--pi-process': '#2563eb',
  '--pi-practice': '#c026d3',
  '--pi-pipeline': '#db2777',
  '--pi-profit': '#10b981',
};

export function PhoenixThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Shell uses 'demo-shell-theme'; fall back to legacy 'proofline-theme' for compat
    const shellTheme = (localStorage.getItem('demo-shell-theme') ?? localStorage.getItem('proofline-theme')) as Theme | null;
    const ownTheme = localStorage.getItem('phoenix-theme') as Theme | null;
    const resolved = shellTheme ?? ownTheme;
    if (resolved === 'light' || resolved === 'dark') setTheme(resolved);
    const savedSize = localStorage.getItem('phoenix-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);

    const handleShellToggle = () => {
      queueMicrotask(() => {
        const t = (localStorage.getItem('demo-shell-theme') ?? localStorage.getItem('proofline-theme')) as Theme | null;
        if (t === 'light' || t === 'dark') setTheme(t);
      });
    };
    window.addEventListener('shell-theme-change', handleShellToggle);
    const handleStorage = (e: StorageEvent) => {
      if ((e.key === 'demo-shell-theme' || e.key === 'proofline-theme') && (e.newValue === 'light' || e.newValue === 'dark')) {
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
    localStorage.setItem('phoenix-theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('phoenix-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((s) => Math.min(s + 2, 28));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((s) => Math.max(s - 2, 15));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}>
      <div className={`${spaceGrotesk.variable}`} style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
