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
};

const DARK_TOKENS: Record<string, string> = {
  '--register-bg': '#0F0E1A',
  '--register-bg-elevated': '#1A1830',
  '--register-bg-surface': '#1E1B4B',
  '--register-border': '#312E5C',
  '--register-text': '#E2E8F0',
  '--register-text-muted': '#94A3B8',
  '--register-text-dim': '#64748B',
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
    const saved = localStorage.getItem('register-theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') setTheme(saved);
    const savedSize = localStorage.getItem('register-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);
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
