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
    const next = filters.domains.includes(domain)
      ? filters.domains.filter((d) => d !== domain)
      : [...filters.domains, domain];
    onChange({ ...filters, domains: next.length ? next : ALL_DOMAINS });
  }

  function toggleType(type: Type) {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next.length ? next : ALL_TYPES });
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
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
        {/* Persona toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => onChange({ ...filters, persona: "impact" })}
            className={`text-xs px-3 py-1.5 rounded-md transition-all ${
              filters.persona === "impact"
                ? "bg-white shadow text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            Impact focus
          </button>
          <button
            onClick={() => onChange({ ...filters, persona: "investment" })}
            className={`text-xs px-3 py-1.5 rounded-md transition-all ${
              filters.persona === "investment"
                ? "bg-white shadow text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            Investment focus
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* Domain pills */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_DOMAINS.map((domain) => {
            const active = filters.domains.includes(domain);
            const color = DOMAIN_COLORS[domain];
            return (
              <button
                key={domain}
                onClick={() => toggleDomain(domain)}
                className="text-xs px-2.5 py-1 rounded-full border transition-all"
                style={{
                  borderColor: color,
                  backgroundColor: active ? color : "transparent",
                  color: active ? "white" : color,
                  opacity: active ? 1 : 0.6,
                }}
              >
                {domain}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* Type pills */}
        <div className="flex gap-1.5">
          {ALL_TYPES.map((type) => {
            const active = filters.types.includes(type);
            const color = TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className="text-xs px-2.5 py-1 rounded-full border transition-all"
                style={{
                  borderColor: color,
                  backgroundColor: active ? color : "transparent",
                  color: active ? "white" : color,
                  opacity: active ? 1 : 0.6,
                }}
              >
                {type}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* Gap type dropdown */}
        <select
          value={selectedGapType}
          onChange={(e) => setGapType(e.target.value as GapType | "")}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">All gap types</option>
          {ALL_GAP_TYPES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Evidence level dropdown */}
        <select
          value={selectedEvidence}
          onChange={(e) => setEvidenceLevel(e.target.value as EvidenceLevel | "")}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">All evidence levels</option>
          {ALL_EVIDENCE_LEVELS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        {isFiltered && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400 shrink-0">
          {filteredCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
