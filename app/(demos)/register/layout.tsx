'use client';

import { DemoShell } from '@/components/shell';
import { RegisterThemeProvider } from '@/components/demos/register/ThemeProvider';
import { IcmProvider } from '@/components/demos/register/IcmContext';
import '@/styles/ext/register.css';
import demoConfig from './demo.config';

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegisterThemeProvider>
      <IcmProvider>
        <DemoShell config={demoConfig}>{children}</DemoShell>
      </IcmProvider>
    </RegisterThemeProvider>
  );
}
