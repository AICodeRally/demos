'use client';

import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function LotosLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
