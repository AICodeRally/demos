// Zustand store for the 88-checkpoint assessment. Single source of truth
// for assessment state across the entire prizym-governance demo — the
// dashboard, every wizard step, the results page, and the library
// framework browser all read from this store.
//
// Persistence happens through the AssessmentPersistence adapter (currently
// localStorage). The store never imports localStorage directly.

import { create } from 'zustand';
import type { AnswerMap, Rating, ScoringResult } from '@/data/prizym-governance/engine/types';
import { scoreAssessment } from '@/data/prizym-governance/engine/scoring';
import {
  localStoragePersistence,
  type AssessmentSnapshot,
} from './persistence';
import { henryScheinSeedAnswers } from '@/data/prizym-governance/henry-schein/assessment-state';

interface AssessmentStore {
  answers: AnswerMap;
  currentPhase: number;
  lastUpdatedAt: string;

  // Derived (re-computed on each call — cheap for 88 entries)
  score: () => ScoringResult;

  // Mutations
  setAnswer: (checkpointId: string, rating: Rating) => void;
  setCurrentPhase: (phase: number) => void;
  reset: () => void;
  resetToSeed: () => void;

  // Lifecycle
  hydrate: () => void;
}

const NOW = () => new Date().toISOString();

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  answers: {},
  currentPhase: 1,
  lastUpdatedAt: NOW(),

  score: () => scoreAssessment(get().answers),

  setAnswer: (checkpointId, rating) => {
    const next: AssessmentSnapshot = {
      answers: { ...get().answers, [checkpointId]: rating },
      currentPhase: get().currentPhase,
      lastUpdatedAt: NOW(),
      version: 1,
    };
    set({
      answers: next.answers,
      lastUpdatedAt: next.lastUpdatedAt,
    });
    localStoragePersistence.save(next);
  },

  setCurrentPhase: (phase) => {
    const next: AssessmentSnapshot = {
      answers: get().answers,
      currentPhase: phase,
      lastUpdatedAt: NOW(),
      version: 1,
    };
    set({
      currentPhase: phase,
      lastUpdatedAt: next.lastUpdatedAt,
    });
    localStoragePersistence.save(next);
  },

  reset: () => {
    localStoragePersistence.reset();
    set({
      answers: {},
      currentPhase: 1,
      lastUpdatedAt: NOW(),
    });
  },

  resetToSeed: () => {
    const snapshot: AssessmentSnapshot = {
      answers: { ...henryScheinSeedAnswers },
      currentPhase: 1,
      lastUpdatedAt: NOW(),
      version: 1,
    };
    localStoragePersistence.save(snapshot);
    set({
      answers: snapshot.answers,
      currentPhase: snapshot.currentPhase,
      lastUpdatedAt: snapshot.lastUpdatedAt,
    });
  },

  hydrate: () => {
    const loaded = localStoragePersistence.load();
    if (loaded) {
      set({
        answers: loaded.answers,
        currentPhase: loaded.currentPhase,
        lastUpdatedAt: loaded.lastUpdatedAt,
      });
      return;
    }
    // First visit — seed with Henry Schein ~60% state so the dashboard
    // and future wizard look populated out of the box
    const seed: AssessmentSnapshot = {
      answers: { ...henryScheinSeedAnswers },
      currentPhase: 1,
      lastUpdatedAt: NOW(),
      version: 1,
    };
    localStoragePersistence.save(seed);
    set({
      answers: seed.answers,
      currentPhase: seed.currentPhase,
      lastUpdatedAt: seed.lastUpdatedAt,
    });
  },
}));
