"use client";

import CAChainViz from "./CAChainViz";
import type { CAStep } from "./CAChainViz";

interface Props {
  benefitChain: CAStep[];
  harmChain: CAStep[];
}

export default function CADualChainViz({ benefitChain, harmChain }: Props) {
  return (
    <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
      {/* Benefit chain */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderTop: "2px solid #6BAF7B",
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#6BAF7B" }}
          />
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "#6BAF7B" }}
          >
            The Benefit Chain
          </span>
        </div>
        <CAChainViz steps={benefitChain} />
      </div>

      {/* Harm chain */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderTop: "2px solid var(--accent)",
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
          >
            The Harm Chain
          </span>
        </div>
        <CAChainViz steps={harmChain} />
      </div>
    </div>
  );
}
