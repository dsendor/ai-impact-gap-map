"use client";

import { useState } from "react";
import type { TheoryOfChange } from "@/lib/types";
import CausalChainViz from "./CausalChainViz";
import { DOMAIN_COLORS, INVESTMENT_COLORS, IMPACT_COLORS } from "@/lib/constants";

interface Props {
  theories: TheoryOfChange[];
}

function TocSelector({
  theories,
  selectedId,
  onChange,
  label,
}: {
  theories: TheoryOfChange[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={selectedId ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full text-xs border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <option value="">{label}</option>
      {theories.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

function TocSummaryBadges({ toc }: { toc: TheoryOfChange }) {
  return (
    <div className="mb-4">
      <div
        className="text-[10px] uppercase tracking-wide"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span style={{ color: DOMAIN_COLORS[toc.domain] }}>{toc.domain}</span>
        <span className="text-[var(--muted)]"> · </span>
        <span className="text-[var(--muted)]">{toc.impactScale}</span>
        <span className="text-[var(--muted)]"> · </span>
        <span className="text-[var(--muted)]">{toc.investmentLevel}</span>
      </div>
      <div
        className="text-[10px] text-[var(--muted)] mt-1"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {toc.numberOfSteps} steps · {toc.numberOfGaps} gaps
      </div>
    </div>
  );
}

export default function ComparisonMode({ theories }: Props) {
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);

  const leftToc = leftId ? theories.find((t) => t.id === leftId) ?? null : null;
  const rightToc = rightId ? theories.find((t) => t.id === rightId) ?? null : null;

  return (
    <div>
      <h2
        className="text-2xl md:text-3xl font-normal text-[var(--foreground)] mb-2"
        style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
      >
        Compare Theories of Change
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Select two theories to compare their causal chains side by side.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <TocSelector
            theories={theories}
            selectedId={leftId}
            onChange={setLeftId}
            label="Select first theory..."
          />
          {leftToc && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2 leading-tight">
                {leftToc.name}
              </h3>
              <TocSummaryBadges toc={leftToc} />
              {leftToc.claims && leftToc.claims.length > 0 && (
                <CausalChainViz claims={leftToc.claims} tocName={leftToc.name} />
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <TocSelector
            theories={theories}
            selectedId={rightId}
            onChange={setRightId}
            label="Select second theory..."
          />
          {rightToc && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2 leading-tight">
                {rightToc.name}
              </h3>
              <TocSummaryBadges toc={rightToc} />
              {rightToc.claims && rightToc.claims.length > 0 && (
                <CausalChainViz claims={rightToc.claims} tocName={rightToc.name} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
