interface LightSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LightSectionCard({ title, children, className }: LightSectionCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${className ?? ''}`}
      style={{
        background: 'var(--pl-card)',
        borderColor: 'var(--pl-border)',
        boxShadow: 'var(--pl-shadow)',
      }}
    >
      <div
        className="text-[11px] uppercase tracking-[1.5px] font-mono mb-4"
        style={{ color: 'var(--pl-text-muted)' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
