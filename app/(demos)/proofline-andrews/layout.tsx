'use client';

import '@/styles/ext/proofline.css';
import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';

export default function ProoflineLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell config={demoConfig}>{children}</DemoShell>;
}
