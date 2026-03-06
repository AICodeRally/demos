'use client';

import { Lock } from 'lucide-react';

interface PrivilegeBadgeProps {
  size?: 'sm' | 'md';
}

const sizeConfig = {
  sm: {
    text: 'text-[9px]',
    padding: 'px-1.5 py-0.5',
    icon: 9,
  },
  md: {
    text: 'text-[10px]',
    padding: 'px-2 py-0.5',
    icon: 10,
  },
} as const;

export function PrivilegeBadge({ size = 'sm' }: PrivilegeBadgeProps) {
  const cfg = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ${cfg.text} ${cfg.padding}`}
      style={{
        backgroundColor: 'rgba(124, 58, 237, 0.12)',
        color: '#7C3AED',
      }}
    >
      <Lock size={cfg.icon} strokeWidth={2.5} />
      PRIVILEGED
    </span>
  );
}
