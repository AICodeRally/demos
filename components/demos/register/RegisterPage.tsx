'use client';

interface RegisterPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function RegisterPage({ children, title, subtitle, accentColor }: RegisterPageProps) {
  return (
    <div style={{ color: 'var(--register-text)' }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            margin: 0,
            borderLeft: accentColor ? `3px solid ${accentColor}` : undefined,
            paddingLeft: accentColor ? '12px' : undefined,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: '2px 0 0', paddingLeft: accentColor ? '12px' : undefined }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
