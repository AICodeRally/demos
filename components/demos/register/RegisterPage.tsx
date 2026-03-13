'use client';

interface RegisterPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function RegisterPage({ children, title, subtitle, accentColor }: RegisterPageProps) {
  const accentStyles = accentColor
    ? {
        borderLeft: `3px solid ${accentColor}`,
        paddingLeft: '12px',
      }
    : undefined;

  return (
    <div className="register-page">
      <div className="mb-6 md:mb-7">
        <h1 className="register-heading" style={accentStyles}>
          {title}
        </h1>
        {subtitle && (
          <p className="register-subtitle" style={accentStyles}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
