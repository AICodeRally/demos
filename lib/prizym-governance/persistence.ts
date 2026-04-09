// Single swap point for assessment persistence.
//
// In the demo, this is a localStorage adapter. When the Gold Standard is
// forked into aicr-rallies for the Henry Schein pre-prod build, this file
// is the ONLY place that changes — the adapter gets replaced with an HTTP
// client pointing at the pre-prod API. Component code never imports
// localStorage directly.

import type { AnswerMap } from '@/data/prizym-governance/engine/types';

export interface AssessmentSnapshot {
  answers: AnswerMap;
  currentPhase: number;
  lastUpdatedAt: string; // ISO
  version: 1;
}

export interface AssessmentPersistence {
  load(): AssessmentSnapshot | null;
  save(snapshot: AssessmentSnapshot): void;
  reset(): void;
}

const STORAGE_KEY = 'sgm-gold-assessment-v1';

/**
 * localStorage adapter. Safe for SSR — returns null / no-ops when window
 * is undefined, which happens during Next's build and initial server render.
 */
export const localStoragePersistence: AssessmentPersistence = {
  load() {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AssessmentSnapshot;
      if (parsed.version !== 1) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  save(snapshot) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // quota exceeded or disabled — silently ignore, the demo keeps
      // working from in-memory state
    }
  },

  reset() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
