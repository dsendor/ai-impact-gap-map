"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import type { TheoryOfChange, InvestmentLevel } from "@/lib/types";
import { INVESTMENT_COLORS } from "@/lib/constants";

interface Props {
  theories: TheoryOfChange[];
}

const INVEST_NUMERIC: Record<InvestmentLevel, number> = {
  Heavy: 4,
  Moderate: 3,
  Light: 2,
  "Minimal/None": 1,
  Unknown: 0,
};

export default function BreakdownPattern({ theories }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  // Only theories with claims
  const chainsWithClaims = useMemo(
    () => theories.filter((t) => {
      if (!t.claims || t.claims.length < 2) return false;
      return t.claims.some(c => c.investmentLevel && c.investmentLevel !== 'Unknown');
    }),
    [theories]
  );

  // Max steps across all chains
  const maxSteps = useMemo(
    () => Math.max(...chainsWithClaims.map((t) => t.claims.length), 0),
    [chainsWithClaims]
  );

  // Average investment by step position
  const avgByStep = useMemo(() => {
    const buckets: number[][] = [];
    for (let i = 0; i < maxSteps; i++) buckets.push([]);
    for (const t of chainsWithClaims) {
      const sorted = [...t.claims].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
      sorted.forEach((c, i) => {
        if (i < maxSteps && c.investmentLevel) {
          buckets[i].push(INVEST_NUMERIC[c.investmentLevel as InvestmentLevel] ?? 0);
        }
      });
    }
    return buckets.map((b) =>
      b.length > 0 ? b.reduce((a, v) => a + v, 0) / b.length : 0
    );
  }, [chainsWithClaims, maxSteps]);

  // Count downstream breaks
  const breakCount = useMemo(() => {
    let count = 0;
    for (const t of chainsWithClaims) {
      const sorted = [...t.claims].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
      if (sorted.slice(1).some((c) => c.isGap)) count++;
    }
    return count;
  }, [chainsWithClaims]);

  const barMax = 4;

  return (
    <div ref={containerRef}>
      {/* Small-multiples heatmap */}
      <div className="mb-10">
        <div className="space-y-px">
          {chainsWithClaims.map((toc, rowIdx) => {
            const sorted = [...toc.claims].sort(
              (a, b) => (a.step ?? 0) - (b.step ?? 0)
            );
            return (
              <motion.div
                key={toc.id}
                className="flex items-center gap-2"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "none" : "translateX(-10px)",
                  transition: `opacity 0.3s ease ${rowIdx * 0.03}s, transform 0.3s ease ${rowIdx * 0.03}s`,
                }}
              >
                {/* Theory name (truncated) */}
                <div
                  className="shrink-0 text-[10px] text-right truncate"
                  style={{
                    width: "180px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted)",
                  }}
                  title={toc.name}
                >
                  {toc.name}
                </div>

                {/* Colored cells */}
                <div className="flex gap-px flex-1">
                  {sorted.map((claim, colIdx) => {
                    const level = (claim.investmentLevel ?? "Unknown") as InvestmentLevel;
                    const color = INVESTMENT_COLORS[level] ?? "#6B635A";
                    return (
                      <div
                        key={claim.id}
                        className="h-5 rounded-sm flex-1"
                        style={{
                          backgroundColor: color,
                          opacity: 0.85,
                          maxWidth: "60px",
                        }}
                        title={`Step ${claim.step}: ${level}`}
                      />
                    );
                  })}
                  {/* Fill remaining slots with empty */}
                  {Array.from({ length: Math.max(0, maxSteps - sorted.length) }).map(
                    (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="h-5 rounded-sm flex-1"
                        style={{
                          backgroundColor: "var(--surface)",
                          maxWidth: "60px",
                        }}
                      />
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 ml-[196px]">
          {(["Heavy", "Moderate", "Light", "Minimal/None"] as InvestmentLevel[]).map(
            (level) => (
              <div key={level} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: INVESTMENT_COLORS[level] }}
                />
                <span
                  className="text-[10px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                >
                  {level}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Average Investment by Step bar chart */}
      <div className="p-5 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h4
          className="text-sm mb-4 tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          Average Investment by Step Position
        </h4>
        <div className="space-y-3">
          {avgByStep.map((avg, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="text-[10px] w-12 text-right shrink-0"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
              >
                Step {i + 1}
              </span>
              <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ background: "var(--background)" }}>
                <motion.div
                  className="h-full rounded-sm"
                  style={{
                    background: `linear-gradient(90deg, ${INVESTMENT_COLORS.Heavy}, ${avg < 2 ? INVESTMENT_COLORS["Minimal/None"] : INVESTMENT_COLORS.Moderate})`,
                    width: isInView ? `${(avg / barMax) * 100}%` : "0%",
                    transition: `width 0.8s ease ${0.3 + i * 0.1}s`,
                  }}
                />
              </div>
              <span
                className="text-[10px] w-8 shrink-0"
                style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}
              >
                {avg.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stat */}
      <motion.p
        className="mt-6 text-center text-lg"
        style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
      >
        <span style={{ color: "var(--accent)" }}>{breakCount} of {chainsWithClaims.length}</span> chains break downstream.
      </motion.p>
    </div>
  );
}
