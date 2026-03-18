'use client';

import type { LucideIcon } from 'lucide-react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_CONFIG: Record<AlertVariant, { icon: LucideIcon; color: string }> = {
  info: { icon: Info, color: '#3b6bf5' },
  success: { icon: CheckCircle2, color: '#10b981' },
  warning: { icon: AlertTriangle, color: '#c9942b' },
  danger: { icon: AlertCircle, color: '#ef4444' },
};

interface AlertProps {
  variant?: AlertVariant;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function Alert({ variant = 'info', icon, children }: AlertProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = icon || config.icon;

  return (
    <div className={`pi-alert pi-alert-${variant}`} role="alert">
      <Icon size={16} color={config.color} style={{ flexShrink: 0 }} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
