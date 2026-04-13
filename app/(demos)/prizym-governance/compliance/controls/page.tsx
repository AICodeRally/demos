'use client';

import { ControlsPanel } from '@/components/demos/prizym-governance/compliance/ControlsPanel';

export default function CompliancePage() {
  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Compliance Dashboard
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.5 }}>
          SOX controls, wage law, tax, and data security — unified compliance view.
        </p>
      </div>
      <ControlsPanel showGauge={true} />
    </div>
  );
}
