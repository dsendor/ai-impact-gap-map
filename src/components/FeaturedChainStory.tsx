"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { TheoryOfChange, InvestmentLevel, EvidenceLevel } from "@/lib/types";
import { INVESTMENT_COLORS, EVIDENCE_COLORS } from "@/lib/constants";
import CausalChainViz from "./CausalChainViz";

interface Props {
  toc: TheoryOfChange;
  additionalChains?: TheoryOfChange[];
  compact?: boolean;
  vertical?: boolean;
  breakAnnotation?: { headline: string; subtext: string };
}

function labelInvestment(level: InvestmentLevel): string {
  switch (level) {
    case "Heavy": return "Heavy Investment";
    case "Moderate": return "Moderate Investment";
    case "Light": return "Light Investment";
    case "Minimal/None": return "Minimal Investment";
    case "Unknown": return "Unknown Investment";
    default: return level;
  }
}

function labelEvidence(level: EvidenceLevel): string {
  switch (level) {
    case "Strong": return "Strong Evidence";
    case "Moderate": return "Moderate Evidence";
    case "Speculative": return "Speculative Evidence";
    case "None": return "No Evidence";
    default: return level;
  }
}

const INVESTMENT_NUMERIC: Record<InvestmentLevel, number> = {
  Heavy: 4,
  Moderate: 3,
  Light: 2,
  "Minimal/None": 1,
  Unknown: 0,
};

export default function FeaturedChainStory({ toc, additionalChains = [], compact, vertical, breakAnnotation }: Props) {
  const [showMore, setShowMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const sorted = [...(toc.claims || [])].sort(
    (a, b) => (a.step ?? 0) - (b.step ?? 0)
  );

  // Find the break point: biggest investment drop between consecutive steps
  let breakIndex = -1;
  let maxDrop = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prev = INVESTMENT_NUMERIC[(sorted[i - 1].investmentLevel ?? "Unknown") as InvestmentLevel];
    const curr = INVESTMENT_NUMERIC[(sorted[i].investmentLevel ?? "Unknown") as InvestmentLevel];
    const drop = prev - curr;
    if (drop > maxDrop) {
      maxDrop = drop;
      breakIndex = i;
    }
  }

  // Shared step card renderer
  function renderStepCard(claim: typeof sorted[0], i: number, isPastBreak: boolean) {
    const investColor =
      INVESTMENT_COLORS[(claim.investmentLevel ?? "Unknown") as InvestmentLevel] ?? "#6b7280";
    const evidenceColor =
      EVIDENCE_COLORS[(claim.evidenceLevel ?? "None") as EvidenceLevel] ?? "#6b7280";

    return (
      <motion.div
        className="rounded-lg p-4"
        style={{
          background: "var(--surface)",
          border: `1px solid ${isPastBreak && claim.isGap ? "var(--accent)" : "var(--border)"}`,
          borderLeftWidth: isPastBreak && claim.isGap ? "2px" : undefined,
          borderLeftColor: isPastBreak && claim.isGap ? "var(--accent)" : undefined,
          opacity: isInView ? 1 : 0,
          transform: isInView ? "none" : "translateY(20px)",
          transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
            style={{
              color: investColor,
              fontFamily: "var(--font-mono)",
              border: `1.5px ${claim.isGap ? "dashed" : "solid"} ${investColor}`,
            }}
          >
            {claim.step ?? "?"}
          </div>
          <span
            className="text-[10px] tracking-wider uppercase"
            style={{ fontFamily: "var(--font-mono)", color: investColor }}
          >
            {labelInvestment((claim.investmentLevel ?? "Unknown") as InvestmentLevel)}
          </span>
        </div>
        <p className="text-sm leading-tight mb-2" style={{ color: "var(--foreground)" }}>
          {claim.name}
        </p>
        <div className="flex flex-wrap gap-x-2 text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
          <span style={{ color: evidenceColor }}>
            {labelEvidence((claim.evidenceLevel ?? "None") as EvidenceLevel)}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef}>
      {vertical ? (
        /* Vertical chain layout (for detail panel) */
        <div className="space-y-0">
          {sorted.map((claim, i) => {
            const investColor =
              INVESTMENT_COLORS[(claim.investmentLevel ?? "Unknown") as InvestmentLevel] ?? "#6b7280";
            const isBreakPoint = i === breakIndex;
            const isPastBreak = breakIndex > -1 && i >= breakIndex;

            return (
              <div key={claim.id}>
                {i > 0 && (
                  <div className="flex items-center ml-4 -my-px">
                    {isBreakPoint ? (
                      /* Vertical break indicator */
                      <div className="flex flex-col items-center py-1">
                        <div
                          className="w-px h-4"
                          style={{
                            background: `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`,
                          }}
                        />
                        <svg width="16" height="14" viewBox="0 0 16 14" className="text-[var(--accent)]">
                          <path
                            d="M4 2 L6 12 M10 2 L12 12"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                          />
                        </svg>
                        <div
                          className="w-px h-4"
                          style={{
                            background: `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`,
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-px h-6"
                        style={{
                          background: isPastBreak ? "var(--accent)" : investColor,
                          opacity: isPastBreak ? 0.4 : 0.3,
                          ...(isPastBreak ? {
                            background: `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`,
                            opacity: 0.4,
                          } : {}),
                        }}
                      />
                    )}
                  </div>
                )}
                {renderStepCard(claim, i, isPastBreak)}
              </div>
            );
          })}
        </div>
      ) : (
        /* Horizontal chain layout (for main page Beat 2) */
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-col md:flex-row items-stretch gap-0 min-w-0">
            {sorted.map((claim, i) => {
              const investColor =
                INVESTMENT_COLORS[(claim.investmentLevel ?? "Unknown") as InvestmentLevel] ?? "#6b7280";
              const isBreakPoint = i === breakIndex;
              const isPastBreak = breakIndex > -1 && i >= breakIndex;

              return (
                <div key={claim.id} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0">
                  {/* Connector */}
                  {i > 0 && (
                    <div className="flex items-center justify-center shrink-0">
                      {isBreakPoint ? (
                        <div className="flex flex-col md:flex-row items-center gap-1 px-2 py-3 md:py-0">
                          <div className="hidden md:block relative">
                            <svg width="48" height="24" viewBox="0 0 48 24" className="text-[var(--accent)]">
                              <line x1="0" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                              <line x1="32" y1="12" x2="48" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                              <path d="M18 6 L22 18 M26 6 L30 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div className="md:hidden w-px h-8"
                            style={{
                              background: `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`,
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="hidden md:flex items-center px-1">
                            <svg width="20" height="12" viewBox="0 0 20 12">
                              <line
                                x1="0" y1="6" x2="14" y2="6"
                                stroke={isPastBreak ? "var(--accent)" : investColor}
                                strokeWidth="1.5"
                                opacity={isPastBreak ? 0.4 : 0.5}
                                strokeDasharray={isPastBreak ? "3 3" : "none"}
                              />
                              <path
                                d="M13 2 L18 6 L13 10"
                                stroke={isPastBreak ? "var(--accent)" : investColor}
                                strokeWidth="1.5"
                                fill="none"
                                opacity={isPastBreak ? 0.4 : 0.5}
                              />
                            </svg>
                          </div>
                          <div className="md:hidden flex justify-center">
                            <div
                              className="w-px h-5"
                              style={{
                                background: isPastBreak ? "var(--accent)" : investColor,
                                opacity: isPastBreak ? 0.4 : 0.3,
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {renderStepCard(claim, i, isPastBreak)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Break annotation — hidden in compact mode */}
      {!compact && breakIndex > -1 && breakAnnotation && (
        <motion.div
          className="mt-6 p-5 rounded-lg text-center"
          style={{
            background: "rgba(199, 64, 45, 0.08)",
            border: "1px solid rgba(199, 64, 45, 0.2)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: sorted.length * 0.15 + 0.2 }}
        >
          <p
            className="text-lg md:text-xl mb-2"
            style={{
              fontFamily: "var(--font-display, serif)",
              color: "var(--foreground)",
            }}
          >
            {breakAnnotation.headline}
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {breakAnnotation.subtext}
          </p>
        </motion.div>
      )}

      {/* Investable insight — hidden in compact mode */}
      {!compact && toc.investableInsight && (
        <motion.div
          className="mt-6 p-4 rounded-lg"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: sorted.length * 0.15 + 0.4 }}
        >
          <span
            className="text-[10px] tracking-[0.15em] uppercase block mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
          >
            Investable Insight
          </span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
            {toc.investableInsight}
          </p>
        </motion.div>
      )}

      {/* See more examples — hidden in compact mode */}
      {!compact && additionalChains.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-sm transition-colors cursor-pointer"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--accent)",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            {showMore ? "Hide examples" : `See ${additionalChains.length} more example chains`} {showMore ? "↑" : "↓"}
          </button>

          {showMore && (
            <motion.div
              className="mt-6 grid gap-6 md:grid-cols-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
            >
              {additionalChains.map((chain) => (
                <div
                  key={chain.id}
                  className="p-4 rounded-lg"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <h4
                    className="text-base mb-3"
                    style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
                  >
                    {chain.name}
                  </h4>
                  <CausalChainViz claims={chain.claims || []} tocName={chain.name} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
