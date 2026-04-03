'use client';

import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  accentColor?: string;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = true, accentColor, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="lot-card" style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <h3 className="lot-subheading">{title}</h3>
        <span className={`lot-chevron ${open ? 'lot-chevron-open' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && <div style={{ marginTop: '14px' }}>{children}</div>}
    </div>
  );
}
