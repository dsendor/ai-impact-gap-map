"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import caData from "../../../public/california.json";
import rawData from "../../../public/data.json";
import type { TheoryOfChange, ExportData } from "@/lib/types";
import CAHeroSection from "@/components/CAHeroSection";
import CACalloutBox from "@/components/CACalloutBox";
import CAPolicyCard from "@/components/CAPolicyCard";
import CAGapTypeTable from "@/components/CAGapTypeTable";
import CAChainViz from "@/components/CAChainViz";
import type { CAStep } from "@/components/CAChainViz";

const CADualChainViz = dynamic(() => import("@/components/CADualChainViz"), { ssr: false });
const ChainScatterPlot = dynamic(() => import("@/components/ChainScatterPlot"), { ssr: false });
const BreakdownPattern = dynamic(() => import("@/components/BreakdownPattern"), { ssr: false });

const exportData = rawData as unknown as ExportData;
const allTocs = exportData.theories as TheoryOfChange[];

// CA-relevant theory IDs (Climate/Energy + Labor/Employment chains + CA-specific)
const CA_TOC_IDS = [
  // Climate/Energy (wildfire-relevant)
  "38c69bb9-5f30-481c-978e-cce8ba4ec677",
  "e6bbd7b8-f341-4c9a-aa87-5fced7279eb7",
  "fbe469b9-f688-4708-8327-aee9e55dca74",
  "9648c4fc-0461-4aae-aa1a-4ca36d987dbd",
  "4e6f92b8-2e64-43ec-ba43-4f9902165583",
  "f18252dd-2012-4c51-964b-c5b114011599",
  // Labor/Employment (economy + entertainment)
  "951dcd1b-c0f3-4b01-8361-474e9aa242b0",
  "4423f054-ccae-4385-bc29-dadfeda699f8",
  "9aa723b4-18c7-48a7-aabd-cba9ed31d493",
  "e6f2ec5d-4a9f-4489-9a27-27e12438514b",
  "ebf0edaf-7935-42a5-9ee2-c849f66179de",
];

const caTheories = allTocs.filter((t) => CA_TOC_IDS.includes(t.id));


function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return width;
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <span
        className="section-number"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        § {number}
      </span>
      <h2
        className="text-2xl md:text-3xl font-normal text-[var(--foreground)] mt-2"
        style={{ fontFamily: "var(--font-display, serif)" }}
      >
        {title}
      </h2>
      <div className="ruled-line mt-4 mb-3" />
      {description && (
        <p className="text-sm text-[var(--muted)]">{description}</p>
      )}
    </div>
  );
}

// Extract typed example data
const entertainment = caData.examples[0];
const wildfire = caData.examples[1];
const economy = caData.examples[2];

export default function CaliforniaPage() {
  const scatterRef = useRef<HTMLDivElement>(null);
  const scatterWidth = useContainerWidth(scatterRef);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero — S.00 */}
      <CAHeroSection stats={caData.heroStats} />

      {/* S.01 — The Challenge */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader number="01" title="The Challenge" />
          <div className="max-w-3xl space-y-6">
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              Everyone agrees AI will transform society. Nobody agrees on how.
            </p>
            <blockquote
              className="border-l-2 pl-6 py-2 text-xl leading-relaxed italic"
              style={{
                borderColor: "var(--accent)",
                fontFamily: "var(--font-display, serif)",
                color: "var(--foreground)",
              }}
            >
              &ldquo;And right now, we have no independent way to verify whether AI is delivering on its promises or creating harms we aren&rsquo;t measuring.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* S.02 — The Problem for California */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="02"
            title="California is the Global Center of AI"
            description="That means the consequences land here first."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            <CACalloutBox
              stat="$300B+"
              text="Annual global AI investment — and California captures the majority of it"
            />
            <CACalloutBox
              stat="2,600+"
              text="AI companies headquartered in California, more than the rest of the US combined"
            />
            <CACalloutBox
              stat="68%"
              text="Of all US venture capital flowing into AI goes to California-based companies"
              accent
            />
            <CACalloutBox
              stat="$0"
              text="California budget for measuring the net impact of AI on workers, communities, and public safety"
              accent
            />
          </div>
          <p
            className="mt-8 max-w-3xl text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Policymakers are being asked to regulate, fund, and oversee AI without independent data on whether its benefits are real or its harms are being addressed.
          </p>
        </div>
      </section>

      {/* S.03 — We've Made This Mistake Before */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="03"
            title="We&rsquo;ve Made This Mistake Before"
            description="Every transformational technology arrives before we understand its consequences."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 — The Internet */}
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderTop: "2px solid #5B9BD5",
              }}
            >
              <div>
                <p
                  className="text-xl font-normal"
                  style={{ fontFamily: "var(--font-display, serif)", color: "#5B9BD5" }}
                >
                  The Internet
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider mt-1"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                >
                  1990s–2000s
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                We built without measuring. Disinformation and mental health crisis followed. By the time we had data, the damage was structural.
              </p>
            </div>

            {/* Card 2 — Climate */}
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderTop: "2px solid #E8850A",
              }}
            >
              <div>
                <p
                  className="text-xl font-normal"
                  style={{ fontFamily: "var(--font-display, serif)", color: "#E8850A" }}
                >
                  Climate
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider mt-1"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                >
                  2000s–2020s
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                We measured, but too slowly. By the time scientific consensus formed, the action window had narrowed. The cost is now measured in trillions.
              </p>
            </div>

            {/* Card 3 — AI — visually distinct */}
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "color-mix(in srgb, var(--accent) 6%, var(--surface))",
                border: "1px solid var(--accent)",
                borderTop: "2px solid var(--accent)",
              }}
            >
              <div>
                <p
                  className="text-xl font-normal"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--accent)" }}
                >
                  AI
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider mt-1"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                >
                  2020s–now
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Combines both failures. We aren&rsquo;t measuring the harms. We aren&rsquo;t validating the benefits. And AI moves faster than either. We can still fix this.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S.04 — What's Missing */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="04"
            title="What&rsquo;s Missing"
            description="Four structural gaps that no market actor has an incentive to close."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {[
              {
                title: "No independent scorecard",
                body: "The only data on AI's impact comes from the companies building it. Regulators are making decisions based on vendor-supplied narratives.",
              },
              {
                title: "No way to weigh costs against benefits",
                body: "Harms and benefits are tracked by different groups using different standards. Nobody holds them in the same frame.",
              },
              {
                title: "No map of what's missing",
                body: "Without a structured view of where the gaps are, policy becomes reactive. You regulate what makes headlines, not what matters most.",
              },
              {
                title: "No framework for comparing across domains",
                body: "Is the measurement gap in labor worse than in education? In healthcare worse than in climate? Today, there's no way to ask that question.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-6 flex flex-col gap-3"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-base font-normal"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
                >
                  {card.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S.05 — What the Gap Map Does */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="05"
            title="What the AI Impact Gap Map Does"
          />
          <div className="max-w-2xl space-y-0">
            {[
              {
                bold: "Evaluates forward-looking claims",
                rest: " about AI's benefits and harms using historical evidence, not just tracking what has already happened",
              },
              {
                bold: "Holds benefits and harms in the same frame",
                rest: " so policymakers can weigh tradeoffs rather than getting siloed information",
              },
              {
                bold: "Identifies where the evidence breaks down",
                rest: " and what type of action would close each gap",
              },
              {
                bold: "Enables cross-domain comparison",
                rest: " so you can ask: where should resources go first?",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-6 py-5"
                style={{
                  borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  className="shrink-0 text-2xl font-normal w-8 text-right"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--accent)" }}
                >
                  {i + 1}
                </span>
                <p
                  className="text-lg leading-snug"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
                >
                  <strong style={{ fontWeight: 600 }}>{item.bold}</strong>
                  {item.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S.06 — How It Works */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader number="06" title="How It Works" />
          <div className="max-w-3xl mb-8 space-y-4">
            <p className="text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
              Each claimed benefit, harm, or mitigation is broken into a causal chain and assessed step by step on three dimensions:
            </p>
            <div className="space-y-2 pl-4">
              {[
                { label: "Impact potential", desc: "How big is this if it works (or goes wrong)?" },
                { label: "Evidence strength", desc: "How confident are we at each step?" },
                { label: "Current investment", desc: "How much effort and money is flowing here today?" },
              ].map((dim) => (
                <p key={dim.label} className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{dim.label}</span>{" "}
                  — {dim.desc}
                </p>
              ))}
            </div>
            <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              Where the chain breaks, that&rsquo;s the gap. And each gap type maps to a specific policy action.
            </p>
          </div>
          {/* Reuse the main site's chain visualization via CAChainViz (same visual pattern) */}
          <div className="max-w-5xl">
            <p
              className="text-[10px] uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
            >
              Example: Wildfire Detection Chain
            </p>
            <CAChainViz steps={wildfire.chain as CAStep[]} />
          </div>
        </div>
      </section>

      {/* S.07 — From Gaps to Policy Action */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="07"
            title="From Gaps to Policy Action"
          />
          <CAGapTypeTable gapTypes={caData.gapTypes} />
        </div>
      </section>

      {/* S.08 — Example 1: Entertainment Economy */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="08"
            title="AI and California&rsquo;s Entertainment Economy"
          />
          <p
            className="text-base italic mb-8 max-w-3xl"
            style={{ fontFamily: "var(--font-display, serif)", color: "var(--muted)" }}
          >
            The same technology. Two opposite outcomes. Nobody measuring which one is happening.
          </p>
          <CADualChainViz
            benefitChain={entertainment.benefitChain as CAStep[]}
            harmChain={entertainment.harmChain as CAStep[]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {entertainment.statCallouts.map((callout, i) => (
              <CACalloutBox
                key={i}
                stat={callout.stat}
                text={callout.text}
                accent={callout.accent}
              />
            ))}
          </div>
          <p
            className="mt-6 max-w-3xl text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {entertainment.whereItBreaks}
          </p>
          <div className="mt-6">
            <CAPolicyCard
              gapType={entertainment.gapType}
              policyAction={entertainment.policyAction}
              estimatedCost={entertainment.estimatedCost}
            />
          </div>
        </div>
      </section>

      {/* S.09 — Example 2: Wildfire Detection */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="09"
            title="AI Wildfire Detection in California"
          />
          <p
            className="text-base italic mb-8 max-w-3xl"
            style={{ fontFamily: "var(--font-display, serif)", color: "var(--muted)" }}
          >
            Detection works. The pipeline from detection to equitable evacuation doesn&rsquo;t exist.
          </p>
          <div className="max-w-5xl">
            <CAChainViz steps={wildfire.chain as CAStep[]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {wildfire.statCallouts.map((callout, i) => (
              <CACalloutBox
                key={i}
                stat={callout.stat}
                text={callout.text}
                accent={callout.accent}
              />
            ))}
          </div>
          <p
            className="mt-6 max-w-3xl text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {wildfire.whereItBreaks}
          </p>
          <div className="mt-6">
            <CAPolicyCard
              gapType={wildfire.gapType}
              policyAction={wildfire.policyAction}
              estimatedCost={wildfire.estimatedCost}
            />
          </div>
        </div>
      </section>

      {/* S.10 — Example 3: California's Economy */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="10"
            title="AI and California&rsquo;s Economy"
          />
          <p
            className="text-base italic mb-8 max-w-3xl"
            style={{ fontFamily: "var(--font-display, serif)", color: "var(--muted)" }}
          >
            $203B poured into AI companies. Nobody measuring whether the wealth reaches Californians.
          </p>
          <div className="max-w-5xl">
            <CAChainViz steps={economy.chain as CAStep[]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {economy.statCallouts.map((callout, i) => (
              <CACalloutBox
                key={i}
                stat={callout.stat}
                text={callout.text}
                accent={callout.accent}
              />
            ))}
          </div>
          <p
            className="mt-6 max-w-3xl text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {economy.whereItBreaks}
          </p>
          <div className="mt-6">
            <CAPolicyCard
              gapType={economy.gapType}
              policyAction={economy.policyAction}
              estimatedCost={economy.estimatedCost}
            />
          </div>
        </div>
      </section>

      {/* S.11 — What These Examples Show */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="11"
            title="Three Domains. Three Gap Types. One Framework."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid #D9447A",
              }}
            >
              <p
                className="text-xl"
                style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
              >
                Entertainment
              </p>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
                Same technology, two competing claims.
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
              >
                <strong>Measure before spending $750M/year on the wrong assumption.</strong>
              </p>
            </div>
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid #E8850A",
              }}
            >
              <p
                className="text-xl"
                style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
              >
                Wildfire Detection
              </p>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
                The technology works but the pipeline to equitable outcomes is broken.
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
              >
                <strong>Fund the integration nobody is building.</strong>
              </p>
            </div>
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--accent)",
              }}
            >
              <p
                className="text-xl"
                style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
              >
                Economic Growth
              </p>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
                $203B flowing in, but nobody can say whether it&rsquo;s broadly shared or a concentrated wealth generator with a fragile tax byproduct.
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
              >
                <strong>Measure the net fiscal impact before building a budget on it.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S.12 — A California Proof of Concept */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="12"
            title="A California Proof of Concept"
          />
          <div className="max-w-3xl space-y-8">
            <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              {caData.proofOfConcept.intro}
            </p>

            {/* Deliverables */}
            <div>
              <p
                className="text-[10px] uppercase tracking-wider mb-4"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
              >
                Deliverables
              </p>
              <div className="space-y-3">
                {caData.proofOfConcept.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] mt-0.5"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-snug" style={{ color: "var(--foreground)" }}>
                      {d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation callout */}
            <div
              className="rounded-xl px-6 py-5"
              style={{
                background: "color-mix(in srgb, var(--accent) 6%, var(--surface))",
                border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))",
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                {caData.proofOfConcept.validationCallout}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S.13 — Opportunity Map */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="13"
            title="Opportunity Map"
            description="CA-relevant theories of change. Dots in the top-left are high-impact, low-investment gaps."
          />
          <div
            ref={scatterRef}
            className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 overflow-hidden"
          >
            {scatterWidth > 0 && (
              <ChainScatterPlot
                theories={caTheories}
                width={scatterWidth - 32}
                height={Math.min(500, Math.max(350, (scatterWidth - 32) * 0.5))}
              />
            )}
          </div>
        </div>
      </section>

      {/* S.14 — Breakdown Pattern */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="14"
            title="Breakdown Pattern"
            description="Every row is a CA-relevant causal chain. Watch investment fade from left to right."
          />
          <BreakdownPattern theories={caTheories} />
        </div>
      </section>

      {/* S.15 — The Ask */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader number="15" title="What I&rsquo;m Asking" />
          <div className="max-w-3xl space-y-6 mb-10">
            <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              Plenty of organizations produce excellent evidence about AI. But nobody structures that evidence into forward-looking causal chains across domains, types the gaps, and maps them to specific policy actions.
            </p>
          </div>
          <div className="max-w-3xl space-y-6">
            {[
              {
                bold: "Does this framework help you make decisions you can't make today?",
                rest: " Not \"is it interesting,\" but would it change how you evaluate an AI bill or allocate oversight resources?",
              },
              {
                bold: "Which domains matter most for California?",
                rest: " Healthcare? Labor? Education? Climate? Where would you want to see this first?",
              },
              {
                bold: "What would make this credible enough to use?",
                rest: " What level of evidence or validation would you need to trust the assessments?",
              },
              {
                bold: "What's missing?",
                rest: " What questions do you face that this doesn't answer?",
              },
            ].map((q, i) => (
              <div
                key={i}
                className="rounded-xl p-8 flex items-start gap-6"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="text-4xl font-normal shrink-0 leading-none"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--accent)" }}
                >
                  {i + 1}
                </span>
                <p
                  className="text-lg leading-snug"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
                >
                  <strong style={{ fontWeight: 600 }}>{q.bold}</strong>
                  {q.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p
              className="text-lg"
              style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
            >
              AI Impact Gap Map · California
            </p>
            <p
              className="text-xs mt-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
            >
              {caTheories.length} CA-relevant theories of change · 3 case studies
            </p>
          </div>
          <a
            href="/"
            className="text-xs uppercase tracking-wider hover:underline"
            style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
          >
            ← Full Gap Map
          </a>
        </div>
      </footer>
    </div>
  );
}
