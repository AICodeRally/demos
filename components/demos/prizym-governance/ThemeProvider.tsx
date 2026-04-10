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

export function PrizymThemeProvider({ children }: { children: React.ReactNode }) {
  // Theme is owned by the demo-shell ThemeToggle, which toggles .dark on
  // documentElement and writes localStorage.demo-theme. We observe that class
  // so our context value stays in sync with the CSS :root / .dark rules in
  // styles/ext/prizym-governance.css — no duplicate CSS-var injection here.
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const readTheme = (): Theme => (root.classList.contains('dark') ? 'dark' : 'light');

    setTheme(readTheme());

    const savedSize = localStorage.getItem('prizym-gov-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);

    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    const handleShellToggle = () => queueMicrotask(() => setTheme(readTheme()));
    window.addEventListener('shell-theme-change', handleShellToggle);

    return () => {
      observer.disconnect();
      window.removeEventListener('shell-theme-change', handleShellToggle);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('prizym-gov-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains('dark');
    root.classList.toggle('dark', nextDark);
    localStorage.setItem('demo-theme', nextDark ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('shell-theme-change', { detail: { dark: nextDark } }));
  }, []);

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
