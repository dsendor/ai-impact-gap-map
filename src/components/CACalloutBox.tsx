"use client";

interface Props {
  stat: string;
  text: string;
  accent?: boolean;
}

export default function CACalloutBox({ stat, text, accent = false }: Props) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-3"
      style={{
        background: "var(--surface)",
        border: `1px solid ${accent ? "var(--accent)" : "var(--border-bright)"}`,
      }}
    >
      <span
        className="text-3xl md:text-4xl font-normal"
        style={{
          fontFamily: "var(--font-display, serif)",
          color: accent ? "var(--accent)" : "var(--foreground)",
        }}
      >
        {stat}
      </span>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {text}
      </p>
    </div>
  );
}
