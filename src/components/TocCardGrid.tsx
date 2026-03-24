"use client";

import { useRef, useEffect } from "react";
import type { TheoryOfChange } from "@/lib/types";
import TocCard from "./TocCard";
import TocDetailPanel from "./TocDetailPanel";

interface Props {
  tocs: TheoryOfChange[];
  highlightedId: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function TocCardGrid({
  tocs,
  highlightedId,
  selectedId,
  onSelect,
}: Props) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const selectedToc = selectedId ? tocs.find((t) => t.id === selectedId) ?? null : null;

  useEffect(() => {
    if (highlightedId) {
      const el = cardRefs.current.get(highlightedId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [highlightedId]);

  return (
    <>
      {tocs.length === 0 ? (
        <div
          className="text-center text-[var(--muted)] py-20"
          style={{ fontFamily: "var(--font-display)" }}
        >
          No theories of change match the current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tocs.map((toc) => (
            <TocCard
              key={toc.id}
              ref={(el) => {
                if (el) cardRefs.current.set(toc.id, el);
                else cardRefs.current.delete(toc.id);
              }}
              toc={toc}
              highlighted={highlightedId === toc.id}
              onClick={() => onSelect(toc.id)}
            />
          ))}
        </div>
      )}

      {selectedToc && (
        <TocDetailPanel toc={selectedToc} onClose={() => onSelect(null)} />
      )}
    </>
  );
}
