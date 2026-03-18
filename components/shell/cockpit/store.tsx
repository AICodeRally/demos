'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type {
  RallySession, CaptureItem, CaptureTag, DecisionItem, Vote, WorkTask,
  TaskPriority, TaskStatus, OrgMember, Persona, ModuleScope, RoadmapPhase, Artifact,
} from './types';

// --- Empty session factory ---

const RALLY_STARTER_TEAM: OrgMember[] = [
  { id: 'tm-rt', name: 'Richard Tollefson', title: 'President', company: 'Phoenix Philanthropy Group', role: 'Sponsor', weight: 5 },
  { id: 'tm-ct', name: 'Cheryl Tollefson', title: 'COO', company: 'Phoenix Philanthropy Group', role: 'Sponsor', weight: 4 },
  { id: 'tm-mt', name: 'Dr. Michal Tyra', title: 'Senior Consultant', company: 'Phoenix Philanthropy Group', role: 'Champion', weight: 3 },
  { id: 'tm-km', name: 'Kelly Martinez', title: 'Director of Client Services', company: 'Phoenix Philanthropy Group', role: 'Champion', weight: 3 },
  { id: 'tm-ng', name: 'Natalie Graff', title: 'Executive Coordinator', company: 'Phoenix Philanthropy Group', role: 'User', weight: 2 },
  { id: 'tm-tt', name: 'Timmesse Thompson', title: 'Corp. Operations & Events Coordinator', company: 'Phoenix Philanthropy Group', role: 'Champion', weight: 3 },
  { id: 'tm-cw', name: 'Cassandra Williams', title: 'Business Manager', company: 'Phoenix Philanthropy Group', role: 'User', weight: 2 },
  { id: 'tm-kj', name: 'Kris Jacober', title: 'Marketing & Communications Consultant', company: 'Phoenix Philanthropy Group', role: 'User', weight: 2 },
];

const RALLY_STARTER_PERSONAS: Persona[] = [
  { id: 'p-exec', name: 'Executive', role: 'Executives', painPoints: ['No visibility into pipeline health', 'Manual reporting takes hours', 'Confidential docs need restricted access'], goals: ['Real-time dashboards', 'Board-ready reports on demand', 'Role-based security on sensitive data'] },
  { id: 'p-consultant', name: 'Consultant', role: 'Consultants', painPoints: ['Scattered client info across tools', 'Proposals assembled manually from old templates', 'No standard assessment workflow'], goals: ['Unified client workspace', 'Streamlined proposal generation from templates', 'Repeatable service delivery process'] },
  { id: 'p-ops', name: 'Internal Ops', role: 'Operations', painPoints: ['Workflows are email-based', 'Manual time tracking and expense processing', 'No utilization tracking'], goals: ['Centralized workflow — not email chains', 'Automated time capture and payroll pipeline', 'Capacity planning visibility'] },
  { id: 'p-admin', name: 'Admin / Accounting', role: 'Administrative', painPoints: ['Document chaos — shared drives everywhere', 'Onboarding new hires is ad hoc', 'Invoice and expense processing is manual'], goals: ['Centralized knowledge base', 'Structured onboarding workflow', 'Streamlined AP/AR and payroll'] },
];

const RALLY_STARTER_SCOPE: ModuleScope[] = [
  { id: 's-sales', department: 'Revenue', moduleName: 'Sales Process (Multi-Step)', description: 'Formal multi-step sales process — prospect → qualify → propose → negotiate → close. Moves management with stage gates and accountability', priority: 1 },
  { id: 's-bd', department: 'Revenue', moduleName: 'Business Development (CRM)', description: 'Track prospects, opportunities, contacts — replace NAC CRM. Integrates with constant contact for comms', priority: 2 },
  { id: 's-pipe', department: 'Revenue', moduleName: 'Sales Pipeline', description: 'Pipeline stages from prospect to signed client — Kanban + table views', priority: 2 },
  { id: 's-scope', department: 'Revenue', moduleName: 'Scoping / CPQ', description: 'Configure scope of work, pricing, and deliverables for proposals', priority: 3 },
  { id: 's-prop', department: 'Revenue', moduleName: 'Proposal Generation', description: 'Build proposals from templates + prior proposals — collaborative editing, Granola transcript import', priority: 4 },
  { id: 's-engage', department: 'Client Services', moduleName: 'Engagements', description: 'Active client engagement tracking — status, milestones, deliverables, handoff from accepted proposals', priority: 5 },
  { id: 's-time', department: 'Operations', moduleName: 'Time & Expense', description: 'Timesheet entry, expense submission, approval workflows, payroll pipeline', priority: 6 },
  { id: 's-acct', department: 'Finance', moduleName: 'Accounting', description: 'Invoicing, AP/AR, budget tracking, expense processing', priority: 7 },
  { id: 's-mktg', department: 'Marketing', moduleName: 'Marketing', description: 'Campaigns, constant contact integration, newsletter management, website signups', priority: 8 },
  { id: 's-bizmgmt', department: 'Operations', moduleName: 'Business Management', description: 'Onboarding, compliance, internal HR processes, resource management', priority: 9 },
  { id: 's-services', department: 'Practice', moduleName: 'Services & Assessments', description: 'Service capabilities, client assessments, feasibility studies — renamed from Assessments per Richard', priority: 10 },
  { id: 's-knowledge', department: 'Knowledge', moduleName: 'Knowledge Base / RAG', description: 'Document library, semantic search, AI advisor — consumes all enterprise data', priority: 11 },
  { id: 's-academy', department: 'Academy', moduleName: 'Advancement Academy', description: 'Async learning platform — public enrollment, LinkedIn badges, monetizable. Lower priority but high-margin revenue stream', priority: 12 },
  { id: 's-rfp', department: 'Revenue', moduleName: 'RFP Management', description: 'RFP sourcing, compliance tracking, multi-state registration. Replace Kelly\'s manual deadline tracking', priority: 13 },
  { id: 's-compliance', department: 'Operations', moduleName: 'Compliance & Privacy', description: 'SOC 2, FERPA, HIPAA, GDPR compliance framework. Private LLM requirement for all AI features', priority: 14 },
  { id: 's-migration', department: 'Operations', moduleName: 'Data Migration', description: 'Knack → relational DB, Dropbox → SharePoint, Intervals → passive telemetry. AI contact dedup', priority: 15 },
];

function createEmptySession(slug: string): RallySession {
  const now = new Date().toISOString();
  const isRallyStarter = slug === 'phoenix-intel';
  return {
    id: crypto.randomUUID(),
    slug,
    createdAt: now,
    updatedAt: now,
    context: {
      identity: isRallyStarter
        ? { projectName: 'Phoenix Intelligence Platform', brandColor: '#c9942b', tagline: 'Nonprofit Advisory OS' }
        : { projectName: '' },
      org: isRallyStarter ? RALLY_STARTER_TEAM : [],
      personas: isRallyStarter ? RALLY_STARTER_PERSONAS : [],
      scope: isRallyStarter ? RALLY_STARTER_SCOPE : [],
      roadmap: [],
      artifacts: [],
    },
    capture: {
      notes: isRallyStarter ? [
        { id: 'c-1', text: 'Workflows are primarily email-based — no centralized system for BD handoffs', author: 'Natalie Graff', tags: ['pain-point'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-2', text: 'Proposal data entered 8-9 times across different systems — budget, PM worksheet, contract, billing', author: 'Dr. Michal Tyra', tags: ['pain-point'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-3', text: 'Failed to map deliverables to original scope on recent client engagements', author: 'Richard Tollefson', tags: ['pain-point'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-4', text: '"Assessment" is too narrow — the primary service is planning. Rename to Services & Planning.', author: 'Richard Tollefson', tags: ['decision'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-5', text: 'Refer to sales as "Business Development" — internal language preference', author: 'Dr. Michal Tyra', tags: ['decision'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-6', text: 'Training is a loss leader — deprioritize as standalone profit center', author: 'Richard Tollefson', tags: ['decision'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-7', text: 'Need formal multi-step sales process with moves management for BD', author: 'Dr. Michal Tyra', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-8', text: 'Need internal hub for HR, compliance, onboarding, payroll, time-off — separate from client-facing modules', author: 'Timmesse Thompson', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-9', text: 'Knack CRM has 2,500-3,000 records — exports to Constant Contact are manual. Need automation.', author: 'Natalie Graff', tags: ['pain-point'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-10', text: 'Proposals written "by committee" — need collaborative editing with templates from prior winning proposals', author: 'Dr. Michal Tyra', tags: ['insight'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-11', text: 'Contract consultants need limited access — role-based security is critical', author: 'Richard Tollefson', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-12', text: 'Accepted proposals should auto-populate downstream — PM worksheet, budget, billing codes, team assignments', author: 'Richard Tollefson', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-13', text: 'Intervals should be fully obsolete — replace with passive telemetry from email, docs, and meeting time', author: 'Timmesse Thompson', tags: ['decision'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-14', text: 'Time tracking needs auto-tagging from M365 telemetry — manual entry only for offline/analog work (site visits, phone calls)', author: 'Dr. Michal Tyra', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-15', text: 'Dropbox → SharePoint migration needed. MCP connector for automated file transfer.', author: 'Natalie Graff', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-16', text: 'SOC 2 compliance is required for enterprise nonprofit clients. Also aware of FERPA (education), HIPAA (healthcare), GDPR (international donors)', author: 'Richard Tollefson', tags: ['decision'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-17', text: 'All AI features must use private LLM — no client PII may traverse public APIs', author: 'Richard Tollefson', tags: ['decision'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-18', text: 'AI duplicate detection for contact imports — confidence scoring with human review below 90%', author: 'Dr. Michal Tyra', tags: ['insight'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-19', text: 'Advancement Academy is a monetizable product — async courses, LinkedIn badges, open enrollment beyond Phoenix clients', author: 'Richard Tollefson', tags: ['insight'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-20', text: 'Knack data migration to relational DB — 2,500-3,000 records. AI dedup running in parallel.', author: 'Natalie Graff', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-21', text: 'Kelly maintains 6+ Excel reports manually: proposal tracking grid, Gantt charts, client contracts, Strategic Plan Metrics, projections comparison, satisfaction surveys (Formsite)', author: 'Kelly Martinez', tags: ['pain-point'], timestamp: now, source: 'ops-functions-doc' },
        { id: 'c-22', text: 'Cassandra (Business Manager) handles all finance: QuickBooks P&L, Alliance Bank daily monitoring, ADP payroll, Amex reconciliation, CPA uploads. Physical bank deposits still required.', author: 'Cassandra Williams', tags: ['pain-point'], timestamp: now, source: 'ops-functions-doc' },
        { id: 'c-23', text: 'Natalie sends manual "Items of the Day" email to President daily — meetings, tasks, project updates, travel, action items. AI-generated IoTD replaces this.', author: 'Natalie Graff', tags: ['pain-point'], timestamp: now, source: 'ops-functions-doc' },
        { id: 'c-24', text: 'Zoom → Microsoft Teams migration saves $7,500/year. Teams included in existing MS365 subscription. Enterprise-grade security.', author: 'Timmesse Thompson', tags: ['decision'], timestamp: now, source: 'tech-recommendation' },
        { id: 'c-25', text: 'Tech recommendation: Monday.com for project tracking ($9/user/mo), DocuSign for contracts (free tier), LastPass for president credentials, Handshake for intern sourcing', author: 'Timmesse Thompson', tags: ['insight'], timestamp: now, source: 'tech-recommendation' },
        { id: 'c-26', text: 'SWOT: Outdated accounting, no active marketing, inefficient manual reports, disorganized admin, obsolete database, overpriced direct mail vendor, limited technology', author: 'Timmesse Thompson', tags: ['pain-point'], timestamp: now, source: 'swot-analysis' },
        { id: 'c-27', text: 'Academy content repository: ~130 files across ~13 presentation modules + supporting materials, ~20 years in Dropbox. No version control, inconsistent naming. Pain ratings 4-5/5. CSU Chancellor\'s Office proposal (historical).', author: 'Dr. Michal Tyra', tags: ['pain-point'], timestamp: now, source: 'academy-intake' },
        { id: 'c-28', text: 'Kris Jacober takes over all marketing: website (Pixa vendor), newsletters, social media, speaking logistics, strategic partnerships, membership management', author: 'Kris Jacober', tags: ['decision'], timestamp: now, source: 'ops-functions-doc' },
        { id: 'c-29', text: 'State registrations managed through InCorp — foreign entity and fundraising counsel filings required per state for out-of-state contracts', author: 'Kelly Martinez', tags: ['insight'], timestamp: now, source: 'ops-functions-doc' },
        { id: 'c-30', text: 'Estimated ROI of tech modernization: $16,952 net annual savings + 8-12 hours/week saved per staff member', author: 'Timmesse Thompson', tags: ['insight'], timestamp: now, source: 'tech-recommendation' },
        { id: 'c-31', text: 'Natalie to email NAC-CC-website infographic to scoping team for review', author: 'Natalie Graff', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-32', text: 'Michal to send AI policy document + Academy business plan to Todd for platform integration', author: 'Dr. Michal Tyra', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-33', text: 'Paul Waterman (WashU) intro — RFP AI contact for potential partnership/reference', author: 'Richard Tollefson', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
        { id: 'c-34', text: 'Next sessions scoped: (1) Tech-stack deep dive with Natalie/Kelly, (2) Sales/CPQ process with Michael/Richard, (3) Internal ops with Timmesse', author: 'Joe Jacober', tags: ['action-item'], timestamp: now, source: 'transcript-parse' },
      ] : [],
      transcripts: [],
    },
    decisions: { items: isRallyStarter ? [
      { id: 'd-1', text: 'Rename "Assessments" to "Services & Planning" to reflect full service capabilities', tags: ['decision'], votes: [{ memberId: 'tm-rt', value: 'up' }, { memberId: 'tm-mt', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-2', text: 'Use "Business Development" instead of "Sales" — matches internal language', tags: ['decision'], votes: [{ memberId: 'tm-rt', value: 'up' }, { memberId: 'tm-mt', value: 'up' }, { memberId: 'tm-ng', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-3', text: 'Advancement Academy stays as-is but deprioritized as profit center — focus on client training delivery', tags: ['decision'], votes: [{ memberId: 'tm-rt', value: 'up' }], status: 'open', createdAt: now },
      { id: 'd-4', text: 'Intervals fully deprecated — replaced by passive telemetry time capture', tags: ['decision'], votes: [{ memberId: 'tm-tt', value: 'up' }, { memberId: 'tm-mt', value: 'up' }, { memberId: 'tm-rt', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-5', text: 'All AI features require private LLM — SOC 2 compliant, no public API for client data', tags: ['decision'], votes: [{ memberId: 'tm-rt', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-6', text: 'Migrate Dropbox → SharePoint/M365 for file storage', tags: ['decision'], votes: [{ memberId: 'tm-ng', value: 'up' }, { memberId: 'tm-rt', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-7', text: 'Migrate Zoom → Microsoft Teams — $7,500/yr savings, enterprise security, included in MS365', tags: ['decision'], votes: [{ memberId: 'tm-tt', value: 'up' }, { memberId: 'tm-rt', value: 'up' }, { memberId: 'tm-ct', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-8', text: 'Kris Jacober owns all marketing & comms — website, newsletters, social, speaking, partnerships', tags: ['decision'], votes: [{ memberId: 'tm-rt', value: 'up' }, { memberId: 'tm-ct', value: 'up' }], status: 'locked', createdAt: now },
      { id: 'd-9', text: 'Academy content repository modernization: Track/Module/Topic taxonomy, AI-assisted tagging', tags: ['decision'], votes: [{ memberId: 'tm-mt', value: 'up' }, { memberId: 'tm-rt', value: 'up' }], status: 'open', createdAt: now },
    ] : [] },
    workboard: { tasks: isRallyStarter ? [
      { id: 'w-1', title: 'Build multi-step BD sales process with moves management', priority: 'P0', status: 'in-progress', linkedDecisionId: 'd-2', createdAt: now },
      { id: 'w-2', title: 'Proposal auto-populate downstream to PM/budget/billing', priority: 'P0', status: 'todo', createdAt: now },
      { id: 'w-3', title: 'Internal HR/compliance hub — separate from client modules', priority: 'P1', status: 'todo', createdAt: now },
      { id: 'w-4', title: 'Knack → Constant Contact automation (replace manual exports)', priority: 'P1', status: 'todo', createdAt: now },
      { id: 'w-5', title: 'Scope compliance tracker — alert when deliverables drift from SOW', priority: 'P1', status: 'in-progress', createdAt: now },
      { id: 'w-6', title: 'Role-based security for contract consultants (limited access)', priority: 'P2', status: 'todo', createdAt: now },
      { id: 'w-7', title: 'Passive telemetry time capture — replace Intervals with M365 auto-tagging', priority: 'P0', status: 'in-progress', linkedDecisionId: 'd-4', createdAt: now },
      { id: 'w-8', title: 'Knack → relational DB migration + AI contact deduplication', priority: 'P1', status: 'in-progress', createdAt: now },
      { id: 'w-9', title: 'Dropbox → SharePoint migration via MCP connector', priority: 'P1', status: 'todo', linkedDecisionId: 'd-6', createdAt: now },
      { id: 'w-10', title: 'SOC 2 Type II readiness assessment + private LLM deployment', priority: 'P1', status: 'todo', linkedDecisionId: 'd-5', createdAt: now },
      { id: 'w-11', title: 'Academy monetization: async course platform + LinkedIn badge integration', priority: 'P2', status: 'todo', createdAt: now },
      { id: 'w-12', title: 'Zoom → Teams migration + Intermedia/MS365 consolidation', priority: 'P1', status: 'todo', linkedDecisionId: 'd-7', createdAt: now },
      { id: 'w-13', title: 'Academy content repository modernization — 130+ files, 13 presentation modules', priority: 'P1', status: 'in-progress', linkedDecisionId: 'd-9', createdAt: now },
      { id: 'w-14', title: 'Automate Kelly\'s 6 manual Excel reports into real-time dashboards', priority: 'P0', status: 'todo', createdAt: now },
      { id: 'w-15', title: 'Alliance Bank remote deposit + Amex auto-reconciliation', priority: 'P2', status: 'todo', createdAt: now },
      { id: 'w-16', title: 'Collect NAC-CC-website infographic from Natalie for review', priority: 'P2', status: 'todo', createdAt: now },
      { id: 'w-17', title: 'Obtain AI policy doc + Academy business plan from Michal', priority: 'P1', status: 'todo', createdAt: now },
      { id: 'w-18', title: 'Paul Waterman (WashU) intro — RFP AI partnership contact', priority: 'P2', status: 'todo', createdAt: now },
      { id: 'w-19', title: 'Schedule Session 2: Tech-stack deep dive (Natalie + Kelly)', priority: 'P0', status: 'todo', createdAt: now },
      { id: 'w-20', title: 'Schedule Session 3: Sales/CPQ process (Michael + Richard)', priority: 'P0', status: 'todo', createdAt: now },
      { id: 'w-21', title: 'Schedule Session 4: Internal ops deep dive (Timmesse)', priority: 'P0', status: 'todo', createdAt: now },
    ] : [] },
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
  if (typeof window === 'undefined') return createEmptySession(slug);
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
