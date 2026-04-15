import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { PulseFlag } from '@/data/routeiq/pulse-flags';

const SEVERITY_META = {
  urgent: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', icon: AlertCircle, label: 'URGENT' },
  warning: { color: '#D97706', bg: 'rgba(217,119,6,0.08)', icon: AlertTriangle, label: 'WARNING' },
  info: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)', icon: Info, label: 'INFO' },
} as const;

export function PulseCard({ flag }: { flag: PulseFlag }) {
  const meta = SEVERITY_META[flag.severity];
  const Icon = meta.icon;

  return (
    <article
      className="rq-pulse-card rq-animate-fade-in flex flex-col gap-2 rounded-xl border p-4"
      style={{
        background: 'var(--rq-card)',
        borderColor: 'var(--rq-border)',
        borderLeftColor: meta.color,
        borderLeftWidth: 4,
      }}
    >
      <header className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: meta.bg, color: meta.color }}
        >
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>
          {flag.metric}
        </span>
        {flag.delta && (
          <span className="ml-auto font-mono text-sm font-bold" style={{ color: meta.color }}>
            {flag.delta}
          </span>
        )}
      </header>

      <h3 className="text-base font-bold leading-snug" style={{ color: 'var(--rq-text)' }}>
        {flag.headline}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--rq-text-muted)' }}>
        {flag.detail}
      </p>

      {flag.since && (
        <footer className="text-xs" style={{ color: 'var(--rq-text-faint)' }}>
          {flag.since}
        </footer>
      )}
    </article>
  );
}
