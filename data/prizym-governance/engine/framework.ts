import type { GovernanceFramework } from './types';

export const GOVERNANCE_FRAMEWORK: GovernanceFramework = {
  version: '1.0.0',
  totalCheckpoints: 88,
  phases: [
    // ── DESIGN QUADRANT (Phases 1-6) ──────────────────────────────────────────
    {
      number: 1,
      name: 'Plan Design & Architecture',
      quadrant: 'design',
      checkpoints: [
        { id: 'p1-01', label: 'Plan design document exists', description: 'Formal plan design with objectives, components, and mechanics', evidencePrompt: 'Do you have a written plan design document?', soxRelevant: false },
        { id: 'p1-02', label: 'Compensation philosophy documented', description: 'Board-approved compensation philosophy statement', evidencePrompt: 'Is your comp philosophy in writing and approved?', soxRelevant: true },
        { id: 'p1-03', label: 'Pay mix ratios defined', description: 'Target pay mix (base vs variable) defined by role', evidencePrompt: 'Are pay mix ratios documented per role?', soxRelevant: false },
        { id: 'p1-04', label: 'Performance measures identified', description: 'KPIs, quotas, and measures linked to business strategy', evidencePrompt: 'Are your performance measures documented and linked to strategy?', soxRelevant: false },
        { id: 'p1-05', label: 'Plan calendar established', description: 'Annual cadence for design, communication, measurement, payout', evidencePrompt: 'Do you have a documented plan calendar?', soxRelevant: false },
        { id: 'p1-06', label: 'Eligibility criteria defined', description: 'Clear rules for who participates in each plan', evidencePrompt: 'Are eligibility rules written and communicated?', soxRelevant: true },
        { id: 'p1-07', label: 'Quota-setting methodology', description: 'Documented process for setting and distributing quotas', evidencePrompt: 'Is your quota methodology documented?', soxRelevant: false },
        { id: 'p1-08', label: 'Accelerator/decelerator curves', description: 'Rate tables and thresholds for over/under performance', evidencePrompt: 'Are your payout curves documented?', soxRelevant: false },
      ],
    },
    {
      number: 2,
      name: 'Legal & Compliance',
      quadrant: 'design',
      checkpoints: [
        { id: 'p2-01', label: 'Plan documents reviewed by legal', description: 'Outside or in-house counsel review of plan terms', evidencePrompt: 'Has legal reviewed your current plan documents?', soxRelevant: true },
        { id: 'p2-02', label: 'Clawback provisions defined', description: 'Documented conditions for commission recovery', evidencePrompt: 'Do you have written clawback provisions?', soxRelevant: true },
        { id: 'p2-03', label: 'Multi-jurisdiction compliance', description: 'Compliance with state/country wage and commission laws', evidencePrompt: 'Have you reviewed plans for multi-jurisdiction compliance?', soxRelevant: false },
        { id: 'p2-04', label: 'GDPR/privacy considerations', description: 'Data handling aligned with privacy regulations', evidencePrompt: 'Is compensation data handling GDPR-compliant?', soxRelevant: false },
        { id: 'p2-05', label: 'Plan acknowledgment process', description: 'Formal sign-off by participants each plan period', evidencePrompt: 'Do participants sign acknowledgment forms?', soxRelevant: true },
        { id: 'p2-06', label: 'Termination provisions', description: 'Rules for payouts on termination, leave, transfer', evidencePrompt: 'Are termination payout rules documented?', soxRelevant: true },
        { id: 'p2-07', label: 'Plan amendment process', description: 'Governance for mid-cycle plan changes', evidencePrompt: 'Do you have a documented amendment process?', soxRelevant: true },
      ],
    },
    {
      number: 3,
      name: 'Data & Systems',
      quadrant: 'design',
      checkpoints: [
        { id: 'p3-01', label: 'Source system inventory', description: 'Complete map of all data sources feeding comp calculations', evidencePrompt: 'Do you have a documented data source inventory?', soxRelevant: false },
        { id: 'p3-02', label: 'Data quality controls', description: 'Validation rules, dedup, reconciliation processes', evidencePrompt: 'Are data quality checks documented and automated?', soxRelevant: true },
        { id: 'p3-03', label: 'SPM platform selection', description: 'Technology platform evaluated and selected', evidencePrompt: 'Is your SPM platform decision documented?', soxRelevant: false },
        { id: 'p3-04', label: 'Integration architecture', description: 'Data flow between CRM, ERP, HRIS, and SPM', evidencePrompt: 'Is the integration architecture documented?', soxRelevant: false },
        { id: 'p3-05', label: 'Historical data migration', description: 'Plan for migrating legacy comp data', evidencePrompt: 'Do you have a data migration plan?', soxRelevant: false },
        { id: 'p3-06', label: 'Crediting rules engine', description: 'System-enforced rules for transaction crediting', evidencePrompt: 'Are crediting rules configured in your system?', soxRelevant: true },
        { id: 'p3-07', label: 'Calculation audit trail', description: 'Every calculation step logged and reproducible', evidencePrompt: 'Can you trace any payout back to source data?', soxRelevant: true },
      ],
    },
    {
      number: 4,
      name: 'Territory & Quota',
      quadrant: 'design',
      checkpoints: [
        { id: 'p4-01', label: 'Territory alignment methodology', description: 'Data-driven territory design and balancing', evidencePrompt: 'Is your territory methodology documented?', soxRelevant: false },
        { id: 'p4-02', label: 'Quota allocation model', description: 'Top-down/bottom-up/hybrid allocation documented', evidencePrompt: 'Is your quota allocation model documented?', soxRelevant: false },
        { id: 'p4-03', label: 'Mid-cycle adjustment policy', description: 'When and how territories/quotas can be changed', evidencePrompt: 'Do you have a policy for mid-cycle adjustments?', soxRelevant: false },
        { id: 'p4-04', label: 'Windfall/protected account rules', description: 'Handling of large deals and account protection', evidencePrompt: 'Are windfall and protection rules documented?', soxRelevant: false },
        { id: 'p4-05', label: 'Coverage gap analysis', description: 'Regular review for under-covered markets', evidencePrompt: 'Do you perform coverage gap analysis?', soxRelevant: false },
        { id: 'p4-06', label: 'Territory transfer process', description: 'Rules for pipeline and commission on territory changes', evidencePrompt: 'Is the territory transfer process documented?', soxRelevant: false },
        { id: 'p4-07', label: 'Quota attainment distribution', description: 'Statistical analysis of quota fairness', evidencePrompt: 'Do you analyze quota attainment distributions?', soxRelevant: false },
      ],
    },
    {
      number: 5,
      name: 'Communication & Enablement',
      quadrant: 'design',
      checkpoints: [
        { id: 'p5-01', label: 'Plan communication strategy', description: 'Rollout plan for new/updated compensation plans', evidencePrompt: 'Do you have a documented communication strategy?', soxRelevant: false },
        { id: 'p5-02', label: 'Participant portal/dashboard', description: 'Self-service access to earnings, quota, statements', evidencePrompt: 'Do participants have dashboard access?', soxRelevant: false },
        { id: 'p5-03', label: 'Manager enablement program', description: 'Training for managers on comp plan mechanics', evidencePrompt: 'Do you train managers on plan mechanics?', soxRelevant: false },
        { id: 'p5-04', label: 'FAQ and support process', description: 'Documented escalation path for comp questions', evidencePrompt: 'Is there a comp support/FAQ process?', soxRelevant: false },
        { id: 'p5-05', label: 'Scenario modeling tools', description: 'What-if calculators for participants and managers', evidencePrompt: 'Do participants have access to scenario tools?', soxRelevant: false },
        { id: 'p5-06', label: 'Change notification process', description: 'How mid-cycle changes are communicated', evidencePrompt: 'Is your change notification process documented?', soxRelevant: false },
        { id: 'p5-07', label: 'Onboarding comp training', description: 'New hire orientation to compensation plans', evidencePrompt: 'Do new hires receive comp plan training?', soxRelevant: false },
        { id: 'p5-08', label: 'Annual kickoff presentation', description: 'Yearly plan rollout with leadership sponsorship', evidencePrompt: 'Do you do annual plan kickoff presentations?', soxRelevant: false },
      ],
    },
    {
      number: 6,
      name: 'Modeling & Simulation',
      quadrant: 'design',
      checkpoints: [
        { id: 'p6-01', label: 'Cost modeling capability', description: 'Ability to model total comp cost under scenarios', evidencePrompt: 'Can you model total comp cost by scenario?', soxRelevant: false },
        { id: 'p6-02', label: 'Payout distribution analysis', description: 'Simulation of payout distributions before go-live', evidencePrompt: 'Do you simulate payout distributions?', soxRelevant: false },
        { id: 'p6-03', label: 'Budget vs actual tracking', description: 'Real-time comparison of planned vs actual comp spend', evidencePrompt: 'Do you track budget vs actual comp spend?', soxRelevant: true },
        { id: 'p6-04', label: 'Sensitivity analysis', description: 'Impact analysis for rate changes, threshold shifts', evidencePrompt: 'Do you perform sensitivity analysis on plan changes?', soxRelevant: false },
        { id: 'p6-05', label: 'Historical benchmarking', description: 'Year-over-year plan performance comparison', evidencePrompt: 'Do you benchmark plans against prior years?', soxRelevant: false },
        { id: 'p6-06', label: 'Market comp data integration', description: 'External salary/comp data incorporated into design', evidencePrompt: 'Do you use external market data in plan design?', soxRelevant: false },
        { id: 'p6-07', label: 'ROI measurement framework', description: 'Ability to measure comp plan return on investment', evidencePrompt: 'Can you measure ROI of your comp plans?', soxRelevant: false },
      ],
    },

    // ── OPERATE QUADRANT (Phases 7, 9, 10) ────────────────────────────────────
    {
      number: 7,
      name: 'Calculation & Processing',
      quadrant: 'operate',
      checkpoints: [
        { id: 'p7-01', label: 'Calculation engine validated', description: 'Comp calculations verified against manual/parallel run', evidencePrompt: 'Has your calculation engine been validated?', soxRelevant: true },
        { id: 'p7-02', label: 'Exception handling process', description: 'Documented workflow for manual adjustments', evidencePrompt: 'Is your exception handling process documented?', soxRelevant: true },
        { id: 'p7-03', label: 'Payment processing integration', description: 'Automated feed to payroll system', evidencePrompt: 'Are comp payments automated to payroll?', soxRelevant: true },
        { id: 'p7-04', label: 'Accrual estimation process', description: 'Monthly/quarterly comp accrual for finance', evidencePrompt: 'Do you produce comp accrual estimates?', soxRelevant: true },
        { id: 'p7-05', label: 'Split/overlay crediting rules', description: 'System handles multi-credit scenarios', evidencePrompt: 'Are split/overlay rules systematized?', soxRelevant: false },
        { id: 'p7-06', label: 'Draw/guarantee processing', description: 'Automated draw balance tracking', evidencePrompt: 'Is draw processing automated?', soxRelevant: false },
        { id: 'p7-07', label: 'Commission statement generation', description: 'Automated, detailed commission statements', evidencePrompt: 'Are statements generated automatically?', soxRelevant: true },
        { id: 'p7-08', label: 'Batch vs real-time processing', description: 'Clear cadence for when calculations run', evidencePrompt: 'Is your calculation cadence documented?', soxRelevant: false },
      ],
    },

    // ── DISPUTE QUADRANT (Phase 8) ────────────────────────────────────────────
    {
      number: 8,
      name: 'Dispute Resolution',
      quadrant: 'dispute',
      checkpoints: [
        { id: 'p8-01', label: 'Dispute submission process', description: 'Clear intake for compensation disputes', evidencePrompt: 'Do you have a formal dispute submission process?', soxRelevant: false },
        { id: 'p8-02', label: 'SLA for dispute resolution', description: 'Defined timelines for investigation and response', evidencePrompt: 'Are dispute SLAs documented?', soxRelevant: false },
        { id: 'p8-03', label: 'Escalation path defined', description: 'Multi-tier escalation from ops to leadership', evidencePrompt: 'Is the escalation path documented?', soxRelevant: false },
        { id: 'p8-04', label: 'Root cause tracking', description: 'Categorization and trending of dispute causes', evidencePrompt: 'Do you track and trend dispute root causes?', soxRelevant: false },
        { id: 'p8-05', label: 'Dispute analytics dashboard', description: 'Visibility into dispute volume, aging, resolution', evidencePrompt: 'Do you have dispute analytics?', soxRelevant: false },
        { id: 'p8-06', label: 'Correction workflow', description: 'Process for applying approved corrections', evidencePrompt: 'Is the correction workflow documented?', soxRelevant: true },
        { id: 'p8-07', label: 'Shadow accounting capability', description: 'Participants can verify their own calculations', evidencePrompt: 'Can participants verify their own calculations?', soxRelevant: false },
      ],
    },

    // ── OPERATE QUADRANT (continued) ──────────────────────────────────────────
    {
      number: 9,
      name: 'Reporting & Analytics',
      quadrant: 'operate',
      checkpoints: [
        { id: 'p9-01', label: 'Executive comp dashboard', description: 'C-suite visibility into comp effectiveness', evidencePrompt: 'Do executives have a comp dashboard?', soxRelevant: false },
        { id: 'p9-02', label: 'Pay-for-performance correlation', description: 'Analysis linking comp to business outcomes', evidencePrompt: 'Do you measure pay-for-performance correlation?', soxRelevant: false },
        { id: 'p9-03', label: 'Comp expense forecasting', description: 'Forward-looking comp cost projections', evidencePrompt: 'Can you forecast comp expenses?', soxRelevant: true },
        { id: 'p9-04', label: 'Attrition vs comp analysis', description: 'Correlation between comp and voluntary turnover', evidencePrompt: 'Do you analyze turnover against comp data?', soxRelevant: false },
        { id: 'p9-05', label: 'Plan effectiveness scorecard', description: 'Metrics proving plans drive desired behaviors', evidencePrompt: 'Do you have a plan effectiveness scorecard?', soxRelevant: false },
        { id: 'p9-06', label: 'Regulatory reporting', description: 'SOX, ASC 606, IFRS 15 reporting capabilities', evidencePrompt: 'Can you produce regulatory comp reports?', soxRelevant: true },
        { id: 'p9-07', label: 'Ad-hoc analysis capability', description: 'Self-service analytics for comp team', evidencePrompt: 'Can the comp team run ad-hoc analyses?', soxRelevant: false },
      ],
    },
    {
      number: 10,
      name: 'Operations & Administration',
      quadrant: 'operate',
      checkpoints: [
        { id: 'p10-01', label: 'Comp ops team structure', description: 'Dedicated team with clear roles and responsibilities', evidencePrompt: 'Is your comp ops team structure documented?', soxRelevant: false },
        { id: 'p10-02', label: 'Process documentation', description: 'SOPs for all recurring comp operations', evidencePrompt: 'Are comp operations SOPs documented?', soxRelevant: true },
        { id: 'p10-03', label: 'Disaster recovery plan', description: 'Business continuity for comp processing', evidencePrompt: 'Do you have a DR plan for comp processing?', soxRelevant: true },
        { id: 'p10-04', label: 'Vendor management', description: 'SLAs and governance for SPM vendors', evidencePrompt: 'Are vendor SLAs documented and tracked?', soxRelevant: false },
        { id: 'p10-05', label: 'Release management', description: 'Change control for system updates', evidencePrompt: 'Do you have change control for system updates?', soxRelevant: true },
        { id: 'p10-06', label: 'User access management', description: 'RBAC and periodic access reviews', evidencePrompt: 'Do you perform periodic access reviews?', soxRelevant: true },
        { id: 'p10-07', label: 'Automation roadmap', description: 'Plan for reducing manual comp processes', evidencePrompt: 'Do you have an automation roadmap?', soxRelevant: false },
      ],
    },

    // ── OVERSEE QUADRANT (Phases 11-12) ───────────────────────────────────────
    {
      number: 11,
      name: 'Audit & Controls',
      quadrant: 'oversee',
      checkpoints: [
        { id: 'p11-01', label: 'Internal audit program', description: 'Regular internal audit of comp processes', evidencePrompt: 'Do you have an internal comp audit program?', soxRelevant: true },
        { id: 'p11-02', label: 'SOX compliance controls', description: 'Documented controls for SOX-relevant processes', evidencePrompt: 'Are SOX controls documented and tested?', soxRelevant: true },
        { id: 'p11-03', label: 'Segregation of duties', description: 'No single person can design, calculate, and pay', evidencePrompt: 'Is segregation of duties enforced?', soxRelevant: true },
        { id: 'p11-04', label: 'Reconciliation procedures', description: 'Regular reconciliation between systems', evidencePrompt: 'Are reconciliation procedures documented?', soxRelevant: true },
        { id: 'p11-05', label: 'Evidence retention policy', description: 'How long comp records are retained', evidencePrompt: 'Is your retention policy documented?', soxRelevant: true },
        { id: 'p11-06', label: 'External audit readiness', description: 'Preparation for external audit inquiries', evidencePrompt: 'Are you prepared for external audit inquiries?', soxRelevant: true },
        { id: 'p11-07', label: 'Control testing schedule', description: 'Regular testing of key controls', evidencePrompt: 'Do you test controls on a regular schedule?', soxRelevant: true },
      ],
    },
    {
      number: 12,
      name: 'Governance & Oversight',
      quadrant: 'oversee',
      checkpoints: [
        { id: 'p12-01', label: 'Governance committee charter', description: 'Formal charter with membership, cadence, authority', evidencePrompt: 'Does your governance committee have a charter?', soxRelevant: true },
        { id: 'p12-02', label: 'Executive sponsorship', description: 'Named executive sponsor for comp governance', evidencePrompt: 'Is there a named executive sponsor?', soxRelevant: false },
        { id: 'p12-03', label: 'Cross-functional representation', description: 'Sales, Finance, HR, Legal, IT on governance committee', evidencePrompt: 'Is governance cross-functional?', soxRelevant: false },
        { id: 'p12-04', label: 'Annual plan review process', description: 'Structured annual evaluation and redesign', evidencePrompt: 'Do you have a formal annual plan review?', soxRelevant: false },
        { id: 'p12-05', label: 'Policy exception governance', description: 'Who can approve exceptions and under what rules', evidencePrompt: 'Is exception governance documented?', soxRelevant: true },
        { id: 'p12-06', label: 'Continuous improvement program', description: 'Feedback loop from disputes, audits, analytics', evidencePrompt: 'Do you have a continuous improvement program?', soxRelevant: false },
        { id: 'p12-07', label: 'Board/compensation committee reporting', description: 'Regular reporting to board or comp committee', evidencePrompt: 'Do you report to the board on comp governance?', soxRelevant: true },
        { id: 'p12-08', label: 'Maturity assessment cadence', description: 'Regular self-assessment of governance maturity', evidencePrompt: 'Do you reassess governance maturity regularly?', soxRelevant: false },
      ],
    },
  ],
}
