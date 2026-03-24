"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { TheoryOfChange } from "@/lib/types";
import { opportunityScore } from "@/lib/utils";
import { DOMAIN_COLORS } from "@/lib/constants";

interface Props {
  theories: TheoryOfChange[];
}

export default function CallToAction({ theories }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const topInsights = useMemo(() => {
    return [...theories]
      .filter((t) => t.investableInsight && t.investableInsight.length > 0)
      .sort((a, b) => opportunityScore(b) - opportunityScore(a))
      .slice(0, 3);
  }, [theories]);

  return (
    <div ref={ref}>
      {/* Headline */}
      <motion.h2
        className="text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-4 text-center"
        style={{ fontFamily: "var(--font-display, serif)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span style={{ color: "var(--foreground)" }}>AI works.</span>{" "}
        <span style={{ color: "var(--accent)" }}>
          But not yet for the people who need it most.
        </span>
      </motion.h2>

      <motion.p
        className="text-center text-sm mb-12 max-w-2xl mx-auto"
        style={{ color: "var(--muted)" }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        These are the highest-opportunity chains where philanthropic capital could bridge the gap.
      </motion.p>

      {/* Top 3 investable insights */}
      <div className="grid gap-4 md:grid-cols-3 mb-12">
        {topInsights.map((toc, i) => (
          <motion.div
            key={toc.id}
            className="p-5 rounded-lg"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              opacity: isInView ? 1 : 0,
              transform: isInView ? "none" : "translateY(15px)",
              transition: `opacity 0.5s ease ${0.2 + i * 0.15}s, transform 0.5s ease ${0.2 + i * 0.15}s`,
            }}
          >
            {/* Domain badge */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: DOMAIN_COLORS[toc.domain] }}
              />
              <span
                className="text-[10px] tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
              >
                {toc.domain}
              </span>
            </div>

            {/* Theory name */}
            <h4
              className="text-base mb-3 leading-tight"
              style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
            >
              {toc.name}
            </h4>

            {/* Investable insight */}
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {toc.investableInsight}
            </p>

            {/* Score */}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <span
                className="text-[10px] tracking-wider uppercase"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
              >
                Opportunity Score: {opportunityScore(toc).toFixed(1)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Anchor to card grid */}
      <div className="text-center">
        <button
          onClick={() =>
            document.getElementById("all-theories")?.scrollIntoView({ behavior: "smooth" })
          }
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border transition-all cursor-pointer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            background: "var(--surface)",
            borderColor: "var(--accent)",
            color: "var(--accent)",
          }}
        >
          Explore All Theories ↓
        </button>
      </div>
    </div>
  );
}
