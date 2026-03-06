// =============================================================================
// STEEPLE AI Platform — Mock Data
// Church-contextualized AI surfaces (OpsChief, Pulse, AskForge, Spine, Sessions)
// =============================================================================

// ---------------------------------------------------------------------------
// Orb Definitions
// ---------------------------------------------------------------------------

export interface OrbDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  colorEnd: string;
  status: 'online' | 'warning' | 'critical';
  statusText: string;
  stat: string;
  statLabel: string;
  href: string;
}

export const orbs: OrbDef[] = [
  { id: 'ops', name: 'Ministry Health', description: 'Operational health monitoring', icon: 'Activity', color: '#7C3AED', colorEnd: '#EC4899', status: 'online', statusText: 'Monitoring', stat: '87', statLabel: 'Health Score', href: '/steeple/ai/ops' },
  { id: 'pulse', name: 'Ministry Pulse', description: 'AI-curated insights & alerts', icon: 'Radio', color: '#D97706', colorEnd: '#F59E0B', status: 'online', statusText: 'Streaming', stat: '12', statLabel: 'Active Insights', href: '/steeple/ai/pulse' },
  { id: 'ask', name: 'Ask Steeple', description: 'AI assistant for ministry', icon: 'Sparkles', color: '#2563EB', colorEnd: '#06B6D4', status: 'online', statusText: 'Ready', stat: '156', statLabel: 'Queries This Week', href: '/steeple/ai/ask' },
  { id: 'spine', name: 'Audit Trail', description: 'Immutable evidence records', icon: 'Shield', color: '#059669', colorEnd: '#10B981', status: 'online', statusText: 'Recording', stat: '2.4K', statLabel: 'Evidence Records', href: '/steeple/ai/spine' },
  { id: 'sessions', name: 'AI Sessions', description: 'Agent work history & replay', icon: 'Bot', color: '#8B5CF6', colorEnd: '#A78BFA', status: 'online', statusText: '3 Active', stat: '48', statLabel: 'Sessions This Month', href: '/steeple/ai/sessions' },
];

// ---------------------------------------------------------------------------
// Pulse Cards
// ---------------------------------------------------------------------------

export type PulseUrgency = 'critical' | 'high' | 'medium' | 'low';
export type PulseCardType = 'alert' | 'insight' | 'suggestion';

export interface PulseCardData {
  id: string;
  urgency: PulseUrgency;
  cardType: PulseCardType;
  title: string;
  summary: string;
  whyItMatters: string;
  impact: string;
  source: string;
  actions: string[];
  icon: string;
  createdAt: string;
}

export const pulseCards: PulseCardData[] = [
  {
    id: 'pc-01',
    urgency: 'critical',
    cardType: 'alert',
    title: 'Giving dropped 18% week-over-week',
    summary: 'Weekly giving fell from $34,200 to $28,044. This is the largest single-week drop in 6 months.',
    whyItMatters: 'Sustained giving decline can impact ministry budgets within 2-3 weeks. Current reserves cover 6 weeks of operations.',
    impact: '$6,156 shortfall this week',
    source: 'Stewardship Module',
    actions: ['Review giving trends', 'Schedule stewardship update', 'Check online giving portal'],
    icon: 'TrendingDown',
    createdAt: '2026-02-17T08:15:00Z',
  },
  {
    id: 'pc-02',
    urgency: 'critical',
    cardType: 'alert',
    title: 'Background check expiring for children\'s ministry volunteer',
    summary: 'Volunteer Lisa Martinez (ID V-042) has a background check expiring in 5 days. She is scheduled for nursery duty next Sunday.',
    whyItMatters: 'State law requires current background checks for all children\'s ministry volunteers. Non-compliance creates legal liability.',
    impact: 'Nursery staffing gap if not renewed',
    source: 'Leadership Module',
    actions: ['Notify volunteer coordinator', 'Send renewal reminder', 'Arrange substitute'],
    icon: 'ShieldAlert',
    createdAt: '2026-02-17T07:30:00Z',
  },
  {
    id: 'pc-03',
    urgency: 'high',
    cardType: 'alert',
    title: 'Easter service registration at 94% capacity',
    summary: 'The 10:00 AM Easter service has 1,166 of 1,240 seats registered. At current rate, it will reach capacity in 48 hours.',
    whyItMatters: 'Turning away Easter visitors significantly impacts first-impression experience and long-term retention.',
    impact: '74 seats remaining across all services',
    source: 'Events Module',
    actions: ['Open overflow seating', 'Add 4th service option', 'Update registration page'],
    icon: 'Calendar',
    createdAt: '2026-02-17T06:00:00Z',
  },
  {
    id: 'pc-04',
    urgency: 'high',
    cardType: 'insight',
    title: '3 first-time visitors need follow-up',
    summary: 'Three visitors from last Sunday\'s service have not yet received a follow-up contact: Kim Nguyen, Marcus Davis, and Rachel Torres.',
    whyItMatters: 'Research shows visitors contacted within 48 hours are 5x more likely to return. It\'s been 3 days.',
    impact: 'Potential retention of 3 new families',
    source: 'Congregation Module',
    actions: ['Assign follow-up calls', 'Send welcome packet', 'Invite to newcomers lunch'],
    icon: 'UserPlus',
    createdAt: '2026-02-16T14:00:00Z',
  },
  {
    id: 'pc-05',
    urgency: 'medium',
    cardType: 'insight',
    title: 'Small group attendance trending up 12%',
    summary: 'Across all 8 small groups, average weekly attendance has risen from 14.2 to 15.9 members over the past month.',
    whyItMatters: 'Small group engagement is the strongest predictor of long-term membership retention.',
    impact: '+13 additional weekly participants',
    source: 'Congregation Module',
    actions: ['Recognize group leaders', 'Consider launching new group', 'Share success metrics'],
    icon: 'TrendingUp',
    createdAt: '2026-02-16T10:00:00Z',
  },
  {
    id: 'pc-06',
    urgency: 'medium',
    cardType: 'insight',
    title: 'Youth retreat budget 15% under estimate',
    summary: 'Current expenses for the April youth retreat total $8,500 against a $10,000 budget. Venue deposit saved $1,200 through early booking.',
    whyItMatters: 'Budget surplus can be redirected to scholarships for students who can\'t afford the retreat fee.',
    impact: '$1,500 available for reallocation',
    source: 'Stewardship Module',
    actions: ['Allocate scholarship fund', 'Update budget report', 'Notify youth pastor'],
    icon: 'Wallet',
    createdAt: '2026-02-15T16:00:00Z',
  },
  {
    id: 'pc-07',
    urgency: 'medium',
    cardType: 'suggestion',
    title: 'Wednesday prayer meeting room change recommended',
    summary: 'Prayer meeting attendance has grown from 30 to 45 over 2 months. Current room capacity is 50. Consider moving to Fellowship Hall (capacity 120).',
    whyItMatters: 'Crowded rooms discourage new attendees and reduce comfort for regulars.',
    impact: 'Room at 90% capacity',
    source: 'Campus Module',
    actions: ['Book Fellowship Hall', 'Update weekly announcement', 'Notify A/V team'],
    icon: 'Building',
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'pc-08',
    urgency: 'medium',
    cardType: 'suggestion',
    title: 'Online sermon views outpacing in-person growth',
    summary: 'YouTube sermon views averaged 2,100/week this month, up 34% from last quarter. In-person attendance grew only 3%.',
    whyItMatters: 'Digital ministry reach is expanding faster than physical campus. Content strategy should reflect this.',
    impact: '2,100 weekly digital attendees',
    source: 'Outreach Module',
    actions: ['Invest in streaming quality', 'Add online small groups', 'Create digital welcome path'],
    icon: 'Video',
    createdAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'pc-09',
    urgency: 'low',
    cardType: 'suggestion',
    title: 'Bulletin printing cost could be reduced by going digital',
    summary: 'Current weekly bulletin printing costs $180/week ($9,360/year). 62% of members already use the church app for announcements.',
    whyItMatters: 'Printing costs are the 4th largest recurring expense in the communications budget.',
    impact: 'Potential savings: $5,800/year',
    source: 'Stewardship Module',
    actions: ['Survey congregation preference', 'Pilot digital-only Sunday', 'Calculate total savings'],
    icon: 'FileText',
    createdAt: '2026-02-14T08:00:00Z',
  },
  {
    id: 'pc-10',
    urgency: 'low',
    cardType: 'insight',
    title: 'Member anniversary milestones this week',
    summary: '4 members are celebrating join anniversaries: Robert Anderson (14 years), James Thompson (6 years), Lisa Chen (3 years), Noah Williams (1 year).',
    whyItMatters: 'Acknowledging milestones strengthens belonging and demonstrates pastoral care.',
    impact: '4 members to recognize',
    source: 'Congregation Module',
    actions: ['Send personalized cards', 'Mention in Sunday bulletin', 'Gift volunteer appreciation'],
    icon: 'PartyPopper',
    createdAt: '2026-02-13T10:00:00Z',
  },
  {
    id: 'pc-11',
    urgency: 'low',
    cardType: 'suggestion',
    title: 'Parking lot lights need maintenance scheduling',
    summary: '2 of 8 parking lot lights reported dim by the facilities team. LED replacements are in stock.',
    whyItMatters: 'Well-lit parking is a safety priority, especially for evening services and events.',
    impact: 'Safety concern for evening attendees',
    source: 'Campus Module',
    actions: ['Schedule maintenance', 'Order backup bulbs', 'Update facilities log'],
    icon: 'Lightbulb',
    createdAt: '2026-02-13T08:00:00Z',
  },
  {
    id: 'pc-12',
    urgency: 'low',
    cardType: 'insight',
    title: 'Benevolence fund requests down 22% this quarter',
    summary: 'Community assistance requests decreased from 18 to 14 this quarter. Average request amount also dropped from $450 to $380.',
    whyItMatters: 'Could indicate improving community economic conditions or reduced awareness of available help.',
    impact: '$2,680 under budget in benevolence',
    source: 'Stewardship Module',
    actions: ['Review outreach messaging', 'Check community needs', 'Reallocate surplus'],
    icon: 'Heart',
    createdAt: '2026-02-12T14:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Coaching Cards
// ---------------------------------------------------------------------------

export type CoachingCategory = 'cost' | 'performance' | 'quality' | 'adoption' | 'milestone';

export interface CoachingCardData {
  id: string;
  category: CoachingCategory;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  recommendation: string;
  expectedImpact: string;
  actionSteps: string[];
  metrics: string;
  icon: string;
  color: string;
}

export const coachingCards: CoachingCardData[] = [
  {
    id: 'cc-01',
    category: 'cost',
    priority: 'HIGH',
    title: 'Switch to digital bulletins',
    recommendation: 'Transition from printed bulletins to digital-only distribution via the church app and email. 62% of members already receive announcements digitally.',
    expectedImpact: 'Save $340/month ($4,080/year) in printing and paper costs',
    actionSteps: [
      'Survey congregation preference (2 weeks)',
      'Run hybrid pilot for 1 month (print + digital)',
      'Set up QR codes at pew entrances for easy access',
      'Transition to digital-only with printed copies on request',
    ],
    metrics: 'Current: $180/week printing | Target: $20/week (on-demand only)',
    icon: 'FileText',
    color: '#059669',
  },
  {
    id: 'cc-02',
    category: 'performance',
    priority: 'HIGH',
    title: 'Boost online giving adoption to 80%',
    recommendation: 'Online giving adoption is at 62%. Launch a QR code campaign during services to drive adoption. Churches that hit 80% online giving see 15% higher total giving.',
    expectedImpact: 'Projected $4,200/month increase in total giving',
    actionSteps: [
      'Create QR code cards for every seat',
      'Add 60-second giving tutorial to announcements',
      'Enable text-to-give shortcode',
      'Offer first-time online giving incentive (devotional book)',
    ],
    metrics: 'Current: 62% online | Target: 80% online within 3 months',
    icon: 'CreditCard',
    color: '#D97706',
  },
  {
    id: 'cc-03',
    category: 'quality',
    priority: 'MEDIUM',
    title: 'Implement 90-day new member follow-up sequence',
    recommendation: 'New member retention is at 68%. Industry best practice (Barna Group) suggests a structured 90-day follow-up increases retention to 85%.',
    expectedImpact: 'Retain 4 additional members per quarter',
    actionSteps: [
      'Week 1: Personal call from pastor + welcome packet',
      'Week 2: Invite to newcomers lunch',
      'Week 4: Small group introduction',
      'Week 8: Ministry interest assessment',
      'Week 12: One-on-one check-in',
    ],
    metrics: 'Current retention: 68% | Target: 85% at 90 days',
    icon: 'UserCheck',
    color: '#8B5CF6',
  },
  {
    id: 'cc-04',
    category: 'adoption',
    priority: 'MEDIUM',
    title: 'Increase church app usage to 50%',
    recommendation: 'Only 23% of members actively use the church app. Push notifications, event check-in via app, and sermon notes features can drive adoption.',
    expectedImpact: 'Reduce communication costs by 30%, improve event coordination',
    actionSteps: [
      'Launch Sunday morning "Check in with the app" campaign',
      'Add interactive sermon notes feature',
      'Enable in-app prayer request submission',
      'Gamify attendance tracking with milestone badges',
    ],
    metrics: 'Current: 23% active users | Target: 50% within 6 months',
    icon: 'Smartphone',
    color: '#2563EB',
  },
  {
    id: 'cc-05',
    category: 'milestone',
    priority: 'LOW',
    title: 'Volunteer team hit 100 active members',
    recommendation: 'Celebrate this milestone! The volunteer team crossed 100 active members this quarter, up from 82 last quarter. Recognition drives continued engagement.',
    expectedImpact: 'Boost volunteer morale and attract 10-15 new volunteers',
    actionSteps: [
      'Host volunteer appreciation dinner',
      'Create "100 Strong" social media campaign',
      'Share impact stories from each ministry team',
      'Launch volunteer referral program',
    ],
    metrics: 'Growth: 82 → 100 volunteers (+22% this quarter)',
    icon: 'Trophy',
    color: '#C5972C',
  },
];

// ---------------------------------------------------------------------------
// OpsChief Health Dimensions
// ---------------------------------------------------------------------------

export interface HealthDimension {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  details: string;
}

export const healthDimensions: HealthDimension[] = [
  { name: 'Financial Health', score: 92, trend: 'up', color: '#C5972C', details: 'Giving exceeds budget by 4%. Reserves at 8 weeks.' },
  { name: 'Engagement', score: 85, trend: 'stable', color: '#8B5CF6', details: 'Sunday attendance steady at 1,240. Small groups growing.' },
  { name: 'Volunteer Capacity', score: 78, trend: 'down', color: '#EC4899', details: '3 ministry teams below minimum staffing levels.' },
  { name: 'Growth', score: 88, trend: 'up', color: '#7C3AED', details: '12 new members this month, up from 8 last month.' },
  { name: 'Facilities', score: 91, trend: 'stable', color: '#4338CA', details: 'All systems operational. HVAC serviced last week.' },
  { name: 'Compliance', score: 95, trend: 'stable', color: '#059669', details: 'All background checks current. Insurance renewed.' },
];

export const healthTrendData = [
  { week: 'W1', score: 82 },
  { week: 'W2', score: 83 },
  { week: 'W3', score: 81 },
  { week: 'W4', score: 84 },
  { week: 'W5', score: 85 },
  { week: 'W6', score: 84 },
  { week: 'W7', score: 86 },
  { week: 'W8', score: 85 },
  { week: 'W9', score: 87 },
  { week: 'W10', score: 86 },
  { week: 'W11', score: 88 },
  { week: 'W12', score: 87 },
];

export const healthAlerts = [
  { severity: 'warning' as const, title: 'Children\'s ministry below minimum volunteer ratio', detail: 'Need 2 more volunteers for nursery rotation. Current ratio: 1:6 (target: 1:4)', time: '2h ago' },
  { severity: 'warning' as const, title: 'A/V equipment warranty expiring', detail: 'Main sanctuary sound board warranty expires March 15. Extended warranty available for $1,200/year.', time: '1d ago' },
  { severity: 'info' as const, title: 'HVAC filter replacement due next week', detail: 'Quarterly maintenance scheduled. Filters in stock. Estimated downtime: 2 hours.', time: '2d ago' },
  { severity: 'info' as const, title: 'Annual insurance review upcoming', detail: 'Policy renewal date is March 31. Schedule review with broker by March 15.', time: '3d ago' },
];

// ---------------------------------------------------------------------------
// Spine (Audit Trail) Entries
// ---------------------------------------------------------------------------

export interface SpineEntryData {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  category: 'financial' | 'membership' | 'governance' | 'facility' | 'communication';
}

export const spineEntries: SpineEntryData[] = [
  { id: 'sp-01', timestamp: '2026-02-17T09:15:00Z', actor: 'System', action: 'Processed donation', entity: 'Donation', entityId: 'DON-2847', details: 'Michael Johnson — $1,200 General Fund via online giving. Receipt #R-2847 generated.', category: 'financial' },
  { id: 'sp-02', timestamp: '2026-02-17T08:42:00Z', actor: 'Pastor David', action: 'Approved policy', entity: 'Policy', entityId: 'POL-018', details: 'Approved updated Children\'s Ministry Safe Church Policy v2.3. Effective immediately.', category: 'governance' },
  { id: 'sp-03', timestamp: '2026-02-17T07:30:00Z', actor: 'System', action: 'Background check alert', entity: 'Volunteer', entityId: 'V-042', details: 'Lisa Martinez background check expiring in 5 days. Automated reminder sent.', category: 'governance' },
  { id: 'sp-04', timestamp: '2026-02-16T16:20:00Z', actor: 'Sarah Williams', action: 'Updated member status', entity: 'Member', entityId: 'M-089', details: 'Changed Kim Nguyen from "Visitor" to "Prospective Member" after newcomers lunch attendance.', category: 'membership' },
  { id: 'sp-05', timestamp: '2026-02-16T14:10:00Z', actor: 'System', action: 'Room booked', entity: 'Facility', entityId: 'RM-204', details: 'Room 204 reserved for New Members Class — Sunday Feb 23, 12:00-1:30 PM. Auto-confirmed.', category: 'facility' },
  { id: 'sp-06', timestamp: '2026-02-16T11:30:00Z', actor: 'Admin Team', action: 'Email campaign sent', entity: 'Communication', entityId: 'EM-156', details: 'Easter Service Registration email sent to 1,847 recipients. Open rate tracking enabled.', category: 'communication' },
  { id: 'sp-07', timestamp: '2026-02-16T09:00:00Z', actor: 'System', action: 'Processed donation batch', entity: 'Donation', entityId: 'BATCH-412', details: 'Sunday offering batch — 234 transactions totaling $34,200. Reconciled with bank deposit.', category: 'financial' },
  { id: 'sp-08', timestamp: '2026-02-15T15:45:00Z', actor: 'Elder Board', action: 'Budget line approved', entity: 'Budget', entityId: 'BUD-2026-Q1', details: 'Approved $8,500 for youth retreat (April). Motion carried 5-0.', category: 'financial' },
  { id: 'sp-09', timestamp: '2026-02-15T13:20:00Z', actor: 'System', action: 'Background check completed', entity: 'Volunteer', entityId: 'V-098', details: 'Marcus Rivera background check cleared. Approved for children\'s ministry. Valid through Feb 2028.', category: 'governance' },
  { id: 'sp-10', timestamp: '2026-02-15T10:00:00Z', actor: 'Facilities Manager', action: 'Maintenance completed', entity: 'Facility', entityId: 'MAINT-089', details: 'HVAC quarterly service completed for main sanctuary and fellowship hall. All units operating normally.', category: 'facility' },
  { id: 'sp-11', timestamp: '2026-02-14T16:30:00Z', actor: 'Pastor David', action: 'Member counseling note', entity: 'Member', entityId: 'M-034', details: 'Pastoral visit logged for James Thompson. Confidential — care follow-up scheduled.', category: 'membership' },
  { id: 'sp-12', timestamp: '2026-02-14T14:00:00Z', actor: 'System', action: 'SMS campaign sent', entity: 'Communication', entityId: 'SMS-078', details: 'Youth retreat reminder SMS sent to 65 registered students and 12 volunteers.', category: 'communication' },
  { id: 'sp-13', timestamp: '2026-02-14T11:15:00Z', actor: 'Treasurer', action: 'Financial report generated', entity: 'Report', entityId: 'RPT-2026-02', details: 'February mid-month financial report generated. Giving on track at 102% of budget.', category: 'financial' },
  { id: 'sp-14', timestamp: '2026-02-13T09:30:00Z', actor: 'System', action: 'New member registered', entity: 'Member', entityId: 'M-091', details: 'Rachel Torres completed online membership application. Assigned to New Members Class Feb 23.', category: 'membership' },
  { id: 'sp-15', timestamp: '2026-02-13T08:00:00Z', actor: 'System', action: 'Facility inspection logged', entity: 'Facility', entityId: 'INSP-045', details: 'Weekly fire safety inspection completed. All exits clear, extinguishers charged, alarms tested.', category: 'facility' },
];

// ---------------------------------------------------------------------------
// AI Sessions
// ---------------------------------------------------------------------------

export interface AISession {
  id: string;
  agentName: string;
  agentSlug: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PAUSED';
  mode: 'MISSION' | 'CHAT';
  mission?: string;
  preview: string;
  startedAt: string;
  turns: number;
  toolCalls: number;
}

export const aiSessions: AISession[] = [
  { id: 'ses-01', agentName: 'Volunteer Onboarding Bot', agentSlug: 'volunteer-onboard', status: 'ACTIVE', mode: 'MISSION', mission: 'Process 5 new volunteer applications for children\'s ministry', preview: 'Reviewing background check submissions for Jennifer Wu, Marcus Rivera, and 3 others...', startedAt: '2026-02-17T08:00:00Z', turns: 14, toolCalls: 23 },
  { id: 'ses-02', agentName: 'Event Planning Assistant', agentSlug: 'event-planner', status: 'ACTIVE', mode: 'MISSION', mission: 'Coordinate Easter service logistics across 3 services', preview: 'Checking room availability, volunteer assignments, and A/V requirements for April 12...', startedAt: '2026-02-17T07:30:00Z', turns: 22, toolCalls: 41 },
  { id: 'ses-03', agentName: 'Care Coordinator', agentSlug: 'care-coord', status: 'ACTIVE', mode: 'CHAT', preview: 'Discussing follow-up plan for 3 hospital visit requests this week...', startedAt: '2026-02-17T09:15:00Z', turns: 8, toolCalls: 5 },
  { id: 'ses-04', agentName: 'Giving Analysis Agent', agentSlug: 'giving-analyst', status: 'COMPLETED', mode: 'MISSION', mission: 'Analyze Q1 giving patterns and generate stewardship report', preview: 'Generated comprehensive giving report with 12 insights. Flagged 18% WoW decline.', startedAt: '2026-02-16T14:00:00Z', turns: 18, toolCalls: 34 },
  { id: 'ses-05', agentName: 'New Visitor Follow-Up', agentSlug: 'visitor-followup', status: 'COMPLETED', mode: 'MISSION', mission: 'Create personalized follow-up messages for 3 first-time visitors', preview: 'Drafted welcome emails for Kim Nguyen, Marcus Davis, and Rachel Torres with personalized invitations.', startedAt: '2026-02-16T10:00:00Z', turns: 12, toolCalls: 18 },
  { id: 'ses-06', agentName: 'Budget Review Assistant', agentSlug: 'budget-review', status: 'COMPLETED', mode: 'CHAT', preview: 'Reviewed youth retreat budget variance. Identified $1,500 surplus for scholarship allocation.', startedAt: '2026-02-15T15:00:00Z', turns: 9, toolCalls: 12 },
  { id: 'ses-07', agentName: 'Sermon Content Analyzer', agentSlug: 'sermon-analyzer', status: 'PAUSED', mode: 'MISSION', mission: 'Transcribe and index last 12 sermons for searchable archive', preview: 'Processed 8 of 12 sermons. Paused — waiting for Feb 16 recording upload.', startedAt: '2026-02-14T11:00:00Z', turns: 45, toolCalls: 92 },
  { id: 'ses-08', agentName: 'Facilities Inspector', agentSlug: 'facilities-bot', status: 'COMPLETED', mode: 'MISSION', mission: 'Generate weekly facilities inspection report', preview: 'Compiled inspection report: all fire safety items clear, 2 parking lot lights flagged for replacement.', startedAt: '2026-02-13T08:00:00Z', turns: 6, toolCalls: 8 },
];

// ---------------------------------------------------------------------------
// Ask Steeple (Pre-filled Demo Conversation)
// ---------------------------------------------------------------------------

export interface AskMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; docId?: string }[];
  mode: string;
}

export const askConversation: AskMessage[] = [
  {
    id: 'ask-01',
    role: 'user',
    content: 'How many seats do we have left for Easter services?',
    mode: '.events',
  },
  {
    id: 'ask-02',
    role: 'assistant',
    content: 'Based on current registrations, here\'s the Easter service availability:\n\n**8:00 AM Service** — 312 registered / 500 capacity (188 remaining)\n**10:00 AM Service** — 1,166 registered / 1,240 capacity (74 remaining)\n**12:00 PM Service** — 445 registered / 800 capacity (355 remaining)\n\nThe 10:00 AM service is at **94% capacity** and will likely fill within 48 hours at current registration rates. I recommend opening overflow seating or promoting the 8:00 AM and 12:00 PM services more prominently.',
    sources: [
      { title: 'Easter Registration Dashboard', docId: 'EVT-2026-EASTER' },
      { title: 'Sanctuary Capacity Records', docId: 'FAC-001' },
    ],
    mode: '.events',
  },
  {
    id: 'ask-03',
    role: 'user',
    content: 'What about volunteer coverage for all three services?',
    mode: '.events',
  },
  {
    id: 'ask-04',
    role: 'assistant',
    content: 'Here\'s the volunteer status for Easter Sunday:\n\n| Role | 8:00 AM | 10:00 AM | 12:00 PM |\n|------|---------|----------|----------|\n| Greeters | 6/6 | 8/10 | 4/6 |\n| Ushers | 4/4 | 6/8 | 3/4 |\n| Children\'s | 8/8 | 10/12 | 6/8 |\n| A/V Tech | 2/2 | 3/3 | 2/2 |\n| Parking | 3/4 | 4/6 | 2/4 |\n\n**Gaps to fill:** 10:00 AM needs 2 greeters, 2 ushers, 2 children\'s workers, and 2 parking volunteers. 12:00 PM needs 2 greeters, 1 usher, 2 children\'s workers, and 2 parking.\n\nI can draft a volunteer recruitment message targeting members who served last Easter but haven\'t signed up yet.',
    sources: [
      { title: 'Volunteer Schedule - Easter 2026', docId: 'VOL-EASTER-2026' },
      { title: 'Ministry Team Rosters', docId: 'LDM-TEAMS' },
    ],
    mode: '.events',
  },
  {
    id: 'ask-05',
    role: 'user',
    content: 'Yes, please draft that message. Also, what was our attendance last Easter?',
    mode: '.events',
  },
  {
    id: 'ask-06',
    role: 'assistant',
    content: 'Here\'s the volunteer recruitment draft:\n\n> *Subject: We Need You This Easter!*\n>\n> *Hi [Name], Last Easter you blessed our church family by serving as a [Role]. This year we\'re expecting our biggest Easter yet with 3 services! We still need volunteers for the 10:00 AM and 12:00 PM services. Would you be willing to serve again? Sign up at [link] or reply to this message.*\n\n**Last Easter (2025) attendance:**\n- 8:00 AM: 389 attendees\n- 10:00 AM: 1,180 attendees\n- 12:00 PM: 520 attendees\n- **Total: 2,089** (across all services)\n\nThis year\'s registrations are already at **1,923** with 6 weeks to go — we\'re tracking **8% ahead** of last year. The growth is primarily in the 10:00 AM and 12:00 PM services.',
    sources: [
      { title: 'Easter 2025 Attendance Report', docId: 'RPT-EASTER-2025' },
      { title: 'Historical Attendance Records', docId: 'ATT-HIST' },
    ],
    mode: '.events',
  },
  {
    id: 'ask-07',
    role: 'user',
    content: 'Great. One more thing — what\'s our giving look like compared to this time last year?',
    mode: '.giving',
  },
  {
    id: 'ask-08',
    role: 'assistant',
    content: '**Year-over-Year Giving Comparison (Jan 1 - Feb 17):**\n\n| Metric | 2025 | 2026 | Change |\n|--------|------|------|--------|\n| Total Giving | $198,400 | $214,800 | **+8.3%** |\n| Weekly Average | $28,343 | $30,686 | +$2,343 |\n| Online % | 54% | 62% | +8pts |\n| Unique Donors | 312 | 334 | +22 |\n| Avg Gift Size | $636 | $643 | +1.1% |\n\n**Key insight:** Total giving is up, driven primarily by **more donors** rather than larger gifts. Online giving adoption continues to accelerate. However, note the 18% week-over-week dip this past Sunday — this appears to be a one-week anomaly (Super Bowl weekend effect) rather than a trend.\n\nWant me to generate the full stewardship report for the elder board?',
    sources: [
      { title: '2026 YTD Financial Report', docId: 'FIN-2026-YTD' },
      { title: '2025 Annual Giving Report', docId: 'FIN-2025-ANNUAL' },
    ],
    mode: '.giving',
  },
];

// ---------------------------------------------------------------------------
// Ask Mode Definitions
// ---------------------------------------------------------------------------

export const askModes = [
  { id: '.ministry', label: '.ministry', description: 'General ministry questions' },
  { id: '.events', label: '.events', description: 'Events & scheduling' },
  { id: '.giving', label: '.giving', description: 'Finance & stewardship' },
  { id: '.policy', label: '.policy', description: 'Governance & compliance' },
];
