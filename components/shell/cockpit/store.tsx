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
