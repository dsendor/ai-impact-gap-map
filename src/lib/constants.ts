import type { Domain, Type, InvestmentLevel, EvidenceLevel, ImpactScale } from "./types";

export const DOMAIN_COLORS: Record<Domain, string> = {
  Healthcare: "#3B82F6",
  Education: "#22C55E",
  "Climate/Energy": "#F97316",
  "Scientific Research": "#A855F7",
  "Labor/Employment": "#EAB308",
  "Cross-Domain": "#6B7280",
};

export const TYPE_COLORS: Record<Type, string> = {
  Benefit: "#22C55E",
  Harm: "#EF4444",
  Mitigation: "#3B82F6",
};

export const INVESTMENT_COLORS: Record<InvestmentLevel, string> = {
  Heavy: "#1E3A5F",
  Moderate: "#3B82F6",
  Light: "#93C5FD",
  "Minimal/None": "#EF4444",
  Unknown: "#9CA3AF",
};

export const EVIDENCE_COLORS: Record<EvidenceLevel, string> = {
  Strong: "#22C55E",
  Moderate: "#EAB308",
  Speculative: "#F97316",
  None: "#EF4444",
};

export const IMPACT_COLORS: Record<ImpactScale, string> = {
  Transformational: "#A855F7",
  Large: "#22C55E",
  Moderate: "#EAB308",
  Small: "#9CA3AF",
};

export const IMPACT_VALUES: Record<ImpactScale, number> = {
  Transformational: 4,
  Large: 3,
  Moderate: 2,
  Small: 1,
};

export const INVESTMENT_VALUES: Record<InvestmentLevel, number> = {
  Heavy: 4,
  Moderate: 3,
  Light: 2,
  "Minimal/None": 1,
  Unknown: 0,
};

export const EVIDENCE_SIZE: Record<EvidenceLevel, number> = {
  Strong: 16,
  Moderate: 12,
  Speculative: 9,
  None: 7,
};

export const ALL_DOMAINS: Domain[] = [
  "Healthcare",
  "Education",
  "Climate/Energy",
  "Scientific Research",
  "Labor/Employment",
  "Cross-Domain",
];

export const ALL_TYPES: Type[] = ["Benefit", "Harm", "Mitigation"];

export const ALL_GAP_TYPES = [
  "Needs Evidence",
  "Needs Capital",
  "Needs Time",
  "Needs Evidence + Time",
  "Needs Capital + Time",
  "Needs Evidence + Capital",
  "Needs Evidence + Capital + Time",
  "Not a Gap",
] as const;

export const ALL_EVIDENCE_LEVELS: EvidenceLevel[] = [
  "Strong",
  "Moderate",
  "Speculative",
  "None",
];
