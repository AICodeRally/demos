'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_ICM_ID, ICM_PROVIDERS, getIcm, type IcmProvider, type IcmProviderId } from '@/data/register/icm-providers';

interface IcmContextValue {
  provider: IcmProvider;
  providers: IcmProvider[];
  setProviderId: (id: IcmProviderId | string) => void;
}

const IcmContext = createContext<IcmContextValue>({
  provider: getIcm(DEFAULT_ICM_ID),
  providers: ICM_PROVIDERS,
  setProviderId: () => {},
});

const STORAGE_KEY = 'register-icm';

export function IcmProvider({ children }: { children: React.ReactNode }) {
  const [providerId, setProviderIdState] = useState<IcmProviderId>(DEFAULT_ICM_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as IcmProviderId | null;
    if (stored && ICM_PROVIDERS.some((p) => p.id === stored)) {
      setProviderIdState(stored);
    }
    setMounted(true);

    // Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && ICM_PROVIDERS.some((p) => p.id === e.newValue)) {
        setProviderIdState(e.newValue as IcmProviderId);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setProviderId = useCallback((id: IcmProviderId | string) => {
    if (!ICM_PROVIDERS.some((p) => p.id === id)) return;
    setProviderIdState(id as IcmProviderId);
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, id);
      // Let other components know about the change same-tab
      window.dispatchEvent(new CustomEvent('register-icm-change', { detail: { id } }));
    }
  }, [mounted]);

  const provider = getIcm(providerId);

  return (
    <IcmContext.Provider value={{ provider, providers: ICM_PROVIDERS, setProviderId }}>
      {children}
    </IcmContext.Provider>
  );
}

export function useIcm() {
  return useContext(IcmContext);
}
