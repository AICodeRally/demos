'use client';

import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export function MobileDrawer({ open, onClose, children, width = 264 }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="absolute left-0 top-0 h-full overflow-y-auto bg-[var(--comp-sidebar-bg)]"
        style={{ width }}
      >
        {children}
      </div>
    </div>
  );
}
