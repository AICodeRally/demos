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
      <Results />
    </div>
  );
}
