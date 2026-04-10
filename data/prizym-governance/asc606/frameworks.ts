import type { GovernanceFramework } from './types';

/**
 * ASC 606 Revenue Recognition Framework Data
 * Compliance guidance for SPM programs under FASB ASC 606 / IFRS 15
 */

const DEFAULT_TENANT_ID = 'demo-tenant-001';
const CREATED_BY = 'BHG Consulting';
const NOW = new Date('2026-02-18T12:00:00Z');

// =============================================================================
// SPM-FW-007: ASC 606 Five-Step Model
// =============================================================================

export const asc606Framework1: GovernanceFramework = {
  id: 'fw-asc606-007',
  tenantId: DEFAULT_TENANT_ID,
  code: 'SPM-FW-007',
  title: 'ASC 606 Revenue Recognition — Five-Step Model',
  category: 'COMPLIANCE',
  content: `# ASC 606 Revenue Recognition — Five-Step Model

## Overview

ASC 606 (*Revenue from Contracts with Customers*) establishes a single, principles-based framework for recognizing revenue from customer contracts. Effective for public entities since December 2017 and private entities since December 2018, it supersedes legacy industry-specific guidance (SAB 104, SOP 97-2) and aligns U.S. GAAP with IFRS 15.

For Sales Performance Management (SPM) programs, ASC 606 directly governs **how and when revenue is recorded**, which in turn determines the **earned commission base** used in incentive calculations. Misapplication of ASC 606 creates both financial reporting risk and potential over- or under-payment of sales compensation.

---

## The Five-Step Model

### Step 1: Identify the Contract with the Customer

A contract exists when all of the following criteria are met:

- The parties have approved the contract (written, oral, or implied by customary business practices)
- Each party's rights regarding the goods or services to be transferred can be identified
- Payment terms for the goods or services to be transferred can be identified
- The contract has commercial substance (i.e., risk, timing, or amount of future cash flows is expected to change as a result)
- It is probable that the entity will collect substantially all of the consideration to which it is entitled

**Combination of Contracts:** Two or more contracts entered into at or near the same time with the same customer (or related parties) must be combined if: (a) they are negotiated as a package, (b) the consideration in one contract depends on the other, or (c) the goods or services promised are a single performance obligation.

**Contract Modifications:** A modification is a change in scope, price, or both. Account for it as (a) a separate contract if the additional goods/services are distinct and at standalone selling price, or (b) a modification to the existing contract otherwise.

---

### Step 2: Identify the Performance Obligations

A **performance obligation** is a promise to transfer to the customer either:

- A distinct good or service (or bundle of goods or services), or
- A series of distinct goods or services that are substantially the same and have the same pattern of transfer

**Distinct Test (two-part):**

1. **Capable of being distinct** — The customer can benefit from the good or service either on its own or together with other readily available resources.
2. **Distinct in the context of the contract** — The promise to transfer the good or service is separately identifiable from other promises in the contract (i.e., not highly interrelated or significantly modified by other items).

**Series Guidance:** A series of distinct goods or services is treated as a single performance obligation if: (a) each distinct good or service in the series would be recognized over time using the same measure of progress, and (b) the entity has a right to consideration from the customer in an amount that corresponds directly with the value transferred.

**Shipping and Handling:** Post-control-transfer shipping is an accounting policy election; it may be treated as a fulfillment cost rather than a separate performance obligation.

---

### Step 3: Determine the Transaction Price

The **transaction price** is the amount of consideration the entity expects to be entitled to in exchange for transferring promised goods or services — excluding amounts collected on behalf of third parties (e.g., sales taxes).

**Variable Consideration:** Estimate using either:
- **Expected value** — Probability-weighted sum of possible amounts (appropriate when a large number of contracts with similar characteristics exist)
- **Most likely amount** — Single most likely outcome (appropriate when only two outcomes are possible, such as a bonus or no bonus)

**Constraint on Variable Consideration:** Include variable consideration in the transaction price only to the extent it is **probable** that a significant revenue reversal will not occur when the uncertainty is subsequently resolved. Relevant factors include:
- Amount of consideration is highly susceptible to factors outside the entity's influence
- The uncertainty is not expected to be resolved for a long period of time
- Experience with similar contracts is limited

**Other Adjustments to Transaction Price:**
- **Significant Financing Component** — Adjust for time value of money if payment timing provides a significant financing benefit (practical expedient: ignore if payment expected within 12 months)
- **Non-cash Consideration** — Measure at fair value at contract inception
- **Consideration Payable to the Customer** — Reduce transaction price (e.g., volume rebates, slotting fees) unless payment is for a distinct good or service

---

### Step 4: Allocate the Transaction Price to Performance Obligations

Allocate the transaction price to each performance obligation in proportion to the **standalone selling prices (SSP)** of the distinct goods or services underlying each obligation.

**Determining SSP:**
1. **Observable price** — Use the price charged when the entity sells the good or service separately (best evidence)
2. **Estimation methods** (when not directly observable):
   - **Adjusted market assessment** — Evaluate the market and estimate the price customers would pay
   - **Expected cost plus margin** — Forecast costs of satisfying the obligation plus appropriate margin
   - **Residual approach** — Only permissible when SSP is highly variable or uncertain; compute as total transaction price minus sum of observable SSPs

**Allocation of Discounts:** A discount is allocated proportionately to all performance obligations unless observable evidence shows the discount relates to only a subset.

**Allocation of Variable Consideration:** Allocate entirely to one performance obligation (or one distinct good/service in a series) only if: (a) the variable payment terms relate specifically to satisfying that obligation, and (b) allocation is consistent with the allocation objective.

---

### Step 5: Recognize Revenue When (or As) Performance Obligations Are Satisfied

An entity satisfies a performance obligation by **transferring control** of the promised good or service to the customer. Control may transfer either **over time** or at a **point in time**.

**Revenue Recognized Over Time** — An obligation is satisfied over time if ANY ONE of the following criteria is met:

1. The customer simultaneously receives and consumes the benefits as the entity performs (e.g., a cleaning service, a SaaS subscription)
2. The entity's performance creates or enhances an asset that the customer controls as it is created (e.g., construction on the customer's land)
3. The entity's performance does not create an asset with an alternative use AND the entity has an enforceable right to payment for performance completed to date

**Measure of Progress (Over-Time Obligations):** Select the method that best depicts transfer of control:
- **Output methods** — Units produced/delivered, contract milestones, surveys of completion
- **Input methods** — Costs incurred, labor hours, time elapsed (straight-line is permissible when benefits are transferred evenly)

**Revenue Recognized at a Point in Time** — When none of the over-time criteria are met, recognize revenue at the point the customer obtains control. Indicators of control transfer:
- Entity has present right to payment
- Customer has legal title
- Entity transferred physical possession
- Customer has the significant risks and rewards of ownership
- Customer has accepted the asset

---

## Revenue Pattern Reference Table

| Pattern | Performance Obligation Structure | Recognition Timing | Key Accounting Traps |
|---------|----------------------------------|-------------------|----------------------|
| **Pure SaaS Subscription** | Single PO (stand-ready obligation) or series of distinct daily/monthly service units | Straight-line over contract term | Upfront setup fees often not a separate PO; must allocate to subscription unless distinct |
| **SaaS + Implementation Services** | Two POs: (1) subscription, (2) implementation — if implementation is distinct | Subscription: over time; Implementation: over time (% complete) or point-in-time | Assess whether implementation is highly interrelated with SaaS; if so, combine into one PO |
| **Usage-Based / Consumption Fees** | Series of distinct service units (monthly usage tranches) | As usage occurs; allocate variable consideration to the distinct period | Minimum commitments create fixed floor; overages are variable — apply constraint |
| **Prepaid Credits** | Credits represent a material right (optional purchase) or advance payment for future services | As credits are consumed; recognize breakage proportionally (redemption ratio) if breakage is probable | Do not recognize unused credits as revenue at expiration without breakage analysis; escheatment laws may apply |
| **Hardware / Appliance** | Separate PO for the device if distinct; may bundle with subscription or support | Point in time upon control transfer (delivery, acceptance) | Installation may be a separate PO if customer could obtain from another vendor; assess distinct test |
| **Marketplace / Platform Fees** | Single PO (access to marketplace + transaction facilitation) or separate POs | As transactions are facilitated (usage pattern) | Principal vs. agent analysis required: gross revenue (principal) vs. net fee (agent) — see below |

---

## Principal vs. Agent Analysis

When an entity arranges for another party to provide goods or services to a customer, it must determine whether it is a **principal** (recognizes gross revenue) or an **agent** (recognizes net commission/fee).

**An entity is a PRINCIPAL if it:**
- Obtains control of the good or service before it is transferred to the customer
- Bears inventory risk before or after the customer order (e.g., holds title, bears risk of loss)
- Has latitude in establishing pricing for the customer
- Bears credit risk for the customer's consideration

**An entity is an AGENT if it:**
- Arranges for another party to provide the goods or services
- Does not take control of the goods or services before transfer
- Earns a commission or fee for facilitating the exchange

**Marketplace Example:** A software marketplace that connects ISV applications to enterprise buyers must analyze: Does it control the ISV license before delivery? Does it bear return risk? Does it set the customer price? Absent control, it is likely an agent — recognize net fees, not gross transaction value.

---

## SPM Program Implications

Revenue recognition timing directly affects sales compensation in the following ways:

1. **Commission Eligible Revenue** — Only ASC 606-compliant recognized revenue should form the commission base; booking value and billed amounts may differ from recognized revenue.
2. **Clawback Triggers** — If recognized revenue is reversed (refund, credit, contract modification), clawback provisions in the comp plan must align with the revenue reversal event.
3. **Multi-Element Deals** — Sales reps closing bundles must understand that total contract value (TCV) ≠ recognized revenue in Period 1; commission timing should reflect PO satisfaction schedule.
4. **Variable Consideration** — Where revenue is contingent (e.g., usage minimums, royalties), commissions on estimated variable amounts may need to be deferred or constrained.
5. **Deal Modifications** — Mid-term upsells/downgrades must be re-evaluated under ASC 606 modification guidance; compensation events should align with the modification accounting treatment.

---

**Framework Code**: SPM-FW-007
**Standard**: FASB ASC 606 / IFRS 15
**Version**: 1.0.0
**Effective**: February 2026
**Owner**: BHG Consulting
**Mandatory For**: All compensation plans with revenue-linked commission bases
`,
  version: '1.0.0',
  status: 'ACTIVE',
  isGlobal: true,
  isMandatory: true,
  applicableTo: ['COMPENSATION_PLAN', 'GOVERNANCE_PLAN', 'POLICY_CREATION_PLAN'],
  createdBy: CREATED_BY,
  createdAt: NOW,
  updatedAt: NOW,
  tier: 'gold-standard' as const,
  dataClass: 'reference' as const,
};

// =============================================================================
// SPM-FW-008: BHG Offering PO Catalog & Contract Analysis
// =============================================================================

export const asc606Framework2: GovernanceFramework = {
  id: 'fw-asc606-008',
  tenantId: DEFAULT_TENANT_ID,
  code: 'SPM-FW-008',
  title: 'ASC 606 Revenue Recognition — BHG Offering PO Catalog & Contract Analysis',
  category: 'COMPLIANCE',
  content: `# ASC 606 Revenue Recognition — BHG Offering PO Catalog & Contract Analysis

## Overview

This framework applies ASC 606 (Five-Step Model — see SPM-FW-007) specifically to the **BHG standard offering bundle**. It defines the Performance Obligation (PO) catalog, recognition models, standalone selling price (SSP) ranges, and the contract analysis checklist required before any new customer agreement is executed.

Accurate PO identification and revenue recognition timing is the foundation upon which all SPM commission calculations are based. Finance, Revenue Operations, and Sales Leadership must align on this catalog before compensation plan parameters are finalized each fiscal year.

---

## 1. BHG Standard Offering Bundle

BHG's customer agreements typically include one or more of the following components. Each component must be evaluated for distinct PO status at contract inception.

| Component | Description | Default Delivery Model |
|-----------|-------------|------------------------|
| **Platform Subscription** | 12-month (or multi-year) access to the BHG SaaS platform | Cloud-hosted, monthly service |
| **AI Credits** | Prepaid credits consumed for AI-assisted actions (analysis, generation, routing) | On-demand consumption |
| **Professional Services — Onboarding** | Structured onboarding and implementation support | Time-bound engagement, 30–90 days |
| **Professional Services — Advisory** | Ongoing strategic advisory or managed services | Monthly retainer or milestone-based |
| **Hardware / Appliance** | Optional edge device (where applicable) | Physical delivery, customer site |
| **Marketplace Fees** | Percentage of third-party transaction volume facilitated through the BHG platform | Usage-based, billed monthly |

---

## 2. Performance Obligation Catalog

Each PO below has been evaluated against the ASC 606 distinct test (capable of being distinct + distinct in context). The recognition model reflects the pattern by which control transfers to the customer.

### PO-1: Platform Subscription

| Attribute | Detail |
|-----------|--------|
| **Distinct?** | Yes — customer can benefit from platform access independent of other components |
| **PO Type** | Stand-ready obligation / series of daily service units |
| **Recognition Model** | **Over time — straight-line** over the subscription term |
| **SSP Basis** | Published list price per seat or tier; adjusted for multi-year discounts |
| **Variable Consideration** | Usage overages above contracted tier recognized as consumed |
| **Commission Timing Implication** | Revenue recognized ratably; commission draws based on bookings must be reconciled to recognized revenue schedule |

### PO-2: AI Credits (Prepaid)

| Attribute | Detail |
|-----------|--------|
| **Distinct?** | Yes — credits can be applied independently of subscription services |
| **PO Type** | Advance payment for future AI services (material right) |
| **Recognition Model** | **Over time — as consumed** (units of output method); breakage recognized proportionally based on historical redemption ratio |
| **SSP Basis** | Per-credit list price; volume tiers may create allocation adjustments |
| **Variable Consideration** | Where credit packages include bonus credits, assess as variable consideration subject to constraint |
| **Commission Timing Implication** | Commission on prepaid credit sales should align with consumption schedule, not upfront booking, unless the comp plan explicitly addresses upfront treatment with clawback provisions |

### PO-3: Professional Services — Onboarding

| Attribute | Detail |
|-----------|--------|
| **Distinct?** | Evaluate case-by-case — if customer could purchase onboarding from another qualified SI, likely distinct; if highly integrated with proprietary platform configuration, may not be distinct from subscription |
| **PO Type** | Time-bound service engagement |
| **Recognition Model** | **Over time — input method (% of hours incurred or milestone completion)** if distinct; combined with subscription PO and recognized over subscription term if not distinct |
| **SSP Basis** | Blended hourly rate for implementation resources; benchmark against time-and-materials market rate |
| **Variable Consideration** | Milestone bonuses or penalty provisions should be evaluated under the constraint; include only when probable no significant reversal |
| **Commission Timing Implication** | If onboarding is a distinct PO recognized over 60 days, commission on that element should be recognized consistent with delivery — not at contract signing |

### PO-4: Professional Services — Advisory / Managed Services

| Attribute | Detail |
|-----------|--------|
| **Distinct?** | Generally yes — advisory is separable and available from third-party providers |
| **PO Type** | Series of distinct monthly service units (stand-ready or output-based) |
| **Recognition Model** | **Over time — straight-line** (retainer) or **output method** (milestone/deliverable-based) |
| **SSP Basis** | Monthly retainer rate or per-deliverable price based on market benchmarks |
| **Variable Consideration** | Success fees and outcome-based bonuses are variable consideration; constrain until probable |
| **Commission Timing Implication** | Retainer revenue is recognized monthly; commissions structured on retainer should match this cadence |

### PO-5: Hardware / Appliance

| Attribute | Detail |
|-----------|--------|
| **Distinct?** | Yes — hardware can be used without BHG software (general-purpose device) and customer can obtain separately |
| **PO Type** | Delivered asset |
| **Recognition Model** | **Point in time — upon control transfer** (delivery + acceptance, or contractual delivery terms such as FOB shipping point / FOB destination) |
| **SSP Basis** | Fair market value of device; manufacturer list price adjusted for negotiated reseller pricing |
| **Variable Consideration** | Installation services may be a separate PO if distinct; exclude from hardware SSP |
| **Commission Timing Implication** | Hardware revenue recognized at delivery; commission on hardware component may be earned at point of control transfer |

### PO-6: Marketplace Fees

| Attribute | Detail |
|-----------|--------|
| **Distinct?** | Yes — marketplace access facilitates third-party transactions independent of subscription use |
| **PO Type** | Usage-based facilitation service |
| **Recognition Model** | **Over time — as transactions occur** (series of distinct daily facilitation units); recognize **net** (agent) unless BHG controls the goods/services before transfer |
| **SSP Basis** | Market rate for comparable marketplace platforms; typically 3–8% of gross merchandise value (GMV) |
| **Variable Consideration** | Fee revenues are inherently variable; allocate entirely to the marketplace PO using the specific-allocation exception (fees relate specifically and consistently to this PO) |
| **Commission Timing Implication** | Marketplace fee revenue recognized as transactions occur; commissions tied to GMV-based fees should reflect the actual transaction recognition schedule |

---

## 3. Transaction Price Allocation Mechanics

### Fixed Consideration

Allocate fixed contract value across all distinct POs in proportion to their **relative standalone selling prices**:

\`\`\`
Allocation to PO-X = (SSP of PO-X / Sum of all SSPs) × Total Transaction Price
\`\`\`

**Example:**

| PO | SSP | Allocation % | Allocated Revenue (on $120,000 deal) |
|----|-----|-------------|--------------------------------------|
| Platform Subscription (12 mo.) | $84,000 | 60.0% | $72,000 |
| AI Credits (prepaid) | $21,000 | 15.0% | $18,000 |
| Onboarding PS | $28,000 | 20.0% | $24,000 |
| Marketplace Access | $7,000 | 5.0% | $6,000 |
| **Total** | **$140,000** | **100%** | **$120,000** |

Note: The $20,000 discount is allocated proportionately across all POs (not assigned to any single component).

### Variable Consideration

Estimate and include variable amounts only to the extent it is **probable** that a significant revenue reversal will not occur:

- **Usage overages**: Recognize in the period consumed; include in transaction price estimate only when pattern is established
- **Success fees**: Apply most-likely-amount method; constrain until performance condition is met and collection is probable
- **Marketplace fees**: Allocate entirely to marketplace PO under specific-allocation exception

### Breakage (AI Credits)

Recognize breakage (unused credits) proportionally as credits are redeemed, using the **redemption ratio** method:

\`\`\`
Breakage Revenue per Period = (Credits Redeemed in Period / Total Expected Redemptions) × Total Breakage Estimate
\`\`\`

Update breakage estimate each reporting period; recognize cumulative catch-up adjustment if estimate changes.

---

## 4. Contract Analysis Checklist

Before executing any new BHG customer agreement, Revenue Operations must complete the following 12-area contract analysis. This checklist supports both ASC 606 compliance and SPM commission plan configuration.

| # | Analysis Area | Key Questions | ASC 606 Reference | SPM Impact |
|---|---------------|---------------|-------------------|------------|
| 1 | **Contract Identification** | Is the agreement legally enforceable? Are all Step 1 criteria met (approval, rights, payment terms, commercial substance, collectibility)? | ASC 606-10-25-1 | No contract = no revenue = no commission basis |
| 2 | **Parties & Scope** | Who are the contracting parties? Are related-party relationships present that require combination of contracts? | ASC 606-10-25-9 | Bundled family/affiliate deals may require consolidated PO analysis |
| 3 | **Term, Renewal & Termination** | What is the enforceable contract term? Are renewal options material rights? Are termination-for-convenience clauses present, and if so, what is the enforceable period? | ASC 606-10-25-3; ASC 606-10-55-42 | Termination clauses shorten enforceable term; subscription revenue recognized only over enforceable period |
| 4 | **Pricing & Payment Terms** | Are payment terms standard (≤12 months)? Is there a significant financing component? Are there variable pricing tiers? | ASC 606-10-32-15 through 32-17 | Non-standard payment terms require time-value adjustment; commission base may differ from billed amounts |
| 5 | **Variable Consideration** | Are there usage minimums, overages, royalties, performance bonuses, penalties, or refund rights? Quantify range of outcomes. | ASC 606-10-32-5 through 32-13 | Variable components constrained in revenue → commission on unconstrained portions may be premature |
| 6 | **Refund Rights & Returns** | Are there satisfaction guarantees, trial periods, or return rights? Estimate expected refunds and adjust transaction price. | ASC 606-10-32-10; ASC 606-10-55-22 | Refund reserves reduce recognized revenue; clawback provisions in comp plan should mirror refund policy |
| 7 | **Customer Acceptance** | Is formal acceptance required before control transfers? Does acceptance affect timing of hardware or PS revenue recognition? | ASC 606-10-25-30 | Acceptance clauses delay revenue recognition; commissions should not be earned before acceptance |
| 8 | **Software License vs. Service** | Is any element a functional IP license (right to use at a point in time) vs. symbolic IP or a service (right to access over time)? | ASC 606-10-55-54 through 55-65 | Functional IP license: point-in-time revenue; SaaS: over-time — critical distinction for booking vs. recognition gap |
| 9 | **Principal vs. Agent** | For any third-party goods or services included, does BHG control before transfer? Assess indicators: inventory risk, pricing latitude, credit risk. | ASC 606-10-55-36 through 55-40 | Principal = gross revenue in commission base; Agent = net fees only — large variance in comp calculation |
| 10 | **Consignment / Inventory** | Is any hardware delivered on consignment? Does the customer have the ability to return before a specified date? | ASC 606-10-55-80 through 55-84 | Consignment revenue not recognized until customer action (sale, consumption, or expiration); commission deferred |
| 11 | **Reseller / Channel Flows** | Is a reseller the contracting party or an intermediary? Who is BHG's customer — the reseller or the end user? | ASC 606-10-25-7 | Defines who the customer is; SSP analysis and principal/agent determination follow from this |
| 12 | **Performance Obligations** | List all distinct POs. Apply two-part distinct test. Identify series obligations. Map each to recognition model and SSP. | ASC 606-10-25-14 through 25-22 | PO mapping drives commission allocation and timing for each deal component |

**Checklist Sign-Off Required By:** Revenue Operations Lead, Finance Controller, Deal Desk (for deals >$250K TCV)

---

## 5. Common Accounting Pitfalls for BHG Deals

### Pitfall 1: Recognizing Setup / Onboarding Fees Upfront

Setup and onboarding fees are frequently not distinct from the ongoing subscription. If the customer cannot obtain a functional benefit from onboarding without the platform (and vice versa), the onboarding fee must be combined with the subscription PO and recognized over the subscription term. Recognizing upfront creates a revenue reversal risk.

### Pitfall 2: Treating All Credits as Immediate Revenue

Prepaid AI credits are an advance payment for future services. Revenue is recognized as credits are consumed, not when collected. Unearned credit balances must be carried as deferred revenue (contract liability). Breakage can only be recognized when it is probable — never upon collection.

### Pitfall 3: Ignoring the Termination-for-Convenience Clause

If either party can terminate without penalty with 30 days' notice, the enforceable contract term may be 30 days — not the stated 12-month term. In this scenario, subscription revenue cannot be recognized on a 12-month straight-line basis; recognition must reflect the shorter enforceable period or a re-assessment each period.

### Pitfall 4: Gross vs. Net on Marketplace Revenue

Reporting marketplace gross transaction volume as BHG revenue (when BHG is an agent) inflates revenue and commission bases. The principal vs. agent analysis must be performed before the deal is booked and before commissions are structured.

### Pitfall 5: Allocating the Entire Discount to One PO

Discounts must be allocated proportionately unless there is observable evidence that the discount relates to a specific subset of POs (e.g., a promotional price reduction on hardware only). Allocating the entire discount to the subscription PO to accelerate its recognition is not permitted.

---

## 6. SPM Commission Plan Configuration Guidance

Based on this PO catalog, comp plan designers should incorporate the following provisions:

1. **Revenue-Based Commission Trigger**: Specify whether commissions are earned on (a) bookings/TCV, (b) recognized revenue per accounting period, or (c) cash collected. Each basis has different timing implications that must align with revenue recognition schedules.

2. **Multi-PO Deal Splitting**: For deals containing multiple distinct POs, commission rates and timing may differ by component. Define explicit rules for how commission is split across subscription, PS, and marketplace elements.

3. **Clawback Alignment**: Clawback provisions must reference the same events that trigger revenue reversal under ASC 606 — specifically: customer refunds, contract modifications that reduce allocated revenue, and uncollectable receivables.

4. **Variable Consideration Deferral**: Where deal economics include constrained variable consideration (usage overages, success fees), defer the commission on those elements until revenue is recognized and the constraint is lifted.

5. **Breakage Policy**: Establish a written policy for whether reps earn commissions on AI credit breakage revenue. If yes, specify timing relative to the proportional breakage recognition schedule.

---

**Framework Code**: SPM-FW-008
**Standard**: FASB ASC 606 / IFRS 15
**Version**: 1.0.0
**Effective**: February 2026
**Owner**: BHG Consulting
**Mandatory For**: All new BHG customer contract reviews; compensation plan design sessions
`,
  version: '1.0.0',
  status: 'ACTIVE',
  isGlobal: true,
  isMandatory: true,
  applicableTo: ['COMPENSATION_PLAN', 'GOVERNANCE_PLAN', 'POLICY_CREATION_PLAN'],
  createdBy: CREATED_BY,
  createdAt: NOW,
  updatedAt: NOW,
  tier: 'gold-standard' as const,
  dataClass: 'reference' as const,
};

// =============================================================================
// Aggregate Exports
// =============================================================================

export const asc606Frameworks: GovernanceFramework[] = [
  asc606Framework1,
  asc606Framework2,
];
