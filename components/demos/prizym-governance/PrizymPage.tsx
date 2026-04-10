'use client';

interface PrizymPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
  hero?: boolean;
}

export function PrizymPage({ children, title, subtitle, accentColor, hero }: PrizymPageProps) {
  const borderColor = accentColor ?? '#10b981';

  if (hero) {
    return (
      <div className="pg-page">
        <div className="pg-hero-card mb-8" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="pg-heading-lg" style={{ color: '#ffffff', marginBottom: 10 }}>{title}</h1>
            {subtitle && (
              <p style={{ fontSize: '1.25rem', color: '#e2e8f0', lineHeight: 1.5, maxWidth: '72ch' }}>
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
