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

// CA-relevant theory IDs (Climate/Energy + Labor/Employment chains)
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
      {/* Hero */}
      <CAHeroSection stats={caData.heroStats} />

      {/* S.01: The Challenge */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader number="01" title="The Challenge" />
          <div className="max-w-3xl space-y-6">
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              California is the world&apos;s AI capital. 2,600+ AI companies. 68% of US venture capital.
              The technology is being built here. The decisions are being made here.
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              But the same tools that generate billions in corporate value can accelerate wildfires, hollow
              out creative industries, and deepen economic inequality — all without any measurement system
              to catch it.
            </p>
            <blockquote
              className="border-l-2 pl-6 py-2 text-xl leading-relaxed italic"
              style={{
                borderColor: "var(--accent)",
                fontFamily: "var(--font-display, serif)",
                color: "var(--foreground)",
              }}
            >
              &ldquo;The chain from AI investment to real-world impact almost always breaks before it reaches
              the people who need it most.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* S.02: California is the global center of AI */}
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
        </div>
      </section>

      {/* S.03: We've Made This Mistake Before */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="03"
            title="We&rsquo;ve Made This Mistake Before"
            description="Every transformational technology arrives before we understand its consequences."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                era: "The Internet",
                years: "1990s–2000s",
                lesson:
                  "We built the internet without measuring its impact on democracy. Disinformation became a crisis before anyone had data.",
                color: "#5B9BD5",
              },
              {
                era: "Climate",
                years: "1950s–2000s",
                lesson:
                  "We subsidized fossil fuels for decades without accounting for externalities. The cost is now measured in trillions.",
                color: "#E8850A",
              },
              {
                era: "AI",
                years: "2020s–now",
                lesson:
                  "We are deploying AI at scale without measuring its net impact on the people it is supposed to help. We can still fix this.",
                color: "var(--accent)",
              },
            ].map((item) => (
              <div
                key={item.era}
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderTop: `2px solid ${item.color}`,
                }}
              >
                <div>
                  <p
                    className="text-xl font-normal"
                    style={{ fontFamily: "var(--font-display, serif)", color: item.color }}
                  >
                    {item.era}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-wider mt-1"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                  >
                    {item.years}
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.lesson}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S.04: What's Missing */}
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
                title: "No measurement infrastructure",
                body: "California has no system for tracking whether AI is making the state better or worse across any domain.",
              },
              {
                title: "Investment stops before impact",
                body: "Chains from AI research to real-world outcomes break consistently at the steps that require deployment, equity, or behavior change.",
              },
              {
                title: "Subsidies without accountability",
                body: "$750M+ in annual film tax credits with no requirement to measure AI&rsquo;s employment impact. Procurement without outcome tracking.",
              },
              {
                title: "Equity blind spots",
                body: "The communities most affected by AI — wildfire risk zones, displaced workers, non-English speakers — are last in every causal chain.",
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
                  dangerouslySetInnerHTML={{ __html: card.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S.05: What the Gap Map Does */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="05"
            title="What the Gap Map Does"
            description="A framework for turning AI investment into accountable policy."
          />
          <div className="max-w-2xl space-y-0">
            {[
              "Maps causal chains from AI investment to real-world outcome for any domain",
              "Identifies exactly where chains break — and assigns a reason (evidence gap, capital gap, time gap)",
              "Translates each break point into a specific, costed policy action",
              "Provides the measurement infrastructure to track whether interventions work",
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
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S.06: From Gaps to Policy Action */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="06"
            title="From Gaps to Policy Action"
            description="Each gap type maps directly to a policy lever."
          />
          <CAGapTypeTable gapTypes={caData.gapTypes} />
        </div>
      </section>

      {/* S.07: Entertainment Economy */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="07"
            title="Case Study: Entertainment Economy"
            description="Here's how the framework works — live. Two chains run in parallel. Only one is being tracked."
          />
          <CADualChainViz
            benefitChain={entertainment.benefitChain as CAStep[]}
            harmChain={entertainment.harmChain as CAStep[]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <CACalloutBox
              stat={entertainment.breakdownCallout.stat}
              text={entertainment.breakdownCallout.text}
              accent
            />
            <CACalloutBox
              stat={entertainment.structuralProblem!.stat}
              text={entertainment.structuralProblem!.text}
            />
          </div>
          <div className="mt-6">
            <CAPolicyCard
              gapType={entertainment.gapType}
              policyAction={entertainment.policyAction}
              estimatedCost={entertainment.estimatedCost}
            />
          </div>
        </div>
      </section>

      {/* S.08: Wildfire Detection */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="08"
            title="Case Study: Wildfire Detection"
            description="The AI works. The last mile doesn't."
          />
          <div className="max-w-4xl">
            <CAChainViz steps={wildfire.chain as CAStep[]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <CACalloutBox
              stat={wildfire.breakdownCallout.stat}
              text={wildfire.breakdownCallout.text}
              accent
            />
            <CACalloutBox
              stat={wildfire.whatDoesntExist!.stat}
              text={wildfire.whatDoesntExist!.text}
            />
          </div>
          <div className="mt-6">
            <CAPolicyCard
              gapType={wildfire.gapType}
              policyAction={wildfire.policyAction}
              estimatedCost={wildfire.estimatedCost}
            />
          </div>
        </div>
      </section>

      {/* S.09: California's Economy */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="09"
            title="Case Study: California&rsquo;s Economy"
            description="AI is reshaping the California economy. No one is measuring what happens to workers."
          />
          <div className="max-w-4xl">
            <CAChainViz steps={economy.chain as CAStep[]} />
          </div>
          <div className="mt-8">
            <CACalloutBox
              stat={economy.breakdownCallout.stat}
              text={economy.breakdownCallout.text}
              accent
            />
          </div>
          <div className="mt-6">
            <CAPolicyCard
              gapType={economy.gapType}
              policyAction={economy.policyAction}
              estimatedCost={economy.estimatedCost}
            />
          </div>
        </div>
      </section>

      {/* S.10: Three Domains. One Framework. */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="10"
            title="Three Domains. One Framework."
            description="The same pattern, the same solution, applied across California's most urgent AI challenges."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Entertainment",
                finding: "AI tools are deployed. Measurement isn't.",
                cost: "$2–5M to fix it",
                color: "#D9447A",
              },
              {
                title: "Wildfire",
                finding: "AI detection works. Last-mile alerts don't.",
                cost: "$15–30M to fix it",
                color: "#E8850A",
              },
              {
                title: "Economy",
                finding: "AI is reshaping work. No one is tracking it.",
                cost: "$8–12M to measure it",
                color: "#C7402D",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <p
                  className="text-xl"
                  style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
                >
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
                  {item.finding}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-mono)", color: item.color }}
                >
                  {item.cost}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S.11: Opportunity Map */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="11"
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

      {/* S.12: Breakdown Pattern */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="12"
            title="Breakdown Pattern"
            description="Every row is a CA-relevant causal chain. Watch investment fade from left to right."
          />
          <BreakdownPattern theories={caTheories} />
        </div>
      </section>

      {/* S.13: A California Proof of Concept */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="13"
            title="A California Proof of Concept"
            description="What we can deliver. Who has already validated the approach."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
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

            {/* External validation */}
            <div>
              <p
                className="text-[10px] uppercase tracking-wider mb-4"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
              >
                External Validation
              </p>
              <div className="space-y-3">
                {caData.proofOfConcept.externalValidation.map((v, i) => (
                  <div
                    key={i}
                    className="rounded-lg px-4 py-3 flex items-start gap-3"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    <div>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: "var(--font-display, serif)",
                          color: "var(--foreground)",
                        }}
                      >
                        {v.source}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                      >
                        {v.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S.14: Four Questions */}
      <section className="border-t border-[var(--border)] min-h-screen flex flex-col justify-center">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20 w-full">
          <SectionHeader
            number="14"
            title="Four Questions for California"
            description="The policy decisions that will determine whether AI serves all Californians."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "What is the net impact of AI on California workers today?",
              "Are the AI tools we are subsidizing actually reaching the communities that need them?",
              "What would it cost to close the three gaps identified here?",
              "Will California lead or follow on AI accountability?",
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
                  {q}
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
