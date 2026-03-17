'use client';

interface PhoenixPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function PhoenixPage({ children, title, subtitle, accentColor }: PhoenixPageProps) {
  const accentStyles = accentColor
    ? {
        borderLeft: `3px solid ${accentColor}`,
        paddingLeft: '12px',
      }
    : undefined;

  return (
    <div className="phoenix-page">
      <div className="mb-6 md:mb-7">
        <h1 className="phoenix-heading" style={accentStyles}>
          {title}
        </h1>
        {subtitle && (
          <p className="phoenix-subtitle" style={accentStyles}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
