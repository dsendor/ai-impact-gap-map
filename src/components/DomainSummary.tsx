"use client";

import { useMemo } from "react";
import type { TheoryOfChange, Domain, InvestmentLevel } from "@/lib/types";
import { DOMAIN_COLORS, INVESTMENT_COLORS } from "@/lib/constants";
import { opportunityScore } from "@/lib/utils";

interface Props {
  tocs: TheoryOfChange[];
}

const INVESTMENT_ORDER: InvestmentLevel[] = [
  "Heavy",
  "Moderate",
  "Light",
  "Minimal/None",
  "Unknown",
];

export default function DomainSummary({ tocs }: Props) {
  const domains = useMemo(() => {
    const map = new Map<Domain, TheoryOfChange[]>();
    tocs.forEach((t) => {
      if (!map.has(t.domain)) map.set(t.domain, []);
      map.get(t.domain)!.push(t);
    });

    return Array.from(map.entries()).map(([domain, items]) => {
      const best = [...items].sort(
        (a, b) => opportunityScore(b) - opportunityScore(a)
      )[0];
      const transformational = items.filter(
        (t) => t.impactScale === "Transformational"
      ).length;
      const investmentDist: Partial<Record<InvestmentLevel, number>> = {};
      items.forEach((t) => {
        investmentDist[t.investmentLevel] =
          (investmentDist[t.investmentLevel] ?? 0) + 1;
      });
      return { domain, items, best, transformational, investmentDist };
    });
  }, [tocs]);

  return (
    <div>
      <h2
        className="text-xl font-semibold text-[var(--foreground)] mb-5"
        style={{ fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)" }}
      >
        By Domain
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {domains.map(({ domain, items, best, transformational, investmentDist }) => {
          const color = DOMAIN_COLORS[domain];
          const total = items.length;
          return (
            <div
              key={domain}
              data-testid="domain-tab"
              className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden"
            >
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: color }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="font-semibold text-sm"
                    style={{ color }}
                  >
                    {domain}
                  </h3>
                  <span className="text-xs text-[var(--muted)]">{total} ToCs</span>
                </div>

                {/* Investment distribution bar */}
                <div className="flex rounded-full overflow-hidden h-2 mb-3">
                  {INVESTMENT_ORDER.map((level) => {
                    const count = investmentDist[level] ?? 0;
                    if (!count) return null;
                    return (
                      <div
                        key={level}
                        title={`${level}: ${count}`}
                        style={{
                          width: `${(count / total) * 100}%`,
                          backgroundColor: INVESTMENT_COLORS[level],
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex gap-3 text-xs text-[var(--muted)] mb-3 flex-wrap">
                  {INVESTMENT_ORDER.filter(
                    (l) => (investmentDist[l] ?? 0) > 0
                  ).map((l) => (
                    <span key={l}>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: INVESTMENT_COLORS[l] }}
                      />
                      {l}: {investmentDist[l]}
                    </span>
                  ))}
                </div>

                {transformational > 0 && (
                  <p className="text-xs font-medium mb-2" style={{ color: "#c084fc" }}>
                    {transformational} transformational-scale{" "}
                    {transformational === 1 ? "opportunity" : "opportunities"}
                  </p>
                )}

                {best && (
                  <div className="border-t border-[var(--border)] pt-3">
                    <p className="text-xs text-[var(--muted)] mb-0.5">Top opportunity</p>
                    <p className="text-xs font-medium text-[var(--foreground)] leading-snug">
                      {best.name}
                    </p>
                    {best.investmentCase && (
                      <p className="text-xs text-[var(--foreground)] opacity-50 mt-0.5 line-clamp-2">
                        {best.investmentCase}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
