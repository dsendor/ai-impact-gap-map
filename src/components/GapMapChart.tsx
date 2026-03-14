"use client";

import { useMemo, useCallback } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TheoryOfChange } from "@/lib/types";
import { DOMAIN_COLORS, EVIDENCE_SIZE, TYPE_COLORS } from "@/lib/constants";
import { investmentToX, impactToY, jitter } from "@/lib/utils";

interface Props {
  tocs: TheoryOfChange[];
  onDotClick: (id: string) => void;
  highlightedId: string | null;
}

interface ChartPoint {
  x: number;
  y: number;
  toc: TheoryOfChange;
}

const X_LABELS: Record<number, string> = {
  0: "Unknown",
  1: "Minimal/None",
  2: "Light",
  3: "Moderate",
  4: "Heavy",
};

const Y_LABELS: Record<number, string> = {
  1: "Small",
  2: "Moderate",
  3: "Large",
  4: "Transformational",
};

function CustomDot(props: {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
  onDotClick: (id: string) => void;
  highlightedId: string | null;
}) {
  const { cx = 0, cy = 0, payload, onDotClick, highlightedId } = props;
  if (!payload) return null;
  const { toc } = payload;
  const r = EVIDENCE_SIZE[toc.weakestEvidenceLevel] / 2;
  const fill = DOMAIN_COLORS[toc.domain];
  const stroke = TYPE_COLORS[toc.type];
  const isHighlighted = highlightedId === toc.id;
  const isUnknown = toc.investmentLevel === "Unknown";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isHighlighted ? r + 3 : r}
      fill={fill}
      fillOpacity={isUnknown ? 0.3 : 0.8}
      stroke={isHighlighted ? "#1F2937" : stroke}
      strokeWidth={isHighlighted ? 3 : 2}
      style={{ cursor: "pointer", transition: "all 0.2s" }}
      onClick={() => onDotClick(toc.id)}
    />
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const { toc } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
      <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">
        {toc.name}
      </p>
      <p className="text-xs text-gray-500 mb-1">{toc.domain}</p>
      {toc.investmentCase && (
        <p className="text-xs text-gray-600 line-clamp-2">{toc.investmentCase}</p>
      )}
      <div className="flex gap-2 mt-2">
        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
          {toc.impactScale}
        </span>
        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
          {toc.investmentLevel}
        </span>
      </div>
    </div>
  );
}

export default function GapMapChart({ tocs, onDotClick, highlightedId }: Props) {
  const points = useMemo<ChartPoint[]>(() => {
    return tocs.map((toc) => ({
      x: investmentToX(toc.investmentLevel) + jitter(toc.id + "x"),
      y: impactToY(toc.impactScale) + jitter(toc.id + "y"),
      toc,
    }));
  }, [tocs]);

  const renderDot = useCallback(
    (props: object) => (
      <CustomDot
        {...(props as { cx?: number; cy?: number; payload?: ChartPoint })}
        onDotClick={onDotClick}
        highlightedId={highlightedId}
      />
    ),
    [onDotClick, highlightedId]
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">The Gap Map</h2>
          <p className="text-sm text-gray-500">
            High impact + low investment = opportunity. Click any dot to jump to its card.
          </p>
        </div>
        <Legend />
      </div>

      <div className="relative">
        {/* Opportunity zone label */}
        <div className="absolute left-[8%] top-[10%] z-10 pointer-events-none">
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
            🎯 Opportunity Zone
          </span>
        </div>

        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 60 }}>
            {/* Opportunity zone background */}
            <defs>
              <linearGradient id="opportunityZone" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(34,197,94,0.08)" />
                <stop offset="100%" stopColor="rgba(34,197,94,0.02)" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />

            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.3, 4.5]}
              tickCount={6}
              tickFormatter={(v) => X_LABELS[Math.round(v)] ?? ""}
              label={{
                value: "Current Investment Level →",
                position: "insideBottom",
                offset: -20,
                style: { fontSize: 12, fill: "#6B7280" },
              }}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />

            <YAxis
              type="number"
              dataKey="y"
              domain={[0.5, 4.5]}
              tickCount={4}
              tickFormatter={(v) => Y_LABELS[Math.round(v)] ?? ""}
              label={{
                value: "↑ Potential Impact",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fontSize: 12, fill: "#6B7280" },
              }}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Vertical divider between low/high investment */}
            <ReferenceLine
              x={2}
              stroke="#E5E7EB"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />
            {/* Horizontal divider between low/high impact */}
            <ReferenceLine
              y={2.5}
              stroke="#E5E7EB"
              strokeDasharray="6 3"
              strokeWidth={1.5}
            />

            <Scatter
              data={points}
              shape={renderDot}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="text-xs text-gray-500 space-y-1.5 text-right">
      <div className="font-medium text-gray-700 mb-2">Dot size = evidence strength</div>
      <div className="flex items-center justify-end gap-2">
        <span>Border color = type</span>
        <span className="inline-block w-3 h-3 rounded-full border-2 border-green-500 bg-gray-200" />
        <span className="inline-block w-3 h-3 rounded-full border-2 border-red-500 bg-gray-200" />
        <span className="inline-block w-3 h-3 rounded-full border-2 border-blue-500 bg-gray-200" />
      </div>
      <div className="text-gray-400">Benefit / Harm / Mitigation</div>
    </div>
  );
}
