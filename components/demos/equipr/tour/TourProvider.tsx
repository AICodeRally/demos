'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TOUR_STEPS, DEFAULT_STEP_DURATION } from '@/data/equipr/tour-steps';

export type TourMode = 'off' | 'manual' | 'kiosk';

interface TourContextValue {
  mode: TourMode;
  currentStep: number;
  totalSteps: number;
  /** Seconds remaining on current step (kiosk mode) */
  secondsLeft: number;
  /** Duration of current step in seconds */
  stepDuration: number;
  next: () => void;
  prev: () => void;
  goTo: (step: number) => void;
  start: (mode: 'manual' | 'kiosk') => void;
  exit: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within <TourProvider>');
  return ctx;
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<TourMode>('off');
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const totalSteps = TOUR_STEPS.length;

  // Track whether auto-start has been checked
  const autoStartChecked = useRef(false);

  // Ref to hold a "should advance" flag set by the countdown
  const shouldAdvance = useRef(false);

  // Ref to track pending navigation (avoids router.push inside state updaters)
  const pendingNav = useRef<string | null>(null);

  const stepDuration =
    TOUR_STEPS[currentStep]?.duration ?? DEFAULT_STEP_DURATION;

  // Start a tour
  const start = useCallback(
    (newMode: 'manual' | 'kiosk') => {
      setMode(newMode);
      setCurrentStep(0);
      const dur = TOUR_STEPS[0]?.duration ?? DEFAULT_STEP_DURATION;
      setSecondsLeft(dur);
      pendingNav.current = TOUR_STEPS[0]?.path ?? null;
    },
    [],
  );

  // Advance to the next step (used by both manual Next button and kiosk timer)
  const next = useCallback(() => {
    setCurrentStep((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= totalSteps) {
        if (mode === 'kiosk') {
          const dur = TOUR_STEPS[0]?.duration ?? DEFAULT_STEP_DURATION;
          setSecondsLeft(dur);
          pendingNav.current = TOUR_STEPS[0]?.path ?? null;
          return 0;
        }
        setMode('off');
        setSecondsLeft(0);
        return 0;
      }
      const dur = TOUR_STEPS[nextIdx]?.duration ?? DEFAULT_STEP_DURATION;
      setSecondsLeft(dur);
      pendingNav.current = TOUR_STEPS[nextIdx]?.path ?? null;
      return nextIdx;
    });
  }, [mode, totalSteps]);

  // Go to previous step
  const prev = useCallback(() => {
    if (mode === 'off') return;
    setCurrentStep((prevStep) => {
      if (prevStep <= 0) return prevStep;
      const target = prevStep - 1;
      const dur = TOUR_STEPS[target]?.duration ?? DEFAULT_STEP_DURATION;
      setSecondsLeft(dur);
      pendingNav.current = TOUR_STEPS[target]?.path ?? null;
      return target;
    });
  }, [mode]);

  // Go to a specific step
  const goTo = useCallback(
    (step: number) => {
      if (mode === 'off' || step < 0 || step >= totalSteps) return;
      setCurrentStep(step);
      const dur = TOUR_STEPS[step]?.duration ?? DEFAULT_STEP_DURATION;
      setSecondsLeft(dur);
      pendingNav.current = TOUR_STEPS[step]?.path ?? null;
    },
    [mode, totalSteps],
  );

  // Exit tour
  const exit = useCallback(() => {
    setMode('off');
    setCurrentStep(0);
    setSecondsLeft(0);
  }, []);

  // Flush pending navigation outside of state updaters
  useEffect(() => {
    if (pendingNav.current) {
      // Compare only the path portion (ignore query params) against current pathname
      const navPath = pendingNav.current.split('?')[0];
      if (navPath !== pathname) {
        router.push(pendingNav.current);
      } else if (pendingNav.current.includes('?')) {
        // Same path but different query params — still push to trigger param change
        router.push(pendingNav.current);
      }
    }
    pendingNav.current = null;
  });

  // Auto-start from URL search params (?tour=manual or ?tour=kiosk)
  useEffect(() => {
    if (autoStartChecked.current) return;
    autoStartChecked.current = true;

    const tourParam = searchParams.get('tour');
    if (tourParam === 'manual' || tourParam === 'kiosk') {
      // Defer to next tick so the router is ready
      setTimeout(() => start(tourParam), 100);
    }
  }, [searchParams, start]);

  // Kiosk auto-advance: tick every second, advance when countdown reaches 0
  useEffect(() => {
    if (mode !== 'kiosk') return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Signal advance on next render tick
          shouldAdvance.current = true;
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  // Process the advance signal
  useEffect(() => {
    if (shouldAdvance.current && mode === 'kiosk') {
      shouldAdvance.current = false;
      next();
    }
  }, [secondsLeft, mode, next]);

  return (
    <TourContext.Provider
      value={{
        mode,
        currentStep,
        totalSteps,
        secondsLeft,
        stepDuration,
        next,
        prev,
        goTo,
        start,
        exit,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}
