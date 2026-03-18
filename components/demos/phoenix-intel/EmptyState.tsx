'use client';

import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'Data will appear once available.',
  action,
}: EmptyStateProps) {
  return (
    <div className="pi-empty-state" role="status">
      <Icon size={48} strokeWidth={1.2} aria-hidden="true" />
      <div className="pi-label" style={{ marginBottom: 4 }}>{title}</div>
      <div className="pi-body-muted" style={{ maxWidth: 320 }}>{message}</div>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
