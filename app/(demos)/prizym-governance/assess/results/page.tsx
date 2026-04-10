'use client';

import { useEffect } from 'react';
import { Results } from '@/components/demos/prizym-governance/assess/Results';
import { useAssessmentStore } from '@/lib/prizym-governance/store';

export default function AssessResultsPage() {
  const hydrate = useAssessmentStore(s => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 999,
          background: 'rgba(245,158,11,0.22)',
          border: '1px solid rgba(245,158,11,0.5)',
          color: '#fcd34d',
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 20,
        }}
      >
        <span aria-hidden>◆</span> Illustrative · Synthetic Scenario
      </div>
      <Results />
    </div>
  );
}
