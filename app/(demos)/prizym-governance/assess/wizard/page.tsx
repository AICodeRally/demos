'use client';

import { useEffect } from 'react';
import { AssessmentWizard } from '@/components/demos/prizym-governance/assess/AssessmentWizard';
import { useAssessmentStore } from '@/lib/prizym-governance/store';

export default function AssessWizardPage() {
  const hydrate = useAssessmentStore(s => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div style={{ minHeight: '100%', padding: '0 24px' }}>
      <AssessmentWizard />
    </div>
  );
}
