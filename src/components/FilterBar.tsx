"use client";

import type { FilterState, Domain, Type, GapType, EvidenceLevel } from "@/lib/types";
import {
  ALL_DOMAINS,
  ALL_TYPES,
  ALL_GAP_TYPES,
  ALL_EVIDENCE_LEVELS,
  DOMAIN_COLORS,
  TYPE_COLORS,
} from "@/lib/constants";

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({ filters, onChange, totalCount, filteredCount }: Props) {
  function toggleDomain(domain: Domain) {
    const allSelected = filters.domains.length === ALL_DOMAINS.length;
    const onlyThisSelected = filters.domains.length === 1 && filters.domains[0] === domain;
    if (allSelected) {
      // Solo this domain
      onChange({ ...filters, domains: [domain] });
    } else if (onlyThisSelected) {
      // Back to all
      onChange({ ...filters, domains: ALL_DOMAINS.slice() });
    } else {
      // Switch to this domain
      onChange({ ...filters, domains: [domain] });
    }
  }

  function toggleType(type: Type) {
    const allSelected = filters.types.length === ALL_TYPES.length;
    const onlyThisSelected = filters.types.length === 1 && filters.types[0] === type;
    if (allSelected) {
      onChange({ ...filters, types: [type] });
    } else if (onlyThisSelected) {
      onChange({ ...filters, types: ALL_TYPES.slice() });
    } else {
      onChange({ ...filters, types: [type] });
    }
  }

  function setGapType(value: GapType | "") {
    onChange({
      ...filters,
      gapTypes: value ? [value] : ALL_GAP_TYPES.slice(),
    });
  }

  function setEvidenceLevel(value: EvidenceLevel | "") {
    onChange({
      ...filters,
      evidenceLevels: value ? [value] : ALL_EVIDENCE_LEVELS.slice(),
    });
  }

  function clearAll() {
    onChange({
      domains: ALL_DOMAINS.slice(),
      types: ALL_TYPES.slice(),
      gapTypes: ALL_GAP_TYPES.slice(),
      evidenceLevels: ALL_EVIDENCE_LEVELS.slice(),
      persona: filters.persona,
    });
  }

  const isFiltered =
    filters.domains.length < ALL_DOMAINS.length ||
    filters.types.length < ALL_TYPES.length ||
    filters.gapTypes.length < ALL_GAP_TYPES.length ||
    filters.evidenceLevels.length < ALL_EVIDENCE_LEVELS.length;

  const selectedGapType =
    filters.gapTypes.length === 1 ? filters.gapTypes[0] : "";
  const selectedEvidence =
    filters.evidenceLevels.length === 1 ? filters.evidenceLevels[0] : "";

  return (
    <div
      className="sticky top-0 z-20 border-y backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(28, 26, 23, 0.92)",
        borderColor: "var(--border)",
      }}
    >
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-0 flex-wrap">
        {/* Domain filters */}
        <div className="flex items-center gap-0.5">
          {ALL_DOMAINS.map((domain) => {
            const active = filters.domains.includes(domain);
            const color = DOMAIN_COLORS[domain];
            return (
              <button
                key={domain}
                onClick={() => toggleDomain(domain)}
                className="flex items-center gap-1.5 px-2 py-1 transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: active ? color : "var(--muted)",
                }}
              >
                {active && (
                  <span
                    className="inline-block rounded-full shrink-0"
                    style={{
                      width: "5px",
                      height: "5px",
                      backgroundColor: color,
                    }}
                  />
                )}
                {domain}
              </button>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div
          className="shrink-0 mx-3 self-stretch"
          style={{
            width: "1px",
            backgroundColor: "var(--border)",
          }}
        />

        {/* Type filters */}
        <div className="flex items-center gap-0.5">
          {ALL_TYPES.map((type) => {
            const active = filters.types.includes(type);
            const color = TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className="flex items-center gap-1.5 px-2 py-1 transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: active ? color : "var(--muted)",
                }}
              >
                {active && (
                  <span
                    className="inline-block rounded-full shrink-0"
                    style={{
                      width: "5px",
                      height: "5px",
                      backgroundColor: color,
                    }}
                  />
                )}
                {type}
              </button>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div
          className="shrink-0 mx-3 self-stretch"
          style={{
            width: "1px",
            backgroundColor: "var(--border)",
          }}
        />

        {/* Gap type dropdown */}
        <select
          aria-label="Filter by gap type"
          value={selectedGapType}
          onChange={(e) => setGapType(e.target.value as GapType | "")}
          className="appearance-none rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <option value="">All gap types</option>
          {ALL_GAP_TYPES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Vertical divider */}
        <div
          className="shrink-0 mx-3 self-stretch"
          style={{
            width: "1px",
            backgroundColor: "var(--border)",
          }}
        />

        {/* Evidence level dropdown */}
        <select
          aria-label="Filter by evidence level"
          value={selectedEvidence}
          onChange={(e) => setEvidenceLevel(e.target.value as EvidenceLevel | "")}
          className="appearance-none rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <option value="">All evidence levels</option>
          {ALL_EVIDENCE_LEVELS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        {/* Clear / Reset */}
        {isFiltered && (
          <>
            <div
              className="shrink-0 mx-3 self-stretch"
              style={{
                width: "1px",
                backgroundColor: "var(--border)",
              }}
            />
            <button
              onClick={clearAll}
              className="px-2 py-1 transition-colors hover:text-[var(--foreground)]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--muted)",
              }}
            >
              &times; Reset
            </button>
          </>
        )}

        {/* Spacer + count */}
        <span
          className="ml-auto"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--muted)",
            letterSpacing: "0.05em",
          }}
        >
          {filteredCount} of {totalCount}
        </span>
      </div>
    </div>
  );
}
