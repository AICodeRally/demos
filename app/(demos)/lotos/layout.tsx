'use client';

import { DM_Sans } from 'next/font/google';
import { DemoShell } from '@/components/shell';
import demoConfig from './demo.config';
import '@/components/demos/lotos/lotos.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
});

export default function LotosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={dmSans.variable} style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
      <DemoShell config={demoConfig}>{children}</DemoShell>
    </div>
  );
}
