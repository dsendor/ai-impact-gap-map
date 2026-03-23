"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import rawData from "../../public/data.json";
import type { TheoryOfChange, ExportData, FilterState } from "@/lib/types";
import {
  ALL_DOMAINS,
  ALL_TYPES,
  ALL_GAP_TYPES,
  ALL_EVIDENCE_LEVELS,
} from "@/lib/constants";
import { opportunityScore, exportToCsv } from "@/lib/utils";
import { useFilteredData, hasClaims as checkHasClaims } from "@/lib/hooks";
import NarrativeLanding from "@/components/NarrativeLanding";
import ChainScatterPlot from "@/components/ChainScatterPlot";
import FilterBar from "@/components/FilterBar";
import TocCardGrid from "@/components/TocCardGrid";
import FeaturedChainStory from "@/components/FeaturedChainStory";

// Lazy load below-fold sections
const DomainDeepDive = dynamic(() => import("@/components/DomainDeepDive"), { ssr: false });
const BreakdownPattern = dynamic(() => import("@/components/BreakdownPattern"), { ssr: false });
const CallToAction = dynamic(() => import("@/components/CallToAction"), { ssr: false });

const exportData = rawData as unknown as ExportData;
const allTocs = exportData.theories as TheoryOfChange[];

// Featured chain IDs
const SECTION1_ID = "9deaff24-99ac-4c45-8b9b-807028a92701"; // AI Tutoring (§ 01)
const SECTION2_ID = "5fc978af-0772-42ee-9d14-76ac90613ccf"; // Diagnostics (§ 02)
const ADDITIONAL_IDS = [
  "5644224d-e4c7-437f-8b6d-2869b7a3679c", // Drug Discovery
];

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

function SectionHeader({ number, title, description }: { number: string; title: string; description?: string }) {
  return (
    <div className="mb-8">
      <span className="section-number" style={{ fontFamily: "var(--font-mono, monospace)" }}>§ {number}</span>
      <h2 className="text-2xl md:text-3xl font-normal text-[var(--foreground)] mt-2" style={{ fontFamily: "var(--font-display, serif)" }}>
        {title}
      </h2>
      <div className="ruled-line mt-4 mb-3" />
      {description && <p className="text-sm text-[var(--muted)]">{description}</p>}
    </div>
  );
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    domains: ALL_DOMAINS.slice(),
    types: ALL_TYPES.slice(),
    gapTypes: ALL_GAP_TYPES.slice(),
    evidenceLevels: ALL_EVIDENCE_LEVELS.slice(),
    persona: "impact",
  });

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scatterContainerRef = useRef<HTMLDivElement>(null);
  const scatterWidth = useContainerWidth(scatterContainerRef);

  const { theories: filteredTheories } = useFilteredData(allTocs, filters);
  const hasClaimData = useMemo(() => checkHasClaims(allTocs), []);

  const filtered = useMemo(() => {
    let result = [...filteredTheories];
    if (filters.persona === "impact") {
      result.sort((a, b) => opportunityScore(b) - opportunityScore(a));
    } else if (filters.persona === "investment") {
      const evidenceOrder: Record<string, number> = {
        Strong: 0,
        Moderate: 1,
        Speculative: 2,
        None: 3,
      };
      result.sort((a, b) => {
        const diff =
          evidenceOrder[a.weakestEvidenceLevel] -
          evidenceOrder[b.weakestEvidenceLevel];
        if (diff !== 0) return diff;
        const aCapital = a.primaryGapType === "Needs Capital" ? 0 : 1;
        const bCapital = b.primaryGapType === "Needs Capital" ? 0 : 1;
        return aCapital - bCapital;
      });
    } else {
      const typeOrder: Record<string, number> = {
        Harm: 0,
        Mitigation: 1,
        Benefit: 2,
      };
      result.sort((a, b) => {
        const typeDiff = (typeOrder[a.type] ?? 2) - (typeOrder[b.type] ?? 2);
        if (typeDiff !== 0) return typeDiff;
        return opportunityScore(b) - opportunityScore(a);
      });
    }
    return result;
  }, [filteredTheories, filters.persona]);

  const handleDotClick = useCallback((id: string) => {
    setHighlightedId(id);
    setSelectedId(id);
  }, []);

  const handleCardSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) setHighlightedId(id);
  }, []);

  // Stats for landing
  const gapPercent = useMemo(() => {
    const underinvested = allTocs.filter(
      (t) => t.investmentLevel === "Minimal/None" || t.investmentLevel === "Light"
    ).length;
    return Math.round((underinvested / allTocs.length) * 100);
  }, []);

  const totalClaims = useMemo(() => {
    return allTocs.reduce((sum, t) => sum + (t.claims?.length ?? 0), 0);
  }, []);

  // Downstream break percentage
  const downstreamBreakPercent = useMemo(() => {
    const chainsWithClaims = allTocs.filter((t) => t.claims && t.claims.length >= 2);
    if (chainsWithClaims.length === 0) return 0;
    let breakCount = 0;
    for (const t of chainsWithClaims) {
      const sorted = [...t.claims].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
      if (sorted.slice(1).some((c) => c.isGap)) breakCount++;
    }
    return Math.round((breakCount / chainsWithClaims.length) * 100);
  }, []);

  // Featured chains
  const section1Toc = useMemo(
    () => allTocs.find((t) => t.id === SECTION1_ID) ?? allTocs[0],
    []
  );

  const section2Toc = useMemo(
    () => allTocs.find((t) => t.id === SECTION2_ID) ?? allTocs[1],
    []
  );

  const additionalChains = useMemo(
    () => ADDITIONAL_IDS.map((id) => allTocs.find((t) => t.id === id)).filter(Boolean) as TheoryOfChange[],
    []
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Beat 1: The Hook */}
      <NarrativeLanding
        tocCount={allTocs.length}
        claimCount={totalClaims}
        gapPercent={gapPercent}
        downstreamBreakPercent={downstreamBreakPercent}
      />

      {/* Beat 2: § 01 — AI Tutoring Chain */}
      <section id="featured-chain" className="border-t border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
          <SectionHeader
            number="01"
            title="One Chain, Up Close"
            description="Follow the causal chain from AI investment to real-world impact. Watch where it breaks."
          />
          <FeaturedChainStory
            toc={section1Toc}
            additionalChains={additionalChains}
            breakAnnotation={{
              headline: "Measurable gains in pilots. No funded long-term outcome studies.",
              subtext: "The technology works in the classroom. The chain breaks before we know if it changes lives.",
            }}
          />
        </div>
      </section>

      {/* Bridge → § 02 */}
      <div className="border-t border-[var(--border)]">
        <p className="narrative-bridge py-12">The same breakdown appears in healthcare.</p>
      </div>

      {/* Beat 2b: § 02 — Diagnostics Chain */}
      <section id="diagnostics-chain" className="border-t border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
          <SectionHeader
            number="02"
            title="A Second Chain"
            description="A different domain, the same pattern. Investment collapses before the technology reaches patients."
          />
          <FeaturedChainStory
            toc={section2Toc}
            breakAnnotation={{
              headline: "223+ FDA-cleared devices. Zero funded implementation studies.",
              subtext: "The technology works. The chain breaks before it reaches the people who need it most.",
            }}
          />
        </div>
      </section>

      {/* Bridge → Beat 3 */}
      <div className="border-t border-[var(--border)]">
        <p className="narrative-bridge py-12">This isn&rsquo;t an isolated case.</p>
      </div>

      {/* Beat 3: The Pattern */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
          <SectionHeader
            number="03"
            title="The Breakdown Pattern"
            description="Every row is a causal chain. Every cell is a step. Watch investment fade from left to right."
          />
          <BreakdownPattern theories={allTocs} />
        </div>
      </section>

      {/* Bridge → Beat 5 */}
      <div className="border-t border-[var(--border)]">
        <p className="narrative-bridge py-12">
          Every dot in the opportunity zone is a chain where philanthropic capital could unlock impact.
        </p>
      </div>

      {/* Beat 5: The Opportunity Map */}
      <section id="gap-map" className="relative border-t border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
          <div className="flex items-start justify-between gap-6 mb-0">
            <SectionHeader
              number="04"
              title="The Opportunity Map"
              description={
                hasClaimData
                  ? "Each dot is a step in a causal chain. Connected dots trace a Theory of Change."
                  : "Each dot is a Theory of Change. Size = evidence strength."
              }
            />
            <button
              onClick={() => exportToCsv(filtered)}
              data-testid="csv-export"
              className="shrink-0 px-3 py-2 rounded-lg border transition-all uppercase tracking-wider
                bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]
                hover:bg-[var(--surface-hover)] hover:border-[var(--border-bright)]"
              style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px" }}
            >
              Export CSV
            </button>
          </div>

          <div ref={scatterContainerRef} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 overflow-hidden">
            {scatterWidth > 0 && (
              <ChainScatterPlot
                theories={filtered}
                width={scatterWidth - 32}
                height={Math.min(600, Math.max(400, (scatterWidth - 32) * 0.5))}
                onDotClick={handleDotClick}
              />
            )}
          </div>
        </div>
      </section>

      {/* Beat 6: Domain Lens */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <SectionHeader
            number="05"
            title="Domain Analysis"
            description="The pattern holds across every domain."
          />
          <DomainDeepDive theories={filtered} />
        </div>
      </section>

      {/* Beat 7: Call to Action + Explorer */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <CallToAction theories={allTocs} />
        </div>
      </section>

      {/* All Theories (explorer) */}
      <section id="all-theories" className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <SectionHeader number="06" title="All Theories of Change" />
          <FilterBar
            filters={filters}
            onChange={setFilters}
            totalCount={allTocs.length}
            filteredCount={filtered.length}
          />
          <div className="mt-8">
            <TocCardGrid
              tocs={filtered}
              highlightedId={highlightedId}
              selectedId={selectedId}
              onSelect={handleCardSelect}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-16">
        <div className="max-w-7xl mx-auto px-6 text-left">
          <p className="text-lg text-[var(--foreground)]" style={{ fontFamily: "var(--font-display, serif)" }}>
            AI Impact Gap Map
          </p>
          <p className="text-xs text-[var(--muted)] mt-2" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            {allTocs.length} theories of change · {totalClaims} causal claims
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            A research tool for mapping where AI investment creates impact — and where it doesn&apos;t.
          </p>
        </div>
      </footer>
    </div>
  );
}
