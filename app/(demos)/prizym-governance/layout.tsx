'use client';

import { DemoShell } from '@/components/shell';
import { PrizymThemeProvider } from '@/components/demos/prizym-governance/ThemeProvider';
import '@/styles/ext/prizym-governance.css';
import demoConfig from './demo.config';

export default function PrizymGovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrizymThemeProvider>
      <DemoShell config={demoConfig}>{children}</DemoShell>
    </PrizymThemeProvider>
  );
}
