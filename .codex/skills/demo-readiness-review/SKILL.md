---
name: demo-readiness-review
description: Review a demo for external show readiness in demo-first repos. Use when the goal is to judge whether a demo is coherent, polished, credible, and compliant with local demo rules rather than production-ready for real customers.
---

# Demo Readiness Review

Use this skill for demo repos, demo route groups, or sales-demo modules where the right question is:

- is this ready to show
- is this credible in front of a buyer
- does it meet the repo's demo rules

Do not use this skill for true production go-live decisions. Use a production-readiness skill for that.

## What To Review

### 1) Demo Contract Clarity

Check whether the boundary between `real`, `synthetic`, `illustrative`, and `mocked` is honest and legible.

Look for:
- explicit demo badges or labels
- synthetic data disclosures
- illustrative calculator disclaimers
- external dependencies presented as if they are tenant-safe when they are not

### 2) Story And Buyer Flow

Check whether the demo tells a coherent story for a prospect.

Look for:
- clear landing point and next action
- logical route order
- no dead-end workflows
- believable progression from overview to detail

### 3) Route And Interaction Completeness

Check whether the surfaced routes and interactions feel complete enough to show.

Look for:
- nav hrefs resolve
- no obvious half-built pages
- no broken controls
- static flows that still feel plausible
- local state behaving consistently across the demo

### 4) Visual And Content Polish

Check whether the demo looks intentional.

Look for:
- placeholder text, TODO/TBD markers, filler labels
- layout breakage, empty states, repeated cards, awkward spacing
- inconsistent naming, branding, or color usage
- disclaimers that are missing where risk is high

### 5) Demo Architecture Quality

Check whether the demo is portable and cleanly staged for later productization.

Look for:
- explicit swap points for persistence or APIs
- clean separation between demo data and future runtime boundaries
- no unnecessary backend coupling
- synthetic data stored in obvious modules

### 6) Demo Rule Compliance

Evaluate against the repo's own demo rules and verification scripts.

Typical checks:
- demo config exists and matches route shape
- route and marker checks pass
- demo-specific tests pass
- failures are interpreted in demo context, not production context

## Delivery Model

Assume a demo-first repo unless the code clearly says otherwise. For demo repos, optimize for:

- `showability`
- `credibility`
- `portability`

not for:

- multi-tenant production hardening
- real customer data handling
- operational launch readiness

## Severity And Decision

Assign findings as:

- `D0` Demo blocker
- `D1` High credibility risk
- `D2` Medium polish or completeness issue
- `D3` Low-priority cleanup

Decision:

- `SHOW_READY`
- `SHOW_READY_WITH_EXCEPTIONS`
- `NOT_SHOW_READY`

Rules:

- Any unresolved `D0` => `NOT_SHOW_READY`
- Multiple unresolved `D1` items usually => `SHOW_READY_WITH_EXCEPTIONS` at best

## Default Commands

Start with the repo's own demo checks when available. Prefer:

- `rg --files`
- `rg -n "demo.config|TODO|TBD|placeholder|mock|synthetic"`
- `pnpm test`
- `pnpm verify:demo-standard`
- route-specific file review for the named demo

Only use build or full typecheck as supporting evidence when those commands are meaningful for the repo. If they fail outside the demo's ownership boundary, call that out clearly instead of treating it as a demo-local defect.

## Output Template

```md
# AICR Demo Readiness Review: <scope>

## Decision
- Status: SHOW_READY | SHOW_READY_WITH_EXCEPTIONS | NOT_SHOW_READY
- Reviewer confidence: High | Medium | Low

## Findings (Ordered by Severity)
1. [D0|D1|D2|D3] <title>
   Evidence: <file/command/observation>
   Impact: <demo/buyer impact>
   Fix before show: <condition>

## Demo Summary
- Demo Contract Clarity: Pass | Partial | Fail
- Story And Buyer Flow: Pass | Partial | Fail
- Route And Interaction Completeness: Pass | Partial | Fail
- Visual And Content Polish: Pass | Partial | Fail
- Demo Architecture Quality: Pass | Partial | Fail
- Demo Rule Compliance: Pass | Partial | Fail

## Must Fix Before External Demo
1. <must-fix>

## Nice To Fix
1. <follow-up>

## Evidence Log
- <commands run>
- <artifacts reviewed>
```

## Repo-Specific Adjustment

If the repo is clearly a demo factory, do not mark it down for lacking auth, multi-tenancy, or live persistence unless the demo falsely implies those things are real. Judge the artifact against what it claims to be.
