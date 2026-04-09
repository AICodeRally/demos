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
