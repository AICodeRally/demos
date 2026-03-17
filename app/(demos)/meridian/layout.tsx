'use client';

import '@/styles/ext/meridian.css';
import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function MeridianLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
