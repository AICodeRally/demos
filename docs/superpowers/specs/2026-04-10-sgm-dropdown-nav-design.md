# SGM Dropdown Navigation — Design Spec

**Date:** 2026-04-10
**Scope:** `prizym-governance` demo only
**Goal:** Reclaim ~60px of vertical screen space by replacing the always-visible module row with a click-to-open dropdown strip below the topbar.

## Context

The current `PrizymShell` has two rows of chrome at rest:

1. Topbar (~76px) — logo, 5 section buttons (Documents, Tools, Compliance, Workflows, AI), `INTERACTIVE DEMO` badge.
2. Module row (~60px) — pinned directly under the topbar, showing the modules of whichever section is currently selected.

Total chrome at rest: **~136px**. Todd presents this demo on projected screens and wants more room for the content pane. Brainstorming picked Option A (dropdown mega-menu) from a field of 4 nav-compression options.

## Target behavior

At rest the shell shows topbar only. Clicking a section button toggles a dropdown strip below the topbar that contains that section's modules. The strip closes on:

- clicking a module (after navigation fires),
- clicking outside the topbar or dropdown,
- pressing ESC,
- clicking the same section again (toggle off).

Switching sections while a dropdown is open transitions to the new section's modules without closing and re-opening.

The "currently navigated" section — derived from the URL — stays visually highlighted in the topbar regardless of which section (if any) is open in the dropdown. The highlight is driven by `pathname`; the open state is driven by user click. These are two independent concerns.

On first page load no dropdown is open. The URL section is highlighted but not expanded.

## Visual

The dropdown strip re-uses the existing `.pg-bshell-modules` styling — backdrop blur, centered flex pills, 12px padding. Only the positioning and visibility model changes: it becomes `position: absolute` pinned directly below the topbar (top: 76px, full width), with a slide-down + fade animation (~120ms). Content below the topbar is not pushed down; the dropdown overlays the content pane on its top edge. Z-index sits above content but below any modal/overlay (~35).

## Code changes

**`components/demos/prizym-governance/PrizymShell.tsx`**

- Add `openSection: string | null` state initialised to `null`.
- Add click handler that toggles: `setOpenSection(prev => prev === sec.section ? null : sec.section)`.
- Add `useEffect` to attach ESC keydown listener and a document `pointerdown` outside-click listener. Both call `setOpenSection(null)`. Clean up on unmount.
- Refs: `topbarRef` for outside-click detection so clicks *inside* topbar or dropdown don't close.
- Replace the existing always-on `<div className="pg-bshell-modules">…</div>` block with a conditional `openSection && <div className="pg-bshell-dropdown">…</div>`. Rendered modules come from `NAV_SECTIONS.find(s => s.section === openSection)`, not from `selected`.
- Section-button highlight still comes from `urlSection` (the memoised pathname derivation), not from `openSection`.
- Clicking a module Link calls `setOpenSection(null)` via an `onClick` on the `<Link>`.
- `selected` state and the `setSelected` calls can be removed — `urlSection` alone drives the highlight now.

**`styles/ext/prizym-governance.css`**

- Remove `.pg-bshell-modules` from the flex column flow (no longer a flex-none row).
- Add `.pg-bshell-dropdown` with: `position: absolute; top: 76px; left: 0; right: 0; z-index: 35;` plus the same visual rules (backdrop blur, border-bottom, centered inner container, padding, gap).
- Add keyframe `pg-dropdown-in` for slide-down+fade (translateY(-8px) → 0, opacity 0 → 1 over 120ms).
- `.pg-bshell` layout stays flex column, but the content pane is now flush against the topbar — the dropdown overlays its top edge when open.
- `@media (max-width: 900px)` block: update `.pg-bshell-dropdown` top offset since the topbar grows to ~120px when section buttons wrap to their own row.

**No changes** to: `demo.config.ts`, page components, `AskSGMPanel`, footer.

## Testing (manual)

1. Open `/prizym-governance`. Only topbar is visible. No dropdown. Content pane sits directly under topbar.
2. Click **Documents** → dropdown drops down with Comp Plans / Policies / Procedures / Controls / Templates. Click a module → navigates + dropdown closes.
3. Click **Tools** → dropdown shows Tools modules. Click **Compliance** while open → dropdown transitions to Compliance modules (no close/reopen flash).
4. Click **Documents** twice → dropdown toggles closed on second click.
5. Open any dropdown → press ESC → closes.
6. Open any dropdown → click anywhere in the content pane → closes.
7. Navigate directly to `/prizym-governance/compliance/obligations`. Topbar highlights **Compliance**. Dropdown is closed. Click **Workflows** → dropdown opens for Workflows but **Compliance** stays highlighted (URL-driven, not open-driven).
8. Mobile/narrow (<900px): section buttons wrap under logo, dropdown still opens at the right offset, pills wrap to multiple lines if needed.

## Out of scope

- No keyboard arrow navigation between sections.
- No hover preview (click-only per Todd).
- No persistence of open state across navigation.
- No changes to the charter/cockpit or any other demo — PrizymShell is prizym-governance only.
