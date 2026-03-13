interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'hero' | 'standard' | 'quiet';
  meta?: string;
  accentColor?: string;
}

export function SectionCard({ title, children, className, variant = 'standard', meta, accentColor }: SectionCardProps) {
  const isHero = variant === 'hero';
  const isQuiet = variant === 'quiet';

  return (
    <div
      className={`rounded-xl border mb-6 ${isHero ? 'p-6' : isQuiet ? 'p-4' : 'p-5'} ${className ?? ''}`}
      style={{
        background: isHero ? `${accentColor ?? '#D4A847'}06` : 'var(--mr-card)',
        borderColor: isHero ? `${accentColor ?? '#D4A847'}25` : 'var(--mr-border)',
        boxShadow: isHero ? 'var(--mr-shadow-premium)' : 'var(--mr-shadow)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`uppercase tracking-[1.5px] text-left ${
            isHero ? 'text-[13px] font-bold' : isQuiet ? 'text-[11px] font-medium' : 'text-[12px] font-semibold'
          }`}
          style={{ color: isHero ? (accentColor ?? '#D4A847') : 'var(--mr-text-muted)' }}
        >
          {title}
        </div>
        {meta && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded"
            style={{ background: 'var(--mr-card-alt)', color: 'var(--mr-text-faint)' }}
          >
            {meta}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
