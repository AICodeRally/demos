// --- Org & People ---

export type OrgRole = 'Sponsor' | 'Champion' | 'Blocker' | 'User' | 'Observer';

export interface OrgMember {
  id: string;
  name: string;
  title: string;
  company: string;
  role: OrgRole;
  weight: number;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  painPoints: string[];
  goals: string[];
}

// --- Scope & Roadmap ---

export interface ModuleScope {
  id: string;
  moduleName: string;
  description: string;
  priority: number;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  modules: string[];
  timeline?: string;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'doc' | 'deck' | 'link';
  content: string;
}

// --- Capture ---

export type CaptureTag = 'pain-point' | 'decision' | 'action-item' | 'question' | 'insight';

export interface CaptureItem {
  id: string;
  text: string;
  author?: string;
  tags: CaptureTag[];
  timestamp: string;
  source: 'manual' | 'transcript-parse';
  promotedToDecision?: string;
}

export interface Transcript {
  id: string;
  importedAt: string;
  rawText: string;
  parsedItemCount: number;
}

// --- Decisions ---

export interface Vote {
  memberId: string;
  value: 'up' | 'down';
}

export interface DecisionItem {
  id: string;
  text: string;
  tags: CaptureTag[];
  votes: Vote[];
  status: 'open' | 'locked';
  sourceCapture?: string;
  createdAt: string;
}

// --- Workboard ---

export type TaskPriority = 'P0' | 'P1' | 'P2';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface WorkTask {
  id: string;
  title: string;
  rationale?: string;
  priority: TaskPriority;
  status: TaskStatus;
  linkedDecisionId?: string;
  createdAt: string;
}

// --- Session (root object) ---

export interface RallySession {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;

  context: {
    identity: {
      projectName: string;
      brandColor?: string;
      themeName?: string;
      tagline?: string;
    };
    org: OrgMember[];
    personas: Persona[];
    scope: ModuleScope[];
    roadmap: RoadmapPhase[];
    artifacts: Artifact[];
  };

  capture: {
    notes: CaptureItem[];
    transcripts: Transcript[];
  };

  decisions: {
    items: DecisionItem[];
  };

  workboard: {
    tasks: WorkTask[];
  };
}

// --- ForgeSpec (derived output) ---

export interface ForgeSpec {
  version: '1.0';
  generated: string;
  demo: { slug: string; name: string };

  identity: {
    projectName: string;
    brandColor?: string;
    tagline?: string;
  };

  team: {
    name: string;
    title: string;
    company: string;
    role: string;
    weight: number;
  }[];

  personas: {
    name: string;
    role: string;
    painPoints: string[];
    goals: string[];
  }[];

  priorities: {
    p0: { title: string; rationale: string; linkedDecisions: string[] }[];
    p1: { title: string; rationale: string; linkedDecisions: string[] }[];
    p2: { title: string; rationale: string; linkedDecisions: string[] }[];
  };

  decisions: {
    text: string;
    status: 'open' | 'locked';
    weightedScore: number;
    voters: { name: string; vote: 'up' | 'down' }[];
  }[];

  roadmap: {
    phase: string;
    modules: string[];
    timeline?: string;
  }[];

  backlog: {
    title: string;
    priority: TaskPriority;
    status: TaskStatus;
  }[];
}

// --- Config extension ---

export interface CockpitConfig {
  defaultOpen?: boolean;
  captureOnly?: boolean;
}

export interface ResolvedCockpitConfig {
  enabled: true;
  defaultOpen: boolean;
  captureOnly: boolean;
}
