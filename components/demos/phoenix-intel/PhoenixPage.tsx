'use client';

interface PhoenixPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function PhoenixPage({ children, title, subtitle, accentColor }: PhoenixPageProps) {
  return (
    <div className="phoenix-page">
      <div className="mb-6 md:mb-7">
        {accentColor ? (
          <div style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: 12, marginBottom: 20 }}>
            <h1 className="phoenix-heading" style={{ marginBottom: 4 }}>{title}</h1>
            {subtitle && <p className="phoenix-subtitle">{subtitle}</p>}
          </div>
        ) : (
          <>
            <h1 className="phoenix-heading" style={{ marginBottom: 4 }}>{title}</h1>
            {subtitle && <p className="phoenix-subtitle" style={{ marginBottom: 20 }}>{subtitle}</p>}
          </>
        )}
      </div>
      {children}
    </div>
  );
}
