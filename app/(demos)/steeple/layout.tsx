'use client';

import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function SteepleLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
