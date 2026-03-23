"use client";

import { motion } from "framer-motion";
import { INVESTMENT_COLORS, EVIDENCE_COLORS } from "@/lib/constants";
import type { InvestmentLevel, EvidenceLevel } from "@/lib/types";

export interface CAStep {
  step: number;
  name: string;
  investmentLevel: InvestmentLevel;
  evidenceLevel: EvidenceLevel;
  isBreakpoint: boolean;
}

interface Props {
  steps: CAStep[];
  label?: string;
}

function labelInvestment(level: string): string {
  switch (level) {
    case "Heavy": return "Heavy";
    case "Moderate": return "Moderate";
    case "Light": return "Light";
    case "Minimal/None": return "Minimal";
    default: return level;
  }
}

function labelEvidence(level: string): string {
  switch (level) {
    case "Strong": return "Strong";
    case "Moderate": return "Moderate";
    case "Speculative": return "Speculative";
    case "None": return "No Evidence";
    default: return level;
  }
}

export default function CAChainViz({ steps, label }: Props) {
  const sorted = [...steps].sort((a, b) => a.step - b.step);

  return (
    <div>
      {label && (
        <p
          className="text-[11px] uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          {label}
        </p>
      )}

      {/* Horizontal on md+, vertical on mobile */}
      <div className="flex flex-col md:flex-row md:items-start gap-0 md:gap-0">
        {sorted.map((step, i) => {
          const investColor =
            INVESTMENT_COLORS[step.investmentLevel as InvestmentLevel] ?? "#6b7280";
          const evidenceColor =
            EVIDENCE_COLORS[step.evidenceLevel as EvidenceLevel] ?? "#6b7280";
          const isBreakpoint = step.isBreakpoint;

          return (
            <div key={step.step} className="flex flex-col md:flex-row md:items-start flex-1 min-w-0">
              {/* Step card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex-1 rounded-lg p-4 min-w-0"
                style={{
                  background: isBreakpoint
                    ? "color-mix(in srgb, var(--accent) 8%, var(--surface))"
                    : "var(--surface)",
                  border: `1px solid ${isBreakpoint ? "var(--accent)" : "var(--border)"}`,
                  borderStyle: isBreakpoint ? "dashed" : "solid",
                  minWidth: 0,
                  maxWidth: "100%",
                }}
              >
                {/* Step number */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                    style={{
                      color: investColor,
                      fontFamily: "var(--font-mono)",
                      border: `1.5px ${isBreakpoint ? "dashed" : "solid"} ${investColor}`,
                    }}
                  >
                    {step.step}
                  </div>
                  {isBreakpoint && (
                    <span
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                        background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                        border: "1px solid var(--accent)",
                      }}
                    >
                      Gap
                    </span>
                  )}
                </div>

                {/* Step name */}
                <p
                  className="text-sm leading-snug mb-3"
                  style={{ color: "var(--foreground)" }}
                >
                  {step.name}
                </p>

                {/* Badges */}
                <div className="space-y-1">
                  <p className="text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: investColor }}>
                      {labelInvestment(step.investmentLevel)}
                    </span>
                    <span style={{ color: "var(--muted)" }}> · </span>
                    <span style={{ color: evidenceColor }}>
                      {labelEvidence(step.evidenceLevel)}
                    </span>
                  </p>
                </div>
              </motion.div>

              {/* Connector */}
              {i < sorted.length - 1 && (
                <div className="flex md:items-center justify-center md:justify-start shrink-0">
                  {/* Mobile: vertical line */}
                  <div
                    className="md:hidden w-px h-6 mx-auto"
                    style={{
                      background: isBreakpoint
                        ? `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`
                        : investColor,
                      opacity: 0.5,
                      marginLeft: "24px",
                    }}
                  />
                  {/* Desktop: arrow */}
                  <span
                    className="hidden md:flex items-center px-2 text-lg"
                    style={{
                      color: isBreakpoint ? "var(--accent)" : investColor,
                      opacity: isBreakpoint ? 0.8 : 0.4,
                    }}
                  >
                    →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
