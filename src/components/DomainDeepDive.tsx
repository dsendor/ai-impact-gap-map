"use client";

import { useState, useMemo } from "react";
import type { TheoryOfChange, Domain, InvestmentLevel } from "@/lib/types";
import { DOMAIN_COLORS, INVESTMENT_COLORS, ALL_DOMAINS } from "@/lib/constants";
import { opportunityScore } from "@/lib/utils";
import { flattenClaims } from "@/lib/hooks";

interface Props {
  theories: TheoryOfChange[];
}

const INVESTMENT_ORDER: InvestmentLevel[] = [
  "Heavy",
  "Moderate",
  "Light",
  "Minimal/None",
  "Unknown",
];

export default function DomainDeepDive({ theories }: Props) {
  const [activeDomain, setActiveDomain] = useState<Domain>("Healthcare");

  const domainData = useMemo(() => {
    const map = new Map<Domain, TheoryOfChange[]>();
    theories.forEach((t) => {
      if (!map.has(t.domain)) map.set(t.domain, []);
      map.get(t.domain)!.push(t);
    });

    return ALL_DOMAINS.map((domain) => {
      const items = map.get(domain) ?? [];
      const sorted = [...items].sort(
        (a, b) => opportunityScore(b) - opportunityScore(a)
      );
      const top3 = sorted.slice(0, 3);
      const transformational = items.filter(
        (t) => t.impactScale === "Transformational"
      ).length;
      const claims = flattenClaims(items);
      const gapClaims = claims.filter((c) => c.isGap);
      const investmentDist: Partial<Record<InvestmentLevel, number>> = {};
      items.forEach((t) => {
        investmentDist[t.investmentLevel] =
          (investmentDist[t.investmentLevel] ?? 0) + 1;
      });

      return {
        domain,
        items,
        top3,
        transformational,
        claims,
        gapClaims,
        investmentDist,
      };
    });
  }, [theories]);

  const active = domainData.find((d) => d.domain === activeDomain);

  return (
    <div>
      <h2
        className="text-2xl md:text-3xl font-normal text-[var(--foreground)] mb-6"
        style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
      >
        Domain Deep Dive
      </h2>

      {/* Domain tabs */}
      <div className="flex flex-wrap gap-0 mb-6 border-b border-[var(--border)]">
        {ALL_DOMAINS.map((domain) => {
          const isActive = domain === activeDomain;
          const color = DOMAIN_COLORS[domain];
          const count = domainData.find((d) => d.domain === domain)?.items.length ?? 0;
          return (
            <button
              key={domain}
              data-testid="domain-tab"
              onClick={() => setActiveDomain(domain)}
              className={`px-4 py-2.5 text-xs uppercase tracking-wide transition-all border-b-2 ${
                isActive
                  ? "border-current"
                  : "border-transparent hover:border-[var(--border-bright)]"
              }`}
              style={{
                fontFamily: "var(--font-mono)",
                color: isActive ? color : "var(--muted)",
                backgroundColor: "transparent",
              }}
            >
              {domain}
              <sup
                className="ml-1 opacity-50"
                style={{ fontFamily: "var(--font-mono)", fontSize: "9px" }}
              >
                {count}
              </sup>
            </button>
          );
        })}
      </div>

      {/* Active domain content */}
      {active && active.items.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Theories of Change"
              value={active.items.length}
              color={DOMAIN_COLORS[activeDomain]}
            />
            <StatCard
              label="Causal Claims"
              value={active.claims.length}
              color={DOMAIN_COLORS[activeDomain]}
            />
            <StatCard
              label="Investment Gaps"
              value={active.gapClaims.length}
              color="#ef4444"
            />
            <StatCard
              label="Transformational"
              value={active.transformational}
              color="#c084fc"
            />
          </div>

          {/* Investment distribution */}
          <div className="mb-6">
            <p
              className="text-[10px] text-[var(--muted)] uppercase tracking-wide mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Investment Distribution
            </p>
            <div className="flex rounded-sm overflow-hidden h-3 mb-2">
              {INVESTMENT_ORDER.map((level) => {
                const count = active.investmentDist[level] ?? 0;
                if (!count) return null;
                return (
                  <div
                    key={level}
                    title={`${level}: ${count}`}
                    style={{
                      width: `${(count / active.items.length) * 100}%`,
                      backgroundColor: INVESTMENT_COLORS[level],
                    }}
                  />
                );
              })}
            </div>
            <div className="flex gap-4 flex-wrap">
              {INVESTMENT_ORDER.filter(
                (l) => (active.investmentDist[l] ?? 0) > 0
              ).map((l) => (
                <span
                  key={l}
                  className="flex items-center gap-1 text-[10px] text-[var(--muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: INVESTMENT_COLORS[l] }}
                  />
                  {l}: {active.investmentDist[l]}
                </span>
              ))}
            </div>
          </div>

          {/* Top 3 opportunities */}
          <div>
            <p
              className="text-[10px] text-[var(--muted)] uppercase tracking-wide mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Top Opportunities
            </p>
            <div className="space-y-3">
              {active.top3.map((toc, i) => (
                <div
                  key={toc.id}
                  className="border border-[var(--border)] rounded-xl p-4 hover:border-[var(--border-bright)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="shrink-0 text-lg font-normal"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-normal text-[var(--foreground)] leading-tight"
                        style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                      >
                        {toc.name}
                      </p>
                      <div className="flex gap-2 mt-1.5 text-[10px]">
                        <span
                          className="px-1.5 py-0.5 rounded lowercase"
                          style={{
                            fontFamily: "var(--font-mono)",
                            backgroundColor: INVESTMENT_COLORS[toc.investmentLevel] + "20",
                            color: INVESTMENT_COLORS[toc.investmentLevel],
                          }}
                        >
                          {toc.investmentLevel}
                        </span>
                        <span className="text-[var(--muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                          {toc.impactScale} impact
                        </span>
                        <span className="text-[var(--muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                          {toc.primaryGapType}
                        </span>
                      </div>
                      {toc.investableInsight && (
                        <p
                          className="text-xs text-[var(--foreground)] opacity-60 mt-2 line-clamp-2"
                          style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                        >
                          {toc.investableInsight}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {active && active.items.length === 0 && (
        <div className="text-center text-[var(--muted)] py-12 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
          No theories of change in this domain match the current filters.
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div
        className="text-2xl font-normal"
        style={{ color, fontFamily: "var(--font-mono)" }}
      >
        {value}
      </div>
      <div
        className="text-[10px] text-[var(--muted)] mt-0.5 uppercase tracking-wide"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
    </div>
  );
}
