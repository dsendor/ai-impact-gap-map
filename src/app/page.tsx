"use client";

import { useState, useMemo, useCallback } from "react";
import rawTocs from "@/data/tocs.json";
import type { TheoryOfChange, FilterState } from "@/lib/types";
import {
  ALL_DOMAINS,
  ALL_TYPES,
  ALL_GAP_TYPES,
  ALL_EVIDENCE_LEVELS,
} from "@/lib/constants";
import { opportunityScore, exportToCsv } from "@/lib/utils";
import HeroStats from "@/components/HeroStats";
import GapMapChart from "@/components/GapMapChart";
import FilterBar from "@/components/FilterBar";
import TocCardGrid from "@/components/TocCardGrid";
import DomainSummary from "@/components/DomainSummary";

const allTocs = rawTocs as TheoryOfChange[];

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

  const filtered = useMemo(() => {
    let result = allTocs.filter(
      (t) =>
        filters.domains.includes(t.domain) &&
        filters.types.includes(t.type) &&
        filters.gapTypes.includes(t.primaryGapType) &&
        filters.evidenceLevels.includes(t.weakestEvidenceLevel)
    );

    if (filters.persona === "impact") {
      result = result.sort((a, b) => opportunityScore(b) - opportunityScore(a));
    } else {
      const evidenceOrder: Record<string, number> = {
        Strong: 0,
        Moderate: 1,
        Speculative: 2,
        None: 3,
      };
      result = result.sort((a, b) => {
        const diff =
          evidenceOrder[a.weakestEvidenceLevel] -
          evidenceOrder[b.weakestEvidenceLevel];
        if (diff !== 0) return diff;
        const aCapital = a.primaryGapType === "Needs Capital" ? 0 : 1;
        const bCapital = b.primaryGapType === "Needs Capital" ? 0 : 1;
        return aCapital - bCapital;
      });
    }
    return result;
  }, [filters]);

  const handleDotClick = useCallback((id: string) => {
    setHighlightedId(id);
    setSelectedId(id);
  }, []);

  const handleCardSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) setHighlightedId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Impact Gap Map</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Where AI investment would create the most good — and where it&apos;s missing
            </p>
          </div>
          <button
            onClick={() => exportToCsv(filtered)}
            className="text-xs px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </header>

      <HeroStats tocs={allTocs} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <GapMapChart
          tocs={filtered}
          onDotClick={handleDotClick}
          highlightedId={highlightedId}
        />
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={allTocs.length}
        filteredCount={filtered.length}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <TocCardGrid
          tocs={filtered}
          highlightedId={highlightedId}
          selectedId={selectedId}
          onSelect={handleCardSelect}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <DomainSummary tocs={filtered} />
      </div>
    </div>
  );
}
