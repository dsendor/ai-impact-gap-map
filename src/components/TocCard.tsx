"use client";

import { forwardRef } from "react";
import type { TheoryOfChange } from "@/lib/types";
import {
  DOMAIN_COLORS,
  INVESTMENT_COLORS,
  EVIDENCE_COLORS,
} from "@/lib/constants";

interface Props {
  toc: TheoryOfChange;
  onClick: () => void;
  highlighted: boolean;
}

const TocCard = forwardRef<HTMLDivElement, Props>(function TocCard(
  { toc, onClick, highlighted },
  ref
) {
  const domainColor = DOMAIN_COLORS[toc.domain];
  const investmentColor = INVESTMENT_COLORS[toc.investmentLevel];
  const evidenceColor = EVIDENCE_COLORS[toc.weakestEvidenceLevel];
  const isMinimalInvestment = toc.investmentLevel === "Minimal/None";
  const isNoEvidence = toc.weakestEvidenceLevel === "None";
  const showGap =
    toc.primaryGapType && toc.primaryGapType !== "Not a Gap";

  return (
    <div
      ref={ref}
      data-testid="toc-card"
      onClick={onClick}
      className={`bg-[var(--surface)] rounded-lg cursor-pointer transition-all duration-200 hover:bg-[var(--surface-hover)] p-4 ${
        highlighted
          ? "border border-[var(--accent)] shadow-[0_0_12px_rgba(199,64,45,0.15)]"
          : "border border-[var(--border)] hover:border-[var(--border-bright)]"
      }`}
      style={{ borderLeft: `3px solid ${domainColor}` }}
    >
      {/* Title */}
      <h3
        className="font-normal text-[var(--foreground)] text-sm leading-snug mb-2 line-clamp-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {toc.name}
      </h3>

      {/* Structured data row */}
      <p
        className="text-[11px] uppercase tracking-wide mb-2 leading-none"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span style={{ color: domainColor }}>{toc.domain}</span>
        <span className="text-[var(--muted)]">
          {" · "}
          {toc.type}
          {" · "}
          {toc.impactScale}
        </span>
      </p>

      {/* Meta line — Investment + Evidence */}
      <div
        className="flex items-center gap-3 mb-2 text-[10px] uppercase tracking-wide"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: investmentColor }}
          />
          <span
            style={{
              color: isMinimalInvestment ? "var(--accent)" : "var(--muted)",
            }}
          >
            {toc.investmentLevel}
          </span>
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: evidenceColor }}
          />
          <span
            style={{
              color: isNoEvidence ? "var(--accent)" : "var(--muted)",
            }}
          >
            {toc.weakestEvidenceLevel}
          </span>
        </span>
      </div>

      {/* Gap type */}
      {showGap && (
        <p className="text-xs text-[var(--muted)] italic mb-1">
          {toc.primaryGapType}
        </p>
      )}

      {/* Investment case */}
      {toc.investmentCase && (
        <p
          className="text-xs text-[var(--foreground)] opacity-60 line-clamp-2 leading-relaxed"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {toc.investmentCase}
        </p>
      )}
    </div>
  );
});

export default TocCard;
