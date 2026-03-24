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

export type Persona = "impact" | "investment" | "policy";

export interface Claim {
  id: string;
  step: number | null;
  name: string;
  evidenceLevel: EvidenceLevel | null;
  investmentLevel: InvestmentLevel | null;
  impactScale: ImpactScale | null;
  valueIfWeStopHere: string | null;
  gapType: GapType | null;
  isGap: boolean;
  timeHorizon: TimeHorizon | null;
  keyEvidence: string;
  investmentNotes: string;
  source: string | null;
  notes: string;
}

export interface ClaimWithContext extends Claim {
  domain: Domain;
  type: Type;
  tocName: string;
  tocId: string;
}

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
  dagPage?: string | null;
  dagPageUrl?: string | null;
  reviewStatus?: ReviewStatus;
  claims: Claim[];
}

export interface ExportData {
  meta: {
    exportedAt: string;
    tocCount: number;
    claimCount: number;
  };
  domains: Domain[];
  theories: TheoryOfChange[];
}

export interface FilterState {
  domains: Domain[];
  types: Type[];
  gapTypes: GapType[];
  evidenceLevels: EvidenceLevel[];
  persona: Persona;
}
