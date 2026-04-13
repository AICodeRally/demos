'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Inter } from 'next/font/google';

const sgmSans = Inter({
  subsets: ['latin'],
  variable: '--font-sgm-sans',
});

interface ThemeContextValue {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  fontSize: 18,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function usePrizymTheme() {
  return useContext(ThemeContext);
}

export function PrizymThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSize = localStorage.getItem('prizym-gov-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('prizym-gov-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const increaseFontSize = useCallback(() => setFontSize(s => Math.min(s + 2, 28)), []);
  const decreaseFontSize = useCallback(() => setFontSize(s => Math.max(s - 2, 15)), []);

  return (
    <ThemeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize }}>
      <div className={sgmSans.variable} style={{ fontFamily: 'var(--font-sgm-sans), Inter, system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
