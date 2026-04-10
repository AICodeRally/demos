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
