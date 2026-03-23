'use client';

import '@/styles/ext/ridgeline.css';
import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function RidgelineLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
