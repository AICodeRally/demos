'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AIWidgetState {
  askOpen: boolean;
  pulseOpen: boolean;
  opsOpen: boolean;
}

interface AIWidgetContextValue {
  state: AIWidgetState;
  toggleAsk: () => void;
  togglePulse: () => void;
  toggleOps: () => void;
  closeAll: () => void;
}

const AIWidgetContext = createContext<AIWidgetContextValue | null>(null);

export function AIWidgetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AIWidgetState>({
    askOpen: false,
    pulseOpen: false,
    opsOpen: false,
  });

  const toggleAsk = useCallback(() => {
    setState((prev) => ({ ...prev, askOpen: !prev.askOpen, pulseOpen: false, opsOpen: false }));
  }, []);

  const togglePulse = useCallback(() => {
    setState((prev) => ({ ...prev, pulseOpen: !prev.pulseOpen, askOpen: false, opsOpen: false }));
  }, []);

  const toggleOps = useCallback(() => {
    setState((prev) => ({ ...prev, opsOpen: !prev.opsOpen, askOpen: false, pulseOpen: false }));
  }, []);

  const closeAll = useCallback(() => {
    setState({ askOpen: false, pulseOpen: false, opsOpen: false });
  }, []);

  return (
    <AIWidgetContext.Provider value={{ state, toggleAsk, togglePulse, toggleOps, closeAll }}>
      {children}
    </AIWidgetContext.Provider>
  );
}

export function useAIWidgets(): AIWidgetContextValue {
  const ctx = useContext(AIWidgetContext);
  if (!ctx) throw new Error('useAIWidgets must be used inside <AIWidgetProvider>');
  return ctx;
}
