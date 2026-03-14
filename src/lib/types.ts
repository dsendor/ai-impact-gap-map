export type Domain =
  | "Healthcare"
  | "Education"
  | "Climate/Energy"
  | "Scientific Research"
  | "Labor/Employment"
  | "Cross-Domain";

export type Type = "Benefit" | "Harm" | "Mitigation";

export type ImpactScale = "Transformational" | "Large" | "Moderate" | "Small";

export type EvidenceLevel = "Strong" | "Moderate" | "Speculative" | "None";

export type InvestmentLevel =
  | "Heavy"
  | "Moderate"
  | "Light"
  | "Minimal/None"
  | "Unknown";

export type GapType =
  | "Needs Evidence"
  | "Needs Capital"
  | "Needs Time"
  | "Needs Evidence + Time"
  | "Needs Capital + Time"
  | "Needs Evidence + Capital"
  | "Needs Evidence + Capital + Time"
  | "Not a Gap";

export type TimeHorizon =
  | "Established"
  | "Near-term"
  | "Medium-term"
  | "Long-term";

export type ReviewStatus =
  | "Not started"
  | "In progress- promising"
  | "In progress"
  | "Done-very promising"
  | "Done";

export interface TheoryOfChange {
  id: string;
  name: string;
  domain: Domain;
  type: Type;
  impactScale: ImpactScale;
  impactEstimate: string;
  achievableImpactScale: ImpactScale;
  weakestEvidenceLevel: EvidenceLevel;
  numberOfSteps: number;
  numberOfGaps: number;
  investmentLevel: InvestmentLevel;
  investmentCase: string;
  investableInsight: string;
  primaryGapType: GapType;
  chainNarrative: string;
  keyConfounders: string;
  timeHorizon: TimeHorizon;
  dagPageUrl?: string | null;
  reviewStatus: ReviewStatus;
}

export interface FilterState {
  domains: Domain[];
  types: Type[];
  gapTypes: GapType[];
  evidenceLevels: EvidenceLevel[];
  persona: "impact" | "investment";
}
