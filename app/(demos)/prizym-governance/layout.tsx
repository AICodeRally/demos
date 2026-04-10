'use client';

import { PrizymShell } from '@/components/demos/prizym-governance/PrizymShell';
import { PrizymThemeProvider } from '@/components/demos/prizym-governance/ThemeProvider';
import { AskSGMPanel } from '@/components/demos/prizym-governance/ai/AskSGMPanel';
import '@/styles/ext/prizym-governance.css';

export default function PrizymGovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrizymThemeProvider>
      <PrizymShell>{children}</PrizymShell>
      <AskSGMPanel />
    </PrizymThemeProvider>
  );
}
