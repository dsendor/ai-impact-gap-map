import type { Domain, Type, InvestmentLevel, EvidenceLevel, ImpactScale } from "./types";

// Warm dark-mode domain colors
export const DOMAIN_COLORS: Record<Domain, string> = {
  Healthcare: "#4B9FE5",
  Education: "#3DBF78",
  "Climate/Energy": "#E8850A",
  "Scientific Research": "#A050E0",
  "Labor/Employment": "#D9447A",
  "Cross-Domain": "#9E9080",
};

export const TYPE_COLORS: Record<Type, string> = {
  Benefit: "#6BAF7B",
  Harm: "#FF4040",
  Mitigation: "#7B9FF5",
};

export const INVESTMENT_COLORS: Record<InvestmentLevel, string> = {
  Heavy: "#5B9BD5",
  Moderate: "#7BAFCF",
  Light: "#A3C4DB",
  "Minimal/None": "#C7402D",
  Unknown: "#6B635A",
};

export const EVIDENCE_COLORS: Record<EvidenceLevel, string> = {
  Strong: "#6BAF7B",
  Moderate: "#D4A843",
  Speculative: "#D4900A",
  None: "#C7402D",
};

export const IMPACT_COLORS: Record<ImpactScale, string> = {
  Transformational: "#9B7DC8",
  Large: "#6BAF7B",
  Moderate: "#D4A843",
  Small: "#8E8578",
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
  Moderate: 13,
  Speculative: 8,
  None: 4,
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

export const ALL_INVESTMENT_LEVELS: InvestmentLevel[] = [
  "Heavy",
  "Moderate",
  "Light",
  "Minimal/None",
  "Unknown",
];

export const ALL_IMPACT_SCALES: ImpactScale[] = [
  "Transformational",
  "Large",
  "Moderate",
  "Small",
];
