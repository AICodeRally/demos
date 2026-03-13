'use client';

import { DemoShell } from '@/components/demo-shell';
import { RegisterThemeProvider } from '@/components/demos/register/ThemeProvider';
import demoConfig from './demo.config';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegisterThemeProvider>
      <DemoShell config={demoConfig}>{children}</DemoShell>
    </RegisterThemeProvider>
  );
}
