'use client';

import { DemoShell } from '@/components/shell';
import { RegisterThemeProvider } from '@/components/demos/register/ThemeProvider';
import '@/styles/ext/routeiq.css';
import demoConfig from './demo.config';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegisterThemeProvider>
      <DemoShell config={demoConfig}>{children}</DemoShell>
    </RegisterThemeProvider>
  );
}
