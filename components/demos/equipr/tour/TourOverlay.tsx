'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Monitor } from 'lucide-react';
import { useTour } from './TourProvider';
import { TOUR_STEPS } from '@/data/equipr/tour-steps';

/** Circular countdown timer (used in manual card + kiosk banner) */
function CountdownRing({
  secondsLeft,
  totalSeconds,
  size = 48,
  strokeColor = '#2563EB',
  trackColor = '#E2E8F0',
  textClass = 'text-sm font-bold text-slate-700',
}: {
  secondsLeft: number;
  totalSeconds: number;
  size?: number;
  strokeColor?: string;
  trackColor?: string;
  textClass?: string;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsLeft / totalSeconds;
  const dashOffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={3} />
        <circle
          cx={center} cy={center} r={radius} fill="none" stroke={strokeColor} strokeWidth={3}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className={`absolute ${textClass}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {secondsLeft}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Kiosk Bottom Banner
   Full-width, pinned to bottom, subtitle-style captions
   ════════════════════════════════════════════════════════════ */

function KioskBanner({
  visible,
  step,
  currentStep,
  totalSteps,
  secondsLeft,
  stepDuration,
  exit,
  waypointTitle,
  waypointDescription,
}: {
  visible: boolean;
  step: (typeof TOUR_STEPS)[number];
  currentStep: number;
  totalSteps: number;
  secondsLeft: number;
  stepDuration: number;
  exit: () => void;
  waypointTitle?: string;
  waypointDescription?: string;
}) {
  const progressPct = ((currentStep + 1) / totalSteps) * 100;

  return (
    <>
      {/* Kiosk mode badge — top-left */}
      <div
        className="fixed top-4 left-4 z-[10000] flex items-center gap-2 rounded-full px-4 py-2 shadow-lg"
        style={{
          background: 'rgba(37, 99, 235, 0.95)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      >
        <div className="relative flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-white" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          <div className="absolute h-2 w-2 rounded-full bg-white" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
        </div>
        <Monitor className="h-3.5 w-3.5 text-white" />
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Kiosk Mode
        </span>
        <button
          onClick={exit}
          className="ml-2 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          style={{ width: 24, height: 24 }}
          aria-label="Stop kiosk mode"
        >
          <X className="h-3.5 w-3.5 text-white" />
        </button>
      </div>

      {/* Bottom banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 400ms ease, transform 400ms ease',
          pointerEvents: 'auto',
        }}
      >
        {/* Progress bar — sits on top edge of banner */}
        <div className="h-[3px] w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #2563EB, #0891B2)',
              transition: 'width 400ms ease',
            }}
          />
        </div>

        {/* Banner body */}
        <div
          className="px-8 py-5"
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-6 max-w-[1400px] mx-auto">
            {/* Left: step indicator dot + text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Step number pill */}
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{
                    width: 28,
                    height: 28,
                    background: 'linear-gradient(135deg, #2563EB, #0891B2)',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {currentStep + 1}
                </span>

                {/* Title */}
                <h3
                  className="text-white font-bold truncate"
                  style={{
                    fontSize: waypointTitle ? '26px' : '22px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  {waypointTitle || step.title}
                </h3>

                {/* Step counter */}
                <span
                  className="flex-shrink-0 text-[12px] font-mono px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                >
                  {currentStep + 1} of {totalSteps}
                </span>
              </div>

              {/* Description */}
              <p
                className="leading-relaxed"
                style={{
                  fontSize: waypointDescription ? '20px' : '15px',
                  color: 'rgba(203, 213, 225, 0.9)',
                  maxWidth: '900px',
                }}
              >
                {waypointDescription || step.description}
              </p>
            </div>

            {/* Right: countdown ring */}
            <div className="flex-shrink-0">
              <CountdownRing
                secondsLeft={secondsLeft}
                totalSeconds={stepDuration}
                size={56}
                strokeColor="#2563EB"
                trackColor="rgba(255,255,255,0.12)"
                textClass="text-[16px] font-bold text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Kiosk Auto-Scroll — slowly scrolls content during each step
   ════════════════════════════════════════════════════════════ */

function useKioskAutoScroll(
  mode: string,
  currentStep: number,
  stepDuration: number,
  onWaypointChange: (index: number) => void,
) {
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (mode !== 'kiosk') return;

    const currentStepData = TOUR_STEPS[currentStep];
    if (currentStepData?.noScroll) return;

    const el = document.getElementById('main-content');
    if (!el) return;

    // Reset scroll to top on step change
    el.scrollTop = 0;

    const waypoints = currentStepData?.waypoints;

    // ── Waypoint mode: pause-and-scroll ──
    if (waypoints && waypoints.length > 0) {
      let waypointIdx = 0;
      let cancelled = false;

      function advanceWaypoint() {
        if (cancelled || waypointIdx >= waypoints!.length) return;

        const wp = waypoints![waypointIdx];
        onWaypointChange(waypointIdx);

        // Find the target element
        const target = wp.selector.startsWith('#')
          ? document.getElementById(wp.selector.slice(1))
          : el!.querySelector(wp.selector);

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Schedule next waypoint after pause
        waypointIdx++;
        if (waypointIdx < waypoints!.length) {
          timeoutRef.current = setTimeout(advanceWaypoint, wp.pause * 1000);
        }
      }

      // Start first waypoint after a brief delay for page render
      timeoutRef.current = setTimeout(advanceWaypoint, 800);

      return () => {
        cancelled = true;
        clearTimeout(timeoutRef.current);
        cancelAnimationFrame(rafRef.current);
        onWaypointChange(-1);
      };
    }

    // ── Legacy mode: uniform smooth scroll ──
    const startDelay = setTimeout(() => {
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;

      const scrollDuration = Math.max((stepDuration - 1) * 1000, 4000);
      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        el!.scrollTop = eased * scrollHeight;
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mode, currentStep, stepDuration, onWaypointChange]);
}

/* ════════════════════════════════════════════════════════════
   Tour Overlay — dispatches to KioskBanner or Manual Card
   ════════════════════════════════════════════════════════════ */

export function TourOverlay() {
  const { mode, currentStep, totalSteps, secondsLeft, stepDuration, next, prev, exit } =
    useTour();
  const [visible, setVisible] = useState(false);
  const [currentWaypoint, setCurrentWaypoint] = useState<number>(-1);

  // Auto-scroll content in kiosk mode
  const handleWaypointChange = useCallback((idx: number) => {
    setCurrentWaypoint(idx);
  }, []);
  useKioskAutoScroll(mode, currentStep, stepDuration, handleWaypointChange);

  // Fade in when tour starts or step changes
  useEffect(() => {
    if (mode === 'off') {
      setVisible(false);
      setCurrentWaypoint(-1);
      return;
    }
    setVisible(false);
    setCurrentWaypoint(-1);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [mode, currentStep]);

  if (mode === 'off') return null;

  const step = TOUR_STEPS[currentStep];
  if (!step) return null;

  const isKiosk = mode === 'kiosk';

  // ── Kiosk mode: bottom banner ──
  if (isKiosk) {
    return (
      <KioskBanner
        visible={visible}
        step={step}
        currentStep={currentStep}
        totalSteps={totalSteps}
        secondsLeft={secondsLeft}
        stepDuration={stepDuration}
        exit={exit}
        waypointTitle={
          currentWaypoint >= 0 && step.waypoints?.[currentWaypoint]
            ? step.waypoints[currentWaypoint].title
            : undefined
        }
        waypointDescription={
          currentWaypoint >= 0 && step.waypoints?.[currentWaypoint]
            ? step.waypoints[currentWaypoint].description
            : undefined
        }
      />
    );
  }

  // ── Manual mode: callout card (unchanged) ──
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  const progressPct = ((currentStep + 1) / totalSteps) * 100;

  const positionClasses: Record<string, string> = {
    'top-right': 'top-24 right-6 lg:right-10',
    'bottom-right': 'bottom-24 right-6 lg:right-10',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <>
      {/* Subtle backdrop */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.10)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Callout card */}
      <div
        className={`fixed z-[9999] ${positionClasses[step.position] ?? positionClasses['top-right']}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          pointerEvents: 'auto',
        }}
      >
        <div
          className="rounded-xl border shadow-2xl"
          style={{
            background: '#FFFFFF',
            borderColor: '#E2E8F0',
            maxWidth: '360px',
            minWidth: '320px',
          }}
        >
          {/* Top: step counter + close */}
          <div className="flex items-center justify-between px-5 pt-4 pb-1">
            <span
              className="text-xs font-medium text-slate-400"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Step {currentStep + 1} of {totalSteps}
            </span>
            <button
              onClick={exit}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              aria-label="Exit tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Title + description */}
          <div className="px-5 pb-3">
            <h3
              className="font-bold text-slate-900 mb-1"
              style={{
                fontSize: '18px',
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </h3>
            <p className="text-slate-600 leading-relaxed" style={{ fontSize: '14px' }}>
              {step.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-3">
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: '#2563EB',
                  transition: 'width 400ms ease',
                }}
              />
            </div>
          </div>

          {/* Nav buttons */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: '#E2E8F0' }}
          >
            <button
              onClick={exit}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Exit Tour
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                disabled={isFirstStep}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={isLastStep ? exit : next}
                className="flex items-center gap-1 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors shadow-md"
                style={{
                  background: '#2563EB',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
                }}
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
