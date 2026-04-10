import type { Policy } from './types';

/**
 * ASC 606 Policy Data
 *
 * Pre-loaded governance policies covering ASC 606 Revenue Recognition
 * requirements as applied to BHG's subscription, usage, and marketplace
 * business model. These policies align the sales compensation program
 * with GAAP revenue recognition standards and SOX/ICFR obligations.
 *
 * SCP-018 through SCP-021 extend the core policy library (SCP-001–SCP-017).
 */

const tenantId = 'demo-tenant-001';
const effectiveDate = new Date('2026-02-18T00:00:00Z');
const createdAt = new Date('2026-02-18T00:00:00Z');

// ---------------------------------------------------------------------------
// SCP-018: ASC 606 Controls & SOX/ICFR Checklist
// ---------------------------------------------------------------------------
const asc606Policy1: Policy = {
  id: 'pol-asc606-018',
  tenantId,
  dataClass: 'reference',
  name: 'ASC 606 Controls & SOX/ICFR Checklist',
  description:
    'Defines the internal control framework supporting ASC 606 revenue recognition ' +
    'compliance, including segregation of duties, change control, month-end cut-off, ' +
    'reconciliation requirements, access controls, and manual journal entry review standards.',
  category: 'Accounting Controls',
  version: '1.0.0',
  status: 'published',
  effectiveDate,
  content: `# ASC 606 Controls & SOX/ICFR Checklist
## Policy Code: SCP-018

---

## Purpose

This policy defines the internal control framework required to support accurate, auditable revenue recognition under ASC 606. All controls are scoped to BHG's subscription, usage-based, marketplace, and hardware revenue streams. Controls are designed to satisfy SOX Section 302 and 404 (ICFR) requirements and are subject to annual external auditor testing.

---

## Scope

Applies to Finance, Sales Operations, Revenue Accounting, and IT/Systems teams involved in the order-to-cash cycle, commission processing, and financial close.

---

## Controls Matrix

| Control Area | Control Objective | Control Examples |
|---|---|---|
| **Segregation of Duties** | Prevent self-approval of revenue-affecting transactions; ensure no single individual can initiate, approve, and record a revenue event without independent review | (1) Sales rep submits order; Sales Ops approves credit terms; Finance posts revenue entry — three separate roles required. (2) Commission calculation performed by Comp Ops; payment approved by Finance Controller; payroll executed by HR — no cross-role overlap permitted. (3) Contract modifications (e.g., mid-period discounts, retroactive credits) require dual approval: Sales Manager + Finance |
| **Change Control** | Ensure all changes to SSP tables, allocation keys, commission schedules, and recognition rules are versioned, reviewed, and approved prior to go-live | (1) SSP table updates require a formal change request with: (a) effective date, (b) impact analysis on open contracts, (c) VP Finance approval, (d) system update with audit log. (2) Commission plan policy reruns (e.g., retroactive quota adjustments) require explicit Finance approval with a documented business justification. (3) All changes to recognition rules in the billing or ERP system must pass through the IT Change Advisory Board (CAB) and include a parallel-test period before cutover |
| **Revenue Cut-Off** | Ensure revenue is recorded in the correct accounting period; prevent early or late recognition that misrepresents financial position | (1) Month-end usage data lock: all usage meters must be frozen by 11:59 PM on the last calendar day of the month; any data received after lock is deferred to the following period. (2) Subscription revenue is recognized on a straight-line basis using contract start/end dates — proration tables must be validated against source contracts during close. (3) A cut-off reconciliation is performed monthly comparing billed amounts to recognized revenue, with a sign-off from the Revenue Accounting Manager by close day +3 |
| **Reconciliations** | Maintain completeness and accuracy of revenue-related balances; detect errors before financial statement issuance | (1) Billings-to-A/R: monthly reconciliation of invoiced amounts vs. accounts receivable aging; unexplained variances >$5,000 escalated to Controller. (2) Contract liability (deferred revenue) rollforward: monthly rollforward reconciling opening balance + new deferrals – recognized amounts = closing balance; reconciled to trial balance. (3) Cash receipts matched to invoices within 5 business days; unmatched cash >$10,000 triggers Finance investigation. (4) Commission accrual to payment reconciliation performed quarterly; variances investigated and documented |
| **Access Controls** | Restrict access to contract terms, pricing tables, SSP schedules, and recognition configurations to authorized personnel only | (1) Role-based access control (RBAC) enforced in ERP and billing system: Finance Analysts can view but not modify SSP tables; only Revenue Accounting Managers have write access. (2) Sales reps cannot view or modify commission calculation inputs beyond their own plan documents. (3) Privileged access (system admin, bulk update) is logged, reviewed quarterly by IT Security, and requires two-factor authentication. (4) Terminated employee access is revoked within 24 hours of HR notification; access logs are retained for 7 years |
| **Manual Journal Entry Review** | Ensure all manual journal entries affecting revenue are appropriate, authorized, and supported by adequate documentation | (1) All manual JEs affecting revenue accounts require: (a) preparer name and timestamp, (b) supporting documentation (contract, invoice, calculation), (c) reviewer signature from a level above the preparer. (2) Threshold-based review: JEs ≥$25,000 require Controller review; JEs ≥$100,000 require VP Finance review; JEs ≥$500,000 require CFO approval. (3) Top-side adjustments to revenue are prohibited unless supported by a formal accounting memo approved by Finance leadership. (4) All manual JEs and supporting evidence are archived in the Evidence Pack repository with a minimum 7-year retention period |

---

## ICFR Testing Schedule

| Control | Test Frequency | Tester |
|---|---|---|
| Segregation of duties | Quarterly | Internal Audit |
| Change control | Quarterly (aligned to plan changes) | Revenue Accounting + IT |
| Revenue cut-off | Monthly (close checklist) | Revenue Accounting Manager |
| Reconciliations | Monthly (automated + manual sign-off) | Finance Controller |
| Access controls | Quarterly | IT Security + Internal Audit |
| Manual JE review | Monthly (all JEs reviewed) | Controller |

---

## Deficiency Classification

- **Control Deficiency**: A weakness that does not rise to material misstatement risk; remediated within 90 days.
- **Significant Deficiency**: A control weakness that could result in material misstatement if not remediated; reported to Audit Committee within 30 days.
- **Material Weakness**: A deficiency, or combination of deficiencies, that results in a reasonable possibility of material misstatement of the financial statements; requires immediate escalation to CEO/CFO and external auditors.

---

## Policy Owner & Review

- **Owner**: Finance / Revenue Accounting
- **Approver**: VP Finance
- **Review Cycle**: Annual or upon material change to business model or accounting standards
`,
  approvalRequired: true,
  approvedBy: 'BHG Consulting',
  approvedAt: effectiveDate,
  createdBy: 'BHG Consulting',
  createdAt,
  updatedBy: 'BHG Consulting',
  updatedAt: createdAt,
  metadata: {
    code: 'SCP-018',
    owner: 'Finance',
    domain: 'ASC 606',
    reviewCycle: 'Annual',
    icfrRelevant: true,
    soxSection: '302 / 404',
  },
};

// ---------------------------------------------------------------------------
// SCP-019: ASC 606 Disclosure Requirements (606-10-50)
// ---------------------------------------------------------------------------
const asc606Policy2: Policy = {
  id: 'pol-asc606-019',
  tenantId,
  dataClass: 'reference',
  name: 'ASC 606 Disclosure Requirements (606-10-50)',
  description:
    'Defines BHG\'s obligations under ASC 606-10-50 to disclose disaggregated revenue, ' +
    'contract balances, performance obligation narratives, remaining performance obligations, ' +
    'and significant judgments in quarterly and annual financial statements.',
  category: 'Financial Reporting',
  version: '1.0.0',
  status: 'published',
  effectiveDate,
  content: `# ASC 606 Disclosure Requirements (606-10-50)
## Policy Code: SCP-019

---

## Purpose

This policy establishes BHG's disclosure framework for ASC 606-10-50, ensuring that financial statement footnotes and MD&A sections provide users with sufficient information to understand the nature, amount, timing, and uncertainty of revenue and cash flows arising from contracts with customers.

---

## Scope

Applies to all revenue-generating activities including subscription licenses, usage-based services, marketplace fees (agent arrangements), professional services, and hardware sales. Required for all SEC filings (10-K, 10-Q) and applicable to management reporting where relevant.

---

## Disclosure Area 1: Disaggregation of Revenue (606-10-50-5 through 50-6)

**Requirement**: Disaggregate revenue into categories that depict how the nature, amount, timing, and uncertainty of revenue and cash flows are affected by economic factors.

**BHG-Specific Guidance**:

Disaggregate revenue into at least the following categories in all quarterly and annual filings:

| Revenue Stream | Recognition Model | Disclosure Category |
|---|---|---|
| Subscription licenses (SaaS tiers) | Ratable over contract term | Subscription Revenue |
| Usage-based services (API calls, compute units) | As consumed, monthly | Usage Revenue |
| Marketplace fees (agent arrangements — net) | At transaction settlement, net of GMV | Marketplace Revenue (Net) |
| Hardware (distinct PO) | Point in time — upon delivery | Hardware Revenue |
| Professional services (implementation, training) | Over time — output method | Professional Services Revenue |

Additional disaggregation required by:
- **Geography** (North America, EMEA, APAC) where material
- **Customer size** (Enterprise ≥$100K ARR, Mid-Market $25K–$99K, SMB <$25K) if segment reporting differs materially
- **Channel** (Direct, Partner/Reseller, Marketplace) where applicable

**BHG-Specific Note**: Marketplace arrangements must be disclosed separately as agent revenue (net basis). Do not commingle GMV with gross subscription/usage revenue in any external-facing table.

---

## Disclosure Area 2: Contract Balances (606-10-50-8 through 50-10)

**Requirement**: Disclose opening and closing balances of receivables, contract assets, and contract liabilities (deferred revenue); explain significant changes in contract liability balances.

**BHG-Specific Guidance**:

Include a rollforward table in each 10-K and 10-Q footnote:

| Balance | Q-1 Opening | New Deferrals | Revenue Recognized | Adjustments | Quarter Closing |
|---|---|---|---|---|---|
| Contract liabilities (deferred revenue — current) | $X | $X | $(X) | $X | $X |
| Contract liabilities (deferred revenue — non-current) | $X | $X | $(X) | $X | $X |
| Contract assets (unbilled receivables) | $X | $X | $(X) | $X | $X |

**Drivers to Explain** (narrative required when variance >10% quarter-over-quarter):
- New multi-year subscription signings creating upfront deferred revenue
- Early renewals increasing deferred balance
- Customer churn or contract terminations reducing deferred balance
- Usage credit packages purchased but not yet consumed

---

## Disclosure Area 3: Performance Obligation Narratives (606-10-50-12)

**Requirement**: Describe significant performance obligations, payment terms, and timing of satisfaction.

**BHG-Specific Guidance**:

For each major revenue stream, disclose:

1. **Subscription Licenses**: Narrative must state that BHG provides stand-ready access to its SaaS platform over the subscription term; revenue is recognized ratably on a straight-line basis; invoices are issued annually (or monthly for SMB) at the beginning of each subscription period.

2. **Usage-Based Services**: Disclose that usage revenue is recognized as consumed based on metered data; invoiced monthly in arrears; variable consideration is not constrained at period end as usage patterns are estimable from historical data.

3. **Marketplace Arrangements**: Explicitly disclose BHG's role as **agent** in marketplace transactions; BHG does not control the underlying goods/services before transfer to the customer; revenue is recognized as the net fee retained; GMV is disclosed for informational purposes only and is not included in gross revenue.

4. **Professional Services**: State that implementation and training services are recognized over time using output-based milestones; material right analysis performed for any included "free" training sessions bundled with subscriptions.

5. **Hardware**: Disclose that hardware revenue is recognized at a point in time upon transfer of control (typically delivery/shipping); revenue is not bundled with subscription unless the contract specifies concurrent activation.

---

## Disclosure Area 4: Remaining Performance Obligations (606-10-50-13 through 50-15)

**Requirement**: Disclose the aggregate amount of the transaction price allocated to remaining performance obligations and when BHG expects to recognize it as revenue.

**BHG-Specific Guidance**:

- Disclose the **total backlog** of remaining POs under contracts with original terms >12 months, disaggregated between amount expected to be recognized within 12 months vs. thereafter.
- **Subscription RPO**: All future ratable subscription revenue under signed multi-year contracts.
- **Usage Credits RPO**: Unconsumed prepaid usage credits with contractual expiration dates >12 months.
- **Practical Expedient**: BHG may elect not to disclose RPO for (a) variable consideration allocated entirely to a distinct PO and (b) contracts with original terms of 12 months or less. Disclose the election in the footnote.

---

## Disclosure Area 5: Significant Judgments (606-10-50-17 through 50-20)

**Requirement**: Disclose the judgments made in applying ASC 606 that significantly affect the determination of the amount and timing of revenue.

**BHG-Specific Guidance**:

The following judgments must be disclosed explicitly:

1. **Usage Credit Breakage**: BHG estimates breakage (credits that will not be consumed) using historical redemption rates by cohort. The expected value method is applied. If breakage estimate changes by more than 5 percentage points, disclose the change and its financial impact.

2. **SSP Estimation Approach**: For bundles, SSP is established using: (a) observable standalone pricing where available; (b) adjusted market assessment for new products; (c) expected cost-plus-margin for services without observable pricing. Disclose the SSP range for each significant product category.

3. **Variable Consideration Constraint**: BHG applies the constraint to usage-based components of enterprise contracts with unlimited tiers; the constraint is released progressively as actual usage data is received. Disclose the constrained amount outstanding at each period end if material.

4. **Agent vs. Principal**: Judgment applied to each marketplace arrangement using the control principle. Key indicators assessed: inventory risk (BHG does not bear), pricing latitude (marketplace sets transaction price), customer relationship (marketplace counterparty). Disclose when the determination changes for any material arrangement.

---

## Policy Owner & Review

- **Owner**: Finance / Financial Reporting
- **Approver**: Chief Accounting Officer (CAO)
- **Review Cycle**: Annual; updated within 30 days of any ASC 606 FASB guidance change
`,
  approvalRequired: true,
  approvedBy: 'BHG Consulting',
  approvedAt: effectiveDate,
  createdBy: 'BHG Consulting',
  createdAt,
  updatedBy: 'BHG Consulting',
  updatedAt: createdAt,
  metadata: {
    code: 'SCP-019',
    owner: 'Finance',
    domain: 'ASC 606',
    asc606Section: '606-10-50',
    reviewCycle: 'Annual',
    applicableFilings: ['10-K', '10-Q'],
  },
};

// ---------------------------------------------------------------------------
// SCP-020: ASC 606 Risk Mitigations
// ---------------------------------------------------------------------------
const asc606Policy3: Policy = {
  id: 'pol-asc606-020',
  tenantId,
  dataClass: 'reference',
  name: 'ASC 606 Risk Mitigations',
  description:
    'Identifies the primary revenue recognition risks present in BHG\'s business model ' +
    'under ASC 606 and defines the corresponding mitigations, controls, and escalation ' +
    'procedures to prevent financial misstatement.',
  category: 'Risk Management',
  version: '1.0.0',
  status: 'published',
  effectiveDate,
  content: `# ASC 606 Risk Mitigations
## Policy Code: SCP-020

---

## Purpose

This policy catalogs the key revenue recognition risks arising from BHG's multi-product, multi-channel, and multi-arrangement business model under ASC 606, and defines mitigations to prevent material misstatement, financial restatement, or audit findings.

---

## Scope

Applies to all revenue streams: subscription, usage-based, marketplace (agent), professional services, and hardware. Finance, Sales Operations, Legal, and IT are each accountable for the mitigations within their respective domains.

---

## Risk & Mitigation Matrix

| Risk | How It Fails | Mitigation |
|---|---|---|
| **Mis-identifying Performance Obligations (POs)** | A bundle of goods and services is treated as a single PO when distinct elements exist (or vice versa), causing incorrect timing and allocation of revenue. Example: A $120K "Enterprise Suite" deal includes SaaS subscription + implementation + training + hardware — if treated as one PO, revenue may be recognized too early or too late depending on the weakest element's delivery. | (1) **Contract Review Checklist**: All new contract types are reviewed by Revenue Accounting against the ASC 606 five-step model before the first invoice. (2) **PO Template Library**: Standard bundles have pre-approved PO decomposition templates; deviations require Finance sign-off. (3) **Deal Desk Gate**: Deals with non-standard bundling (e.g., "free" implementation, extended payment terms) are routed through Deal Desk + Finance before order booking. (4) **Quarterly Review**: Revenue Accounting reviews 100% of new contract types and a statistical sample of repeat types each quarter. |
| **Variable Consideration Misestimation** | Usage-based revenue, tiered pricing, performance bonuses, or refund rights are included in the transaction price in amounts that are subsequently reversed, triggering a significant revenue reversal. Example: BHG includes estimated Q4 usage overage revenue in Q3 recognition; customer churns early in Q4, resulting in a reversal that constitutes a "significant reversal." | (1) **Constraint Application Protocol**: Finance documents the constraint analysis for each variable consideration element at period end; constrained amounts are tracked in a register and reviewed by the Controller. (2) **Historical Data Requirement**: Variable consideration estimates must be based on at least 6 months of historical data for the specific product/customer segment; new products use conservative floor estimates for the first 2 quarters. (3) **Sensitivity Testing**: Finance runs a 10% / 25% downside scenario on variable consideration estimates quarterly; if a 25% downside would trigger a material reversal, the constraint is automatically applied. (4) **Monthly True-Up**: Usage actuals are reconciled to estimates monthly; material variances (>5% of estimated amount) trigger a disclosure memo. |
| **Principal / Agent Misclassification** | BHG records marketplace gross merchandise value (GMV) as gross revenue instead of net fee revenue (or vice versa), materially overstating or understating reported revenue. Example: BHG's marketplace facilitates $10M GMV in a quarter; if classified as principal, BHG records $10M gross; if correctly classified as agent, BHG records only the $1.2M net fee. | (1) **Agent Assessment Worksheet**: For every marketplace arrangement (new or modified), Revenue Accounting completes a three-criterion assessment: (a) Does BHG control the good/service before transfer? (b) Does BHG bear inventory risk? (c) Does BHG have pricing latitude? All three must indicate agent status before net recognition is applied. (2) **Contract Language Review**: Legal flags any marketplace contract clause that could indicate principal obligations (e.g., service level guarantees, inventory commitments) and escalates to Finance. (3) **Annual Reassessment**: All marketplace arrangements are formally reassessed annually, or immediately upon contract renewal with material changes. (4) **Disclosure Discipline**: Gross GMV is tracked internally for operational purposes but is never included in external revenue tables without explicit "for informational purposes only" labeling. |
| **Credits / Breakage Mishandled** | Usage credits or prepaid service packages are recognized as revenue prematurely (before consumption) or left in deferred revenue after the right to enforce lapses (missed breakage recognition). Example: $2M in usage credits sold in Q1; $400K expected to expire unused; if BHG fails to recognize breakage proportionally, deferred revenue is overstated and revenue is understated through the contract term. | (1) **Breakage Policy (see SCP-021)**: BHG uses the expected value method for breakage estimation; estimates are refreshed quarterly using cohort-level redemption data. (2) **Proportional Breakage Recognition**: Breakage is recognized proportionally to credits consumed, not deferred to expiration date, unless the pattern of rights enforced by customers makes a different method more predictive. (3) **Expiration Monitoring**: Finance maintains a credit expiration register; credits approaching expiration (within 90 days) are reviewed for breakage reclassification. (4) **Regulatory Note**: If credits are subject to unclaimed property (escheatment) laws in applicable states, Legal is notified before breakage revenue is recorded. |
| **Contract Leakage — Side Letters and Informal Modifications** | Verbal commitments, email concessions, or side letters that modify the economics of a contract are not captured in the official contract record, causing the stated transaction price to differ from actual cash flows and resulting in incorrect revenue recognition. Example: A sales rep verbally commits to a 3-month free extension to close a deal; the extension is not reflected in the contract, so Finance recognizes 15 months of revenue over a 12-month contract term. | (1) **Side Letter Prohibition Policy**: Sales reps are expressly prohibited from making written or verbal commitments outside the executed contract. Violations are reported to Sales Ops and Finance and may result in commission clawback (see SCP-001). (2) **CRM Attestation**: Sales reps must attest in CRM (as part of the "Won" stage workflow) that no side agreements, discounts, or commitments exist outside the executed contract documents. (3) **Legal Review Gate**: Contracts with non-standard terms (extended payment, free periods, price protection clauses) are routed to Legal before countersignature. (4) **Post-Close Audit**: Finance performs a quarterly sample audit of closed deals, reviewing email correspondence and CRM notes for evidence of undisclosed concessions; findings are escalated to VP Sales and Finance Controller. |
| **Tax and Indirect Tax Errors** | Sales tax, VAT, or other indirect taxes are included in the transaction price used for revenue recognition, overstating gross revenue; or tax-inclusive pricing is not correctly netted, causing inconsistency between recognized revenue and cash collected. | (1) **Tax Exclusion Rule**: Transaction prices in BHG's ERP/billing system are configured to record revenue net of all sales tax, VAT, and GST collected on behalf of taxing authorities; Finance performs a quarterly validation that tax amounts are mapped to liability accounts, not revenue accounts. (2) **Gross vs. Net Reconciliation**: A monthly reconciliation compares gross cash collected to net revenue recognized; persistent variances are investigated by Tax and Finance jointly. (3) **Nexus Monitoring**: Tax team reviews new customer geographies quarterly to identify new tax obligations; changes are reflected in billing configuration before the next invoice cycle. (4) **Marketplace Tax Collection**: For marketplace arrangements where BHG collects tax on behalf of the marketplace seller, tax amounts are excluded from the net fee revenue calculation and tracked separately. |

---

## Risk Escalation

| Severity | Condition | Escalation |
|---|---|---|
| **Low** | Identified risk with established mitigation in place | Document in quarterly risk register; review at next close |
| **Medium** | Mitigation partially effective; revenue impact <$500K | Escalate to Finance Controller + Revenue Accounting Manager within 5 business days |
| **High** | Mitigation failed or missing; potential revenue impact >$500K | Escalate to VP Finance + CAO within 24 hours; assess disclosure implications |
| **Critical** | Potential material misstatement; prior period impact possible | Escalate to CFO + Audit Committee; engage external auditors; assess restatement |

---

## Policy Owner & Review

- **Owner**: Finance / Risk Management
- **Approver**: Chief Accounting Officer (CAO)
- **Review Cycle**: Semi-annual; updated within 30 days of any new product launch or business model change
`,
  approvalRequired: true,
  approvedBy: 'BHG Consulting',
  approvedAt: effectiveDate,
  createdBy: 'BHG Consulting',
  createdAt,
  updatedBy: 'BHG Consulting',
  updatedAt: createdAt,
  metadata: {
    code: 'SCP-020',
    owner: 'Finance',
    domain: 'ASC 606',
    reviewCycle: 'Semi-annual',
    riskCount: 6,
    escalationTiers: ['Low', 'Medium', 'High', 'Critical'],
  },
};

// ---------------------------------------------------------------------------
// SCP-021: ASC 606 Variable Consideration & Constraint
// ---------------------------------------------------------------------------
const asc606Policy4: Policy = {
  id: 'pol-asc606-021',
  tenantId,
  dataClass: 'reference',
  name: 'ASC 606 Variable Consideration & Constraint',
  description:
    'Governs the estimation, constraint, and allocation of variable consideration ' +
    'in BHG\'s contracts under ASC 606-10-32-5 through 32-14, including usage-based fees, ' +
    'tiered pricing, marketplace fee variability, performance bonuses, and credit breakage. ' +
    'Defines when the constraint applies and how variable consideration is allocated to specific ' +
    'performance obligations and periods.',
  category: 'Revenue Recognition',
  version: '1.0.0',
  status: 'published',
  effectiveDate,
  content: `# ASC 606 Variable Consideration & Constraint
## Policy Code: SCP-021

---

## Purpose

Variable consideration is present in the majority of BHG's customer contracts. This policy establishes the estimation methodology, constraint application rules, allocation procedures, and documentation requirements to ensure variable revenue is recognized accurately and in the correct period under ASC 606-10-32-5 through 32-14.

---

## Scope

Applies to all contract elements where the amount of consideration is not fixed at contract inception, including but not limited to: usage-based fees, tiered pricing thresholds, volume discounts, performance bonuses, price concessions, refund rights, and prepaid usage credits (breakage).

---

## Section 1: Estimation Methods

ASC 606 permits two methods for estimating variable consideration. BHG selects the method that better predicts the amount to which it will be entitled.

### Method A: Expected Value

The sum of probability-weighted amounts across the range of possible outcomes. BHG uses this method when:
- A large number of contracts with similar characteristics exist (e.g., usage-based fees across thousands of enterprise customers)
- Historical data supports a statistical distribution of outcomes
- No single outcome dominates the probability distribution

**Application**: Usage-based revenue, breakage on prepaid credits, volume discount tiers across the enterprise portfolio.

**Calculation Example**:
- 60% probability: Customer uses 800 API units → $8,000 revenue
- 30% probability: Customer uses 1,000 API units → $10,000 revenue
- 10% probability: Customer uses 1,200 API units → $12,000 revenue
- Expected value: (0.60 × $8,000) + (0.30 × $10,000) + (0.10 × $12,000) = **$8,800**

### Method B: Most Likely Amount

The single most likely amount in the range of possible outcomes. BHG uses this method when:
- The contract has only two possible outcomes (e.g., a binary performance bonus: earned or not earned)
- A single outcome is clearly dominant
- The contract is a one-off with no comparable historical portfolio

**Application**: Performance bonuses tied to specific milestones, refund rights on implementation fees, single-customer non-recurring arrangements.

**Calculation Example**:
- Outcome 1 (70% probability): Performance milestone achieved → $50,000 bonus earned
- Outcome 2 (30% probability): Milestone not achieved → $0 bonus earned
- Most likely amount: **$50,000** (highest probability single outcome)

---

## Section 2: The Constraint — "Probable That a Significant Reversal Will Not Occur"

BHG may only include variable consideration in the transaction price to the extent it is **probable that a significant revenue reversal will not occur** when the uncertainty is resolved (ASC 606-10-32-11).

### Factors That Increase Constraint Risk (require conservative estimation or full constraint)

1. High susceptibility to factors outside BHG's influence (e.g., customer's own usage patterns, market conditions affecting marketplace GMV)
2. Long time horizon before uncertainty resolves (e.g., usage bonuses tied to full-year attainment measured only at year-end)
3. Limited experience with this type of contract or customer segment (<6 months of data)
4. Wide range of possible consideration amounts with material downside scenarios
5. Known customer financial distress, dispute, or credit risk

### Factors That Reduce Constraint Risk (support including variable consideration)

1. Extensive, consistent historical portfolio data showing narrow range of outcomes
2. Short settlement horizon (e.g., monthly usage billed and settled within 30 days)
3. BHG has significant influence over the outcome (e.g., negotiated volume commitments)
4. Variable amount is immaterial relative to total contract value

### BHG-Specific Constraint Application Decision Tree

\`\`\`
Step 1: Is the variable consideration immaterial (<5% of total contract value)?
   → YES: Include without constraint; document as de minimis
   → NO: Continue to Step 2

Step 2: Does BHG have >6 months of historical data for this product/segment combination?
   → NO: Apply full constraint; recognize only fixed consideration until data accumulates
   → YES: Continue to Step 3

Step 3: Does a 25% downside scenario result in a "significant reversal" (>10% of cumulative recognized revenue)?
   → YES: Constrain variable consideration to the floor of the reasonable range
   → NO: Include expected value estimate; document the sensitivity analysis
\`\`\`

---

## Section 3: Allocation of Variable Consideration to Specific POs or Periods

By default, variable consideration is allocated to all POs in the contract on the same basis as the standalone selling price (SSP) allocation. However, ASC 606-10-32-39 permits allocation of variable consideration entirely to a specific PO or to a specific time period if:

1. The terms of the variable payment relate specifically and solely to BHG's efforts to satisfy that PO (or a distinct time period), **and**
2. Allocating the variable consideration entirely to that PO or period is consistent with the overall allocation objective.

### BHG-Specific Allocation Examples

| Arrangement | Variable Element | Allocation Treatment |
|---|---|---|
| Subscription + Usage bundle | Usage-based overage fees | Allocated entirely to the usage PO (criterion 1 met: usage fees directly tied to usage delivery; criterion 2 met: consistent with consumption pattern) |
| Subscription + Professional Services | Year-end performance bonus for on-time implementation | Allocated entirely to the implementation PO (criterion 1 met: bonus tied solely to implementation milestones) |
| Multi-year subscription with annual price escalator | Year 2 and Year 3 price increases | Allocated to the period in which the higher price applies (ratable within each year at the contracted rate for that year) |
| Marketplace fee with volume tier | Reduced fee rate at >$1M GMV threshold | Allocated ratably across the full contract using the expected value of GMV (cannot allocate to a single period because tier resets annually) |

---

## Section 4: Marketplace Fee Treatment

BHG's marketplace arrangements involve variable consideration at two levels:

1. **Fee Rate Variability**: The percentage fee BHG retains may vary based on transaction volume tiers (e.g., 12% on first $1M GMV, 10% thereafter).

2. **GMV Variability**: The underlying transaction volume is inherently uncertain at contract inception.

**Policy**:
- Use the expected value method to estimate full-year GMV by customer based on historical transaction patterns and committed volume (if any).
- Apply the tiered fee schedule to the expected GMV distribution to derive an expected net fee.
- Apply the constraint: if the customer is in their first 6 months on the marketplace, recognize only fees as transactions settle (do not include forward-looking expected value in the transaction price).
- After 6+ months of data: recognize fees ratably across the contract year based on expected GMV, trued up monthly to actuals.

---

## Section 5: BHG-Specific Examples

### Example A: Enterprise Subscription with Usage Overage

**Contract Terms**: 24-month SaaS subscription at $10,000/month (fixed) + usage overage at $0.02/API call above 100,000 calls/month (variable).

**Estimation**:
- Fixed component: $240,000 recognized ratably → $10,000/month — no constraint required.
- Variable overage: Based on 18 months of historical data, this customer tier averages 115,000–125,000 calls/month (overage of 15,000–25,000 calls/month).
  - Expected value: 60% × 15,000 + 30% × 20,000 + 10% × 25,000 = 17,500 calls/month average overage.
  - Expected monthly overage revenue: 17,500 × $0.02 = $350/month.
  - Constraint check: 25% downside = 13,125 calls × $0.02 = $262.50/month. This represents 2.6% of total monthly contract value — not a significant reversal.
  - **Conclusion**: Include $350/month in transaction price; true up monthly to actuals.

### Example B: New Customer — No Historical Data

**Contract Terms**: 12-month subscription + $15,000 performance bonus if customer achieves 95% platform adoption by Month 10.

**Estimation**:
- Subscription: Recognized ratably — no constraint.
- Performance bonus: New customer, no historical data on this customer's adoption behavior. Binary outcome (earn/don't earn).
  - Most likely amount: Cannot reliably estimate probability of milestone achievement.
  - **Constraint applied**: Exclude the $15,000 bonus from the transaction price until Month 10 when the milestone outcome is determinable.
  - At Month 10: If milestone achieved, recognize $15,000 immediately (constraint lifted). If not achieved, continue to exclude.

### Example C: Prepaid Usage Credits (Breakage)

**Contract Terms**: Customer purchases $50,000 in prepaid API credits. Historical cohort data shows 8% of credits are never consumed (breakage rate). Credits expire 24 months from purchase.

**Estimation**:
- Total expected revenue: $50,000.
- Expected breakage: $50,000 × 8% = $4,000.
- Non-breakage credits: $46,000 recognized proportionally as credits are consumed.
- Breakage: $4,000 recognized proportionally to the pattern of rights exercised (i.e., as the remaining credits are consumed, the likelihood that the residual 8% will also be consumed decreases, and breakage is released accordingly).
- **Constraint check**: If actual breakage experience deviates by more than ±3 percentage points from the 8% estimate, the estimate is updated and the change recognized in the current period.

---

## Section 6: Documentation Requirements

For every contract with material variable consideration, Revenue Accounting must maintain in the contract workbook:

1. **Estimation Method Selection**: Which method (expected value or most likely amount) was selected and why.
2. **Data Sources**: Historical data set used, period covered, and any adjustments made.
3. **Constraint Analysis**: The three-step decision tree output, sensitivity analysis results, and conclusion.
4. **Allocation Basis**: Whether variable consideration is allocated on SSP basis or to a specific PO/period, with support for criterion compliance.
5. **True-Up Log**: Monthly record of actual vs. estimated variable consideration; explanation of variances >5%.

All documentation is retained for a minimum of 7 years and is subject to internal audit review and external auditor inspection.

---

## Policy Owner & Review

- **Owner**: Finance / Revenue Accounting
- **Approver**: Chief Accounting Officer (CAO)
- **Review Cycle**: Annual; updated within 60 days of any new variable consideration arrangement type entering the contract portfolio
`,
  approvalRequired: true,
  approvedBy: 'BHG Consulting',
  approvedAt: effectiveDate,
  createdBy: 'BHG Consulting',
  createdAt,
  updatedBy: 'BHG Consulting',
  updatedAt: createdAt,
  metadata: {
    code: 'SCP-021',
    owner: 'Finance',
    domain: 'ASC 606',
    asc606Section: '606-10-32-5 through 32-14',
    reviewCycle: 'Annual',
    estimationMethods: ['Expected Value', 'Most Likely Amount'],
    constraintCriteria: 'probable that a significant reversal will not occur',
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const asc606Policies: Policy[] = [
  asc606Policy1,
  asc606Policy2,
  asc606Policy3,
  asc606Policy4,
];
