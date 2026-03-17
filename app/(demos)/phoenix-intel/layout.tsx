'use client';

import { DemoShell } from '@/components/shell';
import { PhoenixThemeProvider } from '@/components/demos/phoenix-intel/ThemeProvider';
import '@/styles/phoenix-intel-vars.css';
import demoConfig from './demo.config';

export default function PhoenixIntelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoenixThemeProvider>
      <DemoShell config={demoConfig}>{children}</DemoShell>
    </PhoenixThemeProvider>
  );
}
