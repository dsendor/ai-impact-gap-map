"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { useTooltip } from "@visx/tooltip";
import { curveCatmullRom } from "d3-shape";
import type {
  TheoryOfChange,
  ClaimWithContext,
  Domain,
  InvestmentLevel,
  ImpactScale,
} from "@/lib/types";
import { flattenClaims } from "@/lib/hooks";
import {
  DOMAIN_COLORS,
  TYPE_COLORS,
  EVIDENCE_SIZE,
} from "@/lib/constants";
import { jitter } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────
const MARGIN = { top: 40, right: 40, bottom: 80, left: 130 };
const INVESTMENT_LABELS: InvestmentLevel[] = [
  "Minimal/None",
  "Light",
  "Moderate",
  "Heavy",
];
const IMPACT_LABELS: ImpactScale[] = ["Small", "Moderate", "Large", "Transformational"];

// Map ordinal values to positions (1-indexed for cleaner spacing)
const INV_POS: Record<InvestmentLevel, number> = {
  "Minimal/None": 1,
  Light: 2,
  Moderate: 3,
  Heavy: 4,
  Unknown: 0.5,
};
const IMP_POS: Record<ImpactScale, number> = {
  Small: 1,
  Moderate: 2,
  Large: 3,
  Transformational: 4,
};

interface ChainScatterPlotProps {
  theories: TheoryOfChange[];
  width: number;
  height: number;
  onDotClick?: (tocId: string) => void;
}

interface TooltipData {
  name: string;
  tocName?: string;
  domain: Domain;
  investmentLevel: string;
  impactScale: string;
  evidenceLevel: string;
  step?: number | null;
  isChain?: boolean;
}

export default function ChainScatterPlot({
  theories,
  width,
  height,
  onDotClick,
}: ChainScatterPlotProps) {
  const [summaryMode, setSummaryMode] = useState(false);
  const [highlightedTocId, setHighlightedTocId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<TooltipData>();

  // Flatten claims for chain-level view
  const allClaims = useMemo(() => flattenClaims(theories), [theories]);
  const hasClaimData = allClaims.length > 0;

  // Inner dimensions
  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 100);
  const innerHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 100);

  // Scales
  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, 5],
        range: [0, innerWidth],
      }),
    [innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, 5],
        range: [innerHeight, 0],
      }),
    [innerHeight]
  );

  // Position getters for claims
  const getClaimX = useCallback(
    (c: ClaimWithContext) => {
      const base = INV_POS[c.investmentLevel ?? "Unknown"] ?? 0.5;
      return xScale(base + jitter(c.id, 0.3));
    },
    [xScale]
  );

  const getClaimY = useCallback(
    (c: ClaimWithContext) => {
      const base = IMP_POS[c.impactScale ?? "Moderate"] ?? 2;
      return yScale(base + jitter(c.id + "y", 0.3));
    },
    [yScale]
  );

  // Position getters for ToC summary dots
  const getTocX = useCallback(
    (t: TheoryOfChange) => {
      const base = INV_POS[t.investmentLevel] ?? 0.5;
      return xScale(base + jitter(t.id, 0.3));
    },
    [xScale]
  );

  const getTocY = useCallback(
    (t: TheoryOfChange) => {
      const base = IMP_POS[t.impactScale] ?? 2;
      return yScale(base + jitter(t.id + "y", 0.3));
    },
    [yScale]
  );

  // Chain paths (grouped claims by tocId)
  const chainPaths = useMemo(() => {
    if (summaryMode || !hasClaimData) return [];
    const grouped = new Map<string, ClaimWithContext[]>();
    for (const c of allClaims) {
      const g = grouped.get(c.tocId) || [];
      g.push(c);
      grouped.set(c.tocId, g);
    }
    return Array.from(grouped.entries())
      .filter(([, claims]) => claims.length >= 2)
      .map(([tocId, claims]) => {
        const sorted = [...claims].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
        return {
          tocId,
          tocName: sorted[0].tocName,
          domain: sorted[0].domain,
          points: sorted.map(
            (c) => [getClaimX(c), getClaimY(c)] as [number, number]
          ),
        };
      });
  }, [allClaims, summaryMode, hasClaimData, getClaimX, getClaimY]);

  // Show summary mode or claim mode
  const showSummary = summaryMode || !hasClaimData;

  // Opportunity zone (top-left quadrant)
  const opportunityX = xScale(0);
  const opportunityY = yScale(5);
  const opportunityW = xScale(2.5) - xScale(0);
  const opportunityH = yScale(2.5) - yScale(5);

  if (width < 200) return null;

  return (
    <div className="relative">
      {/* Toggle button */}
      {hasClaimData && (
        <div className="absolute top-2 right-2 z-10">
          <button
            data-testid="summary-toggle"
            onClick={() => {
              setSummaryMode(!summaryMode);
              setHighlightedTocId(null);
            }}
            className="px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-lg border transition-all
              bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]
              hover:bg-[var(--surface-hover)] hover:border-[var(--border-bright)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {summaryMode ? "Show Steps" : "Show Summary"}
          </button>
        </div>
      )}

      <svg
        ref={svgRef}
        width={width}
        height={height}
        role="img"
        aria-label="Scatter plot showing AI investment levels versus impact scales. Each dot represents a step in a causal chain."
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* Opportunity zone */}
          <rect
            x={opportunityX}
            y={opportunityY}
            width={opportunityW}
            height={opportunityH}
            fill="rgba(199, 64, 45, 0.08)"
            stroke="rgba(199, 64, 45, 0.35)"
            strokeDasharray="6,4"
            strokeWidth={1.5}
            rx={8}
          />
          <text
            x={opportunityX + 12}
            y={opportunityY + 20}
            fill="rgba(199, 64, 45, 0.7)"
            fontSize={11}
            fontWeight={500}
            fontFamily="var(--font-mono)"
            style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            OPPORTUNITY ZONE
          </text>

          {/* Grid */}
          <GridRows
            scale={yScale}
            width={innerWidth}
            tickValues={[1, 2, 3, 4]}
            stroke="#2E2B27"
            strokeOpacity={0.4}
          />
          <GridColumns
            scale={xScale}
            height={innerHeight}
            tickValues={[1, 2, 3, 4]}
            stroke="#2E2B27"
            strokeOpacity={0.4}
          />

          {/* Chain links (claim mode) */}
          {!showSummary &&
            chainPaths.map((chain) => (
              <LinePath
                key={`chain-${chain.tocId}`}
                data-testid="chain-link"
                data={chain.points}
                x={(d) => d[0]}
                y={(d) => d[1]}
                stroke={DOMAIN_COLORS[chain.domain]}
                strokeWidth={highlightedTocId === chain.tocId ? 2 : 1}
                strokeOpacity={
                  highlightedTocId === null
                    ? 0.2
                    : highlightedTocId === chain.tocId
                    ? 0.75
                    : 0.04
                }
                curve={curveCatmullRom}
                fill="none"
                style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
              />
            ))}

          {/* Dots */}
          {showSummary
            ? // Summary mode: one dot per ToC
              theories.map((toc) => {
                const cx = getTocX(toc);
                const cy = getTocY(toc);
                const r = EVIDENCE_SIZE[toc.weakestEvidenceLevel] ?? 10;
                return (
                  <circle
                    key={toc.id}
                    data-testid="toc-dot"
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={DOMAIN_COLORS[toc.domain]}
                    stroke={TYPE_COLORS[toc.type]}
                    strokeWidth={3}
                    fillOpacity={0.35}
                    style={{ cursor: "pointer", transition: "opacity 0.3s" }}
                    onMouseEnter={(e) => {
                      showTooltip({
                        tooltipData: {
                          name: toc.name,
                          domain: toc.domain,
                          investmentLevel: toc.investmentLevel,
                          impactScale: toc.impactScale,
                          evidenceLevel: toc.weakestEvidenceLevel,
                        },
                        tooltipLeft: e.clientX,
                        tooltipTop: e.clientY,
                      });
                    }}
                    onMouseLeave={hideTooltip}
                    onClick={() => onDotClick?.(toc.id)}
                  />
                );
              })
            : // Claim mode: one dot per claim
              allClaims.map((claim) => {
                const cx = getClaimX(claim);
                const cy = getClaimY(claim);
                const r =
                  EVIDENCE_SIZE[claim.evidenceLevel ?? "None"] ?? 7;
                const isHighlighted =
                  highlightedTocId === null ||
                  highlightedTocId === claim.tocId;
                return (
                  <circle
                    key={claim.id}
                    data-testid="claim-dot"
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={DOMAIN_COLORS[claim.domain]}
                    stroke={TYPE_COLORS[claim.type]}
                    strokeWidth={
                      highlightedTocId === claim.tocId ? 3.5 : 3
                    }
                    fillOpacity={isHighlighted ? 0.35 : 0.1}
                    strokeOpacity={isHighlighted ? 1 : 0.1}
                    style={{
                      cursor: "pointer",
                      transition: "fill-opacity 0.3s, stroke-opacity 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      setHighlightedTocId(claim.tocId);
                      showTooltip({
                        tooltipData: {
                          name: claim.name,
                          tocName: claim.tocName,
                          domain: claim.domain,
                          investmentLevel:
                            claim.investmentLevel ?? "Unknown",
                          impactScale: claim.impactScale ?? "Unknown",
                          evidenceLevel:
                            claim.evidenceLevel ?? "None",
                          step: claim.step,
                          isChain: true,
                        },
                        tooltipLeft: e.clientX,
                        tooltipTop: e.clientY,
                      });
                    }}
                    onMouseLeave={() => {
                      setHighlightedTocId(null);
                      hideTooltip();
                    }}
                    onClick={() => onDotClick?.(claim.tocId)}
                  />
                );
              })}

          {/* Axes */}
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            tickValues={[1, 2, 3, 4]}
            tickFormat={(v) => INVESTMENT_LABELS[(v as number) - 1] ?? ""}
            stroke="#2E2B27"
            tickStroke="#2E2B27"
            tickLabelProps={() => ({
              fill: "#8E8578",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              textAnchor: "middle" as const,
              dy: 4,
            })}
            label="Investment Level →"
            labelOffset={35}
            labelProps={{
              fill: "#8E8578",
              fontSize: 11,
              fontWeight: 500,
              textAnchor: "middle" as const,
            }}
          />
          <AxisLeft
            scale={yScale}
            tickValues={[1, 2, 3, 4]}
            tickFormat={(v) => IMPACT_LABELS[(v as number) - 1] ?? ""}
            stroke="#2E2B27"
            tickStroke="#2E2B27"
            tickLabelProps={() => ({
              fill: "#8E8578",
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              textAnchor: "end" as const,
              dx: -8,
            })}
            label="↑ Impact Scale"
            labelOffset={100}
            labelProps={{
              fill: "#8E8578",
              fontSize: 11,
              fontWeight: 500,
              textAnchor: "middle" as const,
            }}
          />
        </Group>
      </svg>

      {/* Tooltip — fixed position, uses clientX/Y to escape overflow:hidden */}
      {tooltipOpen && tooltipData && (
        <div
          style={{
            position: "fixed",
            left: (tooltipLeft ?? 0) + 14,
            top: (tooltipTop ?? 0) - 10,
            transform: "translateY(-100%)",
            background: "#1C1A17",
            border: "1px solid #3E3A35",
            borderRadius: 6,
            padding: "8px 12px",
            color: "var(--foreground)",
            fontSize: 12,
            maxWidth: 260,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {tooltipData.isChain && tooltipData.step != null ? (
            <>
              {tooltipData.tocName && (
                <div
                  style={{
                    fontSize: 10,
                    marginBottom: 6,
                    lineHeight: 1.3,
                    color: "#8E8578",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {tooltipData.tocName}
                </div>
              )}
              <div
                style={{
                  fontSize: 10,
                  marginBottom: 4,
                  color: "#8E8578",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Step {tooltipData.step} ·{" "}
                <span style={{ color: DOMAIN_COLORS[tooltipData.domain] }}>
                  {tooltipData.domain}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {tooltipData.name}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 10,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: DOMAIN_COLORS[tooltipData.domain],
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: DOMAIN_COLORS[tooltipData.domain] }}>
                  {tooltipData.domain}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.3,
                }}
              >
                {tooltipData.name}
              </div>
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 pt-4 mt-4"
        style={{
          borderTop: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {/* DOMAIN section */}
        <span style={{ color: "var(--accent)" }}>DOMAIN:</span>
        {Object.entries(DOMAIN_COLORS).map(([d, color]) => (
          <span key={d} className="flex items-center gap-1" style={{ color: "#8E8578" }}>
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: color }}
            />
            {d}
          </span>
        ))}

        <span style={{ color: "#8E8578" }}>|</span>

        {/* TYPE section */}
        <span style={{ color: "var(--accent)" }}>TYPE:</span>
        {Object.entries(TYPE_COLORS).map(([t, color]) => (
          <span key={t} className="flex items-center gap-1" style={{ color: "#8E8578" }}>
            <span
              className="rounded-full inline-block"
              style={{
                width: "10px",
                height: "10px",
                border: `2.5px solid ${color}`,
                backgroundColor: "rgba(142, 133, 120, 0.2)",
              }}
            />
            {t}
          </span>
        ))}

        <span style={{ color: "#8E8578" }}>|</span>

        {/* EVIDENCE section */}
        <span style={{ color: "var(--accent)" }}>EVIDENCE:</span>
        {(["Strong", "Moderate", "Speculative", "None"] as const).map((e) => (
          <span key={e} className="flex items-center gap-1" style={{ color: "#8E8578" }}>
            <span
              className="rounded-full inline-block"
              style={{
                width: EVIDENCE_SIZE[e],
                height: EVIDENCE_SIZE[e],
                backgroundColor: "#8E8578",
              }}
            />
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
