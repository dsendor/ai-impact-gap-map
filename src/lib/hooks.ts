"use client";

import { useMemo } from "react";
import type {
  TheoryOfChange,
  Claim,
  ClaimWithContext,
  ExportData,
  FilterState,
  Domain,
  Type,
} from "./types";

/**
 * Flatten claims from theories into ClaimWithContext[] by joining
 * with parent ToC's domain and type.
 */
export function flattenClaims(theories: TheoryOfChange[]): ClaimWithContext[] {
  const claims: ClaimWithContext[] = [];
  for (const toc of theories) {
    if (!toc.claims || toc.claims.length === 0) continue;
    for (const claim of toc.claims) {
      claims.push({
        ...claim,
        domain: toc.domain,
        type: toc.type,
        tocName: toc.name,
        tocId: toc.id,
      });
    }
  }
  return claims;
}

/**
 * Get claims for a specific ToC, sorted by step.
 */
export function useClaimsByToc(
  theories: TheoryOfChange[],
  tocId: string | null
): Claim[] {
  return useMemo(() => {
    if (!tocId) return [];
    const toc = theories.find((t) => t.id === tocId);
    if (!toc || !toc.claims) return [];
    return [...toc.claims].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
  }, [theories, tocId]);
}

/**
 * Compute SVG path data for connecting claims within each ToC chain.
 * Returns an array of { tocId, tocName, domain, type, path: [x,y][] }
 */
export function useChainPaths(
  claims: ClaimWithContext[],
  getX: (claim: ClaimWithContext) => number,
  getY: (claim: ClaimWithContext) => number
): { tocId: string; tocName: string; domain: Domain; type: Type; points: [number, number][] }[] {
  return useMemo(() => {
    // Group claims by tocId
    const grouped = new Map<string, ClaimWithContext[]>();
    for (const claim of claims) {
      const group = grouped.get(claim.tocId) || [];
      group.push(claim);
      grouped.set(claim.tocId, group);
    }

    const chains: {
      tocId: string;
      tocName: string;
      domain: Domain;
      type: Type;
      points: [number, number][];
    }[] = [];

    for (const [tocId, tocClaims] of grouped) {
      if (tocClaims.length < 2) continue;
      const sorted = [...tocClaims].sort(
        (a, b) => (a.step ?? 0) - (b.step ?? 0)
      );
      const points: [number, number][] = sorted.map((c) => [getX(c), getY(c)]);
      chains.push({
        tocId,
        tocName: sorted[0].tocName,
        domain: sorted[0].domain,
        type: sorted[0].type,
        points,
      });
    }

    return chains;
  }, [claims, getX, getY]);
}

/**
 * Filter theories and their flattened claims by FilterState.
 */
export function useFilteredData(
  theories: TheoryOfChange[],
  filters: FilterState
): { theories: TheoryOfChange[]; claims: ClaimWithContext[] } {
  return useMemo(() => {
    const filteredTheories = theories.filter(
      (t) =>
        filters.domains.includes(t.domain) &&
        filters.types.includes(t.type) &&
        filters.gapTypes.includes(t.primaryGapType) &&
        filters.evidenceLevels.includes(t.weakestEvidenceLevel)
    );

    const claims = flattenClaims(filteredTheories);
    return { theories: filteredTheories, claims };
  }, [theories, filters]);
}

/**
 * Check if data has claim-level information.
 */
export function hasClaims(theories: TheoryOfChange[]): boolean {
  return theories.some((t) => t.claims && t.claims.length > 0);
}
