'use client';

import { ObligationsPanel } from '@/components/demos/prizym-governance/compliance/ObligationsPanel';

export default function ObligationsPage() {
  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Obligations Register
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Regulatory and internal obligations mapped to policies, controls, and evidence — the single source of truth for what we must comply with.
        </p>
      </div>
      <ObligationsPanel showMetrics={true} />
    </div>
  );
}
