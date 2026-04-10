'use client';

interface PrizymPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
  mode?: 'design' | 'operate' | 'dispute' | 'oversee';
  hero?: boolean;
}

const MODE_CONFIG = {
  design: { label: 'Design', color: '#06b6d4', icon: '◇' },
  operate: { label: 'Operate', color: '#3b82f6', icon: '◈' },
  dispute: { label: 'Dispute', color: '#6366f1', icon: '◆' },
  oversee: { label: 'Oversee', color: '#8b5cf6', icon: '◉' },
};

export function PrizymPage({ children, title, subtitle, accentColor, mode, hero }: PrizymPageProps) {
  const modeInfo = mode ? MODE_CONFIG[mode] : null;
  const borderColor = accentColor ?? modeInfo?.color ?? '#06b6d4';

  if (hero) {
    return (
      <div className="pg-page">
        <div className="pg-hero-card mb-8" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              {modeInfo && (
                <span
                  className="pg-mode-badge"
                  style={{
                    background: `${modeInfo.color}25`,
                    color: modeInfo.color,
                    border: `1px solid ${modeInfo.color}50`,
                  }}
                >
                  {modeInfo.icon} {modeInfo.label}
                </span>
              )}
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <h1 className="pg-heading">{title}</h1>
            {modeInfo && (
              <span
                className="pg-mode-badge"
                style={{
                  background: `${modeInfo.color}18`,
                  color: modeInfo.color,
                  border: `1px solid ${modeInfo.color}50`,
                  boxShadow: `0 0 12px ${modeInfo.color}15`,
                }}
              >
                {modeInfo.icon} {modeInfo.label}
              </span>
            )}
          </div>
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
