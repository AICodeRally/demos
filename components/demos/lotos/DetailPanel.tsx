'use client';

import { useEffect } from 'react';

interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailPanel({ open, onClose, title, children }: DetailPanelProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-[420px] z-50 shadow-2xl overflow-y-auto transition-transform duration-300 lot-detail-panel"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          background: 'var(--lot-card)',
        }}
      >
        <div
          className="sticky top-0 border-b px-6 py-4 flex items-center justify-between lot-detail-panel-header"
          style={{ borderColor: 'var(--lot-border)', background: 'var(--lot-card)' }}
        >
          <h2 className="lot-subheading">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
            style={{ color: 'var(--lot-text-muted)', background: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--lot-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>
        <div className="p-6" style={{ color: 'var(--lot-text)' }}>{children}</div>
      </div>
    </>
  );
}
