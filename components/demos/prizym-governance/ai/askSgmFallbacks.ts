/**
 * Canned AskSGM responses for presenter-safe demos when the Forge widget
 * API is unreachable. Pattern-matched against the user's question; the
 * "genericFallback" value is used if nothing matches.
 *
 * These responses mirror the governance content in the demo data layer:
 * 88-checkpoint framework, ASC 606 policies, SCP library, CRB workflow.
 */

export interface CannedResponse {
  match: RegExp;
  response: string;
}

export const CANNED_RESPONSES: CannedResponse[] = [
  {
    match: /\b(8|eight)\s*levers?\b|what are the levers/i,
    response: `The 8 Levers of SPM (Sales Performance Management) are the core mechanisms every compensation program must get right:

1. **Crediting Rules** — how deal revenue is attributed to reps, account teams, and specialists (see SCP-001)
2. **Quota Setting** — methodology, cadence, and mid-year adjustments (SCP-002)
3. **Payout Timing & Draws** — schedule, recoverable vs. non-recoverable (SCP-003)
4. **Termination & Leave** — treatment on voluntary/involuntary exit and LOAs (SCP-004, SCP-005)
5. **Territory Management** — boundaries, transitions, protection periods (SCP-006)
6. **Windfall & Large Deal Review** — CRB thresholds and cap options (SCP-007)
7. **SPIFs & Short-Term Incentives** — approval authority bands (SCP-008)
8. **Clawback & Recovery** — overpayment recovery, chargeback rules (SCP-009)

Together these cover 88 governance checkpoints across Design, Operate, Dispute, and Oversee quadrants in the SGM framework.`,
  },
  {
    match: /clawback|overpayment|recovery/i,
    response: `Clawbacks should be structured under a written policy (SCP-009 in the library) that covers three scenarios:

1. **Commission reversal on cancelled orders** — align with the ASC 606 revenue reversal event. If the customer cancels, recognized revenue is reversed and the clawback mirrors it.
2. **Customer bankruptcy / force majeure** — your policy should explicitly state whether a waiver path exists (most do not, but precedent-setting cases escalate to the CRB).
3. **Multi-element deal modifications** — when a bundle is downgraded mid-term, recompute the allocated revenue per PO and adjust commissions proportionally.

A good clawback policy includes: (a) a defined trigger list, (b) a recovery window (typically 24 months), (c) a repayment schedule cap to prevent hardship, and (d) an appeal path. The ASC 606 Library and Compliance Dashboard in this demo both show the controls that govern clawback processing.`,
  },
  {
    match: /good comp plan|comp plan design|plan design/i,
    response: `A well-designed compensation plan has five load-bearing attributes:

1. **Strategic alignment** — every measure (quota, MBO, SPIF) ties back to a board-approved compensation philosophy. If you can't trace a payout to a business objective, cut it.
2. **Simplicity** — reps should be able to explain their own plan in 30 seconds. Plans with more than 3 measures typically underperform simpler plans at the same cost.
3. **Motivational leverage** — pay mix (base:variable) and accelerators matched to role and tenure. Enterprise AEs typically run 50:50 with 2.5x upside; field reps closer to 70:30 with 1.5x.
4. **Governance guardrails** — windfall review (SCP-007), SPIF approval bands (SCP-008), clawback alignment with ASC 606.
5. **Measurability** — every metric must be auditable to source data with a clear crediting rule (SCP-001) and calculation trail.

Use the ASC 606 Calculator in this demo to model how PO allocation affects commission timing before you finalize the plan parameters.`,
  },
  {
    match: /governance maturity|maturity|assessment/i,
    response: `Governance maturity is scored across 88 checkpoints in 12 phases, grouped into 4 quadrants:

**Design** (phases 1-6): plan architecture, legal, data/systems, territory, enablement, modeling
**Operate** (phases 7, 9, 10): calculation, reporting, operations
**Dispute** (phase 8): commission dispute resolution
**Oversee** (phases 11, 12): audit, governance

To assess, answer each checkpoint with evidence (document, system screenshot, process artifact). The scoring engine weights SOX-relevant checkpoints higher. Maturity tiers are:
- 0-30% **Fragmented** — reactive, spreadsheet-driven
- 30-55% **Emerging** — policies exist but inconsistently applied
- 55-75% **Foundation Builder** — most controls in place, some gaps
- 75-90% **Optimized** — audit-ready, minor continuous improvement
- 90%+ **Strategic Advantage** — governance is a competitive differentiator

This demo's synthetic tenant is currently scored ~71% (Foundation Builder). Use the Assessment flow to walk through each checkpoint, or the Dashboard to see maturity by quadrant.`,
  },
  {
    match: /asc\s*606|revenue recognition|performance obligation|PO catalog/i,
    response: `ASC 606 revenue recognition follows a five-step model (SPM-FW-007 in the library):

1. **Identify the contract** — probable collection, identifiable payment terms, commercial substance
2. **Identify performance obligations** — distinct goods/services using the two-part distinct test
3. **Determine transaction price** — fixed + variable consideration, constrained where uncertain
4. **Allocate transaction price** — relative standalone selling prices across POs
5. **Recognize revenue** — over time or point-in-time based on control transfer

For SPM programs, the critical connection is that **only recognized revenue should form the commission base**. The Calculator in Design → ASC 606 Calculator lets you model a multi-PO bundle (subscription, AI credits, onboarding, hardware, marketplace) and see how allocation affects the monthly recognition schedule and sample journal entries. SCP-018 in the Oversee → Compliance dashboard shows the SOX controls that govern ASC 606 treatment.`,
  },
  {
    match: /windfall|large deal|CRB/i,
    response: `Windfalls trigger Compensation Review Board (CRB) review under SCP-007. Thresholds in this demo:
- **$1M ARR or $100K+ projected payout** flags a deal for CRB evaluation
- **CRB quorum** requires CRB Chair + CFO delegate + VP Sales
- **Decision window** is 10 business days from flag

CRB has six decision options: (a) full payout as-calculated, (b) 135% cap with excess to future quota relief, (c) 120% cap, (d) 100% cap, (e) prorated over multi-year term, (f) escalate to CEO for unprecedented cases. Decisions are logged in the Decisions Log with rationale and voter list for audit trail.

The demo's approvals queue currently has one pending windfall — a $14.5M West Region enterprise deal with ~$247K projected payout, due 2026-04-16.`,
  },
  {
    match: /SOX|compliance|control|audit/i,
    response: `The governance program tracks 12 compliance controls across 4 categories (see Oversee → Compliance):

**SOX / ICFR (6 controls)**: segregation of duties, change control, month-end cut-off, reconciliation, access controls, manual JE review — all linked to SCP-018
**Wage & Hour (2)**: California AB-2288 and New York Labor Law 191 (SCP-010)
**Tax (1)**: Section 409A deferred compensation (SCP-011)
**Data Security (1)**: SOC 2 Type II (SCP-018)
**Governance (2)**: CRB quorum and SGCC charter

Current demo state: 83% compliance score. Two controls are "at risk": SOX-003 month-end cut-off (quarterly test pending) and CA AB-2288 commission statement sign-off (3 reps have not yet acknowledged the updated format). One control is "not tested": SOC 2 Type II re-test overdue.`,
  },
];

export const GENERIC_FALLBACK = `AskSGM is running in demo fallback mode — the Forge live widget is currently unreachable, so I'm returning canned responses drawn from the governance knowledge base.

I can answer questions about the 8 Levers of SPM, ASC 606 revenue recognition, clawback policy, comp plan design, governance maturity, windfall review, or SOX / compliance controls. Try one of the starter prompts, or browse the 88-checkpoint framework in the Library → Framework page for the full governance reference.

For a fully live AskSGM experience, the presenter should re-check network connectivity to forge.aicoderally.com and retry.`;

export function getCannedResponse(userQuestion: string): string {
  for (const { match, response } of CANNED_RESPONSES) {
    if (match.test(userQuestion)) return response;
  }
  return GENERIC_FALLBACK;
}
