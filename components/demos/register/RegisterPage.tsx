'use client';

import { Sun, Moon } from 'lucide-react';
import { useRegisterTheme } from './ThemeProvider';

interface RegisterPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function RegisterPage({ children, title, subtitle, accentColor }: RegisterPageProps) {
  const { theme, toggleTheme, increaseFontSize, decreaseFontSize } = useRegisterTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--register-bg)',
        color: 'var(--register-text)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid var(--register-border)',
          background: 'var(--register-bg-elevated)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: 0,
              borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
              paddingLeft: accentColor ? '12px' : undefined,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Font size controls */}
          <button
            onClick={decreaseFontSize}
            style={{
              background: 'var(--register-bg-surface)',
              border: '1px solid var(--register-border)',
              borderRadius: 6,
              padding: '4px 8px',
              color: 'var(--register-text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
            title="Decrease font size"
          >
            Aa-
          </button>
          <button
            onClick={increaseFontSize}
            style={{
              background: 'var(--register-bg-surface)',
              border: '1px solid var(--register-border)',
              borderRadius: 6,
              padding: '4px 8px',
              color: 'var(--register-text-muted)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
            title="Increase font size"
          >
            Aa+
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--register-bg-surface)',
              border: '1px solid var(--register-border)',
              borderRadius: 6,
              padding: '6px',
              color: 'var(--register-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}
