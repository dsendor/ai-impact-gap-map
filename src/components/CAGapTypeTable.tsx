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

interface GapType {
  type: string;
  meaning: string;
  policyAction: string;
}

interface Props {
  gapTypes: GapType[];
}

export default function CAGapTypeTable({ gapTypes }: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Header row */}
      <div
        className="grid grid-cols-3 gap-px"
        style={{ background: "var(--border)" }}
      >
        {["Gap Type", "What It Means", "Policy Action"].map((h) => (
          <div
            key={h}
            className="px-4 py-3"
            style={{ background: "var(--surface)" }}
          >
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
            >
              {h}
            </span>
          </div>
        ))}
      </div>

      {/* Data rows */}
      {gapTypes.map((row, i) => {
        const color = GAP_TYPE_COLORS[row.type] ?? "#9E9080";
        return (
          <div
            key={i}
            className="grid grid-cols-3 gap-px"
            style={{ background: "var(--border)" }}
          >
            {/* Gap type cell */}
            <div
              className="px-4 py-4 flex items-start gap-2"
              style={{ background: "var(--background)" }}
            >
              <span
                className="mt-1 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)", color }}
              >
                {row.type}
              </span>
            </div>

            {/* Meaning cell */}
            <div
              className="px-4 py-4"
              style={{ background: "var(--background)" }}
            >
              <p className="text-sm leading-snug" style={{ color: "var(--muted)" }}>
                {row.meaning}
              </p>
            </div>

            {/* Policy action cell */}
            <div
              className="px-4 py-4"
              style={{ background: "var(--background)" }}
            >
              <p
                className="text-sm leading-snug"
                style={{
                  fontFamily: "var(--font-display, serif)",
                  color: "var(--foreground)",
                }}
              >
                {row.policyAction}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
