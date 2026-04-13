'use client';

import { CasesPanel } from '@/components/demos/prizym-governance/workflows/CasesPanel';

export default function DisputeCasesPage() {
  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Dispute Cases
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Commission dispute case queue with thread history and SLA tracking.
        </p>
      </div>
      <CasesPanel />
    </div>
  );
}
