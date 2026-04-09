'use client';

interface PrizymPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
  mode?: 'design' | 'operate' | 'oversee';
  hero?: boolean;
}

const MODE_CONFIG = {
  design: { label: 'Design', color: '#06b6d4', icon: '◇' },
  operate: { label: 'Operate', color: '#3b82f6', icon: '◈' },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, marginBottom: 6 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: '1.05rem', color: 'rgba(148,163,184,0.9)', lineHeight: 1.5 }}>{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="pg-page">
      <div className="mb-6 md:mb-7">
        <div style={{ borderLeft: `3px solid ${borderColor}`, paddingLeft: 14, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="pg-heading" style={{ marginBottom: 4 }}>{title}</h1>
            {modeInfo && (
              <span
                className="pg-mode-badge"
                style={{
                  background: `${modeInfo.color}18`,
                  color: modeInfo.color,
                  border: `1px solid ${modeInfo.color}40`,
                  boxShadow: `0 0 12px ${modeInfo.color}15`,
                }}
              >
                {modeInfo.icon} {modeInfo.label}
              </span>
            )}
          </div>
          {subtitle && <p style={{ fontSize: '1.05rem', color: 'var(--pg-text-muted)', marginTop: 4 }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
