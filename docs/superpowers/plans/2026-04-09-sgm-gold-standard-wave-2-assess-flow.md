# SGM Gold Standard — Wave 2: Assess Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Ship the Assess flow — 4 new routes (`/`, `/assess/wizard`, `/assess/scoping`, `/assess/results`) that consume the Wave 1 foundation (engine, Zustand store, SPARCC theme). At the end of Wave 2, a prospect can land on the home hero, take the 88-checkpoint wizard against the pre-seeded Henry Schein state, view archetype + quadrant scores on the results page, optionally run the 20-question scoping flow, and see the dashboard KPIs update live from the assessment store.

**Architecture:** All four new routes are thin Next.js page wrappers around client components that read/write `useAssessmentStore`. The wizard, scoping, and results components are ported from `aicr-sgm-cf`, with three adaptations: (1) framework data imported directly from `data/prizym-governance/engine/framework.ts` instead of fetched via API, (2) assessment state delegated to `useAssessmentStore` instead of local `useState`, (3) hardcoded `#4f46e5` indigo swapped to SPARCC `#6366f1` secondary or CSS custom properties. Scoping state stays local to the ScopingWizard component (ephemeral, not persisted). Scoping estimate logic is ported client-side from the aicr-sgm-cf server route. Tests: introduce vitest + a small unit test suite for engine math and store mutations.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Zustand (from Wave 1) · vitest (new) · @testing-library/react (new). No new backend — all client-side.

**Precondition:** Wave 1 merged into `restore-old-sgm-demo` branch of `aicr-demos-cf`. Tag `wave-1-foundation-complete` exists. Work on a new branch `wave-2-assess-flow` off `restore-old-sgm-demo`.

**Worktree setup:** `git worktree add -b wave-2-assess-flow ../aicr-demos-cf.wave2-assess-flow restore-old-sgm-demo` then `cd` in and `pnpm install`.

---

## File structure

### Create

| Path | Purpose |
|---|---|
| `data/prizym-governance/scoping.ts` | 5 categories × 4 questions each + 3 staffing templates + 8-role rate card + `calculateEstimate()` pure function, all ported from `aicr-sgm-cf/apps/workers/src/api/scoping.ts` |
| `components/demos/prizym-governance/assess/AssessmentWizard.tsx` | Ported 88-checkpoint wizard, store-wired |
| `components/demos/prizym-governance/assess/ScopingWizard.tsx` | Ported 20-question scoping wizard with local state |
| `components/demos/prizym-governance/assess/Results.tsx` | Ported results page, reads from store |
| `components/demos/prizym-governance/assess/MaturityDial.tsx` | Extracted circular maturity gauge (reused on dashboard) |
| `components/demos/prizym-governance/assess/QuadrantScoreCard.tsx` | Extracted quadrant bar card (reused on dashboard) |
| `components/demos/prizym-governance/LandingHero.tsx` | New home-page hero with CTAs + Henry Schein preview card |
| `app/(demos)/prizym-governance/assess/wizard/page.tsx` | Next route — client component boundary wrapping AssessmentWizard |
| `app/(demos)/prizym-governance/assess/scoping/page.tsx` | Next route — wraps ScopingWizard |
| `app/(demos)/prizym-governance/assess/results/page.tsx` | Next route — wraps Results |
| `vitest.config.ts` | Minimal vitest config at repo root |
| `tests/prizym-governance/engine.test.ts` | Engine scoring unit tests (all-done, all-not-started, mixed) |
| `tests/prizym-governance/store.test.ts` | Store mutation tests (hydrate, setAnswer, reset, resetToSeed) |
| `tests/prizym-governance/scoping-estimate.test.ts` | Scoping estimate function tests |

### Modify

| Path | Change |
|---|---|
| `package.json` | Add `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom` as devDeps + add `"test": "vitest run"` + `"test:watch": "vitest"` scripts |
| `app/(demos)/prizym-governance/page.tsx` | Replace the `redirect('/prizym-governance/dashboard')` with the new `LandingHero` component render |
| `app/(demos)/prizym-governance/dashboard/page.tsx` | Read live maturity/quadrant/archetype from `useAssessmentStore` instead of hardcoded numbers. Add hydration call. |
| `app/(demos)/prizym-governance/demo.config.ts` | Add sidebar nav entries: Home (new), Assess group with Wizard / Scoping / Results subnav |
| `data/prizym-governance/policies.ts` | Fix pre-existing `p7-07` duplicate in Wave 1 seed (remove from `done` list so Operate quadrant narrative matches) — **one-line Wave 1 follow-up** |

---

## Task breakdown

### Task 1: Worktree setup + vitest install

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Create worktree**

Run from `/Users/toddlebaron/Development/aicr-demos-cf`:

```bash
git worktree add -b wave-2-assess-flow ../aicr-demos-cf.wave2-assess-flow restore-old-sgm-demo
cd ../aicr-demos-cf.wave2-assess-flow
pnpm install
```

- [ ] **Step 2: Install test deps**

```bash
pnpm add -D vitest@^3 @testing-library/react@^16 @testing-library/dom@^10 jsdom@^26 @types/react@^19
```

- [ ] **Step 3: Add test scripts to package.json**

Edit `package.json` scripts section to add:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Create vitest.config.ts at repo root**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 5: Verify vitest boots**

```bash
pnpm test 2>&1 | tail -20
```

Expected: vitest runs, finds no tests, exits 0 or with a "no tests" message. If it errors on a missing config or plugin, fix before committing.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "chore(sgm-gold): add vitest + testing-library for Wave 2 tests"
```

---

### Task 2: Port scoping data + estimate function

**Files:**
- Create: `data/prizym-governance/scoping.ts`

- [ ] **Step 1: Read the donor**

Read `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/api/scoping.ts` (155 lines) — it's a Hono route file with `SCOPING_CATEGORIES`, `STAFFING_TEMPLATES`, `RATE_CARD` constants plus a POST handler that computes the estimate.

- [ ] **Step 2: Create the ported data module**

Create `data/prizym-governance/scoping.ts` with:

1. The `SCOPING_CATEGORIES` constant from the donor — verbatim (all 5 categories, all 20 questions).
2. The `STAFFING_TEMPLATES` constant from the donor — verbatim.
3. The `RATE_CARD` constant from the donor — verbatim.
4. A new pure function `calculateEstimate(answers)` that encapsulates the complexity-scoring + template-selection + total-cost math from the donor's POST route handler. Extract that logic faithfully — do not rewrite it.
5. Matching TypeScript interfaces: `Question`, `Category`, `StaffingTemplate`, `RateCardEntry`, `Estimate` (with fields `complexity`, `template`, `staffing`, `estimate: { weeklyRate, totalWeeks, totalEstimate }`).
6. Exports: named exports for each constant and the function.

Keep the file under 250 lines. Do not add comments explaining the math — the donor has no such comments and the point is faithful port.

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add data/prizym-governance/scoping.ts
git commit -m "feat(sgm-gold): port scoping questionnaire + estimate function"
```

---

### Task 3: Engine + store + scoping unit tests (vitest)

**Files:**
- Create: `tests/prizym-governance/engine.test.ts`
- Create: `tests/prizym-governance/store.test.ts`
- Create: `tests/prizym-governance/scoping-estimate.test.ts`

- [ ] **Step 1: Write engine test file**

Create `tests/prizym-governance/engine.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
import { scoreAssessment } from '@/data/prizym-governance/engine/scoring';
import type { AnswerMap, Rating } from '@/data/prizym-governance/engine/types';

const allIds = () => GOVERNANCE_FRAMEWORK.phases.flatMap(p => p.checkpoints.map(c => c.id));

describe('GOVERNANCE_FRAMEWORK', () => {
  it('has exactly 12 phases', () => {
    expect(GOVERNANCE_FRAMEWORK.phases).toHaveLength(12);
  });

  it('has exactly 88 checkpoints total', () => {
    expect(allIds()).toHaveLength(88);
  });

  it('every checkpoint ID is unique', () => {
    const ids = allIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every phase has a valid quadrant', () => {
    const valid = new Set(['design', 'operate', 'dispute', 'oversee']);
    for (const p of GOVERNANCE_FRAMEWORK.phases) {
      expect(valid.has(p.quadrant)).toBe(true);
    }
  });
});

describe('scoreAssessment', () => {
  const mkAnswers = (rating: Rating): AnswerMap => {
    const a: AnswerMap = {};
    for (const id of allIds()) a[id] = rating;
    return a;
  };

  it('returns Organic Grower for all-done', () => {
    const r = scoreAssessment(mkAnswers('done'));
    expect(r.archetype).toBe('Organic Grower');
    expect(r.maturityScore).toBe(1);
    expect(r.auditReadiness).toBeNull();
    expect(r.soxGaps).toHaveLength(0);
  });

  it('returns Greenfield for all-not-started', () => {
    const r = scoreAssessment(mkAnswers('not_started'));
    expect(r.archetype).toBe('Greenfield');
    expect(r.maturityScore).toBe(0);
    expect(r.auditReadiness).not.toBeNull();
    expect(r.auditReadiness!).toBeLessThan(0.01); // ~0
  });

  it('returns 0.5 maturity for all-partial', () => {
    const r = scoreAssessment(mkAnswers('partial'));
    expect(r.maturityScore).toBe(0.5);
  });

  it('returns all four quadrant scores in [0,1]', () => {
    const r = scoreAssessment(mkAnswers('partial'));
    for (const q of ['design', 'operate', 'dispute', 'oversee'] as const) {
      expect(r.quadrantScores[q]).toBeGreaterThanOrEqual(0);
      expect(r.quadrantScores[q]).toBeLessThanOrEqual(1);
    }
  });

  it('classifies Foundation Builder when design strong + operate weak', () => {
    const a: AnswerMap = {};
    for (const id of allIds()) a[id] = 'not_started';
    for (const p of GOVERNANCE_FRAMEWORK.phases) {
      if (p.quadrant === 'design') {
        for (const c of p.checkpoints) a[c.id] = 'done';
      }
    }
    const r = scoreAssessment(a);
    expect(r.archetype).toBe('Foundation Builder');
  });
});
```

- [ ] **Step 2: Write store test file**

Create `tests/prizym-governance/store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAssessmentStore } from '@/lib/prizym-governance/store';

describe('useAssessmentStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAssessmentStore.getState().reset();
  });

  it('starts with empty answers', () => {
    const s = useAssessmentStore.getState();
    expect(Object.keys(s.answers)).toHaveLength(0);
    expect(s.currentPhase).toBe(1);
  });

  it('hydrate() seeds Henry Schein state on first visit', () => {
    useAssessmentStore.getState().hydrate();
    const s = useAssessmentStore.getState();
    expect(Object.keys(s.answers).length).toBe(88);
  });

  it('setAnswer() persists to localStorage', () => {
    useAssessmentStore.getState().hydrate();
    useAssessmentStore.getState().setAnswer('p1-01', 'not_started');
    expect(useAssessmentStore.getState().answers['p1-01']).toBe('not_started');
    const raw = window.localStorage.getItem('sgm-gold-assessment-v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.answers['p1-01']).toBe('not_started');
  });

  it('reset() clears answers and localStorage', () => {
    useAssessmentStore.getState().hydrate();
    useAssessmentStore.getState().reset();
    expect(Object.keys(useAssessmentStore.getState().answers)).toHaveLength(0);
    expect(window.localStorage.getItem('sgm-gold-assessment-v1')).toBeNull();
  });

  it('resetToSeed() restores Henry Schein state after mutation', () => {
    useAssessmentStore.getState().hydrate();
    useAssessmentStore.getState().setAnswer('p1-01', 'not_started');
    useAssessmentStore.getState().resetToSeed();
    expect(useAssessmentStore.getState().answers['p1-01']).toBe('done');
  });

  it('score() returns a valid ScoringResult', () => {
    useAssessmentStore.getState().hydrate();
    const r = useAssessmentStore.getState().score();
    expect(r.maturityScore).toBeGreaterThan(0);
    expect(r.maturityScore).toBeLessThan(1);
    expect(['Foundation Builder', 'Operator Without Framework', 'Organic Grower', 'Greenfield']).toContain(r.archetype);
  });
});
```

- [ ] **Step 3: Write scoping-estimate test file**

Create `tests/prizym-governance/scoping-estimate.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  SCOPING_CATEGORIES,
  STAFFING_TEMPLATES,
  RATE_CARD,
  calculateEstimate,
} from '@/data/prizym-governance/scoping';

describe('scoping data', () => {
  it('has 5 categories', () => {
    expect(SCOPING_CATEGORIES).toHaveLength(5);
  });

  it('has exactly 20 questions', () => {
    const total = SCOPING_CATEGORIES.reduce((n, c) => n + c.questions.length, 0);
    expect(total).toBe(20);
  });

  it('has 3 staffing templates', () => {
    expect(STAFFING_TEMPLATES).toHaveLength(3);
  });

  it('has 8 rate card entries', () => {
    expect(RATE_CARD).toHaveLength(8);
  });
});

describe('calculateEstimate', () => {
  it('returns a complete Estimate for an empty answer set', () => {
    const e = calculateEstimate({});
    expect(e.complexity).toBeGreaterThanOrEqual(0);
    expect(['Lean', 'Standard', 'Enterprise']).toContain(e.template);
    expect(e.staffing.headcount).toBeGreaterThan(0);
    expect(e.estimate.totalEstimate).toBeGreaterThan(0);
  });

  it('produces higher complexity for complex-state answers', () => {
    const simple = calculateEstimate({ 'sc-02': '1-5', 'sc-03': 'Under 50' });
    const complex = calculateEstimate({ 'sc-02': '100+', 'sc-03': '2000+', 'sc-17': '30+' });
    expect(complex.complexity).toBeGreaterThan(simple.complexity);
  });
});
```

- [ ] **Step 4: Run the tests**

```bash
pnpm test 2>&1 | tail -40
```

Expected: all three test files pass, ~15+ tests total. If any fail, fix before committing.

- [ ] **Step 5: Commit**

```bash
git add tests/prizym-governance/
git commit -m "test(sgm-gold): add engine + store + scoping unit tests"
```

---

### Task 4: Port AssessmentWizard component (store-wired)

**Files:**
- Create: `components/demos/prizym-governance/assess/AssessmentWizard.tsx`

- [ ] **Step 1: Read the donor**

Read `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/client/components/AssessmentWizard.tsx` (288 lines).

- [ ] **Step 2: Port with adaptations**

Create `components/demos/prizym-governance/assess/AssessmentWizard.tsx` by copying the donor and applying these changes:

1. **Top of file:**
   ```tsx
   'use client';

   import React from 'react';
   import { useRouter } from 'next/navigation';
   import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
   import { useAssessmentStore } from '@/lib/prizym-governance/store';
   import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
   import type { Rating, Quadrant } from '@/data/prizym-governance/engine/types';
   ```

2. **Delete** the local `Checkpoint`, `Phase`, `Rating`, `Props` interfaces at the top (types come from the engine import).

3. **Delete** the `useState` for `phases`, the `useEffect` that calls `api.getFramework()`, the `loading` state, and the entire loading skeleton JSX block. Replace with `const phases = GOVERNANCE_FRAMEWORK.phases;`.

4. **Delete** the `Props` interface and change the component signature to:
   ```tsx
   export function AssessmentWizard() {
     const router = useRouter();
     const isSox = henryScheinOrgProfile.entityType === 'Public (SOX)';
     const phases = GOVERNANCE_FRAMEWORK.phases;
     const answers = useAssessmentStore(s => s.answers);
     const currentPhaseNumber = useAssessmentStore(s => s.currentPhase);
     const setAnswerInStore = useAssessmentStore(s => s.setAnswer);
     const setCurrentPhase = useAssessmentStore(s => s.setCurrentPhase);
     const currentPhase = Math.max(0, phases.findIndex(p => p.number === currentPhaseNumber));
     // ... rest of body
   ```

5. **Replace** the local `setRating` function with:
   ```tsx
   const setRating = (checkpointId: string, rating: Rating) => {
     setAnswerInStore(checkpointId, rating);
   };
   ```

6. **Replace** the `goNext` / `goPrev` functions to use `setCurrentPhase` + `router.push`:
   ```tsx
   const goNext = () => {
     if (currentPhase < phases.length - 1) {
       setCurrentPhase(phases[currentPhase + 1].number);
       window.scrollTo(0, 0);
     } else {
       router.push('/prizym-governance/assess/results');
     }
   };

   const goPrev = () => {
     if (currentPhase > 0) {
       setCurrentPhase(phases[currentPhase - 1].number);
       window.scrollTo(0, 0);
     } else {
       router.push('/prizym-governance');
     }
   };
   ```

7. **Replace** the pills click handler `setCurrentPhase(idx); window.scrollTo(0, 0)` with `setCurrentPhase(phases[idx].number); window.scrollTo(0, 0)`.

8. **Swap colors** — replace ALL hardcoded color values in the JSX with CSS custom-property references:
   - `#4f46e5` → `var(--pg-primary)` (5 occurrences)
   - `#0f172a` → `var(--pg-text)` (heading colors)
   - `#334155` → `var(--pg-text-secondary)` (body text)
   - `#64748b` → `var(--pg-text-muted)` (evidence prompt text)
   - `#e2e8f0` → `var(--pg-border)` (card/button borders)
   - `#f8fafc` → `var(--pg-card)` (checkpoint card bg)
   - `#f1f5f9` → `var(--pg-surface-alt)` (prev button bg)
   - `#ffffff` → `var(--pg-bg)` (inactive pill bg)

9. **Swap quadrant colors** — replace the `QUADRANT_COLORS` constant with:
   ```tsx
   const QUADRANT_COLORS: Record<Quadrant, string> = {
     design: '#0ea5e9',   // SPARCC sky
     operate: '#3b82f6',  // SPARCC blue
     dispute: '#6366f1',  // SPARCC indigo
     oversee: '#8b5cf6',  // SPARCC violet
   };
   ```

10. **Swap** the rating option colors to semantic status colors:
    ```tsx
    const RATING_OPTIONS: { value: Rating; label: string; color: string }[] = [
      { value: 'done', label: 'Done', color: '#10b981' },         // --pg-success
      { value: 'partial', label: 'Partial', color: '#f59e0b' },   // --pg-warning
      { value: 'not_started', label: 'Not Started', color: '#ef4444' }, // --pg-danger
    ];
    ```

11. **Delete** the `Skeleton` import and its usage — there's no loading state now since the framework is a direct import.

Keep all JSX structure (progress bar, phase header, navigation pills, checkpoint cards, next/prev buttons) byte-identical in layout — only color values and data sources change.

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: PASS. If any `useAssessmentStore` typing errors surface, check that the selector syntax matches the store's `AssessmentStore` interface from Wave 1.

- [ ] **Step 4: Commit**

```bash
git add components/demos/prizym-governance/assess/AssessmentWizard.tsx
git commit -m "feat(sgm-gold): port AssessmentWizard, store-wired + SPARCC themed"
```

---

### Task 5: Port ScopingWizard component

**Files:**
- Create: `components/demos/prizym-governance/assess/ScopingWizard.tsx`

- [ ] **Step 1: Read the donor**

Read `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/client/components/ScopingWizard.tsx` (278 lines).

- [ ] **Step 2: Port with adaptations**

Create `components/demos/prizym-governance/assess/ScopingWizard.tsx` by copying the donor and applying these changes:

1. **Top of file:**
   ```tsx
   'use client';

   import React, { useState } from 'react';
   import { usePrizymTheme } from '../ThemeProvider';
   import { SCOPING_CATEGORIES, calculateEstimate, type Estimate } from '@/data/prizym-governance/scoping';
   ```

2. **Delete** the local `Question`, `Category`, `Estimate` interfaces (types come from the data import).

3. **Replace** the theme hook:
   ```tsx
   const { theme } = usePrizymTheme();
   const isDark = theme === 'dark';
   ```

4. **Delete** the `useState<Category[]>` and the `useEffect` that fetches `/api/scoping`. Replace with `const categories = SCOPING_CATEGORIES;`.

5. **Replace** the `handleSubmit` function:
   ```tsx
   const handleSubmit = () => {
     const result = calculateEstimate(answers);
     setEstimate(result);
     setShowResults(true);
   };
   ```
   (No more fetch to `/api/scoping/estimate`.)

6. **Delete** the `if (categories.length === 0) { return ... }` loading branch — categories is now always populated.

7. **Swap** the hardcoded `#4f46e5` indigo to `#6366f1` (SPARCC secondary) in the JSX. Count: should be ~6 occurrences (progress bar, pills, answer buttons, nav button, complexity card accent).

Keep all other JSX structure and logic byte-identical.

- [ ] **Step 3: Verify typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/demos/prizym-governance/assess/ScopingWizard.tsx
git commit -m "feat(sgm-gold): port ScopingWizard with client-side estimate"
```

---

### Task 6: Port Results component + extract MaturityDial and QuadrantScoreCard

**Files:**
- Create: `components/demos/prizym-governance/assess/Results.tsx`
- Create: `components/demos/prizym-governance/assess/MaturityDial.tsx`
- Create: `components/demos/prizym-governance/assess/QuadrantScoreCard.tsx`

- [ ] **Step 1: Read the donor**

Read `/Users/toddlebaron/Development/aicr-sgm-cf/apps/workers/src/client/components/Results.tsx` (236 lines).

- [ ] **Step 2: Create MaturityDial.tsx**

Create `components/demos/prizym-governance/assess/MaturityDial.tsx` as a standalone component. If the donor has a circular gauge / dial visualization, extract it; if not, create a minimal one:

```tsx
'use client';

import React from 'react';

interface Props {
  /** Score in [0, 1] */
  score: number;
  /** Total size in pixels (default 180) */
  size?: number;
  /** Label shown below the number (default "Maturity") */
  label?: string;
}

export function MaturityDial({ score, size = 180, label = 'Maturity' }: Props) {
  const clamped = Math.max(0, Math.min(1, score));
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const pct = Math.round(clamped * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="mat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="33%" stopColor="#3b82f6" />
            <stop offset="66%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--pg-border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#mat-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div style={{ marginTop: -size / 2 - 12, textAlign: 'center' }}>
        <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--pg-text)', lineHeight: 1 }}>{pct}%</div>
        <div style={{ fontSize: 14, color: 'var(--pg-text-muted)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create QuadrantScoreCard.tsx**

Create `components/demos/prizym-governance/assess/QuadrantScoreCard.tsx`:

```tsx
'use client';

import React from 'react';
import type { Quadrant } from '@/data/prizym-governance/engine/types';

const QUADRANT_META: Record<Quadrant, { label: string; color: string }> = {
  design:  { label: 'Design',  color: '#0ea5e9' },
  operate: { label: 'Operate', color: '#3b82f6' },
  dispute: { label: 'Dispute', color: '#6366f1' },
  oversee: { label: 'Oversee', color: '#8b5cf6' },
};

interface Props {
  quadrant: Quadrant;
  /** Score in [0, 1] */
  score: number;
}

export function QuadrantScoreCard({ quadrant, score }: Props) {
  const meta = QUADRANT_META[quadrant];
  const pct = Math.round(Math.max(0, Math.min(1, score)) * 100);

  return (
    <div
      style={{
        background: 'var(--pg-card)',
        border: '1px solid var(--pg-border)',
        borderRadius: 12,
        padding: 20,
        boxShadow: 'var(--pg-shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: meta.color }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--pg-text)' }}>{meta.label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, color: meta.color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--pg-border)', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: meta.color,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Results.tsx**

Port the donor `Results.tsx` into `components/demos/prizym-governance/assess/Results.tsx`. Adapt:

1. `'use client';` at top.
2. `import { usePrizymTheme } from '../ThemeProvider';` + inline `const { theme } = usePrizymTheme(); const isDark = theme === 'dark';` replacement.
3. Import the store: `import { useAssessmentStore } from '@/lib/prizym-governance/store';`
4. Replace any prop-based `scoringResult` input with a direct call: `const score = useAssessmentStore(s => s.score());`
5. Swap `#4f46e5` → `#6366f1` throughout.
6. Use the new `<MaturityDial score={score.maturityScore} />` and `<QuadrantScoreCard quadrant="design" score={score.quadrantScores.design} />` (plus the three other quadrants) instead of inline SVG/bar code if the donor has them inline. If the donor's layout is different, preserve its structure and just inject the new components where the maturity number and quadrant bars are rendered.
7. Import `henryScheinOrgProfile` and render `Henry Schein Industries` as the engagement name at the top of the results page.
8. Add a "Retake Assessment" button at the bottom that calls `useAssessmentStore.getState().resetToSeed()` and pushes the router back to `/prizym-governance/assess/wizard`.

- [ ] **Step 5: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/demos/prizym-governance/assess/Results.tsx components/demos/prizym-governance/assess/MaturityDial.tsx components/demos/prizym-governance/assess/QuadrantScoreCard.tsx
git commit -m "feat(sgm-gold): port Results + extract MaturityDial and QuadrantScoreCard"
```

---

### Task 7: Create the Next.js route wrappers

**Files:**
- Create: `app/(demos)/prizym-governance/assess/wizard/page.tsx`
- Create: `app/(demos)/prizym-governance/assess/scoping/page.tsx`
- Create: `app/(demos)/prizym-governance/assess/results/page.tsx`

- [ ] **Step 1: Create the wizard route**

```tsx
// app/(demos)/prizym-governance/assess/wizard/page.tsx
'use client';

import { useEffect } from 'react';
import { AssessmentWizard } from '@/components/demos/prizym-governance/assess/AssessmentWizard';
import { useAssessmentStore } from '@/lib/prizym-governance/store';

export default function AssessWizardPage() {
  const hydrate = useAssessmentStore(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return <AssessmentWizard />;
}
```

- [ ] **Step 2: Create the scoping route**

```tsx
// app/(demos)/prizym-governance/assess/scoping/page.tsx
'use client';

import { ScopingWizard } from '@/components/demos/prizym-governance/assess/ScopingWizard';

export default function AssessScopingPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <ScopingWizard />
    </div>
  );
}
```

- [ ] **Step 3: Create the results route**

```tsx
// app/(demos)/prizym-governance/assess/results/page.tsx
'use client';

import { useEffect } from 'react';
import { Results } from '@/components/demos/prizym-governance/assess/Results';
import { useAssessmentStore } from '@/lib/prizym-governance/store';

export default function AssessResultsPage() {
  const hydrate = useAssessmentStore(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return <Results />;
}
```

- [ ] **Step 4: Typecheck + smoke test**

```bash
pnpm typecheck
```

Expected: PASS.

Start a dev server on port 3300 (to avoid clashing with :3100 and :3200):

```bash
npx next dev -p 3300
```

Then in another terminal (or via `/usr/bin/curl`):

```bash
/usr/bin/curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/prizym-governance/assess/wizard
/usr/bin/curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/prizym-governance/assess/scoping
/usr/bin/curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3300/prizym-governance/assess/results
```

Expected: all three return 200. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add app/\(demos\)/prizym-governance/assess/
git commit -m "feat(sgm-gold): add /assess/{wizard,scoping,results} Next routes"
```

---

### Task 8: Create LandingHero + wire home page

**Files:**
- Create: `components/demos/prizym-governance/LandingHero.tsx`
- Modify: `app/(demos)/prizym-governance/page.tsx`

- [ ] **Step 1: Create LandingHero.tsx**

```tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAssessmentStore } from '@/lib/prizym-governance/store';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';

export function LandingHero() {
  const hydrate = useAssessmentStore(s => s.hydrate);
  const score = useAssessmentStore(s => s.score());

  useEffect(() => { hydrate(); }, [hydrate]);

  const maturityPct = Math.round(score.maturityScore * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '48px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 33%, #6366f1 66%, #8b5cf6 100%)',
          borderRadius: 24,
          padding: '64px 48px',
          color: '#ffffff',
          boxShadow: '0 12px 48px rgba(99,102,241,0.25)',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, opacity: 0.9 }}>
          Prizym SGM — Sales Governance Manager
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          Governance that<br />scales with your<br />compensation program.
        </h1>
        <p style={{ fontSize: 20, marginTop: 24, maxWidth: 700, opacity: 0.95, lineHeight: 1.5 }}>
          Assess 88 controls across 12 phases. Design policies that stand up to audit.
          Operate plans with confidence. Oversee the full lifecycle from one view.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          <Link
            href="/prizym-governance/assess/wizard"
            style={{
              padding: '16px 32px',
              background: '#ffffff',
              color: '#6366f1',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            Take the Assessment
          </Link>
          <Link
            href="/prizym-governance/library/framework"
            style={{
              padding: '16px 32px',
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Explore Frameworks
          </Link>
        </div>
      </div>

      {/* Henry Schein synthetic preview card */}
      <div
        style={{
          background: 'var(--pg-card)',
          border: '1px solid var(--pg-border)',
          borderRadius: 16,
          padding: 32,
          boxShadow: 'var(--pg-shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Live Demo Client
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--pg-text)', marginTop: 4 }}>
              {henryScheinOrgProfile.name}
            </div>
            <div style={{ fontSize: 16, color: 'var(--pg-text-secondary)', marginTop: 4 }}>
              {henryScheinOrgProfile.industry} · {henryScheinOrgProfile.entityType} · {henryScheinOrgProfile.countriesInScope} countries · {henryScheinOrgProfile.plansInScope} plans in scope
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#6366f1', lineHeight: 1 }}>{maturityPct}%</div>
            <div style={{ fontSize: 14, color: 'var(--pg-text-muted)' }}>Governance Maturity</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, padding: 16, background: 'var(--pg-surface-alt)', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: 'var(--pg-text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--pg-text)' }}>Current Archetype: {score.archetype}.</strong>{' '}
            {henryScheinOrgProfile.notes}
          </div>
        </div>
        <Link
          href="/prizym-governance/dashboard"
          style={{
            display: 'inline-block',
            marginTop: 20,
            padding: '10px 20px',
            background: '#6366f1',
            color: '#ffffff',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          View Live Dashboard →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace the home page**

Replace the entire contents of `app/(demos)/prizym-governance/page.tsx` with:

```tsx
'use client';

import { LandingHero } from '@/components/demos/prizym-governance/LandingHero';

export default function PrizymGovernanceHome() {
  return <LandingHero />;
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/demos/prizym-governance/LandingHero.tsx "app/(demos)/prizym-governance/page.tsx"
git commit -m "feat(sgm-gold): add LandingHero with Henry Schein preview on /"
```

---

### Task 9: Wire Dashboard to live store + fix p7-07 seed bug

**Files:**
- Modify: `app/(demos)/prizym-governance/dashboard/page.tsx`
- Modify: `data/prizym-governance/henry-schein/assessment-state.ts`

- [ ] **Step 1: Fix the p7-07 seed duplicate**

In `data/prizym-governance/henry-schein/assessment-state.ts`, find the Operate quadrant `done` array and remove `'p7-07'` from it (it also exists in the `partial` array, which is where it belongs per the narrative). The `done` array for Operate should now have 7 items instead of 8, and the total for the Operate section should come out slightly lower (closer to the ~0.40 target).

Re-run the seed coverage sanity check:

```bash
npx tsx -e '
import { GOVERNANCE_FRAMEWORK } from "./data/prizym-governance/engine/framework";
import { henryScheinSeedAnswers } from "./data/prizym-governance/henry-schein/assessment-state";
import { scoreAssessment } from "./data/prizym-governance/engine/scoring";
const allIds = GOVERNANCE_FRAMEWORK.phases.flatMap(p => p.checkpoints.map(c => c.id));
const missing = allIds.filter(id => !(id in henryScheinSeedAnswers));
console.log("missing:", missing.length);
const r = scoreAssessment(henryScheinSeedAnswers);
console.log("maturity:", r.maturityScore.toFixed(2), "archetype:", r.archetype);
console.log("quadrants:", JSON.stringify(r.quadrantScores));
'
```

Expected: `missing: 0`, maturity closer to 0.65, operate quadrant around 0.42, archetype still Foundation Builder.

- [ ] **Step 2: Read the current dashboard**

Read `app/(demos)/prizym-governance/dashboard/page.tsx` so you know what's there. It has hardcoded numbers for "governance maturity", quadrant bars, top risks, etc. Identify each hardcoded value.

- [ ] **Step 3: Wire store into dashboard**

At the top of the dashboard page, add (as a client component if it isn't already):

```tsx
'use client';

import { useEffect } from 'react';
import { useAssessmentStore } from '@/lib/prizym-governance/store';
import { MaturityDial } from '@/components/demos/prizym-governance/assess/MaturityDial';
import { QuadrantScoreCard } from '@/components/demos/prizym-governance/assess/QuadrantScoreCard';
```

Inside the component body:

```tsx
const hydrate = useAssessmentStore(s => s.hydrate);
useEffect(() => { hydrate(); }, [hydrate]);
const score = useAssessmentStore(s => s.score());
const answers = useAssessmentStore(s => s.answers);
const answeredCount = Object.values(answers).filter(r => r !== 'not_started').length;
```

Then replace the hardcoded maturity / quadrant / answered-count values in the JSX with references to `score` and `answeredCount`:
- Maturity gauge → `<MaturityDial score={score.maturityScore} />`
- Quadrant bars (4 of them) → `<QuadrantScoreCard quadrant="design" score={score.quadrantScores.design} />` and three siblings
- Any "X of 88 checkpoints" counter → `{answeredCount} of 88 checkpoints answered`
- Any "archetype" display → `{score.archetype}`
- Any "top risks" list → `score.topRisks` (the first 3 strings)

Preserve all other dashboard layout, card patterns, and hero gradient exactly.

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Re-run tests**

```bash
pnpm test
```

Expected: all tests still pass. (The p7-07 fix may shift the seed's maturity value; if the store test has a hardcoded expected value tied to it, update the test.)

- [ ] **Step 6: Commit (two commits)**

```bash
git add data/prizym-governance/henry-schein/assessment-state.ts
git commit -m "fix(sgm-gold): remove p7-07 seed duplicate, restore operate 0.40 target"

git add app/\(demos\)/prizym-governance/dashboard/page.tsx
git commit -m "feat(sgm-gold): wire dashboard to useAssessmentStore, use shared score cards"
```

---

### Task 10: Add Assess nav entries to demo.config + exit verification

**Files:**
- Modify: `app/(demos)/prizym-governance/demo.config.ts`

- [ ] **Step 1: Read current demo.config.ts**

Read the current `demo.config.ts` to see the `nav` array structure. It's currently empty or has minimal entries.

- [ ] **Step 2: Add Assess group to nav**

Add these nav entries (the exact shape depends on the DemoShell nav schema — check `components/shell/config` or look at a neighbor demo's config like `crestline/demo.config.ts` for the shape):

```ts
nav: [
  { label: 'Home', href: '/prizym-governance' },
  { label: 'Dashboard', href: '/prizym-governance/dashboard' },
  {
    label: 'Assess',
    children: [
      { label: 'Take Assessment', href: '/prizym-governance/assess/wizard' },
      { label: 'Scoping', href: '/prizym-governance/assess/scoping' },
      { label: 'Results', href: '/prizym-governance/assess/results' },
    ],
  },
  { label: 'Policies', href: '/prizym-governance/policies' },
  { label: 'Plans', href: '/prizym-governance/plans' },
  { label: 'Templates', href: '/prizym-governance/templates' },
  { label: 'Frameworks', href: '/prizym-governance/frameworks' },
  { label: 'Documents', href: '/prizym-governance/documents' },
  { label: 'Committees', href: '/prizym-governance/committees' },
  { label: 'Audit Trail', href: '/prizym-governance/audit' },
  { label: 'Analytics', href: '/prizym-governance/analytics' },
],
```

If the DemoShell schema requires a different structure (e.g., sections with headings), adapt accordingly while preserving the intent: Home + Dashboard at top, Assess group with 3 children, then the existing 8 restored pages.

- [ ] **Step 3: Run verify:demo-standard**

```bash
pnpm verify:demo-standard 2>&1 | tail -20
```

Expected: the route check passes (all nav hrefs resolve). The lotos `'TBD'` marker failure is pre-existing and unrelated — noted from Wave 1 exit verification.

- [ ] **Step 4: Full dev smoke test**

```bash
npx next dev -p 3300
```

Then test every Wave 2 route:

```bash
for path in "" "/dashboard" "/assess/wizard" "/assess/scoping" "/assess/results" "/policies" "/committees" "/analytics"; do
  code=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "http://localhost:3300/prizym-governance$path")
  echo "$code  /prizym-governance$path"
done
```

Expected: all return 200.

Open `http://localhost:3300/prizym-governance` in the browser and verify:

- Home landing hero renders in SPARCC gradient with "Take the Assessment" and "Explore Frameworks" CTAs
- Henry Schein preview card shows maturity percentage
- Clicking "Take the Assessment" navigates to `/assess/wizard` and shows Phase 1 checkpoints
- Clicking a Done/Partial/Not Started button updates the progress bar and persists across page reloads (check via `localStorage.getItem('sgm-gold-assessment-v1')` in devtools)
- "Next Phase" advances to Phase 2, "View Results" at phase 12 navigates to `/assess/results`
- Results page shows the MaturityDial, 4 QuadrantScoreCards, archetype, top risks
- Dashboard now shows live numbers matching the current store state (not the old hardcoded ones)
- Scoping flow works end-to-end with the Lean/Standard/Enterprise estimate screen
- AskSGM floating button still works on every page (Wave 1 foundation preserved)

Stop the dev server.

- [ ] **Step 5: Run tests one more time**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit + tag**

```bash
git add "app/(demos)/prizym-governance/demo.config.ts"
git commit -m "feat(sgm-gold): add Assess group to prizym-governance nav + Wave 2 exit verification"
git tag wave-2-assess-flow-complete
```

- [ ] **Step 7: Report completion**

Report:
- 10 tasks complete, X commits on `wave-2-assess-flow` branch
- All Wave 2 routes live and functional
- All tests passing (engine + store + scoping)
- Dashboard and LandingHero now wired to live store
- Seed p7-07 duplicate fixed; maturity shifted to target 0.65
- Ready for merge into `restore-old-sgm-demo` and/or Wave 3 planning

---

## Self-review

**Spec coverage** — every Wave 2 bullet in the spec maps to a task:
| Spec bullet | Task |
|---|---|
| `/assess/wizard` | Tasks 4, 7 |
| `/assess/scoping` | Tasks 2, 5, 7 |
| `/assess/results` | Task 6, 7 |
| Home landing `/` | Task 8 |
| Dashboard live store | Task 9 |
| Test framework (deferred from Wave 1) | Tasks 1, 3 |
| p7-07 seed fix (Wave 1 follow-up) | Task 9 |
| Nav updates | Task 10 |
| Exit verification | Task 10 |

**Placeholder scan** — all port tasks reference donor file paths explicitly and specify adaptations as find-and-replace rules. No "TBD", "similar to", or vague edits. One task (Task 9) says "identify each hardcoded value" as a reading step — that's a read, not an edit placeholder. The subagent can handle a bounded search-and-replace once it has the file in context.

**Type consistency** — `useAssessmentStore` selectors match the Wave 1 store's `AssessmentStore` interface. `Quadrant`, `Rating`, `AnswerMap` types from `engine/types.ts` are used consistently across wizard, results, and test files. `Estimate` type flows from `data/scoping.ts` into `ScopingWizard.tsx` and `scoping-estimate.test.ts`.

**Scope check** — this is Wave 2 of 4. Every non-Assess surface (quadrant landing pages, ASC 606, cases, dispute, library search, full AI workspace) is deferred to Waves 3-4. Exit criterion is objective.

**Known deferrals (intentional):**
- Quadrant landing pages (`/design`, `/operate`, `/dispute`, `/oversee`) — Wave 3
- Policies data expansion 5 → 22 SCPs — Wave 3
- ASC 606 calculator + library — Wave 3
- OpsChief Orb upgrade — Wave 4
- `/asksgm` full-page workspace — Wave 4
