'use client';

import '@/styles/ext/srs-blt.css';
import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function SrsBltLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
