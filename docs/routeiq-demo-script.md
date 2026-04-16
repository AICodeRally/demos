# RouteIQ Demo Script

> 13-minute guided walkthrough for a RevOps demo to a mid-market F&B distributor prospect. Uses the Royal Distributing fiction. Presenter reads the script; audience watches one screen until the tablet moment, when a second tab opens.

**Live URL:** `https://demos.aicoderally.com/routeiq/cockpit`
**Setup:** Have a second browser tab pre-warmed to `https://demos.aicoderally.com/routeiq/tablet` but don't show it yet. Dark mode on (sidebar theme toggle). Browser window sized to ≥1280px wide so the tablet bezel renders cleanly.

---

## 0. The frame (30 sec)

**Starting screen:** `/routeiq/cockpit`

Before you click anything, say:

> "Revenue isn't a number. It's a system. And most companies are flying blind inside it. I'm going to show you how RouteIQ observes every signal in your revenue flow, explains what's breaking, and lets you act — all from one surface."

Point at the headline on the cockpit:

> "Royal Distributing is a fictional multi-state beverage wholesaler headquartered in Kansas City. Everything I'm about to show you is built on the same pattern you'd see on your own book."

Don't click anything yet.

---

## 1. Pulse — Observe (90 sec)

**Still on:** `/routeiq/cockpit`

Gesture at the 6 KPI tiles:

> "Here's the system view. Revenue YTD $184M, up 4.2%. Looks healthy. But the system is flagging four anomalies right now — before anyone asked it to."

Scroll to the Pulse strip. Read the four flag headlines out loud:

> "Forecast accuracy dropped 21 points this quarter. Discounting climbed 6% in the last two weeks. Mid-market deals over $50K are slipping at 2.3× normal. And 64% of revenue is concentrated in the top 20% of reps — up from 52% a year ago."

Pause. Let it sit.

> "Four different failure points. Four different dashboards, normally. Here they show up on one page, with severity coloring — red is urgent, amber is warning, blue is info. This is what I mean by Observe. The system never sleeps."

---

## 2. Deal execution — fast walk (60 sec)

Click **Deal Execution** in the sidebar (or `/routeiq/deals`).

> "Revenue doesn't miss because of effort. It misses because of execution breakdowns. Segment-level win rates and slippage here — notice the mid-market $50-100K band with a 32% slip rate. That's the Pulse flag, but now with shape."

Scroll to the Regional Anomalies cards.

> "Here's the story OpsChief tells: the slippage looks like a West region problem, but 72% of it sits with two KS reps. One is a rep-level intervention, not a regional process overhaul. **This is the moment you stop chasing ghosts.**"

---

## 3. Margin leak — fast walk (60 sec)

Click **Pricing & Margin** (`/routeiq/margin`).

> "You're not losing revenue. You're leaking margin quietly."

Point at the price waterfall.

> "List $100, net $88.80, gross margin $21.70. The leak isn't in invoice discounts — it's in promotional allowances. 5.8 points of the 11.2 point compression. That's the part no one audits."

Scroll to the 7 routes below the 18% floor.

> "Seven routes under the margin floor. Each with a different reason. The Heartland Beverage display push in KC is eating into two of them. AskForge will tell us what a 3% cap on promo allowances does to margin — let me show you that in a second on the comp page."

---

## 4. Compensation — THE WEDGE (3 min)

Click **Comp & Behavior** (`/routeiq/comp`). Slow down here. This is the money.

> "Now the hard one. You're not incentivizing behavior. You're funding randomness."

Point at the attainment distribution chart.

> "Sixty reps. Twenty two of them are below 75% attainment. Only eight are at or above the accelerator trigger. The accelerator is mechanically unreachable for 87% of the field."

Pause.

> "The plan costs Royal 1.3 points of comp-to-revenue over last year, and motivates exactly 8 people. The other 52 see the accelerator as theater. That's what Q calls 'funding randomness.'"

Click **Payout Calculator** card → `/routeiq/comp/calculator`.

> "Watch this. Here's Marcus Reyes — KC-01, 84% attainment. Pick him in the dropdown."

Select Marcus.

> "Current plan: his payout is $14,250 at 5% base rate. Now drag the accelerator trigger from 100% down to 85%."

**Drag the slider.** Let the numbers re-render live.

> "Marcus's payout jumps. Why? Because the new trigger catches him. More importantly, watch the team-wide delta at the bottom — with a 6-person team, the payout change is $X. With 60 reps, that's roughly ten times larger."

Click **13-Week Story** in the sidebar → `/routeiq/comp/story`.

> "And here's why the trigger matters. This is one rep across a quarter. Week 5, a spirits kicker activates because Marcus is on pace. That's the single biggest lever of his whole quarter."

Point at the week-5 highlighted bar.

> "Without the week-5 unlock, his quarter ends at $13,700. With it, $19,055. The difference between staying at Royal and leaving. The plan decides — every week, for every rep — whether they stay or go. That's why comp is the killer wedge."

---

## 5. Forecast — fast (45 sec)

Click **Forecast & Risk** (`/routeiq/forecast`).

> "Forecasts don't fail randomly. They fail systematically."

Point at the 5-quarter accuracy chart.

> "Four straight quarters at 82%, then this quarter at 61%. But when OpsChief looks at it, it's not every rep — four reps consistently overcommit by 15% or more. Weight-adjust just those four and commit accuracy comes back to 79% immediately. The rest of the field is forecasting inside 3 points."

---

## 6. Action + Tablet — THE KILLER MOMENT (3 min)

This is the setup. Click **Execution Layer** (`/routeiq/action`).

> "Most RevOps stacks stop at insight. Here's the loop."

Point at the Live Action Feed.

> "These are actions Royal's managers are taking right now. Coaching pushes, pricing guardrail approvals, priority changes. Watch what happens when one actually ships."

Click the **"Open Field Tablet in new tab"** link in the amber banner.

> "I just opened the rep's tablet in a second tab. Marcus Reyes is on an 8-stop Kansas City delivery route right now. Here's his ROUTEIQ view — map, stops, commission panel."

**Switch back to tab A.** Find the first row in the Live Action Feed — the Marcus Reyes coaching row ("Stop 2 Midwest Tap House: lead with Cinco tasting event, push Patron from 3 → 6 cases").

> "Now, I as his manager, from this cockpit, push this coaching directly to his tablet. Watch tab B."

**Click "Push to Tablet".** The button flashes green "Pushed."

**Switch to tab B immediately.** The ManagerToast in the corner of the tablet will pop with the coaching message.

> "The rep just got it. In real time. No backend, no sync lag, no 'check your inbox' — the browser broadcast is instant. When Marcus walks into the Midwest Tap House in 20 minutes, he already has the play."

Pause. Let that sit. This is the biggest moment of the demo.

> "Insight without action is expensive reporting. This is the loop closed."

---

## 7. System view — close (90 sec)

Click **System View** in the tablet's "Back to RouteIQ Cockpit" pill (top-left of the tablet frame). Then click **System View** in the sidebar (`/routeiq/system`).

> "Three layers. Pulse observes — 847 signals a day, it never stops. OpsChief explains — 91% diagnostic accuracy, it turns anomalies into stories with evidence. AskForge acts — natural language in, action pushed out."

Point at each of the three layer cards as you name them.

> "Observe. Decide. Act. Every failure point in the revenue flow sits one click away from every other one. This isn't RevOps reporting. It's a revenue operating system."

Final scroll to the "Don't organize by tools" callout at the bottom.

> "The old way organized RevOps by tools: CRM, comp, pricing, forecasting. Each one owns a dashboard, and the dashboards never talk. RouteIQ organizes by **failure points in revenue flow**: demand fails, deals fail, margin leaks, capacity breaks, incentives misfire, forecasts lie, nobody acts. That's the spine of the demo you just watched. Every failure point gets Pulse, OpsChief, and AskForge."

---

## 8. Close / Q&A (1 min)

> "So — which of those failure points looks most familiar at your shop?"

Let them answer. That's where the sales conversation starts.

---

## Timing cheat sheet

| Section | Time |
|---|---|
| 0. Frame | 0:30 |
| 1. Pulse | 1:30 |
| 2. Deals | 1:00 |
| 3. Margin | 1:00 |
| 4. Comp (wedge) | 3:00 |
| 5. Forecast | 0:45 |
| 6. Action + Tablet | 3:00 |
| 7. System | 1:30 |
| 8. Close | 1:00 |
| **Total** | **~13 min** |

---

## Short version (6 min)

If you only have 6 minutes, skip sections 2, 3, 5 entirely. The essential path is: Frame → Cockpit Pulse → Comp (with calculator slider) → Action+Tablet push → System close. Comp and Action+Tablet are non-negotiable — they're the wedge and the loop.

---

## Known demo gotchas

1. **Tablet back button** is top-left of the tablet frame, not in the sidebar (the tablet renders chromeless via a route group). Click **"Back to RouteIQ Cockpit"** to return.
2. **BroadcastChannel** is per-origin and per-browser. If you open tab A on localhost and tab B on the production URL, the push won't land. Keep both tabs on the same origin.
3. **Mobile browsers** mostly support BroadcastChannel but some iOS Safari versions don't — demo on desktop Safari or Chrome.
4. **Refreshing the tablet tab** after a push will lose the toast (it's ephemeral state, not persisted). Push a fresh one if the audience missed it.
5. **Dark mode** is the default. If the audience prefers light, toggle via the sun/moon button in the sidebar (on spine pages) or in the RouteIQ header (on tablet).

---

## One-line pitch

> "RouteIQ is a revenue operating system that organizes by failure points, not tools — Pulse observes, OpsChief explains, AskForge acts, and the loop closes on the rep's tablet in real time."
