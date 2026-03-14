"use client";

import { forwardRef } from "react";
import type { TheoryOfChange } from "@/lib/types";
import {
  DOMAIN_COLORS,
  TYPE_COLORS,
  INVESTMENT_COLORS,
  EVIDENCE_COLORS,
  IMPACT_COLORS,
} from "@/lib/constants";

interface Props {
  toc: TheoryOfChange;
  onClick: () => void;
  highlighted: boolean;
}

function Badge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

const TocCard = forwardRef<HTMLDivElement, Props>(function TocCard(
  { toc, onClick, highlighted },
  ref
) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        highlighted
          ? "border-blue-400 shadow-md ring-2 ring-blue-200"
          : "border-gray-100"
      }`}
    >
      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
        {toc.name}
      </h3>

      <div className="flex flex-wrap gap-1 mb-2">
        <Badge label={toc.domain} color={DOMAIN_COLORS[toc.domain]} />
        <Badge label={toc.type} color={TYPE_COLORS[toc.type]} />
        <Badge label={toc.impactScale} color={IMPACT_COLORS[toc.impactScale]} />
        <Badge
          label={toc.investmentLevel}
          color={INVESTMENT_COLORS[toc.investmentLevel]}
        />
        <Badge
          label={toc.weakestEvidenceLevel}
          color={EVIDENCE_COLORS[toc.weakestEvidenceLevel]}
        />
      </div>

      {toc.primaryGapType && (
        <p className="text-xs text-gray-400 mb-1">{toc.primaryGapType}</p>
      )}

      {toc.investmentCase && (
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {toc.investmentCase}
        </p>
      )}
    </div>
  );
});

export default TocCard;
