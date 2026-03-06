interface LightSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LightSectionCard({ title, children, className }: LightSectionCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 ${className ?? ''}`}
      style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <div className="text-[11px] uppercase tracking-[1.5px] font-mono mb-4" style={{ color: '#718096' }}>
        {title}
      </div>
      {children}
    </div>
  );
}
