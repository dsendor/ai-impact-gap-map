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
    case "Heavy": return "Heavy Investment";
    case "Moderate": return "Moderate Investment";
    case "Light": return "Light Investment";
    case "Minimal/None": return "Minimal Investment";
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

export default function CAChainViz({ steps, label }: Props) {
  const sorted = [...steps].sort((a, b) => a.step - b.step);

  // Find the first breakpoint index for connector logic
  const breakIndex = sorted.findIndex((s) => s.isBreakpoint);

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

      {/* Horizontal on md+, vertical on mobile — matching FeaturedChainStory layout */}
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col md:flex-row items-stretch gap-0 min-w-0">
          {sorted.map((step, i) => {
            const investColor =
              INVESTMENT_COLORS[step.investmentLevel as InvestmentLevel] ?? "#6b7280";
            const evidenceColor =
              EVIDENCE_COLORS[step.evidenceLevel as EvidenceLevel] ?? "#6b7280";
            const isBreakPoint = breakIndex > -1 && i === breakIndex;
            // The first breakpoint step AND all steps after it are "past break"
            const isPastBreak = breakIndex > -1 && i >= breakIndex;
            // Connector before this step uses the *previous* step's context
            const prevIsPastBreak = breakIndex > -1 && i - 1 >= breakIndex;

            return (
              <div key={step.step} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0">
                {/* Connector before this card (not shown for first card) */}
                {i > 0 && (
                  <div className="flex items-center justify-center shrink-0">
                    {isBreakPoint ? (
                      /* Break indicator: dashed lines + lightning bolt — matches FeaturedChainStory exactly */
                      <div className="flex flex-col md:flex-row items-center gap-1 px-2 py-3 md:py-0">
                        <div className="hidden md:block relative">
                          <svg width="48" height="24" viewBox="0 0 48 24" className="text-[var(--accent)]">
                            <line x1="0" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                            <line x1="32" y1="12" x2="48" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                            <path d="M18 6 L22 18 M26 6 L30 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        {/* Mobile vertical break */}
                        <div
                          className="md:hidden w-px h-8"
                          style={{
                            background: `repeating-linear-gradient(180deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 6px)`,
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        {/* Regular arrow — matches FeaturedChainStory SVG arrow */}
                        <div className="hidden md:flex items-center px-1">
                          <svg width="20" height="12" viewBox="0 0 20 12">
                            <line
                              x1="0" y1="6" x2="14" y2="6"
                              stroke={prevIsPastBreak ? "var(--accent)" : investColor}
                              strokeWidth="1.5"
                              opacity={prevIsPastBreak ? 0.4 : 0.5}
                              strokeDasharray={prevIsPastBreak ? "3 3" : "none"}
                            />
                            <path
                              d="M13 2 L18 6 L13 10"
                              stroke={prevIsPastBreak ? "var(--accent)" : investColor}
                              strokeWidth="1.5"
                              fill="none"
                              opacity={prevIsPastBreak ? 0.4 : 0.5}
                            />
                          </svg>
                        </div>
                        {/* Mobile vertical line */}
                        <div className="md:hidden flex justify-center">
                          <div
                            className="w-px h-5"
                            style={{
                              background: prevIsPastBreak ? "var(--accent)" : investColor,
                              opacity: prevIsPastBreak ? 0.4 : 0.3,
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step card — matches FeaturedChainStory renderStepCard */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    className="rounded-lg p-4 h-full"
                    style={{
                      background: "var(--surface)",
                      border: `1px solid ${isPastBreak && step.isBreakpoint ? "var(--accent)" : "var(--border)"}`,
                      borderLeftWidth: isPastBreak && step.isBreakpoint ? "2px" : undefined,
                      borderLeftColor: isPastBreak && step.isBreakpoint ? "var(--accent)" : undefined,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    {/* Step number + investment label row — matches FeaturedChainStory */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                        style={{
                          color: investColor,
                          fontFamily: "var(--font-mono)",
                          border: `1.5px ${step.isBreakpoint ? "dashed" : "solid"} ${investColor}`,
                        }}
                      >
                        {step.step}
                      </div>
                      <span
                        className="text-[10px] tracking-wider uppercase"
                        style={{ fontFamily: "var(--font-mono)", color: investColor }}
                      >
                        {labelInvestment(step.investmentLevel)}
                      </span>
                    </div>

                    {/* Step name */}
                    <p className="text-sm leading-tight mb-2" style={{ color: "var(--foreground)" }}>
                      {step.name}
                    </p>

                    {/* Evidence badge */}
                    <div className="flex flex-wrap gap-x-2 text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
                      <span style={{ color: evidenceColor }}>
                        {labelEvidence(step.evidenceLevel)}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
