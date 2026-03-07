'use client';

import { DemoShell } from '@/components/demo-shell';
import demoConfig from './demo.config';

export default function WellspringLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
