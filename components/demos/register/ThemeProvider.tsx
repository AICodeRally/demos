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
  fontSize: 16,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function useRegisterTheme() {
  return useContext(ThemeContext);
}

const LIGHT_TOKENS: Record<string, string> = {
  '--register-bg': '#F8FAFC',
  '--register-bg-elevated': '#FFFFFF',
  '--register-bg-surface': '#F1F5F9',
  '--register-border': '#E2E8F0',
  '--register-text': '#0F172A',
  '--register-text-muted': '#64748B',
  '--register-text-dim': '#94A3B8',
  '--register-shadow-card': '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  '--register-shadow-card-hover': '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
};

const DARK_TOKENS: Record<string, string> = {
  '--register-bg': '#0B1220',
  '--register-bg-elevated': '#111B2E',
  '--register-bg-surface': '#18263B',
  '--register-border': '#1E3A5F40',
  '--register-text': '#E2E8F0',
  '--register-text-muted': '#94A3B8',
  '--register-text-dim': '#64748B',
  '--register-shadow-card': '0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)',
  '--register-shadow-card-hover': '0 8px 24px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2)',
};

const SHARED_TOKENS: Record<string, string> = {
  '--register-primary': '#1E3A5F',
  '--register-accent': '#06B6D4',
  '--register-ai': '#8B5CF6',
  '--register-success': '#10B981',
  '--register-warning': '#F59E0B',
  '--register-danger': '#EF4444',
};

export function RegisterThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync with DemoShell's theme (proofline-theme key) or fall back to own key
    const shellTheme = localStorage.getItem('proofline-theme') as Theme | null;
    const ownTheme = localStorage.getItem('register-theme') as Theme | null;
    const resolved = shellTheme ?? ownTheme;
    if (resolved === 'light' || resolved === 'dark') setTheme(resolved);
    const savedSize = localStorage.getItem('register-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);

    // Listen for DemoShell theme changes (same-tab custom event)
    const handleShellToggle = () => {
      const t = localStorage.getItem('proofline-theme') as Theme | null;
      if (t === 'light' || t === 'dark') setTheme(t);
    };
    window.addEventListener('demoshell-theme-change', handleShellToggle);
    // Cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'proofline-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('demoshell-theme-change', handleShellToggle);
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
    localStorage.setItem('register-theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('register-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((s) => Math.min(s + 2, 24));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((s) => Math.max(s - 2, 12));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}>
      <div className={`${spaceGrotesk.variable}`} style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
