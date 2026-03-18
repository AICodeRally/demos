// Route-keyed AI insights for every page

export interface AIInsight {
  text: string;
  label?: string;
  actionLabel?: string;
}

export const AI_INSIGHTS: Record<string, AIInsight> = {
  'dashboard': {
    text: 'Pipeline velocity increased 23% this quarter. Three deals in Negotiation are forecast to close by month-end (+$175K). Key firm health flags: Richard\'s BD concentration at 70-75% is improving but still a risk. Contact database has only 2,500-3,000 records after 20 years — aggressive capture at conferences and seminars could 3x this within 12 months. 98% client satisfaction and 60% repeat rate are best-in-class.',
  },
  'pipeline': {
    text: 'Average time in Proposal Sent stage is 18 days — 30% longer than Q3. Consider implementing a 10-day follow-up cadence. Green Valley ($85K) has been in Proposal Sent for 6 days with no activity.',
  },
  'proposals': {
    text: 'Win rate on proposals >$50K is 68% when a board presentation is included. For Green Valley ($85K), recommend offering a complimentary board strategy session as part of the proposal follow-up.',
  },
  'finance': {
    text: 'Revenue is 7% below annual target but Q1 2026 shows strongest quarter in company history ($246K). Cassandra (Business Manager) manages all financials through QuickBooks, Alliance Bank, and ADP. Physical check deposits are a bottleneck — remote deposit recommended. Amex reconciliation is manual. Tech modernization ROI: $16,952/yr net savings.',
  },
  'finance/pnl': {
    text: 'Training revenue margin (45%) is highest across all service lines but represents only 10% of total revenue. Scaling training through digital delivery could add $120K in high-margin revenue with minimal incremental cost.',
  },
  'sales-process': {
    text: 'Average deal cycle is 57 days from Identify to Contract. Proposals presented with a board strategy session close at 68% vs 41% without. SafeHaven and Mountain View are both in Negotiation — together representing $153K. Recommend a 10-day follow-up cadence for all prospects in Discovery stage.',
  },
  'scoping': {
    text: 'Campaign Readiness engagements have the highest upsell rate — 72% convert to full Campaign Management. Kelly (Director of Client Services) prepares budget worksheets, circulates for consultant input, finalizes and enters into system. Current active quotes total $179K across 3 prospects. Budget worksheet flow now auto-populates downstream.',
  },
  'operations': {
    text: 'Jennifer Blake is at 92% utilization — approaching burnout threshold. With 4 active engagements and Mountain View Phase 2 incoming, recommend shifting 1 engagement to Sarah Kim (85%). Operations team restructure in effect: Kelly (Director of Client Services) owns contracts/reporting/QC, Timmesse (Corp. Ops) owns events/IT/onboarding, Cassandra (Business Manager) owns all finance. Zoom→Teams migration saves $7,500/yr.',
  },
  'operations/time-expense': {
    text: 'Passive telemetry captured 82% of this week\'s hours automatically — email, document, and meeting time auto-tagged to engagements. Only 18% required manual entry (site visits, phone calls). Intervals is fully deprecated. Billable utilization is at 74% — 6 points below target. Auto-tagging accuracy hit 94% this week, up from 89% at launch.',
  },
  'operations/hr': {
    text: 'Sarah Kim\'s professional license renewal is due April 1 — 15 days out. Cybersecurity awareness training deadline is March 31 for all staff. New role: Timmesse (Corp. Operations & Events) now owns onboarding, IT support, and SOPs — previously split across Kelly and Natalie. Kris Jacober (Marketing & Comms Consultant) takes over website updates, newsletters, and speaking logistics from Executive Coordinator.',
  },
  'marketing': {
    text: 'Kris Jacober (Marketing & Comms Consultant) now owns brand, digital, and events — previously scattered across 3 roles. Conference leads convert at 2.4x website rate. SWOT flagged: no active marketing initiatives until Kris\'s hire, outdated website, overpriced direct mail vendor. Annual calendar now includes newsletter, President\'s Corner (bi-monthly), social posts, and event promos via Pixa.',
  },
  'reports': {
    text: 'The AI-generated IoTD replaces Natalie\'s manual daily email — viewed 22 times this month. Kelly maintains 6+ Excel reports (proposal grid, Gantt, contracts, Strategic Plan Metrics, projections, satisfaction surveys) — all candidates for automation. Cassandra\'s QuickBooks→CPA upload workflow can be fully automated with scheduled exports.',
  },
  'engagements': {
    text: '3 engagements are >80% complete and approaching final deliverable milestones. Heritage Arts assessment (88%) and Faith & Light stewardship (82%) should transition to renewal conversations within 30 days.',
  },
  'clients': {
    text: 'Higher education represents 50% of work (3 of 8 clients: Mountain View, Sonoran State, Pacific Crest) — consistent with firm strategy. Geographic concentration in SoCal and Arizona (6 of 8 clients). 60% repeat business rate with 75%+ referral sourcing. SafeHaven ($58K pipeline) would add social-services diversification.',
  },
  'assessments': {
    text: '34 assessments completed across 5 templates. Organizations scoring below 60 on Fundraising Maturity show 3x improvement after 12 months of engagement. Heritage Arts (52/100) is the strongest candidate for comprehensive program.',
  },
  'knowledge': {
    text: 'Top 5 most-downloaded resources account for 28% of all downloads. "Year-End Giving Campaign Kit" (678 downloads) and "Major Donor Solicitation Templates" (445) are your most viral content. Consider creating video companions.',
  },
  'knowledge/ai-advisor': {
    text: 'Ask me about fundraising strategy, board engagement, campaign planning, donor stewardship, or any advancement topic. I draw from Phoenix\'s 156-document knowledge base and 15+ years of consulting experience.',
    label: 'AI Advisor',
  },
  'training': {
    text: 'Content Repository Modernization underway: ~130 files across ~13 presentation modules, all in Dropbox with no version control. Pain ratings 4-5/5 across the board. AI handles drafts, tagging, dedup, and stale flagging (human review required for final content). Academy monetization: $120K Year 1 at 45% margin via async courses and LinkedIn badges. Target completion: August 2026.',
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
    text: 'I can help with fundraising concepts, assessment interpretation, best practices, and Phoenix methodology. Try asking about donor cultivation strategies, board engagement techniques, or campaign planning steps.',
    label: 'AI Tutor',
  },
  'about': {
    text: 'Phoenix is a 20-person firm with 98% client satisfaction and 75%+ referral rate — exceptional for boutique consulting. Key risk: Richard generates 70-75% of business (improved from 92%). Diversifying BD across the team is critical for firm valuation and succession planning. The independent contractor model keeps overhead at 20-25% but requires extremely user-friendly technology given consultant demographics (60s-70s, post-retirement).',
  },
  'admin': {
    text: '4 active migrations: Knack→DB (35%), Dropbox→SharePoint, Intervals→Telemetry, Zoom→Teams ($7,500/yr savings). AI dedup flagged 127 dupes (84 auto-merged). New connectors: Alliance Bank (daily balance), ADP (payroll), Formsite (surveys). Timmesse\'s tech recommendation: Monday.com for project tracking, DocuSign for contracts, LastPass for president credentials. Physical bank deposits still happening — remote deposit recommended.',
  },
  'operations/utilization': {
    text: 'Jennifer Blake at 92% utilization — approaching burnout threshold with 4 active engagements and Mountain View Phase 2 incoming. Recommend shifting 1 engagement to Sarah Kim (85%). Thomas Park (65%) and Evelyn Torres (60%) have significant capacity. Team average at 77% — 3 points below 80% target. Hiring or redistributing before Q2 pipeline converts is critical.',
  },
  'operations/timesheets': {
    text: 'Passive telemetry captured 82% of this week\'s hours automatically — email, document, and meeting time auto-tagged to engagements via M365. Only 18% required manual entry (site visits, phone calls). Intervals is fully deprecated. Billable utilization at 74% — 6 points below target. Auto-tagging accuracy hit 94% this week, up from 89% at launch.',
  },
  'deliverables': {
    text: 'Heritage Arts assessment (88%) and Faith & Light stewardship (82%) are approaching final deliverable milestones — transition to renewal conversations within 30 days. Mountain View $25M campaign has 8 of 15 deliverables complete at 55% progress — on track. Key risk: scope-to-deliverable mapping was previously manual across 8-9 systems.',
  },
  'rate-card': {
    text: 'Advisory services (assessments, feasibility, strategic planning) have highest margin at 55-65%. Training has highest scalability potential — 45% margin with digital delivery could add $120K in Year 1. Operational retainers (campaign management at $8,500/mo) provide predictable recurring revenue. Consider annual rate review tied to CPI + 2%.',
  },
  'documents': {
    text: 'Document migration from Dropbox to SharePoint is 65% complete — 47 of 72 files moved. Kelly still manages 12 active contracts manually via email attachments. Recommend: DocuSign integration for contract workflow (draft → review → sign → auto-file). 3 contracts are expiring within 60 days (Hope Springs, Faith & Light, Pacific Crest) — renewal notices should auto-trigger at 90 days. Template standardization could reduce proposal prep time by 40%.',
  },
  'onboarding': {
    text: 'Average onboarding takes 14 days — best-in-class for boutique consulting. SafeHaven is 30% through onboarding checklist with engagement letter signed and billing setup complete. Sunrise Children\'s Hospital onboarding is pending contract signature. Key bottleneck: Kelly manually creates each client folder in SharePoint and sets permissions — this should auto-provision from the signed engagement letter. QuickBooks client setup averages 2 days due to Cassandra\'s workload.',
  },
  'projects': {
    text: 'Jennifer Blake is leading 4 active projects at 92% utilization — Mountain View ($120K) and Sonoran State ($240K) are the largest. Heritage Arts assessment is 88% complete and on track for March 31 delivery. Riverside Health Annual Fund (planning) should be assigned to Thomas Park (65% utilization) rather than adding to Jennifer\'s load. This unified view replaces Kelly\'s 6+ Excel workbooks and eliminates the "game of telephone" across tracking systems.',
  },
  'style-guide': {
    text: 'The Sapphire & Gold design system uses Space Grotesk for modern readability. Primary sapphire (#3b6bf5) for trust and intelligence, gold accent (#c9942b) for warmth and premium positioning.',
    label: 'Design Notes',
  },
};

export function getInsight(route: string): AIInsight | undefined {
  return AI_INSIGHTS[route];
}
