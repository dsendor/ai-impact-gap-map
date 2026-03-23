"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import {
  sankey,
  sankeyLinkHorizontal,
  SankeyNode,
  SankeyLink,
} from "d3-sankey";
import type { TheoryOfChange, InvestmentLevel, ImpactScale } from "@/lib/types";
import { INVESTMENT_COLORS, IMPACT_COLORS } from "@/lib/constants";
import { flattenClaims } from "@/lib/hooks";

const MARGIN = { top: 20, right: 160, bottom: 20, left: 160 };

const INVESTMENT_LEVELS: InvestmentLevel[] = [
  "Heavy",
  "Moderate",
  "Light",
  "Minimal/None",
];

const IMPACT_SCALES: ImpactScale[] = [
  "Transformational",
  "Large",
  "Moderate",
  "Small",
];

interface SankeyNodeExtra {
  name: string;
  color: string;
  side: "left" | "right";
}

interface SankeyLinkExtra {
  value: number;
}

type SNode = SankeyNode<SankeyNodeExtra, SankeyLinkExtra>;
type SLink = SankeyLink<SankeyNodeExtra, SankeyLinkExtra>;

interface Props {
  theories: TheoryOfChange[];
  width: number;
  height: number;
}

export default function SankeyDiagram({ theories, width, height }: Props) {
  const innerWidth = Math.max(width - MARGIN.left - MARGIN.right, 100);
  const innerHeight = Math.max(height - MARGIN.top - MARGIN.bottom, 100);

  const { nodes, links } = useMemo(() => {
    // Use claim-level data if available, otherwise ToC-level
    const claims = flattenClaims(theories);
    const useClaims = claims.length > 0;

    // Count intersections
    const counts = new Map<string, number>();
    if (useClaims) {
      for (const c of claims) {
        const inv = c.investmentLevel ?? "Unknown";
        const imp = c.impactScale ?? "Moderate";
        if (inv === "Unknown") continue;
        const key = `${inv}→${imp}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    } else {
      for (const t of theories) {
        if (t.investmentLevel === "Unknown") continue;
        const key = `${t.investmentLevel}→${t.impactScale}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    // Build nodes
    const nodeList: SankeyNodeExtra[] = [
      ...INVESTMENT_LEVELS.map((l) => ({
        name: l,
        color: INVESTMENT_COLORS[l],
        side: "left" as const,
      })),
      ...IMPACT_SCALES.map((s) => ({
        name: s,
        color: IMPACT_COLORS[s],
        side: "right" as const,
      })),
    ];

    const nodeIndex = new Map<string, number>();
    nodeList.forEach((n, i) => nodeIndex.set(`${n.side}-${n.name}`, i));

    // Build links
    const linkList: { source: number; target: number; value: number }[] = [];
    for (const [key, value] of counts) {
      const [inv, imp] = key.split("→");
      const sourceIdx = nodeIndex.get(`left-${inv}`);
      const targetIdx = nodeIndex.get(`right-${imp}`);
      if (sourceIdx != null && targetIdx != null && value > 0) {
        linkList.push({ source: sourceIdx, target: targetIdx, value });
      }
    }

    return { nodes: nodeList, links: linkList };
  }, [theories]);

  const sankeyData = useMemo(() => {
    if (links.length === 0) return null;

    const generator = sankey<SankeyNodeExtra, SankeyLinkExtra>()
      .nodeWidth(16)
      .nodePadding(24)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .nodeId((((_: SankeyNodeExtra, i: number) => i) as unknown as (node: SankeyNode<SankeyNodeExtra, SankeyLinkExtra>) => string | number));

    const graph = generator({
      nodes: nodes.map((n) => ({ ...n })),
      links: links.map((l) => ({ ...l })),
    });

    return graph;
  }, [nodes, links, innerWidth, innerHeight]);

  if (width < 200 || !sankeyData) return null;

  const linkPath = sankeyLinkHorizontal<SNode, SLink>();

  return (
    <div data-testid="sankey-diagram">
      <svg width={width} height={height} role="img" aria-label="Sankey diagram showing flows from investment levels to impact scales.">
        <title>Investment to Impact Flow Diagram</title>
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* Links */}
          {sankeyData.links.map((link, i) => {
            const sourceNode = link.source as SNode;
            const targetNode = link.target as SNode;
            const path = linkPath(link as any);
            if (!path) return null;

            return (
              <path
                key={`link-${i}`}
                d={path}
                fill="none"
                stroke={sourceNode.color}
                strokeWidth={Math.max((link.width ?? 1), 2)}
                strokeOpacity={0.2}
                style={{ transition: "stroke-opacity 0.3s" }}
                onMouseEnter={(e) => {
                  (e.target as SVGPathElement).style.strokeOpacity = "0.5";
                }}
                onMouseLeave={(e) => {
                  (e.target as SVGPathElement).style.strokeOpacity = "0.2";
                }}
              >
                <title>
                  {sourceNode.name} → {targetNode.name}: {(link as any).value}
                </title>
              </path>
            );
          })}

          {/* Nodes */}
          {sankeyData.nodes.map((node, i) => {
            const n = node as SNode;
            const x0 = n.x0 ?? 0;
            const x1 = n.x1 ?? 0;
            const y0 = n.y0 ?? 0;
            const y1 = n.y1 ?? 0;
            const nodeHeight = y1 - y0;

            return (
              <g key={`node-${i}`}>
                <rect
                  x={x0}
                  y={y0}
                  width={x1 - x0}
                  height={nodeHeight}
                  fill={n.color}
                  rx={3}
                  opacity={0.9}
                />
                <text
                  x={n.side === "left" ? x0 - 8 : x1 + 8}
                  y={y0 + nodeHeight / 2}
                  dy="0.35em"
                  textAnchor={n.side === "left" ? "end" : "start"}
                  fill="var(--foreground)"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  fontWeight={500}
                >
                  {n.name}
                </text>
                <text
                  x={n.side === "left" ? x0 - 8 : x1 + 8}
                  y={y0 + nodeHeight / 2 + 16}
                  dy="0.35em"
                  textAnchor={n.side === "left" ? "end" : "start"}
                  fill="var(--muted)"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                >
                  {(n.value ?? 0)} {flattenClaims(theories).length > 0 ? "steps" : "ToCs"}
                </text>
              </g>
            );
          })}
        </Group>
      </svg>
    </div>
  );
}
