// Route-keyed AI insights for every page

export interface AIInsight {
  text: string;
  label?: string;
  actionLabel?: string;
}

export const AI_INSIGHTS: Record<string, AIInsight> = {
  'dashboard': {
    text: 'Pipeline velocity increased 23% this quarter. Three deals in Negotiation stage are forecast to close by month-end, adding $175K in contracted revenue. Recommend prioritizing Mountain View Phase 2 signing — highest probability at 90%.',
  },
  'pipeline': {
    text: 'Average time in Proposal Sent stage is 18 days — 30% longer than Q3. Consider implementing a 10-day follow-up cadence. Green Valley ($85K) has been in Proposal Sent for 6 days with no activity.',
  },
  'proposals': {
    text: 'Win rate on proposals >$50K is 68% when a board presentation is included. For Green Valley ($85K), recommend offering a complimentary board strategy session as part of the proposal follow-up.',
  },
  'finance': {
    text: 'Revenue is 7% below annual target but Q1 2026 shows strongest quarter in company history ($246K). If Negotiation-stage deals close, year-end projection reaches $920K — exceeding target by 2.2%.',
  },
  'finance/pnl': {
    text: 'Training revenue margin (45%) is highest across all service lines but represents only 10% of total revenue. Scaling training through digital delivery could add $120K in high-margin revenue with minimal incremental cost.',
  },
  'operations': {
    text: 'Jennifer Blake is at 92% utilization — approaching burnout threshold. With 4 active engagements and the Mountain View Phase 2 incoming, recommend shifting 1 engagement to Sarah Kim (currently at 85%).',
  },
  'marketing': {
    text: 'Conference-sourced leads convert at 2.4x the rate of website leads. AFP conference generated 3 qualified opportunities worth $151K. Recommend increasing conference presence budget by 25% for Q3.',
  },
  'reports': {
    text: 'The President\'s Intelligence of the Day briefing has been viewed 22 times this month. Most-referenced sections: pipeline movement and client health scores. Consider adding automated weekly email delivery.',
  },
  'engagements': {
    text: '3 engagements are >80% complete and approaching final deliverable milestones. Heritage Arts assessment (88%) and Faith & Light stewardship (82%) should transition to renewal conversations within 30 days.',
  },
  'clients': {
    text: 'Client portfolio is concentrated in 2 sectors (healthcare and education = 60% of revenue). Recommend diversifying into social services — SafeHaven pipeline deal ($58K) would begin balancing the mix.',
  },
  'assessments': {
    text: '34 assessments completed across 5 templates. Organizations scoring below 60 on Fundraising Maturity show 3x improvement after 12 months of engagement. Heritage Arts (52/100) is the strongest candidate for comprehensive program.',
  },
  'knowledge': {
    text: 'Top 5 most-downloaded resources account for 28% of all downloads. "Year-End Giving Campaign Kit" (678 downloads) and "Major Donor Solicitation Templates" (445) are your most viral content. Consider creating video companions.',
  },
  'knowledge/ai-advisor': {
    text: 'Ask me about fundraising strategy, board engagement, campaign planning, donor stewardship, or any advancement topic. I draw from TPPG\'s 156-document knowledge base and 15+ years of consulting experience.',
    label: 'AI Advisor',
  },
  'training': {
    text: '602 total enrollments with a 78% completion rate. Major Gift Officer Certification has the highest satisfaction (4.9/5) but lowest enrollment (48). Recommend a promotional campaign targeting mid-career development professionals.',
  },
  'training/catalog': {
    text: 'Workshop format courses have 2.3x higher completion rates than webinars. Consider converting top-performing webinars (Introduction to Fundraising, Donor Stewardship Excellence) to hybrid workshop format.',
  },
  'training/progress': {
    text: '8 certifications issued this month, up from 5 last month. Mountain View Academy team members account for 35% of enrollments — their investment in staff development correlates with their Advanced maturity rating.',
  },
  'training/builder': {
    text: 'Generate custom training packages tailored to specific client needs, assessment results, and organizational context. Each package includes an Outline, Facilitator Guide, and Participant Handout.',
    label: 'AI Training Builder',
  },
  'training/ai-tutor': {
    text: 'I can help with fundraising concepts, assessment interpretation, best practices, and TPPG methodology. Try asking about donor cultivation strategies, board engagement techniques, or campaign planning steps.',
    label: 'AI Tutor',
  },
  'about': {
    text: 'TPPG\'s 6P framework (Purpose, People, Process, Practice, Pipeline, Profit) provides a holistic view of organizational advancement health. Each pillar maps to specific assessment dimensions and consulting methodologies.',
  },
  'admin': {
    text: '4 of 6 connectors are active. Constant Contact integration would automate newsletter performance tracking, and Knack migration (in progress) will consolidate CRM data into a single source of truth.',
  },
  'style-guide': {
    text: 'The Sapphire & Gold design system uses Space Grotesk for modern readability. Primary sapphire (#3b6bf5) for trust and intelligence, gold accent (#c9942b) for warmth and premium positioning.',
    label: 'Design Notes',
  },
};

export function getInsight(route: string): AIInsight | undefined {
  return AI_INSIGHTS[route];
}
