'use client';

import React, { useState, useEffect } from 'react';
import { usePrizymTheme } from '../ThemeProvider';
import { AskSGMChat } from './AskSGMChat';

export function AskSGMPanel() {
  const { theme } = usePrizymTheme();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false)

  const C = {
    border: isDark ? '#334155' : '#e2e8f0',
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            borderRadius: 28,
            border: 'none',
            background: '#6366f1',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(139,92,246,0.32)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          AskSGM
        </button>
      )}

      {/* Panel overlay */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 60,
          width: 420,
          height: 600,
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: 'calc(100vh - 48px)',
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 20,
              color: isDark ? '#cbd5e1' : '#64748b',
              padding: 4,
              lineHeight: 1,
            }}
          >
            &times;
          </button>
          <AskSGMChat />
        </div>
      )}
    </>
  )
}
