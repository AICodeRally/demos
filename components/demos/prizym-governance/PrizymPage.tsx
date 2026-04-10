'use client';

interface PrizymPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
  hero?: boolean;
}

export function PrizymPage({ children, title, subtitle, accentColor, hero }: PrizymPageProps) {
  const borderColor = accentColor ?? 'var(--pg-success)';

  if (hero) {
    return (
      <div className="pg-page">
        <div className="pg-hero-card mb-8" style={{ position: 'relative', zIndex: 1, padding: '20px 24px' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: 6, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{title}</h1>
            {subtitle && (
              <p style={{ fontSize: '1.0625rem', color: '#ffffff', lineHeight: 1.45, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="pg-page">
      <div className="mb-6 md:mb-8">
        <div style={{ borderLeft: `4px solid ${borderColor}`, paddingLeft: 18, marginBottom: 24 }}>
          <h1 className="pg-heading" style={{ marginBottom: 8 }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: '1.125rem', color: 'var(--pg-text-secondary)', lineHeight: 1.55, maxWidth: '80ch' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
