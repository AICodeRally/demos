'use client';

interface SkeletonProps {
  variant?: 'text' | 'heading' | 'card' | 'metric';
  width?: string;
  count?: number;
}

export function Skeleton({ variant = 'text', width, count = 1 }: SkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === 'metric') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((_, i) => (
          <div key={i} className="phoenix-card" style={{ textAlign: 'center' }}>
            <div className="pi-skeleton" style={{ width: 20, height: 20, borderRadius: '50%', margin: '0 auto 8px' }} />
            <div className="pi-skeleton pi-skeleton-heading" style={{ width: '50%', margin: '0 auto 4px' }} />
            <div className="pi-skeleton pi-skeleton-text" style={{ width: '70%', margin: '0 auto' }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((_, i) => (
          <div key={i} className="pi-skeleton pi-skeleton-card" style={{ width: width || '100%' }} />
        ))}
      </div>
    );
  }

  if (variant === 'heading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((_, i) => (
          <div key={i} className="pi-skeleton pi-skeleton-heading" style={{ width: width || '60%' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((_, i) => (
        <div key={i} className="pi-skeleton pi-skeleton-text" style={{ width: width || (i === count - 1 ? '40%' : '100%') }} />
      ))}
    </div>
  );
}
