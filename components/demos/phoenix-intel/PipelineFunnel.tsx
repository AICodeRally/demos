'use client';

interface FunnelStage {
  label: string;
  count: number;
  value: number;
}

interface PipelineFunnelProps {
  stages: FunnelStage[];
}

const STAGE_COLORS = ['#3b6bf5', '#6366f1', '#7c3aed', '#a855f7', '#c026d3', '#db2777', '#10b981'];

export function PipelineFunnel({ stages }: PipelineFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {stages.map((stage, i) => {
        const widthPct = Math.max((stage.count / maxCount) * 100, 15);
        const color = STAGE_COLORS[i % STAGE_COLORS.length];
        return (
          <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 100, fontSize: '0.85rem', fontWeight: 600, color: 'var(--pi-text-muted)', textAlign: 'right', flexShrink: 0 }}>
              {stage.label}
            </div>
            <div style={{ flex: 1, height: 28, background: 'var(--pi-border-faint)', borderRadius: 6, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  transition: 'width 0.8s ease-out',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{stage.count}</span>
              </div>
            </div>
            <div style={{ width: 70, fontSize: '0.875rem', fontWeight: 600, color: 'var(--pi-text-secondary)', textAlign: 'right', flexShrink: 0 }}>
              ${(stage.value / 1000).toFixed(0)}K
            </div>
          </div>
        );
      })}
    </div>
  );
}
