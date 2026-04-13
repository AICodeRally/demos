'use client';

import { AuditTrailPanel } from '@/components/demos/prizym-governance/workflows/AuditTrailPanel';

export default function AuditPage() {
  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Audit Trail
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Immutable event log — governance decisions, approvals, and case activity.
        </p>
      </div>
      <AuditTrailPanel showStats={true} />
    </div>
  );
}
