'use client';

import { ComplianceOverviewPanel } from '@/components/demos/prizym-governance/compliance/ComplianceOverviewPanel';

export default function AuditReadinessPage() {
  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Audit Readiness
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Composite view of program readiness for external audit — findings, evidence gaps, and remediation status.
        </p>
      </div>
      <ComplianceOverviewPanel />
    </div>
  );
}
