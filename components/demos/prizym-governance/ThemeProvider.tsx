'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
      <div className={spaceGrotesk.variable} style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
