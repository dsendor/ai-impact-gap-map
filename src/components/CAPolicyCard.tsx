"use client";

const GAP_TYPE_COLORS: Record<string, string> = {
  "Needs Evidence": "#D4A843",
  "Needs Capital": "#C7402D",
  "Needs Time": "#5B9BD5",
  "Needs Evidence + Capital": "#A050E0",
  "Needs Evidence + Time": "#E8850A",
  "Needs Capital + Time": "#D9447A",
  "Needs Evidence + Capital + Time": "#C7402D",
  "Harm Unmeasured": "#D9447A",
  "Mitigation Failing": "#C7402D",
  "Measurement Gap": "#D9447A",
  "Not a Gap": "#6BAF7B",
};

interface Props {
  gapType: string;
  policyAction: string;
  estimatedCost: string;
}

export default function CAPolicyCard({ gapType, policyAction, estimatedCost }: Props) {
  const color = GAP_TYPE_COLORS[gapType] ?? "#9E9080";

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${color}`,
      }}
    >
      {/* Gap type badge */}
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color }}
        >
          {gapType}
        </span>
      </div>

      {/* Policy action */}
      <div>
        <p
          className="text-[10px] uppercase tracking-wider mb-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          Policy Action
        </p>
        <p
          className="text-base leading-snug"
          style={{ fontFamily: "var(--font-display, serif)", color: "var(--foreground)" }}
        >
          {policyAction}
        </p>
      </div>

      {/* Estimated cost */}
      <div
        className="pt-4 flex items-baseline gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          Estimated Cost:
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
        >
          {estimatedCost}
        </span>
      </div>
    </div>
  );
}
