# Working Context for AI Assistant — AI Impact Gap Map

> Source: Notion — [Working Context for AI Assistant for AI Impact Gap Map](https://www.notion.so/fbe7461817254a17aa6f6fa2dbffaffc)

This page tells the AI assistant what it needs to know to work on improvements to the AI Impact Gap Map **without having to research from scratch each time**. Keep this updated as priorities shift.

---

## 🎯 Current Priority (as of March 9, 2026)

**Presentations are out to stakeholders (Shira/Tim, Ram/Arsh). Waiting for feedback.**

### Dashboard Build — Demo-First MVP (March 14, 2026)

David is building the v2 dashboard frontend in Claude Code. **This is a storytelling demo tool, not a self-serve product.** The MVP is designed to be shown at conferences, in 1:1 funder meetings, and in TED-talk-style presentations — David drives the demo, not the audience.

**Key design decisions:**
- Dark mode base with vibrant domain accent colors (optimized for projectors and large screens)
- Guided tour as default entry point — auto-narrates 3-4 key findings before free exploration
- Cinematic chain-reveal animations (600-800ms) are intentional — they're storytelling reveals, not decorative
- Dot size is consistent (no third visual encoding) — color + position + chain links are enough when you're narrating

**MVP must nail:** Narrative landing, scatter plot with chain links + animated reveal, Sankey "gut punch" visualization, one complete ToC detail view (AI Tutoring), guided tour.

**Cut from MVP:** Comparison mode (narrate live), persona lens toggle (frame for the room), domain mini-dashboards, summary-level toggle.

### Vision Reframe (March 14, 2026)

David clarified the core purpose of the dashboard. It exists to answer two questions: **(1) How will AI impact what I care about?** and **(2) What can I do to make that impact more good than bad?** The MVP answers these at the systemic level for funders/builders. The long-term vision is a personalized tool where anyone can explore AI's impact on what they care about and take actionable steps. The theory of change structure is the storytelling device — it compiles possible futures with likelihoods and connects them to actions. This doesn't change the MVP data model or current priorities.

**While waiting for feedback, strengthen the underlying data:**

### Primary Task

**Re-run skeptical review + build DAGs on all 42 ToCs.** Single consolidated pass per ToC: full skeptical review (Checks 0–5) + Causal DAG (new Check 6) + populate "Value if we stop here" on each Claim.

### Completed Setup
- ✅ "Value if we stop here" select property added to Claims database (March 9, 2026)
- ✅ Check 6 (Build Causal DAG) added to Skeptical Review Protocol
- ✅ DAG creation merged into review task (no separate DAG pass needed)

All three tasks are prioritized in the same batches:
- **Batch 1:** ToCs in presentations (AI Tutoring, Emissions Monitoring, Materials Discovery, AI Integrity Tools, Global Health)
- **Batch 2:** High-value ToCs (remaining "In progress-promising" + Transformational harms + Net Impact Accounting)
- **Batch 3:** Everything else

### Skeptical Review Status (as of March 9, 2026)

**All 42 ToCs have completed initial review. Re-run planned.**
- **Done:** 29 ToCs ✅
- **Done-very promising:** 3 ToCs ✅ (Materials Discovery, Emissions Monitoring, AI Tutoring)
- **In progress - promising:** 10 ToCs (status stale — all completed protocol checks)
- **Not started:** 0 ToCs ✅

⚠️ **Status cleanup needed:** The 10 "In progress - promising" ToCs have all completed the full 5-check protocol + retroactive 4a/4b review. Status will be cleaned up during the re-run.

---

## ✅ What's Been Completed (March 7, 2026)

### Net Impact Accounting ToC — SKEPTICAL REVIEW COMPLETE
- Full 5-check protocol applied — the last "Not started" ToC
- **Three new chain-negating confounders identified:**
  1. Counterfactual impossibility — calculating "net" requires modeling what the grid would look like without AI, which is methodologically intractable
  2. Scope boundary problem — isolating AI-specific energy demand from non-AI compute in mixed workloads is unsolved (IEA confirms)
  3. Moving target — 280-fold inference cost reduction since Nov 2022 means any framework is outdated within months
- **Check 3a (adjacent investment):** Demand-side AI carbon measurement is far more active than originally claimed — ~$50–100M+ across IEA, Climate TRACE ($30M+), Green Software Foundation SCI for AI standard (Dec 2025), ITU/UNESCO/ISO coordination (Feb 2026). But net-impact *synthesis* remains genuinely unfunded.
- **Investable Insight rewritten** with explicit Phase 1/Phase 2 sequencing:
  - **Phase 1 (~$2–5M, 1–2 years):** Fund foundational methodology — counterfactual modeling framework + workload isolation protocol. Uses publicly available data; no corporate cooperation needed.
  - **Phase 2 (builds on Phase 1):** Fund the net-impact dashboard. Requires mandatory disclosure regulations or independent estimation methods. EU CBAM identified as most promising regulatory lever.

---

## ✅ What's Been Completed (March 6, 2026)

### Investment Opportunity Callouts — Added to All 14 ToC Pages
Added 💰 green callout boxes to the top of all 14 "promising" ToC pages. Each callout summarizes the investment thesis, dollar range, novelty, and investment type.

### Materials Discovery — Prior Art Research & Reframing
- **Finding:** Not a hidden gem — $1.5B+ already targeting this (Lila $550M, Periodic $300M, ARPA-E $100M+, DOE $320M). Bottleneck is real but market sees it too.
- **Reframed** from "Investment Opportunity" → "Framework Validation" across ToC page, Presentation, and Concept Overview.
- **Added Check 3a** to Skeptical Review Protocol — catches missed adjacent commercial investment with different framing.

### AI Tutoring — Prior Art Research & Presentation Update
- Mapped 8 initiatives (OpenAI/Stanford SCALE, Digital Promise, Accelerate, J-PAL, Spencer, Renaissance/Walton, NSF, U.S. Dept. of Ed)
- **Finding:** The gap is widely recognized but the specific proposal (independent, cross-platform longitudinal tracking) remains unfunded. Closest match: OpenAI's Learning Outcomes Measurement Suite (March 4, 2026) — but vendor-specific and only covers ChatGPT.

---

## ✅ What's Been Completed (March 5–6, 2026)

### Concept Overview & Presentation Deck — CREATED
- Concise concept doc for showing Shira, Tim, and Ram
- Slide-formatted version for Notion presentation mode (14 slides)
- Key framing decisions: core question is trajectory not just investment; actions go beyond philanthropy; empowerment over despair as motivating hook; "resources" = money, talent, political effort, attention

### Prioritized Investment Opportunities Page — CREATED
14 opportunities across 3 tiers, organized by three structural patterns:
1. **"Billions Building, Nothing Validating"** — massive upstream tech investment, minimal validation of downstream value (AI Tutoring, Diagnostics, Drug Discovery, Admin Automation, Materials Discovery)
2. **"Data Exists, Pipeline Doesn't"** — working technology but zero institutional infrastructure to convert data into action (Emissions Monitoring, AI Integrity Tools)
3. **"Harm Measurement"** — harms accumulating unmeasured (AI Fabrication, Job Displacement, Metric Gaming, Net Impact Accounting)

### Net Impact Accounting ToC — CREATED
- Cross-cutting Mitigation chain that emerged from viewing Grid Optimization (benefit) and Data Center Growth (harm) side by side — both share the same measurement gap
- Typed as Climate/Energy, Mitigation, Impact Scale: Large, Investment Level: Minimal/None

---

## ✅ What's Been Completed (Skeptical Review Session — March 2, 2026)

### Skeptical Review Protocol — CREATED
A repeatable 5-check process for stress-testing AI-generated ToCs. Identified three systematic failure modes:
1. **All-or-nothing chain construction** — chains built as if every step must succeed for any value. Hides the fact that shorter sub-chains often deliver Large impact.
2. **"Fund a study" as default investable insight** — proposed studies often don't address the actual confounders.
3. **Missing or incomplete confounders** — plausible-sounding confounders listed but chain-negating ones missed.

### All 11 "Promising" ToCs — SKEPTICAL REVIEW COMPLETE
Key findings:
1. **AI Integrity Tools** — Preprint bypass negates journal-focused screening; arms race already lost for text fabrication.
2. **AI Tutoring** — Product-vs-evidence investment gap is the starkest in the map. Billions building, almost nothing validating long-term.
3. **Drug Discovery** — AI accelerates the cheapest part (~15% of cost). Chain breaks at access/incentives.
4. **Accelerated Discovery** — Steps 1–2 heavily funded and working. Step 3 (translation) lightly funded and AI doesn't change it.
5. **AI Translation** — Step 1 delivers inequitable impact (helps those who already have access).
6. **Assessment Redesign** — AI evolves faster than assessments can adapt → treadmill, not solution.
7. **AI Access** — 260M out-of-school children face non-educational barriers AI doesn't address.
8. **Global Health** — LMIC version of Diagnostics chain; inherits all structural problems, amplifies in harder settings.
9. **AI Operations** — IT revolution already ran this experiment. Weakest of the 11 promising ToCs.

---

## 📋 Remaining Tasks (in order)

1–9. ~~[Completed]~~ ✅
10. **Re-run skeptical review + build DAGs on all 42 ToCs.** Single consolidated pass per ToC: full review (Checks 0–5) + Causal DAG (Check 6) + populate "Value if we stop here". Batched by presentation priority.
11. **Update the Review page** with revised tier assignments based on completed reviews
12. **Validate** — open Investment Opportunity Map view and check: does it surface a finding worth sharing with Elie Hassenfeld?
13. **Phase 5 Cleanup** — review views, update descriptions, update Product Brief

---

## 📊 Data State Summary

### 42 ToC Summary Pages — Current Property Status

**Gap Type distribution (after Mixed migration):**
- Needs Evidence + Time: 11 ToCs
- Needs Evidence + Capital + Time: 8 ToCs
- Needs Capital + Time: 6 ToCs
- Needs Evidence: 5 ToCs
- Needs Capital: 1 ToC
- Not a Gap: 1 ToC

**Investment Level distribution:**
- Minimal/None: 27 ToCs
- Light: 3 ToCs (AI Assessment, AI Automation → Job Displacement, Data Center Growth)
- Unknown: 3 ToCs (Algorithmic Bias, Bias Audit Requirement, Mental Health AI)
- Moderate: 0
- Heavy: 0

**Investment Case:** Populated for all 33 ToCs ✅

### Data Quality by Domain
- **Healthcare:** Most developed (~7 benefit ToCs, ~34 claims). AI-generated, partially human-reviewed.
- **Education:** Moderate depth (~9 ToCs, ~41 claims). AI-generated, not yet human-reviewed.
- **Climate/Energy:** Moderate depth (~5 ToCs, ~23 claims). AI-generated, not yet human-reviewed.
- **Labor/Employment:** Moderate depth (~5 ToCs, ~22 claims). AI-generated, not yet human-reviewed.
- **Scientific Research:** Moderate depth (~5 ToCs, ~24 claims). AI-generated, not yet human-reviewed.
- **Cross-Domain:** 8 ToCs, 24 claims. Covers: Nonprofit Operations, Translation/Language Access, Evidence Synthesis, Monitoring/Accountability, Capacity Building (benefits); Institutional Deskilling, Metric Gaming (harms); AI Literacy (mitigation).

### Known data gaps
- Many claims lack source URLs
- Claim pages need summaries/detailed content
- 3 ToCs have "Unknown" Investment Level (need claim-level data filled in)
- **40 of 41 ToCs lack DAG pages** (only Diagnostics has one)
- **Chain construction errors found in first 2 reviews** — likely systemic across all ToCs

---

## 🔑 Key Decisions Made by David

These are explicit decisions — do not second-guess or re-ask:

1. **Investment Level rollup:** Use the **lowest** Investment Level across claims in the chain. The rollup is a diagnostic tool — when it produces a surprising result, the chain's story doesn't hold up. Investigate the chain, don't override the rollup.
2. **Mixed Gap Type migration:** AI analyzes and assigns (Option A). David reviews afterward.
3. **Cross-Domain ToC creation:** Deferred to the end, not now.
4. **Gap?** is a formula (auto-true when Gap Type set and ≠ "Not a Gap")
5. **Standalone established harms** use Step = 0 convention (no ToC chain needed)
6. **Shared Bottleneck Database:** Deferred to post-MVP
7. **Skeptical Review Protocol:** All ToCs must pass the 5-check protocol before being marked "Done."
8. **Confounder analyses and DAGs needed for all ToCs** — only Diagnostics currently has a DAG.

---

## 🗄️ Key Database References

### ToC Summary Database
- 8 Gap Type options: Needs Evidence, Needs Capital, Needs Time, Needs Evidence + Capital, Needs Evidence + Time, Needs Capital + Time, Needs Evidence + Capital + Time, Not a Gap
- 6 Domain options: Healthcare, Education, Climate/Energy, Scientific Research, Labor/Employment, Cross-Domain

### ToC Summary Views
- **Investment Opportunity Map** (board by Investment Level): https://www.notion.so/376fa294d160485fbeb6530ac693a7b5
- **Cross-Domain Comparison** (table by Domain): https://www.notion.so/07b6091d14c647e9ad5be0002bdd0ed6
- **What's Ready to Fund** (filtered table): https://www.notion.so/da405ef7df0847bf8b9be00cb8736d82
- **What Needs Evidence First** (filtered table): https://www.notion.so/cd6b61412b3840288b95fa70a36ed760
- **By Domain** (table by Domain): https://www.notion.so/27af3d70ea4849bd8294e1cea97a507c
- **Investment Gap Priority** (filtered table): https://www.notion.so/037477c28ced49a397c75630b1940a6f

---

## 💡 Key Findings & Presentation Material

### AI Tutoring — Potentially Novel Investment Opportunity (March 5, 2026)

The product-vs-evidence investment gap is the starkest in the entire map. Billions building AI tutors (Step 1), almost nothing measuring whether they work long-term (Steps 3–4). This is not widely recognized.

**The acceleration framing is the key insight:** Steps 3–4 are labeled "Needs Evidence + Time" but the accelerable portion is significant. Platforms with millions of users already exist — what's missing is measurement infrastructure. Funding longitudinal tracking, engagement trajectory studies, and parallel cross-subject pilots could compress a decade of sequential evidence-building into 2–3 years.

**Good example for presentation:** This ToC demonstrates the gap map's value as an investment decision tool — it surfaces a non-obvious opportunity (fund measurement, not products) that the market is missing.

---

## 📣 External Feedback Received

None yet. Key target: Elie Hassenfeld (GiveWell CEO).

---

## ⚙️ How to Use This Page

When asking the AI to improve the gap map, either:
1. Point it to this page, or
2. Include a short task prompt like:
   > *"The current priority is [X]. Focus on [specific domain/field]. Don't touch [Y]."*

This page provides the standing context; the task prompt provides the session-specific scope.
