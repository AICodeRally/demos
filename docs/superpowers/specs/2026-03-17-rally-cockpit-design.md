# Rally Cockpit Design Spec

> **For agentic workers:** This is a design spec. Use `superpowers:writing-plans` to create the implementation plan.

**Goal:** A unified engagement system built into DemoShell v2 that converts Rally session conversations into structured specs that drive vibe coding iterations.

**Status:** Design approved. Ready for implementation planning.

---

## Overview

The Rally Cockpit is Q's five-stage pipeline — Context → Capture → Decisions → Workboard → Spec — implemented as a DemoShell plugin. Every Rally engagement produces a `forge_spec.json` that Claude Code consumes to build the next iteration of the demo.

Two surfaces:
1. **Capture Drawer** — persistent right-edge panel (320px) on every demo page for live note-taking and transcript import
2. **Cockpit Page** — full 5-tab pipeline view at `/{slug}/cockpit`

## Constraints

- Static Next.js 16 app on Cloudflare Pages — no server, no database
- localStorage + JSON export for Phase 1 (no backend)
- No auth — fully open access, restrict later
- No real-time sync
- No LLM for transcript parsing (keyword heuristics only)
- Must work with all 3 layout plugins (sidebar, topnav, wizard)

## Architecture: Shell Plugin

The Cockpit extends DemoShell v2's plugin architecture. Demos opt in via config:

```ts
defineDemo({ slug: 'meridian', cockpit: true, /* ... */ })
```

When `cockpit` is enabled:
1. `DemoShell.tsx` wraps children in `<CockpitProvider>`
2. Layout plugins render `<CaptureDrawer>` to the right of `<main>`
3. Demo gets a `/{slug}/cockpit` route for the full pipeline view

### Config Extension

```ts
interface DemoConfigBase {
  // ... existing fields ...
  cockpit?: boolean | CockpitConfig;
}

interface CockpitConfig {
  defaultOpen?: boolean;      // drawer starts open (default: false)
  captureOnly?: boolean;      // only show drawer, no full cockpit route
}
```

`cockpit: true` is sugar for `cockpit: {}` with all defaults. Existing demos are unaffected.

## Data Model

A single `RallySession` object per demo, stored in localStorage at key `rally-session-{slug}`:

```ts
interface RallySession {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;

  context: {
    identity: { projectName: string; brandColor?: string; themeName?: string };
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
```

### Supporting Types

```ts
interface OrgMember {
  id: string;
  name: string;
  title: string;
  company: string;
  role: 'Sponsor' | 'Champion' | 'Blocker' | 'User' | 'Observer';
  weight: number;              // 1-5, determines vote power
}

interface Persona {
  id: string;
  name: string;
  role: string;
  painPoints: string[];
  goals: string[];
}

interface ModuleScope {
  id: string;
  moduleName: string;
  description: string;
  priority: number;            // sort order
}

interface RoadmapPhase {
  id: string;
  phase: string;
  modules: string[];
  timeline?: string;
}

interface Artifact {
  id: string;
  name: string;
  type: 'doc' | 'deck' | 'link';
  content: string;             // URL or pasted text
}

interface CaptureItem {
  id: string;
  text: string;
  author?: string;
  tags: CaptureTag[];
  timestamp: string;
  source: 'manual' | 'transcript-parse';
  promotedToDecision?: string;
}

type CaptureTag = 'pain-point' | 'decision' | 'action-item' | 'question' | 'insight';

interface Transcript {
  id: string;
  importedAt: string;
  rawText: string;
  parsedItemCount: number;
}

interface DecisionItem {
  id: string;
  text: string;
  tags: CaptureTag[];
  votes: Vote[];
  status: 'open' | 'locked';
  sourceCapture?: string;      // CaptureItem ID
  createdAt: string;
}

interface Vote {
  memberId: string;
  value: 'up' | 'down';
}

interface WorkTask {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'todo' | 'in-progress' | 'done';
  linkedDecisionId?: string;
  createdAt: string;
}
```

## File Structure

```
components/shell/
├── cockpit/
│   ├── types.ts              # All types above
│   ├── store.ts              # localStorage CRUD, CockpitProvider, hooks
│   ├── forge-spec.ts         # Derive forge_spec.json from RallySession
│   ├── transcript-parser.ts  # Parse Granola markdown → CaptureItem[]
│   │
│   ├── CaptureDrawer.tsx     # Right-edge 320px drawer
│   ├── CockpitPage.tsx       # 5-tab pipeline view
│   │
│   ├── tabs/
│   │   ├── ContextTab.tsx    # Identity, org, personas, scope, roadmap, artifacts
│   │   ├── CaptureTab.tsx    # Full capture history with filters
│   │   ├── DecisionsTab.tsx  # Voting, weighted sort, lock/unlock
│   │   ├── WorkboardTab.tsx  # P0/P1/P2 columns, status tracking
│   │   └── SpecTab.tsx       # Rendered forge_spec.json + export buttons
│   │
│   └── parts/
│       ├── OrgChart.tsx      # Org member cards with weight badges
│       ├── VoteBar.tsx       # Thumbs up/down with weighted score
│       ├── TagPicker.tsx     # Multi-select tag chips
│       └── TranscriptImport.tsx  # Paste area + parse preview
```

### Modified Existing Files

- `components/shell/config/types.ts` — add `cockpit` field to `DemoConfigBase`
- `components/shell/DemoShell.tsx` — wrap with `CockpitProvider` when enabled
- `components/shell/plugins/sidebar.tsx` — render `CaptureDrawer` when cockpit enabled
- `components/shell/plugins/topnav.tsx` — same
- `components/shell/plugins/wizard.tsx` — same
- `components/shell/index.ts` — export cockpit hooks and types

### New Route Per Demo

Each cockpit-enabled demo gets: `app/(demos)/{slug}/cockpit/page.tsx`

## Capture Drawer UX

320px right-edge drawer, toggled via header button or `Cmd+.` / `Ctrl+.`.

### Quick-Add Mode (default)
- Chat-like text input at bottom
- Type note, hit Enter to add
- Tag chips below input for optional tagging
- Chronological feed above (newest at bottom)
- Each note shows: text, author, timestamp, tags
- Thumbs up/down on each note

### Transcript Import Mode
- "Import" button toggles large paste area
- Paste Granola markdown transcript
- Preview shows auto-tagged parsed items
- "Import All" or cherry-pick individual items
- Items merge into capture feed with `source: 'transcript-parse'`

### Drawer Header
- Session name (from Context identity)
- Note count badge
- Collapse/expand toggle
- Link to full Cockpit page

### Persistence
Auto-save to localStorage on every mutation. No save button.

## Cockpit Page (5-Tab Pipeline)

Full pipeline view at `/{slug}/cockpit`, rendered inside the demo's shell layout.

### Tab 1: Context
- **Identity** — project name, brand color picker (updates shell theme live via `setTokens()`), tagline
- **Org Chart** — cards: name, title, company, role tag, weight slider (1-5)
- **Personas** — cards: name, role, pain points list, goals list
- **Scope** — module list with description, drag to reorder priority
- **Roadmap** — phase list: name, modules, timeline note
- **Artifacts** — name + URL or pasted text

### Tab 2: Capture
- Same feed as drawer, full-width
- Filter bar: by tag, by author, by source
- Bulk actions: tag multiple, promote to Decision

### Tab 3: Decisions
- Items promoted from Capture or created directly
- Each shows: text, origin capture note, tags, weighted vote bar, status
- Sort by: weighted score, newest, tag
- "Lock Decision" freezes item (no more voting, marked final)

### Tab 4: Workboard
- Three columns: P0 (Must Have), P1 (Should Have), P2 (Nice to Have)
- Cards: title, linked decision, status (todo/in-progress/done)
- Drag between columns to reprioritize
- Add task directly or promote from locked decisions

### Tab 5: Spec Review
- Rendered `forge_spec.json` as formatted document (not raw JSON)
- Sections: Identity, Team, Personas, Priorities, Decisions, Roadmap, Backlog
- Each section shows provenance (which decisions drove which priorities)
- Export: "Copy JSON", "Download JSON", "Download Markdown"

## Weighted Voting

Votes use org chart weight to compute a weighted score:

```
weightedScore = Σ(upVotes × weight) - Σ(downVotes × weight)
```

A VP with weight 5 who thumbs-up adds +5. A junior analyst with weight 1 adds +1. Items auto-sort by weighted score in the Decisions tab.

Any participant can vote. The consultant can override by locking a decision regardless of score.

## forge_spec.json

Derived output — computed from RallySession, never stored separately. The Spec Review tab renders it live.

```ts
interface ForgeSpec {
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
    priority: 'P0' | 'P1' | 'P2';
    status: 'todo' | 'in-progress' | 'done';
  }[];
}
```

### Vibe Coding Loop (Path 1)

1. Rally session → consultant captures notes + imports Granola transcript
2. Team votes on decisions, consultant promotes to Workboard
3. Spec Review tab shows live forge_spec.json
4. Export → save as `app/(demos)/{slug}/forge-spec.json`
5. In Claude Code: "Read the forge spec and build P0 priorities"
6. Claude reads JSON, generates/modifies demo pages
7. Next Rally session → demo updated → new feedback → cycle repeats

## Granola Integration

### Phase 1: Manual Paste + Heuristic Parser

```
Granola export (markdown) → paste into Capture drawer
→ Split into paragraphs/speaker turns
→ Keyword tag detection:
    "problem", "issue", "broken", "frustrating" → pain-point
    "should", "need to", "must", "let's"       → action-item
    "decided", "agreed", "go with"              → decision
    "?" at end                                  → question
    all others                                  → insight
→ Preview with editable tags
→ User confirms → merge into Capture feed
```

### Phase 2 (future): Granola MCP Direct Pull

Official Granola MCP at `https://mcp.granola.ai/mcp` (Business plan, $14/user/mo). Claude Code connects via MCP, pulls latest meeting notes directly, generates updated forge_spec.json without manual paste.

## Phase 2 Deferred Features

These are explicitly out of scope for Phase 1:

- Real-time multi-user sync
- Authentication / access control
- LLM-powered transcript parsing
- Granola MCP direct integration (runtime)
- Backend persistence (Supabase/Firebase)
- PDF/slide deck export from Spec Review
- Dot voting mode
- Session recording / audio capture
