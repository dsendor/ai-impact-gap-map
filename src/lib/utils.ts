import type { TheoryOfChange, ImpactScale, InvestmentLevel, EvidenceLevel } from "./types";

const impactMap: Record<ImpactScale, number> = {
  Transformational: 4,
  Large: 3,
  Moderate: 2,
  Small: 1,
};

const investMap: Record<InvestmentLevel, number> = {
  "Minimal/None": 4,
  Light: 3,
  Unknown: 2,
  Moderate: 1,
  Heavy: 0,
};

const evidenceMap: Record<EvidenceLevel, number> = {
  Strong: 3,
  Moderate: 2,
  Speculative: 1,
  None: 0,
};

export function opportunityScore(toc: TheoryOfChange): number {
  return (
    impactMap[toc.impactScale] * 2 +
    investMap[toc.investmentLevel] * 1.5 +
    evidenceMap[toc.weakestEvidenceLevel]
  );
}

// Deterministic jitter seeded from string
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  // Normalize to [0, 1]
  return (Math.abs(hash) % 1000) / 1000;
}

export function jitter(seed: string, range = 0.3): number {
  return seededRandom(seed) * range - range / 2;
}

export function investmentToX(level: InvestmentLevel): number {
  const map: Record<InvestmentLevel, number> = {
    Unknown: 0,
    "Minimal/None": 1,
    Light: 2,
    Moderate: 3,
    Heavy: 4,
  };
  return map[level];
}

export function impactToY(scale: ImpactScale): number {
  return impactMap[scale];
}

export function exportToCsv(tocs: TheoryOfChange[]): void {
  const hasClaims = tocs.some((t) => t.claims && t.claims.length > 0);

  if (hasClaims) {
    // Claim-level export
    const headers = [
      "Theory of Change",
      "Domain",
      "Type",
      "Step",
      "Claim",
      "Evidence Level",
      "Investment Level",
      "Impact Scale",
      "Gap Type",
      "Is Gap",
      "Time Horizon",
      "Key Evidence",
      "Investment Notes",
      "Value If We Stop Here",
    ];

    const rows: string[][] = [];
    for (const t of tocs) {
      if (!t.claims?.length) continue;
      for (const c of t.claims) {
        rows.push([
          `"${t.name.replace(/"/g, '""')}"`,
          t.domain,
          t.type,
          String(c.step ?? ""),
          `"${(c.name ?? "").replace(/"/g, '""')}"`,
          c.evidenceLevel ?? "",
          c.investmentLevel ?? "",
          c.impactScale ?? "",
          c.gapType ?? "",
          c.isGap ? "Yes" : "No",
          c.timeHorizon ?? "",
          `"${(c.keyEvidence ?? "").replace(/"/g, '""')}"`,
          `"${(c.investmentNotes ?? "").replace(/"/g, '""')}"`,
          `"${(c.valueIfWeStopHere ?? "").replace(/"/g, '""')}"`,
        ]);
      }
    }

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCsv(csv, "ai-impact-gap-map-claims.csv");
  } else {
    // ToC-level export (fallback)
    const headers = [
      "Name",
      "Domain",
      "Type",
      "Impact Scale",
      "Investment Level",
      "Evidence Level",
      "Primary Gap Type",
      "Time Horizon",
      "Investment Case",
      "Investable Insight",
    ];

    const rows = tocs.map((t) => [
      `"${t.name.replace(/"/g, '""')}"`,
      t.domain,
      t.type,
      t.impactScale,
      t.investmentLevel,
      t.weakestEvidenceLevel,
      t.primaryGapType,
      t.timeHorizon,
      `"${(t.investmentCase ?? "").replace(/"/g, '""')}"`,
      `"${(t.investableInsight ?? "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCsv(csv, "ai-impact-gap-map.csv");
  }
}

function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
