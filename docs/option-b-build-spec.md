# Option B — Build Spec: Ambitious Dashboard Frontend

> Source: Notion — [Build Ambitious dashboard frontend (Option B) in Claude Code](https://www.notion.so/1b4ad4e5915b4e7b8313e94eb7428c15)

**This is a storytelling demo tool, not a self-serve product.** The MVP is designed for David to present live — at conferences, in 1:1 funder meetings, in TED-talk-style demos. David drives, not the audience. Every design choice serves narrative impact and comprehension at a distance.

**Implication:** Cinematic animations, dark mode, guided narrative flow, and scroll-triggered reveals are all correct choices here. Comparison mode, persona toggles, and domain mini-dashboards are cut — David narrates those live.

---

## 🔑 MVP Learnings (March 14, 2026)

**Claude Code is extremely fast** — the MVP was built very quickly, which is itself a key learning. The tool can handle ambitious scope.

### Critical insight: Summary-level dots are misleading

The MVP scatter plot plotted one dot per ToC using the weakest-link rollup for Investment Level. **This hides the most important story.** A ToC like AI Tutoring shows up as "Minimal/None" — but that masks the reality that Step 1 (build AI tutors) has **Heavy** investment while Step 4 (longitudinal evidence) has **Minimal/None**.

The interesting finding isn't "this whole chain is underinvested." It's: **"We're spending billions on the early steps but nothing on the step that would make it transformational."** That contrast *within* a chain is invisible in summary view.

### Decision: Chain-level (claim-level) dots as default view

- Each **claim/step** is a dot on the scatter plot, not each ToC
- Steps within the same chain are **visually linked** (lines/arcs) so you can trace a chain across the plot
- The **gap within a chain becomes the visual story** — invested early steps sit in one region, underinvested late steps sit in another, and the distance between them IS the gap
- Summary-level view available as a **toggle** for the "42 ToCs at a glance" use case, but chain-level is the default

### The storytelling detail view is the killer feature

Click a chain → see the step-by-step with investment contrast at each node. This is what makes someone say "oh, I see the problem" in under 60 seconds.

---

## Context & Constraints

**Tech stack:** Claude Code → Next.js + React + Tailwind CSS + D3.js (or Visx/Nivo for React-friendly D3) + Framer Motion for animations

**Data source:** Two-level static JSON export from Notion. No backend needed — just a static site. Update by re-exporting.

**Level 1 — ToC Summary fields (42 ToCs):**
- Theory of Change name
- Domain (Healthcare, Education, Climate/Energy, Scientific Research, Labor/Employment, Cross-Domain)
- Type (Benefit, Harm, Mitigation)
- Impact Scale (Transformational, Large, Moderate, Small)
- Weakest Evidence Level (Strong, Moderate, Speculative, None)
- Investment Level — rolled-up weakest link (Heavy, Moderate, Light, Minimal/None, Unknown)
- Investment Case (text — one-liner)
- Primary Gap Type (8 options from Needs Evidence → Not a Gap)
- Investable Insight (text — what a funder should do)
- Chain Narrative (text — full causal chain description)
- Key Confounders (text)

**Level 2 — Claim/Step fields (per step in each chain):**
- Claim name
- Step number (position in chain)
- Parent ToC reference
- Investment Level (per-step, not rolled up)
- Impact Scale (per-step, or inherited)
- Evidence Level (per-step)
- Value if we stop here (what impact is delivered if the chain ends at this step)
- Gap Type (per-step)

> **Data implication:** The JSON export must be **claim-level, not just ToC-level.** The "Value if we stop here" property is critical — it lets each dot have its own impact assessment rather than inheriting the full-chain rollup.

---

## Core Question the Dashboard Must Answer

> **Where are the biggest mismatches between AI's potential impact and current investment — and what should someone do about it?**

The insight lives in the *contrast*: high impact + low investment = opportunity. Low impact + high investment = hype. The UI must make these contrasts instantly visible.

---

## Option B — Ambitious Dashboard

**Philosophy:** Visually striking, interactive, tell-a-story. This is what you'd show at a conference or in a TED talk. Should make people say "I want to explore this." Claude Code can handle this — it's still a static site, just with more sophisticated visualization.

**Tech:** Next.js + Tailwind + D3.js (or Visx/Nivo for React-friendly D3) + Framer Motion for animations

### Layout

**1. Narrative landing — "The AI Investment Gap"**
- Full-width hero with an animated statement: *"$300B+ flows into AI annually. Almost none of it is directed at ensuring AI creates good."*
- Scrolls into the first visualization
- Sets emotional context before data

**2. Interactive chain-level scatter plot — The Gap Map (hero visualization)**
- **Each dot is a claim/step, not a ToC** — this is the critical difference from MVP
- X-axis: Investment Level (Minimal/None → Heavy)
- Y-axis: Impact Scale (Moderate → Transformational)
- Dot color: Domain
- Dot border: Type (Benefit/Harm/Mitigation)
- Dot size: Evidence strength
- **Chain links:** Steps within the same ToC are connected by lines/arcs, so you can visually trace a chain across the plot
- **The gap is visible:** Early invested steps cluster mid-right, underinvested late steps cluster top-left. The *distance between connected dots* is the story.
- Animated transitions when filtering
- Click a dot → highlights its entire chain + opens detail panel
- Click a chain link → opens the storytelling view for that ToC
- Cluster mode: toggle between scatter (continuous axes) and clustered (grouped by domain or gap type) with animated transitions
- **Summary toggle:** Switch to one-dot-per-ToC view (rolled-up weakest link) for the 42 ToCs at a glance
- Optional: "guided tour" mode that auto-narrates through 3–4 key findings (like Scrollytelling), walking through one chain at a time to show the contrast

**3. Sankey flow diagram — "Where Money Goes vs. Where Impact Lives"**
- Left side: investment levels (Heavy → Minimal/None) with width proportional to number of ToCs
- Right side: impact scales (Transformational → Moderate)
- Flows show how investment maps to impact
- The visual gut-punch: a massive flow from "Heavy investment" to "Moderate impact" and a tiny trickle from "Minimal investment" to "Transformational impact"
- This is the single most compelling visualization for the thesis

**4. Domain deep-dive panels**
- Horizontal scroll or tab-based
- Each domain gets a mini dashboard: its own scatter plot, top 3 opportunities, key stats
- Clicking a domain zooms into it with animated transitions

**5. ToC detail view — full storytelling (KILLER FEATURE)**

> ⭐ This is the most important view. It's what makes someone say "oh, I see the problem" in under 60 seconds. Prioritize this over polish on the scatter plot.

When a user clicks into a specific ToC:
- **Animated causal chain visualization** — step 1 → step 2 → step 3, with at each node:
  - Investment Level badge (color-coded: heavy = dark filled, minimal = red outline)
  - Evidence Level badge
  - Impact delivered at this step ("Value if we stop here")
- **The contrast is the story:** Early steps show heavy investment + large impact. Later steps show minimal investment + transformational impact. The visual makes the gap *obvious* without explanation.
- **Investment flow overlay:** Shows where money IS going (thick green lines on early steps) vs. where it ISN'T (thin red dashed lines on later steps)
- If DAG exists: interactive DAG diagram
- Investable insight prominently displayed as a CTA card
- Confounders shown as "risk factors" with severity indicators (chain-negating confounders highlighted in red)
- **"What a funder should do"** as a clear, prominent CTA
- **Key stat:** "$X invested in Steps 1–2. $Y invested in Steps 3–4." — makes the mismatch concrete

**6. Comparison mode**
- Drag two ToCs side by side to compare
- Useful for funders choosing between opportunities

**7. Persona lens toggle**
- More sophisticated than MVP: each persona gets a slightly different default view, sorting, and highlighted metrics
- Philanthropist lens: sorts by impact gap (underinvested + high impact)
- Investor lens: sorts by market readiness (strong evidence + needs capital)
- Policy lens: highlights harms alongside benefits, surfaces regulatory levers
- Subtle UI shift (accent color, header text) to reinforce which lens is active

### Design Principles (Ambitious — Demo-First)

- Dark mode base with vibrant accent colors per domain (optimized for projectors and large screens)
- Cinematic animations on the storytelling path: chain reveals (600-800ms staggered), Sankey flow animation, scroll-triggered narrative. Restrained on data views.
- Storytelling-first: guided tour is the **default entry point**. Auto-narrate 3-4 key findings. Free exploration is the exit, not the entry.
- Optimized for laptop, projector, tablet. Mobile is nice-to-have, not a priority.
- Consistent dot size (~10-12px) — don't encode a third variable. Color + position + chain links are enough when you're narrating.
- Typography: Space Grotesk (or similar bold display font) for hero text and headers, Inter/system sans-serif for labels and body
- No parallax on data views (fine on landing/hero). No decorative micro-interactions. No scroll-jacking.

### MVP Scope — What to Nail vs. Cut

**NAIL THESE:**
1. Narrative landing with hero statement
2. Scatter plot with chain links + animated chain reveal
3. Sankey "gut punch" visualization
4. One complete ToC detail view (AI Tutoring) as storytelling showcase
5. Guided tour through 3-4 findings

**CUT FROM MVP:**
- Comparison mode (drag two ToCs side by side) — narrate this live
- Persona lens toggle — frame for whoever's in the room
- Domain deep-dive mini-dashboards — show one if any
- Summary-level toggle — chain-level is the default and the story

### Claude Code Setup

- Install `frontend-design` skill (official, S-tier for frontend work)
- Set up Playwright MCP for visual feedback loop (Claude sees screenshots, fixes issues autonomously)
- Add the CLAUDE.md design section (see subpage) to project root

---

## Shared Requirements

- **Data strategy:** Static JSON export from Notion (Option 1). Simple, no dependencies. Can upgrade to Notion API at build time (Option 3) later.
- **Shareable** — deployable to Vercel in one click from Claude Code
- **Data export** — CSV download button for the filtered view
- **Responsive** — works on laptop, projector, tablet. Phone is nice-to-have.
- **Accessible** — color-blind-friendly palette, sufficient contrast ratios
- **Fast** — sub-2-second load time. No heavy frameworks beyond what's needed.

---

## Color Taxonomy

**Domains:**
- Healthcare: 🔵 Blue
- Education: 🟢 Green
- Climate/Energy: 🟠 Orange
- Scientific Research: 🟣 Purple
- Labor/Employment: 🟡 Yellow/Gold
- Cross-Domain: ⚪ Gray/Silver

**Investment Level:**
- Heavy: Dark filled
- Moderate: Medium filled
- Light: Light filled
- Minimal/None: Outline only (or red accent — "danger, underinvested")

**Type:**
- Benefit: Green tint
- Harm: Red tint
- Mitigation: Blue tint
