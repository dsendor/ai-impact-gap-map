"use client";

import { useEffect, useRef } from "react";
import type { TheoryOfChange } from "@/lib/types";
import {
  DOMAIN_COLORS,
  INVESTMENT_COLORS,
  EVIDENCE_COLORS,
} from "@/lib/constants";
import FeaturedChainStory from "./FeaturedChainStory";

interface Props {
  toc: TheoryOfChange;
  onClose: () => void;
}

function parseConfounders(text: string) {
  if (!text) return null;
  const parts = text.split(/(CHAIN-NEGATING:[^\n.]*)/g);
  return parts.map((part, i) =>
    part.startsWith("CHAIN-NEGATING:") ? (
      <span key={i} className="font-medium" style={{ color: "var(--accent)" }}>
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

  const hasClaims = toc.claims && toc.claims.length > 0;
  const domainColor = DOMAIN_COLORS[toc.domain];
  const investmentColor = INVESTMENT_COLORS[toc.investmentLevel];
  const evidenceColor = EVIDENCE_COLORS[toc.weakestEvidenceLevel];

  return (
    <div
      data-testid="toc-detail-panel"
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-screen overflow-y-auto outline-none"
        style={{
          backgroundColor: "var(--surface)",
          borderLeft: "2px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-start justify-between gap-4"
          style={{
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <h2
              className="text-xl font-normal leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
              }}
            >
              {toc.name}
            </h2>
            {/* Structured meta line */}
            <p
              className="mt-2 text-[11px] uppercase"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.05em",
              }}
            >
              <span style={{ color: domainColor }}>{toc.domain}</span>
              <span style={{ color: "var(--muted)" }}>
                {" "}&middot; {toc.type} &middot; {toc.impactScale}
              </span>
            </p>
            <p
              className="mt-0.5 text-[10px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span style={{ color: investmentColor }}>&bull;</span>
              <span style={{ color: "var(--muted)" }}> {toc.investmentLevel}</span>
              <span style={{ color: "var(--muted)" }}> &nbsp;&middot;&nbsp; </span>
              <span style={{ color: evidenceColor }}>&bull;</span>
              <span style={{ color: "var(--muted)" }}> {toc.weakestEvidenceLevel}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 hover:opacity-100 opacity-60 transition-opacity mt-0.5"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--foreground)",
              fontSize: "24px",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Causal Chain Visualization */}
          {hasClaims && (
            <div>
              <p
                className="text-[10px] uppercase mb-3"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                }}
              >
                Causal Chain
              </p>
              <FeaturedChainStory toc={toc} compact vertical />
            </div>
          )}

          {/* Investable Insight */}
          {toc.investableInsight && (
            <div
              data-testid="investable-insight-cta"
              className="rounded-lg p-4"
              style={{
                border: "1px solid rgba(107, 175, 123, 0.3)",
                backgroundColor: "rgba(107, 175, 123, 0.05)",
              }}
            >
              <p
                className="text-[10px] uppercase mb-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: "#6BAF7B",
                }}
              >
                Investable Insight
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                }}
              >
                {toc.investableInsight}
              </p>
            </div>
          )}

          {/* Investment case */}
          {toc.investmentCase && (
            <div>
              <p
                className="text-[10px] uppercase mb-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                }}
              >
                Investment Case
              </p>
              <p
                className="text-sm leading-relaxed opacity-80"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                }}
              >
                {toc.investmentCase}
              </p>
            </div>
          )}

          {/* Chain narrative */}
          {toc.chainNarrative && (
            <div>
              <p
                className="text-[10px] uppercase mb-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                }}
              >
                Chain Narrative
              </p>
              <p
                className="text-sm leading-relaxed opacity-80"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                }}
              >
                {toc.chainNarrative}
              </p>
            </div>
          )}

          {/* Key confounders */}
          {toc.keyConfounders && (
            <div>
              <p
                className="text-[10px] uppercase mb-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                }}
              >
                Key Confounders
              </p>
              <p
                className="text-sm leading-relaxed opacity-80"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                }}
              >
                {parseConfounders(toc.keyConfounders)}
              </p>
            </div>
          )}

          {/* Meta grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <MetaItem label="Primary Gap" value={toc.primaryGapType} />
            <MetaItem label="Time Horizon" value={toc.timeHorizon} />
            <MetaItem label="Steps" value={String(toc.numberOfSteps || "\u2014")} />
            <MetaItem label="Gaps" value={String(toc.numberOfGaps || "\u2014")} />
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
            <p className="text-xs italic" style={{ color: "var(--muted)" }}>
              Even if the full chain fails, achievable impact is{" "}
              <strong>{toc.achievableImpactScale}</strong> vs. the full-chain
              potential of <strong>{toc.impactScale}</strong>.
            </p>
          )}

          {(toc.dagPageUrl || toc.dagPage) && (
            <a
              href={toc.dagPageUrl || toc.dagPage || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] uppercase hover:underline"
              style={{
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.05em",
                color: "var(--accent)",
              }}
            >
              View DAG Analysis &rarr;
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
      <p
        className="text-[10px] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
          color: "var(--muted)",
        }}
      >
        {label}
      </p>
      <p
        className="text-sm font-medium"
        style={{ color: "var(--foreground)" }}
      >
        {value || "\u2014"}
      </p>
    </div>
  );
}
