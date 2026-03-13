'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MeridianHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/meridian/fund/strategy');
  }, [router]);
  return null;
}
