'use client';

import '@/styles/meridian-vars.css';
import { DemoShell } from '@/components/demo-shell';
import demoConfig from './demo.config';

export default function MeridianLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
