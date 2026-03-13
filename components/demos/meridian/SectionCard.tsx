interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 mb-6 ${className ?? ''}`}
      style={{
        background: 'var(--mr-card)',
        borderColor: 'var(--mr-border)',
        boxShadow: 'var(--mr-shadow)',
      }}
    >
      <div
        className="text-[13px] uppercase tracking-[1.5px] font-mono mb-4 text-left"
        style={{ color: 'var(--mr-text-muted)' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
