interface LightSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LightSectionCard({ title, children, className }: LightSectionCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 mb-6 ${className ?? ''}`}
      style={{
        background: 'var(--pl-card)',
        borderColor: 'var(--pl-border)',
        boxShadow: 'var(--pl-shadow)',
      }}
    >
      <div
        className="text-[13px] uppercase tracking-[1.5px] font-mono mb-4 text-left"
        style={{ color: 'var(--pl-text-muted)' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
