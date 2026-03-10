'use client';

import '@/styles/routeiq-vars.css';
import { DemoShell } from '@/components/demo-shell';
import demoConfig from './demo.config';

export default function CrestlineLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
