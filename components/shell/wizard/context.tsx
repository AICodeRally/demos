'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { WizardStep } from '../config/types';

interface WizardState {
  currentStep: number;
  completedSteps: Set<string>;
  mode: 'guided' | 'explore';
  steps: WizardStep[];
}

interface WizardContextValue extends WizardState {
  goNext: () => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  markComplete: (stepId: string) => void;
  toggleMode: () => void;
}

const WizardCtx = createContext<WizardContextValue | null>(null);

const STORAGE_KEY = 'wizard-state';

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error('useWizard must be used within a WizardProvider');
  return ctx;
}

interface ProviderProps {
  steps: WizardStep[];
  startInGuided?: boolean;
  slug: string;
  children: ReactNode;
}

export function WizardProvider({ steps, startInGuided = true, slug, children }: ProviderProps) {
  const storageKey = `${STORAGE_KEY}-${slug}`;

  const [state, setState] = useState<WizardState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...parsed,
            completedSteps: new Set(parsed.completedSteps),
            steps,
          };
        }
      } catch { /* ignore */ }
    }
    return {
      currentStep: 0,
      completedSteps: new Set<string>(),
      mode: startInGuided ? 'guided' : 'explore',
      steps,
    };
  });

  const persist = useCallback((next: WizardState) => {
    setState(next);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        ...next,
        completedSteps: [...next.completedSteps],
      }));
    } catch { /* sessionStorage unavailable */ }
  }, [storageKey]);

  const goNext = useCallback(() => {
    persist({
      ...state,
      currentStep: Math.min(state.currentStep + 1, steps.length - 1),
    });
  }, [state, steps.length, persist]);

  const goBack = useCallback(() => {
    persist({ ...state, currentStep: Math.max(state.currentStep - 1, 0) });
  }, [state, persist]);

  const goToStep = useCallback((index: number) => {
    persist({ ...state, currentStep: index });
  }, [state, persist]);

  const markComplete = useCallback((stepId: string) => {
    const next = new Set(state.completedSteps);
    next.add(stepId);
    persist({ ...state, completedSteps: next });
  }, [state, persist]);

  const toggleMode = useCallback(() => {
    const nextMode = state.mode === 'guided' ? 'explore' : 'guided';
    let nextStep = state.currentStep;
    if (nextMode === 'guided') {
      const firstIncomplete = steps.findIndex(s => !state.completedSteps.has(s.id));
      if (firstIncomplete !== -1) nextStep = firstIncomplete;
    }
    persist({ ...state, mode: nextMode, currentStep: nextStep });
  }, [state, steps, persist]);

  return (
    <WizardCtx.Provider value={{ ...state, goNext, goBack, goToStep, markComplete, toggleMode }}>
      {children}
    </WizardCtx.Provider>
  );
}
