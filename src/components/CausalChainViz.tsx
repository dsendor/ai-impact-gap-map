"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Claim } from "@/lib/types";
import { INVESTMENT_COLORS, EVIDENCE_COLORS } from "@/lib/constants";
import type { InvestmentLevel, EvidenceLevel } from "@/lib/types";

interface Props {
  claims: Claim[];
  tocName: string;
}

function labelInvestment(level: string): string {
  switch (level) {
    case "Heavy": return "Heavy Investment";
    case "Moderate": return "Moderate Investment";
    case "Light": return "Light Investment";
    case "Minimal/None": return "Minimal Investment";
    case "Unknown": return "Unknown Investment";
    default: return level;
  }
}

function labelEvidence(level: string): string {
  switch (level) {
    case "Strong": return "Strong Evidence";
    case "Moderate": return "Moderate Evidence";
    case "Speculative": return "Speculative Evidence";
    case "None": return "No Evidence";
    default: return level;
  }
}

export default function CausalChainViz({ claims, tocName }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = [...claims].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));

  return (
    <div data-testid="causal-chain-viz" className="space-y-0">
      {sorted.map((claim, i) => {
        const isExpanded = expandedId === claim.id;
        const investColor =
          INVESTMENT_COLORS[(claim.investmentLevel ?? "Unknown") as InvestmentLevel] ?? "#6b7280";
        const evidenceColor =
          EVIDENCE_COLORS[(claim.evidenceLevel ?? "None") as EvidenceLevel] ?? "#6b7280";
        const isGap = claim.isGap;

        return (
          <motion.div
            key={claim.id}
            data-testid="chain-node"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            {/* Connector line */}
            {i > 0 && (
              <div className="flex items-center ml-6 -my-px">
                <div
                  className="w-px h-5"
                  style={{
                    background: isGap
                      ? `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`
                      : investColor,
                    opacity: isGap ? 0.6 : 0.3,
                  }}
                />
              </div>
            )}

            {/* Node */}
            <div
              className={`rounded-lg p-4 cursor-pointer transition-all ${
                isExpanded
                  ? "bg-[var(--surface-hover)]"
                  : "bg-[var(--surface)]"
              }`}
              style={{
                border: `1px solid ${isExpanded ? "var(--border-bright)" : "var(--border)"}`,
                borderLeft: isGap ? "2px solid var(--accent)" : undefined,
              }}
              onClick={() => setExpandedId(isExpanded ? null : claim.id)}
              onMouseEnter={(e) => {
                if (!isExpanded) {
                  e.currentTarget.style.borderColor = "var(--border-bright)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isExpanded) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  if (isGap) {
                    e.currentTarget.style.borderLeft = "2px solid var(--accent)";
                  }
                }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Step number circle */}
                <div
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    color: investColor,
                    fontFamily: "var(--font-mono)",
                    backgroundColor: "transparent",
                    border: `1.5px ${isGap ? "dashed" : "solid"} ${investColor}`,
                  }}
                >
                  {claim.step ?? "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight" style={{ color: "var(--foreground)" }}>
                    {claim.name}
                  </p>

                  {/* Structured text badges */}
                  <p className="mt-2 text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: investColor }}>
                      {labelInvestment(claim.investmentLevel ?? "Unknown")}
                    </span>
                    <span style={{ color: "var(--muted)" }}> &middot; </span>
                    <span style={{ color: evidenceColor }}>
                      {labelEvidence(claim.evidenceLevel ?? "None")}
                    </span>
                  </p>
                  {claim.valueIfWeStopHere && (
                    <p
                      className="mt-0.5 text-[10px]"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--muted)",
                      }}
                    >
                      Value if stop: {claim.valueIfWeStopHere}
                    </p>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 space-y-2 text-xs"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  {claim.keyEvidence && (
                    <div>
                      <span
                        className="text-[10px] uppercase"
                        style={{
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.15em",
                          color: "var(--accent)",
                        }}
                      >
                        Key Evidence:{" "}
                      </span>
                      <span style={{ color: "var(--foreground)", opacity: 0.8 }}>
                        {claim.keyEvidence}
                      </span>
                    </div>
                  )}
                  {claim.investmentNotes && (
                    <div>
                      <span
                        className="text-[10px] uppercase"
                        style={{
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.15em",
                          color: "var(--accent)",
                        }}
                      >
                        Investment Notes:{" "}
                      </span>
                      <span style={{ color: "var(--foreground)", opacity: 0.8 }}>
                        {claim.investmentNotes}
                      </span>
                    </div>
                  )}
                  {claim.notes && (
                    <div>
                      <span
                        className="text-[10px] uppercase"
                        style={{
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.15em",
                          color: "var(--accent)",
                        }}
                      >
                        Notes:{" "}
                      </span>
                      <span style={{ color: "var(--foreground)", opacity: 0.8 }}>
                        {claim.notes}
                      </span>
                    </div>
                  )}
                  {claim.source && (
                    <a
                      href={claim.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block hover:underline text-[10px] uppercase"
                      style={{
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.05em",
                        color: "var(--accent)",
                      }}
                    >
                      Source &rarr;
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
