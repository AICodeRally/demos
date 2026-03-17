// Knowledge base: 156 documents across 8 types, 8 topics, 6 sectors

export type ContentType = 'training-module' | 'playbook' | 'assessment' | 'case-study' | 'slide-deck' | 'worksheet' | 'framework' | 'template';
export type Topic = 'major-gifts' | 'board-engagement' | 'campaign-readiness' | 'donor-stewardship' | 'annual-fund' | 'planned-giving' | 'nonprofit-governance' | 'fundraising-operations';
export type Sector = 'healthcare' | 'education' | 'faith-based' | 'community' | 'arts-culture' | 'social-services';

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: ContentType;
  topic: Topic;
  sector: Sector | 'all';
  author: string;
  updatedDate: string;
  downloads: number;
  summary: string;
}

// Generate 156 documents
const DOC_TEMPLATES: Omit<KnowledgeDoc, 'id'>[] = [
  // Major Gifts
  { title: 'Major Gifts Prospect Research Guide', type: 'playbook', topic: 'major-gifts', sector: 'all', author: 'Jennifer Blake', updatedDate: '2026-02-15', downloads: 234, summary: 'Step-by-step methodology for identifying, qualifying, and researching major gift prospects.' },
  { title: 'Moves Management System Design', type: 'framework', topic: 'major-gifts', sector: 'all', author: 'Jennifer Blake', updatedDate: '2026-01-20', downloads: 189, summary: 'Framework for tracking prospect cultivation through the giving cycle.' },
  { title: 'Major Gifts Ask Meeting Preparation', type: 'worksheet', topic: 'major-gifts', sector: 'all', author: 'Marcus Rivera', updatedDate: '2025-12-10', downloads: 312, summary: 'Pre-meeting checklist and role-play scenarios for gift solicitations.' },
  { title: 'Healthcare Major Gifts Case Study: Riverside', type: 'case-study', topic: 'major-gifts', sector: 'healthcare', author: 'Jennifer Blake', updatedDate: '2026-03-01', downloads: 87, summary: 'How Riverside Health grew major gifts 40% in 18 months.' },
  { title: 'Major Gifts Training: From Annual to Major', type: 'training-module', topic: 'major-gifts', sector: 'all', author: 'Sarah Kim', updatedDate: '2026-02-01', downloads: 156, summary: '3-part training on transitioning annual fund donors to major gift prospects.' },
  { title: 'Major Donor Solicitation Letter Templates', type: 'template', topic: 'major-gifts', sector: 'all', author: 'Diana Reeves', updatedDate: '2026-01-15', downloads: 445, summary: '12 customizable letter templates for various solicitation scenarios.' },

  // Board Engagement
  { title: 'Board Fundraising Expectations Framework', type: 'framework', topic: 'board-engagement', sector: 'all', author: 'Marcus Rivera', updatedDate: '2026-02-20', downloads: 267, summary: 'Setting and communicating clear fundraising expectations for board members.' },
  { title: 'Board Giving Assessment Tool', type: 'assessment', topic: 'board-engagement', sector: 'all', author: 'Marcus Rivera', updatedDate: '2026-01-10', downloads: 198, summary: 'Self-assessment instrument for measuring board giving engagement.' },
  { title: 'Board Retreat Planning Kit', type: 'playbook', topic: 'board-engagement', sector: 'all', author: 'Thomas Park', updatedDate: '2025-11-20', downloads: 345, summary: 'Complete planning guide for advancement-focused board retreats.' },
  { title: 'Faith-Based Board Governance Guide', type: 'playbook', topic: 'board-engagement', sector: 'faith-based', author: 'Marcus Rivera', updatedDate: '2026-03-05', downloads: 92, summary: 'Governance best practices adapted for religious organizations.' },
  { title: 'Board Member Fundraising Training Slides', type: 'slide-deck', topic: 'board-engagement', sector: 'all', author: 'Sarah Kim', updatedDate: '2026-02-10', downloads: 278, summary: '45-slide deck for new board member fundraising orientation.' },
  { title: 'Board Committee Structure Template', type: 'template', topic: 'board-engagement', sector: 'all', author: 'Thomas Park', updatedDate: '2025-12-15', downloads: 167, summary: 'Template for organizing board committees aligned with advancement goals.' },

  // Campaign Readiness
  { title: 'Capital Campaign Feasibility Study Guide', type: 'playbook', topic: 'campaign-readiness', sector: 'all', author: 'Jennifer Blake', updatedDate: '2026-03-10', downloads: 412, summary: 'Comprehensive guide to conducting and interpreting feasibility studies.' },
  { title: 'Campaign Case Statement Template', type: 'template', topic: 'campaign-readiness', sector: 'all', author: 'Jennifer Blake', updatedDate: '2026-02-05', downloads: 389, summary: 'Customizable case statement structure with storytelling framework.' },
  { title: 'Campaign Readiness Scorecard', type: 'assessment', topic: 'campaign-readiness', sector: 'all', author: 'Jennifer Blake', updatedDate: '2026-01-25', downloads: 234, summary: '25-point scorecard for determining campaign launch readiness.' },
  { title: 'Education Capital Campaign Case Study', type: 'case-study', topic: 'campaign-readiness', sector: 'education', author: 'Jennifer Blake', updatedDate: '2025-12-20', downloads: 145, summary: 'Mountain View Academy\'s $25M campaign strategy and execution.' },
  { title: 'Campaign Volunteer Training Module', type: 'training-module', topic: 'campaign-readiness', sector: 'all', author: 'Marcus Rivera', updatedDate: '2026-01-15', downloads: 178, summary: 'Training program for campaign volunteer solicitors.' },
  { title: 'Campaign Gift Range Chart Calculator', type: 'worksheet', topic: 'campaign-readiness', sector: 'all', author: 'Sarah Kim', updatedDate: '2026-02-28', downloads: 456, summary: 'Interactive tool for developing campaign gift tables.' },

  // Donor Stewardship
  { title: 'Donor Stewardship Matrix', type: 'framework', topic: 'donor-stewardship', sector: 'all', author: 'Sarah Kim', updatedDate: '2026-02-15', downloads: 334, summary: 'Tiered stewardship activities mapped to giving levels.' },
  { title: 'Thank You Letter Best Practices', type: 'playbook', topic: 'donor-stewardship', sector: 'all', author: 'Diana Reeves', updatedDate: '2026-01-05', downloads: 567, summary: 'Speed, personalization, and impact reporting in donor acknowledgment.' },
  { title: 'Donor Retention Analysis Worksheet', type: 'worksheet', topic: 'donor-stewardship', sector: 'all', author: 'Thomas Park', updatedDate: '2025-11-30', downloads: 234, summary: 'Calculate and analyze retention rates by giving segment.' },
  { title: 'Impact Reporting Template Pack', type: 'template', topic: 'donor-stewardship', sector: 'all', author: 'Sarah Kim', updatedDate: '2026-03-01', downloads: 389, summary: '8 templates for annual, quarterly, and project-specific impact reports.' },

  // Annual Fund
  { title: 'Annual Fund Strategy Playbook', type: 'playbook', topic: 'annual-fund', sector: 'all', author: 'Sarah Kim', updatedDate: '2026-02-20', downloads: 445, summary: 'Year-round annual fund strategy including digital, mail, and events.' },
  { title: 'Year-End Giving Campaign Kit', type: 'template', topic: 'annual-fund', sector: 'all', author: 'Diana Reeves', updatedDate: '2025-10-15', downloads: 678, summary: 'Timeline, email templates, social content, and direct mail for year-end appeals.' },
  { title: 'Monthly Giving Program Launch Guide', type: 'playbook', topic: 'annual-fund', sector: 'all', author: 'Thomas Park', updatedDate: '2026-01-30', downloads: 234, summary: 'How to launch and grow a sustainer giving program.' },
  { title: 'Community Foundation Annual Fund Case Study', type: 'case-study', topic: 'annual-fund', sector: 'community', author: 'Sarah Kim', updatedDate: '2025-12-05', downloads: 112, summary: 'How a community foundation doubled annual fund participation in 2 years.' },

  // Planned Giving
  { title: 'Planned Giving Program Starter Kit', type: 'playbook', topic: 'planned-giving', sector: 'all', author: 'Thomas Park', updatedDate: '2026-02-10', downloads: 189, summary: 'Launch a planned giving program with minimal staff investment.' },
  { title: 'Legacy Society Design Template', type: 'template', topic: 'planned-giving', sector: 'all', author: 'Thomas Park', updatedDate: '2026-01-20', downloads: 145, summary: 'Framework for creating and promoting a legacy giving society.' },
  { title: 'Planned Giving Marketing Materials', type: 'slide-deck', topic: 'planned-giving', sector: 'all', author: 'Diana Reeves', updatedDate: '2025-11-15', downloads: 167, summary: 'Presentation slides for educating donors about planned giving vehicles.' },

  // Nonprofit Governance
  { title: 'Nonprofit Governance Best Practices', type: 'framework', topic: 'nonprofit-governance', sector: 'all', author: 'Marcus Rivera', updatedDate: '2026-03-05', downloads: 234, summary: 'Governance standards aligned with BoardSource recommendations.' },
  { title: 'Conflict of Interest Policy Template', type: 'template', topic: 'nonprofit-governance', sector: 'all', author: 'Thomas Park', updatedDate: '2025-12-10', downloads: 345, summary: 'Board-ready conflict of interest policy with disclosure forms.' },
  { title: 'Board Self-Assessment Survey', type: 'assessment', topic: 'nonprofit-governance', sector: 'all', author: 'Marcus Rivera', updatedDate: '2026-01-15', downloads: 198, summary: '30-question board effectiveness self-assessment with scoring guide.' },

  // Fundraising Operations
  { title: 'CRM Selection Guide for Nonprofits', type: 'playbook', topic: 'fundraising-operations', sector: 'all', author: 'Carlos Mendez', updatedDate: '2026-03-10', downloads: 312, summary: 'Comparison of top 8 donor management systems with selection criteria.' },
  { title: 'Development Department KPI Dashboard', type: 'framework', topic: 'fundraising-operations', sector: 'all', author: 'Carlos Mendez', updatedDate: '2026-02-25', downloads: 267, summary: '15 essential KPIs for measuring development program effectiveness.' },
  { title: 'Gift Processing & Acknowledgment SOP', type: 'playbook', topic: 'fundraising-operations', sector: 'all', author: 'Diana Reeves', updatedDate: '2026-01-10', downloads: 234, summary: 'Standard operating procedures for gift receipt through acknowledgment.' },
  { title: 'Development Staffing Calculator', type: 'worksheet', topic: 'fundraising-operations', sector: 'all', author: 'Carlos Mendez', updatedDate: '2026-02-15', downloads: 189, summary: 'Calculate optimal development team size based on budget and goals.' },
];

// Generate remaining docs to reach 156
function generateDocs(): KnowledgeDoc[] {
  const docs: KnowledgeDoc[] = DOC_TEMPLATES.map((d, i) => ({ ...d, id: `kd-${i + 1}` }));

  const sectors: Sector[] = ['healthcare', 'education', 'faith-based', 'community', 'arts-culture', 'social-services'];
  const topics: Topic[] = ['major-gifts', 'board-engagement', 'campaign-readiness', 'donor-stewardship', 'annual-fund', 'planned-giving', 'nonprofit-governance', 'fundraising-operations'];
  const types: ContentType[] = ['training-module', 'playbook', 'assessment', 'case-study', 'slide-deck', 'worksheet', 'framework', 'template'];
  const authors = ['Jennifer Blake', 'Marcus Rivera', 'Sarah Kim', 'Thomas Park', 'Diana Reeves', 'Carlos Mendez'];

  const sectorTopicCombos: { title: string; type: ContentType; topic: Topic; sector: Sector; summary: string }[] = [
    { title: 'Healthcare Foundation Gift Policies', type: 'playbook', topic: 'major-gifts', sector: 'healthcare', summary: 'Gift acceptance policies specific to healthcare foundations.' },
    { title: 'School Annual Fund Playbook', type: 'playbook', topic: 'annual-fund', sector: 'education', summary: 'Annual fund strategies for K-12 and higher education.' },
    { title: 'Church Stewardship Campaign Guide', type: 'playbook', topic: 'donor-stewardship', sector: 'faith-based', summary: 'Annual stewardship campaign planning for congregations.' },
    { title: 'Arts Patron Cultivation Framework', type: 'framework', topic: 'major-gifts', sector: 'arts-culture', summary: 'Building relationships with high-net-worth arts patrons.' },
    { title: 'Social Services Grant Landscape', type: 'framework', topic: 'fundraising-operations', sector: 'social-services', summary: 'Federal, state, and foundation grant opportunities for social services.' },
    { title: 'Community Foundation Engagement Model', type: 'framework', topic: 'board-engagement', sector: 'community', summary: 'Board engagement strategies for community foundations.' },
  ];

  let idx = docs.length;
  for (const combo of sectorTopicCombos) {
    docs.push({
      id: `kd-${++idx}`,
      ...combo,
      author: authors[idx % authors.length],
      updatedDate: `2026-0${1 + (idx % 3)}-${10 + (idx % 18)}`,
      downloads: 50 + (idx * 7) % 300,
    });
  }

  // Fill remaining to 156
  while (docs.length < 156) {
    const i = docs.length;
    const topic = topics[i % topics.length];
    const type = types[i % types.length];
    const sector = i % 3 === 0 ? sectors[i % sectors.length] : 'all';
    docs.push({
      id: `kd-${i + 1}`,
      title: `${topic.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} ${type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} ${i}`,
      type,
      topic,
      sector,
      author: authors[i % authors.length],
      updatedDate: `2026-0${1 + (i % 3)}-${10 + (i % 18)}`,
      downloads: 30 + (i * 11) % 400,
      summary: `Comprehensive ${type.replace('-', ' ')} covering ${topic.replace(/-/g, ' ')} best practices${sector !== 'all' ? ` for ${sector.replace('-', ' ')} organizations` : ''}.`,
    });
  }

  return docs;
}

export const KNOWLEDGE_DOCS = generateDocs();

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  'training-module': 'Training Module',
  'playbook': 'Playbook',
  'assessment': 'Assessment',
  'case-study': 'Case Study',
  'slide-deck': 'Slide Deck',
  'worksheet': 'Worksheet',
  'framework': 'Framework',
  'template': 'Template',
};

export const TOPIC_LABELS: Record<Topic, string> = {
  'major-gifts': 'Major Gifts',
  'board-engagement': 'Board Engagement',
  'campaign-readiness': 'Campaign Readiness',
  'donor-stewardship': 'Donor Stewardship',
  'annual-fund': 'Annual Fund',
  'planned-giving': 'Planned Giving',
  'nonprofit-governance': 'Nonprofit Governance',
  'fundraising-operations': 'Fundraising Operations',
};

export const SECTOR_LABELS: Record<Sector, string> = {
  'healthcare': 'Healthcare',
  'education': 'Education',
  'faith-based': 'Faith-Based',
  'community': 'Community',
  'arts-culture': 'Arts & Culture',
  'social-services': 'Social Services',
};
