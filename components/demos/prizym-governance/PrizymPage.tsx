'use client';

interface PrizymPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
  mode?: 'design' | 'operate' | 'oversee';
}

const MODE_CONFIG = {
  design: { label: 'Design', color: 'var(--pg-design, #06b6d4)' },
  operate: { label: 'Operate', color: 'var(--pg-operate, #3b82f6)' },
  oversee: { label: 'Oversee', color: 'var(--pg-oversee, #8b5cf6)' },
};

export function PrizymPage({ children, title, subtitle, accentColor, mode }: PrizymPageProps) {
  const modeInfo = mode ? MODE_CONFIG[mode] : null;
  const borderColor = accentColor ?? modeInfo?.color ?? 'var(--pg-cyan)';

  return (
    <div className="pg-page">
      <div className="mb-6 md:mb-7">
        <div style={{ borderLeft: `3px solid ${borderColor}`, paddingLeft: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="pg-heading" style={{ marginBottom: 4 }}>{title}</h1>
            {modeInfo && (
              <span
                className="pg-mode-badge"
                style={{
                  background: `${modeInfo.color}18`,
                  color: modeInfo.color,
                  border: `1px solid ${modeInfo.color}40`,
                }}
              >
                {modeInfo.label}
              </span>
            )}
          </div>
          {subtitle && <p style={{ fontSize: '1.1rem', color: 'var(--pg-text-muted)', marginTop: 4 }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
