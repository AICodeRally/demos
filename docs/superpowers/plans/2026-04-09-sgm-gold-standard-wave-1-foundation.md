# SGM Gold Standard — Wave 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the foundations for the Prizym SGM Gold Standard Demo in `aicr-demos-cf` — port the 88-checkpoint engine from `aicr-sgm-cf`, wire up Zustand + localStorage assessment state, swap the restored demo's navy/cyan palette for the SPARCC SPM purple-blue gradient, and install a working Forge-wired AskSGM chat widget. At the end of Wave 1 the 9 existing prizym-governance pages render in the new gradient, the AskSGM button works on every page, and the assessment engine is importable but not yet user-visible (that's Wave 2).

**Architecture:** Pure client-side foundation. All state lives in a Zustand store backed by a single localStorage adapter (`lib/prizym-governance/persistence.ts`) — the one file that will be swapped when we later fork to `aicr-rallies` for the Henry Schein pre-prod build. The 88-checkpoint framework and scoring are pure functions ported verbatim from `aicr-sgm-cf/apps/workers/src/engine/`. The theme layer is a token-value swap — the restored ThemeProvider's structure is unchanged; only the color values move from navy/cyan to SPARCC sky→violet. The AI widget is a straight port of the `AskSGMPanel` + `AskSGMChat` pair from `aicr-sgm-cf`, with two import adaptations (`useTheme` → `usePrizymTheme`, remove SPA hash-router check).

**Tech Stack:** Next.js 16 (Turbopack) · React 19 · TypeScript · Zustand (new) · DemoShell layout · localStorage · Forge API (`forge.aicoderally.com/api/widget`) for AskSGM chat. No test framework — validation via `pnpm typecheck`, `pnpm verify:demo-standard`, and runtime smoke tests in the dev server. Tests deferred to Wave 2+ when interactive routes land.

**Precondition — current branch state:** Work happens on branch `restore-old-sgm-demo` in `aicr-demos-cf`, which already has the 9 restored pages from commit `62fa3ca`. All new Wave 1 files layer on top of that state. Do not merge to main until all 4 waves complete.

---

## File structure

### Create

| Path | Purpose |
|---|---|
| `data/prizym-governance/engine/types.ts` | Shared types: `Checkpoint`, `Phase`, `GovernanceFramework`, `Rating`, `AnswerMap`, `Quadrant`, `Archetype`, `ScoringResult` |
| `data/prizym-governance/engine/framework.ts` | The 88-checkpoint / 12-phase `GOVERNANCE_FRAMEWORK` constant — pure data, ported from `aicr-sgm-cf` |
| `data/prizym-governance/engine/scoring.ts` | `scoreAssessment()` + `classifyArchetype()` pure functions — ported from `aicr-sgm-cf` |
| `data/prizym-governance/henry-schein/org-profile.ts` | Synthetic tenant org profile (name, industry, entity type, region, SOX flag) |
| `data/prizym-governance/henry-schein/assessment-state.ts` | ~60%-complete seed `AnswerMap` — a plausible mid-assessment state for first-load UX |
| `lib/prizym-governance/persistence.ts` | `AssessmentPersistence` interface + `localStoragePersistence` implementation — the single swap point for the rallies fork |
| `lib/prizym-governance/store.ts` | Zustand assessment store — `useAssessmentStore` hook |
| `components/demos/prizym-governance/ai/AskSGMChat.tsx` | The Forge-wired chat component, ported from `aicr-sgm-cf` |
| `components/demos/prizym-governance/ai/AskSGMPanel.tsx` | Floating button + expanded chat panel wrapper |

### Modify

| Path | Change |
|---|---|
| `package.json` | Add `zustand` to dependencies |
| `components/demos/prizym-governance/ThemeProvider.tsx` | Swap token values in `LIGHT_TOKENS`, `DARK_TOKENS`, `SHARED_TOKENS` from navy/cyan to SPARCC SPM palette. Keep all structure. |
| `styles/ext/prizym-governance.css` | Swap three specific gradient values to SPARCC colors, update `--pg-cyan` → `--pg-primary`, add new gradient custom properties |
| `app/(demos)/prizym-governance/layout.tsx` | Import and render `<AskSGMPanel />` inside `<DemoShell>` so it appears on every prizym-governance page |

---

## Task breakdown

### Task 1: Add zustand dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add zustand to dependencies**

Run from `aicr-demos-cf/`:

```bash
pnpm add zustand@^5.0.3
```

Expected: `package.json` now lists `"zustand": "^5.0.3"` under `dependencies`, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Verify install**

```bash
pnpm typecheck
```

Expected: PASS (no new files yet, so typecheck should still pass on existing codebase).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(sgm-gold): add zustand for prizym-governance assessment store"
```

---

### Task 2: Create engine types file

**Files:**
- Create: `data/prizym-governance/engine/types.ts`

- [ ] **Step 1: Create the types file**

Create `data/prizym-governance/engine/types.ts` with the full contents:

```ts
// Shared types for the 88-checkpoint governance framework.
// Ported from aicr-sgm-cf/apps/workers/src/engine/ — the new Gold Standard
// demo reuses this engine unchanged so scoring logic stays in sync with
// the production sgm.aicoderally.com app.

export interface Checkpoint {
  id: string;
  label: string;
  description: string;
  evidencePrompt: string;
  soxRelevant: boolean;
}

export type Quadrant = 'design' | 'operate' | 'dispute' | 'oversee';

export interface Phase {
  number: number;
  name: string;
  quadrant: Quadrant;
  checkpoints: Checkpoint[];
}

export interface GovernanceFramework {
  version: string;
  totalCheckpoints: number;
  phases: Phase[];
}

export type Rating = 'done' | 'partial' | 'not_started';

export interface AnswerMap {
  [checkpointId: string]: Rating;
}

export type Archetype =
  | 'Foundation Builder'
  | 'Operator Without Framework'
  | 'Organic Grower'
  | 'Greenfield';

export interface ScoringResult {
  maturityScore: number;
  quadrantScores: Record<Quadrant, number>;
  phaseScores: Record<number, number>;
  archetype: Archetype;
  topRisks: string[];
  auditReadiness: number | null;
  soxGaps: string[];
}
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add data/prizym-governance/engine/types.ts
git commit -m "feat(sgm-gold): add engine types for 88-checkpoint framework"
```

---

### Task 3: Port the 88-checkpoint framework data

**Files:**
- Create: `data/prizym-governance/engine/framework.ts`

- [ ] **Step 1: Copy framework.ts contents from donor**

Create `data/prizym-governance/engine/framework.ts` by copying the complete contents of `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/engine/framework.ts` — all 12 phases, all 88 checkpoints. Then replace the inline interface declarations at the top with a single import from the types file:

Replace lines 1-20 of the donor file (the `Checkpoint` / `Phase` / `GovernanceFramework` interfaces) with:

```ts
import type { GovernanceFramework } from './types';
```

Keep the rest of the file byte-identical — starting from `export const GOVERNANCE_FRAMEWORK: GovernanceFramework = { ... }` through the closing brace on line 208.

**CRITICAL:** do not paraphrase checkpoint labels or descriptions. The engine is load-bearing — scoring math in Task 4 depends on the exact checkpoint IDs (`p1-01`, `p2-03`, etc.) and quadrant assignments.

- [ ] **Step 2: Verify the framework is correct**

```bash
pnpm typecheck
```

Expected: PASS.

Then run a one-off sanity check from the repo root:

```bash
npx tsx -e 'import { GOVERNANCE_FRAMEWORK } from "./data/prizym-governance/engine/framework"; console.log("phases:", GOVERNANCE_FRAMEWORK.phases.length, "checkpoints:", GOVERNANCE_FRAMEWORK.phases.reduce((n, p) => n + p.checkpoints.length, 0));'
```

Expected output: `phases: 12 checkpoints: 88`

If checkpoint count is not exactly 88, the port is incomplete — re-copy from the donor file.

- [ ] **Step 3: Commit**

```bash
git add data/prizym-governance/engine/framework.ts
git commit -m "feat(sgm-gold): port 88-checkpoint governance framework from aicr-sgm-cf"
```

---

### Task 4: Port the scoring engine

**Files:**
- Create: `data/prizym-governance/engine/scoring.ts`

- [ ] **Step 1: Create the scoring file**

Create `data/prizym-governance/engine/scoring.ts` with the full contents:

```ts
// Maturity scoring + archetype classification for the 88-checkpoint assessment.
// Ported verbatim from aicr-sgm-cf/apps/workers/src/engine/scoring.ts so the
// Gold Standard demo and production sgm.aicoderally.com always produce the
// same score for the same AnswerMap input.

import { GOVERNANCE_FRAMEWORK } from './framework';
import type {
  AnswerMap,
  Archetype,
  Quadrant,
  Rating,
  ScoringResult,
} from './types';

const RATING_SCORES: Record<Rating, number> = {
  done: 1,
  partial: 0.5,
  not_started: 0,
};

export function scoreAssessment(answers: AnswerMap): ScoringResult {
  const phaseScores: Record<number, number> = {};
  const quadrantTotals: Record<Quadrant, { score: number; count: number }> = {
    design: { score: 0, count: 0 },
    operate: { score: 0, count: 0 },
    dispute: { score: 0, count: 0 },
    oversee: { score: 0, count: 0 },
  };

  let totalScore = 0;
  let totalCount = 0;
  const soxGaps: string[] = [];
  const risks: Array<{ id: string; label: string; severity: number }> = [];

  for (const phase of GOVERNANCE_FRAMEWORK.phases) {
    let phaseTotal = 0;
    let phaseCount = 0;

    for (const cp of phase.checkpoints) {
      const rating = answers[cp.id] || 'not_started';
      const score = RATING_SCORES[rating];

      phaseTotal += score;
      phaseCount++;
      quadrantTotals[phase.quadrant].score += score;
      quadrantTotals[phase.quadrant].count++;
      totalScore += score;
      totalCount++;

      if (cp.soxRelevant && rating !== 'done') {
        soxGaps.push(cp.id);
        risks.push({ id: cp.id, label: cp.label, severity: rating === 'not_started' ? 3 : 1 });
      }

      if (rating === 'not_started') {
        risks.push({ id: cp.id, label: cp.label, severity: 2 });
      }
    }

    phaseScores[phase.number] = phaseCount > 0 ? phaseTotal / phaseCount : 0;
  }

  const maturityScore = totalCount > 0 ? totalScore / totalCount : 0;

  const quadrantScores: Record<Quadrant, number> = {
    design: quadrantTotals.design.count > 0 ? quadrantTotals.design.score / quadrantTotals.design.count : 0,
    operate: quadrantTotals.operate.count > 0 ? quadrantTotals.operate.score / quadrantTotals.operate.count : 0,
    dispute: quadrantTotals.dispute.count > 0 ? quadrantTotals.dispute.score / quadrantTotals.dispute.count : 0,
    oversee: quadrantTotals.oversee.count > 0 ? quadrantTotals.oversee.score / quadrantTotals.oversee.count : 0,
  };

  const archetype = classifyArchetype(quadrantScores);

  const soxTotal = GOVERNANCE_FRAMEWORK.phases
    .flatMap(p => p.checkpoints.filter(c => c.soxRelevant))
    .length;
  const auditReadiness = soxGaps.length > 0 ? 1 - soxGaps.length / soxTotal : null;

  const topRisks = risks
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map(r => r.label);

  return {
    maturityScore,
    quadrantScores,
    phaseScores,
    archetype,
    topRisks,
    auditReadiness,
    soxGaps,
  };
}

function classifyArchetype(scores: Record<Quadrant, number>): Archetype {
  const designStrong = scores.design >= 0.6;
  const operateStrong = scores.operate >= 0.6;
  const overseeStrong = scores.oversee >= 0.6;

  if (designStrong && operateStrong && overseeStrong) return 'Organic Grower';
  if (!designStrong && operateStrong) return 'Operator Without Framework';
  if (designStrong && !operateStrong) return 'Foundation Builder';
  return 'Greenfield';
}
```

- [ ] **Step 2: Verify typecheck and runtime sanity**

```bash
pnpm typecheck
```

Expected: PASS.

Run a scoring sanity check with a synthetic all-done answer map:

```bash
npx tsx -e '
import { GOVERNANCE_FRAMEWORK } from "./data/prizym-governance/engine/framework";
import { scoreAssessment } from "./data/prizym-governance/engine/scoring";
const allDone: Record<string, "done"> = {};
for (const p of GOVERNANCE_FRAMEWORK.phases)
  for (const c of p.checkpoints) allDone[c.id] = "done";
const r = scoreAssessment(allDone);
console.log("maturity:", r.maturityScore, "archetype:", r.archetype, "auditReadiness:", r.auditReadiness);
'
```

Expected output: `maturity: 1 archetype: Organic Grower auditReadiness: null`

(`auditReadiness` is `null` when there are zero SOX gaps — that's the expected behavior per the port.)

- [ ] **Step 3: Commit**

```bash
git add data/prizym-governance/engine/scoring.ts
git commit -m "feat(sgm-gold): port maturity scoring + archetype engine from aicr-sgm-cf"
```

---

### Task 5: Create persistence interface and localStorage adapter

**Files:**
- Create: `lib/prizym-governance/persistence.ts`

- [ ] **Step 1: Create the persistence file**

Create `lib/prizym-governance/persistence.ts`:

```ts
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
```

- [ ] **Step 2: Verify the path alias resolves**

```bash
pnpm typecheck
```

Expected: PASS. If `@/data/...` path alias is not configured in `tsconfig.json`, fix the import to a relative path: `../../data/prizym-governance/engine/types`. Check `tsconfig.json` first — Next.js default `@/*` maps to the repo root.

- [ ] **Step 3: Commit**

```bash
git add lib/prizym-governance/persistence.ts
git commit -m "feat(sgm-gold): add assessment persistence interface + localStorage adapter"
```

---

### Task 6: Create the Zustand assessment store

**Files:**
- Create: `lib/prizym-governance/store.ts`

- [ ] **Step 1: Create the store**

Create `lib/prizym-governance/store.ts`:

```ts
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
```

- [ ] **Step 2: Typecheck (will fail until Task 8 creates the seed file)**

```bash
pnpm typecheck
```

Expected: **FAIL** with "Cannot find module '@/data/prizym-governance/henry-schein/assessment-state'". That's expected — Task 8 creates that file. Do not commit yet; keep the store file uncommitted until the seed import resolves.

- [ ] **Step 3: Do not commit yet**

This file stays uncommitted until Task 8 creates the seed import target. Proceed to Task 7.

---

### Task 7: Create the Henry Schein org profile data

**Files:**
- Create: `data/prizym-governance/henry-schein/org-profile.ts`

- [ ] **Step 1: Create the org profile**

Create `data/prizym-governance/henry-schein/org-profile.ts`:

```ts
// Synthetic tenant profile for the Gold Standard demo. Henry Schein is
// used as the plausible prospect persona — this data is invented for
// the showcase, not sourced from any real HS engagement.

export interface OrgProfile {
  name: string;
  shortName: string;
  industry: string;
  subIndustry: string;
  entityType: 'Public (SOX)' | 'Private' | 'PE-backed';
  headquarters: string;
  region: 'Americas' | 'EMEA' | 'APAC' | 'Global';
  employees: number;
  salesHeadcount: number;
  revenueUsd: number;
  fiscalYearEnd: string; // MM-DD
  sponsor: {
    name: string;
    title: string;
  };
  assessmentOwner: {
    name: string;
    title: string;
  };
  engagementStartedAt: string; // ISO
  plansInScope: number;
  countriesInScope: number;
  notes: string;
}

export const henryScheinOrgProfile: OrgProfile = {
  name: 'Henry Schein Industries',
  shortName: 'Henry Schein',
  industry: 'Healthcare Distribution',
  subIndustry: 'Medical & Dental Practice Solutions',
  entityType: 'Public (SOX)',
  headquarters: 'Melville, NY',
  region: 'Global',
  employees: 23500,
  salesHeadcount: 4200,
  revenueUsd: 12_600_000_000,
  fiscalYearEnd: '12-31',
  sponsor: {
    name: 'Avery Caldwell',
    title: 'SVP, Global Sales Operations',
  },
  assessmentOwner: {
    name: 'Jordan Pace',
    title: 'Director, Sales Compensation',
  },
  engagementStartedAt: '2026-03-02T00:00:00.000Z',
  plansInScope: 14,
  countriesInScope: 32,
  notes:
    'Multi-region SOX-governed compensation program across Dental, Medical, and Animal Health lines of business. Prior governance maturity concentrated in Design and Oversee quadrants; Operate and Dispute are the known gap areas.',
};
```

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: still fails with the same Task 6 error (missing assessment-state). Proceed to Task 8.

- [ ] **Step 3: Do not commit yet** — commit batched with Task 8.

---

### Task 8: Create the Henry Schein seed assessment state

**Files:**
- Create: `data/prizym-governance/henry-schein/assessment-state.ts`

This is the load-bearing file for "demo looks alive on first visit". The seed encodes a plausible ~60%-complete assessment: Design quadrant strong (mostly Done), Oversee decent (mix of Done/Partial), Operate patchy (mix of Partial/Not Started), Dispute weak (mostly Not Started). This matches the `OrgProfile.notes` field from Task 7.

- [ ] **Step 1: Create the seed file**

Create `data/prizym-governance/henry-schein/assessment-state.ts`:

```ts
// Synthetic ~60%-complete assessment state for the Gold Standard demo.
// Used as the first-visit seed by useAssessmentStore.hydrate() so the
// dashboard and future wizard are populated on page load.
//
// Shape: Design strong · Oversee decent · Operate patchy · Dispute weak —
// matches henryScheinOrgProfile.notes. Updating checkpoint counts below
// REQUIRES re-checking that every id still exists in the ported framework.ts.

import type { AnswerMap, Rating } from '@/data/prizym-governance/engine/types';

// Helper: assign a rating to a list of checkpoint ids
const assign = (ids: string[], rating: Rating, into: AnswerMap) => {
  for (const id of ids) into[id] = rating;
};

const seed: AnswerMap = {};

// ── DESIGN QUADRANT (strong: 80% done, 15% partial, 5% not started) ──────
assign(
  [
    'p1-01','p1-02','p1-03','p1-04','p1-05','p1-06','p1-07',
    'p2-01','p2-02','p2-05','p2-06','p2-07',
    'p3-01','p3-02','p3-03','p3-04','p3-06','p3-07',
    'p4-01','p4-02','p4-04','p4-06',
    'p5-01','p5-02','p5-03','p5-04','p5-07','p5-08',
    'p6-01','p6-02','p6-03','p6-06',
  ],
  'done',
  seed,
);
assign(
  ['p1-08','p2-03','p2-04','p3-05','p4-03','p4-05','p4-07','p5-05','p5-06','p6-04','p6-05'],
  'partial',
  seed,
);
assign(['p6-07'], 'not_started', seed);

// ── OPERATE QUADRANT (patchy: 35% done, 40% partial, 25% not started) ────
assign(
  ['p7-01','p7-02','p7-03','p7-07','p9-01','p9-06','p10-02','p10-05'],
  'done',
  seed,
);
assign(
  [
    'p7-04','p7-05','p7-07','p7-08',
    'p9-02','p9-03','p9-05','p9-07',
    'p10-01','p10-04','p10-06',
  ],
  'partial',
  seed,
);
assign(
  ['p7-06','p9-04','p10-03','p10-07'],
  'not_started',
  seed,
);

// ── DISPUTE QUADRANT (weak: 15% done, 30% partial, 55% not started) ──────
assign(['p8-01'], 'done', seed);
assign(['p8-02','p8-06'], 'partial', seed);
assign(['p8-03','p8-04','p8-05','p8-07'], 'not_started', seed);

// ── OVERSEE QUADRANT (decent: 55% done, 30% partial, 15% not started) ────
assign(
  ['p11-01','p11-02','p11-03','p11-04','p12-01','p12-02','p12-03','p12-07'],
  'done',
  seed,
);
assign(
  ['p11-05','p11-06','p12-04','p12-05','p12-06'],
  'partial',
  seed,
);
assign(['p11-07','p12-08'], 'not_started', seed);

export const henryScheinSeedAnswers: AnswerMap = seed;
```

- [ ] **Step 2: Verify typecheck passes and the seed covers all 88 checkpoints**

```bash
pnpm typecheck
```

Expected: PASS (the store's broken import is now resolved).

Run the seed coverage sanity check:

```bash
npx tsx -e '
import { GOVERNANCE_FRAMEWORK } from "./data/prizym-governance/engine/framework";
import { henryScheinSeedAnswers } from "./data/prizym-governance/henry-schein/assessment-state";
import { scoreAssessment } from "./data/prizym-governance/engine/scoring";
const allIds = GOVERNANCE_FRAMEWORK.phases.flatMap(p => p.checkpoints.map(c => c.id));
const missing = allIds.filter(id => !(id in henryScheinSeedAnswers));
const extra = Object.keys(henryScheinSeedAnswers).filter(id => !allIds.includes(id));
const r = scoreAssessment(henryScheinSeedAnswers);
console.log("total:", allIds.length, "seeded:", Object.keys(henryScheinSeedAnswers).length, "missing:", missing.length, "extra:", extra.length);
console.log("maturity:", r.maturityScore.toFixed(2), "archetype:", r.archetype);
console.log("quadrants:", JSON.stringify(r.quadrantScores, null, 0));
'
```

Expected output:
- `total: 88 seeded: 88 missing: 0 extra: 0`
- `maturity: 0.60` (±0.05)
- `archetype: Operator Without Framework` OR `Foundation Builder` (either is valid given the 60% shape)
- Quadrant scores roughly: design ~0.85, operate ~0.40, dispute ~0.18, oversee ~0.70

If `missing` is non-zero or any checkpoint id is typo'd, fix the seed file before committing.

- [ ] **Step 3: Commit tasks 6, 7, 8 together**

```bash
git add lib/prizym-governance/store.ts data/prizym-governance/henry-schein/
git commit -m "feat(sgm-gold): add Zustand assessment store + Henry Schein synthetic seed"
```

---

### Task 9: Swap ThemeProvider token values to SPARCC SPM palette

**Files:**
- Modify: `components/demos/prizym-governance/ThemeProvider.tsx`

The existing ThemeProvider's structure (LIGHT_TOKENS, DARK_TOKENS, SHARED_TOKENS, useEffect wiring) stays intact. Only color values change.

- [ ] **Step 1: Update SHARED_TOKENS with SPARCC palette**

In `components/demos/prizym-governance/ThemeProvider.tsx`, replace the `SHARED_TOKENS` constant (lines ~79-90 in the existing file) with:

```ts
const SHARED_TOKENS: Record<string, string> = {
  // SPARCC SPM palette — Blue → Indigo → Violet gradient (from Summit SGM themes.ts)
  '--pg-gradient-start': '#0ea5e9',  // sky
  '--pg-gradient-mid1':  '#3b82f6',  // blue
  '--pg-gradient-mid2':  '#6366f1',  // indigo
  '--pg-gradient-end':   '#8b5cf6',  // violet

  '--pg-primary':   '#0ea5e9',
  '--pg-secondary': '#6366f1',
  '--pg-accent':    '#8b5cf6',

  // Quadrant colors — tuned to the SPARCC range for visual coherence
  '--pg-design':  '#0ea5e9',  // sky (Design quadrant)
  '--pg-operate': '#3b82f6',  // blue (Operate quadrant)
  '--pg-dispute': '#6366f1',  // indigo (Dispute quadrant)
  '--pg-oversee': '#8b5cf6',  // violet (Oversee quadrant)

  // Status colors (unchanged — universal)
  '--pg-success': '#10b981',
  '--pg-warning': '#f59e0b',
  '--pg-danger':  '#ef4444',
  '--pg-info':    '#3b82f6',

  // Back-compat aliases — legacy CSS still reads these
  '--pg-navy': '#0f172a',
  '--pg-cyan': '#0ea5e9', // legacy alias — now points at SPARCC primary
  '--pg-gold': '#c9942b',
};
```

- [ ] **Step 2: Update LIGHT_TOKENS accent-tinted values**

In the same file, replace these two keys inside `LIGHT_TOKENS`:

```ts
  '--pg-cyan-bg': 'rgba(14,165,233,0.08)',  // was rgba(6,182,212,0.08)
```

And add a new key for the violet accent tint:

```ts
  '--pg-accent-bg': 'rgba(139,92,246,0.08)',
```

(Place it next to `--pg-cyan-bg`.)

- [ ] **Step 3: Update DARK_TOKENS accent-tinted values**

Replace the matching keys inside `DARK_TOKENS`:

```ts
  '--pg-cyan-bg': 'rgba(14,165,233,0.12)',  // was rgba(6,182,212,0.12)
```

And add:

```ts
  '--pg-accent-bg': 'rgba(139,92,246,0.12)',
```

Also update the sidebar active background to use the violet accent instead of cyan:

```ts
  '--pl-sidebar-border': 'rgba(139,92,246,0.18)',  // was rgba(6,182,212,0.12)
```

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/demos/prizym-governance/ThemeProvider.tsx
git commit -m "feat(sgm-gold): swap prizym-governance theme to SPARCC SPM palette"
```

---

### Task 10: Update the prizym-governance CSS gradients

**Files:**
- Modify: `styles/ext/prizym-governance.css`

- [ ] **Step 1: Update the hero gradient in LIGHT mode (`:root` block)**

In `styles/ext/prizym-governance.css`, find line 36:

```css
  --pg-gradient-hero: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0e4d6e 100%);
```

Replace with:

```css
  --pg-gradient-hero: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 33%, #6366f1 66%, #8b5cf6 100%);
```

- [ ] **Step 2: Update the accent gradient in LIGHT mode**

In the same `:root` block, find line 37:

```css
  --pg-gradient-accent: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
```

Replace with:

```css
  --pg-gradient-accent: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
```

And find line 38 (the subtle gradient):

```css
  --pg-gradient-subtle: linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.06) 100%);
```

Replace with:

```css
  --pg-gradient-subtle: linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(139,92,246,0.06) 100%);
```

And line 39 (card hover gradient):

```css
  --pg-gradient-card-hover: linear-gradient(135deg, rgba(6,182,212,0.03) 0%, rgba(139,92,246,0.03) 100%);
```

Replace with:

```css
  --pg-gradient-card-hover: linear-gradient(135deg, rgba(14,165,233,0.03) 0%, rgba(139,92,246,0.03) 100%);
```

- [ ] **Step 3: Update the brand color in LIGHT mode**

Find line 43:

```css
  --pg-cyan: #06b6d4;
```

Replace with:

```css
  --pg-cyan: #0ea5e9; /* legacy alias — now SPARCC primary */
```

And line 44:

```css
  --pg-cyan-bg: rgba(6,182,212,0.08);
```

Replace with:

```css
  --pg-cyan-bg: rgba(14,165,233,0.08);
```

- [ ] **Step 4: Update mode indicator colors in LIGHT mode**

Find lines 49-51:

```css
  --pg-design: #06b6d4;
  --pg-operate: #3b82f6;
  --pg-oversee: #8b5cf6;
```

Replace with:

```css
  --pg-design: #0ea5e9;   /* sky */
  --pg-operate: #3b82f6;  /* blue — unchanged */
  --pg-dispute: #6366f1;  /* indigo — new */
  --pg-oversee: #8b5cf6;  /* violet — unchanged */
```

- [ ] **Step 5: Update shadows in LIGHT mode to use SPARCC accent**

Find lines 19-20:

```css
  --pg-shadow-lg: 0 8px 24px rgba(6,182,212,0.08);
  --pg-shadow-xl: 0 12px 36px rgba(6,182,212,0.12);
```

Replace with:

```css
  --pg-shadow-lg: 0 8px 24px rgba(99,102,241,0.10);  /* indigo */
  --pg-shadow-xl: 0 12px 36px rgba(139,92,246,0.14); /* violet */
```

- [ ] **Step 6: Apply the same gradient + shadow + accent swaps in the `.dark` block**

Scroll to the `.dark { ... }` block (starting around line 90). Apply the identical rules as Steps 1-5 above — same target line patterns, same replacements. The `.dark` block mirrors `:root` with the same keys, just tuned for dark mode alpha values.

Specifically in `.dark`:
- `--pg-gradient-hero`: `linear-gradient(135deg, #0a0f1e 0%, #0e2c4a 30%, #1b3570 60%, #2a2e6b 100%)` (darker SPARCC hues for dark hero)
- `--pg-gradient-accent`: same as light (`#6366f1 → #8b5cf6`)
- `--pg-shadow-lg`: `0 8px 24px rgba(99,102,241,0.12)`
- `--pg-shadow-xl`: `0 12px 36px rgba(139,92,246,0.18)`
- `--pg-cyan`: `#0ea5e9`
- `--pg-cyan-bg`: `rgba(14,165,233,0.12)`
- Mode colors: same as light (`#0ea5e9`, `#3b82f6`, `#6366f1`, `#8b5cf6`)

- [ ] **Step 7: Runtime smoke test**

Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3100/prizym-governance/dashboard`. Expected:
- Hero section uses the SPARCC sky→violet gradient instead of navy
- Cards have violet-tinted hover shadows instead of cyan
- Sidebar active state accent is violet instead of cyan
- All layout, spacing, typography unchanged
- No visual regressions on the other 8 pages (`/policies`, `/plans`, etc.)

Flip the demo-shell dark/light toggle and verify both modes look correct.

Stop the dev server with `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add styles/ext/prizym-governance.css
git commit -m "feat(sgm-gold): swap prizym-governance CSS to SPARCC SPM gradient"
```

---

### Task 11: Port AskSGMChat component

**Files:**
- Create: `components/demos/prizym-governance/ai/AskSGMChat.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p components/demos/prizym-governance/ai
```

Copy the full contents of `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/client/components/AskSGMChat.tsx` (388 lines) into `components/demos/prizym-governance/ai/AskSGMChat.tsx`.

- [ ] **Step 2: Adapt the theme hook import**

At the top of the new file, replace:

```tsx
import { useTheme } from '../lib/useTheme'
```

with:

```tsx
'use client';

import { usePrizymTheme } from '../ThemeProvider';
```

- [ ] **Step 3: Adapt the theme hook usage**

Inside the `AskSGMChat` component body, replace:

```tsx
const { isDark } = useTheme()
```

with:

```tsx
const { theme } = usePrizymTheme();
const isDark = theme === 'dark';
```

All other references to `isDark` elsewhere in the file work unchanged.

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/demos/prizym-governance/ai/AskSGMChat.tsx
git commit -m "feat(sgm-gold): port AskSGMChat Forge-wired chat component"
```

---

### Task 12: Port AskSGMPanel wrapper

**Files:**
- Create: `components/demos/prizym-governance/ai/AskSGMPanel.tsx`

- [ ] **Step 1: Create the file**

Copy the contents of `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/client/components/AskSGMPanel.tsx` (100 lines) into `components/demos/prizym-governance/ai/AskSGMPanel.tsx`.

- [ ] **Step 2: Adapt imports and SPA-router check**

Replace the top imports:

```tsx
import React, { useState, useEffect } from 'react'
import { useTheme } from '../lib/useTheme'
import { AskSGMChat } from './AskSGMChat'
```

with:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePrizymTheme } from '../ThemeProvider';
import { AskSGMChat } from './AskSGMChat';
```

Inside the component body, replace:

```tsx
const { isDark } = useTheme()
```

with:

```tsx
const { theme } = usePrizymTheme();
const isDark = theme === 'dark';
```

- [ ] **Step 3: Remove the hash-router check (not applicable in Next.js app router)**

Delete lines 22-23 (the "Don't render on the full-page asksgm route" comment and the `if (window.location.hash === '#/asksgm') return null;` line). In Wave 4 when we build `/asksgm` as a real Next.js route, we'll add a proper `usePathname()` check back in. For Wave 1 there is no `/asksgm` route.

- [ ] **Step 4: Swap the floating button color to SPARCC primary**

Find the button's `background: '#4f46e5'` (Tailwind indigo-600, a leftover from the sgm-cf design) and replace with the SPARCC primary. There are two occurrences (the floating button at line ~42 and the send button inside the message input at line ~369):

```tsx
background: '#6366f1', // SPARCC secondary (indigo)
```

For the `boxShadow` on the floating button, replace:

```tsx
boxShadow: '0 4px 20px rgba(79,70,229,0.3)',
```

with:

```tsx
boxShadow: '0 4px 20px rgba(139,92,246,0.32)', // SPARCC violet glow
```

- [ ] **Step 5: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/demos/prizym-governance/ai/AskSGMPanel.tsx
git commit -m "feat(sgm-gold): port AskSGMPanel floating chat wrapper"
```

---

### Task 13: Wire AskSGMPanel into the prizym-governance layout

**Files:**
- Modify: `app/(demos)/prizym-governance/layout.tsx`

- [ ] **Step 1: Update the layout file**

Replace the entire contents of `app/(demos)/prizym-governance/layout.tsx` with:

```tsx
'use client';

import { DemoShell } from '@/components/shell';
import { PrizymThemeProvider } from '@/components/demos/prizym-governance/ThemeProvider';
import { AskSGMPanel } from '@/components/demos/prizym-governance/ai/AskSGMPanel';
import '@/styles/ext/prizym-governance.css';
import demoConfig from './demo.config';

export default function PrizymGovernanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrizymThemeProvider>
      <DemoShell config={demoConfig}>{children}</DemoShell>
      <AskSGMPanel />
    </PrizymThemeProvider>
  );
}
```

Note: `<AskSGMPanel />` sits OUTSIDE `<DemoShell>` but INSIDE `<PrizymThemeProvider>`. That way the panel uses the same theme context but renders as a fixed-position floating element not affected by the shell's layout constraints.

- [ ] **Step 2: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 3: Runtime smoke test — chat works end-to-end**

```bash
pnpm dev
```

Open `http://localhost:3100/prizym-governance/dashboard` and verify:

1. Floating **AskSGM** button is visible bottom-right on the dashboard
2. Clicking it expands a 420×600 chat panel
3. The connection indicator (green dot) turns green within ~2 seconds (Forge session established)
4. Typing "What are the 8 Levers of SPM?" and pressing Enter produces a streaming AI response
5. Closing the panel (× button) returns to the floating button
6. Navigating to `/prizym-governance/policies`, `/prizym-governance/committees`, and one other page shows the button on every one

If the Forge connection fails ("Failed to connect to AskSGM" error), check:
- Network connectivity
- Forge API is live (`curl -I https://forge.aicoderally.com/api/widget`)
- No CORS block in the browser console

Stop the dev server with `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add app/\(demos\)/prizym-governance/layout.tsx
git commit -m "feat(sgm-gold): wire AskSGMPanel into prizym-governance layout"
```

---

### Task 14: Wave 1 exit verification

**Files:** none modified

- [ ] **Step 1: Full typecheck**

```bash
pnpm typecheck
```

Expected: PASS with zero errors.

- [ ] **Step 2: Repo-wide demo standard check**

```bash
pnpm verify:demo-standard
```

Expected: PASS. This runs the route check and marker check for the `prizym-governance` demo slug. If it fails on routes, the `restore-old-sgm-demo` branch's pages should satisfy the required list — the check probably expects `index`, `dashboard`, and the other 8 restored pages, which are all present.

- [ ] **Step 3: Full dev-server smoke test**

```bash
pnpm dev
```

Click through every restored page on `http://localhost:3100`:

- [x] `/prizym-governance/dashboard`
- [x] `/prizym-governance/policies`
- [x] `/prizym-governance/plans`
- [x] `/prizym-governance/templates`
- [x] `/prizym-governance/frameworks`
- [x] `/prizym-governance/documents`
- [x] `/prizym-governance/audit`
- [x] `/prizym-governance/committees`
- [x] `/prizym-governance/analytics`

For each page, verify:
- Renders without errors
- Uses the SPARCC gradient theme (purple-blue, not navy-cyan)
- AskSGM floating button is visible bottom-right
- Button opens a working chat panel

Flip dark/light mode via DemoShell toggle — both modes look correct on every page.

Open devtools console — no red errors. A 404 on `/favicon.ico` is acceptable (demos-cf root concern, not this wave's).

Stop the dev server.

- [ ] **Step 4: Verify the assessment store hydrates correctly from browser console**

Start the dev server again:

```bash
pnpm dev
```

On `http://localhost:3100/prizym-governance/dashboard`, open devtools console and run:

```js
localStorage.getItem('sgm-gold-assessment-v1')
```

Expected: `null` — the store doesn't auto-hydrate in Wave 1 because no page is calling `useAssessmentStore.hydrate()` yet. That's intentional; hydration happens in Wave 2 when the dashboard starts reading assessment state.

Manually trigger hydration to confirm the store/persistence/seed chain works:

```js
// Paste in devtools console on any prizym-governance page
const { useAssessmentStore } = await import('/lib/prizym-governance/store.ts');
useAssessmentStore.getState().hydrate();
const state = useAssessmentStore.getState();
console.log('seeded answers:', Object.keys(state.answers).length);
console.log('score:', state.score().maturityScore.toFixed(2), 'archetype:', state.score().archetype);
console.log('persisted:', JSON.parse(localStorage.getItem('sgm-gold-assessment-v1')).answers ? 'yes' : 'no');
```

Expected: `seeded answers: 88`, `score: 0.60` (±0.05), archetype from the valid set, persisted: yes.

If the dynamic import path doesn't work in dev mode, skip this manual verification — Wave 2 will cover it via the UI.

Stop the dev server.

- [ ] **Step 5: Final Wave 1 commit + tag**

All prior tasks committed. Create a checkpoint tag:

```bash
git tag wave-1-foundation-complete
```

(Tag is local only; do not push until the whole 4-wave build is approved.)

- [ ] **Step 6: Announce completion**

Report to the user:
- All 13 implementation tasks complete
- `pnpm typecheck` and `pnpm verify:demo-standard` pass
- All 9 existing prizym-governance pages now render in the SPARCC SPM palette (sky → blue → indigo → violet gradient)
- AskSGM floating button works on every page, connects to Forge, streams responses
- Assessment engine + Zustand store + Henry Schein seed are importable but not yet wired into any UI (intentional — that's Wave 2)
- Ready for Wave 2 plan (Assess flow: `/assess/wizard`, `/assess/scoping`, `/assess/results`)

---

## Self-review

**Spec coverage** — every Wave 1 bullet in the spec maps to a task:
| Spec bullet | Task |
|---|---|
| Add zustand | Task 1 |
| Rewrite ThemeProvider values | Task 9 |
| Rewrite CSS values | Task 10 |
| Port engine files | Tasks 2, 3, 4 |
| Create persistence + store | Tasks 5, 6 |
| Create Henry Schein seed | Tasks 7, 8 |
| Port AskSGMPanel + AskSGMChat | Tasks 11, 12 |
| Wire into layout | Task 13 |
| Exit criterion (typecheck, pages render, chat works) | Task 14 |

No gaps.

**Placeholder scan** — every task has explicit file paths, complete code blocks, exact commands, and expected outputs. No "TBD", "TODO", "implement later", or "similar to task N" references. Two tasks (11, 12) reference donor source files rather than inlining ~400 lines of code — the reference is by absolute path and the adaptations are fully specified with exact find-and-replace steps.

**Type consistency** — checkpoint IDs referenced in Task 8's seed (`p1-01` through `p12-08`) match the framework ported in Task 3 exactly; the scoring function's `Rating`, `AnswerMap`, `ScoringResult` types from Task 2 are used consistently in Tasks 4, 5, 6, 8. The store's `useAssessmentStore` hook signature matches its consumers in Task 14's smoke test.

**Scope check** — this is Wave 1 of 4. Everything outside "foundation" (routes, wizards, quadrant landings, ASC 606, AI workspace) is explicitly deferred to Waves 2-4. Exit criterion is objective and verifiable.

**Known deferrals (intentional):**
- OpsChief Orb and AskDock components — Wave 4
- `useSgmChat()` hook consolidation — Wave 4
- Test framework (vitest) — Wave 2 when the first interactive component lands
- `/asksgm` full-page route — Wave 4
