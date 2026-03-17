'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'demo-theme';
const EVENT_NAME = 'shell-theme-change';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const legacy = localStorage.getItem('proofline-theme');
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem('proofline-theme');
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const dark = stored ? stored === 'dark' : true;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { dark: next } }));
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 transition-colors hover:bg-white/10"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-4 w-4 text-[var(--sem-text-muted)]" /> : <Moon className="h-4 w-4 text-[var(--sem-text-muted)]" />}
    </button>
  );
}
