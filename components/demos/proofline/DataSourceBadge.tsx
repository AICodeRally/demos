interface DataSourceBadgeProps {
  source: string;
  synced?: string;
}

export function DataSourceBadge({ source, synced }: DataSourceBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: '#22C55E' }}
      />
      <span className="font-medium uppercase tracking-wider">{source}</span>
      {synced && (
        <span style={{ color: 'var(--pl-text-faint)' }}>&middot; {synced}</span>
      )}
    </span>
  );
}
