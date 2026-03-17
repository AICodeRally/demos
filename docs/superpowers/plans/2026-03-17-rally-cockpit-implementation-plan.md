# Rally Cockpit Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Rally Cockpit — a 5-stage engagement pipeline (Context → Capture → Decisions → Workboard → Spec) integrated into DemoShell v2 as a shell plugin.

**Architecture:** Cockpit is a shell plugin. Demos opt in via `cockpit: true` in `demo.config.ts`. A `CockpitProvider` wraps children when enabled, a `CaptureDrawer` renders as a right-edge panel inside layout plugins, and a full 5-tab `CockpitPage` lives at `/{slug}/cockpit`. All state lives in localStorage per demo slug.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript, Tailwind CSS v4, @dnd-kit/core + @dnd-kit/sortable, Lucide icons. No test framework — verify via `pnpm typecheck` and `pnpm build`.

**Spec:** `docs/superpowers/specs/2026-03-17-rally-cockpit-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `components/shell/cockpit/types.ts` | All Cockpit data types: RallySession, CaptureItem, DecisionItem, Vote, WorkTask, ForgeSpec, etc. |
| `components/shell/cockpit/store.ts` | CockpitProvider, useReducer + localStorage, all hooks (useCockpit, useCapture, useDecisions, useWorkboard, useDrawer, useForgeSpec, useCockpitContext) |
| `components/shell/cockpit/forge-spec.ts` | `deriveForgeSpec(session, config)` — pure function, RallySession → ForgeSpec |
| `components/shell/cockpit/transcript-parser.ts` | `parseTranscript(rawText)` — Granola markdown → CaptureItem[] with keyword heuristic tags |
| `components/shell/cockpit/CaptureDrawer.tsx` | Right-edge 320px drawer: quick-add input, note feed, transcript import toggle, header with controls |
| `components/shell/cockpit/CockpitPage.tsx` | 5-tab layout shell with tab navigation, renders active tab component |
| `components/shell/cockpit/tabs/ContextTab.tsx` | Identity form, org chart cards, personas, scope list, roadmap, artifacts |
| `components/shell/cockpit/tabs/CaptureTab.tsx` | Full-width capture feed with filter bar and bulk actions |
| `components/shell/cockpit/tabs/DecisionsTab.tsx` | Decision items with weighted voting, sort controls, lock/unlock |
| `components/shell/cockpit/tabs/WorkboardTab.tsx` | 3-column (P0/P1/P2) kanban with drag between columns |
| `components/shell/cockpit/tabs/SpecTab.tsx` | Rendered ForgeSpec as formatted document with export buttons |
| `components/shell/cockpit/parts/OrgChart.tsx` | Org member cards with role badges and weight sliders |
| `components/shell/cockpit/parts/VoteBar.tsx` | Thumbs up/down buttons with weighted score display |
| `components/shell/cockpit/parts/TagPicker.tsx` | Multi-select tag chip component |
| `components/shell/cockpit/parts/TranscriptImport.tsx` | Paste area, parse preview, import controls |

### Modified Files

| File | Change |
|------|--------|
| `components/shell/config/types.ts` | Add `cockpit` to DemoConfigBase, `ResolvedCockpitConfig` type, add cockpit to ResolvedDemoConfig |
| `components/shell/config/defaults.ts` | Normalize `cockpit: true` → ResolvedCockpitConfig in `applyDefaults()` |
| `components/shell/DemoShell.tsx` | Conditionally wrap children in `<CockpitProvider>` |
| `components/shell/plugins/sidebar.tsx` | Insert `<CaptureDrawer>` as flex sibling to `<main>` |
| `components/shell/plugins/topnav.tsx` | Insert `<CaptureDrawer>` as flex sibling to `<main>` |
| `components/shell/plugins/wizard.tsx` | Insert `<CaptureDrawer>` as flex sibling to `<main>` (guided + explore modes) |
| `components/shell/index.ts` | Export cockpit hooks and CockpitPage |
| `package.json` | Add @dnd-kit/core, @dnd-kit/sortable |

### New Route Files (per cockpit-enabled demo)

Each is a 3-line wrapper. Initially enable for `meridian` only (first Rally demo):

| File | Demo |
|------|------|
| `app/(demos)/meridian/cockpit/page.tsx` | Meridian (first Rally) |

---

## Tasks

### Task 1: Add @dnd-kit dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @dnd-kit packages**

```bash
cd /Users/toddlebaron/Development/aicr-demos && pnpm add @dnd-kit/core @dnd-kit/sortable
```

- [ ] **Step 2: Verify installation**

Run: `pnpm typecheck`
Expected: PASS (no regressions)

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @dnd-kit/core and @dnd-kit/sortable for cockpit drag-and-drop"
```

---

### Task 2: Cockpit types

**Files:**
- Create: `components/shell/cockpit/types.ts`

- [ ] **Step 1: Create the types file**

Create `components/shell/cockpit/types.ts` with all data types from the spec. This is the single source of truth for all Cockpit data structures.

```ts
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
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/shell/cockpit/types.ts
git commit -m "feat(cockpit): data model types — RallySession, ForgeSpec, all supporting interfaces"
```

---

### Task 3: Config extension (types + defaults)

**Files:**
- Modify: `components/shell/config/types.ts:16-81`
- Modify: `components/shell/config/defaults.ts:1-29`

- [ ] **Step 1: Add cockpit field to DemoConfigBase**

In `components/shell/config/types.ts`, add to `DemoConfigBase` (after `extensionVars?`):

```ts
  cockpit?: boolean | import('../cockpit/types').CockpitConfig;
```

- [ ] **Step 2: Add cockpit to ResolvedDemoConfig**

In `components/shell/config/types.ts`, add to `ResolvedDemoConfig` (after `wizard?`):

```ts
  cockpit?: import('../cockpit/types').ResolvedCockpitConfig;
```

- [ ] **Step 3: Update applyDefaults() to normalize cockpit**

In `components/shell/config/defaults.ts`, add cockpit normalization inside the return object. After the wizard spread, add:

```ts
    ...(config.cockpit
      ? {
          cockpit: {
            enabled: true as const,
            defaultOpen: typeof config.cockpit === 'object' ? (config.cockpit.defaultOpen ?? false) : false,
            captureOnly: typeof config.cockpit === 'object' ? (config.cockpit.captureOnly ?? false) : false,
          },
        }
      : {}),
```

- [ ] **Step 4: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/shell/config/types.ts components/shell/config/defaults.ts
git commit -m "feat(cockpit): add cockpit field to DemoConfig + ResolvedDemoConfig with defaults"
```

---

### Task 4: Store (CockpitProvider + hooks)

**Files:**
- Create: `components/shell/cockpit/store.ts`

This is the central state management. Uses `useReducer` + localStorage auto-persist.

- [ ] **Step 1: Create store.ts**

Create `components/shell/cockpit/store.ts`:

```ts
'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type {
  RallySession, CaptureItem, CaptureTag, DecisionItem, Vote, WorkTask,
  TaskPriority, TaskStatus, OrgMember, Persona, ModuleScope, RoadmapPhase, Artifact,
} from './types';

// --- Empty session factory ---

function createEmptySession(slug: string): RallySession {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug,
    createdAt: now,
    updatedAt: now,
    context: {
      identity: { projectName: '' },
      org: [],
      personas: [],
      scope: [],
      roadmap: [],
      artifacts: [],
    },
    capture: { notes: [], transcripts: [] },
    decisions: { items: [] },
    workboard: { tasks: [] },
  };
}

// --- Actions ---

type Action =
  | { type: 'SET_SESSION'; session: RallySession }
  // Context
  | { type: 'UPDATE_IDENTITY'; identity: RallySession['context']['identity'] }
  | { type: 'SET_ORG'; org: OrgMember[] }
  | { type: 'ADD_ORG_MEMBER'; member: OrgMember }
  | { type: 'REMOVE_ORG_MEMBER'; id: string }
  | { type: 'UPDATE_ORG_MEMBER'; member: OrgMember }
  | { type: 'SET_PERSONAS'; personas: Persona[] }
  | { type: 'SET_SCOPE'; scope: ModuleScope[] }
  | { type: 'SET_ROADMAP'; roadmap: RoadmapPhase[] }
  | { type: 'SET_ARTIFACTS'; artifacts: Artifact[] }
  // Capture
  | { type: 'ADD_NOTE'; note: CaptureItem }
  | { type: 'UPDATE_NOTE_TAGS'; id: string; tags: CaptureTag[] }
  | { type: 'IMPORT_NOTES'; notes: CaptureItem[]; transcript: { rawText: string } }
  | { type: 'PROMOTE_TO_DECISION'; captureId: string }
  // Decisions
  | { type: 'ADD_DECISION'; decision: DecisionItem }
  | { type: 'VOTE'; decisionId: string; vote: Vote }
  | { type: 'LOCK_DECISION'; id: string }
  | { type: 'UNLOCK_DECISION'; id: string }
  // Workboard
  | { type: 'ADD_TASK'; task: WorkTask }
  | { type: 'MOVE_TASK'; id: string; priority: TaskPriority }
  | { type: 'UPDATE_TASK_STATUS'; id: string; status: TaskStatus }
  | { type: 'REMOVE_TASK'; id: string }
  // Drawer
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_DRAWER'; open: boolean };

interface StoreState {
  session: RallySession;
  drawerOpen: boolean;
}

function reducer(state: StoreState, action: Action): StoreState {
  const now = new Date().toISOString();
  const s = state.session;

  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.session };

    // Context
    case 'UPDATE_IDENTITY':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, identity: action.identity } } };
    case 'SET_ORG':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, org: action.org } } };
    case 'ADD_ORG_MEMBER':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, org: [...s.context.org, action.member] } } };
    case 'REMOVE_ORG_MEMBER':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, org: s.context.org.filter(m => m.id !== action.id) } } };
    case 'UPDATE_ORG_MEMBER':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, org: s.context.org.map(m => m.id === action.member.id ? action.member : m) } } };
    case 'SET_PERSONAS':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, personas: action.personas } } };
    case 'SET_SCOPE':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, scope: action.scope } } };
    case 'SET_ROADMAP':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, roadmap: action.roadmap } } };
    case 'SET_ARTIFACTS':
      return { ...state, session: { ...s, updatedAt: now, context: { ...s.context, artifacts: action.artifacts } } };

    // Capture
    case 'ADD_NOTE':
      return { ...state, session: { ...s, updatedAt: now, capture: { ...s.capture, notes: [...s.capture.notes, action.note] } } };
    case 'UPDATE_NOTE_TAGS': {
      const notes = s.capture.notes.map(n => n.id === action.id ? { ...n, tags: action.tags } : n);
      return { ...state, session: { ...s, updatedAt: now, capture: { ...s.capture, notes } } };
    }
    case 'IMPORT_NOTES': {
      const transcript = {
        id: crypto.randomUUID(),
        importedAt: now,
        rawText: action.transcript.rawText,
        parsedItemCount: action.notes.length,
      };
      return {
        ...state,
        session: {
          ...s, updatedAt: now,
          capture: {
            notes: [...s.capture.notes, ...action.notes],
            transcripts: [...s.capture.transcripts, transcript],
          },
        },
      };
    }
    case 'PROMOTE_TO_DECISION': {
      const note = s.capture.notes.find(n => n.id === action.captureId);
      if (!note) return state;
      const decision: DecisionItem = {
        id: crypto.randomUUID(),
        text: note.text,
        tags: note.tags,
        votes: [],
        status: 'open',
        sourceCapture: note.id,
        createdAt: now,
      };
      const notes = s.capture.notes.map(n => n.id === action.captureId ? { ...n, promotedToDecision: decision.id } : n);
      return {
        ...state,
        session: {
          ...s, updatedAt: now,
          capture: { ...s.capture, notes },
          decisions: { items: [...s.decisions.items, decision] },
        },
      };
    }

    // Decisions
    case 'ADD_DECISION':
      return { ...state, session: { ...s, updatedAt: now, decisions: { items: [...s.decisions.items, action.decision] } } };
    case 'VOTE': {
      const items = s.decisions.items.map(d => {
        if (d.id !== action.decisionId || d.status === 'locked') return d;
        const votes = d.votes.filter(v => v.memberId !== action.vote.memberId);
        return { ...d, votes: [...votes, action.vote] };
      });
      return { ...state, session: { ...s, updatedAt: now, decisions: { items } } };
    }
    case 'LOCK_DECISION': {
      const items = s.decisions.items.map(d => d.id === action.id ? { ...d, status: 'locked' as const } : d);
      return { ...state, session: { ...s, updatedAt: now, decisions: { items } } };
    }
    case 'UNLOCK_DECISION': {
      const items = s.decisions.items.map(d => d.id === action.id ? { ...d, status: 'open' as const } : d);
      return { ...state, session: { ...s, updatedAt: now, decisions: { items } } };
    }

    // Workboard
    case 'ADD_TASK':
      return { ...state, session: { ...s, updatedAt: now, workboard: { tasks: [...s.workboard.tasks, action.task] } } };
    case 'MOVE_TASK': {
      const tasks = s.workboard.tasks.map(t => t.id === action.id ? { ...t, priority: action.priority } : t);
      return { ...state, session: { ...s, updatedAt: now, workboard: { tasks } } };
    }
    case 'UPDATE_TASK_STATUS': {
      const tasks = s.workboard.tasks.map(t => t.id === action.id ? { ...t, status: action.status } : t);
      return { ...state, session: { ...s, updatedAt: now, workboard: { tasks } } };
    }
    case 'REMOVE_TASK': {
      const tasks = s.workboard.tasks.filter(t => t.id !== action.id);
      return { ...state, session: { ...s, updatedAt: now, workboard: { tasks } } };
    }

    // Drawer
    case 'TOGGLE_DRAWER':
      return { ...state, drawerOpen: !state.drawerOpen };
    case 'SET_DRAWER':
      return { ...state, drawerOpen: action.open };

    default:
      return state;
  }
}

// --- Context ---

const CockpitCtx = createContext<{ state: StoreState; dispatch: React.Dispatch<Action> } | null>(null);

function loadSession(slug: string): RallySession {
  try {
    const raw = localStorage.getItem(`rally-session-${slug}`);
    if (raw) return JSON.parse(raw) as RallySession;
  } catch (e) {
    console.warn('[Cockpit] Failed to load session from localStorage:', e);
  }
  return createEmptySession(slug);
}

export function CockpitProvider({ slug, defaultOpen = false, children }: { slug: string; defaultOpen?: boolean; children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { slug, defaultOpen }, (init) => ({
    session: loadSession(init.slug),
    drawerOpen: init.defaultOpen,
  }));

  // Auto-persist on every mutation
  useEffect(() => {
    try {
      localStorage.setItem(`rally-session-${state.session.slug}`, JSON.stringify(state.session));
    } catch (e) {
      console.warn('[Cockpit] Failed to persist session:', e);
    }
  }, [state.session]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_DRAWER' });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <CockpitCtx.Provider value={{ state, dispatch }}>{children}</CockpitCtx.Provider>;
}

// --- Hooks ---

function useCockpitStore() {
  const ctx = useContext(CockpitCtx);
  if (!ctx) throw new Error('useCockpit must be used within CockpitProvider');
  return ctx;
}

export function useCockpit() {
  const { state, dispatch } = useCockpitStore();
  return { session: state.session, dispatch };
}

export function useDrawer() {
  const { state, dispatch } = useCockpitStore();
  return {
    isOpen: state.drawerOpen,
    toggle: useCallback(() => dispatch({ type: 'TOGGLE_DRAWER' }), [dispatch]),
    setOpen: useCallback((open: boolean) => dispatch({ type: 'SET_DRAWER', open }), [dispatch]),
  };
}

export function useCapture() {
  const { state, dispatch } = useCockpitStore();
  return {
    notes: state.session.capture.notes,
    transcripts: state.session.capture.transcripts,
    addNote: useCallback((text: string, tags: CaptureTag[] = [], author?: string) => {
      dispatch({
        type: 'ADD_NOTE',
        note: { id: crypto.randomUUID(), text, tags, author, timestamp: new Date().toISOString(), source: 'manual' },
      });
    }, [dispatch]),
    updateTags: useCallback((id: string, tags: CaptureTag[]) => {
      dispatch({ type: 'UPDATE_NOTE_TAGS', id, tags });
    }, [dispatch]),
    importTranscript: useCallback((notes: CaptureItem[], rawText: string) => {
      dispatch({ type: 'IMPORT_NOTES', notes, transcript: { rawText } });
    }, [dispatch]),
    promote: useCallback((captureId: string) => {
      dispatch({ type: 'PROMOTE_TO_DECISION', captureId });
    }, [dispatch]),
  };
}

export function useDecisions() {
  const { state, dispatch } = useCockpitStore();
  return {
    items: state.session.decisions.items,
    addDecision: useCallback((text: string, tags: CaptureTag[] = []) => {
      dispatch({
        type: 'ADD_DECISION',
        decision: { id: crypto.randomUUID(), text, tags, votes: [], status: 'open', createdAt: new Date().toISOString() },
      });
    }, [dispatch]),
    vote: useCallback((decisionId: string, memberId: string, value: 'up' | 'down') => {
      dispatch({ type: 'VOTE', decisionId, vote: { memberId, value } });
    }, [dispatch]),
    lock: useCallback((id: string) => dispatch({ type: 'LOCK_DECISION', id }), [dispatch]),
    unlock: useCallback((id: string) => dispatch({ type: 'UNLOCK_DECISION', id }), [dispatch]),
  };
}

export function useWorkboard() {
  const { state, dispatch } = useCockpitStore();
  return {
    tasks: state.session.workboard.tasks,
    addTask: useCallback((title: string, priority: TaskPriority, linkedDecisionId?: string) => {
      dispatch({
        type: 'ADD_TASK',
        task: { id: crypto.randomUUID(), title, priority, status: 'todo', linkedDecisionId, createdAt: new Date().toISOString() },
      });
    }, [dispatch]),
    moveTask: useCallback((id: string, priority: TaskPriority) => dispatch({ type: 'MOVE_TASK', id, priority }), [dispatch]),
    updateStatus: useCallback((id: string, status: TaskStatus) => dispatch({ type: 'UPDATE_TASK_STATUS', id, status }), [dispatch]),
    removeTask: useCallback((id: string) => dispatch({ type: 'REMOVE_TASK', id }), [dispatch]),
  };
}

export function useCockpitContext() {
  const { state, dispatch } = useCockpitStore();
  const ctx = state.session.context;
  return {
    identity: ctx.identity,
    org: ctx.org,
    personas: ctx.personas,
    scope: ctx.scope,
    roadmap: ctx.roadmap,
    artifacts: ctx.artifacts,
    updateIdentity: useCallback((identity: RallySession['context']['identity']) => dispatch({ type: 'UPDATE_IDENTITY', identity }), [dispatch]),
    setOrg: useCallback((org: OrgMember[]) => dispatch({ type: 'SET_ORG', org }), [dispatch]),
    addOrgMember: useCallback((member: OrgMember) => dispatch({ type: 'ADD_ORG_MEMBER', member }), [dispatch]),
    removeOrgMember: useCallback((id: string) => dispatch({ type: 'REMOVE_ORG_MEMBER', id }), [dispatch]),
    updateOrgMember: useCallback((member: OrgMember) => dispatch({ type: 'UPDATE_ORG_MEMBER', member }), [dispatch]),
    setPersonas: useCallback((personas: Persona[]) => dispatch({ type: 'SET_PERSONAS', personas }), [dispatch]),
    setScope: useCallback((scope: ModuleScope[]) => dispatch({ type: 'SET_SCOPE', scope }), [dispatch]),
    setRoadmap: useCallback((roadmap: RoadmapPhase[]) => dispatch({ type: 'SET_ROADMAP', roadmap }), [dispatch]),
    setArtifacts: useCallback((artifacts: Artifact[]) => dispatch({ type: 'SET_ARTIFACTS', artifacts }), [dispatch]),
  };
}

// --- Weighted score helper ---

export function computeWeightedScore(decision: DecisionItem, org: OrgMember[]): number {
  const orgMap = new Map(org.map(m => [m.id, m.weight]));
  return decision.votes.reduce((score, vote) => {
    const weight = orgMap.get(vote.memberId) ?? 1;
    return score + (vote.value === 'up' ? weight : -weight);
  }, 0);
}

// --- ForgeSpec hook (spec-required public API) ---

export function useForgeSpec(demoName: string) {
  const { state } = useCockpitStore();
  const spec = useMemo(() => {
    // Lazy import to avoid circular deps — deriveForgeSpec is a pure function
    const { deriveForgeSpec } = require('./forge-spec');
    return deriveForgeSpec(state.session, demoName);
  }, [state.session, demoName]);

  return {
    spec,
    exportJson: useCallback(() => JSON.stringify(spec, null, 2), [spec]),
    exportMarkdown: useCallback(() => {
      const { forgeSpecToMarkdown } = require('./forge-spec');
      return forgeSpecToMarkdown(spec);
    }, [spec]),
  };
}
```

> **Note:** `useForgeSpec` uses `require()` to avoid circular dependency (forge-spec.ts imports `computeWeightedScore` from store.ts). The dynamic import is fine since forge-spec.ts is bundled into the same chunk. Alternative: the implementer may move `computeWeightedScore` into a shared utils file to break the cycle and use static imports instead.

- [ ] **Step 2: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/shell/cockpit/store.ts
git commit -m "feat(cockpit): CockpitProvider store — reducer, localStorage persistence, all hooks"
```

---

### Task 5: Transcript parser + ForgeSpec derivation

**Files:**
- Create: `components/shell/cockpit/transcript-parser.ts`
- Create: `components/shell/cockpit/forge-spec.ts`

- [ ] **Step 1: Create transcript-parser.ts**

Create `components/shell/cockpit/transcript-parser.ts`:

```ts
import type { CaptureItem, CaptureTag } from './types';

const TAG_PATTERNS: [RegExp, CaptureTag][] = [
  [/\b(problem|issue|broken|frustrat|pain|struggle|difficult|fail)/i, 'pain-point'],
  [/\b(decided|agreed|go with|we'll use|chosen|settled on)/i, 'decision'],
  [/\b(should|need to|must|let's|action item|todo|follow.?up)/i, 'action-item'],
  [/\?\s*$/, 'question'],
];

function detectTags(text: string): CaptureTag[] {
  const tags = new Set<CaptureTag>();
  for (const [pattern, tag] of TAG_PATTERNS) {
    if (pattern.test(text)) tags.add(tag);
  }
  if (tags.size === 0) tags.add('insight');
  return Array.from(tags);
}

export function parseTranscript(rawText: string): CaptureItem[] {
  // Split on double newlines or speaker turn patterns like "Speaker Name:"
  const blocks = rawText
    .split(/\n{2,}|\n(?=[A-Z][a-z]+ [A-Z][a-z]+:)/)
    .map(b => b.trim())
    .filter(b => b.length > 10); // skip tiny fragments

  const now = new Date().toISOString();

  return blocks.map((block) => {
    // Extract speaker if line starts with "Name:"
    let author: string | undefined;
    let text = block;
    const speakerMatch = block.match(/^([A-Z][a-z]+ [A-Z][a-z]+):\s*/);
    if (speakerMatch) {
      author = speakerMatch[1];
      text = block.slice(speakerMatch[0].length);
    }

    return {
      id: crypto.randomUUID(),
      text: text.trim(),
      author,
      tags: detectTags(text),
      timestamp: now,
      source: 'transcript-parse' as const,
    };
  });
}
```

- [ ] **Step 2: Create forge-spec.ts**

Create `components/shell/cockpit/forge-spec.ts`:

```ts
import type { RallySession, ForgeSpec } from './types';
import { computeWeightedScore } from './store';

export function deriveForgeSpec(session: RallySession, demoName: string): ForgeSpec {
  const { context, decisions, workboard } = session;

  // Build priorities from workboard, linking back to decisions
  function buildPriority(priority: 'P0' | 'P1' | 'P2') {
    return workboard.tasks
      .filter(t => t.priority === priority)
      .map(t => {
        const linked = t.linkedDecisionId
          ? decisions.items.find(d => d.id === t.linkedDecisionId)
          : undefined;
        return {
          title: t.title,
          rationale: t.rationale ?? linked?.text ?? '',
          linkedDecisions: linked ? [linked.text] : [],
        };
      });
  }

  return {
    version: '1.0',
    generated: new Date().toISOString(),
    demo: { slug: session.slug, name: demoName },

    identity: {
      projectName: context.identity.projectName,
      brandColor: context.identity.brandColor,
      tagline: context.identity.tagline,
    },

    team: context.org.map(m => ({
      name: m.name,
      title: m.title,
      company: m.company,
      role: m.role,
      weight: m.weight,
    })),

    personas: context.personas.map(p => ({
      name: p.name,
      role: p.role,
      painPoints: p.painPoints,
      goals: p.goals,
    })),

    priorities: {
      p0: buildPriority('P0'),
      p1: buildPriority('P1'),
      p2: buildPriority('P2'),
    },

    decisions: decisions.items.map(d => ({
      text: d.text,
      status: d.status,
      weightedScore: computeWeightedScore(d, context.org),
      voters: d.votes.map(v => {
        const member = context.org.find(m => m.id === v.memberId);
        return { name: member?.name ?? 'Unknown', vote: v.value };
      }),
    })),

    roadmap: context.roadmap.map(r => ({
      phase: r.phase,
      modules: r.modules,
      timeline: r.timeline,
    })),

    backlog: workboard.tasks.map(t => ({
      title: t.title,
      priority: t.priority,
      status: t.status,
    })),
  };
}

export function forgeSpecToMarkdown(spec: ForgeSpec): string {
  const lines: string[] = [
    `# ${spec.demo.name} — Forge Spec`,
    `> Generated: ${spec.generated}`,
    '',
    '## Identity',
    `- **Project:** ${spec.identity.projectName}`,
    spec.identity.tagline ? `- **Tagline:** ${spec.identity.tagline}` : '',
    spec.identity.brandColor ? `- **Brand Color:** ${spec.identity.brandColor}` : '',
    '',
    '## Team',
    ...spec.team.map(m => `- **${m.name}** — ${m.title}, ${m.company} (${m.role}, weight: ${m.weight})`),
    '',
    '## Personas',
    ...spec.personas.flatMap(p => [
      `### ${p.name} (${p.role})`,
      `**Pain Points:** ${p.painPoints.join(', ')}`,
      `**Goals:** ${p.goals.join(', ')}`,
      '',
    ]),
    '## Priorities',
    '',
    '### P0 — Must Have',
    ...spec.priorities.p0.map(p => `- **${p.title}** — ${p.rationale}`),
    '',
    '### P1 — Should Have',
    ...spec.priorities.p1.map(p => `- **${p.title}** — ${p.rationale}`),
    '',
    '### P2 — Nice to Have',
    ...spec.priorities.p2.map(p => `- **${p.title}** — ${p.rationale}`),
    '',
    '## Decisions',
    ...spec.decisions.map(d => `- [${d.status}] (score: ${d.weightedScore}) ${d.text}`),
    '',
    '## Roadmap',
    ...spec.roadmap.map(r => `- **${r.phase}:** ${r.modules.join(', ')}${r.timeline ? ` (${r.timeline})` : ''}`),
  ];
  return lines.filter(l => l !== undefined).join('\n');
}
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/shell/cockpit/transcript-parser.ts components/shell/cockpit/forge-spec.ts
git commit -m "feat(cockpit): transcript parser (keyword heuristics) + ForgeSpec derivation"
```

---

### Task 6: Small reusable parts (TagPicker, VoteBar, OrgChart, TranscriptImport)

**Files:**
- Create: `components/shell/cockpit/parts/TagPicker.tsx`
- Create: `components/shell/cockpit/parts/VoteBar.tsx`
- Create: `components/shell/cockpit/parts/OrgChart.tsx`
- Create: `components/shell/cockpit/parts/TranscriptImport.tsx`

- [ ] **Step 1: Create TagPicker.tsx**

A multi-select chip component for capture tags:

```tsx
'use client';

import type { CaptureTag } from '../types';

const TAG_OPTIONS: { value: CaptureTag; label: string; color: string }[] = [
  { value: 'pain-point', label: 'Pain Point', color: '#EF4444' },
  { value: 'decision', label: 'Decision', color: '#8B5CF6' },
  { value: 'action-item', label: 'Action', color: '#F59E0B' },
  { value: 'question', label: 'Question', color: '#3B82F6' },
  { value: 'insight', label: 'Insight', color: '#10B981' },
];

export const ALL_TAGS: CaptureTag[] = TAG_OPTIONS.map(o => o.value);

interface TagPickerProps {
  selected: CaptureTag[];
  onChange: (tags: CaptureTag[]) => void;
  size?: 'sm' | 'md';
}

export function TagPicker({ selected, onChange, size = 'sm' }: TagPickerProps) {
  const toggle = (tag: CaptureTag) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]);
  };

  return (
    <div className="flex flex-wrap gap-1">
      {TAG_OPTIONS.map(opt => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`rounded-full border font-medium transition-colors ${
              size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            }`}
            style={{
              borderColor: active ? opt.color : 'var(--sem-border-default)',
              backgroundColor: active ? `${opt.color}20` : 'transparent',
              color: active ? opt.color : 'var(--sem-text-muted)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function TagBadge({ tag }: { tag: CaptureTag }) {
  const opt = TAG_OPTIONS.find(o => o.value === tag);
  if (!opt) return null;
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
    >
      {opt.label}
    </span>
  );
}
```

- [ ] **Step 2: Create VoteBar.tsx**

```tsx
'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { DecisionItem, OrgMember } from '../types';
import { computeWeightedScore } from '../store';

interface VoteBarProps {
  decision: DecisionItem;
  org: OrgMember[];
  currentMemberId?: string;
  onVote: (value: 'up' | 'down') => void;
  disabled?: boolean;
}

export function VoteBar({ decision, org, currentMemberId, onVote, disabled }: VoteBarProps) {
  const score = computeWeightedScore(decision, org);
  const myVote = currentMemberId ? decision.votes.find(v => v.memberId === currentMemberId)?.value : undefined;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onVote('up')}
        disabled={disabled || decision.status === 'locked'}
        className={`rounded p-1 transition-colors ${myVote === 'up' ? 'bg-green-500/20 text-green-400' : 'text-[var(--sem-text-muted)] hover:text-green-400'} disabled:opacity-30`}
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <span className={`min-w-[2rem] text-center text-sm font-bold ${score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : 'text-[var(--sem-text-muted)]'}`}>
        {score > 0 ? `+${score}` : score}
      </span>
      <button
        onClick={() => onVote('down')}
        disabled={disabled || decision.status === 'locked'}
        className={`rounded p-1 transition-colors ${myVote === 'down' ? 'bg-red-500/20 text-red-400' : 'text-[var(--sem-text-muted)] hover:text-red-400'} disabled:opacity-30`}
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create OrgChart.tsx**

```tsx
'use client';

import { useState } from 'react';
import { Plus, Trash2, Crown, Shield, AlertTriangle, User, Eye } from 'lucide-react';
import type { OrgMember, OrgRole } from '../types';

const ROLE_CONFIG: Record<OrgRole, { icon: typeof Crown; color: string }> = {
  Sponsor: { icon: Crown, color: '#F59E0B' },
  Champion: { icon: Shield, color: '#10B981' },
  Blocker: { icon: AlertTriangle, color: '#EF4444' },
  User: { icon: User, color: '#3B82F6' },
  Observer: { icon: Eye, color: '#6B7280' },
};

interface OrgChartProps {
  members: OrgMember[];
  onAdd: (member: OrgMember) => void;
  onRemove: (id: string) => void;
  onUpdate: (member: OrgMember) => void;
}

export function OrgChart({ members, onAdd, onRemove, onUpdate }: OrgChartProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', title: '', company: '', role: 'User' as OrgRole, weight: 3 });

  const handleAdd = () => {
    if (!draft.name.trim()) return;
    onAdd({ ...draft, id: crypto.randomUUID() });
    setDraft({ name: '', title: '', company: '', role: 'User', weight: 3 });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      {members.map(member => {
        const cfg = ROLE_CONFIG[member.role];
        const Icon = cfg.icon;
        return (
          <div key={member.id} className="flex items-center gap-3 rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-3">
            <Icon className="h-5 w-5 shrink-0" style={{ color: cfg.color }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--sem-text-primary)]">{member.name}</div>
              <div className="text-xs text-[var(--sem-text-muted)]">{member.title} — {member.company}</div>
            </div>
            <select
              value={member.role}
              onChange={e => onUpdate({ ...member, role: e.target.value as OrgRole })}
              className="rounded bg-transparent text-xs text-[var(--sem-text-muted)] outline-none"
            >
              {Object.keys(ROLE_CONFIG).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--sem-text-muted)]">W:</span>
              <input
                type="range" min={1} max={5} value={member.weight}
                onChange={e => onUpdate({ ...member, weight: Number(e.target.value) })}
                className="w-16"
              />
              <span className="w-4 text-center text-xs font-bold text-[var(--sem-text-primary)]">{member.weight}</span>
            </div>
            <button onClick={() => onRemove(member.id)} className="text-[var(--sem-text-muted)] hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {adding ? (
        <div className="space-y-2 rounded-lg border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Title" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Company" value={draft.company} onChange={e => setDraft(d => ({ ...d, company: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add member
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create TranscriptImport.tsx**

```tsx
'use client';

import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import type { CaptureItem } from '../types';
import { parseTranscript } from '../transcript-parser';
import { TagBadge } from './TagPicker';

interface TranscriptImportProps {
  onImport: (items: CaptureItem[], rawText: string) => void;
  onClose: () => void;
}

export function TranscriptImport({ onImport, onClose }: TranscriptImportProps) {
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<CaptureItem[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleParse = () => {
    const items = parseTranscript(rawText);
    setParsed(items);
    setSelected(new Set(items.map(i => i.id)));
  };

  const handleImport = () => {
    if (!parsed) return;
    const items = parsed.filter(i => selected.has(i.id));
    onImport(items, rawText);
  };

  const toggleItem = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (!parsed) {
    return (
      <div className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--sem-text-primary)]">
            <Upload className="h-4 w-4" /> Import Transcript
          </div>
          <button onClick={onClose} className="text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Paste Granola transcript here..."
          className="h-48 w-full rounded border border-[var(--sem-border-default)] bg-transparent p-2 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] outline-none resize-none"
        />
        <button
          onClick={handleParse}
          disabled={rawText.trim().length < 20}
          className="rounded bg-[var(--palette-primary-500)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-30"
        >
          Parse Transcript
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--sem-text-primary)]">
          {selected.size} of {parsed.length} items selected
        </span>
        <div className="flex gap-2">
          <button onClick={() => { setParsed(null); setRawText(''); }} className="text-xs text-[var(--sem-text-muted)]">Back</button>
          <button onClick={onClose} className="text-[var(--sem-text-muted)]"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {parsed.map(item => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full rounded border p-2 text-left text-xs transition-colors ${
              selected.has(item.id)
                ? 'border-[var(--palette-primary-500)] bg-[var(--palette-primary-500)]/10'
                : 'border-[var(--sem-border-default)]'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border ${selected.has(item.id) ? 'border-[var(--palette-primary-500)] bg-[var(--palette-primary-500)]' : 'border-[var(--sem-border-default)]'} flex items-center justify-center`}>
                {selected.has(item.id) && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                {item.author && <span className="font-medium text-[var(--sem-text-primary)]">{item.author}: </span>}
                <span className="text-[var(--sem-text-secondary)]">{item.text.slice(0, 120)}{item.text.length > 120 ? '...' : ''}</span>
                <div className="mt-1 flex gap-1">{item.tags.map(t => <TagBadge key={t} tag={t} />)}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={handleImport}
        disabled={selected.size === 0}
        className="rounded bg-[var(--palette-primary-500)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-30"
      >
        Import {selected.size} Items
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/shell/cockpit/parts/
git commit -m "feat(cockpit): reusable parts — TagPicker, VoteBar, OrgChart, TranscriptImport"
```

---

### Task 7: CaptureDrawer component

**Files:**
- Create: `components/shell/cockpit/CaptureDrawer.tsx`

- [ ] **Step 1: Create CaptureDrawer.tsx**

The 320px right-edge drawer with quick-add input, note feed, and transcript import toggle:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronLeft, Upload, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { ResolvedDemoConfig } from '../config/types';
import type { CaptureTag } from './types';
import { useCapture, useDrawer } from './store';
import { TagPicker, TagBadge } from './parts/TagPicker';
import { TranscriptImport } from './parts/TranscriptImport';

interface CaptureDrawerProps {
  config: ResolvedDemoConfig;
}

export function CaptureDrawer({ config }: CaptureDrawerProps) {
  const { isOpen, toggle } = useDrawer();
  const { notes, addNote, importTranscript } = useCapture();
  const [input, setInput] = useState('');
  const [tags, setTags] = useState<CaptureTag[]>([]);
  const [showImport, setShowImport] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when notes change
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [notes.length]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    addNote(text, tags);
    setInput('');
    setTags([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Collapsed state — thin toggle strip
  if (!isOpen) {
    return (
      <button
        onClick={toggle}
        className="flex w-10 shrink-0 flex-col items-center justify-center gap-2 border-l border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] transition-colors hover:bg-[var(--sem-bg-tertiary)]"
      >
        <ChevronLeft className="h-4 w-4 text-[var(--sem-text-muted)]" />
        <MessageSquare className="h-4 w-4 text-[var(--sem-text-muted)]" />
        {notes.length > 0 && (
          <span className="rounded-full bg-[var(--palette-primary-500)] px-1.5 text-[10px] font-bold text-white">
            {notes.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--sem-border-default)] px-3 py-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[var(--palette-primary-500)]" />
          <span className="text-sm font-medium text-[var(--sem-text-primary)]">Capture</span>
          {notes.length > 0 && (
            <span className="rounded-full bg-[var(--palette-primary-500)]/20 px-1.5 text-[10px] font-bold text-[var(--palette-primary-500)]">
              {notes.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!config.cockpit?.captureOnly && (
            <Link
              href={`/${config.slug}/cockpit`}
              className="rounded p-1 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
              title="Open full Cockpit"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            onClick={() => setShowImport(!showImport)}
            className={`rounded p-1 transition-colors ${showImport ? 'text-[var(--palette-primary-500)]' : 'text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]'}`}
            title="Import transcript"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
          <button onClick={toggle} className="rounded p-1 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Transcript import panel */}
      {showImport && (
        <TranscriptImport
          onImport={(items, rawText) => {
            importTranscript(items, rawText);
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Notes feed */}
      <div ref={feedRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {notes.length === 0 && (
          <p className="text-center text-xs text-[var(--sem-text-muted)] py-8">
            No notes yet. Type below to capture your first note.
          </p>
        )}
        {notes.map(note => (
          <div key={note.id} className="rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-primary)] p-2">
            <div className="text-xs text-[var(--sem-text-secondary)]">{note.text}</div>
            <div className="mt-1 flex items-center gap-1 flex-wrap">
              {note.tags.map(t => <TagBadge key={t} tag={t} />)}
              {note.author && <span className="text-[10px] text-[var(--sem-text-muted)]">— {note.author}</span>}
              {note.promotedToDecision && (
                <span className="rounded bg-purple-500/20 px-1 text-[10px] font-medium text-purple-400">Promoted</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-[var(--sem-border-default)] p-3 space-y-2">
        <TagPicker selected={tags} onChange={setTags} />
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note..."
            className="flex-1 rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1.5 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/shell/cockpit/CaptureDrawer.tsx
git commit -m "feat(cockpit): CaptureDrawer — right-edge 320px panel with quick-add + transcript import"
```

---

### Task 8: DemoShell + layout plugin integration

**Files:**
- Modify: `components/shell/DemoShell.tsx:1-55`
- Modify: `components/shell/plugins/sidebar.tsx:31-75`
- Modify: `components/shell/plugins/topnav.tsx:73-81`
- Modify: `components/shell/plugins/wizard.tsx:18-65,108-109`

- [ ] **Step 1: Update DemoShell.tsx to wrap with CockpitProvider**

In `components/shell/DemoShell.tsx`, add CockpitProvider import and wrap children conditionally.

Add import at top:
```ts
import { CockpitProvider } from './cockpit/store';
```

Replace the return statement (lines 41-54) with:

```tsx
  const content = (
    <div style={cssVars as React.CSSProperties}>
      {layout.render({ config: resolved, children, parts })}

      <Link
        href="/"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        All Demos
      </Link>
    </div>
  );

  if (resolved.cockpit?.enabled) {
    return (
      <CockpitProvider slug={resolved.slug} defaultOpen={resolved.cockpit.defaultOpen}>
        {content}
      </CockpitProvider>
    );
  }

  return content;
```

- [ ] **Step 2: Update sidebar.tsx to render CaptureDrawer**

In `components/shell/plugins/sidebar.tsx`, add import:
```ts
import { CaptureDrawer } from '../cockpit/CaptureDrawer';
```

Replace the `<main>` section (inside the second child div, approximately lines 62-64):

```tsx
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
            {children}
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>
```

Make sure the existing `<main>` standalone tag is replaced by this flex wrapper.

- [ ] **Step 3: Update topnav.tsx to render CaptureDrawer**

In `components/shell/plugins/topnav.tsx`, add the same import. Replace the inner `<div className="flex flex-1 overflow-hidden">` block (lines 73-81) — adding CaptureDrawer after `<main>`:

```tsx
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-[var(--comp-sidebar-border)] bg-[var(--comp-sidebar-bg)] overflow-y-auto">
          {sidebarContent}
        </aside>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
            {children}
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>
      </div>
```

- [ ] **Step 4: Update wizard.tsx to render CaptureDrawer**

In `components/shell/plugins/wizard.tsx`, add the same import. In both the explore mode and guided mode renders, wrap `<main>` with a flex container that includes CaptureDrawer.

For explore mode (around line 33):
```tsx
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            {/* existing explore content */}
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>
```

For guided mode (around line 108):
```tsx
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
            {children}
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>
```

- [ ] **Step 5: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/shell/DemoShell.tsx components/shell/plugins/sidebar.tsx components/shell/plugins/topnav.tsx components/shell/plugins/wizard.tsx
git commit -m "feat(cockpit): integrate CockpitProvider + CaptureDrawer into DemoShell and all 3 layout plugins"
```

---

### Task 9: CockpitPage shell + 5 tab components

**Files:**
- Create: `components/shell/cockpit/CockpitPage.tsx`
- Create: `components/shell/cockpit/tabs/ContextTab.tsx`
- Create: `components/shell/cockpit/tabs/CaptureTab.tsx`
- Create: `components/shell/cockpit/tabs/DecisionsTab.tsx`
- Create: `components/shell/cockpit/tabs/WorkboardTab.tsx`
- Create: `components/shell/cockpit/tabs/SpecTab.tsx`

This is a large task. The implementer should create all 6 files. Key guidance:

- [ ] **Step 1: Create CockpitPage.tsx**

The 5-tab layout shell:

```tsx
'use client';

import { useState } from 'react';
import { Settings, MessageSquare, Scale, Kanban, FileOutput } from 'lucide-react';
import type { DemoConfig } from '../config/types';
import { ContextTab } from './tabs/ContextTab';
import { CaptureTab } from './tabs/CaptureTab';
import { DecisionsTab } from './tabs/DecisionsTab';
import { WorkboardTab } from './tabs/WorkboardTab';
import { SpecTab } from './tabs/SpecTab';

const TABS = [
  { id: 'context', label: 'Context', icon: Settings },
  { id: 'capture', label: 'Capture', icon: MessageSquare },
  { id: 'decisions', label: 'Decisions', icon: Scale },
  { id: 'workboard', label: 'Workboard', icon: Kanban },
  { id: 'spec', label: 'Spec', icon: FileOutput },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function CockpitPage({ config }: { config: DemoConfig }) {
  const [activeTab, setActiveTab] = useState<TabId>('context');

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)]">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                active
                  ? 'border-[var(--palette-primary-500)] text-[var(--palette-primary-500)]'
                  : 'border-transparent text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'context' && <ContextTab />}
        {activeTab === 'capture' && <CaptureTab />}
        {activeTab === 'decisions' && <DecisionsTab />}
        {activeTab === 'workboard' && <WorkboardTab />}
        {activeTab === 'spec' && <SpecTab config={config} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ContextTab.tsx**

```tsx
'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { setTokens } from '../../theme/runtime';
import { useCockpitContext } from '../store';
import type { Persona, ModuleScope, RoadmapPhase, Artifact } from '../types';
import { OrgChart } from '../parts/OrgChart';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-4">
      <h3 className="mb-3 text-lg font-bold text-[var(--sem-text-primary)]">{title}</h3>
      {children}
    </section>
  );
}

export function ContextTab() {
  const {
    identity, org, personas, scope, roadmap, artifacts,
    updateIdentity, addOrgMember, removeOrgMember, updateOrgMember,
    setPersonas, setScope, setRoadmap, setArtifacts,
  } = useCockpitContext();

  return (
    <div className="space-y-6">
      {/* Identity */}
      <Section title="Identity">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Project Name</label>
            <input
              value={identity.projectName}
              onChange={e => updateIdentity({ ...identity, projectName: e.target.value })}
              className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Tagline</label>
            <input
              value={identity.tagline ?? ''}
              onChange={e => updateIdentity({ ...identity, tagline: e.target.value })}
              className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Theme</label>
            <input
              value={identity.themeName ?? ''}
              onChange={e => updateIdentity({ ...identity, themeName: e.target.value })}
              className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--sem-text-muted)]">Brand Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={identity.brandColor ?? '#3b82f6'}
                onChange={e => {
                  const hex = e.target.value;
                  updateIdentity({ ...identity, brandColor: hex });
                  setTokens({ 'palette-primary-500': hex });
                }}
                className="h-9 w-12 cursor-pointer rounded border border-[var(--sem-border-default)]"
              />
              <span className="text-xs text-[var(--sem-text-muted)]">{identity.brandColor ?? '#3b82f6'}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Team (Org Chart) */}
      <Section title="Team">
        <OrgChart members={org} onAdd={addOrgMember} onRemove={removeOrgMember} onUpdate={updateOrgMember} />
      </Section>

      {/* Personas */}
      <Section title="Personas">
        <PersonaList personas={personas} onChange={setPersonas} />
      </Section>

      {/* Scope */}
      <Section title="Module Scope">
        <ScopeList scope={scope} onChange={setScope} />
      </Section>

      {/* Roadmap */}
      <Section title="Roadmap">
        <RoadmapList roadmap={roadmap} onChange={setRoadmap} />
      </Section>

      {/* Artifacts */}
      <Section title="Artifacts">
        <ArtifactList artifacts={artifacts} onChange={setArtifacts} />
      </Section>
    </div>
  );
}

// --- Sub-components ---

function PersonaList({ personas, onChange }: { personas: Persona[]; onChange: (p: Persona[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', role: '', painPoints: '', goals: '' });

  const handleAdd = () => {
    onChange([...personas, {
      id: crypto.randomUUID(), name: draft.name, role: draft.role,
      painPoints: draft.painPoints.split('\n').filter(Boolean),
      goals: draft.goals.split('\n').filter(Boolean),
    }]);
    setDraft({ name: '', role: '', painPoints: '', goals: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      {personas.map(p => (
        <div key={p.id} className="flex items-start justify-between rounded border border-[var(--sem-border-default)] p-3">
          <div>
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{p.name} — {p.role}</div>
            {p.painPoints.length > 0 && (
              <div className="mt-1 text-xs text-[var(--sem-text-muted)]">Pain: {p.painPoints.join(', ')}</div>
            )}
            {p.goals.length > 0 && (
              <div className="mt-1 text-xs text-[var(--sem-text-muted)]">Goals: {p.goals.join(', ')}</div>
            )}
          </div>
          <button onClick={() => onChange(personas.filter(x => x.id !== p.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <input placeholder="Role" value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          </div>
          <textarea placeholder="Pain points (one per line)" value={draft.painPoints} onChange={e => setDraft(d => ({ ...d, painPoints: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] resize-none" rows={2} />
          <textarea placeholder="Goals (one per line)" value={draft.goals} onChange={e => setDraft(d => ({ ...d, goals: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] resize-none" rows={2} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add persona
        </button>
      )}
    </div>
  );
}

function ScopeList({ scope, onChange }: { scope: ModuleScope[]; onChange: (s: ModuleScope[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ moduleName: '', description: '' });

  const handleAdd = () => {
    onChange([...scope, { id: crypto.randomUUID(), moduleName: draft.moduleName, description: draft.description, priority: scope.length + 1 }]);
    setDraft({ moduleName: '', description: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {scope.sort((a, b) => a.priority - b.priority).map((m, idx) => (
        <div key={m.id} className="flex items-center gap-2 rounded border border-[var(--sem-border-default)] px-3 py-2">
          <GripVertical className="h-4 w-4 shrink-0 text-[var(--sem-text-muted)]" />
          <span className="w-6 text-center text-xs font-bold text-[var(--sem-text-muted)]">#{idx + 1}</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{m.moduleName}</div>
            {m.description && <div className="text-xs text-[var(--sem-text-muted)]">{m.description}</div>}
          </div>
          <button onClick={() => onChange(scope.filter(x => x.id !== m.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <input placeholder="Module name" value={draft.moduleName} onChange={e => setDraft(d => ({ ...d, moduleName: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <input placeholder="Description" value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add module
        </button>
      )}
    </div>
  );
}

function RoadmapList({ roadmap, onChange }: { roadmap: RoadmapPhase[]; onChange: (r: RoadmapPhase[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ phase: '', modules: '', timeline: '' });

  const handleAdd = () => {
    onChange([...roadmap, { id: crypto.randomUUID(), phase: draft.phase, modules: draft.modules.split(',').map(s => s.trim()).filter(Boolean), timeline: draft.timeline || undefined }]);
    setDraft({ phase: '', modules: '', timeline: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {roadmap.map(r => (
        <div key={r.id} className="flex items-center justify-between rounded border border-[var(--sem-border-default)] px-3 py-2">
          <div>
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{r.phase}</div>
            <div className="text-xs text-[var(--sem-text-muted)]">{r.modules.join(', ')}{r.timeline ? ` — ${r.timeline}` : ''}</div>
          </div>
          <button onClick={() => onChange(roadmap.filter(x => x.id !== r.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <input placeholder="Phase name" value={draft.phase} onChange={e => setDraft(d => ({ ...d, phase: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <input placeholder="Modules (comma-separated)" value={draft.modules} onChange={e => setDraft(d => ({ ...d, modules: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <input placeholder="Timeline (optional)" value={draft.timeline} onChange={e => setDraft(d => ({ ...d, timeline: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add phase
        </button>
      )}
    </div>
  );
}

function ArtifactList({ artifacts, onChange }: { artifacts: Artifact[]; onChange: (a: Artifact[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', type: 'link' as Artifact['type'], content: '' });

  const handleAdd = () => {
    onChange([...artifacts, { id: crypto.randomUUID(), name: draft.name, type: draft.type, content: draft.content }]);
    setDraft({ name: '', type: 'link', content: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      {artifacts.map(a => (
        <div key={a.id} className="flex items-center justify-between rounded border border-[var(--sem-border-default)] px-3 py-2">
          <div>
            <div className="text-sm font-medium text-[var(--sem-text-primary)]">{a.name}</div>
            <div className="text-xs text-[var(--sem-text-muted)]">[{a.type}] {a.content.slice(0, 80)}{a.content.length > 80 ? '...' : ''}</div>
          </div>
          <button onClick={() => onChange(artifacts.filter(x => x.id !== a.id))} className="text-[var(--sem-text-muted)] hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]" />
            <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as Artifact['type'] }))}
              className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-muted)]">
              <option value="link">Link</option>
              <option value="doc">Doc</option>
              <option value="deck">Deck</option>
            </select>
          </div>
          <textarea placeholder="URL or content" value={draft.content} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)] resize-none" rows={2} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
          <Plus className="h-3 w-3" /> Add artifact
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create CaptureTab.tsx**

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Filter, ArrowUpCircle } from 'lucide-react';
import { useCapture, useCockpitContext } from '../store';
import type { CaptureTag, CaptureItem } from '../types';
import { TagBadge, ALL_TAGS } from '../parts/TagPicker';

type SourceFilter = 'all' | 'manual' | 'transcript-parse';

export function CaptureTab() {
  const { notes, addNote, promote } = useCapture();
  const { org } = useCockpitContext();
  const [tagFilter, setTagFilter] = useState<CaptureTag | null>(null);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newNote, setNewNote] = useState('');

  const filtered = useMemo(() => {
    let items = [...notes];
    if (tagFilter) items = items.filter(n => n.tags.includes(tagFilter));
    if (sourceFilter !== 'all') items = items.filter(n => n.source === sourceFilter);
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notes, tagFilter, sourceFilter]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handlePromoteSelected = () => {
    selected.forEach(id => promote(id));
    setSelected(new Set());
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-[var(--sem-text-muted)]" />
        <div className="flex gap-1">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                tagFilter === tag
                  ? 'bg-[var(--palette-primary-500)] text-white'
                  : 'bg-[var(--sem-bg-secondary)] text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value as SourceFilter)}
          className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-muted)]"
        >
          <option value="all">All Sources</option>
          <option value="manual">Manual</option>
          <option value="transcript-parse">Transcript</option>
        </select>
        {selected.size > 0 && (
          <button
            onClick={handlePromoteSelected}
            className="flex items-center gap-1 rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white"
          >
            <ArrowUpCircle className="h-3 w-3" /> Promote {selected.size} to Decisions
          </button>
        )}
      </div>

      {/* Add note */}
      <div className="flex gap-2">
        <input
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddNote()}
          placeholder="Add a capture note..."
          className="flex-1 rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]"
        />
        <button onClick={handleAddNote} className="rounded bg-[var(--palette-primary-500)] px-4 py-2 text-sm font-medium text-white">
          Add
        </button>
      </div>

      {/* Notes feed */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--sem-text-muted)]">No capture items yet. Add your first note above.</div>
        )}
        {filtered.map(note => (
          <div key={note.id} className="flex items-start gap-3 rounded border border-[var(--sem-border-default)] p-3">
            <input
              type="checkbox"
              checked={selected.has(note.id)}
              onChange={() => toggleSelect(note.id)}
              className="mt-1 shrink-0"
            />
            <div className="flex-1">
              <div className="text-sm text-[var(--sem-text-primary)]">
                {note.author && <span className="font-medium">{note.author}: </span>}
                {note.text}
              </div>
              <div className="mt-1 flex items-center gap-2">
                {note.tags.map(t => <TagBadge key={t} tag={t} />)}
                <span className="text-xs text-[var(--sem-text-muted)]">
                  {new Date(note.timestamp).toLocaleTimeString()}
                </span>
                {note.source === 'transcript-parse' && (
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400">transcript</span>
                )}
                {note.promotedToDecision && (
                  <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">Promoted</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create DecisionsTab.tsx**

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Plus, Lock, Unlock } from 'lucide-react';
import { useDecisions, useCockpitContext, computeWeightedScore } from '../store';
import type { CaptureTag, DecisionItem } from '../types';
import { VoteBar } from '../parts/VoteBar';
import { TagBadge, ALL_TAGS, TagPicker } from '../parts/TagPicker';

type SortMode = 'score' | 'newest' | 'tag';

export function DecisionsTab() {
  const { items, addDecision, vote, lock, unlock } = useDecisions();
  const { org } = useCockpitContext();
  const [sortMode, setSortMode] = useState<SortMode>('score');
  const [votingAs, setVotingAs] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftTags, setDraftTags] = useState<CaptureTag[]>([]);

  const sorted = useMemo(() => {
    const list = [...items];
    switch (sortMode) {
      case 'score':
        return list.sort((a, b) => computeWeightedScore(b, org) - computeWeightedScore(a, org));
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'tag':
        return list.sort((a, b) => (a.tags[0] ?? '').localeCompare(b.tags[0] ?? ''));
    }
  }, [items, org, sortMode]);

  const handleAdd = () => {
    if (draftText.trim()) {
      addDecision(draftText.trim(), draftTags);
      setDraftText('');
      setDraftTags([]);
      setAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={sortMode}
          onChange={e => setSortMode(e.target.value as SortMode)}
          className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-muted)]"
        >
          <option value="score">Sort by Score</option>
          <option value="newest">Sort by Newest</option>
          <option value="tag">Sort by Tag</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--sem-text-muted)]">Voting as:</span>
          <select
            value={votingAs}
            onChange={e => setVotingAs(e.target.value)}
            className="rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-muted)]"
          >
            <option value="">Select member...</option>
            {org.map(m => <option key={m.id} value={m.id}>{m.name} (W:{m.weight})</option>)}
          </select>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="ml-auto flex items-center gap-1 rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white"
        >
          <Plus className="h-3 w-3" /> Add Decision
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="space-y-2 rounded border border-dashed border-[var(--sem-border-default)] p-3">
          <input
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            placeholder="Decision text..."
            className="w-full rounded border border-[var(--sem-border-default)] bg-transparent px-3 py-2 text-sm text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]"
          />
          <TagPicker selected={draftTags} onChange={setDraftTags} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="rounded bg-[var(--palette-primary-500)] px-3 py-1 text-xs font-medium text-white">Add</button>
            <button onClick={() => setAdding(false)} className="rounded px-3 py-1 text-xs text-[var(--sem-text-muted)]">Cancel</button>
          </div>
        </div>
      )}

      {/* Decision list */}
      {sorted.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--sem-text-muted)]">No decisions yet. Promote capture items or add directly.</div>
      )}
      {sorted.map(item => (
        <div key={item.id} className={`rounded border p-4 ${item.status === 'locked' ? 'border-green-500/30 bg-green-500/5' : 'border-[var(--sem-border-default)]'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-[var(--sem-text-primary)]">{item.text}</div>
              <div className="mt-1 flex gap-1">
                {item.tags.map(t => <TagBadge key={t} tag={t} />)}
                {item.status === 'locked' && (
                  <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">Locked</span>
                )}
              </div>
            </div>
            <button
              onClick={() => item.status === 'locked' ? unlock(item.id) : lock(item.id)}
              className="shrink-0 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
              title={item.status === 'locked' ? 'Unlock' : 'Lock decision'}
            >
              {item.status === 'locked' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-3">
            <VoteBar
              decision={item}
              org={org}
              currentMemberId={votingAs}
              onVote={(value) => votingAs && vote(item.id, votingAs, value)}
              disabled={item.status === 'locked' || !votingAs}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create WorkboardTab.tsx**

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Plus, GripVertical, ArrowRight, Check, Circle, Loader } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWorkboard, useDecisions } from '../store';
import type { TaskPriority, TaskStatus, WorkTask } from '../types';

const COLUMNS: { id: TaskPriority; label: string; color: string }[] = [
  { id: 'P0', label: 'P0 — Must Have', color: 'red' },
  { id: 'P1', label: 'P1 — Should Have', color: 'amber' },
  { id: 'P2', label: 'P2 — Nice to Have', color: 'blue' },
];

const STATUS_ICONS: Record<TaskStatus, typeof Circle> = {
  'todo': Circle,
  'in-progress': Loader,
  'done': Check,
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': 'todo',
};

function SortableCard({ task, onStatusChange, onRemove, decisionText }: {
  task: WorkTask;
  onStatusChange: () => void;
  onRemove: () => void;
  decisionText?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const StatusIcon = STATUS_ICONS[task.status];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded border border-[var(--sem-border-default)] bg-[var(--sem-bg-primary)] p-3 ${isDragging ? 'opacity-50' : ''}`}
    >
      <button {...attributes} {...listeners} className="mt-0.5 shrink-0 cursor-grab text-[var(--sem-text-muted)]">
        <GripVertical className="h-4 w-4" />
      </button>
      <button onClick={onStatusChange} className="mt-0.5 shrink-0 text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]">
        <StatusIcon className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${task.status === 'done' ? 'line-through text-[var(--sem-text-muted)]' : 'text-[var(--sem-text-primary)]'}`}>
          {task.title}
        </div>
        {decisionText && (
          <div className="mt-1 truncate text-xs text-[var(--sem-text-muted)]">↳ {decisionText}</div>
        )}
      </div>
      <button onClick={onRemove} className="shrink-0 text-xs text-[var(--sem-text-muted)] hover:text-red-400">×</button>
    </div>
  );
}

export function WorkboardTab() {
  const { tasks, addTask, moveTask, updateStatus, removeTask } = useWorkboard();
  const { items: decisions } = useDecisions();
  const [addingTo, setAddingTo] = useState<TaskPriority | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const decisionMap = useMemo(() => new Map(decisions.map(d => [d.id, d.text])), [decisions]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    // Check if dropped on a column header
    const targetCol = COLUMNS.find(c => c.id === overId);
    if (targetCol) {
      moveTask(active.id as string, targetCol.id);
    }
  };

  const handleAdd = (priority: TaskPriority) => {
    if (draftTitle.trim()) {
      addTask(draftTitle.trim(), priority);
      setDraftTitle('');
      setAddingTo(null);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks
            .filter(t => t.priority === col.id)
            .sort((a, b) => {
              const statusOrder: Record<TaskStatus, number> = { 'todo': 0, 'in-progress': 1, 'done': 2 };
              return statusOrder[a.status] - statusOrder[b.status];
            });

          return (
            <div key={col.id} className="flex flex-col rounded-lg border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)]">
              <div className="flex items-center justify-between border-b border-[var(--sem-border-default)] px-3 py-2">
                <span className="text-sm font-bold text-[var(--sem-text-primary)]">{col.label}</span>
                <span className="rounded-full bg-[var(--sem-bg-primary)] px-2 py-0.5 text-xs text-[var(--sem-text-muted)]">
                  {colTasks.length}
                </span>
              </div>

              <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 space-y-2 p-2" style={{ minHeight: 120 }}>
                  {colTasks.map(task => (
                    <SortableCard
                      key={task.id}
                      task={task}
                      onStatusChange={() => updateStatus(task.id, NEXT_STATUS[task.status])}
                      onRemove={() => removeTask(task.id)}
                      decisionText={task.linkedDecisionId ? decisionMap.get(task.linkedDecisionId) : undefined}
                    />
                  ))}

                  {colTasks.length === 0 && !addingTo && (
                    <div className="flex h-20 items-center justify-center text-xs text-[var(--sem-text-muted)]">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </SortableContext>

              <div className="border-t border-[var(--sem-border-default)] p-2">
                {addingTo === col.id ? (
                  <div className="flex gap-1">
                    <input
                      value={draftTitle}
                      onChange={e => setDraftTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAdd(col.id)}
                      placeholder="Task title..."
                      className="flex-1 rounded border border-[var(--sem-border-default)] bg-transparent px-2 py-1 text-xs text-[var(--sem-text-primary)] placeholder:text-[var(--sem-text-muted)]"
                      autoFocus
                    />
                    <button onClick={() => handleAdd(col.id)} className="rounded bg-[var(--palette-primary-500)] px-2 py-1 text-xs text-white">Add</button>
                    <button onClick={() => setAddingTo(null)} className="text-xs text-[var(--sem-text-muted)]">×</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(col.id)}
                    className="flex w-full items-center justify-center gap-1 py-1 text-xs text-[var(--sem-text-muted)] hover:text-[var(--sem-text-primary)]"
                  >
                    <Plus className="h-3 w-3" /> Add Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
```

- [ ] **Step 6: Create SpecTab.tsx**

```tsx
'use client';

import { useMemo, useCallback } from 'react';
import { Copy, Download, FileText } from 'lucide-react';
import type { DemoConfig } from '../../config/types';
import { useCockpit, useCockpitContext, computeWeightedScore } from '../store';
import { deriveForgeSpec, forgeSpecToMarkdown } from '../forge-spec';
import type { ForgeSpec } from '../types';

export function SpecTab({ config }: { config: DemoConfig }) {
  const { session } = useCockpit();
  const { org } = useCockpitContext();

  const spec = useMemo(() => deriveForgeSpec(session, config.client?.name ?? config.product?.name ?? session.slug), [session, config]);
  const json = useMemo(() => JSON.stringify(spec, null, 2), [spec]);
  const markdown = useMemo(() => forgeSpecToMarkdown(spec), [spec]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(json);
  }, [json]);

  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-spec-${session.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [json, session.slug]);

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-spec-${session.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, session.slug]);

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex gap-2">
        <button onClick={handleCopy} className="flex items-center gap-1.5 rounded border border-[var(--sem-border-default)] px-3 py-1.5 text-xs text-[var(--sem-text-primary)] hover:bg-[var(--sem-bg-secondary)]">
          <Copy className="h-3.5 w-3.5" /> Copy JSON
        </button>
        <button onClick={handleDownloadJson} className="flex items-center gap-1.5 rounded border border-[var(--sem-border-default)] px-3 py-1.5 text-xs text-[var(--sem-text-primary)] hover:bg-[var(--sem-bg-secondary)]">
          <Download className="h-3.5 w-3.5" /> Download JSON
        </button>
        <button onClick={handleDownloadMd} className="flex items-center gap-1.5 rounded border border-[var(--sem-border-default)] px-3 py-1.5 text-xs text-[var(--sem-text-primary)] hover:bg-[var(--sem-bg-secondary)]">
          <FileText className="h-3.5 w-3.5" /> Download Markdown
        </button>
      </div>

      {/* Rendered spec */}
      <SpecSection title="Identity">
        <KV label="Project" value={spec.identity.projectName} />
        {spec.identity.brandColor && <KV label="Brand Color" value={spec.identity.brandColor} />}
        {spec.identity.tagline && <KV label="Tagline" value={spec.identity.tagline} />}
      </SpecSection>

      <SpecSection title="Team">
        {spec.team.length === 0 ? <Empty text="No team members defined" /> : (
          <div className="space-y-1">
            {spec.team.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-[var(--sem-text-primary)]">{m.name}</span>
                <span className="text-[var(--sem-text-muted)]">— {m.title}, {m.company}</span>
                <span className="rounded bg-[var(--sem-bg-secondary)] px-1.5 py-0.5 text-xs text-[var(--sem-text-muted)]">{m.role} (W:{m.weight})</span>
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Personas">
        {spec.personas.length === 0 ? <Empty text="No personas defined" /> : (
          <div className="space-y-3">
            {spec.personas.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-[var(--sem-text-primary)]">{p.name} — {p.role}</div>
                {p.painPoints.length > 0 && <div className="text-xs text-[var(--sem-text-muted)]">Pain: {p.painPoints.join(', ')}</div>}
                {p.goals.length > 0 && <div className="text-xs text-[var(--sem-text-muted)]">Goals: {p.goals.join(', ')}</div>}
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Priorities">
        {(['p0', 'p1', 'p2'] as const).map(level => {
          const items = spec.priorities[level];
          if (items.length === 0) return null;
          return (
            <div key={level} className="mb-3">
              <div className="mb-1 text-xs font-bold uppercase text-[var(--sem-text-muted)]">{level.toUpperCase()}</div>
              {items.map((item, i) => (
                <div key={i} className="ml-2 mb-1">
                  <div className="text-sm text-[var(--sem-text-primary)]">{item.title}</div>
                  <div className="text-xs text-[var(--sem-text-muted)]">{item.rationale}</div>
                </div>
              ))}
            </div>
          );
        })}
        {spec.priorities.p0.length === 0 && spec.priorities.p1.length === 0 && spec.priorities.p2.length === 0 && (
          <Empty text="No priorities defined — add tasks to the Workboard" />
        )}
      </SpecSection>

      <SpecSection title="Decisions">
        {spec.decisions.length === 0 ? <Empty text="No decisions recorded" /> : (
          <div className="space-y-2">
            {spec.decisions.map((d, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-[var(--sem-text-primary)]">{d.text}</div>
                  <div className="text-xs text-[var(--sem-text-muted)]">
                    Score: {d.weightedScore} | {d.status} | {d.voters.length} voter(s)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Roadmap">
        {spec.roadmap.length === 0 ? <Empty text="No roadmap phases defined" /> : (
          <div className="space-y-1">
            {spec.roadmap.map((r, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-[var(--sem-text-primary)]">{r.phase}</span>
                <span className="text-[var(--sem-text-muted)]"> — {r.modules.join(', ')}{r.timeline ? ` (${r.timeline})` : ''}</span>
              </div>
            ))}
          </div>
        )}
      </SpecSection>

      <SpecSection title="Backlog">
        {spec.backlog.length === 0 ? <Empty text="No backlog items" /> : (
          <div className="space-y-1">
            {spec.backlog.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                  b.priority === 'P0' ? 'bg-red-500/20 text-red-400' :
                  b.priority === 'P1' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{b.priority}</span>
                <span className="text-[var(--sem-text-primary)]">{b.title}</span>
                <span className="text-xs text-[var(--sem-text-muted)]">({b.status})</span>
              </div>
            ))}
          </div>
        )}
      </SpecSection>
    </div>
  );
}

// --- Helpers ---

function SpecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--sem-border-default)] p-4">
      <h3 className="mb-3 text-base font-bold text-[var(--sem-text-primary)]">{title}</h3>
      {children}
    </section>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-[var(--sem-text-muted)]">{label}:</span>
      <span className="text-[var(--sem-text-primary)]">{value}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="py-4 text-center text-sm text-[var(--sem-text-muted)]">{text}</div>;
}
```

- [ ] **Step 7: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add components/shell/cockpit/CockpitPage.tsx components/shell/cockpit/tabs/
git commit -m "feat(cockpit): CockpitPage with 5 tabs — Context, Capture, Decisions, Workboard, Spec"
```

---

### Task 10: Public API exports

**Files:**
- Modify: `components/shell/index.ts`

- [ ] **Step 1: Add cockpit exports**

Add to `components/shell/index.ts`:

```ts
export { CockpitPage } from './cockpit/CockpitPage';
export { CockpitProvider, useCockpit, useCapture, useDecisions, useWorkboard, useCockpitContext, useDrawer, useForgeSpec } from './cockpit/store';
export type { RallySession, ForgeSpec, CaptureItem, DecisionItem, WorkTask, OrgMember, CockpitConfig, ResolvedCockpitConfig } from './cockpit/types';
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/shell/index.ts
git commit -m "feat(cockpit): export cockpit API from shell barrel"
```

---

### Task 11: Meridian cockpit route + config opt-in

**Files:**
- Modify: `app/(demos)/meridian/demo.config.ts`
- Create: `app/(demos)/meridian/cockpit/page.tsx`

- [ ] **Step 1: Add `cockpit: true` to meridian config**

In `app/(demos)/meridian/demo.config.ts`, add `cockpit: true` to the `defineDemo()` call (after `slug: 'meridian'`):

```ts
  cockpit: true,
```

- [ ] **Step 2: Create cockpit route**

Create `app/(demos)/meridian/cockpit/page.tsx`:

```tsx
import { CockpitPage } from '@/components/shell/cockpit/CockpitPage';
import demoConfig from '../demo.config';

export default function Page() {
  return <CockpitPage config={demoConfig} />;
}
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm build`
Expected: PASS — Meridian cockpit route should appear in the build output

- [ ] **Step 4: Commit**

```bash
git add app/\(demos\)/meridian/demo.config.ts app/\(demos\)/meridian/cockpit/page.tsx
git commit -m "feat(cockpit): enable Rally Cockpit on Meridian demo"
```

---

### Task 12: Full verification

**Files:** None (verification only)

- [ ] **Step 1: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: PASS — all static pages generated including `/meridian/cockpit`

- [ ] **Step 3: Verify no regressions**

Check that all 13 existing demos still have their pages in the build output. The cockpit route should appear as a new addition for meridian only.

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A && git commit -m "feat(cockpit): Rally Cockpit verification fixes"
```
