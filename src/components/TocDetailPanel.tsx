"use client";

import { useEffect, useRef } from "react";
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
  onClose: () => void;
}

function Badge({
  label,
  color,
  textColor = "white",
}: {
  label: string;
  color: string;
  textColor?: string;
}) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: color, color: textColor }}
    >
      {label}
    </span>
  );
}

function parseConfounders(text: string) {
  if (!text) return null;
  const parts = text.split(/(CHAIN-NEGATING:[^\n.]*)/g);
  return parts.map((part, i) =>
    part.startsWith("CHAIN-NEGATING:") ? (
      <span key={i} className="text-red-600 font-medium">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function TocDetailPanel({ toc, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg leading-tight">
              {toc.name}
            </h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge label={toc.domain} color={DOMAIN_COLORS[toc.domain]} />
              <Badge label={toc.type} color={TYPE_COLORS[toc.type]} />
              <Badge label={toc.impactScale} color={IMPACT_COLORS[toc.impactScale]} />
              <Badge label={toc.investmentLevel} color={INVESTMENT_COLORS[toc.investmentLevel]} />
              <Badge label={toc.weakestEvidenceLevel} color={EVIDENCE_COLORS[toc.weakestEvidenceLevel]} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-600 text-xl leading-none mt-0.5"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Investable Insight */}
          {toc.investableInsight && (
            <div className="border-l-4 border-green-400 pl-4 bg-green-50 rounded-r-lg py-3 pr-3">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                Investable Insight
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {toc.investableInsight}
              </p>
            </div>
          )}

          {/* Investment case */}
          {toc.investmentCase && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Investment Case
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {toc.investmentCase}
              </p>
            </div>
          )}

          {/* Chain narrative */}
          {toc.chainNarrative && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Chain Narrative
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {toc.chainNarrative}
              </p>
            </div>
          )}

          {/* Key confounders */}
          {toc.keyConfounders && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Key Confounders
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {parseConfounders(toc.keyConfounders)}
              </p>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <MetaItem label="Primary Gap" value={toc.primaryGapType} />
            <MetaItem label="Time Horizon" value={toc.timeHorizon} />
            <MetaItem label="Steps" value={String(toc.numberOfSteps || "—")} />
            <MetaItem label="Gaps" value={String(toc.numberOfGaps || "—")} />
            <MetaItem
              label="Achievable Impact"
              value={toc.achievableImpactScale}
            />
            {toc.impactEstimate && (
              <MetaItem label="Impact Estimate" value={toc.impactEstimate} />
            )}
          </div>

          {/* Impact comparison note */}
          {toc.achievableImpactScale !== toc.impactScale && (
            <p className="text-xs text-gray-400 italic">
              Even if the full chain fails, achievable impact is{" "}
              <strong>{toc.achievableImpactScale}</strong> vs. the full-chain
              potential of <strong>{toc.impactScale}</strong>.
            </p>
          )}

          {toc.dagPageUrl && (
            <a
              href={toc.dagPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              View DAG analysis →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-700">{value || "—"}</p>
    </div>
  );
}
