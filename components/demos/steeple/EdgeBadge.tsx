import { WifiOff, RefreshCw, Shield, Network, Lock, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  offline: {
    icon: WifiOff,
    text: 'Offline Ready',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  sync: {
    icon: RefreshCw,
    text: 'Synced 2s ago',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  sealed: {
    icon: Shield,
    text: 'Sealed',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  lan: {
    icon: Network,
    text: 'LAN-First',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  private: {
    icon: Lock,
    text: 'Private',
    className: 'bg-gray-50 text-gray-600 border-gray-200',
  },
  local: {
    icon: HardDrive,
    text: 'Cached Locally',
    className: 'bg-gray-50 text-gray-500 border-gray-200',
  },
} as const;

interface EdgeBadgeProps {
  variant: keyof typeof variants;
  className?: string;
}

export function EdgeBadge({ variant, className }: EdgeBadgeProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </span>
  );
}
