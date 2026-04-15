'use client';

import '@/styles/ext/crestline.css';
import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function CrestlineLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
