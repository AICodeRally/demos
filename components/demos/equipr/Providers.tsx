'use client';

import { Suspense } from 'react';
import { TourProvider } from '@/components/demos/equipr/tour';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TourProvider>{children}</TourProvider>
    </Suspense>
  );
}
