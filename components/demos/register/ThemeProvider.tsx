'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
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

export function useRegisterTheme() {
  return useContext(ThemeContext);
}

const LIGHT_TOKENS: Record<string, string> = {
  '--register-bg': '#F8FAFC',
  '--register-bg-elevated': '#FFFFFF',
  '--register-bg-surface': '#F1F5F9',
  '--register-border': '#CBD5E1',
  '--register-border-strong': '#94A3B8',
  '--register-text': '#0F172A',
  '--register-text-muted': '#1F2937',
  '--register-text-dim': '#334155',
  '--register-shadow-card': '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
  '--register-shadow-card-hover': '0 8px 24px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.06)',
  '--register-chart-grid': '#E2E8F0',
  '--register-chart-axis': '#64748B',
  '--register-chart-label': '#334155',
  '--register-chart-tooltip-bg': '#FFFFFF',
  '--register-chart-tooltip-border': '#CBD5E1',
};

const DARK_TOKENS: Record<string, string> = {
  '--register-bg': '#0B1220',
  '--register-bg-elevated': '#111B2E',
  '--register-bg-surface': '#18263B',
  '--register-border': '#1E3A5F',
  '--register-border-strong': '#334155',
  '--register-text': '#FFFFFF',
  '--register-text-muted': '#E2E8F0',
  '--register-text-dim': '#CBD5E1',
  '--register-shadow-card': '0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)',
  '--register-shadow-card-hover': '0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
  '--register-chart-grid': '#1E293B',
  '--register-chart-axis': '#CBD5E1',
  '--register-chart-label': '#E2E8F0',
  '--register-chart-tooltip-bg': '#0F172A',
  '--register-chart-tooltip-border': '#334155',
};

const SHARED_TOKENS: Record<string, string> = {
  '--register-primary': '#1E40AF',
  '--register-primary-strong': '#1E3A8A',
  '--register-accent': '#0891B2',
  '--register-ai': '#7C3AED',
  '--register-success': '#059669',
  '--register-warning': '#D97706',
  '--register-danger': '#DC2626',
  // High-contrast chart palette — distinguishable on both light/dark, projector-safe
  '--register-chart-1': '#1E40AF',
  '--register-chart-2': '#0891B2',
  '--register-chart-3': '#059669',
  '--register-chart-4': '#D97706',
  '--register-chart-5': '#DC2626',
  '--register-chart-6': '#7C3AED',
  '--register-chart-7': '#DB2777',
  '--register-chart-8': '#475569',
};

export function RegisterThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync with DemoShell's theme (demo-theme key) or fall back to own key
    const shellTheme = localStorage.getItem('demo-theme') as Theme | null;
    const ownTheme = localStorage.getItem('register-theme') as Theme | null;
    const resolved = shellTheme ?? ownTheme;
    if (resolved === 'light' || resolved === 'dark') setTheme(resolved);
    const savedSize = localStorage.getItem('register-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);

    // Listen for DemoShell theme changes (same-tab custom event)
    const handleShellToggle = (e: Event) => {
      const dark = (e as CustomEvent).detail?.dark;
      if (typeof dark === 'boolean') {
        setTheme(dark ? 'dark' : 'light');
      } else {
        // Fallback: read from localStorage
        const t = localStorage.getItem('demo-theme') as Theme | null;
        if (t === 'light' || t === 'dark') setTheme(t);
      }
    };
    window.addEventListener('shell-theme-change', handleShellToggle);
    // Cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'demo-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
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
    setFontSize((s) => Math.min(s + 2, 28));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((s) => Math.max(s - 2, 15));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, increaseFontSize, decreaseFontSize }}>
      <div
        className={`register-root ${inter.variable}`}
        style={{
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          fontFeatureSettings: '"cv11", "ss01", "ss03"',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
