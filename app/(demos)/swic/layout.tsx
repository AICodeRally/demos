'use client';

import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function PrizymSwicLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
