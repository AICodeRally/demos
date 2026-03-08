'use client';

import { SpmShell } from '@/components/spm-shell';
import demoConfig from './demo.config';

export default function QuotaLayout({ children }: { children: React.ReactNode }) {
  return <SpmShell config={demoConfig}>{children}</SpmShell>;
}
